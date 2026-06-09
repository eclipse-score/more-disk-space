<!--
 Copyright (c) 2026 Contributors to the Eclipse Foundation

 See the NOTICE file(s) distributed with this work for additional
 information regarding copyright ownership.

 This program and the accompanying materials are made available under the
 terms of the Apache License Version 2.0 which is available at
 https://www.apache.org/licenses/LICENSE-2.0

 SPDX-License-Identifier: Apache-2.0
-->

# Benchmark tooling

Both benchmark flows follow the same two-step pattern: **measure** dispatches
GitHub Actions jobs and saves raw results locally; **report** post-processes those
results into docs and charts, independently and as often as needed.

## Our action benchmark

Measures per-step deletion costs via `benchmark-ours.yml`.
Raw results accumulate in `benchmark/results.json` (committed).

```bash
# Step 1 — dispatch jobs and collect results:
node benchmark/measure-ours.js clever            # all combos up to depth 3
node benchmark/measure-ours.js clever --depth 2  # singles and pairs only
node benchmark/measure-ours.js rerun             # top up combos below min-rounds
node benchmark/measure-ours.js run android-ndk+dotnet+swift

# Step 2 — regenerate README, results.md, perf-chart-ours.svg:
node benchmark/report-ours.js
```

## Others benchmark

Measures competing actions exhaustively via `benchmark-other-actions.yml` (~460 jobs).
Raw results saved to `benchmark/results-others.csv` (committed).

```bash
# Step 1 — dispatch, wait (~20–40 min), download raw measurements:
node benchmark/measure-others.js

# Step 2 — generate results-others.md and perf-chart-others.svg:
node benchmark/report-others.js
```

## Workflows

| Workflow | Purpose | Trigger |
|---|---|---|
| `benchmark-ours.yml` | Per-step isolation timing (one combo per run) | dispatched by `measure-ours.js` |
| `benchmark-other-actions.yml` | Exhaustive comparison against competing actions on ubuntu-24.04 | dispatched by `measure-others.js` |
| `collect-runner-inventory.yml` | Runner filesystem snapshot (du, apt top-100) | `workflow_dispatch` |
| `_test-ours.yml` | Correctness tests (min-cleanup) | via `on-pr.yml` or `workflow_dispatch` |
