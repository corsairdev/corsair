import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
	Admin,
	Answers,
	Images,
	Llm,
	Local,
	News,
	Spellcheck,
	Suggest,
	Videos,
	Web,
} from './endpoints';
import type { BraveSearchContext } from './index';

// Response fixtures are trimmed copies of live Brave Search responses
// (2026-11-27). suggest.json and spellcheck.json follow Brave's reference (the
// test key's plan doesn't include them); the SSE stream follows the format in
// Brave's Answers guide.

// `unknown` is necessary because fixtures are parsed JSON of many shapes.
function fixture(name: string): unknown {
	return JSON.parse(
		readFileSync(join(__dirname, '__fixtures__', `${name}.json`), 'utf8'),
	);
}

type Sent = { url: URL; method: string; headers: Headers; body?: string };
let sent: Sent[] = [];

function respond(
	body: unknown,
	init: { status?: number; contentType?: string } = {},
) {
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, req) => {
		sent.push({
			url: new URL(String(input)),
			method: req?.method ?? 'GET',
			headers: new Headers(req?.headers),
			body: typeof req?.body === 'string' ? req.body : undefined,
		});
		return new Response(
			typeof body === 'string' ? body : JSON.stringify(body),
			{
				status: init.status ?? 200,
				headers: { 'content-type': init.contentType ?? 'application/json' },
			},
		);
	});
}

function ctx(overrides: Partial<BraveSearchContext> = {}): BraveSearchContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('acct'),
		key: 'search-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('dek'),
			issue_new_dek: () => Promise.resolve('dek'),
			get_api_key: () => Promise.resolve('search-key'),
			set_api_key: () => Promise.resolve(),
			get_admin_key: () => Promise.resolve(null),
			set_admin_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
		...overrides,
	} as BraveSearchContext;
}

function last(): Sent {
	const call = sent.at(-1);
	if (!call) throw new Error('no request sent');
	return call;
}

beforeEach(() => {
	sent = [];
});
afterEach(() => jest.restoreAllMocks());

