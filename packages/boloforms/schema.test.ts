import { BoloformsEndpointOutputSchemas } from './endpoints/types';
import { BoloformsDocument, BoloformsSchema } from './schema';

describe('Boloforms schema', () => {
	it('declares a semver version', () => {
		expect(BoloformsSchema.version).toBeDefined();
		expect(BoloformsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares documents entity', () => {
		expect(BoloformsSchema.entities.documents).toBe(BoloformsDocument);
	});

	it('accepts live list envelope without pagination', () => {
		const live = {
			documents: [],
			message: 'Fetched documents',
			formCount: 0,
			documentsCount: 0,
		};
		expect(BoloformsEndpointOutputSchemas.getDocumentsList.parse(live)).toEqual(
			live,
		);
	});

	it('accepts OpenAPI document fields', () => {
		const doc = {
			documentId: 'id-1',
			name: 'Contract',
			createdAt: '2024-01-01T00:00:00.000Z',
			status: 'DRAFT',
		};
		expect(BoloformsDocument.parse(doc)).toMatchObject(doc);
	});
});
