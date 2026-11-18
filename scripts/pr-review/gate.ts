export const IGNORED_PACKAGES = [
	'corsair',
	'cli',
	'mcp',
	'studio',
	'ui',
	'app',
];
export const ALLOWED_EXTRA = [
	'packages/corsair/core/constants.ts',
	'pnpm-lock.yaml',
];
export const ASSERTION_WARN_FLOOR = 5;

/**
 * Label for team PRs that change several existing plugins at once (risk
 * levels, version bumps, a shared fix). Contributors without write access
 * cannot label their own PRs, and the author must also be on the team.
 */
export const MULTI_PLUGIN_LABEL = 'multi-plugin';
export const TEAM_ASSOCIATIONS = ['OWNER', 'MEMBER', 'COLLABORATOR'];

/** Mintlify sidebar; `generate:docs` rewrites this with the plugin pages. */
export const DOCS_NAV_FILE = 'docs/docs.json';

/** Generated plugin docs for the same plugin (plugin-docs.yaml PRs). */
export function isSamePluginDocs(file: string, plugin: string): boolean {
	const prefix = `docs/plugins/${plugin}/`;
	return file.startsWith(prefix);
}

function pluginDocsYamlOf(file: string): string | null {
	const name = file.match(/^packages\/([^/]+)\/plugin-docs\.yaml$/)?.[1];
	if (!name) return null;
	if (IGNORED_PACKAGES.includes(name) || name.startsWith('frpc-')) return null;
	return name;
}

