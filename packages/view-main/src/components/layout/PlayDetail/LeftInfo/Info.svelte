<script lang="ts">
  import { mobileViewport } from '@/shared/browser/mobile.svelte'
  import { musicInfo } from '@/modules/player/reactive.svelte'
  import { t } from '@/plugins/i18n'
</script>

<div class="scroll info">
  {#if mobileViewport.active}
    <h2 class="mobile-full-title">{$musicInfo.name || 'Any Listen'}</h2>
    <p class="mobile-full-artist">{$musicInfo.singer}</p>
  {:else}
  <p><span>{$t('play_detail.music_name')}</span>{$musicInfo.name}</p>
  <p><span>{$t('play_detail.music_singer')}</span>{$musicInfo.singer}</p>
  {#if $musicInfo.album}
    <p><span>{$t('play_detail.music_album')}</span>{$musicInfo.album}</p>
  {/if}
  {/if}
</div>

<style lang="less">
  .info {
    flex: auto;
    width: var(--content-width);
    // padding-bottom: 15px;
    min-height: 0;
    margin-top: 15px;
    p {
      font-size: 16px;
      line-height: 1.5;
      overflow-wrap: break-word;

      span {
        font-size: 14px;
        color: var(--color-font-label);
      }
    }
  }
</style>
