import { logEventFromContext } from 'corsair/core';
import { Mem0APIError } from './client';
import { Events, Memories, Webhooks } from './endpoints';
import {
	addedQueued,
	addedVerbatim,
	badRequest,
	batchDeleted,
	batchUpdated,
	deletionQueued,
	emptyMemoryPage,
	event,
	eventPage,
	historyEntries,
	memory,
	memoryDeleted,
	memoryDeletedWithLinks,
	memoryNotFound,
	memoryPage,
	searchResults,
	updatedMemory,
	webhook,
	webhookDeleted,
	webhookForbidden,
	webhookInvalid,
	webhookUpdated,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'm0-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
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

// A rejection can be any value, so it stays unknown until the caller asserts on
// it. Narrowing here would hide a non-Mem0APIError failure, which is exactly
// what a test should catch.
// unknown: a rejected promise's reason has no static type.
function rejection(promise: Promise<unknown>): Promise<unknown> {
	return promise.catch((error: unknown) => error);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.mem0.ai');
	expect(sent.headers.get('authorization')).toBe(`Token ${API_KEY}`);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('memories.add', () => {
	it('POSTs v3/memories/add/ with messages and one entity ID', async () => {
		respond(addedQueued);

		const result = await invoke(Memories.add, {
			messages: [{ role: 'user', content: 'I moved to Austin last month.' }],
			user_id: 'alice',
			metadata: { source: 'onboarding_form' },
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v3/memories/add/',
			body: {
				messages: [{ role: 'user', content: 'I moved to Austin last month.' }],
				user_id: 'alice',
				metadata: { source: 'onboarding_form' },
			},
		});
		expect(result).toEqual(addedQueued);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'mem0.memories.add',
			{ eventId: '2c4d1f44-4f7b-4b2f-9f6e-7b5b4f5a1234', status: 'PENDING' },
			'completed',
		);
	});

	it('passes infer: false and returns the synchronous result', async () => {
		respond(addedVerbatim);

		const result = await invoke(Memories.add, {
			messages: [{ role: 'user', content: 'I moved to Austin last month.' }],
			user_id: 'alice',
			infer: false,
		});

		expect(lastRequest().body).toMatchObject({ infer: false });
		expect(result).toEqual(addedVerbatim);
	});

	it('rejects a call with no entity ID before any request', async () => {
		await expect(
			invoke(Memories.add, {
				messages: [{ role: 'user', content: 'hello' }],
			}),
		).rejects.toThrow(
			'At least one of user_id, agent_id, app_id or run_id is required.',
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an unknown message role', async () => {
		await expect(
			invoke(Memories.add, {
				messages: [{ role: 'tool', content: 'hello' }],
				user_id: 'alice',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a date that is not YYYY-MM-DD', async () => {
		await expect(
			invoke(Memories.add, {
				messages: [{ role: 'user', content: 'hello' }],
				user_id: 'alice',
				expiration_date: '31/01/2030',
			}),
		).rejects.toThrow('Use YYYY-MM-DD.');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('surfaces a 400 as a Mem0APIError', async () => {
		respond(badRequest('Invalid input data.'), 400);

		const error = await rejection(
			invoke(Memories.add, {
				messages: [{ role: 'user', content: 'hello' }],
				user_id: 'alice',
			}),
		);

		expect(error).toBeInstanceOf(Mem0APIError);
		expect((error as Mem0APIError).status).toBe(400);
	});
});

describe('memories.search', () => {
	it('POSTs v3/memories/search/ with filters inside the body', async () => {
		respond(searchResults);

		const result = await invoke(Memories.search, {
			query: "What are Alice's hobbies?",
			filters: { user_id: 'alice' },
			top_k: 5,
			threshold: 0.4,
			rerank: true,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v3/memories/search/',
			body: {
				query: "What are Alice's hobbies?",
				filters: { user_id: 'alice' },
				top_k: 5,
				threshold: 0.4,
				rerank: true,
			},
		});
		expect(result).toEqual(searchResults);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'mem0.memories.search',
			{ results: 1 },
			'completed',
		);
	});

	it('keeps nested AND filters as the caller wrote them', async () => {
		respond(searchResults);

		await invoke(Memories.search, {
			query: 'hobbies',
			filters: {
				AND: [{ user_id: 'alice' }, { created_at: { gte: '2024-07-01' } }],
			},
		});

		expect(lastRequest().body).toMatchObject({
			filters: {
				AND: [{ user_id: 'alice' }, { created_at: { gte: '2024-07-01' } }],
			},
		});
	});

	it('accepts results reduced to the fields the caller asked for', async () => {
		respond({ results: [{ id: 'ea925981' }] });

		const result = await invoke(Memories.search, {
			query: 'hobbies',
			filters: { user_id: 'alice' },
			fields: ['id'],
		});

		expect(result).toEqual({ results: [{ id: 'ea925981' }] });
	});

	it('rejects filters that carry no entity ID', async () => {
		await expect(
			invoke(Memories.search, {
				query: 'hobbies',
				filters: { categories: { in: ['hobbies'] } },
			}),
		).rejects.toThrow(
			'filters must include at least one of user_id, agent_id, app_id or run_id.',
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an entity key whose value is undefined', async () => {
		await expect(
			invoke(Memories.search, {
				query: 'hobbies',
				filters: { user_id: undefined },
			}),
		).rejects.toThrow(
			'filters must include at least one of user_id, agent_id, app_id or run_id.',
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a top_k above the documented maximum', async () => {
		await expect(
			invoke(Memories.search, {
				query: 'hobbies',
				filters: { user_id: 'alice' },
				top_k: 1001,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('memories.list', () => {
	it('POSTs v3/memories/ with page and page_size as query parameters', async () => {
		respond(memoryPage);

		const result = await invoke(Memories.list, {
			filters: { user_id: 'alice' },
			page: 1,
			page_size: 50,
			start_date: '2026-01-01',
			end_date: '2026-01-31',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v3/memories/',
			query: { page: '1', page_size: '50' },
			body: {
				filters: { user_id: 'alice' },
				start_date: '2026-01-01',
				end_date: '2026-01-31',
			},
		});
		expect(result).toEqual(memoryPage);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'mem0.memories.list',
			{ count: 2, page: 1 },
			'completed',
		);
	});

	it('returns an empty page rather than throwing', async () => {
		respond(emptyMemoryPage);

		const result = await invoke(Memories.list, {
			filters: { user_id: 'nobody' },
		});

		expect(result).toEqual(emptyMemoryPage);
	});

	it('accepts a metadata-only filter when an entity ID sits inside AND', async () => {
		respond(memoryPage);

		await invoke(Memories.list, {
			filters: {
				AND: [{ user_id: 'alice' }, { categories: { contains: 'finance' } }],
			},
		});

		expect(lastRequest().body).toMatchObject({
			filters: {
				AND: [{ user_id: 'alice' }, { categories: { contains: 'finance' } }],
			},
		});
	});

	it('accepts rows reduced to the fields the caller asked for', async () => {
		respond({
			count: 1,
			next: null,
			previous: null,
			results: [{ id: 'ea925981', memory: 'A fact' }],
		});

		const result = await invoke(Memories.list, {
			filters: { user_id: 'alice' },
			fields: ['id', 'memory'],
		});

		expect(result).toMatchObject({
			results: [{ id: 'ea925981', memory: 'A fact' }],
		});
	});

	it('rejects a page_size above the documented maximum', async () => {
		await expect(
			invoke(Memories.list, {
				filters: { user_id: 'alice' },
				page_size: 201,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('memories.get', () => {
	it('GETs v1/memories/{id}/ and encodes the ID', async () => {
		respond(memory);

		const result = await invoke(Memories.get, { memory_id: 'a/b' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/memories/a%2Fb/',
			body: undefined,
		});
		expect(result).toEqual(memory);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'mem0.memories.get',
			{ memoryId: 'a/b' },
			'completed',
		);
	});

	it('rejects a 200 whose body fails the output schema, without logging', async () => {
		// A 200 with a body the schema cannot read is a provider bug, not an
		// empty result, so it must throw and leave no completed event behind.
		respond({ unexpected: 'shape' });

		await expect(
			invoke(Memories.get, { memory_id: 'ea925981' }),
		).rejects.toThrow();
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('surfaces a 404 for an unknown memory', async () => {
		respond(memoryNotFound, 404);

		const error = await rejection(
			invoke(Memories.get, { memory_id: 'missing' }),
		);

		expect((error as Mem0APIError).status).toBe(404);
		expect((error as Mem0APIError).message).toBe('Mem0 404: Memory not found!');
	});
});

describe('memories.update', () => {
	it('PUTs text and metadata for one memory', async () => {
		respond(updatedMemory);

		const result = await invoke(Memories.update, {
			memory_id: 'ea925981',
			text: 'User moved to Lisbon in March 2026',
			metadata: { category: 'location' },
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/memories/ea925981/',
			body: {
				text: 'User moved to Lisbon in March 2026',
				metadata: { category: 'location' },
			},
		});
		expect(result).toEqual(updatedMemory);
	});

	it('sends expiration_date: null to clear an existing date', async () => {
		respond({ ...memory, expiration_date: null });

		await invoke(Memories.update, {
			memory_id: 'ea925981',
			expiration_date: null,
		});

		// unknown: the serialized body is untyped JSON until fields are read.
		const body = lastRequest().body as Record<string, unknown>;
		expect(Object.hasOwn(body, 'expiration_date')).toBe(true);
		expect(body.expiration_date).toBeNull();
	});

	it('omits expiration_date entirely when it is not passed', async () => {
		respond(memory);

		await invoke(Memories.update, {
			memory_id: 'ea925981',
			text: 'A new fact',
		});

		// unknown: the serialized body is untyped JSON until fields are read.
		const body = lastRequest().body as Record<string, unknown>;
		expect(Object.hasOwn(body, 'expiration_date')).toBe(false);
	});

	it('rejects an update with no fields to change', async () => {
		await expect(
			invoke(Memories.update, { memory_id: 'ea925981' }),
		).rejects.toThrow(
			'Pass at least one of text, metadata or expiration_date.',
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('memories.delete', () => {
	it('DELETEs v1/memories/{id}/ and reports success', async () => {
		respond(memoryDeleted);

		const result = await invoke(Memories.remove, { memory_id: 'ea925981' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/memories/ea925981/',
			query: {},
		});
		expect(result).toEqual({
			success: true,
			memory_id: 'ea925981',
			message: 'Memory deleted successfully!',
		});
	});

	it('passes delete_linked and keeps the cascade count', async () => {
		respond(memoryDeletedWithLinks);

		const result = await invoke(Memories.remove, {
			memory_id: 'ea925981',
			delete_linked: true,
		});

		expect(lastRequest().query).toEqual({ delete_linked: 'true' });
		expect(result).toEqual({
			success: true,
			memory_id: 'ea925981',
			message: 'Memory deleted successfully!',
			cascade_count: 3,
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'mem0.memories.delete',
			{ memoryId: 'ea925981', cascadeCount: 3, deleteLinked: true },
			'completed',
		);
	});
});

describe('memories.deleteAll', () => {
	it('DELETEs v1/memories/ with the filter as query parameters', async () => {
		respond(deletionQueued);

		const result = await invoke(Memories.deleteAll, { user_id: 'alice' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/memories/',
			query: { user_id: 'alice' },
		});
		expect(result).toEqual({ success: true, ...deletionQueued });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'mem0.memories.deleteAll',
			{
				eventId: '9e8d7c6b-5a49-4382-b1a0-9f8e7d6c5b4a',
				message: 'Delete in progress. This may take some time.',
			},
			'completed',
		);
	});

	it('sends a wildcard filter unchanged', async () => {
		respond(deletionQueued);

		await invoke(Memories.deleteAll, {
			user_id: '*',
			agent_id: '*',
			app_id: '*',
			run_id: '*',
		});

		expect(lastRequest().query).toEqual({
			user_id: '*',
			agent_id: '*',
			app_id: '*',
			run_id: '*',
		});
	});

	it('encodes a metadata filter as nested query keys', async () => {
		respond(deletionQueued);

		await invoke(Memories.deleteAll, {
			user_id: 'alice',
			metadata: { tier: 'gold' },
		});

		expect(lastRequest().query).toEqual({
			user_id: 'alice',
			'metadata[tier]': 'gold',
		});
	});

	it('rejects an empty metadata map, which sends no query keys', async () => {
		await expect(invoke(Memories.deleteAll, { metadata: {} })).rejects.toThrow(
			'At least one filter is required. Mem0 rejects an unfiltered delete.',
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a null metadata value, which the query would drop', async () => {
		await expect(
			invoke(Memories.deleteAll, {
				user_id: 'alice',
				metadata: { tier: null },
			}),
		).rejects.toThrow('metadata values must be strings, numbers or booleans');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an unfiltered delete before any request', async () => {
		await expect(invoke(Memories.deleteAll, {})).rejects.toThrow(
			'At least one filter is required. Mem0 rejects an unfiltered delete.',
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('memories.history', () => {
	it('GETs v1/memories/{id}/history/ and wraps the array', async () => {
		respond(historyEntries);

		const result = await invoke(Memories.history, { memory_id: 'ea925981' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/memories/ea925981/history/',
		});
		expect(result).toEqual({ history: historyEntries });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'mem0.memories.history',
			{ entries: 2 },
			'completed',
		);
	});

	it('returns an empty history for a memory with no changes', async () => {
		respond([]);

		const result = await invoke(Memories.history, { memory_id: 'ea925981' });

		expect(result).toEqual({ history: [] });
	});

	it('rejects a body that is not an array instead of calling it empty', async () => {
		respond({ detail: 'unexpected' });

		await expect(
			invoke(Memories.history, { memory_id: 'ea925981' }),
		).rejects.toThrow();
	});
});

describe('memories.batchUpdate', () => {
	it('PUTs v1/batch/ with one entry per memory', async () => {
		respond(batchUpdated);

		const result = await invoke(Memories.batchUpdate, {
			memories: [
				{ memory_id: '285ed74b', text: 'Watches football' },
				{ memory_id: '2c9bd859', text: 'Likes to travel' },
			],
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/batch/',
			body: {
				memories: [
					{ memory_id: '285ed74b', text: 'Watches football' },
					{ memory_id: '2c9bd859', text: 'Likes to travel' },
				],
			},
		});
		expect(result).toEqual({
			success: true,
			count: 2,
			message: 'Successfully updated 2 memories',
		});
	});

	it('never sends metadata, which Mem0 ignores on this endpoint', async () => {
		respond(batchUpdated);

		await invoke(Memories.batchUpdate, {
			memories: [
				{
					memory_id: '285ed74b',
					text: 'Watches football',
					metadata: { tier: 'gold' },
				},
			],
		});

		// unknown: the body is untyped JSON, inspected one field at a time.
		const body = lastRequest().body as {
			memories: Record<string, unknown>[];
		};
		// Mem0 documents metadata here but leaves the stored value untouched, so
		// the schema drops it rather than implying a change that will not happen.
		expect(body.memories[0]).toEqual({
			memory_id: '285ed74b',
			text: 'Watches football',
		});
	});

	it('rejects an entry with no text, which Mem0 answers 400 for', async () => {
		await expect(
			invoke(Memories.batchUpdate, {
				memories: [{ memory_id: '285ed74b', metadata: { tier: 'gold' } }],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects more than 1000 memories', async () => {
		const memories = Array.from({ length: 1001 }, (_, index) => ({
			memory_id: `id-${index}`,
			text: 'x',
		}));

		await expect(invoke(Memories.batchUpdate, { memories })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('memories.batchDelete', () => {
	it('DELETEs v1/batch/ with the IDs wrapped as memory objects', async () => {
		respond(batchDeleted);

		const result = await invoke(Memories.batchDelete, {
			memory_ids: ['285ed74b', '2c9bd859'],
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/batch/',
			body: {
				memories: [{ memory_id: '285ed74b' }, { memory_id: '2c9bd859' }],
			},
		});
		expect(result).toEqual({
			success: true,
			count: 2,
			message: 'Successfully deleted 2 memories',
		});
	});

	it('rejects an empty list', async () => {
		await expect(
			invoke(Memories.batchDelete, { memory_ids: [] }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('events.get', () => {
	it('GETs v1/event/{id}/ and reports the status', async () => {
		respond(event);

		const result = await invoke(Events.get, { event_id: 'evt-1' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/event/evt-1/',
		});
		expect(result).toEqual(event);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'mem0.events.get',
			{
				eventId: '2c4d1f44-4f7b-4b2f-9f6e-7b5b4f5a1234',
				eventType: 'ADD',
				status: 'SUCCEEDED',
				latencyMs: 59_000,
			},
			'completed',
		);
	});

	it('accepts a single-object result, which UPDATE events send', async () => {
		respond({
			...event,
			event_type: 'UPDATE',
			results: { id: 'ea925981', memory: 'User moved to Lisbon' },
		});

		const result = (await invoke(Events.get, { event_id: 'evt-1' })) as {
			results: { memory: string };
		};

		expect(result.results.memory).toBe('User moved to Lisbon');
	});

	it('accepts a null result, which DELETE events send', async () => {
		respond({ ...event, event_type: 'DELETE', results: null });

		// unknown: the result union covers an array, an object and null, so the
		// test reads the field it asserted on rather than a fixed member type.
		const result = (await invoke(Events.get, { event_id: 'evt-1' })) as {
			results: unknown;
		};

		expect(result.results).toBeNull();
	});

	it('keeps a FAILED event readable with its error', async () => {
		respond({ ...event, status: 'FAILED', error: 'Extraction failed' });

		const result = (await invoke(Events.get, { event_id: 'evt-1' })) as {
			status: string;
			error: string;
		};

		expect(result.status).toBe('FAILED');
		expect(result.error).toBe('Extraction failed');
	});
});

describe('events.list', () => {
	it('GETs v1/events/ with paging query parameters', async () => {
		respond(eventPage);

		const result = await invoke(Events.list, { page: 2, page_size: 25 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/events/',
			query: { page: '2', page_size: '25' },
		});
		expect(result).toEqual(eventPage);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'mem0.events.list',
			{ count: 1, page: 1 },
			'completed',
		);
	});
});

describe('webhooks.list', () => {
	it('GETs the project webhooks on the API prefix and wraps the array', async () => {
		respond([webhook]);

		const result = await invoke(Webhooks.list, { project_id: 'proj_123' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v1/webhooks/projects/proj_123/',
			body: undefined,
		});
		expect(result).toEqual({ webhooks: [webhook] });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'mem0.webhooks.list',
			{ count: 1 },
			'completed',
		);
	});

	it('returns an empty list for a project with no webhooks', async () => {
		respond([]);

		const result = await invoke(Webhooks.list, { project_id: 'proj_123' });

		expect(result).toEqual({ webhooks: [] });
	});

	it('rejects a body that is not an array instead of calling it empty', async () => {
		respond({ error: 'unexpected' });

		await expect(
			invoke(Webhooks.list, { project_id: 'proj_123' }),
		).rejects.toThrow();
	});

	it('surfaces a 403 for a project the key cannot see', async () => {
		respond(webhookForbidden, 403);

		const error = await rejection(
			invoke(Webhooks.list, { project_id: 'proj_other' }),
		);

		expect((error as Mem0APIError).status).toBe(403);
	});
});

describe('webhooks.create', () => {
	it('POSTs name, url and event_types to the project path', async () => {
		respond(webhook, 201);

		const result = await invoke(Webhooks.create, {
			project_id: 'proj_123',
			name: 'Memory Logger',
			url: 'https://your-app.example/webhook',
			event_types: ['memory_add', 'memory_categorize'],
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v1/webhooks/projects/proj_123/',
			body: {
				name: 'Memory Logger',
				url: 'https://your-app.example/webhook',
				event_types: ['memory_add', 'memory_categorize'],
			},
		});
		expect(result).toEqual(webhook);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'mem0.webhooks.create',
			{ webhookId: 'wh_123', events: 2, active: true },
			'completed',
		);
	});

	it('rejects an empty event_types list before any request', async () => {
		await expect(
			invoke(Webhooks.create, {
				project_id: 'proj_123',
				name: 'Memory Logger',
				url: 'https://your-app.example/webhook',
				event_types: [],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an event type Mem0 does not send', async () => {
		await expect(
			invoke(Webhooks.create, {
				project_id: 'proj_123',
				name: 'Memory Logger',
				url: 'https://your-app.example/webhook',
				event_types: ['memory_export'],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('reports the first field error of a 400', async () => {
		respond(webhookInvalid, 400);

		const error = await rejection(
			invoke(Webhooks.create, {
				project_id: 'proj_123',
				name: 'Memory Logger',
				url: 'https://your-app.example/webhook',
				event_types: ['memory_add'],
			}),
		);

		expect((error as Mem0APIError).message).toBe(
			'Mem0 400: name: This field is required.',
		);
	});
});

describe('webhooks.update', () => {
	it('PUTs the changed fields and reports success', async () => {
		respond(webhookUpdated);

		const result = await invoke(Webhooks.update, {
			webhook_id: 'wh_123',
			name: 'Updated Logger',
			url: 'https://your-app.example/new-webhook',
			event_types: ['memory_update', 'memory_add'],
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/api/v1/webhooks/wh_123/',
			body: {
				name: 'Updated Logger',
				url: 'https://your-app.example/new-webhook',
				event_types: ['memory_update', 'memory_add'],
			},
		});
		expect(result).toEqual({
			success: true,
			webhook_id: 'wh_123',
			message: 'Webhook updated successfully',
		});
	});

	it('keeps the webhook body when a deployment returns it instead of a message', async () => {
		respond(webhook);

		// unknown: only the passthrough's presence is asserted, not its shape,
		// so the field stays open rather than duplicating the webhook type here.
		const result = (await invoke(Webhooks.update, {
			webhook_id: 'wh_123',
			name: 'Memory Logger',
		})) as { webhook?: unknown };

		expect(result.webhook).toEqual(webhook);
	});

	it('rejects an update with no fields to change', async () => {
		await expect(
			invoke(Webhooks.update, { webhook_id: 'wh_123' }),
		).rejects.toThrow('Pass at least one of name, url or event_types.');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('webhooks.delete', () => {
	it('DELETEs the webhook by ID and reports success', async () => {
		respond(webhookDeleted);

		const result = await invoke(Webhooks.remove, { webhook_id: 'wh_123' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/api/v1/webhooks/wh_123/',
			body: undefined,
		});
		expect(result).toEqual({
			success: true,
			webhook_id: 'wh_123',
			message: 'Webhook deleted successfully',
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'mem0.webhooks.delete',
			{ webhookId: 'wh_123' },
			'completed',
		);
	});
});
