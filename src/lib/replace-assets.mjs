const imageExtensions = ['apng', 'bmp', 'png', 'jpe?g', 'jfif', 'pjpeg', 'pjp', 'gif', 'svg', 'ico', 'webp', 'avif', 'cur', 'jxl']
const mediaExtensions = ['mp4', 'webm', 'ogg', 'mp3', 'wav', 'flac', 'aac', 'opus', 'mov', 'm4a', 'vtt', 'pdf']

const findPattern = (directory, extensions) => new RegExp(`^/${directory}/.*\\.(?:${extensions.join('|')})(\\?.*)?$`, 'u')

export function normalizeAssetRules(options) {
  if (!options) return []
  if (typeof options === 'string' || typeof options === 'function') options = { all: options }
  if (Array.isArray(options)) return options
  if ('find' in options) return options.find && options.replacement ? [options] : []

  const rules = options.rules ? (Array.isArray(options.rules) ? [...options.rules] : [options.rules]) : []
  if (options.image || options.all) rules.push({ find: findPattern('images', imageExtensions), replacement: options.image || options.all })
  if (options.media || options.all) rules.push({ find: findPattern('medias', mediaExtensions), replacement: options.media || options.all })
  return rules
}

export function replaceAssetUrl(rules, url) {
  for (const { find, replacement } of rules) {
    const matches = typeof find === 'string'
      ? find.startsWith('^') || find.endsWith('$')
        ? new RegExp(find, 'u').test(url)
        : url.startsWith(find) || url.endsWith(find)
      : (find.lastIndex = 0, find.test(url))
    if (!matches) continue
    if (typeof replacement === 'function') return replacement(url)
    return `${replacement.replace(/\/$/u, '')}/${url.replace(/^\//u, '')}`
  }
}

export function transformAssetUrls(code, rules) {
  return code.replace(/("(\/[^/][^"\n]*?)"|'(\/[^/][^'\n]*?)'|\((\/[^/][^)\n]*?)\)|\('(\/[^/][^'\n]*?)'\)|\("(\/[^/][^"\n]*?)"\)|\\"(\/[^/][^"\n]*?)\\")/gu, (match, _all, double, single, bare, singleParen, doubleParen, escaped) => {
    const url = escaped || doubleParen || singleParen || bare || single || double
    const replacement = replaceAssetUrl(rules, url)
    if (!replacement) return match
    if (match.startsWith('(')) return `("${replacement}")`
    if (match.startsWith('\\"')) return `\\"${replacement}\\"`
    return `"${replacement}"`
  })
}

async function rewriteBuild(directory, rules) {
  const entries = await readdir(directory, { withFileTypes: true })
  await Promise.all(entries.map(async entry => {
    const file = join(directory, entry.name)
    if (entry.isDirectory()) return rewriteBuild(file, rules)
    if (!['.html', '.css', '.js', '.mjs'].includes(extname(file))) return
    const source = await readFile(file, 'utf8')
    const transformed = transformAssetUrls(source, rules)
    if (transformed !== source) await writeFile(file, transformed)
  }))
}

export function replaceAssetsIntegration(options) {
  const rules = normalizeAssetRules(options)
  return {
    name: 'ermaozi:replace-assets',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        if (!rules.length) return
        updateConfig({
          vite: {
            plugins: [{
              name: 'ermaozi:replace-assets:vite',
              enforce: 'pre',
              transform(code, id) {
                if (id.includes('astro:data-layer-content') || /\.(?:json|mdx?)(?:$|\?)/u.test(id) || /\.html?$/u.test(id)) return
                const transformed = transformAssetUrls(code, rules)
                return transformed === code ? null : transformed
              },
            }],
          },
        })
      },
      'astro:build:done': async ({ dir }) => {
        if (rules.length) await rewriteBuild(fileURLToPath(dir), rules)
      },
    },
  }
}
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
