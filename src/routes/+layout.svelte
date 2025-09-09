<script lang="ts">
  import { browser } from '$app/environment';
  import { authClient } from '@/lib/auth-client';
  import CheckIcon from '@/lib/components/icons/mynaui:check.svelte';
  import { Toaster } from '@/lib/components/ui/sonner/index';
  import { TODOS } from '@/lib/consts';
  import { getUserTodos, saveUserTodos } from '@/lib/todos.remote';
  import type { TodoItem, TodoSchema } from '@/lib/types';
  import '@fontsource-variable/inter';
  import { onMount, setContext } from 'svelte';
  import { innerWidth } from 'svelte/reactivity/window';
  import '../app.css';

  const session = authClient.useSession();
  let todosLoaded = $state(false);
  let isLoggedIn = $state(false);
  let saveTimeout: NodeJS.Timeout;
  let todosVersion = $state(0);

  const markChanged = () => {
    todosVersion = todosVersion + 1;
  };

  let todos = $state<TodoSchema[]>(
    TODOS.map((todo) => {
      const lowerTitle = todo.todoTitle.toLowerCase();
      return {
        listId: `todos-${lowerTitle}`,
        todoHeader: '',
        todoItems: Array.from({ length: 10 }, (_, index) => ({
          todoId: `todo-${Date.now()}-${index}`,
          text: ''
        }))
      };
    })
  );

  const loadFromLocalStorage = () => {
    todos.forEach((todo, index) => {
      try {
        const raw = localStorage.getItem(todo.listId);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (parsed?.todoItems) {
          todos[index] = {
            ...parsed,
            todoHeader: parsed.todoHeader || '',
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
    todosLoaded = true;
  };

  const saveToLocalStorage = () => {
    todos.forEach((todo) => {
      try {
        const todosToSave = {
          ...todo,
          todoHeader: todo.todoHeader || '',
          todoItems: todo.todoItems.map(({ todoId, text }) => ({ todoId, text: text.trim() }))
        };
        localStorage.setItem(todo.listId, JSON.stringify(todosToSave));
      } catch (err) {
        console.error('Error saving todos to localStorage:', err);
      }
    });
  };

  const debouncedSave = () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      if (isLoggedIn) {
        try {
          await saveUserTodos(todos);
        } catch (err) {
          console.error('Error saving todos to server, fallback to localStorage:', err);
          saveToLocalStorage();
        }
      } else {
        saveToLocalStorage();
      }
    }, 300);
  };

  onMount(async () => {
    if (!browser) return;

    isLoggedIn = !!$session.data?.user;

    if (isLoggedIn) {
      try {
        const dbTodos = await getUserTodos();
        if (dbTodos && dbTodos.length === 3) {
          todos = dbTodos.map((dbTodo) => ({
            listId: dbTodo.listId,
            todoHeader: dbTodo.todoHeader || '',
            todoItems: dbTodo.todoItems.map((item: TodoItem) => ({
              ...item,
              text: item.text.trim()
            }))
          }));
        }
        todosLoaded = true;
      } catch (err) {
        console.error('Error loading todos data from server:', err);
        loadFromLocalStorage();
      }
    } else {
      loadFromLocalStorage();
    }
  });

  $effect(() => {
    if (!browser || !todosLoaded) return;
    todosVersion;
    debouncedSave();
  });

  // KV
  setContext('todos', { todos, markChanged });

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
