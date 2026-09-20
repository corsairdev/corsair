import { PineconeSchema } from './schema';

describe('Pinecone schema', () => {
	it('declares a semver version', () => {
		expect(PineconeSchema.version).toBeDefined();
		expect(PineconeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares official 2026-04 control and data entities', () => {
		expect(Object.keys(PineconeSchema.entities).sort()).toEqual([
			'assistantFiles',
			'assistants',
			'backups',
			'collections',
			'indexes',
			'models',
			'namespaces',
			'restoreJobs',
			'vectors',
		]);
	});
});
