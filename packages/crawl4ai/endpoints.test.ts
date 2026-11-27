import { ApiError } from 'corsair/http';
import { crawl4aiErrorMessage, normalizeServerUrl } from './client';
import { crawl4aiEndpointsNested } from './endpoints/catalog';
import { crawl4aiOperations } from './endpoints/manifest';
import { parseNdjson } from './endpoints/operations';
import type { Crawl4aiContext } from './index';

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	body: unknown;
};
let calls: Captured[] = [];

type Answer = { status: number; body?: unknown; contentType?: string };

function reply(answer: (url: string) => Answer) {
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		const headers: Record<string, string> = {};
		new Headers(init?.headers).forEach((value, key) => {
			headers[key] = value;
		});
		const url = String(input);
		calls.push({
			url,
			method: init?.method ?? 'GET',
			headers,
			body: init?.body,
		});
		const { status, body, contentType = 'application/json' } = answer(url);
		const payload =
			body === undefined
				? null
				: typeof body === 'string' || body instanceof Uint8Array
					? body
					: JSON.stringify(body);
		return new Response(payload, {
			status,
			headers: { 'content-type': contentType },
		});
	});
}

function ctx(serverUrl = 'http://localhost:11235'): Crawl4aiContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'sk_live_secret_value',
		options: { serverUrl },
		keys: {},
		db: {},
		// `unknown` because a test context fills only the fields the endpoints read.
	} as unknown as Crawl4aiContext;
}

// `unknown` because the endpoint tree holds functions of many input types.
type AnyEndpoint = (ctx: Crawl4aiContext, input: unknown) => Promise<unknown>;

function endpointFor(id: string): AnyEndpoint {
	// `unknown` because the walk goes through nested groups of endpoints.
	let node: unknown = crawl4aiEndpointsNested;
	for (const part of id.split('.'))
		node = (node as Record<string, unknown>)[part];
	if (typeof node !== 'function') throw new Error(`no endpoint ${id}`);
	return node as AnyEndpoint;
}

const call = (id: string, input: unknown, c = ctx()) =>
	endpointFor(id)(c, input);

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	// `unknown` because example args are free-form YAML values.
	apiExamples: Record<string, { args: Record<string, unknown> }>;
};

