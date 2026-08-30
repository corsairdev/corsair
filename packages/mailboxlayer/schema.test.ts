import { MailboxLayerSchema } from './schema';

describe('MailboxLayer schema', () => {
	it('declares a semver version', () => {
		expect(MailboxLayerSchema.version).toBeDefined();
		expect(MailboxLayerSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map with the email check entity', () => {
		expect(typeof MailboxLayerSchema.entities).toBe('object');
		expect(MailboxLayerSchema.entities).not.toBeNull();
		expect(Object.keys(MailboxLayerSchema.entities)).toContain('emailChecks');
		for (const entity of Object.values(MailboxLayerSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});
