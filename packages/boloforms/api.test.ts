import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { makeBoloformsRequest } from './client';
import { Documents } from './endpoints';
import { BoloformsEndpointOutputSchemas } from './endpoints/types';
import type { BoloformsContext, BoloformsKeyBuilderContext } from './index';
import { boloforms } from './index';
import { BoloformsDocument, BoloformsSchema } from './schema';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(),
}));

jest.mock('./client', () => ({
	makeBoloformsRequest: jest.fn(),
}));

const mockRequest = jest.mocked(makeBoloformsRequest);
const mockLog = jest.mocked(logEventFromContext);

const KEY = 'test-api-key';
const WORKSPACE = 'ws-test-123';
const ctx = { key: KEY } as BoloformsContext;

const document = {
	documentId: '3fd64329-0ea0-42fa-b12d-4867bead168c',
	documentName: 'Test Document',
	name: 'Test Document',
	status: 'DRAFT',
	signingType: 'PDF_TEMPLATE',
	createdAt: '2026-08-10T00:00:00.000Z',
};

const listResponse = {
	documents: [document],
	message: 'Fetched documents',
	formCount: 1,
	documentsCount: 1,
};

describe('Boloforms schema', () => {
	it('declares a semver version', () => {
		expect(BoloformsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('registers documents entity from official docs shape', () => {
		expect(BoloformsSchema.entities.documents).toBe(BoloformsDocument);
		expect(BoloformsDocument.parse(document).documentId).toBe(
			document.documentId,
		);
	});
});

describe('documents.list', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
	});

	it('sends x-api-key path via makeBoloformsRequest with workspace + query', async () => {
		mockRequest.mockResolvedValue(listResponse);

		const result = await Documents.list(ctx, {
			workspaceId: WORKSPACE,
			page: '1',
			limit: '10',
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'signature/get-documents',
			KEY,
			WORKSPACE,
			{
				method: 'GET',
				query: { page: '1', limit: '10' },
			},
		);
		expect(
			BoloformsEndpointOutputSchemas.getDocumentsList.parse(result),
		).toEqual(listResponse);
		expect(mockLog).toHaveBeenCalledWith(
			ctx,
			'boloforms.documents.list',
			{ workspaceId: WORKSPACE, page: '1', limit: '10' },
			'completed',
		);
	});

	it('parses OpenAPI pagination when present', async () => {
		const withPagination = {
			documents: [
				{
					documentId: 'doc-1',
					name: 'Agreement',
					status: 'COMPLETED',
					createdAt: '2026-01-01T00:00:00.000Z',
				},
			],
			pagination: {
				currentPage: 1,
				totalPages: 1,
				totalDocuments: 1,
			},
		};
		mockRequest.mockResolvedValue(withPagination);

		const result = await Documents.list(ctx, { workspaceId: WORKSPACE });
		expect(
			BoloformsEndpointOutputSchemas.getDocumentsList.parse(result),
		).toEqual(withPagination);
	});

	it('propagates client errors', async () => {
		mockRequest.mockRejectedValue(new Error('boom'));
		await expect(
			Documents.list(ctx, { workspaceId: WORKSPACE }),
		).rejects.toThrow('boom');
	});
});

describe('boloforms keyBuilder authentication', () => {
	const plugin = boloforms();

	it('returns options.key for endpoint source', async () => {
		const withOptionsKey = boloforms({ key: KEY });
		const out = await withOptionsKey.keyBuilder!(
			{ authType: 'api_key' } as unknown as BoloformsKeyBuilderContext,
			'endpoint',
		);
		expect(out).toBe(KEY);
	});

	it('throws AuthMissingError when api key is absent', async () => {
		const noKeyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async (): Promise<string | null> => null },
		} as unknown as BoloformsKeyBuilderContext;

		await expect(
			plugin.keyBuilder!(noKeyCtx, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('reads api key from key manager', async () => {
		const withKeyCtx = {
			authType: 'api_key',
			keys: { get_api_key: async (): Promise<string | null> => KEY },
		} as unknown as BoloformsKeyBuilderContext;

		await expect(plugin.keyBuilder!(withKeyCtx, 'endpoint')).resolves.toBe(KEY);
	});
});
