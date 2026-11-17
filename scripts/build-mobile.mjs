import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim()
const image = process.argv[2] || `any-listen-mobile:${revision.slice(0, 12)}`
execFileSync('pnpm', ['-F', 'view-main', 'build:web'], {
  cwd: root,
  env: { ...process.env, NODE_ENV: 'production' },
  stdio: 'inherit',
})
const index = new URL('../build/public/index.html', import.meta.url)
writeFileSync(
  index,
  readFileSync(index, 'utf8').replace('<head>', `<head><meta name="anylisten-mobile-revision" content="${revision}">`)
)
execFileSync(
  'docker',
  [
    '--context',
    process.env.DOCKER_CONTEXT || 'colima-music-trial',
    'build',
    '--file',
    'Dockerfile.mobile',
    '--build-arg',
    `MOBILE_REVISION=${revision}`,
    '--tag',
    image,
    '.',
  ],
  { cwd: root, stdio: 'inherit' }
)
console.log(`Built ${image} from ${revision}`)
