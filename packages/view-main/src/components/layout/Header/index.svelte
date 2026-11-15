<script lang="ts">
  import { mobileViewport } from '@/shared/browser/mobile.svelte'
  import { location, query, push } from '@/plugins/routes'
  import { LIST_IDS } from '@any-listen/common/constants'
  import { closeWindow } from '@/shared/ipc/app'
  import Dropdown from '@/components/material/Dropdown.svelte'
  import SvgIcon from '@/components/base/SvgIcon.svelte'
  import Logo from './Logo.svelte'
  import ControlBtns from './ControlBtns.svelte'
  import SearchInput from './SearchInput.svelte'
  import { windowDarg } from '@/shared/browser/widnow.svelte'
</script>

{#if import.meta.env.VITE_IS_DESKTOP}
  <div class="toolbar drag-no-any-modal">
    <div class="left" data-mobile-header-search>
      <SearchInput />
    </div>
    <!-- <SearchInput /> -->
    {#if import.meta.env.VITE_IS_MAC}
      <Logo />
    {:else}
      <ControlBtns />
    {/if}
  </div>
{/if}
{#if import.meta.env.VITE_IS_WEB}
  <div class="toolbar" data-mobile-header {@attach windowDarg}>
    <div class="left" data-mobile-header-search>
      {#if !mobileViewport.active || $location.startsWith('/online')}
        <SearchInput />
      {:else}
        <h2 class="mobile-context">{$location === '/settings' ? '设置' : $location === '/extenstion' ? '扩展管理' : $query.id === LIST_IDS.LOVE ? '喜欢的歌曲' : $query.id === LIST_IDS.LAST_PLAYED ? '最近播放' : '我的音乐'}</h2>
      {/if}
    </div>
    {#if mobileViewport.active}
      <div data-mobile-header-more>
        <Dropdown aria-label="更多" menu={[
          { key: 'recent', label: '最近播放', icon: 'clock', onclick: () => { void push(`/library?id=${LIST_IDS.LAST_PLAYED}`) } },
          { key: 'extensions', label: '扩展管理', icon: 'extenstion', onclick: () => { void push('/extenstion') } },
          { key: 'settings', label: '设置', icon: 'setting-control', onclick: () => { void push('/settings') } },
          { key: 'source', label: '开源代码', icon: 'visit', onclick: () => { window.open('https://github.com/forestsheep911/any-listen/tree/mobile-web', '_blank', 'noopener,noreferrer') } },
          { key: 'logout', label: '退出登录', icon: 'logout', onclick: () => { void closeWindow() } },
        ]}>
          {#snippet trigger()}<SvgIcon name="more" />{/snippet}
        </Dropdown>
      </div>
    {:else}<ControlBtns />{/if}
  </div>
{/if}

<style lang="less" module>
  .toolbar {
    position: relative;
    z-index: 2;
    display: flex;
    flex: none;
    flex-flow: row nowrap;
    align-items: center;
    height: @height-toolbar;
    // justify-content: space-between;
    // background-color: var(--background-color);
    // border-bottom: 1px solid var(--color-border);

    // &:before {
    //   .mixin-after();
    //   left: 0;
    //   top: 0;
    //   width: 100%;
    //   height: 100%;
    //   background-color: var(--color-main-background);
    //   opacity: .9;
    //   z-index: -1;
    // }
  }
  .left {
    display: flex;
    flex: auto;
    flex-flow: row nowrap;
    // gap: 25px;
    align-items: center;
    height: 100%;
    margin-left: 12px;
    :global {
      .search-input {
        // background-color: transparent;
        // border-bottom: 2px solid var(--color-primary-background);
        &::placeholder {
          font-size: 0.98em;
          color: var(--color-button-font);
        }
      }
    }
  }

  // .logo {
  //   box-sizing: border-box;
  //   padding: 0 @height-toolbar * .4;
  //   height: @height-toolbar;
  //   color: var(--color-primary);
  //   flex: none;
  //   text-align: center;
  //   line-height: @height-toolbar;
  //   font-weight: bold;
  // }
  // .search {
  //   margin-left: 20px;
  //   :global(.searchInput) {
  //     background-color: transparent;
  //     border-bottom: 2px solid var(--color-primary-background);
  //     &::placeholder {
  //       color: var(--color-button-font);
  //       font-size: .98em;
  //     }
  //   }
  // }
</style>
