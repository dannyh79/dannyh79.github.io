---
title: 'Configure Git Commit Signing with GPG after Changing Email'
createdAt: 2021-05-17 16:34:56 +0800
publishedAt: 2021-05-17
categories: [git]
---

## TLDR

> Check out the awesome guide [How to Sign Git Commits](https://merikan.com/2019/05/how-to-sign-git-commits/) if you have not configure git signature before.

1. Generate a key from `$ gpg --full-generate-key{:sh}`
2. Update [user] credentials in git config
3. (Optional) Export the key to GitHub

## Steps

### 1. Create a New Key

> Follow GitHub's ["Generating a GPG key"](https://docs.github.com/en/github/authenticating-to-github/generating-a-new-gpg-key#generating-a-gpg-key) if the key is to be used on GitHub.

```sh
$ gpg --full-generate-key
```

The output should look something like the following:

```sh
# Keep the key ID (where the BDKEY5KEY78KEY48 is) for step 3
gpg: key BDKEY5KEY78KEY48 marked as ultimately trusted
gpg: revocation certificate stored as ...
public and secret key created and signed.

# Keep the public key (where the 4044FKEYFKEY... is) for step 2
pub   rsa4096 2021-05-17 [SC]
      4044FKEYKEYMOREKEYSKEYKEYKEYKEYMOREKEYS8
uid                      Danny Cheng-Hsuan Han <chenghsuan.han@gmail.com>
sub   rsa4096 2021-05-17 [E]
```

### 2. Update [user] credentials in git config

> Don't forget to do a test commit when done updating credentials!

> Refer to GitHub's ["Telling Git about your GPG key"](https://docs.github.com/en/github/authenticating-to-github/telling-git-about-your-signing-key#telling-git-about-your-gpg-key) if you have multiple keys.

```sh
# Add --global to set it globally
$ git config --edit
```

The template should be like the following:

```
# .gitconfig

# ...omitted

[user]
  name = (user your desired name, i.e., Danny Cheng-Hsuan Han)
  email = (use your email in key generation, i.e., chenghsuan.han@gmail.com)
  signingKey = (use the public key from key generation, i.e., 4044FKEYKEYMOREKEYSKEYKEYKEYKEYMOREKEYS8)

# ...omitted
```

### 3. Export the key to GitHub

> Refer to GitHub's ["Adding a GPG key"](https://docs.github.com/en/github/authenticating-to-github/adding-a-new-gpg-key-to-your-github-account#adding-a-gpg-key) for more details.

#### 3-1

```sh
$ gpg --list-secret-keys --keyid-format LONG
```

#### 3-2

```sh
# Use the key ID from step 1 here
# In case you lose the key ID, use pub key from `$ gpg --list-keys` is ok too
$ gpg --armor --export BDKEY5KEY78KEY48
```

#### 3-3

Quoting from GitHub, `Copy your GPG key, beginning with -----BEGIN PGP PUBLIC KEY BLOCK----- and ending with -----END PGP PUBLIC KEY BLOCK-----` then paste it to your GitHub account. Done!

### References

- [How to Sign Git Commits](https://merikan.com/2019/05/how-to-sign-git-commits/)
