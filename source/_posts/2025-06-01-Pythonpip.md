---
title: Python&pip
date: 2025-06-01 10:34:58
updated: 2025-07-28 13:58:04
categories:
  - [服务器&嵌入式平台操作, 基础配置]
tags:
permalink: python&pip/
---

## 安装

$Last Edited：2025.07.15/22:30$
___

> [!NOTE] 操作环境
> 香橙派4-lts Orange Pi 3.0.6 Buster with Linux 4.4.179-rk3399

参考：[Linux安装Python各个版本，这一篇就够了-CSDN博客](https://blog.csdn.net/qq_42571592/article/details/122902266)
[3.9.19 Documentation (python.org)](https://docs.python.org/zh-cn/3.9/)
[技术|如何在 Ubuntu Linux 上安装 Zlib](https://linux.cn/article-13572-1.html
[Debian 11上安装Python 3.10，并切换系统默认Python版本](https://www.cnblogs.com/STangQL/p/15647583.html)
以python3.9.19为例

### 1.安装依赖包
```bash
apt-get install zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gdbm-devel db4-devel libpcap-devel xz-devel libffi-devel
```
（没运行这个）

后面在另一块派安装的时候因为缺少`zlib`导致pip没装上[Python-Q&A#缺少zlib模块 No module named 'zlib'](Python-Q&A#缺少zlib模块 No module named 'zlib')，只能安装zlib，再把python重装一遍
```bash
sudo apt install zlib1g
sudo apt install zlib1g-dev
```
所以还是建议检查下依赖包

上面的安装依赖包指令好像不适用，可以用这个（还没试过）：
```bash
sudo apt install build-essential libssl-dev zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev libffi-dev liblzma-dev
```

### 2.下载Python安装包
我下载的是3.9.19，网站[Index of /ftp/python/3.9.19/](https://www.python.org/ftp/python/3.9.19/)
复制里面.tgz文件的下载链接：
```bash
wget https://www.python.org/ftp/python/3.9.19/Python-3.9.19.tgz
```
在当前目录下载这个安装文件。
### 3.解压
```bash
tar -zxvf Python-3.9.19.tgz
```
### 4.安装
进入解压后的文件目录：
```bash
cd Python-3.9.19
```

配置路径：
```bash
./configure --prefix=/usr/local --enable-optimizations
```

编译与安装
```bash
make altinstall
```

一般编译安装时间比较长，大概十分钟（如果短可能是出问题了），成功后最终显示的信息如下
```text
Successfully installed pip-23.0.1 setuptools-58.1.0
```

如果安装失败，会出现类似
```text
make: *** [Makefile:1265: install] Error 1
```
的错误提示，说明pip没安装，这可能是由于部分依赖包的缺失造成的，如`zlib`。

### 5.建立软连接
确认一下系统默认的python和pip版本
```bash
ls -l /usr/bin/python* /usr/bin/pip*
# 或者下面这个
readlink -f /usr/bin/python 
```

如果软连接已经存在，先删除之前的软连接：
```bash
ls -l link_name # 检查软连接指向/权限
unlink link_name
```
`link_name`为软链接路径

软连接指令：
```bash
ln -s /usr/local/bin/python3.9 /usr/bin/python
ln -s /usr/local/bin/pip3.9 /usr/bin/pip
```
也可以`-sf`选项强制替换，这样就不用删除之前的

有多个版本的Python，想切换Python版本时也是这个操作。

### 6.切换python版本
添加替代版本列表：
```bash
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.7 2
sudo update-alternatives --install /usr/bin/python3 python3 /usr/local/bin/python3.9 1
```

进行版本切换：
```bash
update-alternatives --config python3
```
输入前面的序号，回车< Enter >选择

## 创建虚拟环境

> [!NOTE] 操作环境
> 香橙派4-lts Orange Pi 3.0.6 Bullseye with Linux 5.10.160-rk3399

### 1.使用标准库内置的venv模块
创建虚拟环境：
```bash
python -m venv myenv
```

激活虚拟环境：
```bash
source /root/myenv/bin/activate
```

退出环境：
```bash
deactivate
```

删除环境：
删除整个环境的安装目录即可
### 2.使用conda
具体见[Conda#虚拟环境](Conda#虚拟环境)

## 卸载

## 包管理器pip的使用
1. 升级pip
```bash
python -m pip install --upgrade pip
```

## 项目的构建和管理
### 1.查看项目的依赖文件
大多数 Python 项目会通过文件显式声明依赖项：

- **`requirements.txt`**：最常见格式，可通过 `pip install -r requirements.txt` 安装依赖。
```bash
pip install -r requirements.txt
```
    
- **`setup.py`**：使用 `setup.py install` 或 `pip install .` 安装依赖。
```bash
pip install .
```
    
- **`Pipfile` / `Pipfile.lock`**：用于 `pipenv` 管理的项目。
```bash
pipenv install
```
    
- **`poetry.lock` / `pyproject.toml`**：用于 `poetry` 管理的项目。
```bash
poetry install
```

### 2.使用工具扫描代码中的导入语句
如果项目没有明确的依赖文件，可以通过分析代码中的 `import` 语句推断依赖库：

**工具推荐：**
- **`pipreqs`**：扫描项目目录中的 `.py` 文件，自动生成 `requirements.txt`。
```bash
pip install pipreqs 
pipreqs /path/to/project
```

输出示例：
```text
Flask==2.0.1 requests==2.26.0
```

- **`pyroma`**：检查项目结构并推荐依赖。
```bash
pip install pyroma pyroma /path/to/project
```

- **`pydeps`**：生成依赖图（适合小型项目）。
```bash
pip install pydeps pydeps your_project_name
```

## 安装Github上的仓库
以vot-toolkit为例，这是vot测试官方的工具包，每年都有比赛，维护的应该不错。找到了以下几种安装方法
### 1.直接pip安装
```powershell
pip install git+https://github.com/votchallenge/vot-toolkit-python
```
但是可能容易出网络问题

### 2.使用 SSH 协议安装
```powershell
pip install git+ssh://git@github.com/votchallenge/vot-toolkit-python.git
```
_注意：需要设置 [SSH 密钥](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)_

### 3.手动克隆后安装
```powershell
# 1. 手动克隆仓库
git clone https://github.com/votchallenge/vot-toolkit-python
# 2. 进入目录
cd vot-toolkit-python
# 3. 从本地安装
pip install .
```

当执行`pip install .`时，pip 在当前目录查找 `setup.py` 或 `pyproject.toml` 文件，所以上述方法对于直接下载zip文件然后解压，再安装也适用。

与其他安装方式的对比

| 安装方式            | 命令                            | 适用场景    | 特点              |
| --------------- | ----------------------------- | ------- | --------------- |
| **从本地源码安装**     | `pip install .`               | 开发自己的包  | 安装当前目录的包        |
| **可编辑模式**       | `pip install -e .`            | 包开发阶段   | 创建符号链接，修改代码实时生效 |
| **从 PyPI 安装**   | `pip install package_name`    | 安装公共包   | 从官方仓库下载预编译包     |
| **从 GitHub 安装** | `pip install git+https://...` | 安装最新开发版 | 直接从版本控制安装       |