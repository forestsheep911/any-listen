<script lang="ts">
  import Dropdown from '@/components/material/Dropdown.svelte'
  import SvgIcon from '@/components/base/SvgIcon.svelte'
  import { push } from '@/plugins/routes'
  import { LIST_IDS } from '@any-listen/common/constants'
  import { closeWindow } from '@/shared/ipc/app'
</script>

<div data-mobile-header-more>
  <Dropdown aria-label="更多" autoshow={false} menu={[
    { key: 'recent', label: '最近播放', icon: 'clock', onclick: () => { void push(`/library?id=${LIST_IDS.LAST_PLAYED}`) } },
    { key: 'extensions', label: '扩展管理', icon: 'extenstion', onclick: () => { void push('/extenstion') } },
    { key: 'settings', label: '设置', icon: 'setting-control', onclick: () => { void push('/settings') } },
    { key: 'source', label: '开源代码', icon: 'visit', onclick: () => { window.open('https://github.com/forestsheep911/any-listen/tree/mobile-web', '_blank', 'noopener,noreferrer') } },
    { key: 'logout', label: '退出登录', icon: 'logout', onclick: () => { void closeWindow() } },
  ]}>
    {#snippet trigger()}<SvgIcon name="more" />{/snippet}
  </Dropdown>
</div>
