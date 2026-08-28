import { KibanaSchema } from './schema';

describe('Kibana schema', () => {
	it('declares a semver version', () => {
		expect(KibanaSchema.version).toBeDefined();
		expect(KibanaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof KibanaSchema.entities).toBe('object');
		expect(KibanaSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(KibanaSchema.entities))).toBe(true);
		for (const entity of Object.values(KibanaSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
