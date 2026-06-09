#!/usr/bin/env node
// Dispatches benchmark-ours.yml runs per step combination and merges results
// into benchmark/results.json.
//
// Usage:
//   node benchmark/measure-ours.js clever [--depth N] [--min-rounds N]
//                                               [--rounds N] [--pause-s N]
//
//   node benchmark/measure-ours.js rerun  [--min-rounds N] [--rounds N] [--pause-s N]
//
//   node benchmark/measure-ours.js run <combo> [<combo> …] [--rounds N] [--pause-s N]
//     Combos: '+' or ',' separated step names, e.g. android-ndk+dotnet+swift
//
// flags:
//   --rounds N          Rounds per combo per run (default: 7)
//   --pause-s N         Pause between rounds in seconds (default: 12)
//   --min-rounds N      Minimum rounds to consider a combo measured (default: 10)
//                       clever: skip combos already at or above this
//                       rerun:  rerun combos below this
//
// clever flags:
//   --depth N           Combo search depth: 1=singles, 2=pairs, 3=triples, … (default: 3)

'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { parseCsvRows, median } = require('./_util');

const REPO = 'eclipse-score/more-disk-space';
const WORKFLOW = 'benchmark-ours.yml';
const RESULTS_PATH = path.join(__dirname, 'results.json');
const STEPS_PATH = path.join(__dirname, '..', 'steps.json');

// ── CLI args ──────────────────────────────────────────────────────────────────

// process.argv is like sys.argv: [node_binary, script_path, ...user_args]
// Accepts both "--flag value" and "--flag=value" forms.
function getArg(flag, defaultVal) {
  for (let i = 0; i < process.argv.length; i++) {
    if (process.argv[i] === flag) return process.argv[i + 1];
    if (process.argv[i].startsWith(flag + '=')) return process.argv[i].slice(flag.length + 1);
  }
  return defaultVal;
}

const mode = process.argv[2];
if (mode !== 'clever' && mode !== 'rerun' && mode !== 'run') {
  console.error('Usage: node benchmark/measure-ours.js clever|rerun|run [flags]');
  process.exit(1);
}

// Positional args for 'run' mode: everything after the mode that doesn't start with '--'.
const explicitCombos = process.argv.slice(3)
  .filter(a => !a.startsWith('--'))
  .map(a => a.replace(/,/g, '+').split('+').map(s => s.trim()).sort().join('+'));

const rounds        = parseInt(getArg('--rounds', '7'), 10);
const pauseS        = parseInt(getArg('--pause-s', '12'), 10);

// clever-only flags
const depth         = parseInt(getArg('--depth', '3'), 10);
const minRounds     = parseInt(getArg('--min-rounds', '10'), 10);

const TOP_FRACTION   = 0.42;
const WILDCARD_COUNT = 1;
// Small pause between successive dispatch calls to avoid secondary rate limits.
const DISPATCH_DELAY_MS = 200;
// Central poll interval — one gh run list call checks ALL pending runs at once.
// At 60s this is 1 API call/min regardless of how many runs are pending, vs the
// old approach (N concurrent gh run watch --interval 30) which made 2N calls/min.
const POLL_INTERVAL_MS  = 60_000;


// ── Shell helpers ─────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Like subprocess.check_output(f'gh {args}', encoding='utf-8') parsed as JSON.
function ghJson(args) {
  return JSON.parse(execSync(`gh ${args}`, { encoding: 'utf8' }));
}

// Like subprocess.run(f'gh {args}', check=True, capture_output=True).
function ghSilent(args) {
  execSync(`gh ${args}`, { stdio: 'pipe' });
}

function checkRateLimit() {
  try {
    const { limit, remaining, used } = ghJson('api rate_limit --jq .rate');
    const usedPct = Math.round(used / limit * 100);
    if (usedPct >= 50) {
      console.warn(`  Warning: GitHub API rate limit ${used}/${limit} (${usedPct}% used, ${remaining} remaining)`);
    }
  } catch {
    // Non-fatal — rate limit check is best-effort.
  }
}

// ── Combinatorics ─────────────────────────────────────────────────────────────

// Like list(itertools.combinations(arr, k)), returning arrays instead of tuples.
function combinations(arr, k) {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  const [head, ...tail] = arr;
  return [
    ...combinations(tail, k - 1).map(c => [head, ...c]),
    ...combinations(tail, k),
  ];
}

// ── Results file ──────────────────────────────────────────────────────────────

function loadResults() {
  if (!fs.existsSync(RESULTS_PATH)) return {};
  return JSON.parse(fs.readFileSync(RESULTS_PATH, 'utf8'));
}

function saveResults(results) {
  // Sort keys so git diffs are stable.
  const sorted = Object.fromEntries(Object.keys(results).sort().map(k => [k, results[k]]));
  fs.writeFileSync(RESULTS_PATH, JSON.stringify(sorted, null, 2) + '\n');
}

