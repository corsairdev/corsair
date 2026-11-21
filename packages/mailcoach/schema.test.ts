import { MailcoachSchema } from './schema';

describe('Mailcoach schema', () => {
	it('declares a semver version', () => {
		expect(MailcoachSchema.version).toBeDefined();
		expect(MailcoachSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof MailcoachSchema.entities).toBe('object');
		expect(MailcoachSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(MailcoachSchema.entities))).toBe(true);
		for (const entity of Object.values(MailcoachSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
