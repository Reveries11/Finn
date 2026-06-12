# FINN — FRONTEND & SHIP ROADMAP (Design → Phase 3)

> v2 · consolidated 2026-06-10 · the plan to take the Finn frontend from "working in chat" to a shipped Next.js app.
> **Companion to `FINN_ROADMAP.md`** (the Intelligence & Capability roadmap). This file = the *body* (frontend / product / ship). That file = the *brain* (in-session intelligence + the autonomous backend). They share ONE Phase 3 — the Next.js deploy.
> Source of truth for *build sequencing*. Portfolio data stays in `FINN_STATE.json`; structure rules in `FINN_SYSTEM_PROMPT.md`.

---

## 0. WHERE WE ARE (Jun 10)

| Layer | Status |
|---|---|
| Phase 1 — artifact cockpit (`finn_cockpit.jsx`) | ✅ done (now a design ref only) |
| GitHub foundation (`github.com/Reveries11/Finn`) | ✅ done (backup/history) |
| Skills refactor (lean core + 8 modules) | ✅ done |
| A1–A6 intelligence layer (rec contract → catalysts) | ✅ done · prompt **v3.9** · state **rev15** |
| Phase 2 — Claude Design → Code | 🟡 in progress — 28-surface "Command Deck" explored; depth pass queued |
| Phase 3 — Next.js via Claude Code | 🔴 not started — **the destination** |

**Render standard today:** v3.3 locked (IBM Plex Sans/Mono · violet/green/red/teal · dark terminal · 8 components in `FINN_VISUAL_SYSTEM_v3_3.html`). Chat-Finn renders everything inline via `show_widget`.
**Candidate forward standard:** the "Command Deck" system from the Jun9 Design review (Space Grotesk + JetBrains Mono · mint/coral/gold · the Observatory orbital map). **Adoption is an OPEN DECISION** (see §1).

---

## 1. THREE KEYSTONE DECISIONS (resolve before any more pixels)

Everything downstream forks on these. Lock them this week.

**D1 — Design language: v3.3 vs "Command Deck v4".** ✅ **RESOLVED Jun 10 → Command Deck v4** (freeze v3.3 for chat; v4 = the Phase-3 standard).
Running two systems = guaranteed drift + double maintenance (the exact pain this whole architecture fights).
- **Option A (recommended): adopt Command Deck as the single forward standard (v4).** Formalize it into a token + component spec this week (`FINN_VISUAL_SYSTEM_v4.html`), the same way v3.3 was formalized. Make it THE Phase 3 design language. Freeze v3.3 as-is for chat renders until Phase 3 supersedes them — i.e. don't re-skin chat by hand twice; pour all visual energy into v4.
- Option B: stay on v3.3 everywhere. Lowest risk, but leaves the better/more-complete vision on the floor.
- Option C: hybrid (v3.3 chat, Command Deck app) — only viable if formalized so they share tokens; otherwise = drift.
- **Rationale for A:** Phase 3 is a fresh build = the zero-cost moment to cut over to the better language. The 28-surface Command Deck is the more complete vision and you liked it in review.

**D2 — Phase 3 persistence model.** ⏸️ **PARKED Jun 10** (revisit later; working default = hosted JSON blob).
- Vercel's runtime filesystem is read-only, so trades/reconciles can't write back to a committed JSON at runtime.
- **Recommended: a lightweight hosted store** (Vercel KV / Supabase / Turso) holding the `FINN_STATE` JSON blob, **seeded** from the committed `FINN_STATE.json`. Same schema you already have — just hosted instead of uploaded. *(This is **B1** in `FINN_ROADMAP.md` — both plans independently land on it as the upload-dance killer.)*
- **Payoff: this ends the "upload dance."** The #1 operational pain (drift from manual re-uploads — root cause of the Jun5→6 freeze) is solved structurally: the app reads/writes the hosted state directly.

