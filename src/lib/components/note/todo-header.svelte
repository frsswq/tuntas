<script lang="ts">
  import { cn } from '@/lib/utils';
  import { colorClasses, type ColorName } from '../../types';
  import Input from '../ui/input/input.svelte';

  interface TodoHeaderProps {
    todoTitle: string;
    todoHeader: string;
    color?: ColorName;
  }

  let { todoTitle, todoHeader = $bindable(''), color = 'slate' }: TodoHeaderProps = $props();
</script>

<div
  class={`flex items-end justify-between border border-transparent ${colorClasses[color].border_b} px-2.5 pt-2 pb-2 tracking-tighter`}
>
  <h1 class={`text-[15px] leading-none font-medium ${colorClasses[color].text}`}>
    {todoTitle}
  </h1>
  <label for={`${todoTitle}-detail`} class="sr-only">{todoTitle} Detail</label>
  <!-- @TODO: make it limit one line instead of maxlength -->
  <!-- @TODO: fix input bottom border disappearing on focus -->
  <Input
    id={`${todoTitle}-detail`}
    class={cn(
      `h-4 max-w-[75px] rounded-none border-0 border-b-1 ${colorClasses[color].border_b} px-0.5 text-center leading-none ${colorClasses[color].text} ${colorClasses[color].caret} ${colorClasses[color].bg} shadow-none  focus-visible:ring-0 focus-visible:${colorClasses[color].border_b}`
    )}
    bind:value={todoHeader}
  />
</div>
