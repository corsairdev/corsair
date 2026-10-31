import { createHmac } from 'node:crypto';
import { bindEndpointsRecursively } from '../core/endpoints/bind';
import type { CorsairPlugin, EndpointMetaEntry } from '../core/plugins';
import { parseManagedPricingCredentialsResponse } from '../hub/contracts/managed-pricing-api';
import {
	managedPricingOutcomeHeaders,
	readUsageUnits,
	reportManagedPricingCallFailed,
	reportManagedPricingCallUsage,
} from '../hub/managed-pricing-auth';
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
	id: 'reducto',
	options: { authType: 'managed_pricing' as const },
} as unknown as CorsairPlugin;

const META: Record<string, EndpointMetaEntry> = {
	'parse.parse': { riskLevel: 'read' },
};

// unknown: the test endpoints take no real input and the tests read results
// with matchers, so neither side needs a type.
type Api = { parse: { parse: (args: unknown) => Promise<unknown> } };

// unknown: bind takes any endpoint context, hooks and tree, as
// bindEndpointsRecursively does; the tests check only what reaches Hub.
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
	// bindEndpointsRecursively writes the bound function at each path of
	// `endpoints` above, so the tree has exactly the Api shape.
	return tree as Api;
}

// unknown: request bodies are parsed JSON, read with matchers.
type Sent = { url: string; body: Record<string, unknown>; headers: Headers };

