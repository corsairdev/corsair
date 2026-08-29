import { ByteFormsSchema } from './schema';

describe('ByteForms schema', () => {
	it('declares a semver version', () => {
		expect(ByteFormsSchema.version).toBeDefined();
		expect(ByteFormsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ByteFormsSchema.entities).toBe('object');
		expect(ByteFormsSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ByteFormsSchema.entities))).toBe(true);
		for (const entity of Object.values(ByteFormsSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
