import {
	ContactCreateInputSchema,
	ContactSchema,
	ContactsGetInputSchema,
	ContactsListInputSchema,
	ContactsListResponseSchema,
	ContactUpdateInputSchema,
	CreditNoteDetailsSchema,
	CreditNotesGetInputSchema,
	CreditNotesListInputSchema,
	CreditNotesListResponseSchema,
	InvoiceCreateInputSchema,
	InvoiceDetailsSchema,
	InvoicesGetInputSchema,
	InvoicesListInputSchema,
	InvoicesListResponseSchema,
	InvoicesRenderInputSchema,
	InvoicesRenderResponseSchema,
	ProfileGetInputSchema,
	ProfileGetResponseSchema,
	ResourceMutationResponseSchema,
	VoucherCreateInputSchema,
	VoucherDetailsSchema,
	VouchersGetInputSchema,
	VouchersListInputSchema,
	VouchersListResponseSchema,
} from './endpoints/types';
import { LexofficeSchema } from './schema';
import { lexofficeEntities } from './schema/database';

describe('Lexoffice schema', () => {
	it('declares a semver version', () => {
		expect(LexofficeSchema.version).toBeDefined();
		expect(LexofficeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(LexofficeSchema.entities).toBe(lexofficeEntities);
		expect(LexofficeSchema.entities).toEqual({});
	});
});

describe('Lexoffice endpoint schemas', () => {
	it('validates contacts input and output schemas', () => {
		expect(
			ContactsListInputSchema.safeParse({ page: 0, size: 25, customer: true })
				.success,
		).toBe(true);
		expect(ContactsListInputSchema.safeParse({ size: 300 }).success).toBe(
			false,
		);

		expect(ContactsGetInputSchema.safeParse({ id: 'c-1' }).success).toBe(true);
		expect(ContactsGetInputSchema.safeParse({ id: '' }).success).toBe(false);

		const contactValid = {
			id: 'c-1',
			version: 1,
			person: { lastName: 'Schmidt' },
		};
		expect(ContactSchema.safeParse(contactValid).success).toBe(true);
		expect(ContactSchema.safeParse({ id: 'c-1' }).success).toBe(false);

		const createInput = {
			version: 0,
			roles: { customer: {} },
			person: { lastName: 'Schmidt' },
		};
		expect(ContactCreateInputSchema.safeParse(createInput).success).toBe(true);
		expect(
			ContactCreateInputSchema.safeParse({
				version: 0,
				roles: {},
				person: { lastName: 'Schmidt' },
				extraField: 'invalid',
			}).success,
		).toBe(false);

		const updateInput = {
			id: 'c-1',
			version: 1,
			roles: { vendor: {} },
			person: { lastName: 'Schmidt' },
		};
		expect(ContactUpdateInputSchema.safeParse(updateInput).success).toBe(true);
		expect(
			ContactUpdateInputSchema.safeParse({
				version: 1,
				roles: {},
				person: { lastName: 'Schmidt' },
			}).success,
		).toBe(false);

		const listOutput = {
			content: [contactValid],
			first: true,
			last: true,
			totalPages: 1,
			totalElements: 1,
			numberOfElements: 1,
			size: 25,
			number: 0,
		};
		expect(ContactsListResponseSchema.safeParse(listOutput).success).toBe(true);
	});

	it('validates invoices schemas', () => {
		expect(InvoicesListInputSchema.safeParse({ page: 0 }).success).toBe(true);
		expect(InvoicesGetInputSchema.safeParse({ id: 'inv-1' }).success).toBe(
			true,
		);

		const invoiceCreate = {
			voucherDate: '2026-01-01',
			address: { name: 'Customer' },
			lineItems: [
				{
					type: 'custom' as const,
					name: 'Work',
					unitPrice: { currency: 'EUR', netAmount: 50, taxRatePercentage: 19 },
				},
			],
			totalPrice: { currency: 'EUR' },
			taxConditions: { taxType: 'net' as const },
		};
		expect(InvoiceCreateInputSchema.safeParse(invoiceCreate).success).toBe(
			true,
		);
		expect(
			InvoiceCreateInputSchema.safeParse({
				...invoiceCreate,
				lineItems: [],
			}).success,
		).toBe(false);

		const invoiceDetails = {
			id: 'inv-1',
			version: 1,
			voucherStatus: 'open',
			voucherDate: '2026-01-01',
			totalPrice: { currency: 'EUR', totalNetAmount: 50 },
		};
		expect(InvoiceDetailsSchema.safeParse(invoiceDetails).success).toBe(true);

		expect(
			InvoicesListResponseSchema.safeParse({
				content: [
					{
						id: 'inv-1',
						voucherStatus: 'open',
						voucherDate: '2026-01-01',
					},
				],
				first: true,
				last: true,
				totalPages: 1,
				totalElements: 1,
				numberOfElements: 1,
				size: 25,
				number: 0,
			}).success,
		).toBe(true);

		expect(InvoicesRenderInputSchema.safeParse({ id: 'inv-1' }).success).toBe(
			true,
		);
		expect(
			InvoicesRenderResponseSchema.safeParse({ documentFileId: 'doc-123' })
				.success,
		).toBe(true);
	});

	it('validates vouchers schemas', () => {
		expect(
			VouchersListInputSchema.safeParse({ voucherNumber: '123' }).success,
		).toBe(true);
		expect(VouchersGetInputSchema.safeParse({ id: 'v-1' }).success).toBe(true);

		const voucherCreate = {
			type: 'purchaseinvoice' as const,
			voucherDate: '2026-01-01',
			totalNetAmount: 100,
			totalGrossAmount: 119,
			taxType: 'net' as const,
			voucherItems: [
				{
					amount: 100,
					taxRatePercent: 19,
					categoryId: 'cat-1',
				},
			],
			version: 0,
		};
		expect(VoucherCreateInputSchema.safeParse(voucherCreate).success).toBe(
			true,
		);

		const voucherDetails = {
			id: 'v-1',
			type: 'purchaseinvoice',
			voucherStatus: 'open',
			voucherDate: '2026-01-01',
			version: 0,
			voucherItems: [
				{
					amount: 100,
					taxRatePercent: 19,
					categoryId: 'cat-1',
				},
			],
		};
		expect(VoucherDetailsSchema.safeParse(voucherDetails).success).toBe(true);

		expect(
			VouchersListResponseSchema.safeParse({
				content: [
					{
						id: 'v-1',
						voucherDate: '2026-01-01',
					},
				],
				first: true,
				last: true,
				totalPages: 1,
				totalElements: 1,
				numberOfElements: 1,
				size: 25,
				number: 0,
			}).success,
		).toBe(true);
	});

	it('validates profile and credit notes schemas', () => {
		expect(ProfileGetInputSchema.safeParse({}).success).toBe(true);
		expect(
			ProfileGetResponseSchema.safeParse({ organizationId: 'org-1' }).success,
		).toBe(true);

		expect(CreditNotesListInputSchema.safeParse({ page: 0 }).success).toBe(
			true,
		);
		expect(CreditNotesGetInputSchema.safeParse({ id: 'cn-1' }).success).toBe(
			true,
		);

		const creditNoteDetails = {
			id: 'cn-1',
			version: 1,
			voucherStatus: 'open',
			voucherDate: '2026-01-01',
			totalPrice: { currency: 'EUR', totalNetAmount: 50 },
		};
		expect(CreditNoteDetailsSchema.safeParse(creditNoteDetails).success).toBe(
			true,
		);

		expect(
			CreditNotesListResponseSchema.safeParse({
				content: [
					{
						id: 'cn-1',
						voucherStatus: 'open',
						voucherDate: '2026-01-01',
					},
				],
				first: true,
				last: true,
				totalPages: 1,
				totalElements: 1,
				numberOfElements: 1,
				size: 25,
				number: 0,
			}).success,
		).toBe(true);

		expect(
			ResourceMutationResponseSchema.safeParse({
				id: 'res-1',
				resourceUri: 'https://api.lexoffice.io/v1/contacts/res-1',
				version: 1,
			}).success,
		).toBe(true);
	});
});
