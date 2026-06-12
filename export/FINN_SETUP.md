# Finn — Setup & Operator Guide

Welcome. **Finn** is a persistent intelligence system for running an active equity portfolio inside a Claude Project. It tracks your positions, enforces your trading discipline, scans the market for what's relevant to *your* book, and surfaces what needs your attention — session after session.

A few things to set expectations up front:

- Finn is an **operator**, not an advisor. It executes your process and holds your rules so emotion doesn't. It does not pick stocks for you or tell you what to buy.
- Finn **never shows a price it can't pull live.** No estimates, no guesses. If your data feed is down, it tells you — it doesn't make a number up.
- Finn is only as good as the **state you maintain.** One file holds everything; keeping it current is the whole game (more on this below).

This guide gets you running and teaches you how it all works. Read it once start to finish, then keep it for reference. There's also a `guide` command inside Finn — that's your in-app front door once you're set up.

---

## 1. What you need first

| Need | Why | Notes |
|---|---|---|
| A Claude account with **Projects** | Finn lives in a Project | A higher-tier plan helps Finn do heavier analysis, but isn't required to start. |
| Your own **FMP connector** (Financial Modeling Prep) | Every quote, news item, and earnings date comes from your FMP account | **Starter plan is the minimum.** Sign up at financialmodelingprep.com and connect it as an MCP connector in Claude. |
| A **brokerage account** | Finn reconciles your portfolio value (NAV) against your broker's end-of-day close | Any broker. You'll paste your EOD number; Finn doesn't connect to your broker. |

---

## 2. Stand it up (Day 0)

1. **Create a new Claude Project** (name it Finn, or whatever you like).
2. **Upload the required files** (see the file list in §3).
3. **Connect your FMP connector** in Claude's connector settings.
4. **Pick your starting point:**
   - *Keep the examples* — the seed ships with a starter AI/semiconductor watchlist and analytical maps so you can see a working setup. Edit them to your universe.
   - *Start blank* — type `wipe` (Finn confirms once, then hands you a clean state file), **or** just use `FINN_STATE.blank.json` as your `FINN_STATE.json`.
5. **Set your config.** Open `FINN_STATE.json` → the `portfolio` block → fill in your starting NAV, milestones, cash, and broker. Clear the placeholder notes.
6. **Re-upload `FINN_STATE.json`** to the Project (this matters — see §4).
7. **Run `gmf`.** That's your morning boot. If you see your config reflected and a live feed pull, you're live.

---

## 3. The files

**Required (the runtime):**
- `FINN_SYSTEM_PROMPT.md` — the brain. The operating rules, commands, and behavior all live here.
- `FINN_STATE.json` — your data. Positions, trades, watchlist, scores, theses — everything personal.
- `FINN_VISUAL_SYSTEM_v3_3.html` — the locked design system the dashboards render with.
- `FINN_DASH_TEMPLATE_v3_2.html` — the dashboard layout.
- `FINN_SESSION_HANDOFF_TEMPLATE.md` — the shape of the night-to-morning handoff.
- `FINN_SETUP.md` — this guide.

**Optional — deep reference:** the 8 skill modules (`fmp-feed`, `scoring`, `monitoring`, `frameworks`, `daily-surfaces`, `report-surfaces`, `sync`, `visual-system`). The system prompt already carries the operative rules, so you don't need these to run. Add a specific one to the Project only if Finn underperforms in that area.

**Optional — for building/extending Finn:** a "dev pack" (specs + roadmaps) listed in `FINN_STATE.json` under `_meta.dev_pack`. You only need these if you're going to develop Finn further (e.g. build the standalone app). Adding them is a clean drop-in — nothing else changes.

---

## 4. The one idea that makes Finn work

Finn has two halves:

- **The engine** — the system prompt (+ optional skills + visual system). This is the brain. It holds *no* portfolio data.
- **The state** — `FINN_STATE.json`. This holds *everything* personal, and it is the single source of truth.

Two rules keep them in sync, and they're the difference between Finn working and Finn quietly lying to you:

1. **A decision updates the state file the same response it's made.** Buy something, change a target, log a review → the file changes right then.
2. **After the file changes, you re-upload it to the Project.** Call this the *upload dance*.

**Why it matters:** Claude reads the copy of `FINN_STATE.json` that's *in the Project*. If you change the file but forget to re-upload it, Finn keeps reading the old version and gives you confident, wrong answers off stale data. This is the single most common way to break Finn. When in doubt, re-upload.

(If you keep a backup repo, push there too — but the Project copy is the one Finn actually reads.)

---

## 5. The daily rhythm

