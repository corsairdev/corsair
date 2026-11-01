import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { makeEsputnikRequest } from './client';
import { EsputnikEndpointOutputSchemas } from './endpoints/types';
import type { EsputnikContext } from './index';
import { esputnik } from './index';

jest.mock('./client', () => ({ makeEsputnikRequest: jest.fn() }));

const request = jest.mocked(makeEsputnikRequest);
const wrappedEndpoints = esputnik().endpoints as unknown as Record<
	string,
	unknown
>;
// Endpoint handlers only read the API key from context; the schema wrapper
// does not require the remaining runtime fields.
const context = { key: 'test-api-key' } as unknown as EsputnikContext;

// Provider request bodies are schema-validated before transport, so the
// contract test treats extension fields as opaque values.
type ExpectedContract = {
	path: string;
	options: {
		method?: string;
		query?: Record<string, string | number | boolean | undefined>;
		body?: Record<string, unknown>;
	};
};

// Each fixture exercises path parameters, query serialization, and body
// forwarding for one public operation. Defaults are valid only where the
// operation takes no input.
// Fixtures mirror provider payloads; each schema narrows this shared map.
const fixtures: Record<string, Record<string, unknown>> = {
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
	searchContacts: { startindex: 1 },
	subscribeContact: {
		contact: {
			channels: [{ type: 'email', value: 'person@example.com' }],
		},
	},
	contactsBulkUpdate: { contacts: [] },
	fileContactsBulkUpdate: { contacts: [] },
	getImportSessionStatus: { sessionId: 'session-1' },
	getContactEmails: { ids: '1,2' },
	addToUnsubscribed: { emails: ['person@example.com'] },
	deleteFromUnsubscribed: { emails: ['person@example.com'] },
	getGroupContacts: { id: 1 },
	detachContactsFromGroup: { id: 1, emails: ['person@example.com'] },
	attachContactsToGroup: { id: 1, emails: ['person@example.com'] },
	getContactIdByToken: { app_uuid: 'app-uuid', token_id: 'token-id' },
	getContactSubscriptionCategories: { id: 1 },
	changeContactSubscriptionCategories: {
		id: 1,
		subscriptions: ['newsletter'],
	},
	contactRecoms: { dataSourceId: 1, contactId: 1 },
	getOrganisationBalanceHistory: { dateFrom: '2026-01-01' },
	ordersBulkInsert: { orders: [] },
	registerEvent: { name: 'event-name' },
	sendHistoryEvents: { events: [] },
	removeHistoryEvents: { events: [] },
	searchEmails: { name: 'welcome' },
	getEmailMessageViewLink: { id: 1 },
	sendPreparedMessage: { id: 1 },
	addEmail: {
		name: 'email-name',
		from: 'sender@example.com',
		subject: 'Subject',
		htmlText: '<p>Body</p>',
	},
	getEmail: { id: 1 },
	updateMessage: {
		id: 1,
		name: 'updated-email',
		from: 'sender@example.com',
		subject: 'Subject',
		htmlText: '<p>Body</p>',
	},
	deleteEmail: { id: 1 },
	updateTranslatedMessage: {
		id: 1,
		language: 'en',
		name: 'updated-email',
		from: 'sender@example.com',
		subject: 'Subject',
		htmlText: '<p>Body</p>',
	},
	deleteTranslatedEmail: { id: 1, language: 'en' },
	sendEmail: { name: 'email-name' },
	searchMobilePushMessages: { search: 'welcome' },
	addMobilePushMessage: {
		name: 'push-name',
		title: 'Title',
		text: 'Body',
	},
	getMobilePushMessage: { id: 1 },
	updateBaseMobilePushMessage: {
		id: 1,
		name: 'updated-push',
		title: 'Title',
		text: 'Body',
	},
	deleteMobilePushMessage: { id: 1 },
	updateTranslatedMobilePushMessage: {
		id: 1,
		language: 'en',
		name: 'updated-push',
		title: 'Title',
		text: 'Body',
	},
	deleteTranslatedMobilePushMessage: { id: 1, language: 'en' },
	searchViberMessages: { search: 'welcome' },
	addViberMessage: { name: 'viber-name' },
	getViberMessage: { id: 1 },
	updateBaseViberMessage: { id: 1, name: 'updated-viber' },
	deleteViberMessage: { id: 1 },
	searchAppInboxMessages: { search: 'welcome' },
	addAppInboxMessage: { name: 'appinbox-name' },
	getAppInboxMessage: { id: 1 },
	updateBaseAppInboxMessage: { id: 1, name: 'updated-appinbox' },
	deleteAppInboxMessage: { id: 1 },
	searchTelegramBotMessages: { search: 'welcome' },
	addTelegramBotMessage: { name: 'telegram-name' },
	getTelegramBotMessage: { id: 1 },
	updateBaseTelegramBotMessage: { id: 1, name: 'updated-telegram' },
	deleteTelegramBotMessage: { id: 1 },
	searchSmsMessages: { search: 'welcome' },
	getSms: { id: 1 },
	updateBaseSmsMessage: { id: 1, name: 'updated-sms' },
	deleteSmsMessage: { id: 1 },
	getBroadcasts: { startindex: 1 },
	createBroadcast: { name: 'broadcast-name' },
	getBroadcast: { id: 1 },
	updateTranslatedViberMessage: {
		id: 1,
		language: 'en',
		name: 'updated-viber',
	},
	deleteTranslatedViberMessage: { id: 1, language: 'en' },
	updateTranslatedAppInboxMessage: {
		id: 1,
		language: 'en',
		name: 'updated-appinbox',
	},
	deleteTranslatedAppInboxMessage: { id: 1, language: 'en' },
	updateTranslatedTelegramMessage: {
		id: 1,
		language: 'en',
		name: 'updated-telegram',
	},
	deleteTranslatedTelegramMessage: { id: 1, language: 'en' },
	addSmsMessage: { name: 'sms-name' },
	sendSms: { name: 'sms-name' },
	cancelBroadcast: { id: 1 },
	contactActivity: { startindex: 1 },
	contactMessages: { startindex: 1 },
	getTokenActivated: { app_uuid: 'app-uuid', token_id: 'token-id' },
	changeTokenActivated: {
		app_uuid: 'app-uuid',
		token_id: 'token-id',
		active: true,
	},
	createDomain: { domain: 'example.com' },
	addWebPushDomain: {
		domain: 'example.com',
		serviceWorkerName: 'sw.js',
		serviceWorkerPath: '/',
		serviceWorkerScope: '/',
	},
	deleteWebPushDomain: { domain: 'example.com' },
	getWebPushScript: { domain: 'example.com' },
	configureProductFeeds: { feedUrl: 'https://example.com/feed.xml' },
	addAppTokens: { tokens: ['token'] },
	muteAppToken: { tokens: ['token'] },
	unmuteAppToken: { tokens: ['token'] },
	getPromocodes: { limit: 1 },
	insertPromocodes: { promocodes: [] },
	getPreprocessorFileStatus: { sessionId: 'session-1' },
	updatePreprocessorFile: { columns: [] },
	uploadPreprocessorFile: { columns: [] },
	generateApiToken: { name: 'token-name' },
	sendViber: { name: 'viber-send' },
	sendAppInbox: { name: 'appinbox-send' },
	sendTelegramBot: { name: 'telegram-send' },
	updateTranslatedSmsMessage: {
		id: 1,
		language: 'en',
		name: 'updated-sms',
	},
	deleteTranslatedSmsMessage: { id: 1, language: 'en' },
};

