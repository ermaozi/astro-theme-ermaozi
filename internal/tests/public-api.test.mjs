import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import plumeTheme, { defineCollection, defineCollections, defineNavbarConfig, defineSiteConfig, defineThemeConfig } from '../../theme/node.ts'
import { defineEChartsConfig, useEChartsConfig } from '../../theme/lib/echarts-config.ts'
import { isActive, isGradient, normalize, normalizeLink, normalizePrefix, numToUnit, resolveEditLink, resolveNavLink, resolveRepoType, toArray, withBase, withBaseInHtml, withoutBase } from '../../theme/lib/client-utils.ts'
import { languageFromPath } from '../../theme/lib/locales.ts'
import { isIOS } from '../../theme/components/vue/background/helpers.ts'
import { tintPlateColors } from '../../theme/lib/tint-plate.ts'
import { homeConfigOf } from '../../theme/lib/home.ts'

test('public Node helpers preserve identity and the client barrel covers the frozen documented API', async () => {
  const values = [
    [{ text: 'Docs', link: '/docs/' }],
    [{ type: 'post', dir: 'blog' }],
    { type: 'doc', dir: 'docs' },
    { locales: {} },
  ]
  assert.equal(defineNavbarConfig(values[0]), values[0])
  assert.equal(defineCollections(values[1]), values[1])
  assert.equal(defineCollection(values[2]), values[2])
  assert.equal(defineThemeConfig(values[3]), values[3])
  const site = { origin: 'https://example.com', logo: '/logo.svg', locales: {} }
  assert.equal(defineSiteConfig(site), site)
  assert.equal(plumeTheme(values[3]), values[3])
  const [client, node] = await Promise.all([readFile('theme/client.ts', 'utf8'), readFile('theme/node.ts', 'utf8')])
  const frozenNodeHelpers = ['defineSiteConfig', 'defineThemeConfig', 'defineNavbarConfig', 'defineNotesConfig', 'defineNoteConfig', 'defineCollections', 'defineCollection']
  const frozenClientComponents = ['VPBadge', 'VPCard', 'VPCardGrid', 'VPHomeBanner', 'VPHomeBox', 'VPHomeCustom', 'VPHomeFeatures', 'VPHomeHero', 'VPHomeProfile', 'VPHomeTextImage', 'VPButton', 'VPIcon', 'VPImage', 'VPLink']
  for (const name of frozenNodeHelpers) assert.match(node, new RegExp(`\\b${name}\\b`))
  for (const name of frozenClientComponents) {
    assert.match(client, new RegExp(`default as ${name}\\b`))
  }
  assert.match(client, /export \{ Layout, NotFound \}/)
  for (const name of ['useDarkMode', 'useData', 'useLocalePostList']) assert.match(client, new RegExp(`function ${name}\\b`))
  assert.match(client, /export const plumeClientConfig = Object\.freeze\(\{ layouts:/)
  assert.match(client, /echarts-config/)
  assert.doesNotMatch(client, /node:/)
})

test('ECharts public config preserves the frozen singleton contract', () => {
  const config = { option: { backgroundColor: '#123456' }, setup: async () => {} }
  defineEChartsConfig(config)
  assert.equal(useEChartsConfig(), config)
  defineEChartsConfig({})
})

test('public client utilities preserve the frozen path, CSS, and repository contracts', () => {
  assert.deepEqual(toArray('one'), ['one'])
  assert.equal(normalize('/README.md#top'), '/')
  assert.equal(isActive('/docs/', '/docs/'), true)
  assert.equal(isActive('/docs/guide/', '^/docs/', true), true)
  assert.equal(numToUnit(12), '12px')
  assert.equal(numToUnit('2rem'), '2rem')
  assert.equal(isGradient('linear-gradient(red, blue)'), true)
  assert.equal(normalizeLink('/docs/', 'guide/'), '/docs/guide/')
  assert.equal(normalizePrefix('/docs/', 'guide'), '/docs/guide/')
  assert.equal(withBase('/logo.svg', '/theme/'), '/theme/logo.svg')
  assert.equal(withBase('/theme/logo.svg', '/theme/'), '/theme/logo.svg')
  assert.equal(withBase('https://example.com/logo.svg', '/theme/'), 'https://example.com/logo.svg')
  assert.equal(withoutBase('/theme/docs/', '/theme/'), '/docs/')
  assert.equal(withoutBase('/theme', '/theme/'), '/')
  assert.equal(withBaseInHtml('<a href="/docs/"><img src="/img/a.png"><a href="https://example.com/">', '/theme/'), '<a href="/theme/docs/"><img src="/theme/img/a.png"><a href="https://example.com/">')
  assert.equal(resolveRepoType('owner/repo'), 'GitHub')
  assert.equal(resolveRepoType('https://gitlab.com/owner/repo'), 'GitLab')
  assert.equal(resolveEditLink({ docsRepo: 'owner/repo', docsBranch: 'main', docsDir: 'content', filePathRelative: 'guide.md' }), 'https://github.com/owner/repo/edit/main/content/guide.md')
  assert.equal(resolveEditLink({ docsRepo: 'https://gitlab.com/owner/repo', docsBranch: 'main', docsDir: 'content', filePathRelative: 'guide.md' }), 'https://gitlab.com/owner/repo/-/edit/main/content/guide.md')
  assert.equal(resolveEditLink({ docsRepo: 'https://gitee.com/owner/repo', docsBranch: 'main', docsDir: 'content', filePathRelative: 'guide.md' }), 'https://gitee.com/owner/repo/edit/main/content/guide.md')
  assert.equal(resolveEditLink({ docsRepo: 'https://bitbucket.org/owner/repo', docsBranch: 'main', docsDir: 'content', filePathRelative: 'guide.md' }), 'https://bitbucket.org/owner/repo/src/main/content/guide.md?mode=edit&spa=0&at=main&fileviewer=file-view-default')
  assert.equal(resolveEditLink({ docsRepo: 'https://example.com/owner/repo', docsBranch: 'main', docsDir: 'content', filePathRelative: 'guide.md', editLinkPattern: ':repo/write/:branch/:path' }), 'https://example.com/owner/repo/write/main/content/guide.md')
  assert.deepEqual(resolveNavLink('/guide/index.html'), { text: 'guide', link: '/guide/' })
  assert.equal(languageFromPath('/en/docs/'), 'en-US')
  assert.equal(languageFromPath('/docs/'), 'zh-CN')
})

test('public page data excludes unlock credentials and custom CSS loads last', async () => {
  const [layout, encrypted, clientConfig] = await Promise.all([
    readFile('theme/layouts/BaseLayout.astro', 'utf8'),
    readFile('dist/blog/encrypted-example/index.html', 'utf8'),
    readFile('theme/client-config.ts', 'utf8'),
  ])
  assert.match(layout, /import '\.\.\/client-config\.ts'/)
  assert.match(clientConfig, /export \{\}/)
  assert.match(layout, /import '\.\.\/styles\/custom\.css'/)
  assert.ok(layout.indexOf("import '../styles/custom.css'") > layout.indexOf("import 'swiper/css/bundle'"))
  const payload = encrypted.match(/<script id="ermaozi-page-data" type="application\/json">([^<]*)<\/script>/)?.[1]
  assert.ok(payload)
  const data = JSON.parse(payload)
  assert.equal(Object.hasOwn(data.frontmatter, 'password'), false)
  assert.equal(Object.hasOwn(data.frontmatter, 'passwordHint'), false)
})

test('home background components preserve Plume mask, gradient, attachment, and single-section semantics', async () => {
  const [banner, hero, box, layout] = await Promise.all([
    readFile('theme/components/VPHomeBanner.astro', 'utf8'),
    readFile('theme/components/VPHomeHero.astro', 'utf8'),
    readFile('theme/components/VPHomeBox.astro', 'utf8'),
    readFile('theme/layouts/BaseLayout.astro', 'utf8'),
  ])
  assert.match(banner, /bannerMask\.dark : bannerMask\) \|\| 0/)
  assert.match(hero, /isGradient\(String\(value\)\)/)
  assert.match(hero, /Object\.prototype\.toString\.call\(effectConfig\) === '\[object Object\]'/)
  assert.match(hero, /builtInEffect[\s\S]*<HeroEffect[\s\S]*hasBackground && <div class="home-hero-bg"/)
  assert.match(hero, /--vp-home-bg-light-attachment:\$\{props\.backgroundAttachment \|\| 'scroll'\}/)
  assert.match(box, /--vp-home-bg-light-attachment:\$\{backgroundAttachment \|\| 'scroll'\}/)
  assert.match(layout, /const isHome = layout === 'home' \|\| entry\?\.data\.home === true \|\| entry\?\.data\.pageLayout === 'home'/)
  assert.match(layout, /singleHomeSection = isHome && homeConfig\.length === 1/)
  assert.match(layout, /\(entry\.data\.config\?\.length \?\? 0\) > 1/)
  assert.match(layout, /'footer-no-border': singleHomeSection/)
  assert.match(layout, /enabled=\{entry\?\.data\.backToTop !== false && !shortHomeConfig\}/)
})

test('custom home normalization preserves explicit, legacy banner, and default Hero branches', () => {
  const explicit = [{ type: 'posts', collection: 'journal' }]
  assert.equal(homeConfigOf({ config: explicit }), explicit)
  assert.deepEqual(homeConfigOf({ banner: '/banner.png', bannerMask: { light: 0.1, dark: 0.3 }, hero: { name: 'Legacy' } }), [{
    type: 'banner', banner: '/banner.png', bannerMask: { light: 0.1, dark: 0.3 }, hero: { name: 'Legacy' },
  }])
  assert.deepEqual(homeConfigOf({ config: [], hero: { name: 'Default' } }), [{ type: 'hero', full: true, background: 'tint-plate', hero: { name: 'Default' } }])
})

test('hero background iOS detection follows the frozen platform contract', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  try {
    for (const [platform, expected] of [['iOS', true], ['iPhone', true], ['iPad', true], ['MacIntel', false], ['iPod', false]]) {
      Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { platform, userAgent: 'ignored' } })
      assert.equal(isIOS(), expected, platform)
    }
    Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { platform: 'Linux', userAgentData: { platform: 'iOS' } } })
    assert.equal(isIOS(), true)
  }
  finally {
    if (original) Object.defineProperty(globalThis, 'navigator', original)
    else delete globalThis.navigator
  }
})

