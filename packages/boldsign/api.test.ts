import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { Brands, CustomFields, Documents, Helpers, Plan } from './endpoints';
import { BoldsignEndpointOutputSchemas } from './endpoints/types';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

jest.mock('./client', () => ({
	makeBoldsignRequest: jest.fn(),
}));

const mockedRequest = client.makeBoldsignRequest as jest.MockedFunction<
	typeof client.makeBoldsignRequest
>;

const ctx = {
	key: 'test-key',
	options: { authType: 'oauth_2' },
	db: {},
} as never;

describe('BoldSign endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('creates custom field', async () => {
		mockedRequest.mockResolvedValueOnce({
			customFieldId: 'cf_123',
			message: 'created',
		});

		const res = await CustomFields.create(ctx, {
			fieldName: 'Company Name',
			formField: { fieldType: 'TextBox' },
		});

		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/customField/create',
			{ key: 'test-key', authType: 'oauth_2' },
			expect.objectContaining({ method: 'POST' }),
		);
		expect(BoldsignEndpointOutputSchemas.createCustomField.parse(res)).toEqual(
			res,
		);
	});

	it('edits custom field', async () => {
		mockedRequest.mockResolvedValueOnce({
			customFieldId: 'cf_123',
			message: 'updated',
		});

		await CustomFields.edit(ctx, {
			customFieldId: 'cf_123',
			fieldName: 'Company',
			formField: { fieldType: 'TextBox' },
		});

		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/customField/edit',
			{ key: 'test-key', authType: 'oauth_2' },
			expect.objectContaining({
				method: 'POST',
				query: { customFieldId: 'cf_123' },
			}),
		);
	});

	it('gets and lists brands', async () => {
		mockedRequest
			.mockResolvedValueOnce({ brandId: 'br_1', brandName: 'Brand One' })
			.mockResolvedValueOnce({
				result: [{ brandId: 'br_1', brandName: 'Brand One' }],
			});

		const getRes = await Brands.get(ctx, { brandId: 'br_1' });
		const listRes = await Brands.list(ctx, {});

		expect(getRes.brandId).toBe('br_1');
		expect(listRes.result).toHaveLength(1);
		expect(mockedRequest).toHaveBeenNthCalledWith(
			1,
			'/v1/brand/get',
			{ key: 'test-key', authType: 'oauth_2' },
			expect.objectContaining({ method: 'GET', query: { brandId: 'br_1' } }),
		);
		expect(mockedRequest).toHaveBeenNthCalledWith(
			2,
			'/v1/brand/list',
			{ key: 'test-key', authType: 'oauth_2' },
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('creates embedded request link', async () => {
		mockedRequest.mockResolvedValueOnce({
			documentId: 'doc_1',
			sendUrl: 'https://app.boldsign.com/document/embed/1',
		});

		const res = await Documents.createEmbeddedRequestLink(ctx, {
			title: 'Agreement',
			showToolbar: true,
		});

		expect(res.documentId).toBe('doc_1');
		expect(res.sendUrl).toContain('boldsign.com');
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/document/createEmbeddedRequestUrl',
			{ key: 'test-key', authType: 'oauth_2' },
			expect.objectContaining({ method: 'POST' }),
		);
	});

	it('sends and edits document', async () => {
		mockedRequest
			.mockResolvedValueOnce({ documentId: 'doc_1' })
			.mockResolvedValueOnce({ status: 'Queued' });

		const sendRes = await Documents.send(ctx, {
			title: 'NDA',
			files: ['data:application/pdf;base64,abc'],
		});

		const editRes = await Documents.editBeta(ctx, {
			documentId: 'doc_1',
			title: 'NDA v2',
		});

		expect(sendRes.documentId).toBe('doc_1');
		expect(editRes.status).toBe('Queued');
		expect(mockedRequest).toHaveBeenNthCalledWith(
			1,
			'/v1/document/send',
			{ key: 'test-key', authType: 'oauth_2' },
			expect.objectContaining({ method: 'POST' }),
		);
		expect(mockedRequest).toHaveBeenNthCalledWith(
			2,
			'/v1/document/edit',
			{ key: 'test-key', authType: 'oauth_2' },
			expect.objectContaining({
				method: 'PUT',
				query: { documentId: 'doc_1' },
			}),
		);
	});

	it('extends expiry and removes authentication', async () => {
		mockedRequest.mockResolvedValueOnce({}).mockResolvedValueOnce({});

		const extendRes = await Documents.extendExpiry(ctx, {
			documentId: 'doc_1',
			newExpiryValue: '30',
		});

		const removeRes = await Documents.removeAuthentication(ctx, {
			documentId: 'doc_1',
			emailId: 'user@example.com',
		});

		expect(extendRes.success).toBe(true);
		expect(removeRes.success).toBe(true);
		expect(mockedRequest).toHaveBeenNthCalledWith(
			1,
			'/v1/document/extendExpiry',
			{ key: 'test-key', authType: 'oauth_2' },
			expect.objectContaining({
				method: 'PATCH',
				query: { documentId: 'doc_1' },
			}),
		);
		expect(mockedRequest).toHaveBeenNthCalledWith(
			2,
			'/v1/document/RemoveAuthentication',
			{ key: 'test-key', authType: 'oauth_2' },
			expect.objectContaining({
				method: 'PATCH',
				query: { DocumentId: 'doc_1' },
			}),
		);
	});

	it('lists account, behalf, and team documents with pagination input', async () => {
		const page = {
			pageDetails: {
				page: 1,
				pageSize: 20,
				totalRecordsCount: 1,
				totalPages: 1,
			},
			result: [{ documentId: 'doc_1', status: 'Sent', nextCursor: 987 }],
		};

		mockedRequest
			.mockResolvedValueOnce(page)
			.mockResolvedValueOnce(page)
			.mockResolvedValueOnce(page);

		const input = { page: 1, pageSize: 20, nextCursor: 987 };
		const [documents, behalf, team] = await Promise.all([
			Documents.list(ctx, input),
			Documents.listBehalf(ctx, input),
			Documents.listTeam(ctx, input),
		]);

		expect(documents.result[0]?.documentId).toBe('doc_1');
		expect(behalf.result[0]?.documentId).toBe('doc_1');
		expect(team.result[0]?.documentId).toBe('doc_1');
		expect(mockedRequest).toHaveBeenCalledTimes(3);
	});

	it('gets API credits count', async () => {
		mockedRequest.mockResolvedValueOnce({ BalanceCredits: 99 });
		const res = await Plan.getApiCreditsCount(ctx, {});
		expect(res.BalanceCredits).toBe(99);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/v1/plan/apiCreditsCount',
			{ key: 'test-key', authType: 'oauth_2' },
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('builds upload file helper payload', async () => {
		const res = await Helpers.uploadFile(ctx, {
			fileName: 'agreement.pdf',
			mimeType: 'application/pdf',
			base64Content: 'cGRm',
		});

		expect(mockedRequest).not.toHaveBeenCalled();
		expect(res.file.fileName).toBe('agreement.pdf');
		expect(res.file.base64).toContain('data:application/pdf;base64,cGRm');
	});

	it('logs events for each operation', async () => {
		mockedRequest.mockResolvedValue({ BalanceCredits: 1 });
		await Plan.getApiCreditsCount(ctx, {});
		expect(jest.mocked(logEventFromContext)).toHaveBeenCalledWith(
			ctx,
			'boldsign.plan.getApiCreditsCount',
			{},
			'completed',
		);
	});
});
