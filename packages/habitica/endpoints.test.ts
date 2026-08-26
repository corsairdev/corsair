/**
 * Covers every operation: the method and path it calls, what it writes to the
 * local mirror, what it evicts, and exactly what reaches the event log.
 *
 * The coverage sweep at the end asserts that the operations exercised here are
 * precisely the operations registered, so an operation cannot be added without
 * a test.
 *
 * All ids, names and addresses are fictional. Nothing from the account used
 * during development appears here - it is a real account holding a real email
 * address, so no captured response was reused as a fixture.
 */
import { logEventFromContext } from 'corsair/core';
import {
	HABITICA_API_BASE,
	HABITICA_ROOT_BASE,
	HabiticaUserIdMissingError,
} from './client';
import {
	Auth,
	Challenges,
	Chat,
	Content,
	Exports,
	Groups,
	Tags,
	Tasks,
	User,
	Webhooks,
} from './endpoints';
import { HabiticaMirrorEvictionError } from './endpoints/persist';
import { HabiticaEndpointInputSchemas } from './endpoints/types';
import { habiticaEndpointMeta } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const USER_ID = '00000000-0000-4000-8000-000000000000';
const TASK = 'task-1';
const TAG = 'tag-1';
const CHALLENGE = 'challenge-1';
const GROUP = 'group-1';
const WEBHOOK = 'webhook-1';
const CHAT = 'chat-1';
const ITEM = 'item-1';
const MEMBER = 'member-1';

type Store = {
	upsertByEntityId: jest.Mock;
	deleteByEntityId: jest.Mock;
	list: jest.Mock;
};

function makeStore(): Store {
	return {
		upsertByEntityId: jest.fn(async () => undefined),
		deleteByEntityId: jest.fn(async () => true),
		list: jest.fn(async () => []),
	};
}

type Ctx = Parameters<typeof Tasks.list>[0];

/**
 * Builds the smallest context the endpoints actually read.
 *
 * The `as unknown as Ctx` cast is deliberate. A real `CorsairPluginContext`
 * carries the full ORM surface, hooks, permissions and auth machinery; the
 * endpoints here touch four members of it. Constructing the genuine article
 * would couple every endpoint test to core internals that have nothing to do
 * with the behaviour under test, and would break these tests whenever an
 * unrelated context field changed.
 */
function makeCtx() {
	const db = {
		tasks: makeStore(),
		tags: makeStore(),
		challenges: makeStore(),
		groups: makeStore(),
		webhooks: makeStore(),
	};
	const ctx = {
		key: 'test-token',
		db,
		options: { userId: USER_ID },
	} as unknown as Ctx;
	return { ctx, db };
}

let captured:
	| {
			url: string;
			method: string;
			body?: string;
			headers: Record<string, string>;
	  }
	| undefined;

function mockFetch(
	payload: unknown,
	{
		status = 200,
		contentType = 'application/json',
	}: { status?: number; contentType?: string } = {},
) {
	captured = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		const headers: Record<string, string> = {};
		const raw = init?.headers;
		if (raw instanceof Headers) {
			raw.forEach((value, key) => {
				headers[key.toLowerCase()] = value;
			});
		} else {
			for (const [key, value] of Object.entries(
				(raw ?? {}) as Record<string, string>,
			)) {
				headers[key.toLowerCase()] = value;
			}
		}
		captured = {
			url: String(url),
			method: init?.method ?? 'GET',
			body: typeof init?.body === 'string' ? init.body : undefined,
			headers,
		};
		const body =
			typeof payload === 'string' ? payload : JSON.stringify(payload);
		return {
			ok: status < 400,
			status,
			statusText: status < 400 ? 'OK' : 'Error',
			url: String(url),
			headers: new Headers({ 'Content-Type': contentType }),
			json: async () => payload,
			text: async () => body,
		};
	}) as unknown as typeof global.fetch;
}

/** The path Habitica was asked for, without the base URL or query string. */
function calledPath(): string {
	const url = captured?.url ?? '';
	const withoutBase = url
		.replace(`${HABITICA_API_BASE}/`, '')
		.replace(`${HABITICA_ROOT_BASE}/`, '');
	return withoutBase.split('?')[0] ?? '';
}

function query(): URLSearchParams {
	return new URL(captured?.url ?? 'https://x/').searchParams;
}

function sentBody(): Record<string, unknown> {
	return captured?.body ? JSON.parse(captured.body) : {};
}

/* -------------------------------------------------------------------------- */
/*                            Canned response bodies                          */
/* -------------------------------------------------------------------------- */

const wrap = (data: unknown) => ({ success: true, data });

const taskRecord = { id: TASK, _id: TASK, type: 'todo', text: 'A task' };
const tagRecord = { id: TAG, name: 'A tag' };
const challengeRecord = { id: CHALLENGE, _id: CHALLENGE, name: 'A challenge' };
const groupRecord = { id: GROUP, _id: GROUP, name: 'A group', type: 'party' };
const webhookRecord = {
	id: WEBHOOK,
	type: 'taskActivity',
	url: 'https://example.com/hook',
	enabled: true,
	failures: 0,
};

/**
 * Every operation, with the request it is expected to make.
 *
 * Driving this from a table keeps the 70 route assertions honest: the expected
 * method and path sit next to the call rather than being restated in prose.
 */
type Case = {
	/** The key in `habiticaEndpointMeta`, used by the coverage sweep. */
	meta: string;
	run: (ctx: Ctx) => Promise<unknown>;
	payload: unknown;
	method: string;
	path: string;
	contentType?: string;
};

