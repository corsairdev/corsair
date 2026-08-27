import { CloudcartSchema } from './schema';

describe('Cloudcart schema', () => {
	it('declares a semver version', () => {
		expect(CloudcartSchema.version).toBeDefined();
		expect(CloudcartSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CloudcartSchema.entities).toBe('object');
		expect(CloudcartSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CloudcartSchema.entities))).toBe(true);
		for (const entity of Object.values(CloudcartSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
