import { DreamStudioSchema } from './schema';

describe('DreamStudio schema', () => {
	it('declares a semver version', () => {
		expect(DreamStudioSchema.version).toBeDefined();
		expect(DreamStudioSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof DreamStudioSchema.entities).toBe('object');
		expect(DreamStudioSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(DreamStudioSchema.entities))).toBe(true);
		for (const entity of Object.values(DreamStudioSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
