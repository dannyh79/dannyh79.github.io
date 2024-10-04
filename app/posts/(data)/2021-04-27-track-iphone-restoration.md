---
title: 'Track iPhone Restoration Progress on MacOS'
summary: 'Visualize iPhone restoration progress on MacOS v10.15 (Catalina).'
createdAt: 2021-04-27 17:09:36 +0800
publishedAt: 2021-04-27
categories: [misc, macos]
---

## Command to Track Progress of iPhone's Restoration

The below comes in handy, since Finder on MacOS Catalina (10.15.6) does not show iPhone's restoration progress:

1. Open Terminal from Application in Finder or via typing "Terminal" in Spotlight (hotkey: cmd + space)
2. Copy and paste the following command, dollar sign ($) excluded, to Terminal then hit the return/enter key

   ```sh
   $ log stream \
   --info \
   --signpost \
   --style compact \
   --predicate 'senderImagePath contains[cd] "AMPDevicesAgent"'
   ```

3. Restore the iPhone from backup and monitor the progress from Terminal B-)

### References

- [Does Catalina device sync log what it's doing?](https://apple.stackexchange.com/questions/374682/does-catalina-device-sync-log-what-its-doing/374683#374683)
