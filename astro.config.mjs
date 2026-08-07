import vue from '@astrojs/vue'
import { defineConfig } from 'astro/config'
import { replaceAssetsIntegration } from './src/lib/replace-assets.mjs'
import { autoFrontmatterIntegration } from './src/lib/auto-frontmatter.mjs'
import { siteConfig } from './site.config.mjs'

export default defineConfig({
  site: process.env.SITE_ORIGIN || siteConfig.origin,
  base: process.env.BASE_PATH || siteConfig.base || '/',
  output: 'static',
  trailingSlash: 'always',
  markdown: { syntaxHighlight: false },
  integrations: [vue(), autoFrontmatterIntegration(siteConfig), replaceAssetsIntegration(siteConfig.replaceAssets)],
  vite: {
    build: {
      chunkSizeWarningLimit: 1200,
      rolldownOptions: {
        onLog(level, log, handler) {
          if (log.code !== 'COMMONJS_VARIABLE_IN_ESM' || !log.id?.includes('/dashjs/')) handler(level, log)
        },
      },
    },
  },
})
