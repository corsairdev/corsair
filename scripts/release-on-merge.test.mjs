import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import {
	applyBump,
	compareVersions,
	isShippedPath,
	nextPatch,
	packageJsonChanged,
	planRelease,
} from './release-on-merge.mjs';

describe('isShippedPath', () => {
	it('counts source, build config and package.json', () => {
		for (const p of ['index.ts', 'endpoints/types.ts', 'tsup.config.ts', 'package.json']) {
			assert.equal(isShippedPath(p), true, p);
		}
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
	const base = { name: 'x', version: '0.1.0', dependencies: { a: '1' }, devDependencies: { b: '1' } };
	const text = (o) => JSON.stringify(o, null, 2);
	it('ignores version and devDependencies', () => {
		assert.equal(
			packageJsonChanged(text(base), text({ ...base, version: '0.1.1', devDependencies: { b: '2' } })),
			false,
		);
	});
	it('sees dependency and metadata changes', () => {
		assert.equal(packageJsonChanged(text(base), text({ ...base, dependencies: { a: '2' } })), true);
		assert.equal(packageJsonChanged(text(base), text({ ...base, homepage: 'https://x' })), true);
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
});

describe('planRelease on a git repo', () => {
	let cwd;
	const sh = (...args) =>
		execFileSync('git', args, { cwd, encoding: 'utf-8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
	const write = (path, content) => {
		mkdirSync(dirname(join(cwd, path)), { recursive: true });
		writeFileSync(join(cwd, path), content);
	};
	const pkg = (dir, name, version, extra = {}) =>
		write(`${dir}/package.json`, `${JSON.stringify({ name, version, ...extra }, null, 2)}\n`);
	const commit = (msg) => {
		sh('add', '-A');
		sh('commit', '-q', '-m', msg);
		return sh('rev-parse', 'HEAD');
	};
	// npm: { name: { versions: [...], latest } }
	const registry = (npm) => ({
		async versions(name) {
			const e = npm[name];
			return e ? { versions: new Set(e.versions), latest: e.latest ?? e.versions.at(-1) } : null;
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
			registry: registry({ '@x/a': { versions: ['0.1.0'] }, '@x/b': { versions: ['0.1.4'] } }),
		});
		assert.deepEqual(plan.tags, [
			{ tag: '@x/a@0.1.0', sha: released },
			{ tag: '@x/b@0.1.4', sha: released },
		]);
		assert.deepEqual(plan.bumps, [
			{ name: '@x/a', dir: 'packages/a', from: '0.1.0', to: '0.1.1', files: ['index.ts'] },
		]);
	});

	it('uses an existing tag instead of asking npm', async () => {
		pkg('packages/a', '@x/a', '0.1.0');
		write('packages/a/index.ts', '1\n');
		commit('a');
		sh('tag', '@x/a@0.1.0');
		const plan = await planRelease({
			cwd,
			registry: { versions: async () => assert.fail('npm should not be asked') },
		});
		assert.deepEqual(plan, { bumps: [], tags: [] });
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
		assert.deepEqual(plan, { bumps: [], tags: [] });
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
			registry: registry({ '@x/a': { versions: ['0.1.1', '0.1.5'], latest: '0.1.5' } }),
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
			registry: registry({ '@x/a': { versions: ['0.1.0'] }, '@x/b': { versions: ['0.1.0'] } }),
		});
		assert.deepEqual(plan.bumps.map((b) => b.name), ['@x/b']);
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
		assert.deepEqual(plan, { bumps: [], tags: [] });
	});

	it('applyBump rewrites only the version', () => {
		write('packages/a/package.json', '{\n\t"name": "@x/a",\n\t"version": "0.1.0",\n\t"peer": { "version": "0.1.0" }\n}\n');
		applyBump(cwd, { dir: 'packages/a', from: '0.1.0', to: '0.1.1' });
		assert.equal(
			readFileSync(join(cwd, 'packages/a/package.json'), 'utf-8'),
			'{\n\t"name": "@x/a",\n\t"version": "0.1.1",\n\t"peer": { "version": "0.1.0" }\n}\n',
		);
	});
});
