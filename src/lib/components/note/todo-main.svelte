<script lang="ts">
  import type { ColorName } from '@/lib/types';
  import { cn } from '@/lib/utils';
  import { onMount } from 'svelte';
  import { innerWidth } from 'svelte/reactivity/window';
  import TodoBody from './todo-body.svelte';
  import TodoHeader from './todo-header.svelte';

  let todoWidth = $state(0);
  let isMounted = $state(false);
  const MOBILE_TODO_PADDING = 80;

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

  interface TodoProps {
    todoTitle: string;
    color?: ColorName;
    containerClass?: string;
    x: number;
  }

  let { todoTitle, color = 'slate', containerClass = '', x }: TodoProps = $props();
  let offsetX = $derived(innerWidth.current !== undefined ? innerWidth.current * x : 0);
</script>

{#if isMounted}
  <div
    class={cn(
      'border-crisp absolute top-1/2 left-1/2 flex h-fit flex-col gap-y-1.5 rounded-md bg-white transition-transform duration-300 ease-out select-none sm:w-[325px]',
      containerClass
    )}
    style={`width: ${todoWidth}px; transform: translate(-50%, -50%) translateX(${offsetX}px);`}
  >
    <TodoHeader {todoTitle} {color} />
    <TodoBody {color} />
  </div>
{/if}
