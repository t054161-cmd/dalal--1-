/* ═══════════════════════════════════════════════════════════════════
   CHARTS — hand-built SVG, drawn to read as projected holograms
   rather than as dashboard widgets. No chart library.
   ═══════════════════════════════════════════════════════════════════ */
import { esc } from './ui.js';
import { n } from './i18n.js';

const GRAD = `
<defs>
  <linearGradient id="holoBar" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0%"  stop-color="var(--holo-2)" stop-opacity=".35"/>
    <stop offset="100%" stop-color="var(--holo)" stop-opacity=".95"/>
  </linearGradient>
</defs>`;

/**
 * Columns with an optional trend line — the hero chart of the archive.
 * @param {{label:string,value:number}[]} rows
 */
export function barChart(rows, { line = true, h = 210, unit = '' } = {}) {
  if (!rows.length) return '';
  const W = 720, PAD_L = 34, PAD_R = 10, PAD_T = 22, PAD_B = 26;
  const iw = W - PAD_L - PAD_R, ih = h - PAD_T - PAD_B;
  const max = Math.max(1, ...rows.map((r) => r.value));
  const step = iw / rows.length;
  const bw = Math.min(30, step * 0.52);
  const x = (i) => PAD_L + step * i + step / 2;
  const y = (v) => PAD_T + ih - (v / max) * ih;

  let bars = '', labels = '', dots = '', pts = [];
  rows.forEach((r, i) => {
    const cy = y(r.value);
    bars += `<rect class="bar" x="${(x(i) - bw / 2).toFixed(1)}" y="${cy.toFixed(1)}"
      width="${bw.toFixed(1)}" height="${Math.max(0, PAD_T + ih - cy).toFixed(1)}" rx="2">
      <title>${esc(r.label)}: ${n(r.value)}${esc(unit)}</title></rect>`;
    labels += `<text x="${x(i).toFixed(1)}" y="${h - 8}" text-anchor="middle">${esc(r.label)}</text>`;
    if (r.value > 0) {
      pts.push(`${x(i).toFixed(1)},${cy.toFixed(1)}`);
      dots += `<circle class="dot" cx="${x(i).toFixed(1)}" cy="${cy.toFixed(1)}" r="2.6"/>`;
    }
  });

  /* gridlines on whole numbers only — a chart of 1s must not read "1, 1, 0" */
  const ticks = [];
  const nice = max <= 4 ? 1 : Math.ceil(max / 4 / 10 ** Math.floor(Math.log10(max / 4))) * 10 ** Math.floor(Math.log10(max / 4));
  for (let v = nice; v <= max; v += nice) ticks.push(v);
  let grid = '';
  for (const gv of ticks) {
    const gy = y(gv);
    grid += `<line class="axis" x1="${PAD_L}" y1="${gy.toFixed(1)}" x2="${W - PAD_R}" y2="${gy.toFixed(1)}" stroke-dasharray="2 5"/>
             <text x="${PAD_L - 6}" y="${(gy + 3).toFixed(1)}" text-anchor="end">${n(gv)}</text>`;
  }

  return `<svg class="chart" viewBox="0 0 ${W} ${h}" role="img">${GRAD}
    ${grid}
    <line class="axis" x1="${PAD_L}" y1="${PAD_T + ih}" x2="${W - PAD_R}" y2="${PAD_T + ih}"/>
    ${bars}
    ${line && pts.length > 1 ? `<polyline class="line" points="${pts.join(' ')}"/>${dots}` : ''}
    ${labels}
  </svg>`;
}

/** A donut ring — one favourite genre, one ring. */
export function ring(pct, iconSvg, labelHtml, countLabel) {
  const R = 30, C = 2 * Math.PI * R;
  const on = Math.max(0, Math.min(1, pct)) * C;
  return `
  <div class="ring">
    <div class="ring__wrap">
      <svg viewBox="0 0 72 72" aria-hidden="true">
        <circle class="ring__track" cx="36" cy="36" r="${R}"/>
        <circle class="ring__arc" cx="36" cy="36" r="${R}"
                stroke-dasharray="${on.toFixed(1)} ${C.toFixed(1)}"/>
      </svg>
      <span class="ring__mid">${iconSvg}</span>
    </div>
    ${labelHtml}
    <span class="ring__n">${esc(countLabel)}</span>
  </div>`;
}

/** Ranked horizontal bars — authors, genres, top-rated.
 *  `scale` fixes the axis (ratings run to 5 whatever the top value is). */
export function ranked(rows, scale) {
  const max = Math.max(1, scale ?? 0, ...rows.map((r) => r.value));
  return `<div class="ranked">${rows.map((r, i) => `
    <div class="rankrow">
      <span class="rankrow__i">${i + 1}</span>
      <span class="rankrow__n" title="${esc(r.label)}">${esc(r.label)}</span>
      <span class="rankrow__track"><span class="rankrow__fill" style="--w:${((r.value / max) * 100).toFixed(1)}%"></span></span>
      <span class="rankrow__v">${esc(r.display ?? n(r.value))}</span>
    </div>`).join('')}</div>`;
}

/** A twelve-cell activity strip for one year. */
export function heat(values, labels) {
  const max = Math.max(1, ...values);
  return `
  <div>
    <div class="heat">${values.map((v, i) => `
      <span class="heat__cell" data-v="${v}" style="--v:${(v / max).toFixed(3)}"
            title="${esc(labels[i])}: ${n(v)}"></span>`).join('')}</div>
    <div class="heat__labels">${labels.map((l) => `<span>${esc(l)}</span>`).join('')}</div>
  </div>`;
}
