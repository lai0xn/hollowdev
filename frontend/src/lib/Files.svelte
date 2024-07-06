<script lang="ts">
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import File from './File.svelte';
	import { ReplyAllSolid, UploadSolid } from 'flowbite-svelte-icons';
	import { writable } from 'svelte/store';
	import { onMount } from 'svelte';

	const location = writable('/');
	let files: any[] = [];
	let breadcrumb: { name: string; fullPath: string }[] = [];

	location.subscribe(refresh);
	onMount(() => {
		const interval = setInterval(refresh, 10000);
		return clearInterval(interval);
	});

	function refresh() {
		fetch(`http://localhost:2024/files?path=${$location}`).then((res) =>
			res.json().then((data) => {
				files = data;
			})
		);
		// slices at slashes without a preceding backslash (negative lookbehind)
		const split = $location.split(/(?<!\\)\//).slice(1);
		breadcrumb = [];
		let acc = '';
		for (const name of split) {
			acc += '/' + name;
			breadcrumb.push({ name, fullPath: acc });
		}
	}
</script>

<Breadcrumb solid>
	<BreadcrumbItem home>
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<span on:click={() => location.set('/')} class="cursor-pointer">
			Root
		</span></BreadcrumbItem
	>
	{#each breadcrumb as item}
		<BreadcrumbItem>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<span
				on:click={() => location.set(item.fullPath)}
				class="cursor-pointer hover:text-primary-700 dark:hover:text-gray-200"
			>
				{item.name}
			</span>
		</BreadcrumbItem>
	{/each}
</Breadcrumb>

<main
	class="my-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 relative pb-24"
>
	{#if files.length === 0}
		<div class="py-12 text-center text-gray-500 dark:text-gray-400">
			No files in this directory
		</div>
	{/if}
	{#each files as file}
		<File
			{file}
			setLocation={() => location.set(file.fullPath)}
			{refresh}
		/>
	{/each}
	<div class="absolute bottom-4 right-4 flex gap-3">
		<button on:click={refresh}>
			<ReplyAllSolid
				class="h-12 w-12 p-2 bg-primary-700 text-gray-700 dark:text-gray-300 rounded-xl"
			/>
		</button>
		<UploadSolid
			class="h-12 w-12 p-2 bg-primary-700 text-gray-700 dark:text-gray-300 rounded-xl"
		/>
	</div>
</main>

<!-- <div class="mt-8 flex justify-center">
	<ButtonGroup>
		<Button>one</Button>
		<Button>two</Button>
		<Button>three</Button>
	</ButtonGroup>
</div> -->
