<script lang="ts">
  import type { ColorName } from '@/lib/types';
  import { cn } from '@/lib/utils';
  import TodoBody from './todo-body.svelte';
  import TodoHeader from './todo-header.svelte';

  interface TodoProps {
    todoTitle: string;
    color?: ColorName;
    containerClass?: string;
    x: Number;
    y: Number;
    z: Number;
  }

  let { todoTitle, color = 'slate', containerClass = '', x, y, z }: TodoProps = $props();
</script>

<div
  class={cn(
    'border-crips absolute flex h-fit w-full max-w-full -translate-x-1/2 -translate-y-1/2 flex-col gap-y-1.5 rounded-md bg-white transition-transform sm:max-w-[325px]',
    containerClass
  )}
  style={`left: calc(50% + ${x}px); top: calc(50% + ${y}px); z-index: ${z};`}
>
  <TodoHeader {todoTitle} {color} />
  <TodoBody {color} />
</div>
