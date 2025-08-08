<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  import '../app.css';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<nav class="crisp-border sticky top-0 z-10 h-16 bg-white"></nav>

{@render children?.()}
