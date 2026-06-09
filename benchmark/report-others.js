#!/usr/bin/env node
// Aggregates benchmark-other-actions metrics and writes results-others.md + perf-chart-others.svg.
// Run from repo root: node benchmark/report-others.js

'use strict';

const fs = require('fs');
const path = require('path');
const { parseCsvRows } = require('./_util');

const combinedPath = path.join(__dirname, 'results-others.csv');
const summaryPath  = path.join(__dirname, 'results-others.md');
const resultsPath  = path.join(__dirname, 'results.json');
const steps        = require('../steps.json');

if (!fs.existsSync(combinedPath)) {
  console.error(`No results yet. Run first:\n  node benchmark/measure-others.js`);
  process.exit(1);
}

const rows = parseCsvRows(combinedPath);

// ── Aggregation ───────────────────────────────────────────────────────────────

const groups = new Map();
for (const r of rows) {
  const key = `${r.image}\0${r.option}\0${r.intensity}`;
  if (!groups.has(key)) {
    groups.set(key, { image: r.image, option: r.option, intensity: r.intensity,
      count: 0, sum_freed_root: 0, sum_freed_ws: 0, sum_dur: 0,
      sum_after_root: 0, sum_after_ws: 0 });
  }
  const g = groups.get(key);
  g.count++;
  g.sum_freed_root += r.freed_root;
  g.sum_freed_ws   += r.freed_ws;
  g.sum_dur        += r.duration_ms;
  g.sum_after_root += r.after_root;
  g.sum_after_ws   += r.after_ws;
}

const GiB = 1024 ** 3;
const fmtGiB = b => (b / GiB).toFixed(1) + ' GiB';

// ── Summary markdown ──────────────────────────────────────────────────────────

const lines = [
  '# Comparison Benchmark — Raw Data',
  '',
  '_Generated from `benchmark/results-others.csv` — do not edit manually._',
  '',
  'This is the raw data behind [docs/comparison.md](../docs/comparison.md).',
  '',
  '### Understanding the Metrics',
  '',
  '- **Root (/)**: The system partition where the OS and most software is installed. This is typically ~84 GB on GitHub runners.',
  '- **Workspace**: Your build directory (`$GITHUB_WORKSPACE`). On some actions (like easimon), this may be on a separate LVM volume.',
  '- **Freed Space**: How much space was reclaimed by the cleanup action.',
  '- **Available After**: Total free space remaining after cleanup. Higher is better for comparing runner images.',
  '- **⚠️ easimon Note**: Shows negative root freed because it creates an LVM volume by consuming root space, then remounts workspace there. The workspace freed is what matters.',
  '',
  'Image | Option | Intensity | Freed (WS) | Freed (Root) | Avail After (WS) | Avail After (Root) | Duration | GiB/s',
  '--- | --- | --- | --- | --- | --- | --- | --- | ---',
];

const sorted = [...groups.values()].sort((a, b) => {
  if (a.image < b.image) return -1;
  if (a.image > b.image) return 1;
  if (a.option < b.option) return -1;
  if (a.option > b.option) return 1;
  if (a.intensity < b.intensity) return -1;
  if (a.intensity > b.intensity) return 1;
  return 0;
});

for (const g of sorted) {
  const c = g.count || 1;
  const avg_ws        = Math.trunc(g.sum_freed_ws   / c);
  const avg_root      = Math.trunc(g.sum_freed_root / c);
  const avg_dur       = Math.trunc(g.sum_dur        / c);
  const avg_after_ws  = Math.trunc(g.sum_after_ws   / c);
  const avg_after_root = Math.trunc(g.sum_after_root / c);
  const durSec = avg_dur / 1000;
  const gibPerSec = durSec > 0 ? ((avg_ws / GiB) / durSec).toFixed(2) : '0.00';
  lines.push(`${g.image} | ${g.option} | ${g.intensity} | ${fmtGiB(avg_ws)} | ${fmtGiB(avg_root)} | ${fmtGiB(avg_after_ws)} | ${fmtGiB(avg_after_root)} | ${durSec.toFixed(1)}s | ${gibPerSec}`);
}

const summary = lines.join('\n') + '\n';
fs.writeFileSync(summaryPath, summary);
console.log(`Summary saved to ${summaryPath}`);

// ── Our data points (from results.json) ───────────────────────────────────────

function loadOurPoints() {
  if (!fs.existsSync(resultsPath)) return [];
  const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
  const canonicalKeys = new Set([1, 2, 3, 4].map(level =>
    steps.filter(s => s.level <= level).map(s => s.name).sort().join('+')
  ));
  const points = [];
  for (const [key, entries] of Object.entries(results)) {
    if (!entries?.length || !canonicalKeys.has(key)) continue;
    const best = entries.reduce((a, b) => b.n > a.n ? b : a);
    points.push({
      x: best.freed_root / GiB,
      y: best.duration_ms / 1000,
    });
  }
  return points;
}

// ── SVG chart ─────────────────────────────────────────────────────────────────

