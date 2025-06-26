import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	redirect(302, '/login');
};

export const actions: Actions = {
	default({ cookies }) {
		cookies.set('session', '', {
			path: '/',
			expires: new Date(0)
		});

		throw redirect(302, '/');
	}
};
