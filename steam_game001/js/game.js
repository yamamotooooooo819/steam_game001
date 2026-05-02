// ─── Game state ───────────────────────────────────────────────────────────
let socks     = [];
let selected  = [null, null];
let pairs     = 0;
let totalPairs = 0;
let misses    = 0;
let timerInterval = null;
let seconds   = 0;
let drag      = null;
let obstacles = [];

// ─── Initialisation ───────────────────────────────────────────────────────
function startGame() {
  clearInterval(timerInterval);
  seconds = 0; pairs = 0; misses = 0; selected = [null, null];
  document.getElementById('overlay').classList.remove('show');
  updateStats();

  const pairTypes = SOCK_TYPES.slice(0, 7);
  totalPairs = pairTypes.length;
  socks = [];
  let id = 0;
  pairTypes.forEach(t => {
    socks.push({ uid: id++, type: t, paired: false, selected: false });
    socks.push({ uid: id++, type: t, paired: false, selected: false });
  });
  socks.push({ uid: id++, type: LONELY, paired: false, selected: false, lonely: true });
  socks.sort(() => Math.random() - 0.5);

  const grid = document.getElementById('basket-grid');
  const W = (grid.offsetWidth || 260) - 14;
  const H = 360, SW = 62, SH = 78;

  socks.forEach(sock => {
    sock.px  = 6 + Math.random() * Math.max(0, W - SW - 6);
    sock.py  = 6 + Math.random() * Math.max(0, H - SH - 6);
    sock.rot = (Math.random() - 0.5) * 90;
    sock.zi  = Math.floor(Math.random() * 25) + 1;
  });

  obstacles = OBSTACLE_DEFS.map((def, i) => ({
    def,
    px:  4 + Math.random() * Math.max(0, W - def.w - 4),
    py:  4 + Math.random() * Math.max(0, H - def.h - 4),
    rot: (Math.random() - 0.5) * 50,
    zi:  Math.floor(Math.random() * 25) + 1,
    id:  i,
  }));

  document.getElementById('total-pairs').textContent = totalPairs;
  document.getElementById('pairs-grid').innerHTML =
    '<span style="color:#ccc;font-size:0.8rem;padding:4px;">まだなし</span>';
  resetSlots();
  renderBasket();

  timerInterval = setInterval(() => {
    seconds++;
    const m = Math.floor(seconds / 60), s = seconds % 60;
    document.getElementById('timer').textContent = `${m}:${s.toString().padStart(2, '0')}`;
  }, 1000);
}

// ─── Rendering ────────────────────────────────────────────────────────────
function renderBasket() {
  const grid = document.getElementById('basket-grid');
  grid.innerHTML = '';

  obstacles.forEach(ob => {
    const el = document.createElement('div');
    el.className = 'laundry-item';
    el.style.left   = ob.px + 'px';
    el.style.top    = ob.py + 'px';
    el.style.width  = ob.def.w + 'px';
    el.style.height = ob.def.h + 'px';
    el.style.zIndex = ob.zi;
    el.style.setProperty('--rot', ob.rot + 'deg');
    el.innerHTML = createObstacleSVG(ob.def, `o${ob.id}`);
    grid.appendChild(el);
  });

  socks.filter(s => !s.paired).forEach(sock => {
    const card = document.createElement('div');
    card.className = 'sock-card' + (sock.selected ? ' selected' : '');
    card.style.left   = sock.px + 'px';
    card.style.top    = sock.py + 'px';
    card.style.zIndex = sock.zi;
    card.style.setProperty('--rot', sock.rot + 'deg');
    card.innerHTML = createSockSVG(sock.type, `b${sock.uid}`);
    card.addEventListener('pointerdown', e => onSockDown(e, sock.uid));
    grid.appendChild(card);
  });
}

function updateSlots() {
  ['a', 'b'].forEach((slot, i) => {
    const el  = document.getElementById(`slot-${slot}`);
    const uid = selected[i];
    if (uid !== null) {
      const sock = socks.find(s => s.uid === uid);
      el.className = 'slot filled';
      el.innerHTML = `<div style="width:54px;height:64px">${createSockSVG(sock.type, `sl${slot}${uid}`)}</div>`
                   + `<button class="remove-btn" onclick="removeSock(${uid})">&#x2715;</button>`;
    } else {
      el.className = 'slot';
      el.innerHTML = '<span style="color:#ccc;font-size:1rem">?</span>';
    }
  });
}

function updateStats() {
  document.getElementById('pair-count').textContent = pairs;
  document.getElementById('miss-count').textContent = misses;
}

// ─── Drag & drop ──────────────────────────────────────────────────────────
function onSockDown(e, uid) {
  const sock = socks.find(s => s.uid === uid);
  if (!sock || sock.paired) return;
  e.preventDefault();

  const rect = e.currentTarget.getBoundingClientRect();
  const ox = e.clientX - rect.left;
  const oy = e.clientY - rect.top;

  const ghost = document.createElement('div');
  ghost.style.cssText = 'position:fixed;width:70px;height:88px;pointer-events:none;z-index:9999;opacity:0.92;';
  ghost.style.filter    = 'drop-shadow(5px 8px 12px rgba(0,0,0,0.45))';
  ghost.style.transform = `rotate(${sock.rot + 8}deg) scale(1.15)`;
  ghost.innerHTML = createSockSVG(sock.type, `dg${uid}`);
  document.body.appendChild(ghost);

  drag = { uid, ghost, ox, oy, sx: e.clientX, sy: e.clientY };
  positionGhost(e.clientX, e.clientY);

  document.addEventListener('pointermove',   onDragMove, { passive: false });
  document.addEventListener('pointerup',     onDragEnd);
  document.addEventListener('pointercancel', onDragEnd);
}

