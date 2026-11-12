import { MailssoSchema } from './schema';

describe('Mailsso schema', () => {
	it('declares a semver version', () => {
		expect(MailssoSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	// Validation is a stateless lookup and a batch job is read back by id, so
	// there is nothing to sync into the database.
	it('stores no entities', () => {
		expect(MailssoSchema.entities).toEqual({});
		expect(Array.isArray(MailssoSchema.entities)).toBe(false);
		expect(MailssoSchema.entities).not.toBeNull();
	});
});
