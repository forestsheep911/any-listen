<script lang="ts">
  import { mobileViewport } from '@/shared/browser/mobile.svelte'
  import { settingState } from '@/modules/setting/store/state'
  import CoverCD from './CoverCD.svelte'
  import CoverSquare from './CoverSquare.svelte'
</script>

{#if mobileViewport.active || settingState.setting['playDetail.coverStyle'] === 'square'}
  <CoverSquare />
{:else}
  <CoverCD />
{/if}
