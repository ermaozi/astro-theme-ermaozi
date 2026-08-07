#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { constants } from 'node:fs'
import { access, cp, mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { createInterface } from 'node:readline/promises'
import { fileURLToPath } from 'node:url'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const templateRoot = path.join(packageRoot, 'template')
const args = process.argv.slice(2)

if (args.includes('--help') || args.includes('-h')) {
  console.log(`create-astro-theme-ermaozi [directory] [options]

Options:
  --no-install  Create files without installing dependencies
  -h, --help    Show this help
  -v, --version Show the initializer version`)
  process.exit(0)
}

if (args.includes('--version') || args.includes('-v')) {
  const pkg = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'))
  console.log(pkg.version)
  process.exit(0)
}

const positional = args.find(arg => !arg.startsWith('-'))
let directory = positional
if (!directory && process.stdin.isTTY) {
  const prompt = createInterface({ input: process.stdin, output: process.stdout })
  directory = (await prompt.question('项目目录（ermaozi-site）：')).trim() || 'ermaozi-site'
  prompt.close()
}
directory ||= 'ermaozi-site'

const target = path.resolve(process.cwd(), directory)
const targetName = path.basename(target).toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^[._-]+|[._-]+$/g, '') || 'ermaozi-site'

try {
  await access(templateRoot, constants.R_OK)
} catch {
  throw new Error('主题模板不存在。发布前请先运行 npm run sync-template。')
}

await mkdir(target, { recursive: true })
if ((await readdir(target)).length > 0) throw new Error(`目标目录不是空目录：${target}`)

await cp(templateRoot, target, { recursive: true })
await rename(path.join(target, 'gitignore'), path.join(target, '.gitignore'))
const targetPackagePath = path.join(target, 'package.json')
const targetPackage = JSON.parse(await readFile(targetPackagePath, 'utf8'))
const userAgent = process.env.npm_config_user_agent || ''
const packageManager = userAgent.startsWith('pnpm/') ? 'pnpm' : userAgent.startsWith('yarn/') ? 'yarn' : 'npm'
const packageManagerVersion = userAgent.match(new RegExp(`^${packageManager}/([^ ]+)`))?.[1]
targetPackage.name = targetName
if (packageManager === 'yarn' && packageManagerVersion) targetPackage.packageManager = `yarn@${packageManagerVersion}`
await writeFile(targetPackagePath, `${JSON.stringify(targetPackage, null, 2)}\n`)
if (packageManager === 'yarn') {
  await writeFile(path.join(target, 'yarn.lock'), '')
  await writeFile(path.join(target, '.yarnrc.yml'), 'nodeLinker: node-modules\n')
}

const install = !args.includes('--no-install')

if (install) {
  console.log(`\n正在使用 ${packageManager} 安装依赖…`)
  const managerPath = process.env.npm_execpath
  const command = managerPath || packageManager
  const env = { ...process.env }
  if (packageManager === 'yarn' && env.NODE_OPTIONS?.includes('.pnp.cjs')) delete env.NODE_OPTIONS
  const exitCode = await new Promise((resolve, reject) => {
    const child = spawn(command, ['install'], {
      cwd: target,
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env,
    })
    child.on('error', reject)
    child.on('close', code => resolve(code ?? 1))
  })
  if (exitCode !== 0) throw new Error(`${packageManager} install 失败，项目文件已保留在 ${target}`)
}

const relativeTarget = path.relative(process.cwd(), target) || '.'
console.log(`\nermaozi 已创建：${target}`)
console.log(relativeTarget === '.' ? `${packageManager} run dev` : `cd ${relativeTarget}\n${packageManager} run dev`)
