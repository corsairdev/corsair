import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import {
	chmodSync,
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { delimiter, dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import {
	BACKUP_BRANCH,
	BOT_BRANCH,
	build,
	icons,
	MARKER,
	missingIconIds,
	publish,
	renderBody,
	renderTitle,
	summarize,
} from './catalog-bot.mjs';

const plugin = (id, api = 1, extra = {}) => ({
	id,
	displayName: id.toUpperCase(),
	counts: { api, webhooks: 0, db: 0 },
	...extra,
});
const catalog = (plugins, extra = {}) => ({
	generatedAt: '2026-01-01',
	corsairVersion: '0.1.0',
	catalogVersion: 2,
	plugins,
	search: [],
	...extra,
});
const emptyPlan = {
	added: [],
	modified: [],
	removed: [],
	changed: false,
	missingIcons: [],
	icons: [],
};

describe('summarize', () => {
	it('sees added, removed and changed plugins', () => {
		const out = summarize({
			before: catalog([plugin('a'), plugin('b'), plugin('c')]),
			after: catalog([plugin('a', 2), plugin('c'), plugin('d')]),
		});
		assert.deepEqual(
			out.added.map((p) => p.id),
			['d'],
		);
		assert.deepEqual(
			out.removed.map((p) => p.id),
			['b'],
		);
		assert.deepEqual(
			out.modified.map((p) => [p.id, p.before.api, p.counts.api]),
			[['a', 1, 2]],
		);
		assert.equal(out.changed, true);
	});
	it('does not count a new generatedAt or corsairVersion as a change', () => {
		const out = summarize({
			before: catalog([plugin('a')]),
			after: catalog([plugin('a')], {
				generatedAt: '2026-02-02',
				corsairVersion: '0.1.1',
			}),
		});
		assert.equal(out.changed, false);
	});
	it('counts a reworded operation, which moves no summary field', () => {
		const out = summarize({
			before: catalog([plugin('a')]),
			after: catalog([plugin('a')]),
			changedFileIds: ['a'],
		});
		assert.equal(out.changed, true);
		assert.deepEqual(
			out.modified.map((p) => p.id),
			['a'],
		);
	});
	it('lists a new plugin once, as added', () => {
		const out = summarize({
			before: catalog([]),
			after: catalog([plugin('a')]),
			changedFileIds: ['a'],
		});
		assert.deepEqual(out.modified, []);
		assert.equal(out.added.length, 1);
	});
});

describe('renderTitle', () => {
	const names = (n) => Array.from({ length: n }, (_, i) => plugin(`p${i}`));
	it('names up to four added plugins', () => {
		assert.equal(
			renderTitle({ ...emptyPlan, added: [plugin('a')] }),
			'chore(explorer): add A to the catalog',
		);
		assert.equal(
			renderTitle({ ...emptyPlan, added: names(3) }),
			'chore(explorer): add P0, P1 and P2 to the catalog',
		);
		assert.equal(
			renderTitle({ ...emptyPlan, added: names(5) }),
			'chore(explorer): add 5 plugins to the catalog',
		);
	});
	it('names a few changed plugins, then stops', () => {
		assert.equal(
			renderTitle({ ...emptyPlan, modified: names(2) }),
			'chore(explorer): update P0 and P1 in the catalog',
		);
		assert.equal(
			renderTitle({ ...emptyPlan, modified: names(4) }),
			'chore(explorer): update the catalog',
		);
	});
});

describe('renderBody', () => {
	const render = (plan) =>
		renderBody({
			plan: { ...emptyPlan, ...plan },
			repo: 'corsairdev/corsair',
			sha: 'abc123',
			sourceSha: 'main123',
		});
	it('shows each new icon at both sizes from the pushed commit', () => {
		const body = render({
			icons: [
				{
					id: 'fal',
					domain: 'fal.ai',
					source: 'twenty-icons',
					kept: false,
					found: true,
				},
			],
		});
		assert.ok(body.startsWith(MARKER));
		const url =
			'https://raw.githubusercontent.com/corsairdev/corsair/abc123/explorer/icons/fal.png';
		assert.ok(body.includes(`<img src="${url}" width="256"`));
		assert.ok(body.includes(`<img src="${url}" width="26"`));
		assert.ok(body.includes('favicons?domain=fal.ai&sz=128'));
	});
	it('says when no icon was found', () => {
		const body = render({
			icons: [{ id: 'x', domain: 'x.io', source: null, found: false }],
		});
		assert.ok(body.includes('**none found**'));
		assert.ok(!body.includes('explorer/icons/x.png'));
	});
	it('escapes plugin text and drops a domain that is not one', () => {
		const body = render({
			added: [plugin('a', 1, { displayName: 'A | <img src=x> @dev' })],
			icons: [
				{
					id: 'a',
					domain: 'x.io"><script>',
					source: 'twenty-icons',
					found: true,
				},
			],
		});
		assert.ok(body.includes('A \\| \\<img src=x\\> \\@dev'));
		assert.ok(!body.includes('favicons?domain=x.io"'));
		assert.ok(!body.includes('<script>'));
	});
	it('caps a long list of changes', () => {
		const modified = Array.from({ length: 70 }, (_, i) => ({
			...plugin(`p${i}`),
			before: {},
		}));
		const body = render({ modified });
		assert.ok(body.includes('And 10 more.'));
		assert.ok(!body.includes('| p65 |'));
	});
});

describe('on a git repo', () => {
	let root;
	let cwd;
	let remote;
	let ghLog;
	let ghState;
	const originalPath = process.env.PATH;

	const git = (args, dir = cwd) =>
		execFileSync('git', args, {
			cwd: dir,
			encoding: 'utf-8',
			stdio: ['ignore', 'pipe', 'pipe'],
		}).trim();
	const write = (path, text) => {
		const full = join(cwd, path);
		mkdirSync(dirname(full), { recursive: true });
		writeFileSync(full, text);
	};
	const writeCatalog = (
		plugins,
		generatedAt = '2026-01-01',
		corsairVersion = '0.1.0',
	) =>
		write(
			'explorer/data/catalog.json',
			`${JSON.stringify(catalog(plugins, { generatedAt, corsairVersion }), null, 2)}\n`,
		);
	const ghCalls = () =>
		existsSync(ghLog)
			? readFileSync(ghLog, 'utf-8').trim().split('\n').filter(Boolean)
			: [];
	const setPrs = (open, closed = []) =>
		writeFileSync(ghState, JSON.stringify({ open, closed }));
	const fetchBranch = () =>
		git([
			'fetch',
			'-q',
			'origin',
			`+refs/heads/${BOT_BRANCH}:refs/remotes/origin/${BOT_BRANCH}`,
		]);
	const remoteHead = () =>
		git(['rev-parse', `refs/heads/${BOT_BRANCH}`], remote);
	const remoteBranches = () =>
		git(['for-each-ref', '--format=%(refname:short)', 'refs/heads'], remote)
			.split('\n')
			.sort();
	const WORKFLOW_REFUSAL =
		'echo "refusing to allow a GitHub App to create or update workflow without workflows permission" >&2';
	// GitHub's refusal, as an update hook: a new or deleted branch goes through,
	// a force-push doesn't. `first` runs before that, with $1 the ref, $2 the old
	// commit and $3 the new one.
	const refuseForcePushes = (first = '') => {
		const hook = join(remote, 'hooks/update');
		writeFileSync(
			hook,
			`#!/bin/sh
${first}
case "$2" in 0000000*) exit 0;; esac
case "$3" in 0000000*) exit 0;; esac
${WORKFLOW_REFUSAL}
exit 1
`,
		);
		chmodSync(hook, 0o755);
	};
	const resetToMain = () => {
		git(['checkout', '-q', '--detach', 'main']);
		git(['clean', '-fdq']);
	};
	const run = (plan) =>
		publish({
			cwd,
			plan: { ...emptyPlan, ...plan },
			repo: 'o/r',
			sourceSha: 'main123',
		});

	beforeEach(() => {
		root = mkdtempSync(join(tmpdir(), 'catalog-bot-'));
		remote = join(root, 'remote.git');
		cwd = join(root, 'work');
		ghLog = join(root, 'gh.log');
		ghState = join(root, 'prs.json');
		mkdirSync(remote);
		git(['init', '-q', '--bare', '-b', 'main'], remote);
		mkdirSync(cwd);
		git(['init', '-q', '-b', 'main']);
		git(['config', 'user.name', 'T']);
		git(['config', 'user.email', 't@x']);
		git(['remote', 'add', 'origin', remote]);
		writeCatalog([plugin('a')]);
		write('explorer/icons/a.png', 'a\n');
		write(
			'explorer/data/icon-manifest.json',
			`${JSON.stringify({ domains: { a: 'a.io' }, sources: { a: 'twenty-icons' }, dark: [] })}\n`,
		);
		write('scripts/plugin-icon-sources/SOURCES.json', '{}\n');
		git(['add', '.']);
		git(['commit', '-q', '-m', 'init']);
		git(['push', '-q', 'origin', 'main']);
		git(['checkout', '-q', '--detach', 'main']);

		// A stand-in for gh: logs each call and answers `pr list` from a file.
		const bin = join(root, 'bin');
		mkdirSync(bin);
		const fake = join(bin, 'gh');
		writeFileSync(
			fake,
			`#!/usr/bin/env node
const fs = require('node:fs');
const args = process.argv.slice(2);
fs.appendFileSync(${JSON.stringify(ghLog)}, args.slice(0, 2).join(' ') + (args[2] && !args[2].startsWith('-') ? ' ' + args[2] : '') + '\\n');
if (args[0] === 'pr' && args[1] === 'list') {
  const state = JSON.parse(fs.readFileSync(${JSON.stringify(ghState)}, 'utf8'));
  console.log(JSON.stringify(args.includes('closed') ? state.closed : state.open));
}
`,
		);
		chmodSync(fake, 0o755);
		process.env.PATH = `${bin}${delimiter}${originalPath}`;
		setPrs([]);
	});

	afterEach(() => {
		process.env.PATH = originalPath;
		rmSync(root, { recursive: true, force: true });
	});

	describe('build', () => {
		it('throws away a rebuild that only moved generatedAt', () => {
			const plan = build({
				cwd,
				runBuild: () => writeCatalog([plugin('a')], '2026-09-09'),
			});
			assert.equal(plan.changed, false);
			assert.equal(git(['status', '--porcelain']), '');
		});
		it('reports a new plugin and its missing icon', () => {
			const plan = build({
				cwd,
				runBuild: () => {
					writeCatalog([plugin('a'), plugin('b')]);
					write('explorer/data/plugins/b.json', '{}\n');
				},
			});
			assert.equal(plan.changed, true);
			assert.deepEqual(plan.missingIcons, ['b']);
			assert.deepEqual(
				plan.added.map((p) => p.id),
				['b'],
			);
		});
		it('reports a change only a plugin file shows', () => {
			write('explorer/data/plugins/a.json', '{"v":1}\n');
			git(['add', '.']);
			git(['commit', '-q', '-m', 'plugin file']);
			const plan = build({
				cwd,
				runBuild: () => write('explorer/data/plugins/a.json', '{"v":2}\n'),
			});
			assert.deepEqual(
				plan.modified.map((p) => p.id),
				['a'],
			);
		});
	});

	it('missingIconIds skips an id that could not be a file name', () => {
		assert.deepEqual(
			missingIconIds(catalog([plugin('a'), plugin('b'), plugin('../x')]), cwd),
			['b'],
		);
	});

	describe('icons', () => {
		const plan = { ...emptyPlan, changed: true, missingIcons: ['b'] };
		const fakeFetch = (dir, ids) => {
			const path = join(dir, 'explorer/data/icon-manifest.json');
			const manifest = JSON.parse(readFileSync(path, 'utf-8'));
			for (const id of ids) {
				manifest.domains[id] = `${id}.io`;
				manifest.sources[id] ??= 'twenty-icons';
				const png = join(dir, `explorer/icons/${id}.png`);
				if (!existsSync(png)) writeFileSync(png, 'favicon\n');
			}
			writeFileSync(path, JSON.stringify(manifest));
		};

		it('uses the favicon without a key, and never calls the Brand API', () => {
			const out = icons({
				cwd,
				plan,
				hasKey: false,
				fetchIcons: fakeFetch,
				importIcon: () => assert.fail('no key, no lookup'),
			});
			assert.deepEqual(out.icons, [
				{
					id: 'b',
					domain: 'b.io',
					source: 'twenty-icons',
					kept: false,
					dark: false,
					found: true,
				},
			]);
		});

		it('asks the Brand API with a key, and renders what it returned', () => {
			const asked = [];
			const fetched = [];
			icons({
				cwd,
				plan,
				hasKey: true,
				fetchIcons: (dir, ids) => {
					fetched.push(ids);
					fakeFetch(dir, ids);
				},
				importIcon: (_dir, id, domain) => {
					asked.push([id, domain]);
					return true;
				},
			});
			assert.deepEqual(asked, [['b', 'b.io']]);
			assert.deepEqual(fetched, [['b'], ['b']]);
		});

		it('keeps the favicon when the Brand API has nothing', () => {
			const fetched = [];
			const out = icons({
				cwd,
				plan,
				hasKey: true,
				fetchIcons: (dir, ids) => {
					fetched.push(ids);
					fakeFetch(dir, ids);
				},
				importIcon: () => false,
			});
			assert.deepEqual(fetched, [['b']]);
			assert.equal(out.icons[0].found, true);
		});

		it('looks again when the plugin domain changed since the branch got its icon', () => {
			git(['checkout', '-q', '-b', 'bot']);
			write('explorer/icons/b.png', 'from the wrong site\n');
			write(
				'explorer/data/icon-manifest.json',
				`${JSON.stringify({ domains: { a: 'a.io', b: 'wrong.example' }, sources: { a: 'twenty-icons', b: 'twenty-icons' }, dark: [] })}\n`,
			);
			git(['add', '.']);
			git(['commit', '-q', '-m', 'bot branch']);
			git(['update-ref', `refs/remotes/origin/${BOT_BRANCH}`, 'HEAD']);
			git(['checkout', '-q', '--detach', 'main']);

			const asked = [];
			const out = icons({
				cwd,
				plan,
				hasKey: true,
				fetchIcons: fakeFetch,
				importIcon: (_dir, id, domain) => {
					asked.push([id, domain]);
					return false;
				},
			});
			assert.deepEqual(asked, [['b', 'b.io']]);
			assert.equal(
				readFileSync(join(cwd, 'explorer/icons/b.png'), 'utf-8'),
				'favicon\n',
			);
			assert.equal(out.icons[0].kept, false);
		});

		it('keeps what the bot branch has, with no Brand API lookup', () => {
			git(['checkout', '-q', '-b', 'bot']);
			write('explorer/icons/b.png', 'replaced by a person\n');
			write('scripts/plugin-icon-sources/b.svg', '<svg/>\n');
			write(
				'scripts/plugin-icon-sources/SOURCES.json',
				`${JSON.stringify({ b: { from: 'https://brand.example/b.svg' } })}\n`,
			);
			write(
				'explorer/data/icon-manifest.json',
				`${JSON.stringify({ domains: { a: 'a.io', b: 'b.io' }, sources: { a: 'twenty-icons', b: 'curated' }, dark: [] })}\n`,
			);
			git(['add', '.']);
			git(['commit', '-q', '-m', 'bot branch']);
			git(['update-ref', `refs/remotes/origin/${BOT_BRANCH}`, 'HEAD']);
			git(['checkout', '-q', '--detach', 'main']);

			const out = icons({
				cwd,
				plan,
				hasKey: true,
				fetchIcons: (dir, ids) => {
					// A PNG already on disk is what stops the real script downloading.
					assert.ok(existsSync(join(dir, 'explorer/icons/b.png')));
					fakeFetch(dir, ids);
				},
				importIcon: () => assert.fail('already have it'),
			});
			assert.equal(
				readFileSync(join(cwd, 'explorer/icons/b.png'), 'utf-8'),
				'replaced by a person\n',
			);
			assert.ok(existsSync(join(cwd, 'scripts/plugin-icon-sources/b.svg')));
			assert.deepEqual(
				JSON.parse(
					readFileSync(
						join(cwd, 'scripts/plugin-icon-sources/SOURCES.json'),
						'utf-8',
					),
				),
				{ b: { from: 'https://brand.example/b.svg' } },
			);
			assert.equal(out.icons[0].kept, true);
			assert.equal(out.icons[0].source, 'curated');
		});

		it('reads the copy a stopped run left when the bot branch is gone', () => {
			git(['checkout', '-q', '-b', 'bot']);
			write('explorer/icons/b.png', 'replaced by a person\n');
			write(
				'explorer/data/icon-manifest.json',
				`${JSON.stringify({ domains: { a: 'a.io', b: 'b.io' }, sources: { a: 'twenty-icons', b: 'curated' }, dark: [] })}\n`,
			);
			git(['add', '.']);
			git(['commit', '-q', '-m', 'the commit a stopped run saved']);
			git(['update-ref', `refs/remotes/origin/${BACKUP_BRANCH}`, 'HEAD']);
			git(['checkout', '-q', '--detach', 'main']);

			const out = icons({
				cwd,
				plan,
				hasKey: true,
				fetchIcons: fakeFetch,
				importIcon: () => assert.fail('already have it'),
			});
			assert.equal(
				readFileSync(join(cwd, 'explorer/icons/b.png'), 'utf-8'),
				'replaced by a person\n',
			);
			assert.equal(out.icons[0].kept, true);
		});
	});

	describe('publish', () => {
		const added = { changed: true, added: [plugin('b')] };

		it('does nothing when there is nothing to do', () => {
			assert.equal(run({}), 'none');
			assert.deepEqual(ghCalls(), ['pr list']);
		});

		it('pushes the branch and opens a PR', () => {
			writeCatalog([plugin('a'), plugin('b')]);
			assert.equal(run(added), 'opened');
			assert.equal(
				git(['log', '-1', '--format=%s', remoteHead()], remote),
				'chore(explorer): add B to the catalog',
			);
			assert.deepEqual(ghCalls(), ['pr list', 'pr create']);
		});

		it('leaves an open PR alone when only generatedAt moved', () => {
			writeCatalog([plugin('a'), plugin('b')]);
			run(added);
			const pushed = remoteHead();
			fetchBranch();
			resetToMain();
			setPrs([{ number: 7 }]);
			writeCatalog([plugin('a'), plugin('b')], '2026-05-05');
			assert.equal(run(added), 'unchanged');
			assert.equal(remoteHead(), pushed);
			// Its text still follows this run, in case an earlier one was cancelled.
			assert.ok(ghCalls().includes('pr edit 7'));
		});

		it('leaves an open PR alone when a release moved corsairVersion', () => {
			writeCatalog([plugin('a'), plugin('b')]);
			run(added);
			const pushed = remoteHead();
			fetchBranch();
			resetToMain();
			setPrs([{ number: 7 }]);
			writeCatalog([plugin('a'), plugin('b')], '2026-05-05', '0.1.1');
			assert.equal(run(added), 'unchanged');
			assert.equal(remoteHead(), pushed);
		});

		it('force-pushes and updates the PR when the content changed', () => {
			writeCatalog([plugin('a'), plugin('b')]);
			run(added);
			const pushed = remoteHead();
			fetchBranch();
			resetToMain();
			setPrs([{ number: 7 }]);
			writeCatalog([plugin('a'), plugin('b'), plugin('c')]);
			assert.equal(run(added), 'updated');
			assert.notEqual(remoteHead(), pushed);
			assert.ok(ghCalls().includes('pr edit 7'));
		});

		it('does not reopen content someone closed without merging', () => {
			writeCatalog([plugin('a'), plugin('b')]);
			run(added);
			fetchBranch();
			resetToMain();
			setPrs([], [{ number: 7, mergedAt: null, headRefOid: remoteHead() }]);
			writeCatalog([plugin('a'), plugin('b')]);
			assert.equal(run(added), 'declined');
			assert.equal(ghCalls().filter((c) => c === 'pr create').length, 1);
		});

		it('opens a PR when the closed one was for older content', () => {
			writeCatalog([plugin('a'), plugin('b')]);
			run(added);
			fetchBranch();
			resetToMain();
			setPrs([], [{ number: 7, mergedAt: null, headRefOid: 'older' }]);
			writeCatalog([plugin('a'), plugin('b')]);
			assert.equal(run(added), 'opened');
			assert.equal(ghCalls().filter((c) => c === 'pr create').length, 2);
		});

		it('sees a change to a plugin field called generatedAt', () => {
			write('explorer/data/plugins/a.json', '{\n  "x": 1\n}\n');
			run(added);
			fetchBranch();
			resetToMain();
			setPrs([{ number: 7 }]);
			write(
				'explorer/data/plugins/a.json',
				'{\n  "key": "generatedAt",\n  "x": 1\n}\n',
			);
			const pushed = remoteHead();
			assert.equal(run(added), 'updated');
			assert.notEqual(remoteHead(), pushed);
		});

		it('closes the PR when main no longer needs it', () => {
			setPrs([{ number: 7 }]);
			assert.equal(run({}), 'closed');
			assert.ok(ghCalls().includes('pr close 7'));
		});

		it('replaces the branch when GitHub refuses the force-push over workflows', () => {
			writeCatalog([plugin('a'), plugin('b')]);
			run(added);
			fetchBranch();
			resetToMain();
			setPrs([{ number: 7 }]);
			refuseForcePushes();
			writeCatalog([plugin('a'), plugin('b'), plugin('c')]);
			assert.equal(run(added), 'opened');
			assert.equal(ghCalls().filter((c) => c === 'pr create').length, 2);
			assert.equal(remoteHead(), git(['rev-parse', 'HEAD']));
			assert.deepEqual(remoteBranches(), [BOT_BRANCH, 'main']);
		});

		it('leaves a copy when replacing the branch stops after the delete', () => {
			writeCatalog([plugin('a'), plugin('b')]);
			run(added);
			fetchBranch();
			resetToMain();
			setPrs([{ number: 7 }]);
			// The delete goes through, and the push that should follow it fails.
			refuseForcePushes(
				`case "$1 $2" in "refs/heads/${BOT_BRANCH} 0000000"*) exit 1;; esac`,
			);
			writeCatalog([plugin('a'), plugin('b'), plugin('c')]);
			assert.throws(() => run(added));
			assert.deepEqual(remoteBranches(), [BACKUP_BRANCH, 'main']);
			assert.equal(
				git(['rev-parse', `refs/heads/${BACKUP_BRANCH}`], remote),
				git(['rev-parse', 'HEAD']),
			);
		});

		it('opens the PR again from that copy, then removes it', () => {
			writeCatalog([plugin('a'), plugin('b')]);
			git(['add', '.']);
			git(['commit', '-q', '-m', 'the commit a stopped run saved']);
			git(['push', '-q', 'origin', `HEAD:refs/heads/${BACKUP_BRANCH}`]);
			git([
				'fetch',
				'-q',
				'origin',
				`+refs/heads/${BACKUP_BRANCH}:refs/remotes/origin/${BACKUP_BRANCH}`,
			]);
			resetToMain();
			writeCatalog([plugin('a'), plugin('b')]);
			assert.equal(run(added), 'opened');
			assert.deepEqual(remoteBranches(), [BOT_BRANCH, 'main']);
		});

		it('does not delete a commit pushed between the refusal and the delete', () => {
			writeCatalog([plugin('a'), plugin('b')]);
			run(added);
			fetchBranch();
			const person = join(root, 'person');
			execFileSync('git', ['clone', '-q', '-b', BOT_BRANCH, remote, person], {
				stdio: 'ignore',
			});
			writeFileSync(join(person, 'explorer/icons/b.png'), 'by hand\n');
			git(['add', '.'], person);
			git(
				[
					'-c',
					'user.name=P',
					'-c',
					'user.email=p@x',
					'commit',
					'-q',
					'-m',
					'icon',
				],
				person,
			);
			git(['push', '-q', 'origin', 'HEAD:refs/heads/person'], person);
			const theirs = git(['rev-parse', 'refs/heads/person'], remote);
			resetToMain();
			setPrs([{ number: 7 }]);
			const hook = join(remote, 'hooks/update');
			writeFileSync(
				hook,
				`#!/bin/sh
case "$2" in 0000000*) exit 0;; esac
case "$3" in 0000000*) exit 0;; esac
git update-ref refs/heads/${BOT_BRANCH} refs/heads/person
echo "refusing to allow a GitHub App to create or update workflow without workflows permission" >&2
exit 1
`,
			);
			chmodSync(hook, 0o755);
			writeCatalog([plugin('a'), plugin('b'), plugin('c')]);
			assert.throws(() => run(added));
			assert.equal(remoteHead(), theirs);
		});

		it('does not delete the branch when someone pushed to it first', () => {
			writeCatalog([plugin('a'), plugin('b')]);
			run(added);
			const staleSeen = remoteHead();
			fetchBranch();
			// A person pushes after this run fetched the branch.
			const person = join(root, 'person');
			execFileSync('git', ['clone', '-q', '-b', BOT_BRANCH, remote, person], {
				stdio: 'ignore',
			});
			writeFileSync(join(person, 'explorer/icons/b.png'), 'by hand\n');
			git(['add', '.'], person);
			git(
				[
					'-c',
					'user.name=P',
					'-c',
					'user.email=p@x',
					'commit',
					'-q',
					'-m',
					'icon',
				],
				person,
			);
			git(['push', '-q', 'origin', BOT_BRANCH], person);
			const theirs = remoteHead();
			assert.notEqual(theirs, staleSeen);

			resetToMain();
			setPrs([{ number: 7 }]);
			writeCatalog([plugin('a'), plugin('b'), plugin('c')]);
			assert.throws(() => run(added), /pushing bot\/catalog failed/);
			assert.equal(remoteHead(), theirs);
		});
	});
});
