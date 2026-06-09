#!/usr/bin/env node
// Regenerates the README.md step table and performance chart from steps.json.
// Run from repo root: node benchmark/report-ours.js

'use strict';

const fs = require('fs');
const path = require('path');

const steps = require('../steps.json');
const resultsPath = path.join(__dirname, 'results.json');
const resultsMdPath = path.join(__dirname, 'results.md');
const readmePath = path.join(__dirname, '..', 'README.md');
const chartPath = path.join(__dirname, 'perf-chart-ours.svg');

const GiB = 1024 ** 3;

// Generate level-grouped table blocks for README (between GEN-DOCS sentinels)
function generateReadmeStepsSections() {
  const levels = [...new Set(steps.map(s => s.level))].sort((a, b) => a - b);
  const levelLabels = { 1: '~3 s', 2: '~6 s', 3: '~12 s', 4: '~20 s' };
  const blocks = [];
  let globalIdx = 0;
  for (const level of levels) {
    const levelSteps = steps.filter(s => s.level === level);
    const wallClock = levelLabels[level] ?? `Level ${level}`;
    const rows = levelSteps.map(s => {
      globalIdx++;
      return `| ${globalIdx} | ${s.label} | ${s.keep_if} |`;
    });
    blocks.push(
      `#### Level ${level} — ${wallClock}\n\n` +
      `| # | Name | Do not use if you need |\n` +
      `|--:|------|------------------------|\n` +
      rows.join('\n')
    );
  }
  return blocks.join('\n\n');
}

// The canonical combo key for a given level: all steps with level <= N, sorted.
function canonicalKey(level) {
  return steps.filter(s => s.level <= level).map(s => s.name).sort().join('+');
}

const canonicalKeys = new Set([1, 2, 3, 4].map(canonicalKey));

// Load measured data points from results.json.
// For each combo key, pick the entry with highest n and plot as (freed GiB, duration s).
// Points whose key is a level-canonical combo are marked selected.
function loadMeasuredPoints() {
  if (!fs.existsSync(resultsPath)) return [];
  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
  const points = [];
  for (const [key, entries] of Object.entries(results)) {
    if (!entries || entries.length === 0) continue;
    const best = entries.reduce((a, b) => b.n > a.n ? b : a);
    points.push({
      x: best.freed_root / GiB,
      y: best.duration_ms / 1000,
      selected: canonicalKeys.has(key),
    });
  }
  return points;
}


const measuredPoints = loadMeasuredPoints();

function generateSvg(measured) {
  const W = 600, H = 320;
  const margin = { left: 55, right: 25, top: 20, bottom: 48 };
  const plotW = W - margin.left - margin.right;
  const plotH = H - margin.top - margin.bottom;

  const allX = measured.map(p => p.x);
  const allY = measured.map(p => p.y);
  const xMax = Math.ceil(Math.max(0, ...allX) / 5) * 5 || 30;
  const yMax = Math.ceil(Math.max(0, ...allY) / 5) * 5 || 30;

  const sx = x => margin.left + (x / xMax) * plotW;
  const sy = y => margin.top + (1 - y / yMax) * plotH;

  const out = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`);
  out.push('<rect width="100%" height="100%" fill="white"/>');

  // Grid lines
  for (let x = 0; x <= xMax; x += 5) {
    out.push(`<line x1="${sx(x).toFixed(1)}" y1="${margin.top}" x2="${sx(x).toFixed(1)}" y2="${(margin.top + plotH).toFixed(1)}" stroke="#eee" stroke-width="1"/>`);
    out.push(`<text x="${sx(x).toFixed(1)}" y="${(margin.top + plotH + 18).toFixed(1)}" text-anchor="middle" font-size="11" fill="#666">${x}</text>`);
  }
  for (let y = 0; y <= yMax; y += 5) {
    out.push(`<line x1="${margin.left}" y1="${sy(y).toFixed(1)}" x2="${(margin.left + plotW).toFixed(1)}" y2="${sy(y).toFixed(1)}" stroke="#eee" stroke-width="1"/>`);
    out.push(`<text x="${(margin.left - 8).toFixed(1)}" y="${(sy(y) + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#666">${y}</text>`);
  }

  // Axes
  out.push(`<line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${(margin.top + plotH).toFixed(1)}" stroke="#333" stroke-width="1.5"/>`);
  out.push(`<line x1="${margin.left}" y1="${(margin.top + plotH).toFixed(1)}" x2="${(margin.left + plotW).toFixed(1)}" y2="${(margin.top + plotH).toFixed(1)}" stroke="#333" stroke-width="1.5"/>`);
  out.push(`<text x="${(margin.left + plotW / 2).toFixed(1)}" y="${H - 10}" text-anchor="middle" font-size="13" fill="#333">GiB freed</text>`);
  out.push(`<text transform="rotate(-90)" x="${-(margin.top + plotH / 2).toFixed(1)}" y="16" text-anchor="middle" font-size="13" fill="#333">Time (s)</text>`);

  // Crosses for measured data points; canonical level combos use a distinct color
  const r = 10;
  for (const p of measured) {
    const color = p.selected ? '#e05c00' : '#aaa';
    const w = p.selected ? '3' : '1.5';
    const cx = sx(p.x).toFixed(1), cy = sy(p.y).toFixed(1);
    out.push(`<line x1="${(sx(p.x)-r).toFixed(1)}" y1="${cy}" x2="${(sx(p.x)+r).toFixed(1)}" y2="${cy}" stroke="${color}" stroke-width="${w}"/>`);
    out.push(`<line x1="${cx}" y1="${(sy(p.y)-r).toFixed(1)}" x2="${cx}" y2="${(sy(p.y)+r).toFixed(1)}" stroke="${color}" stroke-width="${w}"/>`);
  }

  out.push('</svg>');
  return out.join('\n');
}

