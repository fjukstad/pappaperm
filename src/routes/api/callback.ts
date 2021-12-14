const STRAVA_CLIENT_ID = import.meta.env.VITE_STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = import.meta.env.VITE_STRAVA_CLIENT_SECRET;
const STRAVA_REDIRECT_URI = import.meta.env.VITE_STRAVA_REDIRECT_URI;
const STRAVA_SCOPES = import.meta.env.VITE_STRAVA_SCOPES;
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ query }) {
	const returnCode = query.get('code');

	const body = {
		client_id: STRAVA_CLIENT_ID,
		client_secret: STRAVA_CLIENT_SECRET,
		grant_type: 'authorization_code',
		redirect_uri: STRAVA_REDIRECT_URI,
		code: returnCode,
		scope: STRAVA_SCOPES
	};

	const request = await fetch('https://www.strava.com/oauth/token', {
		method: 'POST',
		body: new URLSearchParams(body),
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	});

	const response = await request.json();

	if (response.error) {
		console.log('😭', response.error);
		return {
			headers: { Location: '/' },
			status: 302
		};
	}

	const expiresAt = new Date(response.expires_at * 1000);

	return {
		headers: {
			'set-cookie': [
				`access_token=${
					response.access_token
				}; Path=/; HttpOnly; expires='${expiresAt.toUTCString()}`
			],
			Location: '/'
		},
		status: 302
	};
}
