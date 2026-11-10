// Catalog bot: keeps explorer/ in step with packages/ through one open PR.
//
//   node scripts/catalog-bot.mjs build   --out plan.json
//   node scripts/catalog-bot.mjs icons   --plan plan.json
//   node scripts/catalog-bot.mjs publish --plan plan.json
//
// `build` rebuilds the catalog and works out what changed. It imports every
// plugin, so it runs before the workflow has any token or key.
// `icons` gets an icon for each plugin that has none: the one already on the bot
// branch if there is one (a person may have replaced it, and context.dev charges
// per lookup), else the site's favicon, upgraded to a context.dev SVG when
// CONTEXT_DEV_API_KEY is set and the Brand API has one.
// `publish` commits to the bot branch and opens or updates the PR. A person
// looks at the new icons and merges it. Nothing here merges anything.
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export const BOT_BRANCH = 'bot/catalog';
// Holds the new commit while the bot branch is replaced (see pushBranch). It
// only outlives a run that stopped halfway, and the next run reads it.
export const BACKUP_BRANCH = 'bot/catalog-next';
export const MARKER = '<!-- corsair-catalog-bot -->';

const CATALOG = 'explorer/data/catalog.json';
const MANIFEST = 'explorer/data/icon-manifest.json';
const SOURCES = 'scripts/plugin-icon-sources/SOURCES.json';
const COMMITTED_PATHS = [
	'explorer/data',
	'explorer/icons',
	'scripts/plugin-icon-sources',
];
const ID_RE = /^[a-z0-9][a-z0-9_-]*$/;
const DOMAIN_RE = /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}$/i;
// A PR body can hold 65,536 characters; a generator change can touch every plugin.
const MAX_LISTED = 60;
// The catalog fields every build or release moves. Anchored so that a plugin
// field called generatedAt (`"key": "generatedAt"`) still counts as a change.
const VOLATILE_LINES = '-I^[[:space:]]*"(generatedAt|corsairVersion)": "';

function git(cwd, args, options = {}) {
	return execFileSync('git', args, {
		cwd,
		encoding: 'utf-8',
		maxBuffer: 64 * 1024 * 1024,
		stdio: ['ignore', 'pipe', 'pipe'],
		...options,
	}).trim();
}

function tryGit(cwd, args) {
	try {
		return git(cwd, args);
	} catch {
		return null;
	}
}

/** Runs a tool with its output in the log. Returns true when it exited 0. */
function runTool(cwd, command, args, env = process.env) {
	const result = spawnSync(command, args, { cwd, stdio: 'inherit', env });
	return result.status === 0;
}

const readJson = (path) => JSON.parse(readFileSync(path, 'utf-8'));
const writeJson = (path, value) =>
	writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);

/** The catalog without the two fields that move on every build or release. */
function comparable(catalog) {
	const { generatedAt, corsairVersion, ...rest } = catalog;
	return JSON.stringify(rest);
}

/**
 * What a rebuild changed. `changedFileIds` are the plugins whose
 * explorer/data/plugins/<id>.json differs, which a summary comparison misses (a
 * reworded operation changes no count).
 */
export function summarize({ before, after, changedFileIds = [] }) {
	const beforeById = new Map(before.plugins.map((p) => [p.id, p]));
	const afterById = new Map(after.plugins.map((p) => [p.id, p]));
	const entry = (p) => ({
		id: p.id,
		displayName: p.displayName,
		counts: p.counts ?? {},
	});
	const added = after.plugins.filter((p) => !beforeById.has(p.id)).map(entry);
	const removed = before.plugins.filter((p) => !afterById.has(p.id)).map(entry);
	const summaryChanged = after.plugins
		.filter(
			(p) =>
				beforeById.has(p.id) &&
				JSON.stringify(beforeById.get(p.id)) !== JSON.stringify(p),
		)
		.map((p) => p.id);
	const modified = [...new Set([...changedFileIds, ...summaryChanged])]
		.filter((id) => beforeById.has(id) && afterById.has(id))
		.sort()
		.map((id) => ({
			...entry(afterById.get(id)),
			before: beforeById.get(id).counts ?? {},
		}));
	return {
		added,
		removed,
		modified,
		changed:
			changedFileIds.length > 0 || comparable(before) !== comparable(after),
	};
}

/** Plugins in the catalog with no explorer/icons/<id>.png. */
export function missingIconIds(catalog, cwd) {
	return catalog.plugins
		.map((p) => p.id)
		.filter((id) => ID_RE.test(id))
		.filter((id) => !existsSync(join(cwd, `explorer/icons/${id}.png`)));
}

