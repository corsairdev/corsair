import { createHmac } from 'node:crypto';
import { bindEndpointsRecursively } from '../core/endpoints/bind';
import type { CorsairPlugin, EndpointMetaEntry } from '../core/plugins';
import type { ManagedJobKind } from '../hub/managed-pricing-jobs';
import { reportManagedJobCall } from '../hub/managed-pricing-jobs';
import { RUNTIME_PROOF_HEADER } from '../hub/runtime-proof';
import type { HubConfig } from '../hub/types';

const hub: HubConfig = {
	projectApiKey: 'ck_cloud_test',
	signingSecret: 'signing-secret',
	apiUrl: 'https://hub.test',
	instanceKey: 'main',
};

// Binding reads only the plugin's id and options.authType (to pick managed
// pricing), so the rest of a CorsairPlugin is left out of this fixture.
const plugin = {
	id: 'firecrawl',
	options: { authType: 'managed_pricing' as const },
} as unknown as CorsairPlugin;

const META: Record<string, EndpointMetaEntry> = {
	'crawl.start': { riskLevel: 'write' },
	'crawl.get': { riskLevel: 'read' },
	'crawl.cancel': { riskLevel: 'write' },
	'scrape.run': { riskLevel: 'read' },
};

// What Hub's GET /managed-pricing/job-kinds answers for Firecrawl crawls.
const KINDS = [
	{
		plugin: 'firecrawl',
		operation: 'crawl.start',
		role: 'start',
		id_path: 'id',
		status_operation: 'crawl.get',
		cap_path: 'limit',
		cap_max: 1000,
	},
	{
		plugin: 'firecrawl',
		operation: 'crawl.cancel',
		role: 'scoped',
		id_arg: 'id',
	},
	{
		plugin: 'firecrawl',
		operation: 'crawl.get',
		role: 'status',
		id_arg: 'id',
		status_path: 'status',
		usage_path: 'creditsUsed',
	},
];

// unknown: the test endpoints echo whatever the test hands them, and the tests
// read results with matchers.
type Fn = (args: unknown) => Promise<unknown>;
type Api = { crawl: { start: Fn; get: Fn; cancel: Fn }; scrape: { run: Fn } };

// unknown: each endpoint answers with the canned result the test gives it, and
// hooks are any endpoint hooks, as bindEndpointsRecursively takes them.
function bind(
	results: Record<string, () => Promise<unknown>>,
	hooks?: Record<string, unknown>,
	hubConfig: HubConfig = hub,
): Api {
	const tree: Record<string, unknown> = {};
	const endpoint = (path: string) => async () => results[path]!();
	bindEndpointsRecursively({
		endpoints: {
			crawl: {
				start: endpoint('crawl.start'),
				get: endpoint('crawl.get'),
				cancel: endpoint('crawl.cancel'),
			},
			scrape: { run: endpoint('scrape.run') },
		},
		hooks,
		ctx: {},
		tree,
		pluginId: 'firecrawl',
		errorHandlers: {},
		currentPath: [],
		endpointMeta: META,
		tenantId: 'me',
		hubConfig,
		plugin,
	});
	// bindEndpointsRecursively writes the bound function at each path of
	// `endpoints` above, so the tree has exactly the Api shape.
	return tree as Api;
}

// unknown: request bodies are parsed JSON, read with matchers.
type Sent = { url: string; method: string; body: Record<string, unknown> };

