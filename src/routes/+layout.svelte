<script lang="ts">
  import { browser } from '$app/environment';
  import CheckIcon from '@/lib/components/icons/mynaui:check.svelte';
  import { Toaster } from '@/lib/components/ui/sonner/index';
  import { TODOS } from '@/lib/consts';
  import type { TodoItem, TodoSchema } from '@/lib/types';
  import '@fontsource-variable/inter';
  import { onMount, setContext } from 'svelte';
  import { innerWidth } from 'svelte/reactivity/window';
  import '../app.css';

  let todos = $state<TodoSchema[]>(
    TODOS.map((todo) => {
      const lowerTitle = todo.todoTitle.toLowerCase();
      return {
        listId: `todos-${lowerTitle}`,
        todoHeader: '',
        todoItems: Array.from({ length: 10 }, (_, index) => ({
          todoId: `todo-${Date.now()}-${index}`,
          text: '',
          isRemoving: false,
          isReadding: false
        }))
      };
    })
  );

  onMount(() => {
    if (!browser) return;
    todos.forEach((todo, index) => {
      try {
        const raw = localStorage.getItem(todo.listId);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (parsed?.todoItems) {
          todos[index] = {
            ...parsed,
            todoItems: parsed.todoItems.map((item: TodoItem) => ({
              ...item,
              text: item.text.trim()
            }))
          };
        }
      } catch (err) {
        console.error('Error loading todos:', err);
      }
    });
  });

  $effect(() => {
    if (!browser) return;
    todos.forEach((todo) => {
      try {
        const todosToSave = {
          ...todo,
          todoItems: todo.todoItems.map(({ todoId, text }) => ({ todoId, text: text.trim() }))
        };
        localStorage.setItem(todo.listId, JSON.stringify(todosToSave));
      } catch (err) {
        console.error('Error saving todos:', err);
      }
    });
  });

  // KV
  setContext('todos', todos);

  let { children } = $props();
</script>

<Toaster
  position={innerWidth.current! < 480 ? 'top-left' : 'top-left'}
  duration={2000}
  offset="24px"
  mobileOffset="20px"
  toastOptions={{
    unstyled: true,
    classes: {
      toast:
        'w-fit flex items-center bg-white shadow-none border-crisp border-slate-300 border-[0.5px] gap-x-1 pl-2 pr-4 py-2 rounded-sm',
      title:
        'text-black text-sm [font-family:"Inter_Variable"] font-medium tracking-tight whitespace-nowrap leading-none select-none'
    }
  }}
>
  {#snippet successIcon()}
    <CheckIcon class="size-5.5 text-black select-none" />
  {/snippet}
</Toaster>

{@render children?.()}
