// @ts-check

/**
 * Adds editor completion, safe defaults, and early validation.
 * @template {import('./config-types.ts').SiteConfig} T
 * @param {T} config
 * @returns {T & import('./config-types.ts').SiteConfigDefaults}
 */
export const defineSiteConfig = config => {
  const resolved = /** @type {import('./config-types.ts').SiteConfig} */ (config)
  resolved.base ??= '/'
  resolved.multilingual ??= false
  resolved.social ??= []
  resolved.navbarSocialInclude ??= []
  resolved.features ??= {}
  resolved.features.engagement ??= false
  resolved.features.popularPosts ??= false
  resolved.features.comments ??= false
  resolved.repository ??= {}
  resolved.encrypt ??= {}
  resolved.markdown ??= {}
  resolved.markdown.math ??= { type: 'katex' }
  resolved.codeHighlighter ??= {}
  resolved.plugins ??= {}
  resolved.services ??= {}
  resolved.services.statsBase ??= ''
  resolved.services.statsVisitorHeader ??= 'X-Site-Visitor'
  resolved.comment ??= {}
  if (resolved.comment !== false) resolved.comment.provider ??= 'None'
  resolved.verification ??= {}

  /** @param {string} message @returns {never} */
  const invalid = (message) => { throw new TypeError(`[ermaozi] site.config.mjs: ${message}`) }
  if (!resolved.origin?.trim()) invalid('origin 必须是完整的 http(s) 站点域名')
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
    if (!/^\/(?:[^/?#\\]+\/)*$/u.test(locale.home)) invalid(`locales.${lang}.home 必须是以 / 开头和结尾的站内路径`)
    if (homes.has(locale.home)) invalid(`locales.${lang}.home 与其他语言重复：${locale.home}`)
    homes.add(locale.home)
  }
  if (!homes.has('/')) invalid("locales 中必须有一种语言使用根路径 '/'")

  const pagination = typeof resolved.pagination === 'number'
    ? resolved.pagination
    : resolved.pagination && typeof resolved.pagination === 'object'
      ? resolved.pagination.perPage
      : undefined
  if (pagination !== undefined && (!Number.isInteger(pagination) || pagination < 1)) invalid('pagination.perPage 必须是正整数')
  const wordPerMinute = resolved.readingTime && typeof resolved.readingTime === 'object' ? resolved.readingTime.wordPerMinute : undefined
  if (wordPerMinute !== undefined && (!Number.isFinite(wordPerMinute) || wordPerMinute <= 0)) invalid('readingTime.wordPerMinute 必须大于 0')
  if ((resolved.features.engagement || resolved.features.popularPosts) && !String(resolved.services?.statsBase ?? '').trim()) invalid('启用互动统计或热门文章时必须配置 services.statsBase')

  return /** @type {T & import('./config-types.ts').SiteConfigDefaults} */ (resolved)
}
