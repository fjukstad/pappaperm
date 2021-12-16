const STRAVA_CLIENT_ID = import.meta.env.VITE_STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = import.meta.env.VITE_STRAVA_CLIENT_SECRET;
const STRAVA_REDIRECT_URI = import.meta.env.VITE_STRAVA_REDIRECT_URI;
const STRAVA_SCOPES = import.meta.env.VITE_STRAVA_SCOPES;
/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export async function get({ query }) {
	const refresh_token = query.get('code');
	if (!refresh_token) {
		return {
			body: JSON.stringify({ error: 'No refresh token found.' }),
			status: 500
		};
	}

	const body = {
		client_id: STRAVA_CLIENT_ID,
		client_secret: STRAVA_CLIENT_SECRET,
		grant_type: 'refresh_token',
		redirect_uri: STRAVA_REDIRECT_URI,
		refresh_token: refresh_token,
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
			body: JSON.stringify({ error: response.error }),
			status: 500
		};
	}

	const expiresAt = new Date(response.expires_at * 1000);

	return {
		headers: {
			'set-cookie': [
				`access_token=${
					response.access_token
				}; Path=/; HttpOnly; expires='${expiresAt.toUTCString()}`,
				`refresh_token=${response.refresh_token}; Path=/; HttpOnly;`
			],
			Location: '/'
		},
		status: 302
	};
}
