import assert from 'node:assert/strict'
import test from 'node:test'
import { socialIconName, socialLabel, socialSvg } from '../src/lib/social.ts'

test('social icons preserve aliases, arbitrary Iconify collections, custom SVG, and labels', () => {
  assert.equal(socialIconName('twitter'), 'simple-icons:x')
  assert.equal(socialIconName('mdi:email'), 'mdi:email')
  assert.match(socialSvg('github'), /<svg[^>]+viewBox="0 0 24 24"/)
  assert.equal(socialSvg('mdi:email'), '')
  assert.equal(socialSvg({ svg: '<svg></svg>', name: 'custom' }), '<svg></svg>')
  assert.equal(socialLabel({ icon: 'mdi:email', link: '#' }), 'email')
  assert.equal(socialLabel({ icon: 'github', link: '#', ariaLabel: 'Source' }), 'Source')
})
