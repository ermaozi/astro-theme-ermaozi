import type { Collection, SidebarBadge, SidebarItem } from './lib/collections.ts'

export type ThemeIcon = string | { svg: string, name?: string }
export type SocialLink = { icon: ThemeIcon, link: string, ariaLabel?: string }

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
  description?: string
  authorName?: string
  authorDescription?: string
  profileTagline?: string
  keywords?: string
  blogName?: string
  docsName?: string
  navigation?: NavigationItem[]
  collections?: Collection[]
  sidebar?: 'auto' | SidebarItem[]
  appearance?: boolean | 'dark' | 'force-dark'
  [key: string]: unknown
}

export interface SiteConfig {
  origin: string
  base?: string
  logo: string
  multilingual?: boolean
  locales: Record<string, LocaleConfig>
  appearance?: boolean | 'dark' | 'force-dark'
  namespace?: string
  mediaOrigin?: string
  replaceAssets?: boolean | Record<string, unknown>
  autoFrontmatter?: boolean | Record<string, unknown>
  social?: SocialLink[]
  navbarSocialInclude?: string[]
  footer?: false | { message?: string, copyright?: string }
  profile?: false | {
    avatar?: string
    url?: string
    name?: string
    description?: string
    circle?: boolean
    location?: string
    organization?: string
    layout?: 'left' | 'right'
  }
  tagsTheme?: 'colored' | 'gray' | 'brand'
  meta?: false | { tags?: boolean, readingTime?: boolean, wordCount?: boolean, createTime?: boolean | 'short' | 'long' }
  readingTime?: false | { wordPerMinute?: number, locales?: Record<string, unknown> }
  postCover?: false | 'left' | 'right' | 'odd-left' | 'odd-right' | 'top' | Record<string, unknown>
  pagination?: false | number | { perPage?: number }
  categoriesExpand?: number | 'deep'
  transition?: false | { appearance?: false | string, page?: boolean, postList?: boolean }
  search?: false | { provider?: 'local' | 'algolia', [key: string]: unknown }
  features?: { engagement?: boolean, popularPosts?: boolean, comments?: boolean }
  repository?: { url?: string, branch?: string, contentDir?: string, editLinkPattern?: string }
  copyright?: false | Record<string, unknown>
  encrypt?: false | Record<string, unknown>
  markdown?: Record<string, unknown>
  watermark?: false | Record<string, unknown>
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
  base: string
  multilingual: boolean
  social: SocialLink[]
  navbarSocialInclude: string[]
  features: { engagement: boolean, popularPosts: boolean, comments: boolean }
  repository: { url?: string, branch?: string, contentDir?: string, editLinkPattern?: string }
  encrypt: false | Record<string, unknown>
  markdown: Record<string, unknown> & { math: false | Record<string, unknown> }
  codeHighlighter: Record<string, unknown>
  plugins: Record<string, unknown>
  services: Record<string, unknown> & { statsBase: string, statsVisitorHeader: string }
  comment: false | (Record<string, unknown> & { provider: string })
  verification: Record<string, string>
  [key: string]: unknown
}
