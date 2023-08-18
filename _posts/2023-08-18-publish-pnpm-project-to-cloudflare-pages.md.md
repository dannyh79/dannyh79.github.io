---
layout:     post
title:      "Publish PNPM Project to Cloudflare Pages"
date:       2023-08-18 15:11:45 +0800
categories: javascript
comments:   true

---

## TLDR

- The deployment steps from Cloudflare Pages look for asdf's .tool-versions to install build time dependencies but it would fail from NOT having pnpm plugin
- Use `npm i -g pnpm && pnpm i && pnpm build` as Pages project build command 
- Set up a GitHub workflow, which leverages Cloudflare's Direct Uploads under the hood, to build and publish the project if pnpm is listed in .tool-versions

## Context

- The project only allows [pnpm](https://pnpm.io/){:rel="nofollow noopener noreferrer" target="_blank"} for dependency management (`"preinstall": "npx only-allow pnpm"` was specified in package.json)
- Project runtimes are managed by [asdf](https://asdf-vm.com/){:rel="nofollow noopener noreferrer" target="_blank"}, i.e., listed in .tool-versions under project root

## Here Goes the Story...

```
...
10:50:40.830	Success: Finished cloning repository files
10:50:41.525	Found a .tool-versions file. Installing dependencies.
10:50:42.168	pnpm plugin is not installed
10:50:42.172	Error: Exit with error code: 1
...
```
Fig 1. The failed part of [Cloudflare Pages](https://pages.cloudflare.com/){:rel="nofollow noopener noreferrer" target="_blank"}' project build log
{: style="color:gray; font-size: 80%; text-align: center;"}

This happened when I was trying use `$ pnpm build` as [build command](https://developers.cloudflare.com/pages/platform/build-configuration/#build-commands-and-directories){:rel="nofollow noopener noreferrer" target="_blank"} to host my [brain teaser app](https://github.com/dannyh79/wake-up){:rel="nofollow noopener noreferrer" target="_blank"} on [Cloudflare Pages](https://pages.cloudflare.com/){:rel="nofollow noopener noreferrer" target="_blank"}. ... And you are asking me why I chose it? Not just because I am adventurous, but also that I am already using Cloudflare.

By looking at the log, it did not take me long to realize that using the build command is not an option if I do not remove pnpm from project's .tool-versions: [Cloudflare Pages' Build system](https://developers.cloudflare.com/pages/platform/language-support-and-tools/){:rel="nofollow noopener noreferrer" target="_blank"} (v2, as of 2023-08-18) does not have pnpm plugin installed in their image's asdf. All that left for me is to try to find something that could upload the artifact directly to the cloud. And, a flare that said [Direct Uploads](https://developers.cloudflare.com/pages/platform/direct-upload/){:rel="nofollow noopener noreferrer" target="_blank"} drew my attention.

With some googling, I soon found Cloudflare already has a [GitHub action](https://github.com/cloudflare/pages-action){:rel="nofollow noopener noreferrer" target="_blank"} that does all the uploading. I just needed to build the artifact myself. Then, with a little tinkering, here came the publish workflow (see [Cloudflare Pages GitHub Action](https://github.com/cloudflare/pages-action#usage){:rel="nofollow noopener noreferrer" target="_blank"} for details):

{% raw %}
```yaml
name: Build and Publish to Cloudflare Pages
on:
  push:
    branches: main # modify the value if needed
jobs:
  build_and_publish:
    timeout-minutes: 10 # modify the value if needed
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18 # modify the value if needed
      - uses: pnpm/action-setup@v2
        name: Install pnpm
        with:
          version: 8 # modify the value if needed
          run_install: false

      # making pnpm cache to save some build time; can skip this part
      - name: Get pnpm store directory
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV
      - uses: actions/cache@v3
        name: Setup pnpm cache
        with:
          path: ${{ env.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install
      - name: Build project
        run: pnpm build # modify the value if needed

      - name: Publish to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }} # modify the value if needed, remember to add this to GitHub secrets
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }} # modify the value if needed, remember to add this to GitHub secrets
          projectName: ${{ secrets.CLOUDFLARE_PROJECT_NAME }} # modify the value if needed, remember to add this to GitHub secrets
          directory: ./dist # modify the value if needed
```
{% endraw %}

## Pour Closure

Now I can let the computer do the job whenever a new commit gets pushed to `main` branch and forget about all this. Another happy day as a developer.

In an ideal world, the tooling would be able to handle all the niches along the way. For this case, though, looks like it is smart to pick up asdf's .tool-versions, but not smart enough to parse the file then add the missing plugins (for good reasons, maybe). Luckily, the logs said it all and there was still a workaround.

For [Netlify](https://www.netlify.com/){:rel="nofollow noopener noreferrer" target="_blank"}, by the way, putting a simple `$ pnpm build` command in their console will do the job just fine.
