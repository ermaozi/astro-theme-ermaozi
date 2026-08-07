import { siteConfig } from '../../site.config.mjs'

export const prerender = true

export function GET() {
  return new Response(`User-agent: *
Allow: /

Sitemap: ${siteConfig.origin}/sitemap.xml
`, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
