<script lang="ts">
  import NoteContainer from '@/lib/components/note-container.svelte';
  import Checkbox from '@/lib/components/ui/checkbox/checkbox.svelte';
  import { cn } from '../utils';
  import Textarea from './ui/textarea/textarea.svelte';

  const MAX_LINES = 3;

  // const getLineCount = (str: string): number => (str ? str.split(/\r\n|\r|\n/).length : 1);
  const getVisualLineCount = (el: HTMLTextAreaElement): number => {
    const lineHeight = parseInt(getComputedStyle(el).lineHeight, 10) || 20;
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

    const lineHeight = parseInt(getComputedStyle(el).lineHeight, 10) || 20;
    el.style.height = Math.min(el.scrollHeight, lineHeight * MAX_LINES) + 'px';
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const el = e.currentTarget as HTMLTextAreaElement;

    if (e.key.length === 1 || e.key === 'Enter') {
      const originalValue = el.value;
      const originalHeight = el.style.height;

      el.value = originalValue + (e.key === 'Enter' ? '\n' : e.key);
      el.style.height = 'auto';

      if (getVisualLineCount(el) > MAX_LINES) {
        e.preventDefault();
      }

      el.value = originalValue;
      el.style.height = originalHeight;
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData?.getData('Text') || '';
    const el = e.currentTarget as HTMLTextAreaElement;

    el.value = pastedData;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };
</script>

<NoteContainer tableTitle="Today">
  <div class="flex flex-col gap-y-1.5 pb-3">
    {#each { length: 10 } as todo}
      <div class="flex w-full max-w-full items-start gap-x-2 px-2.5">
        <!-- @TODO: make the checkbox feel more analog -->
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
          onkeydown={handleKeyDown}
          onpaste={handlePaste}
          spellcheck="false"
          autocomplete="off"
          rows={1}
        />
      </div>
    {/each}
  </div>
</NoteContainer>
