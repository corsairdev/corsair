import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import {
	applyBump,
	compareVersions,
	isShippedPath,
	nextFreeVersion,
	nextPatch,
	packageJsonChanged,
	planRelease,
	SHIPPED_TEST_HELPERS,
	topLevelVersionRange,
} from './release-on-merge.mjs';

describe('isShippedPath', () => {
	it('counts source, build config and package.json', () => {
		for (const p of [
			'index.ts',
			'endpoints/types.ts',
			'tsup.config.ts',
			'package.json',
		]) {
			assert.equal(isShippedPath(p), true, p);
		}
	});
	it('counts the helpers corsair/tests publishes, and only in corsair', () => {
		assert.equal(isShippedPath('tests/setup-db.ts', 'packages/corsair'), true);
		assert.equal(isShippedPath('tests/index.ts', 'packages/corsair'), true);
		assert.equal(
			isShippedPath('tests/connect-link.test.ts', 'packages/corsair'),
			false,
		);
		assert.equal(isShippedPath('tests/setup-db.ts', 'packages/gmail'), false);
	});
	it('lists every file corsair/tests exports', () => {
		const index = readFileSync(
			new URL('../packages/corsair/tests/index.ts', import.meta.url),
			'utf-8',
		);
		const exported = [...index.matchAll(/from '\.\/([^']+)'/g)].map(
			(m) => `tests/${m[1]}.ts`,
		);
		assert.ok(exported.length > 0);
		const listed = SHIPPED_TEST_HELPERS.get('packages/corsair');
		for (const file of exported) assert.ok(listed.has(file), file);
	});
	it('ignores tests, docs and test config', () => {
		for (const p of [
			'endpoints.test.ts',
			'tests/client.ts',
			'core/__tests__/x.ts',
			'README.md',
			'plugin-docs.yaml',
			'jest.config.cjs',
			'fixtures/a.json',
		]) {
			assert.equal(isShippedPath(p), false, p);
		}
	});
});

describe('packageJsonChanged', () => {
	const base = {
		name: 'x',
		version: '0.1.0',
		dependencies: { a: '1' },
		devDependencies: { b: '1' },
	};
	const text = (o) => JSON.stringify(o, null, 2);
	it('ignores version and devDependencies', () => {
		assert.equal(
			packageJsonChanged(
				text(base),
				text({ ...base, version: '0.1.1', devDependencies: { b: '2' } }),
			),
			false,
		);
	});
	it('counts devDependencies for a package that bundles them', () => {
		const studio = { ...base, name: '@corsair-dev/studio' };
		assert.equal(
			packageJsonChanged(
				text(studio),
				text({ ...studio, devDependencies: { b: '2' } }),
			),
			true,
		);
		assert.equal(
			packageJsonChanged(text(studio), text({ ...studio, version: '0.1.1' })),
			false,
		);
	});
	it('sees dependency and metadata changes', () => {
		assert.equal(
			packageJsonChanged(
				text(base),
				text({ ...base, dependencies: { a: '2' } }),
			),
			true,
		);
		assert.equal(
			packageJsonChanged(text(base), text({ ...base, homepage: 'https://x' })),
			true,
		);
	});
});

describe('versions', () => {
	it('bumps the patch and compares plain versions', () => {
		assert.equal(nextPatch('0.1.9'), '0.1.10');
		assert.equal(compareVersions('0.1.10', '0.1.9'), 1);
		assert.equal(compareVersions('0.2.0', '0.2.0'), 0);
		assert.equal(compareVersions('0.2.0-beta.1', '0.2.0'), null);
		assert.throws(() => nextPatch('1.0.0-rc.1'));
	});
	it('never picks a version npm already has, and never jumps past latest', () => {
		// a version published under another dist-tag is skipped over
		assert.equal(
			nextFreeVersion('0.1.4', '0.1.5', ['0.1.4', '0.1.5', '0.1.6']),
			'0.1.7',
		);
		// corsair on npm: latest 0.1.157, plus a stray 1.0.0 and 2016's 0.0.x
		assert.equal(
			nextFreeVersion('0.1.157', '0.1.157', [
				'0.0.1',
				'0.0.2',
				'1.0.0',
				'0.1.157',
			]),
			'0.1.158',
		);
		assert.equal(nextFreeVersion('0.2.0', '0.1.4', ['0.1.4']), '0.2.1');
		assert.equal(
			nextFreeVersion('0.1.1', '0.1.5', ['0.1.1', '0.1.5']),
			'0.1.6',
		);
	});
	it('finds only the top-level version', () => {
		const text =
			'{\n  "name": "x",\n  "engines": { "version": "0.1.0" },\n  "version": "0.1.0"\n}\n';
		const r = topLevelVersionRange(text);
		assert.equal(text.slice(r.start, r.end), '0.1.0');
		assert.ok(r.start > text.indexOf('"version": "0.1.0"\n'));
	});
});

