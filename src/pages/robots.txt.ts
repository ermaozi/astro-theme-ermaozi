import { absoluteUrl } from '../lib/seo'

export const prerender = true

export function GET() {
  return new Response(`User-agent: *
Allow: /

Sitemap: ${absoluteUrl('/sitemap.xml')}
`, { headers: { 'content-type': 'text/plain; charset=utf-8' } })
}
