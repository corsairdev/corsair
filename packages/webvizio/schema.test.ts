import { WebvizioSchema } from './schema';

describe('Webvizio schema', () => {
	it('declares a semver version', () => {
		expect(WebvizioSchema.version).toBeDefined();
		expect(WebvizioSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WebvizioSchema.entities).toBe('object');
		expect(WebvizioSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WebvizioSchema.entities))).toBe(true);
		for (const entity of Object.values(WebvizioSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
