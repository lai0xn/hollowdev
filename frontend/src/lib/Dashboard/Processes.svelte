<script lang="ts">
	import { ProcessesState } from '$lib/ServerState';
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
	<Heading class="text-lg">Top Processes:</Heading>
	<Hr hrClass="my-3" />
    <Table>
        <TableHead>
            <TableHeadCell>PID</TableHeadCell>
            <TableHeadCell>name</TableHeadCell>
            <TableHeadCell>Memory</TableHeadCell>
            <TableHeadCell>CPU</TableHeadCell>
            <TableHeadCell>User</TableHeadCell>
        </TableHead>
        <TableBody>
            {#each $ProcessesState as process}
                <TableBodyRow>
                    <TableBodyCell>{process.pid}</TableBodyCell>
                    <TableBodyCell>{process.name}</TableBodyCell>
                    <TableBodyCell>{byteToString(process.mem*1e9)}</TableBodyCell>
                    <TableBodyCell>{Math.round(process.cpu*100)/100}%</TableBodyCell>
                    <TableBodyCell>{process.user}</TableBodyCell>
                </TableBodyRow>
            {/each}
        </TableBody>
    </Table>
</Card>
