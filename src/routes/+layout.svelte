<script lang="ts">
  import CheckIcon from '@/lib/components/icons/mynaui:check.svelte';
  import { Toaster } from '@/lib/components/ui/sonner/index';
  import '@fontsource-variable/inter';
  import { innerWidth } from 'svelte/reactivity/window';
  import '../app.css';

  let { children } = $props();
</script>

<Toaster
  position={innerWidth.current! < 480 ? 'top-center' : 'top-left'}
  duration={2000}
  offset="20px"
  toastOptions={{
    unstyled: true,
    classes: {
      toast:
        'w-fit flex m-0 items-center bg-white shadow-none border-crisp border-[0.5px] gap-x-1 pl-2 pr-4 py-2 rounded-sm',
      title:
        'text-black text-sm [font-family:"Inter_Variable"] font-medium tracking-tight whitespace-nowrap leading-none select-none'
    }
  }}
>
  {#snippet successIcon()}
    <CheckIcon class="size-5.5 text-black select-none" />
  {/snippet}
</Toaster>

{@render children?.()}
