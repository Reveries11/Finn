import React, { useState, useEffect } from "react";
import {
  LayoutDashboard, List, Eye, Table, ArrowLeftRight, GitBranch,
  Zap, Clock, AlertTriangle, Trophy, Target, RefreshCw, Command,
  LayoutGrid, Gauge, TrendingDown, LogOut, Server, Moon, ChevronRight,
  Newspaper, Calendar, Flame, Plane, Check, Cpu, LineChart, Search,
  ClipboardList, ClipboardCheck, ListChecks, Settings
} from "lucide-react";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');
.ck *{box-sizing:border-box}
.ck{--bg:#090B0F;--bg2:#0D1015;--panel:#12161D;--panel2:#161B23;--elev:#1C222B;--line:#242A34;--line2:#323945;--hair:rgba(255,255,255,.045);--ink:#E8EBEF;--ink2:#9AA2AD;--ink3:#646C77;--acc:#8B7CF6;--acc2:#ABA0FF;--accdim:rgba(139,124,246,.14);--info:#5FAEF2;--infodim:rgba(95,174,242,.12);--warn:#E5A93C;--warndim:rgba(229,169,60,.13);--pos:#46D17F;--posdim:rgba(70,209,127,.12);--neg:#FB6F6F;--negdim:rgba(251,111,111,.12);--ms:#5EE6D0;--msdim:rgba(94,230,208,.12);--r-chip:6px;--r-ctrl:8px;--r-card:10px;--r-panel:14px;--sans:'IBM Plex Sans',-apple-system,sans-serif;--mono:'IBM Plex Mono',ui-monospace,monospace;
  font-family:var(--sans);background:var(--bg);background-image:radial-gradient(900px 500px at 82% -12%,rgba(139,124,246,.10),transparent 60%);color:var(--ink);font-size:14px;padding:16px;border-radius:14px;min-height:560px}
