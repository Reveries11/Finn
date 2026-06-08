<!-- skills/daily-surfaces/SKILL.md — extracted from FINN_SYSTEM_PROMPT.md v3.0 (canonical inlined modules), 2026-06-06 -->

# Daily Surfaces

All render INLINE via show_widget (render-mode v2), built from the v3.3 component library (skills/visual-system), prices auto-pulled live (skills/fmp-feed). IBM Plex Sans labels, Mono numbers.

## Quick Dash (LOCKED — v2.0) — the daily driver
`quick dash` = default daily tool | `dash` = full picture, on demand. Sections, **always in this order**:

**§01 — Portfolio Snapshot** (prices auto-pulled live). Header row: title (left) + `prices as of [HH:MM ET] · ↻ refresh` chip (right; ↻ = sendPrompt('quick dash')). 5-tile hero bar: Market Value | Open P&L$ | Realized P&L | Dry Powder | $50K Progress. Progress bar below. Scores status + next rescore date.

**§02 — Alerts.** All active flags. Format: badge + implication + action first + detail. Badges: EARN IMMINENT | ZONE LIVE | WIN REVIEW | CATALYST | PT HIT | SELL | AUDIT. Never skip, never summarize — show all live alerts. (See skills/monitoring.)

**§03 — Focus Cards v2** ← LOCKED, replaces the ledger table as the QD body. Grid of conviction-tiered cards. Columns: C5 = 4col | C4 = 3col | C3 = 2col. Within tier, order by current market value DESC. Each card (LOCKED — never drift):
- Header: ticker + name (left) | price + cost (right) | P&L% below price
- Conviction border — left accent strip (violet=C5, blue=C4, amber=C3)
- 3 mini stats: CS/MS | Mkt Val | P&L$
- 2-line decision: one line status, one line next action
- Progress bar: fill = % of way to PT from cost
- Inline flags: EARN (red) | WIN (amber) | ZONE (green) | TRIM (amber) | CATALYST (violet) | PT HIT (green)

**§04 — Capital Efficiency Engine.** Purple bars. CS fill + MS tick. All positions, conviction tiers, one-line rationale per row. (See skills/report-surfaces for full engine spec, skills/frameworks for the logic.)

**§05 — Game Plan.** Two-column grid: Active (live zones + imminent decisions) | Conditional (standing entries). Green = live | amber = watch | grey = conditional. Capital budget in header. Data from FINN_STATE.json `watchlist.gameplan`.

**§06 — Radar T1.** Cards from FINN_STATE.json `watchlist`. Ticker + name + CS/MS + status badge + entry zone + PT + one-line thesis.

**§07 — Finn's Flex Slot.** One section Finn chooses each session; label shows what + why. Rotation: pre-earnings week / Monday → Week Ahead · volatile session / alerts firing → Dip Check · 13F drop / congress → Smart Money · post-sell window expiring <7d → Post-Sell Monitor · thesis event / sector move → Scenario or Themes · quiet session → Blindspots.

**§08 — Section Launcher + Ask Finn** (always together):
- *Launcher:* 12 named buttons (exact set, never change): **Alerts | Engine | Gameplan | Dip Check | Radar | Blindspots | Ledger | Weekly Prep | Smart Money | Trade Log | Post-Sell | Full Dash**. Each fires sendPrompt with the command. Full Dash at bottom, full-width.
- *Ask Finn chat box:* free-text input + send → sendPrompt on enter. Plus 6 quick-taps: **News on X | Scenario | Add check | Dip check | Reconcile | Gameplan**. Mandatory every render — never omit.

**Hard rules:** never reorder sections · never drop §08 (launcher + Ask Finn) · Focus Cards v2 is the QD body (never a flat ledger) · launcher has exactly the 12 buttons · scenario fires on trigger without being asked · focus session fires on 2–5 tickers named.

## Scenario Page — Auto-Fire Rules (LOCKED)
Fires automatically (without being asked) when ANY is true:
- Earnings <7 days on an owned position → fires at GMF
- Major catalyst on an owned name (endorsement, acquisition, PT revision ≥20%, guidance change)
- PT breached on an owned position (above or below)
- User's message implies a decision fork on a specific stock ("should I add/trim/hold?", "more CRDO?", "what do you think about X?")

Post-print format: which case played out + next decision framework. (Scenario page layout → skills/report-surfaces.)

## Focus Session — Trigger Rule (LOCKED)
When 2–5 tickers are named (price-widget notes, opening message, or any early message): render Focus Cards v2 for those tickers FIRST, before the full grid; then as prices update, render live watch for each. **Single ticker named → live watch solo** (not focus cards).

## Full Dash (LOCKED — FINN_DASH_MASTER_FORMAT_v3.1)
24 sections in order: 1 Brief | 2 Alerts | 3 Macro | 4 Interp | 5 Week | 6 Obs | 7 Plan | 8 Scenario | 9 Ledger | 10 Engine | 11 Cards | 12 Recs | 13 TrimDipAdd | 14 CapEff | 15 Themes | 16 RadarT1 | 17 RadarT2 | 18 SmartMoney | 19 Space | 20 TradeLog | 21 PostSell | 22 Gameplan | 23 Updates | 24 CmdCenter.

Rules: reproduce EXACT structure/styling, swap data only · EQUITY CURVE = line sparkline, not bars · sub-specs (ledger/card/engine/week) never substituted — pull from skills/report-surfaces · cross-session: user re-uploads FINN_DASH_TEMPLATE_v3_2.html → reproduce exact structure/CSS/JS/order, swap data only.

