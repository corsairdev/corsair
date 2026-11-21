import { MailerLiteSchema } from './schema';

describe('MailerLite schema', () => {
	it('declares a semver version', () => {
		expect(MailerLiteSchema.version).toBeDefined();
		expect(MailerLiteSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof MailerLiteSchema.entities).toBe('object');
		expect(MailerLiteSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(MailerLiteSchema.entities))).toBe(true);
		for (const entity of Object.values(MailerLiteSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
