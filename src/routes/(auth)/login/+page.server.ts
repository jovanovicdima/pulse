import bcrypt from 'bcrypt';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import redis from '$lib/redis';
import { getRedisUserKey, getRedisUserSessionKey } from '$lib/utils/redisKeyUtils';
import { randomUUID } from 'crypto';

export const load: PageServerLoad = async (event) => {
	if (event.locals.userEmail) {
		redirect(302, '/');
	}
};

export const actions: Actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();

		const email = data.get('email');
		const password = data.get('password');

		if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
			return fail(400, { invalid: true });
		}

		// user entered email
		const hashedPassword: string | null = await redis.GET(getRedisUserKey(email));
		const isPasswordCorrect = await bcrypt.compare(password, hashedPassword ?? '');

		// if wrong credentials
		if (!hashedPassword || !isPasswordCorrect) {
			return fail(400, { credentials: true });
		}

		const sessionID = randomUUID();

		await redis.SETEX(getRedisUserSessionKey(sessionID), 60 * 60, email); // 1 hour TTL

		cookies.set('session', sessionID, {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60
		});

		throw redirect(302, '/');
	}
};
