# FINN — DESIGN CHANGE SHEET (28-surface review → Saturday prompt)

> Fill the `CHANGES:` line under each surface as you review (add / change / remove / improve). When done, this whole file *is* the Saturday Claude Design prompt — the header below is the standing context, the per-surface notes are the work.
> Leave a surface blank = no changes. Use the data bindings as a reminder of what each cell currently shows.

---

## STANDING CONTEXT (Design prompt preamble — don't edit)
- **Target:** iterate the 28-surface Finn cockpit in Claude Design.
- **Design language = "Command Deck" v4** (decided Jun 10): Space Grotesk + JetBrains Mono · mint / coral / gold · the Observatory orbital map · always dark. *(v4 token spec to be drafted; this is the agreed direction.)*
- **Data = locked:** every surface's data bindings are fixed in `FINN_DATA_SPEC.md` v1.0 (28/28). Design follows those for *what* each cell shows; this sheet is for *how it looks / behaves*.
- **Nav:** 7-tab bar — `home · positions · watchlist · ledger · trades · earnings · scenario`. `guide` lives in the chrome (tertiary), not a tab.
- **Every surface needs:** the 6 states (skeleton / pulling / ready / partial-feed / feed-down / empty); price cells render `—` until the feed fires (never an estimate); per-target action binding (chat=prompt · app=route/API).

---

## COCKPIT
**1 · Market Brief** `[§00 lead block]` — orienting read: Tape / Book / News / Calls / Watching / Also / TL;DR.
Data: SPY/QQQ + VIX · NAV + movers · FMP news · open calls · catalysts. → `FINN_DATA_SPEC §C.2`
**CHANGES:** ______________________________________________

**2 · Home / Control Center** `home`,`GMF` — status strip · action queue · jump chips · fired-today · flight deck · tiles.
Data: NAV/Δ/→50K/realized/drawdown/next-earn · priced zone-dot chips. → `§C.1`
**CHANGES:** ______________________________________________

**3 · Quick Dash** `quick dash` — daily driver: Brief + Snapshot + Alerts + Focus Cards + Engine + Gameplan + Radar + Flex + Launcher.
Data: 5-tile hero · rich focus cards (PT/zone/rec) · 12-btn launcher + Ask Finn. → `§C.3`
**CHANGES:** ______________________________________________

**4 · Full Dash** `dash` — 24-section full picture (superset of Quick Dash).
Data: all sections, §1 = Market Brief. → `§C.4`
**CHANGES:** ______________________________________________

## PORTFOLIO
**5 · Positions** `[tab]` — conviction-tiered focus-card grid (C5=4/C4=3/C3=2, mkt-val desc); tap → detail.
Data: full focus card per name. → `§C.5`
**CHANGES:** ______________________________________________

**6 · Position Detail** `[drill-in]` — per-ticker deep view; News + Fundamentals tabs, live-watch, lots, thesis, decision note.
Data: quote + P&L + lots + thesis + fundamentals + news + earnings. → `§C.6`
**CHANGES:** ______________________________________________

**7 · Ledger** `[tab]` — the Table primitive (sortable, tier-grouped); row → detail.
Data: ticker/shares/cost/price/mktval/P&L/weight/CS-MS/PT/zone. → `§C.7`
**CHANGES:** ______________________________________________

**8 · Engine** `engine` — capital efficiency: CS bar + MS tick + rationale per name.
Data: CS/MS + judgment rationale; Engine v3 adds $-to-PT / undersized flag. → `§C.8`
**CHANGES:** ______________________________________________

**9 · NAV Curve** `nav curve` — equity curve + HWM/drawdown/→50K tiles.
Data: `nav_history.snapshots` SVG (peak/HWM/eod_close) + reconcile flag. → `§C.9`
**CHANGES:** ______________________________________________

**10 · Trades** `[tab]` — flat chronological table (oldest→newest) + realized tiles. File-driven, no live feed.
Data: `trades[]` + realized breakdown. → `§C.10`
**CHANGES:** ______________________________________________

