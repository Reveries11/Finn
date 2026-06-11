# FINN — INTELLIGENCE & CAPABILITY ROADMAP
<!-- Companion to capabilities.md. Created 2026-06-09. The build plan beyond the current frontend phase. -->

> **Companion to `FINN_FRONTEND_ROADMAP.md`** (the Design → Phase 3 frontend/ship plan). This file = the *brain*; that one = the *body*. The "Phase 3 backend" below is the **same Next.js deploy** that roadmap builds.
> **STATUS (Jun 10):** Track A (**A1–A6**) is **BUILT ✅** — prompt v3.9, state rev15. A7 = start logging now. Track B remains Phase-3-gated.

## 0 · THE CONSTRAINT THAT SHAPES THIS ROADMAP
Finn-in-chat is **pull-based** — it acts only when messaged. It cannot watch the market, scan news, or alert between sessions. The roadmap therefore splits in two:

- **Track A — "smarter when you're here" (in-session).** Proactive, classified, materiality-ranked intelligence the moment a session opens. Buildable **now** via prompt + skills + state schema. No backend.
- **Track B — "watching when you're not" (autonomous).** Scheduled scans, continuous monitoring, push alerts, performance attribution. Requires the **Phase 3 backend** (the deployed Next.js service). The "flag news without asking" capability lives here.

---

