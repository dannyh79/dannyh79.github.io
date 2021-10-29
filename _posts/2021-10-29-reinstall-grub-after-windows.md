---
layout:     post
title:      "Reinstall GRUB for Arch Linux after Windows 10"
date:       2021-10-29 23:32:07 +0800
categories: ["linux", "arch"]
comments:   true

---
> This guide is for booting from UEFI.

1. Get an USB with Arch Linux ISO flash in (I use [balena-etcher](https://www.balena.io/etcher/){:rel="nofollow noopener noreferrer" target="blank"})
2. Boot from Arch (in UEFI mode)
3. `$ fdisk -l` to find out where the Arch installation partition and EFI partition are
4. Try mount, e.g., `$ mount /dev/nvme0n1p1 /mnt` to mount **the Arch partition**, "/dev/nvmeXn1pY" or "/dev/sdXY" (substitute "X" and "Y" with your disk/partition numbers), to `/mnt`
5. Try mount, e.g., `$ mount /dev/nvme1n1p1 /boot/efi` to mount **the EFI partition**, "/dev/nvmeXn1p1" or "/dev/sdX1" (substitute "X" with your partition number), to `/boot/efi`
  > Run `$ mkdir /boot/efi`, if there is no `/boot/efi` available, then mount again.

6. `$ arch-chroot`
7. `$ grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader=arch_linux`
8. Reboot to test

## If the Entry of Windows Is not in GRUB Boot Menu
1. Run the below, then reboot to test
```sh
$ sudo os-prober
$ grub-mkconfig -o /boot/grub/grub.cfg
```

2. If the entry is still not there, `$ fdisk -l` to look for **YOUR EFI PARTITION**, "/dev/nvmeXn1p1" or "/dev/sdX1" (substitute "X" with your partition number)
3. `$ blkid /dev/nvme1n1p1` to get the `UUID` of the partition
4. `$ nano /etc/grub.d/40_custom` to manually add the entry (replace `YOUR-UUID` with the UUID got from step 3) at the end of the file
    ```
    menuentry "Windows 10" --class windows --class os {
      serach --no-floppy --set=root --fs-uuid YOUR-UUID
      chainloader ($root)/EFI/Microsoft/Boot/bootmgdw.efi
    }
    ```
5. `$ grub-mkconfig -o /boot/grub/grub.cfg` again, then reboot to test

## Refs
- [ArchLinux 2020 安裝筆記](https://pastleo.me/post/20200719-archlinux-installation){:rel="nofollow noopener noreferrer" target="blank"}
- [Add Windows 10 to GRUB OS list](https://askubuntu.com/questions/661947/add-windows-10-to-grub-os-list){:rel="nofollow noopener noreferrer" target="blank"}
