import {
	FinmeiBinaryResponseSchema,
	FinmeiCreateExpenseInputSchema,
	FinmeiCreateInvoiceInputSchema,
	FinmeiDeleteResponseSchema,
	FinmeiExpenseOutputSchema,
	FinmeiGetInvoiceInputSchema,
	FinmeiInvoiceOutputSchema,
	FinmeiListCurrenciesOutputSchema,
	FinmeiListExpensesInputSchema,
	FinmeiListExpensesOutputSchema,
	FinmeiListInvoicesInputSchema,
	FinmeiListInvoicesOutputSchema,
	FinmeiProfileOutputSchema,
	FinmeiUpdateExpenseFileInputSchema,
	FinmeiUpdateInvoiceInputSchema,
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
			series: 'FIN',
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
				type: 'company' as const,
				company_name: 'Acme Corp',
				email: 'billing@acme.example',
			},
		};
		expect(FinmeiCreateInvoiceInputSchema.safeParse(valid).success).toBe(true);
		// Missing required currency
		expect(
			FinmeiCreateInvoiceInputSchema.safeParse({ type: 'vat_invoice' }).success,
		).toBe(false);
		// Finmei requires type, invoice_date, series, buyer and products
		for (const field of [
			'type',
			'invoice_date',
			'series',
			'buyer',
			'products',
		] as const) {
			const { [field]: _omitted, ...rest } = valid;
			expect(FinmeiCreateInvoiceInputSchema.safeParse(rest).success).toBe(
				false,
			);
		}
		// invoice_number may be a string or a number
		expect(
			FinmeiCreateInvoiceInputSchema.safeParse({ ...valid, invoice_number: 7 })
				.success,
		).toBe(true);
		expect(
			FinmeiCreateInvoiceInputSchema.safeParse({
				...valid,
				invoice_number: 'A-007',
			}).success,
		).toBe(true);
		// Unknown field rejected due to strict
		expect(
			FinmeiCreateInvoiceInputSchema.safeParse({ ...valid, extraField: 'fail' })
				.success,
		).toBe(false);
		// Finmei documents products.*.units as required, on create and update
		const { units: _units, ...productWithoutUnits } = valid.products[0]!;
		const withoutUnits = { ...valid, products: [productWithoutUnits] };
		expect(FinmeiCreateInvoiceInputSchema.safeParse(withoutUnits).success).toBe(
			false,
		);
		expect(
			FinmeiUpdateInvoiceInputSchema.safeParse({ ...withoutUnits, id: 'inv_1' })
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
			file: 'JVBERi0xLjQK',
		};
		const { file: _file, ...withoutFile } = validExpense;
		expect(FinmeiCreateExpenseInputSchema.safeParse(withoutFile).success).toBe(
			false,
		);
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
	});
});
