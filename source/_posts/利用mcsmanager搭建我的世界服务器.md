---
layout: post
title: "利用MCSManager搭建我的世界服务器"
date: 2021-11-27 15:28:35
permalink: "/2021/11/27/利用mcsmanager搭建我的世界服务器/"
id: "21"
tags:
  - "MCSManager"
  - "干货分享"
  - "我的世界"
  - "教程"
  - "服务器"
categories:
  - "旧的"
---

# 首先是安装面板

## 1.Linux

Linux系统有官方一键安装指令，我们复制，以root用户运行即可

```
wget -qO- https://gitee.com/Suwingser/MCSManager-installer/raw/master/install.sh  bash
```

安装成功后，使用 systemctl start mcsm 命令即可启动面板

不要忘了放行23333端口

![](https://gitee.com/Suwingser/MCSManager/raw/master/public/common/main_theme.png)

成功运行界面

后台地址为ip:23333

默认账号密码为

#master

12356

登陆即可

## 2.Windows

windows版本可以使用官方提供的一键打包环境使用，java环境还是需要你手动安装一下，自行百度即可，注意下载64为的java

地址:[http://mcsm.suwings.top/](http://mcsm.suwings.top/)

# 然后是服务器创建

点击服务器管理-创建新实例应用-引导创建(推荐)

![](https://z3.ax1x.com/2021/11/13/Iyc8PJ.png)

下一步，选择上传服务端程序，然后无脑下一步即可

![](https://z3.ax1x.com/2021/11/13/IycRqf.png)

立即创建！

![](https://z3.ax1x.com/2021/11/27/oeBuWT.png)

服务器已经创建成功，到配置文件这完成最后操作

![](https://z3.ax1x.com/2021/11/27/oeB2ff.png)

可以在这里选择服务器的端口，地图种子等

比我我的端口是25565，服务器ip就是http://52.253.108.36:25565/

当然，也可以通过宝塔面板的反向代理来绑定域名，详情见图。

![](https://z3.ax1x.com/2021/11/27/oer9Kg.png)

最后开启服务器，一切大功告成，快来进服务器玩耍吧

![](https://z3.ax1x.com/2021/11/27/oesh6O.png)

**这是我的服务器 mc.xiangda.ink** 

**版本1.12.2**

**原版生存**

**欢迎大家来玩耍！**
