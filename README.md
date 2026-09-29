# fengchendian.github.io

个人博客，基于 [Astro](https://astro.build) + Tailwind CSS 构建，部署在 GitHub Pages。

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm install` | 安装依赖 |
| `npm run dev` | 本地开发（热更新） |
| `npm run build` | 构建到 `dist/`，并生成 Pagefind 搜索索引 |
| `npm run preview` | 本地预览构建产物 |

## 关于站内搜索

归档页的全文搜索使用 [Pagefind](https://pagefind.app)，索引是**构建产物**（`dist/pagefind/`）：

- `npm run dev` 下没有索引，全文搜索不生效（仅 `#标签` 过滤可用）。
- 要完整测试搜索，需先构建再预览：

```bash
npm run build && npm run preview
```

## preview 端口冲突

Astro 同一项目目录只允许一个 preview 实例。若 `npm run preview` 报 `Another astro preview server is already running`：

- preview 直接读 `dist/` 的文件，**重新 build 后无需重启**，旧实例服务的就是最新内容，直接访问 <http://localhost:4321> 即可；
- 或停掉旧实例：`npx astro preview stop`；
- 或强制替换：`npx astro preview --force`。

## 目录结构

- `src/content/blog/` — 博客文章（Markdown，含 frontmatter）
- `src/pages/` — 页面路由
- `src/layouts/` — 页面布局（文章页含 `data-pagefind-body`，Pagefind 据此索引正文）
- `public/` — 静态资源，原样拷贝到 `dist/`
