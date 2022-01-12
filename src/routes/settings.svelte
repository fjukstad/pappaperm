<script context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ page, fetch, session, stuff }) {
		let settings = session.settings;
		return {
			props: { settings }
		};
	}
</script>

<script>
	export let settings;
</script>

Map latitude: {settings.lat} <br />
Map Longitude: {settings.lng} <br />
Acivity Type: {settings.activityType} <br />
Start date: {settings.startDate} <br />
End date: {settings.endDate} <br />