function mockHub({
	kinds = true,
	stallKinds = false,
	credentialsJob,
	usagePath,
	failStarts = 0,
	failStartsWith = 503,
}: {
	kinds?: boolean;
	stallKinds?: boolean;
	// unknown: the job descriptor Hub's answer carries, as JSON.
	credentialsJob?: Record<string, unknown>;
	usagePath?: string;
	failStarts?: number;
	failStartsWith?: number;
} = {}) {
	let startsFailed = 0;
	const sent: Sent[] = [];
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		const url = String(input);
		const method = init?.method ?? 'GET';
		sent.push({ url, method, body: JSON.parse(String(init?.body ?? '{}')) });
		const json = (status: number, body: unknown) =>
			new Response(JSON.stringify(body), {
				status,
				headers: { 'content-type': 'application/json' },
			});
		if (url.endsWith('/managed-pricing/job-kinds')) {
			if (stallKinds) {
				// A Hub that never answers: only the request's own deadline ends it.
				return new Promise<Response>((_, reject) => {
					init?.signal?.addEventListener('abort', () =>
						reject(init.signal?.reason),
					);
				});
			}
			return kinds
				? json(200, { kinds: KINDS })
				: json(404, { error: 'Not found' });
		}
		if (url.endsWith('/managed-pricing/credentials')) {
			return json(200, {
				api_key: 'fc-test-key',
				expires_in: 300,
				...(credentialsJob ? { job: credentialsJob } : {}),
				...(usagePath ? { usage_path: usagePath } : {}),
			});
		}
		if (url.endsWith('/managed-pricing/jobs') && startsFailed < failStarts) {
			startsFailed++;
			return json(failStartsWith, { error: 'Hub refused the report' });
		}
		return json(200, { job: { id: 'mpj_1', status: 'running' } });
	});
	const to = (path: string) => sent.filter((s) => s.url.endsWith(path));
	return {
		kinds: () => to('/managed-pricing/job-kinds'),
		credentials: () => to('/managed-pricing/credentials'),
		starts: () => to('/managed-pricing/jobs'),
		reports: () => to('/managed-pricing/jobs/report'),
		outcomes: () => to('/managed-pricing/usage/outcome'),
	};
}

afterEach(() => {
	jest.restoreAllMocks();
});

describe('a job started on Corsair key', () => {
	it('asks for its key with the cap it was called with', async () => {
		const hubCalls = mockHub();
		const api = bind({
			'crawl.start': async () => ({ success: true, id: 'crawl-abc' }),
		});
		await api.crawl.start({ url: 'https://example.com', limit: 50 });
		expect(hubCalls.credentials()[0]?.body).toMatchObject({
			operation: 'crawl.start',
			cap: 50,
		});
	});

	it('reports the provider job id under the charge it was made with', async () => {
		const hubCalls = mockHub();
		const api = bind({
			'crawl.start': async () => ({ success: true, id: 'crawl-abc' }),
		});
		await api.crawl.start({ url: 'https://example.com', limit: 50 });
		const [credentials] = hubCalls.credentials();
		expect(hubCalls.starts()).toHaveLength(1);
		expect(hubCalls.starts()[0]?.body).toEqual({
			plugin: 'firecrawl',
			tenantId: 'me',
			operation: 'crawl.start',
			idempotencyKey: credentials?.body.idempotencyKey,
			providerJobId: 'crawl-abc',
		});
	});

	it('reports nothing when the start returned no job id', async () => {
		const hubCalls = mockHub();
		const api = bind({ 'crawl.start': async () => ({ success: false }) });
		await api.crawl.start({ url: 'https://example.com', limit: 50 });
		expect(hubCalls.starts()).toHaveLength(0);
	});
});

describe('a job read on Corsair key', () => {
	it('asks for its key with the job id it reads', async () => {
		const hubCalls = mockHub();
		const api = bind({
			'crawl.get': async () => ({ success: true, status: 'scraping' }),
		});
		await api.crawl.get({ id: 'crawl-abc' });
		expect(hubCalls.credentials()[0]?.body).toMatchObject({
			operation: 'crawl.get',
			jobId: 'crawl-abc',
		});
	});

	it('reports what it saw, with the usage so far', async () => {
		const hubCalls = mockHub();
		const api = bind({
			'crawl.get': async () => ({
				success: true,
				status: 'completed',
				creditsUsed: 12,
				data: [],
			}),
		});
		await api.crawl.get({ id: 'crawl-abc' });
		expect(hubCalls.reports()[0]?.body).toEqual({
			plugin: 'firecrawl',
			tenantId: 'me',
			operation: 'crawl.get',
			providerJobId: 'crawl-abc',
			providerStatus: 'completed',
			units: 12,
		});
	});

	it('sends no refund report when it fails, since it was never charged', async () => {
		const hubCalls = mockHub();
		const api = bind({
			'crawl.get': async () => {
				throw new Error('502 from Firecrawl');
			},
		});
		await expect(api.crawl.get({ id: 'crawl-abc' })).rejects.toThrow('502');
		expect(hubCalls.outcomes()).toHaveLength(0);
	});
});

