---
name: fundamentals
description: Fundamentals + Valuation (A4). Maintain a per-position snapshot of revenue growth, margins, FCF, debt, and dilution + valuation (P/E, EV/EBITDA, P/S vs the name's own range), and use it to ground/discipline the CS conviction score. Refresh weekly + at earnings. Data: FMP metrics-ratios-ttm + income-statement-growth (annual on Starter; quarterly Premium). Stored in FINN_STATE.json fundamentals. Feeds the position panel, a Scenario valuation line, and rescore.
---

# Fundamentals + Valuation (A4)

Conviction (CS) must be defensible against the numbers -- not just the narrative. A high CS on an unprofitable, cash-burning, heavily-diluting name is a flag, not a feature.

## The snapshot (per position; refresh weekly + at earnings)
**Fundamentals**
- Revenue growth (YoY) + the operating-leverage check (is EBITDA / net income growing faster or slower than revenue?).
- Margins: gross / operating / net.
- FCF: margin + per share (is it generating or burning cash?).
- Balance sheet: debt/equity, interest coverage, net debt.
- **Share dilution** (YoY share-count growth) -- silent killer for buildout names.

**Valuation**
- P/E, EV/EBITDA, P/S -- current, and **vs the name's own historical range** (percentile / qualitative; a formal multi-year multiple history is a refinement).
- PEG (TTM + forward) -- does growth justify the multiple?

## CS linkage (the point)
Score the fundamentals as **supportive / neutral / cautionary** to the existing CS:
- Elite margins + operating leverage + FCF generation + clean balance sheet -> supports a high CS.
- Unprofitable + cash-burning + levered + diluting -> caps CS regardless of narrative or momentum.
- **Flag any disagreement** between CS and fundamentals; rescore reconciles it.

Data source: FMP `metrics-ratios-ttm` (margins, P/E, EV/EBITDA, P/S, debt, FCF/share) + `income-statement-growth` (revenue/EBITDA/EPS growth, dilution). Annual on Starter; quarterly is Premium.

## Surfaces
- Position focus-card / detail: a fundamentals + valuation panel.
- Scenario: a valuation line (multiple vs range + PEG).
- Rescore: CS must reconcile with this snapshot.

## Example (Jun 9) -- why CS 90 vs CS 63
**AVGO (CS 90) -- CONFIRMED.** Rev +24% YoY with operating leverage (EBITDA +45%, net income +292%); margins 67 / 44 / 39; ~44% FCF margin, $6.90 FCF/sh; D/E 0.74, 11x interest coverage; only +1.9% dilution. Rich multiple (P/E 63, EV/EBITDA 46) but PEG ~0.5-0.9 -> growth-justified. Numbers fully support the high conviction; the multiple is the only caution.
**APLD (CS 63) -- JUSTIFIED CAP.** Rev +58% YoY but net margin -52%, EBITDA negative; gross margin compressing; FCF -$6.67/sh (cash burn); D/E 1.8, interest coverage -2.9x; **+76% share dilution**. P/S 34 on losses, no earnings to anchor. A buildout story, not a compounder -- the fundamentals cap conviction no matter the +49% run.
