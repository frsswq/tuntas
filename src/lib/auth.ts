import { getRequestEvent } from '$app/server';
import {
  BETTER_AUTH_SECRET,
  GITHUB_CLIENT_SECRET,
  GOOGLE_CLIENT_SECRET,
  MONGO_URI
} from '$env/static/private';
import { PUBLIC_GITHUB_CLIENT_ID, PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import type { Db } from 'mongodb';
import { MongoClient } from 'mongodb';

let cachedDb: Db | null = null;

async function getDatabase() {
  if (!cachedDb) {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    cachedDb = client.db();
  }

  return cachedDb;
}

const db = await getDatabase();

export const auth = betterAuth({
  secret: BETTER_AUTH_SECRET,
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
