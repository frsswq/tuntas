<script lang="ts">
  import { cn } from '../utils';
  import ChevronLeftIcon from './icons/mynaui:chevron-left.svelte';
  import ChevronRightIcon from './icons/mynaui:chevron-right.svelte';
  import Button from './ui/button/button.svelte';

  import type { Direction } from '../types';

  let { navigateCard }: { navigateCard: (dir: Direction) => void } = $props();
</script>

<div class="absolute top-6 right-6 hidden gap-x-1.5 sm:flex">
  {#each [ChevronLeftIcon, ChevronRightIcon] as Icon, index}
    <Button
      onclick={() => (index % 2 === 0 ? navigateCard('left') : navigateCard('right'))}
      class={cn(
        `border-crisp relative z-10 size-8 cursor-pointer items-center justify-center rounded-sm bg-slate-200/40 p-0 shadow-transparent hover:border-slate-400/80 hover:bg-slate-300/40`
      )}
    >
      <Icon
        class={`size-5 text-slate-500 hover:text-black  ${index % 2 === 0 ? 'mr-0.25' : 'ml-0.25'}`}
      />
    </Button>
  {/each}
</div>
