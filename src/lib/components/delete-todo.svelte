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
        'border-crisp relative z-10 size-10 cursor-pointer items-center justify-center rounded-sm border-red-200 bg-red-100 p-0 shadow-transparent hover:border-red-300 hover:bg-red-200'
      )}
    >
      <TrashIcon class="size-6 text-red-500" />
    </AlertDialog.Trigger>
    <AlertDialog.Content class="rounded-sm border-none bg-white " interactOutsideBehavior="close">
      <AlertDialog.Header>
        <AlertDialog.Title>Clear all todos?</AlertDialog.Title>
        <AlertDialog.Description>
          This will permanently remove all current todos. This action cannot be undone.
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Cancel
          class="border-crisp cursor-pointer rounded-sm border-[0.5px] border-slate-300 bg-white font-medium tracking-tight hover:bg-slate-50"
          >Cancel</AlertDialog.Cancel
        >
        <AlertDialog.Action
          class="border-crips cursor-pointer rounded-sm border-[0.5px] border-red-400 bg-red-600 font-medium tracking-tight text-white hover:bg-red-600 hover:brightness-95"
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
