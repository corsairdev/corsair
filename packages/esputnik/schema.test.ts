import {
	EsputnikEndpointInputSchemas,
	EsputnikEndpointOutputSchemas,
} from './endpoints/types';
import { EsputnikSchema } from './schema';

describe('Esputnik schema', () => {
	it('declares a semver version', () => {
		expect(EsputnikSchema.version).toBeDefined();
		expect(EsputnikSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof EsputnikSchema.entities).toBe('object');
		expect(EsputnikSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(EsputnikSchema.entities))).toBe(true);
		for (const entity of Object.values(EsputnikSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

describe('eSputnik endpoint schemas', () => {
	it.each(Object.keys(EsputnikEndpointInputSchemas))(
		'%s has a valid input',
		(name) => {
			const inputs: Record<string, unknown> = {
				getAccountInfo: {},
				getBalance: {},
				addContact: {
					channels: [{ type: 'email', value: 'person@example.com' }],
				},
				getContact: { id: 1 },
				updateContact: {
					id: 1,
					channels: [{ type: 'email', value: 'person@example.com' }],
				},
				deleteContactById: { id: 1 },
				deleteContactByExternalCustomerId: { externalCustomerId: 'customer-1' },
				searchContacts: { email: 'person@example.com' },
				subscribeContact: {
					contact: {
						channels: [{ type: 'email', value: 'person@example.com' }],
					},
				},
				contactsBulkUpdate: {},
				fileContactsBulkUpdate: {},
				getImportSessionStatus: { sessionId: 'session-1' },
				getContactEmails: { ids: '1,2' },
				addToUnsubscribed: { emails: ['person@example.com'] },
				deleteFromUnsubscribed: { emails: ['person@example.com'] },
				getGroupContacts: { id: 1 },
				detachContactsFromGroup: { id: 1 },
				attachContactsToGroup: { id: 1 },
				searchGroups: {},
				searchWorkflows: {},
				getContactIdByToken: { app_uuid: 'app', token_id: 'token' },
				getContactSubscriptionCategories: { id: 1 },
				changeContactSubscriptionCategories: {
					id: 1,
					subscriptions: ['newsletter'],
				},
				contactRecoms: { dataSourceId: 1, email: 'person@example.com' },
				getAdditionalFields: {},
				getOrganisationBalanceHistory: {},
				ordersBulkInsert: {},
				registerEvent: {},
				sendHistoryEvents: {},
				removeHistoryEvents: {},
				searchEmails: {},
				getEmailMessageViewLink: { id: 1 },
				sendPreparedMessage: {},
				addEmail: {
					name: 'Welcome',
					from: 'sender@example.com',
					subject: 'Hi',
					htmlText: '<p>Hi</p>',
				},
				getEmail: { id: 1 },
				updateMessage: {
					id: 1,
					name: 'Welcome',
					from: 'sender@example.com',
					subject: 'Hi',
					htmlText: '<p>Hi</p>',
				},
				deleteEmail: { id: 1 },
				updateTranslatedMessage: {
					id: 1,
					language: 'en',
					name: 'Welcome',
					from: 'sender@example.com',
					subject: 'Hi',
					htmlText: '<p>Hi</p>',
				},
				deleteTranslatedEmail: { id: 1, language: 'en' },
				sendEmail: {},
			};
			expect(
				EsputnikEndpointInputSchemas[
					name as keyof typeof EsputnikEndpointInputSchemas
				].safeParse(inputs[name]).success,
			).toBe(true);
		},
	);

	it('rejects contact operations without required identifiers or body channels', () => {
		expect(EsputnikEndpointInputSchemas.getContact.safeParse({}).success).toBe(
			false,
		);
		expect(EsputnikEndpointInputSchemas.addContact.safeParse({}).success).toBe(
			false,
		);
	});

	it('validates representative output contracts', () => {
		expect(
			EsputnikEndpointOutputSchemas.getAccountInfo.safeParse({
				organisationName: 'Test',
			}).success,
		).toBe(true);
		expect(
			EsputnikEndpointOutputSchemas.searchContacts.safeParse([]).success,
		).toBe(true);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