// Write chart
fs.writeFileSync(chartPath, generateSvg(measuredPoints));
console.log('benchmark/perf-chart-ours.svg written.');

// Patch README in place
let readme = fs.readFileSync(readmePath, 'utf8');

// Replace Mermaid block with SVG image reference
readme = readme.replace(
  /```mermaid[\s\S]*?```/,
  '![Performance chart](benchmark/perf-chart-ours.svg)'
);

// Replace content between GEN-DOCS sentinels
const stepsContent = generateReadmeStepsSections();
readme = readme.replace(
  /<!-- GEN-DOCS:STEPS-START -->[\s\S]*?<!-- GEN-DOCS:STEPS-END -->/,
  `<!-- GEN-DOCS:STEPS-START -->\n${stepsContent}\n<!-- GEN-DOCS:STEPS-END -->`
);

fs.writeFileSync(readmePath, readme);
console.log('README.md updated.');

// Generate benchmark/results.md
if (fs.existsSync(resultsPath)) {
  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
  fs.writeFileSync(resultsMdPath, generateResultsMd(results));
  console.log('benchmark/results.md written.');
}

function generateResultsMd(results) {
  const COMBO_NAMES = ['', '', 'Pairs', 'Triples', 'Quads', 'Quintuples', 'Sextuples', 'Septuples', 'Octuples'];
  const TOP_N = 20;
  const TOP_SUMMARY = 10;

  const knownStepNames = new Set(steps.map(s => s.name));

  // Build flat list of all combos with their best entry and derived stats.
  // Skip keys whose parts aren't all known step names (stale/corrupt entries).
  const allCombos = [];
  const bySize = new Map();
  for (const [key, entries] of Object.entries(results)) {
    if (!entries?.length) continue;
    if (!key.split('+').every(p => knownStepNames.has(p))) continue;
    const best = entries.reduce((a, b) => b.n > a.n ? b : a);
    const size = key.split('+').length;
    const gbps = best.freed_root / best.duration_ms * 1000 / GiB;
    const combo = { key, best, size, gbps };
    allCombos.push(combo);
    if (!bySize.has(size)) bySize.set(size, []);
    bySize.get(size).push(combo);
  }

  const lines = [
    '# Isolation Benchmark Results',
    '',
    '_Generated from `benchmark/results.json` — do not edit manually._',
    '',
    'This shows all measured step combinations and how the 4 canonical level presets were selected.',
    'See [comparison with other actions](../docs/comparison.md) for the user-facing benchmark summary.',
    '',
  ];

  const LEVEL_LABELS = { 1: '~3 s', 2: '~6 s', 3: '~12 s', 4: '~20 s' };

  function canonicalForLevel(level) {
    const names = steps.filter(s => s.level <= level).map(s => s.name).sort();
    const key = names.join('+');
    const entries = results[key];
    if (!entries?.length) return { key, best: null, gbps: null };
    const best = entries.reduce((a, b) => (b.n > a.n ? b : a));
    return { key, best, gbps: best.freed_root / best.duration_ms * 1000 / GiB };
  }

  lines.push('## Top Combos by Level', '');

  for (const level of [1, 2, 3, 4]) {
    const label = LEVEL_LABELS[level];
    if (!label) continue;
    const maxMs = parseFloat(label.replace('~', '')) * 1000;
    const canonical = canonicalForLevel(level);
    const sorted = allCombos
      .filter(c => c.best.duration_ms <= maxMs)
      .sort((a, b) => b.best.freed_root - a.best.freed_root);
    const top = sorted.slice(0, TOP_SUMMARY);
    const canonicalInTop = top.some(c => c.key === canonical.key);
    summaryTable(top, `Level ${level} — ${label}`, canonical, canonicalInTop);
  }

  function summaryTable(combos, title, canonicalRow, canonicalInline) {
    const canonicalSet = new Set(canonicalRow?.key.split('+') ?? []);

    lines.push(`### ${title}`, '');
    lines.push('| Combo | Freed (GiB) | Duration (s) | GiB/s | Rounds | Date |');
    lines.push('|-------|------------:|-------------:|------:|-------:|------|');

    function deltaLabel(key) {
      const tools = key.split('+');
      const added = tools.filter(p => !canonicalSet.has(p));
      const removed = [...canonicalSet].filter(p => !tools.includes(p));
      const parts = [];
      if (added.length) parts.push('+ ' + added.join(' + '));
      if (removed.length) parts.push('− ' + removed.join(' − '));
      return parts.join('  ') || '_(same as ★)_';
    }

    function canonicalLabel(key) {
      return `<span style="color:#0066cc">**★ ${key.split('+').join(' + ')}**</span>`;
    }

    function renderRow(key, best, gbps, isCanonical) {
      const label = isCanonical ? canonicalLabel(key) : deltaLabel(key);
      const gib = isCanonical ? `**${(best.freed_root / GiB).toFixed(1)}**` : (best.freed_root / GiB).toFixed(1);
      const sec = (best.duration_ms / 1000).toFixed(1);
      const color = sec < 5 ? '#3a3' : '#b6700a';
      const dur = isCanonical ? `<span style="color:${color}">**${sec}**</span>` : `<span style="color:${color}">${sec}</span>`;
      const gbpsStr = isCanonical ? `**${gbps.toFixed(1)}**` : gbps.toFixed(1);
      lines.push(`| ${label} | ${gib} | ${dur} | ${gbpsStr} | ${best.n} | ${best.date} |`);
    }

    for (const { key, best, gbps } of combos) {
      const isCanonical = canonicalInline && canonicalRow && key === canonicalRow.key;
      renderRow(key, best, gbps, isCanonical);
    }

    if (canonicalRow && !canonicalInline) {
      const { key, best, gbps } = canonicalRow;
      if (best) {
        renderRow(key, best, gbps, true);
      } else {
        lines.push(`| ${canonicalLabel(key)} | — | — | — | — | — |`);
      }
    }

    lines.push('');
  }

  // Details section
  lines.push('## Step Based', '');

  for (const size of [...bySize.keys()].sort((a, b) => a - b)) {
    const heading = size === 1 ? 'Singles' : (COMBO_NAMES[size] ?? `${size}-step combos`);
    const sorted = bySize.get(size).sort((a, b) => b.gbps - a.gbps);
    const shown = size === 1 ? sorted : sorted.slice(0, TOP_N);

    lines.push(`### ${heading}`, '');
    lines.push('| Combo | GiB/s | Freed (GiB) | Duration (s) | Rounds | Date |');
    lines.push('|-------|------:|------------:|-------------:|-------:|------|');
    for (const { key, best, gbps } of shown) {
      const label = key.replaceAll('+', ' + ');
      const gib = (best.freed_root / GiB).toFixed(1);
      const sec = best.duration_ms / 1000;
      const color = sec < 5 ? '#3a3' : sec > 30 ? '#c33' : '#b6700a';
      const s = `<span style="color:${color}">${sec.toFixed(1)}</span>`;
      lines.push(`| ${label} | ${gbps.toFixed(1)} | ${gib} | ${s} | ${best.n} | ${best.date} |`);
    }
    if (size > 1 && sorted.length > TOP_N) {
      lines.push(`_…${sorted.length - TOP_N} more combos not shown_`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
