---
title: "图库与多媒体测试"
date: 2024-06-15
description: "集中测试图片、图库、轮播、视频与截图等多媒体短代码。"
summary: "测试 figure、gallery、carousel、video、youtube、screenshot 等多媒体短代码，并展示带特性的封面图与 hero 模式。"
tags: ["多媒体", "测试", "shortcodes"]
categories: ["示例"]
authors: ["arc"]
showHero: true
heroStyle: "background"
showBreadcrumbs: true
showTableOfContents: true
---

本文测试多媒体相关短代码。本文开启了 `showHero` 并使用 `background` 风格的 hero 区域。

<!--more-->

## figure 单图

{{< figure src="https://picsum.photos/seed/mm-1/1000/500" alt="风景占位图" caption="带说明文字的图片" >}}

带链接的图片：

{{< figure src="https://picsum.photos/seed/mm-2/600/400" alt="可点击" caption="点击跳转 Hugo 官网" href="https://gohugo.io" >}}

## gallery 图库（不同列宽）

{{< gallery >}}
  <img src="https://picsum.photos/seed/gal-1/700/500" class="grid-w33" />
  <img src="https://picsum.photos/seed/gal-2/700/500" class="grid-w33" />
  <img src="https://picsum.photos/seed/gal-3/700/500" class="grid-w33" />
  <img src="https://picsum.photos/seed/gal-4/700/500" class="grid-w50" />
  <img src="https://picsum.photos/seed/gal-5/700/500" class="grid-w50" />
  <img src="https://picsum.photos/seed/gal-6/700/500" class="grid-w100" />
{{< /gallery >}}

## carousel 轮播

{{< carousel images="{https://picsum.photos/seed/car-1/900/500,https://picsum.photos/seed/car-2/900/500,https://picsum.photos/seed/car-3/900/500,https://picsum.photos/seed/car-4/900/500}" aspectRatio="16-9" interval="2500" >}}

## video 视频

{{< video src="https://www.w3schools.com/html/mov_bbb.mp4" autoplay="false" loop="false" >}}

## youtube

{{< youtube dQw4w9WgXcQ >}}

## screenshot 网页截图

{{< screenshot url="https://gohugo.io" >}}

## 小结

本文覆盖了 Blowfish 中所有多媒体相关短代码。配合 [短代码大全]({{< ref "短代码大全/index.md" >}}) 可一次性核对绝大多数短代码渲染效果。
