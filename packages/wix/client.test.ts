import type { ApiRequestOptions, ApiResult, OpenAPIConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { makeWixRequest, WIX_API_BASE, WixAPIError } from './client';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

function apiError(status: number, retryAfter?: number): ApiError {
	const req: ApiRequestOptions = { method: 'GET', url: '/test' };
	const res: ApiResult = {
		url: `${WIX_API_BASE}/test`,
		ok: false,
		status,
		statusText: 'error',
		body: { message: 'error' },
	};
	return new ApiError(
		req,
		res,
		`Request failed with status ${status}`,
		retryAfter !== undefined ? { retryAfter } : undefined,
	);
}

describe('makeWixRequest plumbing', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('passes base, raw api-key auth header, and no-retry config for POST through', async () => {
		await makeWixRequest('/contacts/v4/contacts/query', 'tok', {
			method: 'POST',
			body: { query: {} },
			siteId: 'site-1',
			authType: 'api_key',
		});

		expect(mockRequest).toHaveBeenCalledTimes(1);
		const [config, options, extra] = mockRequest.mock.calls[0] as [
			{
				BASE: string;
				TOKEN?: string;
				HEADERS: Record<string, string>;
			},
			{ method: string; url: string; mediaType: string },
			{
				rateLimitConfig: {
					enabled: boolean;
					maxRetries: number;
					headerNames: { retryAfter: string };
				};
			},
		];
		expect(config.BASE).toBe(WIX_API_BASE);
		expect(config.TOKEN).toBeUndefined();
		expect(config.HEADERS.Authorization).toBe('tok');
		expect(config.HEADERS['wix-site-id']).toBe('site-1');
		expect(options.method).toBe('POST');
		expect(options.url).toBe('/contacts/v4/contacts/query');
		expect(options.mediaType).toBe('application/json; charset=utf-8');
		// POST writes are not idempotent: 429s must surface, not auto-retry.
		expect(extra.rateLimitConfig.enabled).toBe(false);
		expect(extra.rateLimitConfig.maxRetries).toBe(0);
		expect(extra.rateLimitConfig.headerNames.retryAfter).toBe('Retry-After');
	});

	it('formats oauth_2 credentials as Bearer and retries safe GETs', async () => {
		await makeWixRequest('/contacts/v4/contacts', 'tok', {
			query: { limit: 5 },
		});

		const [config, , extra] = mockRequest.mock.calls[0] as [
			{ HEADERS: Record<string, string> },
			unknown,
			{ rateLimitConfig: { enabled: boolean; maxRetries: number } },
		];
		expect(config.HEADERS.Authorization).toBe('Bearer tok');
		expect(extra.rateLimitConfig.enabled).toBe(true);
		expect(extra.rateLimitConfig.maxRetries).toBe(3);
	});

	it('sends query on GET and body on POST', async () => {
		await makeWixRequest('/contacts/v4/contacts', 'tok', {
			query: { limit: 5 },
		});
		const [, getOptions] = mockRequest.mock.calls[0] as [
			unknown,
			{ body?: unknown; query?: unknown },
		];
		expect(getOptions.query).toEqual({ limit: 5 });
		expect(getOptions.body).toBeUndefined();

		mockRequest.mockClear();
		await makeWixRequest('/contacts/v4/contacts/query', 'tok', {
			method: 'POST',
			body: { query: {} },
		});
		const [, postOptions] = mockRequest.mock.calls[0] as [
			unknown,
			{ body?: unknown; query?: unknown },
		];
		expect(postOptions.body).toEqual({ query: {} });
		expect(postOptions.query).toBeUndefined();
	});

	it('merges custom headers without dropping auth', async () => {
		await makeWixRequest('/apps/v1/instance', 'tok', {
			headers: { 'X-Custom': 'yes' },
			authType: 'api_key',
		});
		const [config] = mockRequest.mock.calls[0] as [
			{ HEADERS: Record<string, string> },
		];
		expect(config.HEADERS['X-Custom']).toBe('yes');
		expect(config.HEADERS.Authorization).toBe('tok');
	});

	it.each([
		['Authorization', 'forged'],
		['authorization', 'forged'],
		['AUTHORIZATION', 'forged'],
	])(
		'never lets a custom %s header replace the Wix token',
		async (header, value) => {
			await makeWixRequest('/apps/v1/instance', 'tok', {
				headers: { [header]: value },
				authType: 'api_key',
			});
			const [config] = mockRequest.mock.calls[0] as [
				{ HEADERS: Record<string, string> },
			];
			expect(config.HEADERS.Authorization).toBe('tok');
		},
	);

	it.each([['wix-site-id'], ['WIX-SITE-ID'], ['Wix-Site-Id']])(
		'never lets a custom %s header corrupt the site scope',
		async (header) => {
			await makeWixRequest('/apps/v1/instance', 'tok', {
				headers: { [header]: 'forged' },
				siteId: 'site-1',
			});
			const [config] = mockRequest.mock.calls[0] as [
				{ HEADERS: Record<string, string> },
			];
			expect(config.HEADERS['wix-site-id']).toBe('site-1');
			expect(Object.values(config.HEADERS)).not.toContain('forged');
		},
	);

	it.each([['wix-account-id'], ['WIX-ACCOUNT-ID'], ['Wix-Account-Id']])(
		'never lets a custom %s header corrupt the account scope',
		async (header) => {
			await makeWixRequest('/apps/v1/instance', 'tok', {
				headers: { [header]: 'forged' },
				accountId: 'account-1',
			});
			const [config] = mockRequest.mock.calls[0] as [
				{ HEADERS: Record<string, string> },
			];
			expect(config.HEADERS['wix-account-id']).toBe('account-1');
			expect(Object.values(config.HEADERS)).not.toContain('forged');
		},
	);

	it('rejects requests that set both siteId and accountId', async () => {
		await expect(
			makeWixRequest('/site-properties/v4/properties', 'tok', {
				siteId: 'site-1',
				accountId: 'account-1',
			}),
		).rejects.toThrow('mutually exclusive');
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('sends query parameters for DELETE requests', async () => {
		await makeWixRequest('/loyalty/v1/coupons/coupon-1', 'tok', {
			method: 'DELETE',
			query: { revision: 3 },
		});
		const [, options] = mockRequest.mock.calls[0] as [
			unknown,
			{ method: string; query?: unknown },
		];
		expect(options.method).toBe('DELETE');
		expect(options.query).toEqual({ revision: 3 });
	});

	it('rejects non-allowlisted hosts before sending', async () => {
		await expect(
			makeWixRequest('/x', 'tok', { baseUrl: 'https://evil.example.com' }),
		).rejects.toBeInstanceOf(WixAPIError);
		await expect(
			makeWixRequest('/x', 'tok', { baseUrl: 'http://www.wixapis.com' }),
		).rejects.toBeInstanceOf(WixAPIError);
		await expect(
			makeWixRequest('/x', 'tok', { baseUrl: 'not-a-url' }),
		).rejects.toBeInstanceOf(WixAPIError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('wraps ApiError with status and body preserved', async () => {
		mockRequest.mockRejectedValueOnce(apiError(429, 2000));
		const failure = await makeWixRequest('/x', 'tok', {}).then(
			() => null,
			(error: unknown) => error,
		);
		expect(failure).toBeInstanceOf(WixAPIError);
		expect((failure as WixAPIError).status).toBe(429);
		expect((failure as Error).message).toContain('429');
	});

	it('wraps plain errors by message and unknowns generically', async () => {
		mockRequest.mockRejectedValueOnce(new Error('boom'));
		await expect(makeWixRequest('/x', 'tok', {})).rejects.toThrow('boom');

		mockRequest.mockRejectedValueOnce('a string failure');
		await expect(makeWixRequest('/x', 'tok', {})).rejects.toThrow(
			'Unknown error',
		);
	});
});

describe('makeWixRequest transport', () => {
	type CapturedFetch = {
		url: string;
		method: string;
		headers: Record<string, string>;
		body: string | undefined;
	};

	let captured: CapturedFetch | undefined;
	const realFetch = global.fetch;
	const { request: liveRequest } = jest.requireActual('corsair/http') as {
		request: (
			...args: [OpenAPIConfig, ApiRequestOptions, ...unknown[]]
		) => Promise<unknown>;
	};

	function mockFetch(payload: unknown, status = 200) {
		captured = undefined;
		global.fetch = (async (url: unknown, init?: RequestInit) => {
			const headers: Record<string, string> = {};
			const raw = init?.headers;
			if (raw instanceof Headers) {
				raw.forEach((value, key) => {
					headers[key.toLowerCase()] = value;
				});
			} else if (raw && typeof raw === 'object') {
				for (const [key, value] of Object.entries(raw)) {
					headers[key.toLowerCase()] = String(value);
				}
			}
			captured = {
				url: String(url),
				method: init?.method ?? 'GET',
				headers,
				body:
					typeof init?.body === 'string'
						? init.body
						: init?.body === undefined || init?.body === null
							? undefined
							: String(init.body),
			};
			return {
				ok: status < 400,
				status,
				statusText: status < 400 ? 'OK' : 'Error',
				url: String(url),
				headers: new Headers({ 'Content-Type': 'application/json' }),
				json: async () => payload,
				text: async () => JSON.stringify(payload),
			};
		}) as unknown as typeof global.fetch;
	}

	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockImplementation(
			(...args: [OpenAPIConfig, ApiRequestOptions, ...unknown[]]) =>
				liveRequest(...args),
		);
	});

	afterEach(() => {
		global.fetch = realFetch;
		mockRequest.mockReset();
	});

	it('hits www.wixapis.com with the raw api-key token (no Bearer prefix)', async () => {
		mockFetch({ contacts: [] });

		const result = await makeWixRequest<{ contacts: unknown[] }>(
			'/contacts/v4/contacts/query',
			'tok',
			{
				method: 'POST',
				body: { query: { paging: { limit: 1 } } },
				authType: 'api_key',
			},
		);

		expect(captured?.url).toBe(`${WIX_API_BASE}/contacts/v4/contacts/query`);
		expect(captured?.headers.authorization).toBe('tok');
		expect(captured?.method).toBe('POST');
		expect(JSON.parse(captured?.body ?? '{}')).toEqual({
			query: { paging: { limit: 1 } },
		});
		expect(result).toEqual({ contacts: [] });
	});

	it('hits www.wixapis.com with Bearer for oauth_2 (default)', async () => {
		mockFetch({ contacts: [] });

		await makeWixRequest<{ contacts: unknown[] }>(
			'/contacts/v4/contacts/query',
			'tok',
			{ method: 'POST', body: { query: { paging: { limit: 1 } } } },
		);

		expect(captured?.headers.authorization).toBe('Bearer tok');
	});

	it('sends wix-site-id for site-level API key calls', async () => {
		mockFetch({ siteId: 's' });

		await makeWixRequest('/site-properties/v4/properties', 'tok', {
			siteId: 'site-1',
		});

		expect(captured?.headers['wix-site-id']).toBe('site-1');
		expect(captured?.headers['wix-account-id']).toBeUndefined();
	});

	it('sends wix-account-id for account-level API key calls', async () => {
		mockFetch({});

		await makeWixRequest('/site-folders/v1/folders/query', 'tok', {
			method: 'POST',
			body: { query: {} },
			accountId: 'account-1',
		});

		expect(captured?.headers['wix-account-id']).toBe('account-1');
		expect(captured?.headers['wix-site-id']).toBeUndefined();
	});

	it('surfaces 401 responses as WixAPIError with status', async () => {
		mockFetch({ message: 'Unauthorized' }, 401);

		const failure = await makeWixRequest(
			'/apps/v1/instance',
			'expired',
			{},
		).then(
			() => null,
			(error: unknown) => error,
		);

		expect(failure).toBeInstanceOf(WixAPIError);
		expect((failure as WixAPIError).status).toBe(401);
	});
});
