<script lang="ts">
  import { authClient } from '@/lib/auth-client';
  import Button from '../ui/button/button.svelte';

  const session = authClient.useSession();
</script>

<div class="absolute top-6 right-6 flex items-center justify-center gap-x-1.5">
  {#if $session.data}
    <div class="flex items-center justify-center gap-x-3">
      <Button
        class="border-crips flex h-8.5 w-20 cursor-pointer items-center justify-center rounded-sm border-[0.5px] border-slate-300 bg-white p-0 text-sm font-medium whitespace-nowrap text-black hover:bg-slate-50"
        onclick={async () => {
          await authClient.signOut();
        }}
      >
        Sign Out
      </Button>
    </div>
  {:else}
    <a
      class="border-crips flex h-8.5 w-17 items-center justify-center rounded-sm border-[0.5px] border-slate-300 bg-white p-0 text-sm font-medium whitespace-nowrap hover:bg-slate-50"
      href="/auth">Sign in</a
    >
  {/if}
</div>
