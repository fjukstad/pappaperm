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
			totalElevation: Math.floor(totalElevation)
		};

		let settings = session.settings;

		return {
			props: { activities, stats, settings }
		};
	}
</script>

<script>
	export let activities;
	export let stats;
	export let settings;

	export const daysInLeave = Math.ceil(
		(new Date().getTime() - new Date(settings.startDate).getTime()) / (1000 * 60 * 60 * 24)
	);

	export let daysUntilEndOfLeave = Math.ceil(
		(new Date(settings.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
	);

	if (daysUntilEndOfLeave < 0) {
		daysUntilEndOfLeave = 0;
	}

	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	import Layout from './__layout.svelte';
	onMount(async () => {
		if (browser) {
			const leaflet = await import('leaflet');
			await import('polyline-encoded');

			var map = leaflet
				.map('map', { zoomControl: false })
				.setView([settings.lat, settings.lng], 13);
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
						lineJoin: 'round',
						className: activity.id.toString()
					})
					// open activity in new tab on click
					.on('click', function (e) {
						window.open('https://strava.com/activities/' + e.target.options.className, '_blank');
					})
					.addTo(map);
			}
		}
	});
</script>

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
<div class="flex w-full justify-center mb-5">
	<div class="w-1/5" />
	<div class="grow pt-5">
		<table class="table-auto w-full">
			<tbody class="divide-y divide-gray-300">
				<tr>
					<td>Dager unnagjort</td>
					<td class="text-right">
						{daysInLeave}
					</td>
				</tr>
				<tr>
					<td>Dager igjen</td>
					<td class="text-right">
						{daysUntilEndOfLeave}
					</td>
				</tr>
			</tbody>
		</table>
	</div>
	<div class="w-1/5" />
</div>

<div class="h-1/3 w-full flex flex-col overflow-hidden">
	<div id="map" class="flex-1" />
</div>

<style>
	#map {
		height: 100%;
		width: 100%;
		position: absolute;
	}
</style>
