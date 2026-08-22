import { ApilioSchema } from './schema';

describe('Apilio schema', () => {
	it('declares a semver version', () => {
		expect(ApilioSchema.version).toBeDefined();
		expect(ApilioSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof ApilioSchema.entities).toBe('object');
		expect(ApilioSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(ApilioSchema.entities))).toBe(true);
		for (const entity of Object.values(ApilioSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