.ck .mono{font-family:var(--mono);font-variant-numeric:tabular-nums}
.ck .pos{color:var(--pos)}.ck .neg{color:var(--neg)}.ck .warnc{color:var(--warn)}.ck .infoc{color:var(--info)}
.ck-chrome{display:flex;align-items:center;justify-content:space-between;gap:10px;background:var(--panel2);border:1px solid var(--line);border-radius:var(--r-ctrl);padding:9px 12px;margin-bottom:11px}
.ck-bc{font-family:var(--mono);font-size:11px;letter-spacing:.8px;color:var(--ink3);text-transform:uppercase}
.ck-bc b{color:var(--acc2)}
.ck-cr{display:flex;align-items:center;gap:7px}
.fv-btn{font-family:var(--mono);font-size:12px;font-weight:600;border-radius:var(--r-ctrl);padding:6px 11px;cursor:pointer;border:1px solid transparent;transition:.15s;display:inline-flex;align-items:center;gap:5px}
.fv-btn--secondary{background:var(--accdim);border-color:var(--acc);color:var(--acc2)}
.fv-btn--tertiary{background:var(--panel);border-color:var(--line2);color:var(--ink2)}
.fv-btn--tertiary:hover{border-color:var(--acc);color:var(--ink);background:var(--elev)}
.fv-btn--primary{font-family:var(--sans);font-size:12.5px;background:var(--acc);border-color:var(--acc);color:#fff;padding:8px 14px}
.fv-btn--primary:hover{background:#9d90f8}
.fv-pill{font-family:var(--mono);font-size:10.5px;font-weight:600;border-radius:999px;padding:4px 10px;border:1px solid;display:inline-flex;align-items:center;gap:5px}
.pill-ok{background:var(--posdim);color:var(--pos);border-color:rgba(70,209,127,.3)}
.pill-pull{background:var(--accdim);color:var(--acc2);border-color:var(--acc)}
.pill-warn{background:var(--warndim);color:var(--warn);border-color:rgba(229,169,60,.3)}
.ck-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:13px}
.ck-tab{font-family:var(--mono);font-size:12px;font-weight:600;padding:7px 12px;border-radius:var(--r-ctrl);background:var(--panel);border:1px solid var(--line);color:var(--ink2);cursor:pointer;transition:.15s;display:inline-flex;align-items:center;gap:6px}
.ck-tab:hover{border-color:var(--acc);color:var(--ink)}
.ck-tab.on{background:var(--accdim);border-color:var(--acc);color:var(--acc2)}
.fv-panel{background:linear-gradient(180deg,var(--panel),var(--bg2));border:1px solid var(--line);border-radius:var(--r-panel);padding:14px;margin-bottom:11px}
.sec{font-family:var(--mono);font-size:11px;font-weight:700;color:var(--ink2);text-transform:uppercase;letter-spacing:1px;margin:15px 0 9px;display:flex;align-items:center;gap:7px}
.sec svg{color:var(--ink3)}
.fresh{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}
.fresh .fl{font-family:var(--mono);font-size:10px;color:var(--ink3);text-transform:uppercase;letter-spacing:.9px}
.fv-strip{display:grid;gap:1px;background:var(--line);border-radius:var(--r-ctrl);overflow:hidden;grid-template-columns:repeat(auto-fit,minmax(116px,1fr))}
.fv-stat{background:var(--bg2);padding:11px 13px}
.fv-stat .l{font-size:10px;color:var(--ink3);text-transform:uppercase;letter-spacing:.4px}
.fv-stat .v{font-family:var(--mono);font-size:17px;font-weight:600;margin-top:4px}
.fv-stat .big{font-family:var(--mono);font-size:23px;font-weight:600;margin-top:3px;line-height:1}
.fv-stat .sub{font-family:var(--mono);font-size:10px;margin-top:3px;color:var(--ink3)}
.fv-mbar{height:4px;background:var(--bg2);border:1px solid var(--line);border-radius:4px;margin-top:9px;overflow:hidden;position:relative}
.fv-mbar i{position:absolute;inset:0 auto 0 0;background:linear-gradient(90deg,rgba(139,124,246,.5),var(--acc))}
.barcap{display:flex;justify-content:space-between;margin-top:6px;font-family:var(--mono);font-size:10.5px;color:var(--ink2)}
.fv-row{display:flex;align-items:center;gap:11px;background:var(--panel2);border:1px solid var(--line);border-radius:var(--r-ctrl);padding:9px 12px;cursor:pointer;transition:.15s;margin-bottom:7px}
.fv-row:hover{border-color:var(--acc);background:var(--elev)}
.fv-ic{width:32px;height:32px;border-radius:var(--r-ctrl);background:var(--panel);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;flex:0 0 32px}
.aq .fv-ic{border:none}
.aq-red{background:var(--negdim);color:var(--neg)}.aq-amber{background:var(--warndim);color:var(--warn)}.aq-green{background:var(--posdim);color:var(--pos)}.aq-info{background:var(--infodim);color:var(--info)}
.fv-row .nm{font-family:var(--mono);font-size:12.5px;font-weight:600;color:var(--ink)}
.fv-row .nt{font-size:10.5px;color:var(--ink3);margin-top:1px}
.fv-row .abody{flex:1;min-width:0}
.fv-row .aimp{font-size:12.5px;font-weight:600;color:var(--ink);line-height:1.4}
.fv-row .adet{font-size:11px;color:var(--ink2);line-height:1.45;margin-top:2px}
.fv-row .adet .tk{font-family:var(--mono);color:#cdd2d9}
.fv-row .chev{margin-left:auto;color:var(--ink3)}
.fv-row .frn{font-size:11px;color:var(--ink3);margin-left:auto;margin-right:8px}
.fv-row .cta{font-family:var(--sans);font-size:11.5px;font-weight:600;padding:5px 11px;border-radius:var(--r-ctrl);background:var(--accdim);border:1px solid var(--acc);color:var(--acc2);white-space:nowrap}
.seeall{font-family:var(--sans);font-size:11.5px;color:var(--acc2);cursor:pointer;text-align:center;padding:5px;display:block}
.fv-group{display:flex;gap:8px}
.fv-field{font-family:var(--mono);font-size:12.5px;background:var(--bg2);border:1px solid var(--line);border-radius:var(--r-ctrl);color:var(--ink);padding:9px 12px;width:100%;outline:none;flex:1}
.fv-field::placeholder{color:var(--ink3)}
.fv-field:focus{border-color:var(--acc);box-shadow:0 0 0 3px rgba(139,124,246,.16)}
.cmdhint{font-family:var(--mono);font-size:10.5px;color:var(--ink3);margin-top:6px}
.fv-seg{font-family:var(--sans);font-size:11px;font-weight:600;padding:5px 11px;border-radius:var(--r-ctrl);background:var(--panel);border:1px solid var(--line);color:var(--ink2);cursor:pointer;transition:.15s}
.fv-seg:hover{border-color:var(--acc);color:var(--ink)}
.fv-seg.on{background:var(--accdim);border-color:var(--acc);color:var(--acc2)}
.segbar{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px}
.chips{display:flex;flex-wrap:wrap;gap:7px}
.fv-chip{font-family:var(--mono);font-size:11.5px;font-weight:600;background:var(--panel);border:1px solid var(--line);border-radius:var(--r-chip);padding:5px 9px;cursor:pointer;transition:.15s}
.fv-chip:hover{border-color:var(--acc);background:var(--accdim)}
.fv-chip.c5{color:var(--acc2)}.fv-chip.c4{color:var(--info)}.fv-chip.c3{color:var(--warn)}.fv-chip.neu{color:var(--ink2)}
.fv-chip .pxv{color:var(--ink3);font-weight:400;margin-left:5px}
.fv-co-chip{display:flex;align-items:center;gap:9px;border-radius:var(--r-ctrl);padding:9px 12px;cursor:pointer;background:var(--infodim);border:1px solid rgba(95,174,242,.3)}
.fv-co-chip .t{font-size:12px;color:var(--ink)}.fv-co-chip .t .tk{font-family:var(--mono);color:var(--info)}
.fv-co-chip .fx{margin-left:auto;font-family:var(--mono);font-size:10.5px;color:var(--info);white-space:nowrap}
.fv-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(112px,1fr));gap:9px}
.fv-tile{display:flex;flex-direction:column;align-items:center;gap:6px;background:var(--panel2);border:1px solid var(--line);border-radius:var(--r-card);padding:13px 12px;position:relative;cursor:pointer;transition:.15s;text-align:center}
.fv-tile:hover{border-color:var(--acc);background:var(--accdim);transform:translateY(-2px)}
.fv-tile .tn{font-family:var(--mono);font-size:12px;font-weight:600;color:var(--ink)}
.fv-tile .td{font-size:10px;color:var(--ink3);line-height:1.3}
.fv-tile .tic{color:var(--acc2)}
.fv-tile .tb{position:absolute;top:6px;right:6px;font-family:var(--mono);font-size:9px;font-weight:700;padding:1px 5px;border-radius:5px}
.tb-neg{background:var(--negdim);color:var(--neg)}.tb-warn{background:var(--warndim);color:var(--warn)}.tb-live{background:var(--posdim);color:var(--pos)}
.catlabel{font-family:var(--mono);font-size:10px;color:var(--ink3);text-transform:uppercase;letter-spacing:1px;margin:13px 0 7px}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(168px,1fr));gap:9px}
.pcard{background:var(--panel2);border:1px solid var(--line);border-left:3px solid var(--line2);border-radius:var(--r-card);padding:11px 12px}
.pcard.c5{border-left-color:var(--acc)}.pcard.c4{border-left-color:var(--info)}.pcard.c3{border-left-color:var(--warn)}
.pcard .ph{display:flex;align-items:baseline;justify-content:space-between;gap:6px}
.pcard .tkn{font-family:var(--mono);font-size:14px;font-weight:700;color:var(--ink)}
.pcard .nm{font-size:10px;color:var(--ink3);margin-top:1px}
.pcard .px{font-family:var(--mono);font-size:13px;font-weight:600}
.pcard .ms{display:flex;gap:8px;margin-top:9px;font-family:var(--mono);font-size:10.5px;color:var(--ink2)}
.pcard .ms b{color:var(--ink)}
.pcard .row2{display:flex;justify-content:space-between;margin-top:7px;font-family:var(--mono);font-size:10.5px;color:var(--ink3)}
.fv-tag{font-family:var(--mono);font-size:8.5px;font-weight:700;border-radius:5px;padding:2px 6px;letter-spacing:.3px}
.fv-tag.win{background:var(--warndim);color:var(--warn)}.fv-tag.dip{background:var(--posdim);color:var(--pos)}
.fv-tag.earn{background:var(--negdim);color:var(--neg)}.fv-tag.conc{background:var(--infodim);color:var(--info)}
.fv-tag.proj{background:var(--warndim);color:var(--warn)}.fv-tag.conf{background:var(--posdim);color:var(--pos)}
.tbl{width:100%;border-collapse:collapse}
.tbl th{font-family:var(--mono);font-size:9.5px;text-transform:uppercase;letter-spacing:.4px;color:var(--ink3);text-align:right;padding:7px 8px;border-bottom:1px solid var(--line);font-weight:600}
.tbl th:first-child{text-align:left}
.tbl td{font-family:var(--mono);font-size:11.5px;padding:7px 8px;text-align:right;border-bottom:1px solid var(--hair);color:var(--ink2)}
.tbl td:first-child{text-align:left;color:var(--ink);font-weight:600}
.tbl tr:hover td{background:var(--panel2)}
.tier-sep td{font-family:var(--mono);font-size:9.5px;text-transform:uppercase;letter-spacing:.9px;color:var(--acc2);padding:11px 8px 5px;background:transparent;border:none}
.cbadge{font-family:var(--mono);font-size:9px;font-weight:700;padding:1px 5px;border-radius:4px}
.cb5{background:var(--accdim);color:var(--acc2)}.cb4{background:var(--infodim);color:var(--info)}.cb3{background:var(--warndim);color:var(--warn)}
.scn{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:9px}
.scn-box{border-radius:var(--r-card);padding:12px}
.scn-bull{background:var(--posdim);border:1px solid rgba(70,209,127,.3)}
.scn-base{background:var(--accdim);border:1px solid var(--acc)}
.scn-bear{background:var(--negdim);border:1px solid rgba(251,111,111,.3)}
.scn-box .sh{font-family:var(--mono);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.6px;display:flex;justify-content:space-between}
.scn-bull .sh{color:var(--pos)}.scn-base .sh{color:var(--acc2)}.scn-bear .sh{color:var(--neg)}
.scn-box .sd{font-size:11.5px;color:#cdd2d9;line-height:1.5;margin-top:7px}
.scn-box .sp{font-family:var(--mono);font-size:18px;font-weight:600;color:var(--ink);margin-top:8px}
.fv-co-box{border-radius:var(--r-card);padding:13px 15px;background:var(--accdim);border:1px solid var(--acc);margin-top:10px}
.fv-co-box .bh{font-family:var(--mono);font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:7px;color:var(--acc2)}
.fv-co-box .bd{font-size:12px;color:#cdd2d9;line-height:1.5}
`;

const CASH = 16.62;
const BROKER_NAV = 28367.86;
const REALIZED = 2410.60;

const POS = [
  { t:"VOO", name:"Vanguard S&P 500 ETF", sh:4, cost:635.56, conv:5, sec:"Foundation", cs:84, ms:79, ptL:null, ptH:null, dipL:650, dipH:650 },
  { t:"NVDA", name:"NVIDIA Corp", sh:29.727, cost:154.17, conv:5, sec:"AI Semis", cs:88, ms:82, ptL:295, ptH:295, dipL:200, dipH:210 },
  { t:"AVGO", name:"Broadcom", sh:8, cost:424.53, conv:5, sec:"AI Semis", cs:91, ms:85, ptL:463, ptH:582, dipL:410, dipH:420 },
  { t:"ANET", name:"Arista Networks", sh:17, cost:145.01, conv:5, sec:"AI Infra", cs:87, ms:80, ptL:187, ptH:187, dipL:140, dipH:145 },
  { t:"AMAT", name:"Applied Materials", sh:6, cost:431.90, conv:4, sec:"AI Semis", cs:87, ms:83, ptL:500, ptH:575, dipL:420, dipH:425 },
  { t:"ETN", name:"Eaton Corp", sh:5, cost:395.19, conv:4, sec:"Power", cs:83, ms:76, ptL:464, ptH:464, dipL:395, dipH:415 },
  { t:"APH", name:"Amphenol", sh:12, cost:133.11, conv:4, sec:"AI Infra", cs:88, ms:86, ptL:145, ptH:182, dipL:130, dipH:135 },
  { t:"APLD", name:"Applied Digital", sh:35, cost:26.49, conv:4, sec:"AI Infra", cs:63, ms:77, ptL:58, ptH:97, dipL:40, dipH:43 },
  { t:"MRVL", name:"Marvell Technology", sh:6, cost:194.33, conv:4, sec:"AI Semis", cs:84, ms:90, ptL:340, ptH:400, dipL:205, dipH:215 },
  { t:"NOW", name:"ServiceNow", sh:12, cost:101.68, conv:4, sec:"AI Software", cs:83, ms:76, ptL:143, ptH:236, dipL:115, dipH:120 },
  { t:"CRDO", name:"Credo Technology", sh:11, cost:215.95, conv:4, sec:"AI Semis", cs:83, ms:85, ptL:240, ptH:300, dipL:190, dipH:215 },
  { t:"ORCL", name:"Oracle", sh:5, cost:192.84, conv:3, sec:"AI Software", cs:76, ms:70, ptL:261, ptH:261, dipL:185, dipH:190 },
];

const T1 = [
  { t:"AMBA", name:"Ambarella", cs:68, ms:65, note:"zone TBD off earnings; edge-AI vision, show-me" },
  { t:"PLTR", name:"Palantir", cs:66, ms:78, note:"watch only — needs a meaningful pullback" },
];
const T2 = [
  ["IONQ","$54-58"],["IREN","$50-55"],["CRWV","$70-80"],["ALAB","NVDA-adj"],["RBRK",""],
  ["COHR",""],["CLS",""],["DELL",""],["MSFT","CS88"],["CLSK","$14-16"],["HLIT",""],["INFQ","<$14"]
];

const TRADES = [
  ["2026-05-12","APLD","trim",10,43.54,217.46],
  ["2026-05-15","HOOD","exit",8.18,78.05,289.36],
  ["2026-05-18","APLD","trim",20,41.50,383.81],
  ["2026-05-18","NVDA","trim",6,226.15,489.93],
  ["2026-05-18","MU","exit",2,724.80,176.50],
  ["2026-05-21","APLD","trim",5,46.53,117.65],
  ["2026-05-26","NVDA","trim",2,212.76,129.73],
  ["2026-06-01","NU","exit",5,12.98,-0.95],
  ["2026-06-01","CEG","exit",4,269.49,-36.84],
  ["2026-06-02","MRVL","trim",2,279.61,196.19],
  ["2026-06-02","ETN","trim",1,412.77,13.77],
  ["2026-06-03","AMD","exit",3,526.41,268.28],
  ["2026-06-03","DRAM","exit",7,68.71,104.87],
  ["2026-06-03","NVDA","trim",1,215.01,60.84],
];

const ACTIONS = [
  { sev:"red", icon:Clock, imp:"ORCL reports in 4 days — hold into the print",
    det:["Q4 FY26 · after close Jun 10 · 3 of last 4 beats. AI-demand referendum post-selloff."], cmd:"scenario ORCL", cta:"scenario" },
  { sev:"amber", icon:AlertTriangle, imp:"NVDA ~21% of NAV — over the 20% ceiling",
    det:["Hold vs trim. Macro: trim to 18–20% pre-FOMC to cut tail risk + free capital."], cmd:"scenario NVDA", cta:"scenario" },
  { sev:"green", icon:Trophy, imp:"MRVL + APLD past +40% — win reviews due",
    det:["Log the reviews, don't auto-trim. Jun 5: MRVL +45.9% · APLD +46.5%."], cmd:"reviews", cta:"reviews" },
  { sev:"info", icon:Target, imp:"AVGO below cost and below the dip zone",
    det:["$393 vs $424.53 cost · zone $410–420 · PT $463/$582. Strongest add — but dry powder ~$0."], cmd:"scenario AVGO", cta:"scenario" },
];

const FLIGHT = [
  ["quick dash","daily snapshot",Gauge],
  ["dip check","owned vs dip zones",TrendingDown],
  ["scenario","bull / base / bear",GitBranch],
  ["ledger","full position table",Table],
  ["eod","end-of-day recap",Moon],
];

const CATS = [
  ["portfolio",[["quick dash","daily driver",Gauge,null],["ledger","positions",Table,null],["engine","capital efficiency",Cpu,null],["nav curve","equity curve",LineChart,null]]],
  ["analysis",[["dip check","oversold scan",TrendingDown,null],["scenario","bull / base / bear",GitBranch,["1","neg"]],["blindspots","3 fresh names",Search,null],["news","ticker headlines",Newspaper,null]]],
  ["planning",[["gameplan","live + standing",ClipboardList,null],["weekly","week ahead",Calendar,null],["reviews","win / loss due",ClipboardCheck,["2","warn"]],["exit","trim / sell plan",LogOut,null]]],
  ["system",[["sync","state check",RefreshCw,null],["todo","workstream",ListChecks,null],["system","health check",Settings,null],["GNF","close + sync",Moon,null]]],
];

const TABS = [
  ["home","home",LayoutDashboard],["positions","positions",List],["watchlist","watchlist",Eye],
  ["ledger","ledger",Table],["trades","trades",ArrowLeftRight],["earnings","earnings",Calendar],["scenario","scenario",GitBranch],
];

const EARN_UP = [
  ["Jul 22","NOW"],["Jul 29","APH"],["Jul 29","APLD"],["Aug 4","ANET"],["Aug 4","ETN"],
  ["Aug 13","AMAT"],["Aug 26","NVDA"],["Aug 27","MRVL"],["Sep 2","CRDO"],["Sep 3","AVGO"],
];
const EARN_WL = [["Jul 16","TSM"],["Jul 22","GEV"],["Jul 22","GOOGL"],["Jul 27","CLS"]];

const POST_SELL = [
  { t:"DRAM", date:"Jun 3", px:68.71, pnl:105, zone:"$55–57", grp:"active", days:"27d" },
  { t:"MDA",  date:"sold flat", px:44.80, pnl:0, zone:"$38", grp:"active", days:"—" },
  { t:"AMD",  date:"Jun 3", px:526.41, pnl:268, zone:"pullback · TBD", grp:"active", days:"27d" },
  { t:"HOOD", date:"May 15", px:78.05, pnl:289, zone:null, grp:"mon", days:"8d" },
  { t:"MU",   date:"May 18", px:724.80, pnl:176, zone:null, grp:"mon", days:"11d" },
  { t:"CEG",  date:"Jun 1", px:269.49, pnl:-37, zone:null, grp:"mon", days:"25d" },
  { t:"NU",   date:"Jun 1", px:12.98, pnl:0, zone:null, grp:"mon", days:"25d" },
];

const fmt = (n) => "$" + Number(n).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2});
const fmt0 = (n) => "$" + Math.round(n).toLocaleString();
const convCls = (c) => c===5?"c5":c===4?"c4":"c3";
const aqCls = (s) => ({red:"aq-red",amber:"aq-amber",green:"aq-green",info:"aq-info"}[s]);

export default function FinnCockpit(){
  const [tab,setTab] = useState("home");
  const [route,setRoute] = useState("live watch");
  const [prices,setPrices] = useState({});
  const [status,setStatus] = useState("seed"); // seed | pulling | live | error
  const [cmd,setCmd] = useState("");
  const [detailTk,setDetailTk] = useState(null);
  const [ledgerSort,setLedgerSort] = useState({col:"tier",dir:"desc"});
  const hasLive = Object.keys(prices).length>0;

  useEffect(()=>{ (async()=>{
    try{ const r = await window.storage.get("finn-prices"); if(r){ const o=JSON.parse(r.value); if(o&&o.p){ setPrices(o.p); setStatus("live"); } } }catch(e){}
  })(); },[]);

  const send = (t)=>{ try{ if(typeof window.sendPrompt==="function") window.sendPrompt(t); }catch(e){} };

  async function pullLive(){
    setStatus("pulling");
    try{
      const tk = POS.map(p=>p.t).join(", ");
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST", headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          messages:[{role:"user", content:`Use the FMP tool (quote endpoint) to get the current price for each of these tickers: ${tk}. Respond with ONLY a JSON object mapping each ticker symbol to its latest price as a number. No prose, no markdown fences. Example: {"NVDA":207.14,"AVGO":255.4}`}],
          mcp_servers:[{type:"url", url:"https://financialmodelingprep.com/mcp", name:"FMP"}]
        })
      });
      const data = await res.json();
      const text = (data.content||[]).filter(b=>b.type==="text").map(b=>b.text).join("").replace(/```json|```/g,"").trim();
      const obj = JSON.parse(text);
      const clean = {}; Object.keys(obj).forEach(k=>{ const v=Number(obj[k]); if(!isNaN(v)) clean[k.toUpperCase()]=v; });
      if(Object.keys(clean).length){ setPrices(clean); setStatus("live"); try{ await window.storage.set("finn-prices",JSON.stringify({t:Date.now(),p:clean})); }catch(e){} }
      else setStatus("error");
    }catch(e){ setStatus("error"); }
  }

  const navLive = hasLive ? POS.reduce((s,p)=> s + p.sh*(prices[p.t]||0),0) + CASH : null;
  const navShow = navLive!=null ? navLive : BROKER_NAV;
  const navTag = navLive!=null ? "live" : "broker";
  const pct50 = (BROKER_NAV/50000*100).toFixed(1);
  const pnlPct = (p)=> prices[p.t]!=null ? ((prices[p.t]-p.cost)/p.cost*100) : null;
  const px = (t)=> prices[t]!=null ? fmt(prices[t]) : "—";
  const pp = (v)=> v==null ? <span style={{color:"var(--ink3)"}}>—</span> : <span className={v>=0?"pos":"neg"}>{(v>=0?"+":"")+v.toFixed(1)+"%"}</span>;
  const parseZone = (e)=>{ if(!e) return null; const n=(e.match(/[\d.]+/g)||[]).map(Number); if(!n.length) return null; if(e.includes("<")) return [0,n[0]]; if(n.length>=2) return [n[0],n[1]]; return [n[0]*0.97,n[0]]; };
  const zoneState = (t,e)=>{ const pr=prices[t]; const z=parseZone(e); if(pr==null||!z) return null; if(pr>=z[0]&&pr<=z[1]) return "in"; if(pr>z[1]&&pr<=z[1]*1.05) return "near"; return null; };

  const Stat = ({l,v,sub,cls,big,bar}) => (
    <div className="fv-stat">
      <div className="l">{l}</div>
      <div className={(big?"big ":"v ")+(cls||"")}>{v}</div>
      {bar!=null && <div className="fv-mbar"><i style={{width:bar+"%"}}/></div>}
      {sub && <div className={"sub "+(cls||"")}>{sub}</div>}
    </div>
  );

  const PullPill = () => {
    if(status==="pulling") return <span className="fv-pill pill-pull"><RefreshCw size={12} className="spin"/> pulling…</span>;
    if(status==="live") return <span className="fv-pill pill-ok"><Check size={12}/> live</span>;
    if(status==="error") return <span className="fv-pill pill-warn" onClick={pullLive} style={{cursor:"pointer"}}><AlertTriangle size={12}/> feed — retry</span>;
    return <span className="fv-pill pill-pull" onClick={pullLive} style={{cursor:"pointer"}}><RefreshCw size={12}/> pull live (FMP)</span>;
  };

  return (
    <div className="ck">
      <style>{CSS}</style>

      <div className="ck-chrome">
        <span className="ck-bc">FINN / <b>control center</b></span>
        <span className="ck-cr">
          <button className="fv-btn fv-btn--tertiary" onClick={()=>send("guide")}><Search size={13}/>guide</button>
          <button className="fv-btn fv-btn--tertiary" onClick={()=>send("GMF")}>GMF</button>
          <span className="fv-pill pill-ok"><Check size={12}/> synced</span>
        </span>
      </div>

      <div className="ck-tabs">
        {TABS.map(([id,label,Icon])=>(
          <button key={id} className={"ck-tab"+(tab===id?" on":"")} onClick={()=>setTab(id)}>
            <Icon size={14}/>{label}
          </button>
        ))}
      </div>

      {tab==="home" && (
        <div>
          <div className="fresh">
            <span className="fl">portfolio</span>
            <PullPill/>
          </div>
          <div className="fv-strip">
            <Stat l="NAV" v={fmt0(navShow)} sub={navTag==="live"?"live · FMP":"broker mark · Jun 6"} cls={navTag==="live"?"":""} big/>
            <Stat l="→ $50K" v={pct50+"%"} cls="" bar={Number(pct50)} />
            <Stat l="realized" v={"+"+fmt0(REALIZED)} cls="pos" sub="14 trades"/>
            <Stat l="scores" v="2d" sub="rescore Jun 8"/>
            <Stat l="next earn" v="ORCL 4d" cls="neg" sub="Jun 10 a/c"/>
          </div>
          <div className="barcap"><span>{pct50}% to $50,000</span><span>inception $27.5K · HWM $32,030</span></div>

          <div className="sec"><Zap size={13}/>needs attention</div>
          <div className="aq">
            {ACTIONS.map((a,i)=>{ const Ic=a.icon; return (
              <div className="fv-row" key={i} onClick={()=>send(a.cmd)}>
                <span className={"fv-ic "+aqCls(a.sev)}><Ic size={17}/></span>
                <div className="abody"><div className="aimp">{a.imp}</div><div className="adet">{a.det}</div></div>
                <button className="cta" onClick={(e)=>{e.stopPropagation();send(a.cmd);}}>{a.cta} ↗</button>
              </div>
            );})}
            <span className="seeall" onClick={()=>send("alerts")}>see all (5) → alerts ↗</span>
          </div>

          <div className="sec"><Command size={13}/>jump anywhere</div>
          <div className="fv-group">
            <input className="fv-field" placeholder="command or ticker…" value={cmd}
              onChange={e=>setCmd(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"&&cmd.trim()){ send(cmd.trim()); setCmd(""); } }}/>
            <button className="fv-btn fv-btn--primary" onClick={()=>{ if(cmd.trim()){ send(cmd.trim()); setCmd(""); } }}>Go ↗</button>
          </div>
          <div className="cmdhint">try: dip check · scenario nvda · ledger · news on crdo</div>

          <div className="sec"><LayoutGrid size={13}/>jump to position</div>
          <div className="segbar">
            {["live watch","report","scenario","news on"].map(r=>(
              <span key={r} className={"fv-seg"+(route===r?" on":"")} onClick={()=>setRoute(r)}>{r==="news on"?"news":r}</span>
            ))}
          </div>
          <div className="chips">
            {POS.map(p=>(
              <span key={p.t} className={"fv-chip "+convCls(p.conv)} onClick={()=>send(route+" "+p.t)}>
                {p.t}{prices[p.t]!=null && <span className="pxv">{fmt(prices[p.t])}</span>}
              </span>
            ))}
          </div>

          <div className="sec"><Flame size={13}/>fired today</div>
          <div className="fv-co-chip" onClick={()=>send("scenario ORCL")}>
            <GitBranch size={16} style={{color:"var(--info)"}}/>
            <span className="t"><b>Scenario auto-fired</b> — <span className="tk">ORCL</span>, earnings in 4 days</span>
            <span className="fx">open ↗</span>
          </div>

          <div className="sec"><Plane size={13}/>flight deck</div>
          {FLIGHT.map(([c,d,Ic])=>(
            <div className="fv-row" key={c} onClick={()=>send(c)}>
              <span className="fv-ic"><Ic size={15}/></span>
              <div><div className="nm">{c}</div></div>
              <span className="frn">{d}</span><ChevronRight size={15} className="chev"/>
            </div>
          ))}

          <div className="sec"><LayoutGrid size={13}/>everything</div>
          {CATS.map(([label,tiles])=>(
            <div key={label}>
              <div className="catlabel">{label}</div>
              <div className="fv-grid">
                {tiles.map(([c,d,Ic,badge])=>(
                  <span key={c} className="fv-tile" onClick={()=>send(c)}>
                    {badge && <span className={"tb "+(badge[1]==="neg"?"tb-neg":"tb-warn")}>{badge[0]}</span>}
                    <Ic size={22} className="tic"/>
                    <span className="tn">{c}</span><span className="td">{d}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="positions" && (detailTk ? (()=>{
        const dp = POS.find(p=>p.t===detailTk); if(!dp) return null;
        const pr = prices[dp.t]; const mv = pr!=null?dp.sh*pr:null; const wt = mv!=null?(mv/navShow*100):null;
        const prog = (pr!=null&&dp.ptH)?Math.max(0,Math.min(1,(pr-dp.cost)/(dp.ptH-dp.cost))):null;
        const acts = TRADES.filter(r=>r[1]===dp.t).reverse();
        return (
        <div>
          <div style={{display:"flex",gap:7,marginBottom:11,flexWrap:"wrap"}}>
            <button className="fv-btn fv-btn--tertiary" onClick={()=>setDetailTk(null)}>← positions</button>
            <button className="fv-btn fv-btn--secondary" onClick={()=>send("scenario "+dp.t)}>scenario ↗</button>
            <button className="fv-btn fv-btn--tertiary" onClick={()=>send("news on "+dp.t)}>news ↗</button>
            <button className="fv-btn fv-btn--tertiary" onClick={()=>send("live watch "+dp.t)}>live watch ↗</button>
          </div>
          <div className={"pcard "+convCls(dp.conv)} style={{borderLeftWidth:3}}>
            <div className="ph">
              <div><div className="tkn">{dp.t}<span style={{fontFamily:"var(--mono)",fontSize:9,fontWeight:700,padding:"1px 5px",borderRadius:4,marginLeft:7,background:"var(--accdim)",color:"var(--acc2)",verticalAlign:"middle"}}>C{dp.conv}</span></div><div className="nm">{dp.name} · {dp.sec}</div></div>
              <div style={{textAlign:"right"}}><div className="px">{px(dp.t)}</div><div style={{fontSize:13,marginTop:2}}>{pp(pnlPct(dp))}{pr!=null?<span className={pnlPct(dp)>=0?"pos":"neg"} style={{fontFamily:"var(--mono)",fontSize:12}}> · {(pnlPct(dp)>=0?"+":"−")+"$"+Math.abs((pr-dp.cost)*dp.sh).toLocaleString(undefined,{maximumFractionDigits:0})}</span>:null}</div></div>
            </div>
            <div className="fv-strip" style={{marginTop:12}}>
              <div className="fv-stat"><div className="l">shares</div><div className="v">{dp.sh}</div></div>
              <div className="fv-stat"><div className="l">cost</div><div className="v">{fmt(dp.cost)}</div></div>
              <div className="fv-stat"><div className="l">mkt val</div><div className="v">{mv!=null?fmt0(mv):"—"}</div></div>
              <div className="fv-stat"><div className="l">weight</div><div className="v">{wt!=null?wt.toFixed(1)+"%":"—"}</div></div>
              <div className="fv-stat"><div className="l">CS</div><div className="v">{dp.cs}</div></div>
              <div className="fv-stat"><div className="l">MS</div><div className="v" style={{color:"var(--ms)"}}>{dp.ms}</div></div>
              <div className="fv-stat"><div className="l">PT</div><div className="v">{dp.ptL?(dp.ptL===dp.ptH?fmt0(dp.ptL):fmt0(dp.ptL)+"/"+fmt0(dp.ptH)):"—"}</div></div>
              <div className="fv-stat"><div className="l">dip zone</div><div className="v">{dp.dipL?("$"+dp.dipL+"–"+dp.dipH):"—"}</div></div>
            </div>
            {prog!=null && <div style={{marginTop:12}}><div style={{display:"flex",justifyContent:"space-between",fontFamily:"var(--mono)",fontSize:10,color:"var(--ink3)",marginBottom:5}}><span>cost {fmt(dp.cost)}</span><span>{(prog*100).toFixed(0)}% to PT</span><span>PT {fmt0(dp.ptH)}</span></div><div className="fv-mbar"><i style={{width:(prog*100)+"%"}}/></div></div>}
            <div style={{marginTop:12,display:"flex",gap:5,flexWrap:"wrap"}}>
              {dp.t==="ORCL" && <span className="fv-tag earn">EARN 4d</span>}
              {wt!=null&&wt>20 && <span className="fv-tag conc">CEILING</span>}
              {pnlPct(dp)!=null&&pnlPct(dp)>=40 && <span className="fv-tag win">WIN +40%</span>}
              {pr!=null&&dp.dipL&&pr>=dp.dipL&&pr<=dp.dipH && <span className="fv-tag dip">IN ZONE</span>}
            </div>
          </div>
          {acts.length>0 && <div><div className="sec" style={{margin:"14px 0 7px"}}>recent activity</div>
            {acts.map((r,i)=>(<div key={i} style={{display:"flex",justifyContent:"space-between",fontFamily:"var(--mono)",fontSize:11,color:"var(--ink2)",padding:"5px 0",borderTop:i>0?"1px solid rgba(255,255,255,.045)":"none"}}><span><span style={{color:"var(--ink3)"}}>{r[0].slice(5)}</span> &nbsp;{r[2]} {r[3]}sh</span><span>@ {fmt(r[4])}</span></div>))}
          </div>}
          <div style={{background:"var(--accdim)",border:"1px solid var(--acc)",borderRadius:10,padding:"11px 13px",marginTop:13}}>
            <div style={{fontFamily:"var(--mono)",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",color:"var(--acc2)",marginBottom:6}}>decision</div>
            <div style={{fontSize:12,color:"#cdd2d9",lineHeight:1.5}}>The full bull / base / bear call + verdict is generated on the scenario page. <span onClick={()=>send("scenario "+dp.t)} style={{color:"var(--acc2)",cursor:"pointer",fontWeight:600}}>Open scenario({dp.t}) →</span></div>
          </div>
        </div>);
      })() : (
        <div>
          <div className="fresh"><span className="fl">12 positions · tap a card for detail</span><PullPill/></div>
          {[5,4,3].map(tier=>(
            <div key={tier}>
              <div className="catlabel">conviction {tier}</div>
              <div className="cards">
                {POS.filter(p=>p.conv===tier).map(p=>(
                  <div key={p.t} className={"pcard "+convCls(p.conv)} onClick={()=>setDetailTk(p.t)} style={{cursor:"pointer"}}>
                    <div className="ph"><div><div className="tkn">{p.t}</div><div className="nm">{p.name}</div></div>
                      <div style={{textAlign:"right"}}><div className="px">{px(p.t)}</div><div style={{fontSize:11,marginTop:2}}>{pp(pnlPct(p))}</div></div></div>
                    <div className="ms"><span>CS <b>{p.cs}</b></span><span style={{color:"var(--ms)"}}>MS <b style={{color:"var(--ms)"}}>{p.ms}</b></span><span>{p.sh} sh</span></div>
                    <div className="row2"><span>cost {fmt(p.cost)}</span><span>PT {p.ptL?(p.ptL===p.ptH?fmt0(p.ptL):fmt0(p.ptL)+"/"+fmt0(p.ptH)):"—"}</span></div>
                    <div style={{marginTop:8,display:"flex",gap:5}}>
                      {p.t==="ORCL" && <span className="fv-tag earn">EARN 4d</span>}
                      {p.t==="NVDA" && <span className="fv-tag conc">CEIL</span>}
                      {(p.t==="MRVL"||p.t==="APLD") && <span className="fv-tag win">WIN</span>}
                      {p.t==="AVGO" && <span className="fv-tag dip">&lt; ZONE</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}

      {tab==="watchlist" && (
        <div>
          <div className="sec"><Eye size={13}/>radar · T1</div>
          <div className="cards">
            {T1.map(w=>(
              <div key={w.t} className="pcard c4" style={{borderLeftColor:"var(--info)"}}>
                <div className="ph"><div><div className="tkn">{w.t}</div><div className="nm">{w.name}</div></div></div>
                <div className="ms"><span>CS <b>{w.cs}</b></span><span style={{color:"var(--ms)"}}>MS <b style={{color:"var(--ms)"}}>{w.ms}</b></span></div>
                <div style={{fontSize:11,color:"var(--ink2)",marginTop:8,lineHeight:1.45}}>{w.note}</div>
              </div>
            ))}
          </div>
          <div className="sec"><Eye size={13}/>radar · T2</div>
          <div className="chips">
            {T2.map(([t,e])=>(
              <span key={t} className="fv-chip neu" onClick={()=>send("news on "+t)} style={zoneState(t,e)==="in"?{borderColor:"var(--pos)",color:"#bfe8cf"}:zoneState(t,e)==="near"?{borderColor:"var(--warn)"}:undefined}>{t}{e && <span className="pxv">{e}</span>}{zoneState(t,e)==="in" && <span style={{fontFamily:"var(--mono)",fontSize:8.5,fontWeight:700,color:"var(--pos)",marginLeft:5}}>IN ZONE</span>}{zoneState(t,e)==="near" && <span style={{fontFamily:"var(--mono)",fontSize:8.5,fontWeight:700,color:"var(--warn)",marginLeft:5}}>NEAR</span>}</span>
            ))}
          </div>
          <div className="sec"><RefreshCw size={13}/>post-sell monitor · 30d re-entry</div>
          {["active","mon"].map(g=>(
            <div key={g}>
              <div className="catlabel">{g==="active"?"active re-entry":"monitor-only · tracking"}</div>
              {POST_SELL.filter(p=>p.grp===g).map(p=>(
                <div key={p.t} className="fv-row" style={{borderLeft:g==="active"?"3px solid var(--pos)":"3px solid var(--line2)",cursor:p.zone?"pointer":"default"}} onClick={p.zone?(()=>send("news on "+p.t)):undefined}>
                  <span style={{fontFamily:"var(--mono)",fontSize:13,fontWeight:700,color:"var(--ink)",width:48,flexShrink:0}}>{p.t}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--ink2)"}}><span style={{color:"var(--ink3)"}}>exited {p.date} ·</span> {fmt(p.px)} {p.pnl!==0 && <span className={p.pnl>=0?"pos":"neg"}>{(p.pnl>=0?"+":"−")+"$"+Math.abs(p.pnl)}</span>}</div>
                    <div style={{fontFamily:"var(--mono)",fontSize:11,marginTop:2,color:p.zone?"var(--pos)":"var(--ink3)"}}>{p.zone?("re-entry "+p.zone):"no re-entry zone"}</div>
                  </div>
                  <div style={{textAlign:"right",fontFamily:"var(--mono)",fontSize:11,color:"var(--ink3)",flexShrink:0}}>{p.days}{p.days!=="—"?" left":""}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {tab==="ledger" && (()=>{
        const lval=(p,col)=>{ const pr=prices[p.t]; const mv=pr!=null?p.sh*pr:null;
          switch(col){case"pnl":return pnlPct(p);case"mktval":return mv;case"weight":return mv;case"price":return pr!=null?pr:null;case"cost":return p.cost;case"cs":return p.cs;case"ms":return p.ms;case"sh":return p.sh;default:return null;} };
        const sortBy=(col)=>setLedgerSort(s=>s.col===col?{col,dir:s.dir==="desc"?"asc":"desc"}:{col,dir:"desc"});
        const ar=(col)=> ledgerSort.col===col ? (ledgerSort.dir==="desc"?" ▾":" ▴") : "";
        const hp={cursor:"pointer"};
        const sorted = ledgerSort.col!=="tier" ? [...POS].sort((a,b)=>{const av=lval(a,ledgerSort.col),bv=lval(b,ledgerSort.col); if(av==null&&bv==null)return 0; if(av==null)return 1; if(bv==null)return -1; return ledgerSort.dir==="desc"?bv-av:av-bv;}) : null;
        const row=(p)=>{ const mv=prices[p.t]!=null?p.sh*prices[p.t]:null; const wt=mv!=null?(mv/navShow*100):null;
          return (<tr key={p.t} onClick={()=>{setDetailTk(p.t);setTab("positions");}} style={{cursor:"pointer"}}>
            <td>{p.t}</td><td><span className={"cbadge cb"+p.conv}>C{p.conv}</span></td>
            <td>{p.sh}</td><td>{fmt(p.cost)}</td><td>{px(p.t)}</td><td>{pp(pnlPct(p))}</td>
            <td>{mv!=null?fmt0(mv):<span style={{color:"var(--ink3)"}}>—</span>}</td>
            <td>{wt!=null?wt.toFixed(1)+"%":<span style={{color:"var(--ink3)"}}>—</span>}</td>
            <td style={{color:"var(--ink)"}}>{p.cs}</td><td style={{color:"var(--ms)"}}>{p.ms}</td>
            <td>{p.t==="ORCL"?"EARN":p.t==="NVDA"?"CEIL":(p.t==="MRVL"||p.t==="APLD")?"WIN":p.t==="AVGO"?"DIP":"—"}</td>
          </tr>); };
        return (
        <div>
          <div className="fresh"><span className="fl">position ledger · {ledgerSort.col==="tier"?"conviction → mkt value":"sorted by "+ledgerSort.col+" "+ledgerSort.dir}</span><PullPill/></div>
          <div style={{overflowX:"auto"}}>
            <table className="tbl">
              <thead><tr>
                <th onClick={()=>setLedgerSort({col:"tier",dir:"desc"})} style={hp}>ticker{ledgerSort.col==="tier"?" ▾":""}</th>
                <th>conv</th>
                <th onClick={()=>sortBy("sh")} style={hp}>sh{ar("sh")}</th>
                <th onClick={()=>sortBy("cost")} style={hp}>cost{ar("cost")}</th>
                <th onClick={()=>sortBy("price")} style={hp}>price{ar("price")}</th>
                <th onClick={()=>sortBy("pnl")} style={hp}>P&amp;L%{ar("pnl")}</th>
                <th onClick={()=>sortBy("mktval")} style={hp}>mkt val{ar("mktval")}</th>
                <th onClick={()=>sortBy("weight")} style={hp}>wt{ar("weight")}</th>
                <th onClick={()=>sortBy("cs")} style={hp}>CS{ar("cs")}</th>
                <th onClick={()=>sortBy("ms")} style={hp}>MS{ar("ms")}</th>
                <th>flags</th>
              </tr></thead>
              <tbody>
                {ledgerSort.col==="tier"
                  ? [5,4,3].map(tier=>([<tr className="tier-sep" key={"s"+tier}><td colSpan={11}>conviction {tier}</td></tr>, ...POS.filter(p=>p.conv===tier).map(row)]))
                  : sorted.map(row)}
              </tbody>
            </table>
          </div>
          <div className="cmdhint">tap a header to sort · tap the row to open its detail · price-dependent sorts (P&amp;L / mkt val / wt) need a live pull.</div>
        </div>);
      })()}

      {tab==="trades" && (
        <div>
          <div className="fv-strip" style={{marginBottom:11}}>
            <Stat l="realized" v={"+"+fmt0(REALIZED)} cls="pos"/>
            <Stat l="trades" v="14"/>
            <Stat l="win rate" v="86%" sub="12 / 14"/>
            <Stat l="best" v="+$490" cls="pos" sub="NVDA 05/18"/>
          </div>
          <div style={{overflowX:"auto"}}>
            <table className="tbl">
              <thead><tr><th>date</th><th>ticker</th><th>action</th><th>sh</th><th>avg sell</th><th>realized</th></tr></thead>
              <tbody>
                {TRADES.map((r,i)=>(
                  <tr key={i}>
                    <td style={{color:"var(--ink3)",fontWeight:400}}>{r[0].slice(5)}</td>
                    <td>{r[1]}</td>
                    <td style={{textAlign:"right"}}><span style={{color:r[2]==="trim"?"var(--warn)":"var(--info)"}}>{r[2]}</span></td>
                    <td>{r[3]}</td><td>{fmt(r[4])}</td>
                    <td className={r[5]>=0?"pos":"neg"}>{(r[5]>=0?"+":"")+fmt(Math.abs(r[5])).replace("$",r[5]<0?"-$":"$")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="cmdhint">oldest → newest. Realized total reconciled $2,410.60 (final).</div>
        </div>
      )}

      {tab==="earnings" && (
        <div>
          <div className="sec"><Calendar size={13}/>imminent · &lt;7d</div>
          <div className="fv-row" style={{cursor:"default"}}>
            <span className="fv-ic aq-red"><Clock size={17}/></span>
            <div className="abody"><div className="aimp">ORCL — Jun 10, after close (4d)</div>
              <div className="adet">Q4 FY26 · EPS est $1.96 · last 4: beat · big beat · slight miss · beat (3/4). Hold into the print.</div></div>
            <button className="cta" onClick={()=>send("scenario ORCL")}>scenario ↗</button>
          </div>
          <div className="sec"><Calendar size={13}/>owned · upcoming</div>
          <div style={{fontSize:11.5,color:"var(--ink2)",marginBottom:9,lineHeight:1.45}}>After ORCL, ~6 weeks quiet — then the Q2 cluster lands tight:</div>
          <div style={{overflowX:"auto"}}>
            <table className="tbl"><thead><tr><th>date</th><th>ticker</th><th>conv</th></tr></thead><tbody>
              {EARN_UP.map((r,i)=>{ const p=POS.find(x=>x.t===r[1]); return (
                <tr key={i}><td style={{color:"var(--ink3)",fontWeight:400}}>{r[0]}</td><td>{r[1]}</td>
                  <td>{p?<span className={"cbadge cb"+p.conv}>C{p.conv}</span>:""}</td></tr>); })}
            </tbody></table>
          </div>
          <div className="sec"><Eye size={13}/>watchlist · upcoming</div>
          <div className="chips">{EARN_WL.map(([d,t])=>(<span key={t} className="fv-chip neu" style={{cursor:"default"}}>{t}<span className="pxv">{d}</span></span>))}</div>
          <div className="cmdhint">dates web-sourced into FINN_STATE.json · confirm vs IR as each enters the &lt;7d window.</div>
        </div>
      )}

      {tab==="scenario" && (
        <div>
          <div className="sec"><GitBranch size={13}/>scenario · ORCL · Q4 FY26 (Jun 10 a/c)</div>
          <div className="scn">
            <div className="scn-box scn-bull"><div className="sh"><span>bull</span><span>35%</span></div>
              <div className="sd">Cloud/OCI re-accelerates, RPO backlog beats, AI-capacity demand reaffirmed. Re-rates toward PT $261.</div>
              <div className="sp">→ $250+</div></div>
            <div className="scn-box scn-base"><div className="sh"><span>base</span><span>45%</span></div>
              <div className="sd">In-line beat, guidance steady. 3-of-4 beat streak holds; muted reaction in a jittery tape.</div>
              <div className="sp">→ $205–225</div></div>
            <div className="scn-box scn-bear"><div className="sh"><span>bear</span><span>20%</span></div>
              <div className="sd">Capex guide spooks, margin pressure, AI-demand doubts confirmed post-AVGO. Tests dip zone $185–190.</div>
              <div className="sp">→ $185</div></div>
          </div>
          <div className="fv-co-box"><div className="bh">▸ verdict</div>
            <div className="bd"><b>Hold the 5 shares into the print.</b> Confirm exact date vs IR. Smallest position (C3), so event risk is contained; a bull outcome is a read-through to the whole AI-software/infra book post-selloff. No add — dry powder ~$0.</div></div>
        </div>
      )}

    </div>
  );
}
