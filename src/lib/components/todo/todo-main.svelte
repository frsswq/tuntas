<script lang="ts">
  import { colorClasses } from '@/lib/consts';
  import { type TodoMainProps } from '@/lib/types';
  import { cn } from '@/lib/utils';

  import { onMount } from 'svelte';
  import { innerWidth } from 'svelte/reactivity/window';
  import TodoBody from './todo-body.svelte';
  import TodoHeader from './todo-header.svelte';

  let todoWidth = $state(0);
  let isMounted = $state(false);
  const MOBILE_TODO_PADDING = 80;

  let { color = 'slate', containerClass = '', index }: TodoMainProps = $props();

  onMount(() => {
    isMounted = true;
  });

  $effect(() => {
    if (innerWidth.current !== undefined) {
      if (innerWidth.current < 480) {
        todoWidth = Math.min(innerWidth.current - MOBILE_TODO_PADDING, 325);
      } else {
        todoWidth = 325;
      }
    }
  });
</script>

{#if isMounted}
  <div
    id="todo-main"
    class={cn(
      `absolute top-1/2 left-1/2 flex h-fit -translate-1/2 flex-col gap-y-1.5 rounded-md border-[0.5px] bg-white ${colorClasses[color].border} select-none sm:w-[325px]`,
      containerClass
    )}
    style="width: {todoWidth}px;"
  >
    <TodoHeader {color} {index} />
    <TodoBody {color} {index} />
  </div>
{/if}

<style>
  #todo-main {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    background-clip: padding-box;
  }
</style>
