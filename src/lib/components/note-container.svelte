<script lang="ts">
  import Input from './ui/input/input.svelte';
  let { children = null, tableTitle } = $props();
</script>

<div
  class="border-crips flex h-full min-h-[450px] w-full max-w-[400px] flex-col gap-y-1.5 rounded-md bg-white"
>
  <div
    class="flex items-center justify-between border border-transparent border-b-slate-300 px-2.5 py-2 leading-none tracking-tighter"
  >
    <h1 class="font-medium text-slate-500">
      {tableTitle}
    </h1>
    <Input
      class="h-4 max-w-[75px] rounded-none border border-transparent border-b-slate-300 px-0.5 text-center text-slate-500 caret-slate-500 shadow-none focus-visible:border-transparent focus-visible:border-b-slate-300 focus-visible:ring-0"
      maxlength={10}
    />
  </div>
  {@render children?.()}
</div>
