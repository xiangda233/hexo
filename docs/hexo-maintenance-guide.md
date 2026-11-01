# Hexo 博客维护与 GitHub 同步指南

本文按当前 `F:\HEXO` 仓库的实际结构编写。当前博客使用 Hexo 7.3.0 和
`kratos-rebirth` 主题，源码放在 `main` 分支，推送到 GitHub 后由 GitHub Actions
自动构建并发布到 GitHub Pages。

最后核对日期：2026-10-31。

## 1. 先理解这套博客的工作方式

Hexo 是静态网站生成器。你写的 Markdown 和配置不会直接成为网站，而是要经过一次构建：

```text
Markdown 文章 + 页面文件 + 配置 + 主题
                  |
               Hexo 构建
                  |
              public\ 静态网站
                  |
        Git push -> GitHub Actions
                  |
              GitHub Pages
                  |
          https://hexo.yuixd.top
```

日常需要编辑的是 `source\` 和根目录的配置文件；`public\` 是构建结果，不应直接修改。

### 仓库目录

| 路径 | 作用 | 日常是否修改 |
| --- | --- | --- |
| `source\_posts\` | 已发布的文章 | 是 |
| `source\_drafts\` | 草稿，默认不会生成到网站 | 写草稿时修改 |
| `source\images\` | 站点图片、文章共用图片 | 添加图片时修改 |
| `source\CNAME` | GitHub Pages 自定义域名 | 换域名时修改 |
| `_config.yml` | 站点名称、作者、网址、文章网址规则等 | 偶尔修改 |
| `_config.kratos-rebirth.yml` | 主题头像、导航、页脚、分享等 | 偶尔修改 |
| `package.json` | Hexo、主题和构建命令 | 升级依赖时修改 |
| `pnpm-lock.yaml` | 依赖版本锁定文件 | 升级依赖后自动变化 |
| `.github\workflows\deploy.yml` | GitHub 自动构建和部署流程 | 确认部署配置时使用 |
| `tools\`、`lib\` | 本地构建、校验和 WordPress 导入辅助代码 | 通常不改 |
| `public\` | 生成的 HTML、CSS、JS 等 | 不直接修改 |
| `node_modules\` | 安装的依赖和主题代码 | 不直接修改 |

`public\`、`node_modules\`、`.hexo\` 和 `db.json` 已被 `.gitignore` 排除，不会也不需要同步到 GitHub。

## 2. 各类内容应该改哪个文件

最容易混淆的是“文章标题”“站点标题”“导航名称”和“页面正文”。它们不在同一个地方。

### 常见修改位置速查

| 想修改的内容 | 应修改的文件 |
| --- | --- |
| 某篇文章的显示标题 | 对应文章开头的 `title` |
| 某篇文章的正文 | 文章第二个 `---` 后面的 Markdown |
| 某篇文章的日期、分类、标签 | 对应文章的 Front Matter |
| 某篇文章的网址 | 对应文章的 `permalink` |
| 网站总名称 | `_config.yml` 的 `title` |
| 网站副标题、描述、作者 | `_config.yml` 的 `subtitle`、`description`、`author` |
| 顶部导航文字和链接 | `_config.kratos-rebirth.yml` 的 `nav.items` |
| 页脚文字和链接 | `_config.kratos-rebirth.yml` 的 `footer` |
| 主题头像 | `_config.kratos-rebirth.yml` 的 `image.avatar` |
| 独立页面的正文 | 该页面自己的 Markdown 文件 |
| 自定义域名 | `source\CNAME`，并同步修改 `_config.yml` 的 `url` |
| 首页文章数量 | `_config.yml` 的 `index_generator.per_page` |

## 3. 修改文章标题和正文

文章位于 `source\_posts\`。例如：

```text
source\_posts\hello-world.md
```

文件结构如下：

```markdown
---
title: 我的第一篇文章
date: 2026-10-28 12:00:00
tags:
  - 随笔
categories:
  - 日常
---

