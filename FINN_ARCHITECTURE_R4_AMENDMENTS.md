# FINN_ARCHITECTURE — R4 Amendments (post-Fable Run #4)

Accepted **architecture/data-model** changes from the Run #4 review, applied on top of `FINN_ARCHITECTURE.md` + `FINN_SPEC_AMENDMENTS.md`. Each is a directive; read alongside the §it amends. Rule-text changes live in `FINN_ENGINE_PATCH_v4_1.md`; data edits in rev19.

---

## ★ §1+§3 — Content-addressed, single-writer state (the crown fix) — AF-01, AF-02, AF-21, AF-22
The one mechanism that closes four blockers. Make silent corruption loud everywhere.

- **Hash chain.** `_meta` gains `sha256` (of the file with the `sha256` field blanked) + `prev_sha`, forming a chain. GNF computes both on every write. (rev19 starts the chain: `prev_sha: null`.)
- **Out-of-file ledger.** GNF **echoes `{rev, sha8}`** to a store outside the file — Claude memory (Meta-Rule 1 already mandates same-response writes) and a git tag. GMF compares the loaded file's `{rev, sha}` against the ledger **before trusting anything**; mismatch = hard red, no agenda. *This is mechanical revert/skip detection — it catches the same-positions revert (AF-01) that broker anchoring and the rev-confirm cannot, because broker NAV can only witness `shares + cash`, ~5 of 25 sections.*
- **Single declared source (AF-02).** §SYNC states: **Project = canonical read-source; GitHub = derived backup.** GNF VERIFY's "verifies both" becomes concrete: **same `{rev, sha}` in both homes**, else 🔴 naming which home is behind. *(Now load-bearing: Claude can read the repo directly, so a divergent repo is a real mis-read risk.)*
- **Derived artifacts pinned (AF-21).** Every derived artifact (`finn-data.js`) embeds `{source_rev, source_sha}`; the app load-asserts `source_sha == live store sha` → coral on mismatch. **`finn-data.js` is regenerated from rev19** (it was built from rev16, two revs stale) before any aggregate-rendering surface ships.
- **Single writer (AF-22).** Declared posture: **near-term — the app is a read-only viewer of the rev-pinned snapshot; all writes stay in chat.** End-state — the app owns a DB+API and chat-Finn becomes a client. No dual-writer build until one is chosen. Delete the prompt's "Memory is source of truth" clause (it contradicts `_meta.read_first` "memory = thin pointer"); memory holds the `{rev, sha}` ledger + session deltas only.

## §3 — Reconciliation tile is tri-state, with tolerance — AF-13, AF-03, AF-15
- **Tri-state** (replaces green/coral binary): **GREEN** (match, delta shown) · **CORAL** (mismatch + delta) · **AMBER "UNANCHORED — broker EOD missing since ⟨date⟩ (N trading days)"**, computed from `max(nav_history[basis==broker_eod].date)` vs the trading calendar. DE-RISK/floor math runs on the **last anchored** NAV with the age tag — never on an unanchored live sum.
- **Tolerance (AF-15).** `params.recon_tolerance` (e.g. $0.05/leg, $1 NAV) defines GREEN; deltas inside render green-with-delta, outside coral. `trades[]` gains optional `{fees, broker_ref}`. *Without this the fill check is permanently coral → alarm fatigue → the tile dies.*
- **EOD capture is a fail-able step (AF-03).** GNF VERIFY adds `[✓/✗] broker EOD captured for ⟨last trading day⟩`; ✗ = 🔴 and the gap is recorded as a spine event `anchor_missing`, not silent absence. Delete `anchors.nav_eod_close_captured` (derive it).

## §1 — Aggregates are selectors; nothing NAV-ish stored loose — AF-07, AF-14
- **No NAV/aggregate stored outside `nav_history` + `anchors`.** `risk.nav_est` deleted; embedded `~$29,075` estimates banned from notes (an intraday estimate worth keeping is a `nav_history` row typed `fmp_intraday, verified:false`).
- **One series, typed bases (AF-14).** `nav_history` rows gain `basis: broker_eod | broker_intraday | fmp_intraday`; `verified` reserved for broker-sourced. **Drawdown + HWM become selectors** over `basis==broker_eod` rows; delete both stored `drawdown_from_hwm_pct` fields (anchors + risk diverged −10.4 / −10.7).

