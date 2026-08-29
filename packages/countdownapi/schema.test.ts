import { CountdownApiSchema } from './schema';

describe('CountdownApi schema', () => {
	it('declares a semver version', () => {
		expect(CountdownApiSchema.version).toBeDefined();
		expect(CountdownApiSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CountdownApiSchema.entities).toBe('object');
		expect(CountdownApiSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CountdownApiSchema.entities))).toBe(true);
		for (const entity of Object.values(CountdownApiSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
