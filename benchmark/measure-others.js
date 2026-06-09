#!/usr/bin/env node
// Dispatches benchmark-other-actions.yml, waits for completion, and saves raw
// results to benchmark/results-others.csv.
//
// Usage:
//   node benchmark/measure-others.js

'use strict';

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const REPO             = 'eclipse-score/more-disk-space';
const WORKFLOW         = 'benchmark-other-actions.yml';
const RESULTS_OTHERS_PATH = path.join(__dirname, 'results-others.csv');
const POLL_INTERVAL_MS = 60_000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function ghJson(args) {
  return JSON.parse(execSync(`gh ${args}`, { encoding: 'utf8' }));
}

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

async function main() {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bench-compare-'));
  try {
    console.log(`Dispatching ${WORKFLOW}...`);
    const raw = execSync(
      `gh api repos/${REPO}/actions/workflows/${WORKFLOW}/dispatches` +
      ` -X POST` +
      ` -F return_run_details=true` +
      ` -f ref=main`,
      { encoding: 'utf8' },
    );
    const runId = String(JSON.parse(raw).workflow_run_id);
    console.log(`  Run ${runId} dispatched. Waiting for completion...`);

    // Poll by run ID directly — the isolation poller filters by workflow name
    // which is only correct when dispatching many benchmark-ours.yml runs.
    while (true) {
      await sleep(POLL_INTERVAL_MS);
      let run;
      try {
        run = ghJson(`run view ${runId} --json status,conclusion --repo ${REPO}`);
      } catch (e) {
        console.warn(`  Poll error (will retry): ${e.message}`);
        checkRateLimit();
        continue;
      }
      if (run.status !== 'completed') {
        console.log(`  Still in progress...`);
        checkRateLimit();
        continue;
      }
      if (run.conclusion !== 'success') {
        throw new Error(`Run ${runId} ended with conclusion: ${run.conclusion}`);
      }
      break;
    }

    console.log(`  Run ${runId} complete. Downloading combined-metrics artifact...`);
    ghSilent(`run download ${runId} --name combined-metrics --dir ${tmpDir} --repo ${REPO}`);
    fs.copyFileSync(path.join(tmpDir, 'combined.csv'), RESULTS_OTHERS_PATH);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  console.log(`\nDone. Results saved to benchmark/results-others.csv`);
  console.log(`Run 'node benchmark/report-others.js' to generate the summary and chart.`);
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