- **`gmf`** — "good morning." Loads your state, runs a sync check, reads last night's handoff, walks your agenda, pulls the live feed, and renders your home dashboard. Start every session here.
- **During the day** — `dash` / `quick dash` (the daily driver), `dip check` (what's at your buy zones), `scenario [TICKER]` (decision forks), `news [TICKER]`, `ledger` (positions + live P&L).
- **`gnf`** — "good night." Runs stats, a change-aware sync (it tells you exactly which files changed and need uploading), verifies the upload, and **writes the handoff** — a short brief that tomorrow's `gmf` reads. The handoff is the bridge between sessions; it's how Finn "remembers" where you left off.

---

## 6. How you talk to Finn

- **Single-word commands are absolute.** Type `gmf`, `dash`, `dip check`, `wipe` and Finn executes immediately — no clarifying questions.
- **Prefixes override the feed.** Start a request with `prices:` (or `dash prices:`) followed by your broker's numbers and Finn uses those instead of pulling FMP — handy when you want to reconcile against your broker exactly.
- **`guide`** — your in-app orientation (how Finn thinks, the command center, try-this-first). Send it whenever you're lost.
- Keep it terse. Finn defaults to scannable, data-first output and responds well to direct commands.

---

## 7. The discipline Finn enforces

This is the actual value — Finn is the rulebook that doesn't get tired or greedy. You set your own thresholds, but the framework is the spine:

- **No DCA.** Adds happen on dips into defined zones, not on a schedule.
- **Conviction-based sizing.** Higher conviction = larger position. Finn scores every name (see §8) and sizing follows.
- **A single-name ceiling** (default 20% of NAV). Finn flags when a winner gets too big and tells you to trim back under.
- **An exit framework.** Trim into strength above your price target; **+40% triggers a win review**, **−20% triggers a loss review** — so you learn from both.
- **Scenario auto-fire.** Finn automatically lays out a decision page when any of these hit: an owned name has **earnings within 7 days**, a major catalyst lands, a price target is breached, or you reach a genuine fork.
- **Earnings always flag** when a position is inside 7 days.
- **Market scanning every session** — adjacent names, read-through from peer earnings, and smart-money (13F + notable investors) — all filtered for what actually touches your book.
- **Post-sell monitoring.** When you exit, Finn watches the name for 30 days and flags a clean re-entry.

---

## 8. The data layer

- **Prices & news → your FMP account.** Finn pulls each ticker live at render. On the Starter plan, quotes are pulled one at a time (batch quotes and quarterly financials need a higher FMP tier — Finn knows this and works within it). Earnings dates, analyst targets, insider/congress trades, SEC filings, and annual financials are all available on Starter.
- **Portfolio value → your broker.** Your NAV = (your live position values) + cash. The progress-to-goal number is anchored to your broker's official end-of-day close, which you capture at `gnf`/`eod` — that keeps your progress curve honest and free of intraday noise.
- **Scoring.** Finn rates each name on two scales — **CS** (Conviction: how durable the thesis is) and **MS** (Momentum/Setup: timing) — rescored weekly. Scores go stale after 7 days and Finn nudges you to refresh.

---

## 9. The surfaces

Everything renders **inline as live, interactive dashboards** — the buttons and chips are real; tapping them drives the next action. The look is a locked dark-terminal style with a fixed component set, so it stays consistent across every view. You *can* restyle it later, but you don't need to touch it to use Finn.

---

## 10. Make it yours

1. Decide: keep the example scaffolding (and prune it to your universe) or `wipe` to a blank slate.
2. Set your `portfolio` config (starting NAV, milestones, cash, broker).
3. Build your watchlist tiers and add your price-target zones.
4. **Add positions as you actually trade them** — Finn isn't a backfill tool; it grows with your book. Log each buy/trim/sell and let the file accumulate your history.
5. Re-upload after every change.

---

## 11. Don't break it (the short list)

- **Forgetting the upload dance.** Changed the file, didn't re-upload → Finn reads stale data. The #1 failure mode.
- **Not updating the file the moment a decision is made.** Decisions and the file move together, same response.
- **Expecting real-time alerts.** Finn only sees prices when you run a command. An "armed" alert surfaces on your *next* render — it is not pushed to you. Check in.
- **Asking for prices with no FMP connector live.** Finn will flag it and refuse to guess. Connect FMP first.

---

## 12. Your first week

- **Day 1:** Stand it up (§2), run `guide`, then run a `gmf` and just read everything it shows you.
- **Day 2–3:** Add a couple of real positions (or paper ones) and watch a `dip check` and a `scenario` work.
- **Day 4–5:** Do a full loop — `gmf` in the morning, log a trade, `gnf` at night, then `gmf` again the next day and watch it pick up the handoff.
- **End of week 1:** You'll have the rhythm. From here it's just consistency — keep the file current, run the loop, let Finn hold the discipline.

---

## 13. Going further (dev edition)

When you want to *extend* Finn — add surfaces, change the engine, or build the standalone web app — add the **dev pack** files (listed in `FINN_STATE.json` → `_meta.dev_pack`) to your Project. They carry the data spec, the app architecture plan, and the build roadmaps. The runtime is built to accept them as a clean drop-in, so going dev later costs you nothing now.

---

*Questions Finn can answer about itself once it's running: send `guide`, `system`, or just ask. Welcome aboard.*
