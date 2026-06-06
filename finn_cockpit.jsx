import React, { useState, useEffect, useCallback, useMemo } from "react";

/* ============================================================
   FINN COCKPIT — Phase 1 (v2)
   Visual system: FINN v3.3 (locked Jun 5 2026) — ported verbatim.
   Data: seeded from canonical FINN_STATE.json (rev1, Jun 5 2026).
   Live prices: FMP via Anthropic API + MCP (chunked + gap-fill retry).
   Price integrity is hard: nothing price-dependent renders without a
   live source. NAV stays broker-confirmed, never estimated.
   ============================================================ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
:root{
  --bg:#090B0F; --bg2:#0D1015; --panel:#12161D; --panel2:#161B23; --elev:#1C222B;
  --line:#242A34; --line2:#323945; --hair:rgba(255,255,255,0.045);
  --ink:#E8EBEF; --ink2:#9AA2AD; --ink3:#646C77;
  --acc:#8B7CF6; --acc2:#ABA0FF; --accdim:rgba(139,124,246,0.14);
  --info:#5FAEF2; --infodim:rgba(95,174,242,0.12);
  --warn:#E5A93C; --warndim:rgba(229,169,60,0.13);
  --pos:#46D17F; --posdim:rgba(70,209,127,0.12);
  --neg:#FB6F6F; --negdim:rgba(251,111,111,0.12);
  --ms:#5EE6D0; --msdim:rgba(94,230,208,0.12);
  --r-chip:6px; --r-ctrl:8px; --r-card:10px; --r-panel:14px;
  --sans:'IBM Plex Sans',-apple-system,sans-serif; --mono:'IBM Plex Mono',ui-monospace,monospace;
}
*{box-sizing:border-box}
.ck-root{font-family:var(--sans);background:var(--bg);background-image:radial-gradient(900px 500px at 82% -12%,rgba(139,124,246,0.10),transparent 60%);color:var(--ink);font-size:14px;min-height:100vh;padding:20px 18px 40px}
.ck-wrap{max-width:1060px;margin:0 auto}
.mono{font-family:var(--mono);font-variant-numeric:tabular-nums}
.pos{color:var(--pos)} .neg{color:var(--neg)} .warnc{color:var(--warn)} .infoc{color:var(--info)} .accc{color:var(--acc2)} .msc{color:var(--ms)} .ink2{color:var(--ink2)} .ink3{color:var(--ink3)}

.ck-top{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px}
.ck-mark{font-family:var(--mono);font-size:17px;font-weight:700;letter-spacing:4px;color:var(--acc2)}
.ck-bc{font-family:var(--mono);font-size:10.5px;letter-spacing:.8px;color:var(--ink3);text-transform:uppercase}
.ck-px{display:flex;align-items:center;gap:8px;margin-left:auto}
.ck-pxbadge{font-family:var(--mono);font-size:9.5px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;padding:4px 8px;border-radius:var(--r-chip);white-space:nowrap}
.b-live{background:var(--posdim);color:var(--pos)} .b-load{background:var(--accdim);color:var(--acc2)} .b-stale{background:var(--warndim);color:var(--warn)} .b-err{background:var(--negdim);color:var(--neg)} .b-idle{background:var(--panel);color:var(--ink3);border:1px solid var(--line)}

.ck-tabs{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:16px}
.fv-seg{font-family:var(--mono);font-size:11.5px;font-weight:600;padding:6px 12px;border-radius:var(--r-ctrl);background:var(--panel);border:1px solid var(--line);color:var(--ink2);cursor:pointer;transition:.15s}
.fv-seg:hover{border-color:var(--acc);color:var(--ink)}
.fv-seg.on{background:var(--accdim);border-color:var(--acc);color:var(--acc2)}

.fv-btn{font-family:var(--mono);font-size:12px;font-weight:600;border-radius:var(--r-ctrl);padding:7px 13px;cursor:pointer;border:1px solid transparent;transition:.15s}
.fv-btn--tertiary{background:var(--panel);border-color:var(--line2);color:var(--ink2)}
.fv-btn--tertiary:hover{border-color:var(--acc);color:var(--ink);background:var(--elev)}
.fv-btn[disabled]{opacity:.45;pointer-events:none}

.fv-panel{background:linear-gradient(180deg,var(--panel),var(--bg2));border:1px solid var(--line);border-radius:var(--r-panel);padding:15px;margin-bottom:14px}
.fv-ph{display:flex;align-items:baseline;gap:9px;margin-bottom:13px;padding-bottom:9px;border-bottom:1px solid var(--line)}
.fv-ph .num{font-family:var(--mono);font-size:11px;color:var(--acc2);font-weight:700}
.fv-ph .ttl{font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase}
.fv-ph .tag{font-family:var(--mono);font-size:10px;color:var(--ink3);margin-left:auto}

.fv-strip{display:grid;gap:1px;background:var(--line);border-radius:var(--r-ctrl);overflow:hidden;grid-template-columns:repeat(auto-fit,minmax(132px,1fr))}
.fv-stat{background:var(--bg2);padding:11px 13px}
.fv-stat .l{font-size:9.5px;color:var(--ink3);text-transform:uppercase;letter-spacing:.5px}
.fv-stat .v{font-family:var(--mono);font-size:17px;font-weight:600;margin-top:4px}
.fv-stat .big{font-family:var(--mono);font-size:24px;font-weight:600;margin-top:3px;line-height:1}
.fv-stat .sub{font-family:var(--mono);font-size:10px;margin-top:4px;color:var(--ink3)}
.fv-mbar{height:5px;background:var(--bg2);border:1px solid var(--line);border-radius:4px;margin-top:8px;overflow:hidden;position:relative}
.fv-mbar i{position:absolute;inset:0 auto 0 0;background:linear-gradient(90deg,rgba(139,124,246,.55),var(--acc))}

.fv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:9px}
.fv-tile{display:flex;flex-direction:column;align-items:center;gap:6px;background:var(--panel2);border:1px solid var(--line);border-radius:var(--r-card);padding:13px 10px;cursor:pointer;transition:.15s}
.fv-tile:hover{border-color:var(--acc);background:var(--accdim);transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,0,0,.35)}
.fv-tile .tic{font-size:21px}
.fv-tile .tn{font-family:var(--mono);font-size:12px;font-weight:600;color:var(--ink)}
.fv-tile .td{font-size:9.5px;color:var(--ink3)}

.fv-row{display:flex;align-items:center;gap:11px;background:var(--panel2);border:1px solid var(--line);border-radius:var(--r-ctrl);padding:10px 12px;transition:.15s;margin-bottom:8px}
.fv-row .body{flex:1;font-size:12px;color:var(--ink2);line-height:1.45}
.fv-row .body b{color:var(--ink)}
.fv-row .cta{font-family:var(--mono);font-size:11px;font-weight:600;padding:6px 11px;border-radius:var(--r-ctrl);background:var(--accdim);border:1px solid var(--acc);color:var(--acc2);white-space:nowrap;cursor:pointer}
.fv-row .cta:hover{background:rgba(139,124,246,.24)}

.fv-chip{font-family:var(--mono);font-size:11px;font-weight:600;background:var(--panel);border:1px solid var(--line);border-radius:var(--r-chip);padding:4px 8px;display:inline-block}
.fv-chip.c5{color:var(--acc2)} .fv-chip.c4{color:var(--info)} .fv-chip.c3{color:var(--warn)} .fv-chip.neu{color:var(--ink2)}
.fv-tag{font-family:var(--mono);font-size:8.5px;font-weight:700;border-radius:5px;padding:2px 6px;letter-spacing:.3px;display:inline-block}
.fv-tag.win{background:var(--warndim);color:var(--warn)} .fv-tag.dip{background:var(--posdim);color:var(--pos)}
.fv-tag.earn{background:var(--negdim);color:var(--neg)} .fv-tag.conc{background:var(--infodim);color:var(--info)}
.fv-tag.proj{background:var(--warndim);color:var(--warn)} .fv-tag.never{background:var(--accdim);color:var(--acc2)}
.fv-tag.unc{background:var(--negdim);color:var(--neg)}

.fv-co{border-radius:var(--r-card);padding:11px 13px;margin-bottom:12px;font-size:12px;line-height:1.5}
.fv-co .bh{font-family:var(--mono);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px}
.fv-co .bd{color:#cdd2d9}
.fv-co--neg{background:var(--negdim);border:1px solid rgba(251,111,111,.32);border-left:3px solid var(--neg)} .fv-co--neg .bh{color:var(--neg)}
.fv-co--warn{background:var(--warndim);border:1px solid rgba(229,169,60,.32)} .fv-co--warn .bh{color:var(--warn)}
.fv-co--pos{background:var(--posdim);border:1px solid rgba(70,209,127,.32)} .fv-co--pos .bh{color:var(--pos)}
.fv-co--info{background:var(--infodim);border:1px solid rgba(95,174,242,.32)} .fv-co--info .bh{color:var(--info)}
.fv-co--acc{background:var(--accdim);border:1px solid var(--acc)} .fv-co--acc .bh{color:var(--acc2)}

.ck-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:11px}
.ck-pc{background:linear-gradient(180deg,var(--panel),var(--bg2));border:1px solid var(--line);border-radius:var(--r-card);padding:13px 14px;cursor:pointer;transition:.15s}
.ck-pc:hover{border-color:var(--line2)}
.ck-pc-hd{display:flex;align-items:flex-start;gap:9px;margin-bottom:9px}
.ck-tk{font-family:var(--mono);font-size:16px;font-weight:700;letter-spacing:.5px}
.ck-nm{font-size:10.5px;color:var(--ink3);margin-top:1px}
.ck-pc-px{margin-left:auto;text-align:right}
.ck-pc-px .p{font-family:var(--mono);font-size:17px;font-weight:600}
.ck-pc-px .c{font-family:var(--mono);font-size:11px;font-weight:600;margin-top:1px}
.ck-pc-px .pend{font-family:var(--mono);font-size:9.5px;color:var(--ink3);text-transform:uppercase;letter-spacing:.4px}
.ck-meta{display:flex;flex-wrap:wrap;gap:5px;align-items:center;margin-bottom:10px}
.ck-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1px;background:var(--line);border-radius:var(--r-ctrl);overflow:hidden;margin-bottom:10px}
.ck-3 div{background:var(--bg2);padding:7px 9px}
.ck-3 .l{font-size:9px;color:var(--ink3);text-transform:uppercase;letter-spacing:.4px}
.ck-3 .v{font-family:var(--mono);font-size:13px;font-weight:600;margin-top:2px}
.ck-bar{position:relative;height:8px;background:var(--bg2);border:1px solid var(--line);border-radius:5px;margin:13px 0 6px;overflow:visible}
.ck-band{position:absolute;top:0;bottom:0;background:var(--posdim)}
.ck-fill{position:absolute;top:0;bottom:0;left:0;background:linear-gradient(90deg,rgba(139,124,246,.35),rgba(139,124,246,.6));border-radius:5px}
.ck-tick{position:absolute;top:-3px;width:2px;height:14px;border-radius:1px}
.ck-dot{position:absolute;top:50%;width:10px;height:10px;border-radius:50%;transform:translate(-50%,-50%);border:2px solid var(--bg)}
.ck-leg{font-family:var(--mono);font-size:10px;color:var(--ink3);line-height:1.6}
.ck-leg b{color:var(--ink2);font-weight:600}
.ck-csms{display:flex;gap:14px;margin:9px 0}
.ck-sc{flex:1}
.ck-sc .l{font-size:9px;color:var(--ink3);text-transform:uppercase;letter-spacing:.4px;display:flex;justify-content:space-between}
.ck-sc .l span{font-family:var(--mono);font-weight:600}
.ck-scbar{height:4px;background:var(--bg2);border-radius:3px;margin-top:4px;overflow:hidden}
.ck-scbar i{display:block;height:100%}
.ck-note{font-size:11.5px;color:var(--ink2);line-height:1.5;margin-top:9px;padding-top:9px;border-top:1px solid var(--line)}

.ck-tbl{width:100%;border-collapse:collapse;font-size:12px}
.ck-tbl th{font-size:9px;color:var(--ink3);text-transform:uppercase;letter-spacing:.5px;text-align:right;padding:7px 9px;border-bottom:1px solid var(--line);font-weight:600}
.ck-tbl th:first-child,.ck-tbl td:first-child{text-align:left}
.ck-tbl td{padding:8px 9px;border-bottom:1px solid var(--hair);font-family:var(--mono);text-align:right}
.ck-tbl tr:hover td{background:var(--panel2)}
.ck-tbl .tkc{font-weight:700;letter-spacing:.4px}

.ck-tier{margin-bottom:14px}
.ck-tier-h{display:flex;align-items:center;gap:8px;margin-bottom:9px}
.ck-tier-dot{width:8px;height:8px;border-radius:2px}
.ck-tier-h .t{font-family:var(--mono);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.8px}
.ck-tier-h .c{font-family:var(--mono);font-size:10px;color:var(--ink3);margin-left:auto}
.ck-wcards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:8px}
.ck-wc{background:var(--panel2);border:1px solid var(--line);border-radius:var(--r-ctrl);padding:9px 11px}
.ck-wc .wt{font-family:var(--mono);font-size:12.5px;font-weight:700;letter-spacing:.4px}
.ck-wc .wn{font-size:10px;color:var(--ink3);margin-top:1px}
.ck-wc .we{font-family:var(--mono);font-size:10.5px;color:var(--ink2);margin-top:5px}

.ck-scen{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin-bottom:12px}
.ck-scard{border:1px solid var(--line);border-radius:var(--r-card);padding:12px;background:var(--bg2)}
.ck-scard .sh{font-family:var(--mono);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.ck-scard .prob{font-family:var(--mono);font-size:10px;padding:2px 7px;border-radius:5px}
.ck-scard .sl{font-family:var(--mono);font-size:13px;font-weight:600;margin:6px 0}
.ck-scard .sb{font-size:11.5px;color:var(--ink2);line-height:1.5}
.ck-check{list-style:none;padding:0;margin:0}
.ck-check li{display:flex;gap:9px;align-items:flex-start;padding:7px 0;border-bottom:1px solid var(--hair);font-size:12px;color:var(--ink2)}
.ck-check li .mk{color:var(--acc2);font-family:var(--mono);font-weight:700}

.ck-foot{font-family:var(--mono);font-size:10px;color:var(--ink3);text-align:center;margin-top:18px;line-height:1.6}
.ck-secnote{font-size:11.5px;color:var(--ink2);line-height:1.55;margin-bottom:12px}
`;

/* ----------------------- SEED (from FINN_STATE.json rev1) ----------------------- */
const ANCHORS = {
  nav: 28555.66, navDate: "Jun 5", navType: "broker EOD close",
  navMove: -6.8, realized: 2410.60, hwm: 32029.95, hwmDate: "Jun 3",
  ddPct: -10.8, prog: 57.1, inception: 3.8,
  positions: 12, scoresDue: "Jun 8", lastTrade: "Jun 3", capital: "~$0 — fully deployed",
};

