# Finn — Spec-Stack Pressure Test (for Claude Fable)

**What this is.** Finn is a portfolio-intelligence cockpit for one operator running a real, concentrated AI-infrastructure book (full context is in the specs below). A prior review of the build produced findings; **the specs in this document are the response — the changes about to be applied Saturday.** Your job is **not** to re-critique the product from scratch. It is to **pressure-test the plan before it's built**, so conflicts and gaps get caught while they're cheap.

**Read this first — a known false positive to avoid.** The prior review graded a *stale, hand-synthesized mock* (rev13) whose numbers were never internally reconciled — so "the cockpit shows contradicting numbers" was largely a mock-data artifact, not a live-system bug (the canonical state *is* reconciled), and the mock's AVGO earnings date was simply wrong (AVGO had already reported). The real, valid lesson — that the *architecture* permitted divergence — is what the architecture spec addresses. **Don't re-flag stale-mock numbers; judge the specs.**

**Constraints (settled — critique within them):**
- **Two render targets, never conflated.** *Chat surfaces*: render inline via a widget that **cannot self-fetch** (CSP-blocked); locked v3.3 visual system. *Phase-3 app*: Next.js, server-side fetch — **the v4 "Command Deck" specs target this app.** Time-series, motion, live data, and persistence are legitimate for the app and impossible in chat.
- **FMP Starter:** prices are **polled per-ticker** — no batch, no true streaming.
- **NAV** = Σ(live value) + cash; goal-progress is anchored to the **broker EOD close** (deliberate, not intraday).
- **Vocabulary is ADD / HOLD / TRIM / WATCH with numeric confidence (0–100)** — canonical. (A prior brief wrongly said "exactly ADD/HOLD/TRIM, High/Med/Low"; corrected.)
- **Visual:** dark, instrument-grade; **signal-only color** (per the color spec); Space Grotesk + JetBrains Mono.
- **Mobile:** read-only companion (per the mobile spec).

**The specs below, in build order:** queue (overview) → color → nav/structure → intelligence-web → discrete fixes → architecture → mobile.

---

## Your task — pressure-test the stack

1. **Conflicts** — any two specs that contradict or step on each other (a color rule vs a component; the nav structure vs the intelligence-web links; a merged surface vs a fix that assumed the old one)?
2. **Gaps** — any prior finding these specs don't actually close? Anything important left unaddressed?
3. **Constraint violations** — anything assuming capabilities the constraints rule out (something only possible in the app expected in chat; assuming a streaming feed; intraday goal-progress)?
4. **Sequencing / dependencies** — is the build order right? Anything that should move earlier/later or that blocks another item?
5. **Over-engineering** — anything specced that isn't worth the effort, or is simpler than proposed?
6. **The trust fix** — does the architecture spec (single store + derived selectors + provenance chips + reconciliation tile) actually make the "contradicting numbers" class of bug *structurally impossible*? Poke at it specifically.

## Deliverable
- **Per spec: GO / GO-WITH-CHANGES / RECONSIDER**, one-line reasoning each.
- **Flagged risks** (conflicts / gaps / constraint issues) — each with the specific spec and a concrete fix.
- **Sequencing corrections**, if any.
- **The single thing most likely to bite during the Saturday build**, and how to pre-empt it.

Be direct and specific; concrete beats comprehensive. Where you'd build it differently, say so — but stay inside the constraints.

═══════════════════════════════════════════════════════════════
# THE SPEC STACK
═══════════════════════════════════════════════════════════════


───────────────────────────────────────────────
###### FILE: FINN_CLAUDE_DESIGN_QUEUE.md
───────────────────────────────────────────────

# Finn — Saturday Transfer Queue

Everything to apply in **Claude Design** Saturday. Specs produced through the week; Saturday is execution. Sections B and C are tracked here; B is build-only, C is mostly doc edits.

Status: **[ready]** spec written · **[inline]** short checklist below · **[decision]** needs sign-off

---

## A · Claude Design — Saturday batch  (apply in order)  —  **all spec-ready**

