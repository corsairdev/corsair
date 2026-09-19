import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { makeBuiltWithRequest } from './client';
import { BuiltWithEndpoints } from './endpoints';
import { errorHandlers } from './error-handlers';
import type { BuiltWithContext } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(original.request),
	};
});

const mockRequest = request as jest.MockedFunction<typeof request>;

const mockLogEvent = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

type CapturedRequest = {
	url: string;
	method: string;
	headers: Record<string, string>;
};

const RESPONSE_BODY = { ok: true };

let requests: CapturedRequest[] = [];

function makeCtx(key = 'test-builtwith-key') {
	return { key } as unknown as BuiltWithContext;
}

beforeEach(() => {
	mockLogEvent.mockClear();
	mockRequest.mockImplementation(
		jest.requireActual('corsair/http').request as typeof request,
	);
	requests = [];
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		const headers: Record<string, string> = {};
		const raw = init?.headers;
		if (raw instanceof Headers) {
			raw.forEach((value, key) => {
				headers[key.toLowerCase()] = value;
			});
		} else {
			for (const [key, value] of Object.entries(
				(raw ?? {}) as Record<string, string>,
			)) {
				headers[key.toLowerCase()] = String(value);
			}
		}

		requests.push({
			url: String(url),
			method: init?.method ?? 'GET',
			headers,
		});

		return {
			ok: true,
			status: 200,
			statusText: 'OK',
			url: String(url),
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => RESPONSE_BODY,
			text: async () => JSON.stringify(RESPONSE_BODY),
		};
	}) as unknown as typeof global.fetch;
});

describe('BuiltWith endpoints', () => {
	it('createDomainListFile deduplicates domains and returns txt content', async () => {
		const result = await BuiltWithEndpoints.createDomainListFile(makeCtx(), {
			domains: ['example.com', 'test.org', 'example.com'],
			format: 'txt',
		});

		expect(requests).toHaveLength(0);
		expect(result.domainCount).toBe(2);
		expect(result.domains).toEqual(['example.com', 'test.org']);
		expect(result.content).toBe('example.com\ntest.org');
		expect(result.encoding).toBe('utf8');
	});

	it('datasetsLookup GETs trends/v6 with TECH query param', async () => {
		await BuiltWithEndpoints.datasetsLookup(makeCtx(), {
			lookup: 'Shopify',
		});

		expect(requests[0]?.method).toBe('GET');
		expect(requests[0]?.url).toContain('/trends/v6/api.json');
		expect(requests[0]?.url).toContain('TECH=Shopify');
		expect(requests[0]?.headers.authorization).toBe('API test-builtwith-key');
	});

	it('domainApiLookup GETs v23/api.json with lookup flags', async () => {
		await BuiltWithEndpoints.domainApiLookup(makeCtx(), {
			lookup: 'example.com',
			liveonly: true,
			nopii: true,
		});

		expect(requests[0]?.url).toContain('/v23/api.json');
		expect(requests[0]?.url).toContain('LOOKUP=example.com');
		expect(requests[0]?.url).toContain('LIVEONLY=yes');
		expect(requests[0]?.url).toContain('NOPII=yes');
	});

	it('financialApiLookup GETs financial1/api.json', async () => {
		await BuiltWithEndpoints.financialApiLookup(makeCtx(), {
			lookup: 'robinhood.com',
		});

		expect(requests[0]?.url).toContain('/financial1/api.json');
		expect(requests[0]?.url).toContain('LOOKUP=robinhood.com');
	});

	it('freeApiLookup GETs free1/api.json', async () => {
		await BuiltWithEndpoints.freeApiLookup(makeCtx(), {
			lookup: 'builtwith.com',
		});

		expect(requests[0]?.url).toContain('/free1/api.json');
		expect(requests[0]?.url).toContain('LOOKUP=builtwith.com');
	});

	it('listsApiGetList GETs lists12/api.json with pagination filters', async () => {
		await BuiltWithEndpoints.listsApiGetList(makeCtx(), {
			tech: 'Shopify',
			offset: 100,
			country: 'US',
		});

		expect(requests[0]?.url).toContain('/lists12/api.json');
		expect(requests[0]?.url).toContain('TECH=Shopify');
		expect(requests[0]?.url).toContain('OFFSET=100');
		expect(requests[0]?.url).toContain('COUNTRY=US');
	});

	it('mcpApiLookup GETs mcp2/api.json', async () => {
		await BuiltWithEndpoints.mcpApiLookup(makeCtx(), {
			domain: 'example.com',
		});

		expect(requests[0]?.url).toContain('/mcp2/api.json');
		expect(requests[0]?.url).toContain('SEARCH=example.com');
	});

	it('productApiLookup GETs productv1/api.json', async () => {
		await BuiltWithEndpoints.productApiLookup(makeCtx(), {
			query: 'Adidas Yeezy',
			limit: 25,
			page: 2,
		});

		expect(requests[0]?.url).toContain('/productv1/api.json');
		expect(requests[0]?.url).toContain('QUERY=Adidas');
		expect(requests[0]?.url).toContain('LIMIT=25');
		expect(requests[0]?.url).toContain('PAGE=2');
	});

	it('recommendationsApiLookup GETs rec1/api.json', async () => {
		await BuiltWithEndpoints.recommendationsApiLookup(makeCtx(), {
			lookup: 'example.com',
		});

		expect(requests[0]?.url).toContain('/rec1/api.json');
		expect(requests[0]?.url).toContain('LOOKUP=example.com');
	});

	it('redirectsApiLookup GETs redirect1/api.json', async () => {
		await BuiltWithEndpoints.redirectsApiLookup(makeCtx(), {
			lookup: 'example.com',
		});

		expect(requests[0]?.url).toContain('/redirect1/api.json');
		expect(requests[0]?.url).toContain('LOOKUP=example.com');
	});

	it('socialApiLookup GETs social1/api.json', async () => {
		await BuiltWithEndpoints.socialApiLookup(makeCtx(), {
			lookup: 'https://twitter.com/example',
		});

		expect(requests[0]?.url).toContain('/social1/api.json');
		expect(requests[0]?.url).toContain('LOOKUP=');
	});
});

describe('makeBuiltWithRequest', () => {
	it('preserves ApiError metadata for rate-limit handling', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: 'v23/api.json' },
			{
				url: 'https://api.builtwith.com/v23/api.json',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { message: 'rate limited' },
			},
			'rate limited',
			{ retryAfter: 30_000 },
		);

		mockRequest.mockRejectedValueOnce(apiError);

		await expect(
			makeBuiltWithRequest('v23/api.json', 'test-key', {
				query: { LOOKUP: 'example.com' },
			}),
		).rejects.toBe(apiError);
	});
});

describe('BuiltWith error handlers', () => {
	it('reads retryAfter from ApiError on 429 responses', async () => {
		const error = new ApiError(
			{ method: 'GET', url: 'v23/api.json' },
			{
				url: 'https://api.builtwith.com/v23/api.json',
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: {},
			},
			'Too Many Requests',
			{ retryAfter: 12_000 },
		);

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({
			maxRetries: 5,
			headersRetryAfterMs: 12_000,
		});
	});
});
