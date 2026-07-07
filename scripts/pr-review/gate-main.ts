import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import type { GateResult } from './gate.ts';
import { runGate } from './gate.ts';

const MARKER = '<!-- corsair-pr-gate -->';

function gh(args: string[]): string {
	return execFileSync('gh', args, {
		encoding: 'utf8',
		maxBuffer: 64 * 1024 * 1024,
	});
}

function renderComment(result: GateResult): string {
	const lines = [MARKER, '### Plugin PR gate', ''];
	if (result.failures.length === 0) {
		lines.push(`✅ All gate checks passed for \`packages/${result.plugin}\`.`);
	} else {
		lines.push(
			`Checks for \`packages/${result.plugin}\` — see [PLUGIN_PR_RULES.md](https://github.com/${process.env.GITHUB_REPOSITORY}/blob/main/.github/PLUGIN_PR_RULES.md):`,
			'',
		);
		for (const f of result.failures) {
			lines.push(`- ❌ **${f.rule}** — ${f.message}`);
		}
	}
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

const result = runGate({
	changedFiles,
	prBody: (event.pull_request.body as string) ?? '',
	isDraft: event.pull_request.draft as boolean,
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
