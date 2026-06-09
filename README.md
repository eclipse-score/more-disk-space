<!--
 Copyright (c) 2026 Contributors to the Eclipse Foundation

 See the NOTICE file(s) distributed with this work for additional
 information regarding copyright ownership.

 This program and the accompanying materials are made available under the
 terms of the Apache License Version 2.0 which is available at
 https://www.apache.org/licenses/LICENSE-2.0

 SPDX-License-Identifier: Apache-2.0
-->

# More-Disk-Space

**Trivial to use and fast disk cleanup**

## Quick Start

```yaml
- uses: eclipse-score/more-disk-space@v1.1
  with:
    level: 2  # Default
```

## Overview

| Level | Freed Space | Duration | Efficiency | What Gets Deleted                              |
| ----: | ----------- | -------- | ---------- | ---------------------------------------------- |
|     1 | 16.5 GiB    | ~3s      | 6.4 GiB/s  | Swift, PowerShell, Chromium, Android NDK, .NET |
|     2 | 22.8 GiB    | ~4s      | 6.2 GiB/s  | +Gradle, Haskell, Julia, AWS CLI, Azure CLI    |
|     3 | 26.5 GiB    | ~10s     | 2.6 GiB/s  | +Android SDK                                   |
|     4 | 27.5 GiB    | ~12s     | 2.3 GiB/s  | +AWS SAM CLI, Miniconda                        |

This action is **2–6× faster** than alternatives at equivalent cleanup sizes.

→ [Why it's faster than other actions](docs/comparison.md)
