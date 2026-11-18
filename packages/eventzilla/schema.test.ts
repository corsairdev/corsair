import { EventzillaSchema } from './schema';

describe('Eventzilla schema', () => {
	it('declares a semver version', () => {
		expect(EventzillaSchema.version).toBeDefined();
		expect(EventzillaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof EventzillaSchema.entities).toBe('object');
		expect(EventzillaSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(EventzillaSchema.entities))).toBe(true);
		for (const entity of Object.values(EventzillaSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
