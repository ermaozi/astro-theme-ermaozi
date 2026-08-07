import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const frozenSlots = [
  'layout-top', 'layout-bottom', 'nav-bar-title-before', 'nav-bar-title-after',
  'nav-bar-content-before', 'nav-bar-content-after', 'nav-bar-menu-before', 'nav-bar-menu-after',
  'nav-screen-content-before', 'nav-screen-content-after', 'nav-screen-menu-before', 'nav-screen-menu-after',
  'footer-content', 'bulletin-content', 'not-found', 'custom-content', 'page-top', 'page-bottom',
  'doc-top', 'doc-bottom', 'doc-content-before', 'doc-footer-before', 'doc-before', 'doc-after',
  'doc-title-before', 'doc-title-after', 'doc-meta-top', 'doc-meta-bottom', 'doc-meta-before', 'doc-meta-after',
  'sidebar-nav-before', 'sidebar-nav-after', 'aside-top', 'aside-bottom', 'aside-outline-before', 'aside-outline-after',
  'posts-top', 'posts-bottom', 'posts-aside-top', 'posts-aside-bottom', 'posts-extract-before', 'posts-extract-after',
  'posts-post-list-before', 'posts-post-list-after', 'posts-post-list-pagination-after',
  'posts-tags-before', 'posts-tags-title-after', 'posts-tags-content-before', 'posts-tags-after',
  'posts-archives-before', 'posts-archives-after',
  'posts-categories-before', 'posts-categories-content-before', 'posts-categories-after',
]

test('all documented frozen Plume layout slots have Astro or Vue component hooks', async () => {
  const files = await Promise.all([
    'src/layouts/BaseLayout.astro', 'src/pages/[...path].astro', 'src/pages/404.astro', 'src/components/NotFound.astro',
    'src/components/Header.astro', 'src/components/Footer.astro', 'src/components/Bulletin.astro',
    'src/components/DocsSidebar.astro', 'src/components/PostList.astro', 'src/components/TaxonomyPage.astro',
    'src/components/ProfileAside.astro', 'src/components/CustomHome.astro',
  ].map(file => readFile(file, 'utf8')))
  const source = files.join('\n')
  for (const name of frozenSlots) assert.match(source, new RegExp(`name=["']${name}["']`), name)

  const loader = await readFile('src/lib/user-slots.ts', 'utf8')
  assert.match(loader, /components\/slots\/\*\.\{astro,vue\}/)
  assert.match(loader, /pascalName/)
  const renderer = await readFile('src/components/UserSlot.astro', 'utf8')
  assert.match(renderer, /const \{ name, \.\.\.props \} = Astro\.props/)
  assert.match(renderer, /<Component \{\.\.\.props\} \/>/)
})