## ANALYSIS
**11 · Scenario** `scenario [TK]` — bull/base/bear + probability + $ impact + verdict + checklist; auto-fires.
Data: judgment + A1 contract + thesis/fundamentals/earnings/analyst. → `§C.11`
**CHANGES:** ______________________________________________

**12 · Risk / Allocation** `risk` — concentration / correlation / beta / stress / theme exposure.
Data: `risk.*` + `clusters.*` + weights + limits. → `§C.12`
**CHANGES:** ______________________________________________

**13 · News** `news`,`news on X` — classified, materiality-ranked, thesis-linked; "what changed" diff.
Data: FMP news + `last_scan` + `news_watch`. → `§C.13`
**CHANGES:** ______________________________________________

**14 · Macro** `macro` — Fed/rates/prints/market-structure + macro→position linkage.
Data: `macro.*` (+ market_structure, macro_sensitivity) + SPY/QQQ/econ. → `§C.14`
**CHANGES:** ______________________________________________

**15 · Fundamentals** `fundamentals` — per-name growth/margins/FCF/debt/valuation vs own range; grounds CS.
Data: `fundamentals[ticker]` (partial — AVGO/APLD seeded). → `§C.15`
**CHANGES:** ______________________________________________

**16 · Dip Check** `dip check` — owned vs dip zones + RSI oversold + funding reality.
Data: price vs zone + RSI + cash. → `§C.16`
**CHANGES:** ______________________________________________

**17 · Smart Money** `smart money` — 13F + congress; convergence (2+ funds) flags.
Data: FMP insider/senate + tracked funds. → `§C.17`
**CHANGES:** ______________________________________________

**18 · Reviews** `reviews` — WIN/LOSS reviews (+40% / −20% / >30% over PT); log, don't auto-trim.
Data: triggers from P&L + `reviews`. → `§C.18`
**CHANGES:** ______________________________________________

**19 · Rescore** `rescore` — force CS/MS rescore; save same response.
Data: scores + staleness + fundamentals/thesis/news/momentum. → `§C.19`
**CHANGES:** ______________________________________________

**20 · Blind Spots** `blindspots` — 3 fresh tickers outside the book.
Data: FMP screener/movers minus held + watchlist. → `§C.20`
**CHANGES:** ______________________________________________

## PLANNING
**21 · Gameplan** `gameplan` — standing entries, Active | Conditional.
Data: `watchlist.gameplan` + price vs zone + cash budget. → `§C.21`
**CHANGES:** ______________________________________________

**22 · Exit** `exit` — per-name trim + sell triggers + proximity; sort toggle.
Data: `trim_trigger`/`sell_trigger` + price/PT. → `§C.22`
**CHANGES:** ______________________________________________

**23 · Catalyst Calendar** `catalyst` — one dated forward view; drives auto-fire + Watching.
Data: `catalysts.calendar` + earnings dates. → `§C.23`
**CHANGES:** ______________________________________________

**24 · Watchlist** `watchlist` — radar ladder (T1/T2/watch) + post-sell monitor; color-coded tiers + cards + tips.
Data: `watchlist.tiers` + `post_sell` + in-zone signal. → `§C.24`
**CHANGES:** ______________________________________________

**25 · Earnings** `earnings` — calendar + per-name last-4-qtrs + <7d flag.
Data: `earnings.imminent/owned`. → `§C.25`
**CHANGES:** ______________________________________________

## SYSTEM
**26 · Guide** `guide` — newcomer front door (5 sections, icon-above-label tiles); chrome, not a tab.
Data: mostly static orientation. → `§C.26`
**CHANGES:** ______________________________________________

**27 · Reports** `report` / EXPORT — exportable composites (stock report, trade grade). The one file output.
Data: composite of other surfaces. → `§C.27`
**CHANGES:** ______________________________________________

**28 · Sync** `sync`,`system` — sync check (GREEN/AMBER + drift) + system status. No FMP.
Data: `_meta.rev` + `sync.sections` + file inventory. → `§C.28`
**CHANGES:** ______________________________________________

---

## GLOBAL / CROSS-SURFACE CHANGES
*(things that apply everywhere — type, spacing, motion, the Observatory map treatment, nav behavior, etc.)*
**CHANGES:** ______________________________________________
