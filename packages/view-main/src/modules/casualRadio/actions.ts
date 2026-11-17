import { writable } from 'svelte/store'

import { onDesconnected, onRelease } from '@/modules/app/shared'
import { hasDislike } from '@/modules/dislikeList/store/actions'
import { extensionState } from '@/modules/extension/store/state'
import { createUserList, getUserLists } from '@/modules/musicLibrary/store/actions'
import { addListMusics, overwriteListMusics } from '@/modules/musicLibrary/store/listRemoteActions'
import { playList } from '@/modules/player/actions'
import { setIsLinkedList } from '@/modules/player/store/actions'
import { playerEvent } from '@/modules/player/store/event'
import { getMusicUrl } from '@/modules/player/store/playerRemoteAction'
import { playerState } from '@/modules/player/store/state'
import { updateSetting } from '@/modules/setting/store/action'
import { settingState } from '@/modules/setting/store/state'
import { musicSearch } from '@/shared/ipc/resource'

import { buildRadioSeeds, isOriginalRadioMatch, RADIO_LIST_MARKER, type RadioSeed } from './catalog'

const BATCH_SIZE = 12
const SEED_BUDGET = 24

type RadioState =
  | { kind: 'idle' }
  | { kind: 'preparing'; count: number; checked: number }
  | { kind: 'playing'; count: number; checked: number; listId: string }
  | { kind: 'stopping' }
  | { kind: 'ready'; count: number; listId: string }
  | { kind: 'error'; message: string }

interface RadioRun {
  cancelled: boolean
  listId: string | null
  initialTrack: string | null
  initialList: string | null
  tracks: AnyListen.Music.MusicInfoOnline[]
  checked: number
}

export const radioState = writable<RadioState>({ kind: 'idle' })
let currentRun: RadioRun | null = null
let lastRequestAt = 0
const REQUEST_INTERVAL = 9000
const REQUEST_TIMESTAMP_KEY = 'anylisten-casual-radio-last-request'

const reserveRequest = async () => {
  try {
    const saved = Number(localStorage.getItem(REQUEST_TIMESTAMP_KEY))
    if (Number.isFinite(saved)) lastRequestAt = Math.max(lastRequestAt, saved)
  } catch {}
  const wait = Math.min(REQUEST_INTERVAL, Math.max(0, lastRequestAt + REQUEST_INTERVAL - Date.now()))
  if (wait) await new Promise<void>((resolve) => setTimeout(resolve, wait))
  lastRequestAt = Date.now()
  try {
    localStorage.setItem(REQUEST_TIMESTAMP_KEY, String(lastRequestAt))
  } catch {}
}

const waitForRequest = async () => {
  if (navigator.locks) {
    await navigator.locks.request(REQUEST_TIMESTAMP_KEY, reserveRequest)
  } else {
    await reserveRequest()
  }
}

const isCurrent = (run: RadioRun) => currentRun === run && !run.cancelled

const updateProgress = (run: RadioRun) => {
  if (!isCurrent(run)) return
  radioState.set(run.listId
    ? { kind: 'playing', count: run.tracks.length, checked: run.checked, listId: run.listId }
    : { kind: 'preparing', count: run.tracks.length, checked: run.checked })
}

export const cancelRadioPreparation = () => {
  if (!currentRun) return
  currentRun.cancelled = true
  radioState.set({ kind: 'stopping' })
}

const getSources = () => {
  const sources = extensionState.resourceList.resources.musicSearch ?? []
  const priority = (source: AnyListen.Extension.ResourceItem) => /netease/i.test(source.id) ? 0 : 1
  return sources.filter((source) => /netease|joox/i.test(source.id)).sort((a, b) => priority(a) - priority(b)).slice(0, 2)
}

