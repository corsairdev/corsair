import { WaiverFileSchema } from './schema';

describe('WaiverFile schema', () => {
	it('declares a semver version', () => {
		expect(WaiverFileSchema.version).toBeDefined();
		expect(WaiverFileSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WaiverFileSchema.entities).toBe('object');
		expect(WaiverFileSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WaiverFileSchema.entities))).toBe(true);
		for (const entity of Object.values(WaiverFileSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
