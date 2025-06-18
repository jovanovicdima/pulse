// import { db } from '$lib/server/database';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    redirect(302, '/');
  }
};

export const actions: Actions = {
  login: async ({ cookies, request }) => {
    const data = await request.formData();

    const usernameOrEmail = data.get('username');
    const password = data.get('password');

    if (
      typeof usernameOrEmail !== 'string' ||
      typeof password !== 'string' ||
      !usernameOrEmail ||
      !password
    ) {
      return fail(400, { invalid: true });
    }

    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    let user = null;

    // if (usernameOrEmail.match(emailRegex)) {
    //   // user entered email
    //   user = await db.user.findUnique({
    //     where: {
    //       email: usernameOrEmail,
    //     },
    //   });
    // } else {
    //   // user entered username
    //   user = await db.user.findUnique({
    //     where: {
    //       username: usernameOrEmail,
    //     },
    //   });
    // }

    // if wrong credentials
    // if (!user) {
    //   return fail(400, { credentials: true });
    // }

    // const authenticatedUser = await db.user.update({
    //   where: { username: user.username },
    //   data: { userAuthToken: crypto.randomUUID() },
    // });

    // cookies.set('session', authenticatedUser.userAuthToken, {
    //   path: '/',
    //   httpOnly: true,
    //   sameSite: 'lax',
    //   secure: process.env.NODE_ENV === 'production',
    //   maxAge: 60 * 60,
    // });

    throw redirect(302, '/');
  },
};
