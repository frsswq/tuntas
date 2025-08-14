<script lang="ts">
  import { cn } from '../utils';
  import NoteBody from './note-body.svelte';
  import NoteHeader from './note-header.svelte';
  let { noteTitle, containerClass = '' } = $props();
</script>

<div
  class={cn(
    'border-crips flex h-full w-full max-w-full flex-col gap-y-1.5 rounded-md bg-white sm:max-w-[325px]',
    containerClass
  )}
>
  <NoteHeader {noteTitle} />
  <NoteBody />
</div>
