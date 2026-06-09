# Finn — Claude Design Brief
<!-- Paste this as the FIRST message in a new Claude Design canvas. Then attach the 4 files listed under "What you're handed," and say: "start with home." Reconstructed + updated 2026-06-08. -->

## What Finn is
Finn is a persistent portfolio-intelligence **cockpit** for an active retail investor concentrated in AI-infrastructure and semiconductor equities (portfolio ~$30K, milestones $50K → $100K). It tracks positions, scores every name (CS/MS, /100), surfaces decisions, and renders as a **dark-terminal** interface. You (Claude Design) are starting from a **fresh context** — you don't know Finn, its visual system, or its current build. This brief plus the four attached files bring you fully up to speed.

## Your job — and what NOT to do
**Improve and pressure-test the *settled* design** — layout, hierarchy, information density, polish, micro-interactions — **surface by surface**, staying faithful to the v3.3 visual language.
- **DO:** tighten hierarchy, fix alignment/spacing, raise scannability + legibility, propose sharper micro-interactions, and **flag weak spots honestly.**
- **DON'T:** redesign from scratch, invent a new aesthetic, or re-spec *what data* each surface shows — the data spec is locked.
- The output **seeds the Phase 3 Next.js build**, so think "production frontend," not concept art.

## The design language — v3.3 (see `FINN_VISUAL_SYSTEM_v3_3.html`)
Dark terminal. Build from the canonical `fv-*` classes — **never bespoke CSS.**
- **Color (5 roles + 12–14% dim):** violet `#8B7CF6` = action / conviction 5 · info `#5FAEF2` = conviction 4 · warn `#E5A93C` = caution / conviction 3 · pos `#46D17F` = gain · neg `#FB6F6F` = loss · teal `#5EE6D0` = market score (MS).
- **Surface ramp:** bg `#090B0F` / bg2 `#0D1015` / panel `#12161D` / panel2 `#161B23` / elev `#1C222B` / line `#242A34`–`#323945` / ink `#E8EBEF`–`#646C77`. **Always dark, never transparent.** Radial violet glow, top-right.
- **Radius:** chip 6 · control 8 · card 10 · panel 14.
- **Type:** IBM Plex Sans (labels) + IBM Plex Mono (ALL numbers / tickers / commands / tags, tabular-nums). Scale: display 25 · value 17 · title 14 · body 12.5 · label 11 · micro 10 · nano 8.5. Weights 400 / 600 / 700.
- **Icons:** Tabler outline, stroke 1.75.
- **Casing:** section titles UPPER mono · command tokens lowercase mono · tickers UPPER mono · CTAs sentence sans.
- **States:** hover = acc border + accdim bg (.15s); **LIFT (−2px) on tiles only**; active = accdim + acc border + acc2 text; input focus = acc border + 3px ring.
- **8 locked components:** Button (primary / secondary / tertiary / status-pill) · Input (recessed field + Go + live suggestion dropdown) · Tile (icon-above-label, the only component that lifts) · Row (icon-box + body + trailing slot) · Chip (conviction-tinted, optional trailing value) · Segmented control (single-select, sticky) · Callout (chip / banner / box; color = severity) · Stat tile (hero / progress / delta).

## Hard constraints (do not break)
- **Price integrity:** nothing price-dependent renders without a live source — **blank beats wrong.** Price cells show `—` until the feed fires.
- **Live prices** come from the FMP feed (per-ticker), not the UI fetching itself. **NAV is broker-confirmed, never estimated.**
- **Interaction:** in the app every interactive element is a *semantic action* (Next.js = router push / API call). The design just needs to express each interaction clearly.

## The surfaces — design in this order
7-tab nav: **home · positions · watchlist · ledger · trades · earnings · scenario**. `guide` lives in the **chrome** (tertiary, beside home / GMF) — not a tab. `reviews` is **not a tab** — it auto-fires in the home action queue when due (+40% / −20%).

