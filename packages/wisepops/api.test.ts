import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	makeWisepopsRequest,
	WISEPOPS_API_BASE,
	WisepopsAPIError,
} from './client';
import { Contacts, DataPrivacy, Performance, Webhooks } from './endpoints';
import { errorHandlers } from './error-handlers';
import { wisepops } from './index';
import { WisepopsSchema } from './schema';

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

	describe('Request serialization and validation', () => {
		it('uses custom Authorization header and no TOKEN auth rewrite', async () => {
			mockRequest.mockResolvedValueOnce([
				{ wisepop_id: 1, collected_at: 'now' },
			]);

			await makeWisepopsRequest('api2/contacts', 'live-api-key', {
				method: 'GET',
			});

			const [config] = mockRequest.mock.calls[0];
			expect(config.BASE).toBe(WISEPOPS_API_BASE);
			expect(config.TOKEN).toBeUndefined();
			expect(config.HEADERS.Authorization).toBe(
				'WISEPOPS-API key="live-api-key"',
			);
		});

		it('preserves body on data privacy delete request', async () => {
			mockRequest.mockResolvedValueOnce({ deleted: 1 });
			const ctx = createMockContext();

			await DataPrivacy.deleteData(ctx, { email: 'user@example.com' });

			const [, requestOptions] = mockRequest.mock.calls[0];
			expect(requestOptions.method).toBe('DELETE');
			expect(requestOptions.url).toBe('api2/data-privacy');
			expect(requestOptions.body).toEqual({ email: 'user@example.com' });
			expect(requestOptions.mediaType).toBe('application/json; charset=utf-8');
		});

		it('preserves query on webhook delete request', async () => {
			mockRequest.mockResolvedValueOnce({ success: true });
			const ctx = createMockContext();

			await Webhooks.deleteWebhook(ctx, { hook_id: 42 });

			const [, requestOptions] = mockRequest.mock.calls[0];
			expect(requestOptions.method).toBe('DELETE');
			expect(requestOptions.url).toBe('api2/hooks');
			expect(requestOptions.query).toEqual({ hook_id: 42 });
		});

		it('does not log PII on data privacy completion event', async () => {
			mockRequest.mockResolvedValueOnce({ deleted: 1 });
			const ctx = createMockContext();

			await DataPrivacy.deleteData(ctx, {
				email: 'privacy-user@example.com',
			});

			expect(mockLogEvent).toHaveBeenCalledWith(
				ctx,
				'wisepops.dataPrivacy.delete',
				{},
				'completed',
			);
		});

		it('rejects empty selector before outbound request', async () => {
			const ctx = createMockContext();

			await expect(DataPrivacy.deleteData(ctx, {} as any)).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});

		it('rejects invalid phone selector before outbound request', async () => {
			const ctx = createMockContext();

			await expect(
				DataPrivacy.deleteData(ctx, { phone: '12345' }),
			).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		});
	});

	describe('Error handling and retry policy', () => {
		function createApiError(
			status: number,
			message: string,
			retryAfter?: number,
		) {
			return new ApiError(
				{ method: 'GET', url: 'api2/contacts' },
				{
					url: `${WISEPOPS_API_BASE}/api2/contacts`,
					ok: false,
					status,
					statusText: message,
					body: { message },
				},
				message,
				retryAfter !== undefined ? { retryAfter } : undefined,
			);
		}

		it('rethows ApiError so status remains available to handlers', async () => {
			const rawError = createApiError(429, 'Too Many Requests', 5000);
			mockRequest.mockRejectedValueOnce(rawError);

			await expect(
				makeWisepopsRequest('api2/contacts', 'test-key'),
			).rejects.toBe(rawError);
		});

		it('matches rate limit by status and returns maxRetries 3 for reads', async () => {
			const rawError = createApiError(429, 'Too Many Requests', 3500);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(rawError)).toBe(true);

			const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(rawError, {
				pluginId: 'wisepops',
				operation: 'contacts.get',
				input: {},
				originalError: rawError,
			});

			expect(strategy).toEqual({ maxRetries: 3, headersRetryAfterMs: 3500 });
		});

		it('returns maxRetries 0 for non-retryable write operations', async () => {
			const rawError = createApiError(429, 'Too Many Requests', 6000);

			const webhookCreateStrategy =
				await errorHandlers.RATE_LIMIT_ERROR.handler(rawError, {
					pluginId: 'wisepops',
					operation: 'webhook.create',
					input: {},
					originalError: rawError,
				});
			expect(webhookCreateStrategy).toEqual({
				maxRetries: 0,
				headersRetryAfterMs: 6000,
			});

			const dataPrivacyStrategy = await errorHandlers.RATE_LIMIT_ERROR.handler(
				rawError,
				{
					pluginId: 'wisepops',
					operation: 'dataPrivacy.delete',
					input: {},
					originalError: rawError,
				},
			);
			expect(dataPrivacyStrategy).toEqual({
				maxRetries: 0,
				headersRetryAfterMs: 6000,
			});
		});

		it('matches auth errors by status when status is present', () => {
			const unauthorized = createApiError(401, 'Unauthorized');
			expect(errorHandlers.AUTH_ERROR.match(unauthorized)).toBe(true);

			const forbidden = createApiError(403, 'Forbidden');
			expect(errorHandlers.AUTH_ERROR.match(forbidden)).toBe(true);
		});

		it('keeps WisepopsAPIError wrapping for generic runtime errors', async () => {
			mockRequest.mockRejectedValueOnce(new Error('network down'));

			let caught: unknown;
			try {
				await makeWisepopsRequest('api2/contacts', 'test-key');
			} catch (error) {
				caught = error;
			}

			expect(caught).toBeInstanceOf(WisepopsAPIError);
			expect((caught as WisepopsAPIError).message).toBe('network down');
		});
	});

	describe('Endpoint runtime validation', () => {
		const ctx = createMockContext();

		it('contacts.get validates output and forwards query', async () => {
			const mockContacts = [
				{
					collected_at: '2026-09-04T10:00:00Z',
					wisepop_id: 101,
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

		it('contacts.get rejects malformed provider response', async () => {
			mockRequest.mockResolvedValueOnce({ not: 'array' });
			await expect(Contacts.get(ctx, {})).rejects.toThrow();
		});

		it('performance.get validates output', async () => {
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
		});

		it('webhook.create validates response shape', async () => {
			mockRequest.mockResolvedValueOnce({ id: 777 });

			const result = await Webhooks.createWebhook(ctx, {
				event: 'email',
				target_url: 'https://example.com/webhook',
			});

			expect(result).toEqual({ id: 777 });
		});
	});

	describe('Plugin construction and keyBuilder', () => {
		it('initializes as API key only with no webhooks', () => {
			const plugin = wisepops({ key: 'test-key' });

			expect(plugin.authConfig).toEqual({ api_key: {} });
			expect(plugin.webhooks).toEqual({});
			expect(
				plugin.pluginWebhookMatcher?.({ headers: {}, body: {} as any }),
			).toBe(false);
		});

		it('throws AuthMissingError when endpoint key is missing or empty', async () => {
			const plugin = wisepops({});

			await expect(
				(plugin.keyBuilder as any)(
					{
						authType: 'api_key',
						keys: { get_api_key: jest.fn().mockResolvedValue('') },
					} as any,
					'endpoint',
				),
			).rejects.toThrow(AuthMissingError);
		});
	});
});
