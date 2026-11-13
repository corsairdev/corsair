import {
	FinmeiBinaryResponseSchema,
	FinmeiCreateCustomerInputSchema,
	FinmeiCreateExpenseInputSchema,
	FinmeiCreateInvoiceInputSchema,
	FinmeiCreatePaymentInputSchema,
	FinmeiCreateProductInputSchema,
	FinmeiCustomerOutputSchema,
	FinmeiDeleteResponseSchema,
	FinmeiExpenseOutputSchema,
	FinmeiGetInvoiceInputSchema,
	FinmeiInvoiceOutputSchema,
	FinmeiListCurrenciesOutputSchema,
	FinmeiListCustomersInputSchema,
	FinmeiListCustomersOutputSchema,
	FinmeiListExpensesInputSchema,
	FinmeiListExpensesOutputSchema,
	FinmeiListInvoicesInputSchema,
	FinmeiListInvoicesOutputSchema,
	FinmeiListPaymentsInputSchema,
	FinmeiListPaymentsOutputSchema,
	FinmeiListProductsInputSchema,
	FinmeiListProductsOutputSchema,
	FinmeiPaymentOutputSchema,
	FinmeiProductOutputSchema,
	FinmeiProfileOutputSchema,
	FinmeiUpdateExpenseFileInputSchema,
	FinmeiUpdateProductInputSchema,
} from './endpoints/types';
import { FinmeiSchema } from './schema';

