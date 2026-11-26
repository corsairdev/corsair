import { MailerLiteSchema } from './schema';

describe('MailerLite schema', () => {
	it('declares a semver version', () => {
		expect(MailerLiteSchema.version).toBeDefined();
		expect(MailerLiteSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map, empty because nothing is synced locally', () => {
		expect(typeof MailerLiteSchema.entities).toBe('object');
		expect(MailerLiteSchema.entities).not.toBeNull();
		expect(Array.isArray(MailerLiteSchema.entities)).toBe(false);
		expect(Object.keys(MailerLiteSchema.entities)).toEqual([]);
	});
});
