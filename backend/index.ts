import express, { response } from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';

import type { Request, Response } from 'express';
import type { UploadedFile } from 'express-fileupload';

import db from './database';

const app = express();

app.use(bodyParser.json());
app.use(fileUpload());
app.use(cors());

app.get('/files', (req: Request, res: Response) => {
	db.all('SELECT * FROM files', [], (err: any, rows: any) => {
		if (err) {
			res.status(500).send(err.message);
		} else {
			// console.log(rows);
			res.send(rows);
		}
	});
});

app.get('/file/:id', (req: Request, res: Response) => {
	const id: number = parseInt(req.params.id);
	db.get('SELECT * FROM files WHERE id = ?', [id], (err: any, row: any) => {
		if (err) {
			res.status(500).send(err.message);
		} else if (!row) {
			res.status(404).send('File not found');
		} else {
			res.send(row);
		}
	});
});

app.delete('/delete/:id', (req: Request, res: Response) => {
	const id: number = parseInt(req.params.id);
	db.get('SELECT * FROM files WHERE id = ?', [id], (err: any, row: any) => {
		if (err) {
			res.status(500).send(err.message);
		} else if (!row) {
			res.status(404).send('File not found');
		} else {
			const location: string = path.join(__dirname, 'files', row.name);
			db.run('DELETE FROM files WHERE id = ?', [id], (err: any) => {
				if (err) {
					res.status(500).send(err.message);
				} else {
					fs.unlink(location, (err: any) => {
						if (err) {
							res.status(500).send(err.message);
						} else {
							res.sendStatus(204).send('File deleted');
						}
					});
				}
			});
		}
	});
});

app.patch('/rename/:id', (req: Request, res: Response) => {
	const id: number = parseInt(req.params.id);
	const newName: string = req.body.newName;
	db.get('SELECT * FROM files WHERE id = ?', [id], (err: any, row: any) => {
		if (err) {
			res.status(500).send(err.message);
		} else if (!row) {
			res.status(404).send('File not found');
		} else {
			const normalizedName =
				newName +
				(newName.match(/\./) ? '' : row.name.match(/\.\w+$/) ?? '');
			const oldLocation: string = path.join(__dirname, 'files', row.name);
			const newLocation: string = path.join(
				__dirname,
				'files',
				normalizedName
			);
			fs.rename(oldLocation, newLocation, (err: any) => {
				if (err) {
					res.status(500).send(err.message);
				} else {
					db.run(
						'UPDATE files SET name = ? WHERE id = ?',
						[normalizedName, id],
						(err: any) => {
							if (err) {
								res.status(500).send(err.message);
							} else {
								res.sendStatus(200).send('File renamed');
							}
						}
					);
				}
			});
		}
	});
});

app.patch('/description/:id', (req: Request, res: Response) => {
	const id: number = parseInt(req.params.id);
	const newDescription: string = req.body.newDescription;
	db.get('SELECT * FROM files WHERE id = ?', [id], (err: any, row: any) => {
		if (err) {
			res.status(500).send(err.message);
		} else if (!row) {
			res.status(404).send('File not found');
		} else {
			db.run(
				'UPDATE files SET description = ? WHERE id = ?',
				[newDescription, id],
				(err: any) => {
					if (err) {
						res.status(500).send(err.message);
					} else {
						res.sendStatus(200).send('Description updated');
					}
				}
			);
		}
	});
});

app.get('/download/:id', (req: Request, res: Response) => {
	const id: number = parseInt(req.params.id);
	db.get('SELECT * FROM files WHERE id = ?', [id], (err: any, row: any) => {
		if (err) {
			res.status(500).send(err.message);
		} else if (!row) {
			res.status(404).send('File not found');
		} else {
			const location: string = path.join(__dirname, 'files', row.name);
			res.download(location, row.name);
		}
	});
});

interface UploadRequest extends Request {
	files: {
		file: UploadedFile;
	};
}

app.post('/upload', async (req: UploadRequest, res: Response | any) => {
	const file: UploadedFile = req.files?.file;
	const name: string =
		req.body.name +
		(req.body.name.match(/\./)
			? ''
			: file.name.match(/\.\w+$/)?.at(-1) ?? '');
	const description: string = req.body.description;
	const size: number = file?.size;
	const mimetype: string = file.mimetype;
	const location: string = path.join(__dirname, 'files', name);

	const moveFile = (file: UploadedFile, location: string): Promise<void> => {
		return new Promise((resolve, reject) => {
			file.mv(location, (err: Error) => {
				if (err) reject(err);
				else resolve();
			});
		});
	};

	const insertIntoDB = (
		name: string,
		description: string,
		size: number,
		mimetype: string
	): Promise<number> => {
		return new Promise((resolve, reject) => {
			db.run(
				'INSERT INTO files (name, description, size, mimetype) VALUES (?, ?, ?, ?)',
				[name, description, size, mimetype],
				function (this: { lastID: number }, err: Error | null) {
					if (err) reject(err);
					else resolve(this.lastID);
				}
			);
		});
	};

	try {
		if (
			typeof file == 'undefined' ||
			typeof description == 'undefined' ||
			typeof name == 'undefined'
		) {
			res.status(400).send('file, name and description required');
			return;
		}
		file.name = name;
		await moveFile(file, location);
		const id: number = await insertIntoDB(
			name,
			description,
			size,
			mimetype
		);
		res.status(201).json({ id, name });
	} catch (error: any) {
		console.error(error);
		// console.log({ file, name, description, size, mimetype, location });
		res.status(500).send(error.message);
		return;
	}
});

const PORT = process.env.PORT || 4321;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
