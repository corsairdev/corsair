import * as client from './client';
import { Classification, Credits, Extraction } from './endpoints';
import type { ExtractaaiContext } from './index';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeExtractaaiRequest: jest.fn(),
	};
});

const mockMakeExtractaaiRequest = jest.mocked(client.makeExtractaaiRequest);

// Test-double justification: endpoint handlers require the full
// CorsairPluginContext (bound endpoints, key managers, DB clients) which unit
// tests cannot construct structurally. This single cast is confined to test
// setup — the handlers under test only read `ctx.key` — and mirrors the
// precedent in packages/agiled/endpoints.test.ts. Plugin source files contain
// zero type assertions.
function createMockContext(key: string): ExtractaaiContext {
	const mock = {
		key,
		$getAccountId: (): Promise<string> => Promise.resolve('test-account-id'),
	};
	return mock as unknown as ExtractaaiContext;
}

const extractionDetailsInput = {
	name: 'CVs Extraction',
	description: 'CV parsing template',
	language: 'English',
	options: { hasTable: false, handwrittenTextRecognition: false },
	fields: [
		{ key: 'name', description: '', example: '' },
		{
			key: 'last_job_position',
			description: 'last job title name',
			example: 'Programmer',
		},
	],
};

describe('extraction endpoints', () => {
	beforeEach(() => {
		mockMakeExtractaaiRequest.mockReset();
	});

	it('create posts extractionDetails and returns the new id', async () => {
		const ctx = createMockContext('test-api-key');
		mockMakeExtractaaiRequest.mockResolvedValueOnce({
			status: 'created',
			createdAt: 1712547789609,
			extractionId: 'extr_123',
		});

		const result = await Extraction.create(ctx, {
			extractionDetails: extractionDetailsInput,
		});

		expect(result).toEqual({
			status: 'created',
			createdAt: 1712547789609,
			extractionId: 'extr_123',
		});
		expect(mockMakeExtractaaiRequest).toHaveBeenCalledWith(
			'createExtraction',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				body: { extractionDetails: extractionDetailsInput },
			}),
		);
	});

	it('view posts the extractionId and returns the configuration', async () => {
		const ctx = createMockContext('test-api-key');
		const viewResponse = {
			extractionId: 'extr_123',
			extractionDetails: {
				name: 'CVs Extraction',
				description: 'CV parsing template',
				language: 'English',
				options: { hasTable: false },
				fields: [{ key: 'name', description: '', example: '' }],
			},
		};
		mockMakeExtractaaiRequest.mockResolvedValueOnce(viewResponse);

		const result = await Extraction.view(ctx, { extractionId: 'extr_123' });

		expect(result).toEqual(viewResponse);
		expect(mockMakeExtractaaiRequest).toHaveBeenCalledWith(
			'viewExtraction',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				body: { extractionId: 'extr_123' },
			}),
		);
	});

	it('update patches only the provided details', async () => {
		const ctx = createMockContext('test-api-key');
		mockMakeExtractaaiRequest.mockResolvedValueOnce({
			status: 'updated',
			updatedAt: 1712547789609,
			extractionId: 'extr_123',
		});

		const result = await Extraction.update(ctx, {
			extractionId: 'extr_123',
			extractionDetails: { name: 'CV - English' },
		});

		expect(result.status).toBe('updated');
		expect(mockMakeExtractaaiRequest).toHaveBeenCalledWith(
			'updateExtraction',
			'test-api-key',
			expect.objectContaining({
				method: 'PATCH',
				body: {
					extractionId: 'extr_123',
					extractionDetails: { name: 'CV - English' },
				},
			}),
		);
	});

	it('delete sends the extraction id in a DELETE body', async () => {
		const ctx = createMockContext('test-api-key');
		mockMakeExtractaaiRequest.mockResolvedValueOnce({
			status: 'deleted',
			deletedAt: 1712547789609,
		});

		const result = await Extraction.delete(ctx, {
			extractionId: 'extr_123',
		});

		expect(result).toEqual({
			status: 'deleted',
			deletedAt: 1712547789609,
		});
		expect(mockMakeExtractaaiRequest).toHaveBeenCalledWith(
			'deleteExtraction',
			'test-api-key',
			expect.objectContaining({
				method: 'DELETE',
				body: { extractionId: 'extr_123' },
			}),
		);
	});

	it('delete forwards batchId and fileId for scoped deletes', async () => {
		const ctx = createMockContext('test-api-key');
		mockMakeExtractaaiRequest.mockResolvedValueOnce({
			status: 'deleted',
			deletedAt: 1712547789609,
		});

		await Extraction.delete(ctx, {
			extractionId: 'extr_123',
			batchId: 'batch_1',
			fileId: 'file_1',
		});

		expect(mockMakeExtractaaiRequest).toHaveBeenCalledWith(
			'deleteExtraction',
			'test-api-key',
			expect.objectContaining({
				method: 'DELETE',
				body: {
					extractionId: 'extr_123',
					batchId: 'batch_1',
					fileId: 'file_1',
				},
			}),
		);
	});

	it('getBatchResults returns completed file results', async () => {
		const ctx = createMockContext('test-api-key');
		const batchResponse = {
			extractionId: 'extr_123',
			batchId: 'batch_1',
			files: [
				{
					fileName: 'File 1.png',
					status: 'processed',
					result: { name: 'John', years_of_experience: '6' },
					url: 'https://files.extracta.ai/file1',
				},
			],
		};
		mockMakeExtractaaiRequest.mockResolvedValueOnce(batchResponse);

		const result = await Extraction.getBatchResults(ctx, {
			extractionId: 'extr_123',
			batchId: 'batch_1',
		});

		expect(result).toEqual(batchResponse);
		expect(mockMakeExtractaaiRequest).toHaveBeenCalledWith(
			'getBatchResults',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				body: { extractionId: 'extr_123', batchId: 'batch_1' },
			}),
		);
	});

	it('getBatchResults forwards an optional fileId filter', async () => {
		const ctx = createMockContext('test-api-key');
		mockMakeExtractaaiRequest.mockResolvedValueOnce({
			status: 'waiting',
			extractionId: 'extr_123',
			batchId: 'batch_1',
			fileId: 'file_1',
		});

		const result = await Extraction.getBatchResults(ctx, {
			extractionId: 'extr_123',
			batchId: 'batch_1',
			fileId: 'file_1',
		});

		expect(result).toMatchObject({ status: 'waiting' });
		expect(mockMakeExtractaaiRequest).toHaveBeenCalledWith(
			'getBatchResults',
			'test-api-key',
			expect.objectContaining({
				body: {
					extractionId: 'extr_123',
					batchId: 'batch_1',
					fileId: 'file_1',
				},
			}),
		);
	});

	it('rejects transport responses that violate the output schema', async () => {
		const ctx = createMockContext('test-api-key');
		mockMakeExtractaaiRequest.mockResolvedValueOnce({ bogus: true });

		await expect(
			Extraction.create(ctx, { extractionDetails: extractionDetailsInput }),
		).rejects.toThrow(/failed schema validation/);
		expect(mockMakeExtractaaiRequest).toHaveBeenCalledTimes(1);
	});
});

