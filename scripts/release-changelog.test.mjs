import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import {
	existsSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import {
	backfillEntries,
	ENTRIES_PATH,
	entriesFromPlan,
	escapeMdx,
	PAGE_PATH,
	parseCommit,
	renderPage,
	writeChangelog,
} from './release-changelog.mjs';

const SCRIPT = fileURLToPath(
	new URL('./release-changelog.mjs', import.meta.url),
);

describe('parseCommit', () => {
	it('reads a squash merge', () => {
		assert.deepEqual(
			parseCommit('fix(gmail): keep stored messages when listing (#1993)'),
			{
				type: 'fix',
				breaking: false,
				pr: 1993,
				title: 'Keep stored messages when listing',
			},
		);
	});
	it('reads the PR title from a merge commit body', () => {
		assert.deepEqual(
			parseCommit(
				'Merge pull request #2080 from someone/feat/esignatures',
				'\nfeat(esignatures): add eSignatures plugin\n',
			),
			{
				type: 'feat',
				breaking: false,
				pr: 2080,
				title: 'Add eSignatures plugin',
			},
		);
	});
	it('marks a breaking change', () => {
		assert.equal(parseCommit('feat(core)!: drop node 18 (#5)').breaking, true);
	});
	it('keeps a merged PR whose title has no type', () => {
		assert.equal(parseCommit('Code Interpreter (#1704)').type, 'other');
	});
	it('hides what says nothing to someone using the packages', () => {
		for (const subject of [
			'chore(plugins): tidy (#1)',
			'ci: faster (#2)',
			'docs(gmail): reword (#3)',
			'test(slack): more cases (#4)',
			'refactor(core): move files (#5)',
		]) {
			assert.equal(parseCommit(subject), null, subject);
		}
	});
	it('hides a commit that came from no PR', () => {
		assert.equal(parseCommit('fix: update landing page'), null);
		assert.equal(parseCommit("Merge branch 'main' of github.com:x/y"), null);
		assert.equal(parseCommit('Merge pull request #9 from x/y', ''), null);
	});
});

describe('escapeMdx', () => {
	it('escapes what MDX would parse', () => {
		assert.equal(
			escapeMdx('Fix <img src=x> and {process.env}'),
			'Fix \\<img src=x\\> and \\{process.env\\}',
		);
		assert.equal(
			escapeMdx('[click](http://x) *y* a_b'),
			'\\[click\\](http://x) \\*y\\* a\\_b',
		);
	});
	it('leaves code spans alone', () => {
		assert.equal(escapeMdx('Keep `a<b>{c}` working'), 'Keep `a<b>{c}` working');
	});
	it('escapes a backtick with no partner', () => {
		assert.equal(escapeMdx('Stray ` and <b>'), 'Stray \\` and \\<b\\>');
	});
	it('keeps a double-backtick span that holds a backtick', () => {
		assert.equal(
			escapeMdx('Run ``a ` <b>`` then <c>'),
			'Run ``a ` <b>`` then \\<c\\>',
		);
	});
	it('escapes a run of backticks that never closes', () => {
		assert.equal(escapeMdx('``x` <y>'), '\\`\\`x\\` \\<y\\>');
		assert.equal(escapeMdx('`a` then `` <b>'), '`a` then \\`\\` \\<b\\>');
	});
	it('keeps a title on one line', () => {
		assert.equal(escapeMdx('one\ntwo\r\n three'), 'one two three');
	});
});

describe('renderPage', () => {
	const change = (pr, title = `Change ${pr}`) => ({
		type: 'fix',
		breaking: false,
		pr,
		title,
	});
	const entry = (over) => ({
		date: '2026-11-04',
		package: '@corsair-dev/gmail',
		dir: 'packages/gmail',
		name: 'Gmail',
		version: '0.1.9',
		isNew: false,
		changes: [],
		...over,
	});
	const render = (entries) => renderPage(entries, tmpdir());

	it('puts the newest week first, Monday to Sunday', () => {
		const page = render([
			entry({ date: '2026-10-26', changes: [change(1)] }),
			entry({ date: '2026-11-02', changes: [change(2)] }),
			entry({ date: '2026-11-08', changes: [change(3)] }),
		]);
		assert.ok(
			page.indexOf('Week of November 2, 2026') <
				page.indexOf('Week of October 26, 2026'),
		);
		assert.equal(page.match(/<Update /g).length, 2);
	});
	it('headlines the core version and lists the rest', () => {
		const page = render([
			entry({
				package: 'corsair',
				dir: 'packages/corsair',
				name: 'corsair',
				version: '0.1.158',
				changes: [change(2090, 'Render types as declared')],
			}),
			entry({
				package: '@corsair-dev/cli',
				dir: 'packages/cli',
				name: 'cli',
				version: '0.1.25',
				changes: [change(1824, 'Validate --port')],
			}),
			entry({
				package: '@corsair-dev/mastra',
				dir: 'adapters/mastra',
				name: 'mastra',
				version: '0.1.1',
			}),
		]);
		assert.ok(page.includes('description="corsair 0.1.158" tags={["SDK"]}'));
		assert.ok(page.includes('## SDK: corsair 0.1.158'));
		assert.ok(
			page.includes(
				'Also released: `@corsair-dev/cli` 0.1.25, `@corsair-dev/mastra` 0.1.1.',
			),
		);
		// Core's changes go unlabelled, another package's say which one.
		assert.ok(page.includes('\n- Render types as declared ([#2090]'));
		assert.ok(page.includes('- **cli:** Validate --port ([#1824]'));
	});
	it('shows a plugin version when the line is about one plugin', () => {
		const page = render([entry({ changes: [change(1993, 'Keep labels')] })]);
		assert.ok(page.includes('## 1 plugin updated'));
		assert.ok(page.includes('- **Gmail 0.1.9:** Keep labels ([#1993]'));
		assert.ok(
			page.includes('(https://github.com/corsairdev/corsair/pull/1993)'),
		);
	});
	it('writes one line for a PR across many plugins', () => {
		const names = ['Gmail', 'Slack', 'Notion', 'Linear', 'Jira'];
		const page = render(
			names.map((name) =>
				entry({
					package: `@corsair-dev/${name}`,
					dir: `packages/${name}`,
					name,
					changes: [change(7, 'Same fix')],
				}),
			),
		);
		assert.equal(page.match(/Same fix/g).length, 1);
		assert.ok(page.includes('## 5 plugins updated'));
		assert.ok(page.includes('and 2 more:** Same fix'));
	});
	it('lists new plugins by name', () => {
		const page = render([
			entry({
				isNew: true,
				version: '0.1.0',
				name: 'fal',
				dir: 'packages/fal',
			}),
		]);
		assert.ok(page.includes('## 1 new plugin\n\nfal'));
		assert.ok(page.includes('tags={["Plugins"]}'));
		assert.ok(!page.includes('description='));
	});
	it('says which SDK version Cloud moved to', () => {
		const page = render([
			{ date: '2026-11-04', package: 'cloud', version: '0.1.158', changes: [] },
		]);
		assert.ok(page.includes('## Corsair Cloud\n\nNow runs corsair 0.1.158.'));
		assert.ok(page.includes('tags={["Cloud"]}'));
	});
	it('marks a breaking change', () => {
		const page = render([
			entry({ changes: [{ ...change(5, 'Drop x'), breaking: true }] }),
		]);
		assert.ok(page.includes('**Breaking:** Drop x'));
	});
	it('escapes titles and names', () => {
		const page = render([
			entry({ name: 'A<b>', changes: [change(5, 'Use {x} and <y>')] }),
		]);
		assert.ok(page.includes('Use \\{x\\} and \\<y\\>'));
		assert.ok(page.includes('A\\<b\\>'));
	});
});

describe('on a git repo', () => {
	let cwd;
	const git = (args) =>
		execFileSync('git', args, {
			cwd,
			encoding: 'utf-8',
			stdio: ['ignore', 'pipe', 'pipe'],
		}).trim();
	const write = (path, text) => {
		const full = join(cwd, path);
		mkdirSync(dirname(full), { recursive: true });
		writeFileSync(full, text);
	};
	const pkg = (dir, name, version, extra = {}) =>
		write(
			`${dir}/package.json`,
			`${JSON.stringify({ name, version, ...extra }, null, 2)}\n`,
		);
	const commit = (message, date) => {
		git(['add', '.']);
		execFileSync('git', ['commit', '-q', '-m', message], {
			cwd,
			env: {
				...process.env,
				...(date
					? {
							GIT_COMMITTER_DATE: `${date}T12:00:00Z`,
							GIT_AUTHOR_DATE: `${date}T12:00:00Z`,
						}
					: {}),
			},
		});
		return git(['rev-parse', 'HEAD']);
	};
	const plan = (over = {}) => ({ bumps: [], tags: [], waiting: [], ...over });
	const bump = (name, dir, from, to) => ({ name, dir, from, to, files: [] });

	beforeEach(() => {
		cwd = mkdtempSync(join(tmpdir(), 'changelog-'));
		git(['init', '-q', '-b', 'main']);
		git(['config', 'user.name', 'T']);
		git(['config', 'user.email', 't@x']);
	});
	afterEach(() => rmSync(cwd, { recursive: true, force: true }));

	describe('entriesFromPlan', () => {
		const released = () => {
			pkg('packages/gmail', '@corsair-dev/gmail', '0.1.8');
			write('packages/gmail/index.ts', '1\n');
			write('packages/gmail/plugin-docs.yaml', 'displayName: Gmail\n');
			const sha = commit('feat(gmail): add it (#1)');
			return { tag: '@corsair-dev/gmail@0.1.8', sha };
		};
		const run = (tag) =>
			entriesFromPlan({
				cwd,
				date: '2026-11-08',
				plan: plan({
					tags: [tag],
					bumps: [
						bump('@corsair-dev/gmail', 'packages/gmail', '0.1.8', '0.1.9'),
					],
				}),
			});

		it('lists the merged PRs since the last release', () => {
			const tag = released();
			write('packages/gmail/index.ts', '2\n');
			commit('fix(gmail): keep labels (#1993)');
			assert.deepEqual(run(tag), [
				{
					date: '2026-11-08',
					package: '@corsair-dev/gmail',
					dir: 'packages/gmail',
					name: 'Gmail',
					version: '0.1.9',
					isNew: false,
					changes: [
						{ type: 'fix', breaking: false, pr: 1993, title: 'Keep labels' },
					],
				},
			]);
		});
		it('reads an existing release tag', () => {
			const { sha } = released();
			git(['tag', '@corsair-dev/gmail@0.1.8', sha]);
			write('packages/gmail/index.ts', '2\n');
			commit('fix(gmail): keep labels (#1993)');
			const [entry] = entriesFromPlan({
				cwd,
				date: '2026-11-08',
				plan: plan({
					bumps: [
						bump('@corsair-dev/gmail', 'packages/gmail', '0.1.8', '0.1.9'),
					],
				}),
			});
			assert.equal(entry.changes.length, 1);
		});
		it('keeps a plugin off the page when nothing public changed', () => {
			const tag = released();
			write('packages/gmail/index.ts', '2\n');
			commit('chore(gmail): tidy (#5)');
			write('packages/gmail/README.md', 'docs\n');
			commit('fix(gmail): readme only (#6)');
			write('packages/gmail/index.ts', '3\n');
			commit('fix: a push with no PR');
			assert.deepEqual(run(tag), []);
		});
		it('ignores version moves and devDependencies', () => {
			const tag = released();
			pkg('packages/gmail', '@corsair-dev/gmail', '0.1.8', {
				devDependencies: { x: '1' },
			});
			commit('fix(gmail): bump a dev tool (#7)');
			assert.deepEqual(run(tag), []);
		});
		const constants = ({ providers = ['ably'], auth = ['oauth_2'] } = {}) =>
			[
				'export type AllErrors =',
				"\t| 'RATE_LIMIT_ERROR'",
				'\t| (string & {});',
				'',
				'export const BaseProviders = [',
				...providers.map((p) => `\t'${p}',`),
				'] as const;',
				'',
				'export const ProviderDisplayNames = {',
				...providers.map((p) => `\t${p}: '${p}',`),
				'} as const satisfies Record<(typeof BaseProviders)[number], string>;',
				'',
				'export type AllProviders =',
				...providers.map((p) => `\t| '${p}'`),
				'\t| (string & {});',
				'',
				'export type AuthTypes =',
				...auth.map((a) => `\t| '${a}'`),
				"\t| 'api_key';",
				'',
			].join('\n');
		const sdkChanges = (edit) => {
			pkg('packages/corsair', 'corsair', '0.1.157');
			write('packages/corsair/core/constants.ts', constants());
			write('packages/corsair/core/index.ts', 'a\n');
			const sha = commit('feat: core (#1)');
			edit();
			const [entry] = entriesFromPlan({
				cwd,
				date: '2026-11-08',
				plan: plan({
					tags: [{ tag: 'corsair@0.1.157', sha }],
					bumps: [bump('corsair', 'packages/corsair', '0.1.157', '0.1.158')],
				}),
			});
			return entry.changes.map((c) => c.pr);
		};
		it('does not call a plugin registration an SDK change', () => {
			assert.deepEqual(
				sdkChanges(() => {
					write(
						'packages/corsair/core/constants.ts',
						constants({ providers: ['ably', 'fal'] }),
					);
					commit('feat(fal): add fal plugin (#2100)');
					write('packages/corsair/core/index.ts', 'b\n');
					commit('fix(inspect): render types (#2090)');
				}),
				[2090],
			);
		});
		it('calls a change outside the provider lists an SDK change', () => {
			assert.deepEqual(
				sdkChanges(() => {
					write(
						'packages/corsair/core/constants.ts',
						constants({ auth: ['oauth_2', 'bot_token'] }),
					);
					commit('feat(core): add bot_token auth (#2200)');
				}),
				[2200],
			);
		});
		it('counts a registration that also changes an auth type', () => {
			assert.deepEqual(
				sdkChanges(() => {
					write(
						'packages/corsair/core/constants.ts',
						constants({
							providers: ['ably', 'fal'],
							auth: ['oauth_2', 'bot_token'],
						}),
					);
					commit('feat(fal): add fal plugin (#2100)');
				}),
				[2100],
			);
		});
		it('keeps an SDK version even with nothing to say', () => {
			pkg('adapters/mastra', '@corsair-dev/mastra', '0.1.0');
			const sha = commit('feat(mastra): adapter (#1)');
			const entries = entriesFromPlan({
				cwd,
				date: '2026-11-08',
				plan: plan({
					tags: [{ tag: '@corsair-dev/mastra@0.1.0', sha }],
					bumps: [
						bump('@corsair-dev/mastra', 'adapters/mastra', '0.1.0', '0.1.1'),
					],
				}),
			});
			assert.equal(entries.length, 1);
			assert.deepEqual(entries[0].changes, []);
		});
		it('announces a package npm has never seen as a new plugin', () => {
			pkg('packages/fal', '@corsair-dev/fal', '0.1.0');
			write('packages/fal/plugin-docs.yaml', 'displayName: "fal"\n');
			commit('feat(fal): add fal plugin (#2100)');
			const [entry] = entriesFromPlan({
				cwd,
				date: '2026-11-08',
				plan: plan({
					waiting: [{ name: '@corsair-dev/fal', version: '0.1.0' }],
				}),
			});
			assert.equal(entry.isNew, true);
			assert.equal(entry.name, 'fal');
		});
		it('lists what a version raised by hand changed', () => {
			const { sha } = released();
			git(['tag', '@corsair-dev/gmail@0.1.8', sha]);
			pkg('packages/gmail', '@corsair-dev/gmail', '0.2.0');
			write('packages/gmail/index.ts', '2\n');
			commit('feat(gmail): threads (#50)');
			const [entry] = entriesFromPlan({
				cwd,
				date: '2026-11-08',
				plan: plan({
					waiting: [{ name: '@corsair-dev/gmail', version: '0.2.0' }],
				}),
			});
			assert.equal(entry.isNew, false);
			assert.equal(entry.version, '0.2.0');
			assert.deepEqual(
				entry.changes.map((c) => c.pr),
				[50],
			);
		});
		describe('a version published before any run saw it waiting', () => {
			// The page is on main, so some commit wrote its entries last.
			const pageWritten = () => {
				write(ENTRIES_PATH, '[]\n');
				return commit('chore(release): update the changelog');
			};
			const tagged = (tags, existing = []) =>
				entriesFromPlan({
					cwd,
					date: '2026-11-10',
					plan: plan({ tags }),
					existing,
				});

			it('announces a new plugin from its tag', () => {
				pageWritten();
				pkg('packages/fal', '@corsair-dev/fal', '0.1.0');
				write('packages/fal/plugin-docs.yaml', 'displayName: "fal"\n');
				const sha = commit('feat(fal): add fal plugin (#2100)');
				const [entry] = tagged([{ tag: '@corsair-dev/fal@0.1.0', sha }]);
				assert.equal(entry.isNew, true);
				assert.equal(entry.version, '0.1.0');
				assert.equal(entry.name, 'fal');
			});
			it('lists what a version raised by hand changed, up to that version', () => {
				const { sha: first } = released();
				git(['tag', '@corsair-dev/gmail@0.1.8', first]);
				pageWritten();
				pkg('packages/gmail', '@corsair-dev/gmail', '0.2.0');
				write('packages/gmail/index.ts', '2\n');
				const sha = commit('feat(gmail): threads (#50)');
				write('packages/gmail/index.ts', '3\n');
				commit('fix(gmail): merged after 0.2.0 (#51)');
				const [entry] = tagged([{ tag: '@corsair-dev/gmail@0.2.0', sha }]);
				assert.equal(entry.version, '0.2.0');
				assert.deepEqual(
					entry.changes.map((c) => c.pr),
					[50],
				);
			});
			it('leaves out the tags the first run records for every package', () => {
				const { tag, sha } = released();
				pageWritten();
				assert.deepEqual(tagged([{ tag, sha }]), []);
			});
			it('leaves out a version that is already on the page', () => {
				pageWritten();
				pkg('packages/fal', '@corsair-dev/fal', '0.1.0');
				const sha = commit('feat(fal): add fal plugin (#2100)');
				const tags = [{ tag: '@corsair-dev/fal@0.1.0', sha }];
				const first = tagged(tags);
				assert.equal(first.length, 1);
				assert.deepEqual(tagged(tags, first), []);
			});
			it('does not call an old package new when its earlier tag is missing', () => {
				const { sha: first } = released();
				assert.ok(first);
				pageWritten();
				pkg('packages/gmail', '@corsair-dev/gmail', '0.1.9');
				const sha = commit('chore(release): publish 1 package(s)');
				assert.deepEqual(
					tagged([{ tag: '@corsair-dev/gmail@0.1.9', sha }]),
					[],
				);
			});
		});
		it('leaves a fix merged after a hand-raised version to the next release', () => {
			const { sha } = released();
			git(['tag', '@corsair-dev/gmail@0.1.8', sha]);
			pkg('packages/gmail', '@corsair-dev/gmail', '0.2.0');
			write('packages/gmail/index.ts', '2\n');
			commit('feat(gmail): threads (#50)');
			write('packages/gmail/index.ts', '3\n');
			commit('fix(gmail): merged while 0.2.0 published (#51)');
			const [entry] = entriesFromPlan({
				cwd,
				date: '2026-11-08',
				plan: plan({
					waiting: [{ name: '@corsair-dev/gmail', version: '0.2.0' }],
				}),
			});
			assert.deepEqual(
				entry.changes.map((c) => c.pr),
				[50],
			);
		});
		it('skips the frpc binary packages', () => {
			pkg('packages/frpc-linux-x64', '@corsair-dev/frpc-linux-x64', '0.1.0');
			commit('feat: binary (#1)');
			assert.deepEqual(
				entriesFromPlan({
					cwd,
					date: '2026-11-08',
					plan: plan({
						waiting: [
							{ name: '@corsair-dev/frpc-linux-x64', version: '0.1.0' },
						],
					}),
				}),
				[],
			);
		});
		it('records a version once, however many runs see it waiting', () => {
			pkg('packages/fal', '@corsair-dev/fal', '0.1.0');
			commit('feat(fal): add (#1)');
			const waiting = plan({
				waiting: [{ name: '@corsair-dev/fal', version: '0.1.0' }],
			});
			const first = entriesFromPlan({ cwd, date: '2026-11-08', plan: waiting });
			assert.equal(first.length, 1);
			assert.deepEqual(
				entriesFromPlan({
					cwd,
					date: '2026-11-09',
					plan: waiting,
					existing: first,
				}),
				[],
			);
		});
	});

	describe('backfillEntries', () => {
		it('stops at the current release, and starts at the date', () => {
			pkg('packages/old', '@corsair-dev/old', '0.1.0');
			write('packages/old/index.ts', '1\n');
			commit('feat(old): add (#1)', '2026-09-01');
			pkg('packages/gmail', '@corsair-dev/gmail', '0.1.8');
			write('packages/gmail/index.ts', '1\n');
			commit('feat(gmail): add (#2)', '2026-10-10');
			write('packages/gmail/index.ts', '2\n');
			const shipped = commit('fix(gmail): shipped (#3)', '2026-10-20');
			write('packages/gmail/index.ts', '3\n');
			commit('fix(gmail): not on npm yet (#4)', '2026-11-01');

			const entries = backfillEntries({
				cwd,
				since: '2026-10-05',
				plan: plan({
					tags: [
						{ tag: '@corsair-dev/gmail@0.1.8', sha: shipped },
						{
							tag: '@corsair-dev/old@0.1.0',
							sha: git(['rev-parse', 'HEAD~3']),
						},
					],
				}),
			});
			assert.deepEqual(
				entries.map((e) => [
					e.package,
					e.date,
					e.isNew,
					e.version,
					e.changes.map((c) => c.pr),
				]),
				[
					['@corsair-dev/gmail', '2026-10-10', true, null, []],
					['@corsair-dev/gmail', '2026-10-20', false, null, [3]],
				],
			);
		});
		it('adds only what is new when it runs again', () => {
			pkg('packages/gmail', '@corsair-dev/gmail', '0.1.8');
			write('packages/gmail/index.ts', '1\n');
			commit('feat(gmail): add (#2)', '2026-10-10');
			write('packages/gmail/index.ts', '2\n');
			const first = commit('fix(gmail): shipped (#3)', '2026-10-20');
			const backfill = (sha, existing) =>
				backfillEntries({
					cwd,
					since: '2026-10-05',
					existing,
					plan: plan({ tags: [{ tag: '@corsair-dev/gmail@0.1.8', sha }] }),
				});
			const existing = backfill(first, []);
			assert.equal(existing.length, 2);
			assert.deepEqual(backfill(first, existing), []);

			write('packages/gmail/index.ts', '3\n');
			const second = commit('fix(gmail): shipped later (#4)', '2026-10-25');
			assert.deepEqual(
				backfill(second, existing).map((e) => e.changes.map((c) => c.pr)),
				[[4]],
			);
		});
		it('leaves out a pull request a release already listed', () => {
			pkg('packages/gmail', '@corsair-dev/gmail', '0.1.9');
			write('packages/gmail/index.ts', '1\n');
			commit('feat(gmail): add (#2)', '2026-09-01');
			write('packages/gmail/index.ts', '2\n');
			const sha = commit('fix(gmail): keep labels (#1993)', '2026-10-20');
			const released = {
				package: '@corsair-dev/gmail',
				version: '0.1.9',
				isNew: false,
				changes: [{ pr: 1993 }],
			};
			assert.deepEqual(
				backfillEntries({
					cwd,
					since: '2026-10-05',
					existing: [released],
					plan: plan({ tags: [{ tag: '@corsair-dev/gmail@0.1.9', sha }] }),
				}),
				[],
			);
		});
	});

	describe('writeChangelog', () => {
		const added = [
			{
				date: '2026-11-04',
				package: '@corsair-dev/gmail',
				dir: 'packages/gmail',
				name: 'Gmail',
				version: '0.1.9',
				isNew: false,
				changes: [{ type: 'fix', breaking: false, pr: 1, title: 'A fix' }],
			},
		];
		beforeEach(() => {
			mkdirSync(join(cwd, 'docs'));
			mkdirSync(join(cwd, 'scripts'));
		});
		it('writes both files, then nothing when there is nothing new', () => {
			assert.equal(writeChangelog({ cwd, existing: [], added }), true);
			assert.deepEqual(
				JSON.parse(readFileSync(join(cwd, ENTRIES_PATH), 'utf-8')),
				added,
			);
			assert.ok(readFileSync(join(cwd, PAGE_PATH), 'utf-8').includes('A fix'));
			assert.equal(writeChangelog({ cwd, existing: added, added: [] }), false);
		});
	});

	describe('the command', () => {
		const run = (...args) =>
			spawnSync(process.execPath, [SCRIPT, ...args], {
				cwd,
				encoding: 'utf-8',
			});
		beforeEach(() => {
			mkdirSync(join(cwd, 'docs'));
			mkdirSync(join(cwd, 'scripts'));
			writeFileSync(join(cwd, 'plan.json'), JSON.stringify(plan()));
		});
		it('records which version Cloud moved to, once', () => {
			assert.equal(
				run('--plan', 'plan.json', '--cloud-version', '0.1.158').status,
				0,
			);
			run('--plan', 'plan.json', '--cloud-version', '0.1.158');
			const entries = JSON.parse(
				readFileSync(join(cwd, ENTRIES_PATH), 'utf-8'),
			);
			assert.equal(entries.length, 1);
			assert.equal(entries[0].package, 'cloud');
		});
		it('leaves out a Cloud version that is not one, and nothing else', () => {
			const result = run('--plan', 'plan.json', '--cloud-version', '1.0" <x>');
			assert.equal(result.status, 0);
			assert.match(result.stderr, /no Cloud line added/);
			assert.equal(existsSync(join(cwd, ENTRIES_PATH)), false);
			assert.doesNotMatch(readFileSync(join(cwd, PAGE_PATH), 'utf-8'), /<x>/);
		});
	});
});
