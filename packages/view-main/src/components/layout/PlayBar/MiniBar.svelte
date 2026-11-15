<script>
  import { mobileViewport } from '@/shared/browser/mobile.svelte'
  import { setShowPlayDetail } from '@/modules/playDetail/store/commit'
  import Container from './components/Container.svelte'
  import PlayInfo from './components/PlayInfo.svelte'
  import Pic from './components/Pic.svelte'
  import PlayBtns from './components/PlayBtns.svelte'
  import ControlBtns from './components/ControlBtns.svelte'
  import MiniPlayProgress from './components/MiniPlayProgress.svelte'
  // export let params = {}

  // console.log(params)
</script>

<Container padding>
  <Pic />
  {#if mobileViewport.active}
    <button class="mobile-track-open" aria-label="打开播放器" onclick={() => setShowPlayDetail(true)}><PlayInfo /></button>
  {:else}<PlayInfo />{/if}
  <MiniPlayProgress />
  <ControlBtns />
  <PlayBtns />
</Container>
