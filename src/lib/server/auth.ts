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
import { Db, MongoClient } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function getMongoClient() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGO_URI, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
    maxIdleTimeMS: 30000
  });

  try {
    await client.connect();
    const db = client.db();

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
}

export const auth = betterAuth({
  appName: 'Tuntas',
  secret: BETTER_AUTH_SECRET,
  baseURL: PUBLIC_BETTER_AUTH_URL,
  basePath: '/api/auth',
  trustedOrigins: ['https://tuntas.farissaifuddin.id', 'http://localhost:3000'],
  database: mongodbAdapter(cachedDb || (await getMongoClient()).db),
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
