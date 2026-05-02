// ─── Obstacle (laundry item) definitions ─────────────────────────────────
const OBSTACLE_DEFS = [
  { type:'towel',  color:'#f0ebe0', stripe:'#c8b8a0', w:95,  h:62  },
  { type:'towel',  color:'#7ab8d8', stripe:'#5090b8', w:95,  h:62  },
  { type:'towel',  color:'#e87060', stripe:'#c04040', w:95,  h:62  },
  { type:'shirt',  color:'#5888d0',                   w:90,  h:100 },
  { type:'shirt',  color:'#60b878',                   w:90,  h:100 },
  { type:'shirt',  color:'#e89040',                   w:90,  h:100 },
  { type:'hoodie', color:'#484858',                   w:90,  h:105 },
  { type:'hoodie', color:'#8040a0',                   w:90,  h:105 },
  { type:'pajama', color:'#c8d8f0', patCol:'#5070b0', w:82,  h:118 },
  { type:'pajama', color:'#f8e0a0', patCol:'#c08040', w:82,  h:118 },
];

// ─── Dispatcher ───────────────────────────────────────────────────────────
function createObstacleSVG(def, sfx) {
  switch (def.type) {
    case 'towel':  return _towelSVG(def, sfx);
    case 'shirt':  return _shirtSVG(def, sfx);
    case 'hoodie': return _hoodieSVG(def, sfx);
    case 'pajama': return _pajamaSVG(def, sfx);
    default: return '';
  }
}

// ─── Per-type SVG builders ────────────────────────────────────────────────
function _towelSVG(d, s) {
  const lines = [];
  for (let y = 11; y < 54; y += 9)
    lines.push(`<line x1="4" y1="${y}" x2="96" y2="${y}" stroke="rgba(0,0,0,0.11)" stroke-width="2.5"/>`);

  return `<svg viewBox="0 0 100 62" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block;overflow:visible">
  <defs>
    <filter id="of${s}"><feDropShadow dx="2" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.22)"/></filter>
    <clipPath id="oc${s}"><rect x="4" y="2" width="92" height="58" rx="7"/></clipPath>
  </defs>
  <rect x="4" y="2" width="92" height="58" rx="7" fill="${d.color}" filter="url(#of${s})"/>
  <g clip-path="url(#oc${s})">${lines.join('')}</g>
  <rect x="4" y="2"  width="92" height="11" rx="7" fill="${d.stripe}" opacity="0.60" clip-path="url(#oc${s})"/>
  <rect x="4" y="50" width="92" height="10" rx="7" fill="${d.stripe}" opacity="0.60" clip-path="url(#oc${s})"/>
  <line x1="50" y1="2" x2="50" y2="60" stroke="rgba(0,0,0,0.08)" stroke-width="1.5" stroke-dasharray="5,4" clip-path="url(#oc${s})"/>
  <rect x="4" y="2" width="92" height="58" rx="7" fill="none" stroke="rgba(0,0,0,0.10)" stroke-width="1.5"/>
</svg>`;
}

function _shirtSVG(d, s) {
  const P = 'M35,2 Q50,10 65,2 L90,18 Q95,20 95,27 L87,41 Q81,45 75,41 L75,90 Q75,96 68,96 L32,96 Q25,96 25,90 L25,41 Q19,45 13,41 L5,27 Q5,20 10,18 Z';

  return `<svg viewBox="0 0 100 98" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block;overflow:visible">
  <defs>
    <filter id="of${s}"><feDropShadow dx="2" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.25)"/></filter>
    <clipPath id="oc${s}"><path d="${P}"/></clipPath>
    <linearGradient id="og${s}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="rgba(0,0,0,0.16)"/>
      <stop offset="28%"  stop-color="rgba(0,0,0,0)"/>
      <stop offset="72%"  stop-color="rgba(0,0,0,0)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.18)"/>
    </linearGradient>
  </defs>
  <path d="${P}" fill="${d.color}" filter="url(#of${s})"/>
  <path d="M35,2 Q50,10 65,2 Q62,9 50,11 Q38,9 35,2 Z" fill="rgba(0,0,0,0.14)" clip-path="url(#oc${s})"/>
  <rect width="100" height="98" fill="url(#og${s})" clip-path="url(#oc${s})"/>
  <path d="M35,2 L65,2 Q62,7 50,9 Q38,7 35,2 Z" fill="rgba(255,255,255,0.18)" clip-path="url(#oc${s})"/>
  <path d="${P}" fill="none" stroke="rgba(0,0,0,0.11)" stroke-width="1.5"/>
</svg>`;
}

