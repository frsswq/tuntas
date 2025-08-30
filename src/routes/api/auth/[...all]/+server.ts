import { auth } from '$lib/auth.server';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
  try {
    return await auth.handler(request);
  } catch (error) {
    console.error('Auth GET error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: RequestHandler = async ({ request }) => {
  try {
    console.log('Auth POST request to:', request.url);
    return await auth.handler(request);
  } catch (error) {
    console.error('Auth POST error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'Unknown error');
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
