# FINN_SCORING_SIZING_SPEC (v1 — adopted from Run #6 triage)

> The operative rubric + sizing function. Merges into `FINN_SYSTEM_PROMPT` (v4.1 cut) and `skills/scoring` — **supersedes the weights-only rubric** there (which had no component definitions and no sizing math). Thresholds live in `params` (rev21). Decisions locked Jun 12: **Portfolio Fit removed from CS**; **MS gets the pacing job**.

---

## 1 · CS / MS rubric — anchored

Both scores are /100 over five components (Portfolio Fit dropped — CS must be book-independent or two analysts can't agree). Same components; only weights differ.

| Component | CS wt | MS wt |
|---|---|---|
| Fundamentals | 40 | 30 |
| Moat | 24 | 16 |
| Momentum | 12 | 23 |
| Growth | 16 | 23 |
| Valuation | 8 | 8 |

**FUNDAMENTALS /100** — hard precondition: a `fundamentals` row ≤90 d old, else the name renders `CS: STALE-INPUT` (cannot be silently rescored). Source: FMP `metrics-ratios-ttm` + `income-statement-growth`.
- Rev growth YoY (25): ≥40→25 · 25–40→20 · 15–25→14 · 5–15→8 · 0–5→4 · <0→0
- Margin level+trend (25): GM≥60&OM≥35→25 · GM≥45&OM≥20→18 · GM≥30&OM≥10→12 · OM 0–10→6 · OM<0→0; ±3 trend modifier (±200 bps YoY)
- FCF margin (20): ≥30→20 · 15–30→15 · 5–15→10 · 0–5→5 · <0→0
- Balance sheet (15): D/E<0.5 & cov>10→15 · D/E<1 & cov>6→11 · D/E<1.5 & cov>3→7 · else 3 · cov<1→0
- Dilution YoY (15): <1%→15 · 1–3→11 · 3–8→7 · 8–20→3 · >20→0

**MOAT /100** — four checks, each 0 / 12 / 25 (no / contested / yes), each needs a CONFIRMED fact ≤1 quarter old or scores the conservative rung: switching costs · share trajectory vs `news_watch.read_through_map` · pricing power (GM stable-or-up last 2 prints) · demand durability (backlog/RPO ≥4 quarters).

**MOMENTUM /100** — fully mechanical from the FMP feed at rescore:
- 63-day total return vs **cluster median** (`clusters`) (50): >+15 pts→50 · +5..+15→38 · ±5→25 · −15..−5→12 · <−15→0
- Price vs 50d & 200d (30): >both→30 · >200d only→18 · <both→0
- Distance to 52wk high (20): <5%→20 · 5–15→14 · 15–30→8 · >30→0

**GROWTH /100** — NTM consensus rev growth (FMP estimates, `STREET`-tagged w/ `fmp_targets._stale` age): ≥35→100 · 25–35→80 · 15–25→60 · 8–15→40 · 0–8→20 · <0→0. Pre-profit names score contracted-backlog growth instead, **capped 60**. ±10 modifier on 90 d revision direction.

**VALUATION /100** — PEG-fwd: <0.8→100 · 0.8–1.2→75 · 1.2–1.8→50 · 1.8–2.5→25 · >2.5/n.m.→10. PEG n.m. → fallback P/S vs the name's own 3 y range, **conservative rung ≤25** until formal history lands (never a silent "qualitative percentile").

*(APLD under this table derives ≈ Fundamentals 25 / very low CS — the rubric now produces the cap `cs_support` currently asserts in prose.)*

## 2 · CS → tier corridor (closes B3)
Expected CS by tier (overlaps deliberate — tier stays operator-owned): **C5 ≥85 · C4 70–88 · C3 60–78.** CS outside its tier's corridor → **mandatory `TIER-DIVERGENCE` action-queue flag** with a typed, AF-05 echo-confirmed proposal (review tier, or justify the exception with a dated one-liner). APLD (C4 / 63) flags day one — correct.

## 3 · MS's job — pacing only (closes M1)
MS never gates direction. A **scheduled, in-band** add executes at **full tranche if MS ≥65 or price is in the dip zone; half tranche otherwise.** That's MS's only consumer; it justifies the weekly rescore cost.

## 4 · Conviction → size (closes B1/M5; numbers in `params.sizing`, rev21)
Bands (% NAV): **C5 [8,16] · C4 [4,8] · C3 [1.5,4]**; foundation floor 8; starter 2.0; min position 1.5. Precedence:
1. **Caps:** effective ceiling = min(band top, concentration ladder 20/25/30). Ladder always wins.
2. **Foundation class:** outside the bands — floor = `foundation_floor_pct`, ceiling = ladder only (VOO leaves the C5 band).
3. **Target** = band midpoint (C5 12 · C4 6 · C3 2.75).
4. **New entries** start C3/C4 only at `starter_pct`, built to floor in ≤2 tranches inside zones (no-DCA preserved). "Half-starter" = 1.0%. C5 is reached only by tier review, never entered.
5. **Tier change** → echo-confirmed proposal to reach the new band within `resize_deadline_sessions` via the P4 funding-trim class, respecting `blackout_days`. (The missing re-size trigger.)
6. **Drift flag:** weight outside band by >`drift_tolerance_pct_nav` for >`drift_sessions` sessions → `SIZING` flag (never auto-trade — P2).
7. **Add sizing:** add = min(band_top − current_wt, available funding); zone-fire with short cash emits a funding **proposal** naming the source (over-band names are first eligible).
8. **Sub-scale:** position < `min_position_pct` → build-to-floor-or-exit flag at next review.
9. **Grade closure:** F2 `SizingVsConv /10 = 10 − 2×(pts outside band, capped)` — now computable.

Current book under this function (flags only, operator decides): NVDA over band (matches the standing "near ceiling" note) · ANET at floor (the underweight C5) · AMAT +3.2 over · CRDO +1.8 over · AVGO dry-half = (12 − 11.7) as a number · NOW 1.8 to midpoint.

## 5 · Worksheet storage + delta gate (closes M2)
Every rescore writes per name: `{date, components:{fund,moat,mom,growth,val}, inputs:{price, rel63d, peg, fundamentals_as_of}, inputs_hash}` to `scores.history`. **Totals-only entries are invalid post-cut.** |ΔCS|≥8 or |ΔMS|≥10 vs prior → the rescore renders **PROPOSED** with a component diff; smaller deltas auto-apply. Quarterly blind re-score of one owned name from stored inputs, tolerance ±5 — miss tightens the anchors, not the score.

## 6 · Event-triggered rescore + thesis staleness (closes M4)
Owned-name earnings print **or** `breaks_if`-relevant HIGH-materiality news (A2) → rescore that name within 1 session, independent of the weekly cadence. `thesis[*].stale_rule: warn>=90d` on `last_confirmed` (rev21). (ORCL's thesis is corrected to RPO $638B / last_confirmed 2026-06 in rev21.)

## 7 · Calibration tie-in (closes M3)
Calls snapshot `cs_at_call / ms_at_call / conviction_at_call` (rev21 — going-forward; the 3 existing calls carry null, unreconstructable from totals-only history). A7's +30 d grading doubles as score calibration (CS decile vs 30 d cluster-relative return). `confidence_was_calibrated` dropped (category error on n=1); replace with a rolling confidence-bucket hit-rate table at n≥10.

## 8 · Foundation class (closes M8)
`foundation: true` names are **exempt from CS/MS and the tier corridors**; they carry only the §4 sizing floor. VOO stops being rescored as a C5 operating company.

---
*Routing: §1 + §2 + §3 + §5–§8 → prompt v4.1 + `skills/scoring`; §4 numbers → `params.sizing` (in rev21). The "rebalance >30–35%" prose in `skills/frameworks` is killed at the v4.1 cut (contradicts `params.concentration.mandatory: 30`).*
