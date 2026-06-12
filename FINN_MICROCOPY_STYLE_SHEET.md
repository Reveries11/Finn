# FINN_MICROCOPY_STYLE_SHEET (v1 — adopted from Run #7 triage)

> The **label registry**: one source for strings, the way `pt_ref` is one source for triggers. Where this sheet and any prose disagree, **this sheet wins**; surfaces copy strings from here. Closes V-B1 and the V-M1–M16 / V-m1–m13 label clusters. The canonical ALERT TOKEN table also lands inline in `FINN_SYSTEM_PROMPT` (§VOICE & MICROCOPY).

---

## Casing (extends the v3.3 TOKENS — unchanged where v3.3 already rules)
| Class | Case | Font | Examples |
|---|---|---|---|
| Panel / section titles | UPPER | mono +.8 | `MARKET BRIEF`, `ACTION QUEUE` (kill lowercase `⚡ needs attention`) |
| Column headers, stat / meta labels | UPPER | micro | `TICKER · COST/SH · P&L% · MKT VAL · WT%` |
| Commands + command buttons (incl. launcher) | lowercase | mono | `dip check`, `trade log` (acronyms UPPER: `GMF`) |
| Prose CTAs | Sentence | sans | `Full breakdown ↗`, `Load into dash ↗` |
| Tickers | UPPER | mono | always |
| Status tokens (alerts / flags / states) | UPPER, space-sep, ≤2 words | mono | see token table |
| Surface names in prose | Title Case, one spelling | sans | see canonical names |

## Canonical names (one spelling each)
`Gameplan` · `Blindspots` · `Control Center` (never Cmd Center / CmdCenter / Command center; Guide §2 → "Commands") · `Dip Check` (surface; cmd `dip check`; the redline filter chip is `ZONE LIVE`, not "Dip Check") · `Post-Sell` · Brief rows `The Tape / The Book / News / Calls / Watching / Also / TL;DR` (prompt v4.x strings; C.2 conforms) · `Calls` (never Recs; the badge slot = "call badge") · Full Dash headers: canonical strings TBD in C.4 (V-M8 — `Interp`/`Obs`/`TrimDipAdd` not approved as literals; ⊘ confirm vs the dash template).

## ALERT TOKEN table (one event = one token)
UPPER, space-separated in display; hyphens only inside stored enum ids. Long form (tables / queue) → badge → card flag:

| Event | Long | Badge | Card flag |
|---|---|---|---|
| earnings <7d | EARNINGS IMMINENT | EARN IMMINENT | EARN |
| price in dip zone | ZONE LIVE | ZONE LIVE | ZONE |
| live ≥ `pt_ref.high` | PT HIT | PT HIT | PT HIT |
| +40% from basis | WIN REVIEW | WIN REVIEW | WIN |
| −20% from basis | LOSS REVIEW | LOSS REVIEW | LOSS |
| >30% above PT | TRIM | TRIM | TRIM |
| single-name / cluster breach | CONCENTRATION | CONCENTRATION | — |
| CS outside tier corridor | TIER DIVERGENCE | TIER DIVERGENCE | — |
| sell trigger met | SELL TRIGGER | SELL TRIGGER | — |
| day move ≥3% | BIG MOVE | — | BIG MOVE |

Log rows keep past-mode `TRIM` / `SELL` as *actions taken*; alert mode uses `SELL TRIGGER` to avoid the imperative collision. Kill `ABOVE PT` / `ABOVE-PT`, `DIP`-as-flag, and the `CATALYST` / `AUDIT` badge synonyms (V-B1/M1/M2). `OPTIONS FLOW` → INACTIVE or deleted (unconnected source per §FEED).

## Provenance & age chips
`FMP HH:MM ET` (live) · `AS-OF Mmm D` (value pinned to a past anchor) · `STREET · Mmm D` (consensus — context only, never a trigger; carries `fmp_targets._stale` age) · `CONFIRMED` (reported fact / actual) · `FINN PROJECTION` (derived; never shorten) · `SPECULATIVE` (never `SPEC` — collides with the position class — V-m12) · `RESCORED Mmm D` (fresh score from a stale input — replaces STALE-on-fresh, V-m10) · `STALE` (undisplayable per price-integrity) · `STALE-INPUT` (fundamentals >90d). Age chip on live cells tints warn past `params.live_max_age_s` (120 s).

## Numbers
- **$**: thousands separator always; cents on per-share, lot, and realized-ledger lines; whole dollars on aggregates ≥ $1,000. Signs explicit on deltas (`+` / `−`, U+2212), never parentheses.
- **%**: day moves 2 dp · P&L / drawdown / weights 1 dp · progress 0 dp · deltas signed.
- Units: shares `sh` · days `7d`, `<7d` · time `HH:MM ET` · dates `Mmm D` display, ISO storage · milestone `→ $50K`.

## State strings (canonical copy)
| State | Copy |
|---|---|
| skeleton | visual only, no copy |
| pulling | `pulling…` |
| partial-feed (cell) | `—` + cell tag `NO QUOTE`; aggregates blank + `AS-OF Mmm D` (per §FEED) |
| feed-down | `⚠ FMP unavailable — manual prices.` (keep) |
| empty — queue | `all clear` (keep) |
| empty — news | `quiet tape` everywhere (kill `no recent`) |
| empty — Calls | `no calls today` |
| empty — Watching | `nothing dated <14d` |
| empty — next-earn tile | `none scheduled` |
| empty — thesis | `not written yet — stock report TK seeds it` (kill "unseeded") |
| empty — A6 target box (watchlist) | `no street coverage pulled — owned 12 only` |
| recon tri-state | `MATCHED` / `MISMATCH — ⟨a⟩ vs ⟨b⟩ (Δ x)` / `UNANCHORED — broker EOD missing since ⟨date⟩` (V-M12: name by meaning, not color) |
| zone break | `ZONE BROKEN — reassess` (keep) |
| advisory seam | header chip `ADVISORY · chat render`; app unmarked (never render "asserting" — V-M14) |
| PROPOSED | block: `PROPOSED · ⟨ACTION⟩ ⟨TK⟩ ⟨size⟩ ≈ $x · source: ⟨ref⟩` + line: `confirm by typing: ⟨ACTION TK size⟩` (V-M13) |

## Pattern locks
Callouts read `TOKEN — action` (em-dash) · one event = one token · long / short forms only per the token table · token ≤2 words, chip ≤12 chars · Guide expands `GMF / GNF / AMC / HWM / PT / CS / MS` once (glossary). Brief content split: **Watching = anything dated** (earnings, FOMC, expiries, near triggers); **Also = anything undated** (rotation, technicals, smart money, structure) — smart money to Also only, index adds to Watching only (V-M7).

---
*Routing: this sheet = the single label registry; surfaces copy from it. The ALERT TOKEN table + canonical names land inline in prompt §VOICE & MICROCOPY. Surface re-letter S0–S11 (V-M18) applies in the design docs before per-surface certification. ⊘ A few literal labels (Full Dash headers, the 17-map surface names) await the HTML templates / `FINN_NAV_STRUCTURE §1`.*