**1. home / Control Center** — the hub. Chrome (breadcrumb + home / GMF / guide + sync pill) · **5-tile status strip** (NAV · →$50K · Realized · Scores · Next earn; feed-driven, never hardcoded) · **Action Queue** ("⚡ needs attention" rows: status emoji + bold implication + one-line detail + CTA) · **command bar** ("jump anywhere" + suggestion dropdown) · **jump-to-position chips** — conviction-tinted, each showing **live price + day% + a zone dot** (green = at/below dip → add · amber = near PT/ceiling → watch · red = earnings <7d · grey = mid) — with a sticky **route toggle** (live watch / report / scenario / news) · **fired-today** callout · **5-row flight deck** · **categorized tiles** (Portfolio / Analysis / Planning / System). *Pressure-test:* does the eye land on what needs action first? Strip vs queue vs chips hierarchy.

**2. positions** — conviction-tiered **focus-card grid** (C5 = 4col / C4 = 3col / C3 = 2col; market-value desc within tier). Each card: ticker + name · price + cost + P&L% · CONV / CS / MS pills · **rec badge (ADD / HOLD / TRIM, highlighted)** · 2-line note (bold verdict + context) · **Price Target + Add-Zone boxes** · cost→PT progress bar · inline flags (WIN / DIP / EARN). **Cards carry full content at every column count — never drop fields to fit the grid.** Tap = **hybrid:** card → position detail (hosts scenario / news / live-watch). *Pressure-test:* card density at 4-col, rec-badge prominence, the progress bar's read.

**3. ledger** — the reusable **TABLE PRIMITIVE**: Ticker | Conv | Shares | Cost/sh | Price | P&L% | P&L$ | Mkt val | Wt% | CS | MS | Flags. Grouped by tier, sortable headers, row → detail. Trades / PT view / impact view all inherit this table.

**4. watchlist** — radar-first (T1 / T2 / watch ladder leads; thematic map secondary). In-zone signal = price vs entry zone. **Post-sell monitor:** auto-add on every exit, 30-day window → archive; two groups — active re-entry (zone + in-zone signal) vs monitor-only.

**5. trades** — the Table primitive, **flat + chronological (oldest→newest, not sortable)** + realized-P&L tiles. The one fully file-driven surface (no live feed).

**6. earnings** — owned-name **earnings calendar:** dates, days-out, EPS / rev estimates, last-quarter beat history; imminent (<7d) flagged. Drives the home "Next earn" tile + the scenario auto-fire.

**7. scenario** — the **most synthesized** surface: bull / base / bear + probability + position-$ impact by case + verdict + monitoring checklist. Auto-fires on earnings <7d · major catalyst · PT breach · decision fork. The convergence point the other surfaces route into.

## What you're handed (4 files)
- **`FINN_CLAUDE_DESIGN_BRIEF.md`** — this brief (the alignment prompt; paste first).
- **`FINN_VISUAL_SYSTEM_v3_3.html`** — the canonical design system (tokens + 8 components + showcase). Match this aesthetic exactly.
- **`finn_cockpit.jsx`** — the current design, all surfaces built. This is what you're *improving on*, not replacing.
- **`FINN_STATE.json`** — real portfolio data (positions, scores, watchlist, trades) to populate the surfaces.

*(Recommended: also bring a **screenshot of each cockpit tab** — Claude Design may not render the `.jsx` cleanly, and a screenshot shows exactly what you're improving.)*

## Session flow
1. Paste this brief; attach the four files (+ screenshots).
2. Say **"start with home."**
3. Per surface: you propose improvements + flag weaknesses → user reacts / iterates → **lock the surface** → next.
4. Order: **home → positions → ledger → watchlist → trades → earnings → scenario.**
5. Export the locked designs to code.

## Handoff back (into Phase 3)
- Improved designs + a short **"what changed and why" note per surface.**
- The export becomes the scaffold the **Phase 3 Next.js** build starts from.
- Anything genuinely better also gets folded back into `finn_cockpit.jsx` + the specs, so the two don't drift.
