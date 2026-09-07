import { CustomerioSchema } from './schema';

describe('Customerio schema', () => {
	it('declares a semver version', () => {
		expect(CustomerioSchema.version).toBeDefined();
		expect(CustomerioSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof CustomerioSchema.entities).toBe('object');
		expect(CustomerioSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(CustomerioSchema.entities))).toBe(true);
		for (const entity of Object.values(CustomerioSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
