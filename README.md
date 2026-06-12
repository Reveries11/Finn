# Finn

Personal portfolio intelligence system — an AI co-pilot for an active, concentrated AI/semiconductor growth portfolio. This repo is the **canonical home** for Finn's state, system definition, visual standard, the v4 spec stack, and the cockpit build.

> Personal tooling. Not investment advice.

## Canonical rule

Files in this repo are the single source of truth. Conversational memory is a thin pointer only — if memory and a file disagree, **the file wins**. `FINN_STATE.json` is the read-first entry point. Operationally, `FINN_STATE.json` + `FINN_SYSTEM_PROMPT.md` are also loaded into the Claude Project (the runtime read-source); this repo is the backup, history, and Phase-3 source.

## Structure

```
FINN_STATE.json                  ← read first. Canonical state (rev18): anchors, positions, trades, scores,
                                   NAV history, watchlist, earnings, thesis, reviews, macro, session handoff.
FINN_SYSTEM_PROMPT.md            Operating system prompt — rules, commands, model/effort routing, sync.
FINN_SYNC.md                     Git workflow notes.

system/                          Locked visual standard + templates
  FINN_VISUAL_SYSTEM_v3_3.html     v3.3 master visual standard (tokens + components) — every chat surface builds from this
  FINN_DASH_TEMPLATE_v3_2.html     Dashboard template
  FINN_SESSION_HANDOFF_TEMPLATE.md

skills/                          14 skill modules — modular system-prompt reference + Phase-3 source

design/                          v4 "Command Deck" spec stack + design docs
  FINN_CLAUDE_DESIGN_QUEUE.md      ← the build punch list (apply order)
  FINN_SPEC_AMENDMENTS.md          Fable-2 patches — read alongside each base spec
  FINN_COLOR_SYSTEM_v4.md   FINN_NAV_STRUCTURE.md   FINN_INTELLIGENCE_WEB.md
  FINN_DISCRETE_FIXES.md    FINN_ARCHITECTURE.md    FINN_MOBILE_SPEC.md
  FINN_CLAUDE_DESIGN_BRIEF.md   FINN_DATA_SPEC.md   FINN_PHASE3_SPEC.md   FINN_DESIGN_CHANGE_SHEET.md

roadmap/                         Planning + dev journal
  FINN_ROADMAP.md   FINN_FRONTEND_ROADMAP.md   FINN_A7_CALIBRATION.md   FINN_BUTTON_AUDIT.md

fable/                           Claude Fable review session kits
  FINN_FABLE_REVIEW.md (holistic)   FINN_SPEC_REVIEW_PACKAGE.md (spec pressure-test)   FINN_FABLE_ENGINE_REDTEAM.md

export/                          "Fresh-start Finn" handoff for a new operator
  FINN_SETUP.md   FINN_STATE.seed.json   FINN_STATE.blank.json

ui_kits/finn/                    Cockpit build code + data
  finn-data.js                     A0 — reconciled + current data layer
  finn_cockpit.jsx                 Phase-1 cockpit (React reference)
  FINN_DEMO_FIXTURE.json           build fixture

archive/                         Old snapshots (finn-repo.tar, finn_skills_A1-A6.zip)
```

## Workflow

State and system changes are committed here; `FINN_STATE.json` + `FINN_SYSTEM_PROMPT.md` are also re-uploaded to the Claude Project (runtime read-source).
- **On any change** — edit the file + commit ("decision = file updated, same step").
- **Session start (GMF)** — Claude reads `FINN_STATE.json` from the Project.
- **Session end (GNF)** — commit touched files + push; re-upload changed runtime files to the Project.

## Build roadmap

1. ✅ Phase 1 — in-chat cockpit (`ui_kits/finn/finn_cockpit.jsx`)
2. ✅ GitHub foundation — this repo
3. ✅ Skills refactor — `skills/`
4. ⏳ Phase 2 — Claude Design: v4 "Command Deck" specced + Fable-reviewed twice (`design/`); applying on the canvas
5. ⬜ Phase 3 — Claude Code: deployed Next.js app on live data (see `design/FINN_ARCHITECTURE.md`)

## Quick start

```bash
git add .
git commit -m "Finn: reorganized repo + v4 spec stack, A0 data layer, rev18 state"
git push
```
