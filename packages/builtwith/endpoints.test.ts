import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { z } from 'zod';
import { BuiltWithAPIError, makeBuiltWithRequest } from './client';
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

// jest.mock above replaces these imports with jest.fn wrappers; jest.mocked exposes that without a cast.
const mockRequest = jest.mocked(request);
const mockLogEvent = jest.mocked(logEventFromContext);

type CapturedRequest = {
	url: string;
	method: string;
	headers: Record<string, string>;
};

const AnyBody = z.looseObject({});

let responseBody: object = { ok: true };

let requests: CapturedRequest[] = [];

function makeCtx(key = 'test-builtwith-key') {
	// Safe: endpoints under test read only ctx.key, and ctx.db is empty so persistence is skipped.
	// A narrower type is not practical because the full context carries DB handles that cannot be built without a real corsair instance.
	return { key, db: {} } as BuiltWithContext;
}

beforeEach(() => {
	responseBody = { ok: true };
	mockLogEvent.mockClear();
	requests = [];
	global.fetch = async (url: string | URL | Request, init?: RequestInit) => {
		const headers = Object.fromEntries(new Headers(init?.headers));

		requests.push({
			url: url instanceof Request ? url.url : String(url),
			method: init?.method ?? 'GET',
			headers,
		});

		return new Response(JSON.stringify(responseBody), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	};
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

	it('createDomainListFile normalizes zip fileName to .zip extension', async () => {
		const result = await BuiltWithEndpoints.createDomainListFile(makeCtx(), {
			domains: ['example.com'],
			format: 'zip',
			fileName: 'domains.txt',
		});

		expect(result.fileName).toBe('domains.zip');
		expect(result.format).toBe('zip');
		expect(result.encoding).toBe('base64');
		const zip = Buffer.from(result.content, 'base64');
		expect(zip.readUInt32LE(0)).toBe(0x04034b50);
		expect(zip.subarray(30, 41).toString('utf8')).toBe('domains.txt');
		expect(zip.subarray(41, 52).toString('utf8')).toBe('example.com');
	});

	it('createDomainListFile defaults to txt when format is omitted', async () => {
		// Safe: only the defaulted `format` key is missing, and the endpoint's runtime schema fills it in.
		// A narrower type is not practical because the endpoint input type is the schema output, where format is already required.
		const input = { domains: [' a.com ', 'b.com'] } as Parameters<
			typeof BuiltWithEndpoints.createDomainListFile
		>[1];
		const result = await BuiltWithEndpoints.createDomainListFile(
			makeCtx(),
			input,
		);

		expect(result.format).toBe('txt');
		expect(result.fileName).toBe('domains.txt');
		expect(result.content).toBe('a.com\nb.com');
	});

	it('datasetsLookup GETs trends/v6 with TECH and DATE', async () => {
		await BuiltWithEndpoints.datasetsLookup(makeCtx(), {
			tech: 'Shopify',
			date: '2020-01-01',
		});

		expect(requests[0]?.method).toBe('GET');
		expect(requests[0]?.url).toBe(
			'https://api.builtwith.com/trends/v6/api.json?TECH=Shopify&DATE=2020-01-01',
		);
		expect(requests[0]?.headers.authorization).toBe('API test-builtwith-key');
	});

	it('domainApiLookup GETs v26/api.json with lookup flags and date ranges', async () => {
		await BuiltWithEndpoints.domainApiLookup(makeCtx(), {
			lookup: 'example.com',
			liveonly: true,
			nopii: true,
			fdrange: '2022-01-01|2023-01-01',
		});

		expect(requests[0]?.url).toBe(
			'https://api.builtwith.com/v26/api.json?LOOKUP=example.com&LIVEONLY=yes&NOPII=yes&FDRANGE=2022-01-01%7C2023-01-01',
		);
	});

	it('financialApiLookup GETs financial1/api.json', async () => {
		await BuiltWithEndpoints.financialApiLookup(makeCtx(), {
			lookup: 'robinhood.com',
		});

		expect(requests[0]?.url).toContain('/financial1/api.json');
		expect(requests[0]?.url).toContain('LOOKUP=robinhood.com');
	});

	it('freeApiLookup GETs free1/api.json', async () => {
		responseBody = { domain: 'builtwith.com', groups: [] };
		await BuiltWithEndpoints.freeApiLookup(makeCtx(), {
			lookup: 'builtwith.com',
		});

		expect(requests[0]?.url).toContain('/free1/api.json');
		expect(requests[0]?.url).toContain('LOOKUP=builtwith.com');
	});

	it('listsApiGetList GETs lists13/api.json with the NextOffset token', async () => {
		await BuiltWithEndpoints.listsApiGetList(makeCtx(), {
			tech: 'Shopify',
			otherTechs: ['Google-Analytics', 'Meta-Pixel'],
			offset: 'oQEwEnH2FJuIzeXOEk2T',
			country: 'US',
			meta: true,
			all: true,
		});

		expect(requests[0]?.url).toBe(
			'https://api.builtwith.com/lists13/api.json?TECH=Shopify&OTHERTECHS=Google-Analytics%2CMeta-Pixel&ALL=yes&COUNTRY=US&META=yes&OFFSET=oQEwEnH2FJuIzeXOEk2T',
		);
	});

	it('listsApiGetList omits optional flags that are false', async () => {
		await BuiltWithEndpoints.listsApiGetList(makeCtx(), {
			tech: 'Magento',
			meta: false,
			all: false,
		});

		expect(requests[0]?.url).toBe(
			'https://api.builtwith.com/lists13/api.json?TECH=Magento',
		);
	});

	it('mcpApiLookup GETs mcp2/api.json with search, category and offset', async () => {
		responseBody = [];
		await BuiltWithEndpoints.mcpApiLookup(makeCtx(), {
			search: 'stripe',
			category: 'ecommerce',
			offset: 100,
		});

		expect(requests[0]?.url).toBe(
			'https://api.builtwith.com/mcp2/api.json?SEARCH=stripe&CATEGORY=ecommerce&OFFSET=100',
		);
	});

	it('productApiLookup GETs productv1/api.json', async () => {
		await BuiltWithEndpoints.productApiLookup(makeCtx(), {
			query: 'Adidas Yeezy',
			limit: 25,
			page: 2,
		});

		expect(requests[0]?.url).toBe(
			'https://api.builtwith.com/productv1/api.json?QUERY=Adidas%20Yeezy&LIMIT=25&PAGE=2',
		);
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

		expect(requests[0]?.url).toBe(
			'https://api.builtwith.com/social1/api.json?LOOKUP=https%3A%2F%2Ftwitter.com%2Fexample',
		);
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
			makeBuiltWithRequest('v23/api.json', 'test-key', AnyBody, {
				query: { LOOKUP: 'example.com' },
			}),
		).rejects.toBe(apiError);
	});

	it('parses text/json bodies into objects', async () => {
		mockRequest.mockResolvedValueOnce('{"domain":"builtwith.com","groups":[]}');

		await expect(
			makeBuiltWithRequest('free1/api.json', 'test-key', AnyBody, {
				query: { LOOKUP: 'builtwith.com' },
			}),
		).resolves.toEqual({ domain: 'builtwith.com', groups: [] });
	});

	it('throws when BuiltWith returns Errors without Results', async () => {
		mockRequest.mockResolvedValueOnce(
			'{"Errors":[{"Message":"API Credits: 0 - Used: 0 - API allocation depleted","Code":-3}]}',
		);

		// Safe: the caught value is only passed to expect matchers.
		// A narrower type is not practical because a rejected promise can carry any thrown value.
		const error = await makeBuiltWithRequest(
			'v26/api.json',
			'test-key',
			AnyBody,
			{
				query: { LOOKUP: 'builtwith.com' },
			},
		).catch((e: unknown) => e);

		expect(error).toBeInstanceOf(BuiltWithAPIError);
		expect(error).toMatchObject({
			message: 'API Credits: 0 - Used: 0 - API allocation depleted',
			code: '-3',
		});
	});

	it('keeps responses that have Results alongside per-lookup Errors', async () => {
		const body = {
			Results: [{ Lookup: 'builtwith.com' }],
			Errors: [{ Message: 'bad lookup', Code: -1 }],
		};
		mockRequest.mockResolvedValueOnce(body);

		await expect(
			makeBuiltWithRequest('v26/api.json', 'test-key', AnyBody),
		).resolves.toEqual(body);
	});
});

