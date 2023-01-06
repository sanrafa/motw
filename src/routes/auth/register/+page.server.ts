import { fail, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import type { Actions } from './$types';
import { registerUser } from '$lib/server/auth';

const registerSchema = z.object({
	username: z
		.string({
			required_error: 'A username is required.'
		})
		.trim()
		.min(1),
	email: z
		.string({ required_error: 'An email is required.' })
		.trim()
		.email({ message: 'Invalid email address.' })
		.min(1),
	pass: z
		.string({ required_error: 'You must enter a password.' })
		.trim()
		.min(8, { message: 'A password must be at least 8 characters long.' })
});

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const form = await request.formData();
		const username = form.get('username') || '';
		const email = form.get('email') || '';
		const pass = form.get('pass') || '';
		const confirmedPass = form.get('confirmedPass') || '';

		if (pass !== confirmedPass) {
			return fail(400, {
				username,
				email,
				pass,
				errors: [
					{
						field: 'confirmedPass',
						message: 'Both passwords must match.'
					}
				]
			});
		}

		const input = { username, email, pass };

		const parsed = registerSchema.safeParse(input);

		if (parsed.success) {
			const result = await registerUser(parsed.data);
			if (result.data?.token) {
				const token = result.data.token;
				cookies.set('auth', token, {
					path: '/',
					httpOnly: true,
					secure: import.meta.env.MODE === 'development' ? false : true
				});
				throw redirect(303, '/dashboard');
			} else {
				return fail(400, {
					username,
					email,
					errors: [{ ...result.errorInfo }]
				});
			}
		} else {
			const errors = parsed.error.errors.map((error) => {
				return {
					field: error.path,
					message: error.message
				};
			});
			return fail(400, { username, email, errors });
		}
	}
};
