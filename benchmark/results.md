# Isolation Benchmark Results

_Generated from `benchmark/results.json` — do not edit manually._

This shows all measured step combinations and how the 4 canonical level presets were selected.
See [comparison with other actions](../docs/comparison.md) for the user-facing benchmark summary.

## Top Combos by Level

### Level 1 — ~3 s

| Combo | Freed (GiB) | Duration (s) | GiB/s | Rounds | Date |
|-------|------------:|-------------:|------:|-------:|------|
| + gradle + haskell + julia | 21.3 | <span style="color:#3a3">2.7</span> | 7.8 | 100 | 2026-06-05 |
| + haskell + julia | 21.2 | <span style="color:#3a3">2.9</span> | 7.3 | 100 | 2026-06-05 |
| + haskell | 20.2 | <span style="color:#3a3">2.9</span> | 6.9 | 100 | 2026-06-05 |
| + gradle + haskell  − chromium | 19.7 | <span style="color:#3a3">2.7</span> | 7.2 | 100 | 2026-06-05 |
| + haskell  − powershell | 18.9 | <span style="color:#3a3">3.0</span> | 6.3 | 100 | 2026-06-05 |
| + julia | 17.5 | <span style="color:#3a3">2.5</span> | 7.0 | 100 | 2026-06-05 |
| + gradle + haskell + julia  − powershell − swift | 16.8 | <span style="color:#3a3">2.8</span> | 5.9 | 100 | 2026-06-05 |
| <span style="color:#0066cc">**★ android-ndk + chromium + dotnet + powershell + swift**</span> | **16.5** | <span style="color:#3a3">**2.6**</span> | **6.4** | 100 | 2026-06-05 |
| + gradle + julia  − powershell | 16.4 | <span style="color:#3a3">2.5</span> | 6.6 | 100 | 2026-06-05 |
| + julia  − powershell | 16.3 | <span style="color:#3a3">2.8</span> | 5.7 | 100 | 2026-06-05 |

### Level 2 — ~6 s

| Combo | Freed (GiB) | Duration (s) | GiB/s | Rounds | Date |
|-------|------------:|-------------:|------:|-------:|------|
| + aws-sam-cli | 23.0 | <span style="color:#3a3">4.7</span> | 4.9 | 100 | 2026-06-05 |
| <span style="color:#0066cc">**★ android-ndk + aws-cli + azure-cli + chromium + dotnet + gradle + haskell + julia + powershell + swift**</span> | **22.8** | <span style="color:#3a3">**3.7**</span> | **6.2** | 100 | 2026-06-05 |
| + aws-sam-cli + miniconda  − azure-cli | 22.6 | <span style="color:#b6700a">5.8</span> | 3.9 | 100 | 2026-06-05 |
| + aws-sam-cli  − azure-cli | 21.8 | <span style="color:#b6700a">5.2</span> | 4.2 | 100 | 2026-06-05 |
| − azure-cli | 21.6 | <span style="color:#3a3">4.4</span> | 4.9 | 100 | 2026-06-05 |
| − azure-cli − gradle | 21.4 | <span style="color:#3a3">4.4</span> | 4.9 | 100 | 2026-06-05 |
| − aws-cli − azure-cli | 21.3 | <span style="color:#3a3">2.7</span> | 7.8 | 100 | 2026-06-05 |
| − aws-cli − azure-cli − gradle | 21.2 | <span style="color:#3a3">2.9</span> | 7.3 | 100 | 2026-06-05 |
| − azure-cli − chromium | 21.0 | <span style="color:#b6700a">5.3</span> | 3.9 | 100 | 2026-06-05 |
| − aws-cli − azure-cli − chromium | 20.7 | <span style="color:#3a3">3.1</span> | 6.7 | 100 | 2026-06-05 |

### Level 3 — ~12 s

| Combo | Freed (GiB) | Duration (s) | GiB/s | Rounds | Date |
|-------|------------:|-------------:|------:|-------:|------|
| + aws-sam-cli + miniconda | 27.5 | <span style="color:#b6700a">12.0</span> | 2.3 | 100 | 2026-06-05 |
| + miniconda | 27.3 | <span style="color:#b6700a">11.2</span> | 2.4 | 100 | 2026-06-05 |
| + aws-sam-cli | 26.7 | <span style="color:#b6700a">10.3</span> | 2.6 | 100 | 2026-06-05 |
| + aws-sam-cli  − android-ndk | 26.7 | <span style="color:#b6700a">10.8</span> | 2.5 | 100 | 2026-06-05 |
| <span style="color:#0066cc">**★ android-ndk + android-sdk + aws-cli + azure-cli + chromium + dotnet + gradle + haskell + julia + powershell + swift**</span> | **26.5** | <span style="color:#b6700a">**10.0**</span> | **2.6** | 100 | 2026-06-05 |
| − android-ndk | 26.5 | <span style="color:#b6700a">11.1</span> | 2.4 | 100 | 2026-06-05 |
| + aws-sam-cli  − aws-cli | 26.4 | <span style="color:#b6700a">11.0</span> | 2.4 | 100 | 2026-06-05 |
| + aws-sam-cli + miniconda  − azure-cli | 26.4 | <span style="color:#b6700a">11.0</span> | 2.4 | 100 | 2026-06-05 |
| − gradle | 26.4 | <span style="color:#b6700a">10.9</span> | 2.4 | 100 | 2026-06-05 |
| + aws-sam-cli  − chromium | 26.1 | <span style="color:#b6700a">10.5</span> | 2.5 | 100 | 2026-06-05 |

