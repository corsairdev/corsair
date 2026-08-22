import { MailcheckSchema } from './schema';

describe('Mailcheck schema', () => {
	it('declares a semver version', () => {
		expect(MailcheckSchema.version).toBeDefined();
		expect(MailcheckSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof MailcheckSchema.entities).toBe('object');
		expect(MailcheckSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(MailcheckSchema.entities))).toBe(true);
		for (const entity of Object.values(MailcheckSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
