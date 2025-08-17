<script lang="ts">
  import { swipe, type SwipeCustomEvent } from 'svelte-gestures';
  import type { ColorName } from '../types';
  import TodoMain from './note/todo-main.svelte';

  let direction;
  let target;
  let pointerType;

  // @TODO: swipe left to prev, swipe right to next, sync the translate-x
  //        to the current todo and prev / next todo

  const handler = (event: SwipeCustomEvent) => {
    direction = event.detail.direction;
    target = event.detail.target;
    pointerType = event.detail.pointerType;

    if (direction === 'right') {
    } else if (direction === 'left') {
    }
  };

  const title = ['Today', 'Next', 'Someday'];
  const color: ColorName[] = ['slate', 'teal', 'sky'];
  const bg = ['bg-white', 'bg-teal-50', 'bg-sky-50'];
  let positions = $state([0, 1, 2]);
</script>

<main class="text-sm leading-[1.333] tracking-tight">
  <!-- @TODO: Swipe to change current note -->
  <section
    class="flex min-h-dvh w-full max-w-full min-w-full items-center justify-center overflow-hidden bg-slate-50"
    use:swipe={() => ({ timeframe: 300, minSwipeDistance: 60 })}
    onswipe={handler}
  >
    {#each positions as pos, index}
      <TodoMain
        todoTitle={title[2 - index]}
        containerClass={bg[2 - index]}
        color={color[2 - index]}
      />
    {/each}
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
