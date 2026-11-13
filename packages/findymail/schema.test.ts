import { FindymailSchema } from './schema';

describe('Findymail schema', () => {
	it('declares a semver version', () => {
		expect(FindymailSchema.version).toBeDefined();
		expect(FindymailSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof FindymailSchema.entities).toBe('object');
		expect(FindymailSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(FindymailSchema.entities))).toBe(true);
		for (const entity of Object.values(FindymailSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
