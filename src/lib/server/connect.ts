import { MONGO_URI } from '$env/static/private';
import type { Db } from 'mongodb';
import mongoose from 'mongoose';

const cached = global.mongoose ?? { conn: null, promise: null };

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
  return conn.connection.db as unknown as Db;
}

global.mongoose = cached;
