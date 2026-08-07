import { randomBytes } from 'node:crypto'
import { watch as watchFiles } from 'node:fs'
import { readdir, readFile, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, join, matchesGlob, posix, relative, resolve, sep } from 'node:path'
import { parse, stringify } from 'yaml'

const slash = value => value.split(sep).join('/')
const normalizeOption = value => value === true || value === undefined ? {} : value
const trimNumber = value => value.replace(/^\d+\./u, '').trim()
const isIndex = file => /^(?:index|readme)\.md$/iu.test(basename(file))
const formatTime = value => `${value.getFullYear()}/${String(value.getMonth() + 1).padStart(2, '0')}/${String(value.getDate()).padStart(2, '0')} ${[value.getHours(), value.getMinutes(), value.getSeconds()].map(part => String(part).padStart(2, '0')).join(':')}`
const joinRoute = (...parts) => `/${parts.flatMap(part => String(part ?? '').split('/')).filter(Boolean).join('/')}/`.replace(/\/{2,}/gu, '/')
const routeKey = value => `/${String(value ?? '').replaceAll('\\', '/').replace(/^\/+|\/+$/gu, '')}/`.replace(/\/{2,}/gu, '/')
const toArray = value => value === undefined ? [] : Array.isArray(value) ? value : [value]
const matchesAny = (filepath, patterns) => toArray(patterns).some(pattern => matchesGlob(filepath, pattern))

async function markdownFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? markdownFiles(join(directory, entry.name))
    : entry.name.endsWith('.md') && !entry.name.endsWith('.snippet.md') ? [join(directory, entry.name)] : []))).flat()
}

const splitFrontmatter = source => {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/u)
  return match
    ? { data: parse(match[1]) ?? {}, content: source.slice(match[0].length) }
    : { data: {}, content: source }
}

async function filepathSlug(filepath) {
  let pinyin
  try { ({ pinyin } = await import('pinyin-pro')) }
  catch { /* optional, matching Plume */ }
  const source = pinyin ? pinyin(filepath, { toneType: 'none', nonZh: 'consecutive' }) : filepath
  return source.split('/').map(part => trimNumber(part).replace(/\.md$/iu, '').trim().replace(/[^\p{Letter}\p{Number}]+/gu, '-').replace(/^-|-$/gu, '').toLowerCase()).filter(Boolean).join('/')
}

const currentName = filepath => trimNumber(isIndex(filepath) ? basename(dirname(filepath)) : basename(filepath, '.md')) || 'Home'

function sidebarLinks(sidebar, collectionDir) {
  const links = {}
  const visit = (items, link = '/', directory = '') => {
    if (!Array.isArray(items)) return
    for (const item of items) {
      if (typeof item === 'string') links[routeKey(directory)] = link
      else if (item) {
        const prefix = item.prefix ?? ''
        visit(
          item.items,
          posix.join(link, item.link ?? '/'),
          prefix.startsWith('/') ? prefix : posix.join('/', directory, prefix || item.dir || ''),
        )
      }
    }
  }
  for (const item of Array.isArray(sidebar) ? sidebar : []) {
    if (typeof item !== 'string' && item) visit(item.items, item.link ?? '/', posix.join('/', collectionDir, item.prefix || item.dir || ''))
  }
  return links
}

