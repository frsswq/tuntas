<script lang="ts">
  import Checkbox from '@/lib/components/ui/checkbox/checkbox.svelte';
  import { cn } from '../utils';
  import Textarea from './ui/textarea/textarea.svelte';

  const MAX_LINES = 3;

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

<div class="flex flex-col gap-y-1.5 pb-3">
  {#each { length: 10 } as todo}
    <div class="flex w-full max-w-full items-start gap-x-2 px-2.5">
      <Checkbox
        class={cn(
          'peer mt-1 size-5 rounded-xs border border-slate-300 shadow-none',
          'data-[state=checked]:border-slate-500 data-[state=checked]:bg-white'
        )}
      />
      <Textarea
        class={cn(
          'lined-background min-h-7 w-full resize-none overflow-y-auto rounded-none border-0 bg-transparent px-0.5 py-0 text-lg leading-7 font-[400] tracking-tighter text-slate-600 caret-slate-600 shadow-none sm:text-lg',
          'transition-all duration-200 ease-out',
          'focus-visible:border-0 focus-visible:ring-0 focus-visible:outline-none'
        )}
        oninput={handleTextareaInput}
        spellcheck="false"
        autocomplete="off"
        rows={1}
      />
    </div>
  {/each}
</div>
