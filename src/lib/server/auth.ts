import { getRequestEvent } from '$app/server';
import {
  BETTER_AUTH_SECRET,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_SECRET,
  MONGO_URI
} from '$env/static/private';
import {
  PUBLIC_BETTER_AUTH_URL,
  PUBLIC_GITHUB_CLIENT_ID,
  PUBLIC_GOOGLE_CLIENT_ID
} from '$env/static/public';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { MongoClient } from 'mongodb';

const client = new MongoClient(MONGO_URI);
const db = client.db();

export const auth = betterAuth({
  appName: 'Tuntas',
  secret: BETTER_AUTH_SECRET,
  baseURL: PUBLIC_BETTER_AUTH_URL,
  basePath: '/api/auth',
  trustedOrigins: ['https://tuntas.farissaifuddin.id', 'http://localhost:3000'],
  database: mongodbAdapter(db),
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
