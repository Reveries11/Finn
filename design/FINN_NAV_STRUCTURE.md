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
