import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import type { PrScope } from './pr-scope.ts';
import { classifyPrScope, filtersForScope } from './pr-scope.ts';

function gh(args: string[]): string {
	return execFileSync('gh', args, {
		encoding: 'utf8',
		maxBuffer: 64 * 1024 * 1024,
	});
}

function pullRequestNumber(): string {
	const event: unknown = JSON.parse(
		fs.readFileSync(process.env.GITHUB_EVENT_PATH ?? '', 'utf8'),
	);
	if (
		typeof event !== 'object' ||
		event === null ||
		!('pull_request' in event) ||
		typeof event.pull_request !== 'object' ||
		event.pull_request === null ||
		!('number' in event.pull_request) ||
		typeof event.pull_request.number !== 'number'
	) {
		throw new Error('Pull request event has no PR number');
	}
	return String(event.pull_request.number);
}

function changedFilesForPullRequest(repo: string, pr: string): string[] {
	return gh([
		'api',
		`repos/${repo}/pulls/${pr}/files`,
		'--paginate',
		'--jq',
		'.[].filename',
	])
		.trim()
		.split('\n')
		.filter(Boolean);
}

function writeOutput(name: string, value: string): void {
	const output = process.env.GITHUB_OUTPUT;
	if (!output) throw new Error('GITHUB_OUTPUT is not set');
	fs.appendFileSync(output, `${name}=${value}\n`);
}

let scope: PrScope = { lane: 'full', includeWww: false };
if (process.env.GITHUB_EVENT_NAME === 'pull_request') {
	const repo = process.env.GITHUB_REPOSITORY;
	if (!repo) throw new Error('GITHUB_REPOSITORY is not set');
	scope = classifyPrScope(
		changedFilesForPullRequest(repo, pullRequestNumber()),
	);
}

const filters = filtersForScope(scope);
writeOutput('lane', filters.lane);
writeOutput('turbo_filter', filters.turboFilter);
writeOutput('skip_heavy', String(filters.skipHeavy));
writeOutput('include_www', String(filters.includeWww));
writeOutput('www_install_filter', filters.wwwInstallFilter);
writeOutput('www_test_filter', filters.wwwTestFilter);
console.log(
	scope.lane === 'plugin'
		? `CI lane: plugin (${scope.plugin}, filter ${filters.turboFilter})`
		: `CI lane: ${scope.lane}`,
);
