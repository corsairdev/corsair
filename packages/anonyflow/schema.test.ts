import { AnonyflowSchema } from './schema';

describe('Anonyflow schema', () => {
	it('declares a semver version', () => {
		expect(AnonyflowSchema.version).toBeDefined();
		expect(AnonyflowSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof AnonyflowSchema.entities).toBe('object');
		expect(AnonyflowSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(AnonyflowSchema.entities))).toBe(true);
		for (const entity of Object.values(AnonyflowSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
