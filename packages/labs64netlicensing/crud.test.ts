import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import type { NetLicensingContext } from './context';
import {
	Licensees,
	Licenses,
	LicenseTemplates,
	ProductModules,
	Products,
	Transactions,
} from './endpoints';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = jest.mocked(request);

function ctx(db?: NetLicensingContext['db']): NetLicensingContext {
	// unknown: the endpoints read only `key` and `db` from the context.
	return { key: 'k3y', db } as unknown as NetLicensingContext;
}

// The response shape go.netlicensing.io returns (trimmed from a demo call).
function oneItem(type: string, props: Record<string, string>) {
	return {
		signature: null,
		infos: { info: [] },
		items: {
			item: [
				{
					type,
					property: Object.entries(props).map(([name, value]) => ({
						value,
						name,
					})),
					list: [],
				},
			],
		},
		id: null,
		ttl: null,
	};
}

function sent() {
	const [config, options] = mockRequest.mock.calls[0] ?? [];
	return {
		auth: (config?.HEADERS as Record<string, string>).Authorization,
		method: options?.method,
		url: options?.url,
		query: options?.query,
		form: options?.body
			? Object.fromEntries(new URLSearchParams(String(options.body)).entries())
			: undefined,
		mediaType: options?.mediaType,
	};
}

beforeEach(() => {
	jest.clearAllMocks();
});

// [endpoint, input, method, url, expected form]
const writes: [
	string,
	(c: NetLicensingContext, i: never) => Promise<unknown>,
	Record<string, unknown>,
	string,
	string,
	Record<string, string> | undefined,
][] = [
	[
		'products.create',
		Products.create,
		{ name: 'App', version: '1.0', licenseeAutoCreate: true },
		'POST',
		'/product',
		{ name: 'App', version: '1.0', licenseeAutoCreate: 'true' },
	],
	[
		'products.update',
		Products.update,
		{ productNumber: 'P 1', active: false, customProperties: { crm: 'x' } },
		'POST',
		'/product/P%201',
		{ active: 'false', crm: 'x' },
	],
	[
		'productModules.create',
		ProductModules.create,
		{ productNumber: 'P1', name: 'Core', licensingModel: 'Subscription' },
		'POST',
		'/productmodule',
		{ productNumber: 'P1', name: 'Core', licensingModel: 'Subscription' },
	],
	[
		'productModules.update',
		ProductModules.update,
		{ productModuleNumber: 'M1', name: 'Core 2' },
		'POST',
		'/productmodule/M1',
		{ name: 'Core 2' },
	],
	[
		'licenseTemplates.create',
		LicenseTemplates.create,
		{
			productModuleNumber: 'M1',
			name: 'Monthly',
			licenseType: 'TIMEVOLUME',
			timeVolume: '1',
			timeVolumePeriod: 'MONTH',
			price: '0',
		},
		'POST',
		'/licensetemplate',
		{
			productModuleNumber: 'M1',
			name: 'Monthly',
			licenseType: 'TIMEVOLUME',
			timeVolume: '1',
			timeVolumePeriod: 'MONTH',
			price: '0',
		},
	],
	[
		'licenseTemplates.update',
		LicenseTemplates.update,
		{ licenseTemplateNumber: 'E1', hidden: true },
		'POST',
		'/licensetemplate/E1',
		{ hidden: 'true' },
	],
	[
		'licensees.create',
		Licensees.create,
		{ productNumber: 'P1', name: 'Acme' },
		'POST',
		'/licensee',
		{ productNumber: 'P1', name: 'Acme' },
	],
	[
		'licensees.update',
		Licensees.update,
		{ licenseeNumber: 'I1', markedForTransfer: true },
		'POST',
		'/licensee/I1',
		{ markedForTransfer: 'true' },
	],
	[
		'licenses.create',
		Licenses.create,
		{ licenseeNumber: 'I1', licenseTemplateNumber: 'E1', startDate: 'now' },
		'POST',
		'/license',
		{ licenseeNumber: 'I1', licenseTemplateNumber: 'E1', startDate: 'now' },
	],
	[
		'licenses.update',
		Licenses.update,
		{ licenseNumber: 'L1', active: false },
		'POST',
		'/license/L1',
		{ active: 'false' },
	],
];

