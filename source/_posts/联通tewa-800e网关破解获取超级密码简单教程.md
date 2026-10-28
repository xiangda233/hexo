---
layout: post
title: "联通TEWA-800E网关破解获取超级密码简单教程"
date: 2022-01-27 14:57:42
permalink: "/2022/01/27/联通tewa-800e网关破解获取超级密码简单教程/"
id: "23"
tags:
  - "中国联通"
  - "宽带"
  - "干货分享"
  - "教程"
  - "超级管理员密码"
categories:
  - "旧的"
---

## 方法一

访问网址http://192.168.1.1/backupsettings.conf输入自己家光猫的账号密码，会让下载一个文件

打开下载好的文件查找AdminPassword就看见密码了

![](https://s4.ax1x.com/2022/01/27/7Xgujg.png)

如果是这个界面就代表登录就成功了。

![](https://s4.ax1x.com/2022/01/27/7XgDER.png)

能干的事情就非常多了

## 方法二

只需要访问如下网址，注意ip替换成你的光猫：http://192.168.1.1/loginUser.htm?username=CUAdmin&password=CUAdmin

## 方法三

 1. 断开路由器的连接，电脑直连光猫。 2. 获取ip地址后，chrome打开192.168.1.1，新版本的edge也行。 3. 打开之后出现登录界面，这个界面只让输入密码，不让输入用户名，因为系统锁定了用户名，接下来我们修改掉，在这个登录界面，按F12，然后选 Elements 标签，再按Ctrl+F打开搜索，在中间的搜索框中输入user\_name，输入之后后面会显示 1of3，表示一共有3个地方，回车会跳到下一个，第三个是我们要找的，找到之后，在下一行有一个 Value="user"，双击将双引号里面的user改为 CUAdmin，注意大小写一致，前3个字母大写。修改完之后回车确认。如下图所示。 ![](https://s4.ax1x.com/2022/01/27/7XRgne.png) 4. 然后切换到Source标签，左侧点（index），右侧在412行左右，找到下图这段。复制一下。

![](https://s4.ax1x.com/2022/01/27/7XRL7j.png)

5\. 切换到Console 标签，在空白处粘贴刚才复制的内容，然后找到 下图所示的 username.value!="user"，将双引号中的user改为CUAdmin，跟刚才一样。改完之后，回车确认，会自动运行。运行之后下面有个蓝色的>。如图。

![](https://s4.ax1x.com/2022/01/27/7XRI9P.png)

6\. 然后在左侧登录的密码框中输入 CUAdmin，点击登录，如果是这个界面就代表登录就成功了。

![](https://s4.ax1x.com/2022/01/27/7XgDER.png)

## 方法四

待考察...
