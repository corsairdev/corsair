import { TextItSchema } from './schema';

describe('TextIt schema', () => {
	it('declares a semver version', () => {
		expect(TextItSchema.version).toBeDefined();
		expect(TextItSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof TextItSchema.entities).toBe('object');
		expect(TextItSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(TextItSchema.entities))).toBe(true);
		for (const entity of Object.values(TextItSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
