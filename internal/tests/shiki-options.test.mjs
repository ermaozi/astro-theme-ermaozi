import assert from 'node:assert/strict'
import test from 'node:test'
import { siteConfig } from '../../site.config.mjs'

const renderer = async (name, options) => {
  siteConfig.codeHighlighter = { twoslash: false, ...options }
  const url = new URL('../../theme/lib/markdown.ts', import.meta.url)
  url.searchParams.set('shiki-options', name)
  return (await import(url.href)).renderMarkdown
}

test('Shiki preserves the frozen whitespace, indent-guide, bracket, and line-number option matrices', async () => {
  const previous = siteConfig.codeHighlighter
  try {
    const whitespaceSource = '```txt META\n  alpha beta  \n\tgamma\t\n```'
    for (const [setting, expected] of [[true, [0, 0]], ['all', [5, 2]], ['boundary', [4, 2]], ['leading', [2, 1]], ['trailing', [2, 1]], [false, [0, 0]]]) {
      const render = await renderer(`whitespace-${setting}`, { whitespace: setting })
      const html = await render(whitespaceSource.replace('META', ''))
      assert.deepEqual([(html.match(/class="space"/g) ?? []).length, (html.match(/class="tab"/g) ?? []).length], expected)
      assert.doesNotMatch(await render(whitespaceSource.replace('META', ':no-whitespace')), /class="(?:space|tab)"/)
      const local = await render(whitespaceSource.replace('META', ':whitespace=leading'))
      if (setting) assert.deepEqual([(local.match(/class="space"/g) ?? []).length, (local.match(/class="tab"/g) ?? []).length], [2, 1])
      else assert.doesNotMatch(local, /class="(?:space|tab)"/)
    }

    const code = '```ts META\nfunction x() {\n  if (true) {\n    return [1]\n  }\n}\n```'
    const indent = await renderer('indent-two', { renderIndentGuides: { indent: 2 } })
    assert.equal(((await indent(code.replace('META', ''))).match(/class="indent"/g) ?? []).length, 4)
    const noIndent = await renderer('indent-off', { renderIndentGuides: { indent: false } })
    assert.doesNotMatch(await noIndent(code.replace('META', '')), /class="indent"/)

    const brackets = await renderer('brackets-explicit', { colorizedBrackets: { explicitTrigger: true } })
    assert.doesNotMatch(await brackets(code.replace('META', '')), /--shiki-light:#2993a3/)
    assert.match(await brackets(code.replace('META', 'colorize-brackets')), /--shiki-light:#2993a3/)

    const numbers = await renderer('line-numbers', { lineNumbers: 6 })
    assert.doesNotMatch(await numbers('```ts\n1\n2\n3\n4\n```'), /line-numbers-mode/)
    assert.match(await numbers('```ts\n1\n2\n3\n4\n5\n6\n```'), /line-numbers-mode/)
    assert.match(await numbers('```ts :line-numbers=5\n1\n```'), /counter-reset:line-number 4/)
    assert.doesNotMatch(await numbers('```ts :no-line-numbers\n1\n2\n3\n4\n5\n6\n```'), /line-numbers-mode/)
  } finally {
    siteConfig.codeHighlighter = previous
  }
})

test('codeHighlighter false keeps plain fenced code and skips Shiki output', async () => {
  const previous = siteConfig.codeHighlighter
  try {
    siteConfig.codeHighlighter = false
    const url = new URL('../../theme/lib/markdown.ts', import.meta.url)
    url.searchParams.set('shiki-options', 'disabled')
    const { renderMarkdown } = await import(url.href)
    const html = await renderMarkdown('```ts\nconst value = 1 < 2\n```')
    assert.match(html, /<pre><code class="language-ts">const value = 1 &lt; 2/)
    assert.doesNotMatch(html, /data-highlighter="shiki"/)
  } finally {
    siteConfig.codeHighlighter = previous
  }
})
