# FINN — DATA SPEC (Track 2)

> v1.1 · 2026-06-15 · the location-by-location data contract for every surface — **all 28 surfaces mapped**.
> Companion to `FINN_FRONTEND_ROADMAP.md` (workstream WS-B). **Design-agnostic** — this defines *what* data each cell shows and *where* it comes from; the v4 look defines *how* it renders. The two are independent.
> Surface inventory = the **28 surfaces** mapped by Claude Design (see §D Tracker). This file fills in surface-by-surface.

---

## A · CONVENTIONS

### A.1 — Source tag (every field is exactly one)
| Tag | Meaning |
|---|---|
| **STATE** | a field in `FINN_STATE.json` — path given, e.g. `positions[].cs` |
| **FMP** | a live FMP pull — endpoint + field given, e.g. `quote.price` |
| **DERIVED** | computed — formula in §B Derivation Catalog |
| **STATIC** | a constant / label / route, no data dependency |

### A.2 — State model (every price- or data-bearing cell renders one of)
`skeleton` (pre-load placeholder) → `pulling` (fetch in flight) → `ready` · `partial-feed` (some tickers failed — show what resolved, mark the rest) · `feed-down` (FMP unreachable → render `—`, **never an estimate**) · `empty` (no data for this field).

### A.3 — Refresh & freshness
- Price-bearing surfaces **auto-pull FMP at render**. Freshness stamp = the FMP `quote.timestamp` (else pull time), shown as `prices as of HH:MM ET`.
- Manual `↻ refresh` = re-fire the bare command (`sendPrompt('<command>')`), never a `prices:` override. **No streaming / no auto-refresh** by design.
- `prices:` / `dash prices:` / `eod prices:` prefix = broker override → **skip the FMP pull**, use pasted numbers.

### A.4 — Action binding (per render target)
Every interactive element is a *semantic action*, bound per target: **chat** = `sendPrompt('…')` · **cockpit** = tab-switch / local state · **Next.js** = router push / API call. Never spec `sendPrompt`-only.

---

### A.5 — No stored field may duplicate a derivation
If a value is in the §B catalog, it is **computed at read, never stored**. Sample/seed data and `FINN_STATE.json` must not carry a frozen copy of any derived value (days-to-event, NAV, price, day %, drawdown, →$50K progress, weights, P&L) — a stored copy silently drifts the moment the anchor date passes (the `days` field, frozen, read by `renderRisk` as `e.days < 7`, was the first instance). Every consumer points at the catalog fn (`daysTo(e.date)`, `D7`, `D1`…). **Stored = facts the system can't derive (shares, cost basis, dates, theses, zones); derived = everything the catalog computes.** *Carve-out:* a dated NAV-curve point (§C.9) is a recorded checkpoint, not a live read — it does not trip this rule.

## B · DERIVATION CATALOG (compute once, reuse on every surface)

| # | Value | Formula | Inputs |
|---|---|---|---|
| D1 | live price | `quote.price` per ticker | FMP |
| D2 | day % / day Δ$/sh | `quote.changePercentage` · `quote.change` | FMP |
| D3 | position mkt value | `shares × D1` | STATE `positions[].shares` |
| D4 | cost basis | `shares × cost_per_share` | STATE |
| D5 | open P&L $ / % | `D3 − D4` · `(D3−D4)/D4` | — |
| D6 | equity | `Σ D3` | — |
| D7 | **NAV (live)** | `D6 + portfolio.cash` | STATE `portfolio.cash` |
| D8 | position weight % | `D3 / D7` | — |
| D9 | position day Δ$ | `D3 × (day% / (1+day%))` | D2 |
| D10 | **portfolio day Δ$ / %** | `NAV − anchors.nav_last_eod_close` · `/anchor` | STATE `anchors.nav_last_eod_close` (+ `_date`) |
| D11 | **→ $50K progress %** | `NAV / 50000` (display anchored value off `anchors.nav_last_eod_close` to avoid intraday noise) | STATE `portfolio.milestone_1` |
| D12 | return from inception % | `(NAV − portfolio.inception_value)/inception_value` | STATE |
| D13 | drawdown from HWM % | `(NAV − anchors.hwm)/anchors.hwm` | STATE `anchors.hwm` (+ `_date`) |
| D14 | PT progress % | `(D1 − cost)/(pt_low − cost)` | STATE `pt_low`, `cost_per_share` |
| D15 | realized P&L | `anchors.net_realized_pnl` | STATE |
| D16 | **zone dot** | green if `D1 ≤ dip_zone_high` · red if earnings `<7d` · amber if `D1 ≥ trim_trigger` OR `D8 ≥ 20` · grey else | STATE zones/triggers + D17 |
| D17 | days-to-earnings | `earnings.imminent[].date − today` (else soonest `earnings.owned[].date`) | STATE `earnings.*` |
| D18 | next-earn (header) | soonest `earnings.owned[].date` not in `imminent`; **red if <7d** | STATE |
| D19 | tier order | group by `conviction` desc, then `D3` (mkt value) desc | STATE `positions[].conviction` |
| D20 | tape (index proxies) | `quote.price`/`changePercentage` for SPY, QQQ; `index-quote ^VIX` *(Starter-gated → flag/last-known)* | FMP |
| D21 | **days-to-event (T-minus)** | `eventDate − today` (today = `PORT.navLiveTime` date); recompute daily, never a stored anchor | STATE `catalysts[].date` / `earnings.*.date` + `PORT.navLiveTime` |