describe('makeBuiltWithRequest string bodies', () => {
	it('treats a bare string body as an API error', async () => {
		mockRequest.mockResolvedValueOnce(
			'"You do not have enough product credits."',
		);

		await expect(
			makeBuiltWithRequest('productv1/api.json', 'test-key', AnyBody),
		).rejects.toMatchObject({
			message: 'You do not have enough product credits.',
		});
	});
});

describe('BuiltWith input validation', () => {
	it('rejects lists input combining all with since before any request', async () => {
		await expect(
			BuiltWithEndpoints.listsApiGetList(makeCtx(), {
				tech: 'Shopify',
				all: true,
				since: '2024-01-01',
			}),
		).rejects.toThrow('all cannot be combined with since');
		expect(requests).toHaveLength(0);
	});
});

describe('BuiltWith HTTP errors', () => {
	it('surfaces 401 as an ApiError with status 401', async () => {
		global.fetch = async () =>
			new Response('{"message":"unauthorized"}', {
				status: 401,
				headers: { 'Content-Type': 'application/json' },
			});

		await expect(
			BuiltWithEndpoints.freeApiLookup(makeCtx(), { lookup: 'example.com' }),
		).rejects.toMatchObject({ status: 401 });
	});

	it('surfaces 429 with Retry-After as retryAfter milliseconds', async () => {
		global.fetch = async () =>
			new Response('{"message":"slow down"}', {
				status: 429,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '7' },
			});

		await expect(
			BuiltWithEndpoints.freeApiLookup(makeCtx(), { lookup: 'example.com' }),
		).rejects.toMatchObject({ status: 429, retryAfter: 7000 });
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
