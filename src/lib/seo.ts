import type { ContentEntry, Lang } from './content'
import { isPost, langOf, routeOf, sectionOf } from './content'
import modifiedTimes from '../data/modified-times.json'
import { socialLinks } from './social'
import { siteConfig } from '../../site.config.mjs'
import { localeOf } from './locales'

export const hostname = siteConfig.origin

export const siteLocale = (lang: Lang) => localeOf(lang)
export const absoluteUrl = (route: string) => new URL(route, hostname).toString()

export const modifiedTimeOf = (entry: ContentEntry) => modifiedTimes[routeOf(entry) as keyof typeof modifiedTimes]
  ?? iso(entry.data.updateTime ?? entry.data.createTime ?? entry.data.date)

export const iso = (value: unknown) => {
  if (!value) return undefined
  const date = value instanceof Date ? value : new Date(String(value).replaceAll('/', '-'))
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
}

export const imagesOf = (entry?: ContentEntry) => entry
  ? [...(entry.body ?? '').matchAll(/(?:!\[[^\]]*\]\(|<img\s+[^>]*src=["'])([^\s)"']+)/g)]
      .map(match => match[1])
      .filter(url => url.startsWith('/') || /^https?:\/\//u.test(url))
      .map(url => url.startsWith('/') ? absoluteUrl(url) : url)
  : []

export const authorsOf = (value: unknown, fallback = '') => {
  const authors = (Array.isArray(value) ? value : value ? [value] : fallback ? [fallback] : []) as Array<string | { name?: string, url?: string, email?: string }>
  return authors.map(author => typeof author === 'string' ? { name: author } : author).filter(author => author.name)
}

const siteData = (lang: Lang) => {
  const page = localeOf(lang)
  const authorId = `${hostname}${page.home}about/#person`
  const websiteId = `${hostname}${page.home}#website`
  const site = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: absoluteUrl(page.home),
        name: page.siteName,
        description: page.description,
        inLanguage: lang,
        publisher: { '@id': authorId },
      },
      {
        '@type': 'Person',
        '@id': authorId,
        name: page.authorName,
        url: absoluteUrl(`${page.home}about/`),
        image: absoluteUrl(siteConfig.logo),
        description: page.authorDescription,
        sameAs: socialLinks.map(({ link }) => link).filter(link => /^https?:\/\//.test(link)),
      },
    ],
  }

  return { page, authorId, websiteId, site }
}

export const structuredPageData = (title: string, description: string, lang: Lang, route: string, entry?: ContentEntry) => {
  const { page, authorId, websiteId, site } = siteData(lang)
  const post = entry ? isPost(entry) : false
  const items = [{ '@type': 'ListItem', position: 1, name: page.homeText, item: absoluteUrl(page.home) }]
  if (post) items.push({ '@type': 'ListItem', position: 2, name: page.postsText, item: absoluteUrl(`${page.home}blog/`) })
  items.push({ '@type': 'ListItem', position: items.length + 1, name: title, item: absoluteUrl(route) })

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  }

  const images = imagesOf(entry)
  const cover = entry?.data.banner ?? entry?.data.cover
  const articleImages = cover ? [cover.startsWith('/') ? absoluteUrl(cover) : cover] : images
  const authors = authorsOf(entry?.data.author, page.authorName)
  const article = entry && post ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    image: articleImages.length ? articleImages : [absoluteUrl(siteConfig.logo)],
    datePublished: iso(entry.data.date ?? entry.data.time),
    dateModified: modifiedTimeOf(entry),
    author: authors.map(author => ({ '@type': 'Person', ...author })),
    '@id': `${absoluteUrl(route)}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(route) },
    inLanguage: lang,
    articleSection: sectionOf(entry) || page.postsText,
    keywords: entry.data.tags.join(', '),
    publisher: { '@id': authorId },
    isPartOf: { '@id': websiteId },
  } : null

  const webPage = { '@context': 'https://schema.org', '@type': 'WebPage', name: title, description }
  return article ? [article, site, breadcrumb] : entry ? [webPage, site, breadcrumb] : [site, breadcrumb]
}

export const structuredData = (entry: ContentEntry) => structuredPageData(
  entry.data.title,
  entry.data.description,
  langOf(entry),
  routeOf(entry),
  entry,
)
