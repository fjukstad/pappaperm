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
//convert totaltime to hours, minutes, seconds

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

<h1> Stats: Bjørns Pappaperm</h1>
<h2> Har trilla {Math.floor(stats.totalTime/3600)} timer og
{Math.floor((stats.totalTime%3600) / 60)} minutter. Dette fordelt på {Math.floor(stats.totalDistance/1000)} km</h2>

