---
layout: post
title: "原神机器人Yunzai Bot搭建"
date: 2022-05-08 21:18:58
permalink: "/2022/05/08/%e5%8e%9f%e7%a5%9e%e6%9c%ba%e5%99%a8%e4%ba%bayunzai-bot%e6%90%ad%e5%bb%ba/"
id: "37"
tags: []
categories:
  - "旧的"
---

1.安装环境 （1）首先，你需要一台电脑或者VPS云服务器 （2）安装云崽运行环境 云崽机器人 Le-niao Github 项目地址：https://github.com/Le-niao/Yunzai-Bot

云崽机器人V2版本：https://gitee.com/yoimiya-kokomi/Yunzai-Bot

运行环境 1.安装Git https://git-scm.com/ 2.安装Node.js http://nodejs.cn/download/ 3.安装Redis https://github.com/tporadowski/redis/releases

2.部署机器人

（1）打开Redis-server程序，最小化放在后台 （2）新建一个文件夹，命名为Yunzai，打开这个文件夹，鼠标右键点击Get Bash Here，在命令提示框中输入如下内容： git clone https://gitee.com/yoimiya-kokomi/Yunzai-Bot.git (3)完成后关闭命令提示框，会看到一个名为YunzaiBot的文件夹，点击进去，在这个文件夹下再次右键调用Get Bash Here，输入以下内容： npm install -g cnpm --registry=https://registry.npmmirror.com cnpm install (4)输入node app回车看到提示输入QQ号说明成功。 node app (5)在命令框提示下输入准备好的QQ小号，密码（扫码登陆也行，密码空着就行），登录设备最好选1。 点击米游社进入官网，登录你的米游社账号，按F12进入开发人员选项，点击控制台，输入以下内容回车：

document.cookie 将得到的cookie输入命令提示框中，按提示输入后续内容。 至此，我们的云崽机器人就算是部署完成了，回到QQ私聊小号进行测试即可

3.安装插件 云崽插件大全： https://gitee.com/Hikari666/Yunzai-Bot-plugins-index B站大佬视频教程链接

[在 B 站观看视频](https://www.bilibili.com/video/BV1pY4y1P7WX)
