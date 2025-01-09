---
title: "TIL - Google Sheets Regex Does not Work Like Excel's"
summary: 'Google products use their own regex libray, RE2. It has no `\n` linebreak matcher support.'
createdAt: 2025-01-09 21:17:20 +0900
publishedAt: 2025-01-09
categories: [googlesheets]
---

## TLDR

- Always read the doc first
- Google products use their own regex library, RE2[^1]
- Many matchers are not supported in RE2, linebreaks, `\n`, being one of them

## Some Context

There is a project that uses Google Sheets as upstream data source, but some validation logic is required for cell values to prevent malformed data getting in from human input. One specific column that I want to treat it as multi-line for better user experience in data input, and each line has its own rule.

## How It Went

After an hour of bumping my own head against the wall for why my Excel regex would not work in Google Sheets, I finalized realized that it just simply does not support `\n` matcher.

In seconds of search, yes, there is no such thing in Google's own RE2 syntax.

## How I Got Around It

The project is still in its PoC phase. I simply broke the once multi-line column into two columns that have their own validation logic.

## Pour Closure

Yes. All me, yet again. Could have checked API doc first thing after a couple tries. A lesson learned, indeed.

[^1]: [Google's RE2 syntax doc](https://github.com/google/re2/blob/main/doc/syntax.txt)

---

## Refs

- [Google Sheets - `REGEXMATCH()` doc](https://support.google.com/docs/answer/3098292?hl=en)
- [Google's RE2 syntax doc](https://github.com/google/re2/blob/main/doc/syntax.txt)
- [Regular-Expression.info - VBScript’s Regular Expression Support](https://www.regular-expressions.info/vbscript.html)
