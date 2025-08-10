<script lang="ts">
  import NoteContainer from '@/lib/components/note-container.svelte';
  import Checkbox from '@/lib/components/ui/checkbox/checkbox.svelte';
  import Input from '@/lib/components/ui/input/input.svelte';
</script>

<main class="text-sm leading-[1.333] tracking-tight">
  <section
    class="flex min-h-dvh w-full items-center justify-center overflow-x-scroll bg-slate-50 p-20"
  >
    <div class="flex w-full max-w-[1440px] items-stretch justify-center gap-x-3">
      <NoteContainer tableTitle="Today">
        <div class="flex flex-col gap-y-2.5 pb-5">
          {#each { length: 10 } as todo}
            <div class="flex w-full items-center gap-x-2 px-2.5">
              <!-- @TODO: make the checkbox feel more analog -->
              <Checkbox class="peer size-5 rounded-full border border-slate-300 shadow-none" />
              <Input
                class="handwritten h-5.5 w-full rounded-none border border-transparent border-b-slate-300 px-0.5 text-lg text-slate-700 caret-slate-500 shadow-none focus-visible:border-transparent focus-visible:border-b-slate-300 focus-visible:ring-0  md:text-lg"
              />
            </div>
          {/each}
        </div>
      </NoteContainer>
    </div>
  </section>
</main>

<style>
  section {
    background-color: #f8fafc;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%2364748b' fill-opacity='0.1' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
  }
</style>
