import { getRequestEvent } from '$app/server';
import {
  BETTER_AUTH_SECRET,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_SECRET,
  TURSO_AUTH_TOKEN,
  TURSO_DATABASE_URL
} from '$env/static/private';
import {
  PUBLIC_BETTER_AUTH_URL,
  PUBLIC_GITHUB_CLIENT_ID,
  PUBLIC_GOOGLE_CLIENT_ID
} from '$env/static/public';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { db } from './db';
import * as schema from './schema';

if (!TURSO_DATABASE_URL && !TURSO_AUTH_TOKEN) {
  console.error('Missing database envs: TURSO_DATABASE_URL or TURSO_AUTH_TOKEN');
}

export const auth = betterAuth({
  appName: 'Tuntas',
  secret: BETTER_AUTH_SECRET,
  baseURL: PUBLIC_BETTER_AUTH_URL,
  basePath: '/api/auth',
  trustedOrigins: [
    'https://tuntas.farissaifuddin.id',
    'http://localhost:3000',
    'https://localhost:3000'
  ],
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema
  }),
  emailAndPassword: {
    enabled: false
  },
  socialProviders: {
    google: {
      prompt: 'select_account',
      clientId: PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET
    },
    github: {
      clientId: PUBLIC_GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET
    }
  },
  plugins: [sveltekitCookies(getRequestEvent)]
});
