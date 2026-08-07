import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

test('creates a complete ermaozi project without installing when requested', () => {
  execFileSync(process.execPath, [path.join(packageRoot, 'scripts/sync-template.mjs')])
  const cwd = mkdtempSync(path.join(tmpdir(), 'ermaozi-create-'))
  execFileSync(process.execPath, [path.join(packageRoot, 'bin/create.mjs'), 'my-site', '--no-install'], { cwd })
  const created = path.join(cwd, 'my-site')
  const pkg = JSON.parse(readFileSync(path.join(created, 'package.json'), 'utf8'))
  assert.equal(pkg.name, 'my-site')
  assert.equal(pkg.private, true)
  assert.equal(pkg.repository, undefined)
  assert.equal(pkg.homepage, undefined)
  assert.equal(pkg.bugs, undefined)
  assert.match(readFileSync(path.join(created, '.gitignore'), 'utf8'), /^\.astro\//m)
  assert.equal(pkg.scripts['test:create'], undefined)
  assert.equal(pkg.scripts.test, undefined)
  assert.equal(pkg.scripts['test:visual'], undefined)
  assert.equal(pkg.devDependencies['@playwright/test'], undefined)
  assert.doesNotMatch(pkg.scripts.validate, /node --test|packages\/create-astro-theme-ermaozi/)
  assert.throws(() => readFileSync(path.join(created, 'tests/build.test.mjs')), error => error.code === 'ENOENT')
  assert.throws(() => readFileSync(path.join(created, 'playwright.config.ts')), error => error.code === 'ENOENT')
  const readme = readFileSync(path.join(created, 'README.md'), 'utf8')
  assert.doesNotMatch(readme, /npm test|test:visual|发布初始化器/)
  assert.match(readme, /零基础快速开始/)
  assert.equal(pkg.dependencies.swiper, '14.0.1')
  assert.equal(pkg.dependencies.katex, '0.17.0')
  assert.equal(pkg.dependencies['@mdit/plugin-katex-slim'], '1.0.1')
  assert.equal(pkg.dependencies['@mdit/plugin-mathjax-slim'], '1.0.1')
  assert.equal(pkg.dependencies['@vue/compiler-sfc'], '3.5.29')
  assert.equal(pkg.dependencies.esbuild, '0.28.1')
  assert.equal(pkg.dependencies.gsap, '3.15.0')
  assert.equal(pkg.dependencies.ogl, '1.0.11')
  assert.equal(pkg.dependencies.postprocessing, '6.39.2')
  assert.equal(pkg.dependencies.three, '0.185.0')
  assert.equal(pkg.dependencies['chart.js'], '4.5.1')
  assert.equal(pkg.dependencies.echarts, '6.1.0')
  assert.equal(pkg.dependencies['@mdit/plugin-plantuml'], '1.0.1')
  assert.equal(pkg.dependencies.artplayer, '5.4.0')
  assert.equal(pkg.dependencies.dashjs, '5.2.0')
  assert.equal(pkg.dependencies['hls.js'], '1.6.16')
  assert.equal(pkg.dependencies['mpegts.js'], '1.7.3')
  assert.equal(pkg.dependencies['flowchart.ts'], '3.0.1')
  assert.equal(pkg.dependencies['markmap-lib'], '0.18.12')
  assert.equal(pkg.dependencies['markmap-common'], '0.18.9')
  assert.equal(pkg.dependencies['markmap-toolbar'], '0.18.12')
  assert.equal(pkg.dependencies['markmap-view'], '0.18.12')
  assert.equal(pkg.dependencies['@docsearch/js'], '4.6.3')
  assert.equal(pkg.dependencies['@docsearch/css'], '4.6.3')
  assert.match(readFileSync(path.join(created, 'site.config.mjs'), 'utf8'), /siteName: 'ermaozi'/)
  assert.match(readFileSync(path.join(created, 'src/components/vue/AlgoliaSearch.vue'), 'utf8'), /algolia-preconnect/)
  assert.match(readFileSync(path.join(created, 'src/components/vue/background/HeroEffect.vue'), 'utf8'), /dark-veil/)
  assert.match(readFileSync(path.join(created, 'src/components/VPHomeBox.astro'), 'utf8'), /vp-home-box/)
  assert.match(readFileSync(path.join(created, 'src/lib/obsidian.ts'), 'utf8'), /installObsidian/)
  for (const file of [
    'src/lib/locales.ts',
    'src/lib/replace-assets.mjs',
    'src/lib/auto-frontmatter.mjs',
    'scripts/auto-frontmatter.mjs',
    'src/lib/image-size.ts',
    'src/lib/collections.ts',
    'src/lib/sidebar.ts',
    'src/lib/user-slots.ts',
    'src/client.ts',
    'src/node.ts',
    'src/components/NotFound.astro',
    'src/styles/custom.css',
    'content/docs/guide/api.md',
    'content/en/docs/guide/api.md',
  ]) assert.doesNotThrow(() => readFileSync(path.join(created, file)))
  const layout = readFileSync(path.join(created, 'src/layouts/BaseLayout.astro'), 'utf8')
  assert.match(layout, /<!doctype html>/i)
  assert.match(layout, /loadSwipers/)
  assert.match(readFileSync(path.join(created, 'public/img/logo.svg'), 'utf8'), /viewBox="0 0 170 150"/)
})

test('refuses to overwrite a non-empty directory', () => {
  const cwd = mkdtempSync(path.join(tmpdir(), 'ermaozi-create-existing-'))
  const target = path.join(cwd, 'existing')
  mkdirSync(target)
  writeFileSync(path.join(target, 'keep.txt'), 'keep')
  assert.throws(
    () => execFileSync(process.execPath, [path.join(packageRoot, 'bin/create.mjs'), target, '--no-install'], { stdio: 'pipe' }),
    /Command failed/,
  )
  assert.equal(readFileSync(path.join(target, 'keep.txt'), 'utf8'), 'keep')
})

test('reuses the invoking package manager without leaking a Yarn dlx PnP loader', () => {
  const cwd = mkdtempSync(path.join(tmpdir(), 'ermaozi-create-manager-'))
  const installer = path.join(cwd, 'installer.mjs')
  const launcher = path.join(cwd, 'launcher.mjs')
  const target = path.join(cwd, 'yarn-site')
  writeFileSync(installer, `#!/usr/bin/env node\nimport { writeFileSync } from 'node:fs'; writeFileSync('installer.json', JSON.stringify({ args: process.argv.slice(2), nodeOptions: process.env.NODE_OPTIONS ?? null }))`)
  chmodSync(installer, 0o755)
  writeFileSync(launcher, `process.env.npm_config_user_agent = 'yarn/4.9.2 npm/? node/v22'; process.env.npm_execpath = ${JSON.stringify(installer)}; process.env.NODE_OPTIONS = '--require /tmp/dlx/.pnp.cjs'; process.argv = [process.execPath, 'create', ${JSON.stringify(target)}]; await import(${JSON.stringify(pathToFileURL(path.join(packageRoot, 'bin/create.mjs')).href)})`)
  execFileSync(process.execPath, [launcher], { cwd })
  const result = JSON.parse(readFileSync(path.join(target, 'installer.json'), 'utf8'))
  assert.deepEqual(result, { args: ['install'], nodeOptions: null })
  assert.equal(JSON.parse(readFileSync(path.join(target, 'package.json'), 'utf8')).packageManager, 'yarn@4.9.2')
  assert.equal(readFileSync(path.join(target, 'yarn.lock'), 'utf8'), '')
  assert.equal(readFileSync(path.join(target, '.yarnrc.yml'), 'utf8'), 'nodeLinker: node-modules\n')
})

test('GitHub releases publish only a matching package version through trusted publishing', () => {
  const workflow = readFileSync(path.resolve(packageRoot, '../..', '.github/workflows/publish-npm.yml'), 'utf8')
  assert.match(workflow, /release:\s*\n\s+types: \[published\]/)
  assert.match(workflow, /id-token: write/)
  assert.match(workflow, /npm install --global npm@11\.18\.0/)
  assert.match(workflow, /RELEASE_TAG.*github\.event\.release\.tag_name/)
  assert.match(workflow, /Release tag must be v/)
  assert.doesNotMatch(workflow, /NODE_AUTH_TOKEN|NPM_TOKEN/)
  assert.match(workflow, /npm publish --access public/)
})
