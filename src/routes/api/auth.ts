const STRAVA_CLIENT_ID = import.meta.env.VITE_STRAVA_CLIENT_ID;
const STRAVA_REDIRECT_URI = import.meta.env.VITE_STRAVA_REDIRECT_URI;
const STRAVA_AUTHORIZE_URI = import.meta.env.VITE_STRAVA_AUTHORIZE_URI;
const STRAVA_SCOPES = import.meta.env.VITE_STRAVA_SCOPES;
const STRAVA_ENDPOINT = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&redirect_uri=${encodeURIComponent(STRAVA_REDIRECT_URI)}&response_type=code&scope=${STRAVA_SCOPES}`;


/** @type {import('@sveltejs/kit').RequestHandler} */
export async function get() {
	return {
    headers: { Location: STRAVA_ENDPOINT },
    status: 302
  }
}
