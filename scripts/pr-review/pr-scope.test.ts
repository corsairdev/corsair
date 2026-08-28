import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
	classifyPrScope,
	filtersForScope,
	packageNameForPlugin,
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