## 1 · WHAT'S ALREADY STRONG (keep, don't rebuild)
- Dual CS/MS scoring, conviction-tiered sizing, defined dip zones + price targets, exit triggers (trim >30% over PT, +40% win / −20% loss reviews).
- Live-price integrity (never estimate, staleness checks, retries).
- Scenario engine: bull/base/bear with **probabilities + position $ impact + verdict + monitoring checklist**.
- Confidence tagging (CONFIRMED / FINN PROJECTION / ~score) and source-cited news.
- Smart-money (13F + congress), earnings-imminent flags, post-sell monitoring.
- Read-through reasoning (e.g. a competitor's deal → implications for held names) — done manually; systematize it (A2).
- Macro tracking (Fed, rates, CPI, PCE, jobs, FOMC).

---

## 2 · CAPABILITY SPECS

### TRACK A — in-session (buildable now)

**A1 · Recommendation transparency**
Every ADD/HOLD/TRIM/WATCH carries a standard structure: the call + confidence (/100) + 2–3 key drivers (each tagged **fact / inference / opinion** with source + date) + the main assumption + **what would flip the call** + the key risk. Formalizes what the scenario verdict already does, applied to *every* rec. (Captures most of the "decision journal" value without a separate journal.)

**A2 · News-intelligence engine** *(the core upgrade)*
- **Standing scan list** per session: each holding's news, sector/competitor news, regulatory (export controls esp.), the macro calendar, smart-money filings.
- **Classification taxonomy:** earnings · guidance · M&A · regulatory · analyst rating · competitive · supply-chain · management · macro.
- **Materiality scoring:** rank each item by how much it actually moves a held thesis — surface the few that matter, suppress noise.
- **Thesis linkage:** map news to each position's `breaks_if` / drivers explicitly.
- **Read-through detection:** news on a *non-held* name that affects a held one (e.g. a rival's design win).
- **Net assessment:** for each material item — bull or bear, magnitude, and *does it change the call*.
- **"What changed since last session" diff** at session open.

**A3 · Portfolio risk layer**
Single-name %, top-3 %, **cluster/theme exposure**, a correlation read ("how many *real* bets is this"), portfolio beta, and proximity to the soft-floor/concern thresholds. Plus **portfolio-level stress tests** ("if AI-semis −10%, the book does X") — not just per-stock scenarios. A risk line in the Market Brief + a dedicated risk surface.

**A4 · Company fundamentals + valuation** *(grounds the CS score)*
Per-position snapshot: revenue growth, margins, FCF, debt + valuation (P/E, EV/EBITDA) **vs the name's own historical range** (percentile, not just absolute). Feeds and disciplines the conviction score so CS isn't pure narrative. (FMP Starter covers fundamentals/ratios/annual + DCF; quarterly statements are Premium.)

**A5 · Market structure + macro linkage**
Add market-breadth (advance/decline, % above 200-dma), VIX, and a high-yield credit-spread read as a risk-off early-warning. Add GDP (low-frequency). The bigger win: **macro→position linkage** — auto-translate a macro move into which holdings are exposed ("10Y +15bp → rate-sensitive names X/Y").

**A6 · Forward catalyst calendar**
One unified dated view: earnings, CPI/PPI, FOMC + dot plot, conferences (e.g. investor days), lockups. Drives the scenario auto-fire and the "Watching" row.

**A7 · Calibration log** *(start now — cheap, compounding)*
Log every dated call + its confidence + a benchmark NAV-vs-SPY/QQQ mark. Pure data capture in-session; it's the fuel B2 needs later to prove whether the scores actually work.

### TRACK B — backend (Phase 3-gated)

**B1 · Persistent automated state** — ends the manual two-place re-upload (the drift risk). *Foundational; unblocks B2/B3/B4.* *(= **D2** in `FINN_FRONTEND_ROADMAP.md`.)*

**B2 · Performance attribution / score calibration** — alpha vs SPY/QQQ, win rate, avg win/loss, and **do high-CS names outperform low-CS names**. Runs on A7's log. Makes the scoring falsifiable.

**B3 · Continuous monitoring + out-of-session alerts** — scheduled scans run the A2 engine + the rules and *push* (PT breach, earnings tomorrow, thesis-break trigger, smart-money convergence) without being asked. The real "auto-flag."

**B4 · Multi-portfolio / export decoupling + auth** — configurable positions/zones/rules, no hard-coded tickers; the foundation for sharing Finn.

**B5 · Data redundancy** — a backup feed so FMP isn't a single point of failure; graceful degradation.

**B6 · Tax-lot management** — FIFO/lot tracking, short/long-term, wash-sale awareness, realized-tax estimate. Schema can start now; full value at scale.

---

## 3 · SEQUENCED ROADMAP

**Phase 2.5 — in-session intelligence — ✅ A1–A6 DONE (Jun 9); A7 = start logging now:**
1. **A1** Recommendation transparency (cheapest, highest trust-per-effort)
2. **A2** News-intelligence engine (the headline upgrade)
3. **A3** Portfolio risk layer
4. **A7** Calibration log — *start logging immediately* so B2 has history
5. **A4** Fundamentals + valuation → feeds CS
6. **A5** Market structure + macro linkage
7. **A6** Catalyst calendar

**Phase 3 — backend (runs on the Next.js service built in `FINN_FRONTEND_ROADMAP.md`):**
1. **B1** Persistent automated state *(do first — unblocks the rest)*
2. **B2** Performance attribution + **B3** continuous monitoring / alerts
3. **B4** Multi-portfolio / export decoupling
4. **B5** Data redundancy · **B6** tax-lot management

**Dependencies:** A7 must start now (feeds B2). B1 unblocks B2/B3/B4. A2/A3/A4 enrich the state schema that B1's backend persists.

---

## 4 · THE EARLIER GAP ITEMS, MAPPED
- Performance attribution / score calibration → **A7 (log now) + B2 (engine later)**
- Concentration + correlation risk → **A3**
- Persistent automated state → **B1**
- Export / multi-portfolio → **B4**
- Tax-lot management → **B6**
- Thesis-health monitoring → **A2 (thesis linkage) + B3 (auto-trigger)**
- Out-of-session alerting → **B3**
- Second data source → **B5**
- *(Decision journal — excluded per direction; its value is largely covered by A1 + A7.)*

---

## 5 · DELIBERATELY DESKILLED (low ROI for this book)
- **DCF as a standard per-name input** — too noisy for hypergrowth AI names; use sparingly, prefer valuation-vs-own-history (A4).
- **Product-launch prediction** — not systematically forecastable; catch via the news engine (A2).
- **Deep liquidity / credit modeling** — one HY-spread read is enough (A5); don't overbuild.
- **Options flow as a primary signal** — noisy; confirmation only.
