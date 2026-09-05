import { logEventFromContext } from 'corsair/core';
import { makeBoldsignRequest } from './client';
import { Brands, CustomFields, Documents, Helpers, Plan } from './endpoints';
import { BoldsignEndpointInputSchemas } from './endpoints/types';
import type { BoldsignContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

jest.mock('./client', () => ({
	makeBoldsignRequest: jest.fn(),
}));

const mockRequest = jest.mocked(makeBoldsignRequest);
const mockLog = jest.mocked(logEventFromContext);

// Narrow context assertion following the repo test idiom (cf. apibible api.test.ts).
const ctx = {
	key: 'test-key',
	options: { authType: 'oauth_2' },
} as BoldsignContext;

describe('BoldSign endpoint inputs', () => {
	it('requires a page for document listing', () => {
		const parsed = BoldsignEndpointInputSchemas.listDocuments.safeParse({});
		expect(parsed.success).toBe(false);
		const valid = BoldsignEndpointInputSchemas.listDocuments.safeParse({
			page: 2,
			pageSize: 10,
		});
		expect(valid.success).toBe(true);
	});

	it('requires newExpiryValue for extendExpiry (the documented NewExpiryValue field)', () => {
		const missing = BoldsignEndpointInputSchemas.extendDocumentExpiry.safeParse(
			{
				documentId: 'doc_1',
			},
		);
		expect(missing.success).toBe(false);
		const legacy = BoldsignEndpointInputSchemas.extendDocumentExpiry.safeParse({
			documentId: 'doc_1',
			newExpiryDate: '2022-12-15',
		});
		expect(legacy.success).toBe(false);
		const valid = BoldsignEndpointInputSchemas.extendDocumentExpiry.safeParse({
			documentId: 'doc_1',
			newExpiryValue: '2022-12-15',
		});
		expect(valid.success).toBe(true);
	});

	it('requires title for send and fieldName plus formField for custom field creation', () => {
		expect(
			BoldsignEndpointInputSchemas.sendDocument.safeParse({}).success,
		).toBe(false);
		expect(
			BoldsignEndpointInputSchemas.createCustomField.safeParse({
				fieldName: 'Only name',
			}).success,
		).toBe(false);
		expect(
			BoldsignEndpointInputSchemas.createCustomField.safeParse({
				fieldName: 'Company',
				formField: { fieldType: 'TextBox' },
			}).success,
		).toBe(true);
	});

	it('requires documentId and emailId for removeAuthentication', () => {
		expect(
			BoldsignEndpointInputSchemas.removeDocumentAuthentication.safeParse({
				documentId: 'doc_1',
			}).success,
		).toBe(false);
		expect(
			BoldsignEndpointInputSchemas.removeDocumentAuthentication.safeParse({
				documentId: 'doc_1',
				emailId: 'user@example.com',
			}).success,
		).toBe(true);
	});
});

describe('BoldSign endpoint requests', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockClear();
	});

	it('rejects invalid inputs at runtime before any HTTP call', async () => {
		// page is typed as number but must be positive, so these typecheck
		// yet fail zod validation inside the handler.
		await expect(Documents.list(ctx, { page: 0 })).rejects.toThrow();
		await expect(Documents.listBehalf(ctx, { page: -1 })).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('sends extendExpiry with the documented PascalCase body', async () => {
		mockRequest.mockResolvedValue(undefined);

		const res = await Documents.extendExpiry(ctx, {
			documentId: 'doc_1',
			newExpiryValue: '2022-12-15',
			warnPrior: true,
		});

		expect(res.success).toBe(true);
		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/document/extendExpiry',
			{ key: 'test-key', authType: 'oauth_2' },
			expect.objectContaining({
				method: 'PATCH',
				query: { documentId: 'doc_1' },
				body: {
					NewExpiryValue: '2022-12-15',
					WarnPrior: true,
					OnBehalfOf: undefined,
				},
			}),
		);
	});

	it('sends removeAuthentication with a lowercase documentId query param', async () => {
		mockRequest.mockResolvedValue(undefined);

		const res = await Documents.removeAuthentication(ctx, {
			documentId: 'doc_1',
			emailId: 'user@example.com',
			zOrder: 2,
		});

		expect(res.success).toBe(true);
		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/document/RemoveAuthentication',
			{ key: 'test-key', authType: 'oauth_2' },
			expect.objectContaining({
				method: 'PATCH',
				query: { documentId: 'doc_1' },
				body: { EmailId: 'user@example.com', zOrder: 2, OnBehalfOf: undefined },
			}),
		);
	});

	it('rejects a non-empty provider response on the no-content endpoints', async () => {
		mockRequest.mockResolvedValue({ unexpected: 'payload' });

		await expect(
			Documents.extendExpiry(ctx, {
				documentId: 'doc_1',
				newExpiryValue: '2022-12-15',
			}),
		).rejects.toThrow();
		await expect(
			Documents.removeAuthentication(ctx, {
				documentId: 'doc_1',
				emailId: 'user@example.com',
			}),
		).rejects.toThrow();
	});

	it('forwards pagination params on all three list endpoints', async () => {
		const page = {
			pageDetails: {
				page: 2,
				pageSize: 10,
				totalRecordsCount: 11,
				totalPages: 2,
			},
			result: [{ documentId: 'doc_1', status: 'Sent' }],
		};
		mockRequest.mockResolvedValue(page);

		const input = { page: 2, pageSize: 10, nextCursor: 1689815402493 };
		await Documents.list(ctx, input);
		await Documents.listBehalf(ctx, input);
		await Documents.listTeam(ctx, input);

		expect(mockRequest).toHaveBeenNthCalledWith(
			1,
			'/v1/document/list',
			{ key: 'test-key', authType: 'oauth_2' },
			expect.objectContaining({ method: 'GET', query: input }),
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			2,
			'/v1/document/behalfList',
			{ key: 'test-key', authType: 'oauth_2' },
			expect.objectContaining({ method: 'GET', query: input }),
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			3,
			'/v1/document/teamlist',
			{ key: 'test-key', authType: 'oauth_2' },
			expect.objectContaining({ method: 'GET', query: input }),
		);
	});

	it('edits a document via PUT with the documentId query param', async () => {
		mockRequest.mockResolvedValue({ status: 'Queued' });

		const res = await Documents.editBeta(ctx, {
			documentId: 'doc_1',
			title: 'NDA v2',
		});

		expect(res.status).toBe('Queued');
		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/document/edit',
			{ key: 'test-key', authType: 'oauth_2' },
			expect.objectContaining({
				method: 'PUT',
				query: { documentId: 'doc_1' },
			}),
		);
	});

	it('lists brands with the default empty input', async () => {
		mockRequest.mockResolvedValue({ result: [] });

		const res = await Brands.list(ctx, {});

		expect(res.result).toEqual([]);
		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/brand/list',
			{ key: 'test-key', authType: 'oauth_2' },
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('creates and edits custom fields through the documented paths', async () => {
		mockRequest
			.mockResolvedValueOnce({ customFieldId: 'cf_1', message: 'created' })
			.mockResolvedValueOnce({ customFieldId: 'cf_1', message: 'updated' });

		await CustomFields.create(ctx, {
			fieldName: 'Company',
			formField: { fieldType: 'TextBox' },
		});
		await CustomFields.edit(ctx, {
			customFieldId: 'cf_1',
			fieldName: 'Company',
			formField: { fieldType: 'TextBox' },
		});

		expect(mockRequest).toHaveBeenNthCalledWith(
			1,
			'/v1/customField/create',
			{ key: 'test-key', authType: 'oauth_2' },
			expect.objectContaining({ method: 'POST' }),
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			2,
			'/v1/customField/edit',
			{ key: 'test-key', authType: 'oauth_2' },
			expect.objectContaining({
				method: 'POST',
				query: { customFieldId: 'cf_1' },
			}),
		);
	});

	it('builds file payloads with and without data URI prefixes', async () => {
		const bare = await Helpers.uploadFile(ctx, {
			fileName: 'a.pdf',
			mimeType: 'application/pdf',
			base64Content: 'cGRm',
		});
		const prefixed = await Helpers.uploadFile(ctx, {
			fileName: 'a.pdf',
			mimeType: 'application/pdf',
			base64Content: 'data:application/pdf;base64,cGRm',
		});

		expect(bare.file.base64).toBe('data:application/pdf;base64,cGRm');
		expect(prefixed.file.base64).toBe('data:application/pdf;base64,cGRm');
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('reads API credits and logs the operation', async () => {
		mockRequest.mockResolvedValue({ BalanceCredits: 42 });

		const res = await Plan.getApiCreditsCount(ctx, {});

		expect(res.BalanceCredits).toBe(42);
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'boldsign.plan.getApiCreditsCount',
			{},
			'completed',
		);
	});
});
