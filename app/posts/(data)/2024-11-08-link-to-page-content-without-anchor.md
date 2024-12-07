---
title: 'TIL - Link to Specific Content on a Page without An Anchor'
summary: 'Add `#:~:text=<target%20text>` at the end of URL to link to specific content on a page.'
createdAt: 2024-11-08 12:10:20 +0800
publishedAt: 2024-11-08
categories: [misc, browser]
---

Use `#:~:text=<target%20text>` (case insensitive) to highlight the text portion on a page. This is particularly useful when the text section does not have a dedicated anchor:

For example, clicking [https://chenghsuan.me/#:~:text=yes%20danny%20blogs](https://chenghsuan.me/#:~:text=yes%20danny%20blogs) yields the following:

![Page with target text highlighted](/assets/images/link-to-page-content-without-anchor/1.png)

## Refs

- [W3C - URL Fragment Text Directives](https://wicg.github.io/scroll-to-text-fragment/)
