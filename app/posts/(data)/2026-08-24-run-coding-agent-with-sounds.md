---
title: 'Run Coding Agent with Sounds'
summary: 'Use PeonPing and StarCraft SCV voice lines to make Oh My Pi lifecycle events audible without installing Claude or OpenClaw.'
createdAt: 2026-08-24 00:12:26 +0800
publishedAt: 2026-08-24
categories: [macos, llm]
---

Coding agents are quiet at the moments where I most need an interruption: a turn finishes, a tool fails, or the agent needs input. A terminal title change helps, but it still requires looking at the terminal. Sound is a better status cue when I have moved on to something else.

[PeonPing](https://github.com/PeonPing/peon-ping) plays sound packs for coding-agent lifecycle events. Its `sc_scv` pack uses the StarCraft SCV lines: “Job’s finished” is a more noticeable completion signal than another silent terminal prompt.

## Install the SCV pack

On macOS, install PeonPing with Homebrew, then select the pack:

```bash
brew install PeonPing/tap/peon-ping
peon packs use --install sc_scv
```

Confirm the pack can play before connecting it to an agent:

```bash
peon preview task.complete
```

That should play an SCV completion line. `peon status --verbose` shows the active pack and the config location.

## Connect it to Oh My Pi

The [Oh My Pi adapter](https://github.com/PeonPing/peon-ping/blob/main/adapters/omp.sh) does not install PeonPing. It also looks for `peon.sh` only under Claude Code and OpenClaw-compatible hook paths. This is why running the adapter command alone fails on a clean machine.

I do not use either application. The smallest workaround is to expose Homebrew’s `peon.sh` through the OpenClaw-compatible path that the adapter already checks. Do not use this path when an OpenClaw PeonPing hook already exists:

```bash
hook="$HOME/.openclaw/hooks/peon-ping/peon.sh"
if [ -e "$hook" ] || [ -L "$hook" ]; then
  echo "Existing OpenClaw PeonPing hook: $hook" >&2
  exit 1
fi

mkdir -p "$(dirname "$hook")"
ln -s "$(brew --prefix peon-ping)/libexec/peon.sh" "$hook"
```

This does **not** install or configure OpenClaw. It is only a compatibility path for the current adapter preflight check.

Now download the pinned upstream OMP extension, inspect it, then install it:

```bash
adapter="$(mktemp)"
curl --fail --show-error --location \
  https://raw.githubusercontent.com/PeonPing/peon-ping/f42241cc3b07ae36baff98bc1a04c62737cf5897/adapters/omp.sh \
  --output "$adapter"
less "$adapter"
bash "$adapter"
rm "$adapter"
```

Restart OMP after the command succeeds. The extension forwards session starts, turn starts and ends, tool errors, compaction, and shutdown events to PeonPing.

## Keep only the attention signal

I only want a sound when the agent stops and I need to look. After `peon packs use`, a fresh `~/.openpeon/config.json` contains only `default_pack`; replace that fresh file with:

```json
{
  "default_pack": "sc_scv",
  "categories": {
    "session.start": false,
    "task.acknowledge": false,
    "task.complete": true,
    "task.error": false,
    "input.required": true,
    "resource.limit": false,
    "user.spam": false
  }
}
```

If the config already has other settings, retain them and merge in the `categories` object instead of replacing the file.

This silences every routine event and retains `task.complete`, which OMP currently emits when a turn ends. `input.required` remains enabled for a future OMP adapter that forwards a permission or waiting event; the current adapter does not emit one. It also cannot distinguish the main agent from subagents, so this is the smallest useful signal rather than an exact “main agent needs me now” filter.

## It is a cue, not a dashboard

A sound tells me that something changed; it does not tell me whether the work is correct. I still inspect errors and review completed changes. The payoff is simply less polling: when the SCV says the job is finished, I know it is time to look.

## Refs

- [PeonPing](https://github.com/PeonPing/peon-ping)
- [PeonPing OMP adapter](https://github.com/PeonPing/peon-ping/blob/main/adapters/omp.sh)