| # | Item | Status | Source |
|---|---|---|---|
| 1 | **Color system v4 — signal-only** | **[ready]** | `FINN_COLOR_SYSTEM_v4.md` |
| 2 | **Surface consolidation** (28→17 + drill-in + drawer) | **[ready]** ✅ | `FINN_NAV_STRUCTURE.md` §1 |
| 3 | **Wayfinding / nav** (rail, ⌘K, breadcrumb, drawer, active-state) | **[ready]** | `FINN_NAV_STRUCTURE.md` §2–6 |
| 4 | **Cash visibility** (TopBar slot, funding lines, sources-vs-uses) | **[ready]** | `FINN_DISCRETE_FIXES.md` A4 |
| 5 | **Observatory** (click ✓, day-color, tier orbit, no truncation) | **[ready]** | `FINN_NAV_STRUCTURE.md` §4 + `FINN_DISCRETE_FIXES.md` A5 |
| 6 | **Intelligence web** (every ticker a link; thread panel; cross-links; "Log a decision") | **[ready]** | `FINN_INTELLIGENCE_WEB.md` |
| 7 | **Process layer** (Home renders the full QUEUE) | **[ready]** | `FINN_DISCRETE_FIXES.md` A7 |
| 8 | **Exit + tables** (missing-trigger flags, totals rows, VOO convention) | **[ready]** | `FINN_DISCRETE_FIXES.md` A8 |
| 9 | **Performance / NAV curve** (EOD/live split, milestones, HWM, range, VOO benchmark, sparklines) | **[ready]** | `FINN_DISCRETE_FIXES.md` A9 |
| 10 | **Stale state** (last-known + age tint, one global clock) | **[ready]** | `FINN_DISCRETE_FIXES.md` A10 |
| 11 | **Provenance chips + reconciliation tile** (the renderable piece of the spine) | **[ready]** | `FINN_ARCHITECTURE.md` §2–3 |

---

## B · Phase-3 build — NOT Claude Design  —  **spec-ready**
`FINN_ARCHITECTURE.md`: single canonical store + derived selectors + state-contract invariants (§1); provenance tokens (§2); reconciliation checks (§3); **event-spine / unified calendar store** (§4); data flow (§5). Build the state contract first.

## C · Doc / system reconciliation — NOT Claude Design
- **Mobile companion spec** — **[ready]** `FINN_MOBILE_SPEC.md` (read-only; gated on Phase-3 push).
- **WATCH + numeric confidence → docs** — **[inline]** edit `readme.md`, the recommendation-contract, `FINN_FABLE_REVIEW.md` §2.
- **Fold Jun-11 v4 decisions** into `FINN_CLAUDE_DESIGN_BRIEF.md` / design change sheet — **[inline]**.

---

*Updated Jun 11 — all 11 Section-A items + B + the mobile spec are spec-ready. Only the two [inline] doc edits remain, listed in chat.*


───────────────────────────────────────────────
###### FILE: FINN_COLOR_SYSTEM_v4.md
───────────────────────────────────────────────

# Finn — Color System v4 (Signal-Only)

**Decision (Jun 11, post-Fable review):** color is reserved **exclusively for signal and state**. Every categorical taxonomy — sectors, news classes, catalyst types — goes **neutral**, distinguished by a shape glyph, not a hue. Net effect: every colored pixel on the cockpit means something is *up, down, due, live, or actionable*. This is a deletion, not a redesign.

Root cause this fixes (confirmed in `tokens/colors.css`): the sector ramp samples the signal hues — `sec-infra` = coral (= loss), `sec-semis` = mint (= brand/live), `sec-power` = cyan (= HOLD/info), `sec-software` = amber (= TRIM/warn), `sec-network` = violet (= WATCH). So APLD at +66% wears a coral "loss-colored" badge, cyan HOLD pills sit next to cyan Power badges, etc. Neutralizing the categoricals removes every one of these collisions.

---

## 1 · The signal palette — the *only* things allowed to carry color

