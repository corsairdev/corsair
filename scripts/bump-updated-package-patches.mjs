#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function getChangedPackageManifests() {
	const output = execFileSync('git', ['diff', '--name-only'], {
		cwd: repoRoot,
		encoding: 'utf8',
	});

	return [
		...new Set(
			output
				.split('\n')
				.map((line) => line.trim())
				.filter((line) => /^packages\/[^/]+\/package\.json$/.test(line)),
		),
	].sort();
}

function bumpPatch(version) {
	const match = version.match(/^(\d+)\.(\d+)\.(\d+)(.*)$/);

	if (!match) {
		throw new Error(`Unsupported version format: ${version}`);
	}

	const [, major, minor, patch, suffix] = match;
	return `${major}.${minor}.${Number(patch) + 1}${suffix}`;
}

function readHeadPackageJson(manifest) {
	const output = execFileSync('git', ['show', `HEAD:${manifest}`], {
		cwd: repoRoot,
		encoding: 'utf8',
	});

	return JSON.parse(output);
}

const manifests = getChangedPackageManifests();

if (manifests.length === 0) {
	console.log('No changed package manifests found.');
	process.exit(0);
}

for (const manifest of manifests) {
	const absolutePath = resolve(repoRoot, manifest);
	const packageJson = JSON.parse(readFileSync(absolutePath, 'utf8'));
	const headPackageJson = readHeadPackageJson(manifest);

	if (typeof packageJson.version !== 'string') {
		throw new Error(`${manifest} does not have a string version field`);
	}

	if (typeof headPackageJson.version !== 'string') {
		throw new Error(`HEAD:${manifest} does not have a string version field`);
	}

	const previousVersion = headPackageJson.version;
	const nextVersion = bumpPatch(previousVersion);

	if (packageJson.version === nextVersion) {
		console.log(`${manifest}: already ${nextVersion}`);
		continue;
	}

	packageJson.version = nextVersion;

	writeFileSync(absolutePath, `${JSON.stringify(packageJson, null, 2)}\n`);
	console.log(
		`${relative(repoRoot, absolutePath)}: ${previousVersion} -> ${nextVersion}`,
	);
}
