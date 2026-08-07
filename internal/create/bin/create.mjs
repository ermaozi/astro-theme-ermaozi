#!/usr/bin/env node
import { spawn } from 'node:child_process'
import { constants } from 'node:fs'
import { access, cp, mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises'
import { homedir } from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { cancel, confirm, intro, isCancel, log, outro, select, text } from '@clack/prompts'
import { configureSiteConfig } from './configure-site.mjs'
import { deploymentFiles } from './deployment-files.mjs'

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
const interactive = Boolean(process.stdin.isTTY && process.stdout.isTTY)
const copy = {
  'zh-CN': {
    directory: '您想在哪里初始化 Astro？',
    siteName: '站点名称：',
    description: '站点描述信息：',
    multilingual: '是否使用多语言？',
    defaultLanguage: '请选择站点默认语言',
    typescript: '是否使用 TypeScript？',
    bundler: '请选择打包工具',
    deployment: '部署方式：',
    firebaseProject: 'Firebase 项目 ID：',
    git: '是否初始化 git 仓库？',
    install: '是否安装依赖？',
    unsupportedRoot: '当前模板仅支持简体中文作为根语言',
    required: '当前模板必需',
    cancelled: '已取消创建。',
    installing: (/** @type {string} */ manager) => `正在使用 ${manager} 安装依赖…`,
    success: '🎉 创建成功!',
    next: '🔨 执行以下命令即可启动：',
  },
  'en-US': {
    directory: 'Where should Astro be initialized?',
    siteName: 'Site name:',
    description: 'Site description:',
    multilingual: 'Use multiple languages?',
    defaultLanguage: 'Select the default site language',
    typescript: 'Use TypeScript?',
    bundler: 'Select a bundler',
    deployment: 'Deployment:',
    firebaseProject: 'Firebase project ID:',
    git: 'Initialize a git repository?',
    install: 'Install dependencies?',
    unsupportedRoot: 'Only Simplified Chinese is currently supported as the root language',
    required: 'Required by the current template',
    cancelled: 'Creation cancelled.',
    installing: (/** @type {string} */ manager) => `Installing dependencies with ${manager}…`,
    success: '🎉 Project created!',
    next: '🔨 Run the following commands to start:',
  },
}

let directory = positional
let siteName = 'ermaozi'
let siteDescription = '一个支持全文搜索、深色模式和增强 Markdown 的 Astro 静态博客主题。'
let multilingual = false
let deployment = 'custom'
let firebaseProject = ''
let initializeGit = false
let install = !args.includes('--no-install')
let messages = copy['zh-CN']

/**
 * @template T
 * @param {Promise<T | symbol>} prompt
 * @returns {Promise<T>}
 */
const answer = async (prompt) => {
  const value = await prompt
  if (!isCancel(value)) return value
  cancel(messages.cancelled)
  process.exit(0)
}

if (interactive) {
  intro('Welcome to Astro and astro-theme-ermaozi !')
  const displayLanguage = /** @type {'zh-CN' | 'en-US'} */ (await answer(select({
    message: 'Select a language to display / 选择显示语言',
    options: [
      { value: 'zh-CN', label: '简体中文' },
      { value: 'en-US', label: 'English' },
    ],
    initialValue: 'zh-CN',
  })))
  messages = copy[displayLanguage]
  directory ||= await answer(text({ message: messages.directory, initialValue: './my-project' }))
  siteName = await answer(text({ message: messages.siteName, initialValue: 'My Astro Site' }))
  siteDescription = await answer(text({ message: messages.description, initialValue: 'My Astro Site Description' }))
  multilingual = await answer(confirm({ message: messages.multilingual, initialValue: false }))
  await answer(select({
    message: messages.defaultLanguage,
    options: [
      { value: 'zh-CN', label: '简体中文' },
      { value: 'en-US', label: 'English', hint: messages.unsupportedRoot, disabled: true },
    ],
    initialValue: 'zh-CN',
  }))
  await answer(select({
    message: messages.typescript,
    options: [
      { value: true, label: 'Yes' },
      { value: false, label: 'No', hint: messages.required, disabled: true },
    ],
    initialValue: true,
  }))
  await answer(select({ message: messages.bundler, options: [{ value: 'vite', label: 'Vite' }], initialValue: 'vite' }))
  deployment = await answer(select({
    message: messages.deployment,
    options: [
      { value: 'custom', label: 'Custom' },
      { value: 'github-pages', label: 'GitHub Pages' },
      { value: 'gitlab-pages', label: 'GitLab Pages' },
      { value: 'netlify', label: 'Netlify' },
      { value: 'vercel', label: 'Vercel' },
      { value: 'firebase', label: 'Firebase Hosting' },
    ],
    initialValue: 'custom',
  }))
  if (deployment === 'firebase') firebaseProject = await answer(text({ message: messages.firebaseProject, placeholder: 'my-firebase-project' }))
  initializeGit = await answer(confirm({ message: messages.git, initialValue: true }))
  if (!args.includes('--no-install')) install = await answer(confirm({ message: messages.install, initialValue: true }))
}

directory ||= 'my-project'
const expandedDirectory = directory === '~'
  ? homedir()
  : /^~[\\/]/.test(directory) ? path.join(homedir(), directory.slice(2)) : directory
const target = path.resolve(process.cwd(), expandedDirectory)
const targetName = path.basename(target).toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^[._-]+|[._-]+$/g, '') || 'ermaozi-site'
const userAgent = process.env.npm_config_user_agent || ''
const packageManager = userAgent.startsWith('pnpm/') ? 'pnpm' : userAgent.startsWith('yarn/') ? 'yarn' : 'npm'
const packageManagerVersion = userAgent.match(new RegExp(`^${packageManager}/([^ ]+)`))?.[1]

