import { EmailOctopusSchema } from './schema';

describe('EmailOctopus schema', () => {
	it('declares a semver version', () => {
		expect(EmailOctopusSchema.version).toBeDefined();
		expect(EmailOctopusSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof EmailOctopusSchema.entities).toBe('object');
		expect(EmailOctopusSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(EmailOctopusSchema.entities))).toBe(true);
		for (const entity of Object.values(EmailOctopusSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
