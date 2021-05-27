---
layout:     post
title:      "\"I (Just Started to) Use Arch BTW\""
date:       2021-05-20 01:39:22 +0800
categories: linux
comments:   true

---
## TLDR

## How I Did It
- Pastleo's & Arch Linux's installation guide

### Set up Env
- Pastleo's note for installing yay & Chinese keyboard

```sh
$ github.com/jguer/yay
```

- Locale
```sh
$ vim /etc/locale.gen

# uncomment
en_US.UTF-8
lzh_TW.UTF-8

$ locale-gen
$ localectl set-locale LANG=en_US.UTF-8
```

- File manager
```sh
$ pacman -S dolphin
```

- Shell
```sh
$ pacman -S zsh
$ chsh -s $(which zsh)
```

- ASDF
```sh
ruby 2.6.7

# https://github.com/asdf-vm/asdf-erlang#before-asdf-install
erlang 24.0.1

elixir 1.12.0-otp-24
node lts
$ npm install -g yarn
```

- Packages
```
# TODO: yay

# TODO: zsh 有問題
# snap
$ yay -S snapd
$ sudo systmctl enable --now snapd.socket
$ sudo ln -s /var/lib/snapd/snap /snap

# TODO: gdrive
```


## References
- [ArchLinux 2020 安裝筆記](https://pastleo.me/post/20200719-archlinux-installation){:rel="nofollow noopener noreferrer" target="blank"}
- [Installation guide](https://wiki.archlinux.org/title/installation_guide){:rel="nofollow noopener noreferrer" target="blank"}