这里是文章正文。你可以使用 Markdown 编写标题、列表、图片和代码。
```

开头两条 `---` 之间的部分叫 Front Matter，用 YAML 格式保存文章元数据。第二条 `---`
之后才是正文。

### 修改显示标题

打开文章，把：

```yaml
title: 我的第一篇文章
```

改成：

```yaml
title: Hexo 入门记录
```

保存并重新构建后，首页卡片、文章页标题和浏览器标题都会更新。文件名不决定页面上显示的标题，
但为了便于自己查找，建议把文件名也改成易读的名称。

如果标题中包含冒号，建议给整个值加引号，避免 YAML 解析错误：

```yaml
title: "Hexo：从零开始"
```

### 修改正文

直接修改第二个 `---` 后面的内容即可。不要把正文写进 Front Matter。

### 修改标题后网址为什么没有变

你的多数文章在 Front Matter 中显式指定了网址，例如：

```yaml
title: 白嫖微软Azure12个月教程
permalink: "/2021/10/02/白嫖微软azure12个月教程/"
```

`title` 决定页面显示什么，`permalink` 决定浏览器访问什么网址。因为这里已经写了
`permalink`，只改 `title` 时，旧网址会保持不变。这通常更安全，旧链接也不会失效。

如果你确实要换网址，需要同时修改：

```yaml
title: 新标题
permalink: "/2026/10/31/new-permalink/"
```

修改 `permalink` 后，旧链接会变成 404，搜索引擎收录和 RSS 中已有的链接也可能失效。
除非确有需要，建议保持原 `permalink` 不变。仅重命名 Markdown 文件通常也不会改变已经写死的
`permalink`。

### 不要误改的字段

从 WordPress 导入的文章中有 `id` 字段，例如 `id: "15"`。这个字段用于保留迁移来源信息，
不是文章标题，也不是网页编号，一般保持原样即可。

## 4. 新建一篇文章

在 `source\_posts\` 下新建 `.md` 文件，推荐使用 UTF-8 编码。例如：

```markdown
---
title: "我的新文章"
date: 2026-10-31 20:00:00
tags:
  - Hexo
  - 教程
categories:
  - 日常
---

正文从这里开始。
```

如果你没有写 `permalink`，Hexo 会根据 `_config.yml` 中的：

```yaml
permalink: :year/:month/:day/:title/
```

自动生成网址。文章标题中的空格、符号和中文会在构建时转换为 URL 形式。

保存后运行本地预览，确认文章能正常显示。

## 5. 草稿和发布

`source\_drafts\` 中的文件默认不会进入正式网站。确认可以发布后，把文件移动到
`source\_posts\`。

需要预览草稿时，可以直接使用仓库的 Node 启动脚本：

```powershell
node tools/run-hexo.js server --drafts
```

注意：`_drafts` 只是“不参与网站生成”，不代表“不会上传到 GitHub”。如果仓库是公开的，
草稿文件一旦提交并推送，别人仍能在 GitHub 源码中看到。不要把密码、密钥、后台地址、
访问令牌等敏感信息写进草稿或文章。

## 6. 独立页面、首页和导航

### 当前页面情况

- 首页由 Hexo 自动生成，内容是文章列表，不是单独的一份 `index.md`。
- “档案馆”“标签”“分类”和 404 页面由 Hexo 生成器或主题自动生成。
- 现有“关于此博客”是一篇普通文章，文件是 `source\_posts\关于此博客.md`，不是独立页面。
- 当前没有单独的 `source\about\index.md`。

因此，如果只是想改“关于此博客”的文字，直接编辑：

```text
source\_posts\关于此博客.md
```

### 新建独立页面

如果希望有一个固定网址、以“页面”而不是“文章”形式存在的关于页，可以新建：

```text
source\about\index.md
```

内容写成：

```markdown
---
title: 关于本站
layout: page
date: 2026-10-31 20:00:00
---

这里是关于页面的正文。
```

目录名 `about` 会形成网址 `https://hexo.yuixd.top/about/`。

随后在 `_config.kratos-rebirth.yml` 的 `nav.items` 中加入导航入口。例如：

```yaml
nav:
  items:
    - label: 首页
      icon: home
      url: /
    - label: 关于
      icon: user
      url: /about/
    - label: 档案馆
      icon: file
      url: /archives/
```

此时显示标题由页面的 `title` 决定，顶部导航文字由主题配置的 `label` 决定。两处可以不同。

如果不想保留“关于此博客”这篇文章，可以在确认新页面正常后删除原文章；Git 提交历史中仍可找回。

### 修改首页简介和网站名称

编辑根目录 `_config.yml`：

```yaml
title: 唯的 Hexo 博客
subtitle: ""
description: 记录学习、兴趣与日常折腾
author: 唯
language: zh-CN
timezone: Asia/Shanghai
```

`title` 是网站名称，不是某篇文章的标题。文章标题只写在各自的 Markdown 中。

## 7. 添加图片