> **Rule:** a surface never re-derives these locally — it consumes the catalog. Keeps chat-Finn, the cockpit, and the Next.js `/api/portfolio` route returning identical numbers.

---

## C · SURFACE SPECS

### C.1 — HOME / Control Center  ·  `[tab: home]` · cmd `home` / `GMF`
*Purpose: the morning landing hub — where the book sits, what needs attention, jump anywhere.*

| Loc | Element | Source | Format / Logic | States |
|---|---|---|---|---|
| 01 | Chrome — breadcrumb | STATIC | `FINN / CONTROL CENTER` | — |
| 01 | Chrome — build stamp | STATE `_meta.rev` + prompt version + FMP `quote.timestamp` | `rev14 · v3.9 · feed LIVE HH:MM ET` | feed-down → `feed —` |
| 01 | Chrome — affordances | STATIC route | `guide` · `dash` · `↻ gmf` (tertiary, beside home) | — |
| 02 | Status — Live NAV (hero) | DERIVED **D7** | `$28,930.18` mono | skeleton→pulling→ready; partial → flag |
| 02 | Status — day Δ | DERIVED **D10** | `+$314 / +0.94%` pos/neg color, vs `nav_last_eod_close` | — |
| 02 | Status — → $50K progress | DERIVED **D11** + bar | `59%` + 4px fill; sub = `off Jun8 EOD $29,497` | — |
| 02 | Status — Realized P&L | STATE **D15** | `+$2,528.29` (realized, **not** open) | — |
| 02 | Status — Open unrealized | DERIVED **D5** summed | `+$3,828 (+14.8%)` | feed-down → `—` |
| 02 | Status — Drawdown | DERIVED **D13** | `−7.0%` + `HWM $32,030 Jun3` | — |
| 02 | Status — Next earnings | DERIVED **D18** | `ORCL · today AC` red if <7d | empty if none |
| 03 | Action queue | DERIVED (alerts logic, §see Quick-Dash §02 rules) | deduped + severity-sorted + capped ~5; row = badge + body + CTA(route) | empty → "all clear" |
| 04 | Fired today | DERIVED `catalysts.auto_fire` + **D17** | scenario auto-fires (earn<7d / catalyst / PT breach / fork) | empty → hide |
| 05 | Jump-to-position chips | STATE `positions[].ticker` + **D1/D2/D16** | `[zone dot] TICKER $price day%`; order **D19** | per-chip partial-feed |
| 06 | Flight deck | STATIC (curated, **not** "most-used") | tiles → `sendPrompt(cmd)` | — |
| 07 | Category tiles | STATIC | all-surface launcher → `sendPrompt(cmd)` | — |

### C.2 — MARKET BRIEF  ·  `[§00 lead block of quick dash + dash]` · always first
*Purpose: the standing orienting read — tape, book, news, calls, what's coming. Requires a live FMP **news** pull every render, not just prices.*

