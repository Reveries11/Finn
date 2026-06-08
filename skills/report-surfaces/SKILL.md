<!-- skills/report-surfaces/SKILL.md — extracted from FINN_SYSTEM_PROMPT.md v3.0 (canonical inlined modules), 2026-06-06 -->

# Report Surfaces

All render INLINE via show_widget, built from the v3.3 component library (skills/visual-system). Sans labels, Mono numbers. Prices from skills/fmp-feed; data from FINN_STATE.json.

## Ledger (LOCKED) — `ledger`
Order: conviction desc within tier; within tier, current market value desc.
**Columns:** Ticker | Conv badge | Shares | Cost/sh | Price | P&L% | P&L$ | Mkt val | Wt% | CS | MS | Flags.
Tier separators: Conv5 / Conv4 / Conv3.
Inline flags: DIP (green, at/below dip) · TRIM (amber, >30% above PT) · WIN (amber, +40%) · EARN (red, earnings <7d) · BIG MOVE (purple, day move ≥3%).
Summary stats bottom: portfolio value, total P&L$, total P&L%, cost basis. Concentration warning if single name >25%.

## Engine (LOCKED) — `engine`
Purple theme. 3 tiers: Conviction 5 (top) / 4 (mid) / 3 (base). Each row: ticker name LEFT + horizontal score bar (purple fill, width = score%) + CS + MS + one-line rationale RIGHT. Order: conviction desc → CS desc within tier. Header "Capital Efficiency Engine". No prose paragraphs — bars only. Every owned ticker appears, never dropped, layout never changes. Bar legend: fill = CS · MS tick mark = market-score position. (Logic → skills/frameworks.)

## Card (LOCKED)
Header: ticker + name LEFT | price + cost RIGHT inline | P&L% below price | divider.
Body: ConvBadge + CSpill + MSpill + recBadge + recNote + 2 data boxes (PT | AddZone) + "scored [date]".
Rules: every card MUST have PT and add/entry zone — no blanks. Order: conviction tier → CS desc within tier.
RadarT1 = header (ticker + name + earnFlag LEFT, CS/MS badges RIGHT) + CS·MS line + reasoning para + 2 data boxes (PT | EntryZone). RadarT2 = ticker + CS/MS + PT box + EntryZone box + news btn.

## Blindspots (LOCKED) — `blindspots`
Fresh news search first — pick 3 tickers NOT on watchlist or radar. Never carry prior picks unless live data supports.
Scan for: earnings beats, analyst upgrades (48hr), options flow, sector rotation, IPO momentum, contract/regulatory catalysts.
Format: Ticker | Why now | Risk | One-line thesis. Present → discuss → decide: watch / ignore / add to radar. Next session = clean slate. (Candidates via FMP screener + movers, skills/fmp-feed.)

## Trade Grade (LOCKED — dark-terminal)
Grade chip: A=green / B=info / C=warn / D+F=neg. Grades: A 90–100 | B 75–89 | C 60–74 | D 45–59 | F <45.
- **F1** (mid-conviction, auto): chip + ticker + one-line + "Full breakdown ↗" → F3.
- **F2** (explicit request): chip + ticker + factor bars (EntryVsZone / ThesisAlignment / CatalystTiming / SizingVsConv / CapEff /10) + composite + "Full breakdown ↗" → F3.
- **F3** (expand only): verdict badge + 5 icon rows + footer.
Applies to real and hypothetical trades. No format drift.

## Stock Report v2 (LOCKED — dark-terminal)
**Section order:** Header → optional note → Business model → [optional: flywheel | segments | M&A grid] → Quarterly 4-card → Catalysts → Asymmetry bull/base/bear → Moat + competition → Valuation → Revenue + Mgmt → Risks → RATING → Analyst → WHERE IT FITS → checklist (✓/△/✗) → PT/zone.
Header LEFT: ticker chip + full name + subline (exch / HQ / CEO) + flag strip (OWNED / NOT OWNED / SPEC + sector theme). Header RIGHT: big price + source + date + 52wk range + mktcap; OWNED adds position pill (sh@cost · P&L%).
Note-box (optional): current event / today's move / setup framing.
Rating block: 5 axis bars (Thesis / Val / PortFit / Risk / Timing 1–10) + CS/MS badges (/100) + verdict pill + "scored [date]". Verdict colors: green = buy/actionable | amber = watch/spec.
OWNED verdict: HOLD/ADD + position-mgmt section (P&L, PT/exit from state, flag if no dip zone). NOT OWNED: BUY/WATCH/SPEC + tier rec + offer to add to watchlist. Risk dots: red severe / amber moderate / grey minor.
Score CS/MS fresh on every report (skills/scoring), save same response.

## Scenario Page
Bull / base / bear, each with probability + position dollar impact + a monitoring checklist + a verdict. Auto-fire conditions and post-print format live in skills/daily-surfaces (Scenario Auto-Fire). Earnings history + analyst PT spread from skills/fmp-feed.

## Trade Log v1 (LOCKED) — `trade log`
Closed-trade history. Data from FINN_STATE.json `trades`.
- Summary tiles: Realized P&L · #trades · win rate (W·L) · best trade.
- Table: Date | Ticker | Action (TRIM = amber, SELL = info) | Shares | Sell | Realized. **OLDEST → NEWEST.** Realized colored pos/neg.
- Footnote (dashed top-border) for flagged/derived entries (derived sell prices; basis-confirm flags). Realized total is authoritative; sell prices may be derived from realized + basis.

## NAV Curve v1 (LOCKED) — `nav curve`
Equity curve. Data from FINN_STATE.json `nav_history`.
- Stat tiles: Current NAV · HWM · Drawdown (off HWM) · → $50K · Inception return.
- Chart: SVG line of NAV snapshots — peak points violet, HWM teal + dashed level line, current point amber, X-axis dated. (EOD-close measure adopted Jun5; legacy May29–Jun3 rows are intraday peaks until backfilled — annotate the mix.)
- Reconcile-flag callout + fix buttons when files disagree or the series mixes measures. NAV must come from a confirmed broker total — never estimated.

## Guide v1.1 (LOCKED) — `guide` / `welcome` / `start`
Newcomer FRONT DOOR. Job = lay out the project + orient someone who knows nothing about Finn + point them in the right direction. NOT the home/command-center (that's the Control Center — distinct, never conflated). Sections in order:
1. **How Finn thinks** — 8 mental models: files canonical · price integrity absolute · conviction drives sizing · dips not DCA · exits mechanical · decide + log together · lead with the call · rated & tagged (every call /100 confidence; CONFIRMED / FINN PROJECTION / SPECULATIVE).
2. **Command center** — grouped icon-above-label TILES like home (portfolio / analysis / planning / system), live sendPrompt. (Not text chips.)
3. **Under the hood** — reports & artifacts · calls & confidence · scoring & exits · tracking · state.
4. **Model & effort** — Opus (judgment / money-on-the-line) vs Sonnet (render / retrieve); effort = cost of being wrong.
5. **Try this first** — run-a-command chips + see-an-artifact chips (stock report NVDA, scenario NVDA).
No disclaimer footer.

