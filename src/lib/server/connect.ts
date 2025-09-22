import { MONGO_URI } from '$env/static/private';
import { Db, ServerApiVersion } from 'mongodb';
import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  try {
    if (!cached.promise) {
      console.log('Creating new database connection...');
      cached.promise = mongoose.connect(MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        family: 4,
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true
        }
      });
    }

    cached.conn = await cached.promise;
    console.log('Connected to MongoDB');
    return cached.conn;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    cached.promise = null;
    throw error;
  }
}

export async function getNativeClient(): Promise<Db> {
  const conn = await dbConnect();
  return conn.connection.getClient().db('tuntas') as unknown as Db;
}

global.mongoose = cached;