**D3 — Scope freeze.**
The 7-tab core + the handful of missing dedicated surfaces is already a large build. **No net-new surfaces until the core 7 are deep and shipped.** Park "nice to have" ideas in TODO.

---

## 2. WORKSTREAMS

> "Blocked?" = needs Claude Design (capped till Sat). Everything else is doable NOW in chat-Finn / Claude Code.

### WS-A · Design Language & Visual System
- [ ] **D1 decision** (above)
- [ ] Draft `FINN_VISUAL_SYSTEM_v4.html` — token set (color/type/spacing/radius) for the chosen language · *not blocked (spec)*
- [ ] Complete the component library (Track 1):
  - P1: **Panel · Chrome · Table** primitive
  - P2: **Bar · Sparkline · empty/skeleton states**
  - P3: composites + iconography
- [ ] Phase-3 backfill list (normalize home/dash/guide/scenario: lowercase-mono command labels, control radius 8, one-primary-per-view)
- *Visual builds themselves = blocked till Sat; the token/spec + component contracts = do now.*

### WS-B · Data Spec (the linchpin)
- [ ] **Location-by-location data spec for all surfaces** — every cell on every surface: source (`FINN_STATE.json` field vs FMP endpoint vs derived), format, and the 5 states (skeleton/pulling/ready/partial-feed/feed-down/empty). · *not blocked*
- [ ] Derivation catalog: NAV, weights, P&L, PT-progress, zone-dot logic, day-Δ anchor — defined once, reused by chat + app.
- [ ] This is the contract that makes the Design handoff unambiguous AND the Phase 3 build buildable. **Highest leverage this week.**

### WS-C · FMP Integration
- [ ] FMP capability map locked (Starter plan): ✓ quote (single), news, screener, earnings-dates, analyst PT+grades, insider, senate, SEC-filings, profile, annual financials, RSI, econ-calendar. ✗ batch-quote, quarterly statements (Premium).
- [ ] **Phase 2 (chat):** Finn pulls per-ticker, bakes into the render = live-on-render (current, working).
- [ ] **Phase 3 (app):** server-side `/api/portfolio` route — see §4. Holds the key server-side, fans out parallel single-quotes (batch is gated), caches ~30–60s, computes NAV/weights/zones server-side, returns one priced payload. · *not blocked — spec now, build in Phase 3*
- [ ] Fallback contract: feed-down → `—` cells + manual `prices:` override path.

### WS-D · Surface Depth ("go in-depth on all platforms")
7-tab nav (locked): `home · positions · watchlist · ledger · trades · earnings · scenario`. Deepen each + add the missing dedicated surfaces.
- [ ] **home** — interactions (hover/active states, refresh affordance), action-queue dedupe/severity polish
- [ ] **positions** — position-detail drill-in: **News + Fundamentals tabs**, live-watch, generated decision note
- [ ] **scenario** — A1 rec inline + stress tests + related-names rail + what-if controls (most-synthesized surface)
- [ ] **watchlist** — radar ladder + post-sell monitor (active re-entry vs monitor-only)
- [ ] **ledger / trades** — Table primitive (sortable, tier-grouped) + realized-P&L tiles
- [ ] **earnings** — calendar + per-name last-4-qtrs + <7d flagging
- [ ] Missing dedicated surfaces (TODO HIGH): **reviews · exit · rescore · NVDA-sizing · Catalyst page · Finn EXPORT**; (LOW): **Thesis · Risk**
- [ ] Cross-target action binding verified: chat=`sendPrompt` · cockpit=tab/state · Next.js=router/API (per spec)
- *Surface depth = spec now (what each contains + data + interactions), visual build Sat+.*

