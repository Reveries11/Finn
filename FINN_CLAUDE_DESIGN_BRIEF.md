# FINN — CLAUDE DESIGN BRIEF (v3 · visual-system-agnostic)
<!-- Phase 2 of the Finn frontend. Paste into a Claude Design canvas.
     v3 (2026-06-09): the VISUAL SYSTEM IS INTENTIONALLY LEFT OPEN — Design defines the look.
     This brief specifies WHAT to build (surfaces + the intelligence layer + data + behavior), not the styling.
     Covers the full system incl. A1–A6. Supersedes v1/v2. -->

## 0 · HOW TO USE THIS
**Goal:** design the complete Finn frontend in Claude Design — *your* visual language — then **export → Phase 3 (Claude Code, Next.js)**.

**Attach alongside this brief:** `FINN_STATE.json` rev13 (the data shape + real values to populate with) and any screenshots of your current build to iterate on. **Do NOT anchor to a prior visual system** — the look is yours to define here.

**Build order — one slice at a time:**
Market Brief → Home → Positions (+ detail) → the intelligence surfaces (News, Risk, Macro, Scenario, Fundamentals) → Ledger / Trades / Engine / NAV curve → Planning (Gameplan, Catalyst Calendar, Weekly, Watchlist, Exit) → System (Guide, Reports). **Build one data-dense surface early (Ledger or Risk) to pressure-test the aesthetic on utilitarian content, not just the marquee views.**

---

## 1 · WHAT FINN IS
A persistent portfolio-**intelligence** co-pilot (not a dashboard) for an active, concentrated AI-infrastructure portfolio (~$28K → $50K → $100K). The differentiator is the reasoning layer (§4), not the tables.

---

## 2 · LOOK & FEEL (open — only the non-negotiables)
The visual system is yours to design. The only hard, *functional* principles:
- **Numbers / tickers / prices are always monospace + tabular** (they must align and never reflow).
- **Price integrity:** any price-bearing cell renders a placeholder (`—`) until the live feed fills it — never show an estimated price.
- **Conviction is a first-class visual signal:** positions are tiered (C5 / C4 / C3) and every scored item carries **CS + MS** (0–100); use one consistent encoding for tier throughout.
- **Lead with intelligence:** the reasoning (§4) is the hero; tables serve it.
- Beyond these, the aesthetic — palette, layout metaphors, motion, signature views (e.g. an orbital portfolio map, an editorial brief) — is open. One caution: if a single hue is both your brand accent *and* your "gain/up" color, keep them distinguishable.

---

## 3 · INTERACTION + STATE MODEL
- **Semantic actions, bound per target:** every control is an *intent* — in chat = `sendPrompt`, in a prototype = local state, in Next.js = router/API. Design the intent.
- **States, every surface:** skeleton → pulling → ready · partial-feed (per item) · feed-down (manual entry) · empty.
- Tap-throughs: a position → its detail (scenario / news / fundamentals / live watch).

---

## 4 · THE INTELLIGENCE LAYER (A1–A6) — the hero
**Market Brief — the standing lead block (Home, Quick Dash, Full Dash).** Seven rows: **The Tape** (market structure) · **The Book** (key finding) · **News** (classified) · **Calls** (1–3 recs, contract format) · **Watching** (catalysts) · **Also** · **TL;DR** (one-liner).

**A1 · Recommendation Contract — a FORMAT used wherever a call appears** (Scenario, Brief Calls, position rec, alerts). Every ADD/HOLD/TRIM/WATCH shows: **CALL + size · CONFIDENCE nn/100 (band) · basis** → drivers tagged **DATA** (sourced) / **READ** (inference) / **TAKE** (judgment) → **ASSUMPTION · FLIP · RISK.** Compact view = the head; full contract on tap.

