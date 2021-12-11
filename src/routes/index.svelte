<script context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ page, fetch, session, stuff }) {
		if(!session.access_token){
				return { redirect: "/api/auth/", status: 302 } 
		}
		const response = await fetch('/api/activities')
		const activities = await response.json();
		let totalTime = 0;
		let totalDistance = 0;
		for(const activity of activities){
				const time = activity.elapsed_time;
				const distance = activity.distance;
				totalTime += time;
				totalDistance += distance;
		}
		let stats = {
					totalTime: totalTime,
					totalDistance: totalDistance
					}

		return {
			props: { activities, stats }
		};
	}
</script>

<script>
	import { page, session } from '$app/stores';
	export let activities;
	export let stats;
</script> 

<h2> Total time : {stats.totalTime} seconds </h2>
<h2> Total distance : {stats.totalDistance} meters </h2>

