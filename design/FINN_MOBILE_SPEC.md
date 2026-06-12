# Finn — Mobile Companion Spec

**Decision (Jun 11):** mobile ships as a **read-only morning-loop companion**, not a ported cockpit. Rationale: Finn's highest-value moments are time-sensitive and happen away from the desk — the AVGO add window was an intraday dislocation; dip-zone entries don't wait for you to be at 1440px. A desk-only daily driver misses exactly the moments it exists to catch.

This is a separate, narrow build (mobile frames in Claude Design or Phase-3 web) — tracked under queue **C**.

---

## In scope (four views, read-only)

1. **Brief** — TL;DR + the tape stats + the calls (ADD/HOLD/TRIM/WATCH + numeric confidence). The morning note, condensed.
2. **TopBar strip** — NAV, day move, **cash**, next catalyst. The four numbers that orient you in two seconds. (NAV + cash are the daily-operative pair — see Phase-3 fix A4.)
3. **Positions** — a list with day moves and **dip flags** (in-zone names surfaced). Tap → a read-only position summary (price, levels, open call, next catalyst) — a condensed slice of the Detail thread panel.
4. **Push alerts** — "AVGO entered $410–420," "ORCL prints in 2h," a sell-trigger hit, a review now due.

## Explicitly out of scope (stay desktop)
The Observatory, all analysis surfaces (Scenario / News / Macro / Smart Money / Fundamentals / Blindspots), Risk, Performance, and anything interactive or editorial. Mobile is **read + get-alerted**, not analyze or act.

## Design notes
- Reuse the v4 tokens + the signal-only color system (one design language, just a narrow viewport).
- Single-column, thumb-reachable, dense-but-scannable — same instrument voice.
- No charts beyond the position sparkline (if cheap); the equity curve stays desktop.

## The dependency that decides its value
**Push alerts require the Phase-3 backend.** The chat-render Finn can't push — same root cause as "an armed alert only surfaces on the next render." So:
- **With** push → mobile is a genuine daily driver (catches the away-from-desk moments). High value.
- **Without** push (read-only, no notifications) → it drops to **nice-to-have**; you'd still have to open it to learn anything.

**Recommendation:** build the four read-only views alongside the Phase-3 app (they reuse the store + tokens), and gate the *real* value on shipping push. If push slips, deprioritize mobile until the backend exists — don't build a read-only app that can't tell you anything you didn't open it to find.
