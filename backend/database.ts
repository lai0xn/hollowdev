const sqlite3 = require('sqlite3').verbose();
import { Database } from 'sqlite3';

// Connect to a database (creates the file if it doesn't exist)
const db: Database = new sqlite3.Database('./files.db', (err: string) => {
	if (err) {
		console.error('Could not connect to database', err);
	} else {
		console.log('Connected to database');
	}
});

// Create a table
db.serialize(() => {
	db.run(`
        CREATE TABLE IF NOT EXISTS files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            description TEXT,
            size REAL,
            mimetype TEXT
        )
    `);
});

export { db as default};
