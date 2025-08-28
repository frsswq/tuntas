import { PUBLIC_BETTER_AUTH_URL } from '$env/static/public';
import { createAuthClient } from 'better-auth/svelte';

export const authClient = createAuthClient({
  baseURL: PUBLIC_BETTER_AUTH_URL
});

export const signIn = async (provider: 'google' | 'github') => {
  const data = await authClient.signIn.social({
    provider,
    callbackURL: '/'
  });

  return data;
};
