<script lang="ts">
  import { authClient } from '@/lib/auth-client';
  import * as Avatar from '@/lib/components/ui/avatar/index';
  import { onMount } from 'svelte';
  import Button from '../ui/button/button.svelte';

  const session = authClient.useSession();

  onMount(() => {});
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
      <Avatar.Root
        class="border-crips flex size-8 items-center justify-center border-[0.5px] border-slate-300"
      >
        <Avatar.Image
          src={$session.data.user.image}
          class="size-full"
          alt={$session.data.user.name}
        />
        <Avatar.Fallback
          class="size-full rounded-full bg-slate-200 text-xs leading-none text-black  select-none "
        >
          {$session.data.user.name
            .split(' ')
            .map((word: string) => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('') ?? ''}
        </Avatar.Fallback>
      </Avatar.Root>
    </div>
  {:else}
    <a
      class="border-crips flex h-8.5 w-17 items-center justify-center rounded-sm border-[0.5px] border-slate-300 bg-white p-0 text-sm font-medium whitespace-nowrap hover:bg-slate-50"
      href="/auth">Sign in</a
    >
  {/if}
</div>
