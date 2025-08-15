<script lang="ts">
  let { children = null, tableTitle } = $props();
</script>

<div
  class="border-crisp flex h-full min-h-[150px] w-full max-w-[250px] flex-col gap-y-1.5 rounded-md bg-white"
>
  <p
    class="border border-transparent border-b-slate-300 px-2.5 py-2 leading-none font-medium tracking-tighter text-slate-500"
  >
    {tableTitle}
  </p>
  {@render children?.()}
</div>
