import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Currencies,
	Customers,
	Expenses,
	Invoices,
	Payments,
	Products,
	Profile,
} from './endpoints';
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
		};
		const created = { id: 'inv-99', currency: 'USD' };
		mockRequest.mockResolvedValue({ data: created });

		const res = await Invoices.create(ctx, invoiceInput);
		expect(res.data).toEqual(created);
		expect(mockRequest).toHaveBeenCalledWith('/invoices', 'test-api-key', {
			method: 'POST',
			body: invoiceInput,
		});
		expect(mockLogEvent).toHaveBeenCalledWith(
			ctx,
			'finmei.invoices.create',
			{ id: 'inv-99', currency: 'USD' },
			'completed',
		);
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

		const res = await Invoices.update(ctx, { id: 'inv-123', currency: 'EUR' });
		expect(res.data.currency).toBe('EUR');
		expect(mockRequest).toHaveBeenCalledWith(
			'/invoices/inv-123',
			'test-api-key',
			{
				method: 'PUT',
				body: { currency: 'EUR' },
			},
		);
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

	it('expenses.create sends JSON when no file is present', async () => {
		const input = {
			seller: 'Acme',
			total: 50,
			currency: 'USD',
			date: '2024-03-01',
		};
		mockRequest.mockResolvedValue({ data: { id: 'exp-1', ...input } });

		const res = await Expenses.create(ctx, input);
		expect(res.data.id).toBe('exp-1');
		expect(mockRequest).toHaveBeenCalledWith('/expenses', 'test-api-key', {
			method: 'POST',
			body: input,
		});
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

		const res = await Expenses.update(ctx, { id: 'exp-1', total: 30 });
		expect(res.data.total).toBe(30);
		expect(mockRequest).toHaveBeenCalledWith(
			'/expenses/exp-1',
			'test-api-key',
			{
				method: 'PUT',
				body: { total: 30 },
			},
		);
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

describe('Customers endpoints', () => {
	it('customers.list sends GET /customers with query', async () => {
		mockRequest.mockResolvedValue({ data: [{ id: 'cust-1', name: 'Alice' }] });

		const res = await Customers.list(ctx, { search: 'Alice' });
		expect(res.data.length).toBe(1);
		expect(mockRequest).toHaveBeenCalledWith('/customers', 'test-api-key', {
			method: 'GET',
			query: { search: 'Alice' },
		});
	});

	it('customers.create sends POST /customers', async () => {
		mockRequest.mockResolvedValue({ data: { id: 'cust-1', name: 'Bob' } });

		const res = await Customers.create(ctx, { name: 'Bob' });
		expect(res.data.id).toBe('cust-1');
		expect(mockRequest).toHaveBeenCalledWith('/customers', 'test-api-key', {
			method: 'POST',
			body: { name: 'Bob' },
		});
	});

	it('customers.get sends GET /customers/:id', async () => {
		mockRequest.mockResolvedValue({ data: { id: 'cust-1', name: 'Bob' } });

		const res = await Customers.get(ctx, { id: 'cust-1' });
		expect(res.data.id).toBe('cust-1');
		expect(mockRequest).toHaveBeenCalledWith(
			'/customers/cust-1',
			'test-api-key',
			{
				method: 'GET',
			},
		);
	});

	it('customers.update sends PUT /customers/:id', async () => {
		mockRequest.mockResolvedValue({ data: { id: 'cust-1', name: 'Bobby' } });

		const res = await Customers.update(ctx, { id: 'cust-1', name: 'Bobby' });
		expect(res.data.name).toBe('Bobby');
		expect(mockRequest).toHaveBeenCalledWith(
			'/customers/cust-1',
			'test-api-key',
			{
				method: 'PUT',
				body: { name: 'Bobby' },
			},
		);
	});

	it('customers.delete sends DELETE /customers/:id', async () => {
		mockRequest.mockResolvedValue({ success: true });

		const res = await Customers.delete(ctx, { id: 'cust-1' });
		expect(res).toEqual({ success: true });
		expect(mockRequest).toHaveBeenCalledWith(
			'/customers/cust-1',
			'test-api-key',
			{
				method: 'DELETE',
			},
		);
	});
});

describe('Products endpoints', () => {
	it('products.list sends GET /products with filters', async () => {
		mockRequest.mockResolvedValue({
			data: [{ id: 'prod-1', name: 'Widget', price: 10, currency: 'USD' }],
		});

		const res = await Products.list(ctx, { status: 'active' });
		expect(res.data.length).toBe(1);
		expect(mockRequest).toHaveBeenCalledWith('/products', 'test-api-key', {
			method: 'GET',
			query: { status: 'active' },
		});
	});

	it('products.create sends POST /products', async () => {
		const productData = { name: 'Widget', price: 10, currency: 'USD' };
		mockRequest.mockResolvedValue({ data: { id: 'prod-1', ...productData } });

		const res = await Products.create(ctx, productData);
		expect(res.data.id).toBe('prod-1');
		expect(mockRequest).toHaveBeenCalledWith('/products', 'test-api-key', {
			method: 'POST',
			body: productData,
		});
	});

	it('products.get sends GET /products/:id', async () => {
		mockRequest.mockResolvedValue({
			data: { id: 'prod-1', name: 'Widget', price: 10, currency: 'USD' },
		});

		const res = await Products.get(ctx, { id: 'prod-1' });
		expect(res.data.id).toBe('prod-1');
		expect(mockRequest).toHaveBeenCalledWith(
			'/products/prod-1',
			'test-api-key',
			{
				method: 'GET',
			},
		);
	});

	it('products.update sends PUT /products/:id', async () => {
		mockRequest.mockResolvedValue({
			data: { id: 'prod-1', name: 'Super Widget', price: 15, currency: 'USD' },
		});

		const res = await Products.update(ctx, {
			id: 'prod-1',
			name: 'Super Widget',
			price: 15,
		});
		expect(res.data.price).toBe(15);
		expect(mockRequest).toHaveBeenCalledWith(
			'/products/prod-1',
			'test-api-key',
			{
				method: 'PUT',
				body: { name: 'Super Widget', price: 15 },
			},
		);
	});

	it('products.delete sends DELETE /products/:id', async () => {
		mockRequest.mockResolvedValue({ success: true });

		const res = await Products.delete(ctx, { id: 'prod-1' });
		expect(res).toEqual({ success: true });
		expect(mockRequest).toHaveBeenCalledWith(
			'/products/prod-1',
			'test-api-key',
			{
				method: 'DELETE',
			},
		);
	});
});

describe('Payments endpoints', () => {
	it('payments.list sends GET /payments', async () => {
		mockRequest.mockResolvedValue({
			data: [{ id: 'pay-1', amount: 100, currency: 'USD' }],
		});

		const res = await Payments.list(ctx, { status: 'completed' });
		expect(res.data.length).toBe(1);
		expect(mockRequest).toHaveBeenCalledWith('/payments', 'test-api-key', {
			method: 'GET',
			query: { status: 'completed' },
		});
	});

	it('payments.create sends POST /payments', async () => {
		const paymentData = {
			amount: 100,
			currency: 'USD',
			status: 'completed' as const,
		};
		mockRequest.mockResolvedValue({ data: { id: 'pay-1', ...paymentData } });

		const res = await Payments.create(ctx, paymentData);
		expect(res.data.id).toBe('pay-1');
		expect(mockRequest).toHaveBeenCalledWith('/payments', 'test-api-key', {
			method: 'POST',
			body: paymentData,
		});
	});

	it('payments.get sends GET /payments/:id', async () => {
		mockRequest.mockResolvedValue({
			data: { id: 'pay-1', amount: 100, currency: 'USD' },
		});

		const res = await Payments.get(ctx, { id: 'pay-1' });
		expect(res.data.id).toBe('pay-1');
		expect(mockRequest).toHaveBeenCalledWith(
			'/payments/pay-1',
			'test-api-key',
			{
				method: 'GET',
			},
		);
	});

	it('payments.delete sends DELETE /payments/:id', async () => {
		mockRequest.mockResolvedValue({ success: true });

		const res = await Payments.delete(ctx, { id: 'pay-1' });
		expect(res).toEqual({ success: true });
		expect(mockRequest).toHaveBeenCalledWith(
			'/payments/pay-1',
			'test-api-key',
			{
				method: 'DELETE',
			},
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
