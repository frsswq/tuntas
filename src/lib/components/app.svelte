<script lang="ts">
  import type { ColorName } from '../types';
  import TodoMain from './note/todo-main.svelte';
  const title = ['Today', 'Next', 'Someday'];
  const color: ColorName[] = ['slate', 'teal', 'sky'];
  const bg = ['bg-white', 'bg-teal-50', 'bg-sky-50'];

  let positions = [0, 1, 2];

  function cycleCards() {
    positions = [...positions.slice(1), positions[0]];
  }
</script>

<main class="text-sm leading-[1.333] tracking-tight">
  <!-- @TODO: Fix mobile absolute positioning -->
  <section
    class="flex min-h-dvh w-full min-w-dvw items-center justify-center overflow-x-scroll bg-slate-50 p-8"
  >
    {#each positions as pos, index}
      <TodoMain
        todoTitle={title[2 - index]}
        color={color[2 - index]}
        x={(1 - pos) * 20}
        y={(pos - 1) * 20}
        z={pos}
        containerClass={bg[2 - index]}
      />
    {/each}

    <button
      on:click={cycleCards}
      class="border-crips absolute bottom-4 left-4 rounded border bg-white px-3 py-3 hover:bg-slate-50"
    >
      Cycle
    </button>
  </section>
</main>

<style>
  section {
    background-color: #f8fafc;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%2364748b' fill-opacity='0.1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: auto;
    transform: translateZ(0);
  }
</style>
