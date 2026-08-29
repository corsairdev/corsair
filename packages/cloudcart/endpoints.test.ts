import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	buildCloudcartStoreUrl,
	CloudcartAPIError,
	makeCloudcartRequest,
	packCloudcartKey,
} from './client';
import { CloudcartEndpointInputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { CloudcartContext, CloudcartKeyBuilderContext } from './index';
import { cloudcart } from './index';
import { CloudcartSchema } from './schema';
import {
	matchCloudcartWebhook,
	verifyCloudcartWebhookSignature,
} from './webhooks/types';

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

const STORE = 'https://shop.example.com';
const PACKED = packCloudcartKey('cc_test_key', STORE);

const mockCtx = {
	key: PACKED,
	$getAccountId: () => 'test-account-id',
	options: { key: 'cc_test_key', storeUrl: STORE },
	logEvent: jest.fn(),
	db: {},
	keyBuilder: async () => PACKED,
} as unknown as CloudcartContext;

function plugin() {
	return cloudcart({ key: 'cc_test_key', storeUrl: STORE });
}

function endpoints() {
	const value = plugin().endpoints;
	if (!value) throw new Error('missing endpoints');
	return value;
}

function classify(error: Error): string {
	const name = (
		Object.keys(errorHandlers) as Array<keyof typeof errorHandlers>
	).find((key) => errorHandlers[key].match(error));
	return name ?? 'none';
}

function httpError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'https://shop.example.com/api/v1/products' },
		{
			url: 'https://shop.example.com/api/v1/products',
			ok: false,
			status,
			statusText: 'Error',
			body: { error: message },
		},
		message,
	);
}

describe('cloudcart plugin shape', () => {
	it('registers api key plus store_url and no leftover tenant field', () => {
		const instance = plugin();
		expect(instance.id).toBe('cloudcart');
		expect(instance.authConfig).toEqual({
			api_key: { account: ['store_url'] },
		});
		expect(instance.pluginWebhookMatcher).toEqual(expect.any(Function));
		expect(instance.oauthWebhookTenantLinkResolver).toBeUndefined();
		expect(CloudcartSchema.entities).toEqual({});
	});
});

describe('cloudcart keyBuilder', () => {
	it('packs api key and store url for endpoint calls', async () => {
		await expect(
			(
				plugin().keyBuilder as (ctx: unknown, source: string) => Promise<string>
			)({ authType: 'api_key' }, 'endpoint'),
		).resolves.toBe(PACKED);
	});

	it('throws AuthMissingError when the api key is absent', async () => {
		const instance = cloudcart({ storeUrl: STORE });
		const ctx = {
			authType: 'api_key',
			keys: {
				get_api_key: async () => null,
				get_store_url: async () => STORE,
			},
		} as unknown as CloudcartKeyBuilderContext;

		await expect(
			(
				instance.keyBuilder as (ctx: unknown, source: string) => Promise<string>
			)(ctx, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError when the store url is absent', async () => {
		const instance = cloudcart({ key: 'cc_test_key' });
		const ctx = {
			authType: 'api_key',
			keys: {
				get_api_key: async () => 'cc_test_key',
				get_store_url: async () => null,
			},
		} as unknown as CloudcartKeyBuilderContext;

		await expect(
			(
				instance.keyBuilder as (ctx: unknown, source: string) => Promise<string>
			)(ctx, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('cloudcart request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ id: 1 });
	});

	it('targets the shop host and sends X-CloudCart-ApiKey', async () => {
		await makeCloudcartRequest('products', PACKED, { method: 'GET' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://shop.example.com/api/v1',
				HEADERS: expect.objectContaining({
					'X-CloudCart-ApiKey': 'cc_test_key',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: 'products',
			}),
			expect.anything(),
		);
	});

	it('rejects a missing or http store url', () => {
		expect(() => buildCloudcartStoreUrl('http://shop.example.com')).toThrow(
			CloudcartAPIError,
		);
		expect(() => buildCloudcartStoreUrl('')).toThrow(CloudcartAPIError);
	});

	it('keeps an already versioned /v1 store url', () => {
		expect(buildCloudcartStoreUrl('https://api.cloudcart.com/v1')).toBe(
			'https://api.cloudcart.com/v1',
		);
	});

	it('rethrows ApiError', async () => {
		const err = httpError(401, 'Unauthorized');
		mockRequest.mockRejectedValue(err);
		await expect(makeCloudcartRequest('products', PACKED)).rejects.toBe(err);
	});
});

describe('cloudcart endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
		mockRequest.mockResolvedValue({ data: { id: 'p1' } });
	});

	it('GETs a product by encoded id', async () => {
		await endpoints().products.getProduct(mockCtx, { id: 'sku/1' });

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'products/sku%2F1',
			}),
			expect.anything(),
		);
	});

	it('rejects an empty product id before calling the API', async () => {
		await expect(
			endpoints().products.getProduct(mockCtx, { id: '' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('POSTs createProduct with the data object', async () => {
		await endpoints().products.createProduct(mockCtx, {
			data: { name: 'Mug', price: 10 },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'products',
				body: { name: 'Mug', price: 10 },
			}),
			expect.anything(),
		);
	});

	it('lists orders with page query params', async () => {
		await endpoints().orders.listOrders(mockCtx, {
			'page[number]': 1,
			'page[size]': 20,
			id: '99',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'orders',
				query: expect.objectContaining({
					'page[number]': 1,
					'page[size]': 20,
					id: '99',
				}),
			}),
			expect.anything(),
		);
	});

	it('creates variant options with parent ids in the path', async () => {
		await endpoints().variants.createVariantOption(mockCtx, {
			product_id: 'p1',
			variant_id: 'v1',
			data: { name: 'Blue' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'variants/v1/options',
				body: { name: 'Blue' },
			}),
			expect.anything(),
		);

		mockRequest.mockClear();
		await endpoints().variants.createVariantOptions(mockCtx, {
			parameter_id: 'param1',
			data: { name: 'Medium' },
		});
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'variant-parameters/param1/options',
				body: { name: 'Medium' },
			}),
			expect.anything(),
		);
	});

	it('does not log raw customer payloads', async () => {
		await endpoints().customers.createCustomer(mockCtx, {
			data: { email: 'a@b.com', password: 'secret' },
		});

		const payload = mockLog.mock.calls[0]?.[2] as Record<string, unknown>;
		expect(payload).not.toHaveProperty('data');
		expect(JSON.stringify(payload)).not.toContain('secret');
		expect(JSON.stringify(payload)).not.toContain('a@b.com');
	});
});

