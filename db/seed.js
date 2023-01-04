import { readdirSync } from 'fs';
import path from 'path';

const serverDir = path.resolve();
const pwd = `${serverDir}/db`;

function setupValidationTables() {
	const DIR = `${pwd}/validation`;
	try {
		const files = readdirSync(DIR);
		const validationfiles = files.map((file) => `${DIR}/${file}`);
		validationfiles.forEach((filename) => {
			console.log(filename);
		});
	} catch (err) {
		console.log('Error creating validation tables!');
		console.error(err);
	}
}

setupValidationTables();
