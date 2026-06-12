// Finn shared data — regenerated from canonical FINN_STATE.json rev20 + live prices (Jun 12).
// SOURCE PIN: rev 20, sha 054ad2055e25627b… (AF-21). Aggregates DERIVED here; app load-asserts source_sha == live store sha.
// Curated views (SCENARIOS / WATCH / BRIEF / QUEUE) are design-ref; canonical data (POS/cash/NAV/HWM/TRADES/EARNINGS) is rev20-current.
(function () {
  const SOURCE = { source_rev: 20, source_sha: "054ad2055e25627bef2b716c41ca91fa45e9ef651b352c9313aaf9198af9fe35", recipe: "sha256(json.dumps(obj_without_sha256, sort_keys=True, separators=(',',':'), ensure_ascii=False))" };
  const cash = 24.05;

  // ----- Positions: rev16 facts + live prices (Jun 11 feed). cost/PT/zones/scores from canonical. -----
  // t, name, sector, shares, cost, live, dayPct, cs, ms, conv, ptL, ptH, dipL, dipH, trim, rec
  const POS = [
    { t: "NVDA", n: "NVIDIA", sec: "AI Semis", sh: 27.727, cost: 154.66, live: 204.87, dayPct: 2.22, cs: 88, ms: 77, conv: 5, ptL: 295, ptH: 295, dipL: 200, dipH: 210, trim: 382, rec: "hold" },
    { t: "AVGO", n: "Broadcom", sec: "AI Semis", sh: 9, cost: 420.37, live: 385.57, dayPct: 3.62, cs: 90, ms: 71, conv: 5, ptL: 463, ptH: 582, dipL: 410, dipH: 420, trim: 602, rec: "add" },
    { t: "ANET", n: "Arista Networks", sec: "Networking", sh: 17, cost: 145.01, live: 156.4, dayPct: 3.06, cs: 87, ms: 75, conv: 5, ptL: 187, ptH: 187, dipL: 140, dipH: 145, trim: 235, rec: "watch" },
    { t: "AMAT", n: "Applied Materials", sec: "AI Semis", sh: 6, cost: 431.9, live: 552.64, dayPct: 11.19, cs: 87, ms: 81, conv: 4, ptL: 500, ptH: 575, dipL: 420, dipH: 425, trim: 590, rec: "hold" },
    { t: "ETN", n: "Eaton", sec: "Power", sh: 5, cost: 395.19, live: 393.64, dayPct: 4.84, cs: 83, ms: 72, conv: 4, ptL: 464, ptH: 464, dipL: 395, dipH: 415, trim: 586, rec: "add" },
    { t: "APH", n: "Amphenol", sec: "Networking", sh: 12, cost: 133.11, live: 152.46, dayPct: 2.17, cs: 88, ms: 79, conv: 4, ptL: 145, ptH: 182, dipL: 130, dipH: 135, trim: 237, rec: "hold" },
    { t: "APLD", n: "Applied Digital", sec: "AI Infra", sh: 35, cost: 26.49, live: 41.47, dayPct: 6.55, cs: 63, ms: 74, conv: 4, ptL: 58, ptH: 97, dipL: 40, dipH: 43, trim: 75, rec: "hold" },
    { t: "MRVL", n: "Marvell", sec: "AI Semis", sh: 6, cost: 194.33, live: 280.71, dayPct: 11.13, cs: 84, ms: 81, conv: 4, ptL: 340, ptH: 400, dipL: 205, dipH: 215, trim: 390, rec: "hold" },
    { t: "NOW", n: "ServiceNow", sec: "AI Software", sh: 12, cost: 101.68, live: 103.08, dayPct: -2.81, cs: 83, ms: 71, conv: 4, ptL: 143, ptH: 236, dipL: 115, dipH: 120, trim: 186, rec: "add" },
    { t: "CRDO", n: "Credo Technology", sec: "AI Semis", sh: 11, cost: 215.95, live: 264.76, dayPct: 11.39, cs: 83, ms: 82, conv: 4, ptL: 240, ptH: 300, dipL: 190, dipH: 215, trim: 300, rec: "hold" },
    { t: "ORCL", n: "Oracle", sec: "AI Software", sh: 5, cost: 192.84, live: 184.1, dayPct: -8.53, cs: 76, ms: 66, conv: 3, ptL: 261, ptH: 261, dipL: 185, dipH: 190, trim: 339, rec: "hold" },
    { t: "VOO", n: "Vanguard S&P 500", sec: "Foundation", sh: 4, cost: 635.56, live: 678.23, dayPct: 1.68, cs: 84, ms: 77, conv: 5, ptL: null, ptH: null, dipL: 650, dipH: 650, trim: null, rec: "hold" },
  ];

  // Thesis-break sell triggers (every position has a defined exit; 5 new ones added Jun 11).
  const SELL_TRIGGERS = {
    VOO:  "NEVER SELL",
    NVDA: "capex cuts by hyperscalers",
    AVGO: "ASIC pulled by hyperscalers",
    ANET: "back-end Ethernet share loss to NVDA Spectrum / white-box",
    AMAT: "WFE cycle down",
    ETN:  "datacenter / grid power capex rolls over",
    APH:  "AI-DC interconnect content & share erosion",
    APLD: "lease cancellation",
    MRVL: "Tier-1 custom-silicon socket loss / hyperscaler in-sourcing",
    NOW:  "ARR growth <20%",
    CRDO: "AEC/optical share loss to MRVL/AVGO",
    ORCL: "OCI/RPO growth stalls or anchor-customer (OpenAI) commitment cut",
  };

  // ----- Derived per-position fields (no hand-entered aggregates) -----
  POS.forEach((p) => {
    p.mktVal    = p.sh * p.live;
    p.costBasis = p.sh * p.cost;
    p.pnl       = p.mktVal - p.costBasis;
    p.pnlPct    = (p.live / p.cost - 1) * 100;
    p.toPT      = p.ptL ? (p.ptL / p.live - 1) * 100 : null;
    p.inDip     = p.live >= p.dipL && p.live <= p.dipH;
    p.belowDip  = p.live < p.dipL;
    p.sellTrigger = SELL_TRIGGERS[p.t] || null;   // never "—" silently; absence is explicit null
  });

  // Seeded deterministic price history (stable across reloads), ending at live.
  function rng(seed){return function(){seed|=0;seed=(seed+0x6D2B79F5)|0;let t=Math.imul(seed^(seed>>>15),1|seed);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
  const HIST_LEN = 60;
  function genHistory(p){
    const r=rng(p.t.split("").reduce((s,c)=>s+c.charCodeAt(0),0)*97+Math.round(p.live));
    const vol=(p.t==="MRVL"||p.t==="APLD"||p.t==="CRDO")?0.030:p.t==="VOO"?0.008:0.018;
    const startBias=(p.cost/p.live);
    const out=new Array(HIST_LEN); out[HIST_LEN-1]=p.live;
    for(let i=HIST_LEN-2;i>=0;i--){const drift=((startBias-1)/HIST_LEN);const shock=(r()-0.5)*2*vol;out[i]=Math.max(1,out[i+1]/(1+drift+shock));}
    return out.map((v)=>+v.toFixed(2));
  }
  POS.forEach((p)=>{p.history=genHistory(p);p.hist30=p.history.slice(-30);p.hist7=p.history.slice(-7);});

  // ----- Closed-trade ledger (real, reconciled). realized = Σ pnl, by construction. -----
  // Recent trades itemized from canonical realized_breakdown; older history rolled up so Σ = broker total.
  const REALIZED_TOTAL = 2528.29; // broker-reconciled (FINN_STATE realized_pnl_total)
  const ITEMIZED = [
    { t: "HOOD", n: "Robinhood (tactical)", open: "—",      close: "May 15", sh: null, in: null,   out: 78.05,  pnl: 289.36, pct: null, note: "tactical win" },
    { t: "MU",   n: "Micron (tactical)",    open: "—",      close: "May 18", sh: null, in: null,   out: 724.80, pnl: 176.50, pct: null, note: "HBM cycle — took the win" },
    { t: "CEG",  n: "Constellation (trim)", open: "—",      close: "Jun 01", sh: null, in: null,   out: 269.49, pnl: -36.84, pct: null, note: "power trim — small loss" },
    { t: "NU",   n: "Nu Holdings",          open: "—",      close: "Jun 01", sh: null, in: null,   out: 12.98,  pnl: -0.95,  pct: null, note: "flat cleanup" },
    { t: "MRVL", n: "Marvell (trim)",       open: "—",      close: "Jun 02", sh: null, in: null,   out: null,   pnl: 196.19, pct: null, note: "trim into the Jensen-call spike; kept core" },
    { t: "AMD",  n: "AMD",                  open: "—",      close: "Jun 03", sh: null, in: null,   out: 526.41, pnl: 268.28, pct: null, note: "above-PT recycle; re-entry $430–440" },
    { t: "DRAM", n: "DRAM sleeve",          open: "—",      close: "Jun 03", sh: null, in: null,   out: 68.71,  pnl: 104.87, pct: null, note: "harvest + re-buy lower; HBM thesis intact" },
    { t: "NVDA", n: "NVIDIA (trim)",        open: "Nov 02", close: "Jun 09", sh: 2,    in: 154.66, out: 206.27, pnl: 117.69, pct: 33.4, note: "FIFO; funded AVGO half-starter" },
  ];
  const ITEMIZED_SUM = ITEMIZED.reduce((s, t) => s + t.pnl, 0);
  const TRADES = [
    { t: "—", n: "Prior realized (through May 28)", open: "—", close: "≤ May 28", sh: null, in: null, out: null,
      pnl: +(REALIZED_TOTAL - ITEMIZED_SUM).toFixed(2), pct: null, note: "aggregate of earlier closed positions", rollup: true },
    ...ITEMIZED,
  ];

  // ----- Portfolio aggregates: ALL derived. -----
  const investedVal = POS.reduce((s, p) => s + p.mktVal, 0);
  const navLive     = investedVal + cash;
  const realized    = TRADES.reduce((s, t) => s + t.pnl, 0);      // === REALIZED_TOTAL by construction
  const dayDollars  = POS.reduce((s, p) => s + (p.mktVal - p.mktVal / (1 + p.dayPct / 100)), 0);

  const NAV_EOD = 28704.58, NAV_EOD_DATE = "Jun 10";   // broker EOD anchor (rev16)
  const HWM = 31625.06, HWM_DATE = "Jun 2", INTRADAY_PEAK = 32029.95, INTRADAY_PEAK_DATE = "Jun 3", INCEPTION = 27500, GOAL = 50000;

  const PORT = {
    navEod: NAV_EOD, navEodDate: NAV_EOD_DATE,
    navLive: +navLive.toFixed(2), navLiveTime: "Jun 12",
    dayDollars: +dayDollars.toFixed(2),
    dayPct: +(dayDollars / (navLive - dayDollars) * 100).toFixed(2),
    hwm: HWM, hwmDate: HWM_DATE, ddFromHwm: +((NAV_EOD / HWM - 1) * 100).toFixed(1),
    goal: GOAL, inception: INCEPTION,
    progressTo50k: +((NAV_EOD / GOAL) * 100).toFixed(1),          // off the EOD anchor (stable)
    returnInception: +((NAV_EOD / INCEPTION - 1) * 100).toFixed(1),
    realized: +realized.toFixed(2),
    unrealized: +POS.reduce((s, p) => s + p.pnl, 0).toFixed(2),
    cash, positions: POS.length, invested: +investedVal.toFixed(2),
    reconciles: Math.abs(realized - REALIZED_TOTAL) < 0.01,       // self-check flag for the recon tile
  };

  // ----- Market brief (current — Jun 11, from the live feed) -----
  const BRIEF = {
    date: "Thursday, June 11, 2026", edition: "Morning Edition",
    tape: {
      headline: "AI-semis rebound; the Jun-9 custom-silicon scare reverses",
      body: "Risk-on snapback — QQQ leads SPY as the chip complex rebounds hard off Monday's ByteDance–QCOM scare. PPI ran hot this morning and the tape shrugged it. VIX ~22, credit calm. Overhang: the Jun 16–17 FOMC dot plot.",
      stats: [
        { k: "QQQ", v: "+0.9%", d: "leads", dir: "up" },
        { k: "SPY", v: "+0.2%", d: "—", dir: "flat" },
        { k: "VIX", v: "~22", d: "-0.7%", dir: "flat" },
        { k: "Next macro", v: "FOMC", d: "Jun 16–17", dir: "flat" },
      ],
    },
    finding: {
      ticker: "AVGO", title: "Highest-conviction name still below cost post-print",
      body: "AVGO carries the book's top CS (90) and trades at $376 — below your $420.37 cost and the $410–420 dip zone after its Jun-3 print (−12.6% reaction). Half the NVDA-funded slot is still dry, held for the FOMC / QCOM (Jun 24) window.",
    },
    headlines: [
      { tag: "EARNINGS", txt: "ORCL reported Jun 10 — worst day since Jan '25 (−12%) on a $40B debt raise + FY27 capex guide, despite the beat. Isolated to ORCL.", live: true },
      { tag: "TAPE", txt: "Custom-silicon names ripping: CRDO +8%, AMAT +6%, MRVL +5% — the Jun-9 dislocation fully reversed." },
      { tag: "STRUCTURAL", txt: "MRVL joins the S&P 500 effective Jun 22 — forced index buying." },
      { tag: "PORTFOLIO", txt: "APLD (+49%) win-review still open — log, don't trim. MRVL slipped to +36% (out of win-review range)." },
    ],
    calls: [
      { action: "HOLD",  ticker: "ORCL", conf: 78, txt: "Don't chase the −12%. Record RPO means the thesis strengthened; the selloff is FCF sentiment. Hold the 5 shares.", why: "post-print · thesis intact" },
      { action: "HOLD",  ticker: "AVGO", conf: 65, txt: "Hold the dry half-slot through FOMC / QCOM. No add at $376 — a second add needs a NVDA trim.", why: "below cost & dip zone · FOMC-gated" },
      { action: "WATCH", ticker: "ANET", conf: 72, txt: "Add ~5 sh on a dip to $140–145. At $152 — above zone, don't chase.", why: "alert armed $140–145" },
    ],
    watch: [
      { k: "FOMC + dot plot", d: "Jun 16–17", note: "the regime test" },
      { k: "MRVL → S&P 500",  d: "Jun 22",    note: "forced index buying" },
      { k: "QCOM Investor Day", d: "Jun 24",  note: "custom-silicon readthrough · AVGO add gate" },
      { k: "APLD win review", d: "open",       note: "+49% · log, don't trim" },
    ],
  };

  // ----- Home action queue (current open items) -----
  const QUEUE = [
    { kind: "hold",   pri: "high", ticker: "ORCL", txt: "Post-print −12% — hold, don't chase the dip", meta: "conf 78" },
    { kind: "review", pri: "med",  ticker: "APLD", txt: "Win review open — log, don't trim", meta: "+49%" },
    { kind: "watch",  pri: "med",  ticker: "ANET", txt: "Alert armed — add ~5 sh on a dip", meta: "$140–145" },
    { kind: "add",    pri: "low",  ticker: "NOW",  txt: "Undersized vs conviction — best next dollar", meta: "$25 to PT" },
    { kind: "add",    pri: "low",  ticker: "AVGO", txt: "Half slot dry — gated on FOMC / QCOM", meta: "$376 · CS 90" },
  ];

  // ----- NAV curve: real EOD closes (rev16) + the live point -----
  const NAVPTS = [28555.66, 29496.86, 29465.69, 28704.58, +navLive.toFixed(2)]; // Jun 5,8,9,10, live
  const NAV_LABELS = ["Jun 5", "Jun 8", "Jun 9", "Jun 10", "Live"];

  // Longer daily series + rebased VOO benchmark for the range toggle (synthesized history; recent tail real).
  const NAV_SERIES = (function () {
    const r = rng(424242), n = 45, end = NAV_EOD; const out = new Array(n); out[n - 1] = end;
    for (let i = n - 2; i >= 0; i--) { const shock = (r() - 0.5) * 2 * 0.014; out[i] = Math.max(20000, out[i + 1] / (1 + 0.0035 + shock)); }
    const realTail = [28555.66, 29496.86, 29465.69, 28704.58];
    for (let k = 0; k < realTail.length; k++) out[n - realTail.length + k] = realTail[k];
    return out.map((v) => +v.toFixed(2));
  })();
  const BENCH_SERIES = (function () {   // VOO total return, indexed to inception NAV
    const r = rng(909090), n = NAV_SERIES.length; const out = new Array(n); out[0] = NAV_SERIES[0];
    for (let i = 1; i < n; i++) { const shock = (r() - 0.5) * 2 * 0.007; out[i] = out[i - 1] * (1 + 0.0018 + shock); }
    return out.map((v) => +v.toFixed(2));
  })();
  const NAV_DATES = (function () { const out = []; const d = new Date(2026, 3, 8); for (let i = 0; i < NAV_SERIES.length; i++) { const wd = d.getDay(); if (wd !== 0 && wd !== 6) out.push(new Date(d)); d.setDate(d.getDate() + 1); } while (out.length < NAV_SERIES.length) out.push(new Date(out[out.length - 1].getTime() + 86400000)); return out.slice(0, NAV_SERIES.length).map((x) => x.toLocaleDateString("en-US", { month: "short", day: "numeric" })); })();

  const SECTOR_COLORS = {
    "AI Semis": "var(--finn-sec-semis)", "Networking": "var(--finn-sec-network)",
    "AI Software": "var(--finn-sec-software)", "AI Infra": "var(--finn-sec-infra)",
    "Power": "var(--finn-sec-power)", "Foundation": "var(--finn-sec-found)",
  };

  // ----- Watchlist (current) -----
  const WATCH = [
    { t: "TSM",  n: "Taiwan Semiconductor", sec: "AI Semis", live: 244.10, cs: 89, zoneL: 210, zoneH: 225, note: "Foundry monopoly — want it on a flush", trig: "below" },
    { t: "VRT",  n: "Vertiv Holdings",      sec: "Power",    live: 138.70, cs: 81, zoneL: 110, zoneH: 122, note: "Liquid cooling + power — pairs ETN", trig: "below" },
    { t: "AMD",  n: "AMD",                  sec: "AI Semis", live: 540.20, cs: 82, zoneL: 430, zoneH: 440, note: "post-sell re-entry; monitor to Jul 3", trig: "below" },
    { t: "ALAB", n: "Astera Labs",          sec: "AI Semis", live: 118.40, cs: 70, zoneL: 95,  zoneH: 110, note: "NVDA/MRVL-adjacent connectivity", trig: "below" },
    { t: "CRWV", n: "CoreWeave",            sec: "AI Infra", live: 58.20,  cs: 64, zoneL: 70,  zoneH: 80,  note: "Neocloud — high beta, lottery sizing", trig: "below" },
    { t: "IONQ", n: "IonQ",                 sec: "AI Semis", live: 56.10,  cs: 48, zoneL: 54,  zoneH: 58,  note: "Quantum — speculative starter", trig: "below" },
  ];

  // ----- Scenario decision views (current prices; corrected post-print) -----
  const SCENARIOS = {
    AVGO: {
      t: "AVGO", n: "Broadcom", live: 376.19, cost: 420.37, sh: 9, conv: 5, cs: 90, ms: 71,
      verdict: "HOLD", verdictNote: "Reported Jun 3 (−12.6%). Below cost & dip zone, but the second half of the slot stays dry until the FOMC / QCOM (Jun 24) window. A further add needs a NVDA trim.",
      cases: [
        { kind: "bull", label: "Bull", prob: 35, target: 582, note: "Custom-silicon (XPU) ramp re-accelerates; VMware margins compound; multiple re-rates.", impact: 1854, impactPct: 54.7 },
        { kind: "base", label: "Base", prob: 50, target: 463, note: "AI networking + software carry; compute digestion caps the multiple near term.", impact: 781, impactPct: 23.1 },
        { kind: "bear", label: "Bear", prob: 15, target: 320, note: "Hyperscaler capex pause + rate shock; custom-silicon timeline slips a quarter.", impact: -505, impactPct: -14.9 },
      ],
      checklist: [
        { txt: "FOMC dot plot Jun 16–17 before adding size", done: false },
        { txt: "QCOM Investor Day Jun 24 — custom-silicon readthrough", done: false },
        { txt: "Hold half the slot dry below $380", done: true },
        { txt: "A second add is funded by a NVDA trim", done: false },
      ],
    },
    NVDA: {
      t: "NVDA", n: "NVIDIA", live: 201.11, cost: 154.66, sh: 27.727, conv: 5, cs: 88, ms: 77,
      verdict: "HOLD", verdictNote: "Core compute. Trimmed 2 sh Jun 9 to fund AVGO; hold the rest — don't add near the 20% ceiling, trim only above $382.",
      cases: [
        { kind: "bull", label: "Bull", prob: 40, target: 295, note: "Datacenter GPU stays supply-constrained; Rubin extends the lead.", impact: 2604, impactPct: 46.7 },
        { kind: "base", label: "Base", prob: 45, target: 250, note: "Growth durable but digestion caps the multiple; still the book's anchor.", impact: 1356, impactPct: 24.3 },
        { kind: "bear", label: "Bear", prob: 15, target: 165, note: "Capex pause + a credible CUDA-class rival; the complex de-rates.", impact: -1001, impactPct: -17.9 },
      ],
      checklist: [
        { txt: "Hyperscaler capex commentary stays firm", done: true },
        { txt: "Hold above the $382 trim line", done: true },
        { txt: "No add at/above the 20% single-name ceiling", done: true },
        { txt: "Rubin ramp timeline on the Aug 26 print", done: false },
      ],
    },
    MRVL: {
      t: "MRVL", n: "Marvell", live: 264.68, cost: 194.33, sh: 6, conv: 4, cs: 84, ms: 81,
      verdict: "HOLD", verdictNote: "+36% (slipped below the +40% win-review trigger). Hold into the S&P 500 add (Jun 22). The Finn PT ($340–400) sits above the street — that gap is the risk.",
      cases: [
        { kind: "bull", label: "Bull", prob: 35, target: 400, note: "Custom silicon ramps with multiple Tier-1s; connectivity compounds; street catches up.", impact: 812, impactPct: 51.1 },
        { kind: "base", label: "Base", prob: 45, target: 340, note: "DC revenue grows into the multiple; S&P inclusion adds forced buying.", impact: 452, impactPct: 28.5 },
        { kind: "bear", label: "Bear", prob: 20, target: 215, note: "A Tier-1 program slips; ASIC sentiment takes share. Back to the dip zone.", impact: -298, impactPct: -18.8 },
      ],
      checklist: [
        { txt: "S&P 500 inclusion Jun 22 — forced index buying", done: false },
        { txt: "QCOM Investor Day Jun 24 — custom-silicon readthrough", done: false },
        { txt: "Watch the street / Finn PT gap close vs. widen", done: false },
        { txt: "Next print Aug 27", done: false },
      ],
    },
    ORCL: {
      t: "ORCL", n: "Oracle", live: 177.37, cost: 192.84, sh: 5, conv: 3, cs: 76, ms: 66,
      verdict: "HOLD", verdictNote: "Reported Jun 10 — worst day since Jan '25 (−12%) on a $40B debt raise + FY27 capex guide ($90B vs ~$62B Street), despite the beat. Record RPO = thesis intact; the selloff is FCF sentiment. Don't chase.",
      cases: [
        { kind: "bull", label: "Bull", prob: 35, target: 261, note: "OCI/RPO growth proves out; the debt funds a backlog that compounds.", impact: 418, impactPct: 47.1 },
        { kind: "base", label: "Base", prob: 40, target: 215, note: "OCI grows but capex + the raise weigh on FCF; multiple stays range-bound.", impact: 188, impactPct: 21.2 },
        { kind: "bear", label: "Bear", prob: 25, target: 150, note: "RPO leans on OpenAI; an anchor-commitment cut or margin compression de-rates the levered balance sheet.", impact: -137, impactPct: -15.5 },
      ],
      checklist: [
        { txt: "OCI revenue growth on the next print", done: false },
        { txt: "RPO ($638B) trajectory + OpenAI concentration", done: false },
        { txt: "FY27 capex vs. FCF path", done: false },
        { txt: "Don't chase the post-print dip", done: true },
      ],
    },
  };

  POS.forEach((p) => { p.scenario = !!SCENARIOS[p.t]; });

  window.FINN = {
    SOURCE,
    POS, PORT, BRIEF, QUEUE, NAVPTS, NAV_LABELS, NAV_SERIES, BENCH_SERIES, NAV_DATES,
    WATCH, TRADES, EARNINGS: null, SCENARIOS, SECTOR_COLORS, SELL_TRIGGERS,
    fmtUSD:   (n, d = 0) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }),
    fmtPct:   (n, d = 1) => (n >= 0 ? "+" : "") + n.toFixed(d) + "%",
    fmtSigned:(n, d = 0) => (n >= 0 ? "+$" : "−$") + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }),
  };

  // ----- Earnings calendar (corrected to rev16: ORCL + AVGO already reported; next owned = NOW Jul 22) -----
  window.FINN.EARNINGS = [
    { t: "NOW",  n: "ServiceNow",        date: "Jul 22", when: "After close", days: 41, imminent: false, hist: "Consistent beats", held: true,  note: "cRPO growth is the number" },
    { t: "ANET", n: "Arista Networks",   date: "Aug 4",  when: "After close", days: 54, imminent: false, hist: "4/4 beats",        held: true,  note: "back-end Ethernet share" },
    { t: "NVDA", n: "NVIDIA",            date: "Aug 26", when: "After close", days: 76, imminent: false, hist: "4/4 beats",        held: true,  note: "Rubin ramp timeline" },
    { t: "MRVL", n: "Marvell",           date: "Aug 27", when: "After close", days: 77, imminent: false, hist: "Mixed reactions",  held: true,  note: "custom-silicon ramp" },
    { t: "CRDO", n: "Credo Technology",  date: "Sep 2",  when: "After close", days: 83, imminent: false, hist: "Beats",            held: true,  note: "AEC/optical share" },
    { t: "AVGO", n: "Broadcom",          date: "Sep 3",  when: "After close", days: 84, imminent: false, hist: "Beat 6 straight",  held: true,  note: "reported Jun 3 (−12.6%); XPU guide next" },
  ];
})();