把图片放到 `source\images\`，例如：

```text
source\images\example.png
```

正文中使用以站点根目录开头的路径：

```markdown
![图片说明](/images/example.png)
```

站点头像目前是 `source\images\avatar.jpg`，对应主题配置中的：

```yaml
image:
  avatar: "/images/avatar.jpg"
```

图片路径建议使用英文、数字、短横线，避免空格和特殊符号。图片加入仓库后需要提交并推送，
线上网站才会拥有该文件。

## 8. 本地预览和构建检查

首次在新电脑上使用：

```powershell
corepack enable
corepack prepare pnpm@11.25.0 --activate
pnpm install --frozen-lockfile
```

当前项目要求 Node.js 20 或更高版本。GitHub Actions 使用 Node.js 22。

### 启动本地预览

在 VS Code 终端中进入仓库目录：

```powershell
cd F:\HEXO
pnpm server
```

浏览器打开 Hexo 输出的本地地址，通常是：

```text
http://localhost:4000
```

修改文章或主题配置后，预览通常会触发重新生成。按 `Ctrl+C` 停止服务。

如果 `pnpm` 本身有问题，可以直接使用仓库已有的 Node 启动脚本：

```powershell
node tools/run-hexo.js server
```

### 构建并检查

正式提交前建议依次运行：

```powershell
pnpm clean
pnpm build
pnpm verify
```

它们分别完成：

- `clean`：清理旧的生成结果。
- `build`：重新生成 `public\`。
- `verify`：检查必需文件以及站内链接是否指向不存在的页面。

等价的手动命令是：

```powershell
node tools/run-hexo.js clean
node tools/run-hexo.js generate
node tools/verify-site.js
```

如果 `verify` 报错，不要直接把 `public\` 推上去；先修复报错中提示的文章网址或链接。

## 9. GitHub 自动部署流程

当前 Git 远程仓库是：

```text
https://github.com/xiangda233/hexo.git
```

当前分支是 `main`。`.github\workflows\deploy.yml` 在每次推送到 `main` 后自动执行：

1. 检出仓库。
2. 安装 pnpm 11.25.0 和 Node.js 22。
3. 执行 `pnpm install --frozen-lockfile`。
4. 执行 `pnpm clean`、`pnpm build` 和 `pnpm verify`。
5. 将生成的 `public\` 上传为 GitHub Pages 构建产物。
6. 发布到 GitHub Pages。

因此，正常情况下只需要把源码推送到 GitHub，不要在本地执行 `hexo deploy`，也不需要手动上传
`public\`。`_config.yml` 中的 `deploy.type` 为空是正常的。

仓库的 GitHub 设置应保持：

```text
Settings -> Pages -> Build and deployment -> Source: GitHub Actions
```

也可以在 GitHub 仓库的 `Actions` 页面查看每次构建是否成功。

当前自定义域名是：

```text
hexo.yuixd.top
```

它由 `source\CNAME` 和 GitHub Pages 的自定义域名设置共同决定。换域名时需要同时处理：

1. 修改 `_config.yml` 的 `url`。
2. 修改 `source\CNAME`。
3. 修改域名 DNS。
4. 在 GitHub Pages 设置中重新验证自定义域名。

## 10. 第一次用 VS Code 连接这个仓库

### 准备

1. 安装 Git for Windows 和 VS Code。
2. 在 VS Code 扩展中确认已启用内置的 Git 和 GitHub Authentication。
3. 用 VS Code 打开整个文件夹 `F:\HEXO`，不要只打开 `source\_posts` 下的某一个文件。

### 检查已有连接

在 VS Code 中打开“终端”并运行：

```powershell
git status
git remote -v
git branch --show-current
```

正常情况下应看到远程 `origin` 指向 `xiangda233/hexo.git`，当前分支是 `main`。

仓库已经初始化过 Git，不要重复运行 `git init`，也不要删除 `.git` 文件夹。

### 登录 GitHub

在 VS Code 左下角账户图标中选择使用 GitHub 登录，或第一次推送时按提示登录。
推荐的认证方式是浏览器授权或 Git Credential Manager。

不要把 Personal Access Token、账号密码或密钥明文写进 URL、文档或仓库文件。
GitHub 已经不支持用账户密码直接进行 Git 推送。

## 11. 在 VS Code 里提交并同步

### 图形界面流程

1. 先打开 VS Code 左侧的“源代码管理”。
2. 点击刷新，检查所有改动。
3. 只暂存你确实想提交的文件。当前项目里可能有临时目录或其他未跟踪文件，不建议无脑点击“全部暂存”。
4. 在提交信息中写清本次改动，例如 `修改关于页内容` 或 `新增 Hexo 维护指南`。
5. 点击“提交”。
6. 点击“同步更改”或对 `main` 分支执行推送。
7. 打开 GitHub 仓库的 `Actions` 页面，等待 `Deploy Hexo` 工作流成功。

建议每次开始编辑前先同步一次，提交前再查看一次源代码管理的变更列表，避免覆盖其他电脑上的更新。

### 命令行流程

推荐使用最小范围暂存，不要在当前仓库直接使用 `git add -A`：

```powershell
cd F:\HEXO
git pull --rebase origin main
git status

