# Finn — Phase 3: Discrete Surface Fixes

The confirmed Fable findings that are contained, independent fixes. One section each. Source for Saturday queue **A4, A5(remainder), A7, A8, A9, A10**.

---

## A4 · Cash visibility
**Problem:** cash is $49.47 — effectively zero dry powder — while three ADD calls are standing. Cash appears only buried in a QuickDash stat, a Gameplan badge, and a Brief bullet.
**Fix:**
- Permanent **Cash / buying-power** slot in the TopBar strip (it's more operative daily than Realized — add it, or swap).
- Every **ADD** call carries a funding line: `funded by: trim NVDA 1sh / cash $49`.
- **Gameplan = sources-vs-uses**: a dry-powder figure vs planned deployment, flagged coral when uses ($500–700) exceed sources ($49).
**Apply:** make "you have no dry powder" impossible to miss the moment the system suggests an add.

## A5 · Observatory (remainder)
*(Clickable planets → Detail already specced in `FINN_NAV_STRUCTURE.md` §4.)*
**Problems:** colored by inception P&L (a −2% day still glows green); ring angle means nothing; `conv>=4?4:3` mislabels a conviction-2 name onto the C3 ring; the Ladder silently drops rows at small sizes.
**Fix:**
- **Planet fill = day move** (green/coral/neutral); **planet ring = inception P&L** — see both "today" and "lifetime" at once (today it only shows lifetime → blind to the day).
- **Orbit ring = conviction tier**, explicit C5(inner)→C3(outer); never collapse a conv-2 onto C3 — render its true tier or flag it as an outlier.
- **Angle = distance-to-action** (proximity to dip zone / PT) or sort by market value — give it meaning.
- **Ladder never silently truncates** — render all, or "+N more" with expand. The claim is "the whole book."
**Apply:** make it clickable + day-aware, then stop — the Ladder is the daily workhorse; don't invest in orbital motion/physics.

## A7 · Process layer (the QUEUE)
**Problem:** Home's Action Queue is just the 3 calls. The richer QUEUE (the ORCL-style holds, MRVL/APLD win-reviews-due) is defined in data but never rendered — the process tasks that are the system's soul have no home.
**Fix:** Home Action Queue renders the **full QUEUE** — open calls + reviews-due (+40% / −20% triggers) + holds + armed alerts — each with a **state** (new / due / waiting) and a CTA, ordered by urgency. *(Add/Trim → "Log a decision" already in `FINN_INTELLIGENCE_WEB.md` §3.)*
**Apply:** this is where the discipline becomes visible every morning.

## A8 · Exit + tables
**Problems:** Exit renders "—" for 5 of 11 sell-triggers (ANET, ETN, APH, MRVL, ORCL) with no flag — the surface whose whole job is "every position has a defined exit" shows absence as a quiet dash. Ledger excludes VOO and has no totals row (can't reconcile to NAV); Exit/Rescore include VOO → inconsistent.
**Fix:**
- Exit header **alert**: "5 names missing sell-triggers," those rows **amber** (action-needed), never a silent dash.
- **Totals rows** on every table (Positions / Performance / allocation) so they reconcile to NAV.
- One **inclusion convention**: include VOO everywhere (NAV, allocation, exit-completeness) tagged "foundation — not a thesis trade," and exclude it from the active dip/scenario flows. Apply consistently across Ledger/Exit/Rescore/Risk.
**Verify:** check the canonical state — are those 5 sell-triggers actually undefined, or just absent from the mock? If undefined in the live book, that's a real gap to fill (every position needs an exit).

## A9 · Performance / NAV curve  *(merges NAV Curve + Trades)*
**This is the #1 credibility gap — no real time-series anywhere.**
**Fix — the equity curve:**
- Separate strokes: **EOD closes = solid line**, the **live/intraday point = a dashed/hollow tail** (one shared stroke + a glow dot stretched full-height is the main "set-dressing" tell).
- **Milestone gridlines** at $30K and $50K (the goal, on the curve).
- **HWM marker** + **drawdown shading** below it.
- **Fixed Y-axis** (inception → $50K), not per-series auto-zoom.
- **Range toggle** (1W / 1M / inception).
- **VOO benchmark line** — "am I beating the index" is currently unanswerable and is the question that matters.
**Fix — the page (curve + trades merged):** equity curve on top; trade log (oldest→newest) + realized/win-rate tiles below. Fix the mislabel — best-$ (NVDA) and best-% (ANET) are different names; label each.
**Sub-item — sparklines (closes "time-series everywhere"):** a small price **sparkline** on each position card + Detail. Synthesized history is fine in the mock; real history arrives with the Phase-3 data layer.
**Apply:** the curve + sparklines are the single biggest "feels like a real instrument" move.

## A10 · Stale state
**Problem:** the banner promises "price cells blank" when stale, but the UI just dims numbers to 0.82 opacity — looks live, slightly faded. Misleading.
**Fix:** stale = **last-known value + a per-cell age tint** (subtle amber edge that deepens with age, or a small timestamp) — never blank, never same-number-dimmed. **One global data-age indicator** in the TopBar; per-cell staleness only when a cell diverges from global age (kills the "three baked clocks = theater" effect — one clock).
**Apply:** stale should read as "this is the last good number, N min old," not as a faded live number.
