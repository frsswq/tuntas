<script lang="ts">
  import type { TodoCard } from '../../types';

  let { currentIndex, TODOS }: { currentIndex: number; TODOS: TodoCard[] } = $props();
</script>

<div aria-live="polite" aria-atomic="true" class="sr-only">
  {TODOS[currentIndex].todoTitle} Card
</div>
<div class="absolute top-6 left-6 flex flex-col space-y-2">
  {#each TODOS as _, index}
    <span
      class={`${index === currentIndex ? 'bg-slate-400' : 'bg-slate-200'} border-crisp z-10 size-2 rounded-full p-0 transition-colors duration-200`}
    ></span>
  {/each}
</div>