function changedPluginFileIds(cwd) {
	return git(cwd, ['status', '--porcelain', '--', 'explorer/data/plugins'])
		.split('\n')
		.filter(Boolean)
		.map((line) => /([^/]+)\.json"?$/.exec(line)?.[1])
		.filter(Boolean);
}

export function build({ cwd, runBuild = defaultBuild }) {
	const before = JSON.parse(git(cwd, ['show', `HEAD:${CATALOG}`]));
	runBuild(cwd);
	const after = readJson(join(cwd, CATALOG));
	const summary = summarize({
		before,
		after,
		changedFileIds: changedPluginFileIds(cwd),
	});
	if (!summary.changed) {
		// Only generatedAt or corsairVersion moved: not worth a PR.
		git(cwd, ['checkout', '--', 'explorer/data']);
	}
	return { ...summary, missingIcons: missingIconIds(after, cwd), icons: [] };
}

function defaultBuild(cwd) {
	if (!runTool(cwd, 'pnpm', ['-s', 'build:explorer-catalog'])) {
		throw new Error('build:explorer-catalog failed');
	}
	if (
		!runTool(cwd, './node_modules/.bin/biome', [
			'format',
			'--write',
			'explorer/data',
		])
	) {
		throw new Error('biome format failed');
	}
}

function defaultFetchIcons(cwd, ids) {
	// Exits 1 when an icon couldn't be found. That is reported in the PR.
	runTool(cwd, 'pnpm', [
		'-s',
		'fetch:plugin-icons',
		'--',
		`--only=${ids.join(',')}`,
	]);
}

function defaultImportIcon(cwd, id, domain) {
	return runTool(cwd, 'pnpm', [
		'-s',
		'import:plugin-icon',
		'--',
		id,
		`contextdev:${domain}`,
	]);
}

/** Copies an icon a run already found from the bot branch. False when it has none. */
function reuseIcon(cwd, ref, id, sources) {
	const onBranch = (path) =>
		tryGit(cwd, ['cat-file', '-e', `${ref}:${path}`]) !== null;
	if (!onBranch(`explorer/icons/${id}.png`)) return false;
	const curated = `scripts/plugin-icon-sources/${id}.svg`;
	const paths = [
		`explorer/icons/${id}.png`,
		`explorer/icons/${id}.dark.png`,
		`explorer/icons/${id}.svg`,
		curated,
	].filter(onBranch);
	git(cwd, ['checkout', ref, '--', ...paths]);
	if (paths.includes(curated) && sources[id]) {
		const path = join(cwd, SOURCES);
		const current = readJson(path);
		current[id] = sources[id];
		writeJson(
			path,
			Object.fromEntries(
				Object.entries(current).sort(([a], [b]) => a.localeCompare(b)),
			),
		);
	}
	return true;
}

function removeIcon(cwd, id) {
	for (const path of [
		`explorer/icons/${id}.png`,
		`explorer/icons/${id}.dark.png`,
		`explorer/icons/${id}.svg`,
		`scripts/plugin-icon-sources/${id}.svg`,
	]) {
		rmSync(join(cwd, path), { force: true });
	}
	const sourcesPath = join(cwd, SOURCES);
	const { [id]: removed, ...rest } = readJson(sourcesPath);
	if (removed) writeJson(sourcesPath, rest);
}

const refExists = (cwd, ref) =>
	tryGit(cwd, ['rev-parse', '--verify', '-q', ref]) !== null;

/** Where saved icons are read from: the bot branch, else what a stopped run left. */
function savedRef(cwd) {
	const refs = [BOT_BRANCH, BACKUP_BRANCH].map((branch) => `origin/${branch}`);
	return refs.find((ref) => refExists(cwd, ref)) ?? refs[0];
}

export function icons({
	cwd,
	plan,
	ref = savedRef(cwd),
	hasKey = Boolean(process.env.CONTEXT_DEV_API_KEY),
	fetchIcons = defaultFetchIcons,
	importIcon = defaultImportIcon,
}) {
	const ids = plan.missingIcons;
	if (ids.length === 0) return { ...plan, icons: [] };

	const hasRef = refExists(cwd, ref);
	const showRef = (path) => {
		if (!hasRef) return {};
		const text = tryGit(cwd, ['show', `${ref}:${path}`]);
		return text ? JSON.parse(text) : {};
	};
	const refSources = showRef(SOURCES);
	const refManifest = showRef(MANIFEST);

	const restored = hasRef
		? ids.filter((id) => reuseIcon(cwd, ref, id, refSources))
		: [];

	// Downloads a favicon only for ids still without a PNG, renders restored
	// curated files and records every id's domain in the manifest.
	fetchIcons(cwd, ids);
	const domains = () => readJson(join(cwd, MANIFEST)).domains ?? {};

	// Give back an icon whose plugin changed domain since: the PR asks reviewers to
	// correct a wrong domain, and that icon came from the wrong site.
	const stale = restored.filter(
		(id) => refManifest.domains?.[id] !== domains()[id],
	);
	for (const id of stale) removeIcon(cwd, id);
	if (stale.length > 0) fetchIcons(cwd, stale);
	const reused = restored.filter((id) => !stale.includes(id));
	const fresh = ids.filter((id) => !reused.includes(id));

	if (hasKey) {
		const imported = fresh.filter(
			(id) =>
				DOMAIN_RE.test(domains()[id] ?? '') &&
				importIcon(cwd, id, domains()[id]),
		);
		if (imported.length > 0) fetchIcons(cwd, imported);
	}

	const manifestPath = join(cwd, MANIFEST);
	const manifest = readJson(manifestPath);
	for (const id of reused) {
		if (refManifest.sources?.[id])
			manifest.sources[id] = refManifest.sources[id];
	}
	writeJson(manifestPath, manifest);

	return {
		...plan,
		icons: ids.map((id) => ({
			id,
			domain: manifest.domains?.[id] ?? null,
			source: manifest.sources?.[id] ?? null,
			kept: reused.includes(id),
			dark: (manifest.dark ?? []).includes(id),
			found: existsSync(join(cwd, `explorer/icons/${id}.png`)),
		})),
	};
}

function escapeCell(value) {
	return String(value ?? '')
		.replace(/[\r\n]+/g, ' ')
		.replace(/[\\|<>`*_[\]@]/g, '\\$&');
}

function joinNames(names) {
	if (names.length <= 1) return names.join('');
	return `${names.slice(0, -1).join(', ')} and ${names.at(-1)}`;
}

export function renderTitle(plan) {
	const names = plan.added.map((p) => p.displayName ?? p.id);
	if (names.length > 0 && names.length <= 4) {
		return `chore(explorer): add ${joinNames(names)} to the catalog`;
	}
	if (names.length > 4) {
		return `chore(explorer): add ${names.length} plugins to the catalog`;
	}
	if (plan.modified.length > 0 && plan.modified.length <= 3) {
		return `chore(explorer): update ${joinNames(plan.modified.map((p) => p.displayName ?? p.id))} in the catalog`;
	}
	return 'chore(explorer): update the catalog';
}

function countsText(counts = {}) {
	return `${counts.api ?? 0} / ${counts.webhooks ?? 0} / ${counts.db ?? 0}`;
}

function iconRow(icon, repo, sha) {
	const file = `https://raw.githubusercontent.com/${repo}/${sha}/explorer/icons/${icon.id}.png`;
	const domain = DOMAIN_RE.test(icon.domain ?? '') ? icon.domain : null;
	const site = domain
		? `<img src="https://www.google.com/s2/favicons?domain=${domain}&sz=128" width="64" alt="">`
		: '';
	const ours = icon.found
		? `<img src="${file}" width="256" alt="${icon.id}"> | <img src="${file}" width="26" alt="">`
		: '**none found** | ';
	const source = icon.kept ? `${icon.source} (kept)` : icon.source;
	return `| ${escapeCell(icon.id)} | ${escapeCell(domain ?? icon.domain ?? '')} | ${escapeCell(source ?? '')} | ${ours} | ${site} |`;
}

export function renderBody({ plan, repo, sha, sourceSha }) {
	const lines = [
		MARKER,
		`A merge changed plugins, so the catalog needs rebuilding. Built from main at ${sourceSha}.`,
		'',
	];
	if (plan.added.length > 0) {
		lines.push(
			'### Added',
			'',
			'| Plugin | Name | Operations / triggers / db |',
			'| --- | --- | --- |',
			...plan.added.map(
				(p) =>
					`| ${escapeCell(p.id)} | ${escapeCell(p.displayName)} | ${countsText(p.counts)} |`,
			),
			'',
		);
	}
	if (plan.modified.length > 0) {
		lines.push(
			'### Changed',
			'',
			'| Plugin | Before | After |',
			'| --- | --- | --- |',
			...plan.modified
				.slice(0, MAX_LISTED)
				.map(
					(p) =>
						`| ${escapeCell(p.id)} | ${countsText(p.before)} | ${countsText(p.counts)} |`,
				),
		);
		if (plan.modified.length > MAX_LISTED) {
			lines.push('', `And ${plan.modified.length - MAX_LISTED} more.`);
		}
		lines.push('', 'Counts are operations / triggers / db entities.', '');
	}
	if (plan.removed.length > 0) {
		lines.push(
			'### Removed',
			'',
			plan.removed.map((p) => escapeCell(p.id)).join(', '),
			'',
			'Their files in `explorer/icons` stay until someone deletes them.',
			'',
		);
	}
	if (plan.icons.length > 0) {
		lines.push(
			'### New icons: look at each one before merging',
			'',
			"Check that it is the brand's current mark and not another company with the same name. A wrong domain shows up here too: set `domain` in the plugin's `plugin-docs.yaml`.",
			'',
			'| Plugin | Domain | Source | 256 px | 26 px | Site icon |',
			'| --- | --- | --- | --- | --- | --- |',
			...plan.icons.map((icon) => iconRow(icon, repo, sha)),
			'',
			`To replace one, run \`pnpm import:plugin-icon -- <id> <url-or-file>\` and \`pnpm fetch:plugin-icons\` on \`${BOT_BRANCH}\` and push. Later runs keep it unless the plugin's domain changes. See \`scripts/plugin-icon-sources/README.md\`.`,
			'',
		);
	}
	lines.push(
		'### After merging',
		'',
		'corsair.dev rebuilds because `explorer/icons` changed, and Hub gets its own catalog PR by itself.',
	);
	return `${lines.join('\n')}\n`;
}

function openPr(cwd, repo) {
	const rows = JSON.parse(
		gh(cwd, [
			'pr',
			'list',
			'-R',
			repo,
			'--head',
			BOT_BRANCH,
			'--state',
			'open',
			'--json',
			'number',
		]),
	);
	return rows[0]?.number ?? null;
}

function gh(cwd, args) {
	return execFileSync('gh', args, {
		cwd,
		encoding: 'utf-8',
		stdio: ['ignore', 'pipe', 'pipe'],
	}).trim();
}

function editPr(cwd, repo, number, { title, body }) {
	gh(cwd, [
		'pr',
		'edit',
		String(number),
		'-R',
		repo,
		'--title',
		title,
		'--body',
		body,
	]);
}

/** A closed, unmerged bot PR for this exact commit means someone said no. */
function closedWithoutMerging(cwd, repo, headSha) {
	const rows = JSON.parse(
		gh(cwd, [
			'pr',
			'list',
			'-R',
			repo,
			'--head',
			BOT_BRANCH,
			'--state',
			'closed',
			'--limit',
			'1',
			'--json',
			'number,mergedAt,headRefOid',
		]),
	);
	return rows.length > 0 && !rows[0].mergedAt && rows[0].headRefOid === headSha;
}

function dropBackup(cwd) {
	spawnSync('git', ['push', 'origin', `:refs/heads/${BACKUP_BRANCH}`], {
		cwd,
		stdio: 'ignore',
	});
}

function pushBranch(cwd, remoteSha, log) {
	const lease = `--force-with-lease=${BOT_BRANCH}:${remoteSha ?? ''}`;
	const refspec = `HEAD:refs/heads/${BOT_BRANCH}`;
	const leftover = refExists(cwd, `origin/${BACKUP_BRANCH}`);
	const push = spawnSync('git', ['push', lease, 'origin', refspec], {
		cwd,
		encoding: 'utf-8',
	});
	if (push.status === 0) {
		if (leftover) dropBackup(cwd);
		return { recreated: false };
	}
	// GitHub refuses an app token without the workflows permission when a
	// force-push's diff from the old head includes .github/workflows, which
	// happens once main's workflows change under the branch. A new branch has no
	// old head to compare with. Deleting it closes the PR, so one is opened again.
	// Any other failure stops here: a refused lease means someone just pushed.
	if (!remoteSha || !/refusing to allow .* workflow/i.test(push.stderr)) {
		throw new Error(`pushing ${BOT_BRANCH} failed:\n${push.stderr}`);
	}
	log(`Force-push to ${BOT_BRANCH} refused; replacing the branch.`);
	// The bot branch is the only copy of the icons a reviewer pushed to it, and
	// this run's commit carries them. Put that commit on a second branch before
	// deleting, so a run that fails or is cancelled before the last push leaves
	// them where the next run looks. A leftover copy goes first: updating it
	// could be refused for the same reason.
	if (leftover) dropBackup(cwd);
	git(cwd, ['push', 'origin', `HEAD:refs/heads/${BACKUP_BRANCH}`]);
	git(cwd, ['push', lease, 'origin', `:refs/heads/${BOT_BRANCH}`]);
	git(cwd, ['push', `--force-with-lease=${BOT_BRANCH}:`, 'origin', refspec]);
	dropBackup(cwd);
	return { recreated: true };
}

/**
 * Commits the plan to the bot branch and opens or updates its PR. Returns what
 * it did: 'none', 'closed', 'unchanged', 'declined', 'opened' or 'updated'.
 */
export function publish({ cwd, plan, repo, sourceSha, log = () => {} }) {
	const remoteSha = tryGit(cwd, [
		'rev-parse',
		'--verify',
		'-q',
		`origin/${BOT_BRANCH}`,
	]);
	const current = openPr(cwd, repo);

	if (!plan.changed && plan.missingIcons.length === 0) {
		// Nothing needs the icons a stopped run saved any more.
		if (refExists(cwd, `origin/${BACKUP_BRANCH}`)) dropBackup(cwd);
		if (current === null) return 'none';
		// A later merge undid the change, or someone did the rebuild by hand.
		gh(cwd, [
			'pr',
			'close',
			String(current),
			'-R',
			repo,
			'--delete-branch',
			'--comment',
			'main already matches the catalog this PR would write, so it has nothing left to do.',
		]);
		return 'closed';
	}

	git(cwd, ['add', '--', ...COMMITTED_PATHS]);
	if (spawnSync('git', ['diff', '--cached', '--quiet'], { cwd }).status === 0) {
		return 'none';
	}
	const title = renderTitle(plan);
	git(cwd, ['commit', '-q', '-m', title]);

	if (remoteSha) {
		// Every build moves generatedAt and each release moves corsairVersion, which
		// is no reason to touch an open PR or reopen a closed one.
		const same =
			spawnSync(
				'git',
				[
					'diff',
					'--exit-code',
					VOLATILE_LINES,
					remoteSha,
					'HEAD',
					'--',
					...COMMITTED_PATHS,
				],
				{ cwd, stdio: 'ignore' },
			).status === 0;
		if (same && current !== null) {
			// A run cancelled between its push and its edit leaves the PR's text
			// behind the branch, so bring it in line. Images stay on the pushed commit.
			editPr(cwd, repo, current, {
				title,
				body: renderBody({ plan, repo, sha: remoteSha, sourceSha }),
			});
			return 'unchanged';
		}
		if (same && closedWithoutMerging(cwd, repo, remoteSha)) return 'declined';
	}

	const { recreated } = pushBranch(cwd, remoteSha, log);
	const sha = git(cwd, ['rev-parse', 'HEAD']);
	const body = renderBody({ plan, repo, sha, sourceSha });
	if (current !== null && !recreated) {
		editPr(cwd, repo, current, { title, body });
		return 'updated';
	}
	gh(cwd, [
		'pr',
		'create',
		'-R',
		repo,
		'--base',
		'main',
		'--head',
		BOT_BRANCH,
		'--title',
		title,
		'--body',
		body,
	]);
	return 'opened';
}

if (
	process.argv[1] &&
	import.meta.url === pathToFileURL(process.argv[1]).href
) {
	const [command, ...args] = process.argv.slice(2);
	const flag = (name) => {
		const i = args.indexOf(name);
		return i >= 0 ? args[i + 1] : null;
	};
	const cwd = process.cwd();
	const log = (line) => console.log(`[catalog-bot] ${line}`);

	if (command === 'build') {
		const plan = build({ cwd });
		writeJson(flag('--out'), plan);
		log(
			`added ${plan.added.length}, changed ${plan.modified.length}, removed ${plan.removed.length}, icons missing ${plan.missingIcons.length}`,
		);
	} else if (command === 'icons') {
		const planPath = flag('--plan');
		const plan = icons({ cwd, plan: readJson(planPath) });
		writeJson(planPath, plan);
		for (const icon of plan.icons) {
			log(`${icon.id}: ${icon.found ? icon.source : 'no icon found'}`);
		}
	} else if (command === 'publish') {
		const outcome = publish({
			cwd,
			plan: readJson(flag('--plan')),
			repo: process.env.GITHUB_REPOSITORY,
			sourceSha: git(cwd, ['rev-parse', 'HEAD']),
			log,
		});
		log(outcome);
		if (process.env.GITHUB_STEP_SUMMARY) {
			writeFileSync(
				process.env.GITHUB_STEP_SUMMARY,
				`### Catalog bot\n\n${outcome}\n`,
				{ flag: 'a' },
			);
		}
	} else {
		console.error('usage: catalog-bot.mjs build|icons|publish');
		process.exit(2);
	}
}
