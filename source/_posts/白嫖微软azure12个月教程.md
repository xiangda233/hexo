---
layout: post
title: "白嫖微软Azure12个月教程"
date: 2021-10-02 21:33:52
permalink: "/2021/10/02/%e7%99%bd%e5%ab%96%e5%be%ae%e8%bd%afazure12%e4%b8%aa%e6%9c%88%e6%95%99%e7%a8%8b/"
id: "15"
tags:
  - "干货分享"
  - "微软云服务器"
  - "服务器"
categories:
  - "旧的"
---

Azure是微软提供的一个云服务平台。是全球除了AWS外最大的云服务提供商。Azure是微软除了windows之外另外一个王牌，微软错过了移动端，还好抓住了云服务。这里的Azure是Azure国际不是Azure中国哈。Azure为全球提供服务，最近Azure推出了免费试用12个月的活动（也不算最近，这个活动应该好久了，只是我最近才发现），咱赶紧去白嫖一下。

## 所需材料

一部手机，一个Microsoft账号，一张双币信用卡。

## 步骤

1.到[官网](https://azure.microsoft.com/zh-cn/free/)进行登录操作

![](https://z3.ax1x.com/2021/10/02/4bIUJO.png)

输入你的微软账号密码登录

![](https://z3.ax1x.com/2021/10/02/4bI6TP.png)

登录之后验证手机

![](https://s1.ax1x.com/2020/07/06/UCqCkQ.png)

验证信用卡

![](https://s1.ax1x.com/2020/07/06/UCqD1I.png)

信用卡[Easypay (easypayx.com)](http://easypayx.com/home)

然后就成功登录了

![](https://z3.ax1x.com/2021/10/02/4bolh8.png)

点击虚拟机进行创建虚拟机操作

进行创建服务器配置选项

![](https://z3.ax1x.com/2021/10/02/4bowNV.png)这里记得大小一定要选择b1s,才可以享受12个月免费特权。

![](https://z3.ax1x.com/2021/10/02/4bTCuj.png)

一路下来默认选项就行了到最后服务器就创建成功了

## 调整磁盘大小（必看）

 ![](https://s1.ax1x.com/2020/07/02/Nbznns.png) 磁盘默认是30G，是要收费的。接下来我们把它改成64G。 ![](https://s1.ax1x.com/2020/07/02/NbzeXj.png) 停止虚机 ![](https://s1.ax1x.com/2020/07/02/NbzuBn.png) 找到磁盘配置修改大小为64G ![](https://s1.ax1x.com/2020/07/02/NbzlNV.png) 再次回到磁盘管理界面确认依据修改为64G。

这样基本就完成了

## 端口开放

![](https://z3.ax1x.com/2021/10/02/4bHSmj.png)

到这里可以进行开发端口操作。

## 试用虚拟机

我以堡塔远程工具为例进行登录服务器操作(其实可以用Xshell 或者putty，但是懒嫌麻烦 😏 )

![](https://z3.ax1x.com/2021/10/02/4bT7GT.png)

服务器连接成功！

![](https://z3.ax1x.com/2021/10/02/4b7FQe.png)

输入相应命令即可无脑安装宝塔面板。[官方教程](https://www.bt.cn/bbs/thread-19376-1-1.html)

![](https://z3.ax1x.com/2021/10/02/4b7sm9.png)

到最后也是成功了。

> **PS:** 萌新操作，大佬勿喷！
