import { logEventFromContext } from 'corsair/core';
import { AnyApiAPIError } from './client';
import {
	Account,
	Apis,
	Google,
	Instagram,
	LinkedIn,
	Maps,
	Reddit,
	Requests,
	Results,
	Twitter,
	Web,
} from './endpoints';
import {
	catalogEntry,
	company,
	errorBody,
	googleData,
	instagramData,
	mapsData,
	profile,
	redditData,
	requestSnapshot,
	runResult,
	scrapeData,
	tweetsData,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'aa-test-key';

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

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

// unknown: the cases cover sixteen operations whose inputs, responses and
// request bodies all differ; each case's check() reads its own result.
type Case = {
	operation: string;
	endpoint: AnyEndpoint;
	input: Record<string, unknown>;
	response: unknown;
	method: 'GET' | 'POST';
	path: string;
	query?: Record<string, string>;
	body?: unknown;
	// unknown: each case reads its own result shape.
	check: (result: unknown) => void;
};

// Reads a dotted path (array indexes as numbers) out of an endpoint result.
// unknown: each case reads a different output shape.
function pick(result: unknown, path: string): unknown {
	return path
		.split('.')
		.reduce<unknown>(
			(value, key) =>
				value !== null && typeof value === 'object'
					? (value as Record<string, unknown>)[key]
					: undefined,
			result,
		);
}

const cases: Case[] = [
	{
		operation: 'apis.search',
		endpoint: Apis.search,
		input: { query: 'linkedin company page', platform: 'linkedin', limit: 3 },
		response: { results: [catalogEntry], total: 52, ranking: 'semantic' },
		method: 'GET',
		path: '/catalog/search',
		query: { q: 'linkedin company page', platform: 'linkedin', limit: '3' },
		check: (r) => expect(pick(r, 'results.0.slug')).toBe('linkedin.company'),
	},
	{
		operation: 'apis.list',
		endpoint: Apis.list,
		input: { category: 'social' },
		response: { apis: [catalogEntry] },
		method: 'GET',
		path: '/v1/apis',
		query: { category: 'social' },
		check: (r) => expect(pick(r, 'apis')).toHaveLength(1),
	},
	{
		operation: 'apis.get',
		endpoint: Apis.get,
		input: { sku: 'linkedin.company' },
		response: {
			...catalogEntry,
			inputSchema: {
				type: 'object',
				required: ['url'],
				properties: { url: { type: 'string' } },
			},
			outputSchema: { type: 'object' },
			latency: {
				window: '30d',
				p50Ms: 1616,
				p95Ms: 5912,
				p99Ms: 63910,
				sample: 106747,
			},
		},
		method: 'GET',
		path: '/v1/apis/linkedin.company',
		check: (r) => expect(pick(r, 'latency.p50Ms')).toBe(1616),
	},
	{
		operation: 'apis.quote',
		endpoint: Apis.quote,
		input: {
			sku: 'linkedin.company',
			input: { url: 'https://www.linkedin.com/company/fieldkit' },
		},
		response: {
			maxCostUsd: 0.00253,
			minCostUsd: 0.0011,
			baseUsd: 0,
			perItemUsd: 0,
			exact: false,
			pricing: 'Flat $0.0011 per call.',
		},
		method: 'POST',
		path: '/v1/apis/linkedin.company/quote',
		body: { url: 'https://www.linkedin.com/company/fieldkit' },
		check: (r) => expect(pick(r, 'maxCostUsd')).toBe(0.00253),
	},
	{
		operation: 'apis.run',
		endpoint: Apis.run,
		input: {
			sku: 'linkedin.company',
			input: { url: 'https://www.linkedin.com/company/fieldkit' },
		},
		response: runResult(company),
		method: 'POST',
		path: '/v1/run/linkedin.company',
		body: { url: 'https://www.linkedin.com/company/fieldkit' },
		check: (r) => expect(pick(r, 'output.data.name')).toBe('Fieldkit'),
	},
	{
		operation: 'results.get',
		endpoint: Results.get,
		input: { resultId: 'd668386e', fields: 'name' },
		response: { ...runResult({ name: 'Fieldkit' }), replayed: true },
		method: 'GET',
		path: '/v1/results/d668386e',
		query: { fields: 'name' },
		check: (r) => expect(pick(r, 'output.data')).toEqual({ name: 'Fieldkit' }),
	},
	{
		operation: 'requests.get',
		endpoint: Requests.get,
		input: { requestId: requestSnapshot.requestId },
		response: {
			...requestSnapshot,
			status: 'succeeded',
			result: { output: { found: true, data: {} } },
		},
		method: 'GET',
		path: `/v1/requests/${requestSnapshot.requestId}`,
		check: (r) => expect(pick(r, 'status')).toBe('succeeded'),
	},
	{
		operation: 'account.getBalance',
		endpoint: Account.getBalance,
		input: {},
		response: { usd: 0.1407 },
		method: 'GET',
		path: '/v1/balance',
		check: (r) => expect(pick(r, 'usd')).toBe(0.1407),
	},
	{
		operation: 'google.search',
		endpoint: Google.search,
		input: {
			query: 'model context protocol servers',
			limit: 5,
			gl: 'us',
			timeframe: '7d',
		},
		response: runResult(googleData, 0.0004, 1),
		method: 'POST',
		path: '/v1/run/google.search',
		body: {
			query: 'model context protocol servers',
			limit: 5,
			gl: 'us',
			timeframe: '7d',
		},
		check: (r) => expect(pick(r, 'output.data.results.0.position')).toBe(1),
	},
	{
		operation: 'web.scrape',
		endpoint: Web.scrape,
		input: {
			url: 'https://example.com',
			formats: ['markdown'],
			onlyMainContent: true,
		},
		response: runResult(scrapeData, 0.001),
		method: 'POST',
		path: '/v1/run/web.scrape',
		body: {
			url: 'https://example.com',
			formats: ['markdown'],
			onlyMainContent: true,
		},
		check: (r) =>
			expect(pick(r, 'output.data.markdown')).toBe('# Example Domain'),
	},
	{
		operation: 'linkedin.getProfile',
		endpoint: LinkedIn.getProfile,
		input: { url: 'https://www.linkedin.com/in/maya-ruiz' },
		response: runResult(profile, 0.0029),
		method: 'POST',
		path: '/v1/run/linkedin.profile',
		body: { url: 'https://www.linkedin.com/in/maya-ruiz' },
		check: (r) =>
			expect(pick(r, 'output.data.headline')).toBe(
				'Head of Engineering at Fieldkit',
			),
	},
	{
		operation: 'linkedin.getCompany',
		endpoint: LinkedIn.getCompany,
		input: { url: 'https://www.linkedin.com/company/fieldkit' },
		response: runResult(company),
		method: 'POST',
		path: '/v1/run/linkedin.company',
		body: { url: 'https://www.linkedin.com/company/fieldkit' },
		check: (r) => expect(pick(r, 'output.data.employeeCount')).toBe(35),
	},
	{
		operation: 'twitter.search',
		endpoint: Twitter.search,
		input: { query: 'mcp', queryType: 'Top', limit: 20, cursor: 'abc' },
		response: runResult(tweetsData, 0.0006, 20),
		method: 'POST',
		path: '/v1/run/twitter.search',
		body: { query: 'mcp', queryType: 'Top', limit: 20, cursor: 'abc' },
		check: (r) =>
			expect(pick(r, 'output.data.items.0.authorUsername')).toBe('fieldkit'),
	},
	{
		operation: 'reddit.search',
		endpoint: Reddit.search,
		input: { query: 'mcp', sort: 'top', timeframe: 'week' },
		response: runResult(redditData, 0.00035, 25),
		method: 'POST',
		path: '/v1/run/reddit.search',
		body: { query: 'mcp', sort: 'top', timeframe: 'week' },
		check: (r) =>
			expect(pick(r, 'output.data.posts.0.subreddit')).toBe('ClaudeAI'),
	},
	{
		operation: 'instagram.getProfile',
		endpoint: Instagram.getProfile,
		input: { handle: 'fieldkit' },
		response: runResult(instagramData, 0.001),
		method: 'POST',
		path: '/v1/run/instagram.profile',
		body: { handle: 'fieldkit' },
		check: (r) => expect(pick(r, 'output.data.followers')).toBe(4200),
	},
	{
		operation: 'maps.search',
		endpoint: Maps.search,
		input: {
			query: 'coffee shop',
			location: 'Austin, USA',
			limit: 3,
			website: 'withWebsite',
		},
		response: runResult(mapsData, 0.00175, 1),
		method: 'POST',
		path: '/v1/run/maps.search',
		body: {
			query: 'coffee shop',
			location: 'Austin, USA',
			limit: 3,
			website: 'withWebsite',
		},
		check: (r) => expect(pick(r, 'output.data.items.0.rating')).toBe(4.6),
	},
];

describe.each(cases)('$operation', (c) => {
	it('sends the documented request with the API key and parses the answer', async () => {
		respond(c.response);

		const result = await invoke(c.endpoint, c.input);

		const sent = lastRequest();
		expect(sent.method).toBe(c.method);
		expect(sent.path).toBe(c.path);
		expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
		expect(sent.query).toEqual(c.query ?? {});
		if (c.body !== undefined) expect(sent.body).toEqual(c.body);
		c.check(result);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			`anyapi.${c.operation}`,
			expect.any(Object),
			'completed',
		);
	});

	it('rejects a malformed response', async () => {
		respond({ unexpected: true });

		await expect(invoke(c.endpoint, c.input)).rejects.toThrow();
	});
});

