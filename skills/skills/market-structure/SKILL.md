---
name: market-structure
description: Market Structure + Macro Linkage (A5). Each GMF/dash, read the tape's health (SPY/QQQ, VIX, HY credit, breadth) to judge systemic vs sector-specific, and translate the live macro regime into the exact holdings it hits (macro->position linkage). Data: FMP quote ^VIX/SPY/QQQ/HYG + economics; stored in FINN_STATE.json macro.market_structure / macro_sensitivity. Feeds the Market Brief Tape row + a macro->position line.
---

# Market Structure + Macro Linkage (A5)

Two jobs: read whether the tape is *breaking* or just *rotating*, and translate every macro move into "what does this mean for MY book?"

## 1 - Market structure (the tape's health)
Pull each session (FMP quote): **SPY + QQQ** (day%), **^VIX** (fear), **HYG** (high-yield credit = risk appetite). Read **breadth** (broad vs narrow).
The decision: **systemic or sector-specific?**
- Systemic risk-off: broad indices down hard, VIX spiking, HY credit widening (HYG falling), damage broad.
- Sector / sentiment: indices mild, credit calm, VIX contained -- damage concentrated in one group.
(Formal advance/decline + % above 200-dma = refinement; QQQ-vs-leaders divergence is a usable breadth proxy.)

## 2 - Macro->position linkage (the payoff)
Map the live macro regime to the **exact exposed holdings** (macro_sensitivity):
- **Rates up / 10Y spike:** long-duration, high-multiple growth derates most.
- **AI-capex pause:** the AI-semis cluster (currently ~71% of the book) -- the whole group.
- **Broad risk-off:** the high-beta names (portfolio beta ~1.4-1.6 amplifies).
- **The next dated macro event (FOMC / CPI):** which way does it push, and which names feel it?
Always close with "what this move means for the book," not a generic macro recap.

## Also track
GDP (low-frequency), plus the existing Fed / rates / CPI / jobs in macro.

## Surfaces
- Market Brief **Tape** row: SPY/QQQ + VIX + credit + breadth + the systemic-vs-sector call.
- A **macro->position line**: the regime + the exposed names.

## Example (Jun 9)
SPY -1.3%, **QQQ -1.15%** (Nasdaq NOT leading down), **VIX 19.9 (+5%)** (elevated, not panic), **HYG +0.1%** (credit calm). Breadth narrow -- the hit is concentrated in custom-silicon (-5 to -13%), not broad. **Verdict: sector-specific, not systemic -- the market isn't breaking, the custom-silicon trade is unwinding.** Linkage: the near-term risk is **FOMC Jun16-17** -- a hawkish/no-cut signal pushes rates up -> the high-multiple names (NOW, ORCL, MRVL, AVGO, CRDO, APLD) feel it most; VOO/ETN/APH more insulated.
