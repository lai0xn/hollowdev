<script lang="ts">
	import Usage from './Dashboard/Usage.svelte';
	import Chart from './Dashboard/Chart.svelte';
	import Processes from './Dashboard/Processes.svelte';
</script>

<main class="grid grid-cols-0 md:grid-cols-1 lg:grid-cols-2 gap-4 p-4 w-full">
	<Usage />
	<Chart />
	<Processes />
</main>