function pluginDocsDirOf(file: string): string | null {
	const name = file.match(/^docs\/plugins\/([^/]+)\//)?.[1];
	if (!name) return null;
	if (IGNORED_PACKAGES.includes(name) || name.startsWith('frpc-')) return null;
	return name;
}

/** yaml +/or generated docs for one plugin, nothing else. Not a plugin-code PR. */
export function isPluginDocsManifestPr(changedFiles: string[]): boolean {
	if (changedFiles.length === 0) return false;
	let plugin: string | null = null;
	for (const file of changedFiles) {
		if (file === DOCS_NAV_FILE) continue;
		const id = pluginDocsYamlOf(file) ?? pluginDocsDirOf(file);
		if (!id) return false;
		if (plugin === null) plugin = id;
		else if (plugin !== id) return false;
	}
	return plugin !== null;
}

export interface GateInput {
	changedFiles: string[];
	prBody: string;
	isDraft: boolean;
	/** Number of *.test.ts files that exist in the plugin package. */
	testFileCount: number;
	/** Total expect(/assert( calls across the plugin's *.test.ts files. */
	assertionCount: number;
	/** The PR's current labels (read live, so a re-run sees a newly added label). */
	labels?: string[];
	/** GitHub's author_association for the PR author (OWNER, MEMBER, …). */
	authorAssociation?: string;
	/** *.test.ts files per touched plugin, for team multi-plugin PRs. */
	testFileCounts?: Record<string, number>;
	/** Paths new to the base branch (added, renamed or copied), to spot new plugins. */
	addedFiles?: string[];
}

export interface GateCheck {
	rule: string;
	label: string;
	status: 'pass' | 'warn' | 'fail';
	detail?: string;
}

export interface GateFailure {
	rule: string;
	message: string;
}

export interface GateResult {
	isPluginPr: boolean;
	plugin: string | null;
	/** Set for a team multi-plugin PR: every plugin it touches. */
	batchPlugins?: string[];
	checks: GateCheck[];
	failures: GateFailure[];
}

export function pluginOf(file: string): string | null {
	const name = file.match(/^packages\/([^/]+)\//)?.[1];
	if (!name) return null;
	// frpc-<platform>-<arch> are prebuilt binary shims for the dev tunnel,
	// not integrations — the plugin rules (tests, demo video) don't apply.
	if (IGNORED_PACKAGES.includes(name) || name.startsWith('frpc-')) return null;
	return name;
}

/** Every plugin package a PR touches, sorted. */
export function touchedPlugins(changedFiles: string[]): string[] {
	return [
		...new Set(
			changedFiles.map(pluginOf).filter((p): p is string => p !== null),
		),
	].sort();
}

/** Counts *.test.ts paths (e.g. from a git tree) per plugin. */
export function countTestFilesByPlugin(
	testPaths: string[],
	plugins: string[],
): Record<string, number> {
	const counts: Record<string, number> = {};
	for (const p of plugins) {
		counts[p] = testPaths.filter(
			(f) =>
				f.startsWith(`packages/${p}/`) &&
				f.endsWith('.test.ts') &&
				!f.includes('/node_modules/'),
		).length;
	}
	return counts;
}

/** The plugin a PR targets, or null if it touches no plugin packages. */
export function detectPlugin(changedFiles: string[]): string | null {
	return changedFiles.map(pluginOf).find((p) => p !== null) ?? null;
}

function section(body: string, heading: string): string {
	const escaped = heading.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
	const re = new RegExp(`##\\s*${escaped}[^\\n]*\\n([\\s\\S]*?)(?=\\n##\\s|$)`);
	return body.match(re)?.[1] ?? '';
}

function stripComments(s: string): string {
	// Strip repeatedly until stable so nested/overlapping markers
	// cannot reassemble into a live comment (CodeQL: incomplete
	// multi-character sanitization).
	let out = s;
	let prev: string;
	do {
		prev = out;
		out = out.replace(/<!--[\s\S]*?-->/g, '');
	} while (out !== prev);
	return out;
}

/** jq for `gh api repos/{repo}/pulls/{n}/files`: one "status<TAB>path" per file. */
export const PR_FILES_JQ = '.[] | "\\(.status)\\t\\(.filename)"';

/**
 * Statuses that put a file at a path the base branch doesn't have. A moved
 * package.json shows up as "renamed" and must count as a new plugin too.
 */
const NEW_PATH_STATUSES = ['added', 'renamed', 'copied'];

/** Splits PR_FILES_JQ output into every changed path and the new ones. */
export function parsePrFileRows(raw: string): {
	changedFiles: string[];
	addedFiles: string[];
} {
	const rows = raw
		.trim()
		.split('\n')
		.filter(Boolean)
		.map((row) => {
			const tab = row.indexOf('\t');
			return { status: row.slice(0, tab), filename: row.slice(tab + 1) };
		});
	return {
		changedFiles: rows.map((r) => r.filename),
		addedFiles: rows
			.filter((r) => NEW_PATH_STATUSES.includes(r.status))
			.map((r) => r.filename),
	};
}

/**
 * A team PR that is allowed to change several existing plugins at once.
 * Needs the label, a team author and the added-file list (without it a new
 * plugin can't be told apart, so the normal gate applies). Same for the
 * per-plugin test counts.
 */
export function isTeamMultiPluginPr(
	input: GateInput,
	plugins: Set<string>,
): boolean {
	return (
		plugins.size > 1 &&
		input.addedFiles !== undefined &&
		input.testFileCounts !== undefined &&
		(input.labels ?? []).includes(MULTI_PLUGIN_LABEL) &&
		TEAM_ASSOCIATIONS.includes(input.authorAssociation ?? '')
	);
}

/**
 * Scope rules for a team multi-plugin PR. Files must still stay inside the
 * plugins it touches (plus the registry, lockfile and those plugins' docs),
 * and a brand-new plugin still needs its own PR. Every touched plugin must
 * have tests (R2, as for a one-plugin PR). The PR template and demo video
 * (R3–R4) are per-plugin contribution rules, so they don't apply.
 */
function runTeamMultiPluginGate(
	input: GateInput,
	plugins: Set<string>,
): GateResult {
	const list = [...plugins].sort();
	const checks: GateCheck[] = [];
	const outOfScope = input.changedFiles.filter(
		(f) =>
			pluginOf(f) === null &&
			!ALLOWED_EXTRA.includes(f) &&
			f !== DOCS_NAV_FILE &&
			!list.some((p) => isSamePluginDocs(f, p)),
	);
	const added = new Set(input.addedFiles ?? []);
	const newPlugins = list.filter((p) =>
		added.has(`packages/${p}/package.json`),
	);
	if (newPlugins.length > 0) {
		checks.push({
			rule: 'R1',
			label: 'Scope: existing plugins only',
			status: 'fail',
			detail: `New plugins need their own PR: ${newPlugins.join(', ')}`,
		});
	} else if (outOfScope.length > 0) {
		checks.push({
			rule: 'R1',
			label: 'Scope: plugin files only',
			status: 'fail',
			detail: `Out of scope: ${outOfScope.join(', ')}`,
		});
	} else {
		checks.push({
			rule: 'R1',
			label: `Scope: team multi-plugin PR (${MULTI_PLUGIN_LABEL})`,
			status: 'pass',
			detail: list.join(', '),
		});
	}
	// R2 — same bar as a one-plugin PR: every touched plugin has tests.
	const untested = list.filter((p) => (input.testFileCounts?.[p] ?? 0) === 0);
	checks.push(
		untested.length > 0
			? {
					rule: 'R2',
					label: 'Tests present',
					status: 'fail',
					detail: `No *.test.ts in: ${untested.map((p) => `packages/${p}/`).join(', ')}`,
				}
			: {
					rule: 'R2',
					label: 'Tests present in every touched plugin',
					status: 'pass',
				},
	);
	checks.push({
		rule: 'R3–R4',
		label: 'Template, demo',
		status: 'pass',
		detail: `Not required with the ${MULTI_PLUGIN_LABEL} label; CI builds and tests each touched package`,
	});
	const failures = checks
		.filter((c) => c.status === 'fail')
		.map((c) => ({ rule: c.rule, message: c.detail ?? c.label }));
	return {
		isPluginPr: true,
		plugin: list[0] ?? null,
		batchPlugins: list,
		checks,
		failures,
	};
}

export function runGate(input: GateInput): GateResult {
	const plugins = new Set(
		input.changedFiles.map(pluginOf).filter((p): p is string => p !== null),
	);
	if (
		isPluginDocsManifestPr(input.changedFiles) ||
		plugins.size === 0 ||
		input.isDraft
	) {
		return { isPluginPr: false, plugin: null, checks: [], failures: [] };
	}

	if (isTeamMultiPluginPr(input, plugins)) {
		return runTeamMultiPluginGate(input, plugins);
	}

	const checks: GateCheck[] = [];
	const plugin = [...plugins][0];

	// R1 — scope confinement
	const outOfScope = input.changedFiles.filter(
		(f) =>
			pluginOf(f) === null &&
			!ALLOWED_EXTRA.includes(f) &&
			f !== DOCS_NAV_FILE &&
			!(plugin && isSamePluginDocs(f, plugin)),
	);
	if (plugins.size > 1) {
		checks.push({
			rule: 'R1',
			label: 'Scope: one plugin per PR',
			status: 'fail',
			detail: `This PR touches: ${[...plugins].join(', ')}`,
		});
	} else if (outOfScope.length > 0) {
		checks.push({
			rule: 'R1',
			label: 'Scope: plugin files only',
			status: 'fail',
			detail: `Out of scope: ${outOfScope.join(', ')}`,
		});
	} else {
		checks.push({
			rule: 'R1',
			label: 'Scope: plugin files only',
			status: 'pass',
		});
	}

	// R2 — tests with real assertions (existence checked on the plugin
	// package itself, not the diff — update PRs need not touch tests)
	if (input.testFileCount === 0) {
		checks.push({
			rule: 'R2',
			label: 'Tests present',
			status: 'fail',
			detail: `No *.test.ts under packages/${plugin}/ — see packages/slack for examples`,
		});
	} else if (input.assertionCount === 0) {
		checks.push({
			rule: 'R2',
			label: 'Tests have assertions',
			status: 'fail',
			detail: 'Test files contain no expect()/assert() calls',
		});
	} else if (input.assertionCount < ASSERTION_WARN_FLOOR) {
		checks.push({
			rule: 'R2',
			label: 'Test depth',
			status: 'warn',
			detail: `Only ${input.assertionCount} assertions — cover each endpoint`,
		});
	} else {
		checks.push({ rule: 'R2', label: 'Tests with assertions', status: 'pass' });
	}

	// R3 — description quality
	const uncheckedBoxes = /-\s\[\s\]/.test(input.prBody);
	const description = stripComments(section(input.prBody, 'Description'));
	if (uncheckedBoxes) {
		checks.push({
			rule: 'R3',
			label: 'PR template checklist',
			status: 'fail',
			detail: 'Checklist has unchecked boxes',
		});
	} else if (description.trim().length < 20) {
		checks.push({
			rule: 'R3',
			label: 'Description',
			status: 'fail',
			detail: 'Description section is empty or placeholder',
		});
	} else {
		checks.push({ rule: 'R3', label: 'Description complete', status: 'pass' });
	}
	const hasIssueLink =
		/(fixes|closes|resolves)\s+#\d+/i.test(input.prBody) ||
		/corsair\.dev\/oss\//.test(input.prBody);
	checks.push({
		rule: 'R3',
		label: 'Linked issue / claim',
		status: hasIssueLink ? 'pass' : 'warn',
		detail: hasIssueLink
			? undefined
			: 'No "Fixes #…" or claim link — add one if this PR has a claim or issue',
	});

	// R4 — demo video
	const demos = stripComments(section(input.prBody, 'Screenshots / Demos'));
	checks.push({
		rule: 'R4',
		label: 'Demo video / recording',
		status: /https?:\/\/\S+/.test(demos) ? 'pass' : 'fail',
		detail: /https?:\/\/\S+/.test(demos)
			? undefined
			: 'Required in "Screenshots / Demos" before a maintainer reviews',
	});

	const failures = checks
		.filter((c) => c.status === 'fail')
		.map((c) => ({ rule: c.rule, message: c.detail ?? c.label }));

	return { isPluginPr: true, plugin: plugin ?? null, checks, failures };
}

const STATUS_ICON = { pass: '✅', warn: '⚠️', fail: '❌' } as const;

/** Renders the sticky scorecard comment body (marker included). */
export function renderScorecard(result: GateResult): string {
	const lines = [
		'<!-- corsair-pr-gate -->',
		result.batchPlugins
			? `### Plugin PR scorecard — team multi-plugin PR (${result.batchPlugins.length} plugins)`
			: `### Plugin PR scorecard — \`packages/${result.plugin}\``,
		'',
		'| Check | Status | Notes |',
		'| --- | --- | --- |',
	];
	for (const c of result.checks) {
		lines.push(
			`| ${c.rule} — ${c.label} | ${STATUS_ICON[c.status]} | ${c.detail ?? ''} |`,
		);
	}
	lines.push(
		'',
		`Rules: [PLUGIN_PR_RULES.md](https://github.com/${process.env.GITHUB_REPOSITORY ?? 'corsairdev/corsair'}/blob/main/.github/PLUGIN_PR_RULES.md) · re-runs on every push`,
	);
	return lines.join('\n');
}
