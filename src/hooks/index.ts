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
		try {
			request.locals.athlete = JSON.parse(cookies.athlete);
		} catch (e) {
			console.log('Could not parse athlete');
			console.log('Cookies:', cookies.athlete);
			console.log(e);
			request.locals.athlete = null;
		}
	}
	return await resolve(request);
}

export function getSession({ locals }) {
	return {
		access_token: locals.access_token,
		refresh_token: locals.refresh_token,
		athlete: locals.athlete
	};
}
