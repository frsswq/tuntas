<script lang="ts">
  import Input from '../ui/input/input.svelte';
  let { todoTitle, color = 'slate' } = $props();
</script>

<div
  class={`flex items-end justify-between border border-transparent border-b-${color}-300 px-2.5 pt-2 pb-2 tracking-tighter`}
>
  <h1 class={`text-[15px] leading-none font-medium text-${color}-500`}>
    {todoTitle}
  </h1>
  <!-- @TODO: make it limit one line instead of maxlength -->
  <Input
    class={`h-4 max-w-[75px] rounded-none border border-transparent border-b-${color}-300 px-0.5 text-center leading-none text-${color}-500 caret-${color}-500 shadow-none focus-visible:border-transparent focus-visible:border-b-${color}-300 focus-visible:ring-0`}
    maxlength={10}
  />
</div>
