import { defineThemeConfig } from './lib/collections.ts'

export {
  defineCollection,
  defineCollections,
  defineNoteConfig,
  defineNotesConfig,
  defineNavbarConfig,
  defineThemeConfig,
} from './lib/collections.ts'
export { defineSiteConfig } from './config.mjs'
export type {
  BaseCollection,
  Collection,
  DocCollection,
  PostCollection,
  SidebarItem,
} from './lib/collections.ts'
export type { LocaleConfig, NavigationItem, SiteConfig, SocialLink, ThemeIcon } from './config-types.ts'

export const plumeTheme = (config: Parameters<typeof defineThemeConfig>[0] = { locales: {} }) => defineThemeConfig(config)
export default plumeTheme
