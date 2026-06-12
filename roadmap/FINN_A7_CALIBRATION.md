# FINN — A7 CALIBRATION LOG (schema + process)

> v0.1 · 2026-06-10 · start logging NOW. Cheap in-session capture that compounds into the dataset B2 (performance attribution) needs to prove whether the scores actually work.
> Sits on top of A1 (`calls_log` in `FINN_STATE.json`) — A1 already records the *call*; A7 adds the *outcome*.

---

## 1 · WHAT IT ANSWERS (eventually, via B2)
- Is Finn's **confidence calibrated** — do 70%-confidence calls hit ~70% of the time?
- Do **high-CS names outperform low-CS names**? (the core question that makes CS falsifiable)
- Alpha vs SPY/QQQ · win rate · avg win / avg loss · best/worst calls.

---

## 2 · SCHEMA — extend each `calls_log[]` record
A1 already writes (keep): `id · date · ticker · call(ADD/HOLD/TRIM/WATCH) · size · confidence(/100) · tier · basis(CONFIRMED/PROJECTION/SPECULATIVE) · price_at_call · drivers[] · assumption · flip · risk · status`.

**A7 adds an `outcome` object, filled when the call is scored:**
```json
"outcome": {
  "scored_date": "2026-07-10",
  "horizon": "30d",                 // 7d | 30d | 90d | event | thesis-flip
  "price_at_outcome": 0.0,
  "return_since_call_pct": 0.0,     // (price_at_outcome - price_at_call)/price_at_call
  "bench": "QQQ",                   // SPY or QQQ
  "bench_return_pct": 0.0,
  "alpha_pct": 0.0,                 // return_since_call - bench_return
  "result": "hit",                  // hit | miss | partial | open
  "confidence_was_calibrated": true,// did the outcome match the confidence band?
  "flip_triggered": false,          // did the documented `flip` condition fire?
  "notes": ""
}
```
- Also append a NAV-vs-benchmark mark each session to `nav_history` (a `bench` field on each snapshot: SPY/QQQ % since inception) so portfolio alpha is computable without re-deriving.

---

## 3 · WHEN TO SCORE (the trigger rules)
- **Fixed horizon:** auto-score at +30d from `date` (and optionally +7d / +90d snapshots).
- **Event:** an earnings/catalyst call scores the day after the event.
- **Thesis-flip:** if the documented `flip` condition fires, score immediately as the relevant result.
- **Position close:** when a name is trimmed/sold, score all its open calls.
- Scoring is **in-session, low-effort** (a GNF/weekly sweep): "any calls due to score today?" → fill the `outcome` object.

---

## 4 · ROLLUP METRICS (B2 reads these later)
| Metric | Formula |
|---|---|
| win rate | hits / (hits+misses) |
| avg win / avg loss | mean `return_since_call_pct` for hits / misses |
| portfolio alpha | NAV return − bench return (from `nav_history.bench`) |
| confidence calibration | actual hit-rate per confidence band (60s/70s/80s/90s) vs the band |
| **CS efficacy** | mean forward return of CS≥85 names vs CS<75 names — *the falsifiability test* |
| call-type edge | hit-rate + avg return by call type (ADD vs HOLD vs TRIM vs WATCH) |

---

## 5 · DO-NOW (this week, in-session)
1. Backfill the existing `calls_log` (AVGO ADD, ANET WATCH, ORCL HOLD) with `price_at_call` (already present) + a `horizon` so they're scoreable.
2. From the next session on, every new call gets the `outcome` stub at creation (result:"open").
3. Add the `bench` field to `nav_history` snapshots going forward (SPY/QQQ % since inception).
4. At each GNF/weekly: run the "calls due to score" sweep.
*(All in-session — no backend. B2 turns it into the live attribution engine after Phase 3.)*
