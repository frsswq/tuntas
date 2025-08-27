<script lang="ts">
  import { authClient } from '../../client/auth-client';

  const session = authClient.useSession();
</script>

<div class="absolute top-6 right-6 flex items-center justify-center">
  {#if $session.data}
    <div>
      <p>
        {$session?.data?.user.name}
      </p>
      <button
        onclick={async () => {
          await authClient.signOut();
        }}
      >
        Sign Out
      </button>
    </div>
  {:else}
    <a
      class="border-crips flex h-8.5 w-17 items-center justify-center rounded-sm border-[0.5px] border-slate-300 bg-white p-0 text-sm font-medium whitespace-nowrap hover:bg-slate-50"
      href="/auth">Sign in</a
    >
  {/if}
</div>
