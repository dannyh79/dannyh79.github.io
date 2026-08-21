---
title: 'Release-age controls: a low-friction supply-chain guard for pnpm and Python'
summary: 'Delay freshly published packages during resolution, with narrow and auditable exceptions when an urgent fix cannot wait.'
createdAt: 2026-08-21 19:51:40 +0800
publishedAt: 2026-08-21
categories: [javascript, python]
---

## TL;DR

- A release-age rule delays **new resolution** of freshly uploaded packages. It gives maintainers, scanners, and the registry time to discover a bad release before it lands in my lockfile.
- I use an explicit window (start at 24 hours; use longer when the deployment cadence allows it), keep exceptions narrow, and scan for vulnerabilities separately.
- `pnpm`, `uv`, Poetry, and current `pip` all have a supported way to do this. Their configuration shapes are different enough that copying one manager's example into another is a footgun.

This complements lockfiles, hash verification, review, and vulnerability scanning. It simply delays “published” becoming “eligible for my next update.”

## pnpm: make the cooling-off period strict

`minimumReleaseAge` is measured in minutes and covers direct and transitive dependencies. pnpm 11 defaults to 1,440 minutes, but I set it explicitly because older pnpm versions defaulted to no delay.

```yaml
# pnpm-workspace.yaml
minimumReleaseAge: 1440
minimumReleaseAgeStrict: true
```

It makes an unsatisfied age constraint fail resolution instead of falling back to a too-new version.

When an urgent fix genuinely cannot wait, I make the exception as small as possible. A bare package name exempts every version, so it is usually too broad:

```yaml
minimumReleaseAge: 1440
minimumReleaseAgeStrict: true
minimumReleaseAgeExclude:
  - 'webpack@5.102.1'
```

Version selectors arrived in pnpm 10.19. An exact version is the safer emergency escape hatch; remove it once the normal window passes.

See pnpm's [release-age settings](https://pnpm.io/settings/dependency-resolution#minimumreleaseage) and [workspace configuration](https://pnpm.io/settings) for the current behaviour.

## uv: use a duration, then opt out only when needed

uv calls this `exclude-newer` and filters individual distribution artifacts by upload time. A duration fits a rolling policy:

```toml
# pyproject.toml
[tool.uv]
exclude-newer = "7 days"
```

The documented package-level override is `exclude-newer-package`, not `exclude-newer-exceptions`. A package can have its own age or be explicitly opted out of the global restriction:

```toml
[tool.uv]
exclude-newer = "7 days"
exclude-newer-package = { setuptools = false }
```

Treat `false` as a temporary escape hatch. uv needs registry upload-time metadata; PyPI provides it, while private indexes may need an index-specific policy. The [uv resolution documentation](https://docs.astral.sh/uv/concepts/resolution/#dependency-cooldowns) covers duration formats and precedence.

## Poetry: configure the solver, not `pyproject.toml`

Poetry 2.4 introduced `solver.min-release-age`, measured in whole days. It is application configuration, so a project-scoped policy belongs in `poetry.toml` via `--local`, separate from `pyproject.toml`:

```bash
poetry config solver.min-release-age 7 --local
poetry config solver.min-release-age-exclude "my-emergency-package" --local
```

The exclusion is a comma-separated list of names and permits all versions of those packages. The filter only works for sources that expose upload timestamps.

Poetry's [solver configuration](https://python-poetry.org/docs/configuration/#solvermin-release-age) documents the setting, its source-metadata limitation, and the exclusion form.

## pip: current pip can do this too

Raw pip now has `--uploaded-prior-to`. pip 26.0 introduced the upload-time filter, and 26.1 added the duration syntax, so this is no longer an absolute-date-only workaround:

```bash
python -m pip install --uploaded-prior-to=P7D -r requirements.txt
```

For a fixed, reproducible cutoff, I can use UTC instead:

```bash
python -m pip install --uploaded-prior-to=2026-08-14T00:00:00Z -r requirements.txt
```

pip has no per-package release-age allowlist here. The filter only applies to remote indexes with upload-time metadata; local files and VCS requirements are outside it. Read the [pip upload-time guide](https://pip.pypa.io/en/stable/user_guide/#filtering-by-upload-time) before putting it in CI.

## Make the delay useful

Lockfiles still matter: I review lockfile updates, make upgrades intentional, and run vulnerability scanning on a schedule. An age window delays security fixes too, so the emergency path should be visible, narrow, and later removed.
