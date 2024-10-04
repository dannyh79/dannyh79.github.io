---
title: 'Troubleshooting MySQL 5.7 on Arch Linux'
summary: 'My debugging journey for MySQL issues on Arch Linux.'
createdAt: 2021-11-07 07:03:33 +0800
publishedAt: 2021-11-07
categories: [mysql, linux]
---

## TLDR

- Change ownership of directory "/var/lib/mysql" to the respective owner:group, `mysql:mysql` in my case, if MySQL does not start and something like the below pops up in logs

  ```
  [Warning] Can't create file /var/lib/mysql/user.lower-test
  [ERROR] failed to set datadir to /var/lib/mysql
  ```

- Leverage option `skip-grant-tables` (with caution, if your machine is connected to the outside world) with MySQL to reset password, if you can not log into MySQL

  ```sh
  $ echo "skip-grant-tables" | sudo tee -a /etc/mysql/my.cnf
  $ sudo systemctl restart mysqld.service
  $ mysql
  ```

  ```sql
  # wanted a no-password login for root user here
  mysql> UPDATE mysql.user SET authentication_string = null WHERE User = 'root';
  ```

  ```sh
  $ sudo sed -i '/skip-grant-tables/d' /etc/mysql/my.cnf
  $ sudo systemctl restart mysqld.service
  ```

## Context

MySQL is installed from package "mysql57" via [yay](https://github.com/Jguer/yay).

## Troubleshooting

### MySQL Does not Start

1. Good ol' `ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/var/run/mysqld/mysqld.sock' (2)` printed on screen when trying to use MySQL CLI with `$ sudo mysql{:sh}`
2. It showed up dead with exit status 1 in `$ systemctl status mysqld.service{:sh}`
3. Found the below in logs with `$ journalctl -u mysqld.service{:sh}`

   ```
   [Warning] Can't create file /var/lib/mysql/user.lower-test
   [ERROR] failed to set datadir to /var/lib/mysql
   ```

4. Realized that it could be something about insufficient permission, with some [googling](https://dba.stackexchange.com/questions/106085/cant-create-file-var-lib-mysql-user-lower-test)

- It said the owner:group is `root:root` in `$ ls -al /var/lib | grep mysql{:sh}`
- Check the service file (mine was at "/usr/lib/systemd/system/mysqld.service", shown right after "Loaded: loaded" in `$ systemctl status mysqld.service{:sh}`) to see how MySQL was being started
- Turned out that it was trying to use `mysql:mysql` as the user:group to start the service

4. `$ sudo chown mysql:mysql{:sh}`
5. Showed up running after restarting MySQL with `$ sudo systemctl restart mysqld.service{:sh}`

### MySQL Does not Start

1. Failed to log in with root user, `$ sudo mysql{:sh}`
2. Appended the option `skip-grant-tables` to "/etc/mysql/my.cnf" then restart MySQL

   > Exercise this with caution. You might want to append `skip-networking` to the config file as well to cut remote connections

   ```sh
   # may use "skip-grant-tables\nskip-networking" instead to play safe here
   $ echo "skip-grant-tables" | sudo tee -a /etc/mysql/my.cnf
   $ sudo systemctl restart mysqld.service
   ```

3. Logged into MySQL to remove password

   ```sql
   mysql> UPDATE mysql.user SET authentication_string = null WHERE User = 'root';
   ```

4. Turned of the option(s) then restart MySQL again

   ```sh
   # or use regex '/^skip-grant-tables$\|%skip-networking$/d'
   $ sudo sed -i '/^skip-grant-tables$/d' /etc/mysql/my.cnf
   $ sudo systemctl restart mysqld.service
   ```

5. `$ sudo mysql{:sh}` to log in
