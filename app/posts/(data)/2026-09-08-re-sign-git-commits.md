---
title: 'Re-Sign Git Commits Without Editing Them'
summary: 'Amend one commit or replay a linear branch to add fresh Git signatures.'
createdAt: 2026-09-08 23:53:46 +0800
publishedAt: 2026-09-08
categories: [git]
---

Re-signing rewrites a commit, so the hash changes even when its files and
message do not. Check the range first and use `--force-with-lease` for an
already-pushed branch.

## Re-Sign HEAD

```bash
git commit --amend --no-edit -S
```

`--no-edit` keeps the message. `-S` signs the replacement commit. Add
`--no-verify` only when you deliberately want to skip commit hooks.

## Re-Sign a Linear Branch

```bash
git fetch origin
git log --oneline origin/main..HEAD
git rebase --exec 'git commit --amend --no-edit --no-verify -S' origin/main
git log --show-signature origin/main..HEAD
git push --force-with-lease
```

The rebase command replays every commit after `origin/main`, then amends and
signs each replayed commit. Use it for a linear branch. Review merge-heavy
history separately before rewriting it.

## Bonus: Reset the Author

```bash
git commit --amend --no-edit --reset-author -S
```

`--reset-author` replaces the author with the current `user.name` and
`user.email`, and renews the author timestamp. Include it in the rebase command
when every replayed commit needs the same correction.

## Bonus: Sign With SSH

```bash
git config --global gpg.format ssh
git config --global user.signingKey ~/.ssh/id_ed25519.pub
git config --global commit.gpgSign true
```

The matching private key must be available through `ssh-agent`. Register the
public key as a **signing key** in GitHub or GitLab to receive a verified badge:

```bash
gh ssh-key add ~/.ssh/id_ed25519.pub --type signing
```

## Refs

- [Git `commit`](https://git-scm.com/docs/git-commit)
- [Git `rebase`](https://git-scm.com/docs/git-rebase)
- [Git SSH signing configuration](https://git-scm.com/docs/git-config#Documentation/git-config.txt-gpgformat)
- [GitHub: SSH commit signature verification](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification#ssh-commit-signature-verification)
- [GitLab: Signed commits](https://docs.gitlab.com/user/project/repository/signed_commits/)
