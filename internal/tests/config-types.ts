import { defineSiteConfig } from '../../theme/config.mjs'

const minimal = defineSiteConfig({
  origin: 'https://example.com',
  logo: '/logo.svg',
  home: '/blog/',
  locales: { 'zh-CN': { siteName: 'Site', home: '/' } },
})

minimal.pageContextMenu?.chatgpt
minimal.mediaOrigin?.trim()
minimal.repository.branch ?? 'main'
minimal.search === false

defineSiteConfig({
  origin: 'https://example.com',
  logo: '/logo.svg',
  homeText: 'Start',
  notFound: { title: 'Missing', linkText: 'Home' },
  autoFrontmatter: { transform: (data, context, locale) => ({ ...data, source: `${context.relativePath}:${locale}` }) },
  locales: {
    'zh-CN': {
      siteName: 'Site',
      path: '/',
      home: '/',
      collections: [{ type: 'post', dir: 'blog', categoriesTransform: categories => categories.filter(item => item.type === 'category') }],
    },
  },
  markdown: { include: { resolvePath: (reference, cwd) => `${cwd ?? ''}/${reference}` } },
})
