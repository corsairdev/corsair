import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { Currencies, Expenses, Invoices, Profile } from './endpoints';
import type { FinmeiContext } from './index';
import { finmei, finmeiEndpointSchemas } from './index';

jest.mock('corsair/core', () => {
	// `unknown` because jest.requireActual returns untyped module exports.
	const actual: Record<string, unknown> = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	// `unknown` because jest.requireActual returns untyped module exports.
	const actual: Record<string, unknown> = jest.requireActual('./client');
	return {
		...actual,
		makeFinmeiRequest: jest.fn(),
		makeFinmeiBinaryRequest: jest.fn(),
	};
});

const mockRequest = jest.mocked(client.makeFinmeiRequest);
const mockBinaryRequest = jest.mocked(client.makeFinmeiBinaryRequest);
const mockLogEvent = jest.mocked(logEventFromContext);

function buildCtx(): FinmeiContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}

const ctx = buildCtx();

beforeEach(() => {
	mockRequest.mockReset();
	mockBinaryRequest.mockReset();
	mockLogEvent.mockReset();
});

describe('Finmei plugin structure and registration', () => {
	it('instantiates plugin and ensures schemas and metadata are in sync', () => {
		const plugin = finmei({ key: 'test-key' });
		expect(plugin.id).toBe('finmei');
		expect(plugin.endpoints).toBeDefined();

		const schemaKeys = Object.keys(finmeiEndpointSchemas);
		const metaKeys = Object.keys(plugin.endpointMeta ?? {});
		expect(schemaKeys.sort()).toEqual(metaKeys.sort());
	});

	it('exposes only the resources the Finmei API serves', () => {
		// app.finmei.com/api answers 404 "route could not be found" for
		// /customers, /products and /payments, so the plugin must not offer them.
		const plugin = finmei({ key: 'test-key' });
		expect(Object.keys(plugin.endpoints ?? {}).sort()).toEqual([
			'currencies',
			'expenses',
			'invoices',
			'profile',
		]);
	});

	it('keyBuilder retrieves API key or throws AuthMissingError', async () => {
		const plugin = finmei({ key: 'custom-key' });
		const keyCtx = {
			authType: 'api_key' as const,
			keys: ctx.keys,
		};

		expect(plugin.keyBuilder).toBeDefined();
		if (plugin.keyBuilder) {
			const key = await plugin.keyBuilder(keyCtx as never, 'endpoint');
			expect(key).toBe('custom-key');
		}
	});
});

