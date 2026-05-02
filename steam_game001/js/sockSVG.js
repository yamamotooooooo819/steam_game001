// ─── Sock type definitions ────────────────────────────────────────────────
const SOCK_TYPES = [
  { id:'A', name:'赤ボーダー',   base:'#d94f4f', cuff:'#b83a3a', toe:'#b83a3a', pat:'hstripes', patCol:'#ffffff' },
  { id:'B', name:'紺無地',       base:'#2b4590', cuff:'#1e3270', toe:'#1e3270', pat:'solid',    patCol:null },
  { id:'C', name:'黄色水玉',     base:'#f0c020', cuff:'#d8a010', toe:'#d8a010', pat:'dots',     patCol:'#c86018' },
  { id:'D', name:'緑チェック',   base:'#48a868', cuff:'#357a4c', toe:'#357a4c', pat:'check',    patCol:'#1a5c34' },
  { id:'E', name:'オレンジ縞',   base:'#e87040', cuff:'#c85020', toe:'#c85020', pat:'vstripes', patCol:'#ffffff' },
  { id:'F', name:'紫星柄',       base:'#7848b8', cuff:'#5830a0', toe:'#5830a0', pat:'stars',    patCol:'#f8d840' },
  { id:'G', name:'黒シンプル',   base:'#282828', cuff:'#141414', toe:'#141414', pat:'solid',    patCol:null },
  { id:'H', name:'白スポーツ',   base:'#ececec', cuff:'#d0d0d0', toe:'#d0d0d0', pat:'sport',    patCol:'#2b4590' },
];
const LONELY = {
  id:'X', name:'謎の花柄', lonely:true,
  base:'#f090b8', cuff:'#d86098', toe:'#d86098', pat:'flowers', patCol:'#d02878',
};

// ─── SVG shape paths (viewBox 0 0 80 100, side-profile, toe → right) ─────
const BODY_PATH = 'M8,0 L38,0 Q42,0 42,5 L42,60 Q42,72 54,78 L70,78 Q78,78 78,88 Q78,100 68,100 L15,100 Q3,98 2,88 Q0,76 8,65 Z';
const CUFF_PATH = 'M8,0 L38,0 Q42,0 42,5 L42,22 L8,22 Z';
const TOE_PATH  = 'M62,78 L70,78 Q78,78 78,88 Q78,100 68,100 L54,100 L54,78 Z';
const HEEL_PATH = 'M2,88 Q0,76 8,65 L14,69 Q8,78 8,88 Q9,96 16,100 L8,100 Q3,98 2,88 Z';

// ─── SVG generation ───────────────────────────────────────────────────────
function createSockSVG(t, sfx) {
  const ribs = [];
  for (let x = 12; x < 41; x += 5)
    ribs.push(`<line x1="${x}" y1="1" x2="${x}" y2="21" stroke="rgba(0,0,0,0.22)" stroke-width="1.5" stroke-linecap="round"/>`);

  let pDef = '', pFill = '';
  switch (t.pat) {
    case 'hstripes':
      pDef  = `<pattern id="p${sfx}" x="0" y="0" width="80" height="12" patternUnits="userSpaceOnUse"><rect width="80" height="6" fill="${t.patCol}" opacity="0.72"/></pattern>`;
      pFill = `url(#p${sfx})`; break;
    case 'vstripes':
      pDef  = `<pattern id="p${sfx}" x="0" y="0" width="10" height="100" patternUnits="userSpaceOnUse"><rect width="5" height="100" fill="${t.patCol}" opacity="0.60"/></pattern>`;
      pFill = `url(#p${sfx})`; break;
    case 'dots':
      pDef  = `<pattern id="p${sfx}" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="3.5" fill="${t.patCol}" opacity="0.88"/></pattern>`;
      pFill = `url(#p${sfx})`; break;
    case 'check':
      pDef  = `<pattern id="p${sfx}" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="${t.patCol}" opacity="0.42"/><rect x="8" y="8" width="8" height="8" fill="${t.patCol}" opacity="0.42"/></pattern>`;
      pFill = `url(#p${sfx})`; break;
    case 'stars':
      pDef  = `<pattern id="p${sfx}" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><text x="10" y="15" text-anchor="middle" font-size="13" fill="${t.patCol}">&#x2605;</text></pattern>`;
      pFill = `url(#p${sfx})`; break;
    case 'flowers':
      pDef  = `<pattern id="p${sfx}" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><text x="10" y="15" text-anchor="middle" font-size="12" fill="${t.patCol}">&#x273F;</text></pattern>`;
      pFill = `url(#p${sfx})`; break;
  }

  const sport = t.pat === 'sport' ? `
    <rect x="8" y="5"  width="34" height="4" fill="${t.patCol}" opacity="0.85" clip-path="url(#c${sfx})"/>
    <rect x="8" y="12" width="34" height="4" fill="${t.patCol}" opacity="0.85" clip-path="url(#c${sfx})"/>` : '';

  return `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block;overflow:visible">
  <defs>
    <clipPath id="c${sfx}"><path d="${BODY_PATH}"/></clipPath>
    ${pDef}
    <linearGradient id="g${sfx}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="rgba(0,0,0,0.20)"/>
      <stop offset="22%"  stop-color="rgba(0,0,0,0)"/>
      <stop offset="72%"  stop-color="rgba(0,0,0,0)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.25)"/>
    </linearGradient>
    <filter id="f${sfx}" x="-15%" y="-10%" width="140%" height="130%">
      <feDropShadow dx="2" dy="3" stdDeviation="3.5" flood-color="rgba(0,0,0,0.30)"/>
    </filter>
  </defs>
  <path d="${BODY_PATH}" fill="${t.base}" filter="url(#f${sfx})"/>
  ${pFill ? `<rect width="80" height="100" fill="${pFill}" clip-path="url(#c${sfx})"/>` : ''}
  ${sport}
  <path d="${TOE_PATH}"  fill="${t.toe}"  opacity="0.58" clip-path="url(#c${sfx})"/>
  <path d="${HEEL_PATH}" fill="rgba(0,0,0,0.18)" clip-path="url(#c${sfx})"/>
  <path d="${CUFF_PATH}" fill="${t.cuff}" opacity="0.40" clip-path="url(#c${sfx})"/>
  <g clip-path="url(#c${sfx})">${ribs.join('')}</g>
  <rect width="80" height="100" fill="url(#g${sfx})" clip-path="url(#c${sfx})"/>
  <path d="M8,0 L38,0 Q42,0 42,5 L42,32 Q26,26 14,18 L8,16 Z" fill="rgba(255,255,255,0.16)" clip-path="url(#c${sfx})"/>
  <path d="${BODY_PATH}" fill="none" stroke="rgba(0,0,0,0.13)" stroke-width="1.5"/>
</svg>`;
}