export async function generateAutoFrontmatter({ root = resolve('content'), config }) {
  const globalOption = normalizeOption(config.autoFrontmatter ?? true)
  const localeEntries = Object.entries(config.locales ?? {})
  const rootLang = localeEntries.find(([, locale]) => locale.home === '/')?.[0] ?? localeEntries[0]?.[0]
  const changed = []

  for (const filepath of await markdownFiles(root)) {
    const relativePath = slash(relative(root, filepath))
    const [, locale = {}] = localeEntries
      .filter(([, item]) => item.home !== '/')
      .sort(([, left], [, right]) => right.home.length - left.home.length)
      .find(([, item]) => relativePath.startsWith(`${item.home.replace(/^\//u, '').replace(/\/$/u, '')}/`)) ?? [rootLang, config.locales?.[rootLang] ?? {}]
    const localeRoot = locale.home ?? '/'
    const localeDirectory = localeRoot.replace(/^\//u, '').replace(/\/$/u, '')
    const localPath = localeDirectory && relativePath.startsWith(`${localeDirectory}/`) ? relativePath.slice(localeDirectory.length + 1) : relativePath
    const collections = locale.collections ?? config.collections ?? []
    const ownedCollection = collections.find(item => localPath === `${item.dir}/index.md` || localPath === `${item.dir}/README.md` || localPath.startsWith(`${item.dir}/`))
    const collection = collections.find(item => {
      const inDirectory = localPath === `${item.dir}/index.md` || localPath === `${item.dir}/README.md` || localPath.startsWith(`${item.dir}/`)
      if (item.type !== 'post') return inDirectory
      return (inDirectory || matchesAny(relativePath, item.include)) && !matchesAny(relativePath, item.exclude)
    })
    if (!collection && (ownedCollection || globalOption === false)) continue
    const collectionOption = collection?.autoFrontmatter
    if (collectionOption === false) continue
    const collectionEnabled = collection ? (collectionOption ?? globalOption) !== false : globalOption !== false
    if (!collectionEnabled) continue
    const options = {
      ...(globalOption === false ? {} : globalOption),
      ...(collectionOption && collectionOption !== true ? collectionOption : {}),
    }
    const source = await readFile(filepath, 'utf8')
    let { data, content } = splitFrontmatter(source)
    const before = JSON.stringify(data)
    const rootPage = isIndex(localPath) && dirname(localPath) === '.'
    const collectionRoot = collection && isIndex(localPath) && dirname(localPath) === collection.dir

    if (rootPage) data.pageLayout = 'home'
    if ((options.title ?? true) && !Object.hasOwn(data, 'title')) data.title = rootPage ? 'Home' : collectionRoot ? collection.title ?? trimNumber(collection.dir) : currentName(localPath)
    if ((options.createTime ?? true) && !rootPage && !Object.hasOwn(data, 'createTime')) {
      const info = await stat(filepath)
      data.createTime = formatTime(info.birthtime.getFullYear() === 1970 ? info.atime : info.birthtime)
    }
    if ((options.permalink ?? true) && !rootPage && !Object.hasOwn(data, 'permalink')) {
      const prefix = collection?.linkPrefix ?? collection?.link ?? collection?.dir
      if (collection?.type === 'doc' && collectionRoot) data.permalink = joinRoute(localeRoot, prefix)
      else if (collection?.type === 'doc' && Array.isArray(collection.sidebar)) {
        const link = sidebarLinks(collection.sidebar, collection.dir)[routeKey(dirname(localPath))] ?? '/'
        const slug = isIndex(localPath) ? '' : options.permalink === 'filepath'
          ? await filepathSlug(link === '/' ? localPath.slice(collection.dir.length + 1) : basename(localPath))
          : randomBytes(6).toString('base64url').slice(0, 8)
        data.permalink = joinRoute(localeRoot, prefix, link, slug)
      }
      else {
        const collectionRelative = collection && localPath.startsWith(`${collection.dir}/`) ? localPath.slice(collection.dir.length + 1) : localPath
        const slug = options.permalink === 'filepath' ? await filepathSlug(collectionRelative) : randomBytes(6).toString('base64url').slice(0, 8)
        data.permalink = joinRoute(localeRoot, prefix, slug)
      }
    }
    const transform = collection ? normalizeOption(collectionOption)?.transform : globalOption.transform
    data = await transform?.(data, { filepath, relativePath, content }, localeRoot) ?? data
    if (JSON.stringify(data) === before) continue
    await writeFile(filepath, `---\n${stringify(data, { lineWidth: 0 })}---\n${content}`)
    changed.push(relativePath)
  }
  return changed
}

export function autoFrontmatterIntegration(config, root = resolve('content')) {
  return {
    name: 'ermaozi:auto-frontmatter',
    hooks: {
      'astro:server:setup': ({ server }) => {
        if ((config.autoFrontmatter ?? true) === false) return
        let timer
        const watcher = watchFiles(root, { recursive: true }, (event, filename) => {
          if (event !== 'rename' || !filename?.endsWith('.md') || filename.endsWith('.snippet.md')) return
          clearTimeout(timer)
          timer = setTimeout(() => { void generateAutoFrontmatter({ root, config }) }, 50)
        })
        server.httpServer?.once('close', () => { clearTimeout(timer); watcher.close() })
      },
    },
  }
}
