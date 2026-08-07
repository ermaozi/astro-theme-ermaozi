import { getCollection } from 'astro:content'
import type { APIRoute } from 'astro'
import { langOf, routeOf, translationsOf } from '../lib/content'
import { absoluteUrl, modifiedTimeOf } from '../lib/seo'
import { configuredLanguages } from '../lib/locales'
import { postCollectionsFor } from '../lib/collections'

const xml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
const node = (name: string, value: unknown) => value === undefined || value === null || value === '' ? '' : `<${name}>${xml(String(value instanceof Date ? value.toISOString() : value))}</${name}>`
const assetUrl = (value: string) => /^https?:\/\//u.test(value) ? value : absoluteUrl(value)

const imageNodes = (items: any[] = []) => items.map(item => `<image:image>${node('image:loc', assetUrl(item.url))}${node('image:caption', item.caption)}${node('image:title', item.title)}${node('image:geo_location', item.geoLocation)}${node('image:license', item.license)}</image:image>`).join('')
const videoNodes = (items: any[] = []) => items.map(item => `<video:video>${Object.entries(item).filter(([key]) => key !== 'id').map(([key, value]) => key === 'player_loc:autoplay'
  ? ''
  : Array.isArray(value)
    ? value.map(part => node(`video:${key}`, part)).join('')
    : node(`video:${key}`, value)).join('')}</video:video>`).join('')
const newsNodes = (items: any[] = []) => items.map(item => {
  const publication = item.publication ?? {}
  return `<news:news>${node('news:access', item.access)}<news:publication>${node('news:name', publication.name)}${node('news:language', publication.language)}</news:publication>${['genres', 'publication_date', 'title', 'keywords', 'stock_tickers'].map(key => node(`news:${key}`, item[key] ?? publication[key])).join('')}</news:news>`
}).join('')

export const GET: APIRoute = async () => {
  const entries = (await getCollection('content')).filter(entry => {
    const noindex = (entry.data.head ?? []).some((item: any) => Array.isArray(item) && item[0] === 'meta' && item[1]?.name === 'robots' && String(item[1]?.content ?? '').split(',').some(part => part.trim() === 'noindex'))
    return entry.data.sitemap !== false && !entry.data.draft && !noindex
  })
  const urls = entries.map(entry => {
    const route = routeOf(entry)
    const alternates = translationsOf(entry, entries)
    const modified = entry.data.home ? undefined : modifiedTimeOf(entry)
    const options = typeof entry.data.sitemap === 'object' ? entry.data.sitemap : {}
    return `<url><loc>${xml(absoluteUrl(route))}</loc>${modified ? `<lastmod>${modified}</lastmod>` : ''}${node('changefreq', options.changefreq ?? 'daily')}${node('priority', options.priority)}${imageNodes(options.img)}${videoNodes(options.video)}${newsNodes(options.news)}${alternates.map(item => `<xhtml:link rel="alternate" hreflang="${xml(langOf(item))}" href="${xml(absoluteUrl(routeOf(item)))}"/>`).join('')}</url>`
  })
  configuredLanguages().forEach(lang => postCollectionsFor(lang).forEach(collection => [
    collection.postList === false ? '' : collection.link,
    collection.tags === false ? '' : collection.tagsLink,
    collection.categories === false ? '' : collection.categoriesLink,
    collection.archives === false ? '' : collection.archivesLink,
  ].filter(Boolean).forEach(route => urls.push(`<url><loc>${xml(absoluteUrl(route))}</loc><changefreq>daily</changefreq></url>`))))
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">${urls.join('')}</urlset>`
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
