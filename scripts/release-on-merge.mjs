// Release on merge: every package whose shipped files changed since its last
// release moves to the next patch version, so a merged fix always reaches npm.
// deploy.yml then publishes whatever version is not on npm yet.
//
//   node scripts/release-on-merge.mjs [--out plan.json] [--dry-run]
//
// A release is a git tag `<name>@<version>` on the main commit that set that
// version. A package whose current version has no tag gets one when npm
// already has that version: on the first run for every package, and after each
// publish. The tag goes on the first-parent commit that introduced the version.
// A version npm doesn't have yet (a new package, or a bump deploy.yml hasn't
// published) is left alone until it lands, so nothing is bumped twice.
//
// A version raised by hand in the PR (a minor or major) is kept: it isn't on
// npm, so this script waits for deploy.yml to publish it.
//
// Writes the bumped package.json files (unless --dry-run) and, with --out, a
// JSON plan: { bumps: [{ name, dir, from, to, files }], tags: [{ tag, sha }] }.
// The workflow creates the tags, commits the bumps and pushes both.
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export const PACKAGE_ROOTS = ['packages', 'adapters'];

// Never bumped here, whatever changes. @corsair-dev/app: npm's 0.1.2 to 0.1.5
// are a different package (the old hosted repo's typed SDK), so the next patch
// would replace that SDK with packages/app's MCP client adapters. Remove it once
// someone decides between private, a new name or overwriting.
export const HELD_PACKAGES = new Set(['@corsair-dev/app']);

// These bundle their devDependencies into the tarball (Studio ships React in its
// web build), so a change to them changes what consumers get. Elsewhere a
// devDependency never reaches a consumer, and a bulk bump shouldn't release 400
// packages. A lockfile-only upgrade within the same range still goes unnoticed.
export const BUNDLES_DEV_DEPENDENCIES = new Set(['@corsair-dev/studio']);

// Files inside a package that don't reach the npm tarball, or don't change
// what it does. A change to only these files doesn't release the package.
const NOT_SHIPPED = [
	/(^|\/)(tests?|__tests__|__mocks__|fixtures)\//,
	/\.(test|spec)\.[cm]?[jt]sx?$/,
	/\.mdx?$/i,
	/^plugin-docs\.ya?ml$/,
	/^(jest|vitest)\.config\.[cm]?[jt]s$/,
	/(^|\/)node_modules\//,
];

// corsair/tests is a published entry point (tests.ts), and plugin tests import
// these helpers from it, so they ship even though they live under tests/.
export const SHIPPED_TEST_HELPERS = new Map([
	[
		'packages/corsair',
		new Set([
			'tests/index.ts',
			'tests/plugins-test-utils.ts',
			'tests/setup-db.ts',
		]),
	],
]);

/** True when a path (relative to the package in `dir`) can change the published package. */
export function isShippedPath(path, dir) {
	if (path === 'package.json') return true;
	if (SHIPPED_TEST_HELPERS.get(dir)?.has(path)) return true;
	return !NOT_SHIPPED.some((re) => re.test(path));
}

/**
 * True when package.json changed in a way consumers see. The version moves on
 * every release, and devDependencies never reach a consumer.
 */
export function packageJsonChanged(beforeText, afterText) {
	const strip = (text) => {
		const { version, devDependencies, name, ...rest } = JSON.parse(text);
		return JSON.stringify(
			BUNDLES_DEV_DEPENDENCIES.has(name) ? { ...rest, devDependencies } : rest,
		);
	};
	return strip(beforeText) !== strip(afterText);
}

function parseVersion(v) {
	const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(v ?? '');
	return m ? m.slice(1).map(Number) : null;
}

/** -1, 0 or 1; null when either side isn't a plain x.y.z. */
export function compareVersions(a, b) {
	const pa = parseVersion(a);
	const pb = parseVersion(b);
	if (!pa || !pb) return null;
	for (let i = 0; i < 3; i++) {
		if (pa[i] !== pb[i]) return pa[i] < pb[i] ? -1 : 1;
	}
	return 0;
}

export function nextPatch(v) {
	const p = parseVersion(v);
	if (!p) throw new Error(`not a plain x.y.z version: ${v}`);
	return `${p[0]}.${p[1]}.${p[2] + 1}`;
}

export function releaseTag(name, version) {
	return `${name}@${version}`;
}