describe.each(writes)('%s', (_name, endpoint, input, method, url, form) => {
	it('sends a form-encoded POST with Basic apiKey auth and returns the item', async () => {
		mockRequest.mockResolvedValueOnce(
			oneItem('X', { number: 'N1', active: 'true', name: 'Thing' }),
		);
		const result = await endpoint(ctx(), input as never);
		const call = sent();
		expect(call.method).toBe(method);
		expect(call.url).toBe(url);
		expect(call.mediaType).toBe('application/x-www-form-urlencoded');
		expect(call.form).toEqual(form);
		expect(call.auth).toBe(
			`Basic ${Buffer.from('apiKey:k3y').toString('base64')}`,
		);
		expect(result).toMatchObject({
			item: { number: 'N1', active: true, name: 'Thing' },
		});
	});
});

describe('product discounts', () => {
	it('repeats the discount field and returns nested lists', async () => {
		mockRequest.mockResolvedValueOnce({
			items: {
				item: [
					{
						type: 'Product',
						property: [{ name: 'number', value: 'P1' }],
						list: [
							{
								name: 'discount',
								property: [
									{ name: 'totalPrice', value: '100.00' },
									{ name: 'amountPercent', value: '10' },
								],
								list: [],
							},
						],
					},
				],
			},
		});
		const result = await Products.create(ctx(), {
			name: 'App',
			discount: ['100;EUR;10%', '10;EUR;1'],
		});
		expect(
			new URLSearchParams(String(mockRequest.mock.calls[0]?.[1].body)).getAll(
				'discount',
			),
		).toEqual(['100;EUR;10%', '10;EUR;1']);
		expect(result.item.lists?.[0]).toEqual({
			name: 'discount',
			properties: { totalPrice: '100.00', amountPercent: '10' },
		});
	});
});

