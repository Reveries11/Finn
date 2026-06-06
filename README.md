# Finn

Personal portfolio intelligence system — an AI co-pilot for an active, concentrated AI/semiconductor growth portfolio. This repo is the **canonical home** for Finn's state, system definition, visual standard, and the cockpit app.

> Personal tooling. Not investment advice.

## Canonical rule

Files in this repo are the single source of truth. Conversational memory is a thin pointer only — if memory and a file disagree, **the file wins**. `FINN_STATE.json` is the read-first entry point.

## File map

| File | What it is |
|---|---|
| `FINN_STATE.json` | **Read first.** Consolidated state: anchors, positions, trades, scores, NAV history, watchlist, earnings, thesis, reviews, macro, session handoff. |
| `FINN_SYSTEM_PROMPT.md` | Finn's operating system prompt — rules, commands, model/effort routing, sync protocol. |
| `FINN_VISUAL_SYSTEM_v3_3.html` | v3.3 master visual standard — design tokens + component library. Every surface builds from this. |
| `FINN_DASH_TEMPLATE_v3_2.html` | Dashboard template (backfill to v3.3 pending). |
| `FINN_SESSION_HANDOFF_TEMPLATE.md` | Session handoff template. |
| `FINN_SYNC.md` | Git workflow — how state changes flow to commits (replaces the upload dance). |
| `finn_cockpit.jsx` | The Finn Cockpit (Phase 1) — React artifact: live FMP prices via MCP, `window.storage` persistence, v3.3 UI. |

## Workflow

State and system changes are committed here. See `FINN_SYNC.md`. In short:

- **On any change** — edit the file + commit (mirrors "decision = file updated, same step").
- **Session start (GMF)** — pull latest.
- **Session end (GNF)** — commit touched files + push.

## Build roadmap

1. ✅ **Phase 1 — In-chat cockpit** (`finn_cockpit.jsx`)
2. ⏳ **GitHub foundation** — this repo *(in progress)*
3. ⬜ **Skills refactor** — modularize the system prompt into loadable skills
4. ⬜ **Phase 2 — Claude Design** — design the full platform, hand off to Code
5. ⬜ **Phase 3 — Claude Code** — deployed Next.js app on live data

## Running the cockpit

`finn_cockpit.jsx` is a Claude artifact (React). It runs in the Claude.ai artifact viewer, where it pulls live quotes from FMP via MCP and persists via `window.storage`. It is seeded from `FINN_STATE.json`.

## Quick start

```bash
# 1. Create an empty repo on github.com (e.g. "finn", private)
# 2. From this folder:
git init
git add .
git commit -m "Finn foundation: state, system, visual standard, cockpit v2"
git branch -M main
git remote add origin https://github.com/<you>/finn.git
git push -u origin main
```
