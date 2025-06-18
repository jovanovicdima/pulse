import bcrypt from 'bcrypt';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/database';
import { Roles } from '$lib/roles';

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) {
    redirect(302, '/');
  }
};

export const actions: Actions = {
  register: async ({ request }) => {
    const data = await request.formData();

    const username: string | undefined = data
      .get('username')
      ?.toString()
      .trim();
    const fullname: string | undefined = data
      .get('fullname')
      ?.toString()
      .trim();
    const email: string | undefined = data.get('email')?.toString().trim();
    const address: string | undefined = data.get('address')?.toString().trim();
    const phone: string | undefined = data.get('phone')?.toString().trim();
    const password: string | undefined = data.get('password')?.toString();
    const repeatPassword: string | undefined = data
      .get('repeatPassword')
      ?.toString();

    console.log(
      username,
      fullname,
      email,
      address,
      phone,
      password,
      repeatPassword
    );

    // verify user data
    if (
      typeof username !== 'string' ||
      typeof fullname !== 'string' ||
      typeof email !== 'string' ||
      typeof address !== 'string' ||
      typeof phone !== 'string' ||
      typeof password !== 'string' ||
      typeof repeatPassword !== 'string' ||
      !username ||
      !fullname ||
      !email ||
      !address ||
      !phone ||
      !password ||
      !repeatPassword
    ) {
      return fail(400, { invalid: true });
    }

    if (password != repeatPassword) {
      return fail(400, { repeatPassword: true });
    }

    // username in use
    const usernameExists = await db.user.findUnique({
      where: { username },
    });

    if (usernameExists) {
      return fail(400, { username: true });
    }

    // email in use
    const emailExists = await db.user.findUnique({
      where: { email },
    });

    if (emailExists) {
      return fail(400, { email: true });
    }

    // create user
    await db.user.create({
      data: {
        email: email,
        phone: phone,
        role: { connect: { name: Roles.ADVENTURER } },
        address: address,
        fullName: fullname,
        username: username,
        passwordHash: await bcrypt.hash(password, 12),
        userAuthToken: crypto.randomUUID(),
      },
    });

    // redirect to avatar page
    throw redirect(303, '/login');
  },
};
