---
layout:     post
title:      "Troubleshooting MySQL 5.7 on Arch Linux"
date:       2021-09-07 10:31:52 +0800
categories: ["mysql", "linux"]
comments:   true

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
1. Good ol' `ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/var/run/mysqld/mysqld.sock' (2)` printed on screen when trying to use MySQL CLI with `$ sudo mysql`
2. It showed up dead with exit status 1 in `$ systemctl status mysqld.service`
3. Found the below in logs with `$ journalctl -u mysqld.service`
    ```
    [Warning] Can't create file /var/lib/mysql/user.lower-test
    [ERROR] failed to set datadir to /var/lib/mysql
    ```
3. Realized that it could be something about insufficient permission, with some [googling](https://dba.stackexchange.com/questions/106085/cant-create-file-var-lib-mysql-user-lower-test)
  - It said the owner:group is `root:root` in `$ ls -al /var/lib | grep mysql`
  - Check the service file (mine was at "/usr/lib/systemd/system/mysqld.service", shown right after "Loaded: loaded" in `$ systemctl status mysqld.service`) to see how MySQL was being started
  - Turned out that it was trying to use `mysql:mysql` as the user:group to start the service
4. `$ sudo chown mysql:mysql`
5. Showed up running after restarting MySQL with `$ sudo systemctl restart mysqld.service`

### MySQL Does not Start
1. Failed to log in with root user, `$ sudo mysql`
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
5. `$ sudo mysql` to log in