| Row | Source | Format / Logic | States |
|---|---|---|---|
| **Tape** | DERIVED **D20** + STATE `macro.next_fomc` / `macro.market_structure.verdict` | SPY/QQQ day% + driver one-liner + macro overhang; call out broad-vs-sector | VIX gated → last-known, tagged |
| **Book** | DERIVED **D7/D10** + top/bottom movers by **D2** + STATE `macro.market_structure` | NAV vs tape + standout movers + thesis check (drawdown≠break) | — |
| **News** | FMP `search-stock-news` (movers) + `general-news` | 3–4 most material; each = source + 1-line + ticker tag; ranked by materiality; **paraphrase** | empty → "quiet tape" |
| **Calls** | STATE `calls_log[]` (open) | each = rec badge (ADD/HOLD/TRIM/WATCH) + confidence tag (/100 · CONFIRMED/PROJECTION) | — |
| **Watching** | STATE `catalysts.calendar[]` + `earnings.imminent[]` + `watchlist.post_sell[]` | earnings<7d · FOMC · PT/zone-near · post-sell expiring<7d · smart-money convergence | — |
| **Also** (optional) | DERIVED signal | rotation / structural (index add) / smart money — omit if nothing | hide when empty |
| **TL;DR** | DERIVED (synthesis) | one line: the single takeaway + the one move; accent strip | always present |

> Both surfaces confirmed against the live renders on Jun 10 (GMF Control Center + Quick Dash). Bindings are production-accurate.

### C.3 — QUICK DASH · cmd `quick dash` · the daily driver
*Composition surface — 9 sections, locked order; most cells reuse §C.1/§C.2 + the catalog. Net-new bindings:*

| § | Section | Source / ref | Net-new bindings |
|---|---|---|---|
| 00 | Market Brief | → §C.2 | — |
| 01 | Snapshot (5-tile hero) | DERIVED | Market Value **D6** · Open P&L$ **D5**Σ · Realized **D15** · Dry Powder `portfolio.cash` · →$50K **D11**+bar · scores `anchors.scores_date`/`scores_next_due` · freshness = `quote.timestamp` |
| 02 | Alerts | DERIVED (monitoring) | badges EARN IMMINENT(`earnings.imminent`) · ZONE LIVE(**D16** green) · WIN REVIEW(+40% / `reviews` open) · CATALYST(`catalysts.calendar`) · PT HIT(**D1**≥`pt`) · SELL(`sell_trigger`) · AUDIT(score staleness) — badge+implication+action+detail; never summarized |
| 03 | Focus Cards (rich) | per `positions[]` | header(tk/name · **D1**/cost · **D5**%) · conv border(`conviction`) · CS/MS(`cs`/`ms`) · **rec badge**(rec logic) · recNote · PT box(`pt_*`) · Add-Zone box(`dip_zone_*`) · scored(`scores_date`) · PT bar(**D14**) · flags(**D16/D17**/`reviews`); grid C5=4/C4=3/C3=2, order **D19** |
| 04 | Engine | → §C.8 | — |
| 05 | Game Plan | → §C.21 | — |
| 06 | Radar T1 | `watchlist.tiers.T1_radar` | tk/name/`cs`/`ms`/status/entry/PT/thesis |
| 07 | Flex slot | DERIVED (rotation) | Finn picks 1 by context: pre-earn→Week · volatile/alerts→Dip Check · 13F→Smart Money · post-sell<7d→Post-Sell · thesis event→Scenario · quiet→Blindspots |
| 08 | Launcher + Ask Finn | STATIC | 12 fixed buttons → `sendPrompt`; Ask input → `sendPrompt` on Enter + 6 quick-taps |

### C.4 — FULL DASH · cmd `dash` · 24-section full picture
*Superset; §1 = the Market Brief (24-count unchanged). Composition:*

