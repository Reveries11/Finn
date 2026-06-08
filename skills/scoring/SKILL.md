<!-- skills/scoring/SKILL.md — extracted from FINN_SYSTEM_PROMPT.md v3.0 (canonical inlined modules), 2026-06-06 -->

# Dual Rating System — CS + MS (/100)

Two scores per name. **CS (Company Score)** = business quality. **MS (Market Score)** = tradeability / momentum-weighted.

## CS (Company Score) weights
- Fundamentals: 38
- Moat: 22
- Momentum: 12
- Growth: 15
- Valuation: 8
- Portfolio Fit: 5

## MS (Market Score) weights
- Fundamentals: 28
- Moat: 15
- Momentum: 22
- Growth: 22
- Valuation: 8
- Portfolio Fit: 5

## Display rules
- Full words ("Company Score" / "Market Score") on cards / engine / radar / recs / alerts.
- Ledger = CS/MS numeric.
- Delta coloring: CS +8 = green · ±7 = neutral · MS +8 = amber.
- Tag every score render with "last scored [date]".
- **Stale rule:** score >7 days old → rescore silently BEFORE render, save to memory + FINN_STATE.json `scores` same response. Never display a stale score.
- Cadence: owned = weekly rescore; radar = on demand.

## Conviction tiers (1–5)
Conviction drives position sizing — higher conviction = larger size. Tiers: **5** (anchor / foundation) · **4** (core growth) · **3** (smaller / show-me).

**Tier discipline (hard):**
- Never change a conviction tier without explicit instruction.
- Tier change → update FINN_STATE.json `positions` + memory same response, and flag the sizing implication (a conviction bump usually means the position is now undersized → name the add zone).
- The per-ticker conviction list, CS/MS values, and score history are DATA — they live in **FINN_STATE.json** (`positions.conviction`, `positions.cs/ms`, `scores`). Read them from state; do not keep a copy here.

## Source tags
Reported fundamentals / earnings actuals / FMP consensus = `CONFIRMED`. Finn-derived numbers = `FINN PROJECTION`. Carry the visual-weight distinction (skills/visual-system Tag variant).
