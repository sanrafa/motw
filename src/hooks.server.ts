import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';
import { authenticateUser } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('auth');
	const user = token ? await authenticateUser(token) : null;
	if (user) event.locals.user = user;

	if (event.url.pathname.startsWith('/dashboard')) {
		if (!event.locals.user) throw redirect(307, '/auth/login');
	}

	const response = await resolve(event);
	return response;
};
