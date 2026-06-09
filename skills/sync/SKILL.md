---
name: sync
description: "Finn's state-file sync protocol — keeps FINN_STATE.json (the single canonical state file) and memory from drifting. Use at GMF (run the SYNC CHECK against the anchors before macro), at GNF (change-aware sync + upload verification), after any trade (FILE SYNC REQUIRED), and for the sync command. Covers the canonical anchors, per-section staleness rules, the change-aware upload list, and the GNF verification that audits both the Project and GitHub and holds the session open until both match."
---

<!-- skills/sync/SKILL.md — extracted from FINN_SYSTEM_PROMPT.md v3.0 (canonical inlined modules), 2026-06-06 -->

# State File Sync Protocol (LOCKED — v2.0, single-file) + Git

**Purpose:** prevent memory↔file drift. **FINN_STATE.json is the single canonical state file + read-this-first manifest** (sections: `anchors`, `sync`, `portfolio`, `positions`, `fmp_targets`, `trades`, `unreconciled`, `realized_breakdown`, `nav_history`, `scores`, `thesis`, `earnings`, `reviews`, `watchlist`, `macro`, `open_decisions`, `session_handoff`, `todo`-if-present). Memory is a thin pointer + session deltas.

**Structure files stay separate + stable:** FINN_SYSTEM_PROMPT.md (lean core) · skills/ · FINN_VISUAL_SYSTEM_v3_3.html · FINN_DASH_TEMPLATE_v3_2.html · FINN_SESSION_HANDOFF_TEMPLATE.md · finn_cockpit.jsx.

**If anything reads pending/missing, verify against the actual repo/project file list and read the saved file before rebuilding — never reconstruct a locked surface from prose (the recurring drift cause).**

## Git workflow (backs this protocol — see FINN_SYNC.md)
Git is now Finn's canonical store; commits replace the old "upload to project" dance.
- **GMF** = pull latest, then run SYNC CHECK.
- **Decision / trade / data change** = edit the FINN_STATE.json section **and** commit, same step.
- **GNF** = commit touched files + push, then UPLOAD VERIFICATION (clean working tree).
Commit message convention: `state: …` / `visual: …` / `app: …` / `skills: …`. Reads on a private repo: via a GitHub connector when available, else manual upload of FINN_STATE.json to the Project.

## Canonical anchors (FINN_STATE.json → `anchors`)
Ground-truth every section + render must agree with: `open_positions`, `open_tickers`, `net_realized_pnl`, `last_trade_date`, `scores_date`, `scores_next_due`, `nav_last_eod_close`, `hwm`. SYNC CHECK fails if any section disagrees.

## SYNC CHECK — auto-fires at GMF, manual via `sync`
1. Load FINN_STATE.json.
2. For each section, evaluate its stale rule via `sync.sections`.
3. Cross-check `positions` + `trades` against `anchors` (count, realized P&L, last trade).
4. Emit SYNC STATUS: `SYNC ✅ — state current as of [date]`, or `⚠ DRIFT — [section] ([reason]). Reconcile.` (list every drifted section).
5. Fires BEFORE macro/agenda at GMF so the session never starts on stale state.

## CHANGE-AWARE SYNC — at GNF (and after trades)
Single-file model — one upload/commit covers all data:
1. Track dirty sections during the session. On any change, edit the section + bump `_meta.rev` + `last_updated` + set that section `dirty:true` in `sync.sections`.
2. At GNF, present what changed:
   ```
   📤 TO UPLOAD:  FINN_STATE.json (sections: [list]) [+ any structure/skill file touched]
   ✓ ALREADY CURRENT (skip): [untouched structure files]
   ```
   FINN_STATE.json is normally the only data upload. A structure/skill file appears only if it changed that session (a build).
3. Reset: next GMF SYNC CHECK confirms and clears `dirty` flags.

## GNF UPLOAD VERIFICATION — last line of defense (auto, before close)
Audit project/repo vs canonical:
- **Present?** FINN_STATE.json + structure files + skills/ exist (no orphan/missing). No leftover old per-name JSONs.
- **Right rev?** committed/project FINN_STATE.json `_meta.rev` matches the session's.
- **Anchors agree?** positions count, realized P&L, NAV, last-trade date match reality.

Emit:
```
GNF VERIFY · repo vs canonical
  [✓/✗] FINN_STATE.json present + current rev
  [✓/✗] structure files + skills present
  [✓/✗] anchors agree (N open · $X realized · NAV $X)
  [✓/✗] no leftover/duplicate files
  VERDICT: 🟢 SYNCED  /  🔴 ACTION: commit [file], remove [file]
```
If 🔴, list exactly what to add/replace/delete and hold the session open. If 🟢, safe to close.

## After any trade
Executed trade → `FILE SYNC REQUIRED` callout → update FINN_STATE.json `positions` + `trades` + `anchors` immediately, bump rev, flag sections dirty, commit. Don't defer to GNF.

## Staleness rules (per section)
- `positions` / `trades` → stale if a trade executed after the section's last edit
- `scores` → stale if `today > scores.rescore_schedule.next_due` (>7d rule)
- `watchlist` → event-driven (tier/target/monitor change)
- `macro` → per its refresh note (e.g. FOMC week)
- `session_handoff` → rewritten each session
- FINN_SYSTEM_PROMPT.md (lean core) → should rarely go stale on data now (ticker data lives in state). Stale only if a rule/command changes.
- FINN_VISUAL_SYSTEM / DASH_TEMPLATE / HANDOFF_TEMPLATE / skills → structural, never stale on data.


---
