import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Contacts,
	CreditNotes,
	DownPaymentInvoices,
	Files,
	Invoices,
	Payments,
	PostingCategories,
	Profile,
	Voucherlist,
	Vouchers,
} from './endpoints';
import type { LexofficeContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeLexofficeRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeLexofficeRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

function buildCtx(): LexofficeContext {
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
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

describe('Contacts endpoints', () => {
	it('contacts.list fetches and parses contacts list', async () => {
		const mockResponse = {
			content: [
				{
					id: 'c-1',
					version: 1,
					person: { lastName: 'Mustermann' },
				},
			],
			first: true,
			last: true,
			totalPages: 1,
			totalElements: 1,
			numberOfElements: 1,
			size: 25,
			number: 0,
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Contacts.list(ctx, { page: 0, size: 25 });
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/contacts', 'test-api-key', {
			method: 'GET',
			query: { page: 0, size: 25 },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lexoffice.contacts.list',
			{ count: 1 },
			'completed',
		);
	});

	it('contacts.get fetches contact details by ID', async () => {
		const mockContact = {
			id: 'c-123',
			version: 2,
			roles: { customer: { number: 100 } },
			person: { firstName: 'Max', lastName: 'Mustermann' },
		};
		mockedRequest.mockResolvedValue(mockContact);

		const result = await Contacts.get(ctx, { id: 'c-123' });
		expect(result).toEqual(mockContact);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/contacts/c-123',
			'test-api-key',
			{
				method: 'GET',
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lexoffice.contacts.get',
			{ contactId: 'c-123' },
			'completed',
		);
	});

	it('contacts.create sends contact payload and returns mutation response', async () => {
		const mutationResponse = {
			id: 'new-c',
			resourceUri: 'https://api.lexware.io/v1/contacts/new-c',
			version: 0,
		};
		mockedRequest.mockResolvedValue(mutationResponse);

		const input = {
			version: 0,
			roles: { customer: {} },
			person: { lastName: 'Doe' },
		};
		const result = await Contacts.create(ctx, input);
		expect(result).toEqual(mutationResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/contacts', 'test-api-key', {
			method: 'POST',
			body: input,
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lexoffice.contacts.create',
			{ contactId: 'new-c' },
			'completed',
		);
	});

	it('contacts.update sends PUT request excluding id from body', async () => {
		const mutationResponse = {
			id: 'c-123',
			version: 1,
		};
		mockedRequest.mockResolvedValue(mutationResponse);

		const input = {
			id: 'c-123',
			version: 0,
			roles: { customer: {} },
			person: { lastName: 'Updated' },
		};
		const result = await Contacts.update(ctx, input);
		expect(result).toEqual(mutationResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/contacts/c-123',
			'test-api-key',
			{
				method: 'PUT',
				body: {
					version: 0,
					roles: { customer: {} },
					person: { lastName: 'Updated' },
				},
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lexoffice.contacts.update',
			{ contactId: 'c-123' },
			'completed',
		);
	});

	it('contacts.get rejects invalid empty ID before calling network', async () => {
		// `unknown` because rejection has untyped error
		const err: unknown = await Contacts.get(ctx, { id: '' }).catch(
			(caught: unknown) => caught,
		);
		expect(err).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('Invoices endpoints', () => {
	it('invoices.list fetches and parses invoice list', async () => {
		const mockResponse = {
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
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Invoices.list(ctx, { page: 0 });
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/voucherlist', 'test-api-key', {
			method: 'GET',
			query: { page: 0, voucherType: 'invoice', voucherStatus: 'any' },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lexoffice.invoices.list',
			{ count: 1 },
			'completed',
		);
	});

	it('invoices.get fetches invoice details by ID', async () => {
		const mockInvoice = {
			id: 'inv-1',
			version: 1,
			voucherStatus: 'open',
			voucherDate: '2026-01-01',
			totalPrice: { currency: 'EUR', totalNetAmount: 100 },
		};
		mockedRequest.mockResolvedValue(mockInvoice);

		const result = await Invoices.get(ctx, { id: 'inv-1' });
		expect(result).toEqual(mockInvoice);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/invoices/inv-1',
			'test-api-key',
			{
				method: 'GET',
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lexoffice.invoices.get',
			{ invoiceId: 'inv-1' },
			'completed',
		);
	});

	it('invoices.create sends invoice payload and optional finalize query', async () => {
		const mutationResponse = {
			id: 'inv-new',
			version: 1,
		};
		mockedRequest.mockResolvedValue(mutationResponse);

		const input = {
			finalize: true,
			precedingSalesVoucherId: 'quote-1',
			voucherDate: '2026-01-01',
			address: { name: 'Customer GmbH', countryCode: 'DE' },
			lineItems: [
				{
					type: 'custom' as const,
					name: 'Service',
					quantity: 1,
					unitName: 'hour',
					unitPrice: {
						currency: 'EUR' as const,
						netAmount: 100,
						taxRatePercentage: 19,
					},
				},
			],
			totalPrice: { currency: 'EUR' as const },
			taxConditions: { taxType: 'net' as const },
			shippingConditions: {
				shippingType: 'service' as const,
				shippingDate: '2026-01-01',
			},
		};

		const result = await Invoices.create(ctx, input);
		expect(result).toEqual(mutationResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/invoices', 'test-api-key', {
			method: 'POST',
			body: {
				voucherDate: '2026-01-01',
				address: { name: 'Customer GmbH', countryCode: 'DE' },
				lineItems: [
					{
						type: 'custom',
						name: 'Service',
						quantity: 1,
						unitName: 'hour',
						unitPrice: {
							currency: 'EUR',
							netAmount: 100,
							taxRatePercentage: 19,
						},
					},
				],
				totalPrice: { currency: 'EUR' },
				taxConditions: { taxType: 'net' },
				shippingConditions: {
					shippingType: 'service',
					shippingDate: '2026-01-01',
				},
			},
			query: { finalize: 'true', precedingSalesVoucherId: 'quote-1' },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lexoffice.invoices.create',
			{ invoiceId: 'inv-new' },
			'completed',
		);
	});

	it('invoices.render triggers PDF rendering and returns documentFileId', async () => {
		const mockResponse = { documentFileId: 'doc-file-123' };
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Invoices.render(ctx, { id: 'inv-1' });
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/invoices/inv-1/document',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lexoffice.invoices.render',
			{ invoiceId: 'inv-1', documentFileId: 'doc-file-123' },
			'completed',
		);
	});
});

describe('Vouchers endpoints', () => {
	it('vouchers.list lists vouchers with query filtering', async () => {
		const mockResponse = {
			content: [
				{
					id: 'v-1',
					voucherType: 'purchaseinvoice',
					voucherStatus: 'open',
					voucherDate: '2026-02-01',
				},
			],
			first: true,
			last: true,
			totalPages: 1,
			totalElements: 1,
			numberOfElements: 1,
			size: 25,
			number: 0,
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Vouchers.list(ctx, { voucherNumber: 'V-001' });
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/voucherlist', 'test-api-key', {
			method: 'GET',
			query: {
				voucherType:
					'salesinvoice,salescreditnote,purchaseinvoice,purchasecreditnote',
				voucherStatus: 'any',
				voucherNumber: 'V-001',
			},
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lexoffice.vouchers.list',
			{ count: 1 },
			'completed',
		);
	});

	it('vouchers.get retrieves voucher details by ID', async () => {
		const mockVoucher = {
			id: 'v-1',
			type: 'purchaseinvoice',
			voucherStatus: 'open',
			voucherDate: '2026-02-01',
			version: 1,
			voucherItems: [
				{
					amount: 50,
					taxRatePercent: 19,
					categoryId: 'cat-123',
				},
			],
		};
		mockedRequest.mockResolvedValue(mockVoucher);

		const result = await Vouchers.get(ctx, { id: 'v-1' });
		expect(result).toEqual(mockVoucher);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/vouchers/v-1',
			'test-api-key',
			{
				method: 'GET',
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lexoffice.vouchers.get',
			{ voucherId: 'v-1' },
			'completed',
		);
	});

	it('vouchers.create creates a new voucher', async () => {
		const mutationResponse = { id: 'v-new', version: 0 };
		mockedRequest.mockResolvedValue(mutationResponse);

		const input = {
			type: 'purchaseinvoice' as const,
			voucherNumber: 'PUR-2026-001',
			voucherDate: '2026-02-01',
			totalGrossAmount: 119,
			totalTaxAmount: 19,
			taxType: 'net' as const,
			useCollectiveContact: true,
			voucherItems: [
				{
					amount: 100,
					taxAmount: 19,
					taxRatePercent: 19,
					categoryId: 'cat-abc',
				},
			],
			version: 1,
		};

		const result = await Vouchers.create(ctx, input);
		expect(result).toEqual(mutationResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/vouchers', 'test-api-key', {
			method: 'POST',
			body: input,
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lexoffice.vouchers.create',
			{ voucherId: 'v-new' },
			'completed',
		);
	});
});

describe('Profile endpoint', () => {
	it('profile.get fetches organization details', async () => {
		const mockProfile = {
			organizationId: 'org-uuid-1',
			companyName: 'Test GmbH',
		};
		mockedRequest.mockResolvedValue(mockProfile);

		const result = await Profile.get(ctx, {});
		expect(result).toEqual(mockProfile);
		expect(mockedRequest).toHaveBeenCalledWith('/profile', 'test-api-key', {
			method: 'GET',
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lexoffice.profile.get',
			{ organizationId: 'org-uuid-1' },
			'completed',
		);
	});
});

describe('CreditNotes endpoints', () => {
	it('creditNotes.list fetches credit notes list', async () => {
		const mockResponse = {
			content: [
				{
					id: 'cn-1',
					voucherType: 'creditnote',
					voucherStatus: 'open',
					voucherDate: '2026-03-01',
				},
			],
			first: true,
			last: true,
			totalPages: 1,
			totalElements: 1,
			numberOfElements: 1,
			size: 25,
			number: 0,
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await CreditNotes.list(ctx, { page: 0 });
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/voucherlist', 'test-api-key', {
			method: 'GET',
			query: { page: 0, voucherType: 'creditnote', voucherStatus: 'any' },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lexoffice.creditNotes.list',
			{ count: 1 },
			'completed',
		);
	});

	it('creditNotes.get retrieves credit note details by ID', async () => {
		const mockCreditNote = {
			id: 'cn-1',
			version: 1,
			voucherStatus: 'open',
			voucherDate: '2026-03-01',
			totalPrice: { currency: 'EUR', totalNetAmount: 50 },
		};
		mockedRequest.mockResolvedValue(mockCreditNote);

		const result = await CreditNotes.get(ctx, { id: 'cn-1' });
		expect(result).toEqual(mockCreditNote);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/credit-notes/cn-1',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lexoffice.creditNotes.get',
			{ creditNoteId: 'cn-1' },
			'completed',
		);
	});

	it('creditNotes.create supports finalize and pursue query parameters', async () => {
		const mutationResponse = { id: 'cn-new', version: 1 };
		mockedRequest.mockResolvedValue(mutationResponse);
		const input = {
			finalize: true,
			precedingSalesVoucherId: 'inv-1',
			voucherDate: '2026-03-02',
			address: { name: 'Acme GmbH', countryCode: 'DE' },
			lineItems: [
				{
					type: 'custom' as const,
					name: 'Return',
					quantity: 1,
					unitName: 'piece',
					unitPrice: {
						currency: 'EUR' as const,
						netAmount: 50,
						taxRatePercentage: 19,
					},
				},
			],
			totalPrice: { currency: 'EUR' as const },
			taxConditions: { taxType: 'net' as const },
		};

		const result = await CreditNotes.create(ctx, input);
		expect(result).toEqual(mutationResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/credit-notes',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				body: expect.not.objectContaining({
					finalize: true,
					precedingSalesVoucherId: 'inv-1',
				}),
				query: { finalize: 'true', precedingSalesVoucherId: 'inv-1' },
			}),
		);
	});

	it('creditNotes.render uses the documented legacy document route', async () => {
		mockedRequest.mockResolvedValue({ documentFileId: 'cn-doc-1' });
		const result = await CreditNotes.render(ctx, { id: 'cn-1' });
		expect(result).toEqual({ documentFileId: 'cn-doc-1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/credit-notes/cn-1/document',
			'test-api-key',
			{ method: 'GET' },
		);
	});

	it('creditNotes.download returns validated bytes without logging file content', async () => {
		mockedRequest.mockResolvedValue({
			bytes: new Uint8Array([37, 80, 68, 70]),
			contentType: 'application/pdf',
		});

		const result = await CreditNotes.download(ctx, { id: 'cn-1' });
		expect(result).toEqual({
			kind: 'binary',
			contentType: 'application/pdf',
			base64: 'JVBERg==',
			sizeBytes: 4,
		});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/credit-notes/cn-1/file',
			'test-api-key',
			{
				method: 'GET',
				headers: { Accept: '*/*' },
				responseType: 'binary',
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'lexoffice.creditNotes.download',
			{ creditNoteId: 'cn-1', sizeBytes: 4 },
			'completed',
		);
	});
});

describe('Additional documented Lexware operations', () => {
	it('rejects invalid voucher filters and file uploads before network I/O', async () => {
		await expect(
			Voucherlist.list(ctx, { voucherType: 'invoices', voucherStatus: 'open' }),
		).rejects.toThrow();
		await expect(
			Files.upload(ctx, {
				file: 'not-base64',
				fileName: 'receipt.pdf',
				contentType: 'application/pdf',
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('voucherlist.list sends required filters and parses paged results', async () => {
		const response = {
			content: [
				{
					id: 'v-1',
					voucherType: 'invoice',
					voucherStatus: 'open',
					voucherDate: '2026-04-01T00:00:00.000+02:00',
					contactId: null,
					openAmount: 75,
				},
			],
			first: true,
			last: true,
			totalPages: 1,
			totalElements: 1,
			numberOfElements: 1,
			size: 25,
			number: 0,
		};
		mockedRequest.mockResolvedValue(response);

		const result = await Voucherlist.list(ctx, {
			voucherType: 'invoice',
			voucherStatus: 'open',
			page: 0,
		});
		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith('/voucherlist', 'test-api-key', {
			method: 'GET',
			query: { voucherType: 'invoice', voucherStatus: 'open', page: 0 },
		});
	});

	it('invoices.download requests PDF bytes using the invoice file route', async () => {
		mockedRequest.mockResolvedValue({
			bytes: new Uint8Array([1, 2, 3]),
			contentType: 'application/pdf',
		});
		const result = await Invoices.download(ctx, {
			id: 'inv-1',
			accept: 'application/pdf',
		});
		expect(result.base64).toBe('AQID');
		expect(mockedRequest).toHaveBeenCalledWith(
			'/invoices/inv-1/file',
			'test-api-key',
			{
				method: 'GET',
				headers: { Accept: 'application/pdf' },
				responseType: 'binary',
			},
		);
	});

	it('vouchers.update sends a versioned PUT body without the path ID', async () => {
		mockedRequest.mockResolvedValue({ id: 'v-1', version: 2 });
		const input = {
			id: 'v-1',
			version: 1,
			files: ['file-1'],
			type: 'purchaseinvoice' as const,
			voucherNumber: 'PUR-001',
			voucherDate: '2026-04-01',
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
		};
		const result = await Vouchers.update(ctx, input);
		expect(result).toEqual({ id: 'v-1', version: 2 });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/vouchers/v-1',
			'test-api-key',
			{
				method: 'PUT',
				body: {
					version: 1,
					files: ['file-1'],
					type: 'purchaseinvoice',
					voucherNumber: 'PUR-001',
					voucherDate: '2026-04-01',
					totalGrossAmount: 119,
					totalTaxAmount: 19,
					taxType: 'net',
					useCollectiveContact: true,
					voucherItems: input.voucherItems,
				},
			},
		);
	});

	it('vouchers.attachFile posts multipart content to the existing voucher', async () => {
		mockedRequest.mockResolvedValue({ id: 'file-1' });
		const result = await Vouchers.attachFile(ctx, {
			id: 'v-1',
			file: 'JVBERi0xLjQK',
			fileName: 'receipt.pdf',
			contentType: 'application/pdf',
		});
		expect(result).toEqual({ id: 'file-1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/vouchers/v-1/files',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				formData: { file: expect.any(File) },
			}),
		);
	});

	it('downPaymentInvoices.get retrieves a read-only down-payment invoice', async () => {
		const response = {
			id: 'dp-1',
			version: 1,
			voucherStatus: 'open',
			voucherDate: '2026-04-01',
			totalPrice: { currency: 'EUR' },
			closingInvoiceId: 'inv-1',
		};
		mockedRequest.mockResolvedValue(response);
		const result = await DownPaymentInvoices.get(ctx, { id: 'dp-1' });
		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/down-payment-invoices/dp-1',
			'test-api-key',
			{ method: 'GET' },
		);
	});

	it('downPaymentInvoices.download returns the binary file shape', async () => {
		mockedRequest.mockResolvedValue({
			bytes: new Uint8Array([0, 255]),
			contentType: 'application/pdf',
		});
		const result = await DownPaymentInvoices.download(ctx, { id: 'dp-1' });
		expect(result).toEqual({
			kind: 'binary',
			contentType: 'application/pdf',
			base64: 'AP8=',
			sizeBytes: 2,
		});
	});

	it('payments.get retrieves typed payment information', async () => {
		const response = {
			openAmount: '1337.00',
			currency: 'EUR',
			paymentStatus: 'openRevenue',
			voucherType: 'invoice',
			voucherStatus: 'open',
			paymentItems: [],
		};
		mockedRequest.mockResolvedValue(response);
		const result = await Payments.get(ctx, { voucherId: 'inv-1' });
		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/payments/inv-1',
			'test-api-key',
			{ method: 'GET' },
		);
	});

	it('postingCategories.list validates the documented array response', async () => {
		const response = [
			{
				id: 'cat-1',
				name: 'Travel',
				type: 'outgo',
				contactRequired: false,
				splitAllowed: true,
				groupName: 'Travel',
			},
		];
		mockedRequest.mockResolvedValue(response);
		const result = await PostingCategories.list(ctx, {});
		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/posting-categories',
			'test-api-key',
			{ method: 'GET' },
		);
	});

	it('files.upload sends voucher file multipart fields and validates response', async () => {
		mockedRequest.mockResolvedValue({ id: 'file-1', voucherId: 'voucher-1' });
		const result = await Files.upload(ctx, {
			file: 'JVBERi0xLjQK',
			fileName: 'receipt.pdf',
			contentType: 'application/pdf',
		});
		expect(result).toEqual({ id: 'file-1', voucherId: 'voucher-1' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/files',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				formData: { file: expect.any(File), type: 'voucher' },
			}),
		);
	});

	it('files.download requests binary data and validates the output', async () => {
		mockedRequest.mockResolvedValue({
			bytes: new Uint8Array([1, 2]),
			contentType: 'image/png',
		});
		const result = await Files.download(ctx, {
			id: 'file-1',
			accept: 'image/png',
		});
		expect(result.base64).toBe('AQI=');
		expect(mockedRequest).toHaveBeenCalledWith(
			'/files/file-1',
			'test-api-key',
			{
				method: 'GET',
				headers: { Accept: 'image/png' },
				responseType: 'binary',
			},
		);
	});
});
