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
				searchMobilePushMessages: {},
				addMobilePushMessage: { name: 'Push', title: 'Title', text: 'Text' },
				getMobilePushMessage: { id: 1 },
				updateBaseMobilePushMessage: {
					id: 1,
					name: 'Push',
					title: 'Title',
					text: 'Text',
				},
				deleteMobilePushMessage: { id: 1 },
				updateTranslatedMobilePushMessage: {
					id: 1,
					language: 'en',
					name: 'Push',
					title: 'Title',
					text: 'Text',
				},
				deleteTranslatedMobilePushMessage: { id: 1, language: 'en' },
				searchViberMessages: {},
				addViberMessage: {},
				getViberMessage: { id: 1 },
				updateBaseViberMessage: { id: 1 },
				deleteViberMessage: { id: 1 },
				searchAppInboxMessages: {},
				addAppInboxMessage: {},
				getAppInboxMessage: { id: 1 },
				updateBaseAppInboxMessage: { id: 1 },
				deleteAppInboxMessage: { id: 1 },
				searchTelegramBotMessages: {},
				addTelegramBotMessage: {},
				getTelegramBotMessage: { id: 1 },
				updateBaseTelegramBotMessage: { id: 1 },
				deleteTelegramBotMessage: { id: 1 },
				searchSmsMessages: {},
				getSms: { id: 1 },
				updateBaseSmsMessage: { id: 1 },
				deleteSmsMessage: { id: 1 },
				getBroadcasts: {},
				createBroadcast: {},
				getBroadcast: { id: 1 },
				getSmsInterfaces: {},
				getEmailInterfaces: {},
				updateTranslatedViberMessage: { id: 1, language: 'en' },
				deleteTranslatedViberMessage: { id: 1, language: 'en' },
				updateTranslatedAppInboxMessage: { id: 1, language: 'en' },
				deleteTranslatedAppInboxMessage: { id: 1, language: 'en' },
				updateTranslatedTelegramMessage: { id: 1, language: 'en' },
				deleteTranslatedTelegramMessage: { id: 1, language: 'en' },
				addSmsMessage: {},
				sendSms: {},
				cancelBroadcast: { id: 1 },
				contactActivity: {},
				contactMessages: {},
				getTokenActivated: { app_uuid: 'app', token_id: 'token' },
				changeTokenActivated: {
					app_uuid: 'app',
					token_id: 'token',
					active: true,
				},
				getDomains: {},
				createDomain: { domain: 'example.com' },
				getScript: {},
				getWebPushDomains: {},
				addWebPushDomain: {
					domain: 'example.com',
					serviceWorkerName: 'sw.js',
					serviceWorkerPath: '/',
					serviceWorkerScope: '/',
				},
				deleteWebPushDomain: { domain: 'example.com' },
				getWebPushScript: { domain: 'example.com' },
				getProductFeedsConfiguration: {},
				configureProductFeeds: {},
				addAppTokens: {},
				muteAppToken: {},
				unmuteAppToken: {},
				getSubscriptionCategories: {},
				getPromocodes: {},
				getPromocodesCount: {},
				insertPromocodes: {},
				getPreprocessorFileStatus: { sessionId: 'session-1' },
				updatePreprocessorFile: {},
				uploadPreprocessorFile: {},
				generateApiToken: {},
				getInteractionStatus: {},
				sendViber: {},
				sendAppInbox: {},
				sendTelegramBot: {},
				updateTranslatedSmsMessage: { id: 1, language: 'en' },
				deleteTranslatedSmsMessage: { id: 1, language: 'en' },
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

	it('keeps undocumented provider responses JSON-safe', () => {
		expect(
			EsputnikEndpointOutputSchemas.registerEvent.safeParse({ accepted: true })
				.success,
		).toBe(true);
		expect(
			EsputnikEndpointOutputSchemas.registerEvent.safeParse(() => {}).success,
		).toBe(false);
		expect(
			EsputnikEndpointOutputSchemas.searchViberMessages.safeParse([{ id: 1 }])
				.success,
		).toBe(true);
	});

	it('rejects malformed path and required-body inputs', () => {
		expect(
			EsputnikEndpointInputSchemas.getContactIdByToken.safeParse({
				app_uuid: '',
				token_id: 'token',
			}).success,
		).toBe(false);
		expect(
			EsputnikEndpointInputSchemas.changeTokenActivated.safeParse({
				app_uuid: 'app',
				token_id: 'token',
			}).success,
		).toBe(false);
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.
