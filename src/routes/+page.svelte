<script lang="ts">
  import TableContainer from '../components/table-container.svelte';
</script>

<main class="text-sm leading-[1.333] tracking-tighter">
  <section
    class="flex min-h-dvh w-full items-center justify-center overflow-x-scroll bg-slate-50 p-20"
  >
    <div class="flex w-full max-w-[1440px] items-stretch justify-center gap-x-3">
      <TableContainer tableTitle="To Do" />
      <TableContainer tableTitle="Doing" />
      <TableContainer tableTitle="Done" />
    </div>
  </section>
</main>