describe('run controls', () => {
	it('sends maxCostUsd, trimming options and the idempotency key outside the input', async () => {
		respond(runResult({ name: 'Fieldkit' }));

		await invoke(Apis.run, {
			sku: 'linkedin.company',
			input: { url: 'https://www.linkedin.com/company/fieldkit' },
			fields: 'name',
			maxItems: 5,
			summary: false,
			jq: '.data | {name}',
			maxCostUsd: 0.01,
			idempotencyKey: 'run-1',
		});

		const sent = lastRequest();
		expect(sent.query).toEqual({
			fields: 'name',
			max_items: '5',
			summary: 'false',
			jq: '.data | {name}',
			max_cost_usd: '0.01',
		});
		expect(sent.headers.get('idempotency-key')).toBe('run-1');
		expect(sent.body).toEqual({
			url: 'https://www.linkedin.com/company/fieldkit',
		});
	});

	it('keeps run controls out of a typed endpoint body', async () => {
		respond(runResult(company));

		await invoke(LinkedIn.getCompany, {
			url: 'https://www.linkedin.com/company/fieldkit',
			maxCostUsd: 0.002,
			idempotencyKey: 'co-1',
		});

		const sent = lastRequest();
		expect(sent.body).toEqual({
			url: 'https://www.linkedin.com/company/fieldkit',
		});
		expect(sent.query).toEqual({ max_cost_usd: '0.002' });
		expect(sent.headers.get('idempotency-key')).toBe('co-1');
	});

	it('returns a durable run that is still working as a request snapshot', async () => {
		respond(requestSnapshot, 202);

		// unknown: read back with pick(), which narrows one key at a time.
		const result = (await invoke(Apis.run, {
			sku: 'email_verification.bounceban',
			input: { email: 'someone@fieldkit.example' },
		})) as unknown;

		expect(pick(result, 'status')).toBe('running');
		expect(pick(result, 'requestId')).toBe(requestSnapshot.requestId);
	});

	it('accepts a target that does not exist as found false', async () => {
		respond(runResult(null, 0.0011, 0));

		// unknown: read back with pick(), which narrows one key at a time.
		const result = (await invoke(LinkedIn.getCompany, {
			url: 'https://www.linkedin.com/company/does-not-exist',
		})) as unknown;

		expect(pick(result, 'output.found')).toBe(false);
		expect(pick(result, 'output.data')).toBeNull();
	});

	it('logs what a run cost, and no cost for a free re-read', async () => {
		respond(runResult(company));
		await invoke(LinkedIn.getCompany, {
			url: 'https://www.linkedin.com/company/fieldkit',
		});
		expect(mockLog).toHaveBeenLastCalledWith(
			expect.anything(),
			'anyapi.linkedin.getCompany',
			{ sku: 'linkedin.company', costUsd: 0.0011, items: 1 },
			'completed',
		);

		respond({ ...runResult({ name: 'Fieldkit' }), replayed: true });
		await invoke(Results.get, { resultId: 'd668386e' });
		expect(mockLog).toHaveBeenLastCalledWith(
			expect.anything(),
			'anyapi.results.get',
			{ costUsd: undefined, items: 1 },
			'completed',
		);
		expect(JSON.stringify(mockLog.mock.calls)).not.toContain(
			'/company/fieldkit',
		);
	});
});

