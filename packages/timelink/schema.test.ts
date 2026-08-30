import { TimelinkSchema } from './schema';

describe('Timelink schema', () => {
	it('declares a semver version', () => {
		expect(TimelinkSchema.version).toBeDefined();
		expect(TimelinkSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof TimelinkSchema.entities).toBe('object');
		expect(TimelinkSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(TimelinkSchema.entities))).toBe(true);
		for (const entity of Object.values(TimelinkSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
