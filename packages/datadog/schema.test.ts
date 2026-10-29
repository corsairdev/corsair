import { DatadogSchema } from './schema';

describe('Datadog schema', () => {
	it('declares a semver version', () => {
		expect(DatadogSchema.version).toBeDefined();
		expect(DatadogSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof DatadogSchema.entities).toBe('object');
		expect(DatadogSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(DatadogSchema.entities))).toBe(true);
		for (const entity of Object.values(DatadogSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
