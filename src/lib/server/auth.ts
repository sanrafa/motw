import db, { connectToDB } from './database';
import type { User } from '$lib/types';
import { env } from '$env/dynamic/private';

type ReturnObject<T> = {
	error: boolean;
	errorInfo: {
		field: string | null;
		message: string;
	} | null;
	data?: T;
};

export async function authenticateUser(token: string): Promise<User | null> {
	await db.authenticate(token);
	const user = (await db.info()) as unknown; // lib types are wrong, this function returns user object if successful, undefined otherwise
	if (typeof user === undefined) return null;
	return user as User;
}

type userToRegister = Omit<User, 'id'>;

export async function registerUser(user: userToRegister): Promise<ReturnObject<{ token: string }>> {
	const { username, email, pass } = user;

	if (await existsUserByUsername(username)) {
		return {
			error: true,
			errorInfo: {
				field: 'username',
				message: 'That username is already in use.'
			},
			data: {
				token: ''
			}
		};
	}
	if (await existsUserByEmail(email)) {
		return {
			error: true,
			errorInfo: {
				field: 'email',
				message: 'That email is already in use.'
			},
			data: {
				token: ''
			}
		};
	}
	try {
		const token = await db.signup({
			NS: env.SURREAL_NS,
			DB: env.SURREAL_DB,
			SC: 'keeper',
			username,
			email,
			pass
		});
		return {
			error: false,
			errorInfo: null,
			data: {
				token
			}
		};
	} catch (err) {
		console.error(err);
		return {
			error: true,
			errorInfo: {
				field: null,
				message: 'There was a problem creating your account. Please try again later.'
			}
		};
	}
}

type userToLogin = Partial<Omit<User, 'id'>>;

export async function loginUser(user: userToLogin) {
	// needs refactor
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

async function existsUserByUsername(username: string) {
	try {
		await connectToDB();
		const [q] = await db.query('SELECT count(id) FROM user WHERE username = $username', {
			username
		});
		if (Array.isArray(q.result) && q.result[0]?.count >= 1) return true;
		return false;
	} catch (err) {
		console.error(err);
	}
}

async function existsUserByEmail(email: string) {
	try {
		const db = await connectToDB();
		const [q] = await db.query('SELECT count(id) FROM user WHERE email = $email', {
			email
		});
		if (Array.isArray(q.result) && q.result[0]?.count >= 1) return true;
		return false;
	} catch (err) {
		console.error(err);
	}
}
