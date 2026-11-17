import assert from 'node:assert/strict'
import { test } from 'node:test'
import { RADIO_CATALOG, RADIO_ERAS, buildRadioSeeds, isOriginalRadioMatch } from './catalog.ts'

test('every five candidates cover all eras without repeating a seed', () => {
  const seeds = buildRadioSeeds(() => 0.4)
  assert.equal(seeds.length, RADIO_CATALOG.length)
  assert.equal(new Set(seeds.map((song) => `${song.title}:${song.artist}`)).size, seeds.length)
  for (let index = 0; index < seeds.length; index += RADIO_ERAS.length) {
    assert.deepEqual(new Set(seeds.slice(index, index + RADIO_ERAS.length).map((song) => song.era)), new Set(RADIO_ERAS))
  }
})

test('original match rejects covers, duets, instrumentals and alternative versions', () => {
  const seed = { title: '爱你', artist: '王心凌', era: '2000s' }
  for (const candidate of [
    { name: '爱你', singer: '其他歌手' },
    { name: '爱你', singer: '王心凌.' },
    { name: '爱你 (Live)', singer: '王心凌' },
    { name: '爱你（伴奏）', singer: '王心凌' },
    { name: '爱你 Remix', singer: '王心凌' },
    { name: '爱你', singer: '王心凌、其他歌手' },
    { name: '爱你的我', singer: '王心凌' },
  ]) assert.equal(isOriginalRadioMatch(seed, candidate), false)
  assert.equal(isOriginalRadioMatch(seed, { name: '爱你', singer: ' 王心凌 ' }), true)
  assert.equal(isOriginalRadioMatch(seed, { name: '爱你（电视剧主题曲）', singer: '王心凌' }), true)
})
