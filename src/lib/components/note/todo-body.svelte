<script lang="ts">
  import { browser } from '$app/environment';
  import Checkbox from '@/lib/components/ui/checkbox/checkbox.svelte';
  import { cn } from '@/lib/utils';
  import { onMount } from 'svelte';
  import { colorClasses, type ColorName } from '../../types';
  import Textarea from '../ui/textarea/textarea.svelte';

  interface TodoBodyProps {
    color?: ColorName;
    todoTitle: string;
  }

  interface TodoItems {
    id: string;
    text: string;
    completed: boolean;
    isRemoving: boolean;
    isReadding: boolean;
  }

  let { color = 'slate', todoTitle }: TodoBodyProps = $props();
  let todos = $state<TodoItems[]>([]);

  onMount(() => {
    if (browser) {
      const stored = localStorage.getItem(`todos-${todoTitle}`);
      if (stored) {
        todos = JSON.parse(stored).map((todo: TodoItems) => ({
          ...todo,
          isRemoving: false,
          isReadding: false
        }));
      } else {
        todos = Array.from({ length: 10 }, (_, index) => ({
          id: `todo-${Date.now()}-${index}`,
          text: '',
          completed: false,
          isRemoving: false,
          isReadding: false
        }));
      }
    }
  });

  $effect(() => {
    if (browser && todos.length > 0) {
      const todosToSave = todos.map(({ id, text, completed }) => ({ id, text, completed }));
      localStorage.setItem(`todos-${todoTitle}`, JSON.stringify(todosToSave));
    }
  });

  const MAX_LINES = 2;

  const getVisualLineCount = (el: HTMLTextAreaElement): number => {
    const lineHeight = parseInt(getComputedStyle(el).lineHeight, 10) || 28;
    const actualHeight = el.scrollHeight;
    return Math.ceil(actualHeight / lineHeight);
  };

  const handleTextareaInput = (e: Event, todoId: string) => {
    const el = e.currentTarget as HTMLTextAreaElement;

    el.style.height = 'auto';
    const visualLines = getVisualLineCount(el);
    if (visualLines > MAX_LINES) {
      while (el.value.length > 0 && getVisualLineCount(el) > MAX_LINES) {
        el.value = el.value.slice(0, -1);
        el.style.height = 'auto';
      }
      el.setSelectionRange(el.value.length, el.value.length);
    }

    const lineHeight = parseInt(getComputedStyle(el).lineHeight, 10) || 28;
    el.style.height = Math.min(el.scrollHeight, lineHeight * MAX_LINES) + 'px';

    const todoIndex = todos.findIndex((t) => t.id === todoId);
    if (todoIndex === -1) return;
    todos[todoIndex].text = el.value;
  };

  const handleCheckboxChange = async (todoId: string, checked: boolean) => {
    if (!checked) return;
    const todoIndex = todos.findIndex((t) => t.id === todoId);
    if (todoIndex === -1) return;
    todos[todoIndex].completed = true;
    todos[todoIndex].isRemoving = true;

    await new Promise((r) => setTimeout(r, 300));

    const emptyTodo = {
      id: `todo-${Date.now()}`,
      text: '',
      completed: false,
      isRemoving: false,
      isReadding: true
    };

    todos[todoIndex] = emptyTodo;

    await new Promise((r) => setTimeout(r, 50));
    todos[todoIndex].isReadding = false;
  };
</script>

<div class="flex flex-col overflow-hidden pb-3">
  {#each todos as todo (todo.id)}
    <div
      class={cn(
        `transition-[transform, opacity] inset-0 flex w-full max-w-full items-start gap-x-2 overflow-hidden bg-transparent bg-clip-border px-2.5 duration-300 ease-out`,
        todo.isRemoving && 'pointer-events-none origin-right scale-95 opacity-0',
        todo.isReadding && 'pointer-events-none -translate-x-10 scale-95 opacity-0',
        !todo.isRemoving && !todo.isReadding && 'origin-left translate-x-0 scale-100 opacity-100'
      )}
    >
      <Checkbox
        aria-label={`${todoTitle} Checkbox ${todo.id}`}
        class={cn(
          `peer mt-0.5 size-5 rounded-xs border ${colorClasses[color].border} shadow-none`,
          `data-[state=checked]:${colorClasses[color].border} data-[state=checked]:bg-white}`
        )}
        iconClass={`size-4 ${colorClasses[color].text}`}
        onCheckedChange={(checked) => handleCheckboxChange(todo.id, checked)}
        checked={todo.completed}
        disabled={todo.isRemoving}
      />
      <Textarea
        aria-label={`${todoTitle} Task ${todo.id}`}
        class={cn(
          `min-h-7 w-full resize-none overflow-y-auto rounded-none border-0 bg-transparent px-0.5 py-0 text-lg leading-7 font-[400] tracking-tighter ${colorClasses[color].text} ${colorClasses[color].caret} bg-local shadow-none sm:text-lg`,
          'focus-visible:border-0 focus-visible:ring-0 focus-visible:outline-none'
        )}
        style={`background-image: repeating-linear-gradient(transparent, transparent 1.7rem, var(--color-${color}-300) 1.7rem, var(--color-${color}-300) 1.75rem);`}
        oninput={(e) => handleTextareaInput(e, todo.id)}
        spellcheck="false"
        autocomplete="off"
        rows={1}
        value={todo.text}
        disabled={todo.isRemoving}
      />
    </div>
  {/each}
</div>