function mergeIntoResults(records) {
  const results = loadResults();
  let added = 0;
  for (const { key, entry } of records) {
    if (!results[key]) results[key] = [];
    // Skip duplicate run_ids so re-running the script is idempotent.
    if (results[key].some(r => r.run_id === entry.run_id)) continue;
    results[key].push(entry);
    added++;
  }
  saveResults(results);
  return added;
}

// ── Combo selection ───────────────────────────────────────────────────────────

function combosForPhase(size, results) {
  // require() on a .json file works like json.load() and is cached after first call.
  const steps = require(STEPS_PATH);
  const stepNames = steps.map(s => s.name);

  const candidates = size === 1
    ? stepNames
    : topCandidatesFromPreviousPhase(size - 1, results);

  const all = combinations(candidates, size).map(c => [...c].sort().join(','));
  return filterAlreadyMeasured(all, results);
}

function rankByMedianGbps(size, results) {
  const ranked = [];
  for (const [key, runs] of Object.entries(results)) {
    if (key.split('+').length !== size) continue;
    const gbps = runs.map(r => r.freed_root / r.duration_ms);
    ranked.push({ key, gbps: median(gbps) });
  }
  return ranked.sort((a, b) => b.gbps - a.gbps);
}

function topCandidatesFromPreviousPhase(prevSize, results) {
  const stepNames = require(STEPS_PATH).map(s => s.name);
  const ranked = rankByMedianGbps(prevSize, results);
  const topK = Math.max(1, Math.ceil(ranked.length * TOP_FRACTION));

  // Collect the individual step names that appear in the top-ranked combos.
  // flatMap(r => r.key.split('+')) unpacks each combo key into its step names.
  const stepSet = new Set(ranked.slice(0, topK).flatMap(r => r.key.split('+')));

  // Add wildcard steps just outside the top for diversity.
  for (const s of ranked.slice(topK, topK + WILDCARD_COUNT).flatMap(r => r.key.split('+'))) {
    stepSet.add(s);
  }

  // Expand until we have enough unique steps to form at least one new-size combo.
  let i = topK + WILDCARD_COUNT;
  while (stepSet.size < prevSize + 2 && i < ranked.length) {
    for (const s of ranked[i++].key.split('+')) stepSet.add(s);
  }

  // At high depths, all top combos may draw from the same small step pool,
  // exhausting ranked before reaching the threshold and leaving C(N,N)=1 combo.
  // Fall back to the full step list so there are always enough candidates.
  for (const s of stepNames) {
    if (stepSet.size >= prevSize + 2) break;
    stepSet.add(s);
  }

  return [...stepSet];
}

function filterAlreadyMeasured(combos, results) {
  if (minRounds === 0) return combos;
  const filtered = combos.filter(combo => {
    const key = combo.split(',').sort().join('+');
    const runs = results[key] ?? [];  // ?? is like `or` but only for null/undefined, not 0 or ''
    return runs.reduce((sum, r) => sum + r.n, 0) < minRounds;
  });
  if (filtered.length < combos.length) {
    console.log(`  Skipping ${combos.length - filtered.length} already-measured combos (>= ${minRounds} rounds)`);
  }
  return filtered;
}

// ── GitHub Actions helpers ────────────────────────────────────────────────────

function dispatchRun(combo) {
  const raw = execSync(
    `gh api repos/${REPO}/actions/workflows/${WORKFLOW}/dispatches` +
    ` -X POST` +
    ` -f ref=main` +
    ` -F return_run_details=true` +
    ` -f inputs[names]=${JSON.stringify(combo)}` +
    ` -f inputs[rounds]=${rounds}` +
    ` -f inputs[pause_s]=${pauseS}`,
    { encoding: 'utf8' },
  );
  return String(JSON.parse(raw).workflow_run_id);
}

function getRunDate(runId) {
  return ghJson(`run view ${runId} --json createdAt --repo ${REPO}`).createdAt.slice(0, 10);
}

function downloadArtifactToTmpDir(runId) {
  // mkdtempSync creates a unique temp directory — like tempfile.mkdtemp().
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'isolation-'));
  try {
    ghSilent(`run download ${runId} --name ours-metrics --dir ${tmpDir} --repo ${REPO}`);
  } catch {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    throw new Error(`Failed to download ours-metrics from run ${runId}`);
  }
  return tmpDir;
}

