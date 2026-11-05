// Wire-level tests: fetch is the only mock, so these cover the bound
// endpoint (schema parsing), the adapter, makeRenderRequest and core request().
import { render } from './index';

type Sent = { method: string; url: URL; body: unknown };

const sent: Sent[] = [];
const replies: Array<{ status: number; body?: unknown }> = [];
const originalFetch = global.fetch;

beforeEach(() => {
	sent.length = 0;
	replies.length = 0;
	global.fetch = jest.fn(
		async (url: string | URL | Request, init?: RequestInit) => {
			sent.push({
				method: init?.method ?? 'GET',
				url: new URL(String(url)),
				body:
					typeof init?.body === 'string' ? JSON.parse(init.body) : undefined,
			});
			const reply = replies.shift() ?? { status: 200, body: {} };
			if (reply.body === undefined) {
				return new Response(null, { status: reply.status });
			}
			return new Response(JSON.stringify(reply.body), {
				status: reply.status,
				headers: { 'content-type': 'application/json' },
			});
		},
	) as typeof fetch;
});

afterAll(() => {
	global.fetch = originalFetch;
});

const ctx = {
	key: 'rnd_test',
	$getAccountId: async () => 'account-1',
} as never;
const plugin = render({ key: 'rnd_test' });
if (!plugin.endpoints) throw new Error('Render endpoints are missing');
const api = plugin.endpoints;
// The bound endpoint tree is typed per operation; the tests call through a
// loose view so table-driven cases can share one helper.
// unknown: inputs are validated by each operation's schema at runtime.
type Call = (context: never, input: unknown) => Promise<unknown>;

describe('Render replace operations', () => {
	it.each([
		[
			'final.updateEnvVarsForService',
			api.final.updateEnvVarsForService,
			{ id: 'srv-1' },
			'/v1/services/srv-1/env-vars',
			[
				{ key: 'DATABASE_URL', value: 'postgres://x' },
				{ key: 'SESSION_SECRET', generateValue: true },
			],
		],
		[
			'final.updateHeaders',
			api.final.updateHeaders,
			{ id: 'srv-1' },
			'/v1/services/srv-1/headers',
			[{ path: '/*', name: 'X-Frame-Options', value: 'DENY' }],
		],
		[
			'final.updateSecretFilesForService',
			api.final.updateSecretFilesForService,
			{ id: 'srv-1' },
			'/v1/services/srv-1/secret-files',
			[{ name: 'config.json', content: '{}' }],
		],
		[
			'final.updateRoutes',
			api.final.updateRoutes,
			{ id: 'srv-1' },
			'/v1/services/srv-1/routes',
			[{ type: 'rewrite', source: '/app/*', destination: '/index.html' }],
		],
		[
			'buildSources.envVars.update',
			api.buildSources.envVars.update,
			{ buildSourceId: 'bs-1' },
			'/v1/build-sources/bs-1/env-vars',
			[{ key: 'NODE_ENV', value: 'production' }],
		],
		[
			'buildSources.secretFiles.update',
			api.buildSources.secretFiles.update,
			{ buildSourceId: 'bs-1' },
			'/v1/build-sources/bs-1/secret-files',
			[{ name: '.npmrc', content: 'registry=https://example.test' }],
		],
	] as const)(
		'%s PUTs the list as a raw JSON array',
		async (_name, endpoint, ids, path, list) => {
			replies.push({ status: 200, body: [] });
			await (endpoint as unknown as Call)(ctx, { ...ids, body: list });

			expect(sent).toHaveLength(1);
			expect(sent[0]?.method).toBe('PUT');
			expect(sent[0]?.url.pathname).toBe(path);
			expect(sent[0]?.url.search).toBe('');
			expect(sent[0]?.body).toEqual(list);
		},
	);

	it('rejects a replace call without the list before any request is sent', async () => {
		await expect(
			(api.final.updateEnvVarsForService as unknown as Call)(ctx, {
				id: 'srv-1',
				key: 'A',
				value: 'B',
			}),
		).rejects.toThrow();
		expect(sent).toHaveLength(0);
	});
});

describe('Render list filters', () => {
	it.each([
		[
			'services.list',
			api.services.list,
			{ name: ['web', 'worker'], region: ['oregon', 'frankfurt'] },
			'/v1/services',
			{ name: 'web,worker', region: 'oregon,frankfurt' },
		],
		[
			'services.headers.list',
			api.services.headers.list,
			{ serviceId: 'srv-1', path: ['/a', '/b'], name: ['X-A', 'X-B'] },
			'/v1/services/srv-1/headers',
			{ path: '/a,/b', name: 'X-A,X-B' },
		],
		[
			'services.customDomains.list',
			api.services.customDomains.list,
			{ serviceId: 'srv-1', name: ['a.example.com', 'b.example.com'] },
			'/v1/services/srv-1/custom-domains',
			{ name: 'a.example.com,b.example.com' },
		],
	] as const)(
		'%s sends explode:false filters as one comma-separated value',
		async (_name, endpoint, input, path, expected) => {
			replies.push({ status: 200, body: [] });
			await (endpoint as unknown as Call)(ctx, input);

			expect(sent[0]?.url.pathname).toBe(path);
			for (const [key, value] of Object.entries(expected)) {
				expect(sent[0]?.url.searchParams.getAll(key)).toEqual([value]);
			}
		},
	);

	it('keeps repeated keys for explode:true filters such as deploy status', async () => {
		replies.push({ status: 200, body: [] });
		await (api.services.listDeploys as unknown as Call)(ctx, {
			serviceId: 'srv-1',
			status: ['live', 'build_failed'],
		});

		expect(sent[0]?.url.searchParams.getAll('status')).toEqual([
			'live',
			'build_failed',
		]);
	});
});
