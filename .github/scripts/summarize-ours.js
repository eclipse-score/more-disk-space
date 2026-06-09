#!/usr/bin/env node
// Reads isolation benchmark CSVs and summarizes GiB/s per single step, pair, and triple.
// Usage: node .github/scripts/summarize-ours.js <dir-or-csv> [steps.json] [--output-csv <path>]

'use strict';

const fs = require('fs');
const path = require('path');
const { parseCsvRows, loadCsvLines, median } = require('../../benchmark/_util');

const args = process.argv.slice(2);
const outputCsvIdx = args.indexOf('--output-csv');
const outputCsvPath = outputCsvIdx !== -1 ? args.splice(outputCsvIdx, 2)[1] : null;
const inputPath = args[0];
const stepsPath = args[1] ?? 'steps.json';

if (!inputPath) {
  console.error('Usage: summarize-ours.js <dir-or-csv> [steps.json] [--output-csv <path>]');
  process.exit(1);
}

const steps = require(fs.realpathSync(stepsPath));
const labelOf = Object.fromEntries(steps.map(s => [s.name, s.label]));

const rows = parseCsvRows(inputPath)
  .filter(r => r.intensity.startsWith('only-'))
  .map(r => ({ combo: r.intensity.slice('only-'.length).split('+'), freed: r.freed_root, dur: r.duration_ms }));

// Group by combo key
const byCombo = new Map();
for (const r of rows) {
  const key = r.combo.join('+');
  if (!byCombo.has(key)) byCombo.set(key, { combo: r.combo, freed: [], dur: [] });
  const g = byCombo.get(key);
  g.freed.push(r.freed);
  g.dur.push(r.dur);
}

const GiB = 1024 ** 3;

function tableRow({ combo, freed, dur, cnt }) {
  const freedGiB = freed / GiB;
  const durS = dur / 1000;
  const gbPerSec = durS > 0 ? (freedGiB / durS).toFixed(2) : '—';
  const labels = combo.map(n => labelOf[n] ?? n).join(', ');
  return `| ${combo.join('+')} | ${labels} | ${freedGiB.toFixed(2)} | ${durS.toFixed(2)} | ${gbPerSec} | ${cnt} |`;
}

function buildTable(entries) {
  const header = '| Combo | Steps | GiB Freed | Duration (s) | GiB/s | n |';
  const sep    = '|---|---|---:|---:|---:|---:|';
  const sorted = entries
    .map(([key, g]) => {
      const freed = median(g.freed);
      const dur = median(g.dur);
      const cnt = g.freed.length;
      return { combo: g.combo, freed, dur, cnt, gbPerS: dur > 0 ? freed / dur : 0 };
    })
    .sort((a, b) => b.gbPerS - a.gbPerS);
  return [header, sep, ...sorted.map(tableRow)].join('\n');
}

const SECTION_NAMES = ['Singles', 'Pairs', 'Triples', 'Quads', 'Quintuples'];

const lines = [];
lines.push('## Isolation Benchmark Results');
for (let size = 1; size <= SECTION_NAMES.length; size++) {
  const entries = [...byCombo.entries()].filter(([, g]) => g.combo.length === size);
  if (entries.length === 0) continue;
  lines.push('');
  lines.push(`### ${SECTION_NAMES[size - 1]}`);
  lines.push('');
  lines.push(buildTable(entries));
}

if (outputCsvPath) {
  const { headers: headerLine, dataLines } = loadCsvLines(inputPath);
  fs.writeFileSync(outputCsvPath, [headerLine, ...dataLines].join('\n') + '\n');
}

console.log(lines.join('\n'));
