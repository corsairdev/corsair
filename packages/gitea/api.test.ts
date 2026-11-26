import { execFileSync } from 'node:child_process';
import {
	mkdtempSync,
	readdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { processWebhook } from 'corsair';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { giteaOperations } from './endpoints/manifest';
import { gitea } from './index';

/**
 * Live run against a throwaway Gitea (the swagger this plugin is generated
 * from came from the same image):
 *
 *   docker run -d --name gitea -p 3300:3000 -e GITEA__security__INSTALL_LOCK=true \
 *     -e GITEA__database__DB_TYPE=sqlite3 -e GITEA__actions__ENABLED=true \
 *     -e GITEA__migrations__ALLOW_LOCALNETWORKS=true gitea/gitea:latest
 *   docker exec -u git gitea gitea admin user create --admin --username corsair-admin \
 *     --password <pw> --email admin@example.com --must-change-password=false
 *   docker exec -u git gitea gitea admin user generate-access-token \
 *     --username corsair-admin --scopes all --raw
 *
 *   GITEA_URL=http://localhost:3300 GITEA_TOKEN=... GITEA_ADMIN_PASSWORD=... \
 *     npx jest api.test.ts
 *
 * Skipped unless GITEA_URL, GITEA_TOKEN and GITEA_ADMIN_PASSWORD are set (CI
 * never runs files named api.test.ts). The token must belong to a site admin:
 * the run covers admin.* too, creates a second user to review, accept a
 * transfer and get notified, and deletes everything it made at the end. Only
 * point it at an instance you can throw away. GITEA_LIVE_REPORT=<file> writes
 * every operation's result there.
 *
 * With GITEA_HOOK_URL (a listener Gitea can reach) and GITEA_HOOK_DIR (where
 * that listener writes each delivery as { headers, body } JSON), the run also
 * registers a signed webhook, triggers pushes, issues, comments, a pull
 * request, a review, a release and a wiki edit, and feeds every delivery
 * Gitea sent through processWebhook.
 */
const instanceUrl = process.env.GITEA_URL;
const token = process.env.GITEA_TOKEN;
const adminPassword = process.env.GITEA_ADMIN_PASSWORD;
const ready = Boolean(instanceUrl && token && adminPassword);
const describeIfLive = ready ? describe : describe.skip;
if (!ready) {
	console.warn(
		'Skipping Gitea live run: set GITEA_URL, GITEA_TOKEN and GITEA_ADMIN_PASSWORD (a throwaway instance).',
	);
}

const STAMP = Date.now().toString(36);
const ADMIN = 'corsair-admin';
const OTHER = `grace-${STAMP}`;
const OTHER_PASSWORD = `pw-${STAMP}-Correct-Horse-9`;
const REPO = `live-${STAMP}`;
const ORG = `acme-${STAMP}`;
const PNG =
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
const b64 = (text: string) => Buffer.from(text).toString('base64');

type Result = { ok: boolean; expected?: string; error?: string };
// `any` because the live run walks responses of 530 operations by field name.
type Json = any;

async function client(key: string) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'gitea', 'default');
	const corsair = createCorsair({
		plugins: [gitea({ key, instanceUrl })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

describeIfLive('gitea live', () => {
	jest.setTimeout(600_000);
	const results: Record<string, Result> = {};
	const clients: Array<Awaited<ReturnType<typeof client>>> = [];
	const work = mkdtempSync(join(tmpdir(), 'gitea-live-'));

	function fn(api: Json, id: string): (input: object) => Promise<Json> {
		let node = api;
		for (const part of id.split('.')) node = node?.[part];
		if (typeof node !== 'function') throw new Error(`no operation ${id}`);
		return node;
	}

	let admin: Json;
	let other: Json;

	/** Runs one operation and records the result; throws only when `need` is set. */
	async function run(
		id: string,
		input: object = {},
		options: {
			as?: Json;
			expect?: RegExp;
			allow?: RegExp;
			need?: boolean;
		} = {},
	): Promise<Json> {
		// A failure sticks: a later success of the same operation doesn't hide it.
		const record = (result: Result) => {
			if (results[id] && !results[id].ok) return;
			if (results[id]?.ok && !results[id].expected && result.ok) return;
			results[id] = result;
		};
		try {
			const out = await fn(options.as ?? admin, id)(input);
			record(
				options.expect
					? {
							ok: false,
							error: `expected an error ${options.expect} but it succeeded`,
						}
					: { ok: true },
			);
			return out;
		} catch (error) {
			const message = (error as Error).message;
			// `allow`: either outcome is fine (a run that already finished, say).
			if (options.allow?.test(message)) {
				record({ ok: true, expected: message });
				return undefined;
			}
			if (options.expect?.test(message)) {
				record({ ok: true, expected: message });
				return undefined;
			}
			record({ ok: false, error: message });
			if (options.need) throw error;
			return undefined;
		}
	}

	async function http(
		method: string,
		path: string,
		body?: object | Buffer,
		auth = `token ${token}`,
	) {
		const response = await fetch(`${instanceUrl}${path}`, {
			method,
			headers: {
				Authorization: auth,
				...(body && !Buffer.isBuffer(body)
					? { 'Content-Type': 'application/json' }
					: {}),
			},
			body: body
				? Buffer.isBuffer(body)
					? body
					: JSON.stringify(body)
				: undefined,
		});
		if (!response.ok) {
			throw new Error(`${method} ${path}: ${response.status}`);
		}
		const text = await response.text();
		return text ? JSON.parse(text) : undefined;
	}

	function sshKey(name: string): string {
		const file = join(work, name);
		execFileSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-f', file]);
		return readFileSync(`${file}.pub`, 'utf8').trim();
	}

	beforeAll(async () => {
		const first = await client(token as string);
		clients.push(first);
		admin = first.corsair.gitea.api;
	});

	afterAll(async () => {
		for (const id of [`${ADMIN}/${REPO}`]) {
			await http('DELETE', `/api/v1/repos/${id}`).catch(() => undefined);
		}
		for (const c of clients) await c.testDb.cleanup?.();
		rmSync(work, { recursive: true, force: true });
		const ids = giteaOperations.map((o) => o.id);
		const failed = Object.entries(results)
			.filter(([, r]) => !r.ok)
			.map(([id, r]) => `${id}: ${r.error}`);
		const missing = ids.filter((id) => !(id in results));
		const report = {
			total: ids.length,
			ok: Object.values(results).filter((r) => r.ok && !r.expected).length,
			expectedErrors: Object.fromEntries(
				Object.entries(results)
					.filter(([, r]) => r.expected)
					.map(([id, r]) => [id, r.expected]),
			),
			failed,
			notRun: missing,
		};
		if (process.env.GITEA_LIVE_REPORT) {
			writeFileSync(
				process.env.GITEA_LIVE_REPORT,
				JSON.stringify({ report, results }, null, 2),
			);
		}
		console.log(
			`Gitea live: ${report.ok} ok, ${Object.keys(report.expectedErrors).length} expected errors, ${failed.length} failed, ${missing.length} not run of ${ids.length}`,
		);
	});

	it('reads the instance', async () => {
		const me = await run('user.me', {}, { need: true });
		expect(me.login).toBe(ADMIN);
		expect((await run('misc.version')).version).toBeTruthy();
		for (const id of [
			'settings.api',
			'settings.attachment',
			'settings.repository',
			'settings.ui',
			'misc.gitignoreTemplates.list',
			'misc.labelTemplates.list',
			'misc.licenseTemplates.list',
			'user.token.get',
			'user.emails.list',
			'user.followers.list',
			'user.following.list',
			'user.gpgKeys.list',
			'user.keys.list',
			'user.orgs.list',
			'user.teams.list',
			'user.starred.list',
			'user.subscriptions.list',
			'user.stopwatches.list',
			'user.trackedTimes.list',
			'user.settings.get',
			'user.blocks.list',
			'user.hooks.list',
			'user.oauth2Apps.list',
			'user.projects.list',
			'user.actions.variables.list',
			'user.actions.runners.list',
			'user.actions.runs.list',
			'user.actions.jobs.list',
			'repos.list',
			'repos.search',
			'users.search',
			'orgs.list',
			'issues.search',
			'notifications.list',
			'notifications.countNew',
			'admin.users.list',
			'admin.orgs.list',
			'admin.emails.list',
			'admin.hooks.list',
			'admin.cron.list',
			'admin.packages.list',
			'admin.unadopted.list',
			'admin.actions.runners.list',
			'admin.actions.runs.list',
			'admin.actions.jobs.list',
		]) {
			await run(id);
		}
		await run('misc.gitignoreTemplates.get', { name: 'Go' });
		await run('misc.labelTemplates.get', { name: 'Default' });
		await run('misc.licenseTemplates.get', { name: 'MIT' });
		await run('misc.topics.search', { q: 'go' });
		await run('admin.emails.search', { q: 'example' });
		await run('misc.markdown.render', { Text: '**bold**', Mode: 'gfm' });
		const raw = await run('misc.markdown.renderRaw', { text: '# hi' });
		expect(raw.text).toContain('<h1');
		await run('misc.markup.render', {
			Text: '# hi',
			Mode: 'file',
			FilePath: 'README.md',
		});
		// No signing key is configured on a fresh instance: Gitea answers 404.
		await run('misc.signingKey.gpg', {}, { expect: /404/ });
		await run('misc.signingKey.ssh', {}, { expect: /404/ });
		const page = await run('repos.list', { limit: 1 });
		expect(Array.isArray(page.items)).toBe(true);
	});

	it('sets up a second user, an org and a repository', async () => {
		await run(
			'admin.users.create',
			{
				username: OTHER,
				email: `${OTHER}@example.com`,
				password: OTHER_PASSWORD,
				must_change_password: false,
			},
			{ need: true },
		);
		const created = await http(
			'POST',
			`/api/v1/users/${OTHER}/tokens`,
			{ name: 'live', scopes: ['all'] },
			`Basic ${Buffer.from(`${OTHER}:${OTHER_PASSWORD}`).toString('base64')}`,
		);
		const second = await client(created.sha1);
		clients.push(second);
		other = second.corsair.gitea.api;
		expect((await run('user.me', {}, { as: other })).login).toBe(OTHER);

		await run(
			'orgs.create',
			{ username: ORG, full_name: 'Acme', visibility: 'public' },
			{ need: true },
		);
		const repo = await run(
			'repos.create',
			{
				name: REPO,
				auto_init: true,
				default_branch: 'main',
				description: 'Corsair live run',
				license: 'MIT',
				readme: 'Default',
				gitignores: 'Node',
			},
			{ need: true },
		);
		expect(repo.full_name).toBe(`${ADMIN}/${REPO}`);
		await run('repos.get', { owner: ADMIN, repo: REPO });
		await run('repos.getById', { id: repo.id });
		await run('repos.update', {
			owner: ADMIN,
			repo: REPO,
			description: 'Corsair live run (edited)',
			has_wiki: true,
			has_projects: true,
			has_actions: true,
		});
		await run('repos.collaborators.add', {
			owner: ADMIN,
			repo: REPO,
			collaborator: OTHER,
			permission: 'write',
		});
	});

	const R = () => ({ owner: ADMIN, repo: REPO });

	it('works with files, branches, commits and git objects', async () => {
		const file = await run('contents.create', {
			...R(),
			filepath: 'docs/guide.md',
			content: b64('# Guide\n'),
			message: 'Add the guide',
			branch: 'main',
		});
		expect(file.content.path).toBe('docs/guide.md');
		await run('contents.create', {
			...R(),
			filepath: '.editorconfig',
			content: b64('root = true\n[*]\nindent_style = tab\n'),
			message: 'Add editorconfig',
		});
		await run('contents.create', {
			...R(),
			filepath: '.gitea/workflows/ci.yml',
			content: b64(
				'name: ci\non:\n  workflow_dispatch:\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - run: echo hi\n',
			),
			message: 'Add a workflow',
		});
		await run('contents.list', R());
		const got = await run('contents.get', {
			...R(),
			filepath: 'docs/guide.md',
		});
		await run('contents.getExt', { ...R(), filepath: 'docs' });
		await run('contents.editorConfig', { ...R(), filepath: 'a.go' });
		await run('contents.getMany', {
			...R(),
			body: JSON.stringify({ files: ['docs/guide.md', 'README.md'] }),
		});
		await run('contents.getManyByPost', {
			...R(),
			files: ['docs/guide.md', 'README.md'],
		});
		const raw = await run('contents.raw', {
			...R(),
			filepath: 'docs/guide.md',
		});
		expect(raw.filename).toBe('guide.md');
		await run('contents.media', { ...R(), filepath: 'docs/guide.md' });
		await run('contents.update', {
			...R(),
			filepath: 'docs/guide.md',
			content: b64('# Guide\n\nMore.\n'),
			sha: got?.sha,
			message: 'Edit the guide',
		});
		await run('contents.changeFiles', {
			...R(),
			message: 'Two files at once',
			files: [
				{ operation: 'create', path: 'a.txt', content: b64('a\n') },
				{ operation: 'create', path: 'b.txt', content: b64('b\n') },
			],
		});
		await run('contents.applyPatch', {
			...R(),
			message: 'Apply a patch',
			content:
				'diff --git a/a.txt b/a.txt\n--- a/a.txt\n+++ b/a.txt\n@@ -1 +1 @@\n-a\n+a2\n',
		});
		const b = await run('contents.get', { ...R(), filepath: 'b.txt' });
		await run('contents.delete', {
			...R(),
			filepath: 'b.txt',
			sha: b?.sha,
			message: 'Remove b',
		});

		// Branches, with a slash kept in the name.
		await run('branches.create', {
			...R(),
			new_branch_name: 'feature/login',
			old_ref_name: 'main',
		});
		const branch = await run('branches.get', {
			...R(),
			branch: 'feature/login',
		});
		expect(branch.name).toBe('feature/login');
		await run('branches.list', R());
		await run('contents.create', {
			...R(),
			filepath: 'login.md',
			content: b64('login\n'),
			message: 'Login work',
			branch: 'feature/login',
		});
		await run('branches.create', {
			...R(),
			new_branch_name: 'scratch',
			old_ref_name: 'main',
		});
		await run('branches.rename', {
			...R(),
			branch: 'scratch',
			name: 'scratch-2',
		});
		const main = await run('branches.get', { ...R(), branch: 'main' });
		await run('branches.setCommit', {
			...R(),
			branch: 'scratch-2',
			new_commit_id: main?.commit?.id,
		});
		await run('branches.delete', { ...R(), branch: 'scratch-2' });

		// Commits and statuses.
		const commits = await run('commits.list', { ...R(), limit: 5 });
		const sha = commits.items[0].sha;
		await run('commits.get', { ...R(), sha });
		const diff = await run('commits.downloadDiff', {
			...R(),
			sha,
			diffType: 'diff',
		});
		expect(diff.text).toContain('diff --git');
		await run('commits.compare', { ...R(), basehead: 'main...feature/login' });
		await run('commits.statuses.create', {
			...R(),
			sha,
			state: 'success',
			context: 'ci/build',
			description: 'Built',
		});
		await run('commits.statuses.list', { ...R(), sha });
		await run('commits.statuses.listByRef', { ...R(), ref: 'main' });
		await run('commits.statuses.combined', { ...R(), ref: 'main' });

		// Git objects.
		await run('git.refs.list', R());
		await run('git.refs.listMatching', { ...R(), ref: 'heads' });
		await run('git.trees.get', { ...R(), sha, recursive: true });
		await run('git.blobs.get', { ...R(), sha: got?.sha });
		await run('git.notes.get', { ...R(), sha }, { expect: /404/ });

		// Tags and protections.
		await run('tags.create', {
			...R(),
			tag_name: 'v0.1.0',
			target: 'main',
			message: 'First tag',
		});
		const tag = await run('tags.get', { ...R(), tag: 'v0.1.0' });
		await run('tags.list', R());
		await run('git.tags.get', { ...R(), sha: tag?.id });
		await run('tags.create', { ...R(), tag_name: 'tmp/tag', target: 'main' });
		await run('tags.delete', { ...R(), tag: 'tmp/tag' });
		const tp = await run('tagProtections.create', {
			...R(),
			name_pattern: 'v*',
			whitelist_usernames: [ADMIN],
		});
		await run('tagProtections.list', R());
		await run('tagProtections.get', { ...R(), id: tp?.id });
		await run('tagProtections.update', {
			...R(),
			id: tp?.id,
			name_pattern: 'v*.*',
		});
		await run('tagProtections.delete', { ...R(), id: tp?.id });
		const bp = await run('branchProtections.create', {
			...R(),
			rule_name: 'main',
			required_approvals: 1,
		});
		const bp2 = await run('branchProtections.create', {
			...R(),
			rule_name: 'release/*',
		});
		await run('branchProtections.list', R());
		await run('branchProtections.get', { ...R(), name: 'release/*' });
		await run('branchProtections.update', {
			...R(),
			name: 'release/*',
			enable_push: false,
		});
		await run('branchProtections.setPriority', {
			...R(),
			ids: [bp2?.id, bp?.id].filter(Boolean),
		});
		await run('branchProtections.delete', { ...R(), name: 'release/*' });
		await run('branchProtections.delete', { ...R(), name: 'main' });

		const archive = await run('repos.downloadArchive', {
			...R(),
			archive: 'main.zip',
		});
		expect(archive.byteLength).toBeGreaterThan(0);
	});

	it('runs the rest of the repository reads', async () => {
		for (const id of [
			'repos.activityFeeds.list',
			'repos.assignees.list',
			'repos.collaborators.list',
			'repos.forks.list',
			'repos.gitHooks.list',
			'repos.deployKeys.list',
			'repos.languages',
			'repos.licenses',
			'repos.newPinAllowed',
			'repos.pushMirrors.list',
			'repos.reviewers',
			'repos.stargazers',
			'repos.subscribers',
			'repos.subscription.get',
			'repos.topics.list',
			'repos.trackedTimes',
			'issues.listPinned',
			'issues.config.get',
			'issues.config.validate',
			'issues.templates.list',
			'comments.listForRepo',
			'labels.list',
			'milestones.list',
			'projects.list',
			'pulls.list',
			'pulls.listPinned',
			'releases.list',
			'webhooks.list',
			'notifications.listForRepo',
			'actions.artifacts.list',
			'actions.jobs.list',
			'actions.runners.list',
			'actions.runs.list',
			'actions.secrets.list',
			'actions.tasks.list',
			'actions.variables.list',
			'actions.workflows.list',
		]) {
			await run(id, R());
		}
		await run('repos.assignees.check', { ...R(), assignee: OTHER });
		await run('repos.collaborators.check', { ...R(), collaborator: OTHER });
		await run('repos.collaborators.permission', {
			...R(),
			collaborator: OTHER,
		});
		await run('repos.signingKey.gpg', R(), { expect: /404/ });
		await run('repos.signingKey.ssh', R(), { expect: /404/ });
		await run('repos.subscription.watch', R());
		await run('repos.subscription.unwatch', R());
		await run('user.starred.star', R());
		await run('user.starred.check', R());
		await run('user.starred.unstar', R());
		await run('repos.topics.add', { ...R(), topic: 'corsair' });
		await run('repos.topics.replace', { ...R(), topics: ['corsair', 'live'] });
		await run('repos.topics.remove', { ...R(), topic: 'live' });
		await run('repos.avatar.update', { ...R(), image: PNG });
		await run('repos.avatar.delete', R());
		// Server-side git hooks (needs DISABLE_GIT_HOOKS=false on the instance).
		await run('repos.gitHooks.list', R());
		await run('repos.gitHooks.get', { ...R(), id: 'pre-receive' });
		await run('repos.gitHooks.update', {
			...R(),
			id: 'pre-receive',
			content: '#!/bin/sh\nexit 0\n',
		});
		await run('repos.gitHooks.delete', { ...R(), id: 'pre-receive' });
		await run('repos.deployKeys.createToken', {
			...R(),
			title: 'ci',
			read_only: true,
		});
		const deployKey = await run('repos.deployKeys.create', {
			...R(),
			title: 'deploy',
			key: sshKey('deploy'),
			read_only: true,
		});
		await run('repos.deployKeys.get', { ...R(), id: deployKey?.id });
		await run('repos.deployKeys.delete', { ...R(), id: deployKey?.id });
	});

	it('works with issues, comments, labels, milestones and time', async () => {
		const label = await run('labels.create', {
			...R(),
			name: 'bug',
			color: '#e11d21',
		});
		await run('labels.get', { ...R(), id: label?.id });
		await run('labels.update', {
			...R(),
			id: label?.id,
			description: 'Broken',
		});
		const label2 = await run('labels.create', {
			...R(),
			name: 'docs',
			color: '#00aa00',
		});
		const ms = await run('milestones.create', { ...R(), title: 'v1' });
		await run('milestones.get', { ...R(), id: ms?.id });
		await run('milestones.update', {
			...R(),
			id: ms?.id,
			description: 'First',
		});
		const issue = await run('issues.create', {
			...R(),
			title: 'Login fails',
			body: 'Steps',
			labels: [label?.id],
			milestone: ms?.id,
		});
		const index = issue?.number;
		const other2 = await run('issues.create', {
			...R(),
			title: 'Blocked work',
		});
		await run('issues.get', { ...R(), index });
		await run('issues.list', { ...R(), state: 'open', type: 'issues' });
		await run('issues.update', {
			...R(),
			index,
			title: 'Login fails on Safari',
		});
		await run('issues.labels.list', { ...R(), index });
		await run('issues.labels.add', { ...R(), index, labels: [label2?.id] });
		await run('issues.labels.remove', { ...R(), index, id: label2?.id });
		await run('issues.labels.replace', { ...R(), index, labels: [label?.id] });
		await run('issues.labels.clear', { ...R(), index });
		await run('issues.assignees.add', { ...R(), index, assignees: [OTHER] });
		await run('issues.assignees.check', { ...R(), index, assignee: OTHER });
		await run('issues.assignees.remove', { ...R(), index, assignees: [OTHER] });
		await run('issues.setDeadline', {
			...R(),
			index,
			due_date: '2027-01-31T00:00:00Z',
		});
		await run('issues.reactions.add', { ...R(), index, content: '+1' });
		await run('issues.reactions.list', { ...R(), index });
		await run('issues.reactions.remove', { ...R(), index, content: '+1' });
		await run('issues.subscriptions.add', { ...R(), index, user: OTHER });
		await run('issues.subscriptions.list', { ...R(), index });
		await run('issues.subscriptions.check', { ...R(), index });
		await run('issues.subscriptions.remove', { ...R(), index, user: OTHER });
		await run('issues.stopwatch.start', { ...R(), index });
		await run('user.stopwatches.list');
		await run('issues.stopwatch.stop', { ...R(), index });
		await run('issues.stopwatch.start', { ...R(), index });
		await run('issues.stopwatch.delete', { ...R(), index });
		const time = await run('issues.times.add', { ...R(), index, time: 1800 });
		await run('issues.times.list', { ...R(), index });
		await run('issues.times.delete', { ...R(), index, id: time?.id });
		await run('issues.times.add', { ...R(), index, time: 60 });
		await run('issues.times.reset', { ...R(), index });
		await run('issues.dependencies.add', {
			...R(),
			index,
			other_owner: ADMIN,
			other_repo: REPO,
			other_index: other2?.number,
		});
		await run('issues.dependencies.list', { ...R(), index });
		await run('issues.dependencies.remove', {
			...R(),
			index,
			other_owner: ADMIN,
			other_repo: REPO,
			other_index: other2?.number,
		});
		await run('issues.blocks.add', {
			...R(),
			index,
			other_owner: ADMIN,
			other_repo: REPO,
			other_index: other2?.number,
		});
		await run('issues.blocks.list', { ...R(), index });
		await run('issues.blocks.remove', {
			...R(),
			index,
			other_owner: ADMIN,
			other_repo: REPO,
			other_index: other2?.number,
		});
		await run('issues.pin', { ...R(), index });
		await run('issues.pin', { ...R(), index: other2?.number });
		await run('issues.movePin', { ...R(), index, position: 2 });
		await run('issues.unpin', { ...R(), index });
		await run('issues.lock', { ...R(), index, lock_reason: 'resolved' });
		await run('issues.unlock', { ...R(), index });
		const att = await run('issues.attachments.create', {
			...R(),
			index,
			attachment: {
				base64: PNG,
				filename: 'shot.png',
				contentType: 'image/png',
			},
		});
		await run('issues.attachments.list', { ...R(), index });
		await run('issues.attachments.get', {
			...R(),
			index,
			attachment_id: att?.id,
		});
		await run('issues.attachments.update', {
			...R(),
			index,
			attachment_id: att?.id,
			name: 'shot-2.png',
		});
		await run('issues.attachments.delete', {
			...R(),
			index,
			attachment_id: att?.id,
		});

		// The other user comments: the admin gets a notification.
		const comment = await run(
			'comments.create',
			{ ...R(), index, body: 'I can reproduce this.' },
			{ as: other },
		);
		const mine = await run('comments.create', {
			...R(),
			index,
			body: 'Thanks',
		});
		await run('comments.list', { ...R(), index });
		await run('comments.get', { ...R(), id: mine?.id });
		await run('comments.update', { ...R(), id: mine?.id, body: 'Thanks!' });
		await run('comments.reactions.add', {
			...R(),
			id: comment?.id,
			content: 'heart',
		});
		await run('comments.reactions.list', { ...R(), id: comment?.id });
		await run('comments.reactions.remove', {
			...R(),
			id: comment?.id,
			content: 'heart',
		});
		const catt = await run('comments.attachments.create', {
			...R(),
			id: mine?.id,
			attachment: { base64: PNG, filename: 'c.png', contentType: 'image/png' },
		});
		await run('comments.attachments.list', { ...R(), id: mine?.id });
		await run('comments.attachments.get', {
			...R(),
			id: mine?.id,
			attachment_id: catt?.id,
		});
		await run('comments.attachments.update', {
			...R(),
			id: mine?.id,
			attachment_id: catt?.id,
			name: 'c2.png',
		});
		await run('comments.attachments.delete', {
			...R(),
			id: mine?.id,
			attachment_id: catt?.id,
		});
		await run('comments.delete', { ...R(), id: mine?.id });
		await run('issues.timeline', { ...R(), index });

		const notes = await run('notifications.list', { all: true });
		const thread = notes?.items?.[0];
		if (thread) {
			await run('notifications.threads.get', { id: String(thread.id) });
			await run('notifications.threads.markRead', { id: String(thread.id) });
		}
		await run('notifications.markReadForRepo', R());
		await run('notifications.markRead', { all: 'true' });

		await run('issues.delete', { ...R(), index: other2?.number });
		await run('labels.delete', { ...R(), id: label2?.id });
		await run('milestones.delete', { ...R(), id: ms?.id });
	});

	it('works with pull requests and reviews', async () => {
		const pr = await run('pulls.create', {
			...R(),
			title: 'Login page',
			head: 'feature/login',
			base: 'main',
			body: 'Adds login',
		});
		const index = pr?.number;
		await run('pulls.get', { ...R(), index });
		await run('pulls.getByBaseHead', {
			...R(),
			base: 'main',
			head: 'feature/login',
		});
		await run('pulls.update', { ...R(), index, body: 'Adds the login page' });
		const diff = await run('pulls.downloadDiff', {
			...R(),
			index,
			diffType: 'patch',
		});
		expect(diff?.text).toContain('Subject:');
		await run('pulls.commits', { ...R(), index });
		await run('pulls.files', { ...R(), index });
		await run('pulls.isMerged', { ...R(), index }, { expect: /404/ });
		await run('pulls.requestedReviewers.add', {
			...R(),
			index,
			reviewers: [OTHER],
		});
		await run('pulls.requestedReviewers.remove', {
			...R(),
			index,
			reviewers: [OTHER],
		});

		// A pending review with a line comment, then submitted.
		const pending = await run('pulls.reviews.create', {
			...R(),
			index,
			body: 'A few notes',
			comments: [{ path: 'login.md', new_position: 1, body: 'Typo?' }],
		});
		await run('pulls.reviews.get', { ...R(), index, id: pending?.id });
		await run('pulls.reviews.submit', {
			...R(),
			index,
			id: pending?.id,
			event: 'COMMENT',
			body: 'Submitted',
		});
		const reviewComments = await run('pulls.reviews.comments', {
			...R(),
			index,
			id: pending?.id,
		});
		const rc = reviewComments?.[0];
		await run('pulls.reviewComments.reply', {
			...R(),
			index,
			id: rc?.id,
			body: 'Fixed',
		});
		await run('pulls.reviewComments.resolve', { ...R(), id: rc?.id });
		await run('pulls.reviewComments.unresolve', { ...R(), id: rc?.id });
		// The other user approves, the admin dismisses and restores it.
		const approval = await run(
			'pulls.reviews.create',
			{ ...R(), index, event: 'APPROVED', body: 'LGTM' },
			{ as: other },
		);
		await run('pulls.reviews.list', { ...R(), index });
		await run('pulls.reviews.dismiss', {
			...R(),
			index,
			id: approval?.id,
			message: 'Stale',
		});
		await run('pulls.reviews.undismiss', { ...R(), index, id: approval?.id });
		const extra = await run('pulls.reviews.create', {
			...R(),
			index,
			body: 'scratch',
		});
		await run('pulls.reviews.delete', { ...R(), index, id: extra?.id });

		// main moves on, so the PR branch is behind: update it, then merge.
		await run('contents.create', {
			...R(),
			filepath: 'main-only.md',
			content: b64('x\n'),
			message: 'Main moves on',
		});
		await run('pulls.updateBranch', { ...R(), index, style: 'merge' });
		// Gitea checks mergeability in the background: wait until it is known.
		const mergeable = async () => {
			for (let i = 0; i < 40; i++) {
				const pr = await fn(admin, 'pulls.get')({ ...R(), index });
				if (pr?.mergeable) return;
				await new Promise((resolve) => setTimeout(resolve, 500));
			}
		};
		await mergeable();
		// A scheduled merge waits on a pending check; cancelled before it lands.
		const head = await run('pulls.get', { ...R(), index });
		await run('commits.statuses.create', {
			...R(),
			sha: head?.head?.sha,
			state: 'pending',
			context: 'ci/build',
		});
		await run('pulls.merge', {
			...R(),
			index,
			do: 'merge',
			merge_when_checks_succeed: true,
		});
		await run('pulls.cancelAutoMerge', { ...R(), index });
		await mergeable();
		await run('pulls.merge', {
			...R(),
			index,
			do: 'squash',
			force_merge: true,
		});
		await run('pulls.isMerged', { ...R(), index });
		const merged = await run('pulls.get', { ...R(), index });
		if (merged?.merge_commit_sha) {
			await run('commits.pullRequest', {
				...R(),
				sha: merged.merge_commit_sha,
			});
		}
		await run('pulls.list', { ...R(), state: 'closed' });
	});

	it('works with releases, wiki, webhooks and projects', async () => {
		const release = await run('releases.create', {
			...R(),
			tag_name: 'v1.0.0',
			name: 'v1.0.0',
			body: 'First release',
			target_commitish: 'main',
		});
		await run('releases.get', { ...R(), id: release?.id });
		await run('releases.getLatest', R());
		await run('releases.getByTag', { ...R(), tag: 'v1.0.0' });
		await run('releases.update', { ...R(), id: release?.id, body: 'Notes' });
		const asset = await run('releases.assets.create', {
			...R(),
			id: release?.id,
			name: 'notes.txt',
			attachment: {
				base64: b64('notes'),
				filename: 'notes.txt',
				contentType: 'text/plain',
			},
		});
		await run('releases.assets.list', { ...R(), id: release?.id });
		await run('releases.assets.get', {
			...R(),
			id: release?.id,
			attachment_id: asset?.id,
		});
		await run('releases.assets.update', {
			...R(),
			id: release?.id,
			attachment_id: asset?.id,
			name: 'notes-2.txt',
		});
		await run('releases.assets.delete', {
			...R(),
			id: release?.id,
			attachment_id: asset?.id,
		});
		await run('releases.create', {
			...R(),
			tag_name: 'v1.0.1',
			target_commitish: 'main',
		});
		await run('releases.deleteByTag', { ...R(), tag: 'v1.0.1' });
		await run('releases.delete', { ...R(), id: release?.id });

		await run('wiki.create', {
			...R(),
			title: 'Home',
			content_base64: b64('Welcome'),
			message: 'Start the wiki',
		});
		await run('wiki.get', { ...R(), pageName: 'Home' });
		await run('wiki.update', {
			...R(),
			pageName: 'Home',
			title: 'Home',
			content_base64: b64('Hi'),
		});
		await run('wiki.revisions', { ...R(), pageName: 'Home' });
		await run('wiki.list', R());
		await run('wiki.delete', { ...R(), pageName: 'Home' });

		const hook = await run('webhooks.create', {
			...R(),
			type: 'gitea',
			active: true,
			events: ['push', 'issues'],
			config: {
				url: 'https://example.com/gitea/webhooks',
				content_type: 'json',
				secret: 'live-secret',
			},
		});
		await run('webhooks.get', { ...R(), id: hook?.id });
		await run('webhooks.update', { ...R(), id: hook?.id, active: false });
		await run('webhooks.test', { ...R(), id: hook?.id });
		await run('webhooks.delete', { ...R(), id: hook?.id });

		const project = await run('projects.create', {
			...R(),
			title: 'Roadmap',
			template_type: 'basic_kanban',
		});
		await run('projects.get', { ...R(), id: project?.id });
		await run('projects.update', {
			...R(),
			id: project?.id,
			description: 'Q1',
		});
		const col = await run('projects.columns.create', {
			...R(),
			id: project?.id,
			title: 'Doing',
		});
		const cols = await run('projects.columns.list', {
			...R(),
			id: project?.id,
		});
		await run('projects.columns.get', {
			...R(),
			id: project?.id,
			column_id: col?.id,
		});
		await run('projects.columns.update', {
			...R(),
			id: project?.id,
			column_id: col?.id,
			title: 'In progress',
		});
		await run('projects.columns.setDefault', {
			...R(),
			id: project?.id,
			column_id: col?.id,
		});
		const items = cols?.items ?? cols ?? [];
		await run('projects.columns.move', {
			...R(),
			id: project?.id,
			column_ids: [...items.map((c: Json) => c.id)].reverse(),
		});
		const issue = await run('issues.create', { ...R(), title: 'Card' });
		const issueId = issue?.id;
		await run('projects.columns.issues.add', {
			...R(),
			id: project?.id,
			column_id: col?.id,
			issue_id: issueId,
		});
		await run('projects.columns.issues.list', {
			...R(),
			id: project?.id,
			column_id: col?.id,
		});
		const target = items.find((c: Json) => c.id !== col?.id);
		await run('projects.issues.move', {
			...R(),
			id: project?.id,
			issue_id: issueId,
			column_id: target?.id ?? col?.id,
		});
		await run('projects.columns.issues.remove', {
			...R(),
			id: project?.id,
			column_id: target?.id ?? col?.id,
			issue_id: issueId,
		});
		const scratch = await run('projects.columns.create', {
			...R(),
			id: project?.id,
			title: 'Scratch',
		});
		await run('projects.columns.delete', {
			...R(),
			id: project?.id,
			column_id: scratch?.id,
		});
		await run('projects.delete', { ...R(), id: project?.id });
	});

	it('works with Actions', async () => {
		await run('actions.variables.create', {
			...R(),
			variablename: 'NODE_VERSION',
			value: '20',
		});
		await run('actions.variables.get', {
			...R(),
			variablename: 'NODE_VERSION',
		});
		await run('actions.variables.update', {
			...R(),
			variablename: 'NODE_VERSION',
			value: '22',
		});
		await run('actions.variables.delete', {
			...R(),
			variablename: 'NODE_VERSION',
		});
		await run('actions.secrets.set', {
			...R(),
			secretname: 'DEPLOY_TOKEN',
			data: 'x',
		});
		await run('actions.secrets.delete', { ...R(), secretname: 'DEPLOY_TOKEN' });
		const reg = await run('actions.runners.createRegistrationToken', R());
		expect(typeof reg?.token).toBe('string');
		await run(
			'actions.runners.get',
			{ ...R(), runner_id: '999999' },
			{ expect: /404/ },
		);
		await run(
			'actions.runners.update',
			{ ...R(), runner_id: '999999', disabled: true },
			{ expect: /404/ },
		);
		await run(
			'actions.runners.delete',
			{ ...R(), runner_id: '999999' },
			{ expect: /404/ },
		);
		const workflows = await run('actions.workflows.list', R());
		const wf = workflows?.workflows?.[0]?.id ?? 'ci.yml';
		await run('actions.workflows.get', { ...R(), workflow_id: wf });
		await run('actions.workflows.disable', { ...R(), workflow_id: wf });
		await run('actions.workflows.enable', { ...R(), workflow_id: wf });
		await run('actions.workflows.dispatch', {
			...R(),
			workflow_id: wf,
			ref: 'main',
			return_run_details: true,
		});
		await run('actions.workflows.runs.list', { ...R(), workflow_id: wf });
		const runs = await run('actions.runs.list', R());
		const runId = runs?.workflow_runs?.[0]?.id;
		await run('actions.runs.get', { ...R(), run: runId });
		const jobs = await run('actions.runs.jobs.list', { ...R(), run: runId });
		const jobId = jobs?.jobs?.[0]?.id;
		await run('actions.jobs.get', { ...R(), job_id: jobId });
		await run('actions.runs.attempts.get', { ...R(), run: runId, attempt: 1 });
		await run('actions.runs.attempts.jobs.list', {
			...R(),
			run: runId,
			attempt: 1,
		});
		await run('actions.runs.artifacts.list', { ...R(), run: runId });
		// No runner picked the job up: there are no logs or artifacts yet.
		await run(
			'actions.jobs.downloadLogs',
			{ ...R(), job_id: jobId },
			{ expect: /404|500/ },
		);
		await run(
			'actions.runs.downloadLogs',
			{ ...R(), run: runId },
			{ expect: /404|500/ },
		);
		await run(
			'actions.artifacts.get',
			{ ...R(), artifact_id: '999999' },
			{ expect: /404/ },
		);
		await run(
			'actions.artifacts.download',
			{ ...R(), artifact_id: '999999' },
			{ expect: /404/ },
		);
		await run(
			'actions.artifacts.delete',
			{ ...R(), artifact_id: '999999' },
			{ expect: /404/ },
		);
		// Only a run from a fork's pull request waits for approval.
		await run(
			'actions.runs.approve',
			{ ...R(), run: runId },
			{ expect: /4\d\d/ },
		);
		await run('actions.runs.cancel', { ...R(), run: runId });
		await run(
			'actions.runs.forceCancel',
			{ ...R(), run: runId },
			{ expect: /4\d\d/ },
		);
		const done = /already completed/;
		await run('actions.runs.rerunFailed', { ...R(), run: runId });
		await run('actions.runs.cancel', { ...R(), run: runId }, { allow: done });
		const rerunJobs = await run('actions.runs.jobs.list', {
			...R(),
			run: runId,
		});
		await run('actions.runs.jobs.rerun', {
			...R(),
			run: runId,
			job_id: rerunJobs?.jobs?.[0]?.id ?? jobId,
		});
		await run('actions.runs.cancel', { ...R(), run: runId }, { allow: done });
		await run('actions.runs.rerun', { ...R(), run: runId });
		await run('actions.runs.cancel', { ...R(), run: runId }, { allow: done });
		await run('actions.runs.delete', { ...R(), run: runId });

		// The same groups for the user and the org.
		await run('user.actions.variables.create', {
			variablename: 'LIVE_VAR',
			value: '1',
		});
		await run('user.actions.variables.get', { variablename: 'LIVE_VAR' });
		await run('user.actions.variables.update', {
			variablename: 'LIVE_VAR',
			value: '2',
		});
		await run('user.actions.variables.delete', { variablename: 'LIVE_VAR' });
		await run('user.actions.secrets.set', {
			secretname: 'LIVE_SECRET',
			data: 'x',
		});
		await run('user.actions.secrets.delete', { secretname: 'LIVE_SECRET' });
		await run('user.actions.runners.createRegistrationToken');
		await run(
			'user.actions.runners.get',
			{ runner_id: '999999' },
			{ expect: /404/ },
		);
		await run(
			'user.actions.runners.update',
			{ runner_id: '999999', disabled: true },
			{ expect: /404/ },
		);
		await run(
			'user.actions.runners.delete',
			{ runner_id: '999999' },
			{ expect: /404/ },
		);
		const O = { org: ORG };
		await run('orgs.actions.variables.create', {
			...O,
			variablename: 'ORG_VAR',
			value: '1',
		});
		await run('orgs.actions.variables.list', O);
		await run('orgs.actions.variables.get', { ...O, variablename: 'ORG_VAR' });
		await run('orgs.actions.variables.update', {
			...O,
			variablename: 'ORG_VAR',
			value: '2',
		});
		await run('orgs.actions.variables.delete', {
			...O,
			variablename: 'ORG_VAR',
		});
		await run('orgs.actions.secrets.set', {
			...O,
			secretname: 'ORG_SECRET',
			data: 'x',
		});
		await run('orgs.actions.secrets.list', O);
		await run('orgs.actions.secrets.delete', {
			...O,
			secretname: 'ORG_SECRET',
		});
		await run('orgs.actions.runners.list', O);
		await run('orgs.actions.runners.createRegistrationToken', O);
		await run(
			'orgs.actions.runners.get',
			{ ...O, runner_id: '999999' },
			{ expect: /404/ },
		);
		await run(
			'orgs.actions.runners.update',
			{ ...O, runner_id: '999999', disabled: true },
			{ expect: /404/ },
		);
		await run(
			'orgs.actions.runners.delete',
			{ ...O, runner_id: '999999' },
			{ expect: /404/ },
		);
		await run('orgs.actions.runs.list', O);
		await run('orgs.actions.jobs.list', O);
		await run('admin.actions.runners.createRegistrationToken');
		await run(
			'admin.actions.runners.get',
			{ runner_id: '999999' },
			{ expect: /404/ },
		);
		await run(
			'admin.actions.runners.update',
			{ runner_id: '999999', disabled: true },
			{ expect: /404/ },
		);
		await run(
			'admin.actions.runners.delete',
			{ runner_id: '999999' },
			{ expect: /404/ },
		);
	});

	it('works with orgs, teams and members', async () => {
		const O = { org: ORG };
		await run('orgs.get', O);
		await run('orgs.update', { ...O, description: 'Live run org' });
		await run('orgs.avatar.update', { ...O, image: PNG });
		await run('orgs.avatar.delete', O);
		await run('orgs.activityFeeds.list', O);
		await run('orgs.members.list', O);
		await run('orgs.members.check', { ...O, username: ADMIN });
		await run('orgs.publicMembers.publicize', { ...O, username: ADMIN });
		await run('orgs.publicMembers.list', O);
		await run('orgs.publicMembers.check', { ...O, username: ADMIN });
		await run('orgs.publicMembers.conceal', { ...O, username: ADMIN });
		const label = await run('orgs.labels.create', {
			...O,
			name: 'org-bug',
			color: '#ff0000',
		});
		await run('orgs.labels.list', O);
		await run('orgs.labels.get', { ...O, id: label?.id });
		await run('orgs.labels.update', {
			...O,
			id: label?.id,
			description: 'Org wide',
		});
		await run('orgs.labels.delete', { ...O, id: label?.id });
		const hook = await run('orgs.hooks.create', {
			...O,
			type: 'gitea',
			config: { url: 'https://example.com/gitea/org', content_type: 'json' },
			events: ['repository'],
		});
		await run('orgs.hooks.list', O);
		await run('orgs.hooks.get', { ...O, id: hook?.id });
		await run('orgs.hooks.update', { ...O, id: hook?.id, active: true });
		await run('orgs.hooks.delete', { ...O, id: hook?.id });
		const repo = await run('orgs.repos.create', {
			...O,
			name: 'service',
			auto_init: true,
		});
		await run('orgs.repos.list', O);
		const team = await run('orgs.teams.create', {
			...O,
			name: 'developers',
			permission: 'write',
			units: ['repo.code', 'repo.issues', 'repo.pulls'],
		});
		await run('orgs.teams.list', O);
		await run('orgs.teams.search', { ...O, q: 'dev' });
		await run('teams.get', { id: team?.id });
		await run('teams.update', {
			id: team?.id,
			name: 'developers',
			description: 'Devs',
		});
		await run('teams.members.add', { id: team?.id, username: OTHER });
		await run('teams.members.list', { id: team?.id });
		await run('teams.members.get', { id: team?.id, username: OTHER });
		await run('teams.repos.add', { id: team?.id, org: ORG, repo: 'service' });
		await run('teams.repos.list', { id: team?.id });
		await run('teams.repos.get', { id: team?.id, org: ORG, repo: 'service' });
		await run('teams.activityFeeds.list', { id: team?.id });
		await run('repos.teams.list', { owner: ORG, repo: 'service' });
		await run('repos.teams.check', {
			owner: ORG,
			repo: 'service',
			team: 'developers',
		});
		await run('repos.teams.remove', {
			owner: ORG,
			repo: 'service',
			team: 'developers',
		});
		await run('repos.teams.add', {
			owner: ORG,
			repo: 'service',
			team: 'developers',
		});
		await run('teams.repos.remove', {
			id: team?.id,
			org: ORG,
			repo: 'service',
		});
		await run('users.orgs.permissions', { username: OTHER, org: ORG });
		await run('teams.members.remove', { id: team?.id, username: OTHER });
		await run('orgs.blocks.add', { ...O, username: OTHER, note: 'live run' });
		await run('orgs.blocks.list', O);
		await run('orgs.blocks.check', { ...O, username: OTHER });
		await run('orgs.blocks.remove', { ...O, username: OTHER });
		await run('teams.members.add', { id: team?.id, username: OTHER });
		await run('orgs.members.remove', { ...O, username: OTHER });
		await run('teams.delete', { id: team?.id });

		const project = await run('orgs.projects.create', {
			...O,
			title: 'Org board',
			template_type: 'basic_kanban',
		});
		await run('orgs.projects.list', O);
		await run('orgs.projects.get', { ...O, id: project?.id });
		await run('orgs.projects.update', {
			...O,
			id: project?.id,
			description: 'x',
		});
		const col = await run('orgs.projects.columns.create', {
			...O,
			id: project?.id,
			title: 'Next',
		});
		const cols = await run('orgs.projects.columns.list', {
			...O,
			id: project?.id,
		});
		await run('orgs.projects.columns.get', {
			...O,
			id: project?.id,
			column_id: col?.id,
		});
		await run('orgs.projects.columns.update', {
			...O,
			id: project?.id,
			column_id: col?.id,
			title: 'Soon',
		});
		await run('orgs.projects.columns.setDefault', {
			...O,
			id: project?.id,
			column_id: col?.id,
		});
		const items = cols?.items ?? cols ?? [];
		await run('orgs.projects.columns.move', {
			...O,
			id: project?.id,
			column_ids: [...items.map((c: Json) => c.id)].reverse(),
		});
		const issue = await run('issues.create', {
			owner: ORG,
			repo: 'service',
			title: 'Org card',
		});
		await run('orgs.projects.columns.issues.add', {
			...O,
			id: project?.id,
			column_id: col?.id,
			issue_id: issue?.id,
		});
		await run('orgs.projects.columns.issues.list', {
			...O,
			id: project?.id,
			column_id: col?.id,
		});
		const target = items.find((c: Json) => c.id !== col?.id);
		await run('orgs.projects.issues.move', {
			...O,
			id: project?.id,
			issue_id: issue?.id,
			column_id: target?.id ?? col?.id,
		});
		await run('orgs.projects.columns.issues.remove', {
			...O,
			id: project?.id,
			column_id: target?.id ?? col?.id,
			issue_id: issue?.id,
		});
		const scratch = await run('orgs.projects.columns.create', {
			...O,
			id: project?.id,
			title: 'Scratch',
		});
		await run('orgs.projects.columns.delete', {
			...O,
			id: project?.id,
			column_id: scratch?.id,
		});
		await run('orgs.projects.delete', { ...O, id: project?.id });
		expect(repo?.full_name).toBe(`${ORG}/service`);
	});

	it('forks, generates, migrates, mirrors and transfers', async () => {
		const fork = await run('repos.forks.create', {
			...R(),
			organization: ORG,
			name: `${REPO}-fork`,
		});
		await run('repos.mergeUpstream', {
			owner: ORG,
			repo: fork?.name ?? `${REPO}-fork`,
			branch: 'main',
		});
		await run('repos.update', { ...R(), template: true });
		await run('repos.generateFromTemplate', {
			template_owner: ADMIN,
			template_repo: REPO,
			owner: ADMIN,
			name: `${REPO}-gen`,
			git_content: true,
		});
		const internal = (instanceUrl as string)
			.replace(/:\d+$/, ':3000')
			.replace('localhost', '127.0.0.1');
		await run('repos.migrate', {
			clone_addr: `${internal}/${ADMIN}/${REPO}.git`,
			repo_name: `${REPO}-mirror`,
			repo_owner: ADMIN,
			mirror: true,
			auth_token: token,
		});
		await run('repos.mirrorSync', { owner: ADMIN, repo: `${REPO}-mirror` });
		await run('repos.pushMirrors.add', {
			...R(),
			remote_address: `${internal}/${ADMIN}/${REPO}-gen.git`,
			remote_username: ADMIN,
			remote_password: adminPassword,
			interval: '8h0m0s',
		});
		const mirrors = await run('repos.pushMirrors.list', R());
		const mirrorName = mirrors?.items?.[0]?.remote_name;
		await run('repos.pushMirrors.get', { ...R(), name: mirrorName });
		await run('repos.pushMirrors.sync', R());
		await run('repos.pushMirrors.delete', { ...R(), name: mirrorName });

		// A site admin's transfer is immediate; the other user's waits for the
		// admin to accept (or reject) it.
		await run(
			'repos.create',
			{ name: `${REPO}-gift`, auto_init: true },
			{ as: other },
		);
		await run(
			'repos.transfer',
			{ owner: OTHER, repo: `${REPO}-gift`, new_owner: ADMIN },
			{ as: other },
		);
		await run('repos.acceptTransfer', { owner: OTHER, repo: `${REPO}-gift` });
		await run(
			'repos.create',
			{ name: `${REPO}-gift2`, auto_init: true },
			{ as: other },
		);
		await run(
			'repos.transfer',
			{ owner: OTHER, repo: `${REPO}-gift2`, new_owner: ADMIN },
			{ as: other },
		);
		await run('repos.rejectTransfer', { owner: OTHER, repo: `${REPO}-gift2` });
		await run('repos.delete', { owner: ADMIN, repo: `${REPO}-gift` });
		await run(
			'repos.delete',
			{ owner: OTHER, repo: `${REPO}-gift2` },
			{ as: other },
		);
		await run('repos.delete', { owner: ADMIN, repo: `${REPO}-gen` });
		await run('repos.delete', { owner: ADMIN, repo: `${REPO}-mirror` });
	});

	it('works with the signed-in user and other users', async () => {
		await run('user.settings.update', { description: 'Corsair live run' });
		await run('user.emails.add', { emails: [`extra-${STAMP}@example.com`] });
		await run('user.emails.remove', { emails: [`extra-${STAMP}@example.com`] });
		await run('user.avatar.update', { image: PNG });
		await run('user.avatar.delete');
		await run('user.following.follow', { username: OTHER });
		await run('user.following.check', { username: OTHER });
		await run('users.following.check', { username: ADMIN, target: OTHER });
		await run('user.following.unfollow', { username: OTHER });
		await run('user.blocks.add', { username: OTHER, note: 'live run' });
		await run('user.blocks.check', { username: OTHER });
		await run('user.blocks.remove', { username: OTHER });
		const key = await run('user.keys.create', {
			title: 'live',
			key: sshKey('user'),
		});
		await run('user.keys.get', { id: key?.id });
		await run('user.keys.delete', { id: key?.id });
		// A throwaway GPG key: add it, sign the verification token, verify, delete.
		const gnupg = mkdtempSync(join(work, 'gnupg-'));
		const gpg = (args: string[], input?: string) =>
			execFileSync('gpg', ['--homedir', gnupg, '--batch', '--yes', ...args], {
				input,
				encoding: 'utf8',
			});
		gpg([
			'--passphrase',
			'',
			'--quick-gen-key',
			'Corsair Admin <admin@example.com>',
			'ed25519',
			'sign',
			'1d',
		]);
		const armored = gpg(['--armor', '--export', 'admin@example.com']);
		const gpgKey = await run('user.gpgKeys.create', {
			armored_public_key: armored,
		});
		await run('user.gpgKeys.get', { id: gpgKey?.id });
		const tokenText = await run('user.gpgKeys.verificationToken');
		expect(typeof tokenText?.text).toBe('string');
		const signature = gpg(
			['--armor', '--local-user', 'admin@example.com', '--detach-sign'],
			tokenText?.text ?? '',
		);
		await run('user.gpgKeys.verify', {
			key_id: gpgKey?.key_id,
			armored_signature: signature,
		});
		await run('user.gpgKeys.delete', { id: gpgKey?.id });
		const app = await run('user.oauth2Apps.create', {
			name: 'live',
			redirect_uris: ['https://example.com/callback'],
		});
		await run('user.oauth2Apps.get', { id: app?.id });
		await run('user.oauth2Apps.update', {
			id: app?.id,
			name: 'live-2',
			redirect_uris: ['https://example.com/callback'],
		});
		await run('user.oauth2Apps.delete', { id: app?.id });
		const hook = await run('user.hooks.create', {
			type: 'gitea',
			config: { url: 'https://example.com/gitea/user', content_type: 'json' },
			events: ['push'],
		});
		await run('user.hooks.get', { id: hook?.id });
		await run('user.hooks.update', { id: hook?.id, active: true });
		await run('user.hooks.delete', { id: hook?.id });
		const project = await run('user.projects.create', {
			title: 'Mine',
			template_type: 'basic_kanban',
		});
		await run('user.projects.get', { id: project?.id });
		await run('user.projects.update', { id: project?.id, description: 'x' });
		const col = await run('user.projects.columns.create', {
			id: project?.id,
			title: 'Now',
		});
		const cols = await run('user.projects.columns.list', { id: project?.id });
		await run('user.projects.columns.get', {
			id: project?.id,
			column_id: col?.id,
		});
		await run('user.projects.columns.update', {
			id: project?.id,
			column_id: col?.id,
			title: 'Today',
		});
		await run('user.projects.columns.setDefault', {
			id: project?.id,
			column_id: col?.id,
		});
		const items = cols?.items ?? cols ?? [];
		await run('user.projects.columns.move', {
			id: project?.id,
			column_ids: [...items.map((c: Json) => c.id)].reverse(),
		});
		const issue = await run('issues.create', { ...R(), title: 'User card' });
		await run('user.projects.columns.issues.add', {
			id: project?.id,
			column_id: col?.id,
			issue_id: issue?.id,
		});
		await run('user.projects.columns.issues.list', {
			id: project?.id,
			column_id: col?.id,
		});
		const target = items.find((c: Json) => c.id !== col?.id);
		await run('user.projects.issues.move', {
			id: project?.id,
			issue_id: issue?.id,
			column_id: target?.id ?? col?.id,
		});
		await run('user.projects.columns.issues.remove', {
			id: project?.id,
			column_id: target?.id ?? col?.id,
			issue_id: issue?.id,
		});
		const scratch = await run('user.projects.columns.create', {
			id: project?.id,
			title: 'Scratch',
		});
		await run('user.projects.columns.delete', {
			id: project?.id,
			column_id: scratch?.id,
		});
		await run('user.projects.delete', { id: project?.id });

		const U = { username: OTHER };
		for (const id of [
			'users.get',
			'users.activityFeeds.list',
			'users.followers.list',
			'users.following.list',
			'users.gpgKeys.list',
			'users.heatmap',
			'users.keys.list',
			'users.orgs.list',
			'users.projects.list',
			'users.repos.list',
			'users.starred.list',
			'users.subscriptions.list',
		]) {
			await run(id, U);
		}
	});

	it('receives signed webhook deliveries', async () => {
		const hookUrl = process.env.GITEA_HOOK_URL;
		const hookDir = process.env.GITEA_HOOK_DIR;
		if (!hookUrl || !hookDir) {
			console.warn(
				'Skipping webhook deliveries: set GITEA_HOOK_URL and GITEA_HOOK_DIR.',
			);
			return;
		}
		const secret = `hook-${STAMP}`;
		const before = new Set(readdirSync(hookDir));
		const hook = await run('webhooks.create', {
			...R(),
			type: 'gitea',
			active: true,
			events: [
				'create',
				'delete',
				'push',
				'issues',
				'issue_label',
				'issue_comment',
				'pull_request',
				'pull_request_review_approved',
				'pull_request_review_comment',
				'release',
				'wiki',
				'status',
				'repository',
				'fork',
			],
			config: { url: hookUrl, content_type: 'json', secret },
		});
		await run('branches.create', {
			...R(),
			new_branch_name: 'hook/one',
			old_ref_name: 'main',
		});
		await run('contents.create', {
			...R(),
			filepath: 'hook.md',
			content: b64('h\n'),
			message: 'Hook push',
			branch: 'hook/one',
		});
		const issue = await run('issues.create', { ...R(), title: 'Hook issue' });
		await run('comments.create', {
			...R(),
			index: issue?.number,
			body: 'Hook comment',
		});
		const label = await run('labels.create', {
			...R(),
			name: `hook-${STAMP}`,
			color: '#123456',
		});
		await run('issues.labels.add', {
			...R(),
			index: issue?.number,
			labels: [label?.id],
		});
		const pr = await run('pulls.create', {
			...R(),
			title: 'Hook PR',
			head: 'hook/one',
			base: 'main',
		});
		await run(
			'pulls.reviews.create',
			{ ...R(), index: pr?.number, event: 'APPROVED', body: 'ok' },
			{ as: other },
		);
		await run('pulls.reviews.create', {
			...R(),
			index: pr?.number,
			event: 'COMMENT',
			body: 'note',
		});
		await run('releases.create', {
			...R(),
			tag_name: `hook-${STAMP}`,
			target_commitish: 'main',
		});
		await run('wiki.create', {
			...R(),
			title: 'Hooked',
			content_base64: b64('w'),
		});
		await run('commits.statuses.create', {
			...R(),
			sha: 'main',
			state: 'success',
			context: 'hook',
		});
		await run('pulls.update', { ...R(), index: pr?.number, state: 'closed' });
		await run('branches.delete', { ...R(), branch: 'hook/one' });
		await new Promise((resolve) => setTimeout(resolve, 6000));
		await run('webhooks.delete', { ...R(), id: hook?.id });

		const corsair = createCorsair({
			plugins: [gitea({ key: token, instanceUrl, webhookSecret: secret })],
		});
		const forged = createCorsair({
			plugins: [
				gitea({ key: token, instanceUrl, webhookSecret: 'not-the-secret' }),
			],
		});
		const files = readdirSync(hookDir)
			.filter((f) => !before.has(f) && f.endsWith('.json'))
			.sort();
		const seen: Record<string, number> = {};
		for (const file of files) {
			const delivery = JSON.parse(readFileSync(join(hookDir, file), 'utf8'));
			const headers = Object.fromEntries(
				Object.entries(delivery.headers as Record<string, string>).map(
					([k, v]) => [k.toLowerCase(), v],
				),
			);
			const result = await processWebhook(corsair, headers, delivery.body);
			const key = `webhook:${result.action ?? headers['x-gitea-event-type']}`;
			if (result.plugin !== 'gitea' || !result.response?.success) {
				results[key] = {
					ok: false,
					error: `${headers['x-gitea-event-type']}: ${result.response?.error ?? 'not matched'}`,
				};
				continue;
			}
			seen[String(result.action)] = (seen[String(result.action)] ?? 0) + 1;
			if (!results[key]) results[key] = { ok: true };
			const refused = await processWebhook(forged, headers, delivery.body);
			if (refused.response?.statusCode !== 401) {
				results[`${key}:forged`] = {
					ok: false,
					error: 'a wrong secret was accepted',
				};
			}
		}
		console.log(
			`Gitea webhook deliveries: ${files.length} (${JSON.stringify(seen)})`,
		);
		expect(Object.keys(seen)).toEqual(
			expect.arrayContaining([
				'push',
				'refCreated',
				'refDeleted',
				'issues',
				'issueComment',
				'pullRequest',
				'pullRequestReview',
				'release',
				'wiki',
				'status',
			]),
		);
	});

	it('runs the site admin and package routes', async () => {
		const U = { username: OTHER };
		await run('repos.collaborators.remove', { ...R(), collaborator: OTHER });
		await run('admin.users.update', {
			...U,
			full_name: 'Grace H',
			login_name: OTHER,
			source_id: 0,
		});
		const key = await run('admin.users.keys.create', {
			...U,
			title: 'admin-added',
			key: sshKey('admin'),
		});
		await run('admin.users.keys.delete', { ...U, id: key?.id });
		await run('admin.users.badges.list', U);
		// The API can't create badges, so adding an unknown one fails (500 on 28.4).
		await run(
			'admin.users.badges.add',
			{ ...U, badge_slugs: ['live'] },
			{ expect: /badge does not exist/ },
		);
		await run('admin.users.badges.delete', { ...U, badge_slugs: ['live'] });
		const org = await run('admin.users.orgs.create', {
			owner: OTHER,
			username: `${ORG}-g`,
		});
		await run('admin.users.repos.create', {
			...U,
			name: 'admin-made',
			auto_init: true,
		});
		const hook = await run('admin.hooks.create', {
			type: 'gitea',
			config: { url: 'https://example.com/gitea/system', content_type: 'json' },
			events: ['push'],
		});
		await run('admin.hooks.get', { id: hook?.id });
		await run('admin.hooks.update', { id: hook?.id, active: false });
		await run('admin.hooks.delete', { id: hook?.id });
		await run('admin.cron.run', { task: 'repo_health_check' });
		await run(
			'admin.unadopted.adopt',
			{ owner: ADMIN, repo: 'nothing-here' },
			{ expect: /404/ },
		);
		await run(
			'admin.unadopted.delete',
			{ owner: ADMIN, repo: 'nothing-here' },
			{ expect: /404/ },
		);

		// A generic package, published straight to the package registry.
		await http(
			'PUT',
			`/api/packages/${ADMIN}/generic/live-pkg/1.0.0/notes.txt`,
			Buffer.from('notes'),
		);
		const P = { owner: ADMIN, type: 'generic', name: 'live-pkg' };
		await run('packages.list', { owner: ADMIN });
		await run('packages.versions.list', P);
		await run('packages.versions.getLatest', P);
		await run('packages.versions.get', { ...P, version: '1.0.0' });
		await run('packages.versions.files.list', { ...P, version: '1.0.0' });
		await run('packages.link', { ...P, repo_name: REPO });
		await run('packages.unlink', P);
		await run('packages.versions.delete', { ...P, version: '1.0.0' });
		await http(
			'PUT',
			`/api/packages/${ADMIN}/generic/live-pkg/1.0.1/notes.txt`,
			Buffer.from('x'),
		);
		await run('packages.delete', P);

		await run('admin.users.rename', { ...U, new_username: `${OTHER}-r` });
		await run('admin.users.rename', {
			username: `${OTHER}-r`,
			new_username: OTHER,
		});
		await run('orgs.rename', { org: ORG, new_name: `${ORG}-r` });
		await run('orgs.rename', { org: `${ORG}-r`, new_name: ORG });
		await run('orgs.repos.deleteAll', { org: ORG });
		await run('orgs.delete', { org: org?.username ?? `${ORG}-g` });
		await run('admin.users.delete', { ...U, purge: true });
		expect(org?.username).toBe(`${ORG}-g`);
	});

	it('cleans up and revokes a throwaway token', async () => {
		await run('repos.delete', R());
		// orgs.repos.deleteAll runs in the background: wait for it before the org goes.
		for (let i = 0; i < 20; i++) {
			const left = await run('orgs.repos.list', { org: ORG });
			if (!left?.items?.length) break;
			await new Promise((resolve) => setTimeout(resolve, 500));
		}
		await run('orgs.delete', { org: ORG });
		const throwaway = await http(
			'POST',
			`/api/v1/users/${ADMIN}/tokens`,
			{ name: `throwaway-${STAMP}`, scopes: ['read:user'] },
			`Basic ${Buffer.from(`${ADMIN}:${adminPassword}`).toString('base64')}`,
		);
		const third = await client(throwaway.sha1);
		clients.push(third);
		const api = third.corsair.gitea.api;
		await run('user.token.delete', {}, { as: api });
		await run('user.me', {}, { as: api, expect: /401/ });
		const failed = Object.entries(results).filter(([, r]) => !r.ok);
		expect(failed.map(([id, r]) => `${id}: ${r.error}`)).toEqual([]);
	});
});