function generateSvg(groups, ourPoints) {
  const pointsByOption = new Map();
  for (const g of groups.values()) {
    if (g.image !== 'ubuntu-24.04') continue;
    const c = g.count || 1;
    const freedGiB = Math.trunc(g.sum_freed_root / c) / GiB;
    const durSec   = Math.trunc(g.sum_dur / c) / 1000;
    if (freedGiB < 0.01 || durSec < 0) continue;
    if (!pointsByOption.has(g.option)) pointsByOption.set(g.option, []);
    pointsByOption.get(g.option).push({ x: freedGiB, y: durSec, intensity: g.intensity });
  }

  if (pointsByOption.size === 0 && ourPoints.length === 0) return '';

  const W = 800, H = 500;
  const m = { left: 70, right: 30, top: 30, bottom: 60 };
  const pw = W - m.left - m.right;
  const ph = H - m.top - m.bottom;

  const allX = [...pointsByOption.values()].flat().map(p => p.x).concat(ourPoints.map(p => p.x));
  const allY = [...pointsByOption.values()].flat().map(p => p.y).concat(ourPoints.map(p => p.y));
  const xMax = Math.max(...allX) * 1.05;
  const yMax = Math.max(...allY) * 1.05;

  const sx = x => m.left + (x / xMax) * pw;
  const sy = y => m.top + (1 - y / yMax) * ph;

  const COLORS = {
    jlumbroso: '#2196F3',
    enderson:  '#4CAF50',
    adityagarg:'#9C27B0',
    easimon:   '#FF9800',
    manual:    '#607D8B',
  };

  const out = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`,
    '<rect width="100%" height="100%" fill="white"/>',
  ];

  // Grid
  for (let x = 0; x <= xMax; x += 5) {
    const px = sx(x).toFixed(1);
    out.push(`<line x1="${px}" y1="${m.top}" x2="${px}" y2="${m.top + ph}" stroke="#eee" stroke-width="1"/>`);
    out.push(`<text x="${px}" y="${m.top + ph + 20}" text-anchor="middle" font-size="11" fill="#666">${x}</text>`);
  }
  for (let y = 0; y <= yMax; y += 30) {
    const py = sy(y).toFixed(1);
    out.push(`<line x1="${m.left}" y1="${py}" x2="${m.left + pw}" y2="${py}" stroke="#eee" stroke-width="1"/>`);
    out.push(`<text x="${m.left - 8}" y="${(sy(y) + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#666">${y}</text>`);
  }

  // Axes
  out.push(`<line x1="${m.left}" y1="${m.top}" x2="${m.left}" y2="${m.top + ph}" stroke="#333" stroke-width="1.5"/>`);
  out.push(`<line x1="${m.left}" y1="${m.top + ph}" x2="${m.left + pw}" y2="${m.top + ph}" stroke="#333" stroke-width="1.5"/>`);
  out.push(`<text x="${(m.left + pw / 2).toFixed(1)}" y="${H - 5}" text-anchor="middle" font-size="13" fill="#333">GiB freed</text>`);
  out.push(`<text transform="rotate(-90)" x="${-(m.top + ph / 2).toFixed(1)}" y="16" text-anchor="middle" font-size="13" fill="#333">Time (seconds)</text>`);

  // Actions as × markers
  const cs = 6;
  for (const [option, pts] of [...pointsByOption.entries()].sort()) {
    const color = COLORS[option] ?? '#888';
    for (const p of pts) {
      const cx = sx(p.x).toFixed(1), cy = sy(p.y).toFixed(1);
      const d1 = `M ${(sx(p.x) - cs).toFixed(1)},${(sy(p.y) - cs).toFixed(1)} L ${(sx(p.x) + cs).toFixed(1)},${(sy(p.y) + cs).toFixed(1)}`;
      const d2 = `M ${(sx(p.x) + cs).toFixed(1)},${(sy(p.y) - cs).toFixed(1)} L ${(sx(p.x) - cs).toFixed(1)},${(sy(p.y) + cs).toFixed(1)}`;
      out.push(`<path d="${d1} ${d2}" stroke="${color}" stroke-width="2" opacity="0.7"/>`);
    }
  }

  // Our action as + crosses, one per canonical level combo
  const r = 10;
  for (const p of ourPoints) {
    out.push(`<line x1="${(sx(p.x) - r).toFixed(1)}" y1="${sy(p.y).toFixed(1)}" x2="${(sx(p.x) + r).toFixed(1)}" y2="${sy(p.y).toFixed(1)}" stroke="#e05c00" stroke-width="3"/>`);
    out.push(`<line x1="${sx(p.x).toFixed(1)}" y1="${(sy(p.y) - r).toFixed(1)}" x2="${sx(p.x).toFixed(1)}" y2="${(sy(p.y) + r).toFixed(1)}" stroke="#e05c00" stroke-width="3"/>`);
  }

  // Legend
  let legendY = m.top + 10;
  if (ourPoints.length > 0) {
    const cx = W - 110, cy = legendY;
    out.push(`<line x1="${cx - 4}" y1="${cy}" x2="${cx + 4}" y2="${cy}" stroke="#e05c00" stroke-width="2"/>`);
    out.push(`<line x1="${cx}" y1="${cy - 4}" x2="${cx}" y2="${cy + 4}" stroke="#e05c00" stroke-width="2"/>`);
    out.push(`<text x="${W - 95}" y="${legendY + 4}" font-size="11" fill="#333">score-more-disk-space</text>`);
    legendY += 18;
  }
  for (const [option, color] of Object.entries(COLORS)) {
    if (!pointsByOption.has(option)) continue;
    const cx = W - 110, cy = legendY;
    out.push(`<path d="M ${cx - 4},${cy - 4} L ${cx + 4},${cy + 4} M ${cx + 4},${cy - 4} L ${cx - 4},${cy + 4}" stroke="${color}" stroke-width="2"/>`);
    out.push(`<text x="${W - 95}" y="${legendY + 4}" font-size="11" fill="#333">${option}</text>`);
    legendY += 18;
  }

  out.push('</svg>');
  return out.join('\n');
}

const svgContent = generateSvg(groups, loadOurPoints());
if (svgContent) {
  const chartPath = path.join(path.dirname(summaryPath), 'perf-chart-others.svg');
  fs.writeFileSync(chartPath, svgContent);
  console.log(`Chart saved to ${chartPath}`);
}
