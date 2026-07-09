import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import type { GateResult } from './gate.ts';
import { detectPlugin, runGate } from './gate.ts';

const MARKER = '<!-- corsair-pr-gate -->';
const STATUS_ICON = { pass: '✅', warn: '⚠️', fail: '❌' } as const;

function gh(args: string[]): string {
	return execFileSync('gh', args, {
		encoding: 'utf8',
		maxBuffer: 64 * 1024 * 1024,
	});
}

/** Counts *.test.ts files and their expect()/assert() calls on disk. */
export function countTests(pluginDir: string): {
	testFileCount: number;
	assertionCount: number;
} {
	if (!fs.existsSync(pluginDir)) {
		return { testFileCount: 0, assertionCount: 0 };
	}
	let testFileCount = 0;
	let assertionCount = 0;
	for (const entry of fs.readdirSync(pluginDir, {
		recursive: true,
		withFileTypes: true,
	})) {
		if (!entry.isFile() || !entry.name.endsWith('.test.ts')) continue;
		if (entry.parentPath.includes('node_modules')) continue;
		testFileCount += 1;
		const content = fs.readFileSync(
			path.join(entry.parentPath, entry.name),
			'utf8',
		);
		assertionCount += content.match(/\b(expect|assert)\s*\(/g)?.length ?? 0;
	}
	return { testFileCount, assertionCount };
}

function renderComment(result: GateResult): string {
	const lines = [
		MARKER,
		`### Plugin PR scorecard — \`packages/${result.plugin}\``,
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
		`Rules: [PLUGIN_PR_RULES.md](https://github.com/${process.env.GITHUB_REPOSITORY}/blob/main/.github/PLUGIN_PR_RULES.md) · re-runs on every push`,
	);
	return lines.join('\n');
}

function upsertComment(repo: string, pr: string, body: string): void {
	const comments = JSON.parse(
		gh(['api', `repos/${repo}/issues/${pr}/comments`, '--paginate']),
	) as { id: number; body: string }[];
	const existing = comments.find((c) => c.body.startsWith(MARKER));
	if (existing) {
		gh([
			'api',
			'-X',
			'PATCH',
			`repos/${repo}/issues/comments/${existing.id}`,
			'-f',
			`body=${body}`,
		]);
	} else {
		gh([
			'api',
			'-X',
			'POST',
			`repos/${repo}/issues/${pr}/comments`,
			'-f',
			`body=${body}`,
		]);
	}
}

function setLabel(repo: string, pr: string, failed: boolean): void {
	if (failed) {
		gh([
			'api',
			'-X',
			'POST',
			`repos/${repo}/issues/${pr}/labels`,
			'-f',
			'labels[]=gate:failed',
		]);
	} else {
		try {
			gh([
				'api',
				'-X',
				'DELETE',
				`repos/${repo}/issues/${pr}/labels/gate:failed`,
			]);
		} catch {
			// label was not present
		}
	}
}

const event = JSON.parse(
	fs.readFileSync(process.env.GITHUB_EVENT_PATH ?? '', 'utf8'),
);
const repo = process.env.GITHUB_REPOSITORY ?? '';
const pr = String(event.pull_request.number);
const baseSha = event.pull_request.base.sha as string;

const changedFiles = execFileSync(
	'git',
	['diff', '--name-only', `${baseSha}...HEAD`],
	{ encoding: 'utf8' },
)
	.trim()
	.split('\n')
	.filter(Boolean);

const plugin = detectPlugin(changedFiles);
const tests = plugin
	? countTests(path.join('packages', plugin))
	: { testFileCount: 0, assertionCount: 0 };
const result = runGate({
	changedFiles,
	prBody: (event.pull_request.body as string) ?? '',
	isDraft: event.pull_request.draft as boolean,
	readmeExists: plugin
		? fs.existsSync(path.join('packages', plugin, 'README.md'))
		: false,
	testFileCount: tests.testFileCount,
	assertionCount: tests.assertionCount,
});

if (!result.isPluginPr) {
	console.log('Not a plugin PR (or draft) — gate skipped.');
	process.exit(0);
}

upsertComment(repo, pr, renderComment(result));
setLabel(repo, pr, result.failures.length > 0);

if (result.failures.length > 0) {
	for (const f of result.failures) {
		console.error(`[GATE][${f.rule}] ${f.message}`);
	}
	process.exit(1);
}
console.log('Gate passed.');
