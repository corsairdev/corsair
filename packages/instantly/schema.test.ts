import { InstantlySchema } from './schema';
import { account, email, lead } from './test-fixtures';

describe('Instantly schema', () => {
	it('declares a semver version', () => {
		expect(InstantlySchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('stores accounts, campaigns, leads and emails', () => {
		expect(Object.keys(InstantlySchema.entities).sort()).toEqual([
			'accounts',
			'campaigns',
			'emails',
			'leads',
		]);
	});

	it('keeps an email preview but not its full body', () => {
		const row = InstantlySchema.entities.emails.parse(email);
		expect(row.content_preview).toBe(email.content_preview);
		expect(row).not.toHaveProperty('body');
	});

	it('accepts API rows as returned, dropping fields it does not keep', () => {
		const leadRow = InstantlySchema.entities.leads.parse(lead);
		expect(leadRow).toMatchObject({ id: lead.id, email: lead.email });
		expect(leadRow).not.toHaveProperty('payload');

		const accountRow = InstantlySchema.entities.accounts.parse({
			...account,
			id: account.email,
		});
		expect(accountRow.id).toBe(account.email);
	});
});
