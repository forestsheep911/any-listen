<script lang="ts">
  import { tick } from 'svelte'
  import { mobileViewport } from '@/shared/browser/mobile.svelte'
  import { link, location, query, push } from '@/plugins/routes'
  import { LIST_IDS } from '@any-listen/common/constants'
  import { toOnlineSearch } from '@/modules/resource/actions'
  import { useOnlineResourceAvailable } from '@/views/Online/shared.svelte'
  import Aside from '@/components/layout/Aside/index.svelte'
  import Header from '@/components/layout/Header/index.svelte'
  import Main from '@/components/layout/Main.svelte'
  import PlayBar from '@/components/layout/PlayBar/index.svelte'
  import PlayDetail from '@/components/layout/PlayDetail/index.svelte'
  let drawerOpen = $state(false)
  let drawer: HTMLDivElement | undefined = $state()
  let libraryButton: HTMLButtonElement | undefined = $state()
  let searchNotice = $state(false)
  const resources = useOnlineResourceAvailable()
  const closeDrawer = () => {
    drawerOpen = false
    libraryButton?.focus()
  }
  const openDrawer = async () => {
    drawerOpen = true
    await tick()
    drawer?.querySelector<HTMLButtonElement>('button')?.focus()
  }
  const drawerKeys = (event: KeyboardEvent) => {
    if (!mobileViewport.active || !drawerOpen) return
    if (event.key === 'Escape') closeDrawer()
    if (event.key !== 'Tab' || !drawer) return
    const items = Array.from(drawer.querySelectorAll<HTMLElement>('button, a, input, [tabindex="0"]')).filter((el) => el.getClientRects().length)
    const first = items[0]
    const last = items.at(-1)
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }
  $effect(() => {
    if (!mobileViewport.active) drawerOpen = false
  })
  let active = $derived($location.startsWith('/online') ? 'search' : $location === '/settings' ? 'settings' : $location === '/extenstion' ? 'extensions' : $query.id === LIST_IDS.LAST_PLAYED ? 'history' : 'library')
</script>

<div id="app-main">
  {#if mobileViewport.active && drawerOpen}
    <button class="mobile-backdrop" aria-label="关闭曲库" onclick={closeDrawer}></button>
  {/if}
  <div class="library-shell" class:drawer-open={drawerOpen} bind:this={drawer}
    role={mobileViewport.active ? 'dialog' : undefined} aria-modal={mobileViewport.active && drawerOpen ? true : undefined}
    aria-label={mobileViewport.active ? '曲库' : undefined} tabindex="-1"
    inert={mobileViewport.active && !drawerOpen} onkeydown={drawerKeys}
    onkeyup={(event) => { if (mobileViewport.active && (event.key === 'Enter' || event.key === ' ') && event.target instanceof Element && event.target.closest('[data-mobile-select-list]')) closeDrawer() }}
    onclickcapture={(event) => { if (mobileViewport.active && event.target instanceof Element && event.target.closest('a[href], [data-mobile-select-list]')) closeDrawer() }}>
    {#if mobileViewport.active}<button class="drawer-close" onclick={closeDrawer}>关闭曲库 ×</button>{/if}
    <Aside />
    {#if mobileViewport.active}<a class="mobile-source" href="https://github.com/forestsheep911/any-listen/tree/mobile-web" target="_blank" rel="noreferrer">开源代码 ↗</a>{/if}
  </div>
  <div id="app-right" inert={mobileViewport.active && drawerOpen}>
    <Header />
    <Main />
  </div>
</div>
<div class="playbar-shell" inert={mobileViewport.active && drawerOpen}><PlayBar /></div>
{#if import.meta.env.VITE_IS_WEB}
  <nav class="mobile-nav" aria-label="主导航" inert={drawerOpen}>
    <button bind:this={libraryButton} class:active={active === 'library'} aria-expanded={drawerOpen} onclick={openDrawer}>♫<span>曲库</span></button>
    <button class:active={active === 'search'} onclick={() => { if (resources.val) { searchNotice = false; void toOnlineSearch() } else searchNotice = !searchNotice }}>⌕<span>搜索</span></button>
    <a class:active={active === 'history'} href={`/library?id=${LIST_IDS.LAST_PLAYED}`} {@attach link()}>◷<span>最近</span></a>
    <a class:active={active === 'extensions'} href="/extenstion" {@attach link()}>◇<span>扩展</span></a>
    <a class:active={active === 'settings'} href="/settings" {@attach link()}>⚙<span>设置</span></a>
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
  @media (max-width: 767PX) {
    :global(html.web) {
      #app-main, #app-right { min-width: 0; min-height: 0; }
      .library-shell { display: none; }
      .library-shell.drawer-open { position: absolute; inset: 0 auto 0 0; z-index: 41; display: flex; flex-direction: column; width: min(86vw, 340PX); max-width: none; padding-top: env(safe-area-inset-top); background: var(--color-app-background); }
      .library-shell :global(.aside) { flex: 1; min-height: 0; overflow: auto; }
      .drawer-close, .mobile-source { flex: none; padding: 14PX; color: var(--color-font); background: var(--color-app-background); border: none; text-align: left; }
      .mobile-backdrop { position: absolute; inset: 0; z-index: 40; background: #0008; border: 0; }
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