const POS = [
  {t:"VOO",n:"Vanguard S&P 500 ETF",sh:4,cost:635.56,conv:5,sec:"Foundation",cs:84,ms:79,ptl:null,pth:null,dzl:650,dzh:650,trim:null,sell:"NEVER SELL",never:true,note:"Core foundation. Dollar anchor. Never sell."},
  {t:"NVDA",n:"NVIDIA Corp",sh:29.727,cost:154.17,conv:5,sec:"AI Semis",cs:88,ms:82,ptl:295,pth:295,dzl:200,dzh:210,trim:382,sell:"hyperscaler capex cuts",conc:true,note:"Anchor. ~21% of NAV — over the 20% ceiling, don't add. Macro scenario: trim to 18-20% pre-FOMC to cut tail risk + free capital."},
  {t:"AVGO",n:"Broadcom",sh:8,cost:424.53,conv:5,sec:"AI Semis",cs:91,ms:85,ptl:463,pth:582,dzl:410,dzh:420,trim:602,sell:"ASIC pulled in-house",note:"Highest CS in book. Below cost AND below dip zone — strongest add if capital frees. Unchanged FY AI outlook on Jun 3 print sparked the selloff."},
  {t:"ANET",n:"Arista Networks",sh:17,cost:145.01,conv:5,sec:"AI Networking",cs:87,ms:80,ptl:187,pth:187,dzl:140,dzh:145,trim:235,sell:null,note:"AI back-end networking leader. Below PT — hold, no add."},
  {t:"AMAT",n:"Applied Materials",sh:6,cost:431.90,conv:4,sec:"AI Semis",cs:87,ms:83,ptl:500,pth:575,dzl:420,dzh:425,trim:590,sell:"WFE cycle down",note:"Record Q2 beat. WFE leverage. Add zone $420-425 below."},
  {t:"ETN",n:"Eaton Corp",sh:5,cost:395.19,conv:4,sec:"Power / Energy",cs:83,ms:76,ptl:464,pth:464,dzl:395,dzh:415,trim:586,sell:null,proj:true,ptNote:"curated $464 above street consensus $409",note:"DC orders +240%. In dip zone $395-415 — add candidate, near cost."},
  {t:"APH",n:"Amphenol",sh:12,cost:133.11,conv:4,sec:"AI Networking",cs:88,ms:86,ptl:145,pth:182,dzl:130,dzh:135,trim:237,sell:null,note:"Connector compounder. +58% rev (CommScope). Dip zone below."},
  {t:"APLD",n:"Applied Digital",sh:35,cost:26.49,conv:4,sec:"AI Infra",cs:63,ms:77,ptl:58,pth:97,dzl:40,dzh:43,trim:75,sell:"lease cancellation",win:"+46.5%",note:"$31B contracted thesis. Win review OPEN. Trim watch >$75. Add $40-43."},
  {t:"MRVL",n:"Marvell Technology",sh:6,cost:194.33,conv:4,sec:"AI Semis",cs:84,ms:90,ptl:340,pth:400,dzl:205,dzh:215,trim:390,sell:null,win:"+45.9%",proj:true,ptNote:"PT base $340 FINN projection / bull $400; street $231 lagging",note:"Best MS in book (90). Win review due (>+40%). Hold."},
  {t:"NOW",n:"ServiceNow",sh:12,cost:101.68,conv:4,sec:"AI Software",cs:83,ms:76,ptl:143,pth:236,dzl:115,dzh:120,trim:186,sell:"ARR growth <20%",best:true,note:"Agentic-AI compounder. Undersized vs conviction — best next dollar. Dip $115-120."},
  {t:"CRDO",n:"Credo Technology",sh:11,cost:215.95,conv:4,sec:"AI Semis",cs:83,ms:85,ptl:240,pth:300,dzl:190,dzh:215,trim:null,sell:"AEC/optical share loss",note:"Conviction 4 confirmed Jun 3. SerDes/AEC/optical. PT $240-300 sourced."},
  {t:"ORCL",n:"Oracle",sh:5,cost:192.84,conv:3,sec:"AI Software",cs:76,ms:70,ptl:261,pth:261,dzl:185,dzh:190,trim:339,sell:null,earn:"Jun 10",note:"OCI/AI-cloud re-rate. Earnings Jun 10 after close (5d) — HOLD into print; now an AI-demand referendum too."},
];
const TICKERS = POS.map(p=>p.t);

