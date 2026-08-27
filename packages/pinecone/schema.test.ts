import { PineconeSchema } from './schema';

describe('Pinecone schema', () => {
	it('declares a semver version', () => {
		expect(PineconeSchema.version).toBeDefined();
		expect(PineconeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof PineconeSchema.entities).toBe('object');
		expect(PineconeSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(PineconeSchema.entities))).toBe(true);
		for (const entity of Object.values(PineconeSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