### Level 4 — ~20 s

| Combo | Freed (GiB) | Duration (s) | GiB/s | Rounds | Date |
|-------|------------:|-------------:|------:|-------:|------|
| <span style="color:#0066cc">**★ android-ndk + android-sdk + aws-cli + aws-sam-cli + azure-cli + chromium + dotnet + gradle + haskell + julia + miniconda + powershell + swift**</span> | **27.5** | <span style="color:#b6700a">**12.0**</span> | **2.3** | 100 | 2026-06-05 |
| − android-ndk | 27.5 | <span style="color:#b6700a">16.0</span> | 1.7 | 100 | 2026-06-05 |
| − gradle | 27.4 | <span style="color:#b6700a">17.6</span> | 1.6 | 100 | 2026-06-05 |
| − aws-sam-cli | 27.3 | <span style="color:#b6700a">11.2</span> | 2.4 | 100 | 2026-06-05 |
| − aws-cli | 27.3 | <span style="color:#b6700a">12.5</span> | 2.2 | 100 | 2026-06-05 |
| − aws-sam-cli − gradle | 27.2 | <span style="color:#b6700a">18.1</span> | 1.5 | 30 | 2026-06-04 |
| − chromium | 26.9 | <span style="color:#b6700a">13.4</span> | 2.0 | 100 | 2026-06-05 |
| − miniconda | 26.7 | <span style="color:#b6700a">10.3</span> | 2.6 | 100 | 2026-06-05 |
| − android-ndk − miniconda | 26.7 | <span style="color:#b6700a">10.8</span> | 2.5 | 100 | 2026-06-05 |
| − gradle − miniconda | 26.6 | <span style="color:#b6700a">14.1</span> | 1.9 | 100 | 2026-06-05 |

## Step Based

### Singles

| Combo | GiB/s | Freed (GiB) | Duration (s) | Rounds | Date |
|-------|------:|------------:|-------------:|-------:|------|
| swift | 5.3 | 3.3 | <span style="color:#3a3">0.6</span> | 100 | 2026-06-05 |
| android-ndk | 3.4 | 6.4 | <span style="color:#3a3">1.9</span> | 100 | 2026-06-05 |
| haskell | 2.4 | 3.6 | <span style="color:#3a3">1.5</span> | 100 | 2026-06-05 |
| powershell | 1.5 | 1.2 | <span style="color:#3a3">0.8</span> | 100 | 2026-06-05 |
| chromium | 1.5 | 0.6 | <span style="color:#3a3">0.4</span> | 100 | 2026-06-05 |
| android-sdk | 1.4 | 10.2 | <span style="color:#b6700a">7.4</span> | 100 | 2026-06-05 |
| dotnet | 1.1 | 4.9 | <span style="color:#3a3">4.3</span> | 100 | 2026-06-05 |
| julia | 0.8 | 1.0 | <span style="color:#3a3">1.3</span> | 100 | 2026-06-05 |
| gradle | 0.3 | 0.1 | <span style="color:#3a3">0.4</span> | 100 | 2026-06-05 |
| azure-cli | 0.2 | 1.2 | <span style="color:#b6700a">5.0</span> | 100 | 2026-06-05 |
| aws-cli | 0.2 | 0.2 | <span style="color:#3a3">1.4</span> | 100 | 2026-06-05 |
| miniconda | 0.1 | 0.8 | <span style="color:#b6700a">6.7</span> | 100 | 2026-06-05 |
| aws-sam-cli | 0.1 | 0.2 | <span style="color:#3a3">2.9</span> | 100 | 2026-06-05 |

### Pairs

