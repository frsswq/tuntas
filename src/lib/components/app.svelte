<script lang="ts">
  import { onMount } from 'svelte';
  import type { TodoCard } from '../types';
  import { cn } from '../utils';
  import ChevronLeftIcon from './icons/mynaui:chevron-left.svelte';
  import ChevronRightIcon from './icons/mynaui:chevron-right.svelte';
  import TodoMain from './todo/todo-main.svelte';
  import Button from './ui/button/button.svelte';

  type Direction = 'none' | 'left' | 'right';

  const CARDS: TodoCard[] = [
    { todoTitle: 'Today', color: 'slate', bg: 'bg-white' },
    { todoTitle: 'Next', color: 'teal', bg: 'bg-teal-50' },
    { todoTitle: 'Someday', color: 'sky', bg: 'bg-sky-50' }
  ];

  const TRANSITION_DURATION = 300;
  const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
  const DRAGGING_THRESHOLD = 15;

  let currentIndex = $state(0);
  let isDragging = $state(false);
  let isTransitioning = $state(false);
  let startX = $state(0);
  let currentTranslateX = $state(0);
  let carouselEl: HTMLElement | null;

  const normalizeIndex = (index: number) => {
    if (index < 0) return CARDS.length - 1;
    if (index >= CARDS.length) return 0;
    return index;
  };

  const getTransform = (cardIndex: number, offset: number = 0) => {
    const prev = normalizeIndex(currentIndex - 1);
    const next = normalizeIndex(currentIndex + 1);

    if (cardIndex === currentIndex) return offset;
    if (cardIndex === prev) return -100 + offset;
    if (cardIndex === next) return 100 + offset;

    return cardIndex < currentIndex ? -200 + offset : 200 + offset;
  };

  const isInteractiveTarget = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return false;
    return !!target.closest(
      'a, button, input, textarea, select, [role="button"], [contenteditable], [data-no-drag]'
    );
  };

  const forEachCard = (callback: (card: HTMLElement, index: number) => void) => {
    if (!carouselEl) return;
    CARDS.forEach((_, index) => {
      const card = carouselEl?.children[index] as HTMLElement;
      if (card) callback(card, index);
    });
  };

  const setupTransition = (enable: boolean, onEnd?: () => void) => {
    forEachCard((card) => {
      card.style.transition = enable ? `transform ${TRANSITION_DURATION}ms ${EASING}` : 'none';
      if (enable && onEnd) {
        card.addEventListener('transitionend', onEnd, { once: true });
      }
    });
  };

  const updateCardPositions = (dragOffset = 0, direction: Direction = 'none') => {
    if (!carouselEl) return;

    CARDS.forEach((_, index) => {
      const card = carouselEl?.children[index] as HTMLElement;

      if (!card) return;
      const prev = normalizeIndex(currentIndex - 1);
      const next = normalizeIndex(currentIndex + 1);

      const transform = getTransform(index, dragOffset);
      card.style.transform = `translateX(${transform}%)`;

      if (dragOffset > 0 || direction === 'right') {
        card.style.display = index === currentIndex || index === prev ? 'block' : 'none';
      } else if (dragOffset < 0 || direction === 'left') {
        card.style.display = index === currentIndex || index === next ? 'block' : 'none';
      }
    });
  };

  const handleTransitionEnd = () => {
    if (!isTransitioning) return;
    if (isDragging) return;

    forEachCard((card, index) => {
      if (index !== currentIndex) {
        card.style.display = 'none';
      }
    });

    isTransitioning = false;
  };

  const getClientX = (e: TouchEvent | MouseEvent) => {
    return 'touches' in e ? e.touches[0]?.clientX : e.clientX;
  };

  const handleDragStart = (e: TouchEvent | MouseEvent) => {
    if (isInteractiveTarget(e.target)) return;

    if ('touches' in e && e.touches.length > 1) return;

    const clientX = getClientX(e);
    if (clientX === undefined) return;

    e.preventDefault();

    startX = clientX;
    isDragging = true;
    isTransitioning = true;
    currentTranslateX = 0;

    setupTransition(false);

    if (!('touches' in e)) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
    }
  };

  const handleDragMove = (e: TouchEvent | MouseEvent) => {
    if (!isDragging) return;
    if ('touches' in e && e.touches.length > 1) return;

    const clientX = getClientX(e);
    if (clientX === undefined) return;

    e.preventDefault();
    const deltaX = clientX - startX;
    currentTranslateX = (deltaX / carouselEl!.offsetWidth) * 100;
    currentTranslateX = Math.max(-100, Math.min(100, currentTranslateX));
    updateCardPositions(currentTranslateX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    if (Math.abs(currentTranslateX) > DRAGGING_THRESHOLD) {
      if (currentTranslateX > 0) {
        currentIndex = normalizeIndex(currentIndex - 1);
      } else {
        currentIndex = normalizeIndex(currentIndex + 1);
      }
    }

    currentTranslateX = 0;
    isDragging = false;

    setupTransition(true, handleTransitionEnd);
    updateCardPositions(0);

    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  const navigateCard = (direction: Direction) => {
    if (isTransitioning || isDragging) return;

    const nextIndex =
      direction === 'left' ? normalizeIndex(currentIndex - 1) : normalizeIndex(currentIndex + 1);

    if (!carouselEl) return;

    forEachCard((card, index) => {
      card.style.transition = 'none';
      const startTransform = getTransform(index, 0);
      card.style.transform = `translateX(${startTransform}%)`;
      card.style.display = index === currentIndex || index === nextIndex ? 'block' : 'none';
    });

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!carouselEl) return;

        isTransitioning = true;
        setupTransition(true, handleTransitionEnd);
        currentIndex = nextIndex;
        updateCardPositions(0, direction);
      });
    });
  };

  onMount(() => {
    if (carouselEl) {
      updateCardPositions(0);
    }
  });
