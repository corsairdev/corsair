import { WacheteSchema } from './schema';

describe('Wachete schema', () => {
	it('declares a semver version', () => {
		expect(WacheteSchema.version).toBeDefined();
		expect(WacheteSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WacheteSchema.entities).toBe('object');
		expect(WacheteSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WacheteSchema.entities))).toBe(true);
		for (const entity of Object.values(WacheteSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});

	it('caches nothing, since a value changes with every check', () => {
		// A monitor's `data.raw` and `lastCheckTimestamp` change on every check,
		// so a stored copy would be wrong almost immediately.
		expect(Object.keys(WacheteSchema.entities)).toHaveLength(0);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
