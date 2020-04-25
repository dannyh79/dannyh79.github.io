---
layout:     post
title:      "Run Phoenix with Postgres in Manjaro"
date:       2020-04-25 20:33:00 +0800
categories: ["elixir", "phoenix", "postgres", "manjaro"]
comments:   true

---

# Setting up Manjaro for Development
## Softwares
### postgres - pacman
- Update mirror w/ `$ sudo pacman -Syy`
> https://bbs.archlinux.org/viewtopic.php?id=141029
```md
pacman -Syuu:
-S: Sync packages
-y: refresh package database
-uu: sys upgrade all packages, repeated 'u' flag enables downgrades (from man page):

           Pass this option twice to enable package downgrades; in this case, pacman
           will select sync packages whose versions do not match with the local
           versions. This can be useful when the user switches from a testing repository
           to a stable one.

pacman -Syy:
-S: Sync packages
-yy: refresh package database, force refresh even if local database appears up-to-date
```
- Installation
> https://lobotuerto.com/blog/how-to-install-postgresql-in-manjaro-linux/#installation-process
```sh
# Install Postgre
sudo pacman -S postgresql postgis

sudo useradd postgres
sudo passwd postgres # then type "postgres"
su postgres # then enter the password

initdb --locale $LANG -E UTF8 -D '/var/lib/postgres/data/'
exit

# Now, start and enable the postgresql.service:
sudo systemctl enable --now postgresql.service``

- /var/lib/postgres/.psql_historytouch: cannot touch '/var/lib/postgres/.psql_history': Permission denied
```sh
sudo touch /var/liv/postgres/.psql_history

sudo chmod 777 /var/liv/postgres/.psql_history
```

### asdf
#### ruby 2.6.0
```sh
asdf plugin-add ruby
asdf install ruby 2.6.0
asdf global ruby 2.6.0
```

#### nodejs 10.15.3
```sh
asdf plugin-add nodejs
asdf install nodejs 10.15.3
asdf global nodejs 10.15.3
```

#### yarn 1.22.4
```sh
asdf plugin-add yarn
asdf install yarn 1.22.4
asdf global yarn 1.22.4
```

#### erlang, elixir, & phoenix
> https://lobotuerto.com/blog/how-to-install-elixir-in-manjaro-linux/
- Prerequisites
```sh
sudo pacman -S base-devel glu libpng libssh mesa ncurses unixodbc wxgtk unzip inotify-tools
```

```sh
asdf plugin-add erlang
asdf list-all erlang
asdf install erlang 22.3
asdf global erlang 22.3

asdf plugin-add elixir
asdf list-all elixir
asdf install elixir 1.10.2-otp-22
asdf global elixir 1.10.2-otp-22

mix archive.install hex phx_new 1.5.1
```
