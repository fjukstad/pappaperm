<script context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ page, fetch, session, stuff }) {
		if (!session.access_token) {
			return { redirect: '/api/auth/', status: 302 };
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
		//convert totaltime to hours, minutes, seconds

		let stats = {
			totalTime: totalTime,
			totalDistance: totalDistance
		};

		return {
			props: { activities, stats }
		};
	}
</script>

<script>
	export let activities;
	export let stats;

	import { onMount } from 'svelte';
	import { browser } from '$app/env';
	onMount(async () => {
		if (browser) {
			const leaflet = await import('leaflet');
			await import('polyline-encoded');

			var map = leaflet.map('map').setView([67.275, 14.44], 13);
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
						weight: 10,
						opacity: 0.2,
						lineJoin: 'round'
					})
					.addTo(map);
			}
		}
	});
</script>

<h1>Stats</h1>
<h2>
	Har trilla {Math.floor(stats.totalTime / 3600)} timer og
	{Math.floor((stats.totalTime % 3600) / 60)} minutter fordelt på {Math.ceil(
		stats.totalDistance / 1000
	)} km
</h2>

<div id="map" />

<style>
	#map {
		height: 500px;
		width: 100%;
	}
</style>
