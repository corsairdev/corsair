import { createCorsair } from 'corsair';
import { asRecord } from 'corsair/core';
import type { NeuronwriterPluginOptions } from './index';
import { neuronwriter, neuronwriterEndpointsNested } from './index';
import {
	analysisInProgress,
	analysisReady,
	analysisWaiting,
	importFailed,
	importOk,
	invalidKey,
	projects,
	queryList,
	savedContent,
	startedAnalysis,
} from './test-fixtures';

const API_KEY = 'n-c17ef87a9ab8285ea7ef06064031fad4';

function makeContext() {
	return {
		key: API_KEY,
		authType: 'api_key' as const,
		options: {} as NeuronwriterPluginOptions,
		tenantId: 'default',
		log: async () => undefined,
		db: {},
		keys: {},
		_http: {},
	};
}

/**
 * The endpoint functions expect the plugin's full runtime context, which a test
 * cannot build without a database and a key manager. They only read `ctx.key`
 * and `ctx.log`, both of which `makeContext` provides.
 */
// unknown: each operation takes its own parsed input, and every call site passes
// a concrete value that the operation's own schema validates.
//
// `as never` below is used at two kinds of site, and nothing else: an invalid
// value handed to a rejection test (`competitors_mode: 'top50'`), or a partial
// object standing in for the plugin runtime context. TypeScript cannot express
// either without the cast, because the real types forbid exactly what the test
// is checking for.
type TestEndpoint = (
	ctx: ReturnType<typeof makeContext>,
	input: unknown,
) => Promise<unknown>;

const endpoints = neuronwriterEndpointsNested as unknown as {
	[G in keyof typeof neuronwriterEndpointsNested]: {
		[K in keyof (typeof neuronwriterEndpointsNested)[G]]: TestEndpoint;
	};
};

/** Any one endpoint, as the helpers above describe it. */
type Endpoint = TestEndpoint;

/** Runs one endpoint and returns the response and the request that made it. */
async function capture(
	endpoint: Endpoint,
	input: unknown,
	body: unknown,
	{ status = 200, contentType = 'application/json' } = {},
): Promise<{ result: unknown; url: string; init: RequestInit }> {
	const original = globalThis.fetch;
	let url = '';
	let init: RequestInit = {};
	globalThis.fetch = (async (called: string, options: RequestInit) => {
		url = called;
		init = options;
		return new Response(
			typeof body === 'string' ? body : JSON.stringify(body),
			{ status, headers: { 'Content-Type': contentType } },
		);
	}) as typeof fetch;

	try {
		const result = await endpoint(makeContext(), input);
		if (!url) throw new Error('no request was made');
		return { result, url, init };
	} finally {
		globalThis.fetch = original;
	}
}

/**
 * Resolves to whatever the promise rejected with, so an assertion can read
 * `String(error)` without a cast.
 * unknown: a rejection reason has no static type; each caller only stringifies
 * it, so a stricter type would be invented rather than checked.
 */
async function captureError<T>(promise: Promise<T>): Promise<unknown> {
	return promise.catch((caught: unknown) => caught);
}

function sentBody(init: RequestInit): Record<string, unknown> {
	// unknown: the body is the JSON the endpoint built; read as a record.
	const parsed = JSON.parse(String(init.body)) as unknown;
	const record = asRecord(parsed);
	if (!record) throw new Error('request body was not an object');
	return record;
}

describe('request shape', () => {
	it('posts to the method path with the key in X-API-KEY', async () => {
		const { url, init } = await capture(endpoints.projects.list, {}, projects);

		expect(url).toBe(
			'https://app.neuronwriter.com/neuron-api/0.5/writer/list-projects',
		);
		expect(init.method).toBe('POST');
		const headers = new Headers(init.headers);
		expect(headers.get('x-api-key')).toBe(API_KEY);
		expect(headers.get('authorization')).toBeNull();
		expect(headers.get('content-type')).toBe('application/json');
	});

	it('sends an empty JSON body when the method takes no input', async () => {
		const { init } = await capture(endpoints.projects.list, {}, projects);

		expect(sentBody(init)).toEqual({});
	});
});

describe('projects.list', () => {
	it('lifts the bare array into a projects list', async () => {
		const { result } = await capture(endpoints.projects.list, {}, projects);

		const list = asRecord(result)?.projects;
		expect(Array.isArray(list) ? list.length : 0).toBe(2);
		expect(asRecord(Array.isArray(list) ? list[0] : null)?.name).toBe(
			'adidas.com',
		);
	});

	it('fails loudly when the provider answers something else', async () => {
		await expect(
			capture(endpoints.projects.list, {}, { error: 'nope' }),
		).rejects.toThrow(/project array/);
	});
});

