import {
	browserbaseEndpointsNested as api,
	browserbaseEndpointMeta,
} from './endpoints/catalog';
import type { BrowserbaseContext } from './index';

// Routes written by hand from Browserbase's API reference
// (docs.browserbase.com/reference/api), not read from the manifest.

type Captured = {
	url: URL;
	method: string;
	headers: Record<string, string>;
	// `unknown` because the sent body is a JSON string or a FormData.
	body: unknown;
};
let calls: Captured[] = [];

function reply(
	// `unknown` because each case answers its own body.
	body: unknown,
	status = 200,
	contentType = 'application/json',
) {
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
		const payload =
			body === undefined
				? null
				: typeof body === 'string'
					? body
					: JSON.stringify(body);
		return new Response(payload, {
			status,
			headers: body === undefined ? {} : { 'content-type': contentType },
		});
	});
}

const ctx = {
	endpoints: {},
	$getAccountId: () => Promise.resolve('test-account'),
	key: 'bb_test_key',
	options: {},
	keys: {},
	db: {},
	// `unknown` because a test context fills only the fields the endpoints read.
} as unknown as BrowserbaseContext;

const SESSION = 'b7c1d3e5-0000-4000-8000-000000000001';
beforeEach(() => {
	calls = [];
});
afterEach(() => jest.restoreAllMocks());

function json(index = 0) {
	return JSON.parse(String(calls[index]?.body));
}

describe('browserbase routes', () => {
	it('creates a session with the X-BB-API-Key header', async () => {
		reply({
			id: SESSION,
			status: 'RUNNING',
			connectUrl: 'wss://connect.browserbase.com',
		});
		await api.sessions.create(ctx, { timeout: 120, keepAlive: false });
		expect(calls[0]?.method).toBe('POST');
		expect(calls[0]?.url.href).toBe('https://api.browserbase.com/v1/sessions');
		expect(calls[0]?.headers['x-bb-api-key']).toBe('bb_test_key');
		expect(json()).toEqual({ timeout: 120, keepAlive: false });
	});

	it('releases a session by updating its status', async () => {
		reply({ id: SESSION, status: 'COMPLETED' });
		await api.sessions.update(ctx, { id: SESSION, status: 'REQUEST_RELEASE' });
		expect(calls[0]?.method).toBe('POST');
		expect(calls[0]?.url.pathname).toBe(`/v1/sessions/${SESSION}`);
		expect(json()).toEqual({ status: 'REQUEST_RELEASE' });
	});

	it('replaces session labels with a PUT', async () => {
		reply({ labels: [] });
		await api.sessions.setLabels(ctx, { id: SESSION, labels: [] });
		expect(calls[0]?.method).toBe('PUT');
		expect(calls[0]?.url.pathname).toBe(`/v1/sessions/${SESSION}/labels`);
	});

	it('searches the web with the query next to the provider choice', async () => {
		reply({ results: [] });
		await api.search.web(ctx, {
			query: 'corsair',
			numResults: 3,
			provider: 'exa',
		});
		expect(calls[0]?.url.pathname).toBe('/v1/search');
		expect(json()).toEqual({
			query: 'corsair',
			numResults: 3,
			provider: 'exa',
		});
	});

	it('refuses a search without a query before sending', async () => {
		reply({});
		await expect(api.search.web(ctx, {} as never)).rejects.toThrow(
			/Invalid input/,
		);
		expect(calls).toHaveLength(0);
	});

	it('returns a replay page playlist as a file', async () => {
		reply('#EXTM3U\n#EXT-X-ENDLIST\n', 200, 'application/vnd.apple.mpegurl');
		const out = await api.sessions.replays.page(ctx, {
			id: SESSION,
			pageId: '0',
		});
		expect(calls[0]?.url.pathname).toBe(`/v1/sessions/${SESSION}/replays/0`);
		expect(out).toMatchObject({ contentType: 'application/vnd.apple.mpegurl' });
	});

	it('uploads a file into a session as multipart', async () => {
		reply({ message: 'uploaded' });
		await api.sessions.uploadFile(ctx, {
			id: SESSION,
			file: {
				base64: 'aGk=',
				filename: 'resume.pdf',
				contentType: 'application/pdf',
			},
		});
		expect(calls[0]?.url.pathname).toBe(`/v1/sessions/${SESSION}/uploads`);
		expect(((calls[0]?.body as FormData).get('file') as File).name).toBe(
			'resume.pdf',
		);
	});
});

describe('risk levels', () => {
	it.each([
		'sessions.create',
		'sessions.update',
		'functions.invoke',
		'agents.runs.create',
		'webhooks.rotateSecret',
		'contexts.delete',
	] as const)('%s is destructive', (id) => {
		expect(browserbaseEndpointMeta[id].riskLevel).toBe('destructive');
	});

	it.each(['fetch.page', 'search.web', 'sessions.list'] as const)(
		'%s is read',
		(id) => {
			expect(browserbaseEndpointMeta[id].riskLevel).toBe('read');
		},
	);
});
