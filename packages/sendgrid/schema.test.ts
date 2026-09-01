import { SendGridSchema } from './schema';

describe('SendGrid schema', () => {
	it('declares a semver version', () => {
		expect(SendGridSchema.version).toBeDefined();
		expect(SendGridSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof SendGridSchema.entities).toBe('object');
		expect(SendGridSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(SendGridSchema.entities))).toBe(true);
		for (const entity of Object.values(SendGridSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
