import { logEventFromContext } from 'corsair/core';
import { makeConfluenceRequest } from './client';
import { Pages, Spaces } from './endpoints';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('./client', () => ({
	makeConfluenceRequest: jest.fn(),
}));

const mockRequest = jest.mocked(makeConfluenceRequest);
const mockLog = jest.mocked(logEventFromContext);

type AnyEndpoint = (ctx: unknown, input: unknown) => Promise<unknown>;

// Schema-valid mock responses so output .parse() succeeds.
const spacesResponse = {
	results: [{ key: 'ENG', name: 'Engineering' }],
};
const pagesResponse = {
	results: [{ id: 'p1', title: 'Hello' }],
};
const searchResponse = {
	results: [
		{ content: { id: 'c1', type: 'page', title: 'Hello' }, title: 'Hello' },
	],
	start: 0,
	limit: 25,
	size: 1,
};

function createContext(overrides: Record<string, unknown> = {}) {
	return {
		key: 'user@example.com:test-token',
		options: {
			cloudUrl: 'https://test.atlassian.net',
			authType: 'api_key' as const,
		},
		keys: {
			get_cloud_url: jest.fn().mockResolvedValue(null),
			get_cloud_id: jest.fn().mockResolvedValue(null),
		},
		...overrides,
	};
}

describe('Confluence endpoint routing', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// One row per implemented endpoint (R2: every endpoint has a test).
	const cases: Array<{
		name: string;
		fn: AnyEndpoint;
		input: Record<string, unknown>;
		path: string;
		method: string;
		base?: string;
		response?: unknown;
	}> = [
		{
			name: 'spaces.list',
			fn: Spaces.list as AnyEndpoint,
			input: { limit: 10 },
			path: 'spaces',
			method: 'GET',
			base: '/wiki/api/v2',
			response: spacesResponse,
		},
		{
			name: 'pages.get',
			fn: Pages.get as AnyEndpoint,
			input: { limit: 25 },
			path: 'pages',
			method: 'GET',
			base: '/wiki/api/v2',
			response: pagesResponse,
		},
		{
			name: 'pages.search',
			fn: Pages.search as AnyEndpoint,
			input: { cql: 'type = "page"' },
			path: 'search',
			method: 'GET',
			response: searchResponse,
		},
	];

	it.each(cases)('$name calls $method $path', async (c) => {
		mockRequest.mockResolvedValue(c.response ?? {});
		const ctx = createContext();

		await c.fn(ctx, c.input);

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [path, key, cloudUrl, options] = mockRequest.mock.calls[0]!;
		expect(path).toBe(c.path);
		expect(key).toBe('user@example.com:test-token');
		expect(cloudUrl).toBe('https://test.atlassian.net');
		expect(options?.method ?? 'GET').toBe(c.method);
		if (c.base) {
			expect(options?.base).toBe(c.base);
		} else {
			expect(options?.base).toBeUndefined();
		}
	});

	it('spaces.list forwards filters as query params', async () => {
		mockRequest.mockResolvedValue(spacesResponse);
		const ctx = createContext();

		await (Spaces.list as AnyEndpoint)(ctx, {
			key: 'ENG',
			type: 'global',
			status: 'current',
			label: 'documentation',
			cursor: 'next-page',
			limit: 50,
		});

		const [, , , options] = mockRequest.mock.calls[0]!;
		expect(options?.query).toMatchObject({
			keys: 'ENG',
			type: 'global',
			status: 'current',
			labels: 'documentation',
			cursor: 'next-page',
			limit: 50,
		});
		expect(options?.base).toBe('/wiki/api/v2');
	});

	it('pages.get uses the v2 base path', async () => {
		mockRequest.mockResolvedValue(pagesResponse);
		const ctx = createContext();

		await (Pages.get as AnyEndpoint)(ctx, { limit: 10 });

		const [, , , options] = mockRequest.mock.calls[0]!;
		expect(options?.base).toBe('/wiki/api/v2');
	});

	it('pages.get forwards space-id (snake-to-kebab) and cursor', async () => {
		mockRequest.mockResolvedValue(pagesResponse);
		const ctx = createContext();

		await (Pages.get as AnyEndpoint)(ctx, {
			space_id: '123',
			cursor: 'abc',
			status: 'current',
		});

		const [, , , options] = mockRequest.mock.calls[0]!;
		expect(options?.query).toMatchObject({
			'space-id': '123',
			cursor: 'abc',
			status: 'current',
		});
	});

	it('pages.search forwards cql and pagination', async () => {
		mockRequest.mockResolvedValue(searchResponse);
		const ctx = createContext();

		await (Pages.search as AnyEndpoint)(ctx, {
			cql: 'type = "page" AND space = "ENG"',
			limit: 25,
			start: 0,
			includeArchivedSpaces: false,
		});

		const [, , , options] = mockRequest.mock.calls[0]!;
		expect(options?.query).toMatchObject({
			cql: 'type = "page" AND space = "ENG"',
			limit: 25,
			start: 0,
			includeArchivedSpaces: false,
		});
	});

	it('falls back to ctx.keys.get_cloud_url() when options.cloudUrl is unset', async () => {
		mockRequest.mockResolvedValue(spacesResponse);
		const ctx = createContext({
			options: { authType: 'api_key' },
			keys: {
				get_cloud_url: jest
					.fn()
					.mockResolvedValue('https://fallback.atlassian.net'),
			},
		});

		await (Spaces.list as AnyEndpoint)(ctx, { limit: 1 });

		const [, , cloudUrl] = mockRequest.mock.calls[0]!;
		expect(cloudUrl).toBe('https://fallback.atlassian.net');
	});

	it('propagates authType through to the request', async () => {
		mockRequest.mockResolvedValue(spacesResponse);
		const ctx = createContext({
			options: {
				cloudUrl: 'https://test.atlassian.net',
				authType: 'oauth_2',
			},
		});

		await (Spaces.list as AnyEndpoint)(ctx, {});

		const [, , , options] = mockRequest.mock.calls[0]!;
		expect(options?.authType).toBe('oauth_2');
	});

	it('passes the resolved cloud ID to OAuth requests', async () => {
		mockRequest.mockResolvedValue(spacesResponse);
		const ctx = createContext({
			options: {
				authType: 'oauth_2',
			},
			keys: {
				get_cloud_url: jest
					.fn()
					.mockResolvedValue('https://test.atlassian.net'),
				get_cloud_id: jest.fn().mockResolvedValue('cloud-123'),
			},
		});

		await (Spaces.list as AnyEndpoint)(ctx, {});

		const [, , cloudUrl, options] = mockRequest.mock.calls[0]!;
		expect(cloudUrl).toBe('https://test.atlassian.net');
		expect(options?.cloudId).toBe('cloud-123');
	});

	it('logs a completed event after a successful call', async () => {
		mockRequest.mockResolvedValue(pagesResponse);
		const ctx = createContext();

		await (Pages.get as AnyEndpoint)(ctx, { limit: 5 });

		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'confluence.pages.get',
			expect.any(Object),
			'completed',
		);
	});

	it('parses the response through the output schema', async () => {
		mockRequest.mockResolvedValue(pagesResponse);
		const ctx = createContext();

		const result = (await (Pages.get as AnyEndpoint)(ctx, { limit: 1 })) as {
			results: Array<{ id: string }>;
		};

		expect(result.results).toBeDefined();
		expect(result.results[0]?.id).toBe('p1');
	});
});