| Token | Hex | Means | Used for |
|---|---|---|---|
| `--finn-green` | `#43ee6b` | gain / up | P&L positive, day-up, ADD |
| `--finn-coral` | `#ff6f64` | loss / down / alert | P&L negative, day-down, breaches, reconciliation-fail |
| `--finn-mint` | `#46e0bd` | **live / interactive / brand** (NOT gains) | live dots, the live price marker, active controls |
| `--finn-gold` | `#f4cf6a` | goal / price target | the $50K goal, PT markers/lines |
| `--finn-amber` | `#ffbe52` | warning / watch / act-now | TRIM, dip-zone band, "imminent," missing-data flags |
| `--finn-cyan` | `#54c8ff` | info / incoming | HOLD, new/incoming items |
| `--finn-violet` | `#b39cff` | WATCH state | the WATCH recommendation only |

Recommendation states stay distinct and collision-free: **ADD = green · HOLD = cyan · TRIM = amber · WATCH = violet.** (WATCH + numeric confidence are now canonical.)

Nothing else gets a hue. If a thing isn't up/down/live/goal/watch/info, it's neutral.

---

## 2 · Categoricals → neutral + glyph

Sectors, news classes, and catalyst types render as **`--finn-ink-dim` text + a hairline border + a leading shape glyph** (8–9px, `--finn-ink-faint`). Position and the glyph carry the scan; color carries nothing.

**Sector glyphs** (one shape each, monochrome):
- AI Semis ▣ · Networking ⬡ · AI Software ◇ · AI Infra ▤ · Power ◈ · Foundation ●

**News classes** (Competitive / Commercial / Earnings / Structural / Product / Guidance / Macro): neutral text label, no hue. The *only* colored thing on a news row is the **`net` signal** — bullish = green dot, bearish = coral dot, binary = amber dot, neutral = ink. That's the part that's actually a signal.

**Catalyst types** (earnings / macro / structural / decision): neutral label. The signal on a catalyst is **proximity/urgency** — imminent (<7d) = amber, today = coral, else ink — never the type.

---

## 3 · Token diff — what to change in `tokens/colors.css`

Retire the sector hues; remap them all to neutral (kept as names only, for the glyph layer):
```css
/* was: each a sampled signal hue → collisions */
--finn-sec-semis:    var(--finn-ink-dim);
--finn-sec-network:  var(--finn-ink-dim);
--finn-sec-software: var(--finn-ink-dim);
--finn-sec-infra:    var(--finn-ink-dim);
--finn-sec-power:    var(--finn-ink-dim);
--finn-sec-found:    var(--finn-ink-dim);
/* sectors are now distinguished by glyph + label, not color */
```
`SECTOR_COLORS` in `finn-data.js` → replace the color values with glyph keys (or drop it and map sector→glyph in the badge component).

