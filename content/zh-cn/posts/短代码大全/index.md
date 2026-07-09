---
title: "Blowfish 短代码大全"
date: 2024-05-05
description: "集中演示 Blowfish 提供的各类短代码：alert、badge、button、icon、figure、gallery、carousel、timeline、tabs、accordion、chart、mermaid、katex、typeit、swatches、keyword、lead 等。"
summary: "一篇就够：把 Blowfish 自带短代码几乎全部用一遍，方便逐项核对渲染效果。"
tags: ["shortcodes", "测试", "blowfish"]
categories: ["教程"]
authors: ["arc"]
series: ["blowfish-测试"]
showTableOfContents: true
showBreadcrumbs: true
showRelatedContent: true
relatedContentLimit: 3
showTaxonomies: true
---

本文把 Blowfish 自带的短代码集中演示一遍，方便核对渲染效果。

<!--more-->

## alert 提示框

{{< alert >}}
**默认提示**：这是一个普通的 alert 短代码。
{{< /alert >}}

{{< alert "warning" >}}
**警告**：这是一个带 warning 主题的提示框。
{{< /alert >}}

{{< alert icon="fire" cardColor="#ffeedd" iconColor="#e63946" textColor="#7a1f1f" >}}
**自定义样式**：可以自定义图标、卡片颜色、图标颜色与文字颜色。
{{< /alert >}}

## badge 徽章

{{< badge >}}默认徽章{{< /badge >}}
{{< badge color="blue" >}}蓝色徽章{{< /badge >}}
{{< badge color="fuchsia" text="粉色文字" >}}自定义徽章{{< /badge >}}

## button 按钮

{{< button href="https://gohugo.io" target="_blank" >}}访问 Hugo{{< /button >}}
{{< button href="https://blowfish.page" target="_blank" color="blue" icon="github" >}}Blowfish 官网{{< /button >}}

## icon 图标

Blowfish 内置 FontAwesome 6 图标，可通过 `icon` 短代码引入：

{{< icon "fire" >}} {{< icon "github" >}} {{< icon "heart" >}} {{< icon "docker" >}}

也可以在文本中混排：部署到 {{< icon "cloud" >}} 服务器，代码托管在 {{< icon "github" >}} GitHub。

## lead 引导文字

{{< lead >}}
这是一段引导文字（lead），字号比正文更大，常用于文章开头的摘要性陈述。
{{< /lead >}}

## figure 图片

{{< figure src="https://picsum.photos/seed/blowfish-fig/900/500" alt="占位图" caption="一张来自 picsum 的占位图，点击可放大" captionPosition="below" captionStyle="fig-caption" >}}

## gallery 图库

gallery 支持多张图片，可来自远程地址：

{{< gallery >}}
  <img src="https://picsum.photos/seed/g1/600/400" class="grid-w50" />
  <img src="https://picsum.photos/seed/g2/600/400" class="grid-w50" />
  <img src="https://picsum.photos/seed/g3/600/400" class="grid-w50" />
  <img src="https://picsum.photos/seed/g4/600/400" class="grid-w50" />
{{< /gallery >}}

## carousel 轮播

{{< carousel images="{https://picsum.photos/seed/c1/800/500,https://picsum.photos/seed/c2/800/500,https://picsum.photos/seed/c3/800/500}" aspectRatio="16-9" interval="3000" >}}

## timeline 时间线

{{< timeline >}}

{{< timelineItem icon="github" header="2024-01" >}}
项目初始化，基于 Hugo + Blowfish 搭建。
{{< /timelineItem >}}

{{< timelineItem icon="code" header="2024-03" >}}
完成主题配置与多语言设置。
{{< /timelineItem >}}

{{< timelineItem icon="star" header="2024-05" >}}
正式上线，发布首批文章。
{{< /timelineItem >}}

{{< /timeline >}}

## tabs 选项卡

{{< tabs "tab-group-1" >}}

{{< tab "Go" >}}
```go
package main
import "fmt"
func main() { fmt.Println("Hello from Go") }
```
{{< /tab >}}

{{< tab "Python" >}}
```python
print("Hello from Python")
```
{{< /tab >}}

{{< tab "Rust" >}}
```rust
fn main() { println!("Hello from Rust"); }
```
{{< /tab >}}

{{< /tabs >}}

## accordion 折叠面板

{{< accordion >}}

{{< accordionItem header="什么是 Blowfish？" >}}
Blowfish 是一个为 Hugo 设计的、功能丰富的轻量级主题。
{{< /accordionItem >}}

{{< accordionItem header="它支持深色模式吗？" >}}
支持，并且可以跟随系统自动切换。
{{< /accordionItem >}}

{{< /accordion >}}

## typeit 打字机效果

{{< typeit >}}
这段文字会以打字机效果逐字出现。
{{< /typeit >}}

{{< typeit tag=h4 speed=50 life=8 >}}
带速度与生命周期的打字机效果。
{{< /typeit >}}

## swatches 色板

{{< swatches colors="#e63946,#f1faee,#a8dadc,#457b9d,#1d3557" >}}

## keyword & keywordList 关键词

{{< keyword >}}
Hugo
{{< /keyword >}} 是一个用 Go 编写的静态站点生成器。

常用关键词列表：

{{< keywordList >}}
{{< keyword icon="github" >}}Blowfish{{< /keyword >}}
{{< keyword icon="fire" >}}Hugo{{< /keyword >}}
{{< keyword icon="rocket" >}}Tailwind{{< /keyword >}}
{{< /keywordList >}}

## 视频与外链嵌入

### YouTube（内置 youtube 短代码）

{{< youtube ZJthWmvUzzc >}}

### youtubeLite 轻量嵌入

{{< youtubeLite id="ZJthWmvUzzc" label="Blowfish 介绍" >}}

### video 本地/远程视频

{{< video src="https://www.w3schools.com/html/mov_bbb.mp4" autoplay="false" >}}

### GitHub 仓库卡片

{{< github repo="nunocoracao/blowfish" >}}

### Gist

{{< gist nunocoracao 2779792841f7ffa7c7e62dc4d38626d4 >}}

### screenshot 网页截图

{{< screenshot url="https://blowfish.page" >}}

## icon 引用（图标参考）

更多图标可在 Blowfish 文档的图标参考页查询，本文仅展示几个常用图标：{{< icon "code" >}} {{< icon "bug" >}} {{< icon "docker" >}} {{< icon "pencil" >}}。

## 小结

上方依次演示了 alert、badge、button、icon、lead、figure、gallery、carousel、timeline、tabs、accordion、typeit、swatches、keyword/keywordList、youtube、youtubeLite、video、github、gist、screenshot 等短代码。图表与流程图相关短代码（chart、mermaid、katex）见 [图表与公式测试]({{< ref "图表与公式/index.md" >}})。
