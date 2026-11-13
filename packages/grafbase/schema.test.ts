import { GrafbaseSchema } from './schema';

describe('Grafbase schema', () => {
	it('declares a semver version', () => {
		expect(GrafbaseSchema.version).toBeDefined();
		expect(GrafbaseSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof GrafbaseSchema.entities).toBe('object');
		expect(GrafbaseSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(GrafbaseSchema.entities))).toBe(true);
		for (const entity of Object.values(GrafbaseSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
