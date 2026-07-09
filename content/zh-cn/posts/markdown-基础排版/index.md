---
title: "Markdown 与基础排版测试"
date: 2024-05-01
description: "一篇覆盖标题、段落、引用、表格、代码块、列表、脚注等 Markdown 基础语法的测试文章。"
summary: "覆盖 Hugo + Blowfish 下几乎所有 Markdown 基础排版特性：六级标题、引用、表格、带高亮的代码块、有序/无序/嵌套列表、脚注、abbr/sub/sup/kbd/mark 等。"
tags: ["markdown", "测试", "基础"]
categories: ["教程"]
authors: ["arc"]
showTableOfContents: true
showBreadcrumbs: true
showReadingTime: true
showWordCount: true
showPagination: true
---

本文用于测试 Hugo + Blowfish 下的 Markdown 基础排版能力。下方依次展示各类元素。

<!--more-->

## 标题层级

下面的 `<h1>`—`<h6>` 代表六个级别的章节标题。

# 一级标题 H1

## 二级标题 H2

### 三级标题 H3

#### 四级标题 H4

##### 五级标题 H5

###### 六级标题 H6

## 段落

Xerum, quo qui aut unt expliquam qui dolut labo. Aque venitatiusda cum, voluptionse latur sitiae dolessi aut parist aut dollo enim qui voluptate ma dolestendit peritin re plis aut quas inctum laceat est volestemque commosa as cus endigna tectur.

中文段落同样可以正常渲染。Blowfish 设置了 `hasCJKLanguage = true`，因此中文字符能够被正确分词与统计字数。

## 引用

### 不带出处的引用

> 这是一段引用内容。
> **注意**：引用内部依然可以使用 _Markdown 语法_。

### 带出处的引用

> Don't communicate by sharing memory, share memory by communicating.<br>
> — <cite>Rob Pike[^1]</cite>

[^1]: 上面的引用来自 Rob Pike 在 Gopherfest 上的演讲。

## 表格

表格不是 Markdown 核心规范的一部分，但 Hugo 开箱即用地支持它。

| 姓名  | 年龄 | 职业     |
| ----- | ---- | -------- |
| Bob   | 27   | 工程师   |
| Alice | 23   | 设计师   |

### 表格内的行内 Markdown

| 斜体       | 粗体     | 代码     |
| ---------- | -------- | -------- |
| _italics_  | **bold** | `code`   |

## 代码块

### 普通代码块

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Example HTML5 Document</title>
  </head>
  <body>
    <p>Test</p>
  </body>
</html>
```

### 带标题与行高亮的代码块

```go {title="hello.go" lineNos=inline hl_lines=[3,"5-6"]}
package main

import "fmt"

func main() {
	fmt.Println("Hello, Blowfish!")
}
```

### Diff 代码块

```diff {title="patch.diff"}
- const old = "removed"
+ const new = "added"
  // unchanged line
```

## 列表

### 有序列表

1. 第一项
2. 第二项
3. 第三项

### 无序列表

- 列表项
- 另一个项
- 再一个项

### 嵌套列表

- 水果
  - 苹果
  - 橙子
  - 香蕉
- 乳制品
  - 牛奶
  - 奶酪

### 任务列表

- [x] 完成初稿
- [x] 添加代码示例
- [ ] 校对全文
- [ ] 发布上线

## 其他元素 — abbr, sub, sup, kbd, mark

<abbr title="Graphics InterChange Format">GIF</abbr> 是一种位图图像格式。

H<sub>2</sub>O 是水的化学式。

X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>

按 <kbd>CTRL</kbd>+<kbd>ALT</kbd>+<kbd>Delete</kbd> 来结束会话。

大多数 <mark>蝾螈</mark> 是夜行动物。

## 分隔线

上方内容

---

下方内容

## 链接

这是一个 [到 Hugo 官网的外部链接](https://gohugo.io)，以及一个使用 `ref` 短代码的内部链接：[图表与公式测试]({{< ref "图表与公式/index.md" >}})。

## 图片（Markdown 语法）

![示例图片](https://picsum.photos/seed/blowfish-md/800/400 "来自 picsum 的占位图")

也可以利用 Hugo 的 Markdown 属性为图片添加自定义样式：

![小尺寸图片](https://picsum.photos/seed/blowfish-md2/400/200 "宽度 50%")
{style="width:50%;"}
