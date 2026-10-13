import { AuthMissingError } from '../core/auth/errors/auth-missing';
import {
	createManagedPricingCredentialCache,
	getManagedPricingApiKey,
	requireHubForManagedPricing,
} from '../hub/managed-pricing-auth';
import type { HubConfig } from '../hub/types';

const hub: HubConfig = {
	projectApiKey: 'ck_dev_test',
	signingSecret: 'signing-secret',
	apiUrl: 'https://hub.test',
};

describe('requireHubForManagedPricing', () => {
	it('throws AuthMissingError when hub is missing', () => {
		expect(() => requireHubForManagedPricing('firecrawl', undefined)).toThrow(
			AuthMissingError,
		);
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

		const result = await getManagedPricingApiKey({
			hub,
			plugin: 'firecrawl',
			tenantId: 'tenant_a',
			cache,
		});

		expect(result.apiKey).toBe('fc-test-key');
		expect(result.fromCache).toBe(false);
		expect(global.fetch).toHaveBeenCalledWith(
			'https://hub.test/managed-pricing/credentials',
			expect.objectContaining({
				method: 'POST',
				body: JSON.stringify({
					plugin: 'firecrawl',
					tenantId: 'tenant_a',
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

		await getManagedPricingApiKey({
			hub,
			plugin: 'firecrawl',
			tenantId: 'tenant_a',
			cache: localCache,
		});

		const second = await getManagedPricingApiKey({
			hub,
			plugin: 'firecrawl',
			tenantId: 'tenant_a',
			cache: localCache,
		});

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

		const first = await getManagedPricingApiKey({
			hub,
			plugin: 'firecrawl',
			tenantId: 'default',
			cache: sharedCache,
		});
		const second = await getManagedPricingApiKey({
			hub: {
				...hub,
				projectApiKey: 'ck_dev_other_project',
			},
			plugin: 'firecrawl',
			tenantId: 'default',
			cache: sharedCache,
		});

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

		const first = await getManagedPricingApiKey({
			hub,
			plugin: 'firecrawl',
			tenantId: 'default',
			cache: sharedCache,
		});
		const second = await getManagedPricingApiKey({
			hub: {
				...hub,
				apiUrl: 'https://other-hub.test/',
			},
			plugin: 'firecrawl',
			tenantId: 'default',
			cache: sharedCache,
		});

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

		await getManagedPricingApiKey({
			hub,
			plugin: 'firecrawl',
			tenantId: 'tenant_a',
			cache: localCache,
		});

		const forced = await getManagedPricingApiKey(
			{
				hub,
				plugin: 'firecrawl',
				tenantId: 'tenant_a',
				cache: localCache,
			},
			{ forceRefresh: true },
		);

		expect(forced.fromCache).toBe(false);
		expect(global.fetch).toHaveBeenCalledTimes(2);
	});
});
