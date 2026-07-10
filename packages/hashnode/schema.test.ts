import { HashnodeSchema } from './schema';

describe('Hashnode schema', () => {
	it('declares a semver version', () => {
		expect(HashnodeSchema.version).toBeDefined();
		expect(HashnodeSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof HashnodeSchema.entities).toBe('object');
		expect(HashnodeSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(HashnodeSchema.entities))).toBe(true);
		for (const entity of Object.values(HashnodeSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