## §4 — The spine owns sequencing, blackout, lifecycle — AF-09, AF-10, AF-11, AF-12, AF-24
- **Thresholds → `params`, not prose, not the data file (AF-09).** `is_blackout(ticker)` is a selector over the spine + `params.blackout_days`; delete `earnings.imminent_rule` / `reviews.trigger_rules`.
- **Scans are spine events (AF-10).** `type: scan`, ring-keep last N (today `last_scan` is a single Jun-9 snapshot). `add_eligible(ticker)` selector requires a scan event **dated today** with no unresolved HIGH-adverse item — so the §GMF order *produces* the data the ADD gate consumes.
- **Feed status is a flag (AF-11).** Poller writes `feed_status: {complete, missing:[...], as_of}`; floor / DE-RISK / partial-blank selectors gate on `feed_status.complete`.
- **Derived calendar (AF-12).** Expiry/review/re-entry events are **derived views** of their source fields; hand-entered events of derivable types fail lint. `catalysts.next` deleted (it's `min(date)`).
- **Lifecycle status (AF-24).** Spine events carry `status: upcoming | occurred | archived` with derived transitions (`days_out` deleted — it's `date − today`; ORCL is currently rotting in `imminent` at `days_out:0`). Add an `archives` view for post-sell + scans. `calls_log` rows gain `{grade_due, graded_at, result}` so the A7 +30d horizon (patch §A7) has a schema, not just a rule.

## §5 — Server-fetch seam: one definition of "live" — AF-25
- `params.live_max_age_s` — any quote older auto-demotes its chip **LIVE→STALE in both renderers** (one definition of live across chat-pull and server-poll).
- Server-side **quote cache with TTL** shared by app surfaces (two renderers × ~12-ticker loops otherwise double Starter quota); FMP key **rotates server-side at cutover** (don't fork the chat MCP key).
- **Honest guarantee:** §1 asserts + §2 lint execute in the **app** (code), not in chat (LLM output). State plainly: **chat surfaces are advisory renders of canonical data; the app is the asserting surface.** The "contradiction-impossible-by-construction" property holds in the app only — until Phase-3, the patch rules + GNF validator are the enforcement.

## Schema & hygiene — AF-16, AF-17, AF-23, AF-19, AF-20
- **Post-sell: one list, survivorship (AF-16).** Merge `watchlist.tiers.post_sell_monitor` into `watchlist.post_sell`; `post_sell` schema wins (`expires`→`monitor_until`); invariant *a ticker appears at most once across post-sell*; both prompt rules cite the **single** path; review-lesson re-entry zones **reference** (not restate) the post-sell row; expiries derived (AF-12). (rev19 also stamps MDA's null dates — flagged for an exit_date.)
- **One section enumeration (AF-17).** `_meta.sections` is the single machine source; `sync.sections` keys must **equal** it (load-assert); the **prompt references `_meta.sections` by name and never restates the list** (the third copy is how drift recurs). Every section entry requires a `stale_rule` (default: warn ≥14d) — giving `fmp_targets` (8 days stale, currently unflagged), `portfolio`, `open_decisions` lifecycle for the first time.
- **Schema versioning + a validator that runs today (AF-23).** `_meta.schema_version` (bump on shape change, distinct from data `rev`); a checked-in **JSON Schema**; **GNF runs the validator** (one Python call) so corruption is caught at write-time now, not at Phase-3 load. (`_meta.version` sat at "1.0" across rev13–18 while seven sections were added.)
- **Dedup + types (AF-19, AF-20).** `thesis` drops `conviction` (join on ticker). `sync.sections[*].rev` → monotonic ints. VOO `dip_zone 650/650` + `"NEVER SELL"` → a `foundation: true` flag. Derived lots carry `basis_source` so render can chip them.

---

## Don't over-correct (the review's own list — preserved)
Derived-selectors-only + load-time asserts (§1) · recon-tile-as-feature repointed at the broker · the event-spine shape · FMP price-integrity posture · single-file consolidation + the `_meta` manifest · provenance chips + one-clock · A1 logging `price_at_call` (grading-ready) · tier-lock + review-as-log. Extend these; don't soften them.

---

## R4.1 Refinements (from the Run #5 surface bake-off triage)

**M1 · sha canonicalization — now defined and implemented (rev20).** AF-01's "blank the field" was under-specified; the rev19 hash didn't reproduce under any standard recipe. Fixed:
- **Canonical recipe:** `sha256( json.dumps(obj_without_sha256, sort_keys=True, separators=(',',':'), ensure_ascii=False).encode('utf-8') )` — remove only the `sha256` key (`prev_sha` stays in the hash so the chain link is committed), compact separators, sorted keys, UTF-8. Stored at `_meta.sha_recipe`.
- rev20 carries this; **its hash reproduces byte-exactly**, so the GMF ledger compare and the AF-21 load-assert are now implementable by any second party. (rev19 used a pre-canonical recipe; the chain links forward — `prev_sha` records the prior value as-stored.)
- **Derived-artifact pin landed:** `finn-data.js` now embeds `SOURCE { source_rev, source_sha, recipe }`; the app load-asserts `source_sha == live store sha` → coral on mismatch.

**M10 · grading schema — one shape.** AF-24's field names (`graded_at` / `result`) disagreed with rev19's richer populated shape. Standardize on **rev19's `outcome{}`**:
- **Graded calls:** `outcome { scored_date, result, bench, return_since_call_pct, flip_triggered, … }` (ORCL is the first; HOLD CORRECT).
- **Open calls:** carry **`grade_due` + `horizon`** (rev20 added these to AVGO/ANET). Horizon is **stored, not a +30d default** — ORCL proved horizons vary (`"event"`), which is the rule-not-schema gap AF-24 was written to close. The due-date column reads `grade_due` directly.
- Deprecate the `graded_at` / `result` names in the prompt/spec; redline to `outcome.scored_date` / `outcome.result`.
