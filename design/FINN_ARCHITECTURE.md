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
