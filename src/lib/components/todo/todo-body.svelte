<script lang="ts">
  import Checkbox from '@/lib/components/ui/checkbox/checkbox.svelte';
  import { colorClasses, type TodoBodyProps } from '@/lib/types';
  import { cn } from '@/lib/utils';
  import { onMount } from 'svelte';
  import Textarea from '../ui/textarea/textarea.svelte';
  import {
    handleCheckboxChange,
    handleTextareaInput,
    handleTextareaKeydown,
    resizeTextArea
  } from './todo-body';

  let { color = 'slate', todoTitle, todoItems = $bindable([]) }: TodoBodyProps = $props();

  onMount(() => {
    const textareas = document.querySelectorAll(`textarea[aria-label*="${todoTitle} Task"]`);
    textareas.forEach((textarea) => {
      if (textarea instanceof HTMLTextAreaElement && textarea.value.trim()) {
        resizeTextArea(textarea);
      }
    });
  });
</script>

<div class="flex flex-col overflow-hidden pb-3">
  {#each todoItems as todo (todo.id)}
    <div
      role="group"
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
        onCheckedChange={(checked) => handleCheckboxChange(checked, todo)}
        disabled={todo.isRemoving || todo.isReadding}
      />
      <Textarea
        data-id={todo.id}
        aria-label={`${todoTitle} Task ${todo.id}`}
        class={cn(
          `min-h-7 w-full resize-none overflow-y-auto rounded-none border-0 bg-transparent px-0.5 py-0 text-lg leading-7 font-[400] tracking-tighter ${colorClasses[color].text} ${colorClasses[color].caret} bg-local shadow-none sm:text-lg`,
          'focus-visible:border-0 focus-visible:ring-0 focus-visible:outline-none'
        )}
        style={`background-image: repeating-linear-gradient(transparent, transparent 1.7rem, var(--color-${color}-300) 1.7rem, var(--color-${color}-300) 1.75rem);`}
        oninput={(e) => handleTextareaInput(e, todo)}
        onkeydown={(e) => handleTextareaKeydown(e)}
        spellcheck="false"
        autocomplete="off"
        rows={1}
        bind:value={todo.text}
        disabled={todo.isRemoving || todo.isReadding}
      />
    </div>
  {/each}
</div>
