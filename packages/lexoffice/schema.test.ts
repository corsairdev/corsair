import {
	ContactCreateInputSchema,
	ContactSchema,
	ContactsGetInputSchema,
	ContactsListInputSchema,
	ContactsListResponseSchema,
	ContactUpdateInputSchema,
	CreditNoteCreateInputSchema,
	CreditNoteDetailsSchema,
	CreditNotesGetInputSchema,
	CreditNotesListInputSchema,
	CreditNotesListResponseSchema,
	DownPaymentInvoiceDetailsSchema,
	FileDownloadInputSchema,
	FileDownloadResponseSchema,
	FilesUploadInputSchema,
	FilesUploadResponseSchema,
	InvoiceCreateInputSchema,
	InvoiceDetailsSchema,
	InvoicesGetInputSchema,
	InvoicesListInputSchema,
	InvoicesListResponseSchema,
	InvoicesRenderInputSchema,
	InvoicesRenderResponseSchema,
	PaymentInformationSchema,
	PaymentsGetInputSchema,
	PostingCategoriesListInputSchema,
	PostingCategoriesListResponseSchema,
	ProfileGetInputSchema,
	ProfileGetResponseSchema,
	ResourceMutationResponseSchema,
	VoucherCreateInputSchema,
	VoucherDetailsSchema,
	VoucherListInputSchema,
	VoucherListResponseSchema,
	VouchersAttachFileInputSchema,
	VouchersGetInputSchema,
	VouchersListInputSchema,
	VouchersListResponseSchema,
	VoucherUpdateInputSchema,
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
		expect(
			ContactCreateInputSchema.safeParse({
				version: 0,
				roles: { customer: {} },
				person: { lastName: 'Schmidt', undocumented: true },
			}).success,
		).toBe(false);
		expect(
			ContactCreateInputSchema.safeParse({
				version: 0,
				roles: {},
				person: { lastName: 'Schmidt' },
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
			address: { name: 'Customer', countryCode: 'DE' },
			lineItems: [
				{
					type: 'custom' as const,
					name: 'Work',
					quantity: 1,
					unitName: 'hour',
					unitPrice: { currency: 'EUR', netAmount: 50, taxRatePercentage: 19 },
				},
			],
			totalPrice: { currency: 'EUR' },
			taxConditions: { taxType: 'net' as const },
			shippingConditions: {
				shippingType: 'service' as const,
				shippingDate: '2026-01-01',
			},
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
		expect(
			CreditNoteCreateInputSchema.safeParse({
				voucherDate: '2026-01-01',
				address: { name: 'Customer', countryCode: 'DE' },
				lineItems: [
					{
						type: 'custom',
						name: 'Credit',
						quantity: 1,
						unitName: 'piece',
						unitPrice: {
							currency: 'EUR',
							netAmount: 50,
							taxRatePercentage: 19,
						},
					},
				],
				totalPrice: { currency: 'EUR', totalDiscountPercentage: 10 },
				taxConditions: { taxType: 'net' },
				printLayoutId: 'layout-1',
			}).success,
		).toBe(true);
		expect(
			CreditNoteCreateInputSchema.safeParse({
				voucherDate: '2026-01-01',
				address: { name: 'Customer', countryCode: 'DE' },
				lineItems: [
					{
						type: 'custom',
						name: 'Credit',
						quantity: 1,
						unitName: 'piece',
						unitPrice: {
							currency: 'EUR',
							netAmount: 50,
							taxRatePercentage: 19,
						},
						discountPercentage: 10,
					},
				],
				totalPrice: { currency: 'EUR' },
				taxConditions: { taxType: 'net' },
			}).success,
		).toBe(false);
		expect(
			InvoiceCreateInputSchema.safeParse({
				...invoiceCreate,
				taxConditions: { taxType: 'gross' },
				lineItems: [
					{
						type: 'custom',
						name: 'Gross work',
						quantity: 1,
						unitName: 'hour',
						unitPrice: {
							currency: 'EUR',
							grossAmount: 59.5,
							taxRatePercentage: 19,
						},
					},
				],
			}).success,
		).toBe(true);
		expect(
			InvoiceCreateInputSchema.safeParse({
				...invoiceCreate,
				shippingConditions: {
					shippingType: 'serviceperiod',
					shippingDate: '2026-01-01',
					shippingEndDate: '2026-01-31',
				},
			}).success,
		).toBe(true);
		expect(
			InvoiceCreateInputSchema.safeParse({
				...invoiceCreate,
				shippingConditions: {
					shippingType: 'serviceperiod',
					shippingDate: '2026-01-01',
				},
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
						voucherType: 'invoice',
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
			voucherNumber: 'PUR-001',
			voucherDate: '2026-01-01',
			totalGrossAmount: 119,
			totalTaxAmount: 19,
			taxType: 'net' as const,
			useCollectiveContact: true,
			voucherItems: [
				{
					amount: 100,
					taxAmount: 19,
					taxRatePercent: 19,
					categoryId: 'cat-1',
				},
			],
			version: 1,
		};
		expect(VoucherCreateInputSchema.safeParse(voucherCreate).success).toBe(
			true,
		);
		expect(
			VoucherCreateInputSchema.safeParse({
				...voucherCreate,
				contactId: 'contact-1',
			}).success,
		).toBe(true);
		const { version, ...withoutVersion } = voucherCreate;
		expect(version).toBe(1);
		expect(VoucherCreateInputSchema.safeParse(withoutVersion).success).toBe(
			true,
		);
		const { totalTaxAmount, ...withoutTotalTaxAmount } = voucherCreate;
		expect(totalTaxAmount).toBe(19);
		expect(
			VoucherCreateInputSchema.safeParse(withoutTotalTaxAmount).success,
		).toBe(false);
		expect(
			VoucherCreateInputSchema.safeParse({
				type: 'purchaseinvoice',
				voucherStatus: 'unchecked',
				taxType: 'net',
				useCollectiveContact: true,
			}).success,
		).toBe(true);
		expect(
			VoucherCreateInputSchema.safeParse({
				...voucherCreate,
				voucherItems: [
					{ amount: 100, taxRatePercent: 19, categoryId: 'cat-1' },
				],
			}).success,
		).toBe(false);
		expect(
			VoucherUpdateInputSchema.safeParse({
				...voucherCreate,
				id: 'v-1',
				version: 1,
				files: [],
			}).success,
		).toBe(true);

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
			files: ['a8691b5d-2393-4317-888d-bcd5d564f7d1'],
		};
		expect(VoucherDetailsSchema.safeParse(voucherDetails).success).toBe(true);

		expect(
			VouchersListResponseSchema.safeParse({
				content: [
					{
						id: 'v-1',
						voucherType: 'purchaseinvoice',
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
	});

	it('validates voucher listing, payment, posting, down-payment, and file schemas', () => {
		expect(
			VoucherListInputSchema.safeParse({
				voucherType: 'invoice,creditnote',
				voucherStatus: 'open',
				page: 0,
				size: 250,
				sort: 'voucherDate,DESC',
			}).success,
		).toBe(true);
		expect(
			VoucherListInputSchema.safeParse({
				voucherType: 'invoice',
				voucherStatus: 'open,overdue',
			}).success,
		).toBe(false);
		expect(
			VoucherListResponseSchema.safeParse({
				content: [
					{
						id: 'v-1',
						voucherType: 'invoice',
						voucherStatus: 'open',
						voucherDate: '2026-01-01',
						contactId: null,
						openAmount: null,
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
			PaymentsGetInputSchema.safeParse({ voucherId: 'voucher-1' }).success,
		).toBe(true);
		expect(
			PaymentInformationSchema.safeParse({
				openAmount: '10.00',
				currency: 'EUR',
				paymentStatus: 'openRevenue',
				voucherType: 'invoice',
				voucherStatus: 'open',
				paymentItems: [
					{
						paymentItemType: 'manualPayment',
						postingDate: '2026-01-01',
						amount: 2,
						currency: 'EUR',
					},
				],
			}).success,
		).toBe(true);
		expect(PostingCategoriesListInputSchema.safeParse({}).success).toBe(true);
		expect(
			PostingCategoriesListResponseSchema.safeParse([
				{
					id: 'cat-1',
					name: 'Travel',
					type: 'outgo',
					contactRequired: false,
					splitAllowed: true,
					groupName: 'Travel',
				},
			]).success,
		).toBe(true);

		expect(
			DownPaymentInvoiceDetailsSchema.safeParse({
				id: 'dp-1',
				version: 1,
				voucherStatus: 'open',
				voucherDate: '2026-01-01',
				totalPrice: { currency: 'EUR' },
				closingInvoiceId: 'inv-1',
			}).success,
		).toBe(true);
		expect(FileDownloadInputSchema.safeParse({ id: 'file-1' }).success).toBe(
			true,
		);
		expect(
			FileDownloadResponseSchema.safeParse({
				kind: 'binary',
				contentType: 'application/pdf',
				base64: 'JVBERg==',
				sizeBytes: 4,
			}).success,
		).toBe(true);

		const uploadInput = {
			file: 'JVBERi0xLjQK',
			fileName: 'receipt.pdf',
			contentType: 'application/pdf',
		};
		expect(FilesUploadInputSchema.safeParse(uploadInput).success).toBe(true);
		expect(
			FilesUploadInputSchema.safeParse({ ...uploadInput, extra: true }).success,
		).toBe(false);
		expect(
			VouchersAttachFileInputSchema.safeParse({ id: 'v-1', ...uploadInput })
				.success,
		).toBe(true);
		expect(
			FilesUploadResponseSchema.safeParse({ id: 'file-1', voucherId: 'v-1' })
				.success,
		).toBe(true);

		const maximumFileBytes = 5 * 1024 * 1024;
		const maximumEncodedLength = 4 * Math.ceil(maximumFileBytes / 3);
		const atLimitBase64 = `${'A'.repeat(maximumEncodedLength - 1)}=`;
		const oneByteOverBase64 = 'A'.repeat(maximumEncodedLength);
		expect(atLimitBase64.length).toBe(maximumEncodedLength);
		expect(oneByteOverBase64.length).toBe(maximumEncodedLength);
		expect(
			FilesUploadInputSchema.safeParse({
				...uploadInput,
				file: atLimitBase64,
			}).success,
		).toBe(true);
		expect(
			FilesUploadInputSchema.safeParse({
				...uploadInput,
				file: oneByteOverBase64,
			}).success,
		).toBe(false);
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
						voucherType: 'creditnote',
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
				resourceUri: 'https://api.lexware.io/v1/contacts/res-1',
				version: 1,
			}).success,
		).toBe(true);
	});
});
