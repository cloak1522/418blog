---
title: Python包管理器pip-Q&A
date: 2025-06-01 10:34:58
updated: 2025-09-04 19:15:51
categories:
  - [服务器&嵌入式平台操作, Q&A问题及解决汇总]
tags:
permalink: python包管理器pip-q&a/
---

## pip下载时报错cannot import name 'html5lib' from（升级pip）
> [!NOTE] 操作环境
> Ubuntu-22.04.3 server 树莓派4

参考：[导入错误：无法从 pip._vendor 导入名称“html5lib” – 码微 (mwell.tech)](https://mwell.tech/archives/6403)
[Ubuntu 20.04 Python 3.10 pip import error - 问 Ubuntu (askubuntu.com)](https://askubuntu.com/questions/1372119/ubuntu-20-04-python-3-10-pip-import-error/1375863)
[Python3.10版本使用pip显示ImportError: cannot import name 'html5lib' from 'pip._vendor'问题 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/664770225)

错误常发生在python3.10的Ubuntu系统上。
```bash
ImportError: cannot import name 'html5lib' from 'pip._vendor' (/usr/lib/python3.10/dist-packages/pip/_vendor/__init__.py)
```

可以尝试使用下面四个指令升级pip：
```bash
curl -sS https://bootstrap.pypa.io/get-pip.py | python3.10
curl -sS https://bootstrap.pypa.io/get-pip.py | sudo python3.10

curl -sS https://bootstrap.pypa.io/get-pip.py | python3
curl -sS https://bootstrap.pypa.io/get-pip.py | sudo python3
```
这几句指令都是先下载脚本再运行脚本，运行脚本也是从脚本里的网址下载。如果失败可以分成两步执行，都使用网络代理下载。
```bash
https_proxy=http://127.0.0.1:7890 curl -sSL https://bootstrap.pypa.io/get-pip.py
https_proxy=http://127.0.0.1:7890 python3.10 get-pip.py
```

## pip下载时报错 error: subprocess-exited-with-error
#### 1.可能是版本问题，升级。
```bash
pip install --upgrade pip
pip install --upgrade setuptools
```
#### 2.软件包本身的问题
一般会显示note: This is an issue with the package mentioned above, not pip.
安装multiprocess库的时候出现过一次，正确安装指令是：
```bash
pip install multiprocess
```
我错打成了：
```bash
pip insatll multiprocessing
```

## matplotlib和numpy的错误：进程已结束，退出代码为 -1066598274 (0xC06D007E)
版本不匹配、文件缺失等导致的，重装几次、安装指定版本等都没解决。
重装的时候把缓存清理以下就好了：
```
pip uninstall -y numpy 
conda remove numpy --force
pip cache purge
```

查看matplotlib与python、numpy的版本依赖关系：[Dependency version policy — Matplotlib 3.11.0.dev1298+g9b4233b22 documentation](https://matplotlib.org/devdocs/devel/min_dep_policy.html)