describe('planRelease on a git repo', () => {
	let cwd;
	const sh = (...args) =>
		execFileSync('git', args, {
			cwd,
			encoding: 'utf-8',
			stdio: ['ignore', 'pipe', 'pipe'],
		}).trim();
	const write = (path, content) => {
		mkdirSync(dirname(join(cwd, path)), { recursive: true });
		writeFileSync(join(cwd, path), content);
	};
	const pkg = (dir, name, version, extra = {}) =>
		write(
			`${dir}/package.json`,
			`${JSON.stringify({ name, version, ...extra }, null, 2)}\n`,
		);
	const commit = (msg) => {
		sh('add', '-A');
		sh('commit', '-q', '-m', msg);
		return sh('rev-parse', 'HEAD');
	};
	// npm: { name: { versions: [...], latest } }
	const registry = (npm) => ({
		async versions(name) {
			const e = npm[name];
			return e
				? {
						versions: new Set(e.versions),
						latest: e.latest ?? e.versions.at(-1),
					}
				: null;
		},
	});

	beforeEach(() => {
		cwd = mkdtempSync(join(tmpdir(), 'release-on-merge-'));
		sh('init', '-q', '-b', 'main');
		sh('config', 'user.email', 't@example.com');
		sh('config', 'user.name', 'T');
		sh('config', 'commit.gpgsign', 'false');
	});
	afterEach(() => rmSync(cwd, { recursive: true, force: true }));

	it('records the release and bumps only packages with shipped changes', async () => {
		pkg('packages/a', '@x/a', '0.1.0');
		write('packages/a/index.ts', 'export const a = 1;\n');
		pkg('packages/b', '@x/b', '0.1.4');
		write('packages/b/index.ts', 'export const b = 1;\n');
		const released = commit('release a 0.1.0 and b 0.1.4');

		write('packages/a/index.ts', 'export const a = 2;\n'); // real fix
		write('packages/b/README.md', '# b\n'); // docs only
		write('packages/b/index.test.ts', 'test\n'); // tests only
		commit('fix a, docs and tests for b');

		const plan = await planRelease({
			cwd,
			registry: registry({
				'@x/a': { versions: ['0.1.0'] },
				'@x/b': { versions: ['0.1.4'] },
			}),
		});
		assert.deepEqual(plan.tags, [
			{ tag: '@x/a@0.1.0', sha: released },
			{ tag: '@x/b@0.1.4', sha: released },
		]);
		assert.deepEqual(plan.bumps, [
			{
				name: '@x/a',
				dir: 'packages/a',
				from: '0.1.0',
				to: '0.1.1',
				files: ['index.ts'],
			},
		]);
	});

	it('uses an existing tag instead of asking npm', async () => {
		pkg('packages/a', '@x/a', '0.1.0');
		write('packages/a/index.ts', '1\n');
		commit('a');
		sh('tag', '@x/a@0.1.0');
		const plan = await planRelease({
			cwd,
			registry: {
				versions: async () => assert.fail('npm should not be asked'),
			},
		});
		assert.deepEqual(plan, { bumps: [], tags: [], waiting: [] });
	});

	it('waits for a version npm does not have yet, so nothing is bumped twice', async () => {
		pkg('packages/a', '@x/a', '0.1.0');
		write('packages/a/index.ts', '1\n');
		commit('a 0.1.0');
		pkg('packages/a', '@x/a', '0.2.0'); // bumped by hand in the PR, not published yet
		write('packages/a/index.ts', '2\n');
		commit('a 0.2.0');
		const lines = [];
		const plan = await planRelease({
			cwd,
			registry: registry({ '@x/a': { versions: ['0.1.0'] } }),
			log: (l) => lines.push(l),
		});
		assert.deepEqual(plan, {
			bumps: [],
			tags: [],
			waiting: [{ name: '@x/a', version: '0.2.0' }],
		});
		assert.match(lines.join('\n'), /WAIT @x\/a@0\.2\.0/);
	});

	it('bumps past a newer version already on npm', async () => {
		pkg('packages/a', '@x/a', '0.1.1');
		write('packages/a/index.ts', '1\n');
		commit('a');
		write('packages/a/index.ts', '2\n');
		commit('fix');
		const plan = await planRelease({
			cwd,
			registry: registry({
				'@x/a': { versions: ['0.1.1', '0.1.5'], latest: '0.1.5' },
			}),
		});
		assert.equal(plan.bumps[0].to, '0.1.6');
	});

	it('only a dependency change in package.json releases', async () => {
		pkg('packages/a', '@x/a', '0.1.0', { devDependencies: { t: '1' } });
		pkg('packages/b', '@x/b', '0.1.0', { dependencies: { z: '1' } });
		commit('a and b');
		pkg('packages/a', '@x/a', '0.1.0', { devDependencies: { t: '2' } });
		pkg('packages/b', '@x/b', '0.1.0', { dependencies: { z: '2' } });
		commit('deps');
		const plan = await planRelease({
			cwd,
			registry: registry({
				'@x/a': { versions: ['0.1.0'] },
				'@x/b': { versions: ['0.1.0'] },
			}),
		});
		assert.deepEqual(
			plan.bumps.map((b) => b.name),
			['@x/b'],
		);
	});

	it('treats a merged branch as released at its merge commit', async () => {
		write('README.md', 'root\n');
		commit('root');
		sh('checkout', '-q', '-b', 'feature');
		pkg('packages/a', '@x/a', '0.1.0');
		write('packages/a/index.ts', '1\n');
		commit('add a');
		write('packages/a/index.ts', '2\n');
		commit('polish a');
		sh('checkout', '-q', 'main');
		sh('merge', '-q', '--no-ff', 'feature', '-m', 'Merge feature');
		const merge = sh('rev-parse', 'HEAD');
		const plan = await planRelease({
			cwd,
			registry: registry({ '@x/a': { versions: ['0.1.0'] } }),
		});
		assert.deepEqual(plan.tags, [{ tag: '@x/a@0.1.0', sha: merge }]);
		assert.deepEqual(plan.bumps, []);
	});

	it('skips private packages', async () => {
		pkg('packages/p', '@x/p', '0.1.0', { private: true });
		write('packages/p/index.ts', '1\n');
		commit('p');
		const plan = await planRelease({ cwd, registry: registry({}) });
		assert.deepEqual(plan, { bumps: [], tags: [], waiting: [] });
	});

	it('releases packages that pin a bumped one at runtime, transitively', async () => {
		pkg('packages/core', 'core', '0.1.157');
		write('packages/core/index.ts', '1\n');
		pkg('packages/cli', '@x/cli', '0.1.24', {
			dependencies: { core: 'workspace:*' },
		});
		pkg('packages/studio', '@x/studio', '0.1.7', {
			dependencies: { '@x/cli': 'workspace:*' },
		});
		pkg('packages/plugin', '@x/plugin', '0.1.0', {
			peerDependencies: { core: '>=0.1.0' },
			devDependencies: { core: 'workspace:*' },
		});
		commit('release');
		write('packages/core/index.ts', '2\n');
		commit('fix core');
		const plan = await planRelease({
			cwd,
			registry: registry({
				core: { versions: ['0.1.157'] },
				'@x/cli': { versions: ['0.1.24'] },
				'@x/studio': { versions: ['0.1.7'] },
				'@x/plugin': { versions: ['0.1.0'] },
			}),
		});
		assert.deepEqual(
			plan.bumps.map((b) => [b.name, b.to, b.files]),
			[
				['@x/cli', '0.1.25', ['depends on core 0.1.158']],
				['@x/studio', '0.1.8', ['depends on @x/cli 0.1.25']],
				['core', '0.1.158', ['index.ts']],
			],
		);
	});

	it('keeps releasing dependents when a later package in the pass is skipped', async () => {
		pkg('packages/core', 'core', '0.1.157');
		write('packages/core/index.ts', '1\n');
		// Sorted before the package it depends on, so it needs a second pass.
		pkg('packages/alpha', '@x/alpha', '0.1.0', {
			dependencies: { '@x/mid': 'workspace:*' },
		});
		pkg('packages/mid', '@x/mid', '0.1.0', {
			dependencies: { core: 'workspace:*' },
		});
		// Sorted after @x/mid, and bump() refuses a prerelease.
		pkg('packages/zeta', '@x/zeta', '0.1.0-beta.1', {
			dependencies: { core: 'workspace:*' },
		});
		commit('release');
		write('packages/core/index.ts', '2\n');
		commit('fix core');
		const plan = await planRelease({
			cwd,
			registry: registry({
				core: { versions: ['0.1.157'] },
				'@x/alpha': { versions: ['0.1.0'] },
				'@x/mid': { versions: ['0.1.0'] },
				'@x/zeta': { versions: ['0.1.0-beta.1'] },
			}),
		});
		assert.deepEqual(
			plan.bumps.map((b) => b.name),
			['@x/alpha', '@x/mid', 'core'],
		);
	});

	it('releases a package when a shipped file moves into tests/', async () => {
		pkg('packages/a', '@x/a', '0.1.0');
		const body = 'export const a = 1;\n'.repeat(20);
		write('packages/a/helper.ts', body);
		commit('release');
		execFileSync(
			'git',
			['mv', 'packages/a/helper.ts', 'packages/a/tests-helper.ts'],
			{ cwd },
		);
		mkdirSync(join(cwd, 'packages/a/tests'));
		execFileSync(
			'git',
			['mv', 'packages/a/tests-helper.ts', 'packages/a/tests/helper.ts'],
			{ cwd },
		);
		commit('move helper into tests');
		const plan = await planRelease({
			cwd,
			registry: registry({ '@x/a': { versions: ['0.1.0'] } }),
		});
		assert.deepEqual(
			plan.bumps.map((b) => [b.name, b.files]),
			[['@x/a', ['helper.ts']]],
		);
	});

	it('ignores a test file with a non-ASCII name', async () => {
		pkg('packages/a', '@x/a', '0.1.0');
		write('packages/a/index.ts', '1\n');
		commit('release');
		write('packages/a/caf\u00e9.test.ts', '1\n');
		commit('add a test');
		const plan = await planRelease({
			cwd,
			registry: registry({ '@x/a': { versions: ['0.1.0'] } }),
		});
		assert.deepEqual(plan.bumps, []);
	});

	it('releases a shipped file with a non-ASCII name', async () => {
		pkg('packages/a', '@x/a', '0.1.0');
		write('packages/a/index.ts', '1\n');
		commit('release');
		write('packages/a/caf\u00e9.ts', '1\n');
		commit('add a source file');
		const plan = await planRelease({
			cwd,
			registry: registry({ '@x/a': { versions: ['0.1.0'] } }),
		});
		assert.deepEqual(
			plan.bumps.map((b) => b.files),
			[['caf\u00e9.ts']],
		);
	});

	it('releases dependents of a version raised by hand', async () => {
		pkg('packages/core', 'core', '0.1.0');
		pkg('packages/cli', '@x/cli', '0.1.0', {
			dependencies: { core: 'workspace:*' },
		});
		commit('release');
		pkg('packages/core', 'core', '0.2.0');
		commit('core 0.2.0 by hand');
		const plan = await planRelease({
			cwd,
			registry: registry({
				core: { versions: ['0.1.0'] },
				'@x/cli': { versions: ['0.1.0'] },
			}),
		});
		assert.deepEqual(
			plan.waiting.map((w) => w.version),
			['0.2.0'],
		);
		assert.deepEqual(
			plan.bumps.map((b) => [b.name, b.to, b.files]),
			[['@x/cli', '0.1.1', ['depends on core 0.2.0']]],
		);
	});

	it('does not release a dependent again when npm is slow to show a version', async () => {
		pkg('packages/core', 'core', '0.1.0');
		pkg('packages/cli', '@x/cli', '0.1.0', {
			dependencies: { core: 'workspace:*' },
		});
		commit('release');
		pkg('packages/core', 'core', '0.1.1');
		pkg('packages/cli', '@x/cli', '0.1.1', {
			dependencies: { core: 'workspace:*' },
		});
		const together = commit('chore(release): publish 2 package(s)');
		// Both are published. npm shows the dependent and not yet its dependency.
		const plan = await planRelease({
			cwd,
			registry: registry({
				core: { versions: ['0.1.0'] },
				'@x/cli': { versions: ['0.1.0', '0.1.1'] },
			}),
		});
		assert.deepEqual(plan, {
			bumps: [],
			tags: [{ tag: '@x/cli@0.1.1', sha: together }],
			waiting: [{ name: 'core', version: '0.1.1' }],
		});
	});

	it('releases a dependent once, however long its dependency stays unpublished', async () => {
		pkg('packages/core', 'core', '0.1.0');
		pkg('packages/cli', '@x/cli', '0.1.0', {
			dependencies: { core: 'workspace:*' },
		});
		commit('release');
		pkg('packages/core', 'core', '0.1.1');
		commit('chore(release): publish 1 package(s)'); // npm never serves core 0.1.1
		pkg('packages/cli', '@x/cli', '0.1.1', {
			dependencies: { core: 'workspace:*' },
		});
		commit('chore(release): publish 1 package(s)'); // cli, released for core 0.1.1
		const plan = await planRelease({
			cwd,
			registry: registry({
				core: { versions: ['0.1.0'] },
				'@x/cli': { versions: ['0.1.0', '0.1.1'] },
			}),
		});
		assert.deepEqual(plan.bumps, []);
		assert.deepEqual(plan.waiting, [{ name: 'core', version: '0.1.1' }]);
	});

	it('releases a dependent that was last released before the waiting version', async () => {
		pkg('packages/core', 'core', '0.1.0');
		pkg('packages/cli', '@x/cli', '0.1.0', {
			dependencies: { core: 'workspace:*' },
		});
		commit('release');
		pkg('packages/cli', '@x/cli', '0.1.1', {
			dependencies: { core: 'workspace:*' },
		});
		commit('cli 0.1.1');
		pkg('packages/core', 'core', '0.2.0');
		commit('core 0.2.0 by hand');
		const plan = await planRelease({
			cwd,
			registry: registry({
				core: { versions: ['0.1.0'] },
				'@x/cli': { versions: ['0.1.0', '0.1.1'] },
			}),
		});
		assert.deepEqual(
			plan.bumps.map((b) => [b.name, b.to, b.files]),
			[['@x/cli', '0.1.2', ['depends on core 0.2.0']]],
		);
	});

	it('does not bump a dependent again while it waits for npm itself', async () => {
		pkg('packages/core', 'core', '0.2.0');
		pkg('packages/cli', '@x/cli', '0.1.1', {
			dependencies: { core: 'workspace:*' },
		});
		commit('core and cli, neither published yet');
		const plan = await planRelease({
			cwd,
			registry: registry({
				core: { versions: ['0.1.0'] },
				'@x/cli': { versions: ['0.1.0'] },
			}),
		});
		assert.deepEqual(plan.bumps, []);
		assert.equal(plan.waiting.length, 2);
	});

	it('never bumps a held package, even when its files changed', async () => {
		pkg('packages/app', '@corsair-dev/app', '0.1.1');
		write('packages/app/index.ts', '1\n');
		commit('release');
		write('packages/app/index.ts', '2\n');
		commit('change app');
		const plan = await planRelease({
			cwd,
			registry: registry({
				'@corsair-dev/app': { versions: ['0.1.1', '0.1.5'], latest: '0.1.5' },
			}),
		});
		assert.deepEqual(plan.bumps, []);
	});

	it('tags the commit that set the top-level version, not a nested one', async () => {
		pkg('packages/a', '@x/a', '0.1.0');
		write('packages/a/index.ts', '1\n');
		const set = commit('a 0.1.0');
		write('packages/a/index.ts', '2\n');
		pkg('packages/a', '@x/a', '0.1.0', { engines: { version: '0.1.0' } });
		commit('fix a and add a nested version');
		const plan = await planRelease({
			cwd,
			registry: registry({ '@x/a': { versions: ['0.1.0'] } }),
		});
		assert.deepEqual(plan.tags, [{ tag: '@x/a@0.1.0', sha: set }]);
		assert.deepEqual(
			plan.bumps.map((b) => b.files),
			[['index.ts', 'package.json']],
		);
	});

	it('applyBump rewrites only the top-level version', () => {
		write(
			'packages/a/package.json',
			'{\n\t"name": "@x/a",\n\t"peer": { "version": "0.1.0" },\n\t"version": "0.1.0"\n}\n',
		);
		applyBump(cwd, { dir: 'packages/a', from: '0.1.0', to: '0.1.1' });
		assert.equal(
			readFileSync(join(cwd, 'packages/a/package.json'), 'utf-8'),
			'{\n\t"name": "@x/a",\n\t"peer": { "version": "0.1.0" },\n\t"version": "0.1.1"\n}\n',
		);
	});
});