describe('the job kinds', () => {
	it('are read from Hub once, not on every call', async () => {
		const hubCalls = mockHub();
		const api = bind({
			'crawl.get': async () => ({ success: true, status: 'scraping' }),
			'scrape.run': async () => ({ success: true }),
		});
		await api.crawl.get({ id: 'crawl-abc' });
		await api.crawl.get({ id: 'crawl-abc' });
		await api.scrape.run({ url: 'https://example.com' });
		expect(hubCalls.kinds().length).toBeLessThanOrEqual(1);
	});

	it('leave an ordinary call as it was', async () => {
		const hubCalls = mockHub();
		const api = bind({
			'scrape.run': async () => ({ success: true, id: 'not-a-job' }),
		});
		await api.scrape.run({ url: 'https://example.com', limit: 3 });
		expect(hubCalls.credentials()[0]?.body).not.toHaveProperty('cap');
		expect(hubCalls.credentials()[0]?.body).not.toHaveProperty('jobId');
		expect(hubCalls.starts()).toHaveLength(0);
		expect(hubCalls.reports()).toHaveLength(0);
	});
});

describe('around a job call', () => {
	it('records a started job even when a hook after the call throws, and gives nothing back', async () => {
		const hubCalls = mockHub();
		const api = bind(
			{ 'crawl.start': async () => ({ success: true, id: 'crawl-abc' }) },
			{
				crawl: {
					start: {
						after: async () => {
							throw new Error('cache write failed');
						},
					},
				},
			},
		);
		await expect(
			api.crawl.start({ url: 'https://example.com', limit: 50 }),
		).rejects.toThrow('cache write failed');
		expect(hubCalls.starts()).toHaveLength(1);
		expect(hubCalls.outcomes()).toHaveLength(0);
	});

	it('refuses a hook that changes the cap Hub held credits for, and gives the hold back', async () => {
		const hubCalls = mockHub();
		let ran = false;
		const api = bind(
			{
				'crawl.start': async () => {
					ran = true;
					return { success: true, id: 'crawl-abc' };
				},
			},
			{
				crawl: {
					start: {
						// unknown: hooks receive any context and arguments.
						before: async (ctx: unknown, args: unknown) => ({
							ctx,
							args: { ...(args as Record<string, unknown>), limit: 900 },
							continue: true,
						}),
					},
				},
			},
		);
		await expect(
			api.crawl.start({ url: 'https://example.com', limit: 50 }),
		).rejects.toThrow("changed crawl.start's cap");
		expect(ran).toBe(false);
		expect(hubCalls.outcomes()[0]?.body).toMatchObject({ outcome: 'failed' });
		expect(hubCalls.starts()).toHaveLength(0);
	});

	it('does not wait on a Hub that never answers for its job kinds', async () => {
		const hubCalls = mockHub({ stallKinds: true });
		// Its own Hub, so the job kinds cached by the tests above don't answer.
		const api = bind(
			{ 'scrape.run': async () => ({ success: true }) },
			undefined,
			{ ...hub, apiUrl: 'https://stalled-hub.test' },
		);
		const started = Date.now();
		await expect(
			api.scrape.run({ url: 'https://example.com' }),
		).resolves.toMatchObject({ success: true });
		expect(Date.now() - started).toBeLessThan(5_000);
		expect(hubCalls.credentials()).toHaveLength(1);
	});
});

