// Changelog: turns each release into lines on docs/changelog.mdx.
//
//   node scripts/release-changelog.mjs --plan plan.json [--cloud-version x.y.z]
//   node scripts/release-changelog.mjs --plan plan.json --backfill 2026-10-05
//
// release-on-merge.yml runs it after planning, so the page lands in the release
// commit. The words are merged PR titles: squash merges make each one a commit on
// main. scripts/changelog-entries.json records what has shipped and the page is
// rendered whole from it, so a correction goes in the JSON, not the page.
//
// --backfill records what is already on npm, from a date up to each package's
// current release. Anything merged after that is still unreleased, so it stays
// out until a release picks it up.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import {
	isShippedPath,
	listPackages,
	packageJsonChanged,
	releaseTag,
	versionSetCommit,
} from './release-on-merge.mjs';

export const ENTRIES_PATH = 'scripts/changelog-entries.json';
export const PAGE_PATH = 'docs/changelog.mdx';
const PR_URL = 'https://github.com/corsairdev/corsair/pull';

// Conventional commit types that say nothing to someone using the packages.
const HIDDEN_TYPES = new Set([
	'build',
	'chore',
	'ci',
	'docs',
	'refactor',
	'style',
	'test',
	'tests',
]);

const SDK_PACKAGES = new Set([
	'corsair',
	'@corsair-dev/app',
	'@corsair-dev/cli',
	'@corsair-dev/mcp',
	'@corsair-dev/studio',
	'@corsair-dev/ui',
]);

/**
 * core/constants.ts with its three provider lists emptied. A list the patterns
 * don't find stays as it is, so a reshaped file reads as changed.
 */
export function withoutProviderLists(source) {
	return source
		.replace(
			/^(export const BaseProviders = \[)\n[\s\S]*?^(\] as const;)/m,
			'$1$2',
		)
		.replace(
			/^(export const ProviderDisplayNames = \{)\n[\s\S]*?^(\} as const)/m,
			'$1$2',
		)
		.replace(/^(export type AllProviders =)\n[\s\S]*?;/m, '$1;');
}

// Every new plugin adds a line to each provider list in core/constants.ts. That
// is the plugin's news, not the SDK's: 27 of the 29 commits behind corsair
// 0.1.158 are only this. A change to anything else in the file (AuthTypes,
// AllErrors) is the SDK's, so each entry maps a file to what to compare.
const REGISTRATION_ONLY = new Map([
	['packages/corsair', new Map([['core/constants.ts', withoutProviderLists]])],
]);

const MERGE_PR = /^Merge pull request #(\d+) from /;
const TRAILING_PR = /\s*\(#(\d+)\)\s*$/;
const CONVENTIONAL = /^([a-zA-Z]+)(?:\([^)]*\))?(!)?:\s*(.+)$/;
const PLAIN_VERSION = /^\d+\.\d+\.\d+$/;

