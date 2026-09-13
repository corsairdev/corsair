import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { ImagiorAPIError, makeImagiorRequest } from './client';
import {
	ImagiorEndpointInputSchemas,
	ImagiorEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { ImagiorContext, ImagiorKeyBuilderContext } from './index';
import { imagior, imagiorEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return { ...original, request: jest.fn() };
});

const mockRequest = request as jest.Mock;
const mockLog = jest.mocked(logEventFromContext);

const accountPayload = {
	status: 'success',
	name: 'John Doe',
	email: 'john.doe@example.com',
	statusCode: 200,
	usage: { remainingCredits: 5 },
	requestCompletionTime: '50 ms',
	timestamp: '2024-09-12T02:44:45.213Z',
};

const templatesPayload = [
	{
		id: 'template123',
		name: 'Sample Template',
		createdAt: '2024-09-12T02:44:45.213Z',
		updatedAt: '2024-09-13T02:44:45.213Z',
	},
];

const mockCtx = {
	key: 'imagior_test_key',
	options: {},
	logEvent: jest.fn(),
	db: {},
} as unknown as ImagiorContext;

function pluginEndpoints() {
	const endpoints = imagior({ key: 'imagior_test_key' }).endpoints;
	if (!endpoints) throw new Error('missing endpoints');
	return endpoints;
}

function classify(error: Error): string {
	const name = (
		Object.keys(errorHandlers) as Array<keyof typeof errorHandlers>
	).find((key) => errorHandlers[key].match(error));
	return typeof name === 'string' ? name : 'none';
}

function httpError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'https://api.imagior.com/user/account' },
		{
			url: 'https://api.imagior.com/user/account',
			ok: false,
			status,
			statusText: 'Error',
			body: { error: message },
		},
		message,
	);
}

describe('imagior plugin shape', () => {
	it('registers both read operations and no webhooks', () => {
		const plugin = imagior();
		expect(plugin.id).toBe('imagior');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
		expect(plugin.webhookHooks).toBeUndefined();
		expect(Object.keys(imagiorEndpointSchemas).sort()).toEqual([
			'account.get',
			'templates.list',
		]);
	});
});

describe('imagior keyBuilder', () => {
	it('returns options.key for endpoint calls', async () => {
		const plugin = imagior({ key: 'imagior_test_key' });
		await expect(
			(plugin.keyBuilder as (ctx: unknown, source: string) => Promise<string>)(
				{ authType: 'api_key' },
				'endpoint',
			),
		).resolves.toBe('imagior_test_key');
	});

	it('reads the stored API key for endpoint calls', async () => {
		const plugin = imagior();
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async () => 'stored_key' },
		} as unknown as ImagiorKeyBuilderContext;
		await expect(
			(plugin.keyBuilder as (ctx: unknown, source: string) => Promise<string>)(
				ctx,
				'endpoint',
			),
		).resolves.toBe('stored_key');
	});

	it('throws AuthMissingError when the API key is absent', async () => {
		const plugin = imagior();
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async (): Promise<string | null> => null },
		} as unknown as ImagiorKeyBuilderContext;
		await expect(
			(plugin.keyBuilder as (ctx: unknown, source: string) => Promise<string>)(
				ctx,
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('imagior request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue(accountPayload);
	});

	it('uses the documented host and bearer authentication', async () => {
		await makeImagiorRequest('user/account', 'imagior_test_key');
		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.imagior.com',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer imagior_test_key',
				}),
			}),
			expect.objectContaining({ method: 'GET', url: 'user/account' }),
		);
	});

	it('rethrows ApiError so status remains available to handlers', async () => {
		const error = httpError(401, 'Invalid API key');
		mockRequest.mockRejectedValue(error);
		await expect(makeImagiorRequest('user/account', 'bad')).rejects.toBe(error);
	});

	it('wraps unknown failures in ImagiorAPIError', async () => {
		mockRequest.mockRejectedValue(new Error('network failure'));
		await expect(
			makeImagiorRequest('user/account', 'key'),
		).rejects.toBeInstanceOf(ImagiorAPIError);
	});
});

describe('account.get', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
		mockRequest.mockResolvedValue(accountPayload);
	});

	it('GETs /user/account and validates the documented response', async () => {
		const result = await pluginEndpoints().account.get(mockCtx, {});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ method: 'GET', url: 'user/account' }),
		);
		expect(result).toEqual(accountPayload);
		expect(mockLog).toHaveBeenCalledWith(
			mockCtx,
			'imagior.account.get',
			{},
			'completed',
		);
	});

	it('rejects an invalid account response', async () => {
		mockRequest.mockResolvedValue({ status: 'success' });
		await expect(pluginEndpoints().account.get(mockCtx, {})).rejects.toThrow();
	});
});

describe('templates.list', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
		mockRequest.mockResolvedValue(templatesPayload);
	});

	it('GETs /templates/all with documented sort options', async () => {
		const result = await pluginEndpoints().templates.list(mockCtx, {
			sort: 'updatedAt',
			order: 'desc',
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'templates/all',
				query: { sort: 'updatedAt', order: 'desc' },
			}),
		);
		expect(result).toEqual(templatesPayload);
		expect(mockLog).toHaveBeenCalledWith(
			mockCtx,
			'imagior.templates.list',
			{ sort: 'updatedAt', order: 'desc' },
			'completed',
		);
	});

	it('omits optional query parameters when they are not supplied', async () => {
		await pluginEndpoints().templates.list(mockCtx, {});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({ query: {} }),
		);
	});

	it('rejects unsupported sort and order values', () => {
		expect(
			ImagiorEndpointInputSchemas.listTemplates.safeParse({
				sort: 'name',
				order: 'sideways',
			}).success,
		).toBe(false);
	});

	it('rejects malformed template responses', async () => {
		mockRequest.mockResolvedValue([
			{ id: 'template123', name: 'Missing dates' },
		]);
		await expect(
			pluginEndpoints().templates.list(mockCtx, {}),
		).rejects.toThrow();
	});
});

describe('imagior schemas and error handlers', () => {
	it('accepts the official response examples', () => {
		expect(
			ImagiorEndpointOutputSchemas.getAccount.parse(accountPayload),
		).toEqual(accountPayload);
		expect(
			ImagiorEndpointOutputSchemas.listTemplates.parse(templatesPayload),
		).toEqual(templatesPayload);
	});

	it('classifies authentication, rate-limit, and server errors', () => {
		expect(classify(httpError(401, 'Invalid API key'))).toBe('AUTH_ERROR');
		expect(classify(httpError(429, 'Too many requests'))).toBe(
			'RATE_LIMIT_ERROR',
		);
		expect(classify(httpError(500, 'Service unavailable'))).toBe(
			'SERVER_ERROR',
		);
	});
});
