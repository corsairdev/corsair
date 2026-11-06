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

export const PACKAGE_ROOTS = ['packages', 'adapters'];

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

/** True when a path (relative to the package) can change the published package. */
export function isShippedPath(path) {
	if (path === 'package.json') return true;
	return !NOT_SHIPPED.some((re) => re.test(path));
}

/**
 * True when package.json changed in a way consumers see. The version moves on
 * every release, and devDependencies never reach a consumer.
 */
export function packageJsonChanged(beforeText, afterText) {
	const strip = (text) => {
		const { version, devDependencies, ...rest } = JSON.parse(text);
		return JSON.stringify(rest);
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
			out.push({ dir, name: pkg.name, version: pkg.version });
		}
	}
	return out.sort((a, b) => a.dir.localeCompare(b.dir));
}

/** The newest first-parent commit on HEAD that introduced `"version": "<v>"`. */
function versionSetCommit(cwd, dir, version) {
	const out = git(cwd, [
		'log',
		'--first-parent',
		'--format=%H',
		`-S"version": "${version}"`,
		'--',
		`${dir}/package.json`,
	]);
	return out.split('\n')[0] || null;
}

/** Files in the package that changed between `base` and HEAD and can change what ships. */
function shippedChanges(cwd, base, dir) {
	const changed = git(cwd, ['diff', '--name-only', base, 'HEAD', '--', dir])
		.split('\n')
		.filter(Boolean)
		.map((f) => f.slice(dir.length + 1));
	return changed.filter((f) => {
		if (!isShippedPath(f)) return false;
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
 * Works out what to release. `registry.versions(name)` returns the versions on
 * npm and the latest dist-tag ({ versions: Set, latest }), or null when the
 * package isn't on npm. It is only asked about packages without a tag for
 * their current version, and about packages being bumped.
 */
export async function planRelease({ cwd, registry, log = () => {} }) {
	const packages = listPackages(cwd);
	const existingTags = new Set(
		git(cwd, ['tag', '--list']).split('\n').filter(Boolean),
	);
	const tags = [];
	const bumps = [];

	await mapLimit(packages, 16, async (pkg) => {
		const tag = releaseTag(pkg.name, pkg.version);
		let base = existingTags.has(tag)
			? git(cwd, ['rev-list', '-n', '1', tag])
			: null;
		let npm = null;
		if (!base) {
			npm = await registry.versions(pkg.name);
			if (!npm?.versions.has(pkg.version)) {
				log(`WAIT ${tag}: not on npm yet; deploy.yml publishes it`);
				return;
			}
			base = versionSetCommit(cwd, pkg.dir, pkg.version);
			if (!base) {
				log(`SKIP ${tag}: no commit on main sets this version`);
				return;
			}
			tags.push({ tag, sha: base });
		}

		const files = shippedChanges(cwd, base, pkg.dir);
		if (files.length === 0) return;

		npm ??= await registry.versions(pkg.name);
		const latest = npm?.latest;
		const from =
			latest && compareVersions(latest, pkg.version) === 1
				? latest
				: pkg.version;
		if (!parseVersion(from)) {
			log(`SKIP ${pkg.name}: ${from} is not a plain x.y.z version`);
			return;
		}
		bumps.push({
			name: pkg.name,
			dir: pkg.dir,
			from: pkg.version,
			to: nextPatch(from),
			files,
		});
	});

	const byName = (a, b) => (a.name ?? a.tag).localeCompare(b.name ?? b.tag);
	return { bumps: bumps.sort(byName), tags: tags.sort(byName) };
}

/** Rewrites only the version field, keeping the file's formatting. */
export function applyBump(cwd, bump) {
	const path = join(cwd, bump.dir, 'package.json');
	const text = readFileSync(path, 'utf-8');
	const re = new RegExp(`("version"\\s*:\\s*")${bump.from.replace(/\./g, '\\.')}(")`);
	if (!re.test(text)) {
		throw new Error(`${path}: version ${bump.from} not found`);
	}
	writeFileSync(path, text.replace(re, `$1${bump.to}$2`));
}

/** The npm registry, read with the abbreviated packument (one request per package). */
export function npmRegistry(base = 'https://registry.npmjs.org') {
	return {
		async versions(name) {
			const url = `${base}/${name.replace('/', '%2F')}`;
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
				// retry briefly and then fail the run instead of guessing.
				if (attempt >= 3) {
					throw new Error(`npm registry ${res.status} for ${name}`);
				}
				await new Promise((r) => setTimeout(r, 1000 * attempt));
			}
		},
	};
}

if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
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
	for (const t of plan.tags) console.log(`TAG ${t.tag} -> ${t.sha.slice(0, 9)}`);
	for (const b of plan.bumps) {
		console.log(`BUMP ${b.name} ${b.from} -> ${b.to} (${b.files.join(', ')})`);
		if (!dryRun) applyBump(cwd, b);
	}
	console.log(
		`\n${plan.bumps.length} package(s) to release, ${plan.tags.length} release tag(s) to record.`,
	);
	if (out) writeFileSync(out, `${JSON.stringify(plan, null, 2)}\n`);
}