try {
  await access(templateRoot, constants.R_OK)
} catch {
  throw new Error('主题模板不存在。发布前请先运行 npm run sync-template。')
}

await mkdir(target, { recursive: true })
if ((await readdir(target)).length > 0) throw new Error(`目标目录不是空目录：${target}`)

await cp(templateRoot, target, { recursive: true })
await rename(path.join(target, 'gitignore'), path.join(target, '.gitignore'))
if (interactive) {
  const siteConfigPath = path.join(target, 'site.config.mjs')
  const configured = configureSiteConfig(await readFile(siteConfigPath, 'utf8'), { siteName, siteDescription, multilingual })
  await writeFile(siteConfigPath, configured)
}

const targetPackagePath = path.join(target, 'package.json')
const targetPackage = JSON.parse(await readFile(targetPackagePath, 'utf8'))
targetPackage.name = targetName
if (interactive) targetPackage.description = siteDescription
if (packageManager === 'yarn' && packageManagerVersion) targetPackage.packageManager = `yarn@${packageManagerVersion}`
await writeFile(targetPackagePath, `${JSON.stringify(targetPackage, null, 2)}\n`)
if (packageManager === 'yarn') {
  await writeFile(path.join(target, 'yarn.lock'), '')
  await writeFile(path.join(target, '.yarnrc.yml'), 'nodeLinker: node-modules\n')
}
for (const [relativePath, contents] of Object.entries(deploymentFiles(deployment, packageManager, firebaseProject))) {
  const destination = path.join(target, relativePath)
  await mkdir(path.dirname(destination), { recursive: true })
  await writeFile(destination, contents)
}

/**
 * @param {string} command
 * @param {string[]} commandArgs
 * @param {import('node:child_process').SpawnOptions['stdio']} [stdio]
 * @returns {Promise<void>}
 */
const run = (command, commandArgs, stdio = 'inherit') => new Promise((resolve, reject) => {
  /** @type {import('node:child_process').SpawnOptions} */
  const options = {
    cwd: target,
    stdio,
    shell: process.platform === 'win32',
    env: packageManager === 'yarn' && process.env.NODE_OPTIONS?.includes('.pnp.cjs')
      ? Object.fromEntries(Object.entries(process.env).filter(([key]) => key !== 'NODE_OPTIONS'))
      : process.env,
  }
  const child = spawn(command, commandArgs, options)
  child.on('error', reject)
  child.on('close', code => code === 0 ? resolve() : reject(new Error(`${command} ${commandArgs.join(' ')} 失败，项目文件已保留在 ${target}`)))
})

if (initializeGit) await run('git', ['init', '-b', 'main'], 'ignore')
if (install) {
  if (interactive) log.step(messages.installing(packageManager))
  else console.log(`\n正在使用 ${packageManager} 安装依赖…`)
  await run(process.env.npm_execpath || packageManager, ['install'])
}

const relativeTarget = path.relative(process.cwd(), target) || '.'
const displayTarget = directory === '~' || /^~[\\/]/.test(directory)
  ? directory
  : relativeTarget === '.' || relativeTarget.startsWith('..') ? relativeTarget : `./${relativeTarget}`
const startCommand = displayTarget === '.' ? `${packageManager} run dev` : `cd ${displayTarget}\n${packageManager} run dev`
if (interactive) {
  log.success(messages.success)
  outro(`${messages.next}\n    ${startCommand.replace('\n', '\n    ')}`)
} else {
  console.log(`\nermaozi 已创建：${target}`)
  console.log(startCommand)
}
