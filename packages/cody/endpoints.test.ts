import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { ZodError } from 'zod';
import { makeCodyRequest } from './client';
import { post as graphql } from './endpoints/graphql';
import { get as search } from './endpoints/search';
import type {
	GraphqlResponse,
	SearchResponse,
	ViewerResponse,
} from './endpoints/types';
import {
	CodyEndpointInputSchemas,
	CodyEndpointOutputSchemas,
} from './endpoints/types';
import { get as viewer } from './endpoints/viewer';
import { errorHandlers } from './error-handlers';
import { cody } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeCodyRequest: jest.fn(),
}));

const mockRequest = makeCodyRequest as jest.MockedFunction<
	typeof makeCodyRequest
>;

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const apiKeyCtx = {
	key: 'test-cody-key',
	options: { authType: 'api_key' },
} as unknown as Parameters<typeof viewer>[0];

const oauthCtx = {
	key: 'test-oauth-token',
	options: { authType: 'oauth_2' },
} as unknown as Parameters<typeof viewer>[0];

const docViewerResponse = {
	data: {
		currentUser: {
			username: 'alice',
			displayName: 'Alice',
			siteAdmin: false,
		},
	},
} satisfies ViewerResponse;

const docSearchResponse = {
	data: {
		search: {
			results: {
				matchCount: 42,
			},
		},
	},
} satisfies SearchResponse;

const docGraphqlResponse = {
	data: {
		currentUser: { username: 'alice' },
	},
} satisfies GraphqlResponse;

describe('Cody endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('viewer sends the currentUser query with token auth', async () => {
		mockRequest.mockResolvedValue(docViewerResponse);

		const result = await viewer(apiKeyCtx, {});

		expect(mockRequest).toHaveBeenCalledWith(
			'/.api/graphql',
			'test-cody-key',
			expect.objectContaining({
				method: 'POST',
				authScheme: 'token',
			}),
		);

		const body = mockRequest.mock.calls[0]?.[2]?.body as {
			query: string;
		};
		expect(body.query).toContain('currentUser');

		expect(result).toEqual(docViewerResponse);
		expect(mockLogEvent).toHaveBeenCalledWith(
			apiKeyCtx,
			'cody.viewer.get',
			{},
			'completed',
		);
	});

	it('viewer sends Bearer auth for OAuth', async () => {
		mockRequest.mockResolvedValue(docViewerResponse);

		await viewer(oauthCtx, {});

		expect(mockRequest).toHaveBeenCalledWith(
			'/.api/graphql',
			'test-oauth-token',
			expect.objectContaining({
				method: 'POST',
				authScheme: 'Bearer',
			}),
		);
	});

	it('search sends the query as a GraphQL variable', async () => {
		mockRequest.mockResolvedValue(docSearchResponse);

		const result = await search(apiKeyCtx, {
			query: 'repo:^github\\.com/sourcegraph lang:TypeScript Router',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/.api/graphql',
			'test-cody-key',
			expect.objectContaining({
				method: 'POST',
				authScheme: 'token',
			}),
		);

		const body = mockRequest.mock.calls[0]?.[2]?.body as {
			variables: { query: string };
		};
		expect(body.variables.query).toContain('Router');

		expect(result).toEqual(docSearchResponse);
		expect(mockLogEvent).toHaveBeenCalledWith(
			apiKeyCtx,
			'cody.search.get',
			{ query: 'repo:^github\\.com/sourcegraph lang:TypeScript Router' },
			'completed',
		);
	});

	it('search rejects an empty query', async () => {
		await expect(search(apiKeyCtx, { query: '' })).rejects.toThrow(ZodError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('graphql posts a raw operation with variables', async () => {
		mockRequest.mockResolvedValue(docGraphqlResponse);

		const result = await graphql(apiKeyCtx, {
			query:
				'query ($query: String!) { search(query: $query) { results { matchCount } } }',
			variables: { query: 'Router' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/.api/graphql',
			'test-cody-key',
			expect.objectContaining({ method: 'POST' }),
		);

		const body = mockRequest.mock.calls[0]?.[2]?.body as Record<
			string,
			unknown
		>;
		expect(body).toHaveProperty('variables', { query: 'Router' });

		expect(result).toEqual(docGraphqlResponse);
	});

	it('graphql omits variables when absent', async () => {
		mockRequest.mockResolvedValue(docGraphqlResponse);

		await graphql(apiKeyCtx, {
			query: 'query { currentUser { username } }',
		});

		const body = mockRequest.mock.calls[0]?.[2]?.body as Record<
			string,
			unknown
		>;
		expect(body).not.toHaveProperty('variables');
	});

	it('viewer throws Zod validation error on malformed response', async () => {
		mockRequest.mockResolvedValue({ invalid_data: true });

		await expect(viewer(apiKeyCtx, {})).rejects.toThrow(ZodError);
	});

	it('search throws Zod validation error on error-only response', async () => {
		mockRequest.mockResolvedValue({ errors: [{ message: 'boom' }] });

		await expect(search(apiKeyCtx, { query: 'Router' })).rejects.toThrow(
			ZodError,
		);
	});
});

describe('Cody output schemas', () => {
	it('viewer schema validates the documented response', () => {
		const result =
			CodyEndpointOutputSchemas.viewer.safeParse(docViewerResponse);
		expect(result.success).toBe(true);
	});

	it('viewer schema rejects response missing currentUser', () => {
		const result = CodyEndpointOutputSchemas.viewer.safeParse({
			data: {},
		});
		expect(result.success).toBe(false);
	});

	it('search schema validates the documented response', () => {
		const result =
			CodyEndpointOutputSchemas.search.safeParse(docSearchResponse);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.data.search.results.matchCount).toBe(42);
		}
	});

	it('search schema rejects response missing matchCount', () => {
		const result = CodyEndpointOutputSchemas.search.safeParse({
			data: { search: { results: {} } },
		});
		expect(result.success).toBe(false);
	});

	it('graphql schema accepts data and error shapes', () => {
		expect(
			CodyEndpointOutputSchemas.graphql.safeParse(docGraphqlResponse).success,
		).toBe(true);
		expect(
			CodyEndpointOutputSchemas.graphql.safeParse({
				errors: [{ message: 'boom' }],
			}).success,
		).toBe(true);
	});
});

describe('Cody input schemas', () => {
	it('search rejects an empty query', () => {
		const result = CodyEndpointInputSchemas.search.safeParse({ query: '' });
		expect(result.success).toBe(false);
	});

	it('graphql rejects an empty query', () => {
		const result = CodyEndpointInputSchemas.graphql.safeParse({ query: '' });
		expect(result.success).toBe(false);
	});
});

describe('Cody keyBuilder', () => {
	it('throws AuthMissingError when no api key is configured', async () => {
		const plugin = cody();
		const keyBuilder = plugin.keyBuilder;
		expect(keyBuilder).toBeDefined();
		const keyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async () => undefined },
		} as never;
		await expect(keyBuilder?.(keyCtx, 'endpoint')).rejects.toThrow(
			AuthMissingError,
		);
	});

	it('throws AuthMissingError when no OAuth token is configured', async () => {
		const plugin = cody({ authType: 'oauth_2' });
		const keyBuilder = plugin.keyBuilder;
		const keyCtx = {
			authType: 'oauth_2',
			keys: { get_access_token: async () => undefined },
		} as never;
		await expect(keyBuilder?.(keyCtx, 'endpoint')).rejects.toThrow(
			AuthMissingError,
		);
	});

	it('prefers an explicitly supplied key', async () => {
		const plugin = cody({ key: 'explicit-key' });
		const keyBuilder = plugin.keyBuilder;
		const keyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async () => 'from-store' },
		} as never;
		await expect(keyBuilder?.(keyCtx, 'endpoint')).resolves.toBe(
			'explicit-key',
		);
	});

	it('returns the stored key when present', async () => {
		const plugin = cody();
		const keyBuilder = plugin.keyBuilder;
		const keyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async () => 'stored-key' },
		} as never;
		await expect(keyBuilder?.(keyCtx, 'endpoint')).resolves.toBe('stored-key');
	});
});

