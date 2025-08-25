<script lang="ts">
  import { onMount } from 'svelte';
  import type { Direction, TodoCard, TodoSchema } from '../types';
  import DeleteTodo from './delete-todo.svelte';
  import DotsIndicator from './dots-indicator.svelte';
  import NavigateButton from './navigate-button.svelte';
  import TodoMain from './todo/todo-main.svelte';

  const TODO: TodoCard[] = [
    { todoTitle: 'Today', color: 'slate', bg: 'bg-white' },
    { todoTitle: 'Next', color: 'teal', bg: 'bg-teal-50' },
    { todoTitle: 'Someday', color: 'sky', bg: 'bg-sky-50' }
  ];

  const TRANSITION_DURATION = 300;
  const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
  const DRAGGING_THRESHOLD = 15;

  let todoDataArray = $state<TodoSchema[]>(
    TODO.map(({ todoTitle }) => ({
      id: `todos-${todoTitle}`,
      todoHeader: '',
      todoItems: []
    }))
  );

  let currentIndex = $state(0);
  let isDragging = $state(false);
  let isTransitioning = $state(false);
  let isPointerDown = $state(false);
  let startX = $state(0);
  let currentTranslateX = $state(0);
  let carouselEl: HTMLElement | null;

  const normalizeIndex = (index: number) => {
    if (index < 0) return TODO.length - 1;
    if (index >= TODO.length) return 0;
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
    TODO.forEach((_, index) => {
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

    TODO.forEach((_, index) => {
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

  const handlePointerDown = (e: PointerEvent) => {
    if (isInteractiveTarget(e.target)) return;
    if (e.isPrimary === false) return;

    e.preventDefault();

    startX = e.clientX;
    currentTranslateX = 0;
    isPointerDown = true;

    carouselEl?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isPointerDown || e.isPrimary === false) return;

    e.preventDefault();

    const deltaX = e.clientX - startX;

    if (!isDragging && Math.abs(deltaX) > 3) {
      isDragging = true;
      isTransitioning = true;
      setupTransition(false);
    }

    if (!isDragging) return;

    currentTranslateX = (deltaX / carouselEl!.offsetWidth) * 100;
    currentTranslateX = Math.max(-100, Math.min(100, currentTranslateX));
    updateCardPositions(currentTranslateX);
  };

  const handlePointerUp = (e: PointerEvent) => {
    if (!isPointerDown || e.isPrimary === false) return;

    isPointerDown = false;

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

  const clearCurrentTodo = () => {
    todoDataArray[currentIndex].todoHeader = '';
    todoDataArray[currentIndex].todoItems = Array.from({ length: 10 }, (_, index) => ({
      id: `todo-${Date.now()}-${index}`,
      text: '',
      isRemoving: false,
      isReadding: false
    }));
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
    onpointerdown={handlePointerDown}
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
    role="presentation"
    aria-label="Todo TODO carousel"
    aria-roledescription="carousel"
    class="relative min-h-dvh max-w-full min-w-full cursor-grab touch-pan-y overflow-x-hidden overflow-y-scroll {isDragging &&
      'cursor-grabbing touch-pan-y'}"
  >
    {#each TODO as { todoTitle, color, bg }, index}
      <div
        class={`${index === currentIndex ? 'block' : 'hidden'} absolute inset-0 z-1 will-change-transform`}
      >
        <TodoMain
          {todoTitle}
          containerClass={`${bg}`}
          {color}
          bind:todoData={todoDataArray[index]}
        />
      </div>
    {/each}
  </section>
  <NavigateButton {navigateCard} />
  <DotsIndicator {currentIndex} {TODO} />
  <DeleteTodo {clearCurrentTodo} />
</main>

<style>
  #carousel {
    background-color: var(--color-slate-100);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%2364748b' fill-opacity='0.1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: auto;
    transform: translateZ(0);
  }
</style>
