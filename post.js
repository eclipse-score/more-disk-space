//  Copyright (c) 2026 Contributors to the Eclipse Foundation

//  See the NOTICE file(s) distributed with this work for additional
//  information regarding copyright ownership.

//  This program and the accompanying materials are made available under the
//  terms of the Apache License Version 2.0 which is available at
//  https://www.apache.org/licenses/LICENSE-2.0

//  SPDX-License-Identifier: Apache-2.0

const { execFileSync } = require('child_process');

// Get available disk space in GiB (gigabytes)
function getAvailableSpaceGiB() {
  const out = execFileSync(
    'df',
    ['--output=avail', '-B1G', '/'],
    { encoding: 'utf8' }
  );

  return Number(out.trim().split('\n')[1]);
}

function getState(name) {
  return process.env[`STATE_${name}`];
}

function getStateBool(name) {
  return getState(name) === 'true';
}

function getStateNumber(name, fallback) {
  const v = Number(getState(name));
  return Number.isFinite(v) ? v : fallback;
}

// Provide helpful suggestions based on final available space
function reportSuggestions(availableGiB, githubHosted) {
  if (!githubHosted) return;

  if (availableGiB < 5) {
    console.log('⚠️  Warning: Less than 5 GiB remaining.');
    console.log('   Consider using a higher level to free more space.');
  } else if (availableGiB < 15) {
    console.log(`✅ Moderate buffer remaining (${availableGiB} GiB) — all good.`);
  } else {
    console.log(`✅ Good buffer remaining (${availableGiB} GiB).`);
  }
}

async function cleanup() {
  try {
    console.log('');
    console.log('📊 Final disk space report');
    console.log('==========================');

    // Read state persisted by index.js
    const before = getStateNumber('before', 0);
    const after = getStateNumber('after', 0);
    const githubHosted = getStateBool('githubHosted');
    const supportedPlatform = getStateBool('supportedPlatform');

    if (!supportedPlatform) {
      console.log('⏭️  Unsupported platform; skipping disk space report');
      console.log('');
      return;
    }

    const final = getAvailableSpaceGiB();

    const freedByAction = after - before;
    const usedByBuild = after - final;

    console.log(`Space before action:   ${before} GiB`);
    if (githubHosted && freedByAction > 0) {
      console.log(`Space freed by action: ${freedByAction} GiB`);
    }
    if (githubHosted && usedByBuild > 0) {
      console.log(`Space used by build:   ${usedByBuild} GiB`);
    }
    console.log(`Available now:         ${final} GiB`);
    console.log('');

    reportSuggestions(final, githubHosted);

  } catch (error) {
    console.error('Warning: Failed to report final disk space');
    console.error(error.message);
    // Don't fail the job on cleanup errors
  }
}

cleanup();
