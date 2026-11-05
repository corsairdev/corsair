import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import type { PrScope, PushChangeSet } from './pr-scope.ts';
import {
	changeSetForPush,
	classifyPrScope,
	classifyPushChangeSet,
	filtersForScope,
	pushRangeFromGithubEvent,
} from './pr-scope.ts';

function gh(args: string[]): string {
	return execFileSync('gh', args, {
		encoding: 'utf8',
		maxBuffer: 64 * 1024 * 1024,
	});
}

function githubEvent(): unknown {
	return JSON.parse(
		fs.readFileSync(process.env.GITHUB_EVENT_PATH ?? '', 'utf8'),
	);
}

function pullRequestNumber(event: unknown): string {
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

// A rename counts as both paths, so moving a file out of a package into a
// docs-only folder still classifies by where it came from.
function changedFilesForPullRequest(repo: string, pr: string): string[] {
	return gh([
		'api',
		`repos/${repo}/pulls/${pr}/files`,
		'--paginate',
		'--jq',
		// One JSON string per line, so a path keeps its exact bytes: no trim,
		// and a newline inside a filename cannot split it.
		'.[] | .filename, (.previous_filename // empty) | @json',
	])
		.split('\n')
		.filter(Boolean)
		.map((line) => JSON.parse(line) as string);
}

function gitDiffNameOnly(before: string, after: string): string[] {
	// -z: NUL-separated and unquoted, so a path with non-ASCII characters
	// comes back as itself instead of a quoted, octal-escaped string.
	const diff = (): string[] =>
		execFileSync(
			'git',
			['diff', '--name-only', '--no-renames', '-z', before, after],
			{
				encoding: 'utf8',
				maxBuffer: 64 * 1024 * 1024,
			},
		)
			.split('\0')
			.filter(Boolean);
	try {
		return diff();
	} catch {
		execFileSync('git', ['fetch', '--depth=1', 'origin', before], {
			encoding: 'utf8',
			maxBuffer: 64 * 1024 * 1024,
		});
		return diff();
	}
}

function writeOutput(name: string, value: string): void {
	const output = process.env.GITHUB_OUTPUT;
	if (!output) throw new Error('GITHUB_OUTPUT is not set');
	fs.appendFileSync(output, `${name}=${value}\n`);
}

function unknownPush(reason: string): PushChangeSet {
	console.warn(`CI lane fallback: full with www (${reason})`);
	return { kind: 'unknown', reason };
}

function scopeForCurrentEvent(): PrScope {
	const eventName = process.env.GITHUB_EVENT_NAME;
	const event = githubEvent();
	if (eventName === 'pull_request') {
		const repo = process.env.GITHUB_REPOSITORY;
		if (!repo) throw new Error('GITHUB_REPOSITORY is not set');
		return classifyPrScope(
			changedFilesForPullRequest(repo, pullRequestNumber(event)),
		);
	}
	if (eventName === 'push') {
		const range = pushRangeFromGithubEvent(event);
		if (range === null) {
			return classifyPushChangeSet(
				unknownPush('push event has no before/after'),
			);
		}
		try {
			const changeSet = changeSetForPush({
				before: range.before,
				after: range.after,
				diff: gitDiffNameOnly,
			});
			if (changeSet.kind === 'unknown') {
				console.warn(`CI lane fallback: full with www (${changeSet.reason})`);
			}
			return classifyPushChangeSet(changeSet);
		} catch {
			return classifyPushChangeSet(
				unknownPush(`git diff failed for ${range.before}..${range.after}`),
			);
		}
	}
	return classifyPushChangeSet(
		unknownPush(`unsupported event ${eventName ?? ''}`),
	);
}

const scope = scopeForCurrentEvent();
const filters = filtersForScope(scope);
writeOutput('lane', filters.lane);
writeOutput('turbo_filter', filters.turboFilter);
writeOutput('adapters_filter', filters.adaptersFilter);
writeOutput('skip_heavy', String(filters.skipHeavy));
writeOutput('include_www', String(filters.includeWww));
writeOutput('www_install_filter', filters.wwwInstallFilter);
writeOutput('www_test_filter', filters.wwwTestFilter);
// The plugin's folder under packages/, for steps that take a path.
writeOutput('plugin', scope.lane === 'plugin' ? scope.plugin : '');
console.log(
	scope.lane === 'plugin'
		? `CI lane: plugin (${scope.plugin}, filter ${filters.turboFilter})`
		: scope.lane === 'full'
			? `CI lane: full (www=${scope.includeWww})`
			: `CI lane: ${scope.lane}`,
);
