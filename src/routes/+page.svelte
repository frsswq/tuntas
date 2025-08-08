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

<style>
  section {
    background-color: #f8fafc;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cg fill='%2364748b' fill-opacity='0.05'%3E%3Cpath fill-rule='evenodd' d='M0 0h4v4H0V0zm4 4h4v4H4V4z'/%3E%3C/g%3E%3C/svg%3E");
  }
</style>
