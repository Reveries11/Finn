# Finn — Review Brief for Claude Fable

**You (Fable) are being asked to critique a portfolio-intelligence terminal called "Finn."** This document is your full context: what Finn is, the hard constraints you must stay inside, what's attached, and exactly what to produce. Read it before evaluating. Where you disagree with anything here, say so explicitly.

---

## 1 · What Finn is

Finn is a **daily-driver cockpit for one operator running a real, concentrated AI-infrastructure equity book** (~12 positions across compute, networking, memory, power, semis) — pushing one portfolio from ~$29K toward $50K, then $100K. It tracks per-position conviction + momentum scores, cost/price/P&L, dip zones and price targets, live prices, earnings/catalyst alerts, and smart-money signals, and it issues terse ADD/HOLD/TRIM calls with a confidence tag.

It is an **operator's instrument, not a consumer app.** The bar is "would a real trader trust this with real capital, every morning" — not "is this a polished portfolio demo." The voice is a sharp analyst's morning note: terse, first-person about the book, imperative about calls, numbers leading every sentence, no hype, no emoji.

The attached build is the **"Command Deck" visual language** (the chosen direction after three exploration rounds): dark, instrument-grade, near-black surfaces, Space Grotesk for UI + JetBrains Mono for every number/label, a signal-only color palette, a live ticker tape, pulsing live indicators, and a signature **Observatory** that maps the whole book as either an orbital system (NAV-as-sun, conviction-tier rings, holdings-as-planets) or a conviction ladder (cost → live → target per name).

---

## 2 · Hard constraints — stay inside these

These are settled. Critique *within* them; don't propose things they rule out (and if you think a constraint is wrong, flag it separately rather than designing around it).

**Two render targets — do not conflate them:**
- **Chat surfaces (live today):** Finn currently renders inline inside a Claude chat via a widget. That widget **cannot fetch data itself** (sandbox/CSP blocks API calls) — live prices are pulled per-ticker by the model and baked into the render. So "have the dashboard fetch/stream prices in-component" is impossible *for chat surfaces*. These use an older visual system (IBM Plex; violet/green/red/teal) that is **locked** — out of scope for this review.
- **The Phase-3 app (what the attached mock is for):** a future standalone web app (Next.js) that solves server-side fetching. **The Command Deck mock is the design target for this app.** So real time-series charts, live motion, server-side data, websockets, persistence, etc. are all *legitimate* here — they're blocked only in the chat surfaces. Aim your "make it live" and "add charts" critique at this target.

**Data feed:** Financial Modeling Prep, **Starter tier**. Prices are **polled per-ticker** (no batch endpoint; no true streaming). Quotes, news, earnings dates, analyst targets, insider/congress trades, SEC filings, and *annual* financials are available; batch quotes and *quarterly* statements are gated. Design for a polled feed, not a fat real-time tape.

**NAV / goal model:** NAV = Σ(live position value) + cash. Progress-toward-$50K is deliberately anchored to the **broker's end-of-day close** (captured manually each night), *not* intraday — to keep the goal curve stable. Intraday NAV can breathe; the goal-progress number is intentionally not tick-by-tick.

**State / data:** one canonical `FINN_STATE.json` holds all portfolio data; the engine (a system prompt) and the data are kept separate; there is no backend database today (the Phase-3 app would add one). **The numbers in this mock are a synthesized rev7 / Jun-5 snapshot** — placeholder sample data. The hard-coded, static NAV series is a *known* gap the operator already wants fixed; you don't need to re-flag it, but feel free to specify what the real version should be.

**Fixed vocabulary & voice (intentional):** recommendations are exactly **ADD / HOLD / TRIM**; confidence is **High / Medium / Low**; conviction is **1–5**; scores are **CS** (conviction) and **MS** (momentum), 0–100. Terse operator copy, no emoji. Critique within this; don't suggest a friendlier consumer tone.

**Scope today:** a fixed ~1440px desktop cockpit. **Mobile is an open question** — the operator specifically wants your verdict on whether a condensed mobile view should be in scope.

---

## 3 · What's attached

- **`Finn_28_Surfaces.pdf`** — all 28 surfaces as labeled screenshots, in order (Home, Market Brief, Quick/Full Dash, Positions + detail, Scenario, Ledger, Engine, NAV Curve, Trades, Risk/Allocation, News, Macro, Fundamentals, Dip Check, Smart Money, Reviews, Rescore, Blindspots, Gameplan, Exit, Catalysts, Watchlist, Earnings, Guide, Reports, Sync). **This is your primary material — review every surface.**
- **`Finn_Cockpit_standalone.html`** *(optional, if attached)* — the interactive cockpit. Open it to feel the live motion, the ticker, hover/click states, and the Observatory's orbital ⇄ ladder toggle.
- *(Optional, if the operator includes them)* the component source (`finn-screens-*.jsx`, `finn-intel.js`) and the design-system `readme.md`/tokens — for a build-architecture pass.

---

## 4 · Your task

Evaluate Finn across these lenses. **Cite specific surfaces and elements** by name — no generic advice.

1. **Information design** — does each surface communicate fast and rank the right things first, or is anything decoration / noise / wasted density?
2. **Cross-surface coherence** — does this feel like *one* product? Judge the color system, type, layout grammar, naming, and interaction patterns across all 28 surfaces. (The operator separately feels the palette is "a bit all over the place" — pressure-test that.)
3. **The intelligence web** — the promise is a traceable chain: a news item → the affected position → its scenario → the risk/allocation impact, reachable in a click or two. How well does the design realize that "pull the thread" flow, and where does it break?
4. **Credibility of "live"** — time-series charts, a real equity curve, and motion. What reads as a real instrument vs. set-dressing, and what's the highest-leverage move to fix it (for the Phase-3 app target)?
5. **Trust** — as a skeptical operator, what on these screens would make you *not* trust this with real capital daily?
6. **Mobile** — is desktop-only acceptable for a daily driver, or is a condensed mobile view (at least Brief + Home + Positions) worth the cost? Give a clear yes/no with reasoning.
7. **Prioritization** — given everything, what's mis-prioritized, what's over-built, and what is the single highest-leverage next move?

## 5 · Deliverable format

- **Ranked findings.** Each finding: **severity** (blocker / major / minor) · the **surface(s)** · the **problem** · a **concrete fix**.
- **Top 3 highest-leverage moves** (most product value per unit effort).
- **"What you're over-investing in and could cut."**
- **2–3 things you'd do differently if you started this fresh.**
- **The color-system call:** propose 1–2 cohesive palette systems (within the dark, signal-only philosophy) with rationale, plus a font-pairing opinion.

Be direct and specific. No flattery. Concrete beats comprehensive — if you can only nail a few things, nail the ones that matter most.

---

### Kickoff line (paste this into the Fable chat, with the files attached)

> Review the attached Finn terminal per this brief (`FINN_FABLE_REVIEW.md`). The 28 surfaces are in `Finn_28_Surfaces.pdf`. Stay inside the constraints in §2. Give me ranked findings, top-3 leverage moves, what to cut, what you'd do differently, and the color-system call — per §5.
