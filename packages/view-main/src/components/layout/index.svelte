<script lang="ts">
  import SvgIcon from '@/components/base/SvgIcon.svelte'
  import { mobileViewport } from '@/shared/browser/mobile.svelte'
  import { link, location, query, push, replace, type Params } from '@/plugins/routes'
  import { LIST_IDS } from '@any-listen/common/constants'
  import { toOnlineSearch } from '@/modules/resource/actions'
  import { useOnlineResourceAvailable } from '@/views/Online/shared.svelte'
  import Aside from '@/components/layout/Aside/index.svelte'
  import Header from '@/components/layout/Header/index.svelte'
  import Main from '@/components/layout/Main.svelte'
  import PlayBar from '@/components/layout/PlayBar/index.svelte'
  import PlayDetail from '@/components/layout/PlayDetail/index.svelte'
  let drawerOpen = $derived(mobileViewport.active && $location === '/library' && $query.panel === 'playlists')
  let searchNotice = $state(false)
  let lastOnline: { path: string; params: Params } | undefined
  $effect(() => {
    if ($location.startsWith('/online')) lastOnline = { path: $location, params: { ...$query } }
  })
  const resources = useOnlineResourceAvailable()
  const closeDrawer = () => { if (drawerOpen) void replace('/library', { id: $query.id || LIST_IDS.LOVE }) }
  const openDrawer = () => {
    searchNotice = false
    if (!drawerOpen) void push('/library', { id: $query.id || LIST_IDS.LOVE, panel: 'playlists' })
  }
  const openSearch = () => {
    if (!resources.val) { searchNotice = !searchNotice; return }
    searchNotice = false
    if ($location.startsWith('/online')) return
    if (lastOnline) void push(lastOnline.path, lastOnline.params)
    else void toOnlineSearch()
  }
  let active = $derived(drawerOpen ? 'playlists' : $location.startsWith('/online') ? 'search' : $location === '/library' && $query.id === LIST_IDS.LOVE ? 'love' : $location === '/library' && $query.id !== LIST_IDS.LAST_PLAYED ? 'playlists' : '')
</script>

<div id="app-main">
  <div class="library-shell" class:drawer-open={drawerOpen}
    inert={mobileViewport.active && !drawerOpen}
    role="region" aria-label="歌单" tabindex="-1"
    onkeydown={(event) => { if (event.key === 'Escape') closeDrawer() }}>
    {#if mobileViewport.active}<div class="playlist-heading"><h2>歌单</h2><button class="drawer-close" onclick={closeDrawer}>返回歌曲</button></div>{/if}
    <Aside />
    {#if mobileViewport.active}<a class="mobile-source" href="https://github.com/forestsheep911/any-listen/tree/mobile-web" target="_blank" rel="noreferrer">开源代码 ↗</a>{/if}
  </div>
  <div id="app-right" inert={drawerOpen}>
    <Header />
    <Main />
  </div>
</div>
<div class="playbar-shell"><PlayBar /></div>
{#if import.meta.env.VITE_IS_WEB}
  <nav class="mobile-nav" aria-label="主导航">
    <button class:active={active === 'search'} aria-current={active === 'search' ? 'page' : undefined} onclick={openSearch}><SvgIcon name="search" /><span>搜索</span></button>
    <a class:active={active === 'love'} aria-current={active === 'love' ? 'page' : undefined} href={`/library?id=${LIST_IDS.LOVE}`} {@attach link()}><SvgIcon name="love" /><span>喜欢</span></a>
    <button class:active={active === 'playlists'} aria-expanded={drawerOpen} onclick={openDrawer}><SvgIcon name="albums" /><span>歌单</span></button>
  </nav>
  {#if searchNotice && mobileViewport.active}
    <div class="mobile-search-notice" role="status">搜索需要启用在线资源扩展。<button onclick={() => { searchNotice = false; void push('/extenstion') }}>打开扩展</button><button aria-label="关闭提示" onclick={() => searchNotice = false}>×</button></div>
  {/if}
{/if}
<PlayDetail />

<style lang="less">
  .library-shell { display: flex; flex: none; width: 20%; max-width: 320px; }
  .library-shell :global(.aside) { width: 100%; max-width: none; }
  .playbar-shell { flex: none; }
  .mobile-nav { display: none; }
  @media (max-width: 767PX), (max-width: 1023PX) and (max-height: 500PX) {
    :global(html.web) {
      #app-main, #app-right { min-width: 0; min-height: 0; }
      .library-shell { display: none; }
      .library-shell.drawer-open { position: absolute; inset: 0; z-index: 41; display: flex; flex-direction: column; width: 100%; max-width: none; padding-top: env(safe-area-inset-top); background: var(--color-app-background); }
      .library-shell :global(.aside) { flex: 1; min-height: 0; overflow: auto; }
      .drawer-close, .mobile-source { flex: none; padding: 14PX; color: var(--color-font); background: var(--color-app-background); border: none; text-align: left; }
      .library-shell :global(.aside-logo), .library-shell :global(.aside-nav) { display: none; }
      .playlist-heading { display: flex; align-items: center; justify-content: space-between; padding: 4PX 12PX; }
      .playlist-heading h2 { font-size: 22PX; }
      .drawer-close { min-height: 44PX; }
      .mobile-nav :global(svg) { width: 22PX; height: 22PX; }
      .mobile-nav { position: relative; z-index: 3; display: flex; flex: none; justify-content: space-around; padding: 4PX 4PX calc(4PX + env(safe-area-inset-bottom)); background: var(--color-app-background); border-top: 1PX solid var(--color-border); }
      .mobile-nav > :is(a, button) { display: flex; flex: 1; flex-direction: column; align-items: center; justify-content: center; gap: 3PX; min-height: 48PX; padding: 2PX; color: var(--color-font-label); background: none; border: 0; text-decoration: none; font-size: 22PX; }
      .mobile-nav span { font-size: 12PX; }
      .mobile-nav .active { color: var(--color-primary-font); background: var(--color-primary-background-selected); border-radius: 10PX; }
      .mobile-search-notice { position: absolute; bottom: calc(126PX + env(safe-area-inset-bottom)); left: 12PX; right: 12PX; z-index: 9; padding: 14PX; background: var(--color-app-background); border: 1PX solid var(--color-border); border-radius: 12PX; }
      .mobile-search-notice button { min-height: 44PX; padding: 8PX; }
    }
  }

  #app-main {
    position: relative;
    z-index: 1;
    display: flex;
    flex: auto;
    flex-flow: row nowrap;
  }
  #app-right {
    position: relative;
    display: flex;
    // border-left: 2PX solid var(--color-border);

    flex: auto;
    flex-flow: column nowrap;

    // border-top-left-radius: @radius-border;
    // border-bottom-left-radius: @radius-border;
    overflow: hidden;
    // box-shadow: 0PX 0PX 4PX rgba(0, 0, 0, 0.1);

    // &:before {
    //   .mixin-after();
    //   left: 0;
    //   top: 0;
    //   width: 100%;
    //   height: 100%;
    //   transition: background-color @transition-normal;
    //   background-color: var(--color-main-background);
    //   opacity: .9;
    //   // z-index: -1;
    // }
  }
</style>