Keep `--finn-rec-*` and the signal aliases as-is (they're correct).

---

## 4 · Fix the levels family (the gold collision)

Today `PriceTrack` and the `Ladder` disagree, and `Ladder` uses gold for *both* dip and target. One rule everywhere, each marker a distinct signal:

- **Cost basis** → `--finn-ink-dim` (neutral reference line)
- **Current price** → `--finn-mint` (it's *live*)
- **Dip zone** → `--finn-amber` band (opportunity / act)
- **Price target** → `--finn-gold` (goal)

(This refines Fable's "dip=gold / target=mint" — target=mint would collide with mint=live, so target=gold, current=mint. No marker shares a hue.)

---

## 5 · Two related cleanups

- **ScoreMeter** (finding #11): drop the binary ≥85-mint / else-gray. CS/MS render as a **neutral 3-step ink ramp** (`ink-faint` < `ink-dim` < `ink`) or numbers only. Reserve mint strictly for live/interactive — a score is neither.
- **Conviction**: stop the mint→coral ramp (conv-5 = brand-mint, conv-1 = loss-coral, both collisions). Render conviction as **N filled pips of 5 in `--finn-ink`** (empty = `--finn-line`). The count carries it; no hue needed. (`ConvictionPips` already exists — just de-hue it.)

---

## 6 · Apply

- **In Claude Design:** attach this file and say *"Apply Finn Color System v4: make all sector/news-class/catalyst-type color neutral (ink-dim + the shape glyphs in §2), keep color only for the §1 signals, fix the levels family per §4, and de-hue ScoreMeter + ConvictionPips per §5."* Then eyeball Positions, Watchlist, News, Catalysts, and the Observatory for any remaining colored categorical.
- **In the Phase-3 build:** the §3 token diff + the component changes (badge → glyph, news row → `net`-only color, PriceTrack/Ladder → §4) are the whole change.

**Acceptance check:** scan every surface and ask of each colored element — *does this color mean up, down, live, goal, watch, or info?* If not, it's a bug.


───────────────────────────────────────────────
###### FILE: FINN_NAV_STRUCTURE.md
───────────────────────────────────────────────

# Finn — Navigation & Surface Structure

The approved consolidation (28 → 17 destinations + 1 drill-in + a System drawer) and the wayfinding that dresses it. This is the source for Saturday queue **A2 (consolidation)** + **A3 (nav)**.

---

## 1 · The surface map (approved Jun 11)

Five groups. The grouping is the navigation.

**DAILY**
1. **Market Brief** — default route
2. **Home** — Control Center + Observatory
3. **Quick Dash** — compact ⇄ full **density toggle** *(absorbs Full Dash)*

**BOOK**
4. **Positions** — cards ⇄ table **toggle** *(absorbs Ledger)*; an "in-dip" **filter** here *(absorbs Dip Check's daily use)*
   → **Position Detail** — *drill-in, not a rail item* (the thread hub; see §4)
5. **Scores** — *merges Engine + Rescore* (CS/MS, capital efficiency, rescore actions)
6. **Risk / Allocation**
7. **Performance** — *merges NAV Curve + Trades* (equity curve on top, trade log + realized stats below)

**ANALYSIS** (all kept — distinct intelligence)
8. Scenario · 9. News · 10. Macro · 11. Smart Money · 12. Fundamentals · 13. Blindspots

**PLANNING**
14. **Gameplan** — *absorbs Dip Check's watchlist-candidate panel*
15. **Catalysts** — *absorbs Earnings* as a filtered lens (the event-spine direction)
16. **Watchlist**
17. **Exit**

**SYSTEM** — *a drawer, not rail items* — merges Guide + Reports + Sync.

---

## 2 · The NavRail (grouped, icon-only, left)

Replace the 8-item flat rail with a **grouped icon rail**: clusters separated by hairline dividers, one cluster per group. Icon-only at rest; label on hover; lit when active.

```
[ Finn glyph ]
────────────
DAILY      ▸ Brief · Home · Quick Dash
────────────
BOOK       ▸ Positions · Scores · Risk · Performance
────────────
ANALYSIS   ▸ Scenario · News · Macro · Smart Money · Fundamentals · Blindspots
────────────
PLANNING   ▸ Gameplan · Catalysts · Watchlist · Exit
────────────         (pinned to bottom)
[ ⚙ System ]  [ ⌘K ]
```

- Every destination is one click — no nesting for the 17. Dividers carry the grouping.
- Hover reveals the text label (and optionally the group name).
- **If desktop height is tight:** Analysis (heaviest group, least-frequent) may collapse to a single group-glyph with a flyout; keep the other four groups expanded. Lead with fully-expanded.

## 3 · Command palette (⌘K)

- **Persistent ⌘K hint in the TopBar**, on every surface — today it's only discoverable from Home, but the default route is Brief.
- Fuzzy-jumps to any of the 17 surfaces, **any ticker** (→ its Position Detail), and key actions. The power-user path that makes 17 destinations feel like 3.

## 4 · Position Detail (drill-in)

- Reached by clicking a position (card, row, or Observatory planet) — **not** a rail destination.
- TopBar shows a breadcrumb: **Positions › AVGO**. The rail keeps **Positions** lit while you're in Detail.
- This is the thread hub (next catalyst · open call · news · thesis/breaks · street vs curated PT) — speccd in the intelligence-web work (Phase 2).

## 5 · System drawer

- One **⚙** at the rail bottom opens a slide-in drawer: **Guide · Reports · Sync**. Low-frequency, so off the primary rail.

## 6 · The active-state fix (Fable #3)

Today `RAIL_OF` maps only 3 routes, so on ~20 surfaces nothing in the rail highlights and the operator is unplaced. **Every route must map to a rail item** (or its parent, for Detail). Rule: the active surface's icon is lit (accent/mint); its group divider gets a subtle accent tick. No surface renders with a dead rail.

---

## 7 · Apply (Claude Design, Saturday)

> Regroup the surfaces into the five groups in §1 (apply the merges/toggles noted), rebuild the NavRail per §2, add the persistent ⌘K hint + palette (§3), make Position Detail a drill-in with a breadcrumb (§4), move Guide/Reports/Sync into a System drawer (§5), and ensure every route lights its rail item (§6).

**Result:** 17 rail destinations + Position Detail + a System drawer, in 5 groups — and the operator is never unplaced.


───────────────────────────────────────────────
###### FILE: FINN_INTELLIGENCE_WEB.md
───────────────────────────────────────────────

# Finn — The Intelligence Web

The promise that separates Finn from a dashboard: a traceable chain — **news → position → scenario → risk**, reachable in a click or two. Today it's ~40% realized (tickers are clickable but most lead nowhere; PositionDetail doesn't gather a name's threads). This spec makes the web real. Source for Saturday queue **A6**.

---

## 1 · Three universal rules (apply everywhere)

1. **Every ticker is a link.** Held → its **Position Detail**. Not-held (read-through rivals, watchlist, catalyst names) → a **quote peek** popover with an "add to watchlist" action. No ticker is ever a dead pointer-cursor (fixes the no-op affordance).
2. **Position Detail is the junction.** Every thread for a name converges there (§3). Any surface that mentions a held name links into its Detail.
3. **You can always trace back.** Breadcrumbs in the TopBar (`Positions › AVGO › Scenario`), and a persistent "← back" that returns to the surface you threaded from, not a fixed home.

---

## 2 · The link graph (the wires)

Each surface gets specific outbound links. Bidirectional where it matters.

- **Position Detail** → open call · next catalyst · classified news (this ticker) · thesis + break · risk contribution · street-vs-curated PT *(all in the §3 panel)*.
- **News item** → the tagged position(s) [Detail] · "does it move the book? → Scenario" · materiality that shifts concentration → Risk.
- **Scenario** → the position [Detail] it concerns · each branch's **Risk impact** [Risk] · the **catalyst** that fires it [Catalysts].
- **Catalysts / Earnings** → affected position(s) [Detail] · the scenario that fires on the event · read-through tickers [Watchlist/quote peek].
- **Risk / Allocation** → click a concentration slice or name → the position(s) [Detail] · the sizing scenario if one's open.
- **Observatory planet** → Position Detail (also in the nav spec).
- **Smart Money** → the held name [Detail] or watchlist name [Watchlist].
- **Gameplan / Watchlist** entry → Detail (if held) or quote peek (if not).

The pattern under all of it: **a "Related" affordance** on every analysis surface listing the linked position / scenario / news / catalyst for whatever you're looking at.

---

## 3 · PositionDetail thread panel (the hub)

PositionDetail's right column becomes the **thread panel** — five live wires, each a one-click jump to its source surface:

| Wire | Shows | Links to |
|---|---|---|
| **Open call** | the live ADD/HOLD/TRIM/WATCH + numeric confidence + the one-line driver | Scenario / call detail |
| **Next catalyst** | the soonest dated event for this ticker (earnings, macro, trigger) + T-countdown | Catalysts |
| **Latest news** | top 1–2 classified items tagged to this ticker (class neutral, `net` colored) | News (filtered) |
| **Thesis + break** | the one-line thesis and the explicit break condition | thesis ledger |
| **Levels** | cost · live · dip zone · **street vs curated PT** (both, side by side) | Fundamentals / PT |

Left column stays the price/levels chart + the position facts. The thread panel is what makes Detail the place you *land and branch from*, not a dead end.

**Re-scope the dead controls** (Fable #8): the Add/Trim buttons here become **"Log a decision"** (drafts a Trades/Ledger entry) — never order entry. And only ONE color per word: TRIM the action and TRIM the button are both amber.

---

## 4 · The canonical thread (the demo that proves it)

This path should be ≤4 clicks end to end:

> **News:** "ByteDance–Qualcomm custom-silicon deal" (tags MRVL/AVGO/CRDO) → click **AVGO** → **AVGO Detail** (thread panel: open ADD call · next catalyst · this news · thesis/break · risk contribution) → click **Scenario** → AVGO branches, each with a **Risk impact** chip → click it → **Risk/Allocation** with AVGO's contribution highlighted.

If that flows in a click or two between nodes, the web is real. Build/verify this path first; it's the acceptance test.

---

## 5 · Dependencies & what's renderable now

- **Renderable now (mock):** every link above can be wired statically — news already carries ticker tags, the read-through map exists in state, and PositionDetail can pull from the existing THESIS / EARNINGS / NEWS / calls data already in the file. The thread panel is a layout + wiring change, no new data.
- **Fuller post-Phase-3:** "next catalyst" and "the scenario that fires on this event" get cleaner once the **unified event store** lands (Phase-3, queue B) — until then, attach the nearest known dated event per ticker.

---

## 6 · Apply (Claude Design, Saturday)

> Make every ticker a link (held → Position Detail, not-held → quote-peek popover). Build the PositionDetail thread panel per §3 (open call · next catalyst · latest news · thesis+break · street-vs-curated PT, each linking out), and re-scope Add/Trim to "Log a decision." Add the "Related" affordance + outbound links per §2 to News, Scenario, Catalysts, and Risk. Wire the §4 canonical thread first and confirm it's ≤4 clicks. Breadcrumbs + contextual back per §1.3.


───────────────────────────────────────────────
###### FILE: FINN_DISCRETE_FIXES.md
───────────────────────────────────────────────

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


───────────────────────────────────────────────
###### FILE: FINN_ARCHITECTURE.md
───────────────────────────────────────────────

# Finn — Phase 4: Architecture (the spine)

This is the build architecture for the Phase-3 app — **not** canvas work — except where noted. It's the crown-jewel fix: make the "contradicting numbers" class of bug *structurally impossible* and convert trust from the biggest liability into a feature. Source for Saturday queue **B** (and one renderable piece → **A11**).

---

## 1 · State contract first
One canonical store. **Aggregates are derived selectors only — never a stored second copy.** Invariants asserted at load; on violation, surface a coral flag, never silently render:
- `NAV ≡ Σ(position shares × live price) + cash`
- `realized ≡ Σ(trade realized P&L)`
- one dip-zone per ticker; one PT pair per ticker
- conviction tier consistent wherever a name appears

This is the root fix for finding #1: the mock showed `realized 2528.29` next to a trade log summing to `1988.62`, and an NVDA-trim row carrying AVGO's `$387.12` fill — because parallel hard-coded aggregates + typed-in narrative numbers were the architecture. Derive everything, and they can't diverge.

## 2 · Provenance on every number
Every displayed price/aggregate carries a provenance token, rendered as a small chip:
`LIVE 1:58 ET` · `EOD Jun 10` · `BROKER` · `FINN PROJECTION`
**Narrative text renders numbers from state via tokens — never typed in.** (Typed-in narrative numbers are exactly what produced the cross-surface contradictions.) This makes the deliberate EOD-anchoring *visible* — "59% to $50K" stops reading as a math error against a live NAV because the chip says `EOD Jun 10`.

## 3 · Reconciliation tile  *(renderable — also Claude Design, queue A11)*
An always-on visible check:
- `Σ positions + cash ≡ NAV` → green / **coral + delta** on mismatch
- `Σ trades ≡ realized` → green / **coral + delta** on mismatch

Green is the steady state; coral means something's off and shows by how much. Integrity as a feature — the single biggest trust lever in the product. *(The tile + the §2 provenance chips are the one part of this phase that's a Claude Design component to mock — added to the Saturday batch as A11.)*

## 4 · Event-spine / unified calendar store
One `CalendarEvent` store holding **earnings, macro events, trigger-hits, reviews-due, re-entry windows, sell-windows**. Everything time-based is a view of it:
- **Catalysts** surface = the full store
- **Earnings** = a filtered view (not a separate data source — fixes the "two calendars disagree" finding, where the Catalyst Calendar omitted a held name the Earnings surface knew about)
- **Brief → Watching** = ranked by **impact × proximity for held names**, not array order
- **calls** auto-attach the next dated catalyst for their ticker
- **PositionDetail → next catalyst** reads from it (the wire in `FINN_INTELLIGENCE_WEB.md` §3)

## 5 · Data flow
FMP (polled per-ticker; no batch on Starter) → normalized into the store → selectors → UI. Broker EOD captured nightly → the NAV anchor. Live prices stream/poll into the store; **no second copies anywhere.** This is also what lets the chat-render limitation go away — the app fetches server-side, unlike the CSP-sandboxed widget.

---

**Net:** §1–§3 make divergence impossible and visible; §4 makes the calendars agree and powers the intelligence web; §5 is the plumbing. Build §1 (the contract) first — generate the data from it, so the mock's contradictions can't be reproduced by construction.


───────────────────────────────────────────────
###### FILE: FINN_MOBILE_SPEC.md
───────────────────────────────────────────────

# Finn — Mobile Companion Spec

**Decision (Jun 11):** mobile ships as a **read-only morning-loop companion**, not a ported cockpit. Rationale: Finn's highest-value moments are time-sensitive and happen away from the desk — the AVGO add window was an intraday dislocation; dip-zone entries don't wait for you to be at 1440px. A desk-only daily driver misses exactly the moments it exists to catch.

This is a separate, narrow build (mobile frames in Claude Design or Phase-3 web) — tracked under queue **C**.

---

## In scope (four views, read-only)

1. **Brief** — TL;DR + the tape stats + the calls (ADD/HOLD/TRIM/WATCH + numeric confidence). The morning note, condensed.
2. **TopBar strip** — NAV, day move, **cash**, next catalyst. The four numbers that orient you in two seconds. (NAV + cash are the daily-operative pair — see Phase-3 fix A4.)
3. **Positions** — a list with day moves and **dip flags** (in-zone names surfaced). Tap → a read-only position summary (price, levels, open call, next catalyst) — a condensed slice of the Detail thread panel.
4. **Push alerts** — "AVGO entered $410–420," "ORCL prints in 2h," a sell-trigger hit, a review now due.

## Explicitly out of scope (stay desktop)
The Observatory, all analysis surfaces (Scenario / News / Macro / Smart Money / Fundamentals / Blindspots), Risk, Performance, and anything interactive or editorial. Mobile is **read + get-alerted**, not analyze or act.

## Design notes
- Reuse the v4 tokens + the signal-only color system (one design language, just a narrow viewport).
- Single-column, thumb-reachable, dense-but-scannable — same instrument voice.
- No charts beyond the position sparkline (if cheap); the equity curve stays desktop.

## The dependency that decides its value
**Push alerts require the Phase-3 backend.** The chat-render Finn can't push — same root cause as "an armed alert only surfaces on the next render." So:
- **With** push → mobile is a genuine daily driver (catches the away-from-desk moments). High value.
- **Without** push (read-only, no notifications) → it drops to **nice-to-have**; you'd still have to open it to learn anything.

**Recommendation:** build the four read-only views alongside the Phase-3 app (they reuse the store + tokens), and gate the *real* value on shipping push. If push slips, deprioritize mobile until the backend exists — don't build a read-only app that can't tell you anything you didn't open it to find.