describe('Cody error handlers', () => {
	it('matches RATE_LIMIT_ERROR for ApiError with status 429', async () => {
		const error = new ApiError(
			{ url: 'https://sourcegraph.com/.api/graphql', method: 'POST' },
			{
				url: 'https://sourcegraph.com/.api/graphql',
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
				ok: false,
			},
			'Rate limited',
		);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);

		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(strategy).toEqual({ maxRetries: 0 });
	});

	it('matches RATE_LIMIT_ERROR on message fallback', async () => {
		const error1 = new Error('rate_limited by server');
		const error2 = new Error('HTTP 429 Too Many Requests');

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error1)).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error2)).toBe(true);
	});

	it('matches AUTH_ERROR for ApiError with status 401', async () => {
		const error = new ApiError(
			{ url: 'https://sourcegraph.com/.api/graphql', method: 'POST' },
			{
				url: 'https://sourcegraph.com/.api/graphql',
				status: 401,
				statusText: 'Unauthorized',
				body: {},
				ok: false,
			},
			'Unauthorized',
		);

		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);

		const strategy = await errorHandlers.AUTH_ERROR.handler(error);
		expect(strategy).toEqual({ maxRetries: 0 });
	});

	it('matches AUTH_ERROR on message fallback', async () => {
		const error1 = new Error('Request was unauthorized');
		const error2 = new Error('invalid_auth credential provided');

		expect(errorHandlers.AUTH_ERROR.match(error1)).toBe(true);
		expect(errorHandlers.AUTH_ERROR.match(error2)).toBe(true);
	});

	it('DEFAULT matches all other errors', async () => {
		const error = new Error('Something generic went wrong');

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(false);
		expect(errorHandlers.DEFAULT.match(error)).toBe(true);
	});
});
