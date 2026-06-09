# Finn — Build Roadmap
<!-- The 5-step program: chat-based system → deployed app. Updated 2026-06-08. -->

## The 5 steps
1. **Phase 1 — In-chat artifact cockpit** ✅ DONE (Jun 5–6)
   `finn_cockpit.jsx`: 6-tab React artifact, v3.3-faithful, seeded from `FINN_STATE.json`, live FMP via MCP, `window.storage` persistence. *Note:* the in-artifact self-fetch proved unreliable → demoted to a design reference. Live prices in chat now come from Claude pulling FMP per-render (the Control Center).
2. **GitHub foundation** ✅ DONE (Jun 6)
   `github.com/Reveries11/Finn` — version-controlled canonical store + backup. *Note:* no GitHub connector exists, so the **Project is the read-source**; git is backup/history. Every changed file is re-uploaded to **both**.
3. **Skills refactor** ✅ DONE (Jun 6; YAML frontmatter added Jun 8)
   `FINN_SYSTEM_PROMPT.md` → lean core + 8 skill modules; per-ticker data moved to `FINN_STATE.json`. Frontmatter (`name` + `description`) added so the skills auto-load by relevance in Phase 3.
4. **Phase 2 — Claude Design prototype** ◀ NEXT
   Pressure-test + polish the *settled* v3.3 design, surface by surface, in Claude Design (canvas + chat). Export the improved designs to seed Phase 3. Prep is done — 6 surfaces spec'd, the cockpit embodies them, brief reconstructed (`FINN_CLAUDE_DESIGN_BRIEF.md`).
5. **Phase 3 — Claude Code → Next.js app**
   Build the deployed Next.js app from the Claude Design export. **This is where the hard problems get solved properly:** live prices fetched server-side (no sandbox limit), real persistent state/backend, and the skills auto-loading. The destination.

**Naming:** "Phase 2" = step 4 (Claude Design). "Phase 3" = step 5 (Next.js). Steps 2–3 sit between Phase 1 and Phase 2.

## Current state (Jun 8, end of session)
- **Specs:** all intact + current — a full monolith-vs-skills audit confirmed nothing was abbreviated in the refactor.
- **State:** `FINN_STATE.json` rev4 (cash 16.62, post_sell[], Jun 8 rescore).
- **Prompt:** v3.2 (Phase 2 section + Jun 8 corrections + §CC priced-chip spec).
- **Visual:** v3.3 locked (tokens + 8 components + fv-* classes).
- **Surfaces rebuilt to spec this session:** quick dash, Control Center (priced jump chips: price · day% · zone dot), guide.
- **Sync:** Project current; **GitHub push pending** — queued for GNF (also the test of the new "github behind" flag).

## Open items (carry alongside Phase 2–3)
- Original working cockpit safe at repo commit `735b689`; the broken-pull rebuild is demoted (not load-bearing).
- **Portfolio:** ORCL earnings Wed Jun 10 AC (hold into print) · MRVL + APLD win reviews open (log, don't trim) · FOMC Jun 16–17 · NVDA ~21% over ceiling (trim watch) · AVGO below dip zone (top add when capital frees).
- **Track 1 — visual library:** Panel / Chrome / Table done; Bar / Sparkline / states / composites remain.
- **TODO HIGH:** button-route audit · dedicated reviews/exit/rescore surfaces · persistent state · position sizing · allocation audit · Engine v3 · Ledger v3 · APLD review · backtesting · Catalyst page · Finn EXPORT.

## The path from here
1. **`GNF`** — lock today's work: rev4 state + v3.2 prompt + frontmatter'd skills → GitHub; v3.2 prompt → Project. Confirm the "github behind" flag fires and clears.
2. **New session — Claude Design:** paste `FINN_CLAUDE_DESIGN_BRIEF.md`, attach the 4 files (visual system, cockpit, state, brief) + tab screenshots, say "start with home," design surface-by-surface, export.
3. **New session — Phase 3:** Claude Code, build the Next.js app from the export.
