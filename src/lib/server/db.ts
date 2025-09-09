import { MONGO_URI } from '$env/static/private';
import { MongoClient, ServerApiVersion } from 'mongodb';

const client = new MongoClient(MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  family: 4,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
});

await client.connect();
export const db = client.db('tuntas');