describe('after review', () => {
	it('refuses a hook that changes the cap in place, on the same object', async () => {
		const hubCalls = mockHub();
		const api = bind(
			{ 'crawl.start': async () => ({ success: true, id: 'crawl-abc' }) },
			{
				crawl: {
					start: {
						// unknown: hooks receive any context and arguments.
						before: async (ctx: unknown, args: unknown) => {
							(args as Record<string, unknown>).limit = 900;
							return { ctx, args, continue: true };
						},
					},
				},
			},
		);
		await expect(
			api.crawl.start({ url: 'https://example.com', limit: 50 }),
		).rejects.toThrow("changed crawl.start's cap");
		expect(hubCalls.starts()).toHaveLength(0);
	});

	it("records a start from Hub's own answer when the job table can't be read", async () => {
		const hubCalls = mockHub({
			kinds: false,
			credentialsJob: {
				role: 'start',
				id_path: 'id',
				status_operation: 'crawl.get',
			},
		});
		// Its own Hub, so the job kinds cached by the tests above don't answer.
		const api = bind(
			{ 'crawl.start': async () => ({ success: true, id: 'crawl-xyz' }) },
			undefined,
			{ ...hub, apiUrl: 'https://kindless-hub.test' },
		);
		await api.crawl.start({ url: 'https://example.com', limit: 50 });
		expect(hubCalls.starts()[0]?.body).toMatchObject({
			providerJobId: 'crawl-xyz',
		});
	});

	it('tries the start report again when Hub fails it', async () => {
		const hubCalls = mockHub({ failStarts: 2 });
		const api = bind({
			'crawl.start': async () => ({ success: true, id: 'crawl-abc' }),
		});
		await api.crawl.start({ url: 'https://example.com', limit: 50 });
		expect(hubCalls.starts()).toHaveLength(3);
		expect(hubCalls.outcomes()).toHaveLength(0);
	});

	it('does not send a start report again that Hub refused', async () => {
		const hubCalls = mockHub({ failStarts: 3, failStartsWith: 400 });
		const api = bind({
			'crawl.start': async () => ({ success: true, id: 'crawl-abc' }),
		});
		await api.crawl.start({ url: 'https://example.com', limit: 50 });
		expect(hubCalls.starts()).toHaveLength(1);
	});

	it('sends no per-call usage report for a job, which settles when it ends', async () => {
		const hubCalls = mockHub({ usagePath: 'creditsUsed' });
		const api = bind({
			'crawl.start': async () => ({
				success: true,
				id: 'crawl-abc',
				creditsUsed: 7,
			}),
		});
		await api.crawl.start({ url: 'https://example.com', limit: 50 });
		expect(hubCalls.starts()).toHaveLength(1);
		expect(hubCalls.outcomes()).toHaveLength(0);
	});
});

describe('the runtime proof on job reports', () => {
	it('signs the start and the read report for their own endpoints', async () => {
		const sent: { url: string; headers: Headers }[] = [];
		jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
			sent.push({ url: String(input), headers: new Headers(init?.headers) });
			return new Response('{}', {
				status: 200,
				headers: { 'content-type': 'application/json' },
			});
		});
		const signed = { ...hub, runtimeProofKey: 'proof-key' };
		const [start, , read] = KINDS as ManagedJobKind[];
		await reportManagedJobCall(
			signed,
			start!,
			{
				plugin: 'firecrawl',
				tenantId: 'me',
				operation: 'crawl.start',
				idempotencyKey: 'k1',
			},
			{},
			{ id: 'crawl-abc' },
		);
		await reportManagedJobCall(
			signed,
			read!,
			{ plugin: 'firecrawl', tenantId: 'me', operation: 'crawl.get' },
			{ id: 'crawl-abc' },
			{ status: 'completed', creditsUsed: 3 },
		);
		const expected = (header: string, path: string, operation: string) => {
			const t = Number(/t=(\d+)/.exec(header)?.[1]);
			const v1 = createHmac('sha256', 'proof-key')
				.update([t, path, 'firecrawl', 'me', operation].join('\n'))
				.digest('base64url');
			return `t=${t},v1=${v1}`;
		};
		const [startSent, readSent] = sent;
		expect(startSent?.url).toMatch(/\/managed-pricing\/jobs$/);
		const startHeader = startSent?.headers.get(RUNTIME_PROOF_HEADER) ?? '';
		expect(startHeader).toBe(
			expected(startHeader, '/managed-pricing/jobs', 'crawl.start'),
		);
		const readHeader = readSent?.headers.get(RUNTIME_PROOF_HEADER) ?? '';
		expect(readHeader).toBe(
			expected(readHeader, '/managed-pricing/jobs/report', 'crawl.get'),
		);
	});
});

describe('a call scoped to a job', () => {
	it('sends the job id, reports nothing, and gives nothing back when it fails', async () => {
		const hubCalls = mockHub();
		const api = bind({
			'crawl.cancel': async () => {
				throw new Error('409 already finished');
			},
		});
		await expect(api.crawl.cancel({ id: 'crawl-abc' })).rejects.toThrow('409');
		expect(hubCalls.credentials()[0]?.body).toMatchObject({
			operation: 'crawl.cancel',
			jobId: 'crawl-abc',
		});
		expect(hubCalls.reports()).toHaveLength(0);
		expect(hubCalls.outcomes()).toHaveLength(0);
	});
});
