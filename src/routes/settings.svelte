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

<div class="flex w-full justify-center mb-5">
	<div class="w-1/8" />
	<div class="w-1/2 pt-10">
		<form class="shadow-md dark:bg-gray-700 bg-gray-100 rounded px-8 pb-8 pt-8 mb-4">
			<div class="mb-4">
				<label class="block text-sm font-bold mb-2" for="lat"> Latitude </label>
				<input
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
					id="lat"
					type="text"
					value={settings.lat}
					disabled
				/>
			</div>
			<div class="mb-4">
				<label class="block text-sm font-bold mb-2" for="lng"> Longitude </label>
				<input
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
					id="lng"
					type="text"
					value={settings.lng}
					disabled
				/>
			</div>
			<div class="mb-4">
				<label class="block text-sm font-bold mb-2" for="activityType"> Activity Type</label>
				<input
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
					id="activityType"
					type="text"
					value={settings.activityType}
					disabled
				/>
			</div>
			<div class="mb-4">
				<label class="block text-sm font-bold mb-2" for="startDate">Start Date</label>
				<input
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
					id="startDate"
					type="text"
					value={settings.startDate}
					disabled
				/>
			</div>
			<div class="mb-4">
				<label class="block text-sm font-bold mb-2" for="startDate">End Date</label>
				<input
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
					id="endDate"
					type="text"
					value={settings.endDate}
					disabled
				/>
			</div>
			<div class="flex items-center justify-between">
				<button class="bg-blue-500 text-white font-bold py-2 px-4 rounded " type="button" disabled>
					Save
				</button>
			</div>
		</form>
	</div>
</div>
