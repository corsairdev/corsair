import crypto from 'node:crypto';
import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	makeWisepopsRequest,
	WISEPOPS_API_BASE,
	WisepopsAPIError,
} from './client';
import { Contacts, DataPrivacy, Performance, Webhooks } from './endpoints';
import { errorHandlers } from './error-handlers';
import { WisepopsSchema } from './schema';
import {
	verifyWisepopsWebhookSignature,
	WisepopsWebhookPayloadSchema,
} from './webhooks';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return {
		...actual,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;
const mockLogEvent = logEventFromContext as jest.Mock;

function createMockContext(apiKey = 'test-api-key') {
	return {
		key: apiKey,
		pluginId: 'wisepops',
		authType: 'api_key' as const,
		options: {},
		schema: WisepopsSchema,
	} as any;
}

describe('Wisepops API & Endpoints Unit Tests', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('DELETE Request Serialization & Selectors', () => {
		it('preserves body selector on dataPrivacyDelete request', async () => {
			mockRequest.mockResolvedValueOnce({ deleted: 1 });
			const ctx = createMockContext();

			const result = await DataPrivacy.deleteData(ctx, {
				email: 'user@example.com',
			});

			expect(result).toEqual({ deleted: 1 });
			expect(mockRequest).toHaveBeenCalledTimes(1);
			const [config, requestOptions] = mockRequest.mock.calls[0];

			expect(requestOptions.method).toBe('DELETE');
			expect(requestOptions.url).toBe('api2/data-privacy');
			expect(requestOptions.body).toEqual({ email: 'user@example.com' });
			expect(requestOptions.mediaType).toBe('application/json; charset=utf-8');

			// Verify authentication is passed in Authorization header, never in URL
			expect(config.BASE).toBe(WISEPOPS_API_BASE);
			expect(config.TOKEN).toBeUndefined();
			expect(config.HEADERS.Authorization).toBe(
				'WISEPOPS-API key="test-api-key"',
			);
			expect(requestOptions.url).not.toContain('test-api-key');
		});

		it('preserves phone selector on dataPrivacyDelete request', async () => {
			mockRequest.mockResolvedValueOnce({ deleted: 2 });
			const ctx = createMockContext();

			const result = await DataPrivacy.deleteData(ctx, {
				phone: '+1234567890',
			});

			expect(result).toEqual({ deleted: 2 });
			const [, requestOptions] = mockRequest.mock.calls[0];
			expect(requestOptions.method).toBe('DELETE');
			expect(requestOptions.body).toEqual({ phone: '+1234567890' });
		});

		it('preserves query selector on webhookDelete request', async () => {
			mockRequest.mockResolvedValueOnce({ success: true });
			const ctx = createMockContext();

			const result = await Webhooks.deleteWebhook(ctx, { hook_id: 42 });

			expect(result).toEqual({ success: true });
			expect(mockRequest).toHaveBeenCalledTimes(1);
			const [config, requestOptions] = mockRequest.mock.calls[0];

			expect(requestOptions.method).toBe('DELETE');
			expect(requestOptions.url).toBe('api2/hooks');
			expect(requestOptions.query).toEqual({ hook_id: 42 });
			expect(config.HEADERS.Authorization).toBe(
				'WISEPOPS-API key="test-api-key"',
			);
		});

		it('rejects empty selector on dataPrivacyDelete before outbound request', async () => {
			const ctx = createMockContext();

			await expect(DataPrivacy.deleteData(ctx, {} as any)).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
			expect(mockLogEvent).not.toHaveBeenCalled();
		});

		it('rejects invalid phone format on dataPrivacyDelete before outbound request', async () => {
			const ctx = createMockContext();

			await expect(
				DataPrivacy.deleteData(ctx, { phone: '12345' }),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('rejects invalid/missing hook_id on webhookDelete before outbound request', async () => {
			const ctx = createMockContext();

			await expect(Webhooks.deleteWebhook(ctx, {} as any)).rejects.toThrow();
			await expect(
				Webhooks.deleteWebhook(ctx, { hook_id: -1 }),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});
	});

	describe('Rate Limit & Retry-After Propagation', () => {
		function createRateLimitError(retryAfterMs = 4000) {
			const reqOptions = {
				method: 'GET' as const,
				url: 'api2/contacts',
			};
			const res = {
				url: `${WISEPOPS_API_BASE}/api2/contacts`,
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { message: 'Too many requests' },
			};
			return new ApiError(reqOptions, res, 'Rate limited', {
				retryAfter: retryAfterMs,
			});
		}

		it('preserves status 429 and retryAfter through client wrapper', async () => {
			const rawError = createRateLimitError(5000);
			mockRequest.mockRejectedValueOnce(rawError);

			let caughtError: WisepopsAPIError | undefined;
			try {
				await makeWisepopsRequest('api2/contacts', 'test-key');
			} catch (err) {
				caughtError = err as WisepopsAPIError;
			}

			expect(caughtError).toBeInstanceOf(WisepopsAPIError);
			expect(caughtError?.status).toBe(429);
			expect(caughtError?.retryAfter).toBe(5000);
		});

		it('matches RATE_LIMIT_ERROR policy and returns headersRetryAfterMs', async () => {
			const rawError = createRateLimitError(3500);
			mockRequest.mockRejectedValueOnce(rawError);

			let caughtError!: Error;
			try {
				await makeWisepopsRequest('api2/contacts', 'test-key');
			} catch (err) {
				caughtError = err as Error;
			}

			expect(errorHandlers.RATE_LIMIT_ERROR.match(caughtError)).toBe(true);
			const strategy =
				await errorHandlers.RATE_LIMIT_ERROR.handler(caughtError);
			expect(strategy).toEqual({ maxRetries: 5, headersRetryAfterMs: 3500 });
		});

		it('matches ApiError directly in RATE_LIMIT_ERROR policy', async () => {
			const rawError = createRateLimitError(2000);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(rawError)).toBe(true);
			const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(rawError);
			expect(strategy).toEqual({ maxRetries: 5, headersRetryAfterMs: 2000 });
		});

		it('classifies 401 authentication errors as terminal with 0 retries', async () => {
			const authApiError = new ApiError(
				{ method: 'GET', url: 'api2/contacts' },
				{
					url: `${WISEPOPS_API_BASE}/api2/contacts`,
					ok: false,
					status: 401,
					statusText: 'Unauthorized',
					body: { message: 'Invalid API key' },
				},
				'Unauthorized',
			);
			mockRequest.mockRejectedValueOnce(authApiError);

			let caughtError!: Error;
			try {
				await makeWisepopsRequest('api2/contacts', 'bad-key');
			} catch (err) {
				caughtError = err as Error;
			}

			expect(errorHandlers.AUTH_ERROR.match(caughtError)).toBe(true);
			const strategy = await errorHandlers.AUTH_ERROR.handler();
			expect(strategy).toEqual({ maxRetries: 0 });
		});

		it('classifies other non-429 errors under DEFAULT policy with 0 retries', async () => {
			const genericError = new Error('Network failure');
			expect(errorHandlers.RATE_LIMIT_ERROR.match(genericError)).toBe(false);
			expect(errorHandlers.AUTH_ERROR.match(genericError)).toBe(false);
			expect((errorHandlers.DEFAULT.match as any)(genericError)).toBe(true);
			const strategy = await (errorHandlers.DEFAULT.handler as any)(
				genericError,
			);
			expect(strategy).toEqual({ maxRetries: 0 });
		});
	});

	describe('Webhook Signature Verification', () => {
		const secret = 'test-signing-secret-12345';
		const rawPayload = JSON.stringify([
			{
				collected_at: '2026-09-04T10:00:00.000Z',
				wisepop_id: 999,
				fields: { email: 'lead@example.com' },
			},
		]);

		function sign(payload: string, key: string): string {
			return crypto.createHmac('sha256', key).update(payload).digest('hex');
		}

		it('accepts correctly signed request', () => {
			const validSig = sign(rawPayload, secret);
			const result = verifyWisepopsWebhookSignature(
				{
					rawBody: rawPayload,
					headers: { 'x-wisepops-signature': validSig },
				},
				secret,
			);
			expect(result).toEqual({ valid: true });
		});

		it('accepts case-insensitive header name (X-Wisepops-Signature)', () => {
			const validSig = sign(rawPayload, secret);
			const result = verifyWisepopsWebhookSignature(
				{
					rawBody: rawPayload,
					headers: { 'X-Wisepops-Signature': validSig },
				},
				secret,
			);
			expect(result).toEqual({ valid: true });
		});

		it('rejects wrong signature', () => {
			const wrongSig = sign(rawPayload, 'different-secret');
			const result = verifyWisepopsWebhookSignature(
				{
					rawBody: rawPayload,
					headers: { 'x-wisepops-signature': wrongSig },
				},
				secret,
			);
			expect(result.valid).toBe(false);
			expect(result.error).toBe('Invalid signature');
		});

		it('rejects missing signature header', () => {
			const result = verifyWisepopsWebhookSignature(
				{
					rawBody: rawPayload,
					headers: {},
				},
				secret,
			);
			expect(result.valid).toBe(false);
			expect(result.error).toBe('Missing x-wisepops-signature header');
		});

		it('rejects missing signing secret', () => {
			const validSig = sign(rawPayload, secret);
			const result = verifyWisepopsWebhookSignature(
				{
					rawBody: rawPayload,
					headers: { 'x-wisepops-signature': validSig },
				},
				'',
			);
			expect(result.valid).toBe(false);
			expect(result.error).toBe('Missing webhook secret');
		});

		it('rejects malformed signature header', () => {
			const result = verifyWisepopsWebhookSignature(
				{
					rawBody: rawPayload,
					headers: { 'x-wisepops-signature': 'not-a-valid-hex-digest' },
				},
				secret,
			);
			expect(result.valid).toBe(false);
			expect(result.error).toBe('Malformed signature header');
		});

		it('rejects altered request body', () => {
			const validSig = sign(rawPayload, secret);
			const alteredBody = rawPayload + ' ';
			const result = verifyWisepopsWebhookSignature(
				{
					rawBody: alteredBody,
					headers: { 'x-wisepops-signature': validSig },
				},
				secret,
			);
			expect(result.valid).toBe(false);
			expect(result.error).toBe('Invalid signature');
		});

		it('rejects missing raw body', () => {
			const validSig = sign(rawPayload, secret);
			const result = verifyWisepopsWebhookSignature(
				{
					rawBody: undefined,
					headers: { 'x-wisepops-signature': validSig },
				},
				secret,
			);
			expect(result.valid).toBe(false);
			expect(result.error).toBe('Missing raw body for signature verification');
		});
	});

	describe('Endpoint Handlers & Runtime Output Validation', () => {
		const ctx = createMockContext();

		it('contacts.get returns parsed contacts and validates output', async () => {
			const mockContacts = [
				{
					collected_at: '2026-09-04T10:00:00Z',
					wisepop_id: 101,
					ip: '127.0.0.1',
					country_code: 'US',
					fields: { email: 'test@example.com' },
				},
			];
			mockRequest.mockResolvedValueOnce(mockContacts);

			const result = await Contacts.get(ctx, { wisepop_id: 101 });
			expect(result).toEqual(mockContacts);
			const [, reqOptions] = mockRequest.mock.calls[0];
			expect(reqOptions.method).toBe('GET');
			expect(reqOptions.url).toBe('api2/contacts');
			expect(reqOptions.query).toEqual({ wisepop_id: 101 });
		});

		it('contacts.get rejects malformed response from provider', async () => {
			mockRequest.mockResolvedValueOnce({ not: 'an array' });
			await expect(Contacts.get(ctx, {})).rejects.toThrow();
		});

		it('performance.get returns performance records and validates output', async () => {
			const mockPerformance = [
				{
					id: 101,
					label: 'Summer Campaign',
					created_at: '2026-06-01T00:00:00Z',
					activated: true,
					display_count: 500,
					click_count: 50,
					email_count: 25,
				},
			];
			mockRequest.mockResolvedValueOnce(mockPerformance);

			const result = await Performance.get(ctx, {});
			expect(result).toEqual(mockPerformance);
			const [, reqOptions] = mockRequest.mock.calls[0];
			expect(reqOptions.method).toBe('GET');
			expect(reqOptions.url).toBe('api2/wisepops');
		});

		it('performance.get rejects malformed performance response', async () => {
			mockRequest.mockResolvedValueOnce([{ id: 'not-a-number', label: 123 }]);
			await expect(Performance.get(ctx, {})).rejects.toThrow();
		});

		it('webhook.create sends valid body and parses response id', async () => {
			mockRequest.mockResolvedValueOnce({ id: 777 });

			const result = await Webhooks.createWebhook(ctx, {
				event: 'email',
				target_url: 'https://example.com/webhook',
				wisepop_id: 101,
			});

			expect(result).toEqual({ id: 777 });
			const [, reqOptions] = mockRequest.mock.calls[0];
			expect(reqOptions.method).toBe('POST');
			expect(reqOptions.url).toBe('api2/hooks');
			expect(reqOptions.body).toEqual({
				event: 'email',
				target_url: 'https://example.com/webhook',
				wisepop_id: 101,
			});
		});

		it('webhook.create rejects malformed response from provider', async () => {
			mockRequest.mockResolvedValueOnce({ wrong_field: 'missing_id' });
			await expect(
				Webhooks.createWebhook(ctx, {
					event: 'email',
					target_url: 'https://example.com/webhook',
				}),
			).rejects.toThrow();
		});

		it('validates WisepopsWebhookPayloadSchema against lead payload', () => {
			const samplePayload = [
				{
					collected_at: '2026-09-04T10:10:00Z',
					wisepop_id: 50,
					ip: '192.168.1.1',
					country_code: 'FR',
					form_session: 'session-xyz',
					fields: { email: 'hello@world.com', first_name: 'Jane' },
				},
			];
			const parsed = WisepopsWebhookPayloadSchema.parse(samplePayload);
			expect(parsed).toHaveLength(1);
			expect(parsed[0]?.wisepop_id).toBe(50);
		});
	});
});
