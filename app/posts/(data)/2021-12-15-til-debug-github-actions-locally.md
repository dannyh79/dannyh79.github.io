---
title: 'TIL - Debug GitHub Actions Locally'
createdAt: 2021-12-15 10:23:13 +0800
publishedAt: 2021-12-15
categories: [github, ci]
---

The tool, [nektos/act](https://github.com/nektos/act), allows one to debug GitHub Actions on their local machine:

```shell
# Ref: https://github.com/nektos/act#example-commands

# Installation; mac
$ brew install act

# Installation; arch
$ yay -S act

# Installation; bash script
$ curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash

# List actions for the event; defaults to "on: push"
$ act [<event>] [options]

# List actions; lists default event when event arg is omitted
$ act some_event -l

# Run in dry-run mode
$ act -n

# Run a specific job
$ act -j some_job

# Run a specific event; runs default event when event arg is omitted
$ act some_event
```
