import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
	changeSetForPush,
	classifyPrScope,
	classifyPushChangeSet,
	filtersForScope,
	isGitZeroOid,
	packageNameForPlugin,
	pushRangeFromGithubEvent,
} from './pr-scope.ts';

test('uses the plugin lane for one plugin plus gate-approved extra files', () => {
	assert.deepEqual(
		classifyPrScope([
			'packages/slack/index.ts',
			'packages/corsair/core/constants.ts',
			'pnpm-lock.yaml',
		]),
		{ lane: 'plugin', plugin: 'slack' },
	);
});

test('keeps plugin-code PRs in the plugin lane when they regenerate that plugin docs', () => {
	assert.deepEqual(
		classifyPrScope([
			'packages/airtable/index.ts',
			'docs/plugins/airtable/overview.mdx',
			'docs/docs.json',
		]),
		{ lane: 'plugin', plugin: 'airtable' },
	);
});

test('uses the full lane when a plugin PR changes other corsair files', () => {
	assert.deepEqual(
		classifyPrScope([
			'packages/slack/index.ts',
			'packages/corsair/core/client.ts',
		]),
		{ lane: 'full', includeWww: false },
	);
});

test('uses the full lane for changes to two plugins', () => {
	assert.deepEqual(
		classifyPrScope(['packages/slack/index.ts', 'packages/github/index.ts']),
		{ lane: 'full', includeWww: false },
	);
});

test('uses the full lane for non-plugin package changes', () => {
	assert.deepEqual(classifyPrScope(['packages/cli/src/index.ts']), {
		lane: 'full',
		includeWww: false,
	});
});

test('uses the full lane for lockfile-only changes', () => {
	assert.deepEqual(classifyPrScope(['pnpm-lock.yaml']), {
		lane: 'full',
		includeWww: false,
	});
});

test('skips heavy checks for plugin-docs.yaml and generated plugin docs', () => {
	assert.deepEqual(
		classifyPrScope([
			'packages/airtable/plugin-docs.yaml',
			'docs/plugins/airtable/overview.mdx',
			'docs/docs.json',
		]),
		{ lane: 'skip-heavy' },
	);
});

test('skips heavy checks for explorer and documentation-only changes', () => {
	assert.deepEqual(
		classifyPrScope([
			'explorer/src/index.ts',
			'docs/getting-started.md',
			'README.md',
		]),
		{ lane: 'skip-heavy' },
	);
});

test('uses the www lane for www-only changes', () => {
	assert.deepEqual(classifyPrScope(['www/src/app/page.tsx']), {
		lane: 'www',
	});
});

test('uses the www lane when www changes include root docs', () => {
	assert.deepEqual(classifyPrScope(['www/src/app/page.tsx', 'README.md']), {
		lane: 'www',
	});
});

test('uses the full lane and includes www when www and packages both change', () => {
	assert.deepEqual(
		classifyPrScope(['www/src/app/page.tsx', 'packages/slack/index.ts']),
		{ lane: 'full', includeWww: true },
	);
});

test('reads the npm package name for a plugin', () => {
	assert.equal(packageNameForPlugin('slack'), '@corsair-dev/slack');
});

test('plugin filters include the package and its dependencies, not dependents', () => {
	const filters = filtersForScope({ lane: 'plugin', plugin: 'slack' });
	assert.equal(filters.turboFilter, '@corsair-dev/slack...');
	assert.equal(filters.includeWww, false);
	assert.doesNotMatch(filters.turboFilter, /^\.\.\./);
});

test('full-lane turbo filter stays quoted-glob safe', () => {
	assert.deepEqual(filtersForScope({ lane: 'full', includeWww: false }), {
		lane: 'full',
		turboFilter: './packages/*',
		skipHeavy: false,
		includeWww: false,
		wwwInstallFilter: '',
		wwwTestFilter: '',
	});
});

test('mixed www filters keep package globs out of the www extra flags', () => {
	assert.deepEqual(filtersForScope({ lane: 'full', includeWww: true }), {
		lane: 'full',
		turboFilter: './packages/*',
		skipHeavy: false,
		includeWww: true,
		wwwInstallFilter: '--filter=@corsair/www...',
		wwwTestFilter: '--filter=@corsair/www',
	});
});

test('treats an all-zero git oid as an unborn push', () => {
	assert.equal(isGitZeroOid('0000000000000000000000000000000000000000'), true);
	assert.equal(isGitZeroOid('1dd80230fe63df54c05ee15dcfd92bd72038c522'), false);
});

test('reads before and after shas from a GitHub push event', () => {
	assert.deepEqual(
		pushRangeFromGithubEvent({
			before: 'aaa111bbb222ccc333ddd444eee555fff666aaa1',
			after: 'bbb222ccc333ddd444eee555fff666aaa111bbb2',
		}),
		{
			before: 'aaa111bbb222ccc333ddd444eee555fff666aaa1',
			after: 'bbb222ccc333ddd444eee555fff666aaa111bbb2',
		},
	);
});

test('rejects a GitHub event that is not a push range', () => {
	assert.equal(pushRangeFromGithubEvent(null), null);
	assert.equal(pushRangeFromGithubEvent({ pull_request: { number: 1 } }), null);
	assert.equal(pushRangeFromGithubEvent({ before: '', after: 'abc' }), null);
});

test('treats an unborn push as unknown so CI includes www', () => {
	const changeSet = changeSetForPush({
		before: '0000000000000000000000000000000000000000',
		after: 'bbb222ccc333ddd444eee555fff666aaa111bbb2',
		diff: () => {
			throw new Error('diff should not run');
		},
	});
	assert.deepEqual(changeSet, {
		kind: 'unknown',
		reason: 'unborn revision',
	});
	assert.deepEqual(classifyPushChangeSet(changeSet), {
		lane: 'full',
		includeWww: true,
	});
});

test('keeps a known empty push in packages-only full', () => {
	assert.deepEqual(classifyPushChangeSet({ kind: 'known', files: [] }), {
		lane: 'full',
		includeWww: false,
	});
});

test('fails closed to full with www when the push diff is unknown', () => {
	assert.deepEqual(
		classifyPushChangeSet({ kind: 'unknown', reason: 'git diff failed' }),
		{
			lane: 'full',
			includeWww: true,
		},
	);
	assert.deepEqual(
		filtersForScope({ lane: 'full', includeWww: true }).wwwTestFilter,
		'--filter=@corsair/www',
	);
});

test('uses the push diff so a plugin land on main stays in the plugin lane', () => {
	const changeSet = changeSetForPush({
		before: 'aaa111bbb222ccc333ddd444eee555fff666aaa1',
		after: 'bbb222ccc333ddd444eee555fff666aaa111bbb2',
		diff: (before, after) => {
			assert.equal(before, 'aaa111bbb222ccc333ddd444eee555fff666aaa1');
			assert.equal(after, 'bbb222ccc333ddd444eee555fff666aaa111bbb2');
			return [
				'packages/slack/index.ts',
				'packages/corsair/core/constants.ts',
				'pnpm-lock.yaml',
			];
		},
	});
	assert.deepEqual(changeSet, {
		kind: 'known',
		files: [
			'packages/slack/index.ts',
			'packages/corsair/core/constants.ts',
			'pnpm-lock.yaml',
		],
	});
	assert.deepEqual(classifyPushChangeSet(changeSet), {
		lane: 'plugin',
		plugin: 'slack',
	});
});
