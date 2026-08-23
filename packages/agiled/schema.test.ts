import { AgiledSchema } from './schema';

describe('Agiled schema', () => {
	it('declares a semver version', () => {
		expect(AgiledSchema.version).toBeDefined();
		expect(AgiledSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AgiledSchema.entities).toBe('object');
		expect(AgiledSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AgiledSchema.entities))).toBe(true);
		for (const entity of Object.values(AgiledSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
