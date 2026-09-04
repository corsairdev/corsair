import {
	BenchmarkEmailEndpointInputSchemas,
	BenchmarkEmailEndpointOutputSchemas,
} from './endpoints/types';
import { BenchmarkEmailSchema } from './schema';
import {
	BenchmarkEmailCampaign,
	BenchmarkEmailContact,
	BenchmarkEmailContactList,
} from './schema/database';

describe('BenchmarkEmail schema', () => {
	it('declares a semver version', () => {
		expect(BenchmarkEmailSchema.version).toBeDefined();
		expect(BenchmarkEmailSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof BenchmarkEmailSchema.entities).toBe('object');
		expect(BenchmarkEmailSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(BenchmarkEmailSchema.entities))).toBe(
			true,
		);
		for (const entity of Object.values(BenchmarkEmailSchema.entities)) {
			expect(entity).toBeDefined();
		}

		expect(Object.keys(BenchmarkEmailSchema.entities).sort()).toEqual([
			'campaigns',
			'contactLists',
			'contacts',
		]);
	});
});

describe('BenchmarkEmail database entities', () => {
	it('parses a valid contact', () => {
		const contact = BenchmarkEmailContact.parse({
			id: 'contact_1',
			listID: 'list_1',
			email: 'jane@example.com',
			firstName: 'Jane',
		});
		expect(contact.id).toBe('contact_1');
		expect(contact.email).toBe('jane@example.com');
	});

	it('rejects a contact with an invalid email', () => {
		expect(() =>
			BenchmarkEmailContact.parse({ id: 'contact_1', email: 'not-an-email' }),
		).toThrow();
	});

	it('rejects a contact without an id', () => {
		expect(() =>
			BenchmarkEmailContact.parse({ email: 'jane@example.com' }),
		).toThrow();
	});

	it('parses a valid contact list and campaign', () => {
		expect(
			BenchmarkEmailContactList.parse({
				id: 'list_1',
				name: 'News',
				totalContacts: 10,
			}).name,
		).toBe('News');
		expect(
			BenchmarkEmailCampaign.parse({
				id: 'email_1',
				subject: 'Hi',
				status: 'sent',
			}).status,
		).toBe('sent');
	});
});

describe('BenchmarkEmail endpoint schemas', () => {
	it('parses representative inputs', () => {
		expect(
			BenchmarkEmailEndpointInputSchemas.contactsAddContactToList.parse({
				listID: 'list_1',
				data: { email: 'jane@example.com' },
			}).listID,
		).toBe('list_1');
		expect(
			BenchmarkEmailEndpointInputSchemas.emailsGetEmails.parse({
				page: 1,
				pageSize: 25,
			}).pageSize,
		).toBe(25);
	});

	it('rejects inputs with missing path params or bad pagination', () => {
		expect(() =>
			BenchmarkEmailEndpointInputSchemas.contactsAddContactToList.parse({
				data: {},
			}),
		).toThrow();
		expect(() =>
			BenchmarkEmailEndpointInputSchemas.emailsGetEmails.parse({ page: 0 }),
		).toThrow();
		expect(() =>
			BenchmarkEmailEndpointInputSchemas.emailsGetEmails.parse({
				pageSize: 101,
			}),
		).toThrow();
	});

	it('accepts loose provider outputs', () => {
		const output =
			BenchmarkEmailEndpointOutputSchemas.reportsGetOpensReport.parse({
				total: 5,
				opens: 3,
				providerExtraField: 'kept',
			});
		expect(output.total).toBe(5);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
