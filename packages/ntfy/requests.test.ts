import { Account, Messages, Server } from './endpoints';
import { NtfyEndpointInputSchemas as Inputs } from './endpoints/types';
import {
	actionsMessage,
	anonymousAccount,
	clearedMessage,
	deletedMessage,
	health,
	pollNdjson,
	publishedMessage,
	serverStats,
	updatedMessage,
} from './test-fixtures';

const API_KEY = 'tk_0123456789abcdefghij0123456789';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant.
// unknown: the return value is operation-specific; each test asserts through
// its own output schema parse rather than through this alias.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// The fake context only carries what the endpoints read (ctx.key).
// unknown: inputs differ per operation, so the helper takes the raw value
// each test builds for its endpoint's input schema.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or NDJSON text.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string'
						? 'application/x-ndjson; charset=utf-8'
						: 'application/json',
			},
		}),
	);
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
	expect(sent.origin).toBe('https://ntfy.sh');
	expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('messages.send', () => {
	it('POSTs the JSON publish to the server root with the topic in the body', async () => {
		respond(publishedMessage);

		const result = await invoke(Messages.send, {
			topic: 'corsair-research-x9k2f',
			message: 'JSON probe 2',
			title: 'JSON title',
			priority: 4,
			tags: ['tada'],
			click: 'https://example.com',
		});

		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/');
		expect(sent.body).toEqual({
			topic: 'corsair-research-x9k2f',
			message: 'JSON probe 2',
			title: 'JSON title',
			priority: 4,
			tags: ['tada'],
			click: 'https://example.com',
			markdown: undefined,
			actions: undefined,
			delay: undefined,
			sequence_id: undefined,
		});
		expect(result).toEqual(publishedMessage);
	});

	it('sends priority names, actions, delay and sequenceId', async () => {
		respond(actionsMessage);

		await invoke(Messages.send, {
			topic: 'mytopic',
			priority: 'urgent',
			markdown: true,
			delay: '30min',
			sequenceId: 'seq-1',
			actions: [
				{
					action: 'view',
					label: 'Open portal',
					url: 'https://example.com',
					clear: true,
				},
			],
		});

		const sent = lastRequest();
		expect(sent.body).toMatchObject({
			topic: 'mytopic',
			// The JSON body takes an int: names are mapped (urgent = 5).
			priority: 5,
			markdown: true,
			delay: '30min',
			sequence_id: 'seq-1',
			actions: [
				{
					action: 'view',
					label: 'Open portal',
					url: 'https://example.com',
					clear: true,
				},
			],
		});
	});

	it('rejects an invalid topic charset and a fourth action', () => {
		expect(() => Inputs.messagesSend.parse({ topic: 'bad topic!' })).toThrow(
			/[-_A-Za-z0-9]/,
		);
		expect(() =>
			Inputs.messagesSend.parse({
				topic: 'ok',
				actions: [
					{ action: 'view', label: 'a', url: 'https://x' },
					{ action: 'view', label: 'b', url: 'https://x' },
					{ action: 'view', label: 'c', url: 'https://x' },
					{ action: 'view', label: 'd', url: 'https://x' },
				],
			}),
		).toThrow();
		expect(() =>
			Inputs.messagesSend.parse({ topic: 'ok', priority: 9 }),
		).toThrow();
	});
});

describe('messages.poll', () => {
	it('GETs {topic}/json with poll=1 and parses the NDJSON lines', async () => {
		respond(pollNdjson);

		const result = await invoke(Messages.poll, {
			topic: 'corsair-research-x9k2f',
		});

		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.method).toBe('GET');
		expect(sent.path).toBe('/corsair-research-x9k2f/json');
		expect(sent.query).toEqual({ poll: '1' });
		expect(result).toEqual({
			messages: [
				{
					id: 'FxMgeKMHrn69',
					time: 1795793425,
					expires: 1795836625,
					event: 'message',
					topic: 'corsair-research-x9k2f',
					title: 'Probe title',
					message: 'Raw body probe from corsair research',
					priority: 4,
					tags: ['warning', 'skull'],
				},
			],
		});
	});

	it('sends since, sched and the comma-joined filters', async () => {
		respond('');

		await invoke(Messages.poll, {
			topic: 'a,b',
			since: '10min',
			scheduled: true,
			priority: [4, 'urgent'],
			tags: ['warning', 'skull'],
			message: 'probe',
			title: 'Probe title',
			id: 'FxMgeKMHrn69',
		});

		expect(lastRequest().query).toEqual({
			poll: '1',
			since: '10min',
			sched: '1',
			id: 'FxMgeKMHrn69',
			message: 'probe',
			title: 'Probe title',
			priority: '4,urgent',
			tags: 'warning,skull',
		});
	});

	it('sends a numeric since and omits unset filters', async () => {
		respond('');

		await invoke(Messages.poll, { topic: 'a', since: 1795793425 });

		expect(lastRequest().query).toEqual({
			poll: '1',
			since: '1795793425',
		});
	});

	it('returns an empty list for the empty body of an unknown topic', async () => {
		respond('');

		const result = await invoke(Messages.poll, {
			topic: 'corsair-never-published-zz',
		});

		expect(result).toEqual({ messages: [] });
	});
});

describe('messages.update', () => {
	it('POSTs the JSON publish with sequence_id in the body', async () => {
		respond(updatedMessage);

		const result = await invoke(Messages.update, {
			topic: 'corsair-research-x9k2f',
			message: 'Seq v2',
			sequenceId: 'corsair-seq-abc123',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({ method: 'POST', path: '/' });
		expect(lastRequest().body).toEqual({
			topic: 'corsair-research-x9k2f',
			message: 'Seq v2',
			sequence_id: 'corsair-seq-abc123',
			title: undefined,
			priority: undefined,
			tags: undefined,
			click: undefined,
			markdown: undefined,
			actions: undefined,
			delay: undefined,
		});
		expect(result).toEqual(updatedMessage);
	});

	it('requires sequenceId', () => {
		expect(() => Inputs.messagesUpdate.parse({ topic: 'ok' })).toThrow();
	});
});

describe('messages.clear', () => {
	it('PUTs {topic}/{sequenceId}/clear', async () => {
		respond(clearedMessage);

		const result = await invoke(Messages.clear, {
			topic: 'corsair-research-x9k2f',
			sequenceId: 'corsair-seq-abc123',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/corsair-research-x9k2f/corsair-seq-abc123/clear',
		});
		expect(result).toEqual(clearedMessage);
	});
});

describe('messages.delete', () => {
	it('DELETEs {topic}/{sequenceId}', async () => {
		respond(deletedMessage);

		const result = await invoke(Messages.remove, {
			topic: 'corsair-research-x9k2f',
			sequenceId: 'corsair-seq-abc123',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/corsair-research-x9k2f/corsair-seq-abc123',
		});
		expect(result).toEqual(deletedMessage);
	});
});

describe('account.usage', () => {
	it('GETs /v1/account with the token', async () => {
		respond(anonymousAccount);

		const result = await invoke(Account.usage, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({ method: 'GET', path: '/v1/account' });
		expect(result).toEqual(anonymousAccount);
	});
});

describe('server.health', () => {
	it('GETs /v1/health', async () => {
		respond(health);

		const result = await invoke(Server.health, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({ method: 'GET', path: '/v1/health' });
		expect(result).toEqual(health);
	});
});

describe('server.stats', () => {
	it('GETs /v1/stats', async () => {
		respond(serverStats);

		const result = await invoke(Server.stats, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({ method: 'GET', path: '/v1/stats' });
		expect(result).toEqual(serverStats);
	});
});
