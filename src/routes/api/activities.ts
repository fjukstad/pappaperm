export async function get({params, locals}){

console.log(locals)

const url = "https://www.strava.com/api/v3/athlete/activities?per_page=30"

const data = await fetch(url, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + locals.access_token
			}
		})
		.then(response => response.json())

		console.log(data);
}
