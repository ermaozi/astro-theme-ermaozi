import { getCollection } from 'astro:content'
import type { APIRoute, GetStaticPaths } from 'astro'
import { isPost, langOf, routeOf, type Lang } from '../lib/content'
import { redactEncryptedSource } from '../lib/encryption'
import { encryptionPolicy } from '../lib/encrypt-policy'
import { siteLocale } from '../lib/seo'
import { configuredLanguages, localeOf, localePrefix } from '../lib/locales'

const paths = configuredLanguages().flatMap(lang => {
  const prefix = localePrefix(lang).replace(/^\//u, '')
  return [
    { route: [prefix, 'llms'].filter(Boolean).join('/'), lang, full: false },
    { route: [prefix, 'llms-full'].filter(Boolean).join('/'), lang, full: true },
  ]
})

export const getStaticPaths = (() => paths.map(page => ({ params: { llms: page.route }, props: page }))) satisfies GetStaticPaths

const mdUrl = (route: string) => `${route}${route.endsWith('/') ? '' : '/'}index.md`

export const GET: APIRoute = async ({ props }) => {
  const { lang, full } = props as { lang: Lang, full: boolean }
  const en = !lang.startsWith('zh')
  const entries = (await getCollection('content'))
    .filter(entry => langOf(entry) === lang && !entry.data.draft && entry.data.llmstxt !== false && !encryptionPolicy(entry).pageEncrypted)
    .sort((a, b) => routeOf(a).localeCompare(routeOf(b)))
  const { siteName, description: siteDescription } = siteLocale(lang)
  const alternates = configuredLanguages().filter(item => item !== lang).map(item => `- [${localeOf(item).selectLanguageName}](${localePrefix(item)}/llms.md)`).join('\n')
  const header = `# ${siteName}\n\n> ${siteDescription}\n\n## Alternate Language Versions\n\n${alternates}\n\n`
  const body = full
    ? entries.map(entry => `---\nurl: ${mdUrl(routeOf(entry))}\ndescription: ${entry.data.description.replaceAll('\n', ' ')}\n---\n# ${entry.data.title}\n\n${redactEncryptedSource(entry.body ?? '').trim()}\n`).join('\n')
    : [
        ['Pages', entries.filter(entry => !isPost(entry))],
        [en ? 'Blog' : '博客', entries.filter(isPost)],
      ].map(([label, pages]) => `### ${label}\n\n${(pages as typeof entries).map(entry => `- [${entry.data.title}](${mdUrl(routeOf(entry))}): ${entry.data.description}`).join('\n')}`).join('\n\n')
  return new Response(`${header}${full ? body : `${en ? 'This file contains links to all documentation sections.' : '此文件包含所有文档分区的链接。'}\n\n## Table of Contents\n\n${body}`}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
