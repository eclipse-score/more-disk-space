//  Copyright (c) 2026 Contributors to the Eclipse Foundation

//  See the NOTICE file(s) distributed with this work for additional
//  information regarding copyright ownership.

//  This program and the accompanying materials are made available under the
//  terms of the Apache License Version 2.0 which is available at
//  https://www.apache.org/licenses/LICENSE-2.0

//  SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const { performCleanup, getAvailableSpaceGiB, selectSteps } = require('./cleanup');


// Detect the runner environment from RUNNER_ENVIRONMENT variable
// Returns 'github-hosted' or 'self-hosted' (or 'unknown' if not set)
function runnerEnvironment() {
  return process.env.RUNNER_ENVIRONMENT || 'unknown';
}

// Check if running on a GitHub-hosted runner (as opposed to self-hosted)
function isGithubHosted() {
  return runnerEnvironment() === 'github-hosted';
}

// Get the operating system platform (returns 'linux', 'win32', 'darwin', etc.)
function platform() {
  return process.platform || 'unknown';
}

// Check if running on Linux
function isLinux() {
  return platform() === 'linux';
}

// Persist data to the post step via GITHUB_STATE file
// The post step (post.js) will read these values to report results
function persistForPostStep(stateObject) {
  if (!process.env.GITHUB_STATE) throw new Error('GITHUB_STATE not set');

  for (const [key, value] of Object.entries(stateObject)) {
    fs.appendFileSync(process.env.GITHUB_STATE, `${key}=${value}\n`);
  }
}

async function run() {
  try {
    const githubHosted = isGithubHosted();
    const supportedPlatform = isLinux();

    if (!supportedPlatform) {
      console.log(`ℹ️  Unsupported platform: ${platform()}`);
      console.log('⏭️  This action only runs on Linux');
      console.log('');
      persistForPostStep({ before: 0, after: 0, githubHosted, supportedPlatform });
      return;
    }

    const before = getAvailableSpaceGiB();
    const levelRaw = process.env['INPUT_LEVEL'] ?? '2';
    const level = parseInt(levelRaw, 10);
    if (!Number.isInteger(level) || level < 1 || level > 4) {
      console.error(`❌ Error: Invalid level '${levelRaw}'. Must be 1, 2, 3, or 4.`);
      process.exit(1);
    }
    const steps = selectSteps(level);

    console.log(`🗑️  More Disk Space - running ${steps.length} step${steps.length !== 1 ? 's' : ''} (level ${level})`);
    console.log('');
    console.log(`Available space before: ${before} GiB`);
    console.log('');

    if (githubHosted) {
      performCleanup(steps);
      const after = getAvailableSpaceGiB();
      const freed = after - before;
      console.log('');
      console.log('✅ Cleanup complete!');
      console.log(`Available space after: ${after} GiB`);
      console.log(`Space freed: ${freed} GiB`);
      persistForPostStep({ before, after, githubHosted, supportedPlatform });
    } else {
      console.log('ℹ️  Running on Self-hosted runner - cleanup skipped');
      console.log('');
      persistForPostStep({ before, after: before, githubHosted, supportedPlatform });
    }

  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

run();
