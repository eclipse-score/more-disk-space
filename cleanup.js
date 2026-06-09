//  Copyright (c) 2026 Contributors to the Eclipse Foundation

//  See the NOTICE file(s) distributed with this work for additional
//  information regarding copyright ownership.

//  This program and the accompanying materials are made available under the
//  terms of the Apache License Version 2.0 which is available at
//  https://www.apache.org/licenses/LICENSE-2.0

//  SPDX-License-Identifier: Apache-2.0

'use strict';

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const _raw = require('./steps.json');
const STEPS = _raw.map(s => ({
  name: s.name,
  level: s.level,
  paths: () => expandPaths(s.paths),
  ...(s.apt && { apt: s.apt }),
}));

// Resolve /parent/prefix* without shell glob expansion
function resolveGlob(parent, prefix) {
  try {
    return fs.readdirSync(parent)
      .filter(e => e.startsWith(prefix))
      .map(e => path.join(parent, e));
  } catch {
    return [];
  }
}

// Expand a path spec: trailing * means prefix-glob, otherwise return as-is
function expandPaths(pathSpecs) {
  return pathSpecs.flatMap(spec => {
    if (!spec.endsWith('*')) return [spec];
    const lastSlash = spec.lastIndexOf('/');
    return resolveGlob(spec.slice(0, lastSlash), spec.slice(lastSlash + 1, -1));
  });
}

// Remove installed packages matching a regex pattern, then autoremove cascades.
// Files may already be gone via rmz — apt still cleans up package metadata and triggers autoremove.
function aptRemove(pattern) {
  let packages;
  try {
    const out = execFileSync('dpkg', ['-l'], { encoding: 'utf8' });
    packages = out.split('\n')
      .filter(line => line.startsWith('ii'))
      .map(line => line.split(/\s+/)[1])
      .filter(pkg => pkg && new RegExp(pattern).test(pkg));
  } catch {
    return;
  }
  if (!packages.length) return;

  console.log(`Removing packages: ${packages.join(' ')}`);
  try {
    execFileSync('sudo', ['apt-get', 'remove', '-y', '--fix-missing', ...packages], { stdio: 'inherit' });
    execFileSync('sudo', ['apt-get', 'autoremove', '-y'], { stdio: 'inherit' });
    execFileSync('sudo', ['apt-get', 'clean'], { stdio: 'inherit' });
  } catch {
    console.error(`Warning: apt removal failed for pattern ${pattern}`);
  }
}

const RMZ_VERSION = '3.1.1';
const RMZ_SHA256 = '9017131f24a6a619568316d3cf1aabbf4fb8297d8082b11fd2b6817436876a3b';

function installRmz() {
  console.log(`Downloading rmz ${RMZ_VERSION} for parallel removal...`);
  const rmzBin = '/tmp/rmz';
  execFileSync('curl', [
    '-fsSL',
    `https://github.com/SUPERCILEX/fuc/releases/download/${RMZ_VERSION}/x86_64-unknown-linux-gnu-rmz`,
    '-o', rmzBin,
  ], { stdio: 'inherit' });
  const actual = execFileSync('sha256sum', [rmzBin], { encoding: 'utf8' }).split(' ')[0];
  if (actual !== RMZ_SHA256) {
    throw new Error(`rmz checksum mismatch: expected ${RMZ_SHA256}, got ${actual}`);
  }
  execFileSync('chmod', ['+x', rmzBin]);
  return rmzBin;
}

// Remove paths that are descendants of another path in the list.
// rmz fails mid-traversal when a parent and child are both passed simultaneously.
function deduplicatePaths(paths) {
  return paths.filter(p =>
    !paths.some(other => other !== p && p.startsWith(other + '/'))
  );
}

// Recursively remove a directory using 'rm -rf'
// Continues silently if removal fails (e.g., permission denied)
function rmRf(dirPath) {
  try {
    execFileSync('sudo', ['rm', '-rf', dirPath], { stdio: 'inherit' });
  } catch {
    console.error(`Warning: Failed to remove ${dirPath}`);
  }
}

// Execute cleanup for a list of steps.
// Uses rmz for parallel removal when there are enough paths to benefit from it,
// otherwise falls back to sequential rm -rf.
function performCleanup(steps) {
  const allPaths = deduplicatePaths(steps.flatMap(s => s.paths()));
  const useRmz = allPaths.length > 3;

  let usedRmz = false;
  if (useRmz) {
    try {
      const rmzBin = installRmz();
      allPaths.forEach(p => console.log(`Removing ${p}...`));
      execFileSync('sudo', [rmzBin, '--force', ...allPaths], { stdio: 'inherit' });
      usedRmz = true;
    } catch (err) {
      console.error(`Warning: rmz failed (${err.message}), falling back to sequential rm -rf`);
    }
  }
  if (!usedRmz) {
    for (const p of allPaths) {
      console.log(`Removing ${p}...`);
      rmRf(p);
    }
  }

  // apt cascade: removes package metadata and triggers autoremove of dependents.
  // Runs after rmz so files are already gone — apt just cleans up registrations.
  for (const step of steps.filter(s => s.apt)) {
    console.log(`Removing ${step.name} packages...`);
    aptRemove(step.apt);
  }
}

function getAvailableSpaceBytes() {
  const out = execFileSync('df', ['--output=avail', '-B1', '/'], { encoding: 'utf8' });
  return Number(out.trim().split('\n')[1]);
}

function getAvailableSpaceGiB() {
  return Math.floor(getAvailableSpaceBytes() / (1024 ** 3));
}

// Returns steps up to the given level.
function selectSteps(level = 4) {
  return STEPS.filter(step => step.level <= level);
}

// Returns only the steps whose names are in the given set.
function selectByNames(names) {
  return STEPS.filter(s => names.has(s.name));
}

module.exports = { STEPS, performCleanup, getAvailableSpaceGiB, selectSteps, selectByNames };
