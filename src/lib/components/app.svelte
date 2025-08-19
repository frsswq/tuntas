<script lang="ts">
  import { onMount } from 'svelte';
  import { type ColorName } from '../types';
  import TodoMain from './note/todo-main.svelte';

  type Direction = 'none' | 'left' | 'right';

  interface TodoCard {
    todoTitle: string;
    color: ColorName;
    bg: string;
  }

  const CARDS: TodoCard[] = [
    { todoTitle: 'Today', color: 'slate', bg: 'bg-white' },
    { todoTitle: 'Next', color: 'teal', bg: 'bg-teal-50' },
    { todoTitle: 'Someday', color: 'sky', bg: 'bg-sky-50' }
  ];

  const TRANSITION_DURATION = 300;
  const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
  const DRAGGING_THRESHOLD = 10;

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
      } else {
        // redundant but whatever
        card.style.display = index === currentIndex ? 'block' : 'none';
      }
    });
  };

  const handleTransitionEnd = () => {
    if (!isTransitioning) return;
    if (isDragging) return;

    CARDS.forEach((_, index) => {
      const card = carouselEl?.children[index] as HTMLElement;
      if (!card || index === currentIndex) return;
      card.style.display = 'none';
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

    CARDS.forEach((_, index) => {
      const card = carouselEl?.children[index] as HTMLElement;
      if (!card) return;
      card.style.transition = 'none';
    });

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

    CARDS.forEach((_, index) => {
      const card = carouselEl?.children[index] as HTMLElement;
      if (!card) return;
      card.style.transition = `transform ${TRANSITION_DURATION}ms ${EASING}`;
      card.addEventListener('transitionend', handleTransitionEnd, { once: true });
    });

    updateCardPositions(0);

    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();

    const direction: Direction = e.key === 'ArrowLeft' ? 'left' : 'right';
    const nextIndex =
      direction === 'left' ? normalizeIndex(currentIndex - 1) : normalizeIndex(currentIndex + 1);

    if (!carouselEl) return;

    isTransitioning = true;

    CARDS.forEach((_, index) => {
      const card = carouselEl?.children[index] as HTMLElement;
      if (!card) return;

      card.style.transition = 'none';
      const startTransform = getTransform(index, 0);
      card.style.transform = `translateX(${startTransform}%)`;
      card.style.display = index === currentIndex || index === nextIndex ? 'block' : 'none';
    });

    // why this offsetWidth work idk
    carouselEl.offsetWidth;

    CARDS.forEach((_, index) => {
      const card = carouselEl?.children[index] as HTMLElement;
      if (!card) return;
      card.style.transition = `transform ${TRANSITION_DURATION}ms ${EASING}`;
      card.addEventListener('transitionend', handleTransitionEnd, { once: true });
    });

    currentIndex = nextIndex;
    updateCardPositions(0, direction);
  };

  onMount(() => {
    if (carouselEl) {
      updateCardPositions(0);
    }
  });
</script>

<svelte:document onkeydown={handleKeyDown} />

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
    class="relative min-h-dvh max-w-full min-w-full cursor-grab touch-pan-y overflow-hidden bg-slate-50 {isDragging &&
      'cursor-grabbing'}"
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
  <div class="absolute bottom-6 left-1/2 z-1 flex -translate-x-1/2 transform space-x-2">
    {#each CARDS as _, index}
      <span
        class={`${index === currentIndex ? 'bg-slate-400' : 'bg-slate-200'} border-crisp size-2 rounded-full transition-colors duration-200`}
      ></span>
    {/each}
  </div>
</main>

<style>
  #carousel {
    background-color: #f8fafc;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%2364748b' fill-opacity='0.1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: auto;
    transform: translateZ(0);
  }
</style>