const THESIS = {
  VOO:{th:"Core S&P 500 foundation — dollar anchor, not a thesis trade.",km:"n/a",bi:"Never sell",lc:"n/a"},
  NVDA:{th:"Dominant AI compute platform; CUDA moat + supply-constrained datacenter GPU demand.",km:"Datacenter rev growth + hyperscaler capex",bi:"Hyperscaler capex cuts or credible CUDA-class competition at scale",lc:"May 2026"},
  AVGO:{th:"Custom AI silicon (ASIC) + networking; multi-hyperscaler design wins compounding.",km:"AI semi rev YoY + AI order book",bi:"Hyperscaler pulls ASIC in-house / order book stalls",lc:"Jun 3 2026"},
  ANET:{th:"AI back-end Ethernet networking leader; share gains as clusters scale.",km:"Cloud/AI revenue mix + gross margin",bi:"Loses major hyperscaler to Infiniband/whitebox at scale",lc:"May 2026"},
  AMAT:{th:"WFE leverage to the entire AI buildout; picks-and-shovels to every fab.",km:"WFE bookings + China exposure",bi:"WFE capex cycle rolls over",lc:"May 2026"},
  ETN:{th:"Electrification + datacenter power; grid/DC capex supercycle beneficiary.",km:"DC/electrical orders + backlog (orders +240%)",bi:"DC power orders decelerate sharply",lc:"May 2026"},
  APH:{th:"Connector/interconnect compounder riding AI DC content growth + M&A (CommScope).",km:"Organic rev growth + IT-datacom",bi:"DC content growth stalls / integration missteps",lc:"May 2026"},
  APLD:{th:"AI datacenter/neocloud infra; $31B contracted backlog re-rated the story.",km:"Contracted backlog + lease execution",bi:"Lease cancellation / financing falls through",lc:"May 2026"},
  MRVL:{th:"Custom silicon + optical/copper AI connectivity; multiple Tier-1 hyperscaler engagements ramping.",km:"Custom silicon / DC revenue ramp",bi:"Tier-1 custom program slips or canceled",lc:"May 2026"},
  NOW:{th:"Agentic-AI enterprise software compounder; workflow platform with pricing power.",km:"Subscription ARR growth (>20%) + cRPO",bi:"ARR growth <20%",lc:"Apr 2026"},
  CRDO:{th:"AI connectivity — AEC, SerDes, optical DSP; copper-to-optical transition tailwind.",km:"Optical rev ramp (FY27 >$600M) + customer diversification",bi:"AEC/optical share loss to MRVL/AVGO; concentration shock",lc:"Jun 1 2026"},
  ORCL:{th:"OCI/AI-cloud re-rate; RPO backlog + multicloud database growth.",km:"RPO ($553B) + OCI revenue growth",bi:"RPO growth stalls / AI capacity margin compresses",lc:"Mar 2026"},
};

const NAVH = [
  {d:"5/29",v:29814.90,type:"peak"},
  {d:"6/1",v:30793.89,type:"peak"},
  {d:"6/2",v:31813.49,type:"peak"},
  {d:"6/3",v:32029.95,type:"peak",hwm:true},
  {d:"6/4",v:30636.78,type:"current"},
  {d:"6/5",v:28555.66,type:"eod"},
];

const TRADES = [
  {d:"05/12",t:"APLD",a:"trim",sh:10,px:43.54,pnl:217.46},
  {d:"05/15",t:"HOOD",a:"exit",sh:8.18,px:78.05,pnl:289.36},
  {d:"05/18",t:"APLD",a:"trim",sh:20,px:41.50,pnl:383.81},
  {d:"05/18",t:"NVDA",a:"trim",sh:6,px:226.15,pnl:489.93},
  {d:"05/18",t:"MU",a:"exit",sh:2,px:724.80,pnl:176.50},
  {d:"05/21",t:"APLD",a:"trim",sh:5,px:46.53,pnl:117.65},
  {d:"05/26",t:"NVDA",a:"trim",sh:2,px:212.76,pnl:129.73},
  {d:"06/01",t:"NU",a:"exit",sh:5,px:12.98,pnl:-0.95},
  {d:"06/01",t:"CEG",a:"exit",sh:4,px:269.49,pnl:-36.84},
  {d:"06/02",t:"MRVL",a:"trim",sh:2,px:279.61,pnl:196.19},
  {d:"06/02",t:"ETN",a:"trim",sh:1,px:412.77,pnl:13.77},
  {d:"06/03",t:"AMD",a:"exit",sh:3,px:526.41,pnl:268.28},
  {d:"06/03",t:"DRAM",a:"exit",sh:7,px:68.71,pnl:104.87},
  {d:"06/03",t:"NVDA",a:"trim",sh:1,px:215.01,pnl:60.84},
];
const REALIZED_BD = [["pre-May 29",1804.44],["Jun 1",-37.79],["Jun 2",209.96],["Jun 3",433.99]];

const NAMED_TIERS = [
  {tier:"Foundation",color:"var(--ink2)",names:[{t:"VOO",n:"S&P 500 ETF",e:"owned"},{t:"SPY",n:"S&P 500 ETF",e:"radar"}]},
  {tier:"High Conviction",color:"var(--acc)",names:[{t:"NVDA",e:"owned C5"},{t:"AVGO",e:"owned C5"},{t:"ANET",e:"owned C5"},{t:"AMAT",e:"owned C4"},{t:"MRVL",e:"owned C4"},{t:"APH",e:"owned C4"},{t:"CRDO",e:"owned C4"}]},
  {tier:"Growth",color:"var(--info)",names:[{t:"NOW",e:"owned C4"},{t:"ORCL",e:"owned C3"},{t:"MSFT",e:"radar · CS88/MS74"}]},
  {tier:"Infra",color:"var(--ms)",names:[{t:"APLD",e:"owned C4"},{t:"KEEL",e:"deal-alert"}]},
  {tier:"Energy",color:"var(--warn)",names:[{t:"ETN",e:"owned C4"},{t:"CEG",e:"re-entry $260-270"},{t:"EQT",e:"gameplan $55-58"}]},
  {tier:"Materials",color:"var(--pos)",names:[{t:"MP",e:"gameplan $60-63"},{t:"LYSDY",e:"radar"}]},
  {tier:"Space / Defense",color:"var(--acc2)",names:[{t:"RKLB",e:"$130-138 dip"},{t:"ASTS",e:"$115-120 start"},{t:"LUNR",e:"$32-35"},{t:"VOYG",e:"$38-40"},{t:"RDW",e:"$12-14"},{t:"SATL",e:"radar"}]},
];
const RADAR_T1 = [{t:"AMBA",e:"CS68/MS65 · zone TBD off earnings"},{t:"PLTR",e:"CS66/MS78 · needs pullback"}];
const RADAR_T2 = ["IONQ $54-58","IREN $50-55","CRWV $70-80","ALAB","CLS","DELL","CLSK $14-16","CORZ","FN","LRCX","COHR","RBRK","INFQ <$14"];
const POST_SELL = [
  {t:"NBIS",exp:"Jun 20",note:"window expiring — decide <=2 sessions"},
  {t:"GOOGL",exp:"Jun 20",note:"window expiring"},
  {t:"AMD",exp:"Jul 3",note:"re-entry $430-440 · CS82/MS88"},
  {t:"DRAM",exp:"Jul 3",note:"re-entry $55-57 · 18-20sh"},
  {t:"CEG",exp:"Jul 1",note:"re-entry $260-270"},
  {t:"NU",exp:"Jul 1",note:"re-entry $11.50-12.50"},
];
const GAMEPLAN = [
  {t:"NOW",note:"undersized — best next dollar (~$25 to PT $143)"},
  {t:"AMAT",note:"add zone $420-425"},
  {t:"AVGO",note:"strongest add if capital frees (below cost + dip zone)"},
  {t:"ETN",note:"in dip zone $395-415, near cost"},
  {t:"APLD",note:"add $40-43, dip only"},
];

const MACRO = [
  ["Fed funds","3.50-3.75%"],["Stance","3 holds · higher-for-longer"],["Next FOMC","Jun 16-17 + dots"],
  ["CPI","3.8% (Apr, hot)"],["Core PCE","3.3%"],["May jobs","+172k (hot)"],["10Y","4.54%"],["Jun cut odds","~28-36%"],
];

const REVIEWS = [
  {id:1,d:"Jun 3",t:"AMD",type:"EXIT",out:"WIN",pnl:268.28,lesson:"Trimming the weakest-conviction name in a crowded sub-sector (semis) is a clean source of funds — not a thesis reversal. Re-entry $430-440, monitor to Jul 3."},
  {id:2,d:"Jun 3",t:"DRAM",type:"EXIT",out:"WIN",pnl:104.87,lesson:"Small thematic sleeves fine to harvest + re-buy lower — HBM thesis intact, entry resets ($55-57)."},
  {id:3,d:"Jun 2",t:"MRVL",type:"TRIM",out:"WIN",pnl:196.19,lesson:"Trim into euphoric spikes (Jensen call) while retaining the core."},
  {id:4,d:"open",t:"APLD",type:"WIN REVIEW",out:"OPEN",lesson:"+67.8% on $31B contracted-revenue re-rate; multiple pre-May29 trims (+$718.92 across 35sh).",qs:["What signal preceded the re-rate?","Was sizing right at conviction 4 / CS62?","Trim discipline — too early or right?"]},
];
const REVIEW_PATTERNS = ["Trim-into-strength works repeatedly (NVDA/MRVL/APLD) — formalize a trim ladder above PT.","Lower-conviction names recycled for capital — conviction-based sizing working."];

