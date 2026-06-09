---
name: fmp-feed
description: "Finn's market-data layer via the FMP MCP connector (Starter plan). Use whenever fetching live prices/quotes/market data, or BEFORE rendering any price-bearing surface (GMF, quick dash, dash, EOD, dip check, ledger, engine, focus cards, live watch, scenario, stock report, trade grade, Control Center). Covers the per-ticker single-quote pull routine (batch is Premium-gated), the refresh-chip pattern, the price-widget fallback, broker-mark prefix overrides, and the full FMP toolset (news, earnings calendar, analyst PTs, insider/congress, economics, financials, screener/movers, RSI). Also use when pulling earnings dates, price targets, or macro into FINN_STATE.json."
---

<!-- skills/fmp-feed/SKILL.md — extracted from FINN_SYSTEM_PROMPT.md v3.0 (canonical inlined modules), 2026-06-06 -->

# FMP Data Layer (LOCKED — v2.1)

FMP (official MCP connector, `financialmodelingprep.com/mcp`, Starter plan) is Finn's **data layer** — no separate systems. Price is the primary use. **FMP is the SOLE feed** (Quartr + LunarCrush deferred — paid-gated).

**Price — primary use. Manual entry is retired.** Live US real-time quotes, timestamped. An FMP quote IS a confirmed live source, so it satisfies the core price-integrity rule. The price widget (below) is FALLBACK ONLY.

## Pull routine — the only correct way to fetch prices
1. **Surface the tool** — `tool_search("FMP quote")` once per session to load `FMP:quote` (deferred MCP tool).
2. **Per-ticker single quote** — `FMP:quote(endpoint="quote", symbol="TK")` for each ticker. Returns price · change · changePercentage · day low/high · 52wk low/high · marketCap · previousClose · timestamp.
3. **LOOP, never batch.** `batch-quote` and every sibling batch/aftermarket endpoint are PREMIUM-GATED → `ACCESS DENIED` on Starter. ~12 single calls = the whole portfolio. Do not retry batch in-session.
4. **Tickers from FINN_STATE.json `positions`** (portfolio) or the named set (live watch / dip check / single ticker / report). Never hardcode a price.

## Who pulls the feed — automatically, no asking, no widget
Every price-consuming surface pulls FMP live at render time:
**GMF · quick dash · dash · EOD · dip check · ledger · engine · focus cards · live watch · scenario page · stock report · trade grade · Control Center status strip.**
Output renders INLINE via show_widget (render-mode lock) — never a downloadable file.

## Refresh affordance — `↻ refresh`
Snapshot surfaces (quick dash §01, EOD) show a freshness stamp + refresh chip in the header: `prices as of [HH:MM ET] · ↻ refresh`. The `↻ refresh` chip = `sendPrompt('<bare command>')` (e.g. `quick dash` or `eod` — never a `prices:` override). Tapping re-fires the command so Finn re-pulls FMP live and re-renders. The chip does NOT fetch prices itself — it asks Finn to. **No auto-refresh by design:** prices are live as of the last pull, not a streaming ticker. Freshness stamp uses the FMP quote timestamp (else the pull time).

## Fallback + overrides
- **FMP down / endpoint blocked / connector error** → fall back to the price widget (manual entry) and FLAG it: "⚠ FMP unavailable — manual prices." The widget is also the what-if / hypothetical-entry tool.
- **Prefix override** — `prices:` / `dash prices:` / `eod prices:` with values → use those numbers directly (broker marks), NO FMP call, NO search.

## FMP data layer — all tools (Starter-confirmed, tested Jun 4 2026)
Each is a per-ticker loop (tight `limit`, date-bounded) that renders inline or writes to FINN_STATE.json. Discipline: loop per ticker; hit broad-window endpoints (movers, full calendar) only with date bounds; store stable data (earnings dates, PTs) to state instead of re-pulling.

**① Auto every session — GMF + quick dash, no asking:**
- `news` search-stock-news (owned) → thesis-relevant headlines
- `calendar` earnings-company (owned) → EARN IMMINENT <7d flag + last-3-quarters beat history
- `economics` economics-calendar (date-bounded) → today / this-week macro + owned impact
- `insiderTrades` latest/per-symbol + `senate` (owned) → INSIDER + congress flags

**② On-demand — command-triggered:**
- `news on [X]` → `FMP:news` search-stock-news (primary; web fallback)
- `dip check` → `FMP:technicalIndicators` RSI (oversold context at dip zones)
- `blindspots` → `FMP:search` screener + `FMP:marketPerformance` movers
- stock report → `FMP:company` profile + `FMP:statements` financials + revenue-segmentation + `FMP:analyst` PT/grades
- scenario page → earnings history + analyst PT spread

**③ State sections — pulled, then stored canonical in FINN_STATE.json:**
- `earnings` ← `calendar` earnings-company loop (date + estimate + actual)
- `fmp_targets` ← `analyst` price-target-consensus (high/low/median/consensus) → tag CONFIRMED
- `macro` ← `economics` economics-calendar (CPI / jobs / Fed / FOMC)
- `thesis` ← `statements` financials + revenue-geographic / product segments
- catalyst page ← `secFilings` 8k-latest + `analyst` grades (rating changes)

**Source tags:** FMP consensus PT / reported financials / earnings actuals = `CONFIRMED`. Finn-derived = `FINN PROJECTION`.

**Plan boundary (tested):** Starter covers ALL of the above — earnings dates, analyst PTs/grades, congressional trades included (NOT Premium). PREMIUM-only = quarterly fundamentals (`period=quarter`) + batch-quote (the single-quote loop replaces it) → not worth it yet. ULTIMATE = 13F + transcripts → skip; use free SEC EDGAR / WhaleWisdom. Earnings web routine is RETIRED for owned/watchlist (earnings-company covers them; owned + 29 watchlist swept Jun5); web only for names FMP lacks.

**Other asset classes:** `FMP:crypto` / `FMP:forex` / `FMP:commodity` / `FMP:indexes` if needed. (Index levels: ETF proxies SPY/QQQ/DIA/IWM via single-quote; raw index + 10Y/VIX gated on Starter.)

## Integrity caveat
FMP marks are a point-in-time snapshot and can differ from broker NAV by small intraday mark-timing noise. When the user states a broker NAV, that NAV is the anchor; FMP supplies per-position marks + day moves.

---

# Price Widget (FALLBACK / what-if only)

**Role: FALLBACK only.** Primary prices come from the FMP feed above. This widget fires only when FMP is unavailable, or for hypothetical / manual price entry. Do not render it as the default price step.

Command: `prices` → render `finn_price_widget_v3_1_fixed` (show_widget, dark-terminal). Built from the visual standard (skills/visual-system).

- **12 tickers by tier** come from FINN_STATE.json `positions` (C5 / C4 / C3). Never hardcode the list — read state.
- **Row format:** ticker | @cost | input | P&L% live. Cost from `positions`.
- **"Load into Dash ↗"** = `sendPrompt("dash prices: TK=XX,...")`.
- **Rules:** never redesign — one version only. `window.storage` undefined in this fallback → manual entry. When `dash prices:` arrives → use provided values directly, NO searching.


---
