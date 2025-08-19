<script lang="ts">
  import Checkbox from '@/lib/components/ui/checkbox/checkbox.svelte';
  import { cn } from '@/lib/utils';
  import { colorClasses, type ColorName } from '../../types';
  import Textarea from '../ui/textarea/textarea.svelte';

  interface TodoBodyProps {
    color?: ColorName;
    todoTitle: string;
  }

  let { color = 'slate', todoTitle }: TodoBodyProps = $props();

  const MAX_LINES = 2;

  const getVisualLineCount = (el: HTMLTextAreaElement): number => {
    const lineHeight = parseInt(getComputedStyle(el).lineHeight, 10) || 28;
    const actualHeight = el.scrollHeight;
    return Math.ceil(actualHeight / lineHeight);
  };

  const handleTextareaInput = (e: Event) => {
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
  };
</script>

<div class="flex flex-col pb-3">
  {#each { length: 10 } as _, index}
    <div class="flex w-full max-w-full items-start gap-x-2 px-2.5">
      <Checkbox
        aria-label={`${todoTitle} Checkbox ${index}`}
        class={cn(
          `peer mt-0.5 size-5 rounded-xs border ${colorClasses[color].border} shadow-none`,
          `data-[state=checked]:${colorClasses[color].border} data-[state=checked]:bg-white}`
        )}
      />
      <Textarea
        aria-label={`${todoTitle} Task ${index}`}
        class={cn(
          `min-h-7 w-full resize-none overflow-y-auto rounded-none border-0 bg-transparent px-0.5 py-0 text-lg leading-7 font-[400] tracking-tighter ${colorClasses[color].text} ${colorClasses[color].caret} bg-local shadow-none sm:text-lg`,
          'focus-visible:border-0 focus-visible:ring-0 focus-visible:outline-none'
        )}
        style={`background-image: repeating-linear-gradient(transparent, transparent 1.7rem, var(--color-${color}-300) 1.7rem, var(--color-${color}-300) 1.75rem);`}
        oninput={handleTextareaInput}
        spellcheck="false"
        autocomplete="off"
        rows={1}
      />
    </div>
  {/each}
</div>
