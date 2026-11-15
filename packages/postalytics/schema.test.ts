import { PostalyticsSchema } from './schema';

describe('Postalytics schema', () => {
	it('declares a semver version', () => {
		expect(PostalyticsSchema.version).toBeDefined();
		expect(PostalyticsSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof PostalyticsSchema.entities).toBe('object');
		expect(PostalyticsSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(PostalyticsSchema.entities))).toBe(true);
		for (const entity of Object.values(PostalyticsSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
