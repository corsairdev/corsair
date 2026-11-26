import { logEventFromContext } from 'corsair/core';
import {
	Comments,
	Discussions,
	Groups,
	Memberships,
	Polls,
	Reports,
	Search,
	Server,
	Threads,
	Webhooks,
} from './endpoints';
import { comment, discussion, poll, topic } from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

// Request and response checks for the operations added on top of the first
// twelve. Shapes follow Loomio's OpenAPI contract
// (docs/help/en/user_manual/integrations/api/openapi.yaml) and the
// Api::User0 / Api::Server0 controllers.

type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: the input is exactly what a caller may pass; the endpoint parses it.
function invoke(
	endpoint: AnyEndpoint,
	input: unknown,
	ctx: Record<string, unknown> = { key: 'k' },
) {
	return endpoint(ctx as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		url: parsed.origin + parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

const USER = 'https://www.loomio.com/api/user0';
const SELF = {
	key: 'server-key',
	options: { baseUrl: 'https://loomio.example.org' },
};
const SERVER = 'https://loomio.example.org/api/server0';

const serverUser = {
	id: 5,
	name: 'Ada',
	username: 'ada',
	email: 'ada@example.org',
	is_admin: false,
	active: true,
	deactivated_at: null,
	identities: [
		{ id: 1, identity_type: 'saml', uid: 'ada-1', email: null, name: null },
	],
};

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('installation origin', () => {
	it('uses the account base_url when no option is set', async () => {
		respond({ groups: [], meta: { root: 'groups', total: 0 } });
		const get_base_url = jest
			.fn()
			.mockResolvedValue('https://loomio.coop.example');

		await invoke(
			Groups.list,
			{},
			{ key: 'k', options: {}, keys: { get_base_url } },
		);

		expect(lastRequest().url).toBe(
			'https://loomio.coop.example/api/user0/groups',
		);
	});

	it('falls back to www.loomio.com when the account has none', async () => {
		respond({ groups: [], meta: { root: 'groups', total: 0 } });
		const get_base_url = jest.fn().mockResolvedValue(null);

		await invoke(
			Groups.list,
			{},
			{ key: 'k', options: {}, keys: { get_base_url } },
		);

		expect(lastRequest().url).toBe(`${USER}/groups`);
	});

	it('refuses an account base_url that would send the key over http', async () => {
		const get_base_url = jest.fn().mockResolvedValue('http://evil.example');

		await expect(
			invoke(
				Groups.list,
				{},
				{ key: 'k', options: {}, keys: { get_base_url } },
			),
		).rejects.toThrow(/base_url/);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('related-record controls', () => {
	it('sends compact=1 and space-joined exclude_types on reads', async () => {
		respond({
			discussions: [discussion],
			meta: { root: 'discussions', total: 1 },
		});

		await invoke(Discussions.list, {
			group_id: 12,
			compact: true,
			exclude_types: ['group', 'reaction'],
		});

		expect(lastRequest().query).toEqual({
			group_id: '12',
			compact: '1',
			exclude_types: 'group reaction',
		});
	});

	it('omits both when unset', async () => {
		respond({ polls: [poll] });
		await invoke(Polls.get, { id: 63 });
		expect(lastRequest().query).toEqual({});
	});
});

describe('discussions edit and delete', () => {
	it('PATCHes the editable fields without the id in the body', async () => {
		respond({ discussions: [{ ...discussion, title: 'New' }] });

		const result = (await invoke(Discussions.update, {
			id: 88,
			title: 'New',
			description_format: 'md',
			recipient_audience: null,
		})) as { discussion: { title: string } };

		expect(lastRequest()).toMatchObject({
			url: `${USER}/discussions/88`,
			method: 'PATCH',
			body: {
				title: 'New',
				description_format: 'md',
				recipient_audience: null,
			},
		});
		expect(lastRequest().body).not.toHaveProperty('id');
		expect(result.discussion.title).toBe('New');
	});

	it('DELETEs (soft) and returns the discarded record', async () => {
		respond({
			discussions: [{ ...discussion, discarded_at: '2026-11-26T00:00:00Z' }],
		});

		const result = (await invoke(Discussions.remove, { id: 88 })) as {
			discussion: { discarded_at: string };
		};

		expect(lastRequest()).toMatchObject({
			url: `${USER}/discussions/88`,
			method: 'DELETE',
		});
		expect(result.discussion.discarded_at).toBeTruthy();
	});

	it('fails loudly when a delete answers without the record', async () => {
		respond({ discussions: [] });
		await expect(invoke(Discussions.remove, { id: 88 })).rejects.toThrow();
	});
});

describe('comments', () => {
	it('posts a reply with parent_type Comment', async () => {
		respond({ comments: [comment] });

		await invoke(Comments.create, {
			discussion_id: 88,
			parent_id: 301,
			body: 'Agree',
		});

		expect(lastRequest().body).toEqual({
			discussion_id: 88,
			parent_id: 301,
			parent_type: 'Comment',
			body: 'Agree',
		});
	});

	it('leaves parent_type out for a top-level comment', async () => {
		respond({ comments: [comment] });
		await invoke(Comments.create, { discussion_id: 88, body: 'Hi' });
		expect(lastRequest().body).toEqual({ discussion_id: 88, body: 'Hi' });
	});

	it('edits and soft-deletes a comment', async () => {
		respond({ comments: [comment] });
		await invoke(Comments.update, {
			id: 301,
			body: 'Edited',
			body_format: 'md',
		});
		expect(lastRequest()).toMatchObject({
			url: `${USER}/comments/301`,
			method: 'PATCH',
			body: { body: 'Edited', body_format: 'md' },
		});

		respond({ comments: [{ ...comment, body: null }] });
		const removed = (await invoke(Comments.remove, { id: 301 })) as {
			comment: { id: number };
		};
		expect(lastRequest()).toMatchObject({
			url: `${USER}/comments/301`,
			method: 'DELETE',
		});
		expect(removed.comment.id).toBe(comment.id);
	});
});

describe('polls edit and delete', () => {
	it('PATCHes option edits by id and removals with _destroy', async () => {
		respond({ polls: [poll] });

		await invoke(Polls.update, {
			id: 63,
			poll_options_attributes: [
				{ id: 456, meaning: 'Updated' },
				{ id: 457, _destroy: true },
				{ name: 'Abstain', icon: 'abstain', priority: 2 },
			],
		});

		expect(lastRequest()).toMatchObject({
			url: `${USER}/polls/63`,
			method: 'PATCH',
			body: {
				poll_options_attributes: [
					{ id: 456, meaning: 'Updated' },
					{ id: 457, _destroy: true },
					{ name: 'Abstain', icon: 'abstain', priority: 2 },
				],
			},
		});
	});

	it('sends details and vote-share settings on create', async () => {
		respond({ polls: [poll] });

		await invoke(Polls.create, {
			group_id: 12,
			title: 'Venue',
			poll_type: 'poll',
			details: 'Pick one',
			details_format: 'md',
			poll_options_attributes: [
				{
					name: 'Hall',
					test_operator: 'gte',
					test_percent: 50,
					test_against: 'voter_percent',
				},
			],
		});

		expect(lastRequest().body).toMatchObject({
			details: 'Pick one',
			details_format: 'md',
			poll_options_attributes: [
				{
					name: 'Hall',
					test_operator: 'gte',
					test_percent: 50,
					test_against: 'voter_percent',
				},
			],
		});
	});

	it('reads user0 poll field names', async () => {
		respond({
			polls: [{ ...poll, score_min: 0, score_max: 9, points_per_voter: 8 }],
		});
		const result = (await invoke(Polls.get, { id: 63 })) as {
			poll: { score_min: number; score_max: number; points_per_voter: number };
		};
		expect(result.poll).toMatchObject({
			score_min: 0,
			score_max: 9,
			points_per_voter: 8,
		});
	});

	it('accepts decimal-string totals and a string STV quota', async () => {
		respond({
			polls: [
				{
					...poll,
					total_score: '12.5',
					quorum_threshold: '3.334',
					quorum_shortfall: '-0.666',
					stv_quota: 'droop',
				},
			],
		});
		const result = (await invoke(Polls.get, { id: 63 })) as {
			poll: { total_score: string; stv_quota: string };
		};
		expect(result.poll).toMatchObject({
			total_score: '12.5',
			stv_quota: 'droop',
		});
	});

	it('soft-deletes a poll', async () => {
		respond({ polls: [poll] });
		await invoke(Polls.remove, { id: 63 });
		expect(lastRequest()).toMatchObject({
			url: `${USER}/polls/63`,
			method: 'DELETE',
		});
	});
});

describe('threads.get', () => {
	it('reads one thread into `thread`', async () => {
		respond({
			threads: [topic],
			discussions: [discussion],
			meta: { root: 'threads' },
		});

		const result = (await invoke(Threads.get, { topic_id: 55 })) as {
			thread: { id: number };
		};

		expect(lastRequest()).toMatchObject({
			url: `${USER}/threads/55`,
			method: 'GET',
		});
		expect(result.thread.id).toBe(topic.id);
	});
});

describe('memberships', () => {
	it('lists a page with next_offset', async () => {
		respond({
			memberships: [{ id: 1, group_id: 12, user_id: 7, admin: true }],
			users: [],
			meta: { root: 'memberships', total: 3 },
		});

		const result = (await invoke(Memberships.list, {
			group_id: 12,
			limit: 1,
		})) as {
			next_offset?: number;
		};

		expect(lastRequest()).toMatchObject({
			url: `${USER}/memberships`,
			query: { group_id: '12', limit: '1' },
		});
		expect(result.next_offset).toBe(1);
	});

	it('sends remove_absent as 1, which the controller reads with to_i', async () => {
		respond({ memberships: [], meta: { total: 0 } });
		respond({
			added_emails: ['new@example.org'],
			removed_emails: ['old@example.org'],
		});

		const result = await invoke(Memberships.manage, {
			group_id: 12,
			emails: ['new@example.org'],
			remove_absent: true,
		});

		expect(lastRequest()).toMatchObject({
			url: `${USER}/memberships`,
			method: 'POST',
			body: { group_id: 12, emails: ['new@example.org'], remove_absent: 1 },
		});
		expect(result).toEqual({
			added_emails: ['new@example.org'],
			removed_emails: ['old@example.org'],
		});
		// Emails never reach the event log.
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain('example.org');
	});

	it('sends the stored spelling so a case-only difference never revokes a member', async () => {
		respond({
			memberships: [
				{ id: 1, user_email: 'Ada@Example.org' },
				{ id: 2, user_email: 'grace@example.org' },
			],
			meta: { total: 3 },
		});
		respond({
			memberships: [{ id: 3, user_email: 'old@example.org' }],
			meta: { total: 3 },
		});
		respond({ added_emails: ['new@example.org'], removed_emails: [] });

		await invoke(Memberships.manage, {
			group_id: 12,
			emails: ['ada@EXAMPLE.org', 'GRACE@example.org', 'new@example.org'],
			remove_absent: true,
		});

		const [first, second] = fetchMock.mock.calls.map(
			([url]) => new URL(String(url)),
		);
		expect(first?.pathname).toBe('/api/user0/memberships');
		expect(Object.fromEntries(first?.searchParams ?? [])).toMatchObject({
			group_id: '12',
			offset: '0',
			limit: '500',
		});
		expect(second?.searchParams.get('offset')).toBe('2');
		expect(fetchMock).toHaveBeenCalledTimes(3);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			body: {
				group_id: 12,
				emails: ['Ada@Example.org', 'grace@example.org', 'new@example.org'],
				remove_absent: 1,
			},
		});
	});

	it('skips the membership read when remove_absent is off', async () => {
		respond({ added_emails: ['Ada@EXAMPLE.org'], removed_emails: [] });
		await invoke(Memberships.manage, {
			group_id: 12,
			emails: ['Ada@EXAMPLE.org'],
		});
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(lastRequest().body).toMatchObject({ emails: ['Ada@EXAMPLE.org'] });
	});
});

describe('reports and search', () => {
	it('builds the report query with comma-joined group ids', async () => {
		respond({ users: [{ id: 456, name: 'Ada', threads: 2, votes_cast: 5 }] });

		const result = (await invoke(Reports.get, {
			section: 'users',
			group_scope: 'custom',
			group_ids: [123, 124],
			member_type: 'delegate',
			start_month: '2026-01',
			end_month: '2026-09',
		})) as { users: unknown[] };

		expect(lastRequest()).toMatchObject({
			url: `${USER}/reports`,
			query: {
				section: 'users',
				group_scope: 'custom',
				group_ids: '123,124',
				member_type: 'delegate',
				start_month: '2026-01',
				end_month: '2026-09',
			},
		});
		expect(result.users).toHaveLength(1);
	});

	it('rejects a month that is not YYYY-MM', async () => {
		await expect(
			invoke(Reports.get, { start_month: '2026-1' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('searches with comma-joined types and reads search_results', async () => {
		respond({
			search_results: [
				{
					id: 1,
					searchable_type: 'Discussion',
					searchable_id: 88,
					highlight: '<b>plan</b>',
					group_id: 12,
					group_name: 'Design',
					discussion_key: 'dX2',
					poll_key: null,
					author_id: 7,
					author_name: 'Ada',
					authored_at: '2026-03-01T09:00:00.000Z',
					tags: [],
				},
			],
		});

		const result = (await invoke(Search.query, {
			query: 'plan',
			types: ['Discussion', 'Poll'],
		})) as { search_results: { searchable_id: number }[] };

		expect(lastRequest()).toMatchObject({
			url: `${USER}/search`,
			query: { query: 'plan', types: 'Discussion,Poll' },
		});
		expect(result.search_results[0]?.searchable_id).toBe(88);
	});
});

describe('webhooks (/chatbots)', () => {
	const hook = {
		id: 456,
		group_id: 12,
		name: 'Planning',
		kind: 'webhook',
		webhook_kind: 'markdown',
		server: 'https://hooks.example.org/x',
		event_kinds: ['new_discussion'],
		notification_only: false,
	};

	it('lists, creates, updates, deletes, and checks', async () => {
		respond({ chatbots: [hook], meta: { root: 'chatbots', total: 1 } });
		const listed = (await invoke(Webhooks.list, { group_id: 12 })) as {
			chatbots: unknown[];
			next_offset?: number;
		};
		expect(lastRequest()).toMatchObject({
			url: `${USER}/chatbots`,
			query: { group_id: '12' },
		});
		expect(listed.chatbots).toHaveLength(1);
		expect(listed.next_offset).toBeUndefined();

		respond({ chatbots: [hook] });
		const created = (await invoke(Webhooks.create, {
			group_id: 12,
			name: 'Planning',
			kind: 'webhook',
			webhook_kind: 'markdown',
			server: 'https://hooks.example.org/x',
			event_kinds: ['new_discussion'],
		})) as { chatbot: { id: number } };
		expect(lastRequest()).toMatchObject({
			url: `${USER}/chatbots`,
			method: 'POST',
		});
		expect(created.chatbot.id).toBe(456);
		// The destination URL is a credential: not in the event log.
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain(
			'hooks.example.org',
		);

		respond({ chatbots: [{ ...hook, name: 'Renamed' }] });
		await invoke(Webhooks.update, { id: 456, name: 'Renamed' });
		expect(lastRequest()).toMatchObject({
			url: `${USER}/chatbots/456`,
			method: 'PATCH',
			body: { name: 'Renamed' },
		});

		respond({ success: 'success' });
		const removed = await invoke(Webhooks.remove, { id: 456 });
		expect(lastRequest()).toMatchObject({
			url: `${USER}/chatbots/456`,
			method: 'DELETE',
		});
		expect(removed).toEqual({ success: 'success' });

		fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));
		const checked = await invoke(Webhooks.check, {
			group_id: 12,
			server: 'https://hooks.example.org/x',
		});
		expect(lastRequest()).toMatchObject({
			url: `${USER}/chatbots/check`,
			method: 'POST',
			body: { group_id: 12, server: 'https://hooks.example.org/x' },
		});
		expect(checked).toEqual({ delivered: true });
	});

	it('refuses an unknown event kind before calling Loomio', async () => {
		await expect(
			invoke(Webhooks.create, {
				group_id: 12,
				name: 'x',
				kind: 'webhook',
				server: 'https://hooks.example.org/x',
				event_kinds: ['everything'],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('Server API (self-hosted)', () => {
	it('lists groups under /api/server0 with paging', async () => {
		respond({
			groups: [
				{
					id: 1,
					key: 'k1',
					name: 'A',
					handle: null,
					parent_id: null,
					group_privacy: 'secret',
				},
			],
			meta: { total: 2 },
		});
		const result = (await invoke(Server.groupsList, { limit: 1 }, SELF)) as {
			next_offset?: number;
		};
		expect(lastRequest()).toMatchObject({
			url: `${SERVER}/groups`,
			query: { limit: '1' },
		});
		expect(result.next_offset).toBe(1);
	});

	it('lists, syncs, updates, and revokes memberships', async () => {
		const member = {
			id: 9,
			group_id: 1,
			user_id: 5,
			user_email: 'ada@example.org',
			user_name: 'Ada',
			admin: false,
			delegate: false,
			accepted_at: null,
			pending: true,
		};
		respond({ memberships: [member], meta: { total: 1 } });
		await invoke(Server.membershipsList, { group_id: 1 }, SELF);
		expect(lastRequest()).toMatchObject({
			url: `${SERVER}/memberships`,
			query: { group_id: '1' },
		});

		respond({ added_emails: ['ada@example.org'], removed_emails: [] });
		await invoke(
			Server.membershipsSync,
			{ group_id: 1, emails: ['ada@example.org'], remove_absent: false },
			SELF,
		);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			body: { group_id: 1, emails: ['ada@example.org'], remove_absent: false },
		});

		respond({ membership: { ...member, admin: true } });
		const updated = (await invoke(
			Server.membershipsUpdate,
			{ id: 9, admin: true },
			SELF,
		)) as {
			membership: { admin: boolean };
		};
		expect(lastRequest()).toMatchObject({
			url: `${SERVER}/memberships/9`,
			method: 'PATCH',
			body: { membership: { admin: true } },
		});
		expect(updated.membership.admin).toBe(true);

		respond({ success: true });
		await invoke(Server.membershipsRevoke, { id: 9 }, SELF);
		expect(lastRequest()).toMatchObject({
			url: `${SERVER}/memberships/9`,
			method: 'DELETE',
		});
	});

	it('requires admin or delegate on a role update', async () => {
		await expect(
			invoke(Server.membershipsUpdate, { id: 9 }, SELF),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('wraps user writes in `user` and reads plain user JSON', async () => {
		respond({ users: [serverUser] });
		await invoke(Server.usersList, { is_admin: false }, SELF);
		expect(lastRequest()).toMatchObject({
			url: `${SERVER}/users`,
			query: { is_admin: 'false' },
		});

		respond({ user: serverUser }, 201);
		const created = (await invoke(
			Server.usersCreate,
			{ email: 'ada@example.org', name: 'Ada' },
			SELF,
		)) as { user: { id: number } };
		expect(lastRequest()).toMatchObject({
			url: `${SERVER}/users`,
			method: 'POST',
			body: { user: { email: 'ada@example.org', name: 'Ada' } },
		});
		expect(created.user.id).toBe(5);

		respond({ user: serverUser });
		await invoke(Server.usersUpdate, { id: 5, is_admin: true }, SELF);
		expect(lastRequest()).toMatchObject({
			url: `${SERVER}/users/5`,
			method: 'PATCH',
			body: { user: { is_admin: true } },
		});
	});

	it.each([
		['usersGet', 'GET', '/users/5', { user: serverUser }],
		['usersDelete', 'DELETE', '/users/5', { success: true }],
		[
			'usersDeactivate',
			'POST',
			'/users/5/deactivate',
			{ success: true, user: serverUser },
		],
		[
			'usersReactivate',
			'POST',
			'/users/5/reactivate',
			{ success: true, user: serverUser },
		],
		['usersRedact', 'POST', '/users/5/redact', { success: true }],
	] as const)('%s calls %s %s', async (name, method, path, body) => {
		respond(body);
		await invoke(Server[name], { id: 5 }, SELF);
		expect(lastRequest()).toMatchObject({ url: `${SERVER}${path}`, method });
	});

	it.each([
		['usersGetByIdentity', 'GET', '', { user: serverUser }],
		['usersDeleteByIdentity', 'DELETE', '', { success: true }],
		[
			'usersDeactivateByIdentity',
			'POST',
			'/deactivate',
			{ success: true, user: serverUser },
		],
		[
			'usersReactivateByIdentity',
			'POST',
			'/reactivate',
			{ success: true, user: serverUser },
		],
		['usersRedactByIdentity', 'POST', '/redact', { success: true }],
	] as const)(
		'%s calls %s on the encoded identity path',
		async (name, method, suffix, body) => {
			respond(body);
			await invoke(Server[name], { identity_type: 'saml', uid: 'a/b c' }, SELF);
			const [url] = fetchMock.mock.calls.at(-1) as [string];
			expect(url).toBe(`${SERVER}/users/identity/saml/a%2Fb%20c${suffix}`);
			expect(lastRequest().method).toBe(method);
		},
	);

	it('encodes dots in identity uids so Rails keeps the whole uid', async () => {
		respond({ user: serverUser });
		await invoke(
			Server.usersGetByIdentity,
			{ identity_type: 'oauth', uid: 'ada@example.org' },
			SELF,
		);
		const [url] = fetchMock.mock.calls.at(-1) as [string];
		expect(url).toBe(`${SERVER}/users/identity/oauth/ada%40example%2Eorg`);
	});

	it('updates a user by identity', async () => {
		respond({ user: serverUser });
		await invoke(
			Server.usersUpdateByIdentity,
			{ identity_type: 'saml', uid: 'ada-1', name: 'Ada L' },
			SELF,
		);
		expect(lastRequest()).toMatchObject({
			url: `${SERVER}/users/identity/saml/ada-1`,
			method: 'PATCH',
			body: { user: { name: 'Ada L' } },
		});
	});
});
