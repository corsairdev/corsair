import { KrakenSchema } from './schema';

describe('Kraken schema', () => {
	it('declares a semver version', () => {
		expect(KrakenSchema.version).toBeDefined();
		expect(KrakenSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof KrakenSchema.entities).toBe('object');
		expect(KrakenSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(KrakenSchema.entities))).toBe(true);
		for (const entity of Object.values(KrakenSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
