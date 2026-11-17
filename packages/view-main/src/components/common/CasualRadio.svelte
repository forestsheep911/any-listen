<script lang="ts">
  import { radioState, startCasualRadio, cancelRadioPreparation } from '@/modules/casualRadio/actions'
  import { push } from '@/plugins/routes'

  const busy = $derived($radioState.kind === 'preparing' || $radioState.kind === 'playing' || $radioState.kind === 'stopping')
  const listId = $derived($radioState.kind === 'playing' || $radioState.kind === 'ready' ? $radioState.listId : null)
  const description = $derived.by(() => {
    switch ($radioState.kind) {
      case 'preparing': return `正在找歌，请稍候 · 已准备 ${$radioState.count} 首`
      case 'playing': return `已找到 ${$radioState.count} 首 · 继续准备中`
      case 'stopping': return '正在停止准备，已播放的歌曲会继续'
      case 'ready': return `已准备 ${$radioState.count} 首 · 喜欢就点红心`
      case 'error': return $radioState.message
      default: return '80 年代至今的流行华语 · 喜欢就点红心'
    }
  })
</script>

<section class="casual-radio" aria-label="随便听">
  <div class="radio-copy">
    <span class="eyebrow">华语时光</span>
    <h2>让熟悉的旋律，随机相遇</h2>
    <p role="status">{description}</p>
  </div>
  <div class="radio-actions">
    <button class="radio-start" disabled={busy} onclick={() => { void startCasualRadio() }}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 11 7-11 7z" fill="currentColor" /></svg>
      {busy ? '准备中' : $radioState.kind === 'ready' ? '换一批听' : '随便听'}
    </button>
    {#if busy && $radioState.kind !== 'stopping'}
      <button class="radio-secondary" onclick={cancelRadioPreparation}>停止准备</button>
    {/if}
    {#if listId}
      <button class="radio-secondary" onclick={() => { if (listId) void push('/library', { id: listId }) }}>查看歌曲</button>
    {/if}
    {#if $radioState.kind === 'error'}
      <button class="radio-secondary" onclick={() => { void push('/extenstion') }}>管理音乐源</button>
    {/if}
  </div>
  <span class="radio-note">每次准备一组歌曲，首次需稍候。未出声时点底部播放。</span>
</section>

<style lang="less">
  .casual-radio {
    flex: none;
    margin: 10px 15px 14px;
    padding: 18px 20px;
    border: 1px solid var(--color-primary-light-400-alpha-200);
    border-radius: 20px;
    background: linear-gradient(120deg, var(--color-primary-background), var(--color-primary-light-400-alpha-100));
    color: var(--color-font);
    box-sizing: border-box;
  }
  .eyebrow { font-size: 12px; color: var(--color-primary); font-weight: 600; letter-spacing: .1em; }
  h2 { margin: 8px 0; font-size: 20px; line-height: 1.4; font-weight: 650; }
  p { margin: 0; font-size: 12px; line-height: 1.6; opacity: .7; }
  .radio-actions { display: flex; flex-flow: row wrap; align-items: center; gap: 8px; margin-top: 14px; }
  button { border: 0; cursor: pointer; min-height: 44px; padding: 0 16px; border-radius: 24px; font-size: 14px; font-weight: 600; }
  .radio-start { display: inline-flex; align-items: center; gap: 6px; background: var(--color-primary); color: #fff; }
  .radio-start:disabled { opacity: .6; cursor: default; }
  .radio-start svg { width: 18px; height: 18px; }
  .radio-secondary { background: var(--color-primary-light-400-alpha-100); color: var(--color-primary); }
  .radio-note { display: block; margin-top: 12px; font-size: 11px; line-height: 1.5; opacity: .55; }
  @media (max-width: 767px), (max-width: 1023px) and (max-height: 500px) {
    :global(html) .casual-radio { margin: 8px 16px 12px; padding: 16px; border-radius: 20px; }
    :global(html) .casual-radio h2 { font-size: 19px; }
    :global(html) .casual-radio button { min-height: 44px; font-size: 14px; }
    :global(html) .casual-radio p { font-size: 12px; }
    :global(html) .casual-radio .radio-note { font-size: 11px; }
    :global(html) .casual-radio .eyebrow { font-size: 12px; }
  }
  @media (max-width: 1023px) and (max-height: 500px) {
    :global(html) .casual-radio { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 8px 12px; margin: 6px 12px; }
    :global(html) .casual-radio .radio-copy { flex: 1; min-width: 0; }
    :global(html) .casual-radio .eyebrow, :global(html) .casual-radio .radio-note { display: none; }
    :global(html) .casual-radio h2 { margin: 0 0 4px; font-size: 14px; }
    :global(html) .casual-radio .radio-actions { flex: none; margin-top: 0; }
  }
</style>
