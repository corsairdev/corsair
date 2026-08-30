import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { DynapicturesAPIError, makeDynapicturesRequest } from './client';
import { DynapicturesEndpointInputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type {
	DynapicturesContext,
	DynapicturesKeyBuilderContext,
} from './index';
import { dynapictures, dynapicturesEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;
const mockLog = jest.mocked(logEventFromContext);

const mockCtx = {
	key: 'dp_test_api_key',
	$getAccountId: () => 'test-account-id',
	options: {},
	logEvent: jest.fn(),
	db: {},
	keyBuilder: async () => 'dp_test_api_key',
} as unknown as DynapicturesContext;

function pluginEndpoints() {
	const endpoints = dynapictures({ key: 'dp_test_api_key' }).endpoints;
	if (!endpoints) {
		throw new Error('missing endpoints');
	}
	return endpoints;
}

function classify(error: Error): string {
	const name = (
		Object.keys(errorHandlers) as Array<keyof typeof errorHandlers>
	).find((key) => errorHandlers[key].match(error));
	return name ?? 'none';
}

function httpError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'https://api.dynapictures.com/templates' },
		{
			url: 'https://api.dynapictures.com/templates',
			ok: false,
			status,
			statusText: 'Error',
			body: { error: message },
		},
		message,
	);
}

describe('dynapictures plugin shape', () => {
	it('registers the 5 endpoints and no webhooks', () => {
		const plugin = dynapictures();
		expect(plugin.id).toBe('dynapictures');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
		expect(plugin.webhookHooks).toBeUndefined();
		expect(Object.keys(dynapicturesEndpointSchemas).sort()).toEqual([
			'designs.delete',
			'designs.generate',
			'designs.get',
			'designs.list',
			'templates.list',
		]);
	});
});

describe('dynapictures keyBuilder', () => {
	it('returns options.key for endpoint calls', async () => {
		const plugin = dynapictures({ key: 'dp_test_api_key' });
		await expect(
			(plugin.keyBuilder as (ctx: unknown, source: string) => Promise<string>)(
				{ authType: 'api_key' },
				'endpoint',
			),
		).resolves.toBe('dp_test_api_key');
	});

	it('throws AuthMissingError when the api key is absent', async () => {
		const plugin = dynapictures();
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async (): Promise<string | null> => null },
		} as unknown as DynapicturesKeyBuilderContext;

		await expect(
			(plugin.keyBuilder as (ctx: unknown, source: string) => Promise<string>)(
				ctx,
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError for non-endpoint sources', async () => {
		const plugin = dynapictures({ key: 'dp_test_api_key' });
		await expect(
			(plugin.keyBuilder as (ctx: unknown, source: string) => Promise<string>)(
				{ authType: 'api_key' },
				'webhook',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('dynapictures request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('sends Authorization Bearer header against api.dynapictures.com host', async () => {
		mockRequest.mockResolvedValue({ id: 'design-123' });

		await makeDynapicturesRequest('designs/123', 'dp_test_api_key', {
			method: 'GET',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.dynapictures.com',
				HEADERS: expect.objectContaining({
					Authorization: 'Bearer dp_test_api_key',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: '/designs/123',
			}),
		);
	});

	it('wraps unknown errors into DynapicturesAPIError', async () => {
		mockRequest.mockRejectedValue(new Error('Network error'));

		await expect(
			makeDynapicturesRequest('templates', 'dp_test_api_key'),
		).rejects.toBeInstanceOf(DynapicturesAPIError);
	});
});

describe('designs.generate', () => {
	const generateResponse = {
		id: 'img-101',
		templateId: 'tpl-1',
		imageUrl: 'https://api.dynapictures.com/images/101.png',
		width: 1200,
		height: 630,
	};

	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
		mockRequest.mockResolvedValue(generateResponse);
	});

	it('posts generation request to /designs/{designId}', async () => {
		const result = await pluginEndpoints().designs.generate(mockCtx, {
			designId: 'tpl-1',
			params: [{ name: 'title', text: 'Hello Corsair' }],
			format: 'png',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: '/designs/tpl-1',
				body: {
					params: [{ name: 'title', text: 'Hello Corsair' }],
					format: 'png',
					metadata: undefined,
				},
			}),
		);
		expect(result).toEqual(generateResponse);
		expect(mockLog).toHaveBeenCalledWith(
			mockCtx,
			'dynapictures.designs.generate',
			{
				designId: 'tpl-1',
				params: [{ name: 'title', text: 'Hello Corsair' }],
				format: 'png',
			},
			'completed',
		);
	});

	it('validates input parameters correctly', () => {
		expect(() =>
			DynapicturesEndpointInputSchemas.generateDesign.parse({ designId: '' }),
		).toThrow();
	});
});

describe('designs.get', () => {
	const designResponse = {
		id: 'img-101',
		templateId: 'tpl-1',
		imageUrl: 'https://api.dynapictures.com/images/101.png',
	};

	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
		mockRequest.mockResolvedValue(designResponse);
	});

	it('gets design by id', async () => {
		const result = await pluginEndpoints().designs.get(mockCtx, {
			id: 'img-101',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/designs/img-101',
			}),
		);
		expect(result).toEqual(designResponse);
		expect(mockLog).toHaveBeenCalledWith(
			mockCtx,
			'dynapictures.designs.get',
			{ id: 'img-101' },
			'completed',
		);
	});
});

describe('designs.list', () => {
	const listResponse = [
		{
			id: 'img-101',
			imageUrl: 'https://api.dynapictures.com/images/101.png',
		},
	];

	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
		mockRequest.mockResolvedValue(listResponse);
	});

	it('lists designs with query params', async () => {
		const result = await pluginEndpoints().designs.list(mockCtx, {
			limit: 10,
			offset: 0,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/designs',
				query: { limit: 10, offset: 0 },
			}),
		);
		expect(result).toEqual(listResponse);
		expect(mockLog).toHaveBeenCalledWith(
			mockCtx,
			'dynapictures.designs.list',
			{ limit: 10, offset: 0 },
			'completed',
		);
	});
});

describe('designs.delete', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
		mockRequest.mockResolvedValue({});
	});

	it('deletes design by id', async () => {
		const result = await pluginEndpoints().designs.delete(mockCtx, {
			id: 'img-101',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'DELETE',
				url: '/designs/img-101',
			}),
		);
		expect(result).toEqual({ success: true });
		expect(mockLog).toHaveBeenCalledWith(
			mockCtx,
			'dynapictures.designs.delete',
			{ id: 'img-101' },
			'completed',
		);
	});
});

describe('templates.list', () => {
	const templatesResponse = [
		{ id: 'tpl-1', name: 'Banner Template', width: 1200, height: 630 },
	];

	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
		mockRequest.mockResolvedValue(templatesResponse);
	});

	it('lists templates', async () => {
		const result = await pluginEndpoints().templates.list(mockCtx, {});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: '/templates',
			}),
		);
		expect(result).toEqual(templatesResponse);
		expect(mockLog).toHaveBeenCalledWith(
			mockCtx,
			'dynapictures.templates.list',
			{},
			'completed',
		);
	});
});

describe('dynapictures error classification', () => {
	it('classifies auth, rate limit, and default errors', () => {
		expect(classify(httpError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(classify(httpError(429, 'Rate limit exceeded'))).toBe(
			'RATE_LIMIT_ERROR',
		);
		expect(classify(httpError(500, 'Server error'))).toBe('DEFAULT');
	});
});