| Combo | GiB/s | Freed (GiB) | Duration (s) | Rounds | Date |
|-------|------:|------------:|-------------:|-------:|------|
| android-ndk + haskell | 5.9 | 10.1 | <span style="color:#3a3">1.7</span> | 100 | 2026-06-05 |
| chromium + swift | 5.7 | 3.9 | <span style="color:#3a3">0.7</span> | 100 | 2026-06-05 |
| haskell + swift | 5.3 | 6.9 | <span style="color:#3a3">1.3</span> | 100 | 2026-06-05 |
| gradle + swift | 5.1 | 3.4 | <span style="color:#3a3">0.7</span> | 30 | 2026-06-04 |
| android-ndk + swift | 5.0 | 9.7 | <span style="color:#3a3">1.9</span> | 100 | 2026-06-05 |
| powershell + swift | 4.6 | 4.5 | <span style="color:#3a3">1.0</span> | 100 | 2026-06-05 |
| android-ndk + chromium | 4.2 | 7.1 | <span style="color:#3a3">1.7</span> | 100 | 2026-06-05 |
| android-ndk + powershell | 3.7 | 7.7 | <span style="color:#3a3">2.1</span> | 100 | 2026-06-05 |
| dotnet + haskell | 3.4 | 8.6 | <span style="color:#3a3">2.5</span> | 100 | 2026-06-05 |
| chromium + haskell | 3.3 | 4.3 | <span style="color:#3a3">1.3</span> | 100 | 2026-06-05 |
| haskell + powershell | 3.1 | 4.9 | <span style="color:#3a3">1.6</span> | 100 | 2026-06-05 |
| julia + swift | 2.9 | 4.3 | <span style="color:#3a3">1.5</span> | 30 | 2026-06-04 |
| android-ndk + gradle | 2.7 | 6.6 | <span style="color:#3a3">2.5</span> | 30 | 2026-06-04 |
| android-ndk + julia | 2.6 | 7.4 | <span style="color:#3a3">2.9</span> | 30 | 2026-06-04 |
| gradle + haskell | 2.4 | 3.8 | <span style="color:#3a3">1.6</span> | 30 | 2026-06-04 |
| chromium + powershell | 2.3 | 1.9 | <span style="color:#3a3">0.8</span> | 100 | 2026-06-05 |
| haskell + julia | 2.2 | 4.6 | <span style="color:#3a3">2.1</span> | 30 | 2026-06-04 |
| android-ndk + dotnet | 2.0 | 11.3 | <span style="color:#b6700a">5.7</span> | 100 | 2026-06-05 |
| android-sdk + haskell | 1.8 | 13.8 | <span style="color:#b6700a">7.5</span> | 100 | 2026-06-05 |
| dotnet + swift | 1.8 | 8.2 | <span style="color:#3a3">4.6</span> | 100 | 2026-06-05 |
_…16 more combos not shown_

### Triples

| Combo | GiB/s | Freed (GiB) | Duration (s) | Rounds | Date |
|-------|------:|------------:|-------------:|-------:|------|
| android-ndk + haskell + swift | 9.3 | 13.4 | <span style="color:#3a3">1.4</span> | 100 | 2026-06-05 |
| android-ndk + gradle + haskell | 6.7 | 10.2 | <span style="color:#3a3">1.5</span> | 100 | 2026-06-05 |
| android-ndk + chromium + haskell | 6.6 | 10.7 | <span style="color:#3a3">1.6</span> | 100 | 2026-06-05 |
| chromium + gradle + swift | 6.1 | 4.1 | <span style="color:#3a3">0.7</span> | 100 | 2026-06-05 |
| android-ndk + haskell + julia | 5.6 | 11.1 | <span style="color:#3a3">2.0</span> | 100 | 2026-06-05 |
| android-ndk + chromium + swift | 5.3 | 10.4 | <span style="color:#3a3">1.9</span> | 100 | 2026-06-05 |
| chromium + powershell + swift | 5.3 | 5.2 | <span style="color:#3a3">1.0</span> | 100 | 2026-06-05 |
| android-ndk + dotnet + haskell | 5.3 | 15.0 | <span style="color:#3a3">2.8</span> | 100 | 2026-06-05 |
| gradle + powershell + swift | 5.1 | 4.7 | <span style="color:#3a3">0.9</span> | 100 | 2026-06-05 |
| android-ndk + powershell + swift | 4.9 | 11.0 | <span style="color:#3a3">2.2</span> | 100 | 2026-06-05 |
| gradle + haskell + swift | 4.7 | 7.1 | <span style="color:#3a3">1.5</span> | 100 | 2026-06-05 |
| android-ndk + gradle + swift | 4.7 | 9.9 | <span style="color:#3a3">2.1</span> | 100 | 2026-06-05 |
| chromium + haskell + swift | 4.7 | 7.6 | <span style="color:#3a3">1.6</span> | 100 | 2026-06-05 |
| dotnet + haskell + swift | 4.6 | 11.9 | <span style="color:#3a3">2.6</span> | 100 | 2026-06-05 |
| android-ndk + haskell + powershell | 4.6 | 11.3 | <span style="color:#3a3">2.5</span> | 100 | 2026-06-05 |
| haskell + julia + swift | 4.4 | 7.9 | <span style="color:#3a3">1.8</span> | 100 | 2026-06-05 |
| android-ndk + chromium + powershell | 4.3 | 8.3 | <span style="color:#3a3">2.0</span> | 100 | 2026-06-05 |
| haskell + powershell + swift | 4.2 | 8.2 | <span style="color:#3a3">1.9</span> | 100 | 2026-06-05 |
| android-ndk + chromium + gradle | 4.1 | 7.2 | <span style="color:#3a3">1.8</span> | 100 | 2026-06-05 |
| android-ndk + julia + swift | 4.1 | 10.7 | <span style="color:#3a3">2.6</span> | 100 | 2026-06-05 |
_…64 more combos not shown_

### Quads

