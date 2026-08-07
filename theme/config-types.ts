import type { Collection, SidebarBadge, SidebarItem } from './lib/collections.ts'

export type ThemeIcon = string | { svg: string, name?: string }
export type SocialLink = { icon: ThemeIcon, link: string, ariaLabel?: string }
export type ProfileOptions = {
  avatar?: string
  url?: string
  name?: string
  description?: string
  circle?: boolean
  location?: string
  organization?: string
  layout?: 'left' | 'right'
}
export type FooterOptions = { message?: string, copyright?: string }
export type SidebarOptions = false | 'auto' | SidebarItem[] | Record<string, 'auto' | SidebarItem[] | { items: 'auto' | SidebarItem[], prefix?: string }>
export type MarkdownImageOptions = {
  figure?: boolean | { focusable?: boolean, linkImage?: boolean }
  lazyload?: boolean
  mark?: boolean | { light?: string[], dark?: string[] }
  size?: boolean
  legacySize?: boolean
  obsidianSize?: boolean
}
export type LlmsPage = { path: string, title: string, lang: string, filePathRelative?: string, frontmatter: Record<string, unknown>, markdown?: string, excerpt?: string }
export type LlmsOptions = {
  domain?: string
  linkExtension?: '.html' | '.md'
  llmsTxt?: boolean
  llmsFullTxt?: boolean
  llmsPageTxt?: boolean
  stripHTML?: boolean
  locale?: string | 'all'
  filter?: (page: LlmsPage) => boolean
  transformMarkdown?: (markdown: string, page: LlmsPage) => string
  llmsTxtTemplate?: string
  llmsTxtTemplateGetter?: Record<string, string | ((pages: LlmsPage[], state: Record<string, unknown>) => string)>
}
export type SitemapPage = { path: string, pathLocale: string, lang: string, filePathRelative?: string, frontmatter: Record<string, unknown>, data: Record<string, unknown> }
export type SitemapOptions = {
  hostname?: string
  extraUrls?: string[]
  excludePaths?: string[]
  sitemapFilename?: string
  sitemapXSLFilename?: string
  sitemapXSLTemplate?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  modifyTimeGetter?: (page: SitemapPage, app: Record<string, unknown>) => string
  devServer?: boolean
  devHostname?: string
  xmlNameSpace?: { news: boolean, video: boolean, xhtml: boolean, image: boolean, custom?: string[] }
}
export type SeoAuthor = string | { name: string, url?: string, email?: string } | Array<string | { name: string, url?: string, email?: string }>
export type SeoPage = { path: string, pathLocale: string, lang: string, title: string, filePathRelative?: string, frontmatter: Record<string, unknown>, data: Record<string, unknown>, content?: string }
export type SeoHeadItem = [string, Record<string, string>, string?]
export type SeoOptions = {
  hostname?: string
  author?: SeoAuthor
  restrictions?: string
  autoDescription?: boolean
  fallBackImage?: string
  twitterID?: string
  isArticle?: (page: SeoPage) => boolean
  ogp?: (ogp: Record<string, unknown>, page: SeoPage, app: Record<string, unknown>) => Record<string, unknown>
  jsonLd?: (jsonLd: Record<string, unknown>, page: SeoPage, app: Record<string, unknown>) => Record<string, unknown>
  customHead?: (head: SeoHeadItem[], page: SeoPage, app: Record<string, unknown>) => void
  canonical?: string | ((page: SeoPage) => string | null)
}
export type PhotoSwipeLocale = { close: string, download: string, fullscreen: string, zoom: string, arrowPrev: string, arrowNext: string }
export type PhotoSwipeOptions = {
  selector?: string | string[]
  download?: boolean
  fullscreen?: boolean
  scrollToClose?: boolean
  locales?: Record<string, Partial<PhotoSwipeLocale>>
}
export type SearchOptions = {
  provider?: 'local' | 'algolia'
  appId?: string
  apiKey?: string
  indexName?: string
  indices?: Array<Record<string, unknown>>
  locales?: Record<string, unknown>
  disableQueryPersistence?: boolean
  isSearchable?: (page: SeoPage) => boolean
  miniSearch?: { options?: Record<string, unknown>, searchOptions?: Record<string, unknown> }
  [key: string]: unknown
}
export type BuiltinPluginOptions = {
  search?: false | SearchOptions
  docsearch?: false | Record<string, unknown>
  copyCode?: false | Record<string, unknown>
  shiki?: false | Record<string, unknown>
  git?: boolean
  nprogress?: boolean
  photoSwipe?: false | PhotoSwipeOptions
  markdownPower?: false | Record<string, unknown>
  markdownImage?: false | MarkdownImageOptions
  markdownMath?: false | Record<string, unknown>
  markdownInclude?: boolean | Record<string, unknown>
  markdownChart?: false | Record<string, unknown>
  comment?: false | Record<string, unknown>
  sitemap?: false | SitemapOptions
  seo?: false | SeoOptions
  cache?: false | Record<string, unknown>
  readingTime?: false | Record<string, unknown>
  watermark?: boolean | Record<string, unknown>
  replaceAssets?: false | Record<string, unknown>
  llmstxt?: boolean | LlmsOptions
  [key: string]: unknown
}

export type NavigationItem = string | {
  text?: string
  link?: string
  label?: string
  href?: string
  icon?: ThemeIcon
  badge?: SidebarBadge
  activeMatch?: string
  prefix?: string
  items?: NavigationItem[]
  target?: string
  rel?: string
  noIcon?: boolean
}

