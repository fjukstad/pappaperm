<script context="module">
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ page, fetch, session, stuff }) {
		// missing both access and refresh tokens, login and get both
		if (!session.access_token && !session.refresh_token) {
			return { redirect: '/api/auth/', status: 302 };
		}
		// got refresh token but no access token, get fresh acces token
		if (!session.access_token && session.refresh_token) {
			return { redirect: `/api/refresh?code=${session.refresh_token}`, status: 302 };
		}
		// if athlete is missing we need to re-authorize the app.
		// Refresh tokens won't do.
		const athlete = session.athlete;
		if (!athlete) {
			return { redirect: '/api/auth/', status: 302 };
		}

		return {
			props: { athlete }
		};
	}
</script>

<script lang="ts">
	import '../app.css';
	export let athlete;
</script>

<main>
	<div class="flex w-full text-right p-2 dark:bg-gray-700 bg-gray-100">
		<div class="grow">
			<a href="/">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
					/>
				</svg>
			</a>
		</div>
		<div class="w-6 pr-8">
			<a href="/settings">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
					/>
				</svg>
			</a>
		</div>
		<div class="w-100">
			{#if athlete}
				<p>
					Hei {athlete.firstname}!
				</p>
			{/if}
		</div>
	</div>
	<slot />
</main>
