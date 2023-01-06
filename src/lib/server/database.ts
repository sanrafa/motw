import Surreal from 'surrealdb.js';
import { env } from '$env/dynamic/private';

const db = new Surreal(env.SURREAL_URL);

db.use(env.SURREAL_NS, env.SURREAL_DB);

export default db;

export async function connectToDB() {
	await db.signin({
		user: env.SURREAL_USER,
		pass: env.SURREAL_PASS
	});

	return db;
}
