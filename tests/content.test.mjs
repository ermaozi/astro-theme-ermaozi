import assert from 'node:assert/strict'
import test from 'node:test'
import { docsFor, postsFor, routeOf, showsStickyBadge } from '../src/lib/content.ts'
import { postExcerptOf } from '../src/lib/post-excerpt.ts'
import { flatSidebarLinks } from '../src/lib/sidebar.ts'
import { resolvePageNav } from '../src/lib/page-nav.ts'

const entry = (id, draft = false, createTime = '2026-08-05', data = {}) => ({
  id,
  body: '',
  data: { title: id, description: '', tags: [], draft, createTime, ...data },
})

test('drafts stay out of production collections and remain available in development', () => {
  const posts = [entry('blog/published'), entry('blog/draft', true, '2026-08-06')]
  assert.deepEqual(postsFor(posts, 'zh-CN').map(item => item.id), ['blog/published'])
  assert.deepEqual(postsFor(posts, 'zh-CN', undefined, true).map(item => item.id), ['blog/draft', 'blog/published'])

  const docs = [entry('docs/published'), entry('docs/draft', true)]
  assert.deepEqual(docsFor(docs, 'zh-CN').map(item => item.id), ['docs/published'])
  assert.deepEqual(docsFor(docs, 'zh-CN', undefined, true).map(item => item.id), ['docs/draft', 'docs/published'])
})

test('permalinks, article exclusion, and every sticky value keep the frozen post contract', () => {
  const posts = [
    entry('blog/normal', false, '2026-08-06'),
    entry('blog/zero', false, '2026-08-01', { sticky: 0 }),
    entry('blog/negative', false, '2026-08-05', { sticky: -1 }),
    entry('blog/high', false, '2026-08-01', { sticky: 5, permalink: '/fixed/' }),
    entry('blog/hidden', false, '2026-08-07', { article: false }),
  ]
  assert.deepEqual(postsFor(posts, 'zh-CN').map(item => item.id), ['blog/high', 'blog/zero', 'blog/negative', 'blog/normal'])
  assert.equal(routeOf(posts[3]), '/fixed/')
  assert.deepEqual([true, false, 0, -1, undefined].map(showsStickyBadge), [true, false, true, false, false])
})

test('post excerpts require an explicit marker or frontmatter override and omit headings', async () => {
  const marked = entry('blog/marked')
  marked.body = '# Hidden heading\n\nVisible summary.\n\n<!-- more -->\n\nFull article.'
  assert.equal(await postExcerptOf(marked), '<p>Visible summary.</p>\n')
  assert.equal(await postExcerptOf({ ...marked, data: { ...marked.data, excerpt: '<strong>Custom HTML</strong>' } }), '<strong>Custom HTML</strong>')
  assert.equal(await postExcerptOf({ ...marked, data: { ...marked.data, excerpt: false } }), '')
  assert.equal(await postExcerptOf({ ...marked, body: 'No marker.' }), '')
})

test('document footer order follows nested sidebar links and omits separators', () => {
  assert.deepEqual(flatSidebarLinks([
    { text: 'Guide', items: [{ text: 'Start', link: '/start/', icon: 'book' }, { text: 'More', items: [{ text: 'API', link: '/api/' }] }] },
    { text: '---', link: '---', separator: true },
    { text: 'External', link: 'https://example.com/' },
  ]), [
    { href: '/start/', title: 'Start', icon: 'book' },
    { href: '/api/', title: 'API', icon: undefined },
    { href: 'https://example.com/', title: 'External', icon: undefined },
  ])
})

test('page footer frontmatter disables and overrides generated links', () => {
  const pages = [{ href: '/guide/api/', title: 'API', icon: 'book' }]
  const fallback = { href: '/guide/start/', title: 'Start' }
  assert.equal(resolvePageNav(false, fallback, pages), undefined)
  assert.deepEqual(resolvePageNav(undefined, fallback, pages), fallback)
  assert.deepEqual(resolvePageNav('/guide/api.md', fallback, pages), { href: '/guide/api/', title: 'API', icon: 'book' })
  assert.deepEqual(resolvePageNav({ link: '/guide/api/', text: 'Custom', icon: 'star' }, fallback, pages), { href: '/guide/api/', title: 'Custom', icon: 'star' })
  assert.deepEqual(resolvePageNav({ link: '/guide/api/' }, fallback, pages), { href: '/guide/api/', title: 'API', icon: 'book' })
})
