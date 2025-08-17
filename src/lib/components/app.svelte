<script lang="ts">
  import { swipe, type SwipeCustomEvent } from 'svelte-gestures';
  import { type ColorName } from '../types';
  import TodoMain from './note/todo-main.svelte';

  interface TodoCards {
    todoTitle: string;
    color: ColorName;
    bg: string;
  }

  const todoCards: TodoCards[] = [
    { todoTitle: 'Today', color: 'slate', bg: 'bg-white' },
    { todoTitle: 'Next', color: 'teal', bg: 'bg-teal-50' },
    { todoTitle: 'Someday', color: 'sky', bg: 'bg-sky-50' }
  ];

  let direction;
  let target;
  let pointerType;
  let currentIndex = 0;

  const normalizeIndex = (index: number) => {
    if (index < 0) return todoCards.length - 1;
    if (index >= todoCards.length) return 0;
  };

  const getTransform = (cardIndex: number) => {
    if (cardIndex === currentIndex) return 0;
    const prev = normalizeIndex(currentIndex - 1);
    const next = normalizeIndex(currentIndex + 1);

    if (cardIndex === prev) return -100;
    if (cardIndex === next) return 100;
    return -200;
  };

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
</script>

<svelte:window use:swipe={() => ({ timeframe: 300, minSwipeDistance: 60 })} onswipe={handler} />

<main class="text-sm leading-[1.333] tracking-tight">
  <!-- @TODO: Swipe to change current note -->
  <section class="absolute min-h-dvh w-full max-w-full overflow-hidden bg-slate-50">
    {#each todoCards as { todoTitle, color, bg }, index}
      <TodoMain {todoTitle} containerClass={`${bg}`} {color} x={getTransform(index)} />
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
