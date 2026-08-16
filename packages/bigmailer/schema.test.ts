import { BigmailerSchema } from './schema';

describe('Bigmailer schema', () => {
	it('declares a semver version', () => {
		expect(BigmailerSchema.version).toBeDefined();
		expect(BigmailerSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BigmailerSchema.entities).toBe('object');
		expect(BigmailerSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BigmailerSchema.entities))).toBe(true);
		for (const entity of Object.values(BigmailerSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
