---
title: Jupyter-Q&A
date: 2025-06-01 10:34:58
updated: 2025-04-25 17:30:42
categories:
  - [服务器&嵌入式平台操作, Q&A问题及解决汇总]
tags:
permalink: jupyter-q&a/
---

## 远程使用

> [!NOTE] 操作环境
> Ubuntu 20.04 LTS 服务器
### 方法一失败
来源于：[【科研利器】在服务器上也能使用jupyter？学它！-腾讯云开发者社区-腾讯云 (tencent.com)](https://cloud.tencent.com/developer/article/2135573)
```bash
jupyter notebook --no-browser
```

本地主机按Win+R，输入cmd，打开命令提示符，在其中输入：
```bash
ssh -N -L localhost:8888:localhost:8888 lijc@43.138.43.34
```

*失败！分析有两个问题：一是配置文件的问题，比如没有设置所有ip可登录；二是成教服务器是经由腾讯云服务器ssh登录的，因此这条端口转发指令只是在本地计算机上打开了腾讯云服务器上的8888端口*
### 方法二失败
来源于：[【精选】科研第二步：远程在服务器上跑程序jupyter使用_服务器使用jupyter-CSDN博客](https://blog.csdn.net/fs1341825137/article/details/109683965)
生成配置文件，并给jupyter账户设置一个密码：
```bash
jupyter notebook --generate-config
```

设置密码：
```bash
jupyter notebook password
```

打开位于.jupyter文件夹下的配置文件：
```bash
vim jupyter_notebook_config.py
```

设置远程IP可访问：
``c.NotebookApp.ip = '*'    `允许所有ip访问，很重要`
``c.NotebookApp.open_browser = False    `不打开浏览器`
``c.NotebookApp.port = 8888             `端口为8888，可以自己设置`
在本地浏览器端输入``43.138.43.34:8888``即可进入jupyter notebook
*失败！应该是没有成教服务器到腾讯云服务器的端口转发，而且因为云服务器设置的原因，公网ip不一定能直接登录*
### 方法三成功
使用VScode，下载Romote SSH插件，利用端口转发功能，可以在本地相应端口查看jupyter notebook文件。