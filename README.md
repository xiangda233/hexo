# 翔大的博客

使用 Hexo 7、Kratos-Rebirth 主题和 GitHub Pages 部署。

- 站点：https://hexo.yuixd.top/
- WordPress 导出：`migration/wordpress-export.xml`
- 公开文章：`source/_posts/`
- 私有草稿：`source/_drafts/`（不会随正常构建发布）

## 本地运行

```bash
pnpm install
pnpm server
```

打开 <http://localhost:4000/>。

## 构建与检查

```bash
pnpm clean
pnpm build
pnpm verify
```

`pnpm verify` 会检查构建产物和站内链接。

## 重新迁移 WordPress

```bash
pnpm migrate:wordpress
```

迁移规则：

- `publish` 文章写入 `source/_posts/`
- `private` 文章写入 `source/_drafts/`
- `trash` 文章不会生成
- 保留 WordPress 原始时间、分类、标签、文章 ID 和永久链接
- 转换文章标题、警告框、下载按钮、B 站视频和音乐等常见短代码

推送 `main` 分支后，GitHub Actions 会构建并通过 GitHub Pages 发布。