const EARN_IMMINENT = {t:"ORCL",date:"Jun 10",when:"after close",days:5,fiscal:"Q4 FY2026",eps:1.96,rev:"~$19.1B",status:"CONFIRMED (FMP + IR)",last4:[["Mar 10","beat","1.79 vs 1.70"],["Dec 10","big beat","2.26 vs 1.64"],["Sep 9","slight miss","1.47 vs 1.48"],["Jun 11","beat","1.70 vs 1.64"]]};
const EARN_OWNED = [
  {t:"NOW",date:"Jul 22",streak:"3 beats / 1 inline"},
  {t:"APH",date:"Jul 29",streak:"4/4 beats"},
  {t:"APLD",date:"Jul 29",streak:"pre-profit",note:"watch rev + backlog"},
  {t:"ANET",date:"Aug 4",streak:"4/4 beats"},
  {t:"ETN",date:"Aug 4",streak:"4/4 beats"},
  {t:"AMAT",date:"Aug 13",streak:"4/4 beats"},
  {t:"NVDA",date:"Aug 26",streak:"4/4 beats"},
  {t:"MRVL",date:"Aug 27",streak:"3 beats / 1 inline"},
  {t:"CRDO",date:"Sep 2",streak:"4/4 beats"},
  {t:"AVGO",date:"Sep 3",streak:"4/4 beats",note:"reported Jun 3 (beat, -12.6%)"},
];
const EARN_GAP = "After ORCL (Jun 10), no owned earnings until NOW (Jul 22) — ~6wk quiet. Then the Q2 cluster runs Jul 22 -> Sep 3.";

const ACTIONS = [
  {tag:["earn","EARN"],body:<><b>ORCL reports Jun 10, after close (5d).</b> Hold into the print — now an AI-demand referendum post-selloff. Scenario auto-fired.</>,go:"scenario",cta:"scenario"},
  {tag:["win","WIN x2"],body:<><b>MRVL +45.9% & APLD +46.5%</b> — both over the +40% win-review trigger. Log the reviews; do not trim on the trigger alone.</>,go:"reviews",cta:"reviews"},
  {tag:["conc","CONC"],body:<><b>NVDA ~21% of NAV</b> — over the 20% ceiling. Macro scenario: trim to 18-20% pre-FOMC to cut tail risk + free capital for AVGO.</>,go:"positions",cta:"positions"},
  {tag:["dip","DIP"],body:<><b>AVGO below cost ($424.53) AND below dip zone ($410-420)</b> — strongest add in the book if capital frees. PT $463-582. Capital ~$0.</>,go:"positions",cta:"positions"},
  {tag:["neg","ALERT"],body:<><b>NAV -10.8% off the Jun 3 HWM</b> after the Jun 5 AI/semis selloff (10Y 4.54%, hot jobs). No trades today.</>,go:"trades",cta:"NAV"},
  {tag:["proj","RESCORE"],body:<>Weekly rescore due <b>Jun 8</b>. Scores currently dated Jun 1 (CRDO Jun 3).</>,go:"ledger",cta:"ledger"},
];

const SCEN = {
  bull:{p:"~30%",lvl:"Beat + raise",b:"OCI re-acceleration, RPO step-up, capacity margin holds. Re-rate toward PT $261; AI-demand fear unwinds book-wide.",cl:"pos"},
  base:{p:"~45%",lvl:"In-line / modest beat",b:"3 of last 4 quarters beat (Dec was a big beat). Guidance the swing factor; muted reaction, hold thesis.",cl:"warn"},
  bear:{p:"~25%",lvl:"Soft guide / margin slip",b:"AI-capacity capex pressures margins; ARR/RPO decel. Drawdown risk on 5sh; reassess conviction 3 sizing.",cl:"neg"},
};

/* ----------------------- formatters ----------------------- */
const r2 = (n)=> (n==null||isNaN(n)) ? null : Math.round(n*100)/100;
const usd = (n)=> (n==null||isNaN(n)) ? "—" : "$"+Number(n).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const px = (n)=> (n==null||isNaN(n)) ? "—" : Number(n).toFixed(2);
const pct = (n,sign=true)=> (n==null||isNaN(n)) ? "—" : (sign&&n>0?"+":"")+Number(n).toFixed(1)+"%";
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const convClass=(c)=>c===5?"c5":c===4?"c4":"c3";
const convColor=(c)=>c===5?"var(--acc2)":c===4?"var(--info)":"var(--warn)";
const moveColor=(n)=> n==null?"ink3":n>0?"pos":n<0?"neg":"ink2";

/* ----------------------- live FMP via Anthropic API + MCP ----------------------- */
function parseLoose(text){
  if(!text) return null;
  let s = String(text).replace(/```json/gi,"").replace(/```/g,"").trim();
  const a=s.indexOf("{"), b=s.lastIndexOf("}");
  if(a<0||b<0) return null;
  try{ return JSON.parse(s.slice(a,b+1)); }catch(e){ return null; }
}
function tryJSON(text){
  if(!text) return null;
  let s=String(text).replace(/```json/gi,"").replace(/```/g,"").trim();
  try{ return JSON.parse(s); }catch(e){}
  const oa=s.indexOf("["), ob=s.lastIndexOf("]");
  if(oa>=0&&ob>=0){ try{ return JSON.parse(s.slice(oa,ob+1)); }catch(e){} }
  return parseLoose(s);
}
function absorbMap(obj,out){
  if(!obj||typeof obj!=="object") return;
  Object.keys(obj).forEach(k=>{
    const v=obj[k]; if(v==null) return;
    const p=r2(typeof v==="object"?(v.p??v.price??v.c1??v.close):v);
    const c=r2(typeof v==="object"?(v.c??v.change??v.changePct??v.changesPercentage??v.changePercent):null);
    if(p!=null) out[k.toUpperCase()]={p,c};
  });
}
function scanQuotes(j,out){
  if(!j) return;
  const arr = Array.isArray(j)?j:[j];
  arr.forEach(it=>{
    if(!it||typeof it!=="object") return;
    const sym=(it.symbol||it.ticker||it.s||"").toString().toUpperCase();
    const p=r2(it.price??it.p??it.close??it.lastPrice);
    const c=r2(it.changesPercentage??it.changePercent??it.changePct??it.c??it.change);
    if(sym&&p!=null&&TICKERS.indexOf(sym)>=0) out[sym]={p,c};
  });
}
async function fetchChunk(tks){
  const prompt = `Use the FMP quote tool to look up the latest market quote for each of these tickers: ${tks.join(", ")}. Return ONLY a minified JSON object and nothing else — no prose, no code fences — mapping each UPPERCASE ticker to {"p":<current price number>,"c":<day change percent number>}. Example: {"NVDA":{"p":123.45,"c":-1.2}}`;
  const res = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      model:"claude-sonnet-4-20250514", max_tokens:1000,
      messages:[{role:"user",content:prompt}],
      mcp_servers:[{type:"url",url:"https://financialmodelingprep.com/mcp",name:"FMP"}],
    }),
  });
  if(!res.ok) throw new Error("http "+res.status);
  const data = await res.json();
  const out={};
  const blocks = data.content||[];
  const text = blocks.filter(b=>b&&b.type==="text").map(b=>b.text).join("\n");
  absorbMap(parseLoose(text),out);
  if(Object.keys(out).length < tks.length){
    blocks.filter(b=>b&&(b.type==="mcp_tool_result"||b.type==="tool_result")).forEach(b=>{
      let txt=""; const c=b.content;
      if(Array.isArray(c)) txt=c.map(x=>x&&x.text?x.text:"").join("\n");
      else if(typeof c==="string") txt=c;
      else if(c&&c.text) txt=c.text;
      scanQuotes(tryJSON(txt),out);
    });
  }
  if(Object.keys(out).length===0) throw new Error("empty");
  return out;
}
function chunk(arr,n){const o=[];for(let i=0;i<arr.length;i+=n)o.push(arr.slice(i,i+n));return o;}

