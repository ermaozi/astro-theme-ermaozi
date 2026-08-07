import assert from 'node:assert/strict'
import test from 'node:test'
import { llmMarkdownSource, normalMarkdownSource } from '../src/lib/llm-markdown.ts'

test('frozen browser-only and LLM-only tags keep their source contracts', () => {
  const source = 'Visible <llm-exclude>browser only</llm-exclude>\n<llm-only>model only</llm-only>'
  assert.equal(normalMarkdownSource(source), 'Visible browser only\n')
  assert.equal(llmMarkdownSource(source), 'Visible \nmodel only')
})