describe('reads', () => {
	it.each([
		['products.get', Products.get, { productNumber: 'P/1' }, '/product/P%2F1'],
		[
			'productModules.get',
			ProductModules.get,
			{ productModuleNumber: 'M1' },
			'/productmodule/M1',
		],
		[
			'licenseTemplates.get',
			LicenseTemplates.get,
			{ licenseTemplateNumber: 'E1' },
			'/licensetemplate/E1',
		],
		['licensees.get', Licensees.get, { licenseeNumber: 'I1' }, '/licensee/I1'],
		['licenses.get', Licenses.get, { licenseNumber: 'L1' }, '/license/L1'],
		[
			'transactions.get',
			Transactions.get,
			{ transactionNumber: 'T1' },
			'/transaction/T1',
		],
	] as const)('%s GETs %s', async (_n, endpoint, input, url) => {
		mockRequest.mockResolvedValueOnce(oneItem('X', { number: 'N1' }));
		const result = await (
			endpoint as (c: NetLicensingContext, i: never) => Promise<unknown>
		)(ctx(), input as never);
		expect(sent().method).toBe('GET');
		expect(sent().url).toBe(url);
		expect(result).toMatchObject({ item: { number: 'N1' } });
	});

	it.each([
		['productModules.list', ProductModules.list, '/productmodule'],
		['licenseTemplates.list', LicenseTemplates.list, '/licensetemplate'],
		['licensees.list', Licensees.list, '/licensee'],
		['transactions.list', Transactions.list, '/transaction'],
	] as const)('%s GETs %s with paging', async (_n, endpoint, url) => {
		mockRequest.mockResolvedValueOnce({
			items: {
				item: [{ type: 'X', property: [{ name: 'number', value: 'A' }] }],
				pagenumber: '0',
				itemsnumber: '1',
				totalpages: '3',
				totalitems: '3',
				hasnext: 'true',
			},
		});
		const result = await endpoint(ctx(), { filter: 'page=0;items=1' });
		expect(sent().url).toBe(url);
		expect(sent().query).toEqual({ filter: 'page=0;items=1' });
		expect(result).toEqual({
			items: [{ type: 'X', number: 'A', properties: { number: 'A' } }],
			page: { pageNumber: 0, totalPages: 3, totalItems: 3, hasNext: true },
		});
	});

	it('keeps paging on the original licenses and products lists', async () => {
		mockRequest.mockResolvedValueOnce({
			items: {
				item: [
					{ type: 'License', property: [{ name: 'number', value: 'L1' }] },
				],
				pagenumber: '0',
				totalpages: '2',
				totalitems: '150',
				hasnext: 'true',
			},
		});
		const result = await Licenses.list(ctx(), { filter: 'page=0;items=100' });
		expect(result.page).toEqual({
			pageNumber: 0,
			totalPages: 2,
			totalItems: 150,
			hasNext: true,
		});
	});

	it.each([
		['an HTML error page', '<html>bad gateway</html>'],
		['an object without items', { error: 'x' }],
	])('fails on %s instead of returning nothing', async (_n, body) => {
		mockRequest.mockResolvedValueOnce(body);
		await expect(Licensees.list(ctx(), {})).rejects.toThrow(
			'unexpected response',
		);
		mockRequest.mockResolvedValueOnce(body);
		await expect(Products.list(ctx(), {})).rejects.toThrow(
			'unexpected response',
		);
	});

	it('returns an empty list when NetLicensing sends no items', async () => {
		mockRequest.mockResolvedValueOnce({ items: { item: [] } });
		const result = await Licensees.list(ctx(), {});
		expect(result.items).toEqual([]);
	});

	it('stores a fetched product and license locally', async () => {
		const products = { upsertByEntityId: jest.fn() };
		const licenses = { upsertByEntityId: jest.fn() };
		const db = { products, licenses } as unknown as NetLicensingContext['db'];
		mockRequest.mockResolvedValueOnce(
			oneItem('Product', {
				number: 'P1',
				active: 'true',
				name: 'App',
				version: '2',
			}),
		);
		await Products.get(ctx(db), { productNumber: 'P1' });
		expect(products.upsertByEntityId).toHaveBeenCalledWith('P1', {
			number: 'P1',
			active: true,
			name: 'App',
			version: '2',
		});
		mockRequest.mockResolvedValueOnce(
			oneItem('License', { number: 'L1', active: 'false' }),
		);
		await Licenses.get(ctx(db), { licenseNumber: 'L1' });
		expect(licenses.upsertByEntityId).toHaveBeenCalledWith('L1', {
			number: 'L1',
			active: false,
		});
	});
});

describe('deletes', () => {
	it.each([
		[
			'products.delete',
			Products.delete,
			{ productNumber: 'P1' },
			'/product/P1',
		],
		[
			'productModules.delete',
			ProductModules.delete,
			{ productModuleNumber: 'M1' },
			'/productmodule/M1',
		],
		[
			'licenseTemplates.delete',
			LicenseTemplates.delete,
			{ licenseTemplateNumber: 'E1' },
			'/licensetemplate/E1',
		],
		[
			'licensees.delete',
			Licensees.delete,
			{ licenseeNumber: 'I1' },
			'/licensee/I1',
		],
		[
			'licenses.delete',
			Licenses.delete,
			{ licenseNumber: 'L1' },
			'/license/L1',
		],
	] as const)('%s sends DELETE %s', async (_n, endpoint, input, url) => {
		mockRequest.mockResolvedValueOnce(undefined);
		const result = await (
			endpoint as (c: NetLicensingContext, i: never) => Promise<unknown>
		)(ctx(), { ...input, forceCascade: true } as never);
		expect(sent().method).toBe('DELETE');
		expect(sent().url).toBe(url);
		expect(sent().query).toEqual({ forceCascade: 'true' });
		expect(result).toMatchObject({ deleted: true });
	});

	it('removes the local row only after NetLicensing confirms', async () => {
		const products = { deleteByEntityId: jest.fn() };
		const db = { products } as unknown as NetLicensingContext['db'];
		mockRequest.mockRejectedValueOnce(new Error('400'));
		await expect(
			Products.delete(ctx(db), { productNumber: 'P1' }),
		).rejects.toThrow();
		expect(products.deleteByEntityId).not.toHaveBeenCalled();
		mockRequest.mockResolvedValueOnce(undefined);
		await Products.delete(ctx(db), { productNumber: 'P1' });
		expect(products.deleteByEntityId).toHaveBeenCalledWith('P1');
		expect(sent().query).toEqual({ forceCascade: undefined });
	});
});

