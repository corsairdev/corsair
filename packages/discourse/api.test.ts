import { writeFileSync } from 'node:fs';
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { discourseOperations } from './endpoints/manifest';
import { discourse } from './index';

/**
 * Live run against a Discourse forum. Skipped unless all three are set (CI
 * never runs files named api.test.ts):
 *
 *   DISCOURSE_SITE_URL=https://forum.example.com DISCOURSE_API_KEY=... \
 *   DISCOURSE_API_USERNAME=admin npx jest api.test.ts
 *
 * Use a throwaway forum with an "All users" admin key (the 11-28 run used the
 * bitnamilegacy/discourse image in a Boat sandbox, forwarded to localhost).
 * The run creates and deletes categories, topics, posts, a private message,
 * tags, groups, badges, two users (one suspended, silenced, anonymized and
 * merged, the other deleted; example.com addresses, since a forum that
 * normalizes emails treats plus addresses of one inbox as the same email) and
 * invites, uploads an image and starts a
 * backup. Optional: DISCOURSE_LIVE_REPORT=<file> writes each step as JSON.
 */
const key = process.env.DISCOURSE_API_KEY;
const siteUrl = process.env.DISCOURSE_SITE_URL;
const username = process.env.DISCOURSE_API_USERNAME;
const describeIfKey = key && siteUrl && username ? describe : describe.skip;
if (!key || !siteUrl || !username) {
	console.warn(
		'Skipping Discourse live run: set DISCOURSE_API_KEY, DISCOURSE_SITE_URL and DISCOURSE_API_USERNAME.',
	);
}

const STAMP = Date.now().toString(36);
const NAME = `ct${STAMP}`;

const NO_ARGUMENT_READS = discourseOperations
	.filter(
		(op) =>
			op.method === 'GET' &&
			((op.input.required as string[] | undefined) ?? []).length === 0,
	)
	.map((op) => op.id);

type Step = { id: string; ok: boolean; expected?: boolean; note?: string };

// `unknown` because the value is any parsed response.
function pick(value: unknown, ...path: (string | number)[]): unknown {
	let node = value;
	for (const part of path) {
		node =
			typeof node === 'object' && node !== null
				? (node as Record<string | number, unknown>)[part]
				: undefined;
	}
	return node;
}

// `unknown` because the value is any parsed response.
function num(value: unknown, ...path: (string | number)[]): number {
	const found = pick(value, ...path);
	if (typeof found !== 'number')
		throw new Error(`response has no ${path.join('.')}`);
	return found;
}

const PNG = Buffer.from(
	'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
	'base64',
).toString('base64');

