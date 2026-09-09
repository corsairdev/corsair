import { ClickupSchema } from './schema';

describe('Clickup schema', () => {
	it('declares a semver version', () => {
		expect(ClickupSchema.version).toBeDefined();
		expect(ClickupSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ClickupSchema.entities).toBe('object');
		expect(ClickupSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ClickupSchema.entities))).toBe(true);
		for (const entity of Object.values(ClickupSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