| # | Section | Binding | # | Section | Binding |
|---|---|---|---|---|---|
| 1 | Market Brief | → §C.2 | 13 | Trim/Dip/Add | **D14/D16** + `trim_trigger`/`dip_zone` |
| 2 | Alerts | → §C.3 §02 | 14 | CapEff | → §C.8 |
| 3 | Macro | → §C.14 | 15 | Themes | `clusters` |
| 4 | Interp | DERIVED (judgment) | 16 | Radar T1 | `watchlist.tiers.T1_radar` |
| 5 | Week | `catalysts.calendar` 7d | 17 | Radar T2 | `watchlist.tiers.T2_radar` |
| 6 | Obs | DERIVED | 18 | Smart Money | → §C.17 |
| 7 | Plan | → §C.21 | 19 | Space | `watchlist.space_defense` |
| 8 | Scenario | → §C.11 | 20 | Trade Log | → §C.10 |
| 9 | Ledger | → §C.7 | 21 | Post-Sell | `watchlist.post_sell[]` |
| 10 | Engine | → §C.8 | 22 | Gameplan | → §C.21 |
| 11 | Cards | → §C.3 §03 | 23 | Updates | `_meta` / deltas |
| 12 | Recs | `calls_log[]` | 24 | Cmd Center | → §C.1 |

### C.5 — POSITIONS · `[tab: positions]`
*Conviction-tiered focus-card grid; tap = hybrid card → Position Detail(TK).*

| Loc | Element | Source | Format / Logic |
|---|---|---|---|
| grid | tier groups | DERIVED **D19** | C5=4 / C4=3 / C3=2 col; mkt-value(**D3**) desc within tier |
| card | full Focus Card | → §C.3 §03 | identical bindings, per `positions[]` |
| card | tap | route | card → `position detail(TK)` (hosts scenario/news/live-watch) |

### C.6 — POSITION DETAIL · per-ticker drill-in (not a tab)
| Loc | Element | Source | Format / Logic | States |
|---|---|---|---|---|
| hdr | ticker/name/sector | STATE `positions[]` | — | — |
| hdr | price / day / range | FMP **D1/D2** + `quote.dayHigh/Low`,`yearHigh/Low`,`volume` | live-watch block | feed-down → `—` |
| hdr | conviction · CS/MS | STATE `conviction`/`cs`/`ms`/`scores_date` | pills | — |
| body | P&L | DERIVED **D3/D4/D5/D8** | mkt val · cost · open$/% · weight | — |
| body | cost lots | STATE `positions[].lots[]` | FIFO lot table | — |
| body | PT / zone / trim | STATE `pt_*`/`dip_zone_*`/`trim_trigger` + **D14/D16** | target box + progress + zone dot | — |
| body | thesis | STATE `thesis[ticker]` (drivers / breaks_if) | — | empty if unseeded |
| tab | Fundamentals | STATE `fundamentals[ticker]` (rev growth, margins, FCF, debt, valuation) | vs own range | **partial** — only AVGO/APLD seeded |
| tab | News | FMP `search-stock-news` `[ticker]` | ranked, paraphrased | empty → "no recent" |
| body | earnings | STATE `earnings` for ticker (date, est, `last_4`) + **D17** | flag <7d | — |
| body | decision note | DERIVED (judgment, price-dependent) | generated | — |
| foot | scenario | route | → `scenario TK` | — |

### C.7 — LEDGER · `[tab: ledger]` — defines the TABLE PRIMITIVE
*Reusable table (header / tier-sep / mono-tabular / sortable / responsive-scroll). Trades, PT-view, impact-view inherit it.*

| Col | Source | Notes |
|---|---|---|
| ticker / name | STATE `positions[]` | mono / sans |
| shares · cost | STATE `shares`/`cost_per_share` | mono |
| price | FMP **D1** | feed-down `—` |
| mkt value | DERIVED **D3** | mono |
| open P&L $/% | DERIVED **D5** | pos/neg |
| weight % | DERIVED **D8** | mono |
| CS / MS | STATE `cs`/`ms` | dual |
| PT · zone | STATE `pt_*`/`dip_zone_*` | — |
| — | order/interaction | tier groups, default **D19**, sortable headers; row → Position Detail(TK) |

### C.8 — ENGINE · cmd `engine` — capital efficiency
| Loc | Element | Source | Format / Logic |
|---|---|---|---|
| row | CS bar | STATE `cs` | violet fill 0–100 |
| row | MS tick | STATE `ms` | teal tick overlay |
| row | rationale | DERIVED (judgment) | one line: why this name earns the next dollar (or not) |
| row | Engine v3 *(TODO)* | DERIVED | $-to-PT · undersized flag · conviction-vs-weight gap |
| — | order | DERIVED **D19** | tiered, mkt-value desc |

