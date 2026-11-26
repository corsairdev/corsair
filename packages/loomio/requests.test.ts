import { logEventFromContext } from 'corsair/core';
import { Comments, Discussions, Groups, Polls, Threads } from './endpoints';
import { API_KEY } from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: the input is exactly what a caller may pass; the endpoint parses it.
// The fake context only carries what the endpoints read (ctx.key).
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint({ key: API_KEY } as never, input as never);
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
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectBearer() {
	const sent = lastRequest();
	expect(sent.url).toMatch(/^https:\/\/www\.loomio\.com\/api\/user0\//);
	expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
	expect(sent.headers.get('accept')).toBe('application/json');
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('groups.list', () => {
	it('GETs /groups with paging params', async () => {
		respond({ groups: [], meta: { root: 'groups', total: 0 } });

		await invoke(Groups.list, { limit: 100, offset: 50 });

		expectBearer();
		expect(lastRequest()).toMatchObject({
			url: 'https://www.loomio.com/api/user0/groups',
			method: 'GET',
			query: { limit: '100', offset: '50' },
			body: undefined,
		});
	});

	it('omits paging params the caller did not send', async () => {
		respond({ groups: [], meta: { root: 'groups', total: 0 } });

		await invoke(Groups.list, {});

		expect(lastRequest().query).toEqual({});
	});
});

describe('groups.get', () => {
	it('GETs /groups/:id and does not mark the path key as scoped query', async () => {
		respond({ groups: [{ id: 12 }], meta: {} });

		await invoke(Groups.get, { id: 12 });

		expectBearer();
		expect(lastRequest()).toMatchObject({
			url: 'https://www.loomio.com/api/user0/groups/12',
			method: 'GET',
			query: {},
		});
	});

	it('accepts a handle as the id', async () => {
		respond({ groups: [{ id: 12 }], meta: {} });

		await invoke(Groups.get, { id: 'design' });

		expect(lastRequest().url).toBe(
			'https://www.loomio.com/api/user0/groups/design',
		);
	});
});

describe('discussions.list', () => {
	it('GETs /discussions with group_id, status, and paging', async () => {
		respond({ discussions: [], meta: { root: 'discussions', total: 0 } });

		await invoke(Discussions.list, {
			group_id: 12,
			status: 'closed',
			limit: 10,
			offset: 20,
		});

		expectBearer();
		expect(lastRequest()).toMatchObject({
			url: 'https://www.loomio.com/api/user0/discussions',
			method: 'GET',
			query: { group_id: '12', status: 'closed', limit: '10', offset: '20' },
		});
	});
});

describe('discussions.get', () => {
	it('GETs /discussions/:id', async () => {
		respond({ discussions: [{ id: 88 }], meta: {} });

		await invoke(Discussions.get, { id: 88 });

		expectBearer();
		expect(lastRequest()).toMatchObject({
			url: 'https://www.loomio.com/api/user0/discussions/88',
			method: 'GET',
		});
	});
});

describe('discussions.create', () => {
	it('POSTs /discussions with the flat create body', async () => {
		respond({ discussions: [{ id: 89 }], meta: {} });

		await invoke(Discussions.create, {
			group_id: 12,
			title: 'Spring palette',
			description: 'Pick colours',
			description_format: 'md',
			recipient_emails: ['sam@loomio.example'],
		});

		expectBearer();
		const sent = lastRequest();
		expect(sent.url).toBe('https://www.loomio.com/api/user0/discussions');
		expect(sent.method).toBe('POST');
		expect(sent.body).toEqual({
			group_id: 12,
			title: 'Spring palette',
			description: 'Pick colours',
			description_format: 'md',
			recipient_audience: undefined,
			recipient_user_ids: undefined,
			recipient_emails: ['sam@loomio.example'],
			recipient_message: undefined,
		});
	});
});

describe('comments.create', () => {
	it('POSTs /comments with discussion_id and body', async () => {
		respond({ comments: [{ id: 402 }], meta: {} });

		await invoke(Comments.create, {
			discussion_id: 88,
			body: 'Sounds good',
			body_format: 'html',
		});

		expectBearer();
		const sent = lastRequest();
		expect(sent.url).toBe('https://www.loomio.com/api/user0/comments');
		expect(sent.method).toBe('POST');
		expect(sent.body).toEqual({
			discussion_id: 88,
			body: 'Sounds good',
			body_format: 'html',
		});
	});
});

describe('threads.list', () => {
	it('GETs /threads with paging params', async () => {
		respond({ threads: [], meta: { root: 'threads', total: 0 } });

		await invoke(Threads.list, { limit: 25, offset: 5 });

		expectBearer();
		expect(lastRequest()).toMatchObject({
			url: 'https://www.loomio.com/api/user0/threads',
			method: 'GET',
			query: { limit: '25', offset: '5' },
		});
	});
});

describe('threads.items', () => {
	it('GETs /threads/:topic_id/items with paging params', async () => {
		respond({ items: [], meta: { root: 'items', total: 0 } });

		await invoke(Threads.items, { topic_id: 55, limit: 500 });

		expectBearer();
		expect(lastRequest()).toMatchObject({
			url: 'https://www.loomio.com/api/user0/threads/55/items',
			method: 'GET',
			query: { limit: '500' },
		});
	});
});

describe('threads.markdown', () => {
	it('GETs /threads/:topic_id/markdown with no query', async () => {
		respond({ markdown: '# Thread' });

		await invoke(Threads.markdown, { topic_id: 55 });

		expectBearer();
		expect(lastRequest()).toMatchObject({
			url: 'https://www.loomio.com/api/user0/threads/55/markdown',
			method: 'GET',
			query: {},
		});
	});
});

describe('polls.list', () => {
	it('GETs /polls with group_id, status, and paging', async () => {
		respond({ polls: [], meta: { root: 'polls', total: 0 } });

		await invoke(Polls.list, { group_id: 12, status: 'all', limit: 50 });

		expectBearer();
		expect(lastRequest()).toMatchObject({
			url: 'https://www.loomio.com/api/user0/polls',
			method: 'GET',
			query: { group_id: '12', status: 'all', limit: '50' },
		});
	});
});

describe('polls.get', () => {
	it('GETs /polls/:id', async () => {
		respond({ polls: [{ id: 63 }], meta: {} });

		await invoke(Polls.get, { id: 'pL4' });

		expectBearer();
		expect(lastRequest()).toMatchObject({
			url: 'https://www.loomio.com/api/user0/polls/pL4',
			method: 'GET',
		});
	});
});

describe('polls.create', () => {
	it('POSTs /polls with the create body', async () => {
		respond({ polls: [{ id: 64 }], meta: {} });

		await invoke(Polls.create, {
			discussion_id: 88,
			title: 'Which blue?',
			poll_type: 'poll',
			options: ['Sky blue', 'Navy'],
			closing_at: '2026-04-01T00:00:00.000Z',
			hide_results: 'until_vote',
			anonymous: true,
		});

		expectBearer();
		const sent = lastRequest();
		expect(sent.url).toBe('https://www.loomio.com/api/user0/polls');
		expect(sent.method).toBe('POST');
		expect(sent.body).toMatchObject({
			discussion_id: 88,
			title: 'Which blue?',
			poll_type: 'poll',
			options: ['Sky blue', 'Navy'],
			closing_at: '2026-04-01T00:00:00.000Z',
			hide_results: 'until_vote',
			anonymous: true,
		});
	});

	it('forwards an explicit null closing_at so the poll stays a draft', async () => {
		respond({ polls: [{ id: 65 }], meta: {} });

		await invoke(Polls.create, {
			group_id: 12,
			title: 'Draft?',
			poll_type: 'proposal',
			closing_at: null,
		});

		expect(lastRequest().body).toMatchObject({ closing_at: null });
	});

	it('refuses an anonymous draft before Loomio saves it and answers 403', async () => {
		await expect(
			invoke(Polls.create, {
				group_id: 12,
				title: 'Secret ballot?',
				poll_type: 'proposal',
				anonymous: true,
			}),
		).rejects.toThrow(/closing_at/);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
