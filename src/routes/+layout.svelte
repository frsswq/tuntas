<script lang="ts">
  import '@fontsource-variable/inter';
  import '../app.css';

  let { children } = $props();

  // const session = authClient.useSession();

  // $effect(() => {
  //   if (!$session.data?.user?.id && !$session.isPending && !$session.isRefetching) {
  //     goto('/');
  //   }
  // });
</script>

{@render children?.()}
