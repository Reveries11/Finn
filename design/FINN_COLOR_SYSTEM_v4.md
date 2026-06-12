# Finn — Color System v4 (Signal-Only)

**Decision (Jun 11, post-Fable review):** color is reserved **exclusively for signal and state**. Every categorical taxonomy — sectors, news classes, catalyst types — goes **neutral**, distinguished by a shape glyph, not a hue. Net effect: every colored pixel on the cockpit means something is *up, down, due, live, or actionable*. This is a deletion, not a redesign.

Root cause this fixes (confirmed in `tokens/colors.css`): the sector ramp samples the signal hues — `sec-infra` = coral (= loss), `sec-semis` = mint (= brand/live), `sec-power` = cyan (= HOLD/info), `sec-software` = amber (= TRIM/warn), `sec-network` = violet (= WATCH). So APLD at +66% wears a coral "loss-colored" badge, cyan HOLD pills sit next to cyan Power badges, etc. Neutralizing the categoricals removes every one of these collisions.

---

## 1 · The signal palette — the *only* things allowed to carry color

| Token | Hex | Means | Used for |
|---|---|---|---|
| `--finn-green` | `#43ee6b` | gain / up | P&L positive, day-up, ADD |
| `--finn-coral` | `#ff6f64` | loss / down / alert | P&L negative, day-down, breaches, reconciliation-fail |
| `--finn-mint` | `#46e0bd` | **live / interactive / brand** (NOT gains) | live dots, the live price marker, active controls |
| `--finn-gold` | `#f4cf6a` | goal / price target | the $50K goal, PT markers/lines |
| `--finn-amber` | `#ffbe52` | warning / watch / act-now | TRIM, dip-zone band, "imminent," missing-data flags |
| `--finn-cyan` | `#54c8ff` | info / incoming | HOLD, new/incoming items |
| `--finn-violet` | `#b39cff` | WATCH state | the WATCH recommendation only |

Recommendation states stay distinct and collision-free: **ADD = green · HOLD = cyan · TRIM = amber · WATCH = violet.** (WATCH + numeric confidence are now canonical.)

Nothing else gets a hue. If a thing isn't up/down/live/goal/watch/info, it's neutral.

---

## 2 · Categoricals → neutral + glyph

Sectors, news classes, and catalyst types render as **`--finn-ink-dim` text + a hairline border + a leading shape glyph** (8–9px, `--finn-ink-faint`). Position and the glyph carry the scan; color carries nothing.

**Sector glyphs** (one shape each, monochrome):
- AI Semis ▣ · Networking ⬡ · AI Software ◇ · AI Infra ▤ · Power ◈ · Foundation ●

**News classes** (Competitive / Commercial / Earnings / Structural / Product / Guidance / Macro): neutral text label, no hue. The *only* colored thing on a news row is the **`net` signal** — bullish = green dot, bearish = coral dot, binary = amber dot, neutral = ink. That's the part that's actually a signal.

**Catalyst types** (earnings / macro / structural / decision): neutral label. The signal on a catalyst is **proximity/urgency** — imminent (<7d) = amber, today = coral, else ink — never the type.

---

## 3 · Token diff — what to change in `tokens/colors.css`

Retire the sector hues; remap them all to neutral (kept as names only, for the glyph layer):
```css
/* was: each a sampled signal hue → collisions */
--finn-sec-semis:    var(--finn-ink-dim);
--finn-sec-network:  var(--finn-ink-dim);
--finn-sec-software: var(--finn-ink-dim);
--finn-sec-infra:    var(--finn-ink-dim);
--finn-sec-power:    var(--finn-ink-dim);
--finn-sec-found:    var(--finn-ink-dim);
/* sectors are now distinguished by glyph + label, not color */
```
`SECTOR_COLORS` in `finn-data.js` → replace the color values with glyph keys (or drop it and map sector→glyph in the badge component).

Keep `--finn-rec-*` and the signal aliases as-is (they're correct).

---

## 4 · Fix the levels family (the gold collision)

Today `PriceTrack` and the `Ladder` disagree, and `Ladder` uses gold for *both* dip and target. One rule everywhere, each marker a distinct signal:

- **Cost basis** → `--finn-ink-dim` (neutral reference line)
- **Current price** → `--finn-mint` (it's *live*)
- **Dip zone** → `--finn-amber` band (opportunity / act)
- **Price target** → `--finn-gold` (goal)

(This refines Fable's "dip=gold / target=mint" — target=mint would collide with mint=live, so target=gold, current=mint. No marker shares a hue.)

---

## 5 · Two related cleanups

- **ScoreMeter** (finding #11): drop the binary ≥85-mint / else-gray. CS/MS render as a **neutral 3-step ink ramp** (`ink-faint` < `ink-dim` < `ink`) or numbers only. Reserve mint strictly for live/interactive — a score is neither.
- **Conviction**: stop the mint→coral ramp (conv-5 = brand-mint, conv-1 = loss-coral, both collisions). Render conviction as **N filled pips of 5 in `--finn-ink`** (empty = `--finn-line`). The count carries it; no hue needed. (`ConvictionPips` already exists — just de-hue it.)

---

## 6 · Apply

- **In Claude Design:** attach this file and say *"Apply Finn Color System v4: make all sector/news-class/catalyst-type color neutral (ink-dim + the shape glyphs in §2), keep color only for the §1 signals, fix the levels family per §4, and de-hue ScoreMeter + ConvictionPips per §5."* Then eyeball Positions, Watchlist, News, Catalysts, and the Observatory for any remaining colored categorical.
- **In the Phase-3 build:** the §3 token diff + the component changes (badge → glyph, news row → `net`-only color, PriceTrack/Ladder → §4) are the whole change.

**Acceptance check:** scan every surface and ask of each colored element — *does this color mean up, down, live, goal, watch, or info?* If not, it's a bug.
