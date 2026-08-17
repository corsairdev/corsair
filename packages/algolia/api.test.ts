import { request } from 'corsair/http';
import { makeAlgoliaRequest } from './client';
import type { AlgoliaContext } from './index';
import { algolia, algoliaEndpointSchemas } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

function countLeaves(tree: Record<string, unknown>): number {
	return Object.values(tree).reduce<number>((count, value) => {
		if (typeof value === 'function') return count + 1;
		if (value && typeof value === 'object') {
			return count + countLeaves(value as Record<string, unknown>);
		}
		return count;
	}, 0);
}

function endpointPaths(tree: Record<string, unknown>, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') return [path];
		if (value && typeof value === 'object') {
			return endpointPaths(value as Record<string, unknown>, path);
		}
		return [];
	});
}

const mockCtx = {
	key: 'test-api-key',
	$getAccountId: () => 'test-account-id',
	options: {
		applicationId: 'test-app-id',
		region: 'us',
	},
	keys: {
		get_applicationId: jest.fn().mockResolvedValue('test-app-id'),
		get_api_key: jest.fn().mockResolvedValue('test-api-key'),
	},
	logEvent: jest.fn(),
	db: {},
} as unknown as AlgoliaContext;

describe('Algolia plugin shape', () => {
	it('exposes every listed operation with schemas and no webhooks', () => {
		const plugin = algolia();
		const endpoints = plugin.endpoints as Record<string, unknown>;
		const paths = endpointPaths(endpoints).sort();

		expect(countLeaves(endpoints)).toBe(133);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(133);
		expect(Object.keys(algoliaEndpointSchemas)).toHaveLength(133);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(Object.keys(algoliaEndpointSchemas).sort()).toEqual(paths);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});

	it('supports dual auth with applicationId account field', () => {
		const plugin = algolia();
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['applicationId'] },
		});
	});
});

describe('Algolia request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('sends Algolia application ID and API key headers', async () => {
		await makeAlgoliaRequest(
			'/1/indexes/products/query',
			'test-app-id',
			'test-api-key',
			{
				method: 'POST',
				body: { query: 'shoes' },
				baseUrl: 'https://test-app-id-dsn.algolia.net',
			},
		);

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://test-app-id-dsn.algolia.net',
				HEADERS: expect.objectContaining({
					'X-Algolia-Application-Id': 'test-app-id',
					'X-Algolia-API-Key': 'test-api-key',
					'Content-Type': 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/1/indexes/products/query',
				body: { query: 'shoes' },
			}),
		);
	});
});

describe('Algolia endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('maps representative operations to API routes', async () => {
		const plugin = algolia({
			applicationId: 'test-app-id',
			key: 'test-api-key',
		});
		const endpoints = plugin.endpoints as NonNullable<
			typeof plugin.endpoints
		> & {
			search: {
				searchIndex: (
					ctx: AlgoliaContext,
					input: { index_name: string; query?: string },
				) => Promise<unknown>;
			};
			analytics: {
				getSearchesCount: (
					ctx: AlgoliaContext,
					input: Record<string, unknown>,
				) => Promise<unknown>;
			};
		};

		await endpoints.search.searchIndex(mockCtx, {
			index_name: 'products',
			query: 'shoes',
		});
		await endpoints.analytics.getSearchesCount(mockCtx, {});

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					method: 'POST',
					url: '/1/indexes/products/query',
					body: { query: 'shoes' },
				}),
				expect.objectContaining({
					method: 'GET',
					url: '/2/searches/count',
				}),
			]),
		);

		expect(mockRequest.mock.calls[0]?.[0]).toEqual(
			expect.objectContaining({
				BASE: 'https://test-app-id-dsn.algolia.net',
			}),
		);
		expect(mockRequest.mock.calls[1]?.[0]).toEqual(
			expect.objectContaining({
				BASE: 'https://analytics.algolia.com',
			}),
		);
	});
});
