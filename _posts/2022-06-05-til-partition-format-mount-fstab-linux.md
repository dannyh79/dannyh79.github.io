---
layout:     post
title:      "TIL - Partitioning, Formatting, Mounting, and Generating fstab on Linux"
date:       2022-06-05 09:54:21 +0800
categories: linux
comments:   true

---
## Prereq
To avoid typo or errors, we will use `genfstab` to generate `/etc/fstab`:
```shell
# for arch-linux
sudo pacman -S --needed arch-install-scripts

# for ubuntu
sudo apt install arch-install-scripts
```

## Commands
```shell
# elevate to root where seen necessary

# outputing info about filesystems
$ lsblk -f

# DANGEROUS - DO NOT UNMOUNT ROOT DIR (/)
# unmount the device(s) if they are currently in use
# substitute MOUNTPOINT to actual value;
$ umount MOUNTPOINT

# partitioning; substitute X & Y to actual device values
$ fdisk -l # to list the drive(s)
$ fdisk /dev/sdX # or /dev/nvmeXn1
$ fdisk -l /dev/sdX # to list the partitions of the drive

# formatting; substitute X & Y to actual device values
$ mkfs.fat -F32 /dev/sdXY # or /dev/nvmeXn1pY; for EFI system
$ mkfs.ext4 /dev/sdXY # or /dev/nvmeXn1pY
$ mkfs.ntfs /dev/sdXY # or /dev/nvmeXn1pY; need package "ntfsprogs"
$ mkswap /dev/sdXY # or /dev/nvmeXn1pY; if swap is needed

# mounting
# substitute DEVICE & MOUNTPOINT to actual values;
$ mount DEVICE MOUNTPOINT
$ swapon /dev/sdXY # for swap

# (once mounting done) generating fstab
$ genfstab -U -p / | less # to check if the generated is correct
$ cp /etc/fstab /etc/fstab-old # backing up current fstab in case recovery is needed

# if the above is correct, run as root, generate fstab, then reboot
$ su
$ genfstab -U -p / > /etc/fstab
$ reboot

# if recovery is needed
$ rm /etc/fstab
$ mv /etc/fstab-old /etc/fstab
$ reboot
```

## Ref
- [Brainiarc7/fstab-generate-arch.md](https://gist.github.com/Brainiarc7/c2dfc75ce931491fe510){:rel="nofollow noopener noreferrer" target="blank"}