### WS-E · Phase 3 App (Next.js via Claude Code)
- [ ] Architecture doc (§4) finalized · *not blocked*
- [ ] Scaffold: Next.js app-router + Tailwind/CSS-modules + the v4 component library port
- [ ] Routes: `/ /positions /watchlist /ledger /trades /earnings /scenario` + `/positions/[ticker]` drill-in
- [ ] `/api/portfolio` (FMP server route) + state read/write to the hosted store
- [ ] SWR/React-Query polling + "live as of HH:MM" stamp + manual refresh
- [ ] Deploy (Vercel) · env var for FMP key · private/personal
- [ ] **Parity gate** before it becomes primary (§7)

### WS-F · Intelligence & Ops
- [ ] **A7 calibration log** — start now: every call already logs to `calls_log` (A1); A7 adds outcome-scoring (was the call right? confidence calibrated?). Cheap to start, compounds. · *not blocked*
- [ ] **Button-route audit** — verify every interactive element's binding across surfaces. · *not blocked*
- [ ] Backtesting harness (TODO HIGH) — later
- [ ] **Demo/fixture dataset** — frozen prices + state so the app can be built/tested without burning live FMP calls and screenshots are deterministic. · *not blocked*

---

## 3. THE PLAN, BY SPRINT

### Sprint 0 — NOW → Saturday (Design BLOCKED) · "arrive with everything locked"
The scarce resource is Design usage — never spend it figuring out *what* to build. This sprint produces the specs so Saturday is pure execution.
1. Lock **D1 / D2 / D3** (the keystone decisions)
2. Draft `FINN_VISUAL_SYSTEM_v4.html` token spec (if D1 = Command Deck)
3. Write the **Data Spec** (WS-B) — location-by-location, all surfaces
4. Write the **FMP integration spec** (WS-C) — the `/api/portfolio` contract
5. Write the **Phase 3 architecture doc** (§4)
6. Write **surface-depth specs** (WS-D) — what each deepened surface/tab contains + interactions
7. Stand up the **A7 schema** + run the **button-route audit** + build the **demo dataset**

### Sprint 1 — Saturday+ (Design UNBLOCKED) · "execute the visuals"
8. Build the v4 component library visuals (Panel/Chrome/Table → Bar/Sparkline/states → composites)
9. Execute the surface depth pass, **surface-by-surface against the locked specs**
10. Build the 28-surface system / Observatory map to v-final
11. Backfill home/dash/guide/scenario to the v4 normalization list

### Sprint 2 — Phase 3 kickoff (Claude Code)
12. Scaffold the Next.js app + port the v4 design system
13. Stand up the hosted state store, seeded from `FINN_STATE.json`
14. Build `/api/portfolio` (server-side FMP) + wire the surfaces to it
15. First working deploy (read-only parity with chat surfaces)

### Sprint 3 — Phase 3 hardening
16. Writes (trades/reconciles) → hosted store (kills the upload dance)
17. Refresh model, mobile/responsive pass, auth
18. Wire the A7 calibration loop into the app
19. **Parity gate** → app becomes primary; chat-Finn stays the quick-command layer

---

## 4. PHASE 3 DEEP-DIVE (how we actually get there)

Phase 3 = a Next.js app, built with Claude Code, that solves the two things chat/artifacts can't: **server-side live prices** and **persistent state**.

**4.1 Data/state layer**
- `FINN_STATE.json` becomes the app's seed. Same schema, hosted in a lightweight store (Vercel KV / Supabase / Turso) — see D2.
- App reads the blob on load; writes (a trade, a reconcile, a score) patch it. **No more re-uploading files.**
- Keep the canonical single-file model — just hosted, not manual.