export interface LocaleConfig {
  siteName: string
  home: string
  logo?: string
  logoDark?: string
  description?: string
  authorName?: string
  authorDescription?: string
  profileTagline?: string
  keywords?: string
  blogName?: string
  docsName?: string
  navigation?: false | NavigationItem[]
  navbar?: false | NavigationItem[]
  collections?: Collection[]
  sidebar?: SidebarOptions
  sidebarScrollbar?: boolean
  outline?: false | number | [number, number] | 'deep'
  aside?: boolean | 'left'
  appearance?: boolean | 'dark' | 'force-dark'
  profile?: false | ProfileOptions
  /** @deprecated Use profile. */
  avatar?: false | ProfileOptions
  social?: false | SocialLink[]
  navbarSocialInclude?: string[]
  footer?: false | FooterOptions
  externalLinkIcon?: boolean
  prevPage?: boolean
  nextPage?: boolean
  createTime?: boolean | 'only-posts'
  transition?: boolean | { appearance?: false | string, page?: boolean, postList?: boolean }
  contributors?: boolean | Record<string, unknown>
  changelog?: boolean | Record<string, unknown>
  lastUpdated?: false | Record<string, unknown>
  editLink?: boolean
  editLinkPattern?: string
  copyright?: boolean | string | Record<string, unknown>
  [key: string]: unknown
}

export interface SiteConfig {
  origin?: string
  hostname?: string
  base?: string
  logo: string
  logoDark?: string
  multilingual?: boolean
  locales: Record<string, LocaleConfig>
  appearance?: boolean | 'dark' | 'force-dark'
  namespace?: string
  mediaOrigin?: string
  replaceAssets?: boolean | Record<string, unknown>
  autoFrontmatter?: boolean | Record<string, unknown>
  social?: SocialLink[]
  navbarSocialInclude?: string[]
  navigation?: false | NavigationItem[]
  navbar?: false | NavigationItem[]
  sidebar?: SidebarOptions
  sidebarScrollbar?: boolean
  footer?: false | FooterOptions
  profile?: false | ProfileOptions
  /** @deprecated Use profile. */
  avatar?: false | ProfileOptions
  /** VuePress-only migration shim; Astro does not use this value. */
  cache?: false | 'memory' | 'filesystem'
  /** VuePress-only migration shim; site.config.mjs is Astro's fixed entrypoint. */
  configFile?: string
  externalLinkIcon?: boolean
  outline?: false | number | [number, number] | 'deep'
  aside?: boolean | 'left'
  prevPage?: boolean
  nextPage?: boolean
  createTime?: boolean | 'only-posts'
  editLink?: boolean
  editLinkPattern?: string
  tagsTheme?: 'colored' | 'gray' | 'brand'
  meta?: false | { tags?: boolean, readingTime?: boolean, wordCount?: boolean, createTime?: boolean | 'short' | 'long' }
  readingTime?: false | { wordPerMinute?: number, locales?: Record<string, unknown> }
  postCover?: false | 'left' | 'right' | 'odd-left' | 'odd-right' | 'top' | Record<string, unknown>
  pagination?: false | number | { perPage?: number }
  categoriesExpand?: number | 'deep'
  transition?: boolean | { appearance?: false | string, page?: boolean, postList?: boolean }
  search?: boolean | SearchOptions
  features?: { engagement?: boolean, popularPosts?: boolean, comments?: boolean }
  repository?: { url?: string, branch?: string, contentDir?: string, editLinkPattern?: string }
  docsRepo?: string
  docsBranch?: string
  docsDir?: string
  copyright?: boolean | string | Record<string, unknown>
  lastUpdated?: false | Record<string, unknown>
  contributors?: boolean | Record<string, unknown>
  changelog?: boolean | Record<string, unknown>
  encrypt?: false | Record<string, unknown>
  markdown?: Record<string, unknown> & { image?: false | MarkdownImageOptions }
  llmstxt?: boolean | LlmsOptions
  copyCode?: boolean | Record<string, unknown>
  codeHighlighter?: false | Record<string, unknown>
  plugins?: BuiltinPluginOptions
  watermark?: boolean | Record<string, unknown>
  bulletin?: false | {
    enabled?: boolean
    layout?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
    border?: boolean
    lifetime?: 'always' | 'session' | 'once'
    enablePage?: (page: { path: string }) => boolean
    title?: string
    contentType?: 'text' | 'html' | 'markdown'
    content?: string
    contentFile?: string
    [key: string]: unknown
  }
  services?: Record<string, unknown>
  comment?: false | Record<string, unknown>
  verification?: Record<string, string>
  [key: string]: unknown
}

export interface SiteConfigDefaults {
  origin: string
  hostname: string
  base: string
  multilingual: boolean
  social: SocialLink[]
  navbarSocialInclude: string[]
  features: { engagement: boolean, popularPosts: boolean, comments: boolean }
  repository: { url?: string, branch?: string, contentDir?: string, editLinkPattern?: string }
  encrypt: false | Record<string, unknown>
  markdown: Record<string, unknown> & { image?: false | MarkdownImageOptions, math: false | Record<string, unknown> }
  codeHighlighter: false | Record<string, unknown>
  plugins: BuiltinPluginOptions
  services: Record<string, unknown> & { statsBase: string, statsVisitorHeader: string }
  comment: false | (Record<string, unknown> & { provider: string })
  verification: Record<string, string>
  [key: string]: unknown
}