beforeEach(() => {
	calls = [];
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('every operation', () => {
	it.each(crawl4aiOperations.map((o) => o.id))(
		'%s goes to its host, method and path',
		async (id) => {
			const operation = crawl4aiOperations.find((o) => o.id === id);
			if (!operation) throw new Error(id);
			reply(() => {
				if (operation.response === 'ndjson')
					return {
						status: 200,
						body: '{"a":1}\n{"a":2}\n',
						contentType: 'application/x-ndjson',
					};
				if (operation.response === 'text')
					return { status: 200, body: '# HELP x\n', contentType: 'text/plain' };
				if (operation.response === 'file')
					return {
						status: 200,
						body: new Uint8Array([1, 2, 3]),
						contentType: 'image/png',
					};
				if (operation.response.startsWith('base64:')) {
					const field = operation.response.split(':')[1] as string;
					return {
						status: 200,
						body: {
							success: true,
							[field]: Buffer.from('bytes').toString('base64'),
						},
					};
				}
				return { status: 200, body: {} };
			});
			await call(
				id,
				docs.apiExamples[id]?.args ?? {},
				operation.host === 'cloud' ? ctx('') : ctx(),
			);
			const sent = new URL(calls[0]?.url ?? '');
			expect(calls[0]?.method).toBe(operation.method);
			expect(sent.origin).toBe(
				operation.host === 'cloud'
					? 'https://api.crawl4ai.com'
					: 'http://localhost:11235',
			);
			expect(sent.pathname).toMatch(
				new RegExp(`^${operation.path.replace(/{[^}]+}/g, '[^/]+')}$`),
			);
			expect(calls[0]?.headers.authorization).toBe(
				'Bearer sk_live_secret_value',
			);
		},
	);
});

describe('requests', () => {
	it('sends a tool run with its inputs as the body and the fresh header', async () => {
		reply(() => ({
			status: 200,
			body: { tool: 'youtube-captions', rows: [{ text: 'hi' }] },
		}));
		await call(
			'cloud.tools.run',
			{ id: 'youtube-captions', input: { video: 'abc' }, fresh: true },
			ctx(''),
		);
		expect(new URL(calls[0]?.url ?? '').pathname).toBe(
			'/tools/youtube-captions',
		);
		expect(JSON.parse(String(calls[0]?.body))).toEqual({ video: 'abc' });
		expect(calls[0]?.headers['crawl4ai-fresh']).toBe('true');
	});

	it('encodes a page URL in the /llm path', async () => {
		reply(() => ({ status: 200, body: { answer: 'x' } }));
		await call('server.llm', { url: 'https://example.com/a?b=1', q: 'title' });
		expect(calls[0]?.url).toContain(
			'/llm/https%3A%2F%2Fexample.com%2Fa%3Fb%3D1?q=title',
		);
	});

	it('returns a screenshot as a PNG file and NDJSON as items', async () => {
		reply(() => ({
			status: 200,
			body: {
				success: true,
				screenshot: Buffer.from('png').toString('base64'),
				artifact_id: 'art_1',
			},
		}));
		await expect(
			call('server.screenshot', { url: 'https://example.com' }),
		).resolves.toMatchObject({
			contentType: 'image/png',
			filename: 'crawl4ai-screenshot.png',
			artifact_id: 'art_1',
		});
		// A failed page: the server's error text (it can quote the URL) stays out.
		reply(() => ({
			status: 200,
			body: { success: false, error: 'failed https://example.com/?token=abc' },
		}));
		await expect(
			call('server.pdf', { url: 'https://example.com/?token=abc' }),
		).rejects.toThrow(/^Crawl4AI server\.pdf answered without a pdf$/);
		reply(() => ({
			status: 200,
			body: '{"seq":0}\n{"seq":1}\n',
			contentType: 'application/x-ndjson',
		}));
		await expect(
			call('cloud.jobs.results', { job_id: 'j_1', after: 0 }, ctx('')),
		).resolves.toEqual({
			items: [{ seq: 0 }, { seq: 1 }],
		});
		expect(() => parseNdjson('x', '{"a":1}\nnot json')).toThrow('not JSON');
	});

	it('refuses a streamed server.crawl, a watch through tools.run and bad URLs', async () => {
		reply(() => ({ status: 200, body: {} }));
		await expect(
			call('server.crawl', {
				urls: ['https://example.com'],
				crawler_config: { stream: true },
			}),
		).rejects.toThrow(/use server\.crawlStream/);
		await expect(
			call('cloud.tools.run', { id: 'watch', input: {} }, ctx('')),
		).rejects.toThrow(/use cloud\.watch/);
		await expect(
			call('cloud.scrape', { url: 'not a URL' }, ctx('')),
		).rejects.toThrow(/Invalid URL/);
		expect(calls).toHaveLength(0);
	});

	it('refuses a server op without a server, and a non-local http server', async () => {
		reply(() => ({ status: 200, body: {} }));
		await expect(call('server.health', {}, ctx(''))).rejects.toMatchObject({
			name: 'AuthMissingError',
		});
		// `.local` and `.test` names can resolve to another machine.
		for (const url of [
			'http://crawl.example.com',
			'http://crawl.local',
			'http://crawl.test',
			'http://crawl.localhost',
		]) {
			expect(() => normalizeServerUrl(url)).toThrow(/https/);
		}
		expect(normalizeServerUrl('http://127.0.0.1:11235')).toBe(
			'http://127.0.0.1:11235',
		);
		expect(normalizeServerUrl('https://crawl.example.com/c4/')).toBe(
			'https://crawl.example.com/c4',
		);
		expect(calls).toHaveLength(0);
	});
});

describe('errors', () => {
	it('builds the message from Cloud and server error bodies, without the key', async () => {
		reply(() => ({
			status: 402,
			body: {
				error: 'no_credit',
				message: 'Out of credit.',
				request_id: 'req_1',
			},
		}));
		const error = (await call(
			'cloud.scrape',
			{ url: 'https://example.com/private-page' },
			ctx(''),
		).catch((e) => e)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(402);
		expect(error.message).toBe(
			'Crawl4AI 402: no_credit: Out of credit.; request_id req_1',
		);
		expect(JSON.stringify({ b: error.body, r: error.request })).not.toContain(
			'sk_live_secret',
		);
		expect(
			crawl4aiErrorMessage(422, '', {
				detail: [{ loc: ['body', 'urls'], msg: 'Field required' }],
			}),
		).toBe('Crawl4AI 422: body.urls: Field required');
	});
});

describe('review round 2', () => {
	// A Cloud account read from storage: no serverUrl option, stored getters.
	function cloudCtx(storedKey: string | null): Crawl4aiContext {
		return {
			endpoints: {},
			$getAccountId: () => Promise.resolve('test-account'),
			key: 'sk_live_first',
			options: {},
			keys: {
				get_server_url: () => Promise.resolve(null),
				get_api_key: () => Promise.resolve(storedKey),
			},
			db: {},
			// `unknown` because a test context fills only the fields the endpoints read.
		} as unknown as Crawl4aiContext;
	}

	it('sends nothing to the Cloud when the stored key changed during the call', async () => {
		reply(() => ({ status: 200, body: { pending: 0 } }));
		await expect(
			call('cloud.billing.balance', {}, cloudCtx('sk_live_second')),
		).rejects.toMatchObject({
			name: 'AuthMissingError',
			message: expect.stringContaining('reconnected'),
		});
		expect(calls).toHaveLength(0);
		await call('cloud.billing.balance', {}, cloudCtx('sk_live_first'));
		expect(calls).toHaveLength(1);
		expect(calls[0]?.headers.authorization).toBe('Bearer sk_live_first');
	});

	it('refuses a serialized streaming config, a batch through tools.run and a non-http scrape', async () => {
		reply(() => ({ status: 200, body: { success: true, results: [] } }));
		await expect(
			call('server.crawl', {
				urls: ['https://example.com'],
				crawler_config: { type: 'CrawlerRunConfig', params: { stream: true } },
			}),
		).rejects.toThrow(/use server\.crawlStream/);
		await expect(
			call('cloud.tools.run', { id: 'batch', input: {} }, ctx('')),
		).rejects.toThrow(/use cloud\.batch/);
		await expect(
			call('cloud.scrape', { url: 'ftp://example.com/page' }, ctx('')),
		).rejects.toThrow(/http or https/);
		expect(calls).toHaveLength(0);
		// A serialized config without streaming still runs.
		await call('server.crawl', {
			urls: ['https://example.com'],
			crawler_config: { type: 'CrawlerRunConfig', params: { stream: false } },
		});
		expect(calls).toHaveLength(1);
	});

	it('refuses a base64 file that decodes to no bytes', async () => {
		reply(() => ({ status: 200, body: { success: true, pdf: ' ' } }));
		await expect(
			call('server.pdf', { url: 'https://example.com' }),
		).rejects.toThrow(/^Crawl4AI server\.pdf answered without a pdf$/);
	});

	it('keeps task_id and next_cursor strings, so they can be sent back', async () => {
		reply(() => ({ status: 200, body: { task_id: 'crawl_1' } }));
		await expect(
			call('server.crawlJobs.create', { urls: ['https://example.com'] }),
		).resolves.toMatchObject({ task_id: 'crawl_1' });
		reply(() => ({ status: 200, body: { task_id: 7 } }));
		await expect(
			call('server.crawlJobs.create', { urls: ['https://example.com'] }),
		).rejects.toThrow(/did not match/);
		reply(() => ({ status: 200, body: { topups: [], next_cursor: 5 } }));
		await expect(call('cloud.billing.topups', {}, ctx(''))).rejects.toThrow(
			/did not match/,
		);
		// Other response strings still take a number.
		reply(() => ({ status: 200, body: { task_id: 'crawl_1', status: 3 } }));
		await expect(
			call('server.crawlJobs.get', { task_id: 'crawl_1' }),
		).resolves.toMatchObject({ status: 3 });
	});

	it('redacts a sent value used as a key in an error body', async () => {
		const page = 'https://private.example.com/report';
		reply(() => ({
			status: 400,
			body: { error: 'bad_url', [page]: 'blocked' },
		}));
		const error = await call('cloud.scrape', { url: page }, ctx('')).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeInstanceOf(ApiError);
		expect(JSON.stringify((error as ApiError).body)).not.toContain(
			'private.example.com',
		);
		expect((error as ApiError).body).toMatchObject({ error: 'bad_url' });
	});
});
