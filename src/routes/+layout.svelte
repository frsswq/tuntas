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
  let currentUserId = $state<string | null>(null);
  let isLoadingUserTodos = $state(false);
  let isSaving = $state(false);

  let todos = $state<TodoSchema[]>(
    TODOS.map((todo, tableindex) => {
      const lowerTitle = todo.todoTitle.toLowerCase();
      const timestamp = Date.now();
      return {
        listId: `todos-${lowerTitle}`,
        todoHeader: '',
        todoItems: Array.from({ length: 10 }, (_, index) => ({
          todoId: `todo-${timestamp}-${tableindex}-${index}`,
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
        if (
          parsed?.todoItems &&
          Array.isArray(parsed.todoItems) &&
          parsed.todoItems.length === 10
        ) {
          todos[index] = {
            listId: parsed.listId || todo.listId,
            todoHeader: parsed.todoHeader || '',
            todoItems: parsed.todoItems.map((item: TodoItem, itemIndex: number) => ({
              todoId: item.todoId || todo.todoItems[itemIndex].todoId,
              text: (item.text || '').trim()
            }))
          };
        }
      } catch (err) {
        console.error(`Error loading todos ${todo.listId}:`, err);
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
        console.error(`Error saving todo ${todo.listId} to localStorage:`, err);
      }
    });
  };

  const loadUserTodosFromDb = async () => {
    if (!isLoggedIn || isLoadingUserTodos || !currentUserId) return;

    isLoadingUserTodos = true;
    try {
      console.log('Loading todos from database for user:', currentUserId);
      const dbTodos = await getUserTodos();
      if (dbTodos && dbTodos.length === 3) {
        const validTodos = dbTodos.every(
          (todo) => todo.todoItems && Array.isArray(todo.todoItems) && todo.todoItems.length === 10
        );

        if (validTodos) {
          todos = dbTodos.map((dbTodo) => ({
            listId: dbTodo.listId,
            todoHeader: dbTodo.todoHeader || '',
            todoItems: dbTodo.todoItems.map((item: TodoItem) => ({
              todoId: item.todoId,
              text: (item.text || '').trim()
            }))
          }));
          console.log('Successfully loaded todos from database');
        } else {
          console.warn('Invalid todo structure from database, using localStorage fallback');
          loadFromLocalStorage();
        }
      } else {
        console.log('No valid todos found in database, using localStorage fallback');
        loadFromLocalStorage();
      }
      todosLoaded = true;
    } catch (err) {
      console.error('Error loading todos from database:', err);
      loadFromLocalStorage();
    } finally {
      isLoadingUserTodos = false;
    }
  };

  const debouncedSave = () => {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      if (isSaving) return;

      isSaving = true;
      try {
        if (isLoggedIn && currentUserId) {
          console.log('Saving todos to database for user:', currentUserId);
          await saveUserTodos(todos);
          console.log('Todos saved to database');
        } else {
          console.log('Saving todos to localStorage (not loggedin)');
          saveToLocalStorage();
        }
      } catch (err) {
        console.error('Error saving todos to server, fallback to localStorage:', err);
        saveToLocalStorage();
      } finally {
        isSaving = false;
      }
    }, 500);
  };

  $effect(() => {
    const sessionData = $session.data;
    const newUserId = sessionData?.user?.id || null;
    const newIsLoggedIn = !!sessionData?.user;

    if (!isLoggedIn && newIsLoggedIn && newUserId) {
      console.log('User logged in:', newUserId);
      currentUserId = newUserId;
      isLoggedIn = newIsLoggedIn;

      loadUserTodosFromDb();
    } else if (isLoggedIn && !newIsLoggedIn) {
      console.log('User logged out');
      currentUserId = null;
      isLoggedIn = false;
      clearTimeout(saveTimeout);
      loadFromLocalStorage();
    } else if (isLoggedIn && newIsLoggedIn && currentUserId !== newUserId && newUserId) {
      console.log('User switched accounts:', currentUserId, '->', newUserId);
      currentUserId = newUserId;
      clearTimeout(saveTimeout);
      loadUserTodosFromDb();
    } else if (!todosLoaded) {
      currentUserId = newUserId;
      isLoggedIn = newIsLoggedIn;
    }
  });

  onMount(async () => {
    if (!browser) return;

    const sessionData = $session.data;
    currentUserId = sessionData?.user?.id || null;
    isLoggedIn = !!sessionData?.user;

    if (isLoggedIn && currentUserId) {
      await loadUserTodosFromDb();
    } else {
      loadFromLocalStorage();
    }
  });

  $effect(() => {
    if (!browser || !todosLoaded || isLoadingUserTodos) return;
    todosVersion;
    debouncedSave();
  });

  // KV
  setContext('todos', {
    get todos() {
      return todos;
    },
    get isLoading() {
      return isLoadingUserTodos;
    },
    get isSaving() {
      return isSaving;
    },
    updateTodo: (index: number, updated: Partial<TodoSchema>) => {
      if (index < 0 || index >= todos.length) return;
      todos[index] = { ...todos[index], ...updated };
      todosVersion++;
    },
    updateTodoItem: (index: number, itemIndex: number, updated: Partial<TodoItem>) => {
      todos[index].todoItems[itemIndex] = {
        ...todos[index].todoItems[itemIndex],
        ...updated
      };
      todosVersion++;
    }
  });

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
