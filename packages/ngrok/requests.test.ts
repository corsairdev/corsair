import { createCorsair } from 'corsair';
import type { CorsairEndpoint } from 'corsair/core';
import { asRecord } from 'corsair/core';
import type { NgrokPluginOptions } from './index';
import { ngrok, ngrokEndpointsNested } from './index';
import {
	apiKeys,
	createdApiKey,
	domainConflict,
	endpoints,
	endpointsLastPage,
	eventSubscriptions,
	invalidCredential,
	missingAuthHeader,
	reservedDomains,
	revokedKey,
	singleDomain,
	singleEndpoint,
	singleEventSubscription,
	tunnels,
} from './test-fixtures';

const API_KEY = '2f1c8d9e3a5b4c6d8e9f0a1b2c3d4e5f_test';

function makeContext() {
	return {
		key: API_KEY,
		authType: 'api_key' as const,
		options: {} as NgrokPluginOptions,
		tenantId: 'default',
		log: async () => undefined,
		db: {},
		keys: {},
		_http: {},
	};
}

// unknown: each operation has its own input and output, and every call site
// passes a concrete value that the operation's schema validates.
type Endpoint = CorsairEndpoint<never, unknown, unknown>;

const endpointsNested = ngrokEndpointsNested;

/** Runs one endpoint and returns the response and the request that made it. */
async function capture(
	endpoint: Endpoint,
	input: unknown,
	body: unknown,
	{ status = 200, contentLength = true } = {},
): Promise<{ result: unknown; url: string; init: RequestInit }> {
	const original = globalThis.fetch;
	let url = '';
	let init: RequestInit = {};
	globalThis.fetch = (async (called: string, options: RequestInit) => {
		url = called;
		init = options;
		// A 204 must carry no body at all, which is what ngrok sends.
		if (status === 204 && !contentLength) {
			return new Response(null, { status });
		}
		return new Response(
			typeof body === 'string' ? body : JSON.stringify(body),
			{ status, headers: { 'Content-Type': 'application/json' } },
		);
	}) as typeof fetch;

	try {
		const result = await endpoint(makeContext() as never, input);
		if (!url) throw new Error('no request was made');
		return { result, url, init };
	} finally {
		globalThis.fetch = original;
	}
}

function sentBody(init: RequestInit): Record<string, unknown> {
	// unknown: the body is the JSON the endpoint built; read as a record.
	const parsed = JSON.parse(String(init.body)) as unknown;
	const record = asRecord(parsed);
	if (!record) throw new Error('request body was not an object');
	return record;
}

describe('request shape', () => {
	it('sends a bearer token and the required Ngrok-Version header', async () => {
		const { url, init } = await capture(
			endpointsNested.endpoints.list,
			{},
			endpoints,
		);

		expect(url).toBe('https://api.ngrok.com/endpoints');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
		// Without this header ngrok answers a version error that reads as auth.
		expect(headers.get('ngrok-version')).toBe('2');
	});
});

describe('endpoints', () => {
	it('lists endpoints and reports the next page url', async () => {
		const { result } = await capture(
			endpointsNested.endpoints.list,
			{},
			endpoints,
		);

		const page = asRecord(result);
		const list = page?.endpoints;
		const first = asRecord(Array.isArray(list) ? list[0] : null);
		expect(first?.public_url).toBe('https://acme-api.ngrok.app');
		expect(page?.next_page_uri).toContain('before_id=ep_next');
	});

	it('reports no next page on the last page', async () => {
		const { result } = await capture(
			endpointsNested.endpoints.list,
			{},
			endpointsLastPage,
		);

		expect(asRecord(result)?.next_page_uri).toBeUndefined();
	});

	it('passes before_id, limit and filter', async () => {
		const { url } = await capture(
			endpointsNested.endpoints.list,
			{ before_id: 'ep_next', limit: 10, filter: 'proto="https"' },
			endpoints,
		);

		const parsed = new URL(url);
		expect(parsed.searchParams.get('before_id')).toBe('ep_next');
		expect(parsed.searchParams.get('limit')).toBe('10');
		expect(parsed.searchParams.get('filter')).toBe('proto="https"');
	});

	it('reads one endpoint with its nested references', async () => {
		const { result, url } = await capture(
			endpointsNested.endpoints.get,
			{ id: 'ep_1' },
			singleEndpoint,
		);

		expect(url).toBe('https://api.ngrok.com/endpoints/ep_1');
		const endpoint = asRecord(result);
		expect(asRecord(endpoint?.domain)?.id).toBe('rd_1');
		expect(asRecord(endpoint?.tunnel)?.id).toBe('tn_1');
	});

	it('creates an endpoint with the upstream url', async () => {
		const { result, url, init } = await capture(
			endpointsNested.endpoints.create,
			{ url: 'https://internal.example.com', description: 'Acme API' },
			singleEndpoint,
			{ status: 201 },
		);

		expect(url).toBe('https://api.ngrok.com/endpoints');
		expect(init.method).toBe('POST');
		const body = sentBody(init);
		expect(body.url).toBe('https://internal.example.com');
		expect(asRecord(result)?.id).toBe(singleEndpoint?.id);
	});

	it('rejects a create without an upstream url', async () => {
		await expect(
			// Cast past the type: the point is that the schema refuses a missing
			// upstream url at runtime for a caller passing untyped input.
			endpointsNested.endpoints.create(
				makeContext() as never,
				{
					description: 'No url',
				} as never,
			),
		).rejects.toThrow();
	});

	it('patches only the fields sent, keeping the id out of the body', async () => {
		const { init } = await capture(
			endpointsNested.endpoints.update,
			{ id: 'ep_1', description: 'Renamed' },
			singleEndpoint,
		);

		const body = sentBody(init);
		expect(body).toEqual({ description: 'Renamed' });
		expect(body).not.toHaveProperty('id');
	});

	it('deletes with a DELETE and reports the id', async () => {
		const { result, url, init } = await capture(
			endpointsNested.endpoints.delete,
			{ id: 'ep_1' },
			null,
			{ status: 204, contentLength: false },
		);

		expect(url).toBe('https://api.ngrok.com/endpoints/ep_1');
		expect(init.method).toBe('DELETE');
		// The response is bodyless, so the flag comes from the call succeeding.
		expect(asRecord(result)).toEqual({ deleted: true, id: 'ep_1' });
	});
});

