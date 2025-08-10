<script lang="ts">
  import Input from './ui/input/input.svelte';
  let { children = null, tableTitle } = $props();
</script>

<div class="border-crips flex h-full w-full max-w-[300px] flex-col gap-y-2.5 rounded-md bg-white">
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
