import { AuthMissingError } from 'corsair/core';
import type { OpenAPIConfig, RateLimitConfig } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { ENDORSAL_API_BASE, makeEndorsalRequest } from './client';
import type { EndorsalKeyBuilderContext } from './index';
import { endorsal } from './index';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

function makeApiError(status: number, retryAfter?: number): ApiError {
	return new ApiError(
		{
			method: 'POST',
			url: '/v1/contacts',
			body: { email: 'private@example.com', phone: '+14172618261' },
		},
		{
			url: `${ENDORSAL_API_BASE}/v1/contacts`,
			ok: false,
			status,
			statusText: 'Request failed',
			body: { email: 'private@example.com', message: 'Provider detail' },
		},
		'Request failed',
		retryAfter === undefined ? undefined : { retryAfter },
	);
}

beforeEach(() => {
	mockedRequest.mockReset();
});

describe('makeEndorsalRequest', () => {
	it('uses the official host and Bearer header without putting the key in TOKEN', async () => {
		mockedRequest.mockResolvedValue({ success: true });
		await makeEndorsalRequest('/v1/contacts', 'test-key', {
			method: 'POST',
			body: { email: 'jane@example.com' },
			query: { campaignID: 'campaign_123' },
		});
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			BASE: ENDORSAL_API_BASE,
			HEADERS: {
				Authorization: 'Bearer test-key',
				'Content-Type': 'application/json',
			},
		});
		expect(mockedRequest.mock.calls[0]?.[0]).not.toHaveProperty('TOKEN');
		expect(mockedRequest.mock.calls[0]?.[1]).toEqual(
			expect.objectContaining({
				method: 'POST',
				url: '/v1/contacts',
				body: { email: 'jane@example.com' },
				query: { campaignID: 'campaign_123' },
			}),
		);
	});

	it('rejects a keyless GET before transport, since Endorsal answers 401 without a key', async () => {
		await expect(
			makeEndorsalRequest('/v1/testimonials', undefined),
		).rejects.toThrow(AuthMissingError);
		await expect(makeEndorsalRequest('/v1/testimonials', '')).rejects.toThrow(
			AuthMissingError,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects write requests with a missing or empty key before transport', async () => {
		await expect(
			makeEndorsalRequest('/v1/testimonials', '', { method: 'POST' }),
		).rejects.toThrow(AuthMissingError);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('redacts PII from propagated errors while preserving status and retry metadata', async () => {
		mockedRequest.mockRejectedValue(makeApiError(429, 4000));
		// `unknown` because a rejected promise may produce any value; the checks narrow it.
		const result = await makeEndorsalRequest('/v1/contacts', 'test-key', {
			method: 'POST',
			body: { email: 'private@example.com' },
		}).catch((caught: unknown) => caught);
		expect(result).toBeInstanceOf(ApiError);
		if (!(result instanceof ApiError)) throw new Error('Expected ApiError');
		expect(result.status).toBe(429);
		expect(result.retryAfter).toBe(4000);
		expect(result.body).toEqual({ redacted: true });
		expect(result.request.body).toEqual({ redacted: true });
		expect(result.message).not.toContain('private@example.com');
	});

	it('keeps the original stack frames and drops the query and URL parameters', async () => {
		const original = new ApiError(
			{
				method: 'POST',
				url: '/v1/contacts',
				query: { campaignID: 'cmp_private' },
			},
			{
				url: `${ENDORSAL_API_BASE}/v1/contacts?campaignID=cmp_private`,
				ok: false,
				status: 500,
				statusText: 'Server Error',
				body: { message: 'private@example.com failed' },
			},
			'Server Error',
		);
		mockedRequest.mockRejectedValue(original);
		// `unknown` because a rejected promise may produce any value; the checks narrow it.
		const result = await makeEndorsalRequest('/v1/contacts', 'test-key', {
			method: 'POST',
			query: { campaignID: 'cmp_private' },
		}).catch((caught: unknown) => caught);
		if (!(result instanceof ApiError)) throw new Error('Expected ApiError');
		const frames = (stack: string | undefined) =>
			(stack ?? '').split('\n').slice(1).join('\n');
		expect(frames(result.stack)).toBe(frames(original.stack));
		expect(result.stack?.split('\n')[0]).toContain(
			'Endorsal API request failed (500)',
		);
		expect(result.request.query).toBeUndefined();
		expect(result.url).not.toContain('cmp_private');
		expect(JSON.stringify(result)).not.toContain('private@example.com');
	});

	it('keeps no line of a multi-line provider message in the stack', async () => {
		// Core puts the pretty-printed response body in the message for unmapped statuses.
		const original = new ApiError(
			{ method: 'POST', url: '/v1/contacts' },
			{
				url: `${ENDORSAL_API_BASE}/v1/contacts`,
				ok: false,
				status: 422,
				statusText: 'Unprocessable',
				body: { email: 'private@example.com' },
			},
			'HTTP 422: {\n  "email": "private@example.com",\n  "phone": "+14172618261"\n    at private-frame@example.com\n}',
		);
		mockedRequest.mockRejectedValue(original);
		// `unknown` because a rejected promise can carry any thrown value; the checks below narrow it.
		const result = await makeEndorsalRequest('/v1/contacts', 'test-key', {
			method: 'POST',
		}).catch((caught: unknown) => caught);
		if (!(result instanceof ApiError)) throw new Error('Expected ApiError');
		expect(result.stack).not.toContain('private@example.com');
		expect(result.stack).not.toContain('+14172618261');
		expect(result.stack).not.toContain('private-frame@example.com');
		expect(result.stack?.split('\n').slice(1).length).toBeGreaterThan(0);
		for (const line of result.stack?.split('\n').slice(1) ?? []) {
			expect(line).toMatch(/^\s+at /);
		}
	});

	it('marks contacts.post destructive, since campaignID enrolls the contact in emails', () => {
		const meta = endorsal().endpointMeta as Record<
			string,
			{ riskLevel: string }
		>;
		expect(meta['contacts.post']?.riskLevel).toBe('destructive');
	});

	it('configures the transport to extract Retry-After without retrying writes', async () => {
		mockedRequest.mockResolvedValue({ success: true });
		await makeEndorsalRequest('/v1/testimonials', 'test-key', {
			method: 'POST',
			body: { name: 'Jane Doe' },
		});
		expect(mockedRequest.mock.calls[0]?.[2]?.rateLimitConfig).toMatchObject({
			enabled: true,
			maxRetries: 0,
			headerNames: { retryAfter: 'retry-after' },
		});
	});

	it('extracts Retry-After from an actual transport 429 response', async () => {
		const actualHttp =
			jest.requireActual<typeof import('corsair/http')>('corsair/http');
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ message: 'rate limited' }), {
				status: 429,
				headers: { 'content-type': 'application/json', 'retry-after': '4' },
			}),
		);
		const config: OpenAPIConfig = {
			BASE: ENDORSAL_API_BASE,
			VERSION: '1.0',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit',
		};
		const rateLimitConfig: RateLimitConfig = {
			enabled: true,
			maxRetries: 0,
			initialRetryDelay: 0,
			backoffMultiplier: 1,
			headerNames: { retryAfter: 'retry-after' },
		};
		try {
			// `unknown` because the transport rejects with its declared runtime error type.
			const failure = await actualHttp
				.request(
					config,
					{ method: 'GET', url: '/v1/testimonials' },
					{ rateLimitConfig },
				)
				.catch((caught: unknown) => caught);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(failure).toBeInstanceOf(ApiError);
			if (!(failure instanceof ApiError)) throw new Error('Expected ApiError');
			expect(failure.status).toBe(429);
			expect(failure.retryAfter).toBe(4000);
		} finally {
			fetchMock.mockRestore();
		}
	});
});

