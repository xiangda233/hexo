---
layout: post
title: "宝塔Linux面板-安装golang环境"
date: 2021-10-06 11:15:28
permalink: "/2021/10/06/宝塔linux面板-安装golang环境/"
id: "17"
tags:
  - "go"
  - "干货分享"
  - "教程"
  - "服务器"
categories:
  - "旧的"
---

## 1.打开golang官网下载页面

[Go官网](https://golang.google.cn/)

选择相应的版本右键复制链接地址。

例如这样的：https://golang.google.cn/dl/go1.17.1.linux-amd64.tar.gz

然后用终端执行以下命令。

```
cd /www/server && wget -O golang.tar.gz https://golang.google.cn/dl/go1.17.1.linux-amd64.tar.gz
```

![](https://www.bt.cn/bbs/data/attachment/forum/201809/29/100127y5y59mdptd5x2t2d.png)

解压文件。

```
tar -xzvf golang.tar.gz
```

添加环境变量，使用vim 打开/etc/profile 文件

```
vim /etc/profile
```

在profile 最底部添加这些

```
export GOROOT=/www/server/go
export GOBIN=$GOROOT/bin
export GOPKG=$GOROOT/pkg/tool/linux_amd64
export GOARCH=amd64
export GOOS=linux
export GOPATH=/www/wwwroot/Golang
export PATH=$PATH:$GOBIN:$GOPKG:$GOPATH/bin
```

![](https://www.bt.cn/bbs/data/attachment/forum/201809/29/101346svuwyryvdbvjyksj.png)

执行

```
source /etc/profile
```

![](https://www.bt.cn/bbs/data/attachment/forum/201809/29/101611baxyrcxea4rz0wrz.png)
安装成功！！
最后去创建GOROOT目录就可以了

```
mkdir /www/wwwroot/Golang
```

go安装成功！
