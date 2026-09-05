import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import { Cdr, Certificate, Health } from './endpoints';
import { CdrPlatformEndpointOutputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { CdrPlatformContext, CdrPlatformKeyBuilderContext } from './index';
import { cdrplatform } from './index';

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
	key: 'test_cdr_api_key',
	$getAccountId: () => 'test-account-id',
	options: {},
	logEvent: jest.fn(),
	db: {},
	keyBuilder: async () => 'test_cdr_api_key',
} as unknown as CdrPlatformContext;

const validPriceResponse = {
	cost: {
		items: [
			{
				method_type: 'bio-oil',
				cdr_amount: 50,
				cost: 3000,
			},
		],
		removal: 3000,
		variable_fees: 300,
		total: 3300,
	},
	currency: 'usd',
	weight_unit: 'kg',
};

describe('cdrplatform plugin', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
	});

	it('registers four API endpoints and API key auth', () => {
		const plugin = cdrplatform();
		expect(plugin.id).toBe('cdrplatform');
		expect(Object.keys(plugin.endpointSchemas ?? {}).sort()).toEqual([
			'cdr.price',
			'cdr.purchase',
			'certificate.get',
			'health.check',
		]);
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.webhooks).toEqual({});
	});

	it('throws AuthMissingError when endpoint key is missing', async () => {
		const plugin = cdrplatform();
		const ctx = {
			authType: 'api_key',
			keys: { get_api_key: async (): Promise<string | null> => null },
		} as unknown as CdrPlatformKeyBuilderContext;

		await expect(
			(plugin.keyBuilder as (ctx: unknown, source: string) => Promise<string>)(
				ctx,
				'endpoint',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});

describe('cdrplatform endpoint request mapping', () => {
	beforeEach(() => {
		mockRequest.mockResolvedValue(validPriceResponse);
	});

	it('maps cdr.price to POST /v1/cdr/price/', async () => {
		await Cdr.price(mockCtx, {
			weight_unit: 'kg',
			currency: 'usd',
			items: [{ method_type: 'bio-oil', cdr_amount: 50 }],
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.cdrplatform.com',
				HEADERS: expect.objectContaining({
					Authorization: 'Api-Key test_cdr_api_key',
				}),
			}),
			expect.objectContaining({
				method: 'POST',
				url: 'v1/cdr/price/',
			}),
		);
		expect(mockLog).toHaveBeenCalled();
	});

	it('maps cdr.purchase to POST /v1/cdr/', async () => {
		mockRequest.mockResolvedValue({
			transaction_uuid: '57c0f2c3-d010-4962-9471-88cdfeea4ac8',
		});

		await Cdr.purchase(mockCtx, {
			weight_unit: 'kg',
			currency: 'usd',
			items: [{ method_type: 'kelp-sinking', cdr_amount: 80 }],
			client_reference_id: 'order-123',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'POST',
				url: 'v1/cdr/',
			}),
		);
	});

	it('maps certificate.get to GET /v1/certificate/{id}/', async () => {
		mockRequest.mockResolvedValue({
			certificate_id: '2026-001-A1B2C3D4',
			display_name: 'Jane Doe',
			issued_date: '2026-09-01',
			removal_amount_kg: 100,
		});

		await Certificate.get(mockCtx, {
			id: '2026-001-A1B2C3D4',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'v1/certificate/2026-001-A1B2C3D4/',
			}),
		);
	});

	it('maps health.check to GET /health/', async () => {
		mockRequest.mockResolvedValue({ db_up: { default: true } });

		await Health.check(mockCtx, {});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'health/',
			}),
		);
	});
});

describe('cdrplatform zod output validation', () => {
	it('rejects malformed cdr.price output', async () => {
		mockRequest.mockResolvedValue({ total: 42 });

		await expect(
			Cdr.price(mockCtx, {
				weight_unit: 'kg',
				currency: 'usd',
				items: [{ method_type: 'bio-oil', cdr_amount: 50 }],
			}),
		).rejects.toThrow();
	});

	it('accepts documented cdr.price output', () => {
		expect(() =>
			CdrPlatformEndpointOutputSchemas.price.parse(validPriceResponse),
		).not.toThrow();
	});
});

describe('cdrplatform error handling', () => {
	it('classifies 429 rate limit errors and preserves retryAfter', async () => {
		const err = new Error('rate_limited 429');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(err)).toBe(true);
		const handled = await errorHandlers.RATE_LIMIT_ERROR.handler(err);
		expect(handled.maxRetries).toBe(5);
		expect(handled.headersRetryAfterMs).toBeUndefined();
	});
});
