<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  import '@fontsource-variable/inter';
  import '@fontsource/iansui';
  import '../app.css';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}

<style>
  :global(body) {
    font-family: 'Inter Variable', sans-serif;
    font-feature-settings:
      'liga' 1,
      'calt' 1;
  }
</style>
