---
title: 'TIL - Fix PC Bluetooth with a Cold Reboot'
createdAt: 2023-08-23 16:24:25 +0800
publishedAt: 2023-08-23
categories: [linux, windows]
---

## TLDR

If Bluetooth is down for reason unknown, try cold reboot. It might just do magic to it.

## Context

- PC on GIGABYTE B550I AORUS PRO AX motherboard
- Bluetooth is down for no reason
  - Bluetooth from KDE (the desktop environment of my PC) System Settings showed `No Bluetooth adapters found`
  - Logs showed `Bluetooth service was skipped because of an unmet condition check`
    1. `$ systemctl status bluetooth.service{:sh}` showed the service is dead
    2. `$ journalctl -u bluetooth.service{:sh}` showed such; supposed to be `Starting Bluetooth service...` after boot

## Steps to Cold Reboot

> Credit: [r/JETRUG](https://www.reddit.com/r/ASUS/comments/he7ci7/comment/g1przej/?context=3)

1. Turn off the PC
2. Unplug power cable to PSU
3. Hold power button for 30 seconds
4. Plug power back into PSU
5. Boot PC

## Reasoning

Dunno, but looks like this is something from the hardware side.

## Refs

- [\[SOLVED\] Condition check resulted in Bluetooth service being skipped.](https://bbs.archlinux.org/viewtopic.php?id=258750)
- [\[SUPPORT\] B550 motherboard, no Bluetooth on a Windows 10](https://www.reddit.com/r/ASUS/comments/he7ci7/comment/g1przej/?context=3)