function positionGhost(cx, cy) {
  drag.ghost.style.left = (cx - drag.ox) + 'px';
  drag.ghost.style.top  = (cy - drag.oy) + 'px';
}

function onDragMove(e) {
  if (!drag) return;
  e.preventDefault();
  positionGhost(e.clientX, e.clientY);
  ['slot-a', 'slot-b'].forEach(id => {
    const r = document.getElementById(id).getBoundingClientRect();
    document.getElementById(id).classList.toggle('drag-over',
      e.clientX >= r.left && e.clientX <= r.right &&
      e.clientY >= r.top  && e.clientY <= r.bottom);
  });
}

function onDragEnd(e) {
  if (!drag) return;
  drag.ghost.remove();
  ['slot-a', 'slot-b'].forEach(id =>
    document.getElementById(id).classList.remove('drag-over'));

  const moved = Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy);
  const slot  = getSlotAt(e.clientX, e.clientY);

  if (slot) {
    dropOnSlot(drag.uid, slot);
  } else if (moved < 10) {
    selectSock(drag.uid);
  }

  drag = null;
  document.removeEventListener('pointermove',   onDragMove);
  document.removeEventListener('pointerup',     onDragEnd);
  document.removeEventListener('pointercancel', onDragEnd);
}

function getSlotAt(x, y) {
  for (const id of ['slot-a', 'slot-b']) {
    const r = document.getElementById(id).getBoundingClientRect();
    if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return id;
  }
  return null;
}

function dropOnSlot(uid, slotId) {
  const idx   = slotId === 'slot-a' ? 0 : 1;
  const other = 1 - idx;
  const sock  = socks.find(s => s.uid === uid);
  if (!sock || uid === selected[other]) return;

  if (selected[idx] !== null) {
    const prev = socks.find(s => s.uid === selected[idx]);
    if (prev) prev.selected = false;
  }

  sock.selected = true;
  selected[idx] = uid;

  renderBasket();
  updateSlots();
  document.getElementById('match-btn').disabled =
    selected.filter(s => s !== null).length < 2;
}

// ─── Selection (tap / click fallback) ────────────────────────────────────
function selectSock(uid) {
  const sock = socks.find(s => s.uid === uid);
  if (!sock || sock.paired) return;

  if (sock.selected) {
    sock.selected = false;
    if (selected[0] === uid) selected[0] = null;
    else selected[1] = null;
  } else {
    if (selected[0] === null) {
      selected[0] = uid; sock.selected = true;
    } else if (selected[1] === null && selected[0] !== uid) {
      selected[1] = uid; sock.selected = true;
    }
  }

  renderBasket();
  updateSlots();
  document.getElementById('match-btn').disabled =
    selected.filter(s => s !== null).length < 2;
}

function removeSock(uid) {
  const sock = socks.find(s => s.uid === uid);
  if (sock) sock.selected = false;
  if (selected[0] === uid) selected[0] = null;
  else if (selected[1] === uid) selected[1] = null;
  renderBasket();
  updateSlots();
  document.getElementById('match-btn').disabled = true;
}

function resetSlots() {
  selected = [null, null];
  updateSlots();
  document.getElementById('match-btn').disabled = true;
}

// ─── Match logic ──────────────────────────────────────────────────────────
function tryMatch() {
  const [uid1, uid2] = selected;
  if (uid1 === null || uid2 === null) return;
  const s1 = socks.find(s => s.uid === uid1);
  const s2 = socks.find(s => s.uid === uid2);

  if (s1.type.id === s2.type.id && !s1.lonely && !s2.lonely) {
    s1.paired = s2.paired = true;
    s1.selected = s2.selected = false;
    pairs++;

    const grid = document.getElementById('pairs-grid');
    if (grid.querySelector('span[style]')) grid.innerHTML = '';
    const chip = document.createElement('div');
    chip.className = 'pair-chip';
    const cid = Date.now();
    chip.innerHTML = `<div class="chip-sock">${createSockSVG(s1.type, `cp${cid}a`)}</div>`
                   + `<div class="chip-sock">${createSockSVG(s1.type, `cp${cid}b`)}</div>`;
    grid.appendChild(chip);

    showToast(`&#x2705; ${s1.type.name} のペア完成！`);
    resetSlots();
    renderBasket();
    updateStats();
    if (pairs >= totalPairs) setTimeout(showResult, 400);
  } else {
    misses++;
    updateStats();
    showToast('&#x274C; 違う！片割れだ…');
    s1.selected = s2.selected = false;
    selected = [null, null];
    renderBasket();
    resetSlots();
  }
}

// ─── UI helpers ───────────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.innerHTML = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 1800);
}

function showResult() {
  clearInterval(timerInterval);
  const m = Math.floor(seconds / 60), s = seconds % 60;
  document.getElementById('result-msg').textContent =
    `${totalPairs}ペア完成！ タイム: ${m}:${s.toString().padStart(2, '0')}　ミス: ${misses}回`;
  const badge = document.getElementById('lonely-badge');
  badge.style.display = 'block';
  badge.textContent = '🌸「謎の花柄」の片割れは永遠に見つかりませんでした';
  document.getElementById('overlay').classList.add('show');
}

// ─── Entry point ──────────────────────────────────────────────────────────
startGame();
