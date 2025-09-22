import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from '$env/static/private';

import { drizzle } from 'drizzle-orm/libsql';

export const db = drizzle({
  connection: {
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN
  }
});