function git(cwd, args) {
	return execFileSync('git', args, {
		cwd,
		encoding: 'utf-8',
		maxBuffer: 64 * 1024 * 1024,
		stdio: ['ignore', 'pipe', 'pipe'],
	}).trim();
}

function tryGit(cwd, args) {
	try {
		return git(cwd, args);
	} catch {
		return null;
	}
}

/** Workspace packages a package needs at runtime (pinned to an exact version on publish). */
function runtimeWorkspaceDeps(pkg) {
	return Object.entries({
		...(pkg.dependencies ?? {}),
		...(pkg.optionalDependencies ?? {}),
	})
		.filter(
			([, spec]) => typeof spec === 'string' && spec.startsWith('workspace:'),
		)
		.map(([name]) => name);
}

export function listPackages(cwd) {
	const out = [];
	for (const root of PACKAGE_ROOTS) {
		const rootDir = join(cwd, root);
		if (!existsSync(rootDir)) continue;
		for (const d of readdirSync(rootDir, { withFileTypes: true })) {
			if (!d.isDirectory()) continue;
			const dir = `${root}/${d.name}`;
			const pkgPath = join(cwd, dir, 'package.json');
			if (!existsSync(pkgPath)) continue;
			const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
			if (pkg.private || !pkg.name || !pkg.version) continue;
			out.push({
				dir,
				name: pkg.name,
				version: pkg.version,
				deps: runtimeWorkspaceDeps(pkg),
			});
		}
	}
	return out.sort((a, b) => a.dir.localeCompare(b.dir));
}

function topLevelVersionAt(cwd, rev, path) {
	const text = tryGit(cwd, ['show', `${rev}:${path}`]);
	if (text === null) return null;
	try {
		return JSON.parse(text).version ?? null;
	} catch {
		return null;
	}
}

/**
 * The newest first-parent commit on HEAD whose package.json moved the
 * top-level version to `version` (a nested "version" key doesn't count).
 */
export function versionSetCommit(cwd, dir, version) {
	const path = `${dir}/package.json`;
	const commits = git(cwd, [
		'log',
		'--first-parent',
		'--format=%H %P',
		'--',
		path,
	])
		.split('\n')
		.filter(Boolean);
	for (const line of commits) {
		const [sha, firstParent] = line.split(' ');
		if (topLevelVersionAt(cwd, sha, path) !== version) continue;
		const before = firstParent
			? topLevelVersionAt(cwd, firstParent, path)
			: null;
		if (before !== version) return sha;
	}
	return null;
}

const isAncestor = (cwd, older, newer) =>
	tryGit(cwd, ['merge-base', '--is-ancestor', older, newer]) !== null;

/** Files in the package that changed between `base` and HEAD and can change what ships. */
function shippedChanges(cwd, base, dir) {
	// --no-renames: a shipped file moved into tests/ would otherwise show up only
	// under its new, ignored path.
	const changed = git(cwd, [
		'diff',
		'--no-renames',
		'--name-only',
		// NUL-delimited: otherwise git quotes a non-ASCII path, and the closing
		// quote stops the suffix checks below from matching.
		'-z',
		base,
		'HEAD',
		'--',
		dir,
	])
		.split('\0')
		.filter(Boolean)
		.map((f) => f.slice(dir.length + 1));
	return changed.filter((f) => {
		if (!isShippedPath(f, dir)) return false;
		if (f !== 'package.json') return true;
		const before = tryGit(cwd, ['show', `${base}:${dir}/package.json`]);
		const after = readFileSync(join(cwd, dir, 'package.json'), 'utf-8');
		return before === null || packageJsonChanged(before, after);
	});
}

async function mapLimit(items, limit, fn) {
	const results = new Array(items.length);
	let next = 0;
	const worker = async () => {
		while (next < items.length) {
			const i = next++;
			results[i] = await fn(items[i], i);
		}
	};
	await Promise.all(Array.from({ length: limit }, worker));
	return results;
}

/**
 * The next patch after the newer of the repo version and npm's latest, skipped
 * past any number npm already has (a version can never be published twice).
 * Not past the highest version on npm: `corsair` has a stray 1.0.0 and the
 * 2016 0.0.x of the name's previous owner, while latest is 0.1.x.
 */
