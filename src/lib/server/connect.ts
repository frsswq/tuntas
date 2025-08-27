import { MONGO_URI } from '$env/static/private';
import mongoose, { Mongoose } from 'mongoose';

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached = global.mongoose || { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  try {
    if (!cached.promise) {
      console.log('Creating new database connection...');
      cached.promise = mongoose.connect(MONGO_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
        family: 4
      });
    }

    cached.conn = await cached.promise;
    console.log('Connected to MongoDB');
    return cached.conn;
  } catch (err) {
    console.log('MongoDB connection error:', err);
    cached.promise = null;
    throw err;
  }
}

export async function getNativeClient() {
  const conn = await dbConnect();
  return conn.connection.getClient().db() as unknown as import('mongodb').Db;
}

global.mongoose = cached;
