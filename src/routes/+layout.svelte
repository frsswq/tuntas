<script lang="ts">
  import { goto } from '$app/navigation';
  import favicon from '$lib/assets/favicon.svg';
  import { authClient } from '@/lib/client/auth-client';
  import '@fontsource-variable/inter';
  import '../app.css';

  let { children } = $props();

  const session = authClient.useSession();

  $effect(() => {
    if (!$session.data?.user?.id && !$session.isPending && !$session.isRefetching) {
      goto('/');
    }
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

<style>
  :global(body) {
    font-family: 'Inter Variable', sans-serif;
    font-feature-settings:
      'liga' 1,
      'calt' 1;
  }
</style>