# 只添加本次实际修改的文件，例如：
git add "source/_posts/hello-world.md"

git commit -m "修改 Hello World 文章标题"
git push origin main
```

如果修改的是配置，就只添加对应配置：

```powershell
git add _config.yml _config.kratos-rebirth.yml
git commit -m "更新站点配置"
git push origin main
```

如果新增了一篇独立页面，至少需要添加页面文件和导航配置：

```powershell
git add "source/about/index.md" _config.kratos-rebirth.yml
git commit -m "新增关于页面"
git push origin main
```

### 推荐的单次编辑流程

```text
1. git pull --rebase origin main
2. 修改 Markdown 或配置
3. pnpm server 本地预览
4. pnpm clean && pnpm build && pnpm verify
5. 只暂存本次改动
6. 写提交信息并提交
7. 推送 main
8. 查看 GitHub Actions 是否成功
9. 访问线上页面并强制刷新确认
```

Windows PowerShell 若不支持 `&&`，请把第 4 步拆成三条命令依次执行。

## 12. 冲突和常见问题

### 推送被拒绝，提示 `rejected` 或 `fetch first`

说明 GitHub 上有本地还没有的提交。先同步：

```powershell
git pull --rebase origin main
```

处理完可能出现的冲突后：

```powershell
git add 冲突文件
git rebase --continue
git push origin main
```

如果不确定冲突内容，先不要删除文件或执行 `git reset --hard`，保留现场后再排查。

### 本地预览正常，线上没有变化

依次检查：

1. 文件是否已经保存。
2. `git status` 是否仍有未提交改动。
3. 是否已经推送到 `origin/main`。
4. GitHub `Actions` 的最近一次 `Deploy Hexo` 是否成功。
5. 是否只是浏览器缓存；尝试 `Ctrl+F5`。
6. GitHub Pages 的 Source 是否仍设置为 `GitHub Actions`。

### 改标题后点击旧链接仍显示旧标题

先确认改的是对应文章且已经部署，再用 `Ctrl+F5` 强制刷新。如果仍不对，检查：

```powershell
pnpm clean
pnpm build
pnpm verify
```

### 新文章没有出现在首页

- 文章应在 `source\_posts\`，不是 `_drafts`。
- Front Matter 必须以 `---` 开始和结束。
- `date` 格式应类似 `2026-10-31 20:00:00`。
- 文章数量可能被分页；查看第二页或“档案馆”。

### Front Matter 写错导致构建失败

常见原因：

- 少了结束的 `---`。
- YAML 缩进不一致。
- 标题中有冒号但没有加引号。
- 列表前使用 Tab。YAML 应统一使用空格缩进。

修改后可单独测试：

```powershell
node tools/run-hexo.js generate
```

### 改主题样式为什么不要改 `node_modules`

主题安装在 `node_modules\hexo-theme-kratos-rebirth\`，这个目录不受 Git 跟踪，重新安装依赖后可能被覆盖。

普通配置修改应放在根目录的：

```text
_config.kratos-rebirth.yml
```

不要在 `node_modules`、`public` 或 GitHub Pages 的线上构建结果里改文章。前者容易丢失，
后两者会被下一次构建覆盖。

## 13. 提交前检查清单

- 标题改在正确的文章 `title` 中，而不是站点 `_config.yml`。
- 正文在 Front Matter 结束后。
- 如果故意改网址，才修改 `permalink`。
- 独立页面使用 `layout: page`，导航链接写在 `_config.kratos-rebirth.yml`。
- 图片已经放进 `source\images\` 并使用 `/images/...` 路径。
- 本地预览没有明显排版问题。
- `pnpm build` 和 `pnpm verify` 成功。
- 只暂存了本次真正想提交的文件。
- 推送后在 GitHub Actions 中看到构建成功，再访问线上页面确认。

