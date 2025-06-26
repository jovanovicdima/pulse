import bcrypt from 'bcrypt';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import redis from '$lib/redis';
import { getRedisUserKey } from '$lib/utils/redisKeyUtils';

export const load: PageServerLoad = async (event) => {
	if (event.locals.userEmail) {
		redirect(302, '/');
	}
};

export const actions: Actions = {
	register: async ({ request }) => {
		const data = await request.formData();

		const email: string | undefined = data.get('email')?.toString().trim();
		const password: string | undefined = data.get('password')?.toString();
		const repeatPassword: string | undefined = data.get('repeatPassword')?.toString();

		// verify user data
		if (
			typeof email !== 'string' ||
			typeof password !== 'string' ||
			typeof repeatPassword !== 'string' ||
			!email ||
			!password ||
			!repeatPassword
		) {
			return fail(400, { invalid: true });
		}

		if (password != repeatPassword) {
			return fail(400, { repeatPassword: true });
		}

		// email in use
		const emailExists = await redis.EXISTS(getRedisUserKey(email));

		if (emailExists) {
			return fail(400, { email: true });
		}

		// create user
		const hashedPassword = await bcrypt.hash(password, 12);

		// Store in Redis
		await redis.SET(getRedisUserKey(email), hashedPassword);

		// redirect to login page
		throw redirect(303, '/login');
	}
};