export function nextFreeVersion(repoVersion, latest, npmVersions = []) {
	const taken = new Set(npmVersions);
	let next = nextPatch(
		latest && compareVersions(latest, repoVersion) === 1 ? latest : repoVersion,
	);
	while (taken.has(next)) next = nextPatch(next);
	return next;
}

/**
 * Works out what to release. `registry.versions(name)` returns the versions on
 * npm and the latest dist-tag ({ versions: Set, latest }), or null when the
 * package isn't on npm. It is only asked about packages without a tag for
 * their current version, and about packages being bumped.
 *
 * Returns { bumps, tags, waiting }: `waiting` lists current versions npm
 * doesn't have yet, which deploy.yml still has to publish.
 */
export async function planRelease({ cwd, registry, log = () => {} }) {
	const packages = listPackages(cwd);
	const existingTags = new Set(
		git(cwd, ['tag', '--list']).split('\n').filter(Boolean),
	);
	const tags = [];
	const waiting = [];
	// The commit that set each waiting version.
	const waitingSetAt = new Map();
	// Released packages: their current version is on npm.
	const released = new Map();
	const npmCache = new Map();
	const npmVersions = async (name) => {
		if (!npmCache.has(name)) npmCache.set(name, await registry.versions(name));
		return npmCache.get(name);
	};

	await mapLimit(packages, 8, async (pkg) => {
		const tag = releaseTag(pkg.name, pkg.version);
		let base = existingTags.has(tag)
			? git(cwd, ['rev-list', '-n', '1', tag])
			: null;
		if (!base) {
			const npm = await npmVersions(pkg.name);
			if (!npm?.versions.has(pkg.version)) {
				log(`WAIT ${tag}: not on npm yet; deploy.yml publishes it`);
				waiting.push({ name: pkg.name, version: pkg.version });
				waitingSetAt.set(pkg.name, versionSetCommit(cwd, pkg.dir, pkg.version));
				return;
			}
			base = versionSetCommit(cwd, pkg.dir, pkg.version);
			if (!base) {
				log(`SKIP ${tag}: no commit on main sets this version`);
				return;
			}
			tags.push({ tag, sha: base });
		}
		released.set(pkg.name, {
			pkg,
			base,
			files: shippedChanges(cwd, base, pkg.dir),
		});
	});

	const bumps = new Map();
	const bump = async (pkg, files) => {
		if (HELD_PACKAGES.has(pkg.name)) {
			log(`SKIP ${pkg.name}: held, see HELD_PACKAGES`);
			return;
		}
		const npm = await npmVersions(pkg.name);
		if (!parseVersion(pkg.version)) {
			log(`SKIP ${pkg.name}: ${pkg.version} is not a plain x.y.z version`);
			return;
		}
		bumps.set(pkg.name, {
			name: pkg.name,
			dir: pkg.dir,
			from: pkg.version,
			to: nextFreeVersion(pkg.version, npm?.latest, [...(npm?.versions ?? [])]),
			files,
		});
	};
	for (const { pkg, files } of released.values()) {
		if (files.length > 0) await bump(pkg, files);
	}

	// pnpm publish pins a workspace dependency to its exact version, so a
	// package that depends on a bumped one at runtime (cli, mcp and studio on
	// corsair, corsair on its frpc binaries) is released again to pick it up. A
	// version waiting for npm counts: a minor raised by hand gets no entry in
	// `bumps`, and once it lands no later run would see a change in its dependents.
	//
	// Not when the dependent's own release sits at or after the commit that set
	// the waiting version: it was published with that version pinned. That is
	// every package this workflow bumped in the same commit, and it matters
	// right after a publish. npm can take minutes to show a new version, and a
	// dependent it shows first would otherwise be released a second time.
	const pending = new Map(waiting.map((w) => [w.name, w.version]));
	const carries = (base, dep) => {
		const setAt = waitingSetAt.get(dep);
		return Boolean(setAt) && isAncestor(cwd, setAt, base);
	};
	const newVersion = (name, base) =>
		bumps.get(name)?.to ??
		(carries(base, name) ? undefined : pending.get(name));
	for (let grew = true; grew; ) {
		grew = false;
		for (const { pkg, base } of released.values()) {
			if (bumps.has(pkg.name)) continue;
			const bumpedDeps = pkg.deps.filter((d) => newVersion(d, base));
			if (bumpedDeps.length === 0) continue;
			await bump(
				pkg,
				bumpedDeps.map((d) => `depends on ${d} ${newVersion(d, base)}`),
			);
			if (bumps.has(pkg.name)) grew = true;
		}
	}

	const byName = (a, b) => (a.name ?? a.tag).localeCompare(b.name ?? b.tag);
	return {
		bumps: [...bumps.values()].sort(byName),
		tags: tags.sort(byName),
		waiting: waiting.sort(byName),
	};
}