**Week at a Glance:** vertical timeline, dated nodes. Each node: day/date + dot (red=earn/action | amber=watch | green=entry | grey=passive) + card (title + badges + description + decision tree). Always includes earnings, macro events, entry windows, key decision points.

## Control Center v1 (LOCKED) — GMF home
The GMF landing home; `home` summons it any time. Structure (top → bottom, never reorder):
1. **Chrome** — breadcrumb (`FINN / control center`) + **home** button (secondary) + **GMF** button (tertiary) + sync pill (🟢 when synced).
2. **Status strip** — 5 stat tiles: NAV · → $50K (progress %) · Realized P&L · Scores (Nd left) · Next earn (TK Nd). Mono. **Feed-driven — never hardcode prices/%.**
3. **Action Queue** ("⚡ needs attention") — rows from FINN_STATE.json `open_decisions` + live alerts. Each: emoji (🏆 reviews · 🔴 earnings <7d · ⚠ ceiling/sizing · 🟡 stale scores) + bold implication + one-line detail + CTA button (sendPrompt, e.g. "scenario ↗").
4. **Command bar** — "jump anywhere" input + Go. Live suggestion dropdown: typing filters commands + tickers; click or Enter fires sendPrompt (bare text sent as-is if no match).
5. **Jump to position** — ticker chips directly under the bar, conviction-tinted. Sticky segmented route toggle (live watch / report / scenario / news) under the chips; default LIVE WATCH. Tapping a chip fires `{route} {ticker}` — one click.
6. **Fired-today** — callout chip surfacing the auto-fired scenario; click → `sendPrompt('scenario TK')`.
7. **Flight deck** (top-5, most-used first) — rows: icon-box + name + note + chevron. Current: quick dash · dip check · scenario · ledger · eod.
8. **Category groups** — Portfolio · Analysis · Planning · System — as tiles (icon-above-label + cmd + desc + optional badge), auto-fit grid. Badges feed-driven — never hardcode %.

Rules: layout persists across sessions; prices NEVER (pulled at render). Never a downloadable file.

## Live Watch v1 (LOCKED)
Multi-ticker live-watch surface. Chrome + home.
- Columns: Ticker (+ conviction) | @cost | LIVE | P&L% | dip zone | PT.
- `@cost` / dip / PT from FINN_STATE.json (`positions` / `fmp_targets`). **LIVE + P&L% stay blank (`—`) until the FMP feed fires** — never an estimated price.
- Pull-live button fires `sendPrompt('live watch TK ...')`.
- Trigger (from Focus Session): single ticker → solo; 2–5 → Focus Cards v2 first, then live watch each.


---



<!-- APPEND to skills/daily-surfaces/SKILL.md — Phase 2 surfaces (2026-06-06) -->

## Nav & cross-surface rules

**7-tab bar (locked):** `home · positions · watchlist · ledger · trades · earnings · scenario`.
- `guide` lives in the **chrome** (tertiary, beside `home` + `GMF`) — NOT a tab, NOT a daily tile (newcomer front door, different class).
- `reviews` is NOT a tab → auto-fires in the home **action queue** when due (+40% / −20%) and sits as a planning tile.

**Action binding (every surface):** each interactive element is a *semantic action* bound per target — chat = `sendPrompt`, cockpit = tab/local-state, Next.js = router/API. Never sendPrompt-only in the spec.

**Surface states (every surface):** skeleton → pulling → ready · partial-feed (per-item) · feed-down (manual) · empty. Price-bearing cells render `—` until FMP fires — never an estimate.

## Per-surface contracts

- **home / Control Center** — status strip (NAV = Σ(sh × live FMP) + `portfolio.cash`; →$50K % off broker-EOD anchor; next-earn ← soonest in `earnings.owned`, red <7d) · action queue (deduped + severity-sorted + capped) · command bar · conviction-tinted position chips (ordered conviction→mkt value) · fired-today · flight deck (curated) · category tiles.
- **positions** — conviction-tiered focus cards (C5=4 / C4=3 / C3=2 col; mkt-value desc within tier). **Tap = HYBRID: card → position detail(TK); detail hosts `scenario` / `news` / `live-watch`.** Detail is a per-ticker drill-in, not a tab. Decision note is a GENERATED field (judgment-effort, price-dependent).
- **watchlist** — radar-first (T1/T2/watch leads; thematic map secondary). In-zone signal = price vs entry zone. POST-SELL monitor: `watchlist.post_sell[]`, auto-add on every trade-log `exit`, 30-day window → archive; active re-entry (zone + IN-ZONE signal) vs monitor-only (discipline).
- **ledger** — the TABLE PRIMITIVE (see visual-system), grouped by tier, default conviction→mkt value, sortable headers; row tap → position detail(TK).
- **trades** — Table primitive flat + chronological (oldest→newest, NOT re-sortable) + realized-P&L tiles. The one fully file-driven surface.
- **scenario** — most-synthesized surface (routes Opus/max): bull/base/bear + probability + position $ impact + verdict + monitoring checklist, all generated. Auto-fires on: earnings <7d · major catalyst · PT breach · decision fork → surfaces in home "fired today."

## GMF cockpit rule
On `GMF`, after the SYNC CHECK, auto-render the live cockpit (`finn_cockpit.jsx`, rebuilt from the `FINN_STATE.json` seed with live FMP via the per-ticker retry) as part of the morning open — no need to ask.
