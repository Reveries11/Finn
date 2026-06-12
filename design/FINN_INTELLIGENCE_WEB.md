# Finn — The Intelligence Web

The promise that separates Finn from a dashboard: a traceable chain — **news → position → scenario → risk**, reachable in a click or two. Today it's ~40% realized (tickers are clickable but most lead nowhere; PositionDetail doesn't gather a name's threads). This spec makes the web real. Source for Saturday queue **A6**.

---

## 1 · Three universal rules (apply everywhere)

1. **Every ticker is a link.** Held → its **Position Detail**. Not-held (read-through rivals, watchlist, catalyst names) → a **quote peek** popover with an "add to watchlist" action. No ticker is ever a dead pointer-cursor (fixes the no-op affordance).
2. **Position Detail is the junction.** Every thread for a name converges there (§3). Any surface that mentions a held name links into its Detail.
3. **You can always trace back.** Breadcrumbs in the TopBar (`Positions › AVGO › Scenario`), and a persistent "← back" that returns to the surface you threaded from, not a fixed home.

---

## 2 · The link graph (the wires)

Each surface gets specific outbound links. Bidirectional where it matters.

- **Position Detail** → open call · next catalyst · classified news (this ticker) · thesis + break · risk contribution · street-vs-curated PT *(all in the §3 panel)*.
- **News item** → the tagged position(s) [Detail] · "does it move the book? → Scenario" · materiality that shifts concentration → Risk.
- **Scenario** → the position [Detail] it concerns · each branch's **Risk impact** [Risk] · the **catalyst** that fires it [Catalysts].
- **Catalysts / Earnings** → affected position(s) [Detail] · the scenario that fires on the event · read-through tickers [Watchlist/quote peek].
- **Risk / Allocation** → click a concentration slice or name → the position(s) [Detail] · the sizing scenario if one's open.
- **Observatory planet** → Position Detail (also in the nav spec).
- **Smart Money** → the held name [Detail] or watchlist name [Watchlist].
- **Gameplan / Watchlist** entry → Detail (if held) or quote peek (if not).

The pattern under all of it: **a "Related" affordance** on every analysis surface listing the linked position / scenario / news / catalyst for whatever you're looking at.

---

## 3 · PositionDetail thread panel (the hub)

PositionDetail's right column becomes the **thread panel** — five live wires, each a one-click jump to its source surface:

| Wire | Shows | Links to |
|---|---|---|
| **Open call** | the live ADD/HOLD/TRIM/WATCH + numeric confidence + the one-line driver | Scenario / call detail |
| **Next catalyst** | the soonest dated event for this ticker (earnings, macro, trigger) + T-countdown | Catalysts |
| **Latest news** | top 1–2 classified items tagged to this ticker (class neutral, `net` colored) | News (filtered) |
| **Thesis + break** | the one-line thesis and the explicit break condition | thesis ledger |
| **Levels** | cost · live · dip zone · **street vs curated PT** (both, side by side) | Fundamentals / PT |

Left column stays the price/levels chart + the position facts. The thread panel is what makes Detail the place you *land and branch from*, not a dead end.

**Re-scope the dead controls** (Fable #8): the Add/Trim buttons here become **"Log a decision"** (drafts a Trades/Ledger entry) — never order entry. And only ONE color per word: TRIM the action and TRIM the button are both amber.

---

## 4 · The canonical thread (the demo that proves it)

This path should be ≤4 clicks end to end:

> **News:** "ByteDance–Qualcomm custom-silicon deal" (tags MRVL/AVGO/CRDO) → click **AVGO** → **AVGO Detail** (thread panel: open ADD call · next catalyst · this news · thesis/break · risk contribution) → click **Scenario** → AVGO branches, each with a **Risk impact** chip → click it → **Risk/Allocation** with AVGO's contribution highlighted.

If that flows in a click or two between nodes, the web is real. Build/verify this path first; it's the acceptance test.

---

## 5 · Dependencies & what's renderable now

- **Renderable now (mock):** every link above can be wired statically — news already carries ticker tags, the read-through map exists in state, and PositionDetail can pull from the existing THESIS / EARNINGS / NEWS / calls data already in the file. The thread panel is a layout + wiring change, no new data.
- **Fuller post-Phase-3:** "next catalyst" and "the scenario that fires on this event" get cleaner once the **unified event store** lands (Phase-3, queue B) — until then, attach the nearest known dated event per ticker.

---

## 6 · Apply (Claude Design, Saturday)

> Make every ticker a link (held → Position Detail, not-held → quote-peek popover). Build the PositionDetail thread panel per §3 (open call · next catalyst · latest news · thesis+break · street-vs-curated PT, each linking out), and re-scope Add/Trim to "Log a decision." Add the "Related" affordance + outbound links per §2 to News, Scenario, Catalysts, and Risk. Wire the §4 canonical thread first and confirm it's ≤4 clicks. Breadcrumbs + contextual back per §1.3.