describeIfKey('discourse live', () => {
	jest.setTimeout(900_000);

	let client: Awaited<ReturnType<typeof createClient>> | undefined;
	// `unknown` because each operation takes its own input.
	type AnyOp = (input: unknown) => Promise<unknown>;
	const op = (id: string): AnyOp => {
		// `unknown` because the walk goes through nested groups of endpoints.
		let node: unknown = (client as NonNullable<typeof client>).corsair.discourse
			.api;
		for (const part of id.split('.')) {
			node = (node as Record<string, unknown>)[part];
		}
		return node as AnyOp;
	};
	const steps: Step[] = [];
	const cleanups: Array<{ what: string; run: () => Promise<unknown> }> = [];

	async function createClient() {
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'discourse', 'default');
		const corsair = createCorsair({
			plugins: [discourse({ key, siteUrl, username })],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		return { corsair, testDb };
	}

	/** One call; `expected` is an error that counts as the right answer, `either` accepts both. */
	async function step(
		id: string,
		input: unknown = {},
		expected?: RegExp,
		options: { either?: boolean } = {},
	): Promise<unknown> {
		try {
			const value = await op(id)(input);
			steps.push({
				id,
				ok: !expected || options.either === true,
				...(expected ? { note: 'no error' } : {}),
			});
			return value;
		} catch (error) {
			const note = (error as Error).message.slice(0, 240);
			const ok = expected?.test(note) ?? false;
			steps.push({ id, ok, expected: ok, note });
			return undefined;
		}
	}

	function later(what: string, run: () => Promise<unknown>) {
		cleanups.push({ what, run });
	}

	beforeAll(async () => {
		client = await createClient();
	});

	afterAll(async () => {
		const left: string[] = [];
		for (const item of cleanups.reverse()) {
			try {
				await item.run();
			} catch (error) {
				const message = (error as Error).message;
				if (!/Discourse 404/.test(message))
					left.push(`${item.what}: ${message}`);
			}
		}
		await client?.testDb.cleanup?.();
		if (left.length > 0)
			console.warn(`Discourse records left behind:\n${left.join('\n')}`);
		const report = process.env.DISCOURSE_LIVE_REPORT;
		if (report) writeFileSync(report, JSON.stringify({ steps, left }, null, 2));
		const failed = steps.filter((s) => !s.ok);
		const expectedErrors = steps.filter((s) => s.expected).length;
		const distinct = new Set(steps.map((s) => s.id)).size;
		console.log(
			`Discourse live: ${steps.length - failed.length}/${steps.length} ok (${expectedErrors} expected errors, ${distinct} operations)\n${failed
				.map((s) => `  ${s.id}: ${s.note}`)
				.join('\n')}`,
		);
		if (failed.length > 0 || left.length > 0) {
			throw new Error(
				`${failed.length} Discourse live steps failed, ${left.length} records left`,
			);
		}
	});

	it('reads every GET that takes no arguments', async () => {
		for (const id of NO_ARGUMENT_READS) {
			// The calendar (post event) plugin isn't on a stock forum.
			if (id.startsWith('events.'))
				await step(id, {}, /Discourse 404/, { either: true });
			else await step(id);
		}
		await step('users.listDirectory', { period: 'all', order: 'post_count' });
		await step('users.adminListByFlag', { flag: 'active', show_emails: true });
		await step('topics.listTop', { period: 'all' });
		await step('search.query', { q: 'welcome' });
	});

	let categoryId = 0;
	let categorySlug = '';
	let topicId = 0;
	let postId = 0;
	let replyId = 0;
	let otherUser = '';
	let otherId = 0;
	/** Users the run already deleted (or merged away). */
	const gone = new Set<number>();
	const goneTopics = new Set<number>();

	it('round-trips a category, a topic and its posts', async () => {
		const category = await step('categories.create', {
			name: `${NAME} cat`,
			color: '0088CC',
			text_color: 'FFFFFF',
		});
		categoryId = num(category, 'category', 'id');
		categorySlug = String(pick(category, 'category', 'slug'));
		later('category', () =>
			op('categories.update')({ id: categoryId, name: `${NAME} gone` }),
		);
		await step('categories.get', { id: categoryId });
		await step('categories.update', { id: categoryId, name: `${NAME} cat2` });

		const topic = await step('posts.create', {
			title: `Corsair plugin live test ${STAMP}`,
			raw: 'A topic the Corsair Discourse plugin made in its live run. It is deleted when the run ends.',
			category: categoryId,
			external_id: `corsair-${STAMP}`,
		});
		topicId = num(topic, 'topic_id');
		postId = num(topic, 'id');
		// A deleted topic answers a second delete with 422, not 404.
		later('topic', () =>
			goneTopics.has(topicId)
				? Promise.resolve()
				: op('topics.delete')({ id: topicId }),
		);
		await step('categories.listTopics', { slug: categorySlug, id: categoryId });
		await step('topics.get', { id: topicId });
		// A redirect to the forum's own hostname: through a port forward it can't be followed.
		await step(
			'topics.getByExternalId',
			{ external_id: `corsair-${STAMP}` },
			/fetch failed|Discourse 3\d\d/,
			{ either: true },
		);
		await step('topics.getPosts', { id: topicId, 'post_ids[]': [postId] });
		await step('topics.update', {
			id: topicId,
			topic: { title: `Corsair plugin live test renamed ${STAMP}` },
		});
		await step('topics.bookmark', { id: topicId });
		await step('topics.setNotificationLevel', {
			id: topicId,
			notification_level: '3',
		});
		await step('topics.updateTimestamp', {
			id: topicId,
			timestamp: String(Math.floor(Date.now() / 1000) - 3600),
		});
		await step('topics.createTimer', {
			id: topicId,
			time: '2099-01-01 00:00+00:00',
			status_type: 'close',
		});

		const reply = await step('posts.create', {
			topic_id: topicId,
			raw: 'A reply from the Corsair live run, deleted when the run ends.',
		});
		replyId = num(reply, 'id');
		await step('posts.get', { id: postId });
		await step('posts.update', {
			id: postId,
			post: {
				raw: 'Edited by the Corsair live run. Deleted when the run ends.',
				edit_reason: 'live test',
			},
		});
		await step('posts.listReplies', { id: postId });
		await step('posts.lock', { id: replyId, locked: 'true' });
		await step('posts.list', {});
		await step('topics.updateStatus', {
			id: topicId,
			status: 'closed',
			enabled: 'true',
		});
		await step('topics.updateStatus', {
			id: topicId,
			status: 'closed',
			enabled: 'false',
		});
	});

	it('creates users and moderates them', async () => {
		otherUser = `${NAME}u`;
		const created = await step('users.create', {
			name: 'Corsair Live User',
			email: `corsair-${STAMP}@example.com`,
			password: `Corsair-${STAMP}-pass-1A!`,
			username: otherUser,
			active: true,
			approved: true,
		});
		void created;
		// A forum with hide_email_address_taken on (the default now) never returns user_id.
		otherId = num(
			await step('users.get', { username: otherUser }),
			'user',
			'id',
		);
		later('user', () =>
			gone.has(otherId)
				? Promise.resolve()
				: op('users.delete')({ id: otherId, delete_posts: true }),
		);
		await step('users.adminGet', { id: otherId });
		await step('users.update', {
			username: otherUser,
			name: 'Corsair Live User 2',
		});
		await step('users.getEmails', { username: otherUser });
		await step('users.listActions', { offset: 0, username, filter: '4,5' });
		await step('users.refreshGravatar', { username: otherUser });
		await step(
			'users.getByExternalId',
			{ external_id: `ext-${STAMP}` },
			/Discourse 404/,
		);
		await step(
			'users.getByProviderExternalId',
			{ provider: 'google_oauth2', external_id: `ext-${STAMP}` },
			/Discourse 404/,
		);
		await step('users.sendPasswordResetEmail', { login: otherUser });
		await step(
			'users.changePassword',
			{
				token: 'not-a-real-token',
				username: otherUser,
				password: 'Another-pass-123!',
			},
			/Discourse (4\d\d)|invalid|expired/i,
			{ either: true },
		);
		await step('users.updateEmail', {
			username: otherUser,
			email: `corsair-e2-${STAMP}@example.com`,
		});

		// The private message goes to the new user.
		const pm = await step('posts.create', {
			title: `Corsair private message ${STAMP}`,
			raw: 'A private message from the Corsair live run. Deleted when the run ends.',
			archetype: 'private_message',
			target_recipients: otherUser,
		});
		const pmTopic = pick(pm, 'topic_id');
		// The admin started the message: inviting them again answers 422.
		if (typeof pmTopic === 'number') {
			await step(
				'topics.invite',
				{ id: pmTopic, user: username },
				/Discourse 422/,
				{ either: true },
			);
		}
		if (typeof pmTopic === 'number')
			later('private message', () => op('topics.delete')({ id: pmTopic }));
		await step('privateMessages.list', { username });
		await step('privateMessages.listSent', { username });
		await step('notifications.markRead', {});
	});

	it('round-trips tags, groups, badges and invites', async () => {
		await step('posts.create', {
			topic_id: topicId,
			raw: 'Tagging check from the Corsair live run.',
		});
		await step(
			'topics.update',
			{ id: topicId, topic: { tags: [`${NAME}-tag`] } },
			/Discourse 4\d\d/,
			{ either: true },
		);
		await step('tags.get', { name: `${NAME}-tag` }, /Discourse 404/, {
			either: true,
		});
		const tagGroup = await step('tags.createGroup', { name: `${NAME} tags` });
		const tagGroupId = pick(tagGroup, 'tag_group', 'id');
		if (typeof tagGroupId === 'number') {
			await step('tags.getGroup', { id: String(tagGroupId) });
			await step('tags.updateGroup', {
				id: String(tagGroupId),
				name: `${NAME} tags2`,
			});
		}

		const group = await step('groups.create', {
			group: { name: `${NAME}g`, full_name: 'Corsair live group' },
		});
		const groupId = num(group, 'basic_group', 'id');
		later('group', () => op('groups.delete')({ id: groupId }));
		await step('groups.get', { name: `${NAME}g` });
		await step('groups.getById', { id: String(groupId) });
		await step('groups.update', {
			id: groupId,
			group: { name: `${NAME}g`, bio_raw: 'Made by the Corsair live run.' },
		});
		await step('groups.addMembers', { id: groupId, usernames: otherUser });
		await step('groups.listMembers', { name: `${NAME}g` });
		await step('groups.removeMembers', { id: groupId, usernames: otherUser });
		// Regular topics refuse invites (422): the private message takes one.
		await step(
			'topics.invite',
			{ id: topicId, user: otherUser },
			/Discourse 422/,
		);
		await step(
			'topics.inviteGroup',
			{ id: topicId, group: `${NAME}g`, should_notify: false },
			/Discourse 4\d\d/,
			{ either: true },
		);
		await step('groups.delete', { id: groupId });

		const badge = await step('badges.create', {
			name: `${NAME} badge`,
			badge_type_id: 3,
		});
		const badgeId = num(badge, 'badge', 'id');
		later('badge', () => op('badges.delete')({ id: badgeId }));
		await step('badges.update', {
			id: badgeId,
			name: `${NAME} badge2`,
			badge_type_id: 3,
		});
		await step('badges.grant', {
			username: otherUser,
			badge_id: badgeId,
			suppress_notification: true,
		});
		await step('badges.listForUser', { username: otherUser });
		await step('badges.delete', { id: badgeId });

		await step('invites.create', {
			email: `corsair-invite-${STAMP}@example.com`,
			skip_email: true,
		});
		await step(
			'invites.createMultiple',
			{ email: [`corsair-inv2-${STAMP}@example.com`], skip_email: true },
			/Discourse 4\d\d/,
			{ either: true },
		);
	});

	it('uploads an image and refuses S3-only uploads on local storage', async () => {
		const upload = await step('uploads.create', {
			upload_type: 'avatar',
			user_id: otherId,
			synchronous: true,
			file: { base64: PNG, filename: 'avatar.png', contentType: 'image/png' },
		});
		const uploadId = pick(upload, 'id');
		if (typeof uploadId === 'number') {
			await step('users.updateAvatar', {
				username: otherUser,
				type: 'uploaded',
				upload_id: uploadId,
			});
		}
		const S3 = /Discourse (400|403|404|422)/;
		await step(
			'uploads.generatePresignedPut',
			{ type: 'composer', file_name: 'a.png', file_size: 68 },
			S3,
		);
		await step('uploads.completeExternal', { unique_identifier: 'nope' }, S3);
		await step(
			'uploads.createMultipart',
			{ upload_type: 'composer', file_name: 'a.zip', file_size: 10_000_000 },
			S3,
		);
		await step(
			'uploads.batchPresignMultipartParts',
			{ part_numbers: [1], unique_identifier: 'nope' },
			S3,
		);
		await step(
			'uploads.abortMultipart',
			{ external_upload_identifier: 'nope' },
			S3,
		);
		await step(
			'uploads.completeMultipart',
			{ unique_identifier: 'nope', parts: [{ part_number: 1, etag: 'x' }] },
			S3,
		);
	});

	it('likes, anonymizes, merges and deletes', async () => {
		// A like needs another user's post: the other user replies, the admin likes it.
		await step(
			'posts.performAction',
			{ id: replyId, post_action_type_id: 2 },
			/Discourse 403/,
			{ either: true },
		);
		const third = await step('users.create', {
			name: 'Corsair Merge Target',
			email: `corsair-m-${STAMP}@example.com`,
			password: `Corsair-${STAMP}-pass-2B!`,
			username: `${NAME}m`,
			active: true,
			approved: true,
		});
		void third;
		const thirdId = num(
			await step('users.get', { username: `${NAME}m` }),
			'user',
			'id',
		);
		later('merge target', () =>
			gone.has(thirdId)
				? Promise.resolve()
				: op('users.delete')({ id: thirdId, delete_posts: true }),
		);
		await step('users.deactivate', { id: otherId });
		await step('users.activate', { id: otherId });
		await step('users.suspend', {
			id: otherId,
			suspend_until: '2099-01-01',
			reason: 'Corsair live test',
		});
		await step('users.silence', {
			id: otherId,
			silenced_till: '2099-01-01',
			reason: 'Corsair live test',
		});
		await step('users.logOut', { id: otherId });
		const renamed = `${otherUser}x`;
		await step('users.updateUsername', {
			username: otherUser,
			new_username: renamed,
		});
		otherUser = renamed;
		// The topic goes before the merge moves the user's posts.
		await step('posts.delete', { id: replyId }, /Discourse 4\d\d/, {
			either: true,
		});
		if (await step('topics.delete', { id: topicId })) goneTopics.add(topicId);
		await step('users.anonymize', { id: otherId });
		const anon = await step('users.adminGet', { id: otherId });
		const anonName = String(pick(anon, 'username') ?? otherUser);
		await step('users.merge', { id: otherId, target_username: `${NAME}m` });
		void anonName;
		await step('users.delete', { id: thirdId, delete_posts: true });
		gone.add(thirdId);
		gone.add(otherId);
	});

	it('runs a backup and refuses a download without the emailed token', async () => {
		const before = (await step('backups.list')) as
			| Array<{ filename?: string }>
			| undefined;
		await step('backups.create', { with_uploads: false });
		let filename = before?.[0]?.filename;
		for (let i = 0; i < 30 && !filename; i++) {
			await new Promise((done) => setTimeout(done, 3000));
			const list = (await op('backups.list')({})) as Array<{
				filename?: string;
			}>;
			filename = list?.[0]?.filename;
		}
		if (filename) {
			await step('backups.sendDownloadEmail', { filename });
			await step(
				'backups.download',
				{ filename, token: 'not-the-emailed-token' },
				/Discourse (4\d\d)/,
				{ either: true },
			);
		}
	});
});
