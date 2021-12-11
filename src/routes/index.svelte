<script context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ page, fetch, session, stuff }) {
		const { data } = await fetch('/api/activities');
		console.log(session);
		return {
		};
	}
</script>

<script>
	import { page, session } from '$app/stores';
</script> 

	{#if !$session.access_token}
		<a href="/api/auth/">Login</a>
	{:else}
		<h1> 
		Hi {$session.access_token}
		</h1>
	{/if}
