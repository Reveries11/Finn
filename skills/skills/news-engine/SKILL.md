---
name: news-engine
description: The News-Intelligence Engine (A2). Apply on every GMF/dash and on `news on [X]`. Turns raw headlines into a proactive, classified, materiality-ranked read for THIS book -- classify, score materiality, detect read-through to held names, link to thesis, net-assess (does it change the call), and diff vs last_scan. Feeds the Market Brief News row + alerts. Scan list lives in FINN_STATE.json news_watch; the diff baseline in last_scan.
---

# News-Intelligence Engine (A2)

Don't dump headlines. Scan broadly, then surface only what moves the book -- classified, ranked, and net-assessed.

## 1 - The scan (every GMF / dash)
Pull (FMP news primary; web per the source hierarchy):
- **Each holding's** news.
- **Read-through tickers** -- each holding's competitors / adjacent names (news_watch.read_through_map; extends watchlist.adjacent_map). News on a *non-held* name that moves a held one.
- **Regulatory themes** (news_watch.regulatory_themes) -- esp. AI-chip export controls.
- **Macro calendar** (news_watch.macro_feeds) + **smart-money** filings (13F + congress).

## 2 - Classify
Tag each item: **earnings | guidance | M&A | regulatory | analyst-rating | competitive | supply-chain | management | macro.**

## 3 - Score materiality to THIS book -- HIGH / MED / LOW
Rank up: held name > read-through to a held name > sector > macro. Rank up further if **thesis-relevant** (touches the position's drivers / breaks_if), **confirmed** (not rumor), and **price-moving** (a deal, a guide, a big move) vs routine PR / a lone analyst note.
- **HIGH** = act-relevant / moves the thesis. **MED** = worth knowing. **LOW** = noise -> one line or drop.
Surface HIGH + MED; suppress LOW (report only a count).

## 4 - Read-through detection
For each material item on a non-held name: which held name does it move, and how? (e.g. a rival's hyperscaler design win -> pressure on a held custom-silicon name.) Flag explicitly.

## 5 - Thesis linkage
Map each material item to the held position's thesis / `breaks_if`: confirming, pressuring, or neutral.

## 6 - Net assessment (the payoff)
For each material item: **direction** (bullish / bearish / neutral for the held position), **magnitude**, and the key question -- **does it change the call?**
- If **yes** -> state the new/updated call in the A1 contract and log it to calls_log the same turn.
- If **no** -> it's context; say so plainly ("noise/sentiment, thesis intact").

## 7 - Diff: "what changed since last session"
Compare the scan to FINN_STATE.json `last_scan`: lead with **new** items + items that **escalated**; don't re-surface unchanged stories. Refresh `last_scan` after.

## Output
- **Market Brief News row:** top 3-4 material items -- class tag + headline + source/date + ticker(s) + a one-line net-assessment.
- **Alerts:** a HIGH-materiality item that moves a call fires an alert.
- **Item shape (last_scan / internal):** {id, headline, class, tickers, materiality, net, source}.

## Example (Jun 9)
- **HIGH | competitive** -- "ByteDance-Qualcomm ASIC deal" (Yahoo/24-7, Jun9). Read-through -> MRVL/AVGO/CRDO. Net: **bearish (sentiment)**, pressures the custom-silicon breaks_if; drove -5 to -13% today. **Change the call? No** -- positioning shakeout, theses intact; holds stand.
- **HIGH | commercial** -- "AVGO + Anthropic $35B" (Reuters/Barron's, Jun9). Net: **bullish**, confirms the ASIC thesis + a financing-platform role. **Supports the AVGO ADD.**
- **MED | structural** -- "MRVL -> S&P 500 Jun22" (Yahoo/24-7). Net: **bullish** (forced buying); structural offset to today's drop.