| Combo | GiB/s | Freed (GiB) | Duration (s) | Rounds | Date |
|-------|------:|------------:|-------------:|-------:|------|
| android-ndk + chromium + gradle + swift | 8.5 | 10.5 | <span style="color:#3a3">1.2</span> | 100 | 2026-06-05 |
| android-ndk + chromium + powershell + swift | 8.0 | 11.6 | <span style="color:#3a3">1.5</span> | 100 | 2026-06-05 |
| android-ndk + gradle + haskell + swift | 7.0 | 13.5 | <span style="color:#3a3">1.9</span> | 100 | 2026-06-05 |
| android-ndk + gradle + julia + swift | 6.8 | 10.9 | <span style="color:#3a3">1.6</span> | 100 | 2026-06-05 |
| android-ndk + dotnet + gradle + swift | 6.3 | 14.8 | <span style="color:#3a3">2.3</span> | 100 | 2026-06-05 |
| android-ndk + chromium + dotnet + swift | 6.3 | 15.3 | <span style="color:#3a3">2.4</span> | 100 | 2026-06-05 |
| android-ndk + haskell + powershell + swift | 5.9 | 14.6 | <span style="color:#3a3">2.5</span> | 100 | 2026-06-05 |
| android-ndk + haskell + julia + swift | 5.8 | 14.4 | <span style="color:#3a3">2.5</span> | 100 | 2026-06-05 |
| android-ndk + dotnet + haskell + swift | 5.8 | 18.3 | <span style="color:#3a3">3.1</span> | 100 | 2026-06-05 |
| android-ndk + chromium + haskell + swift | 5.7 | 14.0 | <span style="color:#3a3">2.4</span> | 100 | 2026-06-05 |
| android-ndk + chromium + haskell + julia | 5.4 | 11.7 | <span style="color:#3a3">2.2</span> | 100 | 2026-06-05 |
| android-ndk + chromium + julia + swift | 5.3 | 11.4 | <span style="color:#3a3">2.2</span> | 100 | 2026-06-05 |
| android-ndk + chromium + dotnet + gradle | 5.1 | 12.1 | <span style="color:#3a3">2.4</span> | 100 | 2026-06-05 |
| android-ndk + gradle + haskell + powershell | 5.0 | 11.5 | <span style="color:#3a3">2.3</span> | 100 | 2026-06-05 |
| android-ndk + gradle + powershell + swift | 5.0 | 11.1 | <span style="color:#3a3">2.2</span> | 100 | 2026-06-05 |
| android-ndk + chromium + julia + powershell | 4.8 | 9.3 | <span style="color:#3a3">1.9</span> | 100 | 2026-06-05 |
| chromium + gradle + haskell + swift | 4.8 | 7.7 | <span style="color:#3a3">1.6</span> | 100 | 2026-06-05 |
| chromium + gradle + powershell + swift | 4.8 | 5.3 | <span style="color:#3a3">1.1</span> | 100 | 2026-06-05 |
| android-ndk + gradle + haskell + julia | 4.8 | 11.2 | <span style="color:#3a3">2.4</span> | 100 | 2026-06-05 |
| android-ndk + haskell + julia + powershell | 4.7 | 12.3 | <span style="color:#3a3">2.6</span> | 100 | 2026-06-05 |
_…106 more combos not shown_

### Quintuples

| Combo | GiB/s | Freed (GiB) | Duration (s) | Rounds | Date |
|-------|------:|------------:|-------------:|-------:|------|
| android-ndk + chromium + haskell + powershell + swift | 8.2 | 15.3 | <span style="color:#3a3">1.9</span> | 100 | 2026-06-05 |
| android-ndk + chromium + gradle + powershell + swift | 8.1 | 11.8 | <span style="color:#3a3">1.5</span> | 100 | 2026-06-05 |
| android-ndk + chromium + gradle + haskell + swift | 8.0 | 14.2 | <span style="color:#3a3">1.8</span> | 100 | 2026-06-05 |
| android-ndk + gradle + haskell + powershell + swift | 7.8 | 14.8 | <span style="color:#3a3">1.9</span> | 100 | 2026-06-05 |
| android-ndk + chromium + gradle + julia + swift | 7.5 | 11.5 | <span style="color:#3a3">1.5</span> | 100 | 2026-06-05 |
| android-ndk + gradle + haskell + julia + swift | 7.2 | 14.5 | <span style="color:#3a3">2.0</span> | 100 | 2026-06-05 |
| android-ndk + chromium + haskell + julia + swift | 6.8 | 15.0 | <span style="color:#3a3">2.2</span> | 100 | 2026-06-05 |
| android-ndk + chromium + julia + powershell + swift | 6.5 | 12.6 | <span style="color:#3a3">1.9</span> | 100 | 2026-06-05 |
| android-ndk + chromium + dotnet + powershell + swift | 6.4 | 16.5 | <span style="color:#3a3">2.6</span> | 100 | 2026-06-05 |
| android-ndk + chromium + dotnet + haskell + swift | 6.3 | 18.9 | <span style="color:#3a3">3.0</span> | 100 | 2026-06-05 |
| android-ndk + chromium + gradle + haskell + powershell | 6.0 | 12.1 | <span style="color:#3a3">2.0</span> | 100 | 2026-06-05 |
| android-ndk + chromium + haskell + julia + powershell | 5.9 | 13.0 | <span style="color:#3a3">2.2</span> | 100 | 2026-06-05 |
| android-ndk + chromium + gradle + haskell + julia | 5.9 | 11.9 | <span style="color:#3a3">2.0</span> | 100 | 2026-06-05 |
| android-ndk + dotnet + gradle + powershell + swift | 5.8 | 16.0 | <span style="color:#3a3">2.8</span> | 100 | 2026-06-05 |
| android-ndk + dotnet + gradle + julia + swift | 5.8 | 15.8 | <span style="color:#3a3">2.7</span> | 100 | 2026-06-05 |
| android-ndk + haskell + julia + powershell + swift | 5.8 | 15.6 | <span style="color:#3a3">2.7</span> | 100 | 2026-06-05 |
| android-ndk + chromium + dotnet + julia + swift | 5.7 | 16.3 | <span style="color:#3a3">2.8</span> | 100 | 2026-06-05 |
| android-ndk + gradle + julia + powershell + swift | 5.7 | 12.1 | <span style="color:#3a3">2.1</span> | 100 | 2026-06-05 |
| android-ndk + chromium + dotnet + haskell + powershell | 5.5 | 16.9 | <span style="color:#3a3">3.1</span> | 100 | 2026-06-05 |
| android-ndk + chromium + dotnet + gradle + swift | 5.4 | 15.4 | <span style="color:#3a3">2.8</span> | 100 | 2026-06-05 |
_…36 more combos not shown_

