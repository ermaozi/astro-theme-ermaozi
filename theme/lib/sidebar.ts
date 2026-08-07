import type { ContentEntry } from './content.ts'
import { routeOf } from './content.ts'
import { relativeContentId, type ResolvedDocCollection, type SidebarBadge, type SidebarItem } from './collections.ts'
import type { Lang } from './locales.ts'

export type ResolvedSidebarItem = {
  text: string
  link?: string
  icon?: string | { svg: string }
  badge?: SidebarBadge
  items?: ResolvedSidebarItem[]
  collapsed?: boolean
  entryId?: string
  separator?: boolean
  sort?: number
}

export type SidebarLink = { href: string, title: string, icon?: string | { svg: string } }

const clean = (value = '') => value.replaceAll('\\', '/').replace(/^\.\//u, '').replace(/^\/+|\/+$/gu, '').replace(/\.(?:md|html)$/iu, '')
const label = (value: string) => value.replace(/^\d+\./u, '')
const order = (value: string) => Number(value.match(/^(\d+)\./u)?.[1] ?? Number.MAX_SAFE_INTEGER)
const relativeToCollection = (entry: ContentEntry, lang: Lang, collection: ResolvedDocCollection) => relativeContentId(entry.id, lang).slice(collection.dir.length).replace(/^\//u, '')

const sorted = (items: ResolvedSidebarItem[]) => items.sort((left, right) => (left.sort ?? Number.MAX_SAFE_INTEGER) - (right.sort ?? Number.MAX_SAFE_INTEGER) || left.text.localeCompare(right.text))

function autoItems(entries: ContentEntry[], lang: Lang, collection: ResolvedDocCollection, prefix = ''): ResolvedSidebarItem[] {
  const direct: ResolvedSidebarItem[] = []
  const directories = new Map<string, ContentEntry[]>()
  for (const entry of entries) {
    const relative = relativeToCollection(entry, lang, collection)
    if (!relative || /^(?:index|readme)$/iu.test(relative)) continue
    const scoped = prefix ? relative.startsWith(`${clean(prefix)}/`) ? relative.slice(clean(prefix).length + 1) : '' : relative
    if (!scoped) continue
    const [head, ...tail] = scoped.split('/')
    if (tail.length) directories.set(head, [...(directories.get(head) ?? []), entry])
    else direct.push({
      text: entry.data.title,
      link: routeOf(entry),
      badge: entry.data.badge,
      entryId: entry.id,
      sort: Number(entry.data.order ?? order(head)),
    })
  }
  const groups = [...directories].map(([directory, children]) => ({
    text: children.find(entry => entry.data.group)?.data.group ?? label(directory),
    items: autoItems(entries, lang, collection, [prefix, directory].filter(Boolean).join('/')),
    collapsed: collection.sidebarCollapsed ?? false,
    sort: order(directory),
  }))
  return sorted([...direct, ...groups])
}

const protocolLink = (value: string) => /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/iu.test(value)
const join = (prefix: string, value: string) => protocolLink(value) ? value : clean(value.startsWith('/') ? value : `${clean(prefix)}/${value}`)

function findEntry(entries: ContentEntry[], lang: Lang, collection: ResolvedDocCollection, value: string) {
  const target = clean(value)
  return entries.find(entry => routeOf(entry).replace(/^\/+|\/+$/gu, '') === target)
    ?? entries.find(entry => {
      const relative = relativeToCollection(entry, lang, collection).replace(/\/(?:index|readme)$/iu, '')
      return clean(relative) === target || clean(`${collection.dir}/${relative}`) === target
    })
}

function manualItems(items: SidebarItem[], entries: ContentEntry[], lang: Lang, collection: ResolvedDocCollection, parentPrefix = ''): ResolvedSidebarItem[] {
  return items.flatMap<ResolvedSidebarItem>(item => {
    const option = typeof item === 'string' ? { link: item } : item
    const prefix = option.prefix === undefined ? parentPrefix : join(parentPrefix, option.prefix)
    const link = option.link ? join(prefix, option.link) : ''
    if (/^-{3,}$/u.test(option.link ?? '')) return [{ text: option.text ?? '', link: option.link, separator: true, icon: option.icon }]
    const entry = link ? findEntry(entries, lang, collection, link) : undefined
    const children = option.items === 'auto'
      ? autoItems(entries, lang, collection, prefix)
      : option.items?.length ? manualItems(option.items, entries, lang, collection, prefix) : undefined
    if (!entry && !children?.length && !option.text) return []
    return [{
      text: option.text ?? entry?.data.title ?? label(link.split('/').at(-1) ?? ''),
      link: entry ? routeOf(entry) : option.link && !children?.length ? protocolLink(link) ? link : `/${link}/`.replace(/\/{2,}/gu, '/') : undefined,
      icon: option.icon,
      badge: option.badge ?? entry?.data.badge,
      items: children,
      collapsed: option.collapsed ?? (children?.length ? collection.sidebarCollapsed ?? false : undefined),
      entryId: entry?.id,
    }]
  })
}

export function resolveSidebar(entries: ContentEntry[], lang: Lang, collection: ResolvedDocCollection) {
  const docs = entries.filter(entry => relativeContentId(entry.id, lang) === collection.dir || relativeContentId(entry.id, lang).startsWith(`${collection.dir}/`))
  const configured = collection.sidebar
  return Array.isArray(configured) ? manualItems(configured, docs, lang, collection) : autoItems(docs, lang, collection)
}

export function sidebarGroups(items: ResolvedSidebarItem[]) {
  const groups: ResolvedSidebarItem[] = []
  let leafGroup = 0
  for (const item of items) {
    if (item.items) {
      leafGroup = groups.push(item)
      continue
    }
    if (!groups[leafGroup]) groups.push({ text: '', items: [] })
    groups[leafGroup].items!.push(item)
  }
  return groups
}

export function flatSidebarLinks(items: ResolvedSidebarItem[], links: SidebarLink[] = []) {
  for (const item of items) {
    if (item.link && !item.separator) links.push({ href: item.link, title: item.text, icon: item.icon })
    if (item.items) flatSidebarLinks(item.items, links)
  }
  return links
}
