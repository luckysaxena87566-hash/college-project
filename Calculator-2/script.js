

// ---- state ----
let cur     = '0';   // current value shown on display
let expr    = '';    // expression line (e.g. "12 ×")
let op      = '';    // pending operator: +  -  *  /
let prev    = '';    // operand before operator
let newNum  = true;  // whether next digit starts a fresh number

// ---- display update ----
function upd() {
  document.getElementById('disp').textContent = cur;
  document.getElementById('expr').textContent = expr;
}

// ---- digit & constant input ----
function appendInput(v) {
  if (v === 'π') { cur = String(Math.PI.toFixed(10)); newNum = false; upd(); return; }
  if (v === 'e') { cur = String(Math.E.toFixed(10));  newNum = false; upd(); return; }
  if (newNum || cur === '0') {
    cur    = v;
    newNum = false;
  } else {
    if (cur.length < 16) cur += v;
  }
  upd();
}

// ---- decimal point ----
function appendDot() {
  if (newNum) { cur = '0'; newNum = false; }
  if (!cur.includes('.')) cur += '.';
  upd();
}

// ---- operator ----
function appendOp(o) {
  if (op && !newNum) calculate(false);   // chain ops
  prev   = cur;
  op     = o;
  const sym = { '+': '+', '-': '−', '*': '×', '/': '÷' }[o];
  expr   = cur + ' ' + sym;
  newNum = true;
  upd();
}

// ---- AC ----
function clearAll() {
  cur    = '0';
  expr   = '';
  op     = '';
  prev   = '';
  newNum = true;
  document.getElementById('hist').textContent = '';
  upd();
}

// ---- +/− toggle ----
// function toggleSign() {
//   cur = String(parseFloat(cur) * -1);
//   upd();
// }
function toggleSign() {
  if (cur.length > 1 && !newNum) cur = cur.slice(0, -1);
  else cur = '0';
  upd();
}

// ---- % ----
function percent() {
  if (op && prev) {
    cur = String(parseFloat(prev) * parseFloat(cur) / 100);
  } else {
    cur = String(parseFloat(cur) / 100);
  }
  upd();
}

// ---- = ----
function calculate(final = true) {
  if (!op || !prev) return;

  const a = parseFloat(prev);
  const b = parseFloat(cur);
  let   res;

  switch (op) {
    case '+': res = a + b; break;
    case '-': res = a - b; break;
    case '*': res = a * b; break;
    case '/': res = b === 0 ? 'Error' : a / b; break;
  }

  if (final) {
    const sym = { '+': '+', '-': '−', '*': '×', '/': '÷' }[op];
    document.getElementById('hist').textContent =
      `${prev} ${sym} ${cur} =`;
  }

  cur    = res === 'Error' ? 'Error' : fmtNum(res);
  expr   = '';
  op     = '';
  prev   = '';
  newNum = true;
  upd();
}

// ---- number formatter ----
function fmtNum(n) {
  if (Math.abs(n) > 1e15 || (Math.abs(n) < 1e-10 && n !== 0)) {
    return n.toExponential(6);
  }
  let s = String(+n.toPrecision(12));
  if (s.includes('.') && s.endsWith('0')) s = parseFloat(s).toString();
  return s;
}

// ---- scientific operations ----
function sciOp(type) {
  const v = parseFloat(cur);
  let res;
  switch (type) {
    case 'sin':  res = Math.sin(v * Math.PI / 180);  break;
    case 'cos':  res = Math.cos(v * Math.PI / 180);  break;
    case 'tan':  res = Math.tan(v * Math.PI / 180);  break;
    case 'log':  res = Math.log10(v);                break;
    case 'ln':   res = Math.log(v);                  break;
    case 'sqrt': res = Math.sqrt(v);                 break;
    case 'sq':   res = v * v;                        break;
    case 'inv':  res = 1 / v;                        break;
    case 'abs':  res = Math.abs(v);                  break;
    case 'fact': {
        res = v * -1;
        break;
      }
  }
  cur    = fmtNum(res);
  newNum = true;
  upd();
}

