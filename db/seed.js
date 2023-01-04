import { readdirSync, readFileSync } from 'fs';
import path from 'path';
import Surreal from 'surrealdb.js';

const db = new Surreal('http://127.0.0.1:8000/rpc');

const DB_DIR = `${path.resolve()}/db`;

async function setupValidationTables() {
	const queryFilenames = readdirSync(`${DB_DIR}/validation`);
	const queryFilePaths = queryFilenames.map((file) => `${DB_DIR}/validation/${file}`);

	try {
		await db.signin({ user: 'root', pass: 'root' });
		await db.use('dev', 'dev');
		for (const file of queryFilePaths) {
			console.log('Querying:', file);
			const query = readFileSync(file, 'utf-8');
			await db.query(query);
		}
	} catch (e) {
		console.error(e);
	}
	console.log('Validation tables added!');
}

setupValidationTables().then(() => db.close());
