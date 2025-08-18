<script lang="ts">
  import { onMount } from 'svelte';
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

  let currentIndex = $state(0);
  let isDragging = $state(false);
  let startX = $state(0);
  let currentTranslateX = $state(0);
  let containerEl: HTMLElement | null;

  const normalizeIndex = (index: number) => {
    if (index < 0) return todoCards.length - 1;
    if (index >= todoCards.length) return 0;
    return index;
  };

  const getTransform = (cardIndex: number, offset: number = 0) => {
    if (cardIndex === currentIndex) return offset;
    const prev = normalizeIndex(currentIndex - 1);
    const next = normalizeIndex(currentIndex + 1);

    if (cardIndex === prev) return -100 + offset;
    if (cardIndex === next) return 100 + offset;
    return cardIndex < currentIndex ? -200 + offset : 200 + offset;
  };

  const updateCardPositions = (dragOffset = 0) => {
    todoCards.forEach((_, index) => {
      const card = containerEl?.children[index] as HTMLElement;
      if (card) {
        const transform = getTransform(index, dragOffset);
        card.style.transform = `translateX(${transform}%)`;
      }
    });
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length > 1) return;

    startX = e.touches[0].clientX;
    isDragging = true;
    currentTranslateX = 0;

    todoCards.forEach((_, index) => {
      const card = containerEl?.children[index] as HTMLElement;
      if (card) {
        card.style.transition = 'none';
      }
    });
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || e.touches.length > 1) return;

    e.preventDefault();
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - startX;
    currentTranslateX = (deltaX / containerEl!.offsetWidth) * 100;
    currentTranslateX = Math.max(-100, Math.min(100, currentTranslateX));

    updateCardPositions(currentTranslateX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const threshold = 30;

    if (Math.abs(currentTranslateX) > threshold) {
      if (currentTranslateX > 0) {
        currentIndex = normalizeIndex(currentIndex - 1);
      } else {
        currentIndex = normalizeIndex(currentIndex + 1);
      }
    }

    currentTranslateX = 0;
    isDragging = false;

    todoCards.forEach((_, index) => {
      const card = containerEl?.children[index] as HTMLElement;
      if (card) {
        card.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    });

    updateCardPositions(0);
  };

  onMount(() => {
    updateCardPositions(0);
  });
</script>

<main class="text-sm leading-[1.333] tracking-tight">
  <section
    bind:this={containerEl}
    ontouchstart={handleTouchStart}
    ontouchmove={handleTouchMove}
    ontouchend={handleTouchEnd}
    role="presentation"
    class="relative min-h-dvh max-w-full min-w-full touch-pan-y overflow-hidden bg-slate-50"
  >
    {#each todoCards as { todoTitle, color, bg }, index}
      <div class="absolute inset-0 will-change-transform">
        <TodoMain {todoTitle} containerClass={`${bg}`} {color} />
      </div>
    {/each}

    <div class="absolute bottom-6 left-1/2 z-1 flex -translate-x-1/2 transform space-x-2">
      {#each todoCards as _, index}
        <span
          class={`${index === currentIndex ? 'bg-slate-500' : 'bg-slate-200'} size-2 rounded-full transition-colors duration-200`}
        ></span>
      {/each}
    </div>
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
