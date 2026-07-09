---
title: "图表与公式测试"
date: 2024-05-10
description: "演示 Blowfish 的 Chart.js 图表、Mermaid 流程图以及 KaTeX 数学公式渲染。"
summary: "用 chart 短代码画柱状图与折线图，用 mermaid 画流程图、时序图与甘特图，用 katex 渲染行内与块级公式。"
tags: ["chart", "mermaid", "katex", "测试"]
categories: ["教程"]
authors: ["arc"]
series: ["blowfish-测试"]
showTableOfContents: true
---

本文集中演示 Blowfish 的数据可视化与数学公式能力。

<!--more-->

## Chart.js 图表

Blowfish 内置 Chart.js，通过 `chart` 短代码即可使用，并自动套用 `colorScheme` 主题色。

### 柱状图

<!-- prettier-ignore-start -->
{{< chart >}}
type: 'bar',
data: {
  labels: ['一月', '二月', '三月', '四月', '五月', '六月', '七月'],
  datasets: [{
    label: '访问量',
    data: [65, 59, 80, 81, 56, 55, 40],
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(201, 203, 207, 0.2)'
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)'
    ],
    borderWidth: 1
  }]
}
{{< /chart >}}
<!-- prettier-ignore-end -->

### 折线图

<!-- prettier-ignore-start -->
{{< chart >}}
type: 'line',
data: {
  labels: ['一月', '二月', '三月', '四月', '五月', '六月', '七月'],
  datasets: [{
    label: '我的数据集',
    data: [65, 59, 80, 81, 56, 55, 40],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
}
{{< /chart >}}
<!-- prettier-ignore-end -->

### 环形图

<!-- prettier-ignore-start -->
{{< chart >}}
type: 'doughnut',
data: {
  labels: ['直接访问', '搜索引擎', '社交媒体', '其他'],
  datasets: [{
    label: '流量来源',
    data: [300, 200, 150, 80],
    backgroundColor: [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 205, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)'
    ]
  }]
}
{{< /chart >}}
<!-- prettier-ignore-end -->

## Mermaid 图表

### 流程图

{{< mermaid >}}
graph TD
A[开始] -->|获取数据| B(处理数据)
B --> C{是否成功?}
C ==>|是| D[输出结果]
C -->|否| E[记录错误]
E --> B
{{< /mermaid >}}

### 时序图

{{< mermaid >}}
sequenceDiagram
autonumber
participant Client
participant Server
participant DB
Client->>Server: GET /api/posts
Server->>DB: SELECT * FROM posts
DB-->>Server: rows
Server-->>Client: 200 OK (JSON)
{{< /mermaid >}}

### 甘特图

{{< mermaid >}}
gantt
title 项目计划
dateFormat  YYYY-MM-DD
section 设计
需求分析   :a1, 2024-05-01, 7d
原型设计   :after a1, 5d
section 开发
前端开发   :2024-05-13, 10d
后端开发   :2024-05-13, 12d
section 上线
测试与上线 :2024-05-26, 4d
{{< /mermaid >}}

### 类图

{{< mermaid >}}
classDiagram
Animal <|-- Duck
Animal <|-- Fish
Animal : +int age
Animal : +String name
Animal: +isMammal()
Duck: +swim()
Fish: +dive()
{{< /mermaid >}}

## KaTeX 数学公式

先启用 KaTeX：

{{< katex >}}

### 行内公式

行内公式用 `\(` `\)` 包裹，例如黄金分割比 \(\varphi = \dfrac{1+\sqrt5}{2}= 1.6180339887\ldots\)

### 块级公式

块级公式用 `$$` 包裹：

$$
 \varphi = 1+\frac{1} {1+\frac{1} {1+\frac{1} {1+\cdots} } }
$$

### 更多示例

欧拉公式：

$$
e^{i\pi} + 1 = 0
$$

高斯积分：

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

矩阵：

$$
\begin{bmatrix}
a & b \\
c & d
\end{bmatrix}
\begin{bmatrix}
x \\
y
\end{bmatrix}
=
\begin{bmatrix}
ax + by \\
cx + dy
\end{bmatrix}
$$
