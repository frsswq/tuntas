<script lang="ts">
  import { goto } from '$app/navigation';
  import { authClient } from '@/lib/auth-client';
  import LoadingIcon from '@/lib/components/icons/SvgSpinnersBarsRotateFade.svelte';
  import GithubIcon from '@/lib/components/icons/logos:github-icon.svelte';
  import GoogleIcon from '@/lib/components/icons/logos:google-icon.svelte';
  import TuntasIcon from '@/lib/components/icons/lucide:list-todo.svelte';
  import Button from '../ui/button/button.svelte';

  const session = authClient.useSession();
  let loadingProvider: 'google' | 'github' | null = $state(null);
  const signIn = async (provider: 'google' | 'github') => {
    try {
      loadingProvider = provider;
      const res = await authClient.signIn.social({
        provider,
        callbackURL: '/?signin=success'
      });
      return res;
    } finally {
      loadingProvider = null;
    }
  };

  $effect(() => {
    if ($session.data?.user) {
      goto('/');
    }
  });
</script>

<svelte:head>
  <title>Sign in</title>
</svelte:head>

<main
  class="flex min-h-dvh max-w-full min-w-full flex-col items-center justify-center gap-y-5 overflow-hidden text-sm leading-[1.333] tracking-tight"
>
  {#if !$session.data}
    <div class="flex flex-col items-center gap-y-3">
      <TuntasIcon
        class="border-crips size-15 rounded-md border-[0.5px] border-slate-300 bg-white p-2.5"
      />
      <h1 class="text-xl font-semibold">Sign in to Tuntas</h1>
    </div>
    <div
      class="border-crips flex h-full max-h-[300px] w-full max-w-[calc(100%-60px)] flex-col items-center justify-center gap-y-2 rounded-sm border-[0.5px] border-slate-300 bg-slate-100 px-5 py-6 xs:max-w-[400px] xs:px-7.5"
    >
      <Button
        class="h-10 w-full cursor-pointer border-[0.5px] border-slate-300 bg-white p-0 text-base font-medium text-black hover:border-slate-400 hover:bg-slate-50"
        disabled={loadingProvider !== null}
        onclick={() => signIn('google')}
      >
        {#if loadingProvider === 'google'}
          <LoadingIcon class="size-5" />&nbsp;Continue with Google
        {:else}
          <GoogleIcon class="size-5" />&nbsp;Continue with Google
        {/if}
      </Button>
      <Button
        class="h-10 w-full cursor-pointer border-[0.5px] border-slate-300 bg-white p-0 text-base font-medium text-black hover:border-slate-400 hover:bg-slate-50"
        disabled={loadingProvider !== null}
        onclick={() => signIn('github')}
      >
        {#if loadingProvider === 'github'}
          <LoadingIcon class="size-5" />&nbsp;Continue with Github
        {:else}
          <GithubIcon class="size-5" />&nbsp;Continue with Github
        {/if}
      </Button>
    </div>
  {/if}
</main>

<style>
  main {
    background-color: var(--color-slate-50);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%2364748b' fill-opacity='0.1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: auto;
    transform: translateZ(0);
  }
</style>
