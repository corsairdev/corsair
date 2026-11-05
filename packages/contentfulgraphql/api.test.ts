import { ApiError, request } from 'corsair/http';
import {
	buildContentfulGraphqlPath,
	ContentfulGraphqlAPIError,
	makeContentfulGraphqlPersistedQueryRequest,
	makeContentfulGraphqlRequest,
	sha256,
} from './client';
import type { ContentfulGraphqlContext } from './index';
import { contentfulGraphqlEndpointSchemas, contentfulgraphql } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

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
	options: {},
	keys: {
		get_api_key: jest.fn().mockResolvedValue('test-api-key'),
		get_space_id: jest.fn().mockResolvedValue('test-space-id'),
		get_environment_id: jest.fn().mockResolvedValue('staging'),
	},
	logEvent: jest.fn(),
	database: {},
} as unknown as ContentfulGraphqlContext;

describe('Contentful GraphQL plugin shape', () => {
	it('exposes the three required operations with schemas and no webhooks', () => {
		const plugin = contentfulgraphql();
		const endpoints = plugin.endpoints as Record<string, unknown>;
		const paths = endpointPaths(endpoints).sort();

		expect(paths).toEqual([
			'getCmaToken',
			'graphQlContentApiPersistedQuery',
			'graphQlContentApiQuery',
		]);
		expect(Object.keys(contentfulGraphqlEndpointSchemas).sort()).toEqual(paths);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: '' })).toBe(
			false,
		);
	});

	it('uses api_key auth with space_id and environment_id account fields', () => {
		const plugin = contentfulgraphql();
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['space_id', 'environment_id'] },
		});
	});
});

describe('Contentful GraphQL URL + hash helpers', () => {
	it('builds the space path with an optional environment segment', () => {
		expect(buildContentfulGraphqlPath('abc123')).toBe(
			'/content/v1/spaces/abc123',
		);
		expect(buildContentfulGraphqlPath('abc123', 'staging')).toBe(
			'/content/v1/spaces/abc123/environments/staging',
		);
	});

	it('computes SHA-256 hashes for persisted queries', () => {
		expect(sha256('query { blogCollection { items { title } } }')).toBe(
			'4b764b5463f35c0c5d5ff33d059934f5d647cdc8d5ba93e157992692ce63975e',
		);
	});
});

describe('Contentful GraphQL request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('sends an authenticated POST to the GraphQL Content API and returns data', async () => {
		mockRequest.mockResolvedValue({
			data: { blogCollection: { items: [{ title: 'Hello' }] } },
		});

		const data = await makeContentfulGraphqlRequest(
			'/content/v1/spaces/abc123',
			'test-api-key',
			{ query: '{ blogCollection { items { title } } }' },
		);

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://graphql.contentful.com',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer test-api-key',
				}),
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/content/v1/spaces/abc123',
				body: { query: '{ blogCollection { items { title } } }' },
			}),
			expect.anything(),
		);
		expect(data).toEqual({
			blogCollection: { items: [{ title: 'Hello' }] },
		});
	});

	it('throws a ContentfulGraphqlAPIError with the code when the API returns errors', async () => {
		mockRequest.mockResolvedValue({
			errors: [
				{
					message: 'ACCESS_TOKEN_INVALID',
					extensions: { code: 'ACCESS_TOKEN_INVALID' },
				},
			],
		});

		await expect(
			makeContentfulGraphqlRequest('/content/v1/spaces/abc123', 'bad', {
				query: '{ blogCollection { items { title } } }',
			}),
		).rejects.toMatchObject({
			name: 'ContentfulGraphqlAPIError',
			message: 'ACCESS_TOKEN_INVALID',
			code: 'ACCESS_TOKEN_INVALID',
		});
	});

	it('preserves ApiError status, statusText, and body when rejecting', async () => {
		const apiError = new ApiError(
			{
				method: 'POST',
				url: 'https://graphql.contentful.com/content/v1/spaces/abc123',
			},
			{
				ok: false,
				url: 'https://graphql.contentful.com/content/v1/spaces/abc123',
				status: 429,
				statusText: 'Too Many Requests',
				body: { message: 'Rate limit exceeded' },
			},
			'Too Many Requests',
		);
		mockRequest.mockRejectedValue(apiError);

		await expect(
			makeContentfulGraphqlRequest('/content/v1/spaces/abc123', 'key', {
				query: '{}',
			}),
		).rejects.toMatchObject({
			name: 'ContentfulGraphqlAPIError',
			status: 429,
			statusText: 'Too Many Requests',
			body: { message: 'Rate limit exceeded' },
		});
	});
});