function _hoodieSVG(d, s) {
  const BODY = 'M22,28 L78,28 L92,20 Q96,20 96,28 L88,42 Q82,46 76,42 L76,92 Q76,98 68,98 L32,98 Q24,98 24,92 L24,42 Q18,46 12,42 L4,28 Q4,20 8,20 Z';
  const HOOD = 'M22,28 Q50,0 78,28 Q68,35 50,36 Q32,35 22,28 Z';
  const PCKT = 'M36,68 L64,68 Q67,68 67,72 L67,86 Q67,89 64,89 L36,89 Q33,89 33,86 L33,72 Q33,68 36,68 Z';

  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block;overflow:visible">
  <defs>
    <filter id="of${s}"><feDropShadow dx="2" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.25)"/></filter>
    <clipPath id="oc${s}"><path d="${BODY}"/></clipPath>
    <linearGradient id="og${s}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="rgba(0,0,0,0.18)"/>
      <stop offset="28%"  stop-color="rgba(0,0,0,0)"/>
      <stop offset="72%"  stop-color="rgba(0,0,0,0)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.20)"/>
    </linearGradient>
  </defs>
  <path d="${HOOD}" fill="${d.color}" opacity="0.80"/>
  <path d="${HOOD}" fill="rgba(0,0,0,0.18)"/>
  <path d="${BODY}" fill="${d.color}" filter="url(#of${s})"/>
  <rect width="100" height="100" fill="url(#og${s})" clip-path="url(#oc${s})"/>
  <path d="${PCKT}" fill="rgba(0,0,0,0.12)" clip-path="url(#oc${s})"/>
  <path d="${PCKT}" fill="none" stroke="rgba(0,0,0,0.18)" stroke-width="1.5" clip-path="url(#oc${s})"/>
  <line x1="50" y1="28" x2="50" y2="68" stroke="rgba(0,0,0,0.18)" stroke-width="1.5" clip-path="url(#oc${s})"/>
  <path d="${BODY}" fill="none" stroke="rgba(0,0,0,0.12)" stroke-width="1.5"/>
</svg>`;
}

function _pajamaSVG(d, s) {
  const PANTS = 'M4,0 L76,0 L76,108 Q76,115 68,115 L50,115 Q44,115 44,108 L44,52 L36,52 L36,108 Q36,115 30,115 L12,115 Q4,115 4,108 Z';
  const WAIST = 'M4,0 L76,0 L76,14 L4,14 Z';
  const lines = [];
  for (let y = 18; y < 115; y += 12)
    lines.push(`<line x1="4" y1="${y}" x2="76" y2="${y}" stroke="${d.patCol}" stroke-width="3" opacity="0.32"/>`);

  return `<svg viewBox="0 0 80 117" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;display:block;overflow:visible">
  <defs>
    <filter id="of${s}"><feDropShadow dx="2" dy="3" stdDeviation="3" flood-color="rgba(0,0,0,0.22)"/></filter>
    <clipPath id="oc${s}"><path d="${PANTS}"/></clipPath>
    <linearGradient id="og${s}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="rgba(0,0,0,0.14)"/>
      <stop offset="25%"  stop-color="rgba(0,0,0,0)"/>
      <stop offset="75%"  stop-color="rgba(0,0,0,0)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.16)"/>
    </linearGradient>
  </defs>
  <path d="${PANTS}" fill="${d.color}" filter="url(#of${s})"/>
  <g clip-path="url(#oc${s})">${lines.join('')}</g>
  <path d="${WAIST}" fill="rgba(0,0,0,0.15)" clip-path="url(#oc${s})"/>
  <line x1="4"  y1="5"  x2="76" y2="5"  stroke="rgba(255,255,255,0.40)" stroke-width="1.5" clip-path="url(#oc${s})"/>
  <line x1="4"  y1="9"  x2="76" y2="9"  stroke="rgba(255,255,255,0.40)" stroke-width="1.5" clip-path="url(#oc${s})"/>
  <line x1="40" y1="14" x2="40" y2="52" stroke="rgba(0,0,0,0.20)"       stroke-width="1.5" clip-path="url(#oc${s})"/>
  <rect width="80" height="117" fill="url(#og${s})" clip-path="url(#oc${s})"/>
  <path d="${PANTS}" fill="none" stroke="rgba(0,0,0,0.11)" stroke-width="1.5"/>
</svg>`;
}
