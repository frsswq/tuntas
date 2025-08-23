<script lang="ts">
  import { cn } from '../utils';
  import TrashIcon from './icons/material-symbols:delete-forever-outline-rounded.svelte';
  import * as AlertDialog from './ui/alert-dialog/index';
  import { buttonVariants } from './ui/button';
</script>

<div class="absolute right-6 bottom-6 flex flex-col space-y-2">
  <AlertDialog.Root>
    <AlertDialog.Trigger
      class={cn(
        `${buttonVariants({ variant: 'outline' })}`,
        'border-crisp relative z-10 size-10 cursor-pointer items-center justify-center rounded-sm bg-slate-200/40 p-0 shadow-transparent hover:border-slate-400/80 hover:bg-slate-300/40'
      )}
    >
      <TrashIcon class="size-6 text-slate-500" />
    </AlertDialog.Trigger>
  </AlertDialog.Root>
</div>