describe('licensees.validate and transfer', () => {
	it('validates with module parameters and returns ttl and validations', async () => {
		mockRequest.mockResolvedValueOnce({
			items: {
				item: [
					{
						type: 'ProductModuleValidation',
						property: [
							{ name: 'productModuleNumber', value: 'M011' },
							{ name: 'licensingModel', value: 'Rental' },
						],
						list: [
							{ name: 'L011', property: [{ name: 'valid', value: 'false' }] },
						],
					},
				],
			},
			ttl: '2026-10-30T15:02:36.137Z',
		});
		const result = await Licensees.validate(ctx(), {
			licenseeNumber: 'I011',
			dryRun: true,
			parameters: {
				productModuleNumber: 'M011',
				sessionId: 'abc',
				action: 'checkOut',
			},
		});
		expect(sent().method).toBe('POST');
		expect(sent().url).toBe('/licensee/I011/validate');
		expect(sent().form).toEqual({
			productModuleNumber: 'M011',
			sessionId: 'abc',
			action: 'checkOut',
			dryRun: 'true',
		});
		expect(result.ttl).toBe('2026-10-30T15:02:36.137Z');
		expect(result.validations[0]?.lists?.[0]).toEqual({
			name: 'L011',
			properties: { valid: 'false' },
		});
	});

	it('transfers licenses from the source licensee', async () => {
		mockRequest.mockResolvedValueOnce(undefined);
		const result = await Licensees.transfer(ctx(), {
			licenseeNumber: 'I011',
			sourceLicenseeNumber: 'ISRC',
		});
		expect(sent().url).toBe('/licensee/I011/transfer');
		expect(sent().form).toEqual({ sourceLicenseeNumber: 'ISRC' });
		expect(result).toEqual({
			transferred: true,
			licenseeNumber: 'I011',
			sourceLicenseeNumber: 'ISRC',
		});
	});
});

describe('errors', () => {
	it('drops the form body from a failed write and keeps the ApiError', async () => {
		const error = new ApiError(
			{ method: 'POST', url: '/licensee', body: 'name=Jane+Doe' },
			{
				url: 'https://go.netlicensing.io/core/v2/rest/licensee',
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body: { infos: { info: [{ value: 'Bad input', type: 'ERROR' }] } },
			},
			'Bad Request',
		);
		mockRequest.mockRejectedValueOnce(error);
		const caught = await Licensees.create(ctx(), {
			productNumber: 'P1',
			name: 'Jane Doe',
		}).catch(
			// unknown: a promise can reject with any value; checked below.
			(e: unknown) => e,
		);
		expect(caught).toBe(error);
		expect(JSON.stringify((caught as ApiError).request)).not.toContain('Jane');
		expect((caught as ApiError).message).toBe('Bad Request: Bad input');
	});

	it('rejects a create without its required fields before sending', async () => {
		await expect(
			ProductModules.create(ctx(), { productNumber: 'P1' } as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
		expect(logEventFromContext).not.toHaveBeenCalled();
	});
});
