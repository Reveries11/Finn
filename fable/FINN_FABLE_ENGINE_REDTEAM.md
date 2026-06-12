# Finn — Engine Red-Team (for Claude Fable)

**What this is.** Finn's "engine" is **`FINN_SYSTEM_PROMPT.md`** (the operating brain) plus how it runs on **`FINN_STATE.json`** (the canonical book). It is **not** an app — Finn runs as a system prompt *inside a Claude chat*: the operator issues commands (`gmf`, `dash`, `scenario`, `dip check`…), Claude loads the state file, pulls live prices, renders surfaces, and issues **ADD / HOLD / TRIM / WATCH** calls with numeric confidence on a real, concentrated portfolio. **Your job: red-team the engine** — find where the rules contradict, underspecify, misfire, or could produce a wrong call or trade.

This is not a design or UX review. It's a stress test of the *logic and safety* of the brain.

**Context so findings are real:**
- It runs **in a chat**; the state file is **hand-maintained and re-uploaded each session** — silent desync between the file Claude reads and the operator's intent is a known, recurring risk.
- Prices come from **FMP, polled per-ticker**; the prompt forbids displaying any price without a confirmed live source ("wrong price = wrong trade").
- Locked rules include: **no DCA** (adds on dips only); **conviction-based sizing**; a **single-name ceiling**; **scenario auto-fire** (earnings <7d / major catalyst / PT breached / decision fork); **trim >30% above PT**; **+40% → win review / −20% → loss review**; never change a conviction tier without explicit instruction; **decision = memory + file updated same response**.
- Vocabulary: **ADD / HOLD / TRIM / WATCH** + numeric confidence (0–100).

---

## Your task — red-team the engine

1. **Contradictions** — rules that conflict, or where two rules give different answers to the same situation.
2. **Underspecification** — triggers/thresholds ambiguous enough to be applied inconsistently across sessions (what exactly counts as a "dip," a "catalyst," a "PT breach," a "decision fork"?).
3. **Failure modes** — inputs or situations that make the engine produce a wrong, unsafe, or nonsensical output — **especially anything that could lead to a wrong trade.**
4. **Drift & state risk** — where the hand-maintained + re-upload workflow can silently desync, and whether the prompt's sync rules actually *catch* it (vs. assume it).
5. **Injection surface** — can content inside the state file, FMP results, or pasted market data **hijack or bias** the engine's behavior or its calls? Where is the trust boundary, and is it enforced?
6. **Missing guardrails** — risk rules a disciplined operator would want that aren't there (position-level stops? portfolio heat? correlation/cluster limits? a cash floor? earnings-blackout trim rules?).
7. **Does it enforce the discipline it claims?** — no-DCA, conviction sizing, the exits, the ceiling — are these actually *binding* in the rules, or just stated?

## Deliverable
- **Ranked findings** — BLOCKER / MAJOR / MINOR — each with: the specific rule/section · the failure scenario · a concrete fix.
- **The single rule most likely to produce a wrong trade**, and how to harden it.
- **What's genuinely robust** (so the operator doesn't over-correct what's working).

Be direct and specific; cite the actual prompt sections. This brain issues real-money calls — bias toward finding the costly, non-obvious failure, not stylistic nits.

---

### Attach to the Fable chat
- **`FINN_SYSTEM_PROMPT.md`** (your current canonical copy)
- **`FINN_STATE.json`** (your current canonical copy — gives the engine real data to reason against)

### Kickoff line
> Red-team the attached Finn engine per this brief — the system prompt is the brain, the state file is its data. Don't review design or UX. Find contradictions, underspecified triggers, failure modes, drift/injection risk, and missing guardrails — anything that could produce a wrong call or trade. Give me ranked findings (severity · rule · failure scenario · fix), the single rule most likely to cause a wrong trade, and what's genuinely robust.
