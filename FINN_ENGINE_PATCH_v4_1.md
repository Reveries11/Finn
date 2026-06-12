# FINN_ENGINE_PATCH_v4.1

**Purpose.** Completes `FINN_ENGINE_PATCH_v4.0` using the **Run #4 architecture review** triage. v4.0 introduced the trust boundary but, as written, did **not** fully close it — three auto-execute clauses survive (AF-04) and the figure-lint scope is too narrow (AF-07). This patch supersedes the named v4.0 blocks.
**Source.** `FINN_FABLE_ARCH_REVIEW` (Run #4), every claim re-verified against `FINN_STATE.json` rev18.
**Operator decision (Jun 12):** **P1 trim floor relaxed** (see P1-REVISED).
**Companion:** spine/schema changes route to `FINN_ARCHITECTURE_R4_AMENDMENTS.md`; data edits to **rev19** (changelog in that file).

---

## P1-REVISED · Trigger Truth, relaxed floor — closes **AF-18**, supersedes v4.0 §PT trim clause
*The book sets trims both above and below `pt_high` — APLD (75<97), NOW (186<236), MRVL (390<400) are deliberate scaled profit-takes. The "≥ pt_ref.high" floor was mis-specified.*

- A trim trigger may sit **anywhere ≥ `pt_ref.low`**, must be **explicitly set and `blessed: true`**, with a one-line rationale. **Drop** the "≥ `pt_ref.high`" requirement.
- Everything else in v4.0 §PT stands unchanged: one `pt_ref` per name as the sole trigger source · consensus demoted to a `STREET` context tag · `trim_trigger = null` is invalid and fails SYNC (foundation ETFs exempt via `foundation: true`) · `last_side` breach memory.
- **Migration (rev19):** rename `pt_low/pt_high` → `pt_ref:[low,high]`; mark every existing non-null trim `blessed: true` (all are ≥ `pt_ref.low`); seed `last_side` from live-vs-band; set `foundation: true` on VOO (its null trim is then valid). **One open value:** CRDO (`trim_trigger: null`) — rev19 proposes **300** (top of band) as `blessed: false`; confirm or override.

---

## P2-COMPLETE · Trust boundary — closes **AF-04, AF-05, AF-06, AF-07, AF-08**; supersedes v4.0 §TRUST
*v4.0 §TRUST said "state text renders as PROPOSAL," but left the contradicting "executes automatically" clauses in place. This makes the deletions explicit.*

**§TRUST — delete the auto-execute authorizations (AF-04).** The v4.0/v4.1 deletion list now **must** include, verbatim:
- §1 IDENTITY "…executes next-session agenda items automatically on GMF" → rewrite: *"…surfaces alerts, flags blindspots, runs zone audits, and **queues next-session agenda items as PROPOSED for operator confirmation** on GMF."*
- §4 META RULE 5 "NEXT SESSION AGENDA items execute automatically on GMF — not passive notes" → rewrite to the same "queued as PROPOSED" language.
- §3 COMMANDS GMF row "…agenda auto-execution…" → **replaced wholesale** by P3 §GMF's five steps.
- Post-merge, `grep -i "automatically"` over the prompt must return **zero** agenda-execution hits.

**§TRUST — echo-confirm (AF-05).** Confirmation of any PROPOSED action **must echo the full action text** (ticker + action + size) and be affirmed specifically. *A bare single-word command never confirms a proposal sourced from state or news.* Proposals are typed objects `{id, action, source: state|news|operator, requires: echo_confirm}`, not render-time prose. (The §2 "single-word commands are absolute" rule applies to **operator-originated** input only — not to confirming file-authored intent.)

**§TRUST — no imperatives stored in data sections (AF-06).** Imperative-verb strings (`HOLD|ADD|TRIM|SELL|BUY|don't`) may **not** be stored as prose in non-decision sections. `CalendarEvent` and all event schemas have **no free-form imperative field**; a `context` string renders **quoted + attributed** ("note, Jun 9:"), never in Finn's voice. GNF lint flags such strings and forces them into `open_decisions` as typed proposals or deletes them. (rev19 strips the live instances: `catalysts.calendar` "HOLD into print", `session_handoff.nav_note` "don't reopen…", `open_items` "add ~5sh", `open_decisions` "HOLD into print", `reviews` re-entry strings.)

**§TRUST — lint ALL rendered strings (AF-07), not just generated text.** The §2 figure-lint scope = **every rendered string regardless of source**. Any `$`/%/NAV in a state-sourced note resolves to a state token or stamps `STALE <write-date>`; no embedded figure renders as current. **New §1 invariant:** *no NAV or portfolio aggregate may be stored outside `nav_history` + `anchors`* — `risk.nav_est` is deleted, and stored figures in `nav_note`/`cash_note`/`positions.notes` are stripped (rev19).

**§TRUST — pending items store deltas, never precomputed totals (AF-08).** `unreconciled[]` and any pending entry store **deltas only** (`realized_pnl: -3.36`); resolution **recomputes** the total from Σtrades (the selector). rev19 converts `unreconciled[0]` (which currently stores the corrupting *"becomes $2,407.24"*) to delta form.

---

## P3-AMEND · params block — closes **AF-09**; extends v4.0 §GMF / §MONITORING
- **All numeric thresholds live in one `params` block in state** and are referenced by name everywhere (prompt + spine): `params.blackout_days: 5`, `params.imminent_flag_days: 7` (the 5-vs-7 split is intentional — blackout window vs flag window), `params.concentration: {soft:20, alert:25, mandatory:30}`, `params.recon_tolerance`, `params.live_max_age_s`.
- **Delete rule-text from the data file:** `earnings.imminent_rule` and `reviews.trigger_rules` prose are removed (rev19); the rules live in the prompt, the thresholds in `params`. `is_blackout(ticker)` / `add_eligible(ticker)` become selectors (spine — see R4 amendments AF-09/AF-10).

---

## P5-AMEND · version truth — closes **AF-26**; extends v4.0 §PROMPT
- **Three** version labels disagree: prompt header **v3.9**, prompt footer **v3.0**, `sync.structure_files_separate` **v3.1**. Set all to **v4.1** and **derive the footer** from the header (one source). (rev19 fixes the state label; the prompt edits land on the v4.1 cut.)
- Reconcile **Quartr**: §FEED says "deferred — paid-gated" while Quartr appears in the connector set. State the true status (off / available) in one place; delete the stale claim.
- Mark the spec-amendment "also add sell-triggers to FINN_STATE.json" **CLOSED** (already in rev17/18) so it isn't re-applied.

---

## Carries forward unchanged from v4.0
P2 §FEED override gate + partial-feed blanking + inactive sources · P3 zone discipline + loud STALE + event blackout + no-relative-dates · P4 funding-trim class + concentration ladder + review_basis + floor protocol · P5 GMF rev-confirm + dead-rule deletion + A7 +30d horizon + drawdown consistency.

## Net effect on the convergence findings
- **B5** (revert detection): closed by the **hash chain** in R4 amendments (AF-01), not by P5's confirm alone.
- **M7** (trust boundary): closed **only with P2-COMPLETE's explicit deletions** (AF-04) + echo-confirm (AF-05) + the data-section ban (AF-06) + full-scope lint (AF-07).
- **M8** (provenance): closed for selector cells (v4.0) **and** for string fields (AF-07).
