# Finn — Build Queue (Friday prep + Saturday Claude Design)

Specs are produced; amendments from Fable round 2 are folded in (`FINN_SPEC_AMENDMENTS.md`). Read each Saturday item against its base spec **+ its amendment**.

Status: **[ready]** spec written · **[done]** produced this session

---

## ⚡ Friday prep (NOT Claude Design — do before Saturday)
| Item | Status | Notes |
|---|---|---|
| **A0 — regenerate `finn-data.js`** | **[done]** | Reconciled + current, built this session. Drop into `ui_kits/finn/` before opening the canvas. Makes A8/A11 green on debut. |
| **Add 5 sell-triggers to `FINN_STATE.json`** | **[ready]** | ANET/ETN/APH/MRVL/ORCL (wording in `FINN_SPEC_AMENDMENTS.md`). Already in A0; sync the canonical state too. |

## A · Claude Design — Saturday batch (apply in order)
| # | Item | Source (+ amendment) |
|---|---|---|
| 1 | **Color v4 — signal-only** (+ neutralize DriverTags; higher-contrast glyphs) | `FINN_COLOR_SYSTEM_v4.md` + amend |
| 2 | **Consolidation** (28→17 + drill-in + drawer; **Reviews→Performance, Weekly→Reports**) | `FINN_NAV_STRUCTURE.md` §1 + amend |
| 3 | **Wayfinding / nav** (rail, ⌘K, breadcrumb, drawer, active-state) | `FINN_NAV_STRUCTURE.md` §2–6 |
| 4 | **Cash visibility** (TopBar slot, funding lines, sources-vs-uses) | `FINN_DISCRETE_FIXES.md` A4 |
| 5 | **Observatory** (click ✓, day-color, tier orbit, **sort-by-value**, no truncation) | `FINN_NAV_STRUCTURE.md` §4 + `FINN_DISCRETE_FIXES.md` A5 + amend |
| 6 | **Intelligence web** (every ticker a link; thread panel; **ticker-scoped targets; one breadcrumb**) | `FINN_INTELLIGENCE_WEB.md` + amend |
| 7 | **Process layer** (Home renders the full QUEUE) | `FINN_DISCRETE_FIXES.md` A7 |
| 8 | **Exit + tables** (flag undefined triggers; totals rows; VOO convention) | `FINN_DISCRETE_FIXES.md` A8 |
| 9 | **Performance / NAV curve** (EOD/live split, milestones, HWM, range, **labeled VOO benchmark**, sparklines; +Reviews log) | `FINN_DISCRETE_FIXES.md` A9 + amend |
| 10 | **Stale state** (last-known + age tint; one global clock) | `FINN_DISCRETE_FIXES.md` A10 |
| 11 | **Provenance chips + recon tile** (chips = source class only; **tile checks broker, not itself**) | `FINN_ARCHITECTURE.md` §2–3 + amend |

## B · Phase-3 build — NOT Claude Design
`FINN_ARCHITECTURE.md` + amend: single store + derived selectors + **load-time invariant asserts** (§1); provenance tokens + **render-time numeral lint** (§2); **broker-anchored** reconciliation (§3); event-spine / unified calendar store (§4); poll-only data flow (§5).

## C · Doc reconciliation — NOT Claude Design
- **Mobile companion spec** — `FINN_MOBILE_SPEC.md` (read-only; gated on Phase-3 push).
- **WATCH + numeric confidence → docs:** in the design `readme.md`, change "exactly ADD/HOLD/TRIM, High/Med/Low" → "ADD / HOLD / TRIM / WATCH; confidence numeric 0–100"; mirror in the recommendation-contract and in `FINN_FABLE_REVIEW.md` §2.
- **Log the v4 decisions** in `FINN_CLAUDE_DESIGN_BRIEF.md` / the change sheet: signal-only color · WATCH+confidence · mobile companion · broker-anchored reconciliation spine · deliberate consolidation.

---

*Updated Jun 11 — all specs ready, Fable-2 amendments folded in, A0 built. Friday: drop A0 + sync sell-triggers. Saturday: work Section A top to bottom.*