### C.9 — NAV CURVE · cmd `nav curve`
| Loc | Element | Source | Format / Logic |
|---|---|---|---|
| tiles | current / HWM / drawdown / →50K / inception | DERIVED **D7** / `anchors.hwm` / **D13** / **D11** / **D12** | mono stat tiles |
| chart | equity curve | STATE `nav_history.snapshots[]` (`date`,`nav`,`type`) | SVG line: peak=violet · HWM=teal dashed · eod_close/current=amber |
| flag | reconcile callout | DERIVED (files disagree) | fix buttons only on real broker discrepancy |

### C.10 — TRADES · `[tab: trades]`
*Table primitive, flat + chronological, NOT re-sortable. The one fully file-driven surface — no live feed.*

| Loc | Element | Source | Format / Logic |
|---|---|---|---|
| tiles | realized / # trades / win rate / best | STATE **D15** + `trades[]` + `realized_breakdown` | mono |
| table | date · ticker · action · shares · sell px · realized | STATE `trades[]` | oldest→newest; action TRIM(amber)/SELL(info); realized pos/neg; dashed footnote for flags |

---

### — ANALYSIS GROUP —

**C.11 · Scenario** · `scenario` / `scenario TK` — *the convergence surface; most-synthesized, routes Opus/max.*
- Subject: STATE `positions[ticker]` + **D1/D5/D8**.
- bull / base / bear: DERIVED (judgment) — each a price path + thesis condition · probability per case DERIVED (~Σ100) · **position $ impact** DERIVED `(scenario_px − D1) × shares` · verdict + monitoring checklist DERIVED.
- Carries the A1 contract from `calls_log` (call · confidence · drivers[fact/inference/opinion] · assumption · flip · risk).
- Inputs: STATE `thesis[ticker]`, `fundamentals[ticker]`, `earnings` (est/`last_4`), `catalysts`, `macro.macro_sensitivity`; FMP `analyst` (PT/grades) + `search-stock-news`.
- **Auto-fires:** **D17** earn<7d · `catalysts` major event · **D14** PT breach · decision fork → "fired today" on Home.

**C.12 · Risk / Allocation** · `risk` — *concentration, correlation, beta, stress, theme exposure.*
- STATE `risk.*`: `concentration` (top_name·top3·top5·cluster%) · `correlation_read` · `beta_est` · `stress_tests` · `headline`; `limits` (single-name cap 20% · soft_floor · concern).
- STATE `clusters.*` + **D8** → allocation by `positions[].sector` / cluster.
- DERIVED flags: single-name >20% · cluster dominance · soft-floor proximity (**D7** vs `portfolio.soft_floor`).

**C.13 · News** · `news` / `news on X` — *classified, materiality-ranked intelligence (A2).*
- FMP `search-stock-news` (per ticker / owned set) + `general-news`.
- STATE `last_scan.items[]` (class·tickers·materiality·net·source) + `news_watch` (read-through map).
- DERIVED: taxonomy (earnings/guidance/M&A/regulatory/analyst/competitive/supply-chain/mgmt/macro) · materiality score · thesis linkage (`thesis.breaks_if`) · read-through detection · "what changed since last session" diff vs `last_scan`. **Paraphrase (copyright).**

**C.14 · Macro** · `macro` — *Fed, rates, prints, market structure, macro→position linkage (A5).*
- STATE `macro.*`: `fed_funds`·`fed_stance`·`next_fomc`·`cpi`·`core_pce`·`unemployment`·`cut_odds`·`may_jobs`; `market_structure` (spy/qqq/vix/hy_credit/breadth/verdict); `macro_sensitivity` (rates_up_10y · ai_capex_pause · risk_off_broad · fomc → hit_hardest/insulated).
- FMP **D20** (SPY/QQQ; ^VIX gated→last-known) + `economics` (econ-calendar / GDP).
- DERIVED: macro move → exposed-holdings linkage.

**C.15 · Fundamentals** · `fundamentals` — *per-position fundamentals + valuation; grounds CS (A4).*
- STATE `fundamentals[ticker]`: rev_growth · margins(gross/op/net) · ebitda_growth · fcf(margin/per_share) · dilution · debt_to_equity · interest_coverage · net_debt · pe_ttm · ev_ebitda · ps · peg · valuation_read · cs_support.
- FMP `statements` metrics-ratios-ttm / income-statement-growth (annual on Starter; quarterly Premium).
- **State: partial** — AVGO/APLD seeded; rest on refresh. Vs-own-range (percentile) where available.

