import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { isAlreadyPublished } from './npm-publish-errors.mjs';
import { orderForPublish } from './publish-order.mjs';

const PACKAGES_DIR = 'packages';
const PACKAGE_NAME_RE = /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/;

function assertPackageName(name) {
	if (typeof name !== 'string' || !PACKAGE_NAME_RE.test(name)) {
		throw new Error(`invalid package name: ${String(name)}`);
	}
}

// Deps declared with the workspace protocol get their spec rewritten to a fixed
// version on publish, so a dependent must not ship before its dependency lands
// on npm. Covers runtime deps and optional deps (corsair's platform-gated frpc
// binaries); peer/dev deps don't affect a consumer's install, so skip them.
function workspaceDeps(pkg) {
	return Object.entries({
		...(pkg.dependencies ?? {}),
		...(pkg.optionalDependencies ?? {}),
	})
		.filter(
			([, spec]) => typeof spec === 'string' && spec.startsWith('workspace:'),
		)
		.map(([name]) => name);
}

function getPublishedVersion(name) {
	assertPackageName(name);
	try {
		return (
			execFileSync('npm', ['view', name, 'version'], {
				encoding: 'utf-8',
				stdio: ['ignore', 'pipe', 'ignore'],
			}).trim() || null
		);
	} catch {
		return null;
	}
}

const dirs = readdirSync(PACKAGES_DIR, { withFileTypes: true })
	.filter((d) => d.isDirectory())
	.map((d) => d.name);

const toPublish = [];

for (const dir of dirs) {
	const pkgPath = join(PACKAGES_DIR, dir, 'package.json');
	if (!existsSync(pkgPath)) continue;

	const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
	if (pkg.private) continue;

	const published = getPublishedVersion(pkg.name);
	if (published === pkg.version) {
		console.log(`SKIP ${pkg.name}@${pkg.version} (already published)`);
		continue;
	}

	console.log(
		`QUEUE ${pkg.name}@${pkg.version} (npm has ${published ?? 'nothing'})`,
	);
	toPublish.push({
		dir,
		name: pkg.name,
		version: pkg.version,
		workspaceDeps: workspaceDeps(pkg),
	});
}

if (toPublish.length === 0) {
	console.log('\nNo packages to publish.');
	process.exit(0);
}

// Only deps published in this same run need ordering — anything already on npm
// is available regardless of order.
const publishNames = new Set(toPublish.map((p) => p.name));
for (const p of toPublish) {
	p.deps = p.workspaceDeps.filter((d) => publishNames.has(d));
}
const ordered = orderForPublish(toPublish);

console.log(`\nBuilding ${ordered.length} package(s)...`);
for (const { name } of ordered) {
	assertPackageName(name);
}
execFileSync(
	'pnpm',
	['exec', 'turbo', 'build', ...ordered.map((p) => `--filter=${p.name}`)],
	{ stdio: 'inherit' },
);

console.log(`\nPublishing ${ordered.length} package(s)...`);

const npmToken = process.env.NPM_TOKEN;
const corsairDevToken = process.env.NPM_CORSAIR_DEV_TOKEN;

let publishedCount = 0;
const failed = new Set();

for (const { name, version, deps } of ordered) {
	// Never publish a dependent whose in-release dependency failed — its
	// rewritten version wouldn't exist on npm, so the release would be broken.
	const blockedBy = deps.filter((d) => failed.has(d));
	if (blockedBy.length > 0) {
		console.error(
			`  FAILED ${name}@${version} — dependency failed: ${blockedBy.join(', ')}`,
		);
		failed.add(name);
		continue;
	}

	const token = name === 'corsair' ? npmToken : corsairDevToken;
	if (!token) {
		console.error(
			`  FAILED ${name} — missing token (${name === 'corsair' ? 'NPM_TOKEN' : 'NPM_CORSAIR_DEV_TOKEN'})`,
		);
		failed.add(name);
		continue;
	}

	assertPackageName(name);
	console.log(`  Publishing ${name}@${version}...`);
	try {
		const out = execFileSync(
			'pnpm',
			[
				'--filter',
				name,
				'publish',
				'--provenance',
				'--access',
				'public',
				'--no-git-checks',
			],
			{
				encoding: 'utf-8',
				maxBuffer: 10 * 1024 * 1024,
				stdio: ['ignore', 'pipe', 'pipe'],
				env: { ...process.env, NODE_AUTH_TOKEN: token },
			},
		);
		process.stdout.write(out);
		publishedCount++;
	} catch (err) {
		const out = `${err.stdout ?? ''}${err.stderr ?? ''}`;
		process.stdout.write(out);
		if (isAlreadyPublished(out)) {
			console.log(`  SKIP ${name}@${version} (already on npm)`);
			continue;
		}
		console.error(`  FAILED ${name}@${version}`);
		failed.add(name);
	}
}

if (failed.size > 0) {
	console.error(
		`\nFailed to publish ${failed.size}: ${[...failed].join(', ')}`,
	);
	process.exit(1);
}

console.log(`\nDone. Published ${publishedCount} package(s).`);
