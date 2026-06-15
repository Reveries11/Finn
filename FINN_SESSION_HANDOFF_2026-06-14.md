# FINN — SESSION HANDOFF · 2026-06-14 (GNF)

**Session type:** Claude Design build pass (surface design + engine decisions). No trades, no NAV change.
**State:** FINN_STATE.json portfolio data UNCHANGED — still rev25, marks = Fri Jun 12 close.
**Handoff rev target:** rev26 (session_handoff refresh + queued data pass + pending NOW zone).

---

## 1 · What happened

Worked the Claude Design canvas top-to-bottom and **shipped + reviewed 13 surfaces**, all in the v3.3 dark-terminal system (IBM Plex Sans/Mono, signal-only color, `fv-*` components). Each was reviewed via the locked workflow: paste a **starter** (context primer) → feed numbered **paste-ready change-messages** → re-export → verify. Two engine decisions came out of the Gameplan work (FUND call type; below-zone rule).

The design language is **v3.3** — the `FINN_DESIGN_CHANGE_SHEET.md` header still says "Command Deck v4," which is **stale** and needs reconciling to v3.3.

---

## 2 · Surfaces shipped (13) — all reviewed & locked

| Surface | Outcome |
|---|---|
| **Risk** | Two-ring cluster — 84% AI core (binding) / 91% AI-exposed (incl. power); theme-first hierarchy; theme bars on a 0–100 baseline + 50% flag + 3-way legend; single-name demoted to a compact strip. |
| **Performance** | Equity curve + trade log + reviews merged; EOD-anchored as the settled track record (labeled "vs Jun 10 EOD"); reviews list wired to lesson text; FINN PROJECTION-tagged stress. |
| **Glide Path** | Projection cone, PROJ pill, live-anchored; two-ring required-return legend reconciled; base-target relabel. |
| **Brief** | Locked 7-row; "The Book" snapshot added; Also + TL;DR rows; News = the one **live-FMP-pull** row (provenance + live/sample tags). |
| **Home (v4)** | Pure dashboard (see §4). Observatory + Action Queue + Fired Today; status strip on live basis. |
| **Observatory** | 4 lenses — ladder / distance / stream / orbital; all 12 names present in each; stream sector-band bug fixed (AI Infra restored → sums to 100%). |
| **Ask Finn** | Chat shell (mock); identity + on-thesis sample + Phase-3 honesty. Sidebar route (see §4). |
| **Quick Dash** | Hero = NAV · day · vs VOO · from-HWM; TL;DR synthesis line added. |
| **Scenario** | Bull/base/bear + prob-weighted EV (relabeled "+$X to the book · +Y% blended target return"); probability ribbon legible + sums to 100. |
| **News** | Impact-tiered feed (Moves the Book / Context); per-item materiality + price reaction + sentiment edge-bar + provenance; held-vs-watchlist markers. |
| **Smart Money** | 13F / insider / street Δ vs stance; aligned/diverging; **2+-fund convergence** surfaced; source-class badges (dual-badge reconciled); 13D→13G wording. |
| **Blindspots** | Contrarian self-check; 84% concentration reconciled to Risk's two-ring; per-position break conditions = the live sell-triggers. |
| **Gameplan** | §1 Actionable Now (triggers, funding-blind) + §2 Funding (dry-powder, paths) + Capital Gap section (deposit ladder); ETN §1/§2 consistency fixed; trim-capacity tied to the 20% cap. |

**Remaining 6 surfaces:** Catalysts · Watchlist · Exit · Sync · Reports · Guide.

---

## 3 · Decisions LOCKED this session

