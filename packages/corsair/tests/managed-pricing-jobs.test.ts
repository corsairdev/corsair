import { bindEndpointsRecursively } from '../core/endpoints/bind';
import type { CorsairPlugin, EndpointMetaEntry } from '../core/plugins';
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
type Api = { crawl: { start: Fn; get: Fn }; scrape: { run: Fn } };

// unknown: each endpoint answers with the canned result the test gives it.
function bind(results: Record<string, () => Promise<unknown>>): Api {
	const tree: Record<string, unknown> = {};
	const endpoint = (path: string) => async () => results[path]!();
	bindEndpointsRecursively({
		endpoints: {
			crawl: { start: endpoint('crawl.start'), get: endpoint('crawl.get') },
			scrape: { run: endpoint('scrape.run') },
		},
		ctx: {},
		tree,
		pluginId: 'firecrawl',
		errorHandlers: {},
		currentPath: [],
		endpointMeta: META,
		tenantId: 'me',
		hubConfig: hub,
		plugin,
	});
	// bindEndpointsRecursively writes the bound function at each path of
	// `endpoints` above, so the tree has exactly the Api shape.
	return tree as Api;
}

// unknown: request bodies are parsed JSON, read with matchers.
type Sent = { url: string; method: string; body: Record<string, unknown> };

function mockHub({ kinds = true }: { kinds?: boolean } = {}) {
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
			return kinds
				? json(200, { kinds: KINDS })
				: json(404, { error: 'Not found' });
		}
		if (url.endsWith('/managed-pricing/credentials')) {
			return json(200, { api_key: 'fc-test-key', expires_in: 300 });
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
