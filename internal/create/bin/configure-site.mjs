/**
 * @param {string} source
 * @param {{ siteName: string, siteDescription: string, multilingual: boolean }} answers
 */
export const configureSiteConfig = (source, { siteName, siteDescription, multilingual }) => {
  const multilingualPattern = /^(\s*multilingual:\s*)(?:true|false),$/m
  if (!multilingualPattern.test(source)) throw new Error('无法更新 site.config.mjs 中的 multilingual')
  let configured = source.replace(
    multilingualPattern,
    (/** @type {string} */ _, /** @type {string} */ prefix) => `${prefix}${multilingual},`,
  )

  let siteNameCount = 0
  configured = configured.replace(/^(\s*siteName:\s*).+,$/gm, (/** @type {string} */ _, /** @type {string} */ prefix) => {
    siteNameCount += 1
    return `${prefix}${JSON.stringify(siteName)},`
  })
  if (siteNameCount < 2) throw new Error('无法更新 site.config.mjs 中的 siteName')

  const chineseStart = configured.indexOf("    'zh-CN': {")
  const englishStart = configured.indexOf("    'en-US': {", chineseStart)
  if (chineseStart < 0 || englishStart < 0) throw new Error('无法定位 site.config.mjs 的默认语言配置')
  const chinese = configured.slice(chineseStart, englishStart)
  const descriptionPattern = /^(\s*description:\s*).+,$/m
  if (!descriptionPattern.test(chinese)) throw new Error('无法更新 site.config.mjs 中的 description')
  const described = chinese.replace(descriptionPattern, (/** @type {string} */ _, /** @type {string} */ prefix) => `${prefix}${JSON.stringify(siteDescription)},`)
  return `${configured.slice(0, chineseStart)}${described}${configured.slice(englishStart)}`
}