</script>

<main class="text-sm leading-[1.333] tracking-tight">
  <section
    id="carousel"
    bind:this={carouselEl}
    ontouchstart={handleDragStart}
    ontouchmove={handleDragMove}
    ontouchend={handleDragEnd}
    onmousedown={handleDragStart}
    role="presentation"
    aria-label="Todo cards carousel"
    aria-roledescription="carousel"
    class="relative min-h-dvh max-w-full min-w-full cursor-grab touch-pan-y overflow-x-hidden overflow-y-scroll {isDragging &&
      'cursor-grabbing touch-pan-y'}"
  >
    {#each CARDS as { todoTitle, color, bg }, index}
      <div
        class={`${index === currentIndex ? 'block' : 'hidden'} absolute inset-0 z-1 will-change-transform`}
      >
        <TodoMain {todoTitle} containerClass={`${bg}`} {color} />
      </div>
    {/each}
  </section>
  <div aria-live="polite" aria-atomic="true" class="sr-only">
    {CARDS[currentIndex].todoTitle} Card
  </div>
  <div class="absolute top-6 left-7 z-1 flex -translate-x-1/2 transform flex-col space-y-2">
    {#each CARDS as _, index}
      <span
        class={`${index === currentIndex ? 'bg-slate-400' : 'bg-slate-200'} border-crisp size-2 rounded-full  p-0 transition-colors duration-200`}
      ></span>
    {/each}
  </div>
  {#each { length: 2 } as _, index}
    <Button
      onclick={() => (index % 2 === 0 ? navigateCard('left') : navigateCard('right'))}
      class={cn(
        `border-crisp absolute top-[50dvh] z-1 flex size-6 cursor-pointer items-center justify-center rounded-full border-none bg-transparent shadow-transparent hover:border-1 hover:border-slate-500 hover:bg-transparent`,
        index % 2 === 0 ? 'left-6' : 'right-6'
      )}
    >
      {#if index % 2 === 0}
        <ChevronLeftIcon class="inline-flex size-5 bg-transparent  text-slate-500" />
      {:else}
        <ChevronRightIcon class="inline-flex size-5 bg-transparent text-slate-500" />
      {/if}
    </Button>
  {/each}
</main>

<style>
  #carousel {
    background-color: var(--color-slate-50);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%2364748b' fill-opacity='0.1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: auto;
    transform: translateZ(0);
  }
</style>
