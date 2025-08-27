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
import { MongoClient } from 'mongodb';

let client: MongoClient;

if (!globalThis._mongoClientPromise) {
  client = new MongoClient(MONGO_URI);
  globalThis._mongoClientPromise = client.connect();
}

const clientPromise: Promise<MongoClient> = globalThis._mongoClientPromise;

async function getDb() {
  const client = await clientPromise;
  return client.db('tuntas');
}

const db = await getDb();

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
