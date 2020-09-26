---
layout:     post
title:      "Build React Native App on iOS"
date:       2020-09-26 20:28:18 +0800
categories: ["react", "react-native", "ios"]
comments:   true

---
## TDLR
- ...you need a Mac to do it
- Install Xcode, Node.js, and Yarn
- Install Ruby gem `cocoapods`
- Try `$ sudo xcode-select --switch /Applications/Xcode.app` if you run into issues in `$ pod install` (on `Installing Flipper-Glog`)

## Steps
- [Install Xcode from AppStore](https://apps.apple.com/us/app/xcode/id497799835?mt=12){:rel="nofollow noopener noreferrer" target="_blank"}
- [Install Node.js](https://nodejs.org/){:rel="nofollow noopener noreferrer" target="_blank"} with a way of your choice ([Homebrew](https://formulae.brew.sh/formula/node){:rel="nofollow noopener noreferrer" target="_blank"}, [asdf](https://github.com/asdf-vm/asdf-nodejs){:rel="nofollow noopener noreferrer" target="_blank"}, etc.)

```sh
# via homebrew
$ brew install node

# check version of node to see if node is installed
# it should print node's version number
$ node -v
# => v12.15.0
```

- [Install Yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable){:rel="nofollow noopener noreferrer" target="_blank"} with a way of your choice ([Homebrew](https://formulae.brew.sh/formula/node){:rel="nofollow noopener noreferrer" target="_blank"}, [asdf](https://github.com/twuni/asdf-yarn){:rel="nofollow noopener noreferrer" target="_blank"}, etc.)

```sh
# via homebrew
$ brew install yarn

# check version of node to see if yarn is installed
# it should print yarn's version number
$ yarn -v
# => 1.22.5
```

- Initialize a React Native Project

```sh
$ npx react-native init MyFirstRNProject
```

- Install [Ruby gem `cocoapods`](https://cocoapods.org/){:rel="nofollow noopener noreferrer" target="_blank"}

```sh
$ sudo gem install cocoapods
```

- Change directory to `YourProject/ios/` to install iOS dependencies 

```sh
$ cd MyFirstRNProject/ios
$ pod install
```

- If error prints like the following, run `$ sudo xcode-select --switch /Applications/Xcode.app` and do `$ pod install` again. It should be working then.

```sh
Analyzing dependencies
Fetching podspec for `DoubleConversion` from `../node_modules/react-native/third-party-podspecs/DoubleConversion.podspec`
Fetching podspec for `Folly` from `../node_modules/react-native/third-party-podspecs/Folly.podspec`
Fetching podspec for `glog` from `../node_modules/react-native/third-party-podspecs/glog.podspec`
Downloading dependencies
Installing CocoaAsyncSocket (7.6.4)
Installing CocoaLibEvent (1.0.0)
Installing DoubleConversion (1.1.6)
Installing FBLazyVector (0.63.2)
Installing FBReactNativeSpec (0.63.2)
Installing Flipper (0.41.5)
Installing Flipper-DoubleConversion (1.1.7)
Installing Flipper-Folly (2.2.0)
Installing Flipper-Glog (0.3.6)
[!] /bin/bash -c
set -e
#!/bin/bash
# Copyright (c) Facebook, Inc. and its affiliates.
#
# This source code is licensed under the MIT license found in the
# LICENSE file in the root directory of this source tree.

set -e

PLATFORM_NAME="${PLATFORM_NAME:-iphoneos}"
CURRENT_ARCH="${CURRENT_ARCH}"

if [ -z "$CURRENT_ARCH" ] || [ "$CURRENT_ARCH" == "undefined_arch" ]; then
    # Xcode 10 beta sets CURRENT_ARCH to "undefined_arch", this leads to incorrect linker arg.
    # it's better to rely on platform name as fallback because architecture differs between simulator and device

    if [[ "$PLATFORM_NAME" == *"simulator"* ]]; then
        CURRENT_ARCH="x86_64"
    else
        CURRENT_ARCH="armv7"
    fi
fi

export CC="$(xcrun -find -sdk $PLATFORM_NAME cc) -arch $CURRENT_ARCH -isysroot $(xcrun -sdk $PLATFORM_NAME --show-sdk-path)"
export CXX="$CC"

# Remove automake symlink if it exists
if [ -h "test-driver" ]; then
    rm test-driver
fi

./configure --host arm-apple-darwin

# Fix build for tvOS
cat << EOF >> src/config.h
/* Add in so we have Apple Target Conditionals */
#ifdef __APPLE__
#include <TargetConditionals.h>
#include <Availability.h>
#endif
/* Special configuration for AppleTVOS */
#if TARGET_OS_TV
#undef HAVE_SYSCALL_H
#undef HAVE_SYS_SYSCALL_H
#undef OS_MACOSX
#endif
/* Special configuration for ucontext */
#undef HAVE_UCONTEXT_H
#undef PC_FROM_UCONTEXT
#if defined(__x86_64__)
#define PC_FROM_UCONTEXT uc_mcontext->__ss.__rip
#elif defined(__i386__)
#define PC_FROM_UCONTEXT uc_mcontext->__ss.__eip
#endif
EOF

# Prepare exported header include
EXPORTED_INCLUDE_DIR="exported/glog"
mkdir -p exported/glog
cp -f src/glog/log_severity.h "$EXPORTED_INCLUDE_DIR/"
cp -f src/glog/logging.h "$EXPORTED_INCLUDE_DIR/"
cp -f src/glog/raw_logging.h "$EXPORTED_INCLUDE_DIR/"
cp -f src/glog/stl_logging.h "$EXPORTED_INCLUDE_DIR/"
cp -f src/glog/vlog_is_on.h "$EXPORTED_INCLUDE_DIR/"

checking for a BSD-compatible install... /usr/local/bin/ginstall -c
checking whether build environment is sane... yes
checking for arm-apple-darwin-strip... no
checking for strip... strip
checking for a thread-safe mkdir -p... /usr/local/bin/gmkdir -p
checking for gawk... no
checking for mawk... no
checking for nawk... no
checking for awk... awk
checking whether make sets $(MAKE)... yes
checking whether make supports nested variables... yes
checking for arm-apple-darwin-gcc... /Library/Developer/CommandLineTools/usr/bin/cc -arch armv7 -isysroot
checking whether the C compiler works... no
xcrun: error: SDK "iphoneos" cannot be located
xcrun: error: SDK "iphoneos" cannot be located
xcrun: error: SDK "iphoneos" cannot be located
xcrun: error: unable to lookup item 'Path' in SDK 'iphoneos'
/Users/some_user/Library/Caches/CocoaPods/Pods/Release/Flipper-Glog/0.3.6-1dfd6/missing: Unknown `--is-lightweight' option
Try `/Users/some_user/Library/Caches/CocoaPods/Pods/Release/Flipper-Glog/0.3.6-1dfd6/missing --help' for more information
configure: WARNING: 'missing' script is too old or missing
configure: error: in `/Users/some_user/Library/Caches/CocoaPods/Pods/Release/Flipper-Glog/0.3.6-1dfd6':
configure: error: C compiler cannot create executables
See `config.log' for more details
```

- Change back to the root directory. Open 2 terminals; start the project in one terminal, open Xcode in the other

```sh
$ cd ../

# open 2 terminals
# start the project on one
$ yarn start

# open xcode with another one
$ open ios/MyFirstRNProject.xcworkspace
```

- In Xcode, select the emulator of your choice (I choose iPhone 8) then build the app
![Select a emulator then build app](/assets/images/build-react-native-ios-app/1.jpg)

- And Voilà! You have built your first React Native iOS app!
![Successfully initialized iOS app](/assets/images/build-react-native-ios-app/2.jpg)

## References
[React Native 入门学习笔记 (zh-CN)](https://ry09iu.github.io/web/note/2020/04/09/rn-study-note.html){:rel="nofollow noopener noreferrer" target="_blank"}