describe('Invoices endpoints', () => {
	it('invoices.list sends GET /invoices with query and logs safely', async () => {
		const mockInvoices = [
			{ id: 'inv-1', currency: 'USD', subtotal: 100 },
			{ id: 'inv-2', currency: 'EUR', subtotal: 200 },
		];
		mockRequest.mockResolvedValue({ data: mockInvoices });

		const res = await Invoices.list(ctx, { page: 1, per_page: 10 });
		expect(res.data).toEqual(mockInvoices);
		expect(mockRequest).toHaveBeenCalledWith('/invoices', 'test-api-key', {
			method: 'GET',
			query: { page: 1, per_page: 10 },
		});
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'finmei.invoices.list',
			{ count: 2, page: 1 },
			'completed',
		);
	});

	it('invoices.create sends POST /invoices with body and logs safely', async () => {
		const invoiceInput = {
			type: 'vat_invoice' as const,
			currency: 'USD',
			invoice_date: '2024-05-01',
			series: 'FIN',
			buyer: { type: 'company' as const, company_name: 'Acme Corp' },
			products: [
				{ name: 'Consulting', units: 'hours', quantity: 2, price: 50 },
			],
		};
		const created = { id: 'inv-99', currency: 'USD' };
		mockRequest.mockResolvedValue({ data: created });

		const res = await Invoices.create(ctx, invoiceInput);
		expect(res.data).toEqual(created);
		// Finmei answers 422 "seller field is required" unless this flag is sent
		expect(mockRequest).toHaveBeenCalledWith('/invoices', 'test-api-key', {
			method: 'POST',
			body: { ...invoiceInput, use_default_seller_info: true },
		});
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'finmei.invoices.create',
			{ id: 'inv-99', currency: 'USD' },
			'completed',
		);
	});

	it('invoices.create keeps individual seller and buyer fields in the body', async () => {
		const invoiceInput = {
			type: 'regular_invoice' as const,
			currency: 'EUR',
			invoice_date: '2024-05-01',
			series: 'FIN',
			invoice_number: 12,
			use_default_seller_info: false,
			seller: {
				first_name: 'Jane',
				last_name: 'Roe',
				individual_tax_id: 'TAX-1',
			},
			buyer: {
				type: 'individual' as const,
				first_name: 'John',
				last_name: 'Doe',
				individual_tax_id: 'TAX-2',
			},
			products: [{ name: 'Design', units: 'pcs', quantity: 1, price: 10 }],
		};
		mockRequest.mockResolvedValue({ data: { id: 'inv-7', currency: 'EUR' } });

		await Invoices.create(ctx, invoiceInput);
		expect(mockRequest).toHaveBeenCalledWith('/invoices', 'test-api-key', {
			method: 'POST',
			body: invoiceInput,
		});
	});

	it('invoices.get sends GET /invoices/:id', async () => {
		mockRequest.mockResolvedValue({ data: { id: 'inv-123', currency: 'USD' } });

		const res = await Invoices.get(ctx, { id: 'inv-123' });
		expect(res.data.id).toBe('inv-123');
		expect(mockRequest).toHaveBeenCalledWith(
			'/invoices/inv-123',
			'test-api-key',
			{
				method: 'GET',
			},
		);
	});

	it('invoices.update sends PUT /invoices/:id', async () => {
		mockRequest.mockResolvedValue({ data: { id: 'inv-123', currency: 'EUR' } });
		const fields = {
			type: 'regular_invoice' as const,
			invoice_date: '2024-05-01',
			series: 'FIN',
			currency: 'EUR',
			payment_status: 'paid' as const,
			buyer: { type: 'company' as const, company_name: 'Acme Corp' },
			products: [{ name: 'Design', units: 'pcs', quantity: 1, price: 10 }],
		};

		const res = await Invoices.update(ctx, { id: 'inv-123', ...fields });
		expect(res.data.currency).toBe('EUR');
		expect(mockRequest).toHaveBeenCalledWith(
			'/invoices/inv-123',
			'test-api-key',
			{
				method: 'PUT',
				body: { ...fields, use_default_seller_info: true },
			},
		);
	});

	it('invoices.update rejects a partial body, since PUT replaces the invoice', async () => {
		// Live: Finmei answered 422 for type, invoice_date, series, currency, ...
		await expect(
			Invoices.update(ctx, { id: 'inv-123', payment_status: 'paid' } as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('invoices.delete accepts the empty 200 body Finmei returns', async () => {
		mockRequest.mockResolvedValue('' as never);

		const res = await Invoices.delete(ctx, { id: 'inv-123' });
		expect(res).toBeNull();
	});

	it('invoices.delete sends DELETE /invoices/:id', async () => {
		mockRequest.mockResolvedValue({ success: true });

		const res = await Invoices.delete(ctx, { id: 'inv-123' });
		expect(res).toEqual({ success: true });
		expect(mockRequest).toHaveBeenCalledWith(
			'/invoices/inv-123',
			'test-api-key',
			{
				method: 'DELETE',
			},
		);
	});

	it('invoices.download downloads binary invoice PDF', async () => {
		mockBinaryRequest.mockResolvedValue({
			kind: 'binary',
			contentType: 'application/pdf',
			base64: 'JVBERi0xLjQ...',
			size: 2048,
		});

		const res = await Invoices.download(ctx, { id: 'inv-123' });
		expect(res.kind).toBe('binary');
		expect(res.contentType).toBe('application/pdf');
		expect(mockBinaryRequest).toHaveBeenCalledWith(
			'/invoices/inv-123/download',
			'test-api-key',
		);
	});

	it('rejects invalid inputs with ZodError before making request', async () => {
		await expect(Invoices.get(ctx, { id: '' })).rejects.toThrow();
		await expect(
			Invoices.create(ctx, { currency: 'USD', extra_field: 123 } as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('Expenses endpoints', () => {
	it('expenses.list sends GET /expenses', async () => {
		mockRequest.mockResolvedValue({
			data: [{ id: 'exp-1', total: 10, currency: 'USD' }],
		});

		const res = await Expenses.list(ctx, { page: 1 });
		expect(res.data.length).toBe(1);
		expect(mockRequest).toHaveBeenCalledWith('/expenses', 'test-api-key', {
			method: 'GET',
			query: { page: 1 },
		});
	});

	it('expenses.create rejects input without the bill file Finmei requires', async () => {
		await expect(
			Expenses.create(ctx, {
				seller: 'Acme',
				total: 50,
				currency: 'USD',
				date: '2024-03-01',
			} as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('expenses.create sends formData when base64 file is attached', async () => {
		const input = {
			seller: 'Acme',
			total: 50,
			currency: 'USD',
			date: '2024-03-01',
			file: 'c2FtcGxl',
		};
		mockRequest.mockResolvedValue({
			data: { id: 'exp-2', seller: 'Acme', total: 50, currency: 'USD' },
		});

		const res = await Expenses.create(ctx, input);
		expect(res.data.id).toBe('exp-2');
		expect(mockRequest).toHaveBeenCalledWith(
			'/expenses',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				formData: expect.objectContaining({
					seller: 'Acme',
					total: '50',
					currency: 'USD',
					date: '2024-03-01',
				}),
			}),
		);
		// Finmei rejects an upload whose name has no allowed extension ("blob")
		const sent = mockRequest.mock.calls[0]?.[2]?.formData?.file as File;
		expect(sent).toBeInstanceOf(File);
		expect(sent.name).toBe('expense.pdf');
		expect(sent.type).toBe('application/pdf');
	});

	it('expenses.updateFile names the upload after its type or the given name', async () => {
		mockRequest.mockResolvedValue({
			data: { id: 'exp-1', total: 10, currency: 'USD' },
		});

		await Expenses.updateFile(ctx, {
			id: 'exp-1',
			file: 'c2FtcGxl',
			fileType: 'image/png',
		});
		await Expenses.updateFile(ctx, {
			id: 'exp-1',
			file: 'c2FtcGxl',
			fileType: 'application/octet-stream',
			fileName: 'bill.xlsx',
		});
		const first = mockRequest.mock.calls[0]?.[2]?.formData?.file as File;
		const second = mockRequest.mock.calls[1]?.[2]?.formData?.file as File;
		expect(first.name).toBe('expense.png');
		expect(second.name).toBe('bill.xlsx');
	});

	it('expenses.get sends GET /expenses/:id', async () => {
		mockRequest.mockResolvedValue({
			data: { id: 'exp-1', total: 20, currency: 'USD' },
		});

		const res = await Expenses.get(ctx, { id: 'exp-1' });
		expect(res.data.id).toBe('exp-1');
		expect(mockRequest).toHaveBeenCalledWith(
			'/expenses/exp-1',
			'test-api-key',
			{
				method: 'GET',
			},
		);
	});

	it('expenses.update sends PUT /expenses/:id', async () => {
		mockRequest.mockResolvedValue({
			data: { id: 'exp-1', total: 30, currency: 'USD' },
		});

		const fields = {
			seller: 'Acme',
			total: 30,
			currency: 'USD',
			date: '2024-03-01',
		};
		const res = await Expenses.update(ctx, { id: 'exp-1', ...fields });
		expect(res.data.total).toBe(30);
		expect(mockRequest).toHaveBeenCalledWith(
			'/expenses/exp-1',
			'test-api-key',
			{
				method: 'PUT',
				body: fields,
			},
		);
	});

	it('expenses.update rejects a partial body, since PUT replaces the expense', async () => {
		// Live: Finmei answered 422 "This field is required" for currency, seller, date
		await expect(
			Expenses.update(ctx, { id: 'exp-1', total: 30 } as never),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('expenses.delete accepts the empty 200 body Finmei returns', async () => {
		mockRequest.mockResolvedValue('' as never);

		const res = await Expenses.delete(ctx, { id: 'exp-1' });
		expect(res).toBeNull();
	});

	it('expenses.delete sends DELETE /expenses/:id', async () => {
		mockRequest.mockResolvedValue({ success: true });

		const res = await Expenses.delete(ctx, { id: 'exp-1' });
		expect(res).toEqual({ success: true });
		expect(mockRequest).toHaveBeenCalledWith(
			'/expenses/exp-1',
			'test-api-key',
			{
				method: 'DELETE',
			},
		);
	});

	it('expenses.updateFile sends POST /expenses/:id/file with formData', async () => {
		mockRequest.mockResolvedValue({
			data: { id: 'exp-1', total: 10, currency: 'USD' },
		});

		const res = await Expenses.updateFile(ctx, {
			id: 'exp-1',
			file: 'c2FtcGxl',
		});
		expect(res.data.id).toBe('exp-1');
		expect(mockRequest).toHaveBeenCalledWith(
			'/expenses/exp-1/file',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				formData: expect.objectContaining({
					file: expect.any(Blob),
				}),
			}),
		);
	});

	it('expenses.download downloads binary expense receipt', async () => {
		mockBinaryRequest.mockResolvedValue({
			kind: 'binary',
			contentType: 'image/png',
			base64: 'iVBORw0KGgo...',
			size: 512,
		});

		const res = await Expenses.download(ctx, { id: 'exp-1' });
		expect(res.kind).toBe('binary');
		expect(res.contentType).toBe('image/png');
		expect(mockBinaryRequest).toHaveBeenCalledWith(
			'/expenses/exp-1/download',
			'test-api-key',
		);
	});
});

describe('Currencies and Profile endpoints', () => {
	it('currencies.list sends GET /currencies', async () => {
		mockRequest.mockResolvedValue({
			data: [{ code: 'USD', title: 'US Dollar' }],
		});

		const res = await Currencies.list(ctx, {});
		expect(res.data.length).toBe(1);
		expect(mockRequest).toHaveBeenCalledWith('/currencies', 'test-api-key', {
			method: 'GET',
		});
	});

	it('profile.get sends GET /profile', async () => {
		mockRequest.mockResolvedValue({
			data: { business_id: 'biz-1', business_title: 'My Business' },
		});

		const res = await Profile.get(ctx, {});
		expect(res.data.business_id).toBe('biz-1');
		expect(mockRequest).toHaveBeenCalledWith('/profile', 'test-api-key', {
			method: 'GET',
		});
	});
});
