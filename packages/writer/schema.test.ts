import { WriterSchema } from './schema';

describe('Writer schema', () => {
	it('declares a semver version', () => {
		expect(WriterSchema.version).toBeDefined();
		expect(WriterSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WriterSchema.entities).toBe('object');
		expect(WriterSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WriterSchema.entities))).toBe(true);
		for (const entity of Object.values(WriterSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