const resolveSeed = async (
  seed: RadioSeed,
  sources: AnyListen.Extension.ResourceItem[],
  run: RadioRun,
  failures: Map<string, number>
): Promise<AnyListen.Music.MusicInfoOnline | null> => {
  for (const source of sources) {
    if (!isCurrent(run)) return null
    if ((failures.get(source.id) ?? 0) >= 2) continue
    await waitForRequest()
    if (!isCurrent(run)) return null
    try {
      const result = await musicSearch({
        extensionId: source.extensionId,
        source: source.id,
        name: `${seed.title} ${seed.artist}`,
        artist: seed.artist,
        page: 1,
        limit: 10,
      })
      if (!isCurrent(run)) return null
      const candidate = result.list.find((song) => isOriginalRadioMatch(seed, song) && !hasDislike(song))
      if (!candidate || run.tracks.some((song) => song.id === candidate.id)) continue
      await waitForRequest()
      if (!isCurrent(run)) return null
      const { url } = await getMusicUrl({ musicInfo: candidate })
      if (!isCurrent(run)) return null
      if (/^https?:\/\//i.test(url)) return candidate
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      if (/timeout|timed out/i.test(message)) throw new Error('音乐源响应超时，请稍后重试。')
      if (/429|too many requests/i.test(message)) throw new Error('音乐源请求过于频繁，请稍后再试。')
      failures.set(source.id, (failures.get(source.id) ?? 0) + 1)
    }
  }
  return null
}

const startPreparedList = async (run: RadioRun) => {
  if (!isCurrent(run) || !run.tracks.length) return
  const all = await getUserLists()
  if (!isCurrent(run)) return
  const generated = all.find((list) => list.type === 'general' && list.meta.desc === RADIO_LIST_MARKER)
  let listId: string
  if (generated) {
    listId = generated.id
  } else {
    listId = await createUserList(0, {
      id: '', name: '随便听 · 华语', type: 'general', parentId: null,
      meta: { pic: '', desc: RADIO_LIST_MARKER, songCount: 0, playCount: 0, createTime: 0, updateTime: 0, posTime: 0 },
    })
  }
  if (!isCurrent(run)) return
  if (playerState.playInfo.listId === listId) setIsLinkedList(false)
  await overwriteListMusics({ listId, musicInfos: [...run.tracks] })
  if (!isCurrent(run)) return
  await updateSetting({ 'player.togglePlayMethod': 'listLoop' })
  if (!isCurrent(run)) return
  run.listId = listId
  await playList(listId, [...run.tracks], 0, true)
  updateProgress(run)
}

export const startCasualRadio = async () => {
  if (currentRun) return
  const sources = getSources()
  if (!settingState.setting['onlineResource.enable'] || !sources.length) {
    radioState.set({ kind: 'error', message: '请先在扩展中启用网易云音乐或 JOOX 音乐源。' })
    return
  }
  const run: RadioRun = {
    cancelled: false,
    listId: null,
    initialTrack: playerState.musicInfo.id,
    initialList: playerState.playInfo.listId,
    tracks: [],
    checked: 0,
  }
  currentRun = run
  updateProgress(run)
  const stopOnOtherPlayback = () => {
    const switched = run.listId
      ? playerState.playInfo.listId !== run.listId
      : playerState.playInfo.listId !== run.initialList || playerState.musicInfo.id !== run.initialTrack
    if (switched) cancelRadioPreparation()
  }
  const unlisten = playerEvent.on('musicChanged', stopOnOtherPlayback)
  const onDisconnect = onDesconnected(cancelRadioPreparation)
  const onShutdown = onRelease(cancelRadioPreparation)
  let errorMessage = ''
  try {
    const failures = new Map<string, number>()
    for (const seed of buildRadioSeeds().slice(0, SEED_BUDGET)) {
      if (!isCurrent(run) || run.tracks.length >= BATCH_SIZE) break
      if (sources.every((source) => (failures.get(source.id) ?? 0) >= 2)) break
      const song = await resolveSeed(seed, sources, run, failures)
      if (!isCurrent(run)) break
      run.checked++
      if (song) {
        if (run.listId) {
          await addListMusics({ id: run.listId, musicInfos: [song], addMusicLocationType: 'bottom' })
          run.tracks.push(song)
        } else {
          run.tracks.push(song)
          if (run.tracks.length >= 1) await startPreparedList(run)
        }
      }
      updateProgress(run)
    }
    if (isCurrent(run) && !run.listId && run.tracks.length) await startPreparedList(run)
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : '准备歌曲失败，请稍后重试。'
  } finally {
    unlisten()
    onDisconnect()
    onShutdown()
    currentRun = null
    if (run.listId) {
      radioState.set({ kind: 'ready', count: run.tracks.length, listId: run.listId })
    } else if (run.cancelled) {
      radioState.set({ kind: 'idle' })
    } else {
      radioState.set({ kind: 'error', message: errorMessage || '暂时没有找到可播放的原唱歌曲，请稍后再试或检查音乐源。' })
    }
  }
}
