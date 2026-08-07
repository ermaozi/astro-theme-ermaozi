export const EXTERNAL_URL_RE = /^[a-z]+:/i
export const PATHNAME_PROTOCOL_RE = /^pathname:\/\//
export const HASH_RE = /#.*/
export const EXT_RE = /(index|README)?\.(md|html)$/
export const inBrowser = typeof document !== 'undefined'

export const toArray = <T>(value: T | T[]): T[] => Array.isArray(value) ? value : [value]

export function normalize(path: string) {
  return decodeURI(path).replace(HASH_RE, '').replace(EXT_RE, '')
}

export function isActive(currentPath: string, matchPath?: string, asRegex = false) {
  if (matchPath === undefined) return false
  currentPath = normalize(`/${currentPath.replace(/^\//, '')}`)
  if (asRegex) return new RegExp(matchPath).test(currentPath)
  if (normalize(matchPath) !== currentPath) return false
  const hash = matchPath.match(HASH_RE)?.[0]
  return hash ? (inBrowser ? location.hash : '') === hash : true
}

export function numToUnit(value?: string | number) {
  if (value === undefined) return ''
  return String(Number(value)) === String(value) ? `${value}px` : String(value)
}

const gradients = ['linear-gradient', 'radial-gradient', 'repeating-linear-gradient', 'repeating-radial-gradient', 'conic-gradient']
export const isGradient = (value: string) => gradients.some(prefix => value.startsWith(prefix))

const absolute = (link: string) => link.startsWith('/') || link.startsWith('#') || EXTERNAL_URL_RE.test(link) || link.startsWith('//')
export function normalizeLink(base = '', link = '') {
  return absolute(link) ? link : `/${base}/${link}`.replace(/\/+/gu, '/').replace(/^([^/])/u, '/$1')
}
export const normalizePrefix = (base: string, link = '') => `${normalizeLink(base, link).replace(/\/+$/u, '')}/`

export function withBase(path = '', base = '/') {
  if (!path.startsWith('/') || path.startsWith('//') || base === '/') return path
  return `${base.replace(/\/?$/u, '/')}${path.replace(/^\/+/, '')}`
}

export type RepoType = 'GitHub' | 'GitLab' | 'Gitee' | 'Bitbucket' | null
export function resolveRepoType(repo: string): RepoType {
  if (!/^(?:https?:)?\/\//u.test(repo) || /github\.com/u.test(repo)) return 'GitHub'
  if (/bitbucket\.org/u.test(repo)) return 'Bitbucket'
  if (/gitlab\.com/u.test(repo)) return 'GitLab'
  if (/gitee\.com/u.test(repo)) return 'Gitee'
  return null
}

export const editLinkPatterns = {
  GitHub: ':repo/edit/:branch/:path',
  GitLab: ':repo/-/edit/:branch/:path',
  Gitee: ':repo/edit/:branch/:path',
  Bitbucket: ':repo/src/:branch/:path?mode=edit&spa=0&at=:branch&fileviewer=file-view-default',
} as const

export function resolveEditLink({ docsRepo, docsBranch, docsDir, filePathRelative, editLinkPattern }: { docsRepo: string, docsBranch: string, docsDir: string, filePathRelative: string | null, editLinkPattern?: string }) {
  if (!filePathRelative) return null
  const type = resolveRepoType(docsRepo)
  const pattern = editLinkPattern ?? (type ? editLinkPatterns[type] : undefined)
  if (!pattern) return null
  const repo = /^(?:https?:)?\/\//u.test(docsRepo) ? docsRepo : `https://github.com/${docsRepo}`
  const path = `${docsDir.replace(/\/+$/u, '')}/${filePathRelative}`.replace(/^\/+/, '')
  return pattern.replaceAll(':repo', repo).replaceAll(':branch', docsBranch).replaceAll(':path', path)
}

export function resolveNavLink(link: string) {
  const path = link.replace(/index\.html?$/iu, '').replace(/\.html?$/iu, '').replace(/\/$/u, '') || '/'
  const text = path === '/' ? 'Home' : decodeURIComponent(path.slice(path.lastIndexOf('/') + 1))
  return { text, link: link.replace(/(?:index|README)?\.(?:md|html)$/iu, '') || '/' }
}