**C.16 · Dip Check** · `dip check` / `dip check RSI` — *owned vs dip zones + RSI + funding reality.*
- Per `positions[]`: **D1** vs `dip_zone_*` (**D16** green set) · **D5** · **D14**.
- FMP `technicalIndicators` RSI for oversold confirmation.
- DERIVED: live entries flagged + funding check (`portfolio.cash`); no-DCA enforced. (Rendered Jun10 in Quick Dash flex.)

**C.17 · Smart Money** · `smart money` — *13F + congress, convergence flags.*
- FMP `insiderTrades` + `senate` (congress); 13F via free SEC.
- Tracked funds: Druckenmiller · Tepper · Tiger · TCI · Coatue · Point72.
- DERIVED: convergence of 2+ funds on an owned/watchlist name = flag; cross-ref `anchors.open_tickers` + `watchlist`.

**C.18 · Reviews** · `reviews` — *WIN/LOSS reviews; log, never auto-trim.*
- DERIVED triggers from **D5**: +40% WIN · −20% LOSS · >30% above PT TRIM.
- STATE `reviews` (open items, e.g. APLD win). Per review: ticker · trigger · gain/loss · thesis re-check · decision.

**C.19 · Rescore** · `rescore` — *force CS/MS rescore; save same response.*
- STATE `positions[].cs/ms/scores_date` + `anchors.scores_next_due`; DERIVED staleness (>7d → silent rescore before render).
- Inputs: `fundamentals` (A4) · `thesis` · news · momentum. Output: new CS/MS + delta vs prior + rationale. **Rule: save to memory + file same response.**

**C.20 · Blind Spots** · `blindspots` — *3 fresh tickers outside the book.*
- FMP `search-company-screener` (sector/mktcap/momentum) + `marketPerformance` (biggest-gainers / most-active).
- DERIVED: exclude held (`anchors.open_tickers`) + watchlist; surface names adjacent to under-covered themes. 3 ideas + why-now.

### — PLANNING GROUP —

**C.21 · Gameplan** · `gameplan` — *standing entries, Active | Conditional.*
- STATE `watchlist.gameplan` (remaining_entries · conditional_entries · owned_adds) + **D1** vs zone (live/watch/cond color).
- Capital budget = `portfolio.cash` in header. (Rendered Jun10 in Quick Dash §05.)

**C.22 · Exit** · `exit` / `exit plan` — *per-name trim + sell triggers.*
- STATE `positions[].trim_trigger`/`sell_trigger` + **D1/D14** + `pt_*`.
- DERIVED: trim if >30% above PT · distance-to-trim · sell-condition proximity. Sort toggle (depth-pass tweak). Per name: trim level · sell condition · current proximity.

**C.23 · Catalyst Calendar** · `catalyst` — *one dated forward view (A6).*
- STATE `catalysts.calendar[]` (date·event·type·impact·tickers·note) + `earnings.imminent/owned` dates.
- DERIVED: **D21** (days-out / T-minus) · **D17** earn<7d · auto-fire flags. Drives scenario auto-fire + Market Brief "Watching."

**C.24 · Watchlist** · `watchlist` — *radar-first ladder + post-sell monitor.* *(render rule: color-coded tiers + stock cards + radar + gameplan tips.)*
- STATE `watchlist.tiers` (T1_radar·T2_radar·watch·spec·skip) + `post_sell[]` + `adjacent_map` + `space_defense`.
- FMP **D1** for in-zone signal (price vs entry zone).
- DERIVED: post-sell two groups (active re-entry = zone + IN-ZONE signal / monitor-only = discipline); 30-day window → archive.

**C.25 · Earnings** · `earnings` — *calendar + per-name history.*
- STATE `earnings.imminent[]` (ticker·date·when·days_out·status·fiscal·eps_est·rev_est·`last_4`) + `earnings.owned[]` (date·eps_est·rev_est·streak) + `gap_note`.
- DERIVED **D17/D18** <7d flag. FMP `calendar` earnings-company to confirm exact dates as names enter <7d.

### — SYSTEM GROUP —

