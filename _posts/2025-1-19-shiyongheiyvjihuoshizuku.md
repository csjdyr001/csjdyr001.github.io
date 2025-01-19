---
layout: post
title: 使用黑阈激活器激活黑阈并激活Shizuku
date: 2025-1-19
categories: Android使用黑阈激活器激活Shizuku
tags: Android Shizuku 黑阈
---

**使用黑阈激活器激活黑阈并激活Shizuku**

***华为P30 鸿蒙3.0.0实测通过***

首先去网上买个黑阈激活器，如下图：
![黑阈激活器](https://gp0.saobby.com/i/smM5QRVtj8MIys6f.png)

手机开发者选项中打开【usb调试】和【仅充电允许adb调试】，然后给黑阈激活器插上电，用数据线连接你的手机，选择【仅充电】模式，这时会弹出一个【是否允许该设备调试您的手机】的对话框，点配对，然后打开黑阈即可自动激活
黑阈激活后点击侧边栏的【执行指令】输入
```bash
sh /storage/emulated/0/Android/data/moe.shizuku.privileged.api/start.sh
```
然后shizuku就正常激活了。
补充：激活器激活黑阈后也会分配一个无线端口出来。
