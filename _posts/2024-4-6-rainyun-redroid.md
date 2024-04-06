---
layout: post
title: 在雨云上搭建自己的私有云手机
date: 2024-4-6
categories: redroid
tags: redroid
---

# 在雨云上搭建自己的私有云手机
# 目录
- [〇、前言](#〇、前言)
- [一、准备](#一、准备)
- [二、部署云手机](#二、部署云手机)
## 〇、前言
云手机可以通过docker-android或redroid搭建，docker-android请见[lraven的这篇文章](https://blog.lraven.tech/archives/149/)，但是我实测后发现有bug，一直BOOTING，日志显示
```
2024-04-02 15:02:59.408 INFO gave up: log_web_shared entered FATAL state. too many start retries too quickly
```
所以这篇文章讲redroid搭建云手机
## 一、准备
首先注册一个[雨云账号](https://app.rainyun.com/auth/reg)，注册账号后绑定微信，即可获得新人折扣

登录后点击“云服务器”，进去后点“+购买云服务器”，区域配置自己选，我选的【香港2区云服务器】【G6
  Xeon® Gold - KVM 标配版】，套餐选KVM标配版，操作系统选“Ubuntu 20.04”，无预安装APP

公网IP建议选“NAT共享IP模式”，更便宜，然后点立即购买
## 二、部署云手机
接下来打开[https://app.rainyun.com/apps/rcs/list](https://app.rainyun.com/apps/rcs/list)进入“我的云服务器”界面，如果你的服务器旁边显示的状态为“创建中”，请先稍作等待，然后点击“管理”，在新打开的页面下滑找到“服务器信息”的“远程连接”一栏，然后复制远程密码备用

接下来点击“远程连接(VNC)”再点“Xtermjs 模式”，进入VNC控制台，首次进入VNC需要输入用户名（就是root）和你的远程密码，然后安装docker，输入
```bash
echo "deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-updates main restricted universe multiverse
deb https://mirrors.tuna.tsinghua.edu.cn/ubuntu/ focal-backports main restricted universe multiverse
deb http://security.ubuntu.com/ubuntu/ focal-security main restricted universe multiverse" | tee /etc/apt/sources.list

sudo apt update && sudo apt upgrade

# 如果有证书错误就执行 apt install ca-certificates -y

sudo apt install docker.io docker -y

docker version #不报错则为成功安装docker
```
接下来按照redroid官方文档进行操作即可：
```bash
apt install linux-modules-extra-`uname -r`
modprobe binder_linux devices="binder,hwbinder,vndbinder"
modprobe ashmem_linux

docker run -itd --rm --privileged \
--name=redroid \
--pull always \
-v ~/data:/data \
-p 5555:5555 \
redroid/redroid:11.0.0-latest
```
等待一会儿下载完成…
要想让云手机随时随地都能访问，不难想到就是直接将redroid进行web化
```bash
docker run --rm -itd --privileged -v /root/scrcpy-web/data:/data --name scrcpy-web -p 8090:8000/tcp --link redroid:howie_phone emptysuns/scrcpy-web:v0.1

# 连接前面部署的云手机
docker exec -it scrcpy-web adb connect howie_phone:5555
```
此时手机已经启动，但是为了能够访问，我们需要配置一下网络
回到雨云控制面板，点击关机下面一栏的“NAT端口映射”，点“+ 新建规则”，协议选TCP+UDP，内网端口如果想要web访问就填8090，如果要adb连接就填5555，外网端口随便，点“创建映射规则”
然后访问：ip:8090，点击 H264 Converter 就能在浏览器里面操作云手机了（android貌似不支持在浏览器里操作云手机，所以android端建议用甲壳虫ADB助手连接）。