- **Home = pure dashboard.** v1 launcher (command bar, flight deck, category tiles) retired; navigation is the left sidebar (confirmed it fully covers nav). Control Center v1 spec **superseded**.
- **Ask Finn = its own sidebar route**, placed under Quick Dash, assistant-accented; a full chat surface (mocked in canvas, wired Phase 3). ⌘K reverts to a **command/jump palette**. Clean split: sidebar = conversation, ⌘K = commands.
- **Quick Dash hero** = NAV · day · vs VOO · from-HWM + a TL;DR line (swapped out the buying-power tile).
- **NAV-base convention (app-wide):** LIVE everywhere (NAV, →$50K = 59.9%, day, from-HWM) **except Performance**, which stays EOD-anchored as the settled record. VS VOO = **+$545** (EOD-anchored) everywhere; the live-basis +$1,804 is retired.
- **FUND promoted to a 4th call type** (Hold/Add/Trim/**Fund**) — see §6.

## 3b · Decisions PENDING (need sign-off before they bake)

1. **NOW dip-zone refresh** — proposed **$96–100** (50-day + tested $99–103 shelf) with a deeper add at **$88–92** (spring base). Old $115–120 is stale (set mid-March at $112–117). *Pulled from FMP this session: NOW spiked to $135.86 Jun 1, round-tripped to $102.15 Jun 12; sits at cost ($101.68).*
2. **Below-zone rule (3-state)** — actionable if < ~one zone-width below + thesis intact · BELOW·REFRESH if further (stale zone) · BELOW·BROKEN if a break fired (→ exit). Default FUND threshold = short by ≥ one full standing add.

---

## 4 · Home v4 structure (reference)

chrome (pill = `PORT.navLiveTime`) → status strip (NAV · →$50K LIVE · buying power · realized · unrealized · next-earn) → **Fired Today** (today's market-driven auto-fires only) → **Observatory** (whole 12-name book, 4 lenses) → **Action Queue** (standing to-dos, reviews-first). A name shouldn't appear in both Fired Today and the Queue unless it needs two different actions.

---

## 5 · Queued file work (next regen / prompt edit)

**A · `finn-data.js` data pass (rev25 → rev26):**
- `REVIEWS` slice from `FINN_STATE.reviews` (entries: ticker · type · outcome · realized · lesson + `patterns[]`) → Performance lessons list
- `BRIEF.also` + `BRIEF.tldr` (the two missing Brief rows)
- `BRIEF.tape.stats` SPY sub → "S&P 500"
- News: `materiality` field per item + last-viewed timestamp
- Smart-money / 13F slice (institutions · insider · street Δ · per-name alignment · signal-feed source class · 2+-fund convergence flag) + 13D→13G wording
- **NOW dip zone $115–120 → [pending sign-off]**

**B · `FINN_SYSTEM_PROMPT.md` (operative — do soon):**
- FUND call type (enum + trigger logic + sizing + surfaces)
- Below-zone rule (3 states)
- Home v4 = dashboard; command bar/flight-deck/tiles retired; Control Center v1 superseded
- Ask Finn = sidebar route under Quick Dash; ⌘K = command palette
- Quick Dash hero + TL;DR

**C · App-chrome batch:** global ticker-tape badge "EOD" → `PORT.navLiveTime` (last EOD holdout).

**D · Doc reconciliation:** `FINN_DESIGN_CHANGE_SHEET.md` "Command Deck v4" header → v3.3; mark the 13 surfaces done; note the Risk ↔ Blindspots ↔ Brief 84%/91% concentration cross-link (keep all three consistent on a thesis change).

---

## 6 · FUND call type (engine spec)

The only call that adds to conviction **without a forced trim**. Fires when: actionable in-zone/armed setups exist **and** dry powder (cash + discretionary-trim capacity) is short by a material gap (proposed ≥ one full standing add) **and** thesis intact. Does **not** fire just because cash is low — only when low cash blocks a real setup. Carries a deposit-ladder ($-tiers, cheapest-to-fund first, flagging which tier "clears the queue") + confidence. **Informational/opt-in tone, never pushy.** Appears on: Gameplan (Capital Gap), Calls (Brief / Home Action Queue / Scenario verdict), Quick Dash TL;DR. Visual renders when those surfaces rebuild with live data (Phase 3).

---

## 7 · Reminders (newly escalated — both imminent)

- **Phase 3 (Claude Code → Next.js app):** unblocks once the remaining 6 surfaces are done. Start a **fresh dedicated session**. First, answer the 3 gating decisions: (1) state store = Vercel KV blob? (2) chat-Finn + app share the one hosted store (read/write via API)? (3) auth = single-password / Vercel gate? Kickoff: `CLAUDE.md` build brief + typed `FINN_STATE` schema; build order = state contract + derived selectors → store+seed → `/api/portfolio` (server FMP fan-out) → surfaces → writes → refresh/responsive/auth → parity gate.
- **Obsidian:** user sets up; scaffold instructions already discussed. Queue the actual setup now that the build is near — vault for thesis / reviews / research notes that the state file links out to.

---

## 8 · State integrity

- Portfolio data unchanged (rev25, Jun 12 close). Realized $2,528.29. Cash $49.47.
- NAV: live mark $29,964 (Jun 12 close); settled EOD anchor Jun 10 $28,704.58 = 57.4% to $50K / +4.4% inception / −9.2% from HWM $31,625.
- **Recon still UNANCHORED:** Jun 11 + Jun 12 broker EOD closes uncaptured — do not backfill without broker values.

---

## 9 · Next session

1. Sign off the **NOW dip zone** + the **below-zone rule** → I bake both (data + prompt).
2. Build the remaining **6 surfaces** (Catalysts · Watchlist · Exit · Sync · Reports · Guide) — starter + change-list each.
3. Regenerate **finn-data.js → rev26** (the §5A pass) + patch **FINN_SYSTEM_PROMPT.md** (§5B) once the two sign-offs are in; reconcile the change sheet; run the chrome batch.
4. Capture **Jun 11 + Jun 12 broker EOD** to clear the recon flag.
5. When all 19 surfaces are done → **Phase 3 kickoff** (fresh session) + **Obsidian** setup.
