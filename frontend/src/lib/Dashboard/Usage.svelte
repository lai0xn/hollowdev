<script lang="ts">
	import { ServerState } from '$lib/ServerState';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Card,
		Heading,
		Hr,
	} from 'flowbite-svelte';

	import { byteToString } from '$lib/Utils';
</script>

<Card class="p-4 w-full max-w-full">
	<Heading class="text-lg">Usage:</Heading>
	<Hr hrClass="my-3" />

	<Table>
		<TableHead>
			<TableHeadCell class="w-[25%] whitespace-normal">CPU</TableHeadCell>
			<TableHeadCell class="w-[25%] whitespace-normal"
				>CPU Load</TableHeadCell
			>
			<TableHeadCell class="w-[25%] whitespace-normal"
				>CPU Cores</TableHeadCell
			>
			<TableHeadCell class="w-[25%] whitespace-normal"
				>CPU Speed</TableHeadCell
			>
		</TableHead>
		<TableBody>
			<TableBodyRow>
				<TableBodyCell class="w-[25%] whitespace-normal">
					{$ServerState.cpuInfo?.model ?? 'N/A'}
				</TableBodyCell>
				<TableBodyCell class="w-[25%] whitespace-normal">
					{$ServerState.cpuInfo?.load
						? $ServerState.cpuInfo?.load + '%'
						: 'N/A'}
				</TableBodyCell>
				<TableBodyCell class="w-[25%] whitespace-normal">
					{$ServerState.cpuInfo?.cores
						? $ServerState.cpuInfo?.cores + ' core'
						: 'N/A'}
				</TableBodyCell>
				<TableBodyCell class="w-[25%] whitespace-normal">
					{$ServerState.cpuInfo?.speed
						? $ServerState.cpuInfo?.speed + ' MHz'
						: 'N/A'}
				</TableBodyCell>
			</TableBodyRow>
		</TableBody>
	</Table>

	<Table>
		<TableHead>
			<TableHeadCell class="w-[25%] whitespace-normal">Disk</TableHeadCell
			>
			<TableHeadCell class="w-[25%] whitespace-normal"
				>Total</TableHeadCell
			>
			<TableHeadCell class="w-[25%] whitespace-normal">Used</TableHeadCell
			>
			<TableHeadCell class="w-[25%] whitespace-normal">Free</TableHeadCell
			>
		</TableHead>
		<TableBody>
			{#if $ServerState.diskInfo?.length > 0}
				{#each $ServerState.diskInfo as disk}
					<TableBodyRow>
						<TableBodyCell class="w-[25%] whitespace-normal"
							>{disk.fs}</TableBodyCell
						>
						<TableBodyCell class="w-[25%] whitespace-normal"
							>{byteToString(disk.total)}</TableBodyCell
						>
						<TableBodyCell class="w-[25%] whitespace-normal"
							>{byteToString(disk.used)}</TableBodyCell
						>
						<TableBodyCell class="w-[25%] whitespace-normal"
							>{byteToString(disk.free)}</TableBodyCell
						>
					</TableBodyRow>
				{/each}
			{:else}
				<TableBodyRow>
					<TableBodyCell class="w-[25%] whitespace-normal"
						>N/A</TableBodyCell
					>
					<TableBodyCell class="w-[25%] whitespace-normal"
						>N/A</TableBodyCell
					>
					<TableBodyCell class="w-[25%] whitespace-normal"
						>N/A</TableBodyCell
					>
					<TableBodyCell class="w-[25%] whitespace-normal"
						>N/A</TableBodyCell
					>
				</TableBodyRow>
			{/if}
		</TableBody>
	</Table>

	<Hr hrClass="my-3" />

	<Table>
		<TableHead>
			<TableHeadCell class="w-[25%] whitespace-normal"
				>Memory</TableHeadCell
			>
			<TableHeadCell class="w-[25%] whitespace-normal"
				>Total</TableHeadCell
			>
			<TableHeadCell class="w-[25%] whitespace-normal">Used</TableHeadCell
			>
			<TableHeadCell class="w-[25%] whitespace-normal">Free</TableHeadCell
			>
		</TableHead>
		<TableBody>
			<TableBodyRow>
				<TableBodyCell class="w-[25%] whitespace-normal"
					>RAM</TableBodyCell
				>
				<TableBodyCell class="w-[25%] whitespace-normal">
					{$ServerState.ramUsage?.total
						? byteToString($ServerState.ramUsage.total)
						: 'N/A'}
				</TableBodyCell>
				<TableBodyCell class="w-[25%] whitespace-normal">
					{$ServerState.ramUsage?.used
						? byteToString($ServerState.ramUsage.used)
						: 'N/A'}
				</TableBodyCell>
				<TableBodyCell class="w-[25%] whitespace-normal">
					{$ServerState.ramUsage?.free
						? byteToString($ServerState.ramUsage.free)
						: 'N/A'}
				</TableBodyCell>
			</TableBodyRow>
		</TableBody>
	</Table>

	<Hr hrClass="my-3" />

	<Table>
		<TableHead>
			<TableHeadCell class="w-[25%] whitespace-normal"
				>Storage</TableHeadCell
			>
			<TableHeadCell class="w-[25%] whitespace-normal"
				>Disk Write</TableHeadCell
			>
			<TableHeadCell class="w-[25%] whitespace-normal"
				>Disk Read</TableHeadCell
			>
			<TableBodyCell class="w-[25%] whitespace-normal">-</TableBodyCell>
		</TableHead>
		<TableBody>
			<TableBodyRow>
				<TableBodyCell class="w-[25%] whitespace-normal"
				></TableBodyCell>
				<TableBodyCell class="w-[25%] whitespace-normal">
					{$ServerState.diskReadWriteSpeed?.write
						? `${byteToString($ServerState.diskReadWriteSpeed.write)}/s`
						: 'N/A'}
				</TableBodyCell>
				<TableBodyCell class="w-[25%] whitespace-normal">
					{$ServerState.diskReadWriteSpeed?.read
						? `${byteToString($ServerState.diskReadWriteSpeed.read)}/s`
						: 'N/A'}
				</TableBodyCell>
			</TableBodyRow>
		</TableBody>
	</Table>

	<Hr hrClass="my-3" />

	<Table>
		<TableHead>
			<TableHeadCell class="w-[25%] whitespace-normal"
				>Network Interface</TableHeadCell
			>
			<TableHeadCell class="w-[25%] whitespace-normal"
				>Latency</TableHeadCell
			>
			<TableHeadCell class="w-[25%] whitespace-normal"
				>Download</TableHeadCell
			>
			<TableHeadCell class="w-[25%] whitespace-normal"
				>Upload</TableHeadCell
			>
		</TableHead>
		<TableBody>
			<TableBodyRow>
				<TableBodyCell class="w-[25%] whitespace-normal">
					{$ServerState.networkInfo?.interface ?? 'N/A'}
				</TableBodyCell>
				<TableBodyCell class="w-[25%] whitespace-normal">
					{$ServerState.networkInfo?.latency
						? Math.round($ServerState.networkInfo?.latency * 100) /
								100 +
							'ms'
						: 'N/A'}
				</TableBodyCell>
				<TableBodyCell class="w-[25%] whitespace-normal">
					{$ServerState.networkInfo?.download
						? `${byteToString($ServerState.networkInfo.download)}/s`
						: 'N/A'}
				</TableBodyCell>
				<TableBodyCell class="w-[25%] whitespace-normal">
					{$ServerState.networkInfo?.upload
						? `${byteToString($ServerState.networkInfo.upload)}/s`
						: 'N/A'}
				</TableBodyCell>
			</TableBodyRow>
		</TableBody>
	</Table>

	<Hr hrClass="my-3" />

	<Table>
		<TableHead>
			<TableHeadCell class="w-[25%] whitespace-normal"
				>Uptime</TableHeadCell
			>
			<TableHeadCell class="w-[25%] whitespace-normal"
				>Temperature</TableHeadCell
			>
			<TableBodyCell class="w-[25%] whitespace-normal">-</TableBodyCell>
			<TableBodyCell class="w-[25%] whitespace-normal">-</TableBodyCell>
		</TableHead>
		<TableBody>
			<TableBodyRow>
				<TableBodyCell class="w-[25%] whitespace-normal">
					{$ServerState.uptime ?? 'N/A'}
				</TableBodyCell>
				<TableBodyCell class="w-[25%] whitespace-normal">
					{$ServerState.temperature
						? $ServerState.temperature + 'C°'
						: 'N/A'}
				</TableBodyCell>
			</TableBodyRow>
		</TableBody>
	</Table>
</Card>