describe('input validation', () => {
	it.each([
		['an apis.run without a SKU', Apis.run, { input: {} }],
		['a malformed SKU', Apis.get, { sku: '../balance' }],
		[
			'a negative maxCostUsd',
			Apis.run,
			{ sku: 'google.search', input: { query: 'x' }, maxCostUsd: -1 },
		],
		['a google.search without a query', Google.search, {}],
		['a web.scrape URL without a scheme', Web.scrape, { url: 'example.com' }],
		[
			'a web.scrape waitFor above 15 s',
			Web.scrape,
			{ url: 'https://example.com', waitFor: 20000 },
		],
		[
			'a twitter.search limit above 50',
			Twitter.search,
			{ query: 'x', limit: 51 },
		],
		['an unknown reddit sort', Reddit.search, { query: 'x', sort: 'best' }],
		['a maps.search without a location', Maps.search, { query: 'coffee' }],
		['an empty Instagram handle', Instagram.getProfile, { handle: '' }],
	])('rejects %s before calling AnyAPI', async (_label, endpoint, input) => {
		await expect(invoke(endpoint as AnyEndpoint, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('errors', () => {
	it('surfaces a 400 with the fields AnyAPI expected, and logs nothing', async () => {
		respond(
			errorBody(
				"invalid_input: missing property 'url'; required: [url] (no charge)",
				{ code: 'invalid_input' },
			),
			400,
		);

		// unknown: a rejection can be any value until toBeInstanceOf narrows it.
		const error = await invoke(Apis.run, {
			sku: 'linkedin.company',
			input: { website: 'fieldkit.example' },
		}).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(AnyApiAPIError);
		expect((error as AnyApiAPIError).message).toBe(
			"AnyAPI 400: invalid_input: missing property 'url'; required: [url] (no charge)",
		);
		expect(mockLog).not.toHaveBeenCalled();
	});
});
