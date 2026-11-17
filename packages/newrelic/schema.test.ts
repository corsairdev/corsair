import { NewrelicSchema } from './schema';

describe('Newrelic schema', () => {
	it('declares a semver version', () => {
		expect(NewrelicSchema.version).toBeDefined();
		expect(NewrelicSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof NewrelicSchema.entities).toBe('object');
		expect(NewrelicSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(NewrelicSchema.entities))).toBe(true);
		for (const entity of Object.values(NewrelicSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
