export async function get({params, locals}){

		const after = "1638918000"
		const url = "https://www.strava.com/api/v3/athlete/activities?per_page=100&after="+after

	let activities = await fetch(url, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + locals.access_token
			}
		})
		.then(response => response.json())

		// remove all non walk activities
		for(let i = 0; i < activities.length; i++){
				const activity = activities[i]
				if(activity.type != "Walk"){
				    console.log("removing activity: " + activity.name)
					activities.splice(i, 1)
					console.log(activities.length);
				}
		}

		return {
				body: activities
		}
}	