### Sextuples

| Combo | GiB/s | Freed (GiB) | Duration (s) | Rounds | Date |
|-------|------:|------------:|-------------:|-------:|------|
| android-ndk + chromium + gradle + haskell + powershell + swift | 9.5 | 15.4 | <span style="color:#3a3">1.6</span> | 100 | 2026-06-05 |
| android-ndk + chromium + gradle + haskell + julia + swift | 8.5 | 15.2 | <span style="color:#3a3">1.8</span> | 100 | 2026-06-05 |
| android-ndk + gradle + haskell + julia + powershell + swift | 7.7 | 15.8 | <span style="color:#3a3">2.0</span> | 100 | 2026-06-05 |
| android-ndk + chromium + gradle + julia + powershell + swift | 7.4 | 12.8 | <span style="color:#3a3">1.7</span> | 100 | 2026-06-05 |
| android-ndk + dotnet + gradle + haskell + powershell + swift | 7.2 | 19.7 | <span style="color:#3a3">2.7</span> | 100 | 2026-06-05 |
| android-ndk + chromium + dotnet + julia + powershell + swift | 7.0 | 17.5 | <span style="color:#3a3">2.5</span> | 100 | 2026-06-05 |
| android-ndk + chromium + dotnet + haskell + powershell + swift | 6.9 | 20.2 | <span style="color:#3a3">2.9</span> | 100 | 2026-06-05 |
| android-ndk + chromium + dotnet + gradle + julia + swift | 6.6 | 16.4 | <span style="color:#3a3">2.5</span> | 100 | 2026-06-05 |
| android-ndk + chromium + gradle + haskell + julia + powershell | 6.6 | 13.1 | <span style="color:#3a3">2.0</span> | 100 | 2026-06-05 |
| android-ndk + chromium + dotnet + gradle + haskell + julia | 5.9 | 16.8 | <span style="color:#3a3">2.8</span> | 100 | 2026-06-05 |
| chromium + dotnet + gradle + haskell + powershell + swift | 5.8 | 13.9 | <span style="color:#3a3">2.4</span> | 100 | 2026-06-05 |
| android-ndk + chromium + dotnet + gradle + haskell + powershell | 5.7 | 17.0 | <span style="color:#3a3">3.0</span> | 100 | 2026-06-05 |
| android-ndk + chromium + dotnet + haskell + julia + swift | 5.5 | 19.9 | <span style="color:#3a3">3.6</span> | 100 | 2026-06-05 |
| android-ndk + chromium + haskell + julia + powershell + swift | 5.4 | 16.3 | <span style="color:#3a3">3.0</span> | 100 | 2026-06-05 |
| android-ndk + dotnet + gradle + haskell + julia + powershell | 5.4 | 17.4 | <span style="color:#3a3">3.3</span> | 100 | 2026-06-05 |
| android-ndk + chromium + dotnet + gradle + julia + powershell | 5.2 | 14.4 | <span style="color:#3a3">2.8</span> | 100 | 2026-06-05 |
| chromium + dotnet + gradle + haskell + julia + swift | 5.1 | 13.6 | <span style="color:#3a3">2.7</span> | 100 | 2026-06-05 |
| chromium + gradle + haskell + julia + powershell + swift | 5.0 | 10.0 | <span style="color:#3a3">2.0</span> | 100 | 2026-06-05 |
| chromium + dotnet + haskell + julia + powershell + swift | 4.9 | 14.7 | <span style="color:#3a3">3.0</span> | 100 | 2026-06-05 |
| android-ndk + chromium + dotnet + gradle + powershell + swift | 4.8 | 16.7 | <span style="color:#3a3">3.5</span> | 100 | 2026-06-05 |
_…8 more combos not shown_