/**
 * Where the top-level "version" value sits in package.json text: a small scan
 * that tracks object depth outside strings, so a nested "version" key (or a
 * dependency named version) is never the one rewritten.
 */
export function topLevelVersionRange(text) {
	let depth = 0;
	let i = 0;
	const readString = (start) => {
		let j = start + 1;
		while (j < text.length && text[j] !== '"') j += text[j] === '\\' ? 2 : 1;
		return j; // index of the closing quote
	};
	while (i < text.length) {
		const ch = text[i];
		if (ch === '"') {
			const end = readString(i);
			const key = text.slice(i + 1, end);
			let k = end + 1;
			while (/\s/.test(text[k] ?? '')) k++;
			if (depth === 1 && key === 'version' && text[k] === ':') {
				k++;
				while (/\s/.test(text[k] ?? '')) k++;
				if (text[k] !== '"') return null;
				return { start: k + 1, end: readString(k) };
			}
			i = end + 1;
			continue;
		}
		if (ch === '{' || ch === '[') depth++;
		else if (ch === '}' || ch === ']') depth--;
		i++;
	}
	return null;
}

/** Rewrites only the top-level version, keeping the file's formatting. */
export function applyBump(cwd, bump) {
	const path = join(cwd, bump.dir, 'package.json');
	const text = readFileSync(path, 'utf-8');
	const range = topLevelVersionRange(text);
	if (!range || text.slice(range.start, range.end) !== bump.from) {
		throw new Error(`${path}: top-level version ${bump.from} not found`);
	}
	writeFileSync(
		path,
		text.slice(0, range.start) + bump.to + text.slice(range.end),
	);
}

/** The npm registry, read with the abbreviated packument (one request per package). */
export function npmRegistry(base = 'https://registry.npmjs.org') {
	return {
		async versions(name) {
			const url = `${base}/${name.replaceAll('/', '%2F')}`;
			for (let attempt = 1; ; attempt++) {
				const res = await fetch(url, {
					headers: { accept: 'application/vnd.npm.install-v1+json' },
				});
				if (res.status === 404) return null;
				if (res.ok) {
					const doc = await res.json();
					return {
						versions: new Set(Object.keys(doc.versions ?? {})),
						latest: doc['dist-tags']?.latest ?? null,
					};
				}
				// A wrong answer here would tag or bump the wrong version, so
				// retry rate limits and outages for a while, then fail the run
				// instead of guessing. Runner IPs are shared, so 429s happen.
				const retryable = res.status === 429 || res.status >= 500;
				if (!retryable || attempt >= 6) {
					throw new Error(`npm registry ${res.status} for ${name}`);
				}
				const wait = Number(res.headers.get('retry-after')) || 2 ** attempt;
				await new Promise((r) => setTimeout(r, Math.min(wait, 60) * 1000));
			}
		},
	};
}

if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(process.argv[1]).href
) {
	const args = process.argv.slice(2);
	const dryRun = args.includes('--dry-run');
	const outIdx = args.indexOf('--out');
	const out = outIdx >= 0 ? args[outIdx + 1] : null;
	const cwd = process.cwd();

	const plan = await planRelease({
		cwd,
		registry: npmRegistry(),
		log: (line) => console.log(line),
	});
	for (const t of plan.tags)
		console.log(`TAG ${t.tag} -> ${t.sha.slice(0, 9)}`);
	for (const w of plan.waiting) console.log(`WAITING ${w.name}@${w.version}`);
	for (const b of plan.bumps) {
		console.log(`BUMP ${b.name} ${b.from} -> ${b.to} (${b.files.join(', ')})`);
		if (!dryRun) applyBump(cwd, b);
	}
	console.log(
		`\n${plan.bumps.length} package(s) to release, ${plan.tags.length} release tag(s) to record.`,
	);
	if (out) writeFileSync(out, `${JSON.stringify(plan, null, 2)}\n`);
}
