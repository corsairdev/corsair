import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { NetLicensingContext } from './context';
import { listLicenses, listProducts } from './endpoints/list';

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

const mockRequest = jest.mocked(request);
const mockLog = jest.mocked(logEventFromContext);

function context(
	key: string,
	db?: NetLicensingContext['db'],
): NetLicensingContext {
	// unknown: the endpoints read only `key` and `db`; a full context is not needed.
	return { key, db } as unknown as NetLicensingContext;
}

const LICENSE_BODY = {
	items: {
		item: [
			{
				type: 'License',
				property: [
					{ name: 'number', value: 'L001' },
					{ name: 'active', value: 'true' },
					{ name: 'CustomProperty', value: 'secret-prop' },
				],
			},
			{
				type: 'License',
				property: { name: 'active', value: 'false' },
			},
		],
	},
};

describe('licenses.list', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('stores numbered licenses and sends Basic apiKey auth', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue(LICENSE_BODY);
		const result = await listLicenses(
			context('sekrit', {
				licenses: { upsertByEntityId: upsert },
				// unknown: a fake table with only the methods the endpoint calls.
			} as unknown as NetLicensingContext['db']),
			{ filter: 'page=0;items=50' },
		);
		expect(result.licenses).toEqual([{ number: 'L001', active: true }]);
		expect(upsert).toHaveBeenCalledTimes(1);
		expect(upsert).toHaveBeenCalledWith('L001', {
			number: 'L001',
			active: true,
		});
		expect(JSON.stringify(upsert.mock.calls)).not.toContain('secret-prop');
		const config = mockRequest.mock.calls[0]?.[0];
		expect(config?.BASE).toBe('https://go.netlicensing.io/core/v2/rest');
		expect(config?.TOKEN).toBeUndefined();
		expect(config?.HEADERS).toEqual(
			expect.objectContaining({
				Accept: 'application/json',
				Authorization: `Basic ${Buffer.from('apiKey:sekrit', 'utf8').toString('base64')}`,
			}),
		);
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/license',
			query: { filter: 'page=0;items=50' },
		});
		expect(mockLog.mock.calls[0]?.[2]).toEqual({ count: 1 });
		expect(JSON.stringify(mockLog.mock.calls[0]?.[2])).not.toContain('sekrit');
	});

	it('returns an empty list when items is null', async () => {
		mockRequest.mockResolvedValue({ items: null });
		const result = await listLicenses(context('sekrit'), {});
		expect(result.licenses).toEqual([]);
	});

	it('reads a single item object', async () => {
		mockRequest.mockResolvedValue({
			items: {
				item: {
					property: [
						{ name: 'number', value: 'L9' },
						{ name: 'active', value: 'false' },
					],
				},
			},
		});
		const result = await listLicenses(context('sekrit'), {});
		expect(result.licenses).toEqual([{ number: 'L9', active: false }]);
	});

	it('throws when the key is missing and does not call the API', async () => {
		await expect(listLicenses(context(''), {})).rejects.toBeInstanceOf(
			AuthMissingError,
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('lets an HTTP 401 ApiError through unchanged', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/license' },
			{
				url: 'https://go.netlicensing.io/core/v2/rest/license',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: { items: null },
			},
			'Unauthorized',
		);
		mockRequest.mockRejectedValue(error);
		await expect(listLicenses(context('sekrit'), {})).rejects.toBe(error);
	});
});

describe('products.list', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('stores number, active, name, and version', async () => {
		const upsert = jest.fn().mockResolvedValue(undefined);
		mockRequest.mockResolvedValue({
			items: {
				item: {
					type: 'Product',
					property: [
						{ name: 'number', value: 'P001' },
						{ name: 'active', value: 'true' },
						{ name: 'name', value: 'Product Numero Uno' },
						{ name: 'version', value: 'v1.0' },
					],
				},
			},
		});
		const result = await listProducts(
			context('sekrit', {
				products: { upsertByEntityId: upsert },
				// unknown: a fake table with only the methods the endpoint calls.
			} as unknown as NetLicensingContext['db']),
			{},
		);
		expect(result.products).toEqual([
			{
				number: 'P001',
				active: true,
				name: 'Product Numero Uno',
				version: 'v1.0',
			},
		]);
		expect(upsert).toHaveBeenCalledWith('P001', result.products[0]);
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/product',
		});
	});
});
