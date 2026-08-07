import assert from 'node:assert/strict'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { injectImageSizes } from '../src/lib/image-size.ts'

test('build image sizing preserves explicit dimensions and derives missing local dimensions', async () => {
  const root = await mkdtemp(join(tmpdir(), 'ermaozi-image-size-'))
  const image = join(root, 'pixel.png')
  await writeFile(image, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64'))
  const html = '<p><img src="pixel.png" alt="pixel"><img src="pixel.png" width="20"><img src="pixel.png" width="20" height="10"></p>'
  const output = await injectImageSizes(html, { sourcePath: join(root, 'page.md'), mode: true, build: true })
  assert.match(output, /alt="pixel" width="2" height="1"/)
  assert.equal(output.match(/width="20" height="10"/gu)?.length, 2)
})

test('all image sizing reads remote headers and abandons slow responses after the frozen timeout', async () => {
  const pixel = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=', 'base64')
  const server = createServer((request, response) => {
    if (request.url === '/pixel.png') return response.end(pixel)
    const timer = setTimeout(() => response.end(pixel), 10_000)
    request.on('close', () => clearTimeout(timer))
  })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  try {
    const { port } = server.address()
    const base = `http://127.0.0.1:${port}`
    assert.match(await injectImageSizes(`<img src="${base}/pixel.png">`, { mode: 'all', build: true }), /width="2" height="1"/)
    const start = performance.now()
    assert.equal(await injectImageSizes(`<img src="${base}/slow.png">`, { mode: 'all', build: true }), `<img src="${base}/slow.png">`)
    assert.ok(performance.now() - start < 4_000)
  } finally {
    server.closeAllConnections()
    await new Promise(resolve => server.close(resolve))
  }
})