describe('analysis.start', () => {
	it('sends the keyword, engine, language and project', async () => {
		const { result, url, init } = await capture(
			endpoints.analysis.start,
			{
				project: 'c2fe46bce8019bff',
				keyword: 'trail running shoes',
				engine: 'google.co.uk',
				language: 'English',
			},
			startedAnalysis,
		);

		expect(url).toBe(
			'https://app.neuronwriter.com/neuron-api/0.5/writer/new-query',
		);
		const body = sentBody(init);
		expect(body.keyword).toBe('trail running shoes');
		expect(body.project).toBe('c2fe46bce8019bff');
		expect(asRecord(result)?.query).toBe('32dee2a89374a722');
	});

	it('passes competitors_mode through', async () => {
		const { init } = await capture(
			endpoints.analysis.start,
			{
				project: 'p1',
				keyword: 'kw',
				engine: 'google.com',
				language: 'English',
				competitors_mode: 'top-intent',
			},
			startedAnalysis,
		);

		expect(sentBody(init).competitors_mode).toBe('top-intent');
	});

	it('rejects a competitors_mode the provider does not offer', async () => {
		await expect(
			endpoints.analysis.start(makeContext(), {
				project: 'p1',
				keyword: 'kw',
				engine: 'google.com',
				language: 'English',
				competitors_mode: 'top50' as never,
			}),
		).rejects.toThrow();
	});

	it('rejects a missing language, which the provider requires', async () => {
		// Cast past the type: the point is that the schema refuses it at runtime
		// for a caller passing untyped input.
		await expect(
			endpoints.analysis.start(makeContext(), {
				project: 'p1',
				keyword: 'kw',
				engine: 'google.com',
			} as never),
		).rejects.toThrow();
	});
});

describe('analysis.get', () => {
	it('accepts a waiting status with no recommendations', async () => {
		const { result } = await capture(
			endpoints.analysis.get,
			{ query: '32dee2a89374a722' },
			analysisWaiting,
		);

		expect(asRecord(result)?.status).toBe('waiting');
		expect(asRecord(result)?.metrics).toBeUndefined();
	});

	it('accepts an in-progress status', async () => {
		const { result } = await capture(
			endpoints.analysis.get,
			{ query: 'q' },
			analysisInProgress,
		);

		expect(asRecord(result)?.status).toBe('in progress');
	});

	it('reads the recommendations once ready', async () => {
		const { result, init } = await capture(
			endpoints.analysis.get,
			{ query: '32dee2a89374a722' },
			analysisReady,
		);

		expect(sentBody(init)).toEqual({ query: '32dee2a89374a722' });
		const ready = asRecord(result);
		expect(ready?.status).toBe('ready');
		const metrics = asRecord(ready?.metrics);
		expect(asRecord(metrics?.word_count)?.target).toBe(1864);
		const terms = asRecord(ready?.terms);
		const basic = terms?.content_basic;
		const firstTerm = asRecord(Array.isArray(basic) ? basic[0] : null);
		expect(firstTerm?.t).toBe('running shoe');
		expect(firstTerm?.sugg_usage).toEqual([1, 32]);
		const competitors = ready?.competitors;
		expect(Array.isArray(competitors) ? competitors.length : 0).toBe(1);
	});

	it('keeps the entity links as pairs', async () => {
		const { result } = await capture(
			endpoints.analysis.get,
			{ query: 'q' },
			analysisReady,
		);

		const entities = asRecord(asRecord(asRecord(result)?.terms))?.entities;
		const first = asRecord(Array.isArray(entities) ? entities[0] : null);
		expect(first?.links).toEqual([['wikipedia', '']]);
	});
});

describe('queries.list', () => {
	it('sends the project and filters', async () => {
		const { result, init } = await capture(
			endpoints.queries.list,
			{ project: 'p1', status: 'ready', tags: ['Done'] },
			queryList,
		);

		const body = sentBody(init);
		expect(body.project).toBe('p1');
		expect(body.status).toBe('ready');
		expect(body.tags).toEqual(['Done']);
		const list = asRecord(result)?.queries;
		expect(Array.isArray(list) ? list.length : 0).toBe(2);
	});

	it('accepts a single tag as a string', async () => {
		const { init } = await capture(
			endpoints.queries.list,
			{ project: 'p1', tags: 'Done' },
			queryList,
		);

		expect(sentBody(init).tags).toBe('Done');
	});

	it('rejects a status the provider does not offer', async () => {
		await expect(
			endpoints.queries.list(makeContext(), {
				project: 'p1',
				status: 'done' as never,
			}),
		).rejects.toThrow();
	});

	it('rejects a created date that is not an ISO instant', async () => {
		await expect(
			endpoints.queries.list(makeContext(), {
				project: 'p1',
				created: 'last week',
			}),
		).rejects.toThrow();
	});
});

describe('content.get', () => {
	it('reads the saved revision', async () => {
		const { result, url } = await capture(
			endpoints.content.get,
			{ query: '32dee2a89374a722' },
			savedContent,
		);

		expect(url).toBe(
			'https://app.neuronwriter.com/neuron-api/0.5/writer/get-content',
		);
		expect(asRecord(result)?.title).toBe(
			'Top 10 Best Winter Running Shoes of 2024',
		);
		expect(asRecord(result)?.type).toBe('manual');
	});

	it('passes revision_type through', async () => {
		const { init } = await capture(
			endpoints.content.get,
			{ query: 'q', revision_type: 'all' },
			savedContent,
		);

		expect(sentBody(init).revision_type).toBe('all');
	});
});

