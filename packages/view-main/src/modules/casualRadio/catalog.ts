export const RADIO_LIST_MARKER = 'any-listen:casual-radio:v1'
export const RADIO_ERAS = ['1980s', '1990s', '2000s', '2010s', '2020s'] as const
export type RadioEra = (typeof RADIO_ERAS)[number]
export interface RadioSeed {
  title: string
  artist: string
  era: RadioEra
}

const byEra: Record<RadioEra, readonly (readonly [string, string])[]> = {
  '1980s': [
    ['光阴的故事', '罗大佑'], ['童年', '罗大佑'], ['恋曲1980', '罗大佑'], ['梦醒时分', '陈淑桦'],
    ['一场游戏一场梦', '王杰'], ['忘了你忘了我', '王杰'], ['大约在冬季', '齐秦'], ['外面的世界', '齐秦'],
    ['我的未来不是梦', '张雨生'], ['天天想你', '张雨生'], ['跟着感觉走', '苏芮'], ['酒干倘卖无', '苏芮'],
    ['读你', '蔡琴'], ['你的眼神', '蔡琴'], ['漫步人生路', '邓丽君'], ['我只在乎你', '邓丽君'],
    ['一生不变', '李克勤'], ['偏偏喜欢你', '陈百强'], ['当年情', '张国荣'], ['朋友', '谭咏麟'],
  ],
  '1990s': [
    ['吻别', '张学友'], ['一路上有你', '张学友'], ['忘情水', '刘德华'], ['谢谢你的爱', '刘德华'],
    ['爱如潮水', '张信哲'], ['过火', '张信哲'], ['后来', '刘若英'], ['为爱痴狂', '刘若英'],
    ['红豆', '王菲'], ['我愿意', '王菲'], ['领悟', '辛晓琪'], ['味道', '辛晓琪'],
    ['听海', '张惠妹'], ['原来你什么都不想要', '张惠妹'], ['爱相随', '周华健'], ['朋友', '周华健'],
    ['海阔天空', 'Beyond'], ['光辉岁月', 'Beyond'], ['挪威的森林', '伍佰'], ['爱', '小虎队'],
  ],
  '2000s': [
    ['晴天', '周杰伦'], ['七里香', '周杰伦'], ['稻香', '周杰伦'], ['江南', '林俊杰'],
    ['一千年以后', '林俊杰'], ['遇见', '孙燕姿'], ['开始懂了', '孙燕姿'], ['勇气', '梁静茹'],
    ['宁夏', '梁静茹'], ['十年', '陈奕迅'], ['富士山下', '陈奕迅'], ['爱你', '王心凌'],
    ['月光', '王心凌'], ['欧若拉', '张韶涵'], ['隐形的翅膀', '张韶涵'], ['倔强', '五月天'],
    ['突然好想你', '五月天'], ['小情歌', '苏打绿'], ['童话', '光良'], ['至少还有你', '林忆莲'],
  ],
  '2010s': [
    ['泡沫', '邓紫棋'], ['光年之外', '邓紫棋'], ['演员', '薛之谦'], ['绅士', '薛之谦'],
    ['年少有为', '李荣浩'], ['李白', '李荣浩'], ['平凡之路', '朴树'], ['成都', '赵雷'],
    ['南山南', '马頔'], ['消愁', '毛不易'], ['像我这样的人', '毛不易'], ['小幸运', '田馥甄'],
    ['修炼爱情', '林俊杰'], ['那些年', '胡夏'], ['追光者', '岑宁儿'], ['体面', '于文文'],
    ['说散就散', '袁娅维'], ['大鱼', '周深'], ['起风了', '买辣椒也用券'], ['想见你想见你想见你', '八三夭'],
  ],
  '2020s': [
    ['孤勇者', '陈奕迅'], ['人世间', '雷佳'], ['如愿', '王菲'], ['这世界那么多人', '莫文蔚'],
    ['有我', '周深'], ['小美满', '周深'], ['花开忘忧', '周深'], ['乌梅子酱', '李荣浩'],
    ['是但求其爱', '陈奕迅'], ['星辰大海', '黄霄雲'], ['四季予你', '程响'], ['一路生花', '温奕心'],
    ['世界这么大还是遇见你', '程响'], ['错位时空', '艾辰'], ['云与海', '阿YueYue'], ['飞鸟和蝉', '任然'],
    ['海底', '一支榴莲'], ['踏山河', '是七叔呢'], ['嘉宾', '张远'], ['我记得', '赵雷'],
  ],
}

export const RADIO_CATALOG: readonly RadioSeed[] = RADIO_ERAS.flatMap((era) =>
  byEra[era].map(([title, artist]) => ({ title, artist, era }))
)

const shuffle = <T>(items: readonly T[], random: () => number): T[] => {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    const item = result[i]
    result[i] = result[j]
    result[j] = item
  }
  return result
}

export const buildRadioSeeds = (random: () => number = Math.random): RadioSeed[] => {
  const eras = shuffle(RADIO_ERAS, random)
  const pools = eras.map((era) => shuffle(RADIO_CATALOG.filter((song) => song.era === era), random))
  const result: RadioSeed[] = []
  for (let round = 0; round < Math.max(...pools.map((pool) => pool.length)); round++) {
    for (const pool of pools) {
      const seed = pool[round]
      if (seed) result.push(seed)
    }
  }
  return result
}

const alternativeVersion = /live|remix|cover|伴奏|翻唱|纯音乐|纯音樂|现场|現場|演唱会|演唱會|合唱|串烧|串燒|翻自|钢琴|鋼琴|抖音|DJ版/i
const normalize = (text: string) => text.normalize('NFKC').toLocaleLowerCase().replace(/[\s\p{P}\p{S}]/gu, '')
const normalizeArtist = (text: string) => text.normalize('NFKC').trim().toLocaleLowerCase()
const baseTitle = (text: string) => text.replace(/\([^)]*\)|（[^）]*）|\[[^\]]*\]|【[^】]*】/g, '')

export const isOriginalRadioMatch = (seed: RadioSeed, candidate: { name: string; singer: string }): boolean => {
  if (alternativeVersion.test(candidate.name)) return false
  return normalize(baseTitle(candidate.name)) === normalize(seed.title) && normalizeArtist(candidate.singer) === normalizeArtist(seed.artist)
}
