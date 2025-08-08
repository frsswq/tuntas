<script lang="ts">
  import Checkbox from '@/lib/components/ui/checkbox/checkbox.svelte';
  import Label from '@/lib/components/ui/label/label.svelte';
  import TableContainer from '../lib/components/table-container.svelte';

  const randTaskId = `task-${Math.random().toString(36).slice(2, 9)}`;
</script>

<main class="text-sm leading-[1.333] tracking-tight">
  <section
    class="flex min-h-dvh w-full items-center justify-center overflow-x-scroll bg-slate-50 p-20"
  >
    <div class="flex w-full max-w-[1440px] items-stretch justify-center gap-x-3">
      <TableContainer tableTitle="To Do">
        <div class="flex flex-col gap-y-1.5 px-1">
          <div class="flex items-center gap-x-1.5 rounded-sm border p-1.5">
            <Checkbox id={randTaskId} class="peer shadow-none" />
            <Label
              for={randTaskId}
              class="cursor-pointer text-[13px] text-slate-800 peer-data-[state=checked]:line-through "
              >Task 1</Label
            >
          </div>
          <Checkbox class="shadow-none" />
        </div>
      </TableContainer>
      <TableContainer tableTitle="Doing" />
      <TableContainer tableTitle="Done" />
    </div>
  </section>
</main>

<style>
  section {
    background-color: #f8fafc;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%2364748b' fill-opacity='0.1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
  }
</style>
