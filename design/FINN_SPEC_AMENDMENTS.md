# Finn — Spec Amendments (post-Fable round 2)

Accepted changes from the spec-stack pressure test, applied on top of the base specs. Each is a directive; read alongside the doc it amends.

---

### A0 (NEW · Friday prep · DONE) — regenerate the data first
**`finn-data.js` is regenerated and reconciled** (built this session from canonical rev16 + live prices). Every aggregate derives in code (`realized = Σ trades`, `NAV = Σ positions + cash`); the NVDA-trim row is fixed ($206.27 / +$117.69); AVGO/ORCL earnings corrected; the 5 new sell-triggers baked into `SELL_TRIGGERS`. **Drop it into `ui_kits/finn/` Friday, before any aggregate-rendering surface (A4/A8/A9/A11).** This is what makes the reconciliation tile green on debut instead of coral.

### Architecture §3 — recon tile checks the broker, not itself
The two checks as written (`Σpositions+cash ≡ NAV`, `Σtrades ≡ realized`) are tautological under §1's derived selectors — green by construction. **Repoint the *visible* tile at independent ground truth:** (a) Finn-computed EOD NAV vs **broker EOD NAV** (delta shown); (b) Σ logged fills vs broker activity; (c) data-age health (oldest poll). **Keep §1's invariants as *load-time asserts*** — they catch manual-edit / import corruption, which is a real risk given the hand-edited state-file workflow.

### Architecture §2 — enforcement + the clock
- Add a **render-time lint** that flags bare `$`-numerals in generated text not resolved from a state token (or "no typed-in numbers" erodes the first time Finn drafts a Brief).
- The **live-NAV provenance chip carries the *oldest* constituent's poll age** (per-ticker polling ⇒ "live NAV" is a sum over non-simultaneous prices).

### Architecture §2 ↔ Discrete A10 — one clock (resolves the conflict)
Provenance chips carry **source class only** (LIVE / EOD / BROKER / PROJECTION). The **TopBar owns the age** (one global clock). Explicit per-cell timestamps appear **only when a cell diverges** from the global age. (A10 and §2 were in conflict; this is the single rule.)

### Nav §1 — Reviews and Weekly get homes
- **Reviews → Performance** (the win/loss lessons log sits beside the trade log + win-rate tiles it annotates; reviews-*due* already surface in the Home QUEUE per A7).
- **Weekly → Reports** (System drawer).
Now all 28 original surfaces are accounted for.

### Color §2 — one more categorical + better glyphs
- **Add DriverTags to the neutralize list:** the recommendation-contract's `DATA / READ / TAKE` tags currently use cyan/violet/amber (HOLD/WATCH/TRIM hues) — neutralize them like sectors.
- **Replace the sector glyph set** with higher-contrast, distinct shapes — e.g. ● ▲ ■ ◆ ⬡ ✚ — (the prior ▣▤◈◇ are near-identical at 8px).

### Intelligence Web — make the scope explicit + one breadcrumb
- Thread links require the target surfaces (**News, Risk, Scenario**) to accept a **ticker-scope parameter** — real wiring beyond "every ticker is a link," and what makes the breadcrumb meaningful. Call it out as scope.
- **One breadcrumb semantic:** location crumb + history "← back." The third segment (`Positions › AVGO › Scenario`) renders **only when a surface is genuinely ticker-scoped**. (Resolves Nav §4 vs IW §1.3.)

### Discrete A5 — Observatory angle
**Pick sort-by-market-value; drop angle-encoding.** (Angle encoding is the on-ramp to the orbital-physics rabbit hole the spec itself warns against.)

### Discrete A9 — label the benchmark basis
Label the VOO line: **"VOO total return, indexed to inception NAV."**

### Architecture §5 — wording
Strike **"stream"** — the feed is poll-only on FMP Starter (mobile alert latency is therefore poll-bound; fine, just known).

### Sell-triggers — a real book gap, now filled
ANET / ETN / APH / MRVL / ORCL had **no `sell_trigger` in canonical rev16** (confirmed). The 5 proposed thesis-break conditions are baked into A0's `SELL_TRIGGERS`; **also add them to `FINN_STATE.json`** so the live book matches. Exit continues to flag any position whose trigger is still undefined.
