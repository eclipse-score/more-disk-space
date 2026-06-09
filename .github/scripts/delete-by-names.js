#!/usr/bin/env node
//  Copyright (c) 2026 Contributors to the Eclipse Foundation

//  See the NOTICE file(s) distributed with this work for additional
//  information regarding copyright ownership.

//  This program and the accompanying materials are made available under the
//  terms of the Apache License Version 2.0 which is available at
//  https://www.apache.org/licenses/LICENSE-2.0

//  SPDX-License-Identifier: Apache-2.0

// Deletes exactly the named cleanup steps, bypassing the action.
// Called directly by benchmark-ours.yml to measure isolated step costs.
//
// Usage (in a workflow step):
//   env:
//     NAMES: android-ndk,dotnet
//   run: node .github/scripts/delete-by-names.js

'use strict';

const path = require('path');
const { performCleanup, selectByNames } = require(path.join(__dirname, '..', '..', 'cleanup'));

const raw = process.env['NAMES'] ?? '';
const names = new Set(raw.split(',').map(s => s.trim()).filter(Boolean));
if (names.size === 0) {
  console.error('NAMES env var is required (comma-separated step names)');
  process.exit(1);
}

const steps = selectByNames(names);
if (steps.length === 0) {
  console.error(`No matching steps found for NAMES=${raw}`);
  process.exit(1);
}

console.log(`⚠️  Isolation benchmark: running only [${[...names].join(', ')}]`);
performCleanup(steps);