**C.26 · Guide** · `guide` / `welcome` / `start` — *newcomer front door (LOCKED v1.1).*
- STATIC mostly — sections: 01 how Finn thinks (8 models) · 02 command center (icon-above-label tiles) · 03 under the hood · 04 model & effort · 05 try-this-first. Routes via `sendPrompt`. Lives in chrome (tertiary), not a tab/tile. Minimal live data — orientation.

**C.27 · Reports** · `report` / Finn EXPORT — *exportable composites (the sanctioned file output).*
- Composite of other surfaces' bindings, formatted for export. Stock report = per-ticker (thesis + fundamentals + scenario + news + scores). Trade grade = post-trade eval.
- **Output: a file (md/pdf)** — Finn EXPORT is the one place files are produced, not an inline surface.

**C.28 · Sync** · `sync` / `system` — *sync check + system status (no FMP).*
- STATE `_meta.rev` · `sync.sections` (per-section dirty flags) · `sync.structure_files_separate`.
- DERIVED: anchors-vs-sections agreement → GREEN / AMBER + drift list. System view = memory-item count · file inventory · TODO · health check. The GMF/GNF sync engine.

---

## D · SURFACE TRACKER (28 — Claude Design mapping)

✅ = specced in this file · ◻ = pending

**Cockpit**
- [✅] 1 · Market Brief → §C.2
- [✅] 2 · Home → §C.1
- [✅] 3 · Quick Dash → §C.3
- [✅] 4 · Full Dash → §C.4

**Portfolio**
- [✅] 5 · Positions §C.5 · [✅] 6 · Position Detail §C.6 · [✅] 7 · Ledger §C.7 · [✅] 8 · Engine §C.8 · [✅] 9 · NAV Curve §C.9 · [✅] 10 · Trades §C.10

**Analysis**
- [✅] 11 · Scenario §C.11 · [✅] 12 · Risk/Allocation §C.12 · [✅] 13 · News §C.13 · [✅] 14 · Macro §C.14 · [✅] 15 · Fundamentals §C.15 · [✅] 16 · Dip Check §C.16 · [✅] 17 · Smart Money §C.17 · [✅] 18 · Reviews §C.18 · [✅] 19 · Rescore §C.19 · [✅] 20 · Blind Spots §C.20

**Planning**
- [✅] 21 · Gameplan §C.21 · [✅] 22 · Exit §C.22 · [✅] 23 · Catalyst Calendar §C.23 · [✅] 24 · Watchlist §C.24 · [✅] 25 · Earnings §C.25

**System**
- [✅] 26 · Guide §C.26 · [✅] 27 · Reports §C.27 · [✅] 28 · Sync §C.28

**Status: 28/28 mapped; v1.1 (D21, C.23 refine, A.5, C.9 auto-NAV, C.17 source-tiering).** Shared math always points back to §B; next refinements are per-surface depth + the v4 visual states layered on at Design time.

---

## v1.1 ADDENDA (fold into sections above at next full pass)

**§C.9 — NAV CURVE · auto-compute + provenance.** EOD curve points auto-compute at GNF: `nav = Σ(positions[].shares × historical-price-eod-light close) + portfolio.cash`. New field **`nav_basis: computed | confirmed`** on each point — `computed` is the GNF default; a pasted broker total overwrites and re-tags `confirmed` (verified=true). Small deltas log silently; a large gap raises a reconcile flag. Headline progress/drawdown read the latest point (computed or confirmed); the last broker-confirmed point is preserved alongside.

**§C.17 — Smart Money · source-tiered provenance (revises the C.17 stub).** Per-figure provenance, tiered by source — a named holder is a factual claim, not a derivation:
- **Congress** — FMP `senate` (Starter) → **CONFIRMED** w/ filing date once wired.
- **Named 13F / institutional holders** (Druckenmiller · Tepper · Tiger · TCI · Coatue · Point72) — **NOT on the FMP plan**; SEC EDGAR at Phase 3 only → carry **`illustrative`** until that wiring lands.
- **Insider (Form-4)** — FMP `insiderTrades` (Starter) → CONFIRMED once wired.
- Convergence flags inherit the **lowest** provenance tier of their inputs (illustrative until SEC-backed).
- **Blindspots (C.20)** inherits the same discipline — any specific holder/figure traces to a source field or carries `illustrative`.