### Septuples

| Combo | GiB/s | Freed (GiB) | Duration (s) | Rounds | Date |
|-------|------:|------------:|-------------:|-------:|------|
| android-ndk + chromium + dotnet + haskell + julia + powershell + swift | 7.3 | 21.2 | <span style="color:#3a3">2.9</span> | 100 | 2026-06-05 |
| android-ndk + dotnet + gradle + haskell + julia + powershell + swift | 6.7 | 20.7 | <span style="color:#3a3">3.1</span> | 100 | 2026-06-05 |
| android-ndk + chromium + dotnet + gradle + haskell + powershell + swift | 6.3 | 20.3 | <span style="color:#3a3">3.2</span> | 100 | 2026-06-05 |
| chromium + dotnet + gradle + haskell + julia + powershell + swift | 5.6 | 14.9 | <span style="color:#3a3">2.7</span> | 100 | 2026-06-05 |
| android-ndk + chromium + dotnet + gradle + julia + powershell + swift | 4.7 | 17.7 | <span style="color:#3a3">3.8</span> | 100 | 2026-06-05 |
| android-ndk + chromium + gradle + haskell + julia + powershell + swift | 4.4 | 16.4 | <span style="color:#3a3">3.7</span> | 100 | 2026-06-05 |
| android-ndk + chromium + dotnet + gradle + haskell + julia + swift | 2.6 | 20.1 | <span style="color:#b6700a">7.7</span> | 100 | 2026-06-05 |
| android-ndk + chromium + dotnet + gradle + haskell + julia + powershell | 2.3 | 18.0 | <span style="color:#b6700a">7.9</span> | 100 | 2026-06-05 |

### Octuples

| Combo | GiB/s | Freed (GiB) | Duration (s) | Rounds | Date |
|-------|------:|------------:|-------------:|-------:|------|
| android-ndk + chromium + dotnet + gradle + haskell + julia + powershell + swift | 7.8 | 21.3 | <span style="color:#3a3">2.7</span> | 100 | 2026-06-05 |
| android-ndk + aws-cli + chromium + dotnet + haskell + julia + powershell + swift | 4.9 | 21.4 | <span style="color:#3a3">4.4</span> | 100 | 2026-06-05 |
| aws-cli + chromium + dotnet + gradle + haskell + julia + powershell + swift | 4.7 | 15.2 | <span style="color:#3a3">3.2</span> | 100 | 2026-06-05 |
| android-ndk + aws-cli + chromium + gradle + haskell + julia + powershell + swift | 4.4 | 16.7 | <span style="color:#3a3">3.8</span> | 100 | 2026-06-05 |
| android-ndk + aws-cli + chromium + dotnet + gradle + julia + powershell + swift | 4.2 | 17.9 | <span style="color:#3a3">4.2</span> | 100 | 2026-06-05 |
| android-ndk + aws-cli + dotnet + gradle + haskell + julia + powershell + swift | 3.9 | 21.0 | <span style="color:#b6700a">5.3</span> | 100 | 2026-06-05 |
| android-ndk + aws-cli + chromium + dotnet + gradle + haskell + julia + powershell | 3.4 | 18.3 | <span style="color:#b6700a">5.4</span> | 100 | 2026-06-05 |
| android-ndk + aws-cli + chromium + dotnet + gradle + haskell + powershell + swift | 2.6 | 20.6 | <span style="color:#b6700a">7.9</span> | 100 | 2026-06-05 |
| android-ndk + aws-cli + chromium + dotnet + gradle + haskell + julia + swift | 2.2 | 20.3 | <span style="color:#b6700a">9.3</span> | 100 | 2026-06-05 |

### 9-step combos

| Combo | GiB/s | Freed (GiB) | Duration (s) | Rounds | Date |
|-------|------:|------------:|-------------:|-------:|------|
| android-ndk + aws-cli + chromium + dotnet + gradle + haskell + julia + powershell + swift | 4.9 | 21.6 | <span style="color:#3a3">4.4</span> | 100 | 2026-06-05 |
| android-sdk + aws-cli + chromium + dotnet + gradle + haskell + julia + powershell + swift | 2.8 | 25.3 | <span style="color:#b6700a">8.9</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + chromium + dotnet + gradle + haskell + julia + powershell + swift | 2.8 | 25.1 | <span style="color:#b6700a">8.9</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + chromium + dotnet + gradle + haskell + julia + swift | 2.8 | 24.1 | <span style="color:#b6700a">8.7</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + dotnet + gradle + haskell + julia + powershell + swift | 2.7 | 24.7 | <span style="color:#b6700a">9.0</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + chromium + dotnet + gradle + haskell + powershell + swift | 2.7 | 24.3 | <span style="color:#b6700a">9.0</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + chromium + dotnet + haskell + julia + powershell + swift | 2.7 | 25.2 | <span style="color:#b6700a">9.3</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + chromium + gradle + haskell + julia + powershell + swift | 2.6 | 20.4 | <span style="color:#b6700a">7.8</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + chromium + dotnet + gradle + julia + powershell + swift | 2.4 | 21.7 | <span style="color:#b6700a">8.9</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + chromium + dotnet + gradle + haskell + julia + powershell | 2.4 | 22.0 | <span style="color:#b6700a">9.3</span> | 100 | 2026-06-05 |

