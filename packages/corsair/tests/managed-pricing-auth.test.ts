import { AuthMissingError } from '../core/auth/errors/auth-missing';
import {
	createManagedPricingCredentialCache,
	getManagedPricingApiKey,
	requireHubForManagedPricing,
	resolveManagedPricingApiKey,
} from '../hub/managed-pricing-auth';
import type { HubConfig } from '../hub/types';

const hub: HubConfig = {
	projectApiKey: 'ck_dev_test',
	signingSecret: 'signing-secret',
	apiUrl: 'https://hub.test',
};

const TEST_OPERATION = 'scrape.run';

describe('requireHubForManagedPricing', () => {
	it('throws AuthMissingError when hub is missing', () => {
		expect(() => requireHubForManagedPricing('firecrawl', undefined)).toThrow(
			AuthMissingError,
		);
	});
});

describe('resolveManagedPricingApiKey', () => {
	const cache = createManagedPricingCredentialCache();
	const originalFetch = global.fetch;

	// A typed spy on the real fetch, answered with a real Response, so the
	// calls can be read back without casting the mock.
	const mockHubCredentials = () =>
		jest
			.spyOn(globalThis, 'fetch')
			.mockImplementation(
				async () =>
					new Response(
						JSON.stringify({ api_key: 'fc-test-key', expires_in: 3600 }),
						{ status: 200, headers: { 'content-type': 'application/json' } },
					),
			);

	afterEach(() => {
		global.fetch = originalFetch;
		jest.restoreAllMocks();
	});

	it('forwards operation from input when ctx has no meteredOperationId', async () => {
		const fetchMock = mockHubCredentials();

		const apiKey = await resolveManagedPricingApiKey(
			{ hub, tenantId: 'tenant_a' },
			{ plugin: 'firecrawl', cache, operation: TEST_OPERATION },
		);

		expect(apiKey).toBe('fc-test-key');
		const [url, init] = fetchMock.mock.calls[0] ?? [];
		expect(url).toBe('https://hub.test/managed-pricing/credentials');
		expect(JSON.parse(String(init?.body))).toEqual({
			plugin: 'firecrawl',
			tenantId: 'tenant_a',
			operation: TEST_OPERATION,
			idempotencyKey: expect.any(String),
		});
	});

	it('asks Hub for a fresh, separately charged key on every call', async () => {
		const fetchMock = mockHubCredentials();

		const localCache = createManagedPricingCredentialCache();
		for (let i = 0; i < 3; i++) {
			await resolveManagedPricingApiKey(
				{ hub, tenantId: 'tenant_a' },
				{ plugin: 'firecrawl', cache: localCache, operation: TEST_OPERATION },
			);
		}

		const calls = fetchMock.mock.calls;
		expect(calls).toHaveLength(3);
		const keys = calls.map(
			([, init]) => JSON.parse(String(init?.body)).idempotencyKey,
		);
		expect(new Set(keys).size).toBe(3);
		for (const [, init] of calls) {
			const headers = new Headers(init?.headers);
			expect(headers.get('x-corsair-idempotency-key')).toBe(
				JSON.parse(String(init?.body)).idempotencyKey,
			);
		}
	});

	it('gives up on a key request Hub does not answer', async () => {
		const fetchMock = mockHubCredentials();

		await resolveManagedPricingApiKey(
			{ hub, tenantId: 'tenant_a' },
			{ plugin: 'firecrawl', cache, operation: TEST_OPERATION },
		);

		const [, init] = fetchMock.mock.calls[0] ?? [];
		expect(init?.signal).toBeInstanceOf(AbortSignal);
		expect(init?.signal?.aborted).toBe(false);
	});

	it('does not merge concurrent calls into one charge', async () => {
		const fetchMock = mockHubCredentials();

		const localCache = createManagedPricingCredentialCache();
		await Promise.all(
			[1, 2].map(() =>
				resolveManagedPricingApiKey(
					{ hub, tenantId: 'tenant_a' },
					{ plugin: 'firecrawl', cache: localCache, operation: TEST_OPERATION },
				),
			),
		);

		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
});

describe('getManagedPricingApiKey', () => {
	const cache = createManagedPricingCredentialCache();
	const originalFetch = global.fetch;

	afterEach(() => {
		global.fetch = originalFetch;
		jest.restoreAllMocks();
	});

	it('fetches credentials from Hub and does not persist to the database', async () => {
		global.fetch = jest.fn(async () => ({
			ok: true,
			status: 200,
			headers: { get: () => 'application/json' },
			text: async () =>
				JSON.stringify({ api_key: 'fc-test-key', expires_in: 3600 }),
		})) as typeof fetch;

		const result = await getManagedPricingApiKey(
			{
				hub,
				plugin: 'firecrawl',
				tenantId: 'tenant_a',
				cache,
			},
			{ operation: TEST_OPERATION },
		);

		expect(result.apiKey).toBe('fc-test-key');
		expect(result.fromCache).toBe(false);
		expect(global.fetch).toHaveBeenCalledWith(
			'https://hub.test/managed-pricing/credentials',
			expect.objectContaining({
				method: 'POST',
				body: JSON.stringify({
					plugin: 'firecrawl',
					tenantId: 'tenant_a',
					operation: TEST_OPERATION,
				}),
			}),
		);
	});

	it('reuses in-process cache while the credential is fresh', async () => {
		global.fetch = jest.fn(async () => ({
			ok: true,
			status: 200,
			headers: { get: () => 'application/json' },
			text: async () =>
				JSON.stringify({ api_key: 'fc-test-key', expires_in: 3600 }),
		})) as typeof fetch;

		const localCache = createManagedPricingCredentialCache();

		await getManagedPricingApiKey(
			{
				hub,
				plugin: 'firecrawl',
				tenantId: 'tenant_a',
				cache: localCache,
			},
			{ operation: TEST_OPERATION },
		);

		const second = await getManagedPricingApiKey(
			{
				hub,
				plugin: 'firecrawl',
				tenantId: 'tenant_a',
				cache: localCache,
			},
			{ operation: TEST_OPERATION },
		);

		expect(second.fromCache).toBe(true);
		expect(global.fetch).toHaveBeenCalledTimes(1);
	});

	it('does not reuse cache across different Hub project keys on the same cache object', async () => {
		global.fetch = jest
			.fn()
			.mockImplementationOnce(async () => ({
				ok: true,
				status: 200,
				headers: { get: () => 'application/json' },
				text: async () =>
					JSON.stringify({ api_key: 'key-project-a', expires_in: 3600 }),
			}))
			.mockImplementationOnce(async () => ({
				ok: true,
				status: 200,
				headers: { get: () => 'application/json' },
				text: async () =>
					JSON.stringify({ api_key: 'key-project-b', expires_in: 3600 }),
			})) as typeof fetch;

		const sharedCache = createManagedPricingCredentialCache();

		const first = await getManagedPricingApiKey(
			{
				hub,
				plugin: 'firecrawl',
				tenantId: 'default',
				cache: sharedCache,
			},
			{ operation: TEST_OPERATION },
		);
		const second = await getManagedPricingApiKey(
			{
				hub: {
					...hub,
					projectApiKey: 'ck_dev_other_project',
				},
				plugin: 'firecrawl',
				tenantId: 'default',
				cache: sharedCache,
			},
			{ operation: TEST_OPERATION },
		);

		expect(first.apiKey).toBe('key-project-a');
		expect(second.apiKey).toBe('key-project-b');
		expect(global.fetch).toHaveBeenCalledTimes(2);
	});

	it('does not reuse cache across different Hub apiUrl values', async () => {
		global.fetch = jest
			.fn()
			.mockImplementationOnce(async () => ({
				ok: true,
				status: 200,
				headers: { get: () => 'application/json' },
				text: async () =>
					JSON.stringify({ api_key: 'key-hub-a', expires_in: 3600 }),
			}))
			.mockImplementationOnce(async () => ({
				ok: true,
				status: 200,
				headers: { get: () => 'application/json' },
				text: async () =>
					JSON.stringify({ api_key: 'key-hub-b', expires_in: 3600 }),
			})) as typeof fetch;

		const sharedCache = createManagedPricingCredentialCache();

		const first = await getManagedPricingApiKey(
			{
				hub,
				plugin: 'firecrawl',
				tenantId: 'default',
				cache: sharedCache,
			},
			{ operation: TEST_OPERATION },
		);
		const second = await getManagedPricingApiKey(
			{
				hub: {
					...hub,
					apiUrl: 'https://other-hub.test/',
				},
				plugin: 'firecrawl',
				tenantId: 'default',
				cache: sharedCache,
			},
			{ operation: TEST_OPERATION },
		);

		expect(first.apiKey).toBe('key-hub-a');
		expect(second.apiKey).toBe('key-hub-b');
		expect(global.fetch).toHaveBeenCalledTimes(2);
	});

	it('forceRefresh contacts Hub even when a fresh credential is cached', async () => {
		global.fetch = jest.fn(async () => ({
			ok: true,
			status: 200,
			headers: { get: () => 'application/json' },
			text: async () =>
				JSON.stringify({ api_key: 'fc-test-key', expires_in: 3600 }),
		})) as typeof fetch;

		const localCache = createManagedPricingCredentialCache();

		await getManagedPricingApiKey(
			{
				hub,
				plugin: 'firecrawl',
				tenantId: 'tenant_a',
				cache: localCache,
			},
			{ operation: TEST_OPERATION },
		);

		const forced = await getManagedPricingApiKey(
			{
				hub,
				plugin: 'firecrawl',
				tenantId: 'tenant_a',
				cache: localCache,
			},
			{ operation: TEST_OPERATION, forceRefresh: true },
		);

		expect(forced.fromCache).toBe(false);
		expect(global.fetch).toHaveBeenCalledTimes(2);
	});
});
