<script lang="ts">
	import Actions from '$lib/Actions.svelte';
	import Console from '$lib/Console.svelte';
	import Dashboard from '$lib/Dashboard.svelte';
	import Files from '$lib/Files.svelte';
	import {
		Navbar,
		DarkMode,
		NavBrand,
		Tabs,
		TabItem,
		Button,
	} from 'flowbite-svelte';
</script>

<Navbar class="border-b border-gray-300 py-4">
	<NavBrand href="/" class="text-xl">Server Monitor</NavBrand>
	<div class="flex gap-5">
        <DarkMode class="text-md border border-gray-300 dark:border-gray-700" />
		<Button class="px-8">Exit</Button>
	</div>
</Navbar>

<Tabs tabStyle="underline">
	<TabItem title="Dashboard" open>
		<Dashboard />
	</TabItem>
	<TabItem title="&nbsp; Files &nbsp;">
		<Files />
	</TabItem>
	<TabItem title="&nbsp;Console&nbsp;">
		<Console />
	</TabItem>
	<TabItem title="&nbsp;Actions&nbsp;" disabled>
		<Actions />
	</TabItem>
	<TabItem title="&nbsp;Settings&nbsp;" disabled>
	</TabItem>
</Tabs>