const cases: Case[] = [
	// ---- tasks ----
	{
		meta: 'tasks.create',
		run: (c) => Tasks.create(c, { text: 'A task', type: 'todo' }),
		payload: wrap(taskRecord),
		method: 'POST',
		path: 'tasks/user',
	},
	{
		meta: 'tasks.list',
		run: (c) => Tasks.list(c, {}),
		payload: wrap([taskRecord]),
		method: 'GET',
		path: 'tasks/user',
	},
	{
		meta: 'tasks.get',
		run: (c) => Tasks.get(c, { taskId: TASK }),
		payload: wrap(taskRecord),
		method: 'GET',
		path: `tasks/${TASK}`,
	},
	{
		meta: 'tasks.update',
		run: (c) => Tasks.update(c, { taskId: TASK, text: 'Renamed' }),
		payload: wrap(taskRecord),
		method: 'PUT',
		path: `tasks/${TASK}`,
	},
	{
		meta: 'tasks.delete',
		run: (c) => Tasks.remove(c, { taskId: TASK }),
		payload: wrap({}),
		method: 'DELETE',
		path: `tasks/${TASK}`,
	},
	{
		meta: 'tasks.score',
		run: (c) => Tasks.score(c, { taskId: TASK, direction: 'up' }),
		payload: wrap({ delta: 1, gp: 2 }),
		method: 'POST',
		path: `tasks/${TASK}/score/up`,
	},
	{
		meta: 'tasks.move',
		run: (c) => Tasks.move(c, { taskId: TASK, position: 0 }),
		payload: wrap([TASK]),
		method: 'POST',
		path: `tasks/${TASK}/move/to/0`,
	},
	{
		meta: 'tasks.updateChecklistItem',
		run: (c) =>
			Tasks.updateChecklistItem(c, {
				taskId: TASK,
				itemId: ITEM,
				text: 'Renamed',
			}),
		payload: wrap(taskRecord),
		method: 'PUT',
		path: `tasks/${TASK}/checklist/${ITEM}`,
	},
	{
		meta: 'tasks.deleteChecklistItem',
		run: (c) => Tasks.deleteChecklistItem(c, { taskId: TASK, itemId: ITEM }),
		payload: wrap(taskRecord),
		method: 'DELETE',
		path: `tasks/${TASK}/checklist/${ITEM}`,
	},
	{
		meta: 'tasks.addTag',
		run: (c) => Tasks.addTag(c, { taskId: TASK, tagId: TAG }),
		payload: wrap(taskRecord),
		method: 'POST',
		path: `tasks/${TASK}/tags/${TAG}`,
	},
	{
		meta: 'tasks.createChallengeTask',
		run: (c) =>
			Tasks.createChallengeTask(c, {
				challengeId: CHALLENGE,
				text: 'A task',
				type: 'habit',
			}),
		payload: wrap([taskRecord]),
		method: 'POST',
		path: `tasks/challenge/${CHALLENGE}`,
	},
	{
		meta: 'tasks.listChallengeTasks',
		run: (c) => Tasks.listChallengeTasks(c, { challengeId: CHALLENGE }),
		payload: wrap([taskRecord]),
		method: 'GET',
		path: `tasks/challenge/${CHALLENGE}`,
	},
	{
		meta: 'tasks.unlinkAllChallengeTasks',
		run: (c) =>
			Tasks.unlinkAllChallengeTasks(c, {
				challengeId: CHALLENGE,
				keep: 'keep-all',
			}),
		payload: wrap({}),
		method: 'POST',
		path: `tasks/unlink-all/${CHALLENGE}`,
	},

	// ---- tags ----
	{
		meta: 'tags.create',
		run: (c) => Tags.create(c, { name: 'A tag' }),
		payload: wrap(tagRecord),
		method: 'POST',
		path: 'tags',
	},
	{
		meta: 'tags.list',
		run: (c) => Tags.list(c, {}),
		payload: wrap([tagRecord]),
		method: 'GET',
		path: 'tags',
	},
	{
		meta: 'tags.update',
		run: (c) => Tags.update(c, { tagId: TAG, name: 'Renamed' }),
		payload: wrap(tagRecord),
		method: 'PUT',
		path: `tags/${TAG}`,
	},
	{
		meta: 'tags.delete',
		run: (c) => Tags.remove(c, { tagId: TAG }),
		payload: wrap({}),
		method: 'DELETE',
		path: `tags/${TAG}`,
	},

	// ---- challenges ----
	{
		meta: 'challenges.create',
		run: (c) =>
			Challenges.create(c, {
				groupId: GROUP,
				name: 'A challenge',
				shortName: 'chal',
			}),
		payload: wrap(challengeRecord),
		method: 'POST',
		path: 'challenges',
	},
	{
		meta: 'challenges.get',
		run: (c) => Challenges.get(c, { challengeId: CHALLENGE }),
		payload: wrap(challengeRecord),
		method: 'GET',
		path: `challenges/${CHALLENGE}`,
	},
	{
		meta: 'challenges.clone',
		run: (c) => Challenges.clone(c, { challengeId: CHALLENGE }),
		payload: wrap(challengeRecord),
		method: 'POST',
		path: `challenges/${CHALLENGE}/clone`,
	},
	{
		meta: 'challenges.delete',
		run: (c) => Challenges.remove(c, { challengeId: CHALLENGE }),
		payload: wrap({}),
		method: 'DELETE',
		path: `challenges/${CHALLENGE}`,
	},
	{
		meta: 'challenges.join',
		run: (c) => Challenges.join(c, { challengeId: CHALLENGE }),
		payload: wrap(challengeRecord),
		method: 'POST',
		path: `challenges/${CHALLENGE}/join`,
	},
	{
		meta: 'challenges.leave',
		run: (c) => Challenges.leave(c, { challengeId: CHALLENGE }),
		payload: wrap({}),
		method: 'POST',
		path: `challenges/${CHALLENGE}/leave`,
	},
	{
		meta: 'challenges.listByGroup',
		run: (c) => Challenges.listByGroup(c, { groupId: GROUP }),
		payload: wrap([challengeRecord]),
		method: 'GET',
		path: `challenges/groups/${GROUP}`,
	},
	{
		meta: 'challenges.listForUser',
		run: (c) => Challenges.listForUser(c, { page: 0 }),
		payload: wrap([challengeRecord]),
		method: 'GET',
		path: 'challenges/user',
	},
	{
		meta: 'challenges.exportCsv',
		run: (c) => Challenges.exportCsv(c, { challengeId: CHALLENGE }),
		payload: 'task,value\nA task,1',
		method: 'GET',
		path: `challenges/${CHALLENGE}/export/csv`,
		contentType: 'text/csv',
	},

	// ---- groups ----
	{
		meta: 'groups.create',
		run: (c) => Groups.create(c, { name: 'A party', type: 'party' }),
		payload: wrap(groupRecord),
		method: 'POST',
		path: 'groups',
	},
	{
		meta: 'groups.list',
		run: (c) => Groups.list(c, { type: 'party' }),
		payload: wrap([groupRecord]),
		method: 'GET',
		path: 'groups',
	},
	{
		meta: 'groups.get',
		run: (c) => Groups.get(c, { groupId: GROUP }),
		payload: wrap(groupRecord),
		method: 'GET',
		path: `groups/${GROUP}`,
	},
	{
		meta: 'groups.getParty',
		run: (c) => Groups.getParty(c, {}),
		payload: wrap(groupRecord),
		method: 'GET',
		path: 'groups/party',
	},
	{
		meta: 'groups.getTavern',
		run: (c) => Groups.getTavern(c, {}),
		payload: wrap(groupRecord),
		method: 'GET',
		path: 'groups/habitrpg',
	},
	{
		meta: 'groups.update',
		run: (c) => Groups.update(c, { groupId: GROUP, name: 'Renamed' }),
		payload: wrap(groupRecord),
		method: 'PUT',
		path: `groups/${GROUP}`,
	},
	{
		meta: 'groups.leave',
		run: (c) => Groups.leave(c, { groupId: GROUP }),
		payload: wrap({}),
		method: 'POST',
		path: `groups/${GROUP}/leave`,
	},
	{
		meta: 'groups.listMembers',
		run: (c) => Groups.listMembers(c, { groupId: GROUP }),
		payload: wrap([{ id: MEMBER }]),
		method: 'GET',
		path: `groups/${GROUP}/members`,
	},
	{
		meta: 'groups.invite',
		run: (c) => Groups.invite(c, { groupId: GROUP, uuids: [MEMBER] }),
		payload: wrap([{}]),
		method: 'POST',
		path: `groups/${GROUP}/invite`,
	},
	{
		meta: 'groups.removeMember',
		run: (c) => Groups.removeMember(c, { groupId: GROUP, memberId: MEMBER }),
		payload: wrap({}),
		method: 'POST',
		path: `groups/${GROUP}/removeMember/${MEMBER}`,
	},
	{
		meta: 'groups.inviteToQuest',
		run: (c) => Groups.inviteToQuest(c, { groupId: GROUP, questKey: 'atom1' }),
		payload: wrap({}),
		method: 'POST',
		path: `groups/${GROUP}/quests/invite/atom1`,
	},

	// ---- chat ----
	{
		meta: 'chat.list',
		run: (c) => Chat.list(c, {}),
		payload: wrap([{ id: CHAT }]),
		method: 'GET',
		path: 'groups/party/chat',
	},
	{
		meta: 'chat.deleteMessage',
		run: (c) => Chat.deleteMessage(c, { groupId: GROUP, chatId: CHAT }),
		payload: wrap({}),
		method: 'DELETE',
		path: `groups/${GROUP}/chat/${CHAT}`,
	},
	{
		meta: 'chat.markSeen',
		run: (c) => Chat.markSeen(c, { groupId: GROUP }),
		payload: wrap({}),
		method: 'POST',
		path: `groups/${GROUP}/chat/seen`,
	},

	// ---- user ----
	{
		meta: 'user.get',
		run: (c) => User.get(c, {}),
		payload: wrap({ _id: USER_ID }),
		method: 'GET',
		path: 'user',
	},
	{
		meta: 'user.update',
		run: (c) => User.update(c, { updates: { 'profile.name': 'A name' } }),
		payload: wrap({}),
		method: 'PUT',
		path: 'user',
	},
	{
		meta: 'user.reset',
		run: (c) => User.reset(c, {}),
		payload: wrap({}),
		method: 'POST',
		path: 'user/reset',
	},
	{
		meta: 'user.equip',
		run: (c) => User.equip(c, { type: 'equipped', key: 'weapon_warrior_1' }),
		payload: wrap({}),
		method: 'POST',
		path: 'user/equip/equipped/weapon_warrior_1',
	},
	{
		meta: 'user.readCard',
		run: (c) => User.readCard(c, { cardType: 'birthday' }),
		payload: wrap({}),
		method: 'POST',
		path: 'user/read-card/birthday',
	},
	{
		meta: 'user.movePinnedItem',
		run: (c) => User.movePinnedItem(c, { path: 'armoire', position: 0 }),
		payload: wrap({}),
		method: 'POST',
		path: 'user/move-pinned-item/armoire/move/to/0',
	},
	{
		meta: 'user.deleteMessage',
		run: (c) => User.deleteMessage(c, { id: 'message-1' }),
		payload: wrap({}),
		method: 'DELETE',
		path: 'user/messages/message-1',
	},
	{
		meta: 'user.addPushDevice',
		run: (c) => User.addPushDevice(c, { regId: 'device-1', type: 'android' }),
		payload: wrap([{}]),
		method: 'POST',
		path: 'user/push-devices',
	},
	{
		meta: 'user.deletePushDevice',
		run: (c) => User.deletePushDevice(c, { regId: 'device-1' }),
		payload: wrap([]),
		method: 'DELETE',
		path: 'user/push-devices/device-1',
	},
	{
		meta: 'user.markNotificationSeen',
		run: (c) =>
			User.markNotificationSeen(c, { notificationId: 'notification-1' }),
		payload: wrap({}),
		method: 'POST',
		path: 'notifications/notification-1/see',
	},
	{
		meta: 'user.markNotificationsSeen',
		run: (c) =>
			User.markNotificationsSeen(c, { notificationIds: ['notification-1'] }),
		payload: wrap({}),
		method: 'POST',
		path: 'notifications/see',
	},

	// ---- auth ----
	{
		meta: 'auth.register',
		run: (c) =>
			Auth.register(c, {
				username: 'someone',
				email: 'someone@example.com',
				password: 'a-password',
				confirmPassword: 'a-password',
			}),
		payload: wrap({ id: USER_ID, apiToken: 'minted-token' }),
		method: 'POST',
		path: 'user/auth/local/register',
	},
	{
		meta: 'auth.login',
		run: (c) => Auth.login(c, { username: 'someone', password: 'a-password' }),
		payload: wrap({ id: USER_ID, apiToken: 'minted-token' }),
		method: 'POST',
		path: 'user/auth/local/login',
	},
	{
		meta: 'auth.social',
		run: (c) =>
			Auth.social(c, {
				network: 'google',
				authResponse: { code: 'an-oauth-code' },
			}),
		payload: wrap({ id: USER_ID, apiToken: 'minted-token' }),
		method: 'POST',
		path: 'user/auth/social',
	},

	// ---- webhooks ----
	{
		meta: 'webhooks.create',
		run: (c) => Webhooks.create(c, { url: 'https://example.com/hook' }),
		payload: wrap(webhookRecord),
		method: 'POST',
		path: 'user/webhook',
	},
	{
		meta: 'webhooks.list',
		run: (c) => Webhooks.list(c, {}),
		payload: wrap([webhookRecord]),
		method: 'GET',
		path: 'user/webhook',
	},
	{
		meta: 'webhooks.subscribe',
		run: (c) => Webhooks.subscribe(c, { id: WEBHOOK }),
		payload: wrap(webhookRecord),
		method: 'PUT',
		path: `user/webhook/${WEBHOOK}`,
	},

	// ---- content ----
	{
		meta: 'content.get',
		run: (c) => Content.get(c, {}),
		payload: wrap({ quests: {}, gear: {} }),
		method: 'GET',
		path: 'content',
	},
	{
		meta: 'content.getByType',
		run: (c) => Content.getByType(c, { filter: 'quests' }),
		payload: wrap({ gear: {} }),
		method: 'GET',
		path: 'content',
	},
	{
		meta: 'content.status',
		run: (c) => Content.status(c, {}),
		payload: wrap({ status: 'up' }),
		method: 'GET',
		path: 'status',
	},
	{
		meta: 'content.worldState',
		run: (c) => Content.worldState(c, {}),
		payload: wrap({ worldBoss: {} }),
		method: 'GET',
		path: 'world-state',
	},
	{
		meta: 'content.modelPaths',
		run: (c) => Content.modelPaths(c, { model: 'user' }),
		payload: wrap({ 'stats.hp': 'Number' }),
		method: 'GET',
		path: 'models/user/paths',
	},
	{
		meta: 'content.news',
		run: (c) => Content.news(c, {}),
		payload: wrap({ html: '<p>news</p>' }),
		method: 'GET',
		path: 'news',
	},
	{
		meta: 'content.dismissNews',
		run: (c) => Content.dismissNews(c, {}),
		payload: wrap({}),
		method: 'POST',
		path: 'news/tell-me-later',
	},
	{
		meta: 'content.marketGear',
		run: (c) => Content.marketGear(c, {}),
		payload: wrap({ categories: [] }),
		method: 'GET',
		path: 'shops/market-gear',
	},
	{
		meta: 'content.timeTravelers',
		run: (c) => Content.timeTravelers(c, {}),
		payload: wrap({ categories: [] }),
		method: 'GET',
		path: 'shops/time-travelers',
	},
	{
		meta: 'content.validateCoupon',
		run: (c) => Content.validateCoupon(c, { code: 'ABCD-1234' }),
		payload: wrap({ valid: true }),
		method: 'POST',
		path: 'coupons/validate/ABCD-1234',
	},

	// ---- exports ----
	{
		meta: 'exports.userData',
		run: (c) => Exports.userData(c, {}),
		payload: '{"tasks":[]}',
		method: 'GET',
		path: 'export/userdata.json',
	},
	{
		meta: 'exports.history',
		run: (c) => Exports.history(c, {}),
		payload: 'date,task\n2026-01-01,A task',
		method: 'GET',
		path: 'export/history.csv',
		contentType: 'text/csv',
	},
	{
		meta: 'exports.inbox',
		run: (c) => Exports.inbox(c, {}),
		payload: '<html></html>',
		method: 'GET',
		path: 'export/inbox.html',
		contentType: 'text/html',
	},
];

