import {
	zepEndpointsNested as api,
	zepEndpointMeta,
} from './endpoints/catalog';
import type { ZepContext } from './index';

// Routes written by hand from Zep's v4 SDK reference
// (help.getzep.com/v4/sdk-reference), not read from the manifest.

type Captured = {
	url: URL;
	method: string;
	headers: Record<string, string>;
	// `unknown` because the sent body is a JSON string.
	body: unknown;
};
let calls: Captured[] = [];

// `unknown` because each case answers its own JSON body.
function reply(body: unknown, status = 200, contentType = 'application/json') {
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		const headers: Record<string, string> = {};
		new Headers(init?.headers).forEach((value, key) => {
			headers[key] = value;
		});
		calls.push({
			url: new URL(String(input)),
			method: init?.method ?? 'GET',
			headers,
			body: init?.body,
		});
		return new Response(
			typeof body === 'string' ? body : JSON.stringify(body),
			{ status, headers: { 'content-type': contentType } },
		);
	});
}

const ctx = {
	endpoints: {},
	$getAccountId: () => Promise.resolve('test-account'),
	key: 'z_test_key',
	options: {},
	keys: {},
	db: {},
	// `unknown` because a test context fills only the fields the endpoints read.
} as unknown as ZepContext;

const THREAD = '3f0e6a2c-8b1d-4c7e-9a52-1d2e3f4a5b6c';
beforeEach(() => {
	calls = [];
});
afterEach(() => jest.restoreAllMocks());

describe('zep v4 routes', () => {
	it('creates a thread with Api-Key auth', async () => {
		reply({ uuid: THREAD, user_uuid: 'u1' }, 201);
		const out = await api.threads.create(ctx, { user_uuid: 'u1' });
		expect(out).toMatchObject({ uuid: THREAD });
		expect(calls[0]?.method).toBe('POST');
		expect(calls[0]?.url.href).toBe('https://api.getzep.com/api/v4/threads');
		expect(calls[0]?.headers.authorization).toBe('Api-Key z_test_key');
		expect(JSON.parse(String(calls[0]?.body))).toEqual({ user_uuid: 'u1' });
	});

	it('adds messages to a thread', async () => {
		reply({ message_uuids: ['m1'] });
		await api.threads.messages.add(ctx, {
			thread_uuid: THREAD,
			messages: [{ role: 'user', content: 'I moved to Lisbon.' }],
		});
		expect(calls[0]?.url.pathname).toBe(`/api/v4/threads/${THREAD}/messages`);
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			messages: [{ role: 'user', content: 'I moved to Lisbon.' }],
		});
	});

	it('reads the context block with a template', async () => {
		reply({ context: 'FACTS: ...' });
		await api.threads.getContext(ctx, {
			thread_uuid: THREAD,
			template_uuid: 'tpl1',
		});
		expect(calls[0]?.method).toBe('GET');
		expect(calls[0]?.url.pathname).toBe(`/api/v4/threads/${THREAD}/context`);
		expect(calls[0]?.url.searchParams.get('template_uuid')).toBe('tpl1');
	});

	it('searches a graph with a POST', async () => {
		reply({ edges: [] });
		await api.graphs.searchEdges(ctx, { graph_uuid: 'g1', query: 'Lisbon' });
		expect(calls[0]?.method).toBe('POST');
		expect(calls[0]?.url.pathname).toBe('/api/v4/graphs/g1/search/edges');
	});

	it('returns the streamed graph query as text', async () => {
		reply(
			'event: answer\ndata: {"text":"Lisbon"}\n\n',
			200,
			'text/event-stream',
		);
		const out = await api.graphs.query(ctx, {
			graph_uuids: ['g1'],
			query: 'Where does Ada live?',
			stream: true,
		});
		expect(out).toEqual({
			text: 'event: answer\ndata: {"text":"Lisbon"}\n\n',
			contentType: 'text/event-stream',
		});
		expect(calls[0]?.url.pathname).toBe('/api/v4/graphs/query');
	});

	it('fails a graph query whose stream ends in an error event', async () => {
		reply(
			'data: {"type":"started","sequence":0,"graph_uuids":["g1"],"handles":[]}\n\n' +
				'data: {"type":"error","sequence":1,"status":500,"error":{"message":"decision model timed out"}}\n\n',
			200,
			'text/event-stream',
		);
		await expect(
			api.graphs.query(ctx, {
				graph_uuids: ['g1'],
				query: 'Where does Ada live?',
				stream: true,
			}),
		).rejects.toThrow(
			'Zep graphs.query stream ended with an error event (status 500: decision model timed out)',
		);
	});

	it('takes an explicit null where Zep documents "set to null to clear"', async () => {
		reply({ uuid: 'p1', name: 'Project' });
		await api.project.update(ctx, { default_time_zone: null });
		expect(JSON.parse(String(calls[0]?.body))).toEqual({
			default_time_zone: null,
		});
	});

	it('reads Zep error bodies', async () => {
		reply({ error: { code: 'not_found', message: 'thread not found' } }, 404);
		await expect(api.threads.get(ctx, { thread_uuid: THREAD })).rejects.toThrow(
			'Zep 404: thread not found',
		);
	});
});

describe('risk levels', () => {
	it.each([
		'users.delete',
		'threads.delete',
		'graphs.delete',
		'graphs.episodes.delete',
		'userGroups.removeMembers',
		'agents.verifiers.revoke',
	] as const)('%s is destructive', (id) => {
		expect(zepEndpointMeta[id].riskLevel).toBe('destructive');
	});

	it.each([
		'graphs.searchEdges',
		'graphs.getContext',
		'users.list',
		'users.lookup',
		'graphs.query',
	] as const)('%s, a POST that only reads, is read', (id) => {
		expect(zepEndpointMeta[id].riskLevel).toBe('read');
	});

	it.each([
		'threads.messages.add',
		'graphs.episodes.add',
		'users.create',
	] as const)('%s is write', (id) => {
		expect(zepEndpointMeta[id].riskLevel).toBe('write');
	});
});