### 10-step combos

| Combo | GiB/s | Freed (GiB) | Duration (s) | Rounds | Date |
|-------|------:|------------:|-------------:|-------:|------|
| android-ndk + aws-cli + azure-cli + chromium + dotnet + gradle + haskell + julia + powershell + swift | 6.2 | 22.8 | <span style="color:#3a3">3.7</span> | 100 | 2026-06-05 |
| android-ndk + aws-cli + aws-sam-cli + chromium + dotnet + gradle + haskell + julia + powershell + swift | 4.2 | 21.8 | <span style="color:#b6700a">5.2</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + chromium + dotnet + gradle + haskell + julia + powershell + swift | 2.7 | 25.3 | <span style="color:#b6700a">9.4</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + azure-cli + chromium + dotnet + gradle + haskell + powershell + swift | 2.6 | 25.5 | <span style="color:#b6700a">9.7</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + azure-cli + dotnet + gradle + haskell + julia + powershell + swift | 2.5 | 25.9 | <span style="color:#b6700a">10.6</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + azure-cli + chromium + dotnet + gradle + haskell + julia + swift | 2.4 | 25.2 | <span style="color:#b6700a">10.3</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + azure-cli + chromium + dotnet + haskell + julia + powershell + swift | 2.4 | 26.4 | <span style="color:#b6700a">10.9</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + azure-cli + chromium + gradle + haskell + julia + powershell + swift | 2.4 | 21.6 | <span style="color:#b6700a">9.0</span> | 100 | 2026-06-05 |
| android-sdk + aws-cli + azure-cli + chromium + dotnet + gradle + haskell + julia + powershell + swift | 2.4 | 26.5 | <span style="color:#b6700a">11.1</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + azure-cli + chromium + dotnet + gradle + julia + powershell + swift | 2.3 | 22.8 | <span style="color:#b6700a">10.1</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + azure-cli + chromium + dotnet + gradle + haskell + julia + powershell | 2.3 | 23.2 | <span style="color:#b6700a">10.2</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + azure-cli + chromium + dotnet + gradle + haskell + julia + powershell + swift | 1.0 | 26.2 | <span style="color:#b6700a">25.8</span> | 30 | 2026-06-04 |

### 11-step combos

| Combo | GiB/s | Freed (GiB) | Duration (s) | Rounds | Date |
|-------|------:|------------:|-------------:|-------:|------|
| android-ndk + aws-cli + aws-sam-cli + azure-cli + chromium + dotnet + gradle + haskell + julia + powershell + swift | 4.9 | 23.0 | <span style="color:#3a3">4.7</span> | 100 | 2026-06-05 |
| android-ndk + aws-cli + aws-sam-cli + chromium + dotnet + gradle + haskell + julia + miniconda + powershell + swift | 3.9 | 22.6 | <span style="color:#b6700a">5.8</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + azure-cli + chromium + dotnet + gradle + haskell + julia + powershell + swift | 2.6 | 26.5 | <span style="color:#b6700a">10.0</span> | 100 | 2026-06-05 |
| android-sdk + aws-cli + aws-sam-cli + azure-cli + chromium + dotnet + gradle + haskell + julia + powershell + swift | 2.5 | 26.7 | <span style="color:#b6700a">10.8</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + aws-sam-cli + azure-cli + dotnet + gradle + haskell + julia + powershell + swift | 2.5 | 26.1 | <span style="color:#b6700a">10.5</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-sam-cli + azure-cli + chromium + dotnet + gradle + haskell + julia + powershell + swift | 2.4 | 26.4 | <span style="color:#b6700a">11.0</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + aws-sam-cli + chromium + dotnet + gradle + haskell + julia + powershell + swift | 2.4 | 25.5 | <span style="color:#b6700a">10.8</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + aws-sam-cli + azure-cli + chromium + dotnet + gradle + haskell + powershell + swift | 2.4 | 25.7 | <span style="color:#b6700a">10.9</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + aws-sam-cli + azure-cli + chromium + gradle + haskell + julia + powershell + swift | 2.3 | 21.8 | <span style="color:#b6700a">9.6</span> | 100 | 2026-06-05 |
| android-ndk + aws-cli + azure-cli + chromium + dotnet + gradle + haskell + julia + miniconda + powershell + swift | 2.2 | 23.6 | <span style="color:#b6700a">10.8</span> | 30 | 2026-06-04 |
| android-ndk + android-sdk + aws-cli + aws-sam-cli + azure-cli + chromium + dotnet + gradle + haskell + julia + swift | 2.1 | 25.4 | <span style="color:#b6700a">12.0</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + aws-sam-cli + azure-cli + chromium + dotnet + haskell + julia + powershell + swift | 1.9 | 26.6 | <span style="color:#b6700a">14.1</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + aws-sam-cli + azure-cli + chromium + dotnet + gradle + haskell + julia + powershell | 1.8 | 23.4 | <span style="color:#b6700a">12.7</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + aws-sam-cli + azure-cli + chromium + dotnet + gradle + julia + powershell + swift | 1.8 | 23.1 | <span style="color:#b6700a">12.6</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + azure-cli + chromium + dotnet + haskell + julia + miniconda + powershell + swift | 1.5 | 27.2 | <span style="color:#b6700a">18.1</span> | 30 | 2026-06-04 |
| android-ndk + android-sdk + aws-cli + azure-cli + dotnet + gradle + haskell + julia + miniconda + powershell + swift | 1.3 | 26.7 | <span style="color:#b6700a">20.3</span> | 30 | 2026-06-04 |
| android-ndk + android-sdk + aws-cli + azure-cli + chromium + dotnet + gradle + haskell + miniconda + powershell + swift | 1.3 | 26.3 | <span style="color:#b6700a">21.0</span> | 30 | 2026-06-04 |
| android-ndk + android-sdk + aws-cli + azure-cli + chromium + dotnet + gradle + haskell + julia + miniconda + powershell | 1.2 | 24.1 | <span style="color:#b6700a">19.8</span> | 30 | 2026-06-04 |
| android-ndk + android-sdk + aws-cli + azure-cli + chromium + dotnet + gradle + haskell + julia + miniconda + swift | 1.0 | 26.1 | <span style="color:#b6700a">25.4</span> | 30 | 2026-06-04 |
| android-ndk + android-sdk + aws-cli + azure-cli + chromium + gradle + haskell + julia + miniconda + powershell + swift | 0.8 | 22.4 | <span style="color:#b6700a">26.4</span> | 30 | 2026-06-04 |
_…4 more combos not shown_

