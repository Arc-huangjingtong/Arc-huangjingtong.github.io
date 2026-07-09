---
title: "Blowfish 系列文章之一：入门"
date: 2024-06-01
description: "系列文章第一篇，介绍 Blowfish 的安装与基本概念。"
summary: "系列第一篇：安装、目录结构与基本概念。系列功能可让相关文章在侧边栏自动聚合。"
tags: ["blowfish", "系列", "入门"]
categories: ["教程"]
authors: ["arc"]
series: ["blowfish-系列"]
weight: 1
showTableOfContents: true
showBreadcrumbs: true
seriesOpened: false
---

这是「Blowfish 系列」的第一篇文章。系列文章通过 front matter 中的 `series` 字段聚合，Blowfish 会在文章页侧边展示同一系列的其他文章。

<!--more-->

## 安装

Blowfish 可作为 Hugo Module 或 git submodule 安装。本项目使用 git submodule 方式，主题位于 `themes/blowfish`。

## 目录结构

- `config/_default/`：分文件配置
- `content/zh-cn/`：中文内容
- `content/en/`：英文内容
- `assets/`：自定义资源
- `static/`：静态文件

## 下一篇

继续阅读系列的第二篇：[Blowfish 系列文章之二：配置]({{< ref "系列文章之二-配置/index.md" >}})。
