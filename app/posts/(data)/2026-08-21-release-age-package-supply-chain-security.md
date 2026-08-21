---
title: 'Release-age controls: a low-friction supply-chain guard for pnpm and Python'
summary: 'Delay freshly published packages during resolution, with narrow and auditable exceptions when an urgent fix cannot wait.'
createdAt: 2026-08-21 19:51:40 +0800
publishedAt: 2026-08-21
categories: [javascript, python]
---

## TL;DR

- Do not let every new package release become eligible the instant it is published. A one-day or one-week cooling-off period gives maintainers and scanners time to find a bad release.
- This protects **new resolution**, not code already selected in a lockfile. Keep lockfiles, review their diffs, and scan independently.
- pnpm, uv, Poetry, and pip have different controls. Use the native setting; do not copy a pnpm allowlist into a Python tool.

A release-age policy is a small supply-chain control with a useful failure mode: an upgrade waits rather than silently picking a package published minutes ago. It is not a replacement for hashes, review, or vulnerability scanning. It also delays legitimate security fixes, so the escape hatch needs an owner and an expiry.

## pnpm: delay new versions, including transitive ones

[`minimumReleaseAge`](https://pnpm.io/settings/dependency-resolution#minimumreleaseage) is measured in minutes and applies to direct and transitive dependencies. pnpm 11+ defaults it to 1,440 minutes, but I set it explicitly so the policy does not depend on the installed pnpm major version.

```yaml
# pnpm-workspace.yaml
minimumReleaseAge: 1440
minimumReleaseAgeStrict: true
```

Strict mode makes resolution fail when nothing in the requested range is old enough. That is the useful behaviour in CI: choosing a too-new version would defeat the rule. It is already the default when `minimumReleaseAge` is configured explicitly; keeping it in the file makes the intent obvious.

For an urgent fix, exempt the smallest possible target. A package name exempts every version, while an exact version limits the exception:

```yaml
minimumReleaseAge: 1440
minimumReleaseAgeStrict: true
minimumReleaseAgeExclude:
  - 'webpack@5.102.1'
```

Version-specific exclusions require pnpm 10.19 or newer. Remove the entry after the normal window has passed. The [pnpm documentation](https://pnpm.io/settings/dependency-resolution#minimumreleaseageexclude) also documents name and scope patterns, but they are deliberately broader than an emergency exception should be.

## uv: use a rolling cooldown

uv calls the setting [`exclude-newer`](https://docs.astral.sh/uv/concepts/resolution/#dependency-cooldowns). It compares each distribution artifact's upload time, not a package version's release time.

```toml
# pyproject.toml
[tool.uv]
exclude-newer = "7 days"
```

A package can use a different cutoff or opt out of the global one. `false` is an explicit bypass, so I treat it as temporary:

```toml
[tool.uv]
exclude-newer = "7 days"
exclude-newer-package = { setuptools = false }
```

PyPI exposes upload times. For an index without them, uv can use an index-specific cutoff or opt that index out; decide that deliberately rather than assuming the global policy covers private packages. The filter applies to registry packages, not Git dependencies.

## Poetry: configure the application solver

Poetry 2.4 introduced [`solver.min-release-age`](https://python-poetry.org/docs/configuration/#solvermin-release-age). It is application configuration, so project-local settings go in `poetry.toml`, not `pyproject.toml`:

```bash
poetry config solver.min-release-age 7 --local
poetry config solver.min-release-age-exclude "my-emergency-package" --local
```

The age is in whole days. Poetry ignores a release when any known distribution file is newer than the configured age; it can only enforce the rule for sources that expose upload timestamps. The exclusion is a comma-separated list of package names and permits all of their versions, so keep it short and review it.

## pip: use an upload-time cutoff

[pip 26.0 added `--uploaded-prior-to`](https://pip.pypa.io/en/stable/user_guide/#filtering-by-upload-time); pip 26.1 also accepts a duration. For a seven-day rolling policy:

```bash
python -m pip install --uploaded-prior-to=P7D -r requirements.txt
```

For a fixed, reproducible cutoff, use a UTC timestamp instead:

```bash
python -m pip install --uploaded-prior-to=2026-08-14T00:00:00Z -r requirements.txt
```

pip has no per-package bypass for this filter. It applies only to remote indexes that provide upload-time metadata; local files and VCS requirements are allowed, and an index that lacks the metadata fails the install.

## Keep the exception path boring

An age gate is most useful when dependency updates are intentional: review the lockfile diff, run a vulnerability scanner, and record why an exception exists. A compromised release might be discovered during the wait; a real security fix might need the exception. In both cases, the follow-up is the same: remove the exception and let the normal policy take over.
