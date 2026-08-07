import { getCollection, type CollectionEntry } from 'astro:content'
import { encryptionPolicy } from './encrypt-policy'
import { redactEncryptedSource } from './encryption'
import { routeOf } from './content'
import { llmMarkdownSource } from './llm-markdown'

type ContentEntry = CollectionEntry<'content'>

export const rawMarkdownEntries = async () => (await getCollection('content'))
  .filter(entry => !entry.data.draft && entry.data.llmstxt !== false && !encryptionPolicy(entry).pageEncrypted)

export const rawMarkdownResponse = (entry: ContentEntry) => {
  const body = llmMarkdownSource(redactEncryptedSource(entry.body?.trimStart() ?? ''))
  return new Response(body.startsWith('# ') ? body : `# ${entry.data.title}\n\n${body}`, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}

export const legacyRawPath = (entry: ContentEntry) => {
  const route = routeOf(entry)
  return route === '/' ? 'index' : route.replace(/^\//u, '').replace(/\/$/u, '')
}

export const plumeRawPath = (entry: ContentEntry) => {
  const route = routeOf(entry)
  return route === '/' ? 'index' : `${route.replace(/^\//u, '').replace(/\/$/u, '')}/index`
}
