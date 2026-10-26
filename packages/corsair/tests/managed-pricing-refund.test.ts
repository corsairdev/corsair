import { bindEndpointsRecursively } from '../core/endpoints/bind';
import type { CorsairPlugin, EndpointMetaEntry } from '../core/plugins';
import type { HubConfig } from '../hub/types';

const hub: HubConfig = {
	projectApiKey: 'ck_cloud_test',
	signingSecret: 'signing-secret',
	apiUrl: 'https://hub.test',
	instanceKey: 'main',
};

const plugin = {
	id: 'reducto',
	options: { authType: 'managed_pricing' as const },
} as unknown as CorsairPlugin;

const META: Record<string, EndpointMetaEntry> = {
	'parse.parse': { riskLevel: 'read' },
};

type Api = { parse: { parse: (args: unknown) => Promise<unknown> } };

function bind(
	run: (ctx: Record<string, unknown>) => Promise<unknown>,
	hooks?: Record<string, unknown>,
): Api {
	const tree: Record<string, unknown> = {};
	bindEndpointsRecursively({
		endpoints: { parse: { parse: (ctx: Record<string, unknown>) => run(ctx) } },
		hooks,
		ctx: {},
		tree,
		pluginId: 'reducto',
		errorHandlers: {},
		currentPath: [],
		endpointMeta: META,
		tenantId: 'me',
		hubConfig: hub,
		plugin,
	});
	return tree as Api;
}

type Sent = { url: string; body: Record<string, unknown>; headers: Headers };

// Hub answers the key request; the outcome report gets `outcomeStatus`.
function mockHub(outcomeStatus = 200) {
	const sent: Sent[] = [];
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		const url = String(input);
		sent.push({
			url,
			body: JSON.parse(String(init?.body ?? '{}')),
			headers: new Headers(init?.headers),
		});
		const body = url.endsWith('/managed-pricing/credentials')
			? { api_key: 'rd-test-key', expires_in: 300 }
			: { status: 'released', creditsReturned: 20 };
		return new Response(JSON.stringify(body), {
			status: url.endsWith('/managed-pricing/credentials')
				? 200
				: outcomeStatus,
			headers: { 'content-type': 'application/json' },
		});
	});
	return {
		credentials: () =>
			sent.filter((s) => s.url.endsWith('/managed-pricing/credentials')),
		outcomes: () =>
			sent.filter((s) => s.url.endsWith('/managed-pricing/usage/outcome')),
	};
}

afterEach(() => {
	jest.restoreAllMocks();
});

describe('a managed call that fails', () => {
	it('is reported under the idempotency key it was charged with, and still throws', async () => {
		const hubCalls = mockHub();
		const api = bind(async () => {
			throw new TypeError(
				"Cannot read properties of null (reading 'chart_data')",
			);
		});

		await expect(api.parse.parse({ input: 'x.pdf' })).rejects.toThrow(
			'chart_data',
		);

		const [credentials] = hubCalls.credentials();
		const [outcome] = hubCalls.outcomes();
		expect(outcome?.body).toEqual({
			plugin: 'reducto',
			tenantId: 'me',
			operation: 'parse.parse',
			idempotencyKey: credentials?.body.idempotencyKey,
			outcome: 'failed',
			error: "TypeError: Cannot read properties of null (reading 'chart_data')",
		});
		expect(outcome?.headers.get('authorization')).toBe('Bearer ck_cloud_test');
		expect(outcome?.headers.get('x-corsair-instance-key')).toBe('main');
	});

	it('is not reported when the call succeeds', async () => {
		const hubCalls = mockHub();
		const api = bind(async (ctx) => ({ usedKey: ctx.key }));

		await expect(api.parse.parse({})).resolves.toEqual({
			usedKey: 'rd-test-key',
		});
		expect(hubCalls.credentials()).toHaveLength(1);
		expect(hubCalls.outcomes()).toHaveLength(0);
	});

	it('keeps its own error when the report itself fails', async () => {
		const hubCalls = mockHub(500);
		const api = bind(async () => {
			throw new Error('ReductoAPIError: 502 Bad Gateway');
		});

		await expect(api.parse.parse({})).rejects.toThrow('502 Bad Gateway');
		expect(hubCalls.outcomes()).toHaveLength(1);
	});

	it('is reported when a before hook stops it after the charge', async () => {
		const hubCalls = mockHub();
		const run = jest.fn(async () => 'ran');
		const api = bind(run, {
			parse: {
				parse: {
					before: async (ctx: unknown, args: unknown) => ({
						ctx,
						args,
						continue: false,
					}),
				},
			},
		});

		await api.parse.parse({});
		expect(run).not.toHaveBeenCalled();
		expect(hubCalls.outcomes()[0]?.body).toMatchObject({
			outcome: 'failed',
			error: 'Error: Stopped by a before hook',
		});
	});

	it('is reported when an after hook throws', async () => {
		const hubCalls = mockHub();
		const api = bind(async () => 'ran', {
			parse: {
				parse: {
					after: async () => {
						throw new Error('cache write failed');
					},
				},
			},
		});

		await expect(api.parse.parse({})).rejects.toThrow('cache write failed');
		expect(hubCalls.outcomes()).toHaveLength(1);
	});

	it('charges and reports each call on its own', async () => {
		const hubCalls = mockHub();
		const api = bind(async () => {
			throw new Error('boom');
		});

		await expect(api.parse.parse({})).rejects.toThrow();
		await expect(api.parse.parse({})).rejects.toThrow();

		const charged = hubCalls.credentials().map((c) => c.body.idempotencyKey);
		const reported = hubCalls.outcomes().map((o) => o.body.idempotencyKey);
		expect(new Set(charged).size).toBe(2);
		expect(reported).toEqual(charged);
	});
});
