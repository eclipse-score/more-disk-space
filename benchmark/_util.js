'use strict';

const fs   = require('fs');
const path = require('path');

function findCsvFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findCsvFiles(full));
    else if (entry.name.endsWith('.csv')) results.push(full);
  }
  return results;
}

// Accepts a file path or a directory tree. Returns { headers, dataLines } where
// headers is the raw header string and dataLines is the combined data rows across
// all CSV files (per-file headers stripped).
function loadCsvLines(filePath) {
  const stat = fs.statSync(filePath);
  const files = stat.isDirectory() ? findCsvFiles(filePath) : [filePath];
  let headers = null;
  const dataLines = [];
  for (const f of files) {
    const lines = fs.readFileSync(f, 'utf8').trim().split('\n');
    if (!headers) headers = lines[0];
    dataLines.push(...lines.slice(1));
  }
  return { headers, dataLines };
}

// Fixed CSV schema written by measure-after and the easimon inline step.
const CSV_COLS = ['run_id', 'image', 'option', 'intensity',
  'before_root', 'after_root', 'freed_root',
  'before_ws',  'after_ws',   'freed_ws', 'duration_ms'];

// Parses all data rows from a file or directory into typed objects.
// Skips rows that don't parse cleanly.
function parseCsvRows(filePath) {
  const { dataLines } = loadCsvLines(filePath);
  const rows = [];
  for (const line of dataLines) {
    const f = line.split(',');
    if (f.length < CSV_COLS.length) continue;
    const r = {
      run_id:      parseInt(f[0], 10),
      image:       f[1],
      option:      f[2],
      intensity:   f[3],
      before_root: parseInt(f[4], 10),
      after_root:  parseInt(f[5], 10),
      freed_root:  parseInt(f[6], 10),
      before_ws:   parseInt(f[7], 10),
      after_ws:    parseInt(f[8], 10),
      freed_ws:    parseInt(f[9], 10),
      duration_ms: parseInt(f[10], 10),
    };
    if (!r.image || !r.option || !r.intensity) continue;
    if (!Number.isFinite(r.freed_root) || !Number.isFinite(r.freed_ws) ||
        !Number.isFinite(r.after_root) || !Number.isFinite(r.after_ws) ||
        !Number.isFinite(r.duration_ms)) continue;
    rows.push(r);
  }
  return rows;
}

function median(arr) {
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

module.exports = { findCsvFiles, loadCsvLines, parseCsvRows, median };
