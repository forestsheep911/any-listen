<script lang="ts">
  import { mobileViewport } from '@/shared/browser/mobile.svelte'
  import Btn from '@/components/base/Btn.svelte'
  import BtnMerge from '@/components/base/BtnMerge.svelte'
  import SvgIcon from '@/components/base/SvgIcon.svelte'
  import Dropdown from '@/components/material/Dropdown.svelte'
  import { t } from '@/plugins/i18n'
  let {
    library = false,
    source,
    disabled,
    musiccount,
    multimode,
    finding,
    saveable,
    onplay,
    onplayrandom,
    onsave,
    onsaveasgeneral,
    onmulti,
    onfind,
    onduplicate,
    onsort,
  }: {
    library?: boolean
    source: AnyListen.Player.SourceType
    disabled: boolean
    musiccount: number
    multimode: boolean
    finding: boolean
    saveable?: boolean
    onplay: () => void
    onplayrandom: () => void
    onsave: () => void
    onsaveasgeneral: () => void
    onmulti: () => void
    onfind: () => void
    onduplicate: () => void
    onsort: () => void
  } = $props()
</script>

{#if mobileViewport.active}
    <div class="mobile-list-controls" class:mobile-library-controls={library}>
      {#if !library}<div class="mobile-section-title"><h3>歌曲</h3><span>{musiccount}</span></div>{/if}
      <Btn disabled={!musiccount || disabled} icontext onclick={onplay}><SvgIcon name="play" />{$t('play_all')}</Btn>
      <Dropdown aria-label="歌曲操作" autoshow={false} menu={[
        { key: 'random', label: $t('play_random'), icon: 'list-random', disabled: !musiccount || disabled, onclick: onplayrandom },
        { key: 'multi', label: multimode ? $t('batch_select_exit') : $t('batch_select'), icon: 'multiple', onclick: onmulti },
        { key: 'find', label: finding ? $t('find_music_exit') : $t('find_music'), icon: 'search', onclick: onfind },
        ...(source === 'local' ? [
          { key: 'duplicate', label: $t('duplicate_music'), icon: 'duplicate', disabled: !musiccount, onclick: onduplicate },
          { key: 'sort', label: $t('sort_music'), icon: 'sort', disabled: !musiccount, onclick: onsort },
        ] : []),
        ...(source !== 'local' && saveable ? [
          { key: 'save', label: $t('save_list'), icon: 'favorite_folder', disabled, onclick: onsave },
          { key: 'save-local', label: $t('save_as_local_list'), icon: 'favorite_folder', disabled, onclick: onsaveasgeneral },
        ] : []),
      ]}>{#snippet trigger()}<SvgIcon name="more" />{/snippet}</Dropdown>
    </div>
{:else}
<div class="header">
  <!-- <div class="info">
    <h3 class="title">{listinfo.name}</h3>
  </div>
  <div class="control-btns"> -->
  <div class="btns">
    <Btn min disabled={!musiccount || disabled} icontext onclick={onplay}>
      <SvgIcon name="play" />
      {$t('play_all')}
    </Btn>
    <Btn min disabled={!musiccount || disabled} icontext onclick={onplayrandom}>
      <SvgIcon name="list-random" />
      {$t('play_random')}
    </Btn>
    {#if source !== 'local' && saveable}
      <BtnMerge>
        <Btn min {disabled} icontext onclick={onsave}>
          <SvgIcon name="favorite_folder" />
          {$t('save_list')}
        </Btn>
        <Dropdown
          aria-label={$t('btn_more')}
          menu={[
            {
              key: 'save_as_local',
              disabled,
              label: $t('save_as_local_list'),
              icon: 'favorite_folder',
              onclick: onsaveasgeneral,
            },
          ]}
        >
          {#snippet trigger()}
            <SvgIcon name="more" />
          {/snippet}
        </Dropdown>
      </BtnMerge>
    {/if}
  </div>
  <div class="btns">
    <Btn min outline={!multimode} icon onclick={onmulti} aria-label={multimode ? $t('batch_select_exit') : $t('batch_select')}>
      <SvgIcon name="multiple" />
    </Btn>
    <Btn min outline={!finding} icon onclick={onfind} aria-label={finding ? $t('find_music_exit') : $t('find_music')}>
      <SvgIcon name="search" />
    </Btn>
    {#if source === 'local'}
      <Btn min disabled={!musiccount} outline icon onclick={onduplicate} aria-label={$t('duplicate_music')}>
        <SvgIcon name="duplicate" />
      </Btn>
      <Btn min disabled={!musiccount} outline icon onclick={onsort} aria-label={$t('sort_music')}>
        <SvgIcon name="sort" />
      </Btn>
    {/if}
  </div>
  <!-- </div> -->
</div>

{/if}

<style lang="less">
  .header {
    // height: 46px;
    display: flex;
    flex: none;
    flex-flow: row nowrap;
    justify-content: space-between;
    // align-items: center;
    padding: 0 15px 0 10px;
  }

  // .title {
  //   font-size: 24px;
  // }

  // .control-btns {
  //   display: flex;
  //   // gap: 10px;
  //   flex-flow: row wrap;
  //   display: flex;
  //   flex-direction: row;
  //   justify-content: space-between;
  //   align-items: center;
  //   gap: 10px;
  //   // :global(.btn) {
  //   //   margin-right: 10px;
  //   // }
  // }
  .btns {
    display: flex;
    flex: none;
    flex-flow: row nowrap;
    gap: 10px;
  }
</style>