const expectedContracts = JSON.parse(
	readFileSync(join(__dirname, 'request-contracts.json'), 'utf8'),
) as Record<string, ExpectedContract>;

// The endpoint tree mixes nested groups and handlers, so traversal needs
// unknown until the function leaf check narrows each value.
function operationNames(tree: Record<string, unknown>, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([name, value]) => {
		const operation = prefix ? `${prefix}.${name}` : name;
		if (typeof value === 'function') return [operation];
		return operationNames(value as Record<string, unknown>, operation);
	});
}

// The wrapper validates responses after transport, so mock a value accepted
// by each operation's output schema instead of a generic undefined.
function validOutput(operation: string): unknown {
	const schema =
		EsputnikEndpointOutputSchemas[
			operation as keyof typeof EsputnikEndpointOutputSchemas
		];
	for (const candidate of [
		undefined,
		'ok',
		[],
		{},
		{ id: 1 },
		{ active: true },
	]) {
		if (schema.safeParse(candidate).success) return candidate;
	}
	throw new Error(`No valid response fixture for ${operation}`);
}

describe('eSputnik request contracts', () => {
	let response: unknown;

	beforeEach(() => {
		response = undefined;
		request.mockImplementation(async () => response);
	});

	afterEach(() => jest.clearAllMocks());

	it('matches the registered operation set', () => {
		expect(Object.keys(expectedContracts).sort()).toEqual(
			operationNames(wrappedEndpoints).sort(),
		);
	});

	it('sends the documented method, route, query, and body for every operation', async () => {
		for (const operation of operationNames(wrappedEndpoints)) {
			const name = operation.split('.').pop() as string;
			const expected = expectedContracts[operation];
			const input = fixtures[name] ?? {};
			const endpoint = operation
				.split('.')
				.reduce<unknown>(
					(tree, part) => (tree as Record<string, unknown>)[part],
					wrappedEndpoints,
				);
			if (!expected)
				throw new Error(`Missing expected contract for ${operation}`);
			if (typeof endpoint !== 'function')
				throw new Error(`Missing endpoint ${operation}`);

			response = validOutput(name);
			const callsBefore = request.mock.calls.length;
			await endpoint(context, input);
			expect(request.mock.calls).toHaveLength(callsBefore + 1);

			const [path, key, options] = request.mock.calls.at(-1) ?? [];
			expect({ operation, path }).toEqual({
				operation,
				path: expected.path,
			});
			expect(key).toBe('test-api-key');
			expect({ operation, options }).toEqual({
				operation,
				options: expected.options,
			});
		}

		expect(request).toHaveBeenCalledTimes(110);
	});
});
