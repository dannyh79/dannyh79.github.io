---
title: 'Run Coding Agent with Sounds'
summary: 'Use PeonPing sound packs to notify only when Oh My Pi stops or reaches a resource limit.'
createdAt: 2026-08-24 00:12:26 +0800
publishedAt: 2026-08-24
categories: [macos, llm]
---

Coding agents should interrupt only when they need attention. Terminal titles still require polling; sound does not.

[PeonPing](https://github.com/PeonPing/peon-ping) plays coding-agent sound packs. I use the StarCraft SCV, my favorite terran unit, as the voice chord of my coding agent.

## Install a Sound Pack

Install PeonPing, then browse [OpenPeon sound packs](https://openpeon.com/packs) or its CLI registry. This example uses `sc_scv`:

```bash
brew install PeonPing/tap/peon-ping
peon packs list --registry
peon packs use --install sc_scv
peon preview task.complete
```

## Connect It to Oh My Pi

The [OMP adapter](https://github.com/PeonPing/peon-ping/blob/main/adapters/omp.sh) looks for PeonPing under Claude Code first, then OpenClaw. Create the Claude-compatible path only when neither hook already exists:

```bash
claude_hook="$HOME/.claude/hooks/peon-ping/peon.sh"
openclaw_hook="$HOME/.openclaw/hooks/peon-ping/peon.sh"
if [ -e "$claude_hook" ] || [ -L "$claude_hook" ] ||
   [ -e "$openclaw_hook" ] || [ -L "$openclaw_hook" ]; then
  echo "Existing PeonPing hook found; not replacing it." >&2
  exit 1
fi

mkdir -p "$(dirname "$claude_hook")"
ln -s "$(brew --prefix peon-ping)/libexec/peon.sh" "$claude_hook"
```

This does not install or configure Claude Code. Then inspect and install the adapter:

```bash
adapter="$(mktemp)"
curl --fail --show-error --location \
  https://raw.githubusercontent.com/PeonPing/peon-ping/f42241cc3b07ae36baff98bc1a04c62737cf5897/adapters/omp.sh \
  --output "$adapter"
less "$adapter"
bash "$adapter"
rm "$adapter"
```

The upstream extension emits `Stop` after every `turn_end`. Change it to `agent_settled`, which fires only after retries, compaction, and queued continuations are finished:

```bash
extension="$HOME/.omp/agent/extensions/peon-ping/peon-ping.ts"
grep -q 'pi.on("turn_end",' "$extension" ||
  { echo "Expected turn_end handler not found: $extension" >&2; exit 1; }
perl -0pi -e 's/pi\.on\("turn_end",/pi.on("agent_settled",/' "$extension"
```

Reapply this after reinstalling the adapter, then restart OMP.

## Keep Only the Attention Signal

Enable a sound only when the run settles, user input is required, or a quota/rate limit needs action:

```json
{
  "_comment": "change default_pack value to your actual default sound pack name",
  "default_pack": "sc_scv",
  "categories": {
    "session.start": false,
    "task.acknowledge": false,
    "task.complete": true,
    "task.error": false,
    "input.required": true,
    "resource.limit": true,
    "user.spam": false
  },
  "suppress_subagent_complete": true
}
```

Merge these keys into an existing `~/.openpeon/config.json`. OMP currently emits only settled completion events; the input and limit categories are ready when its adapter forwards them. OMP also does not identify main versus subagents, so suppression works only when PeonPing can recognise the child session.

## It Is a Cue, Not a Dashboard

Treat the sound as an interruption, then inspect the result.

## Refs

- [PeonPing](https://github.com/PeonPing/peon-ping)
- [PeonPing OMP adapter](https://github.com/PeonPing/peon-ping/blob/main/adapters/omp.sh)