function parseArtifactDir(dir, runId, runDate) {
  const byCombo = new Map();
  for (const r of parseCsvRows(dir)) {
    if (!r.intensity.startsWith('only-')) continue;
    if (r.duration_ms <= 0) continue;
    const key = r.intensity.slice('only-'.length).split('+').sort().join('+');
    if (!byCombo.has(key)) byCombo.set(key, { freed: [], dur: [] });
    byCombo.get(key).freed.push(r.freed_root);
    byCombo.get(key).dur.push(r.duration_ms);
  }

  // Spread the Map entries into an array of {key, entry} objects.
  return [...byCombo.entries()].map(([key, g]) => ({
    key,
    entry: {
      run_id:      parseInt(runId, 10),
      date:        runDate,
      freed_root:  Math.round(median(g.freed)),
      duration_ms: Math.round(median(g.dur)),
      n:           g.freed.length,
    },
  }));
}

// ── Concurrency helpers ───────────────────────────────────────────────────────

// Returns an enqueue(task) function that runs tasks one at a time, in arrival order.
//
// Like asyncio.Lock used as a serial queue: each new task is chained onto the
// previous one's promise, so they execute sequentially even though callers are
// all awaiting concurrently. This lets us parallelize downloads while ensuring
// the results.json read-modify-write is never concurrent.
function makeSerializer() {
  let tail = Promise.resolve();
  return function enqueue(task) {
    const result = tail.then(task);
    // Swallow errors on `tail` so one failure doesn't block subsequent tasks.
    // The original `result` still rejects and propagates to the caller.
    tail = result.catch(() => {});
    return result;
  };
}

// Dispatches combos one at a time with a small inter-call pause.
// items: [{label, comboArg}] — label is shown in logs, comboArg is passed to gh.
// Returns [{combo, runId}].
async function dispatchAll(items) {
  const runs = [];
  for (const [i, { label, comboArg }] of items.entries()) {
    if (i > 0) await sleep(DISPATCH_DELAY_MS);
    const runId = dispatchRun(comboArg);
    console.log(`  [${i + 1}/${items.length}] ${label} → run ${runId}`);
    runs.push({ combo: label, runId });
  }
  return runs;
}

// Polls all pending runs with a SINGLE gh run list call per interval.
//
// The old approach spawned N concurrent `gh run watch --interval 30` processes,
// each making independent API calls — 2N calls/min for N runs. For N=100 that
// exceeds GitHub's 5,000/hour limit. This loop makes 1 call per POLL_INTERVAL_MS
// regardless of N.
//
// onDone(runId, success) fires as each run reaches a terminal state.
async function waitForAllCentrally(runs, onDone) {
  const pending = new Set(runs.map(r => String(r.runId)));
  const total = pending.size;

  while (pending.size > 0) {
    await sleep(POLL_INTERVAL_MS);

    let list;
    try {
      // --limit covers all our dispatched runs plus some buffer for unrelated runs
      // that may appear in the workflow's recent history.
      list = ghJson(
        `run list --workflow ${WORKFLOW} --repo ${REPO}` +
        ` --json databaseId,status,conclusion --limit ${total + 20}`
      );
    } catch (e) {
      console.warn(`  Poll error (will retry): ${e.message}`);
      checkRateLimit();
      continue;
    }

    for (const r of list) {
      const id = String(r.databaseId);
      if (!pending.has(id) || r.status !== 'completed') continue;
      pending.delete(id);
      onDone(id, r.conclusion === 'success');
    }

    if (pending.size > 0) {
      console.log(`  ${pending.size}/${total} run(s) still in progress...`);
      checkRateLimit();
    }
  }
}

// ── Per-run pipeline ──────────────────────────────────────────────────────────

