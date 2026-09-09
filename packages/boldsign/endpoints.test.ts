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

	it('enforces max 100 on pageSize for all list endpoints', () => {
		// Type-safe: pageSize is number | undefined, max(100) is part of zod schema
		const over = { page: 1, pageSize: 101 };
		const atMax = { page: 1, pageSize: 100 };
		const valid = { page: 1, pageSize: 20 };

		expect(
			BoldsignEndpointInputSchemas.listDocuments.safeParse(over).success,
		).toBe(false);
		expect(
			BoldsignEndpointInputSchemas.listBehalfDocuments.safeParse(over).success,
		).toBe(false);
		expect(
			BoldsignEndpointInputSchemas.listTeamDocuments.safeParse(over).success,
		).toBe(false);

		expect(
			BoldsignEndpointInputSchemas.listDocuments.safeParse(atMax).success,
		).toBe(true);
		expect(
			BoldsignEndpointInputSchemas.listBehalfDocuments.safeParse(atMax).success,
		).toBe(true);
		expect(
			BoldsignEndpointInputSchemas.listTeamDocuments.safeParse(atMax).success,
		).toBe(true);

		expect(
			BoldsignEndpointInputSchemas.listDocuments.safeParse(valid).success,
		).toBe(true);
	});

	it('validates mimeType format for uploadFile helper to prevent data URI injection', () => {
		const valid = BoldsignEndpointInputSchemas.uploadFileHelper.safeParse({
			fileName: 'a.pdf',
			mimeType: 'application/pdf',
			base64Content: 'cGRm',
		});
		expect(valid.success).toBe(true);

		const withImage = BoldsignEndpointInputSchemas.uploadFileHelper.safeParse({
			fileName: 'img.png',
			mimeType: 'image/png',
			base64Content: 'cGRm',
		});
		expect(withImage.success).toBe(true);

		// Injection attempts must fail — type-safe string but rejected by regex
		const injectedSemicolon =
			BoldsignEndpointInputSchemas.uploadFileHelper.safeParse({
				fileName: 'a.pdf',
				mimeType: 'application/pdf; charset=utf-8',
				base64Content: 'cGRm',
			});
		expect(injectedSemicolon.success).toBe(false);

		const injectedComma =
			BoldsignEndpointInputSchemas.uploadFileHelper.safeParse({
				fileName: 'a.pdf',
				mimeType: 'text/html,foo',
				base64Content: 'cGRm',
			});
		expect(injectedComma.success).toBe(false);

		const emptyMime = BoldsignEndpointInputSchemas.uploadFileHelper.safeParse({
			fileName: 'a.pdf',
			mimeType: '',
			base64Content: 'cGRm',
		});
		expect(emptyMime.success).toBe(false);
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

	it('rejects mismatched mimeType when base64Content is already a data URI', async () => {
		// Declared application/pdf but prefixed URI is text/html — must reject (P1 MIME bypass)
		await expect(
			Helpers.uploadFile(ctx, {
				fileName: 'a.pdf',
				mimeType: 'application/pdf',
				base64Content: 'data:text/html;base64,PGh0bWw+',
			}),
		).rejects.toThrow(/MIME type mismatch/);

		// Wrong mime with different case should also reject
		await expect(
			Helpers.uploadFile(ctx, {
				fileName: 'a.pdf',
				mimeType: 'application/pdf',
				base64Content: 'data:image/png;base64,abc',
			}),
		).rejects.toThrow(/MIME type mismatch/);

		// Matching mime (case-insensitive) should succeed — type-safe string literal
		const ok = await Helpers.uploadFile(ctx, {
			fileName: 'a.pdf',
			mimeType: 'application/pdf',
			base64Content: 'data:application/pdf;base64,cGRm',
		});
		expect(ok.file.base64).toBe('data:application/pdf;base64,cGRm');
		// Uppercase data URI with matching MIME must also succeed (case-insensitive)
		const okUpper = await Helpers.uploadFile(ctx, {
			fileName: 'a.pdf',
			mimeType: 'application/pdf',
			base64Content: 'DATA:APPLICATION/PDF;BASE64,cGRm',
		});
		expect(okUpper.file.base64).toBe('DATA:APPLICATION/PDF;BASE64,cGRm');
		// Uppercase mismatched MIME must still be rejected — previous bypass
		await expect(
			Helpers.uploadFile(ctx, {
				fileName: 'a.pdf',
				mimeType: 'application/pdf',
				base64Content: 'DATA:TEXT/HTML;BASE64,PGh0bWw+',
			}),
		).rejects.toThrow(/MIME type mismatch/);
		// Ensure no HTTP call was made for helper — still local validation
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

	it('logs PII-safe payloads for document send and embedded link without signer emails', async () => {
		mockRequest
			.mockResolvedValueOnce({
				documentId: 'doc_1',
				sendUrl: 'https://app.boldsign.com/embed/1',
			})
			.mockResolvedValueOnce({ documentId: 'doc_2' });

		await Documents.createEmbeddedRequestLink(ctx, {
			title: 'Agreement',
			signers: [
				{
					name: 'Alice',
					emailAddress: 'alice@example.com',
					formFields: [{ fieldType: 'Signature' }],
				},
				{ name: 'Bob', emailAddress: 'bob@example.com' },
			],
			files: [
				'data:application/pdf;base64,abc',
				'data:application/pdf;base64,def',
			],
		});
		await Documents.send(ctx, {
			title: 'NDA',
			signers: [{ name: 'Eve', emailAddress: 'eve@example.com' }],
			files: ['data:application/pdf;base64,abc'],
			brandId: 'br_1',
		});

		// First call: createEmbeddedRequestLink — should log counts, not emails
		expect(mockLog).toHaveBeenNthCalledWith(
			1,
			ctx,
			'boldsign.documents.createEmbeddedRequestLink',
			{ title: 'Agreement', signersCount: 2, filesCount: 2 },
			'completed',
		);
		// Second call: send — should log counts and brandId, not signer payload
		expect(mockLog).toHaveBeenNthCalledWith(
			2,
			ctx,
			'boldsign.documents.send',
			{ title: 'NDA', signersCount: 1, filesCount: 1, brandId: 'br_1' },
			'completed',
		);
		// Type-safe check: logged objects must not contain email addresses
		const firstLogPayload = mockLog.mock.calls[0]![2] as Record<
			string,
			string | number
		>;
		const secondLogPayload = mockLog.mock.calls[1]![2] as Record<
			string,
			string | number
		>;
		expect(JSON.stringify(firstLogPayload)).not.toContain('alice@example.com');
		expect(JSON.stringify(firstLogPayload)).not.toContain('bob@example.com');
		expect(JSON.stringify(secondLogPayload)).not.toContain('eve@example.com');
		expect(firstLogPayload).not.toHaveProperty('signers');
		expect(secondLogPayload).not.toHaveProperty('signers');
	});

	it('logs PII-safe payloads for extendExpiry and removeAuthentication without emails', async () => {
		mockRequest.mockResolvedValue(undefined);

		await Documents.extendExpiry(ctx, {
			documentId: 'doc_1',
			newExpiryValue: '2022-12-15',
			warnPrior: true,
			onBehalfOf: 'admin@example.com',
		});
		await Documents.removeAuthentication(ctx, {
			documentId: 'doc_1',
			emailId: 'user@example.com',
			zOrder: 2,
			onBehalfOf: 'admin@example.com',
		});

		expect(mockLog).toHaveBeenNthCalledWith(
			1,
			ctx,
			'boldsign.documents.extendExpiry',
			{ documentId: 'doc_1', newExpiryValue: '2022-12-15', warnPrior: true },
			'completed',
		);
		expect(mockLog).toHaveBeenNthCalledWith(
			2,
			ctx,
			'boldsign.documents.removeAuthentication',
			{ documentId: 'doc_1', zOrder: 2 },
			'completed',
		);
		// Ensure emails are not in logged payloads
		expect(JSON.stringify(mockLog.mock.calls[0]![2])).not.toContain(
			'admin@example.com',
		);
		expect(JSON.stringify(mockLog.mock.calls[1]![2])).not.toContain(
			'user@example.com',
		);
	});

	it('logs PII-safe payloads for list endpoints without email arrays', async () => {
		const page = {
			pageDetails: {
				page: 1,
				pageSize: 10,
				totalRecordsCount: 1,
				totalPages: 1,
			},
			result: [{ documentId: 'doc_1', status: 'Sent' }],
		};
		mockRequest.mockResolvedValue(page);

		await Documents.list(ctx, {
			page: 1,
			pageSize: 20,
			sentBy: ['sender@example.com'],
			recipients: ['recipient@example.com'],
			status: ['Completed'],
			nextCursor: 123,
		});
		await Documents.listBehalf(ctx, {
			page: 1,
			pageSize: 10,
			emailAddress: ['behalf@example.com'],
			signers: ['signer@example.com'],
			status: ['Completed'],
			nextCursor: 456,
		});
		await Documents.listTeam(ctx, {
			page: 1,
			pageSize: 10,
			userId: ['user_1'],
			teamId: ['team_1'],
			status: ['Completed'],
			nextCursor: 789,
		});

		expect(mockLog).toHaveBeenNthCalledWith(
			1,
			ctx,
			'boldsign.documents.list',
			{ page: 1, pageSize: 20, status: ['Completed'], nextCursor: 123 },
			'completed',
		);
		expect(mockLog).toHaveBeenNthCalledWith(
			2,
			ctx,
			'boldsign.documents.listBehalf',
			{
				page: 1,
				pageSize: 10,
				pageType: undefined,
				status: ['Completed'],
				nextCursor: 456,
			},
			'completed',
		);
		expect(mockLog).toHaveBeenNthCalledWith(
			3,
			ctx,
			'boldsign.documents.listTeam',
			{ page: 1, pageSize: 10, status: ['Completed'], nextCursor: 789 },
			'completed',
		);
		// Emails / IDs must not appear in logs
		expect(JSON.stringify(mockLog.mock.calls[0]![2])).not.toContain(
			'sender@example.com',
		);
		expect(JSON.stringify(mockLog.mock.calls[1]![2])).not.toContain(
			'behalf@example.com',
		);
		expect(JSON.stringify(mockLog.mock.calls[2]![2])).not.toContain('user_1');
	});
});
