---
name: catalysts
description: The Forward Catalyst Calendar (A6). One dated view of everything ahead -- owned + watchlist earnings, macro releases (CPI/PPI/PCE/jobs/FOMC + dot plot), conferences/investor days, index adds, lockups, post-sell window expiries. Drives the scenario auto-fire and the Market Brief Watching row. Data: FMP economics-calendar + earnings-calendar; stored in FINN_STATE.json catalysts.
---

# Forward Catalyst Calendar (A6)

One dated list of what's coming -- so nothing lands unanticipated and the scenario engine fires on time.

## What goes on it
- **Owned earnings** (+ the next few beyond, even if far).
- **Watchlist / re-entry** dates (CEG, AMD, post-sell window expiries).
- **Macro:** CPI, PPI, PCE, jobs (NFP), FOMC + dot plot, ISM.
- **Conferences / investor days** (e.g. QCOM Investor Day -- competitive read-through).
- **Structural:** index adds (forced buying), lockup expiries.

Each entry: **date - event - type - impact (high/med/low) - affected tickers - one line.**
Types: earnings | guidance | macro | competitive | structural | decision.

## Drives
- **Scenario auto-fire:** an owned name <7d; OR a major catalyst (FOMC, a competitive investor day, an index add) -> fire the relevant scenario / risk read.
- **Market Brief "Watching" row:** the next 2-3 weeks, ranked by impact + relevance.
- **Home status strip:** a "next catalyst" tile.

## Refresh
Web-source / FMP economics-calendar for macro dates ~monthly; FMP earnings-calendar for earnings; **confirm an earnings date vs IR as the name enters the <7d window** (estimated vs confirmed).

## Example (as of Jun 9) -- the near-term cluster is dense
- **Jun 10:** CPI (May, YoY est 4.2% -- hot) BEFORE open + **ORCL earnings AC** -> a double event tomorrow.
- **Jun 16-17:** FOMC + dot plot -- the regime test (rates path -> high-multiple names).
- **Jun 20:** NBIS + GOOGL post-sell windows expire (decide). **Jun 22:** MRVL -> S&P 500 (forced buying). **Jun 24:** QCOM Investor Day (read-through to MRVL/AVGO/CRDO). **Jun 25:** PCE.
- **Jul 2:** Jobs. **Jul 14:** CPI (Jun). Owned earnings resume **Aug 4** (ANET), then MRVL Aug27 / CRDO Sep2 / AVGO Sep3.
