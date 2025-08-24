<script lang="ts">
  import { cn } from '../utils';
  import TrashIcon from './icons/material-symbols:delete-forever-outline-rounded.svelte';
  import * as AlertDialog from './ui/alert-dialog/index';
  import { buttonVariants } from './ui/button';

  let open = $state(false);
  let { clearCurrentTodo }: { clearCurrentTodo: () => void } = $props();
</script>

<div class="absolute right-6 bottom-6 flex flex-col space-y-2">
  <AlertDialog.Root bind:open>
    <AlertDialog.Trigger
      class={cn(
        `${buttonVariants({ variant: 'outline' })}`,
        'border-crisp relative z-10 size-10 cursor-pointer items-center justify-center rounded-sm bg-slate-200/40 p-0 shadow-transparent hover:border-slate-400/80 hover:bg-slate-300/40'
      )}
    >
      <TrashIcon class="size-6 text-slate-500" />
    </AlertDialog.Trigger>
    <AlertDialog.Content class="border-none" interactOutsideBehavior="close">
      <AlertDialog.Header>
        <AlertDialog.Title>Clear all todos?</AlertDialog.Title>
        <AlertDialog.Description>
          This will permanently remove all current todos. This action cannot be undone.
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel class="cursor-pointer">Cancel</AlertDialog.Cancel>
        <AlertDialog.Action
          class="cursor-pointer bg-red-600 text-white hover:bg-red-700"
          onclick={() => {
            clearCurrentTodo();
            open = false;
          }}
        >
          Delete All
        </AlertDialog.Action>
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>
</div>