/* ----------------------- shared ----------------------- */
function tagsFor(p,price){
  const inDip = price!=null && p.dzl!=null && price>=p.dzl && price<=p.dzh;
  const t=[];
  if(p.never) t.push(["never","NEVER SELL"]);
  if(p.earn) t.push(["earn","EARN "+p.earn]);
  if(p.win) t.push(["win","WIN "+p.win]);
  if(p.conc) t.push(["conc","CONC ~21%"]);
  if(p.proj) t.push(["proj","FINN PROJ"]);
  if(inDip) t.push(["dip","IN DIP ZONE"]);
  if(price==null) t.push(["unc","price pending"]);
  return t;
}
function PriceBar({p,price}){
  if(p.never||p.ptl==null) return null;
  const gain = price!=null ? (price-p.cost)/p.cost*100 : null;
  const hiRef = Math.max(p.pth||p.ptl||p.cost, p.trim||0, p.cost);
  const loRef = Math.min(p.dzl||p.cost, p.cost, price||p.cost);
  const lo = loRef*0.96, hi = (hiRef||p.cost*1.3)*1.04, span = hi-lo || 1;
  const pos = (v)=> v==null?null:clamp((v-lo)/span*100,0,100);
  return (<>
    <div className="ck-bar">
      {p.dzl!=null && p.dzh!=null && <div className="ck-band" style={{left:pos(p.dzl)+"%",width:(pos(p.dzh)-pos(p.dzl))+"%"}}/>}
      {price!=null && <div className="ck-fill" style={{width:pos(price)+"%"}}/>}
      <div className="ck-tick" style={{left:pos(p.cost)+"%",background:"var(--ink2)"}}/>
      <div className="ck-tick" style={{left:pos(p.ptl)+"%",background:"var(--acc)"}}/>
      {p.pth&&p.pth!==p.ptl && <div className="ck-tick" style={{left:pos(p.pth)+"%",background:"var(--acc2)"}}/>}
      {p.trim && <div className="ck-tick" style={{left:pos(p.trim)+"%",background:"var(--warn)"}}/>}
      {price!=null && <div className="ck-dot" style={{left:pos(price)+"%",background:gain>=0?"var(--pos)":"var(--neg)"}}/>}
    </div>
    <div className="ck-leg"><b>cost</b> {px(p.cost)} · <b style={{color:"var(--pos)"}}>dip</b> {p.dzl}-{p.dzh} · <b style={{color:"var(--acc2)"}}>PT</b> {p.ptl}{p.pth&&p.pth!==p.ptl?"-"+p.pth:""}{p.trim?<> · <b style={{color:"var(--warn)"}}>trim</b> {p.trim}</>:""} · <b>now</b> {px(price)}</div>
  </>);
}
function Stat({label,value,big,sub,cls}){
  return (<div className="fv-stat">
    <div className="l">{label}</div>
    <div className={(big?"big ":"v ")+(cls||"")}>{value}</div>
    {sub!=null && <div className="sub">{sub}</div>}
  </div>);
}
function PriceBadge({status,when,count}){
  const map={loading:["b-load","fetching live…"],ok:["b-live","live · FMP"],partial:["b-stale","partial · "+count+"/12"],stale:["b-stale","stored · stale"],error:["b-err","live unavailable"],idle:["b-idle","no live price"]};
  const [cls,txt]=map[status]||map.idle;
  const showWhen = when && (status==="ok"||status==="stale"||status==="partial");
  return <span className={"ck-pxbadge "+cls}>{txt}{showWhen?" · "+when:""}</span>;
}

/* ----------------------- position card + detail ----------------------- */
function PositionCard({p,quote,onSelect}){
  const price = quote? quote.p : null;
  const dchg = quote? quote.c : null;
  const mv = price!=null ? price*p.sh : null;
  const gain = price!=null ? (price-p.cost)/p.cost*100 : null;
  return (<div className="ck-pc" onClick={()=>onSelect&&onSelect(p.t)}>
    <div className="ck-pc-hd">
      <div>
        <div className="ck-tk" style={{color:convColor(p.conv)}}>{p.t}</div>
        <div className="ck-nm">{p.n}</div>
      </div>
      <div className="ck-pc-px">
        {price!=null ? (<>
          <div className={"p "+moveColor(dchg)}>{px(price)}</div>
          <div className={"c "+moveColor(dchg)}>{pct(dchg)}</div>
        </>) : (<div className="pend">live pending</div>)}
      </div>
    </div>
    <div className="ck-meta">
      <span className={"fv-chip "+convClass(p.conv)}>C{p.conv}</span>
      <span className="fv-chip neu" style={{fontWeight:400}}>{p.sec}</span>
      {tagsFor(p,price).map((t,i)=><span key={i} className={"fv-tag "+t[0]}>{t[1]}</span>)}
    </div>
    <div className="ck-3">
      <div><div className="l">Cost</div><div className="v">{px(p.cost)}</div></div>
      <div><div className="l">Mkt value</div><div className="v">{mv!=null?usd(mv):"—"}</div></div>
      <div><div className="l">Gain</div><div className={"v "+moveColor(gain)}>{pct(gain)}</div></div>
    </div>
    <PriceBar p={p} price={price}/>
    <div className="ck-csms">
      <div className="ck-sc"><div className="l">CS <span className="accc">{p.cs}</span></div><div className="ck-scbar"><i style={{width:p.cs+"%",background:"var(--acc)"}}/></div></div>
      <div className="ck-sc"><div className="l">MS <span className="msc">{p.ms}</span></div><div className="ck-scbar"><i style={{width:p.ms+"%",background:"var(--ms)"}}/></div></div>
    </div>
    <div className="ck-note">{p.note}</div>
  </div>);
}
function PositionDetail({p,quote,back}){
  const price = quote? quote.p : null;
  const dchg = quote? quote.c : null;
  const mv = price!=null ? price*p.sh : null;
  const gain = price!=null ? (price-p.cost)/p.cost*100 : null;
  const navPct = mv!=null ? mv/ANCHORS.nav*100 : null;
  const th = THESIS[p.t]||{};
  return (<div className="fv-panel">
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:13,flexWrap:"wrap"}}>
      <button className="fv-btn fv-btn--tertiary" onClick={back}>← back</button>
      <span className="ck-tk" style={{fontSize:22,color:convColor(p.conv)}}>{p.t}</span>
      <span className="ck-nm" style={{fontSize:12}}>{p.n}</span>
      <div style={{marginLeft:"auto",textAlign:"right"}}>
        {price!=null ? (<><div className={"mono "+moveColor(dchg)} style={{fontSize:22,fontWeight:600}}>{px(price)}</div><div className={"mono "+moveColor(dchg)} style={{fontSize:12}}>{pct(dchg)} today</div></>) : <div className="ck-pc-px"><span className="pend">live price pending</span></div>}
      </div>
    </div>
    <div className="ck-meta">{tagsFor(p,price).map((t,i)=><span key={i} className={"fv-tag "+t[0]}>{t[1]}</span>)}</div>
    <PriceBar p={p} price={price}/>
    <div className="fv-strip" style={{marginTop:13}}>
      <Stat label="Shares" value={p.sh}/>
      <Stat label="Cost basis" value={px(p.cost)}/>
      <Stat label="Mkt value" value={mv!=null?usd(mv):"—"}/>
      <Stat label="Gain" value={pct(gain)} cls={moveColor(gain)}/>
      <Stat label="% of NAV" value={navPct!=null?navPct.toFixed(1)+"%":"—"} cls={p.conc?"infoc":""}/>
      <Stat label="Conviction" value={"C"+p.conv}/>
      <Stat label="CS" value={p.cs} cls="accc"/>
      <Stat label="MS" value={p.ms} cls="msc"/>
    </div>
    <div className="fv-co fv-co--info" style={{marginTop:13,marginBottom:10}}>
      <div className="bh">thesis</div>
      <div className="bd">{th.th||p.note}</div>
    </div>
    <div className="ck-3">
      <div><div className="l">Key metric</div><div className="v" style={{fontSize:11,fontFamily:"var(--sans)",fontWeight:500,lineHeight:1.4}}>{th.km||"—"}</div></div>
      <div><div className="l">Breaks if</div><div className="v" style={{fontSize:11,fontFamily:"var(--sans)",fontWeight:500,lineHeight:1.4}}>{th.bi||"—"}</div></div>
      <div><div className="l">Confirmed</div><div className="v" style={{fontSize:11}}>{th.lc||"—"}</div></div>
    </div>
    {p.ptNote && <div className="ck-leg" style={{marginTop:4}}>PT note: {p.ptNote}</div>}
    <div className="ck-note">{p.note}{p.sell?<><br/><span className="ink3" style={{fontSize:10.5}}>sell trigger: {p.sell}</span></>:""}</div>
  </div>);
}

/* ----------------------- nav curve ----------------------- */
function NavCurve(){
  const W=620,H=170,PADX=14,PADT=26,PADB=22;
  const vals=NAVH.map(d=>d.v), max=Math.max(...vals), min=Math.min(...vals);
  const sp=(max-min)||1;
  const X=(i)=>PADX+(i/(NAVH.length-1))*(W-2*PADX);
  const Y=(v)=>PADT+(1-(v-min)/sp)*(H-PADT-PADB);
  const pts=NAVH.map((d,i)=>[X(i),Y(d.v)]);
  const line=pts.map((p,i)=>(i?"L":"M")+p[0].toFixed(1)+" "+p[1].toFixed(1)).join(" ");
  const area=line+" L "+X(NAVH.length-1).toFixed(1)+" "+(H-PADB).toFixed(1)+" L "+PADX.toFixed(1)+" "+(H-PADB).toFixed(1)+" Z";
  const midX=(X(4)+X(5))/2;
  return (<svg viewBox={"0 0 "+W+" "+H} width="100%" style={{display:"block"}}>
    <defs><linearGradient id="navg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(139,124,246,0.28)"/><stop offset="100%" stopColor="rgba(139,124,246,0)"/></linearGradient></defs>
    <path d={area} fill="url(#navg)"/>
    <path d={line} fill="none" stroke="#8B7CF6" strokeWidth="2" strokeLinejoin="round"/>
    <line x1={midX} y1={PADT-6} x2={midX} y2={H-PADB} stroke="#323945" strokeWidth="1" strokeDasharray="3 3"/>
    <text x={midX+4} y={PADT-10} fill="#646C77" fontSize="8.5" fontFamily="IBM Plex Mono">eod-close ></text>
    {NAVH.map((d,i)=>(
      <g key={i}>
        <circle cx={X(i)} cy={Y(d.v)} r={d.hwm?4:3} fill={d.type==="eod"?"#FB6F6F":d.hwm?"#ABA0FF":"#8B7CF6"} stroke="#090B0F" strokeWidth="1.5"/>
        <text x={X(i)} y={H-PADB+13} textAnchor="middle" fill="#646C77" fontSize="9" fontFamily="IBM Plex Mono">{d.d}</text>
      </g>
    ))}
    <text x={X(3)} y={Y(NAVH[3].v)-10} textAnchor="middle" fill="#ABA0FF" fontSize="8.5" fontFamily="IBM Plex Mono">HWM 32,030</text>
    <text x={X(5)} y={Y(NAVH[5].v)+16} textAnchor="middle" fill="#FB6F6F" fontSize="8.5" fontFamily="IBM Plex Mono">28,556</text>
  </svg>);
}

