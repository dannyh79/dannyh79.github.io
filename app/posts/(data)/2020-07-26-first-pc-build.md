---
title: 'My First P.C. Build - Ghost S1'
summary: 'Walk through how I built my P.C., from 0 to 1.'
createdAt: 2020-07-26 15:49:07 +0800
publishedAt: 2020-07-26
categories: [pc, windows, linux]
---

<Image src="/assets/images/first-pc-build/01.jpg" alt="Cover photo" isFirst width={800} height={600} />

<Figcaption>
    Parts used for this build
</Figcaption>

## Table of Contents

- Knowing what You Want
- Getting Started
- Issues I Ran Into
- Pour Closure

## Knowing what You Want

The most important part of building a P.C. is knowing what you want to do with it. It took me probably 3 months to make up my mind and figure out what I want:

1. I want a small computer that I can
2. Try to use Linux as my daily driver; while
3. Gaming a bit with friends (Yes, I love FPS!)

### Learning to Read the Spec

Big shout-out to [Pastleo](https://pastleo.me/). Invaluable advice about hardware was given over countless daily conversations. He was the one that made me believe that even I, a newbie like me, can make my own build.

Aside from that, a dedicated section in blog [歐飛先生 (ofeyhong)](https://ofeyhong.pixnet.net/blog/post/59877783) helped me with deciding the spec I want, too.

### Details of My Build

| Type            | Item                                                                                                                                                          | Note                                                |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Case            | Ghost S1 (Replica)                                                                                                                                            | Bought it with a tophat; acquired on Taobao         |
| Power Cables    | Some random custom Power Cables                                                                                                                               | Acquired on Taobao                                  |
| CPU             | [AMD Ryzen R5 3600](https://www.amd.com/en/products/cpu/amd-ryzen-5-3600)                                                                                     |                                                     |
| CPU Fan         | [Scythe JITTE JT8039](http://www.scythe-cn.com/product/cooler/sc-jt8039-p.html)                                                                               | Seems to be only available in China                 |
| Motherboard     | [Gigabyte B550I AORUS PRO AX](https://www.gigabyte.com/Motherboard/B550I-AORUS-PRO-AX-rev-10#kf)                                                              | Has 2 M.2 connectors                                |
| Storage         | [Corsair Force Series MP510 M.2 SSD](https://www.corsair.com/us/en/Categories/Products/Storage/M-2-SSDs/Force-Series-MP510/p/CSSD-F960GBMP510B)               | 960GB                                               |
| Storage         | [GIGABYTE M.2 PCIe SSD](https://www.gigabyte.com/Solid-State-Drive/GIGABYTE-M2-PCIe-SSD-256GB)                                                                | 256GB; Came with the promo of Gigabyte's B550I mobo |
| RAM             | [Corsair Vengeance LPX 32GB (2 x 16GB) DDR4](https://www.corsair.com/us/en/Categories/Products/Memory/VENGEANCE-LPX/p/CMK32GX4M2D3600C18)                     | DRAM 3600MHz C18                                    |
| GPU             | [Gigabyte Radeon RX 5600 XT Windforce OC 6G](https://www.gigabyte.com/Graphics-Card/GV-R56XTWF2OC-6GD)                                                        |                                                     |
| PSU             | [Corsair SF600 SFX Gold](https://www.corsair.com/us/en/Categories/Products/Power-Supply-Units/SF-Series%E2%84%A2-80-PLUS-Gold-Power-Supplies/p/CP-9020105-NA) |                                                     |
| Bottom Case Fan | [Scythe Kaze Flex 120 Slim RGB](http://www.scythe-eu.com/en/products/fans/kaze-flex-120-rgb-pwm.html)                                                         | 120mm 1800RPM PWM                                   |

## Getting Started

> Once the spec is set, building a computer should be easy, they say.

### Ordering Parts

A no-brainer for me: [原價屋](http://www.coolpc.com.tw/evaluate.php), a one-stop online PC parts store, has almost everything I need for the build. As for the rest of the more special parts, they can all be ordered from Taobao.

One thing that I did not know, though, was that small form factor cases, such as the Ghost S1, are made in small batches. And it took me about a whole month just to get this case done (pun intended).

After the "case", it still took me about another month to get the motherboard in hand. At first, the build was on ASUS's [ROG STRIX B450I](https://www.asus.com/Motherboards/ROG-STRIX-B450-I-GAMING/). By the time the case came, around mid-May, the mobo was taken out on 原價屋's site. After giving X570 mobos and other options some serious thoughts, I thought out that a B550 board would a better fit for me, in terms of price and feature. So I waited, patiently....

### Testing Parts

Rather than just putting all things together, cranking up the P.C., and hoping things work, parts must be tested, if possible, individually. [The tutorial](https://youtu.be/9206E_rOduU) by [JayzTwoCents](https://www.youtube.com/channel/UCkWQ0gDrqOCarmUKmppD7GQ) showed me, a first-time builder, how new parts are supposed to be tested.

<div className="grid grid-cols-2 items-center gap-2">
  <Image
    src="/assets/images/first-pc-build/02.jpg"
    alt="CPU, RAM, and SSD on motherboard"
    title="CPU, RAM, and SSD on motherboard"
    width={300}
    height={400}
  />
  <Image
    src="/assets/images/first-pc-build/03.jpg"
    alt="CPU fan"
    title="CPU fan"
    width={300}
    height={400}
  />
  <Image
    src="/assets/images/first-pc-build/04.jpg"
    alt="Back of CPU fan with bracket"
    title="Back of CPU fan with bracket"
    width={300}
    height={400}
  />
  <Image
    src="/assets/images/first-pc-build/05.jpg"
    alt="CPU fan & GPU on motherboard"
    title="CPU fan and GPU assembled onto motherboard"
    width={300}
    height={400}
  />
  <Image
    src="/assets/images/first-pc-build/06.jpg"
    alt="Connecting power to PSU"
    title="Connecting power to PSU"
    width={300}
    height={400}
  />
  <Image
    src="/assets/images/first-pc-build/09.jpg"
    alt="Connecting power to PSU"
    title="Connecting power to PSU"
    width={400}
    height={300}
  />
  <Image
    src="/assets/images/first-pc-build/10.jpg"
    alt="Computer powers on"
    title="Yes! It runs!"
    width={400}
    height={300}
  />
  <Image
    src="/assets/images/first-pc-build/12.jpg"
    alt="Putting another M.2 SSD onto motherboard"
    title="Putting another M.2 SSD onto motherboard"
    width={300}
    height={400}
  />
  <Image
    src="/assets/images/first-pc-build/17.jpg"
    alt="Setting up Windows 10"
    title="Setting up Windows 10"
    width={400}
    height={300}
  />
  <Image
    src="/assets/images/first-pc-build/18.jpg"
    alt="Trying to download games"
    title="Trying to download some games"
    width={300}
    height={400}
  />
</div>

## Issues I Ran into

> Life is no bed of roses, so is building a computer this small.

Gotta admit that the problems I bumped into while making the build are really a pain, after a long 3 months of waiting. It almost broke me, were not Pastleo and the seller of Ghost S1 on Taobao <del>, and Google</del> being super helpful.

### "Dead GPU PCIe Extension Cord?"

Tries after tries, I just could not get GPU to work on PCIe extension cord. I had to use my PC without the case, because Ghost S1 will not fit without the extension cord....

<div className="grid grid-cols-2 items-center gap-2">
  <Image
    src="/assets/images/first-pc-build/27.jpg"
    alt="Testing PCIe extension cord for GPU"
    title="Testing PCIe extension cord"
    width={300}
    height={400}
  />
  <Image
    src="/assets/images/first-pc-build/26.jpg"
    alt="GPU does not work on extension cord"
    title="GPU just did not work on extension cord"
    width={300}
    height={400}
  />
  <Image
    src="/assets/images/first-pc-build/28.jpg"
    alt="Powering P.C. on without a case"
    title="Powering P.C. on without a case works"
    width={400}
    height={300}
  />
  <Image
    src="/assets/images/first-pc-build/29.jpg"
    alt="Using P.C. without a case"
    title={`"OK I give up. Guess I'll just use my P.C. like this then"`}
    width={400}
    height={300}
  />
</div>

Before sending the cord back to China and asking for a new one, the seller relayed the message from the manufacturer that maybe I overlooked the BIOS setting. It turned out that the extension cord does not support PCIE 4.0 protocol. Setting the protocol to PCIe Gen3 solved the problem for me.

### "I Broke my CPU Fan"

Lesson learned - never touch anything while the P.C. is still running.

The cables did not really fit when I wanted to put the side panel of the case back in. Just when I tried to stuck the cables closer to motherboard, I felt excruciating pain came from my left ring finger. Immediately, I pulled my hand out, and saw a blade of the CPU fan stuck in my finger....

<div className="flex justify-center">
  <Image
    src="/assets/images/first-pc-build/30.jpg"
    alt="Broken CPU fan"
    title="Broken CPU fan"
    width={300}
    height={400}
  />
</div>

### "My Computer Crashes All the Time"

Just as I could not get my head around on why my build gets random power-off crashes whenever I was running something heavy on Windows 10, Pastleo told me maybe I should install a system monitoring tool and check for the thermal.

Since I do not have hardware benchmark tool, all I could do is doing some cross-testing, a.k.a. playing video games, without the lid and side panels of the case on. And it was indeed the thermal issue that caused the computer to turn off itself.

For now, I run my build without panels and lid on when I figure it might probably gets too hot <del>(due to laziness and lack of motivation to tweak my build)</del>.

## Pour Closure

Building a computer without any prior knowledge is not always a smooth sail, and can be hard at times. Yet, one thing is for sure that nothing compares to the sense of achievement when you see your first-ever build boots up. ;)

<div className="flex justify-center">
  <Image
    src="/assets/images/first-pc-build/31.jpg"
    alt="Ghost S1 on the run"
    title="The finished product"
    width={300}
    height={400}
  />
</div>
