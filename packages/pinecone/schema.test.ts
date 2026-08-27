import { PineconeSchema } from './schema';

describe('Pinecone schema', () => {
	it('declares a semver version', () => {
		expect(PineconeSchema.version).toBeDefined();
		expect(PineconeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares no local entities for the remote service integration', () => {
		expect(PineconeSchema.entities).toEqual({});
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
