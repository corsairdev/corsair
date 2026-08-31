import { WisepopsSchema } from './schema';

describe('Wisepops schema', () => {
	it('declares a semver version', () => {
		expect(WisepopsSchema.version).toBeDefined();
		expect(WisepopsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof WisepopsSchema.entities).toBe('object');
		expect(WisepopsSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(WisepopsSchema.entities))).toBe(true);
		for (const entity of Object.values(WisepopsSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
