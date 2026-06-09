# more-disk-space — Agent Guide

See `README.md` for user-facing documentation (action usage, inputs, step list).
See `CONTRIBUTING.md` for developer context (workflows, benchmarking, runner baselines).

## Key Files

- `action.yml` — action inputs/outputs, calls `index.js` and `post.js`
- `index.js` — main logic: step selection, cleanup execution
- `post.js` — post-step: reports freed vs. used by build
- `steps.json` — ordered list of cleanup steps with timing and size estimates
- `benchmark/measure-ours.js` — dispatches `benchmark-ours.yml` runs; modes: `clever`, `rerun`, `run`
- `benchmark/measure-others.js` — dispatches `benchmark-other-actions.yml`
- `benchmark/report-ours.js` — regenerates README, `results.md`, `perf-chart-ours.svg`
- `benchmark/report-others.js` — generates `results-others.md`, `perf-chart-others.svg`
