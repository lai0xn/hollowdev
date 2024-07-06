<script lang="ts">
	import { onMount } from 'svelte';

	let command = '';
	let output = '';
	let interval: any;

	const executeCommand = async () => {
		if (command.trim()) {
			await fetch('http://localhost:2024/console/execute', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ command }),
			});
			command = '';
		}
	};

	let textarea: HTMLElement;

	const fetchOutput = async () => {
		const res = await fetch('http://localhost:2024/console/output');
		const data = await res.json();
		if (data.output) {
			output += data.output;
			setTimeout(() => {
				textarea.scrollTop = textarea.scrollHeight;
			}, 1);
			console.log(output);
		}
	};

	onMount(() => {
		interval = setInterval(fetchOutput, 1000);
		return () => clearInterval(interval);
	});
</script>

<main
	class="p-8 border border-gray-400 rounded-xl text-gray-800 dark:text-gray-100 bg-white dark:bg-gray-900"
>
	<textarea
		class="mb-3 w-full h-full border-none text-gray-800 dark:text-gray-100 bg-transparent resize-none focus:outline-none focus:border-none font-mono"
		bind:value={output}
		bind:this={textarea}
		rows="10"
		readonly
	></textarea>
	<form on:submit|preventDefault={executeCommand} class="flex gap-2">
		<input
			class="w-full p-2 border-transparent border-b-gray-400 bg-transparent outline-none focus:border-transparent focus:outline-none"
			type="text"
			bind:value={command}
			placeholder="Type your command and press Enter"
		/>
		<button class="bg-primary-700 text-white px-4 rounded-xl" type="submit">
			Execute
		</button>
	</form>
</main>

<style>
	main {
		width: 800px;
		height: 600px;
		margin: 20px auto;
		resize: both;
		overflow: hidden;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	textarea {
		scrollbar-width: thin;
	}
</style>
