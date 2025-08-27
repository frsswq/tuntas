import { building } from '$app/environment';
import { type HandleServerError, json } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { auth } from './lib/server/auth-server';
import { dbConnect } from './lib/server/connect';

export async function init() {
  await dbConnect()
    .then(() => console.log('Initial Database connected successfully (root/src/hooks.server.ts)'))
    .catch((error) =>
      console.error('Error connecting to database (root/src/hooks.server.ts):', error)
    );
}

export async function handle({ event, resolve }) {
  const fetchedSession = await auth.api.getSession({
    headers: event.request.headers
  });

  if (fetchedSession) {
    const { user, session } = fetchedSession;
    event.locals.session = session;
    event.locals.user = user;
  } else {
    delete event.locals.session;
    delete event.locals.user;
  }

  if (event.url.pathname.startsWith('/api/private') || event.route.id?.startsWith('/api/private')) {
    if (!event.locals?.user || !event.locals?.session) {
      return json({ message: 'Unauthorized' }, { status: 401 });
    }
  }

  return svelteKitHandler({ event, resolve, auth, building });
}

export const handleError: HandleServerError = ({ error, event }) => {
  if (error instanceof Error && error.message.startsWith('Not found:')) {
    console.error(`${error.message}`);
    return { message: 'Not found' };
  }

  const errorUrl = event?.url?.href || 'URL not available';
  console.error(`[START OF ERROR: ${errorUrl}]`);
  console.error(error);
  console.error(`[END OF ERROR]`);

  return { message: 'An unexpected error occured' };
};
