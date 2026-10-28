# WordPress migration source

`wordpress-export.xml` 是 WordPress 的全量导出文件，是文章迁移的原始来源。

在仓库根目录运行：

```bash
pnpm migrate:wordpress
```

脚本只管理带 WordPress `id` 的迁移文件，不会覆盖手工创建的 Markdown 文章。
