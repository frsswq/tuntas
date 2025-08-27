import { getRequestEvent } from '$app/server';
import { GITHUB_CLIENT_SECRET, GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_GITHUB_CLIENT_ID, PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getNativeClient } from './connect';

export const auth = betterAuth({
  database: mongodbAdapter(await getNativeClient()),
  emailAndPassword: {
    enabled: false
  },
  socialProviders: {
    google: {
      prompt: 'select_account',
      clientId: PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: GOOGLE_CLIENT_SECRET as string
    },
    github: {
      clientId: PUBLIC_GITHUB_CLIENT_ID as string,
      clientSecret: GITHUB_CLIENT_SECRET as string
    }
  },
  plugins: [sveltekitCookies(getRequestEvent)]
});
