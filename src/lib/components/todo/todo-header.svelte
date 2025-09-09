<script lang="ts">
  import { colorClasses, TODOS } from '@/lib/consts';
  import { cn } from '@/lib/utils';
  import { getContext } from 'svelte';
  import type { TodoHeaderProps, TodoItem, TodoSchema } from '../../types';
  import Input from '../ui/input/input.svelte';

  let { color = 'slate', index }: TodoHeaderProps = $props();

  const { todos, updateTodo } = getContext<{
    todos: TodoSchema[];
    updateTodo: (index: number, updated: Partial<TodoSchema>) => void;
    updateTodoItem: (index: number, itemIndex: number, updated: Partial<TodoItem>) => void;
  }>('todos');
</script>

<div
  class={`flex items-end justify-between border border-transparent ${colorClasses[color].border_b} px-2.5 pt-2 pb-2 tracking-tighter`}
>
  <h1 class={`text-[15px] leading-none font-medium ${colorClasses[color].text}`}>
    {TODOS[index].todoTitle}
  </h1>
  <label for={`${TODOS[index].todoTitle}-detail`} class="sr-only"
    >{TODOS[index].todoTitle} Detail</label
  >
  <Input
    id={`${TODOS[index].todoTitle}-detail`}
    class={cn(
      `h-4  max-w-[100px] overflow-hidden rounded-none border-0 border-b-1 text-ellipsis whitespace-nowrap ${colorClasses[color].border_b} px-0.5 text-center leading-none ${colorClasses[color].text} ${colorClasses[color].caret} ${colorClasses[color].bg} shadow-none focus-visible:ring-0 focus-visible:${colorClasses[color].border_b}`
    )}
    bind:value={todos[index].todoHeader}
    maxlength={8}
    oninput={(e) => {
      updateTodo(index, { todoHeader: e.currentTarget.value });
    }}
  />
</div>