**4.2 FMP server route — the reason Phase 3 exists**
- `GET /api/portfolio`: reads positions from state → **fans out parallel single-quote calls** (`Promise.all` over the ~12 tickers, since batch is Premium-gated) → computes NAV / weights / open-P&L / PT-progress / zone-dots **server-side** → returns one priced payload.
- FMP key lives in a server env var — never reaches the client, no CSP issues (the chat artifact's core limitation, gone).
- **Cache** the FMP responses ~30–60s so client polling doesn't burn the Starter rate limit.
- `GET /api/news`, `/api/earnings`, `/api/rsi` similarly proxied.

**4.3 Design system port**
- The chosen v4 language → a real React component library (Tailwind or CSS modules), ported **once** from the canonical token file. Locked tokens = no bespoke CSS, same rule as today.

**4.4 Routing**
- App-router routes mirror the 7-tab nav; `/positions/[ticker]` = the position-detail drill-in; `scenario` is generated per-request (routes the heavier model when called via the app's compute path).

**4.5 Refresh model**
- SWR/React-Query polling `/api/portfolio` on an interval + a "live as of HH:MM ET" stamp + manual refresh. (Default still "live as of last pull," not a streaming ticker — but the app *can* offer opt-in polling, which chat can't.)

**4.6 Deploy**
- Vercel (native Next.js), private/personal, FMP key as env var. Cheap/free at this scale.

**4.7 Why this ordering**
- Server-side FMP + hosted state are the *whole point* — but they're meaningless without the surfaces + design language locked first. Hence: specs (Sprint 0) → visuals (Sprint 1) → app (Sprint 2–3).

**4.8 The bigger payoff (ties to the capability roadmap)**
- The same deployed Next.js service is the foundation **Track B** in `FINN_ROADMAP.md` runs on: scheduled scans, **out-of-session push alerts** (PT breach · earnings tomorrow · thesis-break · smart-money convergence), and **performance attribution** (do high-CS names actually outperform?).
- So Phase 3 isn't just a prettier, persistent cockpit — it's the thing that lets Finn **watch the market when you're not here.** That's the real prize, and it's why the backend is the destination, not the decoration.

---

## 5. THE NOW-vs-SATURDAY CUT

**DO NOW (no Design needed — all of Sprint 0):**
- Keystone decisions D1/D2/D3
- Data Spec (every surface, every field → source + states)
- FMP integration spec / `/api/portfolio` contract
- Phase 3 architecture doc
- Surface-depth specs (what each tab/surface deepens into)
- `FINN_VISUAL_SYSTEM_v4.html` token draft (if D1 = Command Deck)
- A7 calibration schema · button-route audit · demo dataset

**NEEDS DESIGN (Saturday+):**
- The actual visual builds / component visuals
- The Observatory orbital map
- The 28-surface polish + the home/dash/guide/scenario backfill

---

## 6. RECOMMENDATIONS (Finn's read — the "what am I missing")

1. **Resolve the design fork before any more pixels.** One forward standard. Two systems = drift + double work.
2. **Spec before Design, always.** Limited Design usage is the bottleneck — arrive with locked data + layout specs so Design = execution, never discovery.
3. **The Data Spec is the linchpin** — it's the contract for both the Design handoff and the Phase 3 build. Do it this week.
4. **Decide persistence early** — it shapes the entire app. Hosted JSON blob (seeded from `FINN_STATE.json`) is the clean answer and kills the upload dance.
5. **Build a demo/fixture dataset** so Phase 3 is buildable/testable without burning live FMP calls (deterministic screenshots + tests).
6. **Hold scope.** Deepen + ship the core 7 tabs before adding surfaces. Park ideas in TODO.
7. **Start A7 now** — calls already log (A1); outcome-scoring is a cheap add that compounds into a real edge.
8. **Phase 3 is the forcing function** that retires three current frictions at once: CSP price-fetch limits, manual re-uploads, and chat-render ephemerality. Keep it the north star.

---

## 7. DEFINITION OF DONE (parity gates)

**Design "done" (end Sprint 1):** all 7 tabs + the missing dedicated surfaces built in v4, every component in the library, every cell mapped to the Data Spec, all states handled.

**Phase 3 "primary" (end Sprint 3):** feature parity with the chat surfaces · live server-side prices · persistent writes (trades/reconciles) · mobile-usable · A7 loop wired · deployed. Until then, chat-Finn stays the daily driver.
