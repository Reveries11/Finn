---
name: visual-system
description: "Finn's locked visual standard (v3.3) — the dark-terminal design system every surface is built from. Read BEFORE building or restyling ANY surface. Covers the token set (5 semantic colors, surface ramp, radii, IBM Plex type scale, Tabler icons, casing, states), the 8 locked components (Button, Input, Tile, Row, Chip, Segmented control, Callout, Stat tile), the canonical fv-* classes (rebuild from FINN_VISUAL_SYSTEM_v3_3.html, never bespoke CSS), render-mode v2 (inline show_widget, live sendPrompt), and the reusable Table primitive."
---

<!-- skills/visual-system/SKILL.md — extracted from FINN_SYSTEM_PROMPT.md v3.0 (canonical inlined modules), 2026-06-06 -->

# Visual Standard v3.3 (LOCKED) — master format, all surfaces

Canonical file: **FINN_VISUAL_SYSTEM_v3_3.html** (token `:root` vars + component classes + showcase). Every surface pulls from it — **no bespoke CSS**. Supersedes v3.1/v3.2 (keep v3.2 for history). Read the HTML for exact class names before rebuilding a locked surface.

**Render mode v2 (LOCKED):** every surface renders INLINE INTERACTIVE via show_widget — never a downloadable HTML dashboard. Files only for the GNF handoff / state `.json` / EXPORT; finn_cockpit.jsx is the one sanctioned artifact exception. Buttons + chips are live `sendPrompt()`, never printed text. Layout persists; prices never (feed-driven at render, skills/fmp-feed).

## TOKENS
- **Color (5 roles, each solid + dim 12–14%):** violet `#8B7CF6` = action / conviction 5 · info `#5FAEF2` = conviction 4 · warn `#E5A93C` = caution / conviction 3 · pos `#46D17F` = gain · neg `#FB6F6F` = loss · teal `#5EE6D0` = market score (MS).
- **Surface ramp:** bg `#090B0F` / bg2 `#0D1015` / panel `#12161D` / panel2 `#161B23` / elev `#1C222B` / line `#242A34` / line2 `#323945` / ink `#E8EBEF` / ink2 `#9AA2AD` / ink3 `#646C77`. **Always dark; never transparent.**
- **Radius:** chip 6 · control 8 · card 10 · panel 14.
- **Type:** IBM Plex Sans + Mono. NUMBERS / tickers / commands / tags ALWAYS mono, tabular-nums. Scale: display 25 · value 17 · title 14 · body 12.5 · label 11 · micro 10 · nano 8.5. Weights 400 / 600 / 700.
- **Icons:** Tabler outline, stroke 1.75. Sizes: tile 22 · row icon-box 16 · inline 14 · section-header 13. Color acc2 unless carrying status.
- **Casing:** panel/section titles UPPER mono +.8 · stat/meta labels UPPER micro · command tokens lowercase mono · tickers UPPER mono · CTAs Sentence sans.
- **States:** hover = border-acc + bg accdim, .15s · **LIFT (translateY −2px) on TILES ONLY** · active/selected = accdim + acc border + acc2 text · disabled = opacity .45, no pointer · input focus = acc border + 3px ring.

## 8 COMPONENTS (LOCKED)
1. **Button** — primary (solid violet, white, sentence sans) / secondary (tinted ghost) / tertiary (grey ghost) / status pill (semantic-dim). ONE primary per view. Command buttons lowercase mono (acronyms UPPER mono); CTAs sentence sans.
2. **Input** — recessed field (bg2) + attached primary (Go). Live suggestion dropdown filters commands + tickers; Enter fires highlighted; selected row = active token.
3. **Tile** — icon-above-label (Tabler 22) + lowercase-mono command label + optional desc + feed-driven corner badge (live/count/alert). Auto-fit grid. The only component that lifts.
4. **Row** — leading slot (icon-box 32 / status emoji / small icon) + body + trailing slot (chevron = navigates / CTA = acts / pill = status / none). Command rows lowercase mono; action rows prose sentence sans. No lift.
5. **Chip** — interactive conviction-tinted clickable token (c5 violet / c4 info / c3 warn), optional trailing live value; + static **Tag** variant (nano, semantic-dim fill, non-interactive: WIN / DIP / EARN / CONFIRMED / FINN PROJECTION). Tickers UPPER mono.
6. **Segmented control** — single-select, one always sticky-on; on = active token. Sans lowercase option labels. No lift. (route toggle, value/% toggle.)
7. **Callout** — semantic emphasis in three forms: chip (inline fact) / banner (full-width context one-liner) / box (header + multi-line). Color = severity (neg alert / warn caution / pos opportunity / info note / violet accent-verdict). Restraint — routine status uses Tags, lists use Rows.
8. **Stat tile** — display only, non-interactive. Variants hero (display 25) / progress (4px feed-driven bar) / delta (sub in semantic color). Status strip = connected grid, 1px hairline dividers. Numbers always mono.

**chip vs pill vs tag:** chip = clickable bordered token (states) · pill = status control, semantic-dim fill (Button family) · tag = static nano label (no states).

## MASTER VISUAL FORMAT
Default for any NEW / ad-hoc visual unless told otherwise: built from the components above on the dark-terminal surface ramp. ALWAYS dark bg, never transparent. Already-locked formats keep their own specs but get backfilled to this standard (Phase 3).

## Phase status
Phase 0 (tokens) + Phase 1 (8 components) DONE. Phase 3 backfill PENDING — normalize home / dash / guide / scenario (lowercase-mono command labels, control radius 8, one-primary-per-view). Track 1 (library remaining: Panel/Chrome/Table P1; Bar/Sparkline/states P2; composites/iconography P3) extends this. Track 2 (data spec) defines WHAT data each surface shows. (Both tracked in TODO.md.)

<!-- APPEND to skills/visual-system/SKILL.md — Phase 2 (2026-06-06) -->

## Build rule (all surfaces)
Every surface renders on the canonical `fv-*` classes defined in `FINN_VISUAL_SYSTEM_v3_3.html` — radial glow bg, gradient panels (panel→bg2, r14), bordered `fv-chrome` (violet-bold breadcrumb + sync pill), hero NAV stat strip (hairline dividers), lifting tiles, priced chips. **Build from `fv-*`, never bespoke CSS.** `guide` sits in the chrome as a tertiary affordance (beside `home`/`GMF`).

## TABLE PRIMITIVE (reusable — Track 1 P1)
One table component, inherited by **ledger · trades · PT view · impact view**. Each host supplies columns + grouping.
- **Structure:** header row · optional tier-separator rows · data rows · optional summary footer.
- **Layout:** first column left-aligned (label, bold ink); all others right-aligned mono tabular-nums; headers mono UPPER micro (ink3).
- **Rules:** tier-sep spans all columns (violet); deltas colored pos/neg; pending = `—`; row hover = panel2; sortable headers (host opts in).
- **States:** empty → "no rows"; loading → skeleton rows; narrow → horizontal scroll (sticky first column).
- **Variants in use:** ledger = grouped (conviction→mkt value) + sortable; trades = flat + chronological (oldest→newest, not sortable).
