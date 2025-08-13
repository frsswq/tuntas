<script lang="ts">
  import { cn } from '../utils';
  import Input from './ui/input/input.svelte';
  let { children = null, tableTitle, containerClass = '' } = $props();
</script>

<div
  class={cn(
    'border-crips flex h-full w-full max-w-full flex-col gap-y-1.5 rounded-md bg-white sm:max-w-[325px]',
    containerClass
  )}
>
  <div
    class="flex items-end justify-between border border-transparent border-b-slate-300 px-2.5 pt-2 pb-2 tracking-tighter"
  >
    <h1 class="text-[15px] leading-none font-medium text-slate-500">
      {tableTitle}
    </h1>
    <Input
      class="h-4 max-w-[75px] rounded-none border border-transparent border-b-slate-300 px-0.5 text-center leading-none text-slate-500 caret-slate-500 shadow-none focus-visible:border-transparent focus-visible:border-b-slate-300 focus-visible:ring-0"
      maxlength={10}
    />
  </div>
  {@render children?.()}
</div>
