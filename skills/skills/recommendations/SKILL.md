---
name: recommendations
description: The Recommendation Contract (A1). Apply whenever Finn issues or renders an ADD / HOLD / TRIM / WATCH call -- in Scenario verdicts, the Market Brief Calls row, focus-card recs, or alerts. Defines the required fields (call, confidence band, drivers tagged FACT/INFERENCE/OPINION, assumption, flip, risk) and the calls_log entry every call writes to FINN_STATE.json (which also seeds calibration, A7).
---

# Recommendation Contract (A1)

Every actionable call Finn makes is structured, sourced, and falsifiable. No bare "I'd add here."

## The contract -- required on every ADD / HOLD / TRIM / WATCH
1. **CALL** -- ADD | HOLD | TRIM | WATCH (+ size where relevant: "+2 sh", "trim to 18-20%", "add on a dip to $140-145").
2. **CONFIDENCE** -- nn/100, with a band + a data basis:
   - Bands: **HIGH >=75 | MEDIUM 55-74 | LOW <55**
   - Basis: **CONFIRMED** (rests on facts / filings / announced events) | **FINN PROJECTION** (model inference from facts) | **SPECULATIVE** (thin / unconfirmed)
3. **DRIVERS** -- 2-3, each ONE line, each tagged:
   - **[DATA]** -- verifiable + sourced + dated (price, street PT, a filing, an announced deal, an earnings number). Always carry source + date.
   - **[READ]** -- Finn's reasoning *from* the facts (probabilities, "selling on sentiment not fundamentals", read-through).
   - **[TAKE]** -- the judgment (the call itself, conviction weighting).
4. **ASSUMPTION** -- the main thing taken as true for the call to hold.
5. **FLIP** -- what specifically would change the call (the falsifier). Every call has one.
6. **RISK** -- the primary risk to the call.

## Hard rules
- State **confidence + the FLIP on every call** -- no exceptions.
- **Never present an [TAKE] or [READ] as a [DATA].** If it isn't sourced, it isn't a fact.
- Facts carry a source + date; if you can't source it, tag it inference and lower the confidence.
- **Log every call to `calls_log` the same turn** it's made -- this is also the calibration seed (A7).
- Compact surfaces (focus-card rec, alert) may show only the **head** -- `CALL | CONF | basis` -- with the full contract on tap/expand. The full contract is mandatory in Scenario and the Market Brief Calls row.

## calls_log entry (write to FINN_STATE.json.calls_log)
```json
{
  "id": "call_YYYYMMDD_TICKER_n",
  "date": "YYYY-MM-DD", "ticker": "AVGO", "call": "ADD", "size": "...",
  "confidence": 70, "tier": "MEDIUM", "basis": "FINN PROJECTION",
  "price_at_call": 387.12,
  "drivers": ["[DATA] ... (src, date)", "[READ] ...", "[TAKE] ..."],
  "assumption": "...", "flip": "...", "risk": "...",
  "status": "open|executed|closed|invalidated", "outcome": null
}
```
`outcome` is filled later (price/return vs the call, and vs SPY) so calibration (B2) can score whether confident calls actually worked. `status` tracks the call's life.

## Examples
**ADD -- AVGO**
CALL ADD (+1 sh) | CONF 70/100 MEDIUM | FINN PROJECTION
- [DATA] $382 -- below cost and the $410-420 dip zone; street PT $400-582 all above spot, 51 Buy / 0 Sell (FMP, Jun9)
- [DATA] $35B Anthropic custom-chip + networking deal announced (Reuters/Barron's, Jun9)
- [READ] Selling on ByteDance-QCOM custom-silicon sentiment, not AVGO fundamentals
- [TAKE] Highest-CS name; worth a partial add funded by the NVDA trim
ASSUMPTION no hyperscaler pulls ASIC in-house | FLIP QCOM Investor Day (Jun24) shows real share loss | RISK adds custom-silicon concentration; FOMC macro risk

**HOLD -- MRVL**
CALL HOLD | CONF 78/100 HIGH | CONFIRMED
- [DATA] -13% today on the ByteDance-QCOM ASIC headline; still +29% on cost, CS 84 (FMP, Jun9)
- [DATA] Joins the S&P 500 Jun22 (Yahoo/24-7, Jun9)
- [READ] A crowded-trade shakeout, not a thesis break -- ByteDance is a different segment than MRVL's Tier-1 + NVIDIA-NVLink engagements
- [TAKE] No trigger tripped; hold through the volatility
ASSUMPTION custom-ASIC order book intact | FLIP a hyperscaler design-win loss / order stall | RISK continued de-rating if the whole custom-silicon trade keeps unwinding
