<script context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ page, fetch, session, stuff }) {
		// missing both access and refresh tokens, login and get both
		if (!session.access_token && !session.refresh_token) {
			return { redirect: '/api/auth/', status: 302 };
		}
		// got refresh token but no access token, get fresh acces token
		if (!session.access_token && session.refresh_token) {
			return { redirect: `/api/refresh?code=${session.refresh_token}`, status: 302 };
		}

		const response = await fetch('/api/activities');
		const activities = await response.json();

		let totalTime = 0;
		let totalDistance = 0;
		let totalElevation = 0;
		for (const activity of activities) {
			const time = activity.elapsed_time;
			const distance = activity.distance;
			const elevation = activity.total_elevation_gain;
			totalTime += time;
			totalDistance += distance;
			totalElevation += elevation;
		}

		let stats = {
			totalTime: totalTime,
			totalDistance: totalDistance,
			totalElevation: totalElevation
		};

		const athlete = session.athlete;

		return {
			props: { activities, stats, athlete }
		};
	}
</script>

<script>
	export let activities;
	export let stats;
	export let athlete;

	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import Layout from './__layout.svelte';
	onMount(async () => {
		if (browser) {
			const leaflet = await import('leaflet');
			await import('polyline-encoded');

			var map = leaflet.map('map', { zoomControl: false }).setView([67.275, 14.44], 13);
			leaflet
				.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
					maxZoom: 18
				})
				.addTo(map);
			for (const activity of activities) {
				var coordinates = leaflet.Polyline.fromEncoded(activity.map.summary_polyline).getLatLngs();

				var polyline = leaflet
					.polyline(coordinates, {
						color: 'red',
						weight: 5,
						opacity: 0.2,
						lineJoin: 'round'
					})
					.addTo(map);
			}
		}
	});
</script>

<div class="flex w-full text-right p-2 dark:bg-gray-700 bg-gray-100">
	<div class="w-1">
		<a href="/">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
				/>
			</svg>
		</a>
	</div>
	<div class="grow">
		{#if athlete}
			<p>
				Hei {athlete.firstname}!
			</p>
		{/if}
	</div>
</div>

<div class="flex w-full justify-center mb-5">
	<div class="w-1/5" />
	<div class="grow pt-5">
		<table class="table-auto w-full">
			<tbody class="divide-y divide-gray-300">
				<tr>
					<td>Turer</td>
					<td class="text-right">
						{activities.length}
					</td>
				</tr>
				<tr>
					<td>Tid</td>
					<td class="text-right">
						{Math.floor(stats.totalTime / 3600)} timer og
						{Math.floor((stats.totalTime % 3600) / 60)} minutter
					</td>
				</tr>
				<tr>
					<td> Distanse</td>
					<td class="text-right"> {Math.ceil(stats.totalDistance / 1000)} km</td>
				</tr>
				<tr>
					<td> Høydemeter </td>
					<td class="text-right"> {stats.totalElevation} m</td>
				</tr>
			</tbody>
		</table>
	</div>
	<div class="w-1/5" />
</div>

<div class="h-full w-full">
	<div id="map" />
</div>

<style>
	#map {
		height: 100%;
		width: 100%;
		position: absolute;
	}
</style>
