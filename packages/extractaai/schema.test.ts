import {
	DocumentTypeSchema,
	ExtractaaiEndpointInputSchemas,
	ExtractaaiEndpointOutputSchemas,
	ExtractionFieldSchema,
	ExtractionOptionsSchema,
} from './endpoints/types';
import {
	ExtractaaiClassification,
	ExtractaaiExtraction,
	ExtractaaiSchema,
} from './schema';

describe('Extracta.ai schema registry', () => {
	it('declares a semver version', () => {
		expect(ExtractaaiSchema.version).toBeDefined();
		expect(ExtractaaiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares extractions and classifications entities', () => {
		expect(Object.keys(ExtractaaiSchema.entities)).toContain('extractions');
		expect(Object.keys(ExtractaaiSchema.entities)).toContain('classifications');
		for (const entity of Object.values(ExtractaaiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('validates an extraction entity', () => {
		const parsed = ExtractaaiExtraction.parse({
			id: 'extr_123',
			extractionId: 'extr_123',
			name: 'CVs Extraction',
			language: 'English',
		});
		expect(parsed.extractionId).toBe('extr_123');
		expect(parsed.name).toBe('CVs Extraction');
	});

	it('rejects an extraction entity without identifiers', () => {
		expect(() => ExtractaaiExtraction.parse({ name: 'Missing ids' })).toThrow();
	});

	it('validates a classification entity', () => {
		const parsed = ExtractaaiClassification.parse({
			id: 'cls_123',
			classificationId: 'cls_123',
			name: 'Financial Document Classifier',
		});
		expect(parsed.classificationId).toBe('cls_123');
	});

	it('rejects a classification entity without identifiers', () => {
		expect(() =>
			ExtractaaiClassification.parse({ name: 'Missing ids' }),
		).toThrow();
	});
});

describe('Shared zod building blocks', () => {
	it('accepts documented extraction options', () => {
		const parsed = ExtractionOptionsSchema.parse({
			hasTable: false,
			hasVisuals: true,
			handwrittenTextRecognition: false,
			checkboxRecognition: true,
			longDocument: false,
			splitPdfPages: false,
		});
		expect(parsed.hasVisuals).toBe(true);
	});

	it('accepts specific page processing with a page range', () => {
		const parsed = ExtractionOptionsSchema.parse({
			specificPageProcessing: true,
			specificPageProcessingOptions: { from: 1, to: 3 },
		});
		expect(parsed.specificPageProcessingOptions).toEqual({ from: 1, to: 3 });
	});

	it('rejects specific page processing without a page range', () => {
		expect(() =>
			ExtractionOptionsSchema.parse({ specificPageProcessing: true }),
		).toThrow(/specificPageProcessingOptions/);
	});

	it('accepts nested string/object/array extraction fields', () => {
		const parsed = ExtractionFieldSchema.parse({
			key: 'items',
			description: 'The items in the invoice',
			type: 'array',
			items: {
				type: 'object',
				properties: [
					{
						key: 'name',
						description: 'The name of the item',
						example: 'Item 1',
						type: 'string',
					},
				],
			},
		});
		expect(parsed.items?.properties?.length).toBe(1);
	});

	it('rejects an extraction field without a key', () => {
		expect(() =>
			ExtractionFieldSchema.parse({ description: 'no key' }),
		).toThrow();
	});

	it('accepts a document type with keywords and a linked extraction', () => {
		const parsed = DocumentTypeSchema.parse({
			name: 'Invoice',
			description: 'Standard commercial invoice.',
			uniqueWords: ['invoice number', 'bill to', 'total amount'],
			extractionId: 'extr_invoice',
		});
		expect(parsed.uniqueWords).toHaveLength(3);
	});

	it('rejects a document type without keywords', () => {
		expect(() =>
			DocumentTypeSchema.parse({
				name: 'Invoice',
				description: 'Standard commercial invoice.',
				uniqueWords: [],
			}),
		).toThrow();
	});
});

describe('Endpoint input schemas', () => {
	it('accepts a valid createExtraction input', () => {
		const parsed = ExtractaaiEndpointInputSchemas.extractionCreate.parse({
			extractionDetails: {
				name: 'CVs Extraction',
				description: 'CV parsing template',
				language: 'English',
				options: { hasTable: false },
				fields: [{ key: 'name', description: '', example: '' }],
			},
		});
		expect(parsed.extractionDetails.fields).toHaveLength(1);
	});

	it('rejects createExtraction without fields', () => {
		expect(() =>
			ExtractaaiEndpointInputSchemas.extractionCreate.parse({
				extractionDetails: {
					name: 'CVs Extraction',
					language: 'English',
					fields: [],
				},
			}),
		).toThrow();
	});

	it('rejects updateExtraction with empty extractionDetails', () => {
		expect(() =>
			ExtractaaiEndpointInputSchemas.extractionUpdate.parse({
				extractionId: 'extr_123',
				extractionDetails: {},
			}),
		).toThrow();
	});

	it('rejects deleteExtraction fileId without batchId', () => {
		expect(() =>
			ExtractaaiEndpointInputSchemas.extractionDelete.parse({
				extractionId: 'extr_123',
				fileId: 'file_1',
			}),
		).toThrow(/batchId/);
	});

	it('accepts view/get/delete identifier inputs', () => {
		expect(
			ExtractaaiEndpointInputSchemas.extractionView.parse({
				extractionId: 'extr_123',
			}).extractionId,
		).toBe('extr_123');
		expect(
			ExtractaaiEndpointInputSchemas.extractionGetBatchResults.parse({
				extractionId: 'extr_123',
				batchId: 'batch_1',
			}).batchId,
		).toBe('batch_1');
		expect(
			ExtractaaiEndpointInputSchemas.classificationView.parse({
				classificationId: 'cls_123',
			}).classificationId,
		).toBe('cls_123');
	});

	it('accepts an empty getCredits input', () => {
		expect(() =>
			ExtractaaiEndpointInputSchemas.creditsGet.parse({}),
		).not.toThrow();
	});

	it('accepts a valid createClassification input', () => {
		const parsed = ExtractaaiEndpointInputSchemas.classificationCreate.parse({
			classificationDetails: {
				name: 'Financial Document Classifier',
				description: 'Classifies financial documents.',
				documentTypes: [
					{
						name: 'Invoice',
						description: 'Standard commercial invoice.',
						uniqueWords: ['invoice number', 'total amount'],
					},
				],
			},
		});
		expect(parsed.classificationDetails.documentTypes).toHaveLength(1);
	});

	it('rejects updateClassification with incomplete details', () => {
		expect(() =>
			ExtractaaiEndpointInputSchemas.classificationUpdate.parse({
				classificationId: 'cls_123',
				classificationDetails: {
					name: 'Updated classifier',
					documentTypes: [],
				},
			}),
		).toThrow();
	});
});

describe('Endpoint output schemas', () => {
	it('accepts documented provider responses', () => {
		expect(
			ExtractaaiEndpointOutputSchemas.extractionCreate.parse({
				status: 'created',
				createdAt: 1712547789609,
				extractionId: 'extr_123',
			}).extractionId,
		).toBe('extr_123');
		expect(
			ExtractaaiEndpointOutputSchemas.extractionUpdate.parse({
				status: 'updated',
				updatedAt: 1712547789609,
				extractionId: 'extr_123',
			}).status,
		).toBe('updated');
		expect(
			ExtractaaiEndpointOutputSchemas.extractionDelete.parse({
				status: 'deleted',
				deletedAt: 1712547789609,
			}).status,
		).toBe('deleted');
		expect(
			ExtractaaiEndpointOutputSchemas.creditsGet.parse({
				status: 'ok',
				credits: 50,
			}).credits,
		).toBe(50);
		expect(
			ExtractaaiEndpointOutputSchemas.classificationCreate.parse({
				status: 'created',
				createdAt: 1712547789609,
				classificationId: 'cls_123',
			}).classificationId,
		).toBe('cls_123');
		expect(
			ExtractaaiEndpointOutputSchemas.classificationUpdate.parse({
				status: 'updated',
				updatedAt: 1746720927500,
				classificationId: 'cls_123',
			}).status,
		).toBe('updated');
		expect(
			ExtractaaiEndpointOutputSchemas.classificationDelete.parse({
				status: 'success',
				message: 'Classification deleted',
			}).status,
		).toBe('success');
	});

	it('accepts a waiting batch-results response', () => {
		const parsed =
			ExtractaaiEndpointOutputSchemas.extractionGetBatchResults.parse({
				status: 'waiting',
				extractionId: 'extr_123',
				batchId: 'batch_1',
			});
		expect(parsed).toMatchObject({ status: 'waiting' });
	});

	it('accepts a completed batch-results response', () => {
		const parsed =
			ExtractaaiEndpointOutputSchemas.extractionGetBatchResults.parse({
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
			});
		expect(parsed).toMatchObject({ extractionId: 'extr_123' });
	});

	it('rejects responses with the wrong status literal', () => {
		expect(() =>
			ExtractaaiEndpointOutputSchemas.creditsGet.parse({
				status: 'okay',
				credits: 50,
			}),
		).toThrow();
		expect(() =>
			ExtractaaiEndpointOutputSchemas.extractionCreate.parse({
				status: 'created',
				createdAt: 1712547789609,
			}),
		).toThrow();
	});
});
