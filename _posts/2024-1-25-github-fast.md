---
layout: post
title: Github加速访问
date: 2024-1-25
categories: Github
tags: Github
---

****关于Android手机Github网站打不开/访问慢的解决方案****

在本地随意目录新建一个hosts2.txt文件，并输入以下内容：
```
140.82.113.3 github.com
185.199.108.133 raw.githubusercontent.com
185.199.109.133 raw.githubusercontent.com
185.199.110.133 raw.githubusercontent.com
185.199.111.133 raw.githubusercontet.com
151.101.1.194 github.global.ssl.fastly.net
151.101.65.194 github.global.ssl.fastly.net
151.101.129.194 github.global.ssl.fastly.net
151.101.193.194 github.global.ssl.fastly.net
```



******
下载安装[Hosts Go（密码0000）](https://wwp.lanzoup.com/i1MMQ1nnsx7g)并打开，把“HOSTS保护”和“DNS保护”选项都打开，点击“HOSTS设置”按钮，在新进入的页面点击右上角的三个点，选择导入HOSTS文件，点击文件选择框坐上角的“←”按钮返回上一级目录，选择你前面存放的hosts2.txt文件，选择后可以看到页面上多出了一堆项目，返回主界面，点击圆形的“启动”按钮，授权，打开[Github](https://www.github.com/)，可正常访问。