function git(cwd, args) {
	return execFileSync('git', args, {
		cwd,
		encoding: 'utf-8',
		maxBuffer: 256 * 1024 * 1024,
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

function capitalise(text) {
	return /^[a-z]/.test(text) ? text[0].toUpperCase() + text.slice(1) : text;
}

/**
 * The public wording of a commit on main, or null when it has none. Only merged
 * PRs count: a direct push has had no review of its message.
 */
export function parseCommit(subject, body = '') {
	let text = subject.trim();
	let pr = null;
	const merge = MERGE_PR.exec(text);
	if (merge) {
		pr = Number(merge[1]);
		// A merge commit keeps the PR's title as the first line of its body.
		text =
			body
				.split('\n')
				.map((line) => line.trim())
				.find(Boolean) ?? '';
	}
	const trailing = TRAILING_PR.exec(text);
	if (trailing) {
		pr ??= Number(trailing[1]);
		text = text.slice(0, trailing.index);
	}
	if (pr === null || !text) return null;

	const conventional = CONVENTIONAL.exec(text);
	const type = conventional ? conventional[1].toLowerCase() : 'other';
	if (HIDDEN_TYPES.has(type)) return null;
	return {
		type,
		breaking: Boolean(conventional?.[2]),
		pr,
		title: capitalise((conventional ? conventional[3] : text).trim()),
	};
}

/** True when a commit changed what the package at `dir` ships. */
function changedShippedFiles(cwd, sha, dir) {
	const listed = tryGit(cwd, [
		'diff',
		'--no-renames',
		'--name-only',
		'-z',
		`${sha}^1`,
		sha,
		'--',
		dir,
	]);
	if (listed === null) return false;
	return listed
		.split('\0')
		.filter(Boolean)
		.map((path) => path.slice(dir.length + 1))
		.some((path) => {
			if (!isShippedPath(path, dir)) return false;
			const strip = REGISTRATION_ONLY.get(dir)?.get(path);
			if (!strip && path !== 'package.json') return true;
			const before = tryGit(cwd, ['show', `${sha}^1:${dir}/${path}`]);
			const after = tryGit(cwd, ['show', `${sha}:${dir}/${path}`]);
			if (!before || !after) return true;
			return strip
				? strip(before) !== strip(after)
				: packageJsonChanged(before, after);
		});
}

/** Public changes on the first-parent line, newest first. `revs` picks the range. */
function publicChanges(cwd, dir, revs) {
	const log = git(cwd, [
		'log',
		'--first-parent',
		'--format=%H%x1f%cs%x1f%s%x1f%b%x1e',
		...revs,
		'--',
		dir,
	]);
	const changes = [];
	for (const record of log.split('\x1e')) {
		const [sha, date, subject, body] = record.trim().split('\x1f');
		if (!sha || !subject) continue;
		const change = parseCommit(subject, body);
		if (change && changedShippedFiles(cwd, sha, dir)) {
			changes.push({ ...change, sha, date });
		}
	}
	return changes;
}

function displayName(cwd, dir) {
	const path = join(cwd, dir, 'plugin-docs.yaml');
	if (existsSync(path)) {
		const match = /^displayName:\s*(.+?)\s*$/m.exec(
			readFileSync(path, 'utf-8'),
		);
		if (match) return match[1].replace(/^(['"])(.*)\1$/, '$2');
	}
	return basename(dir);
}

const isBinaryShim = (dir) => basename(dir).startsWith('frpc-');
const isSdk = (entry) =>
	SDK_PACKAGES.has(entry.package) || entry.dir?.startsWith('adapters/');

/** Where a package's current release sits, from a tag or the plan's new tags. */
function releaseCommit(cwd, plan, name, version) {
	const tag = releaseTag(name, version);
	const planned = plan.tags.find((t) => t.tag === tag);
	return planned?.sha ?? tryGit(cwd, ['rev-list', '-n', '1', tag]);
}

function newestTaggedVersion(cwd, name) {
	const tags = git(cwd, [
		'tag',
		'--list',
		`${name}@*`,
		'--sort=-v:refname',
	]).split('\n');
	return tags[0] ? tags[0].slice(name.length + 1) : null;
}

/** The commit that last wrote the entries. The page covers everything up to it. */
function lastChangelogCommit(cwd) {
	return tryGit(cwd, ['log', '-1', '--format=%H', '--', ENTRIES_PATH]) || null;
}

const isAncestor = (cwd, older, newer) =>
	tryGit(cwd, ['merge-base', '--is-ancestor', older, newer]) !== null;

/** True when the package at `dir` first appeared on main after `from`, by `to`. */
function addedBetween(cwd, from, to, dir) {
	return Boolean(
		tryGit(cwd, [
			'log',
			'--first-parent',
			'--diff-filter=A',
			'--format=%H',
			`${from}..${to}`,
			'--',
			`${dir}/package.json`,
		]),
	);
}

/**
 * What this run's plan adds. A bump lists the commits since the release it
 * replaces. A version waiting for npm is a new package or one raised by hand,
 * and so is one that was published before any run saw it waiting.
 */
export function entriesFromPlan({ cwd, plan, date, existing = [] }) {
	const seen = new Set(existing.map((e) => `${e.package}@${e.version}`));
	const dirs = new Map(listPackages(cwd).map((p) => [p.name, p.dir]));
	const entries = [];
	const add = (name, dir, version, changes, isNew = false) => {
		if (seen.has(`${name}@${version}`) || isBinaryShim(dir)) return;
		const entry = {
			date,
			package: name,
			dir,
			name: displayName(cwd, dir),
			version,
			isNew,
			changes: changes.map(({ type, breaking, pr, title }) => ({
				type,
				breaking,
				pr,
				title,
			})),
		};
		// A plugin bump with nothing to say (npm metadata, a dependency) stays off the
		// page. The SDK's versions are always listed, because people pin them.
		if (changes.length > 0 || isNew || isSdk(entry)) entries.push(entry);
	};

	for (const bump of plan.bumps) {
		const base = releaseCommit(cwd, plan, bump.name, bump.from);
		add(
			bump.name,
			bump.dir,
			bump.to,
			base ? publicChanges(cwd, bump.dir, [`${base}..HEAD`]) : [],
		);
	}
	// A version this workflow didn't choose: the first release of a new package,
	// or one raised by hand, with what changed since the release before it.
	const addOwnVersion = (name, dir, version, upTo) => {
		const previous = newestTaggedVersion(cwd, name);
		if (!previous) {
			add(name, dir, version, [], !isSdk({ package: name, dir }));
			return;
		}
		const base = tryGit(cwd, [
			'rev-list',
			'-n',
			'1',
			releaseTag(name, previous),
		]);
		add(
			name,
			dir,
			version,
			base ? publicChanges(cwd, dir, [`${base}..${upTo}`]) : [],
		);
	};
	// Up to the commit that set the version, not HEAD: a fix merged while it
	// publishes belongs to the release after it.
	for (const { name, version } of plan.waiting) {
		const dir = dirs.get(name);
		if (!dir) continue;
		addOwnVersion(
			name,
			dir,
			version,
			versionSetCommit(cwd, dir, version) ?? 'HEAD',
		);
	}

	// deploy.yml can publish such a version before any run sees it waiting. It
	// then only ever arrives as a tag to record, so read those too. A tag at or
	// before the commit that last wrote the entries is history the page already
	// has, which keeps the first run, when every package gets its tag, off the
	// page. Versions this workflow bumped are in `seen` from the run that did.
	const covered = lastChangelogCommit(cwd);
	for (const { tag, sha } of covered ? plan.tags : []) {
		const at = tag.lastIndexOf('@');
		const name = tag.slice(0, at);
		const dir = dirs.get(name);
		if (!dir || isAncestor(cwd, sha, covered)) continue;
		// Without an earlier tag there is nothing to compare with, so call a
		// package new only when it was added since.
		const known =
			newestTaggedVersion(cwd, name) || addedBetween(cwd, covered, sha, dir);
		if (known) addOwnVersion(name, dir, tag.slice(at + 1), sha);
	}
	return entries;
}

/**
 * What is already on npm, from `since` up to each package's current release.
 * Leaves out what `existing` holds, so running it again adds only what is new:
 * a plugin already announced, or a pull request already listed for a package.
 */
export function backfillEntries({ cwd, plan, since, existing = [] }) {
	const announced = new Set(
		existing.filter((e) => e.isNew).map((e) => e.package),
	);
	const listed = new Set(
		existing.flatMap((e) => e.changes.map((c) => `${e.package}#${c.pr}`)),
	);
	const entries = [];
	const waiting = new Set(plan.waiting.map((w) => w.name));
	for (const pkg of listPackages(cwd)) {
		if (waiting.has(pkg.name) || isBinaryShim(pkg.dir)) continue;
		const base = releaseCommit(cwd, plan, pkg.name, pkg.version);
		if (!base) continue;

		const name = displayName(cwd, pkg.dir);
		const shared = { package: pkg.name, dir: pkg.dir, name, version: null };
		const added = git(cwd, [
			'log',
			'--first-parent',
			'--diff-filter=A',
			'--format=%H%x1f%cs',
			`--since=${since}`,
			base,
			'--',
			`${pkg.dir}/package.json`,
		]);
		const [addedSha, addedDate] = added ? added.split('\x1f') : [];
		if (addedSha && !isSdk(shared) && !announced.has(pkg.name)) {
			entries.push({ ...shared, date: addedDate, isNew: true, changes: [] });
		}
		for (const { sha, date, ...change } of publicChanges(cwd, pkg.dir, [
			`--since=${since}`,
			base,
		])) {
			if (sha !== addedSha && !listed.has(`${pkg.name}#${change.pr}`)) {
				entries.push({ ...shared, date, isNew: false, changes: [change] });
			}
		}
	}
	return entries.sort(
		(a, b) =>
			a.date.localeCompare(b.date) || a.package.localeCompare(b.package),
	);
}

function backtickRun(text, at) {
	let n = 0;
	while (text[at + n] === '`') n++;
	return n;
}

/** Start of the next run of exactly `n` backticks at or after `from`, or -1. */
function closingRun(text, from, n) {
	let i = from;
	while (i < text.length) {
		if (text[i] !== '`') {
			i++;
			continue;
		}
		const run = backtickRun(text, i);
		if (run === n) return i;
		i += run;
	}
	return -1;
}

// Characters MDX or Markdown would read as markup outside a code span.
const MDX_SPECIAL = new Set('\\<>{}[]*_|');

/**
 * Escapes text for MDX. A bad page can fail the docs deploy, and titles are free
 * text. Code spans stay as written, since MDX doesn't parse them: a span opens
 * with a run of backticks and closes at the next run of the same length
 * (CommonMark), and a run with no match is plain text.
 */
export function escapeMdx(text) {
	const flat = String(text).replace(/\s*[\r\n]+\s*/g, ' ');
	let out = '';
	let i = 0;
	while (i < flat.length) {
		if (flat[i] !== '`') {
			out += MDX_SPECIAL.has(flat[i]) ? `\\${flat[i]}` : flat[i];
			i++;
			continue;
		}
		const open = backtickRun(flat, i);
		const close = closingRun(flat, i + open, open);
		const end = close === -1 ? i + open : close + open;
		out += close === -1 ? '\\`'.repeat(open) : flat.slice(i, end);
		i = end;
	}
	return out;
}

function mondayOf(date) {
	const day = new Date(`${date}T00:00:00Z`);
	day.setUTCDate(day.getUTCDate() - ((day.getUTCDay() + 6) % 7));
	return day.toISOString().slice(0, 10);
}

function weekLabel(monday) {
	const formatted = new Date(`${monday}T00:00:00Z`).toLocaleDateString(
		'en-US',
		{
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			timeZone: 'UTC',
		},
	);
	return `Week of ${formatted}`;
}

function joinNames(names, limit = 3) {
	if (names.length > limit) {
		return `${names.slice(0, limit).join(', ')} and ${names.length - limit} more`;
	}
	if (names.length === 1) return names[0];
	return `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`;
}

function latestVersions(entries) {
	const versions = new Map();
	for (const entry of entries) {
		if (entry.version) versions.set(entry.package, entry.version);
	}
	return versions;
}

/** One line per PR, newest first: a fix across many packages is one line. */
function changeLines(entries, labelOf) {
	const byPr = new Map();
	for (const entry of [...entries].reverse()) {
		for (const change of entry.changes) {
			if (!byPr.has(change.pr)) byPr.set(change.pr, { change, entries: [] });
			const row = byPr.get(change.pr);
			if (!row.entries.some((e) => e.package === entry.package)) {
				row.entries.push(entry);
			}
		}
	}
	return [...byPr.values()].map(({ change, entries: touched }) => {
		const label = labelOf(touched);
		const breaking = change.breaking ? '**Breaking:** ' : '';
		const prefix = label ? `**${label}:** ` : '';
		return `- ${prefix}${breaking}${escapeMdx(change.title)} ([#${change.pr}](${PR_URL}/${change.pr}))`;
	});
}

const pluralise = (count, one) => `${count} ${one}${count === 1 ? '' : 's'}`;

function renderWeek(monday, entries, cwd) {
	const sdk = entries.filter(isSdk);
	const cloud = entries.filter((e) => e.package === 'cloud');
	const plugins = entries.filter((e) => !isSdk(e) && e.package !== 'cloud');
	const added = plugins.filter((e) => e.isNew);
	const updated = plugins.filter((e) => e.changes.length > 0);

	const versions = latestVersions(sdk);
	const core = versions.get('corsair');
	const sections = [];

	if (sdk.length > 0) {
		const others = [...versions.entries()]
			.filter(([name]) => name !== 'corsair')
			.map(([name, version]) => `\`${name}\` ${version}`);
		const lines = changeLines(sdk, (touched) =>
			touched.every((e) => e.package === 'corsair')
				? ''
				: joinNames(touched.map((e) => escapeMdx(basename(e.package)))),
		);
		sections.push(
			[
				core ? `## SDK: corsair ${core}` : '## SDK',
				...(others.length > 0 ? [`Also released: ${others.join(', ')}.`] : []),
				...(lines.length > 0 ? [lines.join('\n')] : []),
			].join('\n\n'),
		);
	}
	if (cloud.length > 0) {
		sections.push(
			`## Corsair Cloud\n\nNow runs corsair ${cloud.at(-1).version}.`,
		);
	}
	if (added.length > 0) {
		const names = added.map((e) => {
			const name = escapeMdx(e.name);
			const id = basename(e.dir);
			return existsSync(join(cwd, `docs/plugins/${id}/overview.mdx`))
				? `[${name}](/plugins/${id}/overview)`
				: name;
		});
		sections.push(
			`## ${pluralise(added.length, 'new plugin')}\n\n${names.join(', ')}`,
		);
	}
	if (updated.length > 0) {
		const count = new Set(updated.map((e) => e.package)).size;
		const lines = changeLines(updated, (touched) => {
			const newest = latestVersions(touched);
			return joinNames(
				touched.map((e) => {
					const version = touched.length === 1 ? newest.get(e.package) : null;
					return escapeMdx(version ? `${e.name} ${version}` : e.name);
				}),
			);
		});
		sections.push(
			`## ${pluralise(count, 'plugin')} updated\n\n${lines.join('\n')}`,
		);
	}

	const tags = [
		...(sdk.length > 0 ? ['"SDK"'] : []),
		...(plugins.length > 0 ? ['"Plugins"'] : []),
		...(cloud.length > 0 ? ['"Cloud"'] : []),
	];
	const description = core ? ` description="corsair ${core}"` : '';
	return `<Update label="${weekLabel(monday)}"${description} tags={[${tags.join(', ')}]}>\n\n${sections.join('\n\n')}\n\n</Update>`;
}

export function renderPage(entries, cwd = process.cwd()) {
	const weeks = new Map();
	for (const entry of entries) {
		const monday = mondayOf(entry.date);
		if (!weeks.has(monday)) weeks.set(monday, []);
		weeks.get(monday).push(entry);
	}
	const body = [...weeks.keys()]
		.sort()
		.reverse()
		.map((monday) => renderWeek(monday, weeks.get(monday), cwd))
		.join('\n\n');
	return `---
title: "Changelog"
description: "What each release of the Corsair SDK and plugins changed, week by week."
rss: true
---

Written from merged pull requests each time packages are released.

${body}
`;
}

/** Records `added` and renders the page, writing only what changed. */
export function writeChangelog({ cwd, existing, added }) {
	const entries = [...existing, ...added];
	if (added.length > 0) {
		writeFileSync(
			join(cwd, ENTRIES_PATH),
			`${JSON.stringify(entries, null, 2)}\n`,
		);
	}
	const pagePath = join(cwd, PAGE_PATH);
	const page = renderPage(entries, cwd);
	const changed =
		!existsSync(pagePath) || readFileSync(pagePath, 'utf-8') !== page;
	if (changed) writeFileSync(pagePath, page);
	return changed;
}

if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(process.argv[1]).href
) {
	const args = process.argv.slice(2);
	const flag = (name) => {
		const i = args.indexOf(name);
		return i >= 0 ? args[i + 1] : null;
	};
	const cwd = process.cwd();
	const plan = JSON.parse(readFileSync(flag('--plan'), 'utf-8'));
	const entriesPath = join(cwd, ENTRIES_PATH);
	const existing = existsSync(entriesPath)
		? JSON.parse(readFileSync(entriesPath, 'utf-8'))
		: [];
	const date = new Date().toISOString().slice(0, 10);

	const backfill = flag('--backfill');
	const added = backfill
		? backfillEntries({ cwd, plan, since: backfill, existing })
		: entriesFromPlan({ cwd, plan, date, existing });

	const cloudVersion = flag('--cloud-version');
	if (cloudVersion) {
		// Comes from a workflow input, so it is checked before it reaches the page.
		// A bad one costs its own line and nothing else: the release entries above
		// are still written.
		if (!PLAIN_VERSION.test(cloudVersion)) {
			console.error(
				`[changelog] no Cloud line added, not a plain x.y.z version: ${JSON.stringify(cloudVersion)}`,
			);
		} else if (
			!existing.some((e) => e.package === 'cloud' && e.version === cloudVersion)
		) {
			added.push({
				date,
				package: 'cloud',
				version: cloudVersion,
				changes: [],
			});
		}
	}

	const changed = writeChangelog({ cwd, existing, added });
	console.log(
		`[changelog] ${added.length} new entries, page ${changed ? 'updated' : 'unchanged'}`,
	);
}
