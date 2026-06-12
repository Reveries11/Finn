# FINN — PHASE 3 ARCHITECTURE & FMP INTEGRATION SPEC

> v0.1 · 2026-06-10 · the build spec for the Next.js app (Claude Code) that retires chat/artifact limits.
> Covers WS-C (FMP integration) + WS-E (Phase 3 app) from `FINN_FRONTEND_ROADMAP.md`. Pairs with `FINN_DATA_SPEC.md` (what each surface shows) and the v4 design language (how it looks).

---

## 0 · WHY PHASE 3 EXISTS (the three frictions it kills)
1. **CSP price-fetch limit** — chat artifacts can't fetch FMP (CSP blocks it); Finn pulls per-ticker and bakes it in. The app does it **server-side**, properly.
2. **Manual re-uploads** — every state change is re-uploaded to two places by hand (the Jun5→6 drift cause). The app reads/writes **hosted state** directly.
3. **Render ephemerality** — chat surfaces don't persist or update. The app is durable, refreshable, and the foundation for out-of-session monitoring (Track B in `FINN_ROADMAP.md`).

---

## 1 · STACK
- **Next.js** (App Router) + TypeScript · **Tailwind** (or CSS modules) for the v4 component port.
- **Hosting:** Vercel (native Next.js, free at this scale) · FMP key as a server env var.
- **State store:** lightweight hosted KV/DB (Vercel KV / Supabase / Turso) holding the `FINN_STATE` JSON blob, seeded from the committed `FINN_STATE.json`. *(Persistence model = the open "simple store vs full DB" decision — both work; default = KV blob.)*
- **Data fetching:** SWR / React Query (client) hitting internal API routes (never FMP directly from the client).

---

## 2 · FMP INTEGRATION (the server route — WS-C)

### 2.1 Plan constraints (FMP Starter — carried from the working chat integration)
- ✓ available: `quote` (single), `news`, `screener`, `earnings-dates`, `analyst` (PT+grades), `insider`, `senate`, `SEC-filings`, `profile`, annual financials, `RSI`, `econ-calendar`.
- ✗ gated (Premium): **batch-quote** · quarterly statements · raw index / ^VIX live.

### 2.2 `GET /api/portfolio` — the price engine
```
1. read positions from the state store (tickers, shares, cost, zones, conviction…)
2. FAN OUT parallel single-quote calls — Promise.all over the ~12 tickers
   (batch is gated, so concurrency replaces it; ~12 calls finish fast server-side)
3. compute server-side, per the Derivation Catalog (FINN_DATA_SPEC §B):
   mkt value, open P&L, weights, NAV, day Δ vs nav_last_eod_close,
   PT-progress, zone-dot, drawdown, →$50K
4. return ONE payload: priced positions + portfolio rollups + freshness timestamp
```
- **Key stays server-side** → no client exposure, no CSP issue.
- **Cache** the FMP responses ~30–60s (edge/in-memory) so client polling never burns the rate limit.
- **Fallback:** a failed ticker returns `price:null` → the client renders `—` (never an estimate); a full FMP outage → `feed-down` payload + manual-override path.

### 2.3 Sibling routes
- `GET /api/news?symbols=` → `search-stock-news` + `general-news` (Market Brief / News surface).
- `GET /api/earnings` → `earnings-company` (confirm dates as names enter <7d).
- `GET /api/rsi?symbol=` → `technicalIndicators` (Dip Check).
- `GET /api/analyst?symbol=` → `analyst` (Scenario PT/grades).
- All cached; all key-protected.

### 2.4 Refresh model
- SWR polls `/api/portfolio` on an interval (default off / opt-in — chat's "no streaming" rule, but the app *can* offer it) + a `prices as of HH:MM ET` stamp + a manual refresh button.

---

## 3 · STATE LAYER
- **Seed:** commit `FINN_STATE.json` (rev15) → seed the store on first deploy.
- **Read:** every surface reads the blob (or normalized slices) from the store.
- **Write:** trades / reconciles / rescores PATCH the blob server-side via an authenticated route → **no more upload dance.** The single-canonical-state model is preserved, just hosted.
- **Schema:** unchanged from `FINN_STATE.json` (`anchors`, `positions`, `trades`, `nav_history`, `scores`, `earnings`, `watchlist`, `macro`, `calls_log`, `risk`, `fundamentals`, `catalysts`, `session_handoff`, …). A7's calibration fields slot into `calls_log` (see `FINN_A7_CALIBRATION.md`).

---

## 4 · ROUTING (mirrors the 7-tab nav + the 28 surfaces)
| Route | Surface(s) |
|---|---|
| `/` | Home / Control Center (§C.1) + Market Brief (§C.2) |
| `/positions` | Positions grid (§C.5) |
| `/positions/[ticker]` | Position Detail drill-in (§C.6) — hosts scenario / news / live-watch tabs |
| `/watchlist` | Watchlist (§C.24) |
| `/ledger` | Ledger table primitive (§C.7) |
| `/trades` | Trades (§C.10) |
| `/earnings` | Earnings (§C.25) |
| `/scenario` | Scenario (§C.11) — generated per request, routes the heavier model |
| (chrome) | Guide (§C.26) — tertiary, not a tab |
| (surfaces) | Risk, News, Macro, Fundamentals, Dip Check, Smart Money, Reviews, Rescore, Blind Spots, Gameplan, Exit, Catalyst, Engine, NAV Curve, Quick/Full Dash, Reports, Sync — reachable via command bar / launcher |

- Every interactive element binds to the **Next.js target** per the data spec: router push / API call (not `sendPrompt`).

---

## 5 · BUILD ORDER (Sprint 2 → 3)
1. Scaffold app + port the v4 component library (once, from the v4 token file).
2. Stand up the store + seed from `FINN_STATE.json`; wire read path.
3. Build `/api/portfolio` (the price engine) + wire Home/Positions/Ledger to it (read-only parity).
4. Add the remaining surfaces against `FINN_DATA_SPEC.md`.
5. Writes (trades/reconciles) → store (kills the upload dance).
6. Refresh model · mobile/responsive · auth.
7. **Parity gate** → app becomes primary; chat-Finn stays the quick-command layer.

---

## 6 · WHAT THIS UNLOCKS NEXT (Track B, `FINN_ROADMAP.md`)
Once the service is deployed, the same backend runs scheduled jobs: out-of-session scans (the A2 news engine) + push alerts (PT breach · earnings tomorrow · thesis-break · smart-money convergence) + performance attribution (B2, on A7's log). **That's the real destination — Finn watching the market when you're not here.**