### 12-step combos

| Combo | GiB/s | Freed (GiB) | Duration (s) | Rounds | Date |
|-------|------:|------------:|-------------:|-------:|------|
| android-ndk + aws-cli + aws-sam-cli + azure-cli + chromium + dotnet + gradle + haskell + julia + miniconda + powershell + swift | 3.5 | 23.8 | <span style="color:#b6700a">6.8</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + aws-sam-cli + azure-cli + chromium + dotnet + gradle + haskell + julia + powershell + swift | 2.6 | 26.7 | <span style="color:#b6700a">10.3</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + azure-cli + chromium + dotnet + gradle + haskell + julia + miniconda + powershell + swift | 2.4 | 27.3 | <span style="color:#b6700a">11.2</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + aws-sam-cli + chromium + dotnet + gradle + haskell + julia + miniconda + powershell + swift | 2.4 | 26.4 | <span style="color:#b6700a">11.0</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + aws-sam-cli + azure-cli + chromium + dotnet + gradle + haskell + miniconda + powershell + swift | 2.2 | 26.5 | <span style="color:#b6700a">12.1</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-sam-cli + azure-cli + chromium + dotnet + gradle + haskell + julia + miniconda + powershell + swift | 2.2 | 27.3 | <span style="color:#b6700a">12.5</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + aws-sam-cli + azure-cli + chromium + dotnet + gradle + julia + miniconda + powershell + swift | 2.1 | 23.9 | <span style="color:#b6700a">11.6</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + aws-sam-cli + azure-cli + dotnet + gradle + haskell + julia + miniconda + powershell + swift | 2.0 | 26.9 | <span style="color:#b6700a">13.4</span> | 100 | 2026-06-05 |
| android-sdk + aws-cli + aws-sam-cli + azure-cli + chromium + dotnet + gradle + haskell + julia + miniconda + powershell + swift | 1.7 | 27.5 | <span style="color:#b6700a">16.0</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + aws-sam-cli + azure-cli + chromium + dotnet + gradle + haskell + julia + miniconda + swift | 1.7 | 26.3 | <span style="color:#b6700a">15.6</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + aws-sam-cli + azure-cli + chromium + gradle + haskell + julia + miniconda + powershell + swift | 1.7 | 22.6 | <span style="color:#b6700a">13.6</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + aws-sam-cli + azure-cli + chromium + dotnet + haskell + julia + miniconda + powershell + swift | 1.6 | 27.4 | <span style="color:#b6700a">17.6</span> | 100 | 2026-06-05 |
| android-ndk + android-sdk + aws-cli + aws-sam-cli + azure-cli + chromium + dotnet + gradle + haskell + julia + miniconda + powershell | 1.4 | 24.3 | <span style="color:#b6700a">17.1</span> | 100 | 2026-06-05 |

### 13-step combos

| Combo | GiB/s | Freed (GiB) | Duration (s) | Rounds | Date |
|-------|------:|------------:|-------------:|-------:|------|
| android-ndk + android-sdk + aws-cli + aws-sam-cli + azure-cli + chromium + dotnet + gradle + haskell + julia + miniconda + powershell + swift | 2.3 | 27.5 | <span style="color:#b6700a">12.0</span> | 100 | 2026-06-05 |
