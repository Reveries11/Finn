<!-- skills/monitoring/SKILL.md — extracted from FINN_SYSTEM_PROMPT.md v3.0 (canonical inlined modules), 2026-06-06 -->

# Monitoring & Alerts

## Alert types
Lead every alert with **implication + action first**, then detail.

| Alert | Trigger |
|-------|---------|
| `DIP` | Price at or below dip zone |
| `EARNINGS IMMINENT` | Earnings <7 days — always flag, always show last 3 quarters |
| `VOL SPIKE 2x` | Options volume 2x+ average |
| `INSIDER BUY/SELL` | Any insider transaction (FMP `insiderTrades` / OpenInsider) |
| `SHORT INT >15%` | Short interest exceeds 15% |
| `OPTIONS FLOW` | Unusual options activity (UnusualWhales) |
| `ABOVE PT` | Price exceeds price target — review sizing |
| `WIN REVIEW` | Position +40% from entry |
| `LOSS REVIEW` | Position −20% from entry |
| `CONCENTRATION` | Single name >25% of portfolio |

**FMP-sourced (skills/fmp-feed):** EARNINGS IMMINENT ← `calendar` earnings-company · INSIDER ← `insiderTrades` · ABOVE PT ← `analyst` price-target-consensus · rating-change catalyst ← `analyst` grades.

## Monitoring rules (run on every dash)
- **Smart Money:** 13F (free SEC / WhaleWisdom) + congress trades (FMP `senate` senate-trading + house-trading). Funds tracked: Druckenmiller, Tepper, Tiger, TCI, Coatue, Point72. **Flag convergence of 2+ funds, OR congressional trades in owned names.**
- **Earnings:** EARN IMMINENT <7d = flag + last 3 quarters, always.
- **Short interest:** SHORT INT >15% = flag.
- **Options:** 2x+ volume = BUY WATCH.
- **Space news:** flag every dash.
- **Adjacent monitoring** (track supply-chain / theme neighbors proactively):
  - ETN → BE, CMI, PWR
  - NVDA / AMAT / MRVL / AVGO / CRDO → ALAB, CLS, MTSI
  - APLD → CRWV, IREN, CORZ (neocloud peers)
  - IONQ → QBTS, RGTI
- **Radar:** after T1/T2 prints — flag beat/miss + revisit the entry zone.
- **Post-sell:** maintain a 30-day re-entry watch after any exit (windows in FINN_STATE.json `watchlist.post_sell_monitor`).

## Sources hierarchy
SEC EDGAR (filings) > Benzinga / MarketWatch (breaking news) > Yahoo Finance (earnings / aggregation) > Finviz (screening).
Paywalled (Reuters / Bloomberg / WSJ) = headline only. X/Twitter = speed layer only.

**Supplemental:** EarningsWhispers (whisper numbers + calendar) · FRED (CPI/PCE/rates) · UnusualWhales (options flow) · TipRanks (analyst PT + track record) · Stockanalysis (fundamentals) · CME FedWatch (rate probability) · OpenInsider (insider) · WhaleWisdom (13F).


---

