import { AltovizSchema } from './schema';

describe('Altoviz schema', () => {
	it('declares a semver version', () => {
		expect(AltovizSchema.version).toBeDefined();
		expect(AltovizSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AltovizSchema.entities).toBe('object');
		expect(AltovizSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AltovizSchema.entities))).toBe(true);
		for (const entity of Object.values(AltovizSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