// ============================================================
//  Mode switching
// ============================================================
let mode = 'std';

function setMode(m) {
  mode = m;
  const modes = ['std', 'sci', 'conv'];
  document.querySelectorAll('.mode-btn').forEach((b, i) =>
    b.classList.toggle('active', modes[i] === m)
  );
  document.getElementById('sciPanel').classList.toggle('show', m === 'sci');
  document.getElementById('stdButtons').style.display = m === 'conv' ? 'none' : 'grid';
  document.getElementById('convPanel').classList.toggle('show', m === 'conv');
  if (m === 'conv') populateConv();
}

// ============================================================
//  Unit converter
// ============================================================

// All multipliers convert TO the base unit (first in each group)
const units = {
  length: {
    m: 1, km: 1000, cm: 0.01, mm: 0.001,
    mi: 1609.344, yd: 0.9144, ft: 0.3048, inch: 0.0254
  },
  weight: {
    kg: 1, g: 0.001, lb: 0.453592, oz: 0.028350, t: 1000, mg: 0.000001
  },
  area: {
    m2: 1, km2: 1e6, cm2: 1e-4, mi2: 2589988,
    ft2: 0.092903, acre: 4046.856, hectare: 10000
  },
  speed: {
    'm/s': 1, 'km/h': 0.27778, mph: 0.44704, 'ft/s': 0.3048, knot: 0.514444
  },
  temp: { C: 'C', F: 'F', K: 'K' }   // handled separately
};

function populateConv() {
  const t = document.getElementById('convType').value;
  const keys = Object.keys(units[t]);
  ['convFrom', 'convTo'].forEach((id, i) => {
    const sel = document.getElementById(id);
    sel.innerHTML = keys.map(k => `<option value="${k}">${k}</option>`).join('');
    sel.selectedIndex = i;          // default: first vs second unit
  });
  updateConv();
}

function updateConv() {
  const t    = document.getElementById('convType').value;
  const v    = parseFloat(document.getElementById('convIn').value) || 0;
  const from = document.getElementById('convFrom').value;
  const to   = document.getElementById('convTo').value;
  let res;

  if (t === 'temp') {
    if (from === to) {
      res = v;
    } else if (from === 'C' && to === 'F') res = v * 9 / 5 + 32;
    else if (from === 'C' && to === 'K')   res = v + 273.15;
    else if (from === 'F' && to === 'C')   res = (v - 32) * 5 / 9;
    else if (from === 'F' && to === 'K')   res = (v - 32) * 5 / 9 + 273.15;
    else if (from === 'K' && to === 'C')   res = v - 273.15;
    else if (from === 'K' && to === 'F')   res = (v - 273.15) * 9 / 5 + 32;
  } else {
    const baseVal = v * units[t][from];
    res = baseVal / units[t][to];
  }

  document.getElementById('convOut').value = parseFloat(res.toFixed(8));
  document.getElementById('convResultStr').textContent =
    `${v} ${from} = ${parseFloat(res.toFixed(6))} ${to}`;
}

function swapConv() {
  const f = document.getElementById('convFrom');
  const t = document.getElementById('convTo');
  const tmp = f.value;
  f.value = t.value;
  t.value = tmp;
  updateConv();
}

// ============================================================
//  Keyboard support
// ============================================================
document.addEventListener('keydown', e => {
  if ('0123456789'.includes(e.key))      appendInput(e.key);
  else if (e.key === '.')                appendDot();
  else if (['+', '-', '*', '/'].includes(e.key)) appendOp(e.key);
  else if (e.key === 'Enter' || e.key === '=')   calculate();
  else if (e.key === 'Escape')           clearAll();
  else if (e.key === 'Backspace') {
    if (cur.length > 1 && !newNum) cur = cur.slice(0, -1);
    else cur = '0';
    upd();
  }
  else if (e.key === '%')                percent();
});
