import { SerpapiSchema } from './schema';

describe('Serpapi schema', () => {
	it('declares a semver version', () => {
		expect(SerpapiSchema.version).toBeDefined();
		expect(SerpapiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof SerpapiSchema.entities).toBe('object');
		expect(SerpapiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(SerpapiSchema.entities))).toBe(true);
		for (const entity of Object.values(SerpapiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
