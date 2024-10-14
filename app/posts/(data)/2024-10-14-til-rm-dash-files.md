---
title: 'TIL - Remove (rm) Filename Starting by Dash'
summary: 'Use option `--` to stop processing flags beyond that point, for example, `rm -- -some-file`.'
createdAt: 2024-10-14 22:56:19 +0800
publishedAt: 2024-10-14
categories: [linux]
---

To delete files with names started by dash (`-{:sh}`), use option `--{:sh}` followed by filenames to stop `rm{:sh}` from processing flags beyond it:

```sh
$ rm -some-file
# rm: illegal option -- s

$ rm -- -some-file
$ rm -r -- --some-dir
```

## Refs

- [rm(1) - Linux man page](https://linux.die.net/man/1/rm)
