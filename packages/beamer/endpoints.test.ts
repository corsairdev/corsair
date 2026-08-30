import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { Posts } from './endpoints';
import { BeamerEndpointOutputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { beamer } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

const realFetch = global.fetch;

type Captured = {
	url: string;
	headers: Record<string, string>;
};

let captured: Captured | undefined;

function headerMap(init?: RequestInit): Record<string, string> {
	const headers: Record<string, string> = {};
	const raw = init?.headers;
	if (raw instanceof Headers) {
		raw.forEach((value, key) => {
			headers[key.toLowerCase()] = value;
		});
		return headers;
	}
	for (const [key, value] of Object.entries(
		(raw ?? {}) as Record<string, string>,
	)) {
		headers[key.toLowerCase()] = value;
	}
	return headers;
}

function mockFetch(body: unknown, status = 200) {
	captured = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		captured = {
			url: String(url),
			headers: headerMap(init),
		};
		return {
			ok: status < 400,
			status,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => body,
			text: async () => JSON.stringify(body),
		};
	}) as unknown as typeof global.fetch;
}

const fullPost = {
	id: 123,
	date: '2018-12-31T00:00:00Z',
	dueDate: '2019-12-31T00:00:00Z',
	published: true,
	pinned: false,
	showInWidget: true,
	showInStandalone: true,
	category: 'new',
	boostedAnnouncement: 'snippet',
	translations: [
		{
			title: 'Test post',
			content: 'Test content',
			contentHtml: '<p>Test content</p>',
			language: 'EN',
			category: 'New',
			linkUrl: 'https://www.getbeamer.com/',
			linkText: 'Click here!',
			images: [],
		},
	],
	filter: 'admins',
	filterUrl: 'https://app.getbeamer.com/*',
	autoOpen: false,
	editionDate: '2018-12-31T10:00:00Z',
	feedbackEnabled: true,
	reactionsEnabled: true,
	views: 310,
	uniqueViews: 250,
	clicks: 120,
	feedbacks: 55,
	positiveReactions: 12,
	neutralReactions: 5,
	negativeReactions: 10,
};

afterEach(() => {
	global.fetch = realFetch;
	mockLogEvent.mockClear();
});

describe('Beamer posts endpoint', () => {
	it('gets posts with Beamer pagination and API key', async () => {
		mockFetch([fullPost]);

		const ctx = {
			key: 'test-api-key',
		} as Parameters<typeof Posts.get>[0];

		const result = await Posts.get(ctx, {
			page: 1,
			maxResults: 10,
		});

		const url = new URL(captured?.url ?? '');

		expect(url.pathname).toBe('/v0/posts');
		expect(url.searchParams.get('page')).toBe('1');
		expect(url.searchParams.get('maxResults')).toBe('10');
		expect(url.searchParams.get('limit')).toBeNull();
		expect(url.searchParams.get('saveViews')).toBe('false');
		expect(url.searchParams.get('ignoreRequestDetails')).toBe('true');
		expect(captured?.headers['beamer-api-key']).toBe('test-api-key');
		expect(result).toEqual([fullPost]);
		expect(BeamerEndpointOutputSchemas.postsGet.parse(result)).toEqual([
			fullPost,
		]);

		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'beamer.posts.get',
			{
				page: 1,
				maxResults: 10,
			},
			'completed',
		);
	});

	it('parses sparse Beamer posts and string/array link fields', async () => {
		mockFetch([
			{
				id: '123',
				date: '2018-12-31T00:00:00Z',
				published: 'true',
				translations: [
					{
						title: 'Sparse',
						content: 'Body',
						contentHtml: '<p>Body</p>',
						language: 'EN',
						linkUrl: ['https://www.getbeamer.com/'],
						linkText: ['Click'],
					},
				],
			},
		]);

		const result = await Posts.get(
			{ key: 'test-api-key' } as Parameters<typeof Posts.get>[0],
			{},
		);

		expect(result[0]?.id).toBe(123);
		expect(result[0]?.published).toBe(true);
		expect(result[0]?.translations?.[0]?.linkUrl).toEqual([
			'https://www.getbeamer.com/',
		]);
	});

	it('rejects invalid output payloads', async () => {
		mockFetch([{ published: true }]);

		await expect(
			Posts.get({ key: 'test-api-key' } as Parameters<typeof Posts.get>[0], {}),
		).rejects.toThrow();
	});

	it('rejects empty or whitespace API keys before calling Beamer', async () => {
		let attempts = 0;
		global.fetch = (async () => {
			attempts += 1;
			throw new Error('should not fetch');
		}) as unknown as typeof global.fetch;

		await expect(
			Posts.get({ key: '' } as Parameters<typeof Posts.get>[0], {}),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			Posts.get({ key: '   ' } as Parameters<typeof Posts.get>[0], {}),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(attempts).toBe(0);
	});
});

describe('Beamer plugin auth', () => {
	it('is API-key only', () => {
		const plugin = beamer({ key: 'test-api-key' });
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['tenant_external_id'] },
		});
		expect(plugin.authConfig).not.toHaveProperty('oauth_2');
	});
});

describe('Beamer error handlers', () => {
	it('does not retry monthly quota 429s', async () => {
		const err = new ApiError(
			{ method: 'GET', url: 'https://api.getbeamer.com/v0/posts' },
			{
				url: 'https://api.getbeamer.com/v0/posts',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: undefined,
			},
			'Too many requests',
			{ retryAfter: 1000 },
		);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
		const res = await errorHandlers.RATE_LIMIT_ERROR.handler(err);
		expect(res.maxRetries).toBe(0);
		expect(res.headersRetryAfterMs).toBe(1000);
	});

	it('does not retry 403s', async () => {
		const err = new ApiError(
			{ method: 'GET', url: 'https://api.getbeamer.com/v0/posts' },
			{
				url: 'https://api.getbeamer.com/v0/posts',
				ok: false,
				status: 403,
				statusText: 'Forbidden',
				body: undefined,
			},
			'Forbidden',
		);
		expect(errorHandlers.PERMISSION_ERROR.match(err)).toBe(true);
		const res = await errorHandlers.PERMISSION_ERROR.handler();
		expect(res.maxRetries).toBe(0);
	});

	it('retries 5xx with exponential backoff', async () => {
		const err = new ApiError(
			{ method: 'GET', url: 'https://api.getbeamer.com/v0/posts' },
			{
				url: 'https://api.getbeamer.com/v0/posts',
				ok: false,
				status: 500,
				statusText: 'Internal Server Error',
				body: undefined,
			},
			'Internal server error',
		);
		expect(errorHandlers.SERVER_ERROR.match(err)).toBe(true);
		const res = await errorHandlers.SERVER_ERROR.handler();
		expect(res).toEqual({
			maxRetries: 2,
			retryStrategy: 'exponential_backoff',
		});
	});
});