beforeEach(() => {
	mockLogEvent.mockClear();
});

describe('every operation calls the route it claims to', () => {
	for (const testCase of cases) {
		it(`${testCase.meta} -> ${testCase.method} /${testCase.path}`, async () => {
			const { ctx } = makeCtx();
			mockFetch(testCase.payload, { contentType: testCase.contentType });

			await testCase.run(ctx);

			expect(captured).toBeDefined();
			expect(captured?.method).toBe(testCase.method);
			expect(calledPath()).toBe(testCase.path);
		});
	}
});

describe('coverage sweep', () => {
	it('exercises precisely the operations that are registered', () => {
		const exercised = [...new Set(cases.map((c) => c.meta))].sort();
		const registered = Object.keys(habiticaEndpointMeta).sort();

		expect(exercised).toEqual(registered);
	});

	it('registers exactly the 70 operations the catalog lists', () => {
		expect(Object.keys(habiticaEndpointMeta)).toHaveLength(70);
	});
});

describe('mirroring', () => {
	it('caches a task it read', async () => {
		const { ctx, db } = makeCtx();
		mockFetch(wrap([taskRecord]));

		await Tasks.list(ctx, {});

		expect(db.tasks.upsertByEntityId).toHaveBeenCalledWith(
			TASK,
			expect.objectContaining({ id: TASK }),
		);
	});

	it('evicts a deleted task, and treats the eviction as required', async () => {
		const { ctx, db } = makeCtx();
		db.tasks.deleteByEntityId.mockRejectedValueOnce(new Error('db down'));
		mockFetch(wrap({}));

		// Habitica hard-deletes, so a mirror row that survives can never be
		// reconciled - the failure has to surface rather than be swallowed.
		await expect(Tasks.remove(ctx, { taskId: TASK })).rejects.toBeInstanceOf(
			HabiticaMirrorEvictionError,
		);
	});

	it('does not fail a read because the mirror could not be written', async () => {
		const { ctx, db } = makeCtx();
		db.tags.upsertByEntityId.mockRejectedValueOnce(new Error('db down'));
		mockFetch(wrap([tagRecord]));

		await expect(Tags.list(ctx, {})).resolves.toHaveLength(1);
	});

	it('skips caching a record the schema does not recognise', async () => {
		const { ctx, db } = makeCtx();
		// No id at all: the entity requires the primary key.
		mockFetch(wrap([{ text: 'a task with no id' }]));

		await Tasks.list(ctx, {});

		expect(db.tasks.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('empties the mirrored task list after an account reset', async () => {
		const { ctx, db } = makeCtx();
		db.tasks.list.mockResolvedValueOnce([
			{ entity_id: 'task-a' },
			{ entity_id: 'task-b' },
		]);
		mockFetch(wrap({}));

		await User.reset(ctx, {});

		// The reset deletes every task server-side and names none of them, so
		// without this the mirror would keep answering with all of them.
		expect(db.tasks.deleteByEntityId).toHaveBeenCalledWith('task-a');
		expect(db.tasks.deleteByEntityId).toHaveBeenCalledWith('task-b');
	});

	it('does not persist group chat, webhook urls, or undeclared keys', async () => {
		const { ctx, db } = makeCtx();
		mockFetch(
			wrap({
				id: GROUP,
				name: 'A group',
				chat: [{ text: 'other people talking' }],
				aKeyNobodyDeclared: 1,
			}),
		);
		await Groups.get(ctx, { groupId: GROUP });
		const groupRow = db.groups.upsertByEntityId.mock.calls[0]?.[1] as Record<
			string,
			unknown
		>;
		expect(groupRow).not.toHaveProperty('chat');
		expect(groupRow).not.toHaveProperty('aKeyNobodyDeclared');
		expect(groupRow.id).toBe(GROUP);

		mockFetch(
			wrap({
				...webhookRecord,
				aKeyNobodyDeclared: 1,
			}),
		);
		await Webhooks.create(ctx, { url: 'https://example.com/hook' });
		const hookRow = db.webhooks.upsertByEntityId.mock.calls[0]?.[1] as Record<
			string,
			unknown
		>;
		expect(hookRow).not.toHaveProperty('url');
		expect(hookRow).not.toHaveProperty('aKeyNobodyDeclared');
		expect(hookRow.id).toBe(WEBHOOK);
	});

	it('does not mirror anything the user document touches', async () => {
		const { ctx, db } = makeCtx();
		mockFetch(
			wrap({ _id: USER_ID, auth: { local: { email: 'x@example.com' } } }),
		);

		await User.get(ctx, {});

		for (const store of Object.values(db)) {
			expect(store.upsertByEntityId).not.toHaveBeenCalled();
		}
	});
});

describe('what reaches the event log', () => {
	/** The payload the endpoint handed to the event log. */
	function loggedPayload(): Record<string, unknown> {
		return (mockLogEvent.mock.calls[0]?.[2] ?? {}) as Record<string, unknown>;
	}

	it('records a task id but never the task text', async () => {
		const { ctx } = makeCtx();
		mockFetch(wrap(taskRecord));

		await Tasks.update(ctx, {
			taskId: TASK,
			text: 'Ring the clinic about the results',
			notes: 'private note',
		});

		const payload = JSON.stringify(loggedPayload());
		expect(payload).toContain(TASK);
		expect(payload).not.toContain('Ring the clinic');
		expect(payload).not.toContain('private note');
	});

	it('records only field names for the fields it does not name', async () => {
		const { ctx } = makeCtx();
		mockFetch(wrap(taskRecord));

		await Tasks.update(ctx, { taskId: TASK, text: 'secret text' });

		expect(loggedPayload().fields).toEqual(
			expect.arrayContaining(['taskId', 'text']),
		);
	});

	it('records nothing but the attempt for the credential-minting operations', async () => {
		for (const run of [
			(c: Ctx) =>
				Auth.login(c, { username: 'someone', password: 'hunter2-example' }),
			(c: Ctx) =>
				Auth.register(c, {
					username: 'someone',
					email: 'someone@example.com',
					password: 'hunter2-example',
					confirmPassword: 'hunter2-example',
				}),
			(c: Ctx) =>
				Auth.social(c, {
					network: 'google',
					authResponse: { code: 'an-oauth-code' },
				}),
		]) {
			mockLogEvent.mockClear();
			const { ctx } = makeCtx();
			mockFetch(wrap({ id: USER_ID, apiToken: 'minted-token' }));

			await run(ctx);

			const payload = JSON.stringify(loggedPayload());
			expect(payload).not.toContain('hunter2-example');
			expect(payload).not.toContain('someone@example.com');
			expect(payload).not.toContain('an-oauth-code');
			// Not even the field NAMES, which is stricter than every other
			// operation: `fields: ["username","password"]` in a retained log is an
			// invitation to widen it into the values later.
			expect(payload).not.toContain('password');
			expect(payload).not.toContain('fields');
		}
	});

	it('never logs a minted token', async () => {
		const { ctx } = makeCtx();
		mockFetch(wrap({ id: USER_ID, apiToken: 'minted-token' }));

		await Auth.login(ctx, { username: 'someone', password: 'a-password' });

		expect(JSON.stringify(loggedPayload())).not.toContain('minted-token');
	});

	it('counts group invitees rather than naming them', async () => {
		const { ctx } = makeCtx();
		mockFetch(wrap([{}]));

		await Groups.invite(ctx, {
			groupId: GROUP,
			emails: [{ email: 'someone@example.com' }],
			usernames: ['someone'],
		});

		const payload = loggedPayload();
		expect(payload.emails).toBe(1);
		expect(payload.usernames).toBe(1);
		expect(JSON.stringify(payload)).not.toContain('someone@example.com');
	});

	it('does not log a coupon code, which is a bearer instrument', async () => {
		const { ctx } = makeCtx();
		mockFetch(wrap({ valid: true }));

		await Content.validateCoupon(ctx, { code: 'SECRET-COUPON-1234' });

		expect(JSON.stringify(loggedPayload())).not.toContain('SECRET-COUPON');
	});

	it('does not log a push device registration id', async () => {
		const { ctx } = makeCtx();
		mockFetch(wrap([{}]));

		await User.addPushDevice(ctx, { regId: 'device-token-abc', type: 'ios' });

		expect(JSON.stringify(loggedPayload())).not.toContain('device-token-abc');
	});

	it('logs user update paths but not their values', async () => {
		const { ctx } = makeCtx();
		mockFetch(wrap({}));

		await User.update(ctx, {
			updates: { 'profile.name': 'A Real Name', 'profile.blurb': 'about me' },
		});

		const payload = loggedPayload();
		expect(payload.paths).toEqual(['profile.name', 'profile.blurb']);
		expect(JSON.stringify(payload)).not.toContain('A Real Name');
	});

	it('records only the size of an export, never its contents', async () => {
		const { ctx } = makeCtx();
		mockFetch('{"auth":{"local":{"email":"someone@example.com"}}}');

		await Exports.userData(ctx, {});

		const payload = loggedPayload();
		expect(typeof payload.bytes).toBe('number');
		expect(JSON.stringify(payload)).not.toContain('someone@example.com');
	});

	it('never logs chat message text', async () => {
		const { ctx } = makeCtx();
		mockFetch(wrap([{ id: CHAT, text: 'something private someone said' }]));

		await Chat.list(ctx, {});

		expect(JSON.stringify(loggedPayload())).not.toContain('something private');
	});
});

describe('secrets interpolated into a path', () => {
	/** Fails the request so the thrown error can be inspected. */
	function mockFailure(status: number, url: string) {
		global.fetch = (async (requested: unknown) =>
			({
				ok: false,
				status,
				statusText: 'Error',
				url: String(requested ?? url),
				headers: new Headers({ 'Content-Type': 'application/json' }),
				json: async () => ({ success: false, error: 'NotFound' }),
				text: async () => '{}',
			}) as unknown as Response) as unknown as typeof global.fetch;
	}

	/**
	 * Returns the error a call rejected with, and fails loudly if it did not
	 * reject at all.
	 *
	 * Without this the redaction assertions below are vacuous: `not.toContain`
	 * passes just as happily against a resolved value as against a redacted
	 * error. Verified by making the mocked request succeed - both checks still
	 * passed, proving they were asserting nothing.
	 */
	const RESOLVED = Symbol('resolved');
	async function rejection(promise: Promise<unknown>): Promise<unknown> {
		const outcome = await promise.then(
			() => RESOLVED,
			(error: unknown) => error,
		);
		if (outcome === RESOLVED) {
			throw new Error(
				'expected the call to reject; it resolved, so the assertions that follow would prove nothing',
			);
		}
		return outcome;
	}

	/** Everywhere the secret could hide on the way to a log. */
	const serialise = (error: unknown) =>
		[
			(error as Error)?.message,
			JSON.stringify(error),
			String((error as { url?: string })?.url ?? ''),
			String((error as { request?: { url?: string } })?.request?.url ?? ''),
		].join(' ');

	it('keeps a coupon code out of the thrown error', async () => {
		// A valid coupon is a bearer instrument. The shared transport redacts
		// sensitive query parameters but not path segments, and Habitica takes
		// the code as a path parameter.
		const { ctx } = makeCtx();
		mockFailure(404, 'https://habitica.com/api/v3/coupons/validate/x');

		const error = await rejection(
			Content.validateCoupon(ctx, { code: 'SECRET-COUPON-1234' }),
		);

		expect(error).toBeInstanceOf(Error);
		// The status survives redaction, so error-handlers can still classify it.
		expect((error as { status?: number }).status).toBe(404);
		expect(serialise(error)).not.toContain('SECRET-COUPON-1234');
	});

	it('keeps a push-device registration id out of the thrown error', async () => {
		const { ctx } = makeCtx();
		mockFailure(404, 'https://habitica.com/api/v3/user/push-devices/x');

		const error = await rejection(
			User.deletePushDevice(ctx, { regId: 'device-token-abcdef' }),
		);

		expect(error).toBeInstanceOf(Error);
		expect((error as { status?: number }).status).toBe(404);
		expect(serialise(error)).not.toContain('device-token-abcdef');
	});

	it('stays diagnosable after redaction', async () => {
		// Redaction must not cost an operator the ability to tell which call
		// failed. The transport's message is often just "Not Found" and the
		// detail lives in the URL, so the masked URL is folded into the message.
		const { ctx } = makeCtx();
		mockFailure(404, 'https://habitica.com/api/v3/coupons/validate/x');

		const error = await rejection(
			Content.validateCoupon(ctx, { code: 'SECRET-COUPON-1234' }),
		);

		const message = (error as Error).message;
		expect(message).toContain('coupons/validate');
		expect(message).toContain('[REDACTED]');
		expect(message).not.toContain('SECRET-COUPON-1234');
	});

	it('passes through an error that never carried the secret', async () => {
		// Redaction rebuilds the error only when the value actually leaked. A
		// missing user id fails before any request, so nothing needs masking and
		// the original error type must survive.
		const ctx = {
			key: 'test-token',
			db: {},
			options: {},
		} as unknown as Ctx;

		const error = await rejection(
			Content.validateCoupon(ctx, { code: 'SECRET-COUPON-1234' }),
		);

		expect(error).toBeInstanceOf(HabiticaUserIdMissingError);
	});
});

describe('the credential-minting operations send their body', () => {
	// These POST through the anonymous transport. An earlier version dropped the
	// body there, so registration and login were sent empty - and asserting the
	// method and path alone did not notice.
	it('auth.login sends the credentials', async () => {
		const { ctx } = makeCtx();
		mockFetch(wrap({ id: USER_ID, apiToken: 'minted-token' }));

		await Auth.login(ctx, { username: 'someone', password: 'a-password' });

		expect(sentBody()).toEqual({
			username: 'someone',
			password: 'a-password',
		});
	});

	it('auth.register sends every required field', async () => {
		const { ctx } = makeCtx();
		mockFetch(wrap({ id: USER_ID, apiToken: 'minted-token' }));

		await Auth.register(ctx, {
			username: 'someone',
			email: 'someone@example.com',
			password: 'a-password',
			confirmPassword: 'a-password',
		});

		// The whole payload, not just its keys: a key check would pass against
		// empty strings or values swapped between fields, and an empty body was
		// exactly the bug this test exists to catch.
		expect(sentBody()).toEqual({
			username: 'someone',
			email: 'someone@example.com',
			password: 'a-password',
			confirmPassword: 'a-password',
		});
	});

	it('auth.social sends the provider response', async () => {
		const { ctx } = makeCtx();
		mockFetch(wrap({ id: USER_ID, apiToken: 'minted-token' }));

		await Auth.social(ctx, {
			network: 'google',
			authResponse: { code: 'an-oauth-code' },
		});

		expect(sentBody()).toEqual({
			network: 'google',
			authResponse: { code: 'an-oauth-code' },
		});
	});
});

describe('the aliases that share one route', () => {
	it('getParty and getTavern differ only in the group id', async () => {
		const { ctx } = makeCtx();

		mockFetch(wrap(groupRecord));
		await Groups.getParty(ctx, {});
		const partyPath = calledPath();

		mockFetch(wrap(groupRecord));
		await Groups.getTavern(ctx, {});
		const tavernPath = calledPath();

		expect(partyPath).toBe('groups/party');
		expect(tavernPath).toBe('groups/habitrpg');
	});

	it('gives each alias its own audit event so a log stays readable', async () => {
		const { ctx } = makeCtx();

		mockFetch(wrap(groupRecord));
		await Groups.get(ctx, { groupId: GROUP });
		const generic = mockLogEvent.mock.calls[0]?.[1];

		mockLogEvent.mockClear();
		mockFetch(wrap(groupRecord));
		await Groups.getParty(ctx, {});
		const party = mockLogEvent.mock.calls[0]?.[1];

		expect(generic).toBe('habitica.groups.get');
		expect(party).toBe('habitica.groups.getParty');
		expect(generic).not.toBe(party);
	});

	it('content.get and content.getByType are one route, split by a parameter', async () => {
		const { ctx } = makeCtx();

		mockFetch(wrap({ quests: {} }));
		await Content.get(ctx, {});
		expect(calledPath()).toBe('content');
		expect(query().get('filter')).toBeNull();

		mockFetch(wrap({ gear: {} }));
		await Content.getByType(ctx, { filter: 'quests' });
		expect(calledPath()).toBe('content');
		expect(query().get('filter')).toBe('quests');
	});
});

describe('the group leave that is not a composite', () => {
	it('issues exactly one request and never attempts a DELETE', async () => {
		// The catalog describes a fallback to DELETE /groups/:groupId. That route
		// does not exist - a live DELETE answers "Not found.", the response for an
		// unrouted path, while a real route with a missing id answers "Group not
		// found or you don't have access." Implementing the fallback would add a
		// request that can only ever 404.
		const calls: { method: string; url: string }[] = [];
		global.fetch = (async (url: unknown, init?: RequestInit) => {
			calls.push({ method: init?.method ?? 'GET', url: String(url) });
			return {
				ok: true,
				status: 200,
				statusText: 'OK',
				url: String(url),
				headers: new Headers({ 'Content-Type': 'application/json' }),
				json: async () => wrap({}),
				text: async () => JSON.stringify(wrap({})),
			};
		}) as unknown as typeof global.fetch;

		const { ctx } = makeCtx();
		await Groups.leave(ctx, { groupId: GROUP });

		expect(calls).toHaveLength(1);
		expect(calls[0]?.method).toBe('POST');
		expect(calls.some((c) => c.method === 'DELETE')).toBe(false);
	});
});

describe('request construction', () => {
	it('percent-encodes values interpolated into a path', async () => {
		// A coupon code or quest key is not an opaque id and can contain
		// characters that would otherwise change which route is addressed.
		const { ctx } = makeCtx();
		mockFetch(wrap({ valid: false }));

		await Content.validateCoupon(ctx, { code: 'a/b?c' });

		expect(captured?.url).toContain('coupons/validate/a%2Fb%3Fc');
		expect(calledPath()).toBe('coupons/validate/a%2Fb%3Fc');
	});

	it('omits unset optional query parameters rather than sending undefined', async () => {
		const { ctx } = makeCtx();
		mockFetch(wrap([taskRecord]));

		await Tasks.list(ctx, { type: 'todos' });

		expect(query().get('type')).toBe('todos');
		expect(query().has('dueDate')).toBe(false);
	});

	it('rejects a members list limit above 60', () => {
		expect(
			HabiticaEndpointInputSchemas.groupsListMembers.safeParse({
				groupId: GROUP,
				limit: 61,
			}).success,
		).toBe(false);
		expect(
			HabiticaEndpointInputSchemas.groupsListMembers.safeParse({
				groupId: GROUP,
				limit: 5,
			}).success,
		).toBe(true);
	});

	it('normalizes a single challenge-task create into an array', async () => {
		const { ctx, db } = makeCtx();
		mockFetch(wrap(taskRecord));

		const result = await Tasks.createChallengeTask(ctx, {
			challengeId: CHALLENGE,
			text: 'A task',
			type: 'habit',
		});

		expect(result).toEqual([expect.objectContaining({ id: TASK })]);
		expect(db.tasks.upsertByEntityId).toHaveBeenCalledWith(
			TASK,
			expect.objectContaining({ id: TASK }),
		);
	});

	it('omits unset optional body fields', async () => {
		const { ctx } = makeCtx();
		mockFetch(wrap(taskRecord));

		await Tasks.update(ctx, { taskId: TASK, text: 'Renamed' });

		const body = sentBody();
		expect(body.text).toBe('Renamed');
		expect('notes' in body).toBe(false);
		// The path parameter must not be duplicated into the body.
		expect('taskId' in body).toBe(false);
	});

	it('sends challenges.create with the group under the key the API expects', async () => {
		const { ctx } = makeCtx();
		mockFetch(wrap(challengeRecord));

		await Challenges.create(ctx, {
			groupId: GROUP,
			name: 'A challenge',
			shortName: 'chal',
		});

		// The input names it `groupId`; Habitica's body field is `group`.
		expect(sentBody().group).toBe(GROUP);
		expect('groupId' in sentBody()).toBe(false);
	});

	it('unwraps the success envelope rather than returning it', async () => {
		const { ctx } = makeCtx();
		mockFetch(wrap([tagRecord]));

		const result = await Tags.list(ctx, {});

		expect(Array.isArray(result)).toBe(true);
		expect(result[0]?.id).toBe(TAG);
	});

	it('fails before making a request when no user id can be resolved', async () => {
		mockFetch(wrap({}));
		const ctx = {
			key: 'test-token',
			db: {},
			options: {},
		} as unknown as Ctx;

		await expect(Tags.list(ctx, {})).rejects.toBeInstanceOf(
			HabiticaUserIdMissingError,
		);
		expect(captured).toBeUndefined();
	});

	it('prefers a configured user id over a stored key', async () => {
		mockFetch(wrap([]));
		const ctx = {
			key: 'test-token',
			db: {},
			options: { userId: USER_ID },
			keys: { get_user_id: jest.fn(async () => 'stored-user-id') },
		} as unknown as Ctx;

		await Tags.list(ctx, {});

		expect(captured?.headers['x-api-user']).toBe(USER_ID);
	});

	it('falls back to the stored user id when none is configured', async () => {
		mockFetch(wrap([]));
		const ctx = {
			key: 'test-token',
			db: {},
			options: {},
			keys: { get_user_id: jest.fn(async () => 'stored-user-id') },
		} as unknown as Ctx;

		await Tags.list(ctx, {});

		expect(captured?.headers['x-api-user']).toBe('stored-user-id');
	});
});

describe('risk levels', () => {
	it('marks every irreversible operation destructive', () => {
		// Habitica hard-deletes: there is no soft-delete flag and no trash, so
		// these cannot be undone.
		for (const key of [
			'tasks.delete',
			'tags.delete',
			'challenges.delete',
			'chat.deleteMessage',
			'user.deleteMessage',
			'user.reset',
			'tasks.unlinkAllChallengeTasks',
		]) {
			expect(
				habiticaEndpointMeta[key as keyof typeof habiticaEndpointMeta]
					.riskLevel,
			).toBe('destructive');
		}
	});

	it('marks scoring a write, because replaying it scores again', () => {
		expect(habiticaEndpointMeta['tasks.score'].riskLevel).toBe('write');
	});

	it('marks the pure reads read', () => {
		for (const key of [
			'tasks.list',
			'tags.list',
			'content.get',
			'content.status',
			'exports.userData',
		]) {
			expect(
				habiticaEndpointMeta[key as keyof typeof habiticaEndpointMeta]
					.riskLevel,
			).toBe('read');
		}
	});
});
