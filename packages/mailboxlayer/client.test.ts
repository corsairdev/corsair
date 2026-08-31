import type { ApiRequestOptions, ApiResult } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import {
	MAILBOXLAYER_API_BASE,
	MailboxLayerAPIError,
	makeMailboxLayerRequest,
	redactEmail,
	tryGetStoredKey,
} from './client';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

const CHECK_BODY = {
	email: 'support@apilayer.net',
	did_you_mean: '',
	user: 'support',
	domain: 'apilayer.net',
	format_valid: true,
	mx_found: true,
	smtp_check: true,
	catch_all: false,
	role: true,
	disposable: false,
	free: false,
	score: 0.8,
};

describe('redactEmail', () => {
	it('keeps the first character and domain, masks the rest', () => {
		expect(redactEmail('support@apilayer.net')).toBe('s***@apilayer.net');
	});

	it('fully redacts an address with no @', () => {
		expect(redactEmail('not-an-email')).toBe('***');
	});

	it('fully redacts an address that starts with @', () => {
		expect(redactEmail('@apilayer.net')).toBe('***');
	});
});

describe('tryGetStoredKey', () => {
	it('returns the stored key', async () => {
		await expect(tryGetStoredKey(async () => 'stored-key')).resolves.toBe(
			'stored-key',
		);
	});

	it('returns undefined when the getter yields null', async () => {
		await expect(tryGetStoredKey(async () => null)).resolves.toBeUndefined();
	});

	it('returns undefined when the account has no DEK', async () => {
		await expect(
			tryGetStoredKey(async () => {
				throw new Error(
					'No DEK found for account (tenant: "default", integration: "mailboxlayer")',
				);
			}),
		).resolves.toBeUndefined();
	});

	it('rethrows errors that are not a missing DEK', async () => {
		await expect(
			tryGetStoredKey(async () => {
				throw new Error('decryption failed');
			}),
		).rejects.toThrow('decryption failed');
	});
});

describe('makeMailboxLayerRequest', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('puts access_key in the query string and leaves TOKEN unset', async () => {
		mockRequest.mockResolvedValue(CHECK_BODY);

		await makeMailboxLayerRequest('check', 'test-access-key', {
			query: { email: 'support@apilayer.net', smtp: 1, format: 1 },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: MAILBOXLAYER_API_BASE,
				TOKEN: undefined,
			}),
			expect.objectContaining({
				method: 'GET',
				url: 'check',
				query: expect.objectContaining({
					email: 'support@apilayer.net',
					access_key: 'test-access-key',
				}),
			}),
		);
	});

	it('always uses HTTPS, even when a caller tries to pass an http-like option', async () => {
		mockRequest.mockResolvedValue(CHECK_BODY);

		await makeMailboxLayerRequest('check', 'test-access-key', {
			query: { email: 'support@apilayer.net' },
			// @ts-expect-error — useHttps is no longer a supported option; this
			// guards against it being silently reintroduced.
			useHttps: false,
		});

		const lastCall = mockRequest.mock.calls.at(-1);
		expect(new URL(lastCall?.[0].BASE ?? '').protocol).toBe('https:');
	});

	it('throws MailboxLayerAPIError with apiCode when the body is success:false', async () => {
		mockRequest.mockResolvedValue({
			success: false,
			error: {
				code: 105,
				type: 'https_access_restricted',
				info: 'Access Restricted - Your current Subscription Plan does not support HTTPS Encryption.',
			},
		});

		await expect(
			makeMailboxLayerRequest('check', 'test-access-key', {
				query: { email: 'support@apilayer.net' },
			}),
		).rejects.toMatchObject({
			constructor: MailboxLayerAPIError,
			apiCode: 105,
			apiType: 'https_access_restricted',
		});
	});

	it('throws with the error type as the message when info is missing', async () => {
		mockRequest.mockResolvedValue({
			success: false,
			error: { code: 211, type: 'format_not_valid' },
		});

		await expect(
			makeMailboxLayerRequest('check', 'test-access-key', {
				query: { email: 'not-a-valid-email' },
			}),
		).rejects.toMatchObject({
			constructor: MailboxLayerAPIError,
			message: 'format_not_valid',
			apiCode: 211,
		});
	});

	it('does not throw on a success:false body with a malformed error field', async () => {
		mockRequest.mockResolvedValue({ success: false, error: null });

		await expect(
			makeMailboxLayerRequest('check', 'test-access-key', {
				query: { email: 'support@apilayer.net' },
			}),
		).resolves.toEqual({ success: false, error: null });
	});

	it('copies status and retryAfter off a transport ApiError', async () => {
		const response = {
			url: 'https://apilayer.net/api/check',
			ok: false,
			status: 429,
			statusText: 'Too Many Requests',
			body: {},
		} satisfies ApiResult;

		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'GET', url: 'check' } satisfies ApiRequestOptions,
				response,
				'Rate limit exceeded',
				{ retryAfter: 2000 },
			),
		);

		await expect(
			makeMailboxLayerRequest('check', 'test-access-key'),
		).rejects.toMatchObject({
			status: 429,
			retryAfter: 2000,
		});
	});
});
