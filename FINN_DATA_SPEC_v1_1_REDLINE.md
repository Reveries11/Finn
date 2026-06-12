# FINN_DATA_SPEC v1.1 — Redline (Run #5 / surface A2)

> Brings `FINN_DATA_SPEC.md` v1.0 current: it contracts the **pre-cut 28** surfaces and **pre-rev19** paths. Apply against `FINN_NAV_STRUCTURE §1` (the authoritative 17-map) + `FINN_STATE.json` **rev20**. This is the deliverable the bake-off blocked A2 on (B2/m1).

---

## A · Surface inventory: 28 → 17
- `FINN_NAV_STRUCTURE §1` is the **authoritative 17-map**; every contract below routes to a surface in it. Confirmed merges from the cut: **Reviews (C.18) → Performance** (trigger-driven log state); **Weekly → Reports (C.27)** (export composite).
- **Fold in the §5 further-merge candidates** (verify each isn't already standalone in the 17 before cutting):
  - Dip Check (C.16) → a **live-zone filter chip** of Gameplan/Positions, not a surface.
  - Rescore (C.19) → an **action + staleness state** of `scores` (button in Engine/Positions).
  - Earnings (C.25) → a **`type==earnings` filter** of Catalyst Calendar (the spine owns the calendar, AF-12).
  - Full Dash (C.4) → **demote to a Reports export composite** (the 24-section mega-render is redundant once drill-in + drawer exist).
- **Every surviving surface needs a field-level §C contract.** A5/Observatory is currently the single word "DERIVED" (C.4 §6) — write the real contract (M8).

## B · rev20 path changes (find/replace across the spec)
- `pt_low` / `pt_high` → **`pt_ref[0]` / `pt_ref[1]`**  (D14, C.3, C.6, C.7, C.22)
- `macro.cpi` → **`macro.cpi_headline`** ; `macro.cut_odds` → **`macro.cut_odds_jun`**
- tiers gained a **`dropped`** tier (new vs C.24); earnings gained **`watchlist`** / **`not_swept`** keys
- post-sell: **single path `watchlist.post_sell`** (the `post_sell_monitor` list was merged); reference **`monitor_until`** (not `expires`)
- newly available to bind: `last_side`, `trim_blessed`, `foundation`, `params.*`, `feed_status`, `anchors.intraday_peak`/`intraday_peak_date`, `calls_log[].grade_due`/`horizon` + `outcome{}`, `nav_history[].basis`, `_meta.sha256`/`prev_sha`/`sha_recipe`

## C · Color adjudication (surface A1 / m11)
Three v1.0 render rules use identity/category hues that COLOR_SYSTEM_v4's signal-only palette outlaws:
- **C.8** CS-bar violet / MS-tick teal → reclassify as signal, or render neutral + glyph
- **C.9** curve peak=violet / HWM=teal / eod=amber → resolve the **amber-as-category vs amber-as-alert** collision
- **C.10** TRIM=amber → same amber collision
- **Rule:** identity/category encodings = neutral + glyph; color is reserved for gains / losses / alerts.

## D · Derivation-catalog changes
- **D16** zone-dot threshold: rebind the hardcoded "≥ 20" → **`params.concentration.soft`** (m2)
- **D21 (NEW)** benchmark series: FMP **`chart`** historical closes for **VOO**, normalized to inception ($27,500 base), for the A9 NAV-vs-benchmark line (M6)
- **Sources-vs-uses selector (NEW, A4):** sells from `trades[]` (date / shares / avg_sell / realized) + buys from dated `positions[].lots[]`; **handle the `"date":"seed"` sentinel** — exclude from date math / treat as pre-inception (M5)
- **curated PT** (e.g. the `"295"` string) → derive from `pt_ref` or drop; never store a duplicate (m7)
- `fmp_targets` covers the owned 12 only → A6 target box needs an **empty-state** for watchlist tickers; carries `_stale` (Jun 4) age on every STREET chip (m7)

## E · Provenance / honesty (carry from R4 amendments)
- Every price/aggregate cell carries a **source chip**; live cells carry an **age chip** (`params.live_max_age_s` = 120 s).
- Recon tile is **tri-state**; each surface is marked **advisory** (chat render) vs **asserting** (app render) per the §5 seam.

---
*Routing:* this redline + `FINN_NAV_STRUCTURE §1` are A2's inputs; once the 17-map is reconciled, per-surface contracts (B2) certify and the build order (A0 verify → rev20 ✓ → A1 → A2 → A3 → A11⊕A10 → A8 → A4 → A5 → A6 → A9 → A7) proceeds.
