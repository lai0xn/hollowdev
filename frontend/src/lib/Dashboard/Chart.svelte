<script lang="ts">
	import { onMount } from 'svelte';
	import { StateHistory } from '$lib/ServerState';
	import { Chart, Card, Heading, Hr } from 'flowbite-svelte';

	let radialChartOptions = {
		series: [1, 1, 1],
		colors: ['#FF1654', '#247BA0', '#70C1B3'],
		chart: {
			height: '490px',
			width: '100%',
			type: 'radialBar' as 'radialBar',
			sparkline: {
				enabled: true,
			},
		},
		plotOptions: {
			radialBar: {
				track: {
					background: '#E5E7EB',
				},
				dataLabels: {
					show: false,
				},
				hollow: {
					margin: 0,
					size: '32%',
				},
			},
		},
		grid: {
			show: false,
			strokeDashArray: 4,
			padding: {
				left: 2,
				right: 2,
				top: -23,
				bottom: -20,
			},
		},
		labels: ['CPU', 'RAM', 'Storage'],
		legend: {
			show: true,
			position: 'bottom' as 'bottom',
			fontFamily: 'Inter, sans-serif',
		},
		tooltip: {
			enabled: true,
			x: {
				show: false,
			},
		},
		yaxis: {
			show: false,
			labels: {
				formatter: (value: any) => {
					return value + '%';
				},
			},
		},
	};

	const graphChartOptions = {
		chart: {
			height: '300px',
			maxWidth: '100%',
			type: 'area' as 'area',
			fontFamily: 'Inter, sans-serif',
			dropShadow: {
				enabled: false,
			},
			toolbar: {
				show: false,
			},
		},
		tooltip: {
			enabled: true,
			x: {
				show: false,
			},
		},
		fill: {
			type: 'gradient' as 'gradient',
			gradient: {
				opacityFrom: 0.22,
				opacityTo: 0,
				shade: '#a8a8a8',
				gradientToColors: ['#6b6b6b'],
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			width: 6,
		},
		grid: {
			show: false,
			strokeDashArray: 4,
			padding: {
				left: 2,
				right: 2,
				top: 0,
			},
		},
		series: [
			{
				name: 'CPU',
				data: [4, 3, 7, 5, 1],
				color: '#FF1654',
			},
			{
				name: 'RAM',
				data: [2, 5, 3, 7, 3],
				color: '#247BA0',
			},
			{
				name: 'Storage',
				data: [1, 2, 3, 4, 5],
				color: '#70C1B3',
			},
		],
		xaxis: {
			categories: new Array(100).fill(''),
			labels: {
				show: false,
			},
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			},
		},
		yaxis: {
			show: false,
		},
	};

	onMount(() => {
		const unsubscribe = StateHistory.subscribe((data: any[]) => {
			const cpu = data.at(-1)?.cpu ?? 1;
			const ram = data.at(-1)?.ram ?? 1;
			const storage = data.at(-1)?.storage ?? 1;

			// data = [
			// 	...new Array(30 - data.length).fill({
			// 		cpu: 0,
			// 		ram: 0,
			// 		storage: 0,
			// 	}),
			// 	...data,
			// ];

			radialChartOptions.series = [cpu, ram, storage];
			graphChartOptions.series = [
				{
					name: 'CPU',
					data: data.map((v) => v.cpu),
					color: '#FF1654',
				},
				{
					name: 'RAM',
					data: data.map((v) => v.ram),
					color: '#247BA0',
				},
				{
					name: 'Storage',
					data: data.map((v) => v.storage),
					color: '#70C1B3',
				},
			];
		});

		return unsubscribe;
	});
</script>

<Card class="p-4 w-full max-w-full">
	<Heading class="text-lg">Charts:</Heading>
	<Hr hrClass="my-3" />
	<Chart options={radialChartOptions} />
	<div class="p-4">
		<Chart options={graphChartOptions} />
	</div>
</Card>

<style>
	:global(.apexcharts-legend-text) {
		color: #222 !important;
		font-size: large !important;
	}

	@media (prefers-color-scheme: dark) {
		:global(.dark .apexcharts-legend-text) {
			color: #bbb !important;
		}
	}
</style>