/* ----------------------- screens ----------------------- */
function Home({prices,setTab,refresh,status}){
  const dipNow = prices ? POS.filter(p=>{const q=prices[p.t];return q&&p.dzl!=null&&q.p>=p.dzl&&q.p<=p.dzh;}).map(p=>p.t) : null;
  return (<>
    <div className="ck-secnote">Home is your live dash — this is the quick-dash snapshot. For the deep dash, blindspots or the weekly, ask Finn in chat (those are Opus judgment calls).</div>
    <div className="fv-panel">
      <div className="fv-ph"><span className="num">§</span><span className="ttl">Control Center</span><span className="tag">jun 5 · eod close</span></div>
      <div className="fv-strip">
        <Stat label="NAV · broker eod" big value={usd(ANCHORS.nav)} sub={ANCHORS.navDate}/>
        <Stat label="Jun 5 vs Jun 4" value={pct(ANCHORS.navMove)} cls="neg" sub="AI/semis selloff"/>
        <Stat label="Realized P&L" value={usd(ANCHORS.realized)} cls="pos" sub="final"/>
        <Stat label="HWM" value={usd(ANCHORS.hwm)} sub={ANCHORS.hwmDate}/>
        <Stat label="Off HWM" value={pct(ANCHORS.ddPct)} cls="neg"/>
        <Stat label="Inception" value={pct(ANCHORS.inception)} cls="pos"/>
      </div>
      <div style={{marginTop:13}}>
        <div className="fv-stat" style={{borderRadius:"var(--r-ctrl)"}}>
          <div className="l">Progress to $50K milestone</div>
          <div className="v">{ANCHORS.prog}% <span className="ink3" style={{fontSize:11}}>· {usd(ANCHORS.nav)} / $50,000</span></div>
          <div className="fv-mbar"><i style={{width:ANCHORS.prog+"%"}}/></div>
        </div>
      </div>
    </div>

    {prices
      ? (dipNow && dipNow.length
          ? <div className="fv-co fv-co--pos"><div className="bh">in dip zone now · live</div><div className="bd">{dipNow.join(", ")} trading inside the add zone. Capital ~$0 — AVGO is the priority add if it frees.</div></div>
          : <div className="fv-co fv-co--info"><div className="bh">dip check · live</div><div className="bd">No owned name is inside its add zone right now.</div></div>)
      : <div className="fv-co fv-co--info"><div className="bh">dip check</div><div className="bd">Live prices loading — names inside their add zones populate on refresh.</div></div>}

    <div className="fv-panel">
      <div className="fv-ph"><span className="num">!</span><span className="ttl">Action Queue</span><span className="tag">{ACTIONS.length} items · {ANCHORS.lastTrade} last trade</span></div>
      {ACTIONS.map((a,i)=>(
        <div className="fv-row" key={i}>
          <span className={"fv-tag "+a.tag[0]} style={{flex:"0 0 auto"}}>{a.tag[1]}</span>
          <div className="body">{a.body}</div>
          <span className="cta" onClick={()=>setTab(a.go)}>{a.cta} ↗</span>
        </div>
      ))}
    </div>

    <div className="fv-panel">
      <div className="fv-ph"><span className="num">⌘</span><span className="ttl">Jump</span><span className="tag">tap to route</span></div>
      <div className="fv-grid">
        <div className="fv-tile" onClick={()=>setTab("positions")}><span className="tic accc">◧</span><span className="tn">positions</span><span className="td">12 holdings</span></div>
        <div className="fv-tile" onClick={()=>setTab("watchlist")}><span className="tic msc">☰</span><span className="tn">watchlist</span><span className="td">tiers + radar</span></div>
        <div className="fv-tile" onClick={()=>setTab("ledger")}><span className="tic infoc">▦</span><span className="tn">ledger</span><span className="td">CS/MS scores</span></div>
        <div className="fv-tile" onClick={()=>setTab("trades")}><span className="tic pos">◞</span><span className="tn">trades</span><span className="td">log + NAV</span></div>
        <div className="fv-tile" onClick={()=>setTab("earnings")}><span className="tic neg">◷</span><span className="tn">earnings</span><span className="td">ORCL &lt;7d</span></div>
        <div className="fv-tile" onClick={()=>setTab("reviews")}><span className="tic warnc">✓</span><span className="tn">reviews</span><span className="td">wins + open</span></div>
        <div className="fv-tile" onClick={()=>setTab("scenario")}><span className="tic neg">⎔</span><span className="tn">scenario</span><span className="td">ORCL Jun 10</span></div>
        <div className="fv-tile" onClick={()=>setTab("guide")}><span className="tic accc">?</span><span className="tn">guide</span><span className="td">how it maps</span></div>
        <div className="fv-tile" onClick={refresh}><span className="tic warnc">↻</span><span className="tn">refresh</span><span className="td">{status==="loading"?"fetching…":"live FMP"}</span></div>
      </div>
    </div>

    <div className="fv-panel">
      <div className="fv-ph"><span className="num">≈</span><span className="ttl">Macro</span><span className="tag">FOMC Jun 16-17</span></div>
      <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
        {MACRO.map((m,i)=><span key={i} className="fv-chip neu"><span className="ink3" style={{fontWeight:400}}>{m[0]} </span>{m[1]}</span>)}
      </div>
    </div>
  </>);
}

