<script lang="ts">
  import { browser } from '$app/environment';
  import { colorClasses, type TodoItem, type TodoMainProps, type TodoSchema } from '@/lib/types';
  import { cn } from '@/lib/utils';
  import { onMount } from 'svelte';
  import { innerWidth } from 'svelte/reactivity/window';
  import TodoBody from './todo-body.svelte';
  import TodoHeader from './todo-header.svelte';

  let todoWidth = $state(0);
  let isMounted = $state(false);
  const MOBILE_TODO_PADDING = 80;

  let {
    todoTitle,
    todoData = $bindable(),
    color = 'slate',
    containerClass = ''
  }: TodoMainProps = $props();

  let todos = $state<TodoSchema>({
    id: `todos-${todoTitle}`,
    todoHeader: '',
    todoItems: []
  });

  onMount(() => {
    if (!browser) return;
    try {
      const raw = localStorage.getItem(todos.id);
      if (!raw) {
        todos.todoItems = Array.from({ length: 10 }, (_, index) => ({
          id: `todo-${Date.now()}-${index}`,
          text: '',
          isRemoving: false,
          isReadding: false
        }));
        return;
      }
      const parsed = JSON.parse(raw);

      if (parsed && parsed.todoItems) {
        todos = {
          ...parsed,
          todoItems: parsed.todoItems.map((item: TodoItem) => ({
            ...item,
            text: item.text.trim(),
            isRemoving: false,
            isReadding: false
          }))
        };
      }
    } catch (err) {
      console.error('Error loading todos from localStorage:', err);

      todos.todoItems = Array.from({ length: 10 }, (_, index) => ({
        id: `todo-${Date.now()}-${index}`,
        text: '',
        isRemoving: false,
        isReadding: false
      }));
    } finally {
      isMounted = true;
    }
  });

  $effect(() => {
    if (!browser) return;

    try {
      const todosToSave = {
        ...todos,
        todoItems: todos.todoItems.map(({ id, text }) => ({ id, text: text.trim() }))
      };
      localStorage.setItem(todos.id, JSON.stringify(todosToSave));
    } catch (err) {
      console.error('Error saving todos to localStorage:', err);
    }
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

  $effect(() => {
    todoData = todos;
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
    <TodoHeader {todoTitle} bind:todoHeader={todos.todoHeader} {color} />
    <TodoBody {todoTitle} bind:todoItems={todos.todoItems} {color} />
  </div>
{/if}

<style>
  #todo-main {
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    background-clip: padding-box;
  }
</style>
