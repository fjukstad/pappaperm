export async function get({ params, locals }) {
	let startDate = new Date(locals.settings.startDate).getTime() / 1000;
	const url = 'https://www.strava.com/api/v3/athlete/activities?per_page=200&after=' + startDate;
	let activities = await fetch(url, {
		method: 'GET',
		headers: {
			Authorization: 'Bearer ' + locals.access_token
		}
	}).then((response) => response.json());

	let activityType = locals.settings.activityType;

	// remove all non walk activities since I use the Walking activity type
	// for strolling/jogging.
	for (let i = 0; i < activities.length; i++) {
		const activity = activities[i];
		if (activity.type != activityType) {
			activities.splice(i, 1);
			i--;
		}
	}

	return {
		body: activities
	};
}
