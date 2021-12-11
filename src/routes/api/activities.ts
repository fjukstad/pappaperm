export async function get({params, locals}){

const url = "https://www.strava.com/api/v3/athlete/activities?per_page=30"

const activities = await fetch(url, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + locals.access_token
			}
		})
		.then(response => response.json())

		return {
				body: activities
		}
}	
