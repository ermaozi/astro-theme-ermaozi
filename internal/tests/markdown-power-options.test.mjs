import assert from 'node:assert/strict'
import test from 'node:test'
import { siteConfig } from '../../site.config.mjs'

test('plugins.markdownPower false disables its syntax without disabling independent Markdown plugins', async () => {
  const previous = siteConfig.plugins.markdownPower
  try {
    siteConfig.plugins.markdownPower = false
    const url = new URL('../../theme/lib/markdown.ts', import.meta.url)
    url.searchParams.set('markdown-power', 'disabled')
    const { renderMarkdown } = await import(url.href)
    const html = await renderMarkdown(`==hidden== ::simple-icons:astro::

::: steps
1. Disabled
:::

::: tip
Independent hint
:::

::: chartjs
\`\`\`json
{"type":"bar","data":{"labels":[],"datasets":[]}}
\`\`\`
:::`)
    assert.match(html, /==hidden== ::simple-icons:astro::/)
    assert.doesNotMatch(html, /vp-steps|vp-icon/)
    assert.match(html, /class="hint-container tip"/)
    assert.match(html, /data-chartjs/)
  } finally {
    siteConfig.plugins.markdownPower = previous
  }
})
