// @ts-check
import { defineSiteConfig } from './src/config.mjs'

/**
 * 站点总配置。
 *
 * 修改原则：
 * - 字符串留空通常表示不启用对应外部服务；
 * - 支持 `false` 的功能可直接设为 `false` 关闭；
 * - `defineSiteConfig()` 只提供类型检查和编辑器提示，不会改写配置；
 * - 修改后运行 `pnpm build`，可同时检查配置、内容和静态页面生成。
 */
export const siteConfig = defineSiteConfig({
  // ── 站点身份与全局行为 ──────────────────────────────────────────────

  // 生产站点完整域名，用于 canonical、站点地图、分享卡片等绝对地址。
  // 必须包含协议；正式发布前请替换示例域名。
  origin: 'https://example.com',

  // 部署子路径。自定义域名或根域名使用 '/'；部署到 example.com/project/ 时填写 '/project/'。
  // GitHub Pages 和 GitLab Pages 的内置工作流会通过 BASE_PATH 自动覆盖此值。
  base: '/',

  // 全站 Logo。支持站内路径或完整 URL，同时用作默认头像和部分 SEO 图片。
  logo: '/img/logo.svg',

  // 外观模式：true 允许浅色/深色/跟随系统；false 固定浅色；
  // 'dark' 默认深色但允许切换；'force-dark' 固定深色并隐藏开关。
  appearance: true,

  // 供自定义组件使用的版权年份；内置页脚文字由下方 footer.copyright 决定。
  copyrightYear: new Date().getFullYear(),

  // 浏览器存储键和互动事件的命名空间。同一域名部署多个站点时必须保持唯一。
  namespace: 'ermaozi',

  // 媒体 CDN 域名。留空表示使用原始图片地址；配置后会启用预连接和响应式图片 URL。
  mediaOrigin: '',

  // 构建时资源地址替换。false 完全关闭；需要 CDN 时可改为 true 或规则对象。
  // 它只改写构建产物，不修改 Markdown、CSS 或 JavaScript 源文件。
  replaceAssets: false,

  // 自动补全 Markdown frontmatter。启用后可写入缺失的标题、时间和永久链接；
  // 已存在的字段不会覆盖。若不希望构建过程写源文件，请设为 false。
  autoFrontmatter: true,

  // 全站社交链接。icon 支持内置名称、Iconify 名称、图片路径或自定义 SVG。
  // 若配置 Twitter/X 主页，链接中的账号会自动用于 twitter:site 和 twitter:creator SEO 标签。
  social: [
    { icon: 'github', link: 'https://github.com/ermaozi/astro-theme-ermaozi' },
    // { icon: 'twitter', link: 'https://x.com/example' },
  ],

  // 允许直接出现在桌面导航栏的社交平台；其他链接仍可显示在“更多”菜单或资料卡。
  navbarSocialInclude: ['github', 'twitter', 'discord', 'facebook'],

  // 页脚。设为 false 可完全关闭；message 支持可信 HTML。
  footer: {
    message: 'Powered by <a target="_blank" rel="noopener" href="https://astro.build/">Astro</a> &amp; <a target="_blank" rel="noopener" href="https://github.com/ermaozi/astro-theme-ermaozi">ermaozi</a>',
    copyright: `Copyright © ${new Date().getFullYear()} ermaozi`,
  },

  // 博客作者资料卡。设为 false 后隐藏桌面资料卡，并改用文章列表顶部的分类导航。
  profile: {
    // avatar 也兼容旧字段名 url；站内图片建议放在 public/ 下并以 / 开头引用。
    avatar: '/img/logo.svg',
    circle: true,
    location: 'Internet',
    organization: 'Open source community',
    // 桌面资料卡位于文章列表左侧或右侧。
    layout: 'right',
  },

  // ── 文章列表、元信息与页面过渡 ─────────────────────────────────────

  // 标签配色：colored 为多色，gray 为灰色，brand 使用品牌色。
  tagsTheme: 'colored',

  // 文章标题下方显示的元信息；meta: false 可全部关闭。
  meta: {
    tags: true,
    readingTime: true,
    wordCount: true,
    // true/'short' 仅日期，'long' 包含时间，false 隐藏创建时间。
    createTime: 'short',
  },

  // 阅读时长估算速度；中文站通常可按“字/分钟”理解。
  readingTime: { wordPerMinute: 300 },

  // 最后更新时间格式。设为 false 可全局关闭；forceLocale 可强制使用页面语言。
  lastUpdated: { formatOptions: { dateStyle: 'short', timeStyle: 'short' } },

  // Git 贡献者信息。可设为 false，或使用对象配置 inline/block 等显示方式。
  contributors: true,

  // Git 变更记录默认关闭；开启后会增加构建时的 Git 历史读取。
  changelog: false,

  // 文章列表封面布局；false 不显示，其他常用值包括 left、top、odd-left、odd-right。
  postCover: 'right',

  // 每页文章数。也可直接写数字；false 关闭分页。
  pagination: { perPage: 15 },

  // 分类树默认展开层级；deep 表示全部展开，也可填写数字层级。
  categoriesExpand: 'deep',

  // 页面切换动画。transition: false 可关闭全部动画；系统“减少动态效果”仍优先生效。
  transition: {
    appearance: 'fade',
    page: true,
    postList: true,
  },

  // ── 搜索、代码与页面工具 ───────────────────────────────────────────

  // 站内搜索。false 关闭；local 使用构建时生成的 Pagefind 索引；
  // algolia 还需要 appId、apiKey、indexName/indices 等公开搜索配置。
  search: {
    provider: 'local',
  },

  // 代码高亮：Twoslash 类型提示、行号起始阈值、缩进线和彩色括号。
  codeHighlighter: { twoslash: true, lineNumbers: 10, renderIndentGuides: true, colorizedBrackets: true },

  // 兼容插件选项。imageSize 为 true 时会在构建期读取图片尺寸并补全宽高。
  plugins: { markdownPower: { imageSize: false } },

  // 代码块和增强表格的复制按钮。
  copyCode: true,

  // 页面右上角上下文菜单中的 AI 服务入口；false 可关闭整个菜单。
  pageContextMenu: { chatgpt: true, claude: true, perplexity: true },

  // ── 语言、内容集合与导航 ───────────────────────────────────────────

  // 多语言总开关。false 会隐藏语言切换器，并停止输出页面及站点地图中的 hreflang；
  // 已存在的 /en/ 示例页仍可直接访问，便于以后启用或测试。改为 true 即可重新开启。
  multilingual: false,

  // locales 保存各语言的路径、文案、内容集合和导航。
  // 即使 multilingual 为 false，也应保留已有内容对应的 locale，确保这些文件仍能正确构建。
  // 新增语言时应增加完整语言块、对应 content/<语言目录>/，并使用独立的 home 前缀。
  locales: {
    'zh-CN': {
      // 当前语言的站点名称和各内容区域名称。
      siteName: 'ermaozi',
      blogName: '示例博客',
      docsName: '文档中心',

      // SEO 与作者资料。description 用于页面缺少独立描述时的默认值。
      description: '一个支持全文搜索、深色模式和增强 Markdown 的 Astro 静态博客主题。',
      authorName: '站点作者',
      authorDescription: '使用 ermaozi 发布文章、文档和项目记录。',
      profileTagline: '记录、整理与分享',
      keywords: 'Astro,静态博客,Markdown,博客主题',

      // 当前语言的首页路径。根语言必须使用 '/'。
      home: '/',

      // 界面文案。未填写的字段会使用主题内置的简体中文预设。
      homeText: '首页',
      postsText: '博客',

      // 页面 Markdown 复制、纯文本查看和“询问 AI”菜单文案。
      copyPageText: '复制页面',
      copiedPageText: '复制成功',
      copingPageText: '复制中..',
      copyTagline: '将页面以 Markdown 格式复制供 LLMs 使用',
      viewMarkdown: '以 Markdown 格式查看',
      viewMarkdownTagline: '以纯文本查看此页面',
      askAIText: '在 {name} 中打开',
      askAITagline: '向 {name} 提问有关此页面',
      askAIMessage: '阅读 {link} 并回答内容相关的问题。',

      // 内容集合决定哪些目录是博客或文档，以及它们如何生成列表、侧边栏和前后页。
      collections: [
        // content/blog/ 下的 Markdown 作为博客文章，并生成 /blog/ 及其分类、标签、归档页。
        { type: 'post', dir: 'blog', title: '博客' },
        {
          // content/docs/ 下的 Markdown 作为文档，访问前缀默认为 /docs/。
          type: 'doc',
          dir: 'docs',
          title: '文档中心',

          // 文档侧边栏。可改为 'auto' 自动发现文件，也可像下面这样手动编排。
          sidebar: [
            {
              text: '指南',
              // prefix 会自动拼接到组内的相对 link 或字符串条目。
              prefix: 'guide',
              icon: 'icon-park-outline:guide-board',
              collapsed: false,
              items: [
                // items 支持继续嵌套；字符串会读取对应 Markdown 的标题。
                { text: '基础', icon: 'construction', collapsed: false, items: ['getting-started', 'configuration', 'deployment', { text: '公共 API 与样式定制', link: 'api', badge: { text: 'New', type: 'warning' } }] },
                { text: '内容能力', link: 'content', icon: 'simple-icons:astro' },
              ],
            },
            // link: '---' 是纯分隔项，不会跳转。
            { text: '参考', link: '---', icon: 'more-circle' },
            // 完整 URL 会自动作为外部链接处理。
            { text: 'Astro', link: 'https://astro.build/', icon: 'simple-icons:astro' },
          ],
        },
      ],

      // 顶部导航。支持 text/link，也兼容 label/href；items 创建下拉菜单。
      navigation: [
        // activeMatch 是匹配当前路径的正则字符串，用于高亮导航项。
        { label: '<span>博客</span>', href: '/blog/', icon: 'home', activeMatch: '^/(blog|article)/' },
        {
          label: '文档',
          icon: 'material-symbols:docs-outline',
          activeMatch: '^/docs/',
          items: [
            '/docs/',
            {
              text: '指南',
              icon: 'icon-park-outline:guide-board',
              // prefix 与组内相对 link 拼接为 /docs/guide/<link>。
              prefix: '/docs/guide/',
              items: [
                { text: '快速开始', link: 'getting-started/', icon: 'rocket' },
                { text: '站点配置', link: 'configuration/', icon: 'construction' },
                { text: '部署站点', link: 'deployment/', icon: 'material-symbols:cloud-upload-outline' },
                { text: '内容能力', link: 'content/', icon: 'simple-icons:astro', badge: { text: 'New', type: 'warning' } },
                { text: 'Astro', link: 'https://astro.build/', icon: 'simple-icons:astro' },
              ],
            },
          ],
        },
        {
          label: '更多',
          icon: 'more-circle',
          items: [
            // icon 可使用图片、Iconify 名称或 { svg } 自定义图标。
            { label: '分类', href: '/blog/categories/', icon: '/img/logo.svg' },
            { label: '标签', href: '/blog/tags/', icon: { svg: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 4h8l10 10-7 7L4 11V4Zm4 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/></svg>' } },
            { label: '归档', href: '/blog/archives/', icon: 'archive' },
            { label: '关于', href: '/about/', icon: 'verified' },
          ],
        },
      ],
    },
    // 英文 locale 保留给 content/en/ 示例内容使用；字段含义与上方中文块相同。
    // multilingual: false 时不会显示语言入口或输出 hreflang，改为 true 即可完整启用。
    'en-US': {
      siteName: 'ermaozi',
      blogName: 'Example Blog',
      docsName: 'Documentation',
      description: 'An Astro static blog theme with bilingual content, full-text search, dark mode, and enhanced Markdown.',
      authorName: 'Site Author',
      authorDescription: 'Publish articles, documentation, and project notes with ermaozi.',
      profileTagline: 'Write, organize, and share',
      keywords: 'Astro,static blog,Markdown,bilingual site,theme',
      home: '/en/',
      homeText: 'Home',
      postsText: 'Blog',
      copyPageText: 'Copy page',
      copiedPageText: 'Copied !',
      copingPageText: 'Copying..',
      copyTagline: 'Copy page as Markdown for LLMs',
      viewMarkdown: 'View as Markdown',
      viewMarkdownTagline: 'View this page as plain text',
      askAIText: 'Open in {name}',
      askAITagline: 'Ask {name} about this page',
      askAIMessage: 'Read {link} and answer content-related questions.',
      collections: [
        { type: 'post', dir: 'blog', title: 'Blog' },
        {
          type: 'doc',
          dir: 'docs',
          title: 'Documentation',
          sidebar: [
            {
              text: 'Guides',
              prefix: 'guide',
              icon: 'icon-park-outline:guide-board',
              collapsed: false,
              items: [
                { text: 'Basics', icon: 'construction', collapsed: false, items: ['getting-started', 'configuration', 'deployment', { text: 'Public API and styling', link: 'api', badge: { text: 'New', type: 'warning' } }] },
                { text: 'Content features', link: 'content', icon: 'simple-icons:astro' },
              ],
            },
            { text: 'Reference', link: '---', icon: 'more-circle' },
            { text: 'Astro', link: 'https://astro.build/', icon: 'simple-icons:astro' },
          ],
        },
      ],
      navigation: [
        { label: '<span>Blog</span>', href: '/en/blog/', icon: 'home', activeMatch: '^/en/(blog|article)/' },
        {
          label: 'Docs',
          icon: 'material-symbols:docs-outline',
          activeMatch: '^/en/docs/',
          items: [
            '/en/docs/',
            {
              text: 'Guides',
              icon: 'icon-park-outline:guide-board',
              prefix: '/en/docs/guide/',
              items: [
                { text: 'Quick start', link: 'getting-started/', icon: 'rocket' },
                { text: 'Site configuration', link: 'configuration/', icon: 'construction' },
                { text: 'Deploy the site', link: 'deployment/', icon: 'material-symbols:cloud-upload-outline' },
                { text: 'Content features', link: 'content/', icon: 'simple-icons:astro', badge: { text: 'New', type: 'warning' } },
                { text: 'Astro', link: 'https://astro.build/', icon: 'simple-icons:astro' },
              ],
            },
          ],
        },
        {
          label: 'More',
          icon: 'more-circle',
          items: [
            { label: 'Categories', href: '/en/blog/categories/', icon: '/img/logo.svg' },
            { label: 'Tags', href: '/en/blog/tags/', icon: { svg: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 4h8l10 10-7 7L4 11V4Zm4 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/></svg>' } },
            { label: 'Archives', href: '/en/blog/archives/', icon: 'archive' },
            { label: 'About', href: '/en/about/', icon: 'verified' },
          ],
        },
      ],
    },
  },

  // ── 可选的互动与外部服务 ───────────────────────────────────────────

  // 功能总开关。只有总开关和对应服务配置都有效时，客户端代码才会加载。
  features: {
    // 浏览量与点赞，需要 services.statsBase 指向兼容的统计 API。
    engagement: false,
    // 热门文章，同样依赖统计 API。
    popularPosts: false,
    // 评论区，还必须完成下方 comment 对应提供商的配置。
    comments: false,
  },

  // 源码仓库信息，用于“编辑此页”、贡献者链接和变更记录。
  repository: {
    // 仓库首页 URL；留空时不显示“编辑此页”。
    url: '',
    branch: 'main',
    // Markdown 相对于仓库根目录的位置。
    contentDir: 'content',
    // 可选自定义模板；留空时根据 GitHub/GitLab/Gitee/Bitbucket 自动生成。
    editLinkPattern: '',
  },

  // 文章版权声明。设为 false 或 enabled: false 可关闭。
  copyright: {
    enabled: true,
    // 默认作者；文章 frontmatter 可单独覆盖。
    author: 'Site Author',
    // original、translate、reprint 分别表示原创、翻译和转载。
    creation: 'original',
    // 支持 CC0、CC-BY-4.0、CC-BY-NC-4.0、CC-BY-SA-4.0 等预设。
    license: 'CC-BY-4.0',
  },

  // 静态内容加密。global 控制全站门禁，rules 按访问路径设置页面密码。
  // 注意：它是浏览器端解密，不能替代服务端访问控制，不应发布真正敏感的数据。
  encrypt: {
    global: false,
    // 演示密码仅供示例站使用，正式站点必须替换或删除。
    admin: 'plume-admin',
    rules: {
      '/blog/encrypted-example/': 'rule-demo',
    },
  },

  // ── Markdown 与内容增强 ─────────────────────────────────────────────

  // 大部分开关只有在正文使用对应语法时才加载客户端依赖；不使用时不会增加页面请求。
  markdown: {
    // ==标记== 的渲染方式；lazy 保持按需交互。
    mark: 'lazy',

    // 数学公式。type 可选 katex 或 mathjax；delimiters: 'dollars' 启用 $...$ 语法。
    math: { type: 'katex', delimiters: 'dollars', copy: true, mhchem: false },

    // 图标提供商。iconify 使用集合名:图标名；也可配置 iconfont/fontawesome 及资源地址。
    icon: {
      provider: 'iconify',
      // 设置 prefix 后，未写集合前缀的图标会自动使用该集合。
      // prefix: 'mdi',
      // IconFont 或 Font Awesome 可通过 assets 加载一个或多个 .css/.js URL。
      // assets: [],
    },

    // 可运行代码块。Go、Kotlin、Rust 会请求远程执行服务；Python 在浏览器加载 Pyodide。
    repl: { go: true, kotlin: true, rust: true, python: true },

    // 增强表格复制与显示。
    table: true,

    // Obsidian 兼容：Wiki 链接、嵌入、Callout 和 Obsidian 注释。
    obsidian: { wikiLink: true, embedLink: true, callout: true, comment: true },

    // 文本增强：缩写、注解、隐藏文本、二维码、兼容性表和文件包含。
    abbr: true,
    annotation: true,
    plot: true,
    qrcode: true,
    caniuse: true,
    include: true,

    // 图表语法。各开关控制对应代码围栏或组件是否参与渲染。
    chartjs: true,
    echarts: true,
    flowchart: true,
    markmap: true,
    plantuml: true,
    mermaid: true,

    // 外部媒体与播放器。关闭未使用的类型可以减少生成的功能入口和可用语法面。
    acfun: true,
    bilibili: true,
    youtube: true,
    pdf: true,
    audioReader: true,
    artPlayer: true,

    // npm 命令自动转换标签页的显示顺序；删除某项即可不生成该包管理器版本。
    npmTo: ['pnpm', 'yarn', 'npm'],

    // 全局 Markdown 环境预设，可在所有文章中复用。
    env: {
      // 链接引用：[文字][astro]
      references: { astro: { href: 'https://astro.build/', title: 'Astro' } },
      // 缩写定义：正文中的 SSG 会获得解释。
      abbreviations: { SSG: 'Static Site Generator' },
      // 注解预设名称及其 Markdown 内容。
      annotations: { preset: 'This annotation is configured once in `site.config.mjs`.' },
    },

    // ::: encrypt 未单独写密码时使用的默认密码；留空表示不提供默认值。
    encryptPassword: '',

    // 文件树图标：colored 使用彩色文件类型图标；false 可关闭图标。
    fileTree: { icon: 'colored' },

    // 危险选项：允许图表配置执行 JavaScript。默认必须保持关闭；
    // 如果确有需要，还应只把可信 Markdown 路径加入 allowlist。
    DANGEROUS_ALLOW_SCRIPT_EXECUTION: false,
    DANGEROUS_SCRIPT_EXECUTION_ALLOWLIST: [],
  },

  // ── 水印、公告、统计、评论与站长验证 ───────────────────────────────

  // 页面水印。enabled: false 时不会创建水印；fullPage: false 仅覆盖正文区域。
  watermark: {
    enabled: false,
    fullPage: true,
    options: {
      // 水印文字、单元格尺寸、旋转角度和透明度。
      content: 'ermaozi',
      width: 240,
      height: 180,
      rotate: -22,
      globalAlpha: 0.12,
    },
  },

  // 公告板。enabled: false 可关闭；此示例仅在 /landing/ 显示。
  bulletin: {
    enabled: true,
    // 位置：top-left、top-right、bottom-left、bottom-right 或 center。
    layout: 'top-right',
    border: true,
    // always 每次显示；session 当前标签会话只关闭一次；once 跨会话记住关闭状态。
    lifetime: 'session',
    // 可返回布尔值限制公告出现的页面；删除此项表示所有页面。
    enablePage: ({ path }) => path === '/landing/',
    title: 'Welcome',
    // text、html 或 markdown；contentFile 可改为读取独立文件。
    contentType: 'markdown',
    content: 'Configure or disable this bulletin in `site.config.mjs`.',
    contentFile: '',
  },

  // 自建统计服务。statsBase 留空时，浏览量、点赞和热门文章不会发起请求。
  services: {
    statsBase: '',
    // 传递匿名访客标识时使用的请求头名称，必须与统计服务端一致。
    statsVisitorHeader: 'X-Site-Visitor',
  },

  // 评论提供商配置。provider 支持 Giscus、Waline、Twikoo、Artalk 或 None。
  // 当前 features.comments 为 false，因此下面的示例字段不会加载任何评论脚本。
  comment: {
    provider: 'Giscus',
    // 单独关闭评论适配器；文章 frontmatter 仍可用 comments: false 按页关闭。
    comment: true,
    // Giscus 必填公开字段，可从 giscus.app 获取；不要在前端配置私密令牌。
    repo: '',
    repoId: '',
    category: '',
    categoryId: '',
  },

  // 搜索引擎站长平台验证码。留空则不输出对应 meta 标签。
  verification: {
    yandex: '',
    baidu: '',
  },
})
