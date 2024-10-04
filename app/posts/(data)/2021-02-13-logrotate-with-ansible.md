---
title: 'Set up Logrotate with Ansible'
summary: 'Ansible template for logrotate, a tool to rotate server log automatically.'
createdAt: 2021-02-13 16:03:55 +0800
publishedAt: 2021-02-13
categories: [linux]
---

## TLDR

Logrotate can really come in handy when you need to manage logfiles on your Linux machine. And this tutorial shows you how to set up logrotate via [Ansible](https://www.ansible.com/).

## Example - Managing Rails Logfile with Logrotate

### Details

- Triggers hourly
- Rotate when log file is bigger than 100M
- Only keep 10 copies

### Configuring Ansible for Logrotate

- roles/logrotate/tasks/main.yml

  ```yaml
  - name: set up logrotate for rails log
    template:
      src: rails.j2
      dest: /etc/logrotate.d/rails
      owner: root
      group: root
      mode: 0644

  - name: ensure logrotate is in /etc/cron.hourly
    file:
      src: /etc/cron.daily/logrotate
      dest: /etc/cron.hourly/logrotate
      state: link
      force: yes
      mode: 0755 # the file needs to be excutable
  ```

- roles/logrotate/templates/rails.j2

  > Modify `/path/to/your/rails/log/{{ each_group.rails.env }}.log` to your logfile's path on your machine.

  ```jinja
  /path/to/your/rails/log/{{ each_group.rails.env }}.log {
      size 100M             # triggers when file is bigger than 100M
      dateext               # use date extension
      dateformat -%Y%m%d-%s # the extention format
      rotate 10             # keep 10 files
      copytruncate          # truncates the original file
      missingok             # does not throw error if the file is missing
      notifempty            # does not rotate if the file is empty
  }
  ```

### Provisioning Logrotate with Ansible

> Refer to [Executing playbooks](https://docs.ansible.com/ansible/latest/user_guide/index.html#executing-playbooks).

## Bonus

### Checking whether Logrotate can be Called by Cron

```sh
# Should print "/etc/cron.hourly/logrotate"
$ run-parts --test /etc/cron.hourly
```

### Getting File/Directory Permission Numerical Value in Linux

> I usually use sites like [Chmod Calculator](https://chmod-calculator.com/) to map values.

```sh
$ stat --format '%a' your-filename
```

### Finding out when cron.hourly Really Executes

```sh
$ cat /etc/cron.d/0hourly
```

### References

- [logrotate(8) - Linux man page](https://linux.die.net/man/8/logrotate)
- [Get the chmod numerical value for a file](https://unix.stackexchange.com/questions/46915/get-the-chmod-numerical-value-for-a-file)
