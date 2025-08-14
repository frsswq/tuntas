<script lang="ts">
  import { makeColorClasses, type ColorKeys } from '@/lib/utils';
  import Input from '../ui/input/input.svelte';

  const colorClasses = makeColorClasses({
    slate: {
      bg: 'bg-white',
      border: 'border-slate-300',
      border_b: 'border-b-slate-300',
      text: 'text-slate-600',
      caret: 'caret-slate-600'
    },
    teal: {
      bg: 'bg-teal-50',
      border: 'border-teal-300',
      border_b: 'border-b-teal-300',
      text: 'text-teal-600',
      caret: 'caret-teal-600'
    },
    sky: {
      bg: 'bg-sky-50',
      border: 'border-sky-300',
      border_b: 'border-b-sky-300',
      text: 'text-sky-600',
      caret: 'caret-sky-600'
    }
  });

  type Color = ColorKeys<typeof colorClasses>;
  let { todoTitle, color = 'slate' }: { todoTitle: string; color?: Color } = $props();
</script>

<div
  class={`flex items-end justify-between border border-transparent ${colorClasses[color].border_b} px-2.5 pt-2 pb-2 tracking-tighter`}
>
  <h1 class={`text-[15px] leading-none font-medium ${colorClasses[color].text}`}>
    {todoTitle}
  </h1>
  <!-- @TODO: make it limit one line instead of maxlength -->
  <Input
    class={`h-4 max-w-[75px] rounded-none border border-transparent ${colorClasses[color].border_b} px-0.5 text-center leading-none ${colorClasses[color].text} ${colorClasses[color].caret} ${colorClasses[color].bg} shadow-none focus-visible:border-transparent focus-visible:${colorClasses[color].border_b} focus-visible:ring-0`}
    maxlength={10}
  />
</div>
