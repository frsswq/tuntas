<script lang="ts">
  import NoteBody from '@/lib/components/note-body.svelte';
</script>

<main class="text-sm leading-[1.333] tracking-tight">
  <section
    class="flex min-h-dvh w-full items-center justify-center overflow-x-scroll bg-slate-50 p-8 sm:py-20"
  >
    <div class="flex w-full max-w-[1440px] items-stretch justify-center gap-x-3">
      <NoteBody />
    </div>
  </section>
</main>

<style>
  section {
    background-color: #f8fafc;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%2364748b' fill-opacity='0.1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
  }
</style>
