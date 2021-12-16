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
		for (const activity of activities) {
			const time = activity.elapsed_time;
			const distance = activity.distance;
			totalTime += time;
			totalDistance += distance;
		}

		let stats = {
			totalTime: totalTime,
			totalDistance: totalDistance
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

<div class="">
	<p>
		Hei {athlete.firstname}!
	</p>
</div>
<div class="flex w-full justify-center mb-5 mt-2">
	<div class="w-1/2">
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
			</tbody>
		</table>
	</div>
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