**A2 · News Intelligence.** Classified (earnings/guidance/M&A/regulatory/rating/competitive/macro) + **materiality-scored for the book** (HIGH/MED/LOW) + **read-through** (a rival's news → a held name) + net-assessment (bull/bear + *does it move the call*) + a **"what changed since last session"** diff. Rank by what moves the book; don't dump headlines.

**A3 · Portfolio Risk / Allocation.** Single-name %, top-3/5, **theme-cluster %** (the key view — the book is ~71% AI-semis even though no name tops 20%), correlation read, beta, soft-floor proximity, and **portfolio stress tests** (AI-semis −10%, broad −10%, AI-derate −20%).

**A4 · Fundamentals + Valuation.** Per-position revenue growth, margins, FCF, debt, dilution + P/E, EV/EBITDA, PEG vs the name's own range — a panel on the position detail; the basis for the CS score.

**A5 · Market Structure + Macro.** Tape health (SPY/QQQ, VIX, HY credit, breadth → **systemic vs sector-specific**) + **macro→position linkage** (a rate spike hits NOW/ORCL/MRVL; an AI-capex pause hits the ~71% cluster).

**A6 · Forward Catalyst Calendar.** One dated view — earnings + macro (CPI/PPI/PCE/jobs/FOMC) + conferences (investor days) + index adds + lockups + post-sell expiries. Drives scenario auto-fire + the Watching row + a "next catalyst" tile.

---

## 5 · THE SURFACES (full inventory)

**Cockpit / daily**
- **Home** — the hub: status strip (NAV · →$50K · Realized · Scores · Next catalyst) → **Action Queue** (recommended actions, A1 format) → command bar (jump anywhere) → jump-to-position chips (priced, conviction-tinted) → fired-today → flight deck (top-5) → category tiles.
- **Quick Dash** — daily driver: Market Brief → snapshot → alerts → focus cards → engine → gameplan → radar → flex → launcher.
- **Full Dash** — the deep multi-section view.

**Portfolio**
- **Positions** — conviction-tiered card grid; card = ticker/name, price/cost, P&L, CS/MS, **rec badge**, **PT box**, **dip-zone box**, progress bar, flags. → **Position detail** (scenario · news · fundamentals · live watch).
- **Ledger** — the sortable, tiered table. **Engine** — capital efficiency (CS + MS per name + rationale). **NAV Curve** — equity curve vs milestones. **Trades** — chronological + realized tiles.

**Analysis**
- **Scenario** (bull/base/bear + $ impact + **portfolio stress** + verdict + monitoring) · **Risk/Allocation** (A3) · **News** (A2) · **Macro/Market Structure** (A5) · **Fundamentals** (A4) · **Dip Check** (owned vs dip zones + RSI) · **Smart Money** (13F + congress) · **Reviews** (win/loss) · **Rescore** (CS/MS) · **Blindspots** (contrarian self-check).

**Planning**
- **Gameplan** (active vs conditional entries + capital budget) · **Exit** (per-position triggers) · **Catalyst Calendar** (A6) · **Weekly Overview** · **Watchlist** (radar T1/T2 + post-sell monitor).

**System**
- **Guide** (newcomer front door) · **Reports / Finn Export** · **Sync** (state status).

---

## 6 · DATA SHAPE
One canonical `FINN_STATE.json` (rev13). Sections: `anchors` · `portfolio` · `positions` (+ cost, conviction, cs/ms, pt, dip zone, triggers, lots) · `fmp_targets` · `fundamentals` (A4) · `trades` · `nav_history` · `scores` · `thesis` · `earnings` · `catalysts` (A6) · `reviews` · `watchlist` · `clusters` + `risk` (A3) · `macro` (+ `market_structure` + `macro_sensitivity`, A5) · `news_watch` + `last_scan` (A2) · `calls_log` (A1) · `open_decisions`. **Live prices come from the FMP feed, not the file.**

---

## 7 · GUARDRAILS
- Numbers always monospace/tabular; price cells blank until the feed fills them.
- Primary nav = `home · positions · watchlist · ledger · trades · earnings · scenario`; everything else reachable from the Home category tiles + the command bar.
- Conviction tiers encoded consistently everywhere.
- Lead with the **intelligence layer** (§4) — it's the point. The visual language is otherwise yours.