describe('content.import and evaluate', () => {
	it('posts HTML and reports the status', async () => {
		const { result, url, init } = await capture(
			endpoints.content.import,
			{ query: 'q1', html: '<h1>Draft</h1>' },
			importOk,
		);

		expect(url).toBe(
			'https://app.neuronwriter.com/neuron-api/0.5/writer/import-content',
		);
		expect(sentBody(init).html).toBe('<h1>Draft</h1>');
		expect(asRecord(result)?.status).toBe('ok');
	});

	it('accepts a url with id and class selectors', async () => {
		const { init } = await capture(
			endpoints.content.import,
			{
				query: 'q1',
				url: 'https://example.com/post',
				id: 'main-content',
				class: 'article-content',
			},
			importOk,
		);

		const body = sentBody(init);
		expect(body.url).toBe('https://example.com/post');
		expect(body.id).toBe('main-content');
		expect(body.class).toBe('article-content');
	});

	it('surfaces a failed import rather than reporting ok', async () => {
		const { result } = await capture(
			endpoints.content.import,
			{ query: 'q1', url: 'https://example.com/broken' },
			importFailed,
		);

		// The status and error are both passed through, so a caller can tell.
		expect(asRecord(result)?.status).toBe('error');
		expect(asRecord(result)?.error).toContain('Could not import');
	});

	it('rejects a payload with neither html nor url', async () => {
		await expect(
			endpoints.content.import(makeContext(), { query: 'q1' }),
		).rejects.toThrow(/html or url/);
	});

	it('rejects a payload with both html and url', async () => {
		await expect(
			endpoints.content.import(makeContext(), {
				query: 'q1',
				html: '<p>x</p>',
				url: 'https://example.com',
			}),
		).rejects.toThrow(/not both/);
	});

	it('evaluates without saving, against its own method', async () => {
		const { result, url } = await capture(
			endpoints.content.evaluate,
			{ query: 'q1', html: '<h1>Draft</h1>' },
			importOk,
		);

		expect(url).toBe(
			'https://app.neuronwriter.com/neuron-api/0.5/writer/evaluate-content',
		);
		expect(asRecord(result)?.status).toBe('ok');
	});

	it('applies the same html-or-url rule to evaluate', async () => {
		await expect(
			endpoints.content.evaluate(makeContext(), { query: 'q1' }),
		).rejects.toThrow(/html or url/);
	});
});

describe('neuronwriter error reporting', () => {
	it('reads the one error body the provider sends', async () => {
		const error = await captureError(
			capture(endpoints.projects.list, {}, invalidKey, { status: 401 }),
		);

		expect(String(error)).toContain('Invalid or inactive API key');
		expect(String(error)).toContain('401');
	});

	it('does not leak the API key into the error message', async () => {
		const error = await captureError(
			capture(endpoints.projects.list, {}, invalidKey, { status: 401 }),
		);

		expect(String(error)).not.toContain(API_KEY);
	});
});

describe('neuronwriter plugin definition', () => {
	it('registers as neuronwriter with api_key auth and no webhooks', () => {
		const plugin = neuronwriter();
		expect(plugin.id).toBe('neuronwriter');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the seven catalog operations', () => {
		const nested = Object.entries(neuronwriterEndpointsNested).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual([
			'analysis.get',
			'analysis.start',
			'content.evaluate',
			'content.get',
			'content.import',
			'projects.list',
			'queries.list',
		]);
	});

	it('marks the credit-spending call destructive and a revision save a write', () => {
		const meta = neuronwriter().endpointMeta ?? {};
		// analysis.start spends one analysis from the monthly limit, so R8
		// requires the approval a destructive call gets.
		expect(meta['analysis.start']?.riskLevel).toBe('destructive');
		expect(meta['analysis.start']?.irreversible).toBe(true);
		// Importing writes a revision, which the caller can edit again.
		expect(meta['content.import']?.riskLevel).toBe('write');
		// Evaluating scores content without saving a revision.
		expect(meta['content.evaluate']?.riskLevel).toBe('read');
		expect(meta['content.get']?.riskLevel).toBe('read');
	});

	it('builds a key from the option, then the stored key, then throws', async () => {
		const plugin = neuronwriter();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					options: {},
					keys: { get_api_key: () => Promise.resolve('stored') },
				} as never,
				'endpoint',
			),
		).resolves.toBe('stored');

		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					options: {},
					keys: { get_api_key: () => Promise.resolve(undefined) },
				} as never,
				'endpoint',
			),
		).rejects.toThrow();
	});

	it('is creatable through createCorsair', () => {
		const corsair = createCorsair({
			plugins: [neuronwriter({ key: 'k' })],
		});
		expect(corsair.neuronwriter).toBeDefined();
	});
});
