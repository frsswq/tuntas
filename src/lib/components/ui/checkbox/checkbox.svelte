<script lang="ts">
  import { cn, type WithoutChildrenOrChild } from '$lib/utils.js';
  import { Checkbox as CheckboxPrimitive } from 'bits-ui';
  import XIcon from '../../icons/mynaui:x.svelte';

  type CheckboxProps = WithoutChildrenOrChild<CheckboxPrimitive.RootProps> & {
    iconClass?: string;
  };

  let {
    ref = $bindable(null),
    checked = $bindable(false),
    class: className,
    iconClass = '',
    ...restProps
  }: CheckboxProps = $props();
</script>

<CheckboxPrimitive.Root
  bind:ref
  data-slot="checkbox"
  class={cn(
    'peer border-crisp flex size-4 shrink-0 items-center justify-center rounded-[4px] shadow-xs transition-shadow outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:bg-input/30 dark:aria-invalid:ring-destructive/40 dark:data-[state=checked]:bg-primary',
    className
  )}
  bind:checked
  {...restProps}
>
  {#snippet children({ checked })}
    <div data-slot="checkbox-indicator" class="text-current transition-none">
      {#if checked}
        <XIcon class={iconClass} />
      {/if}
    </div>
  {/snippet}
</CheckboxPrimitive.Root>
