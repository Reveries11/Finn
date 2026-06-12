# FINN — BUTTON-ROUTE AUDIT

> v0.1 · 2026-06-10 · verify every interactive element's binding resolves, and that bindings follow the per-target rule (chat=`sendPrompt` · cockpit=tab/state · Next.js=router/API). Audited surfaces: the **Control Center (GMF)** + **Quick Dash** rendered today.
> Reference: the formal command set in `FINN_SYSTEM_PROMPT.md §COMMANDS` + the 28-surface `cmd` column in `FINN_DATA_SPEC.md`.

---

## 1 · RESULT SUMMARY
- **~85% of bindings resolve to a formal command** (`dash`, `quick dash`, `home`, `GMF`, `ledger`, `engine`, `dip check`, `reviews`, `rescore`, `gameplan`, `blindspots`, `trade log`, `nav curve`, `weekly prep`, `exit plan`, `news on X`). ✅
- **A cluster of buttons point at surfaces that aren't formal single-word commands yet** — they work as natural prompts but should be formalized so every button is guaranteed to resolve. ⚠ (see §2)
- **Ticker chips rely on implicit "single ticker → live watch" routing** — fine in chat, must be made explicit for cockpit/Next.js. ⚠ (see §3)

---

## 2 · ⚠ INVOCATIONS NOT IN THE FORMAL COMMAND TABLE
These were bound (correctly, by intent) but aren't single-word commands in `§COMMANDS`:

| Button → prompt | Surface | Fix |
|---|---|---|
| `scenario` / `scenario ORCL` | Scenario (§C.11) | add `scenario` (+ `scenario [TK]`) as a command |
| `alerts` | Alerts (QD §02) | add `alerts` |
| `smart money` | Smart Money (§C.17) | add `smart money` |
| `post-sell` | Post-Sell (Watchlist §C.24) | add `post-sell` |
| `watchlist` | Watchlist (§C.24) | formalize (currently covered only by the render-rule) |
| `risk` · `macro` · `fundamentals` · `catalyst` | §C.12/14/15/23 | add each |
| `dip check RSI` | Dip Check param | define param grammar |
| `add check` · `reconcile` | Ask-Finn quick-taps | natural-language asks — confirm they resolve or formalize |

**Root recommendation:** every one of the 28 surfaces should have a canonical command verb (the `cmd` column already drafted in `FINN_DATA_SPEC.md §C`). Promote that column into `§COMMANDS` so the launcher/flight-deck/quick-taps all map 1:1. This *is* the "button-route audit" TODO item — closing it = formalizing that list.

---

## 3 · TICKER CHIPS — implicit routing
- Home jump-chips + position references bind to `sendPrompt('NVDA')` etc., relying on the spec rule "single ticker named → live watch solo." **Works in chat.**
- **Per-target gap:** in the cockpit/Next.js, a ticker chip must bind explicitly (→ Position Detail `/positions/[ticker]` or a live-watch panel), **not** a bare prompt. Add the explicit target to the binding map.

---

## 4 · PER-TARGET BINDING (the principle to hold)
Chat bindings audited = correct (`sendPrompt`). To stay correct across targets, maintain ONE binding map per element:
```
element → { chat: sendPrompt('cmd'),
            cockpit: tab-switch / setState,
            nextjs: router.push('/route') | fetch('/api/…') }
```
This is `FINN_DATA_SPEC.md §A.4`. Every new surface/button registers here so the same control rebinds correctly in Phase 2 (cockpit) and Phase 3 (app).

---

## 5 · ACTIONS
1. Promote the 28-surface `cmd` list into `§COMMANDS` (formalize the ⚠ set) — fold at GNF / prompt update.
2. Define param grammar: `scenario [TK]`, `news on [X]`, `dip check [RSI]`, `report [TK]`.
3. Make ticker-chip routing explicit per target (chat=live-watch prompt · app=`/positions/[ticker]`).
4. Keep the element→target binding map as the single source (data spec §A.4).
