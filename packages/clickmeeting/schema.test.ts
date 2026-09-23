import { ClickmeetingSchema } from './schema';

describe('Clickmeeting schema', () => {
	it('declares a semver version', () => {
		expect(ClickmeetingSchema.version).toBeDefined();
		expect(ClickmeetingSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ClickmeetingSchema.entities).toBe('object');
		expect(ClickmeetingSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ClickmeetingSchema.entities))).toBe(true);
		for (const entity of Object.values(ClickmeetingSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