describe('endorsal keyBuilder', () => {
	it('uses a saved tenant key for key-optional GET operations', async () => {
		const getApiKey = jest.fn().mockResolvedValue('saved-property-key');
		const plugin = endorsal();
		const keyBuilderContext = {
			authType: 'api_key',
			options: {},
			tenantId: 'acme',
			meteredOperationId: 'contacts.get',
			keys: {
				get_dek: async () => 'test-dek',
				issue_new_dek: async () => 'test-dek',
				get_api_key: getApiKey,
				set_api_key: async () => undefined,
				get_webhook_signature: async () => null,
				set_webhook_signature: async () => undefined,
			},
		} satisfies EndorsalKeyBuilderContext;

		await expect(
			plugin.keyBuilder?.(keyBuilderContext, 'endpoint'),
		).resolves.toBe('saved-property-key');
		expect(getApiKey).toHaveBeenCalledTimes(1);
	});

	it('raises AuthMissingError for GET operations when no saved tenant key exists', async () => {
		const plugin = endorsal();
		const keyBuilderContext = {
			authType: 'api_key',
			options: {},
			tenantId: 'acme',
			meteredOperationId: 'contacts.get',
			keys: {
				get_dek: async () => 'test-dek',
				issue_new_dek: async () => 'test-dek',
				get_api_key: async () => null,
				set_api_key: async () => undefined,
				get_webhook_signature: async () => null,
				set_webhook_signature: async () => undefined,
			},
		} satisfies EndorsalKeyBuilderContext;

		await expect(
			plugin.keyBuilder?.(keyBuilderContext, 'endpoint'),
		).rejects.toThrow(AuthMissingError);
	});
});