describe('Contentful GraphQL persisted query client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	const hash = sha256('{ blogCollection { items { title } } }');

	it('sends a hash-only request when the query is already registered', async () => {
		mockRequest.mockResolvedValue({
			data: { blogCollection: { items: [] } },
		});

		const data = await makeContentfulGraphqlPersistedQueryRequest(
			'/content/v1/spaces/abc123',
			'test-api-key',
			{ sha256Hash: hash },
		);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				body: {
					extensions: {
						persistedQuery: { version: 1, sha256Hash: hash },
					},
				},
			}),
			expect.anything(),
		);
		expect(data).toEqual({ blogCollection: { items: [] } });
	});

	it('retries with the full query when Contentful returns PersistedQueryNotFound', async () => {
		mockRequest
			.mockRejectedValueOnce(
				new ContentfulGraphqlAPIError('PersistedQueryNotFound', {
					code: 'PERSISTED_QUERY_NOT_FOUND',
				}),
			)
			.mockResolvedValueOnce({
				data: { blogCollection: { items: [{ title: 'Hello' }] } },
			});

		const data = await makeContentfulGraphqlPersistedQueryRequest(
			'/content/v1/spaces/abc123',
			'test-api-key',
			{ sha256Hash: hash, query: '{ blogCollection { items { title } } }' },
		);

		expect(mockRequest).toHaveBeenCalledTimes(2);
		expect(mockRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				body: expect.not.objectContaining({ query: expect.anything() }),
			}),
		);
		expect(mockRequest.mock.calls[1]?.[1]).toEqual(
			expect.objectContaining({
				body: expect.objectContaining({
					query: '{ blogCollection { items { title } } }',
					extensions: {
						persistedQuery: { version: 1, sha256Hash: hash },
					},
				}),
			}),
		);
		expect(data).toEqual({
			blogCollection: { items: [{ title: 'Hello' }] },
		});
	});

	it('rethrows PersistedQueryNotFound when no query is available to register', async () => {
		mockRequest.mockRejectedValue(
			new ContentfulGraphqlAPIError('PersistedQueryNotFound', {
				code: 'PERSISTED_QUERY_NOT_FOUND',
			}),
		);

		await expect(
			makeContentfulGraphqlPersistedQueryRequest(
				'/content/v1/spaces/abc123',
				'test-api-key',
				{ sha256Hash: hash },
			),
		).rejects.toMatchObject({
			name: 'ContentfulGraphqlAPIError',
			message: 'PersistedQueryNotFound',
		});
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});
});

describe('Contentful GraphQL endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ data: {} });
	});

	it('getCmaToken returns the stored token, space ID, and environment ID', async () => {
		const plugin = contentfulgraphql();
		const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;

		const response = await endpoints.getCmaToken(mockCtx, {});

		expect(response).toEqual({
			space_id: 'test-space-id',
			environment_id: 'staging',
		});
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('getCmaToken omits environment_id when it is not configured', async () => {
		const ctx = {
			...mockCtx,
			keys: {
				...mockCtx.keys,
				get_environment_id: jest.fn().mockResolvedValue(null),
			},
		} as unknown as ContentfulGraphqlContext;
		const plugin = contentfulgraphql();
		const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;

		const response = await endpoints.getCmaToken(ctx, {});

		expect(response).toEqual({
			space_id: 'test-space-id',
		});
	});

	it('graphQlContentApiQuery posts to the environment path with query and variables', async () => {
		const plugin = contentfulgraphql();
		const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;

		await endpoints.graphQlContentApiQuery(mockCtx, {
			query:
				'query($preview: Boolean) { blogCollection(preview: $preview) { items { title } } }',
			variables: { preview: true },
			operationName: 'BlogPosts',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://graphql.contentful.com',
			}),
			expect.objectContaining({
				url: '/content/v1/spaces/test-space-id/environments/staging',
				body: expect.objectContaining({
					query:
						'query($preview: Boolean) { blogCollection(preview: $preview) { items { title } } }',
					variables: { preview: true },
					operationName: 'BlogPosts',
				}),
			}),
			expect.anything(),
		);
	});

	it('graphQlContentApiQuery throws when space_id is not configured', async () => {
		const ctx = {
			...mockCtx,
			keys: {
				...mockCtx.keys,
				get_space_id: jest.fn().mockResolvedValue(null),
			},
		} as unknown as ContentfulGraphqlContext;
		const plugin = contentfulgraphql();
		const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;

		await expect(
			endpoints.graphQlContentApiQuery(ctx, {
				query: '{ blogCollection { items { title } } }',
			}),
		).rejects.toThrow('space_id is required');
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('graphQlContentApiPersistedQuery derives the SHA-256 hash from the query', async () => {
		const query = '{ blogCollection { items { title } } }';
		mockRequest
			.mockRejectedValueOnce(
				new ContentfulGraphqlAPIError('PersistedQueryNotFound', {
					code: 'PERSISTED_QUERY_NOT_FOUND',
				}),
			)
			.mockResolvedValueOnce({ data: {} });
		const plugin = contentfulgraphql();
		const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;

		await endpoints.graphQlContentApiPersistedQuery(mockCtx, { query });

		expect(mockRequest).toHaveBeenCalledTimes(2);
		expect(mockRequest.mock.calls[1]?.[1]).toEqual(
			expect.objectContaining({
				body: expect.objectContaining({
					query,
					extensions: {
						persistedQuery: { version: 1, sha256Hash: sha256(query) },
					},
				}),
			}),
		);
	});

	it('graphQlContentApiPersistedQuery honors an explicit sha256Hash', async () => {
		const plugin = contentfulgraphql();
		const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;

		await endpoints.graphQlContentApiPersistedQuery(mockCtx, {
			sha256Hash: 'abc123hash',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				body: expect.objectContaining({
					extensions: {
						persistedQuery: { version: 1, sha256Hash: 'abc123hash' },
					},
				}),
			}),
			expect.anything(),
		);
	});
});
