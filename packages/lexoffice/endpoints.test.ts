import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Contacts,
	CreditNotes,
	Invoices,
	Profile,
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
		expect(mockedRequest).toHaveBeenCalledWith('/contacts/c-123', 'test-api-key', {
			method: 'GET',
		});
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
			resourceUri: 'https://api.lexoffice.io/v1/contacts/new-c',
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
			roles: { customer: { number: 101 } },
			person: { lastName: 'Updated' },
		};
		const result = await Contacts.update(ctx, input);
		expect(result).toEqual(mutationResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/contacts/c-123', 'test-api-key', {
			method: 'PUT',
			body: {
				version: 0,
				roles: { customer: { number: 101 } },
				person: { lastName: 'Updated' },
			},
		});
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
		expect(mockedRequest).toHaveBeenCalledWith('/invoices', 'test-api-key', {
			method: 'GET',
			query: { page: 0 },
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
		expect(mockedRequest).toHaveBeenCalledWith('/invoices/inv-1', 'test-api-key', {
			method: 'GET',
		});
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
			voucherDate: '2026-01-01',
			address: { name: 'Customer GmbH' },
			lineItems: [
				{
					type: 'custom' as const,
					name: 'Service',
					unitPrice: { currency: 'EUR', netAmount: 100, taxRatePercentage: 19 },
				},
			],
			totalPrice: { currency: 'EUR' },
			taxConditions: { taxType: 'net' as const },
		};

		const result = await Invoices.create(ctx, input);
		expect(result).toEqual(mutationResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/invoices', 'test-api-key', {
			method: 'POST',
			body: {
				voucherDate: '2026-01-01',
				address: { name: 'Customer GmbH' },
				lineItems: [
					{
						type: 'custom',
						name: 'Service',
						unitPrice: { currency: 'EUR', netAmount: 100, taxRatePercentage: 19 },
					},
				],
				totalPrice: { currency: 'EUR' },
				taxConditions: { taxType: 'net' },
			},
			query: { finalize: 'true' },
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
		expect(mockedRequest).toHaveBeenCalledWith('/vouchers', 'test-api-key', {
			method: 'GET',
			query: { voucherNumber: 'V-001' },
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
		expect(mockedRequest).toHaveBeenCalledWith('/vouchers/v-1', 'test-api-key', {
			method: 'GET',
		});
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
			voucherDate: '2026-02-01',
			totalNetAmount: 100,
			totalGrossAmount: 119,
			taxType: 'net' as const,
			voucherItems: [
				{
					amount: 100,
					taxRatePercent: 19,
					categoryId: 'cat-abc',
				},
			],
			version: 0,
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
		expect(mockedRequest).toHaveBeenCalledWith('/credit-notes', 'test-api-key', {
			method: 'GET',
			query: { page: 0 },
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
});
