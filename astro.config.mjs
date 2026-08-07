import vue from '@astrojs/vue'
import { defineConfig } from 'astro/config'
import { replaceAssetsIntegration } from './src/lib/replace-assets.mjs'
import { autoFrontmatterIntegration } from './src/lib/auto-frontmatter.mjs'
import { siteConfig } from './site.config.mjs'

export default defineConfig({
  site: siteConfig.origin,
  output: 'static',
  trailingSlash: 'always',
  markdown: { syntaxHighlight: false },
  integrations: [vue(), autoFrontmatterIntegration(siteConfig), replaceAssetsIntegration(siteConfig.replaceAssets)],
})