describe('search endpoints', () => {
	const cases = [
		[
			'web.search',
			'/res/v1/web/search',
			Web.search,
			'web-search',
			{ q: 'corsair mcp gateway', count: 3 },
		],
		[
			'web.rich',
			'/res/v1/web/rich',
			Web.rich,
			'web-rich',
			{ callback_key: 'c9b33a05' },
		],
		[
			'llm.context',
			'/res/v1/llm/context',
			Llm.context,
			'llm-context',
			{ q: 'tallest mountains', maximum_number_of_tokens: 1024 },
		],
		[
			'news.search',
			'/res/v1/news/search',
			News.search,
			'news-search',
			{ q: 'brave search api', count: 2 },
		],
		[
			'videos.search',
			'/res/v1/videos/search',
			Videos.search,
			'videos-search',
			{ q: 'rust programming', count: 2 },
		],
		[
			'images.search',
			'/res/v1/images/search',
			Images.search,
			'images-search',
			{ q: 'golden gate bridge', count: 2 },
		],
		[
			'local.placeSearch',
			'/res/v1/local/place_search',
			Local.placeSearch,
			'place-search',
			{ q: 'coffee', location: 'san francisco ca united states' },
		],
		[
			'local.descriptions',
			'/res/v1/local/descriptions',
			Local.descriptions,
			'local-descriptions',
			{ ids: ['loc1'] },
		],
		[
			'suggest.search',
			'/res/v1/suggest/search',
			Suggest.search,
			'suggest',
			{ q: 'hello wor', count: 3 },
		],
		[
			'spellcheck.search',
			'/res/v1/spellcheck/search',
			Spellcheck.search,
			'spellcheck',
			{ q: 'helo wrold' },
		],
	] as const;

	it.each(cases)(
		'%s sends GET %s with the search key and its query',
		async (_id, path, endpoint, name, input) => {
			respond(fixture(name));
			// `unknown` is necessary because the table runs operations with different input types.
			const result = await (
				endpoint as (c: BraveSearchContext, i: unknown) => Promise<unknown>
			)(ctx(), input);
			const call = last();
			expect(call.method).toBe('GET');
			expect(`${call.url.origin}${call.url.pathname}`).toBe(
				`https://api.search.brave.com${path}`,
			);
			expect(call.headers.get('x-subscription-token')).toBe('search-key');
			expect(call.headers.get('accept')).toBe('application/json');
			for (const [field, value] of Object.entries(input)) {
				if (Array.isArray(value))
					expect(call.url.searchParams.getAll(field)).toEqual(value);
				else expect(call.url.searchParams.get(field)).toBe(String(value));
			}
			expect(result).toEqual(expect.any(Object));
		},
	);

	it('web.search joins result_filter with commas, repeats goggles and maps headers', async () => {
		respond(fixture('web-search'));
		await Web.search(ctx(), {
			q: 'weather',
			result_filter: ['web', 'news'],
			goggles: ['https://example.com/a.goggle', 'https://example.com/b.goggle'],
			extra_snippets: true,
			location: {
				lat: 37.7,
				long: -122.4,
				city: 'San Francisco',
				country: 'US',
				timezone: 'America/Los_Angeles',
			},
			api_version: '2023-01-01',
			no_cache: true,
			user_agent: 'Mozilla/5.0',
		});
		const call = last();
		expect(call.url.searchParams.get('result_filter')).toBe('web,news');
		expect(call.url.searchParams.getAll('goggles')).toEqual([
			'https://example.com/a.goggle',
			'https://example.com/b.goggle',
		]);
		expect(call.url.searchParams.get('extra_snippets')).toBe('true');
		for (const field of ['location', 'api_version', 'no_cache', 'user_agent']) {
			expect(call.url.searchParams.has(field)).toBe(false);
		}
		expect(call.headers.get('x-loc-lat')).toBe('37.7');
		expect(call.headers.get('x-loc-long')).toBe('-122.4');
		expect(call.headers.get('x-loc-city')).toBe('San Francisco');
		expect(call.headers.get('x-loc-country')).toBe('US');
		expect(call.headers.get('x-loc-timezone')).toBe('America/Los_Angeles');
		expect(call.headers.get('api-version')).toBe('2023-01-01');
		expect(call.headers.get('cache-control')).toBe('no-cache');
		expect(call.headers.get('user-agent')).toBe('Mozilla/5.0');
	});

	it('web.search parses the live response and keeps unlisted fields', async () => {
		respond(fixture('web-search'));
		const result = await Web.search(ctx(), { q: 'corsair mcp gateway' });
		expect(result.query?.original).toBe('corsair mcp gateway');
		expect(result.web?.results?.[0]?.url).toMatch(/^https?:\/\//);
		expect(result.query).toHaveProperty('is_navigational');
	});

	it('local.pois repeats ids and sends only lat/long headers', async () => {
		respond(fixture('local-pois'));
		const result = await Local.pois(ctx(), {
			ids: ['loc4YILSMUYF4NBEBWPOD2QPXGS6YCQ3PLJV35UGQWY=', 'loc46PUQ'],
			units: 'metric',
			location: { lat: 37.77, long: -122.42 },
		});
		const call = last();
		expect(call.url.pathname).toBe('/res/v1/local/pois');
		expect(call.url.searchParams.getAll('ids')).toEqual([
			'loc4YILSMUYF4NBEBWPOD2QPXGS6YCQ3PLJV35UGQWY=',
			'loc46PUQ',
		]);
		expect(call.headers.get('x-loc-lat')).toBe('37.77');
		expect(result.results?.[0]?.title).toBe('Zuni Café');
	});

	it('llm.context reads sources keyed by URL', async () => {
		respond(fixture('llm-context'));
		const result = await Llm.context(ctx(), {
			q: 'tallest mountains in the world',
		});
		expect(result.grounding?.generic?.[0]?.snippets?.length).toBeGreaterThan(0);
		const [source] = Object.values(result.sources ?? {});
		expect(source?.hostname).toEqual(expect.any(String));
	});

	it('web.rich returns the live weather result', async () => {
		respond(fixture('web-rich'));
		const result = await Web.rich(ctx(), { callback_key: 'c9b33a05' });
		expect(result.results?.[0]?.subtype).toBe('weather');
	});

	it('rejects input outside the documented ranges before sending', async () => {
		respond(fixture('web-search'));
		await expect(Web.search(ctx(), { q: 'x', count: 21 })).rejects.toThrow();
		await expect(Web.search(ctx(), { q: 'x', offset: 10 })).rejects.toThrow();
		await expect(
			News.search(ctx(), { q: 'x', freshness: 'yesterday' }),
		).rejects.toThrow();
		await expect(
			Images.search(ctx(), { q: 'x', count: 201 }),
		).rejects.toThrow();
		await expect(Local.pois(ctx(), { ids: [] })).rejects.toThrow();
		expect(sent).toHaveLength(0);
	});
});

describe('errors', () => {
	it('surfaces OPTION_NOT_IN_PLAN as an ApiError with Brave detail and code', async () => {
		respond(fixture('error-option-not-in-plan'), { status: 400 });
		const error = await Suggest.search(ctx(), { q: 'hello' }).catch(
			(e: Error) => e,
		);
		expect(error).toMatchObject({ name: 'ApiError', status: 400 });
		expect((error as Error).message).toBe(
			'Brave Search HTTP 400: The option is not included in the plan. (OPTION_NOT_IN_PLAN)',
		);
	});

	it('drops the request body and location headers from the error', async () => {
		respond(fixture('error-option-not-in-plan'), { status: 400 });
		const error = (await Answers.create(ctx(), {
			messages: [{ role: 'user', content: 'a private question' }],
		}).catch((e: unknown) => e)) as { request: Record<string, unknown> };
		expect(error.request.body).toBeUndefined();
		expect(error.request.headers).toBeUndefined();
		expect(JSON.stringify(error.request)).not.toContain('private question');

		respond(fixture('error-option-not-in-plan'), { status: 400 });
		const located = (await Web.search(ctx(), {
			q: 'coffee',
			location: { lat: 12.3456, long: 65.4321 },
		}).catch((e: unknown) => e)) as { request: Record<string, unknown> };
		expect(JSON.stringify(located.request)).not.toContain('12.3456');
	});

	it('keeps the search terms out of the error URL and body', async () => {
		respond(
			{
				type: 'ErrorResponse',
				error: {
					id: 'e1',
					status: 422,
					code: 'VALIDATION',
					detail: 'Unable to validate request parameter(s)',
					meta: {
						errors: [
							{
								loc: ['query', 'q'],
								input: 'my secret query',
								ctx: { max: 600 },
							},
						],
					},
				},
			},
			{ status: 422 },
		);
		const error = (await Web.search(ctx(), { q: 'my secret query' }).catch(
			(e: unknown) => e,
		)) as { url: string; body: unknown; status: number; message: string };
		expect(error.status).toBe(422);
		expect(error.url).toBe('https://api.search.brave.com/res/v1/web/search');
		expect(JSON.stringify(error.body)).not.toContain('my secret query');
		expect(error.body).toMatchObject({
			error: {
				code: 'VALIDATION',
				meta: { errors: [{ loc: ['query', 'q'] }] },
			},
		});
		expect(error.message).not.toContain('my secret query');
	});

	it('refuses an empty key without calling Brave', async () => {
		respond({});
		await expect(Web.search(ctx({ key: '' }), { q: 'x' })).rejects.toThrow(
			/api_key/,
		);
		expect(sent).toHaveLength(0);
	});
});

const STREAM = [
	'data: {"id":"chatcmpl-1","object":"chat.completion.chunk","created":1795700000,"model":"brave-pro","choices":[{"delta":{"role":"assistant","content":"K2 is "}}]}',
	'',
	'data: {"id":"chatcmpl-1","object":"chat.completion.chunk","created":1795700000,"model":"brave-pro","choices":[{"delta":{"content":"8,611 m high."}}]}',
	'',
	'data: {"id":"chatcmpl-1","choices":[{"delta":{"content":"<citation>{\\"start_index\\":0,\\"end_index\\":5,\\"number\\":1,\\"url\\":\\"https://en.wikipedia.org/wiki/K2\\",\\"snippet\\":\\"K2\\"}</citation>"}}]}',
	'',
	'data: {"id":"chatcmpl-1","choices":[{"delta":{"content":"<enum_item>{\\"name\\":\\"K2\\"}</enum_item>"}}]}',
	'',
	'data: {"id":"chatcmpl-1","choices":[{"delta":{"content":"<usage>{\\"X-Request-Queries\\":1,\\"X-Request-Total-Cost\\":0.0061}</usage>"},"finish_reason":"stop"}]}',
	'',
	'data: [DONE]',
	'',
].join('\n');

describe('answers', () => {
	it('answers.create streams and puts the answer, citations and cost together', async () => {
		respond(STREAM, { contentType: 'text/event-stream' });
		const result = await Answers.create(ctx(), {
			messages: [
				{ role: 'user', content: 'What is the second highest mountain?' },
			],
			enable_citations: true,
			country: 'us',
		});
		const call = last();
		expect(call.method).toBe('POST');
		expect(call.url.href).toBe(
			'https://api.search.brave.com/res/v1/chat/completions',
		);
		expect(call.headers.get('x-subscription-token')).toBe('search-key');
		expect(call.headers.get('content-type')).toContain('application/json');
		expect(JSON.parse(call.body ?? '{}')).toEqual({
			messages: [
				{ role: 'user', content: 'What is the second highest mountain?' },
			],
			enable_citations: true,
			country: 'us',
			stream: true,
		});
		expect(result.choices[0]?.message.content).toBe('K2 is 8,611 m high.');
		expect(result.choices[0]?.finish_reason).toBe('stop');
		expect(result.model).toBe('brave-pro');
		expect(result.citations).toEqual([
			expect.objectContaining({
				number: 1,
				url: 'https://en.wikipedia.org/wiki/K2',
				start_index: 0,
			}),
		]);
		expect(result.cost).toEqual({
			'X-Request-Queries': 1,
			'X-Request-Total-Cost': 0.0061,
		});
		expect(result.tags).toEqual([{ tag: 'enum_item', value: { name: 'K2' } }]);
	});

	it('answers.research turns on research mode and widens the timeout', async () => {
		respond(STREAM, { contentType: 'text/event-stream' });
		const timeout = jest.spyOn(AbortSignal, 'timeout');
		await Answers.research(ctx(), {
			messages: [{ content: 'History of quantum mechanics' }],
			research_maximum_number_of_seconds: 30,
		});
		const body = JSON.parse(last().body ?? '{}');
		expect(body).toMatchObject({
			enable_research: true,
			stream: true,
			research_maximum_number_of_seconds: 30,
		});
		if (timeout.mock.calls.length > 0)
			expect(timeout).toHaveBeenCalledWith(90_000);
	});

	it('accepts a plain JSON completion too', async () => {
		respond({
			id: 'c1',
			object: 'chat.completion',
			created: 1,
			model: 'brave',
			choices: [
				{
					index: 0,
					message: { role: 'assistant', content: 'Hi' },
					finish_reason: 'stop',
				},
			],
		});
		const result = await Answers.create(ctx(), {
			messages: [{ content: 'hi' }],
		});
		expect(result.choices[0]?.message.content).toBe('Hi');
		expect(result.citations).toEqual([]);
	});

	it('allows exactly one user message', async () => {
		respond(STREAM, { contentType: 'text/event-stream' });
		await expect(
			Answers.create(ctx(), {
				messages: [{ content: 'a' }, { content: 'b' }],
			}),
		).rejects.toThrow();
		expect(sent).toHaveLength(0);
	});
});

describe('admin endpoints', () => {
	const me = {
		object: 'admin_key',
		id: 'akey_x',
		name: 'Finance warehouse sync',
		scopes: ['usage:read'],
		status: 'active',
		expires_at: null,
		organization: { name: 'Acme Search' },
	};

	it('admin.me sends ctx.key (the admin key) as a bearer token', async () => {
		respond(me);
		const result = await Admin.me(ctx({ key: 'bsk_admin_live_x' }), {});
		const call = last();
		expect(call.url.href).toBe('https://api.search.brave.com/admin/v1/me');
		expect(call.headers.get('authorization')).toBe('Bearer bsk_admin_live_x');
		expect(call.headers.get('x-subscription-token')).toBeNull();
		expect(result.organization?.name).toBe('Acme Search');
	});

	it('refuses an empty admin key without calling Brave', async () => {
		respond(me);
		await expect(Admin.me(ctx({ key: '' }), {})).rejects.toThrow(/admin_key/);
		expect(sent).toHaveLength(0);
	});

	it('admin.usage repeats list parameters', async () => {
		respond({
			object: 'list',
			data: [],
			api_keys: {},
			plans: {},
			has_more: false,
			next_page: null,
			data_refreshed_at: null,
		});
		const result = await Admin.usage(ctx({ key: 'bsk_admin_live_x' }), {
			starting_at: '2026-11-01T00:00:00Z',
			bucket_width: '1d',
			group_by: ['plan_id', 'endpoint'],
			endpoints: ['web', 'llm_context'],
			limit: 7,
		});
		const url = last().url;
		expect(url.pathname).toBe('/admin/v1/usage');
		expect(url.searchParams.get('starting_at')).toBe('2026-11-01T00:00:00Z');
		expect(url.searchParams.getAll('group_by')).toEqual([
			'plan_id',
			'endpoint',
		]);
		expect(url.searchParams.getAll('endpoints')).toEqual([
			'web',
			'llm_context',
		]);
		expect(result.has_more).toBe(false);
	});

	it.each([
		['admin.listApiKeys', Admin.listApiKeys, '/admin/v1/api_keys'],
		['admin.listAdminKeys', Admin.listAdminKeys, '/admin/v1/admin_keys'],
	] as const)('%s pages with limit and page', async (_id, endpoint, path) => {
		respond({
			object: 'list',
			data: [
				{ object: 'api_key', id: 'key_a', hint: '7f2a', status: 'active' },
			],
			has_more: true,
			next_page: 'p2',
		});
		const result = await endpoint(ctx({ key: 'bsk_admin_live_x' }), {
			limit: 10,
			page: 'p1',
			include_deleted: true,
		});
		const url = last().url;
		expect(url.pathname).toBe(path);
		expect(url.searchParams.get('limit')).toBe('10');
		expect(url.searchParams.get('page')).toBe('p1');
		expect(url.searchParams.get('include_deleted')).toBe('true');
		expect(result.next_page).toBe('p2');
	});

	it('reports ADMIN_KEY_INVALID from Brave', async () => {
		respond(fixture('error-admin-key-invalid'), { status: 401 });
		await expect(
			Admin.me(ctx({ key: 'bsk_admin_live_bad' }), {}),
		).rejects.toThrow(/ADMIN_KEY_INVALID/);
	});
});
