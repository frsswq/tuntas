<script lang="ts">
  import type { ColorName } from '@/lib/types';
  import { cn } from '@/lib/utils';
  import { innerWidth } from 'svelte/reactivity/window';
  import TodoBody from './todo-body.svelte';
  import TodoHeader from './todo-header.svelte';

  let todoWidth = $state(0);
  const MOBILE_TODO_PADDING = 80;

  $effect(() => {
    if (innerWidth.current !== undefined) {
      if (innerWidth.current < 480) {
        todoWidth = innerWidth.current - MOBILE_TODO_PADDING;
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
    y: number;
    z: number;
  }

  let { todoTitle, color = 'slate', containerClass = '', x, y, z }: TodoProps = $props();
</script>

<div
  class={cn(
    'border-crisp absolute flex h-fit -translate-x-1/2 -translate-y-1/2 flex-col gap-y-1.5 rounded-md bg-white transition-transform sm:w-[325px]',
    containerClass
  )}
  style={`left: calc(50% + ${x}px); top: calc(50% + ${y}px); z-index: ${z}; width: ${todoWidth}px`}
>
  <TodoHeader {todoTitle} {color} />
  <TodoBody {color} />
</div>