async function downloadAndMerge(combo, runId, serializeMerge) {
  console.log(`  ${combo} (${runId}) done — downloading artifact...`);
  const runDate = getRunDate(runId);
  const tmpDir = downloadArtifactToTmpDir(runId);
  let records;
  try {
    records = parseArtifactDir(tmpDir, runId, runDate);
  } finally {
    // finally runs even if parseArtifactDir throws — like Python's try/finally.
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
  return serializeMerge(() => mergeIntoResults(records));
}

// Waits for all runs via central polling, then downloads and merges each artifact
// as it completes (not after all complete). Returns { totalAdded, failed }.
async function processBatch(runs) {
  // Deferred promises bridge the central poller and per-run download chains.
  // When the poller sees a run complete it resolves/rejects the deferred, which
  // immediately unblocks that run's download+merge chain — no need to wait for
  // all other runs first.
  const deferred = new Map(runs.map(({ runId }) => {
    let resolve, reject;
    const promise = new Promise((res, rej) => { resolve = res; reject = rej; });
    return [String(runId), { promise, resolve, reject }];
  }));

  const serializeMerge = makeSerializer();

  const processingPromises = runs.map(({ combo, runId }) =>
    deferred.get(String(runId)).promise.then(() => downloadAndMerge(combo, runId, serializeMerge))
  );

  // Run poller and all processing chains concurrently. Promise.allSettled means
  // one failed download doesn't abort the others — like asyncio.gather(return_exceptions=True).
  const [settled] = await Promise.all([
    Promise.allSettled(processingPromises),
    waitForAllCentrally(runs, (id, success) => {
      const d = deferred.get(id);
      if (success) d.resolve();
      else d.reject(new Error(`Run ${id} failed`));
    }),
  ]);

  checkRateLimit();

  let totalAdded = 0;
  const failed = [];
  for (const [i, result] of settled.entries()) {
    if (result.status === 'fulfilled') {
      totalAdded += result.value;
    } else {
      failed.push({ combo: runs[i].combo, runId: runs[i].runId, err: result.reason });
    }
  }
  return { totalAdded, failed };
}

// ── Phase names ───────────────────────────────────────────────────────────────

const PHASE_NAMES = ['singles', 'pairs', 'triples', 'quads', 'quintuples', 'sextuples', 'septuples', 'octuples'];

// ── Low-n rerun ───────────────────────────────────────────────────────────────

// Returns combos (as '+'-joined strings) whose best n is below minRounds.
function lowNCombos(results) {
  const combos = [];
  for (const [key, entries] of Object.entries(results)) {
    const best = Math.max(...entries.map(e => e.n));
    if (best < minRounds) combos.push(key);
  }
  return combos;
}

async function runLowNPhase(results) {
  const keys = lowNCombos(results);
  if (keys.length === 0) {
    console.log('No low-n combos found — nothing to rerun.');
    return;
  }
  console.log(`\n── Rerunning ${keys.length} low-n combo(s) (best n < ${minRounds}) ──`);
  console.log(`  ${rounds} rounds per combo, pause ${pauseS}s`);

  // Keys use '+' separator; the dispatch API expects ',' separator.
  const runs = await dispatchAll(keys.map(key => ({ label: key, comboArg: key.replace(/\+/g, ',') })));

  console.log(`  Waiting for ${runs.length} run(s)...`);
  const { totalAdded, failed } = await processBatch(runs);

  console.log(`  Done: ${totalAdded} new record(s) merged`);
  for (const { combo, runId, err } of failed) {
    console.warn(`  FAILED: ${combo} (${runId}): ${err.message}`);
  }
}

// ── Explicit combo run ────────────────────────────────────────────────────────

async function runExplicit() {
  if (explicitCombos.length === 0) {
    console.error('run mode requires at least one combo argument');
    process.exit(1);
  }
  console.log(`Running ${explicitCombos.length} explicit combo(s): ${rounds} rounds, pause ${pauseS}s`);

  const runs = await dispatchAll(
    explicitCombos.map(key => ({ label: key, comboArg: key.replace(/\+/g, ',') }))
  );

  console.log(`  Waiting for ${runs.length} run(s)...`);
  const { totalAdded, failed } = await processBatch(runs);

  console.log(`  Done: ${totalAdded} new record(s) merged`);
  for (const { combo, runId, err } of failed) {
    console.warn(`  FAILED: ${combo} (${runId}): ${err.message}`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  if (mode === 'rerun') {
    console.log(`Rerunning low-n combos: min-rounds=${minRounds}, rounds=${rounds}, pause=${pauseS}s`);
    await runLowNPhase(loadResults());
    console.log('\nDone. results.json updated.');
    return;
  }
  if (mode === 'run') {
    await runExplicit();
    console.log('\nDone. results.json updated.');
    return;
  }
  console.log(`Starting isolation benchmark: depth=${depth}, ${rounds} rounds, min-rounds=${minRounds}, pause ${pauseS}s`);

  // Pre-compute all phases from the current results.json snapshot so we can
  // dispatch everything in one parallel batch instead of sequentially phase-by-phase.
  const snapshot = loadResults();
  const allItems = [];

  for (let phase = 1; phase <= depth; phase++) {
    const combos = combosForPhase(phase, snapshot);
    const phaseName = PHASE_NAMES[phase - 1];
    if (combos.length === 0) {
      console.log(`  Phase ${phase} (${phaseName}): nothing to measure, skipping.`);
      continue;
    }
    console.log(`  Phase ${phase} (${phaseName}): ${combos.length} combo(s)`);
    for (const c of combos) {
      allItems.push({ label: `[d${phase}] ${c}`, comboArg: c });
    }
  }

  if (allItems.length === 0) {
    console.log('\nNothing to measure. results.json already at target.');
    return;
  }

  console.log(`\nDispatching ${allItems.length} combo(s) across all depths at once...`);
  const runs = await dispatchAll(allItems);
  console.log(`\nWaiting for ${runs.length} run(s)...`);
  const { totalAdded, failed } = await processBatch(runs);
  console.log(`\nDone: ${totalAdded} new record(s) merged.`);
  for (const { combo, runId, err } of failed) {
    console.warn(`  FAILED: ${combo} (${runId}): ${err.message}`);
  }
  console.log('results.json updated.');
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
