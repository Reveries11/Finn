# Finn Sync Protocol (git)

Git is now Finn's canonical store. This **replaces the manual "upload the changed files to the project" dance.**

## Principle

Files are the source of truth; memory is a pointer. Every decision or data change lands as a file edit **and** a commit in the same step — no deferred saves.

## Session loop

- **GMF (good morning):** pull latest → sync check (anchors in `FINN_STATE.json` vs the sections). Green = aligned; amber = reconcile before trading.
- **During session:** on any trade / decision / score change, edit the relevant section of `FINN_STATE.json` (bump `rev` + `last_updated`), edit any touched structure file, and commit.
- **GNF (goodnight):** commit all touched files + push, then confirm a clean working tree (nothing left uncommitted).

## What gets committed where

- Portfolio data → `FINN_STATE.json`
- Rules / commands / routing → `FINN_SYSTEM_PROMPT.md`
- Visual standard → `FINN_VISUAL_SYSTEM_v3_3.html`
- Cockpit code → `finn_cockpit.jsx`

## Commit message convention

`<area>: <what changed>` — e.g.

- `state: NAV Jun5 EOD 28,555.66; -10.8% off HWM`
- `state: log MRVL trim 2sh @279.61 (+196.19)`
- `visual: v3.3 callout border tweak`
- `app: cockpit v2 — earnings + reviews tabs, FMP gap-fill retry`

## Branching (optional)

- `main` = canonical, always-deployable state.
- Experiments (new surfaces, schema changes) on short-lived branches → merge when locked.

## Roll back

- `git log --oneline` to find the point.
- `git revert <sha>` — safe, keeps history.
- `git checkout <sha> -- FINN_STATE.json` — restore a single file to an earlier version.