describe('tunnels', () => {
	it('lists tunnels with their forwards_to target', async () => {
		const { result, url } = await capture(
			endpointsNested.tunnels.list,
			{},
			tunnels,
		);

		expect(url).toBe('https://api.ngrok.com/tunnels');
		const list = asRecord(result)?.tunnels;
		const first = asRecord(Array.isArray(list) ? list[0] : null);
		expect(first?.forwards_to).toBe('http://localhost:8080');
	});
});

describe('domains', () => {
	it('lists domains with the CNAME target to point DNS at', async () => {
		const { result } = await capture(
			endpointsNested.domains.list,
			{},
			reservedDomains,
		);

		const list = asRecord(result)?.reserved_domains;
		const first = asRecord(Array.isArray(list) ? list[0] : null);
		expect(first?.cname_target).toBe('abc123.cname.us.ngrok-cname.com');
	});

	it('reserves a domain and returns the CNAME to use', async () => {
		const { result, url, init } = await capture(
			endpointsNested.domains.create,
			{ domain: 'acme.example.com', description: 'Acme production' },
			singleDomain,
			{ status: 201 },
		);

		expect(url).toBe('https://api.ngrok.com/reserved_domains');
		expect(sentBody(init).domain).toBe('acme.example.com');
		expect(asRecord(result)?.cname_target).toBe(
			'abc123.cname.us.ngrok-cname.com',
		);
	});

	it('keeps the certificate provisioning status', async () => {
		const { result } = await capture(
			endpointsNested.domains.get,
			{ id: 'rd_1' },
			singleDomain,
		);

		const status = asRecord(asRecord(result)?.certificate_management_status);
		// Provisioning has not started, so the job is null rather than missing.
		expect(status?.provisioning_job).toBeNull();
	});

	it('releases a domain and reports the id', async () => {
		const { result } = await capture(
			endpointsNested.domains.delete,
			{ id: 'rd_1' },
			null,
			{ status: 204, contentLength: false },
		);

		expect(asRecord(result)).toEqual({ deleted: true, id: 'rd_1' });
	});

	it('reports a domain already reserved by another account', async () => {
		await expect(
			capture(
				endpointsNested.domains.create,
				{ domain: 'acme.example.com' },
				domainConflict,
				{ status: 409 },
			),
		).rejects.toThrow(/already reserved/);
	});
});

describe('apiKeys', () => {
	it('lists keys without tokens', async () => {
		const { result } = await capture(endpointsNested.apiKeys.list, {}, apiKeys);

		const list = asRecord(result)?.keys;
		const first = asRecord(Array.isArray(list) ? list[0] : null);
		expect(first?.description).toBe('CI deploy');
		expect(first?.token).toBeUndefined();
	});

	it('returns the token once on create', async () => {
		const { result, url } = await capture(
			endpointsNested.apiKeys.create,
			{ description: 'CI deploy' },
			createdApiKey,
			{ status: 201 },
		);

		expect(url).toBe('https://api.ngrok.com/api_keys');
		expect(asRecord(result)?.token).toBe(createdApiKey.token);
	});

	it('revokes a key and reports the id', async () => {
		const { result, init } = await capture(
			endpointsNested.apiKeys.delete,
			{ id: 'ak_1' },
			null,
			{ status: 204, contentLength: false },
		);

		expect(init.method).toBe('DELETE');
		expect(asRecord(result)).toEqual({ deleted: true, id: 'ak_1' });
	});
});

