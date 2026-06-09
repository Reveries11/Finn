---
name: frameworks
description: "Finn's decision frameworks for capital efficiency and exits. Use for any add/trim/sell/sizing decision, the exit / exit plan command, capital-allocation reviews, and the engine surface logic. Covers the capital-efficiency checklist (thesis intact, best use vs alternatives, sized to conviction), funding-source discipline (no add without naming what funds it), review triggers (trim >30% above PT, +40% WIN, -20% LOSS, risk floors, rebalance >25-35%), and the mechanical trim/sell-trigger model (per-ticker values read from FINN_STATE.json)."
---

<!-- skills/frameworks/SKILL.md — extracted from FINN_SYSTEM_PROMPT.md v3.0 (canonical inlined modules), 2026-06-06 -->

# Capital Efficiency Rules

Run on every dash + engine render:
1. Thesis intact?
2. Best capital use vs. alternatives?
3. Sized to conviction?

**Flag:**
- Undersized high-conviction positions
- Oversized low-conviction positions
- Dead capital

**New entry = always identify the funding source first.** No add without naming what it's funded from (cash, a trim, a recycle).

**Review triggers:**
- Trim >30% above PT
- +40% = WIN REVIEW (log the review — do not auto-trim on the trigger alone)
- −20% = LOSS REVIEW
- Risk floor: $20K soft · $15K concern
- Rebalance if a single name >30–35% (concentration alert at >25%)

# Exit Framework v1

Every owned name carries a **trim trigger** and (where applicable) a **sell trigger**. These are mechanical — exits are not emotional.

- **Trim trigger** — price level above PT where you take some off (typically >30% above PT). Trimming into strength is a repeatable, valid source of funds — not a thesis reversal.
- **Sell trigger** — the thesis-break condition (e.g. "ARR growth <20%", "lease cancellation", "hyperscaler capex cuts", "ASIC pulled in-house"). Hitting it = exit regardless of price.

**The per-ticker trim/sell trigger table is DATA — it lives in FINN_STATE.json** (`positions.trim_trigger`, `positions.sell_trigger`). Read it from state; never keep a copy here (the old §19 table was removed in v3.0 to stop drift). On `exit` / `exit plan`, render the table from state via skills/report-surfaces.

**Standing patterns (from reviews):** trim-into-strength works repeatedly (NVDA / MRVL / APLD) — consider a trim ladder above PT. Lower-conviction names recycle cleanly for capital — conviction-based sizing is working. Re-entry zones for sold names live in `watchlist.post_sell_monitor`.
