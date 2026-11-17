<script lang="ts">
  import { t } from '@/plugins/i18n'
  import { mobileViewport } from '@/shared/browser/mobile.svelte'
  import { showListEditModal } from '@/components/apis/listEditModal'
  // console.log(params)
</script>

<div class="container" data-mobile-playlist-tools>
  <h2>{$t('my_list')}</h2>
  {#if mobileViewport.active}
    <button onclick={() => { void showListEditModal() }}>新建歌单</button>
  {/if}
</div>

<style lang="less">
  .container {
    flex: none;
    // display: flex;
    // flex-flow: row nowrap;
    // align-items: center;
    padding: 6px 12px;
  }

  h2 {
    font-size: 12px;
    color: var(--color-primary-light-300);
  }
</style>
