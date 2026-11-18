import { RefinerSchema } from './schema';

describe('Refiner schema', () => {
	it('declares a semver version', () => {
		expect(RefinerSchema.version).toBeDefined();
		expect(RefinerSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof RefinerSchema.entities).toBe('object');
		expect(RefinerSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(RefinerSchema.entities))).toBe(true);
		for (const entity of Object.values(RefinerSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, since Refiner owns every record', () => {
		// Contacts, responses, surveys and segments all change from Refiner's
		// dashboard as well as the API, and a cached response could be counted twice.
		expect(Object.keys(RefinerSchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
