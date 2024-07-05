import express from 'express';
import cors from 'cors';
import os from 'os';
import si from 'systeminformation';

const app = express();
app.use(express.json());

app.use(cors());

// everything is in bytes
app.get('/update', async (_, res) => {
	try {
		const cpuLoad = await si.currentLoad();
		const cpuInfo = {
			load: Math.round(cpuLoad.currentLoad * 10) / 10,
			cores: os.cpus().length,
			speed: os.cpus()[0].speed,
			model: os.cpus()[0].model,
		};

		const ramUsage = {
			total: os.totalmem(),
			free: os.freemem(),
			used: os.totalmem() - os.freemem(),
		};

		const diskUsage = await si.fsSize();
		const diskInfo = diskUsage.map((disk) => ({
			fs: disk.fs,
			total: disk.size,
			used: disk.used,
			free: disk.size - disk.used,
		}));

		const diskSpeed = await si.disksIO();
		const diskReadWriteSpeed = {
			read: diskSpeed.rIO,
			write: diskSpeed.wIO,
		};

		const networkSpeed = await si.networkStats();
		const networkInfo = {
			interface: networkSpeed[0].iface,
			latency: await si.inetLatency(),
			download: networkSpeed[0].rx_sec ?? 0,
			upload: networkSpeed[0].tx_sec ?? 0,
		};

		const uptime = os.uptime();

		const temperature = (await si.cpuTemperature()).main;

		const data = {
			cpuInfo,
			ramUsage,
			diskInfo,
			diskReadWriteSpeed,
			networkInfo,
			temperature,
			uptime,
		};

		res.json(data);
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

app.get('/processes', async (_, res) => {
	try {
		const processes = await si.processes();
		const mergedProcesses = mergeProcessesByName(processes.list);
		const topProcesses = mergedProcesses
			.sort((a, b) => b.cpu - a.cpu)
			.slice(0, 10);
		res.json(topProcesses);
	} catch (error) {
		console.error('Error:', error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
});

function mergeProcessesByName(processes: any[]) {
	const mergedProcesses = [];
	const processMap = new Map();
	for (const process of processes) {
		const { name, cpu } = process;
		if (processMap.has(name)) {
			const existingProcess = processMap.get(name);
			existingProcess.cpu += cpu;
		} else {
			processMap.set(name, process);
		}
	}
	for (const process of processMap.values()) {
		mergedProcesses.push(process);
	}
	return mergedProcesses;
}

//console commands

import { spawn } from 'child_process';
let shell: any;
let outputBuffer = '';

app.post('/console/execute', (req, res) => {
	if (!shell) {
		shell = spawn('bash');
		shell.stdout.on('data', (data: any) => {
			outputBuffer += data.toString();
		});
		shell.stderr.on('data', (data: any) => {
			outputBuffer += data.toString();
		});
	}

	shell.stdin.write(req.body.command + '\n');
	res.json({ status: 'command received' });
});

app.get('/console/output', (req, res) => {
	res.json({ output: outputBuffer });
	outputBuffer = '';
});

app.listen(2024, () => {
	console.log('Server is running on http://localhost:2024');
});
