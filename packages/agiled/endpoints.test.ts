import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { makeAgiledRequest } from './client';
import { errorHandlers } from './error-handlers';
import type { AgiledContext } from './index';
import { agiled, agiledEndpointSchemas } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

const mockCtx = {
	key: 'agiled_test_key',
	$getAccountId: () => 'test-account-id',
	options: {},
	keys: {
		get_api_key: jest.fn().mockResolvedValue('agiled_test_key'),
	},
	logEvent: jest.fn(),
	database: {},
} as unknown as AgiledContext;

describe('Agiled plugin registry', () => {
	const plugin = agiled();
	const endpoints = plugin.endpoints!;

	it('registers contacts.list with schemas and metadata', () => {
		expect(plugin.id).toBe('agiled');
		expect(endpoints.contacts.list).toBeDefined();
		expect(plugin.webhooks).toEqual({});
		expect(Object.keys(agiledEndpointSchemas)).toEqual(['contacts.list']);
		expect(plugin.endpointMeta?.['contacts.list']?.riskLevel).toBe('read');
	});

	it('throws AuthMissingError when no API key is configured', async () => {
		await expect(
			plugin.keyBuilder!(
				{
					...mockCtx,
					authType: 'api_key',
					keys: {
						get_api_key: jest.fn().mockResolvedValue(undefined),
					},
				} as unknown as Parameters<NonNullable<typeof plugin.keyBuilder>>[0],
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('does not match incoming webhooks', () => {
		expect(
			plugin.pluginWebhookMatcher?.({
				headers: { 'x-agiled-signature': 'anything' },
				body: JSON.stringify({ type: 'example' }),
			}),
		).toBe(false);
	});
});

describe('Agiled client error wrapping and retries', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('rethrows ApiError without dropping status and retry metadata', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: 'https://app.agiled.app/api/public/v1/contacts' },
			{
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				url: 'https://app.agiled.app/api/public/v1/contacts',
				body: { message: 'Rate limit exceeded' },
			},
			'Too Many Requests',
		);
		mockRequest.mockRejectedValue(apiError);

		await expect(
			makeAgiledRequest('/contacts', 'test-key', {
				method: 'GET',
				retries: false,
			}),
		).rejects.toThrow(apiError);
	});

	it('retries GET 429s inside the client', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: 'https://app.agiled.app/api/public/v1/contacts' },
			{
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				url: 'https://app.agiled.app/api/public/v1/contacts',
				body: { message: 'Rate limit exceeded' },
			},
			'Too Many Requests',
			{ retryAfter: 0 },
		);
		mockRequest
			.mockRejectedValueOnce(apiError)
			.mockResolvedValueOnce({ data: [] });

		const result = await makeAgiledRequest('/contacts', 'test-key', {
			method: 'GET',
		});
		expect(result).toEqual({ data: [] });
		expect(mockRequest).toHaveBeenCalledTimes(2);
	});

	it('does not retry POST requests', async () => {
		const apiError = new ApiError(
			{ method: 'POST', url: 'https://app.agiled.app/api/public/v1/contacts' },
			{
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				url: 'https://app.agiled.app/api/public/v1/contacts',
				body: { message: 'Rate limit exceeded' },
			},
			'Too Many Requests',
		);
		mockRequest.mockRejectedValue(apiError);

		await expect(
			makeAgiledRequest('/contacts', 'test-key', {
				method: 'POST',
				body: { first_name: 'Ada' },
			}),
		).rejects.toThrow(apiError);
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});
});

describe('Agiled binder error handlers', () => {
	it('keeps 429 binder retries at zero', async () => {
		const apiError = new ApiError(
			{ method: 'GET', url: 'https://app.agiled.app/api/public/v1/contacts' },
			{
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				url: 'https://app.agiled.app/api/public/v1/contacts',
				body: {},
			},
			'Too Many Requests',
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(apiError),
		).resolves.toMatchObject({ maxRetries: 0 });
	});
});

describe('Agiled contacts.list', () => {
	const endpoints = agiled().endpoints!;

	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('GETs /contacts with page and limit', async () => {
		mockRequest.mockResolvedValue({
			data: [{ id: 1, first_name: 'Ada', email: 'ada@example.com' }],
			current_page: 2,
			last_page: 4,
		});

		const result = await endpoints.contacts.list(mockCtx, {
			page: 2,
			limit: 25,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://app.agiled.app/api/public/v1',
				TOKEN: 'agiled_test_key',
				HEADERS: expect.not.objectContaining({
					Authorization: 'Bearer ${apikey}',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/contacts',
				query: { page: 2, limit: 25 },
			}),
			expect.objectContaining({
				rateLimitConfig: expect.objectContaining({ maxRetries: 0 }),
			}),
		);
		expect(result.data).toHaveLength(1);
		expect(result.current_page).toBe(2);
	});

	it('rejects responses that violate the contacts output schema', async () => {
		mockRequest.mockResolvedValue({ items: [{ id: 1 }] });

		await expect(
			endpoints.contacts.list(mockCtx, { page: 1, limit: 25 }),
		).rejects.toThrow(/failed schema validation/);
	});
});
