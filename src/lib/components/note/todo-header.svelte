<script lang="ts">
  import { colorClasses, type ColorName } from '../../types';
  import Input from '../ui/input/input.svelte';

  let { todoTitle, color = 'slate' }: { todoTitle: string; color?: ColorName } = $props();
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
