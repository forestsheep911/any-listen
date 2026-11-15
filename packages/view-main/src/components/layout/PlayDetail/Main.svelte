<script lang="ts">
  import { mobileViewport } from '@/shared/browser/mobile.svelte'
  let lyrics = $state(false)
  import LeftInfo from './LeftInfo/index.svelte'
  import RightLyric from './RightLyric/index.svelte'

  let { introend }: { introend: boolean } = $props()
</script>

{#if mobileViewport.active}
  <div class="mobile-player-tabs" role="group" aria-label="播放视图">
    <button aria-pressed={!lyrics} onclick={() => lyrics = false}>封面</button>
    <button aria-pressed={lyrics} onclick={() => lyrics = true}>歌词</button>
  </div>
{/if}
<div class="player-detail-main" class:mobile-lyrics={lyrics}>
  <LeftInfo />
  <RightLyric {introend} />
</div>

<style lang="less">
  .player-detail-main {
    // margin: 0 20px;
    position: relative;
    display: flex;
    flex: auto;
    min-height: 0;
    overflow: hidden;
  }
</style>
