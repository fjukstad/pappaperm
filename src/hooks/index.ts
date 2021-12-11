import * as cookie from 'cookie';

export async function handle({ request, resolve }) {
	const cookies = cookie.parse(request.headers.cookie || '');
	request.locals.access_token = cookies.access_token;
	return await resolve(request);
}

export function getSession({ locals }) {
	return {
			access_token : locals.access_token
	};
}
