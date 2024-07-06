<script lang="ts">
	import { Card } from 'flowbite-svelte';
	import {
		FolderOpenSolid,
		FileSolid,
		TrashBinSolid,
		DownloadSolid,
		PenNibSolid,
	} from 'flowbite-svelte-icons';
	import { byteToString } from '$lib/Utils';

	export let file: any = {};
	export let setLocation: () => void;
	export let refresh: () => void;
</script>

<Card
	class="flex flex-row align-center gap-2 max-w-none"
	style="align-items: center"
>
	{#if file.isDirectory}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
			on:click={() => {
				if (!file.isDirectory) return;
				setLocation();
			}}
		>
			<FolderOpenSolid class="h-10 w-10 mt-1 cursor-pointer" />
		</div>
	{:else}
		<FileSolid class="h-8 w-8 mt-1" />
	{/if}
	<div class="mx-4 flex-grow">
		<div class="text-md font-medium text-gray-700 dark:text-gray-200">
			{file.name}
		</div>
		<div class="text-sm text-gray-500 dark:text-gray-400">
			{byteToString(file.size)}
		</div>
	</div>
	<button
		on:click={async () => {
			const newName = prompt(
				'enter new name for file, leave empty to cancel'
			);
			if (!newName) return;
			try {
				const response = await fetch(
					`http://localhost:2024/files/rename`,
					{
						method: 'post',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							fullPath: file.fullPath,
							newName,
						}),
					}
				);
				if (!response.ok) alert('failed to rename file to' + newName);
				refresh();
			} catch (e) {
				alert('failed to rename file to' + newName);
				console.error(e);
			}
		}}
	>
		<PenNibSolid class="h-7 w-7 hover:text-blue-500" />
	</button>
	<button
		on:click={() => {
			fetch(`http://localhost:2024/files?path=${file.fullPath}`, {
				method: 'delete',
			}).then((res) => {
				if (!res.ok) alert('failed to delete file');
				refresh();
			});
		}}
	>
		<TrashBinSolid class="h-7 w-7 hover:text-red-500" />
	</button>
	<a href="http://localhost:2024/files/download?path={file.fullPath}">
		<DownloadSolid class="h-7 w-7 hover:text-green-500" />
	</a>
</Card>