describe('credits endpoint', () => {
	beforeEach(() => {
		mockMakeExtractaaiRequest.mockReset();
	});

	it('get calls GET /credits and returns the balance', async () => {
		const ctx = createMockContext('test-api-key');
		mockMakeExtractaaiRequest.mockResolvedValueOnce({
			status: 'ok',
			credits: 50,
		});

		const result = await Credits.get(ctx, {});

		expect(result).toEqual({ status: 'ok', credits: 50 });
		expect(mockMakeExtractaaiRequest).toHaveBeenCalledWith(
			'credits',
			'test-api-key',
			expect.objectContaining({ method: 'GET' }),
		);
	});
});

describe('classification endpoints', () => {
	beforeEach(() => {
		mockMakeExtractaaiRequest.mockReset();
	});

	const classificationDetailsInput = {
		name: 'Financial Document Classifier',
		description: 'Classifies financial documents.',
		documentTypes: [
			{
				name: 'Invoice',
				description: 'Standard commercial invoice.',
				uniqueWords: ['invoice number', 'bill to', 'total amount'],
				extractionId: 'extr_invoice',
			},
			{
				name: 'Receipt',
				description: 'Retail receipts.',
				uniqueWords: ['receipt', 'paid'],
			},
		],
	};

	it('create posts classificationDetails and returns the new id', async () => {
		const ctx = createMockContext('test-api-key');
		mockMakeExtractaaiRequest.mockResolvedValueOnce({
			status: 'created',
			createdAt: 1712547789609,
			classificationId: 'cls_123',
		});

		const result = await Classification.create(ctx, {
			classificationDetails: classificationDetailsInput,
		});

		expect(result.classificationId).toBe('cls_123');
		expect(mockMakeExtractaaiRequest).toHaveBeenCalledWith(
			'documentClassification/createClassification',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				body: { classificationDetails: classificationDetailsInput },
			}),
		);
	});

	it('view posts the classificationId and returns the configuration', async () => {
		const ctx = createMockContext('test-api-key');
		const viewResponse = {
			status: 'success',
			classificationId: 'cls_123',
			classificationDetails: {
				createdAt: 1746720170530,
				name: 'Financial Document Classifier',
				description: 'Classifies financial documents.',
				documentTypes: classificationDetailsInput.documentTypes,
			},
		};
		mockMakeExtractaaiRequest.mockResolvedValueOnce(viewResponse);

		const result = await Classification.view(ctx, {
			classificationId: 'cls_123',
		});

		expect(result).toEqual(viewResponse);
		expect(mockMakeExtractaaiRequest).toHaveBeenCalledWith(
			'documentClassification/viewClassification',
			'test-api-key',
			expect.objectContaining({
				method: 'POST',
				body: { classificationId: 'cls_123' },
			}),
		);
	});

	it('update patches the classification details', async () => {
		const ctx = createMockContext('test-api-key');
		mockMakeExtractaaiRequest.mockResolvedValueOnce({
			status: 'updated',
			updatedAt: 1746720927500,
			classificationId: 'cls_123',
		});

		const result = await Classification.update(ctx, {
			classificationId: 'cls_123',
			classificationDetails: {
				name: 'Financial Document Classifier - updated',
				description: 'Updated description.',
				documentTypes: [
					{
						name: 'Invoice',
						description: 'Standard commercial invoice.',
						uniqueWords: ['invoice number', 'bill to', 'total amount'],
						extractionId: 'extr_invoice',
					},
				],
			},
		});

		expect(result.status).toBe('updated');
		expect(mockMakeExtractaaiRequest).toHaveBeenCalledWith(
			'documentClassification/updateClassification',
			'test-api-key',
			expect.objectContaining({ method: 'PATCH' }),
		);
	});

	it('delete sends the classificationId in a DELETE body', async () => {
		const ctx = createMockContext('test-api-key');
		mockMakeExtractaaiRequest.mockResolvedValueOnce({
			status: 'success',
			message: 'Classification deleted',
		});

		const result = await Classification.delete(ctx, {
			classificationId: 'cls_123',
		});

		expect(result).toEqual({
			status: 'success',
			message: 'Classification deleted',
		});
		expect(mockMakeExtractaaiRequest).toHaveBeenCalledWith(
			'documentClassification/deleteClassification',
			'test-api-key',
			expect.objectContaining({
				method: 'DELETE',
				body: { classificationId: 'cls_123' },
			}),
		);
	});

	it('rejects transport responses that violate the output schema', async () => {
		const ctx = createMockContext('test-api-key');
		mockMakeExtractaaiRequest.mockResolvedValueOnce({ bogus: true });

		await expect(
			Classification.view(ctx, { classificationId: 'cls_123' }),
		).rejects.toThrow(/failed schema validation/);
	});
});
