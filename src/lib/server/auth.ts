import db from './database';
import type { User } from '$lib/types';
import { env } from '$env/dynamic/private';

export async function authenticateUser(token: string): Promise<User | null> {
	await db.authenticate(token);
	const user = (await db.info()) as unknown; // lib types are wrong, this function returns user object if successful, undefined otherwise
	if (typeof user === undefined) return null;
	return user as User;
}

type userToRegister = Omit<User, 'id'>;

export async function registerUser(user: userToRegister) {
	const { username, email, pass } = user;
	try {
		const token = await db.signup({
			NS: env.SURREAL_NS,
			DB: env.SURREAL_DB,
			SC: 'keeper',
			username,
			email,
			pass
		});
		return token || null;
	} catch (err) {
		console.error(err);
		throw err;
	}
}

type userToLogin = Partial<Omit<User, 'id'>>;

export async function loginUser(user: userToLogin) {
	const { username, email, pass } = user;
	if (!pass || (!username && !email))
		throw new Error('Authentication Error: missing required credentials.');
	try {
		const token = await db.signin({
			NS: env.SURREAL_NS,
			DB: env.SURREAL_DB,
			SC: 'keeper',
			username,
			email,
			pass
		});
		return token || null;
	} catch (err) {
		console.error(err);
		throw err;
	}
}