test('TintPlate keeps the frozen compatibility and theme fallbacks', () => {
  assert.deepEqual(tintPlateColors(210, false).r, { value: 210, offset: 46 })
  assert.deepEqual(tintPlateColors(210, true).r, { value: 32, offset: 36 })
  assert.deepEqual(tintPlateColors(0, false).r, { value: 200, offset: 36 })
  assert.deepEqual(tintPlateColors('210.5', false).r, { value: 200, offset: 36 })
  assert.deepEqual(tintPlateColors({ rgb: '10, 20, 30' }, false), {
    r: { value: 10, offset: 64 }, g: { value: 20, offset: 64 }, b: { value: 30, offset: 64 },
  })
  assert.deepEqual(tintPlateColors({ light: '10,20,30', dark: 40 }, true).r, { value: 40, offset: 64 })
  assert.deepEqual(tintPlateColors({ light: 0, dark: 40 }, false).r, { value: 0, offset: 64 })
  assert.deepEqual(tintPlateColors({ light: { r: { value: 1, offset: 2 } } }, false).r, { value: 200, offset: 36 })
  assert.deepEqual(tintPlateColors({ r: { value: '100', offset: '20' }, g: { value: 110, offset: 21 }, b: { value: 120, offset: 22 } }, false).r, { value: 100, offset: 20 })
})