describe('cloudcart schemas', () => {
	it('requires an id for getCustomer', () => {
		expect(() => CloudcartEndpointInputSchemas.getCustomer.parse({})).toThrow();
		expect(
			CloudcartEndpointInputSchemas.getCustomer.parse({ id: 'cust_123' }).id,
		).toBe('cust_123');
	});
});

describe('cloudcart webhooks', () => {
	it('matches CloudCart event payloads without a signature header', () => {
		expect(
			matchCloudcartWebhook({
				headers: {},
				body: { type: 'order.created', data: { id: 1 } },
			} as never),
		).toBe(true);
		expect(
			plugin().pluginWebhookMatcher?.({
				headers: { 'x-cloudcart-apikey': 'cc_test_key' },
				body: { type: 'product.created', data: { id: 2 } },
			} as never),
		).toBe(true);
	});

	it('rejects missing secret or missing api key header', () => {
		expect(
			verifyCloudcartWebhookSignature(
				{
					headers: { 'x-cloudcart-apikey': 'cc_test_key' },
					payload: { type: 'order.created', data: { id: 1 } },
				} as never,
				'',
			).valid,
		).toBe(false);
		expect(
			verifyCloudcartWebhookSignature(
				{
					headers: {},
					payload: { type: 'order.created', data: { id: 1 } },
				} as never,
				'cc_test_key',
			).valid,
		).toBe(false);
	});

	it('accepts a matching X-CloudCart-ApiKey header', () => {
		expect(
			verifyCloudcartWebhookSignature(
				{
					headers: { 'x-cloudcart-apikey': 'cc_test_key' },
					payload: { type: 'order.created', data: { id: 1 } },
				} as never,
				'cc_test_key',
			).valid,
		).toBe(true);
	});
});

describe('cloudcart error classification', () => {
	it('classifies documented status codes', () => {
		expect(classify(httpError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(classify(httpError(403, 'Forbidden'))).toBe('PERMISSION_ERROR');
		expect(classify(httpError(404, 'Not Found'))).toBe('NOT_FOUND_ERROR');
		expect(classify(httpError(422, 'Unprocessable'))).toBe('VALIDATION_ERROR');
		expect(classify(httpError(429, 'Too Many Requests'))).toBe(
			'RATE_LIMIT_ERROR',
		);
		expect(classify(httpError(500, 'Server Error'))).toBe('SERVER_ERROR');
	});

	it('does not retry mutating requests after a 5xx', async () => {
		const postError = new ApiError(
			{ method: 'POST', url: 'https://shop.example.com/api/v1/customers' },
			{
				url: 'https://shop.example.com/api/v1/customers',
				ok: false,
				status: 500,
				statusText: 'Error',
				body: { error: 'Server Error' },
			},
			'Server Error',
		);
		await expect(
			errorHandlers.SERVER_ERROR.handler(postError),
		).resolves.toEqual({ maxRetries: 0 });
		await expect(
			errorHandlers.SERVER_ERROR.handler(httpError(500, 'Server Error')),
		).resolves.toEqual({
			maxRetries: 3,
			retryStrategy: 'exponential_backoff',
		});
	});
});
