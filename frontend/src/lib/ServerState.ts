import { writable, type Writable } from 'svelte/store';

export const ServerState: Writable<any> = writable({});
export const ProcessesState: Writable<any> = writable([]);
export const StateHistory: Writable<
	{ cpu: number; ram: number; storage: number }[]
> = writable([]);

const fetchState = async () => {
	try {
		const newState = await fetch('http://localhost:2024/update').then(
			async (res) => await res.json()
		);
		StateHistory.update((history) =>
			[
				...history,
				{
					cpu: newState.cpuInfo.load,
					ram:
						Math.round(
							(newState.ramUsage.used / newState.ramUsage.total) *
								100 *
								100
						) / 100,
					storage:
						Math.round(
							(newState.diskInfo?.reduce(
								(acc: number, disk: any) => acc + disk.used,
								0
							) /
								newState.diskInfo?.reduce(
									(acc: number, disk: any) =>
										acc + disk.total,
									0
								)) *
								100 *
								100
						) / 100,
				},
			].slice(-30)
		);
		ServerState.set(newState);
	} catch (err) {
		console.error(err);
	}
};

if (typeof window !== 'undefined') {
	fetchState();
	setInterval(fetchState, 3000);
}

const fetchProcesses = async () => {
	try {
		const processes = await fetch('http://localhost:2024/processes').then(
			async (res) => await res.json()
		);
		ProcessesState.set(processes);
	} catch (err) {
		console.error(err);
	}
};

if (typeof window !== 'undefined') {
	fetchProcesses();
	setInterval(fetchProcesses, 8000);
}