// Hub answers the key request (asking for usage at `usagePath`, if given);
// the outcome report gets `outcomeStatus`.
function mockHub(
	outcomeStatus = 200,
	usagePath?: string,
	// unknown: the failed_when Hub's answer carries, as JSON.
	failedWhen?: Record<string, unknown>,
) {
	const sent: Sent[] = [];
	jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
		const url = String(input);
		sent.push({
			url,
			body: JSON.parse(String(init?.body ?? '{}')),
			headers: new Headers(init?.headers),
		});
		const body = url.endsWith('/managed-pricing/credentials')
			? {
					api_key: 'rd-test-key',
					expires_in: 300,
					usage_path: usagePath,
					failed_when: failedWhen,
				}
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

describe('a call whose answer says it failed', () => {
	const FIRECRAWL = { path: 'success', equals: false };
	const dnsFailure = {
		success: false,
		code: 'SCRAPE_DNS_RESOLUTION_ERROR',
		error: 'DNS resolution failed for hostname',
	};

	it('is reported under its key, and comes back as the provider sent it', async () => {
		const hubCalls = mockHub(200, undefined, FIRECRAWL);
		const api = bind(async () => dnsFailure);

		await expect(api.parse.parse({})).resolves.toEqual(dnsFailure);

		const [credentials] = hubCalls.credentials();
		expect(hubCalls.outcomes()[0]?.body).toMatchObject({
			operation: 'parse.parse',
			idempotencyKey: credentials?.body.idempotencyKey,
			outcome: 'failed',
			error: 'Error: success was false: SCRAPE_DNS_RESOLUTION_ERROR',
		});
	});

	it('is not reported when the answer says it worked', async () => {
		const hubCalls = mockHub(200, undefined, FIRECRAWL);
		const api = bind(async () => ({ success: true, data: {} }));

		await api.parse.parse({});

		expect(hubCalls.outcomes()).toHaveLength(0);
	});

	it("is not reported when Hub doesn't say how the provider marks a failure", async () => {
		const hubCalls = mockHub();
		const api = bind(async () => dnsFailure);

		await api.parse.parse({});

		expect(hubCalls.outcomes()).toHaveLength(0);
	});

	it('reports no usage for it, only the failure', async () => {
		const hubCalls = mockHub(200, 'creditsUsed', FIRECRAWL);
		const api = bind(async () => ({ ...dnsFailure, creditsUsed: 1 }));

		await api.parse.parse({});

		expect(hubCalls.outcomes()).toHaveLength(1);
		expect(hubCalls.outcomes()[0]?.body).toMatchObject({ outcome: 'failed' });
	});
});

describe('a key request Hub never answers', () => {
	// The key request fails with `fail`; the outcome report is answered.
	function mockKeyRequest(fail: () => Promise<Response>) {
		const sent: Sent[] = [];
		jest.spyOn(globalThis, 'fetch').mockImplementation(async (input, init) => {
			const url = String(input);
			sent.push({
				url,
				body: JSON.parse(String(init?.body ?? '{}')),
				headers: new Headers(init?.headers),
			});
			if (url.endsWith('/managed-pricing/credentials')) return fail();
			return new Response(JSON.stringify({ error: 'not found' }), {
				status: 404,
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

	it('is reported under its key, since Hub may have charged it, and still throws', async () => {
		const hubCalls = mockKeyRequest(async () => {
			throw new DOMException('The operation timed out.', 'TimeoutError');
		});
		const run = jest.fn(async () => ({ ok: true }));
		const api = bind(run);

		await expect(api.parse.parse({})).rejects.toThrow('timed out');

		expect(run).not.toHaveBeenCalled();
		const [credentials] = hubCalls.credentials();
		expect(hubCalls.outcomes()[0]?.body).toMatchObject({
			operation: 'parse.parse',
			idempotencyKey: credentials?.body.idempotencyKey,
			outcome: 'failed',
		});
	});

	it('is not reported when Hub answered with a refusal', async () => {
		const hubCalls = mockKeyRequest(
			async () =>
				new Response(
					JSON.stringify({
						error: 'Not enough Corsair credits',
						code: 'INSUFFICIENT_CREDITS',
					}),
					{ status: 402, headers: { 'content-type': 'application/json' } },
				),
		);
		const api = bind(async () => ({ ok: true }));

		await expect(api.parse.parse({})).rejects.toThrow();

		expect(hubCalls.outcomes()).toHaveLength(0);
	});
});

describe('a managed call that fails', () => {
	it('is reported even when the thrown value cannot be printed', async () => {
		const hubCalls = mockHub();
		const unprintable = Object.create(null);
		const api = bind(async () => {
			throw unprintable;
		});

		await expect(api.parse.parse({})).rejects.toBe(unprintable);
		expect(hubCalls.outcomes()[0]?.body).toMatchObject({
			outcome: 'failed',
			error: 'Unprintable thrown value',
		});
	});

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

	it('is signed for the outcome endpoint from the cloud runtime', async () => {
		const sent: Headers[] = [];
		jest.spyOn(globalThis, 'fetch').mockImplementation(async (_input, init) => {
			sent.push(new Headers(init?.headers));
			return new Response('{}', {
				status: 200,
				headers: { 'content-type': 'application/json' },
			});
		});
		const call = {
			plugin: 'reducto',
			tenantId: 'me',
			operation: 'parse.parse',
			idempotencyKey: 'k1',
		};
		await reportManagedPricingCallFailed(
			{ ...hub, runtimeProofKey: 'proof-key' },
			call,
			new Error('boom'),
		);
		const header = sent[0]?.get(RUNTIME_PROOF_HEADER) ?? '';
		const t = Number(/t=(\d+)/.exec(header)?.[1]);
		const expected = createHmac('sha256', 'proof-key')
			.update(
				[
					t,
					'/managed-pricing/usage/outcome',
					'reducto',
					'me',
					'parse.parse',
				].join('\n'),
			)
			.digest('base64url');
		expect(header).toBe(`t=${t},v1=${expected}`);

		// A self-hosted SDK has no key and sends no proof.
		await reportManagedPricingCallFailed(hub, call, new Error('boom'));
		expect(sent[1]?.has(RUNTIME_PROOF_HEADER)).toBe(false);
	});

	it('signs the usage report the same way', async () => {
		const sent: Headers[] = [];
		jest.spyOn(globalThis, 'fetch').mockImplementation(async (_input, init) => {
			sent.push(new Headers(init?.headers));
			return new Response('{}', {
				status: 200,
				headers: { 'content-type': 'application/json' },
			});
		});
		const call = {
			plugin: 'reducto',
			tenantId: 'me',
			operation: 'parse.parse',
			idempotencyKey: 'k1',
		};
		await reportManagedPricingCallUsage(
			{ ...hub, runtimeProofKey: 'proof-key' },
			call,
			12,
		);
		expect(sent[0]?.get(RUNTIME_PROOF_HEADER)).toEqual(
			managedPricingOutcomeHeaders(
				{ ...hub, runtimeProofKey: 'proof-key' },
				call,
			)[RUNTIME_PROOF_HEADER],
		);
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
					// unknown: the hook passes both through untouched.
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

describe('a managed call priced per unit', () => {
	it('reports the units its result says it used', async () => {
		const hubCalls = mockHub(200, 'usage.num_pages');
		const api = bind(async () => ({ usage: { num_pages: 12 } }));

		await expect(api.parse.parse({})).resolves.toEqual({
			usage: { num_pages: 12 },
		});

		const [credentials] = hubCalls.credentials();
		expect(hubCalls.outcomes().map((o) => o.body)).toEqual([
			{
				plugin: 'reducto',
				tenantId: 'me',
				operation: 'parse.parse',
				idempotencyKey: credentials?.body.idempotencyKey,
				outcome: 'succeeded',
				usage: { units: 12 },
			},
		]);
	});

	it('reports nothing when the result has no usable number, so the hold stands', async () => {
		const hubCalls = mockHub(200, 'usage.num_pages');
		const api = bind(async () => ({ usage: null }));

		await api.parse.parse({});
		expect(hubCalls.outcomes()).toHaveLength(0);
	});

	it('reports a failure, not usage, when the call fails', async () => {
		const hubCalls = mockHub(200, 'usage.num_pages');
		const api = bind(async () => {
			throw new Error('ReductoAPIError: 500');
		});

		await expect(api.parse.parse({})).rejects.toThrow('500');
		expect(hubCalls.outcomes().map((o) => o.body.outcome)).toEqual(['failed']);
	});

	it('returns the result even when the usage report fails', async () => {
		const hubCalls = mockHub(500, 'usage.num_pages');
		const api = bind(async () => ({ usage: { num_pages: 3 } }));

		await expect(api.parse.parse({})).resolves.toEqual({
			usage: { num_pages: 3 },
		});
		expect(hubCalls.outcomes()).toHaveLength(1);
	});

	it('reports usage after an after hook runs', async () => {
		const hubCalls = mockHub(200, 'costDollars.total');
		const api = bind(async () => ({ costDollars: { total: 0.007 } }), {
			parse: { parse: { after: async () => undefined } },
		});

		await api.parse.parse({});
		expect(hubCalls.outcomes()[0]?.body.usage).toEqual({ units: 0.007 });
	});
});

describe('readUsageUnits', () => {
	it('reads a finite, non-negative number at the path', () => {
		expect(
			readUsageUnits(
				{ data: { metadata: { creditsUsed: 5 } } },
				'data.metadata.creditsUsed',
			),
		).toBe(5);
		expect(readUsageUnits({ cost: 0 }, 'cost')).toBe(0);
	});

	it.each([
		[{ cost: -1 }],
		[{ cost: Number.NaN }],
		[{ cost: '0.002' }],
		[{}],
		[null],
		[{ usage: 'x' }],
	])('reads nothing from %p', (result) => {
		expect(readUsageUnits(result, 'cost')).toBeUndefined();
		expect(readUsageUnits(result, 'usage.num_pages')).toBeUndefined();
	});
});

describe('parseManagedPricingCredentialsResponse usage_path', () => {
	it('keeps a dot path and drops anything else', () => {
		expect(
			parseManagedPricingCredentialsResponse({
				api_key: 'k',
				usage_path: 'usage.num_pages',
			}).usage_path,
		).toBe('usage.num_pages');
		for (const bad of ['', 'usage..num_pages', 'usage[0]', 'a b', 7]) {
			expect(
				parseManagedPricingCredentialsResponse({
					api_key: 'k',
					usage_path: bad,
				}).usage_path,
			).toBeUndefined();
		}
	});
});
