---
title: 'Re-Sign Git Commits Without Editing Them'
summary: 'Amend one commit or replay a linear branch to add fresh Git signatures.'
createdAt: 2026-09-08 23:53:46 +0800
publishedAt: 2026-09-08
categories: [git]
---

A commit signature is part of the commit object. Re-signing it creates a new
commit hash even when the tree and commit message stay exactly the same.

## TL;DR

- Re-sign `HEAD` with `git commit --amend --no-edit -S`.
- Re-sign every commit after a base with `git rebase --exec`.
- This rewrites history. Push a shared branch with `--force-with-lease`, not a
  plain `--force`.
- Verify the rewritten range with `git log --show-signature` before pushing.

## Re-Sign the Latest Commit

Use this when only `HEAD` needs a new signature:

```bash
git commit --amend --no-edit -S
```

`--no-edit` preserves the commit message. `-S` asks Git to sign the new commit.
Git creates a replacement commit, so `HEAD` now has a different hash.

If the repository's hooks do not need to run again for a metadata-only rewrite,
add `--no-verify`:

```bash
git commit --amend --no-edit --no-verify -S
```

Do not add `--no-verify` by habit. It bypasses the pre-commit and commit-msg
hooks that normally run for `git commit`.

## Re-Sign a Linear Branch

For a branch that contains only ordinary linear commits after `origin/main`:

```bash
git fetch origin
git rebase --exec 'git commit --amend --no-edit --no-verify -S' origin/main
```

`git rebase --exec <command> <base>` replays each commit after `<base>` and
runs the command after each replayed commit. The `git commit --amend` command
then creates a signed replacement for that replayed commit.

Replace `origin/main` with the commit immediately before the first commit that
needs re-signing. Check the range first:

```bash
git log --oneline origin/main..HEAD
```

This form is for a linear branch. Review merge-heavy history separately before
rewriting it; a normal rebase can change its shape.

## Bonus: Reset the Author

Re-signing preserves the original author. If the author identity is also wrong,
add `--reset-author` while amending:

```bash
git commit --amend --no-edit --reset-author -S
```

Git then sets the author to the current committer identity from `user.name` and
`user.email`, and renews the author timestamp. Check those values first:

```bash
git config user.name
git config user.email
```

To reset the author and re-sign every commit in a linear branch range:

```bash
git fetch origin
git rebase --exec 'git commit --amend --no-edit --no-verify --reset-author -S' origin/main
```

This is not cosmetic. It replaces both the commit signature and the recorded
author identity. Confirm the result before force-pushing:

```bash
git show --no-patch --format=fuller HEAD
```

## Verify Before Pushing

Inspect the signatures in the rewritten branch range:

```bash
git log --show-signature origin/main..HEAD
```

Then push the replacement history safely:

```bash
git push --force-with-lease
```

`--force-with-lease` refuses to overwrite the remote branch when it has moved
since the last fetch. That is the protection a plain `--force` does not have.

## Refs

- [Git `commit`](https://git-scm.com/docs/git-commit)
- [Git `rebase`](https://git-scm.com/docs/git-rebase)
- [Git `push`](https://git-scm.com/docs/git-push)
