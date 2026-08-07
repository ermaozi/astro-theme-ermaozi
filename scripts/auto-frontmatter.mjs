import { generateAutoFrontmatter } from '../src/lib/auto-frontmatter.mjs'
import { siteConfig } from '../site.config.mjs'

await generateAutoFrontmatter({ config: siteConfig })
