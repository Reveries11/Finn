---
name: risk
description: The Portfolio Risk Layer (A3). Run a risk audit on every GMF/dash. Computes concentration (single-name, top-3/5, and theme/cluster %), a correlation read (how many independent bets), portfolio beta, soft-floor proximity, and portfolio-level stress tests. The key insight: a book can look diversified per-name yet be one thematic bet. Clusters + limits live in FINN_STATE.json clusters/risk. Feeds the Risk surface, a Market Brief risk line, a Home concentration stat, and a Scenario stress test.
---

# Portfolio Risk Layer (A3)

Per-name concentration hides theme concentration. Always show both.

## Run every GMF / dash (a RISK AUDIT, like the zone audit)

### 1 - Concentration
- **Single-name %** of NAV -- flag any name >20% (the ceiling).
- **Top-3 / Top-5 %.**
- **Cluster / theme %** -- sum holdings by theme (clusters map). Report the dominant cluster + the AI-semis supercluster. THIS is the view that matters: per-name can read diversified while the book is one bet.

### 2 - Correlation read
How many *independent* bets is this, really? Use observed co-movement (do the cluster names move together?) -- effective bets are usually far fewer than the position count. A formal correlation matrix (price-history) is a refinement.

### 3 - Beta + drawdown
Portfolio beta (weighted per-name beta) -- a high-beta book amplifies market moves. Drawdown from HWM + cushion to the soft floor / concern threshold.

### 4 - Stress tests (portfolio-level, not per-stock)
Model NAV impact of:
- **AI-semis -10%** (a sector shock) = AI-semis cluster % x -10%.
- **Broad market -10%** at portfolio beta.
- **AI-thesis derate -20%** (the real tail -- a regime change in AI capex) = AI-buildout theme % x -20%.
Report NAV impact % + resulting NAV vs the soft floor.

## Flags
- Single name >20% -> trim flag. A cluster dominating (>60-70%) -> concentration warning. Drawdown nearing the soft floor -> de-risk flag.

## Surfaces
- **Risk surface** (dedicated): concentration + cluster bars + correlation + beta/soft-floor + stress tests.
- **Market Brief:** a one-line risk read (top cluster %, beta, biggest stress).
- **Home status strip:** a concentration stat (top name % / top cluster %).
- **Scenario:** the portfolio-level stress test alongside the per-stock cases.

## Example (Jun 9)
Per-name looks fine (NVDA 19.6%, nothing else >12%) -- but clusters tell the real story: **AI compute silicon 36.9% + AI networking 23.8% + semicap 10.1% = ~71% AI-semis & hardware; ~82% the broader AI buildout.** Correlation high intra-cluster (today MRVL -13 / AVGO -5 / ANET -5 vs VOO -1.3, APH +2.9) -> effectively ~3-4 independent bets, not 12. Beta est ~1.4-1.6. Stress: AI-semis -10% -> NAV ~-7%; broad -10% -> ~-15%; AI-derate -20% -> ~-16% (~$23.9K, still above the $20K soft floor). **Takeaway: one concentrated AI-buildout bet; today proved the names move as one.**
