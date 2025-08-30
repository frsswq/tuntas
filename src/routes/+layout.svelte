<script lang="ts">
  import { Toaster } from '@/lib/components/ui/sonner/index';
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

<Toaster />

{@render children?.()}
