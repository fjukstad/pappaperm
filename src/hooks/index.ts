import * as cookie from 'cookie';

export async function handle({ request, resolve }) {
	const cookies = cookie.parse(request.headers.cookie || '');
	if (cookies.access_token) {
		request.locals.access_token = cookies.access_token;
	}
	if (cookies.refresh_token) {
		request.locals.refresh_token = cookies.refresh_token;
	}
	if (cookies.athlete && cookies.athlete !== 'undefined') {
		request.locals.athlete = JSON.parse(decodeURIComponent(cookies.athlete));
	}
	if (cookies.settings) {
		request.locals.settings = JSON.parse(decodeURIComponent(cookies.settings));
	}
	// Missing settings create a default one
	if (!cookies.settings || cookies.settings == 'undefined') {
		// lat lng defaults to Bodø, Norway
		request.locals.settings = {
			lat: 67.271,
			lng: 14.44,
			activityType: 'Walk',
			startDate: '12-08-2021',
			endDate: '03-28-2022'
		};
	}

	return await resolve(request);
}

export function getSession({ locals }) {
	return {
		access_token: locals.access_token,
		refresh_token: locals.refresh_token,
		athlete: locals.athlete,
		settings: locals.settings
	};
}
