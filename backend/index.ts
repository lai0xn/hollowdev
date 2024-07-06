import express from 'express';
import cors from 'cors';
import os from 'os';
import si from 'systeminformation';
import bodyParser from 'body-parser';

const app = express();
app.use(express.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
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
			.filter((p) => p.name != 'ps')
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
	const command = req.body.command;
	if (!command) {
		return res
			.status(400)
			.json({ status: 'error', message: 'Command is required' });
	}

	if (!shell) {
		shell = spawn('bash');
		shell.stdout.on('data', (data: any) => {
			outputBuffer += data.toString();
		});
		shell.stderr.on('data', (data: any) => {
			outputBuffer += data.toString();
		});
	}

	try {
		shell.stdin.write(command + '\n');
	} catch {
		shell = spawn('bash');
		shell.stdout.on('data', (data: any) => {
			outputBuffer += data.toString();
		});
		shell.stderr.on('data', (data: any) => {
			outputBuffer += data.toString();
		});
	}
	res.json({ status: 'command received' });
});

app.get('/console/output', (req, res) => {
	res.json({ output: outputBuffer });
	outputBuffer = '';
});

// file explorer
import fs from 'fs/promises';
import Path from 'path';
import archiver from 'archiver';

app.get('/files', async (req, res) => {
	const path = req.query.path as string;
	if (!path) {
		res.status(400).json({ status: 'error', message: 'Path is required' });
		return;
	}

	const repoExists = await fs
		.access(path)
		.then(() => true)
		.catch(() => false);

	if (!repoExists) {
		res.status(404).json({
			status: 'error',
			message: 'Repository does not exist',
		});
		return;
	}

	const files = [];
	try {
		const fileNames = await fs.readdir(path);
		for (const fileName of fileNames) {
			const fullPath = Path.join(path, fileName);
			const stat = await fs.stat(fullPath);
			const isDirectory = stat.isDirectory();
			const size = stat.size;
			const extension = Path.extname(fileName);
			const isHidden = fileName.startsWith('.');
			const lastModified = stat.mtimeMs;

			files.push({
				name: fileName,
				isDirectory,
				fullPath,
				size,
				extension,
				isHidden,
				lastModified,
			});
		}
	} catch (error) {
		console.error('Error:', error);
	}

	res.json(files);
});

app.post('/files/rename', (req, res) => {
	const { fullPath, newName } = req.body;

	if (!fullPath || !newName) {
		res.status(400).json({ status: 'error', message: 'Invalid request' });
		return;
	}

	fs.rename(fullPath, Path.join(Path.dirname(fullPath), newName))
		.then(() => {
			res.json({ status: 'success' });
		})
		.catch((error) => {
			console.error('Error:', error);
			res.status(500).json({
				status: 'error',
				message: 'Internal Server Error',
			});
		});
});

app.delete('/files', (req, res) => {
	const fullPath = req.query.path as string;

	if (!fullPath) {
		res.status(400).json({ status: 'error', message: 'Invalid request' });
		return;
	}

	fs.rm(fullPath, { recursive: true, force: true })
		.then(() => {
			res.json({ status: 'success' });
		})
		.catch((error) => {
			console.error('Error:', error);
			res.status(500).json({
				status: 'error',
				message: 'Internal Server Error',
			});
		});
});

app.get('/files/download', async (req, res) => {
	const fullPath = req.query.path as string;

	if (!fullPath) {
		res.status(400).json({ status: 'error', message: 'Invalid request' });
		return;
	}

	const stat = await fs.stat(fullPath).catch(() => {
		res.status(404).send('file not found');
	});
	if (!stat) return;

	if (stat.isDirectory()) {
		const archive = archiver('zip', { zlib: { level: 9 } }); // Sets the compression level. // file is not saved just in memory
		const zipFileName = `${
			Path.basename(fullPath) ?? 'archive'
		}-${Date.now()}.zip`;

		res.setHeader('Content-Type', 'application/zip');
		res.setHeader(
			'Content-Disposition',
			`attachment; filename="${zipFileName}"`
		);

		archive.directory(fullPath, false);
		archive.finalize();

		archive.pipe(res);
	} else {
		res.download(fullPath);
	}
});

app.listen(2024, () => {
	console.log('Server is running on http://localhost:2024');
});
