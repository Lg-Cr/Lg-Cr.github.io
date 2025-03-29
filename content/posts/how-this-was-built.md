+++
date = '2025-03-29T18:01:46+08:00'
draft = true
title = 'How This Was Built'
+++

+++
date = '2025-03-29T17:27:15+08:00'
draft = true
title = 'Hugo 建站记录'
+++

> Tip : 本文作者是在 archlinux 系统上构建的，如果你使用其他系统，可能需要做一些更改。

这个网站是我使用 Hugo 构建的，部署到了 Github Pages，Hugo 是一款开源静态网站生成器，它可以快速、简便地生成静态网站, Github Pages 是 Github 提供的免费静态网站托管服务，它可以让你直接将你的静态网站部署到 Github Pages。

网站的主题是基于 [PaperMod](https://github.com/adityatelange/hugo-PaperMod) 主题，它是一个简洁、轻量级的 Hugo 主题，非常戳我 XP。

# 准备工作

安装 git, go, dartsass, hugo。

这在 archlinux 上异常简单：

```Bash
sudo pacman -S git go dartsass hugo
```

以及你要拥有一个 Github 账号。（不至于这个都没有）

# 本地搭建

先找到一个你喜欢的目录，然后创建一个 `site`。

```Bash
hugo new site xxx
```

然后进入 `site` 目录，初始化 git 仓库。

```Bash
cd xxx
git init
```

然后安装主题。

```Bash
git submodule add https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
```

然后打开 `config.toml` 文件，在文件中加入以下内容：

```toml
theme = "PaperMod"
```

最后一步，运行 `hugo server` 命令，启动本地服务器。

这样你可以到提示的端口查看你的网站了，默认是 `https://localhost:1313/`。

# 本地配置

给站点添加第一页面！

```Bash
hugo new content content/posts/xxx.md
```

使用编辑器打开该文件 `content/posts/xxx.md`，编辑内容，然后保存。

值得注意的一点是 `draft` 一栏意思是草稿，默认是打开的，如果你需要发布，把它改成 `false` 即可。

或者如果你想同时也发布草稿内容，你可以在启动服务器时加入 `-D` 选项：

```Bash
hugo server -D
```

使用编辑器打开 `hugo.toml' 并在里面稍加修改。

`languageCode` 即为网站的语言，`title` 即为网站的标题，`baseurl` 即为网站的根目录，`theme` 即为网站的主题。

---

如果你想发布并不包含草稿未来或过期内容，则只需输入以下命令：

```Bash
hugo
```

# 部署到 Github Pages

## 配置 Git

配置 `name` 和 `email`：

```Bash
git config --global user.name "Your Name"
git config --global user.email "xxx@xxx.xxx"
```

这里可以随便填，不必与 github 上的一样，这只是在本地区分用户的。

## 创建仓库

登录 Github，创建一个新的仓库，名字为你的用户名.github.io，然后点击 `Create repository`。

进去之后会看到中间有一条 Quick setup 字样，点击 SSH 并复制后面一串代码形如 `git@github.com:Lg-Cr/abc.git`

然后运行：

```
git remote add origin git@github.com:Lg-Cr/abc.
```

意思是把远程仓库起个名字 origin，指向刚才创建的那个仓库。

然后运行：

```Bash
git add .
git commit -m "xxx"
git push -u origin master
```

把本地仓库推送到远程仓库。

其中 `xxx` 是你对本次提交的描述。

## 部署网站

在 Github 仓库的 Setting 中进入 Pages，将 Sources 改为 Github Actions。

创建 .github/workflows/hugo.yaml 文件，内容如下：

```yaml
# Sample workflow for building and deploying a Hugo site to GitHub Pages
name: Deploy Hugo site to Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches:
      - main

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: "pages"
  cancel-in-progress: false

# Default to bash
defaults:
  run:
    shell: bash

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    env:
      HUGO_VERSION: 0.145.0
    steps:
      - name: Install Hugo CLI
        run: |
          wget -O ${{ runner.temp }}/hugo.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb \
          && sudo dpkg -i ${{ runner.temp }}/hugo.deb
      - name: Install Dart Sass
        run: sudo snap install dart-sass
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive
          fetch-depth: 0
      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5
      - name: Install Node.js dependencies
        run: "[[ -f package-lock.json || -f npm-shrinkwrap.json ]] && npm ci || true"
      - name: Build with Hugo
        env:
          HUGO_CACHEDIR: ${{ runner.temp }}/hugo_cache
          HUGO_ENVIRONMENT: production
          TZ: America/Los_Angeles
        run: |
          hugo \
            --gc \
            --minify \
            --baseURL "${{ steps.pages.outputs.base_url }}/"
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  # Deployment job
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

Hugo 版本号根据你本地的 Hugo 版本号修改。

版本号可以通过 `hugo version` 命令查看。

然后再将仓库按照之前的步骤推送到远程仓库，如果在文件夹显示的上面看到你的头像，用户名，最新备注名的那一行打了个绿勾则说明成功了。

稍等片刻，然后打开你的网站，应该就可以看到你的网站了。

# 后记

这只是基础的建站过程，如果想要更多的了解可以看 [Hugo 的官方文档](https://gohugo.com.cn/about/)。