describe('events', () => {
	it('lists subscriptions with their sources and destinations', async () => {
		const { result } = await capture(
			endpointsNested.events.list,
			{},
			eventSubscriptions,
		);

		const list = asRecord(result)?.event_subscriptions;
		const first = asRecord(Array.isArray(list) ? list[0] : null);
		const sources = first?.sources;
		const source = asRecord(Array.isArray(sources) ? sources[0] : null);
		expect(source?.type).toBe('endpoint.created');
	});

	it('creates a subscription from source types and destination ids', async () => {
		const { init, url } = await capture(
			endpointsNested.events.create,
			{
				sources: [{ type: 'endpoint.created' }],
				destination_ids: ['ed_1'],
			},
			singleEventSubscription,
			{ status: 201 },
		);

		expect(url).toBe('https://api.ngrok.com/event_subscriptions');
		const body = sentBody(init);
		expect(body.sources).toEqual([{ type: 'endpoint.created' }]);
		expect(body.destination_ids).toEqual(['ed_1']);
	});

	it('rejects a subscription with no destination', async () => {
		await expect(
			endpointsNested.events.create(makeContext() as never, {
				sources: [{ type: 'endpoint.created' }],
				destination_ids: [],
			}),
		).rejects.toThrow();
	});

	it('deletes a subscription and reports the id', async () => {
		const { result } = await capture(
			endpointsNested.events.delete,
			{ id: 'es_1' },
			null,
			{ status: 204, contentLength: false },
		);

		expect(asRecord(result)).toEqual({ deleted: true, id: 'es_1' });
	});
});

describe('ngrok error reporting', () => {
	it('reports a missing Authorization header by its own code', async () => {
		const error = await capture(
			endpointsNested.endpoints.list,
			{},
			missingAuthHeader,
			{ status: 403 },
		).catch((caught: unknown) => caught);

		expect(String(error)).toContain('ERR_NGROK_200');
		expect(String(error)).toContain('Authorization header');
	});

	it('keeps the operation id, which ngrok support asks for', async () => {
		const error = await capture(
			endpointsNested.endpoints.list,
			{},
			invalidCredential,
			{ status: 403 },
		).catch((caught: unknown) => caught);

		expect(String(error)).toContain('op_3MBbpR8VoQVKJ9wkptaQd4UVx48');
	});

	it('reports a revoked key by its own code', async () => {
		const error = await capture(
			endpointsNested.endpoints.list,
			{},
			revokedKey,
			{ status: 401 },
		).catch((caught: unknown) => caught);

		expect(String(error)).toContain('ERR_NGROK_201');
	});

	it('does not leak the API key into the error message', async () => {
		const error = await capture(
			endpointsNested.endpoints.list,
			{},
			invalidCredential,
			{ status: 403 },
		).catch((caught: unknown) => caught);

		expect(String(error)).not.toContain(API_KEY);
	});
});

describe('ngrok plugin definition', () => {
	it('registers as ngrok with api_key auth and no webhooks', () => {
		const plugin = ngrok();
		expect(plugin.id).toBe('ngrok');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 18 catalog operations', () => {
		const nested = Object.entries(ngrokEndpointsNested).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual([
			'apiKeys.create',
			'apiKeys.delete',
			'apiKeys.list',
			'domains.create',
			'domains.delete',
			'domains.get',
			'domains.list',
			'domains.update',
			'endpoints.create',
			'endpoints.delete',
			'endpoints.get',
			'endpoints.list',
			'endpoints.update',
			'events.create',
			'events.delete',
			'events.get',
			'events.list',
			'tunnels.list',
		]);
	});

	it('marks every delete destructive and irreversible', () => {
		const meta = ngrok().endpointMeta ?? {};
		for (const name of [
			'endpoints.delete',
			'domains.delete',
			'apiKeys.delete',
			'events.delete',
		]) {
			expect({
				name,
				risk: meta[name as keyof typeof meta]?.riskLevel,
			}).toEqual({
				name,
				risk: 'destructive',
			});
			expect(meta[name as keyof typeof meta]?.irreversible).toBe(true);
		}
	});

	it('builds a key from the option, then the stored key, then throws', async () => {
		const plugin = ngrok();
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
		const corsair = createCorsair({ plugins: [ngrok({ key: 'k' })] });
		expect(corsair.ngrok).toBeDefined();
	});
});
