import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	FRESHDESK_RATE_LIMIT_CONFIG,
	FreshdeskAPIError,
	makeFreshdeskRequest,
} from './client';
import { FRESHDESK_OPERATIONS } from './endpoints/operations';
import { errorHandlers } from './error-handlers';
import type { FreshdeskContext } from './index';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockedRequest = jest.mocked(request);

function buildContext(domain = 'acme.freshdesk.com'): FreshdeskContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-key',
		options: { domain },
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}

beforeEach(() => mockedRequest.mockReset());

describe('Freshdesk client', () => {
	it('uses the account-specific v2 host and API-key Basic credentials', async () => {
		mockedRequest.mockResolvedValue([]);
		await makeFreshdeskRequest(
			buildContext(),
			'test-api-key',
			FRESHDESK_OPERATIONS.listAllTicketsGetTickets,
			{ query: { page: 1, per_page: 10 } },
		);

		expect(mockedRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://acme.freshdesk.com',
				USERNAME: 'test-api-key',
				PASSWORD: 'X',
				CREDENTIALS: 'omit',
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/api/v2/tickets',
				query: { page: 1, per_page: 10 },
			}),
			expect.objectContaining({ rateLimitConfig: FRESHDESK_RATE_LIMIT_CONFIG }),
		);
	});

	it('uses multipart form-data for documented attachment routes', async () => {
		mockedRequest.mockResolvedValue({ id: 21 });
		await makeFreshdeskRequest(
			buildContext(),
			'test-api-key',
			FRESHDESK_OPERATIONS.createTicketPostTickets,
			{
				body: { email: 'private-user@freshdesk.invalid', subject: 'Help' },
				attachments: [
					{
						filename: 'report.txt',
						contentType: 'text/plain',
						base64: 'SGVsbG8=',
					},
				],
			},
		);

		const options = mockedRequest.mock.calls[0]?.[1];
		expect(options?.mediaType).toBeUndefined();
		if (!(options?.body instanceof FormData))
			throw new Error('Expected multipart body');
		expect(options.body.get('subject')).toBe('Help');
		expect(options.body.get('attachments[]')).toBeInstanceOf(Blob);
	});

	it('rejects custom CNAMEs and missing API keys before network I/O', async () => {
		await expect(
			makeFreshdeskRequest(
				buildContext('custom.support.invalid'),
				'test-api-key',
				FRESHDESK_OPERATIONS.listAllTicketsGetTickets,
				{},
			),
		).rejects.toThrow('custom CNAMEs are not supported');
		await expect(
			makeFreshdeskRequest(
				buildContext(),
				'',
				FRESHDESK_OPERATIONS.listAllTicketsGetTickets,
				{},
			),
		).rejects.toThrow(AuthMissingError);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('sanitizes PII echoed in Freshdesk error bodies', async () => {
		const providerError = new ApiError(
			{ method: 'POST', url: '/api/v2/tickets' },
			{
				url: 'https://acme.freshdesk.com/api/v2/tickets',
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body: {
					errors: [{ field: 'email', input: 'private-user@freshdesk.invalid' }],
				},
			},
			'Validation failed for private-user@freshdesk.invalid',
		);
		mockedRequest.mockRejectedValue(providerError);

		// unknown because Promise rejections do not have a guaranteed static type.
		const caught = await makeFreshdeskRequest(
			buildContext(),
			'test-api-key',
			FRESHDESK_OPERATIONS.createTicketPostTickets,
			{ body: { email: 'private-user@freshdesk.invalid' } },
		).catch((error: unknown) => error);
		expect(caught).toBeInstanceOf(FreshdeskAPIError);
		expect(caught).not.toHaveProperty('body');
		if (!(caught instanceof Error))
			throw new Error('Expected a sanitized Error');
		expect(caught.message).not.toContain('private-user@freshdesk.invalid');
	});

	it('preserves Retry-After with the real transport without hidden retries', async () => {
		const actualHttp =
			jest.requireActual<typeof import('corsair/http')>('corsair/http');
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ description: 'Limited' }), {
				status: 429,
				headers: { 'Retry-After': '4', 'Content-Type': 'application/json' },
			}),
		);
		try {
			const config = {
				BASE: 'https://acme.freshdesk.com',
				VERSION: '2',
				WITH_CREDENTIALS: false,
				CREDENTIALS: 'omit' as const,
				USERNAME: 'test-api-key',
				PASSWORD: 'X',
				HEADERS: { Accept: 'application/json' },
			};
			// unknown because the shared transport's rejection value is not statically typed.
			const failure = await actualHttp
				.request(
					config,
					{ method: 'GET', url: '/api/v2/tickets' },
					{
						rateLimitConfig: FRESHDESK_RATE_LIMIT_CONFIG,
					},
				)
				.catch((error: unknown) => error);
			expect(fetchSpy).toHaveBeenCalledTimes(1);
			const requestHeaders = new Headers(fetchSpy.mock.calls[0]?.[1]?.headers);
			expect(requestHeaders.get('Authorization')).toBe(
				`Basic ${btoa('test-api-key:X')}`,
			);
			expect(failure).toBeInstanceOf(ApiError);
			if (!(failure instanceof ApiError))
				throw new Error('Expected a transport rate-limit error');
			expect(failure.retryAfter).toBe(4000);
			const handled = new FreshdeskAPIError(
				'Rate limited',
				429,
				failure.retryAfter,
				true,
			);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(handled)).toBe(true);
			expect(await errorHandlers.RATE_LIMIT_ERROR.handler(handled)).toEqual({
				maxRetries: 2,
				headersRetryAfterMs: 4000,
			});
		} finally {
			fetchSpy.mockRestore();
		}
	});
});
