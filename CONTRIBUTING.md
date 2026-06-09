# Contributing to more-disk-space

## Repository Purpose

A GitHub Actions composite action that frees disk space on GitHub-hosted runners
before large builds. It deletes pre-installed tools the build doesn't need.

## Key Files

- `action.yml` — action inputs/outputs, calls `index.js` and `post.js`
- `index.js` — main logic: step selection, cleanup execution
- `post.js` — post-step: reports freed vs. used by build
- `steps.json` — ordered list of cleanup steps with timing and size estimates
- `benchmark/measure-ours.js` — dispatches `benchmark-ours.yml` runs per step combo,
  waits, and merges results into `results.json`; modes: `clever`, `rerun`, `run`
- `benchmark/measure-others.js` — dispatches `benchmark-other-actions.yml`, waits,
  and saves raw results to `results-others.csv`
- `benchmark/report-ours.js` — regenerates README step table, `results.md`, and `perf-chart-ours.svg`
- `benchmark/report-others.js` — generates `results-others.md` and `perf-chart-others.svg`
  from `results-others.csv`

## Workflows

All on `main`, trigger via `gh workflow run ... --ref main`:

- `benchmark-ours.yml` — measures a single step combination over N rounds;
  dispatched by `benchmark/measure-ours.js` for per-step isolation data
- `benchmark-other-actions.yml` — exhaustive benchmark of all alternative actions on ubuntu-24.04
- `collect-runner-inventory.yml` — captures runner filesystem snapshot (du 2-level, apt top-100);
  run once as a long-lived size reference
- `_test-ours.yml` — correctness tests (callable); triggered by `on-pr.yml` on pull requests

## Cleanup Steps

Steps are grouped into four levels by wall-clock time
(rmz removes all paths in parallel, so wall-clock ≈ slowest included step).

The step list is in README.md.

## GitHub-Hosted Runner Baselines

The free GitHub-hosted `ubuntu-24.04` runners come in two pool variants with the **same installed software** but different disk sizes:

| Pool variant | Root available at start |
|---|---:|
| Small pool | ~16 GiB |
| Large pool | ~89 GiB |

GitHub assigns jobs to either pool transparently — you cannot choose which one you
get. The installed tools are identical, so this action frees the same absolute
amount regardless of which pool the job lands on. On a small runner, freeing 26 GiB
is critical. On a large runner, the same cleanup is much less urgent.

**Different start-free values between runs are normal** and expected for this reason.
A few additional GiB of variation within the same pool is also normal — runner disks
are not always fully wiped between pool reuse cycles.

The action always frees the same absolute amount regardless of starting free space, so
benchmarks are runner-independent.

## Benchmarking

See `benchmark/README.md` for full workflows. Quick reference:

```bash
# Our action — measure then report:
node benchmark/measure-ours.js clever
node benchmark/report-ours.js

# Others — measure then report:
node benchmark/measure-others.js
node benchmark/report-others.js
```