function Positions({prices,status}){
  const [sort,setSort]=useState("conv");
  const [sel,setSel]=useState(null);
  const selPos = sel ? POS.find(p=>p.t===sel) : null;
  const sorted = useMemo(()=>{
    const arr=[...POS];
    const mv=(p)=>{const q=prices&&prices[p.t];return q?q.p*p.sh:-1;};
    const gn=(p)=>{const q=prices&&prices[p.t];return q?(q.p-p.cost)/p.cost:-999;};
    if(sort==="conv") arr.sort((a,b)=> b.conv-a.conv || b.cs-a.cs);
    else if(sort==="cs") arr.sort((a,b)=> b.cs-a.cs);
    else if(sort==="ms") arr.sort((a,b)=> b.ms-a.ms);
    else if(sort==="mv") arr.sort((a,b)=> mv(b)-mv(a));
    else if(sort==="gain") arr.sort((a,b)=> gn(b)-gn(a));
    return arr;
  },[sort,prices]);
  if(selPos) return <PositionDetail p={selPos} quote={prices&&prices[sel]} back={()=>setSel(null)}/>;
  const liveDisabled = !prices;
  return (<>
    <div className="ck-secnote">Tap any card for the live-watch detail (full thesis, breaks-if, % of NAV).</div>
    <div className="ck-tabs">
      {[["conv","conviction"],["cs","score CS"],["ms","score MS"],["mv","mkt value"],["gain","gain"]].map(s=>(
        <button key={s[0]} className={"fv-seg"+(sort===s[0]?" on":"")} disabled={(s[0]==="mv"||s[0]==="gain")&&liveDisabled} onClick={()=>setSort(s[0])}>{s[1]}</button>
      ))}
    </div>
    {status==="error" && <div className="fv-co fv-co--neg"><div className="bh">live prices unavailable</div><div className="bd">FMP didn't return through the live feed. Showing stored, confirmed data only (cost · PT · scores). Price-dependent fields stay blank — nothing estimated. Use refresh to retry.</div></div>}
    <div className="ck-cards">
      {sorted.map(p=><PositionCard key={p.t} p={p} quote={prices&&prices[p.t]} onSelect={setSel}/>)}
    </div>
  </>);
}

function Watchlist(){
  return (<>
    <div className="ck-secnote">Color-coded conviction tiers pulled from canonical state. Radar holds T1/T2/watch names; post-sell windows are actively monitored to expiry.</div>
    {NAMED_TIERS.map((tg,i)=>(
      <div className="ck-tier" key={i}>
        <div className="ck-tier-h"><span className="ck-tier-dot" style={{background:tg.color}}/><span className="t" style={{color:tg.color}}>{tg.tier}</span><span className="c">{tg.names.length}</span></div>
        <div className="ck-wcards">
          {tg.names.map((nm,j)=>(<div className="ck-wc" key={j}><div className="wt" style={{color:tg.color}}>{nm.t}</div>{nm.n&&<div className="wn">{nm.n}</div>}<div className="we">{nm.e}</div></div>))}
        </div>
      </div>
    ))}
    <div className="fv-panel">
      <div className="fv-ph"><span className="num">◎</span><span className="ttl">Radar</span><span className="tag">T1 / T2 / watch</span></div>
      <div className="ck-tier-h"><span className="ck-tier-dot" style={{background:"var(--warn)"}}/><span className="t" style={{color:"var(--warn)"}}>T1 — near actionable</span></div>
      <div className="ck-wcards" style={{marginBottom:12}}>{RADAR_T1.map((n,i)=><div className="ck-wc" key={i}><div className="wt warnc">{n.t}</div><div className="we">{n.e}</div></div>)}</div>
      <div className="ck-tier-h"><span className="ck-tier-dot" style={{background:"var(--info)"}}/><span className="t" style={{color:"var(--info)"}}>T2 — watch / entry zones</span></div>
      <div style={{display:"flex",flexWrap:"wrap",gap:7}}>{RADAR_T2.map((n,i)=><span key={i} className="fv-chip neu">{n}</span>)}</div>
    </div>
    <div className="fv-panel">
      <div className="fv-ph"><span className="num">↩</span><span className="ttl">Post-Sell Monitor</span><span className="tag">30-day windows</span></div>
      <div className="ck-wcards">{POST_SELL.map((n,i)=><div className="ck-wc" key={i}><div className="wt ink2">{n.t} <span className="fv-tag earn" style={{marginLeft:4}}>exp {n.exp}</span></div><div className="we">{n.note}</div></div>)}</div>
    </div>
    <div className="fv-panel">
      <div className="fv-ph"><span className="num">▷</span><span className="ttl">Game Plan — add zones</span><span className="tag">dip-only</span></div>
      {GAMEPLAN.map((g,i)=>(<div className="fv-row" key={i}><span className="fv-chip c4" style={{flex:"0 0 auto"}}>{g.t}</span><div className="body">{g.note}</div></div>))}
    </div>
  </>);
}

function Ledger({prices}){
  const rows=[...POS].sort((a,b)=> b.conv-a.conv || b.cs-a.cs);
  return (<>
    <div className="ck-secnote">CS/MS dual rating · scores dated Jun 1 (CRDO Jun 3) · next rescore Jun 8. Ordered by conviction then composite score.</div>
    <div className="fv-panel" style={{overflowX:"auto"}}>
      <table className="ck-tbl">
        <thead><tr><th>Ticker</th><th>Conv</th><th>CS</th><th>MS</th><th>PT</th><th>Dip</th><th>Trim</th><th>Live</th></tr></thead>
        <tbody>
          {rows.map(p=>{const q=prices&&prices[p.t];return(
            <tr key={p.t}>
              <td className="tkc" style={{color:convColor(p.conv)}}>{p.t}<div style={{fontFamily:"var(--sans)",fontSize:9.5,color:"var(--ink3)",fontWeight:400}}>{p.sec}</div></td>
              <td>C{p.conv}</td>
              <td className="accc">{p.cs}</td>
              <td className="msc">{p.ms}</td>
              <td>{p.ptl?(p.pth&&p.pth!==p.ptl?p.ptl+"-"+p.pth:p.ptl):"—"}</td>
              <td className="ink2">{p.dzl?p.dzl+"-"+p.dzh:"—"}</td>
              <td className="warnc">{p.trim||"—"}</td>
              <td className={moveColor(q?q.c:null)}>{q?px(q.p):"—"}</td>
            </tr>);})}
        </tbody>
      </table>
    </div>
  </>);
}

function Trades(){
  return (<>
    <div className="fv-panel">
      <div className="fv-ph"><span className="num">↗</span><span className="ttl">NAV Curve</span><span className="tag">May 29 -> Jun 5</span></div>
      <NavCurve/>
      <div className="ck-leg" style={{marginTop:8}}>Legacy May 29-Jun 3 = intraday peak · Jun 4 = current · Jun 5 onward = <b style={{color:"var(--ink2)"}}>EOD close</b> (measure adopted Jun 5). Backfill EOD closes to de-mix the early curve.</div>
    </div>
    <div className="fv-panel">
      <div className="fv-ph"><span className="num">Σ</span><span className="ttl">Realized P&L</span><span className="tag">final · ex unreconciled ORCL -$3.36</span></div>
      <div className="fv-strip">
        <Stat label="Total realized" big value={usd(ANCHORS.realized)} cls="pos"/>
        {REALIZED_BD.map((b,i)=><Stat key={i} label={b[0]} value={usd(b[1])} cls={b[1]>=0?"pos":"neg"}/>)}
      </div>
    </div>
    <div className="fv-panel" style={{overflowX:"auto"}}>
      <div className="fv-ph"><span className="num">▤</span><span className="ttl">Trade Log</span><span className="tag">oldest -> newest</span></div>
      <table className="ck-tbl">
        <thead><tr><th>Date</th><th>Ticker</th><th>Action</th><th>Shares</th><th>Avg sell</th><th>Realized</th></tr></thead>
        <tbody>
          {TRADES.map((t,i)=>(
            <tr key={i}>
              <td className="ink2">{t.d}</td>
              <td className="tkc">{t.t}</td>
              <td className="ink2" style={{fontFamily:"var(--sans)"}}>{t.a}</td>
              <td>{t.sh}</td>
              <td>{px(t.px)}</td>
              <td className={t.pnl>=0?"pos":"neg"}>{(t.pnl>=0?"+":"-")+"$"+Math.abs(t.pnl).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>);
}

function Earnings(){
  const o=EARN_IMMINENT;
  return (<>
    <div className="fv-co fv-co--neg"><div className="bh">earn imminent · &lt;7d</div><div className="bd"><b style={{color:"#fff"}}>{o.t}</b> reports <b style={{color:"#fff"}}>{o.date}, {o.when}</b> ({o.days}d) — {o.fiscal}. {o.status}. EPS est <b style={{color:"#fff"}}>${o.eps}</b> · Rev est <b style={{color:"#fff"}}>{o.rev}</b>. Scenario auto-fired.</div></div>
    <div className="fv-panel">
      <div className="fv-ph"><span className="num">▤</span><span className="ttl">{o.t} — last 4 quarters</span></div>
      <table className="ck-tbl"><thead><tr><th>Quarter</th><th>Result</th><th>EPS vs est</th></tr></thead><tbody>
        {o.last4.map((q,i)=><tr key={i}><td className="ink2">{q[0]}</td><td className={q[1].indexOf("miss")>=0?"neg":"pos"} style={{fontFamily:"var(--sans)"}}>{q[1]}</td><td>{q[2]}</td></tr>)}
      </tbody></table>
    </div>
    <div className="fv-panel" style={{overflowX:"auto"}}>
      <div className="fv-ph"><span className="num">◷</span><span className="ttl">Owned — upcoming</span><span className="tag">Q2 cluster</span></div>
      <table className="ck-tbl"><thead><tr><th>Ticker</th><th>Date</th><th>Streak</th><th>Note</th></tr></thead><tbody>
        {EARN_OWNED.map((e,i)=><tr key={i}><td className="tkc">{e.t}</td><td className="ink2">{e.date}</td><td style={{fontFamily:"var(--sans)",color:"var(--ink2)"}}>{e.streak}</td><td className="ink3" style={{fontFamily:"var(--sans)",fontSize:11}}>{e.note||""}</td></tr>)}
      </tbody></table>
    </div>
    <div className="ck-secnote">{EARN_GAP}</div>
  </>);
}

function Reviews(){
  return (<>
    <div className="ck-secnote">Triggers: win +40% · loss -20% · any full exit. Open reviews carry as TODO.</div>
    {REVIEWS.map(r=>{const open=r.out==="OPEN";return(
      <div className="fv-co" key={r.id} style={{background:open?"var(--warndim)":"var(--posdim)",border:"1px solid "+(open?"rgba(229,169,60,.32)":"rgba(70,209,127,.32)")}}>
        <div className="bh" style={{color:open?"var(--warn)":"var(--pos)",display:"flex",gap:8,alignItems:"center"}}>{r.t} · {r.type}<span style={{marginLeft:"auto",fontFamily:"var(--mono)"}}>{r.out}{r.pnl?" "+(r.pnl>=0?"+":"")+usd(r.pnl):""} · {r.d}</span></div>
        <div className="bd">{r.lesson}</div>
        {r.qs && <ul className="ck-check" style={{marginTop:8}}>{r.qs.map((q,i)=><li key={i}><span className="mk">?</span>{q}</li>)}</ul>}
      </div>
    );})}
    <div className="fv-panel">
      <div className="fv-ph"><span className="num">∿</span><span className="ttl">Patterns</span></div>
      {REVIEW_PATTERNS.map((p,i)=><div className="fv-row" key={i}><div className="body">{p}</div></div>)}
    </div>
  </>);
}

function Scenario(){
  return (<>
    <div className="fv-co fv-co--neg"><div className="bh">scenario auto-fired · earnings &lt;7d</div><div className="bd">ORCL (Oracle) reports <b style={{color:"#fff"}}>Jun 10, after close</b> — Q4 FY2026. CONFIRMED (FMP + Oracle IR). EPS est <b style={{color:"#fff"}}>$1.96</b> · Rev est <b style={{color:"#fff"}}>~$19.1B</b>. Position: 5 sh @ $192.84 cost · PT $261 · consensus $249.70. Levels below are scenario assumptions, not live prices.</div></div>
    <div className="ck-scen">
      {["bull","base","bear"].map(k=>{const s=SCEN[k];return(
        <div className="ck-scard" key={k} style={{borderColor:k==="base"?"var(--warn)":k==="bull"?"rgba(70,209,127,.4)":"rgba(251,111,111,.4)"}}>
          <div className="sh" style={{color:"var(--"+s.cl+")"}}>{k}<span className="prob" style={{background:"var(--"+s.cl+"dim)",color:"var(--"+s.cl+")"}}>{s.p}</span></div>
          <div className={"sl "+s.cl}>{s.lvl}</div>
          <div className="sb">{s.b}</div>
        </div>);})}
    </div>
    <div className="fv-panel">
      <div className="fv-ph"><span className="num">✓</span><span className="ttl">Monitoring Checklist</span><span className="tag">day-of</span></div>
      <ul className="ck-check">
        <li><span className="mk">›</span>RPO / cRPO growth (last reported ~$553B) — the headline AI-demand tell.</li>
        <li><span className="mk">›</span>OCI revenue growth rate + capacity commentary.</li>
        <li><span className="mk">›</span>AI-capacity capex vs margin — does buildout compress the model?</li>
        <li><span className="mk">›</span>FY guidance tone — the swing factor for the reaction.</li>
        <li><span className="mk">›</span>Beat history: 3 of last 4 beat (Dec a big beat, Sep a slight miss).</li>
      </ul>
    </div>
    <div className="fv-co fv-co--info"><div className="bh">verdict</div><div className="bd"><b style={{color:"#fff"}}>HOLD into the print.</b> Conviction 3, smallest equity line (5 sh). Read-through matters book-wide — a clean OCI/RPO beat unwinds the AI-demand fear that drove the Jun 5 selloff; a soft guide pressures the whole AI-infra sleeve. Verify the exact day-of before the close.</div></div>
  </>);
}

function Guide(){
  const map=[
    ["home · dash · quick dash","Home — your live snapshot (status strip, action queue, dip check, macro). Quick dash = this view; the deeper dash runs in chat."],
    ["positions · live watch","Positions — tap any card for the live-watch detail (price, thesis, breaks-if, % of NAV)."],
    ["ledger · engine","Ledger — CS/MS dual-rating scored table."],
    ["trades · NAV","Trades — log (oldest -> newest), NAV curve, realized P&L."],
    ["watchlist · gameplan","Watchlist — conviction tiers, radar, post-sell monitor, add-zone game plan."],
    ["earnings","Earnings — imminent <7d flag, owned calendar, beat/miss history."],
    ["reviews","Reviews — win/loss reviews + recurring patterns."],
    ["scenario","Scenario — auto-fires on earnings <7d, PT breach, major catalyst, decision fork."],
  ];
  return (<>
    <div className="fv-co fv-co--acc"><div className="bh">what this is</div><div className="bd">The Finn cockpit is a persistent, live surface — your data plus live FMP prices in one navigable app. It is the <b style={{color:"#fff"}}>surface</b>; the chat is the <b style={{color:"#fff"}}>brain</b>.</div></div>
    <div className="fv-panel">
      <div className="fv-ph"><span className="num">⌘</span><span className="ttl">Command -> screen</span></div>
      {map.map((m,i)=><div className="fv-row" key={i}><span className="fv-chip neu" style={{flex:"0 0 auto",fontSize:10}}>{m[0]}</span><div className="body">{m[1]}</div></div>)}
    </div>
    <div className="fv-co fv-co--info"><div className="bh">lives in chat (Opus judgment)</div><div className="bd">blindspots · weekly · rescore · news on [ticker] · reports · scenario for new names. The cockpit (Sonnet + live data) handles retrieval and display; judgment-heavy calls stay with Finn in chat, where the reasoning is.</div></div>
    <div className="fv-co fv-co--pos"><div className="bh">price integrity</div><div className="bd">Nothing price-dependent renders without a live source. NAV is broker-confirmed, never estimated. Blank beats wrong.</div></div>
  </>);
}

/* ----------------------- chat command reference ----------------------- */
const CHAT_CMDS = {
  "Analysis · ask Finn (Opus)": [
    ["dash","Full daily dashboard — FMP feed + focus cards + alerts (Home is the snapshot)"],
    ["dip check","Entry-zone analysis across owned + watchlist (quick live view is on Home)"],
    ["blindspots","Portfolio risk + blindspot scan"],
    ["weekly","Weekly portfolio review"],
    ["rescore","Re-run CS/MS scoring — due Jun 8"],
    ["news on [ticker]","Latest news + read-through for a name"],
    ["scenario [ticker]","Bull / base / bear for a name not already auto-fired"],
    ["report · export","Generated write-up or Finn export"],
  ],
  "Session & files": [
    ["GMF · GNF","Good-morning / goodnight — session open/close + sync"],
    ["sync","File sync check vs canonical state"],
    ["update","Log a change or trade"],
    ["eod","End-of-day price capture + recap"],
    ["prices","What-if / manual price override"],
    ["todo","Build + workstream list"],
    ["system","System status"],
  ],
};
function CommandRef({back}){
  return (<>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:13}}>
      <button className="fv-btn fv-btn--tertiary" onClick={back}>← back</button>
      <span className="ck-tk" style={{fontSize:16,color:"var(--acc2)"}}>CHAT COMMANDS</span>
    </div>
    <div className="fv-co fv-co--acc"><div className="bh">run these in chat, not the cockpit</div><div className="bd">The cockpit is the live surface; Finn in chat is the judgment layer. Type any of these while the cockpit is open — they don't route from here. Everything in the tabs above (positions, ledger, watchlist, trades, earnings, reviews, scenario) is already covered.</div></div>
    {Object.keys(CHAT_CMDS).map((sec,i)=>(
      <div className="fv-panel" key={i}>
        <div className="fv-ph"><span className="num">›</span><span className="ttl">{sec}</span></div>
        {CHAT_CMDS[sec].map((c,j)=>(
          <div className="fv-row" key={j}>
            <span className="fv-chip" style={{flex:"0 0 auto",color:"var(--acc2)"}}>{c[0]}</span>
            <div className="body">{c[1]}</div>
          </div>
        ))}
      </div>
    ))}
  </>);
}

/* ----------------------- root ----------------------- */
const STORE_KEY="finn_cockpit_runtime_v1";
async function loadRuntime(){ try{ if(typeof window!=="undefined"&&window.storage){const r=await window.storage.get(STORE_KEY);if(r&&r.value)return JSON.parse(r.value);} }catch(e){} return null; }
async function saveRuntime(o){ try{ if(typeof window!=="undefined"&&window.storage){await window.storage.set(STORE_KEY,JSON.stringify(o));} }catch(e){} }

export default function App(){
  const [tab,setTab]=useState("home");
  const [prices,setPrices]=useState(null);
  const [status,setStatus]=useState("idle");
  const [when,setWhen]=useState(null);
  const [count,setCount]=useState(0);

  const refresh=useCallback(async()=>{
    setStatus("loading");
    try{
      const merged={};
      const chunks=chunk(TICKERS,2);
      const r1=await Promise.allSettled(chunks.map(fetchChunk));
      r1.forEach(r=>{ if(r.status==="fulfilled"&&r.value) Object.assign(merged,r.value); });
      let missing=TICKERS.filter(t=>!merged[t]);
      if(missing.length){
        const r2res=await Promise.allSettled(missing.map(t=>fetchChunk([t])));
        r2res.forEach(r=>{ if(r.status==="fulfilled"&&r.value) Object.assign(merged,r.value); });
      }
      const got=Object.keys(merged).length;
      if(got===0){ setStatus("error"); return; }
      const t=new Date().toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit"});
      setPrices(merged); setWhen(t); setCount(got);
      setStatus(got<TICKERS.length?"partial":"ok");
      saveRuntime({prices:merged,when:t});
    }catch(e){ setStatus("error"); }
  },[]);

  useEffect(()=>{ (async()=>{
    const rt=await loadRuntime();
    if(rt&&rt.prices){ setPrices(rt.prices); setWhen(rt.when||null); setCount(Object.keys(rt.prices).length); setStatus("stale"); }
    refresh();
  })(); },[refresh]);

  const TABS=[["home","home"],["positions","positions"],["watchlist","watchlist"],["ledger","ledger"],["trades","trades"],["earnings","earnings"],["reviews","reviews"],["scenario","scenario"],["guide","guide"]];

  return (<div className="ck-root">
    <style>{CSS}</style>
    <div className="ck-wrap">
      <div className="ck-top">
        <span className="ck-mark">FINN</span>
        <span className="ck-bc">cockpit · phase 1 · jun 5 2026</span>
        <div className="ck-px">
          <button className="fv-btn fv-btn--tertiary" onClick={()=>setTab(tab==="cmds"?"home":"cmds")}>⌘ chat cmds</button>
          <PriceBadge status={status} when={when} count={count}/>
          <button className="fv-btn fv-btn--tertiary" onClick={refresh} disabled={status==="loading"}>{status==="loading"?"…":"↻ refresh"}</button>
        </div>
      </div>

      <div className="ck-tabs">
        {TABS.map(t=><button key={t[0]} className={"fv-seg"+(tab===t[0]?" on":"")} onClick={()=>setTab(t[0])}>{t[1]}</button>)}
      </div>

      {tab==="home" && <Home prices={prices} setTab={setTab} refresh={refresh} status={status}/>}
      {tab==="positions" && <Positions prices={prices} status={status}/>}
      {tab==="watchlist" && <Watchlist/>}
      {tab==="ledger" && <Ledger prices={prices}/>}
      {tab==="trades" && <Trades/>}
      {tab==="earnings" && <Earnings/>}
      {tab==="reviews" && <Reviews/>}
      {tab==="scenario" && <Scenario/>}
      {tab==="guide" && <Guide/>}
      {tab==="cmds" && <CommandRef back={()=>setTab("home")}/>}

      <div className="ck-foot">
        prices live from FMP via MCP · stored data as of Jun 5 EOD · NAV is broker-confirmed, never estimated<br/>
        price integrity: nothing price-dependent renders without a live source — blank beats wrong
      </div>
    </div>
  </div>);
}