describe('Finmei schema definitions', () => {
	it('declares semver version and empty entities map', () => {
		expect(FinmeiSchema.version).toBeDefined();
		expect(FinmeiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(typeof FinmeiSchema.entities).toBe('object');
		expect(FinmeiSchema.entities).not.toBeNull();
		expect(Object.keys(FinmeiSchema.entities)).toHaveLength(0);
	});
});

describe('Finmei invoice schemas', () => {
	it('validates invoice list inputs and strict rejection of unknown fields', () => {
		expect(
			FinmeiListInvoicesInputSchema.safeParse({ page: 1, per_page: 20 })
				.success,
		).toBe(true);
		expect(FinmeiListInvoicesInputSchema.safeParse({}).success).toBe(true);
		expect(
			FinmeiListInvoicesInputSchema.safeParse({ unknownField: 'bad' }).success,
		).toBe(false);
	});

	it('validates invoice creation schema with enum types and products', () => {
		const valid = {
			type: 'vat_invoice' as const,
			invoice_date: '2024-05-22',
			currency: 'USD',
			payment_status: 'paid' as const,
			products: [
				{
					name: 'Consulting',
					price: 100,
					quantity: 2,
					units: 'hours',
					vat_percentage: 20,
				},
			],
			buyer: {
				company_name: 'Acme Corp',
				email: 'billing@acme.example',
			},
		};
		expect(FinmeiCreateInvoiceInputSchema.safeParse(valid).success).toBe(true);
		// Missing required currency
		expect(
			FinmeiCreateInvoiceInputSchema.safeParse({ type: 'vat_invoice' }).success,
		).toBe(false);
		// Unknown field rejected due to strict
		expect(
			FinmeiCreateInvoiceInputSchema.safeParse({ ...valid, extraField: 'fail' })
				.success,
		).toBe(false);
	});

	it('validates invoice output shape', () => {
		const output = {
			data: {
				id: 'inv-123',
				currency: 'USD',
				subtotal: 200,
				vat: 40,
				total_incl_vat: 240,
				items: [
					{
						name: 'Consulting',
						price: 100,
						quantity: 2,
					},
				],
			},
		};
		expect(FinmeiInvoiceOutputSchema.safeParse(output).success).toBe(true);
		expect(
			FinmeiListInvoicesOutputSchema.safeParse({ data: [output.data] }).success,
		).toBe(true);
		// Invalid invoice missing currency
		expect(
			FinmeiInvoiceOutputSchema.safeParse({ data: { id: 'inv-123' } }).success,
		).toBe(false);
	});

	it('validates invoice lookup by ID', () => {
		expect(
			FinmeiGetInvoiceInputSchema.safeParse({ id: 'inv-123' }).success,
		).toBe(true);
		expect(FinmeiGetInvoiceInputSchema.safeParse({ id: '' }).success).toBe(
			false,
		);
		expect(FinmeiGetInvoiceInputSchema.safeParse({}).success).toBe(false);
	});
});

describe('Finmei expense schemas', () => {
	it('validates expense list and creation inputs', () => {
		expect(FinmeiListExpensesInputSchema.safeParse({ page: 2 }).success).toBe(
			true,
		);
		expect(FinmeiListExpensesInputSchema.safeParse({ page: -1 }).success).toBe(
			false,
		);

		const validExpense = {
			seller: 'Acme Supplies',
			total: 49.99,
			currency: 'EUR',
			date: '2024-03-01',
		};
		expect(FinmeiCreateExpenseInputSchema.safeParse(validExpense).success).toBe(
			true,
		);
		expect(
			FinmeiCreateExpenseInputSchema.safeParse({ seller: 'Acme' }).success,
		).toBe(false);
	});

	it('validates expense output shape', () => {
		const expense = {
			id: 'exp-1',
			date: '2024-03-01',
			total: 49.99,
			currency: 'EUR',
			seller: 'Acme Supplies',
			created_at: 1708357161,
		};
		expect(FinmeiExpenseOutputSchema.safeParse({ data: expense }).success).toBe(
			true,
		);
		expect(
			FinmeiListExpensesOutputSchema.safeParse({ data: [expense] }).success,
		).toBe(true);
	});

	it('validates update expense file input', () => {
		expect(
			FinmeiUpdateExpenseFileInputSchema.safeParse({
				id: 'exp-1',
				file: 'dGVzdA==',
			}).success,
		).toBe(true);
		expect(
			FinmeiUpdateExpenseFileInputSchema.safeParse({ id: 'exp-1', file: '' })
				.success,
		).toBe(false);
		expect(
			FinmeiUpdateExpenseFileInputSchema.safeParse({ id: 'exp-1' }).success,
		).toBe(false);
	});
});

describe('Finmei customer schemas', () => {
	it('validates customer list, create, and output', () => {
		expect(
			FinmeiListCustomersInputSchema.safeParse({ page: 1, search: 'Alice' })
				.success,
		).toBe(true);
		expect(FinmeiListCustomersInputSchema.safeParse({ extra: 1 }).success).toBe(
			false,
		);

		const customer = {
			id: 'cust-1',
			name: 'Alice Smith',
			email: 'alice@example.com',
			phone: '+1234567890',
		};
		expect(
			FinmeiCreateCustomerInputSchema.safeParse({
				name: 'Alice Smith',
				email: 'alice@example.com',
			}).success,
		).toBe(true);
		expect(
			FinmeiCustomerOutputSchema.safeParse({ data: customer }).success,
		).toBe(true);
		expect(
			FinmeiListCustomersOutputSchema.safeParse({ data: [customer] }).success,
		).toBe(true);
	});
});

describe('Finmei product schemas', () => {
	it('validates product create, update, and output', () => {
		expect(
			FinmeiListProductsInputSchema.safeParse({ status: 'active' }).success,
		).toBe(true);
		expect(
			FinmeiListProductsInputSchema.safeParse({ status: 'unknown_status' })
				.success,
		).toBe(false);

		const validCreate = {
			name: 'Widget',
			price: 19.99,
			currency: 'USD',
			status: 'active' as const,
		};
		expect(FinmeiCreateProductInputSchema.safeParse(validCreate).success).toBe(
			true,
		);
		expect(
			FinmeiUpdateProductInputSchema.safeParse({ id: 'prod-1', price: 24.99 })
				.success,
		).toBe(true);

		const product = {
			id: 'prod-1',
			name: 'Widget',
			price: 19.99,
			currency: 'USD',
			status: 'active',
		};
		expect(FinmeiProductOutputSchema.safeParse({ data: product }).success).toBe(
			true,
		);
		expect(
			FinmeiListProductsOutputSchema.safeParse({ data: [product] }).success,
		).toBe(true);
	});
});

describe('Finmei payment schemas', () => {
	it('validates payment creation and output', () => {
		expect(
			FinmeiListPaymentsInputSchema.safeParse({
				status: 'completed',
				limit: 10,
			}).success,
		).toBe(true);
		expect(
			FinmeiCreatePaymentInputSchema.safeParse({
				amount: 50,
				currency: 'USD',
				status: 'completed',
			}).success,
		).toBe(true);

		const payment = {
			id: 'pay-1',
			amount: 50,
			currency: 'USD',
			status: 'completed',
		};
		expect(FinmeiPaymentOutputSchema.safeParse({ data: payment }).success).toBe(
			true,
		);
		expect(
			FinmeiListPaymentsOutputSchema.safeParse({ data: [payment] }).success,
		).toBe(true);
	});
});

describe('Finmei currency and profile schemas', () => {
	it('validates currency list output', () => {
		const currencies = [
			{ code: 'USD', title: 'US Dollar' },
			{ code: 'EUR', title: 'Euro' },
		];
		expect(
			FinmeiListCurrenciesOutputSchema.safeParse({ data: currencies }).success,
		).toBe(true);
		expect(
			FinmeiListCurrenciesOutputSchema.safeParse({ data: [{ code: 123 }] })
				.success,
		).toBe(false);
	});

	it('validates profile output', () => {
		const profile = {
			business_id: 'biz-123',
			business_title: 'Acme Services',
			company_name: 'Acme Services LLC',
		};
		expect(FinmeiProfileOutputSchema.safeParse({ data: profile }).success).toBe(
			true,
		);
		expect(
			FinmeiProfileOutputSchema.safeParse({ data: { business_title: 'No ID' } })
				.success,
		).toBe(false);
	});
});

describe('Finmei binary and delete response schemas', () => {
	it('validates binary response structure', () => {
		const binary = {
			kind: 'binary' as const,
			contentType: 'application/pdf',
			base64: 'JVBERi0xLjQK...',
			size: 1024,
		};
		expect(FinmeiBinaryResponseSchema.safeParse(binary).success).toBe(true);
		expect(
			FinmeiBinaryResponseSchema.safeParse({ kind: 'other' }).success,
		).toBe(false);
	});

	it('validates delete response with null or success boolean', () => {
		expect(FinmeiDeleteResponseSchema.safeParse(null).success).toBe(true);
		expect(
			FinmeiDeleteResponseSchema.safeParse({ success: true }).success,
		).toBe(true);
		expect(FinmeiDeleteResponseSchema.safeParse(undefined).success).toBe(true);
	});
});

describe('Finmei schema runtime exports from index', () => {
	it('exports input schemas as runtime Zod objects from root index', async () => {
		const indexModule = await import('./index');
		expect(typeof indexModule.FinmeiCreateInvoiceInputSchema?.parse).toBe(
			'function',
		);
		expect(typeof indexModule.FinmeiCreateExpenseInputSchema?.parse).toBe(
			'function',
		);
		expect(typeof indexModule.FinmeiCreateCustomerInputSchema?.parse).toBe(
			'function',
		);
		expect(typeof indexModule.FinmeiCreateProductInputSchema?.parse).toBe(
			'function',
		);
		expect(typeof indexModule.FinmeiCreatePaymentInputSchema?.parse).toBe(
			'function',
		);
	});
});
