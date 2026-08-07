// @ts-check

/**
 * Adds editor completion, safe defaults, and early validation.
 * @param {import('./config-types.ts').SiteConfig} config
 * @returns {import('./config-types.ts').SiteConfig & import('./config-types.ts').SiteConfigDefaults}
 */
export const defineSiteConfig = config => {
  const resolved = /** @type {import('./config-types.ts').SiteConfig} */ (config)
  resolved.origin ??= resolved.hostname
  resolved.hostname ??= resolved.origin
  resolved.base ??= '/'
  resolved.multilingual ??= false
  resolved.appearance ??= true
  resolved.social ??= []
  resolved.navbarSocialInclude ??= ['github', 'twitter', 'discord', 'facebook']
  resolved.aside ??= true
  resolved.outline ??= [2, 3]
  resolved.externalLinkIcon ??= true
  resolved.editLink ??= true
  resolved.contributors ??= true
  resolved.changelog ??= false
  resolved.prevPage ??= true
  resolved.nextPage ??= true
  resolved.footer ??= { message: 'Powered by <a target="_blank" rel="noopener" href="https://astro.build/">Astro</a> &amp; <a target="_blank" rel="noopener" href="https://github.com/ermaozi/astro-theme-ermaozi">ermaozi</a>' }
  resolved.profile ??= /** @type {{ avatar?: import('./config-types.ts').ProfileOptions | false }} */ (resolved).avatar
  /** @param {import('./config-types.ts').ProfileOptions | false | undefined} profile */
  const normalizeProfile = (profile) => { if (profile) profile.avatar ??= /** @type {{ url?: string }} */ (profile).url }
  normalizeProfile(resolved.profile)
  const legacy = /** @type {{ blog?: import('./config-types.ts').LegacyBlogOptions, notes?: import('./config-types.ts').LegacyNotesOptions, article?: string }} */ (resolved)
  /** @param {...string} parts */
  const legacyPath = (...parts) => parts.join('/').replaceAll('\\', '/').replace(/\/+/gu, '/').replace(/^\/|\/$/gu, '')
  /** @param {import('./config-types.ts').SiteConfig | import('./config-types.ts').LocaleConfig} target */
  const convertLegacyCollections = (target) => {
    const targetLegacy = /** @type {{ notes?: import('./config-types.ts').LegacyNotesOptions }} */ (target)
    const notes = targetLegacy.notes ?? legacy.notes
    if (!legacy.blog && !notes) return
    if (target.collections?.length) return
    const collections = (target.collections ??= [])
    const notesDir = notes?.dir ?? ''
    if (legacy.blog) collections.push({
      type: 'post',
      dir: '/',
      linkPrefix: legacy.article,
      ...legacy.blog,
      exclude: [
        ...Array.isArray(legacy.blog.exclude) ? legacy.blog.exclude : legacy.blog.exclude ? [legacy.blog.exclude] : [],
        ...(notes?.notes ?? []).map(note => legacyPath(notesDir, note.dir)),
      ],
    })
    if (notes) for (const note of notes.notes) collections.push({
      type: 'doc',
      dir: legacyPath(notes.dir, note.dir),
      linkPrefix: `/${legacyPath(notes.link, note.link)}/`,
      sidebar: note.sidebar,
      sidebarScrollbar: target.sidebarScrollbar ?? resolved.sidebarScrollbar,
    })
  }
  convertLegacyCollections(resolved)
  for (const locale of Object.values(resolved.locales ?? {})) {
    locale.path ??= locale.home
    locale.profile ??= /** @type {{ avatar?: import('./config-types.ts').ProfileOptions | false }} */ (locale).avatar
    normalizeProfile(locale.profile)
    convertLegacyCollections(locale)
    delete /** @type {{ notes?: import('./config-types.ts').LegacyNotesOptions }} */ (locale).notes
  }
  const rootLocale = Object.values(resolved.locales ?? {}).find(locale => locale.path === '/')
  if (resolved.home !== undefined && rootLocale) rootLocale.home = resolved.home
  for (const collection of [resolved.collections ?? [], ...Object.values(resolved.locales ?? {}).map(locale => locale.collections ?? [])].flat()) {
    if (collection.type === 'post') normalizeProfile(collection.profile)
  }
  delete legacy.blog
  delete legacy.notes
  resolved.plugins ??= {}
  const plugins = resolved.plugins
  resolved.copyCode ??= plugins.copyCode
  resolved.codeHighlighter ??= plugins.shiki
  resolved.readingTime ??= plugins.readingTime
  resolved.watermark ??= plugins.watermark
  resolved.comment ??= plugins.comment
  resolved.replaceAssets ??= plugins.replaceAssets
  resolved.llmstxt ??= plugins.llmstxt
  if (resolved.search === undefined) {
    if (plugins.docsearch && typeof plugins.docsearch === 'object') resolved.search = { provider: 'algolia', ...plugins.docsearch }
    else if (plugins.search && typeof plugins.search === 'object') resolved.search = { provider: 'local', ...plugins.search }
    else if (plugins.search === false) resolved.search = false
  }
  resolved.features ??= {}
  resolved.features.engagement ??= false
  resolved.features.popularPosts ??= false
  resolved.features.comments ??= false
  resolved.repository ??= {}
  resolved.repository.url ??= resolved.docsRepo
  resolved.repository.branch ??= resolved.docsBranch
  resolved.repository.contentDir ??= resolved.docsDir
  if (resolved.editLinkPattern !== undefined) resolved.repository.editLinkPattern ??= resolved.editLinkPattern
  resolved.encrypt ??= {}
  resolved.markdown ??= {}
  for (const source of [plugins.markdownPower, plugins.markdownChart]) {
    if (!source || typeof source !== 'object') continue
    for (const [key, value] of Object.entries(source)) resolved.markdown[key] ??= value
  }
  resolved.markdown.image ??= plugins.markdownImage
  resolved.markdown.include ??= plugins.markdownInclude
  resolved.markdown.math ??= plugins.markdownMath
  resolved.markdown.math ??= { type: 'katex' }
  resolved.codeHighlighter ??= {}
  resolved.services ??= {}
  resolved.services.statsBase ??= ''
  resolved.services.statsVisitorHeader ??= 'X-Site-Visitor'
  resolved.comment ??= {}
  if (resolved.comment !== false) resolved.comment.provider ??= 'None'
  resolved.verification ??= {}

  /** @param {string} message @returns {never} */
  const invalid = (message) => { throw new TypeError(`[ermaozi] site.config.mjs: ${message}`) }
  if (!resolved.origin?.trim()) invalid('origin（或 Plume 兼容字段 hostname）必须是完整的 http(s) 站点域名')
  try {
    const origin = new URL(resolved.origin)
    if (!['http:', 'https:'].includes(origin.protocol) || origin.pathname !== '/' || origin.search || origin.hash) invalid('origin 只能包含协议和域名；部署子路径请填写 base')
  } catch (error) {
    if (error instanceof TypeError && error.message.startsWith('[ermaozi]')) throw error
    invalid('origin 必须是有效的 http(s) URL')
  }
  if (!/^\/(?:[^/?#\\]+\/)*$/u.test(resolved.base)) invalid("base 必须以 / 开头和结尾，例如 '/project/'")
  if (!resolved.logo?.trim()) invalid('logo 不能为空')

  const locales = Object.entries(resolved.locales ?? {})
  if (!locales.length) invalid('locales 至少需要一种语言')
  const homes = new Set()
  for (const [lang, locale] of locales) {
    if (!locale?.siteName?.trim()) invalid(`locales.${lang}.siteName 不能为空`)
    if (!/^\/(?:[^/?#\\]+\/)*$/u.test(locale.path ?? '')) invalid(`locales.${lang}.path 必须是以 / 开头和结尾的语言路径`)
    if (!/^\/(?:[^/?#\\]+\/)*$/u.test(locale.home)) invalid(`locales.${lang}.home 必须是以 / 开头和结尾的站内路径`)
    if (homes.has(locale.path)) invalid(`locales.${lang}.path 与其他语言重复：${locale.path}`)
    homes.add(locale.path)
  }
  if (!homes.has('/')) invalid("locales 中必须有一种语言使用根路径 path: '/'")

  /** @param {string} field @param {false | number | { perPage?: number } | undefined} value */
  const validatePagination = (field, value) => {
    const perPage = typeof value === 'number' ? value : value && typeof value === 'object' ? value.perPage : undefined
    if (perPage !== undefined && (!Number.isInteger(perPage) || perPage < 1)) invalid(`${field}.perPage 必须是正整数`)
  }
  validatePagination('pagination', resolved.pagination)
  for (const [field, configured] of [
    ['collections', resolved.collections],
    ...locales.map(([lang, locale]) => [`locales.${lang}.collections`, locale.collections]),
  ]) {
    if (configured === undefined) continue
    if (!Array.isArray(configured)) invalid(`${field} 必须是数组`)
    for (const [index, collection] of configured.entries()) {
      const name = `${field}[${index}]`
      if (!collection || !['post', 'doc'].includes(collection.type)) invalid(`${name}.type 只能是 'post' 或 'doc'`)
      if (typeof collection.dir !== 'string' || !collection.dir.trim()
        || collection.dir !== '/' && (/^(?:[A-Za-z]:|[\\/])/u.test(collection.dir) || collection.dir.split(/[\\/]/u).includes('..'))) invalid(`${name}.dir 必须是 content 内的相对目录`)
      if (collection.type !== 'post') continue
      validatePagination(`${name}.pagination`, collection.pagination)
      if (collection.categoriesExpand !== undefined && collection.categoriesExpand !== 'deep'
        && (!Number.isInteger(collection.categoriesExpand) || collection.categoriesExpand < 0)) invalid(`${name}.categoriesExpand 必须是非负整数或 'deep'`)
      if (collection.categoriesTransform !== undefined && typeof collection.categoriesTransform !== 'function') invalid(`${name}.categoriesTransform 必须是函数`)
    }
  }
  const wordPerMinute = resolved.readingTime && typeof resolved.readingTime === 'object' ? resolved.readingTime.wordPerMinute : undefined
  if (wordPerMinute !== undefined && (!Number.isFinite(wordPerMinute) || wordPerMinute <= 0)) invalid('readingTime.wordPerMinute 必须大于 0')
  if ((resolved.features.engagement || resolved.features.popularPosts) && !String(resolved.services?.statsBase ?? '').trim()) invalid('启用互动统计或热门文章时必须配置 services.statsBase')

  return /** @type {import('./config-types.ts').SiteConfig & import('./config-types.ts').SiteConfigDefaults} */ (resolved)
}
