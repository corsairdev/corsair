// Each fixture is a schema-valid input that exercises path parameters, query
// serialization and body forwarding for one public operation. Operations
// without an entry take no input. request-contracts.json holds the method,
// route, query and body eSputnik's API reference documents for each fixture.
// Fixtures mirror provider payloads, so each schema narrows this shared map.
export const operationFixtures: Record<string, Record<string, unknown>> = {
	getOrganisationBalanceHistory: {
		dateFrom: '2026-01-01',
		dateTo: '2026-01-31',
	},
	addContact: {
		channels: [
			{
				type: 'email',
				value: 'person@example.com',
			},
		],
		fields: [
			{
				id: 79814,
				value: 'gold',
			},
		],
		address: {
			town: 'Toulouse',
		},
	},
	getContact: {
		id: 1,
	},
	updateContact: {
		id: 1,
		firstName: 'Ada',
		channels: [
			{
				type: 'email',
				value: 'person@example.com',
			},
		],
	},
	deleteContactById: {
		id: 1,
		erase: true,
	},
	deleteContactByExternalCustomerId: {
		externalCustomerId: 'AB12770',
	},
	searchContacts: {
		email: 'person@example.com',
		maxrows: 100,
	},
	subscribeContact: {
		contact: {
			channels: [
				{
					type: 'email',
					value: 'person@example.com',
				},
			],
		},
		groups: ['Newsletter'],
	},
	contactsBulkUpdate: {
		contacts: [],
		dedupeOn: 'email',
	},
	fileContactsBulkUpdate: {
		dedupeOn: 'email',
		link: 'https://example.com/contacts.csv',
	},
	getImportSessionStatus: {
		sessionId: 'session/1',
	},
	getContactEmails: {
		ids: '1,2',
	},
	addToUnsubscribed: {
		emails: ['person@example.com'],
	},
	deleteFromUnsubscribed: {
		emails: ['person@example.com'],
	},
	getGroupContacts: {
		id: 1,
		maxrows: 50,
	},
	detachContactsFromGroup: {
		id: 1,
		contactIds: [2],
	},
	attachContactsToGroup: {
		id: 1,
		externalCustomerIds: ['AB12770'],
	},
	searchGroups: {
		name: 'VIP',
	},
	searchWorkflows: {
		name: 'Welcome',
	},
	getContactIdByToken: {
		app_uuid: 'app/id',
		token_id: 'token?x',
	},
	getContactSubscriptionCategories: {
		id: 1,
	},
	changeContactSubscriptionCategories: {
		id: 1,
		subscriptions: ['news'],
	},
	contactRecoms: {
		dataSourceId: 3,
		contactId: 1,
	},
	contactActivity: {
		dateFrom: '2026-01-01',
		dateTo: '2026-01-31',
		email: 'person@example.com',
	},
	contactMessages: {
		dateFrom: '2026-01-01',
		dateTo: '2026-01-31',
		contactId: 1,
	},
	getTokenActivated: {
		app_uuid: 'app',
		token_id: 'token',
	},
	changeTokenActivated: {
		app_uuid: 'app',
		token_id: 'token',
		active: false,
	},
	ordersBulkInsert: {
		orders: [],
	},
	registerEvent: {
		eventTypeKey: 'cart_abandoned',
		params: {},
	},
	sendHistoryEvents: {
		events: [],
	},
	removeHistoryEvents: {
		from: '2026-01-01',
		to: '2026-01-02',
	},
	searchEmails: {
		search: 'welcome',
	},
	getEmailMessageViewLink: {
		id: 1,
	},
	addEmail: {
		name: 'Welcome',
		from: 'sender@example.com',
		subject: 'Hi',
		htmlText: '<p>Hi</p>',
	},
	getEmail: {
		id: 1,
	},
	updateMessage: {
		id: 1,
		name: 'Welcome',
		from: 'sender@example.com',
		subject: 'Hi',
		htmlText: '<p>Hi</p>',
	},
	deleteEmail: {
		id: 1,
	},
	updateTranslatedMessage: {
		id: 1,
		language: 'en',
		name: 'Welcome',
		from: 'sender@example.com',
		subject: 'Hi',
		htmlText: '<p>Hi</p>',
	},
	deleteTranslatedEmail: {
		id: 1,
		language: 'en',
	},
	sendEmail: {
		from: 'sender@example.com',
		subject: 'Hi',
		htmlText: '<p>Hi</p>',
		emails: ['person@example.com'],
	},
	searchMobilePushMessages: {
		search: 'welcome',
	},
	addMobilePushMessage: {
		name: 'Push',
		title: 'Title',
		text: 'Text',
	},
	getMobilePushMessage: {
		id: 1,
	},
	updateBaseMobilePushMessage: {
		id: 1,
		name: 'Push',
		title: 'Title',
		text: 'Text',
	},
	deleteMobilePushMessage: {
		id: 1,
	},
	updateTranslatedMobilePushMessage: {
		id: 1,
		language: 'en',
		name: 'Push',
		title: 'Title',
		text: 'Text',
	},
	deleteTranslatedMobilePushMessage: {
		id: 1,
		language: 'en',
	},
	searchViberMessages: {
		search: 'welcome',
	},
	addViberMessage: {
		name: 'Promo',
		from: 'Shop',
		text: 'Hi',
	},
	getViberMessage: {
		id: 1,
	},
	updateBaseViberMessage: {
		id: 1,
		name: 'Promo',
		from: 'Shop',
		text: 'Hi',
	},
	deleteViberMessage: {
		id: 1,
	},
	updateTranslatedViberMessage: {
		id: 1,
		language: 'en',
		name: 'Promo',
		from: 'Shop',
		text: 'Hi',
	},
	deleteTranslatedViberMessage: {
		id: 1,
		language: 'en',
	},
	sendViber: {
		text: 'Hi',
		phoneNumbers: ['380501234567'],
	},
	searchAppInboxMessages: {
		search: 'welcome',
	},
	addAppInboxMessage: {
		name: 'Inbox',
		title: 'Title',
		text: 'Text',
	},
	getAppInboxMessage: {
		id: 1,
	},
	updateBaseAppInboxMessage: {
		id: 1,
		name: 'Inbox',
		title: 'Title',
		text: 'Text',
	},
	deleteAppInboxMessage: {
		id: 1,
	},
	updateTranslatedAppInboxMessage: {
		id: 1,
		language: 'en',
		name: 'Inbox',
		title: 'Title',
		text: 'Text',
	},
	deleteTranslatedAppInboxMessage: {
		id: 1,
		language: 'en',
	},
	searchTelegramBotMessages: {
		search: 'welcome',
	},
	addTelegramBotMessage: {
		name: 'Bot',
		text: 'Hi',
	},
	getTelegramBotMessage: {
		id: 1,
	},
	updateBaseTelegramBotMessage: {
		id: 1,
		name: 'Bot',
		text: 'Hi',
	},
	deleteTelegramBotMessage: {
		id: 1,
	},
	updateTranslatedTelegramMessage: {
		id: 1,
		language: 'en',
		name: 'Bot',
		text: 'Hi',
	},
	deleteTranslatedTelegramMessage: {
		id: 1,
		language: 'en',
	},
	searchSmsMessages: {
		search: 'welcome',
	},
	addSmsMessage: {
		name: 'Sms',
		from: 'Shop',
		text: 'Hi',
	},
	getSms: {
		id: 1,
	},
	updateBaseSmsMessage: {
		id: 1,
		name: 'Sms',
		from: 'Shop',
		text: 'Hi',
	},
	deleteSmsMessage: {
		id: 1,
	},
	updateTranslatedSmsMessage: {
		id: 1,
		language: 'en',
		name: 'Sms',
		from: 'Shop',
		text: 'Hi',
	},
	deleteTranslatedSmsMessage: {
		id: 1,
		language: 'en',
	},
	sendSms: {
		from: 'Shop',
		text: 'Hi',
		phoneNumbers: ['380501234567'],
	},
	getBroadcasts: {
		maxrows: 10,
	},
	createBroadcast: {
		messageId: '123',
		groups: [5],
	},
	getBroadcast: {
		id: 'b-1',
	},
	cancelBroadcast: {
		id: 'b-1',
	},
	sendPreparedMessage: {
		id: 7,
		recipients: [
			{
				locator: 'person@example.com',
				jsonParam: '{"name":"Ada"}',
			},
		],
		email: true,
	},
	updateInteractionStatus: {
		interactionId: '2E2E831C-486C',
		status: 'DELIVERED',
		time: '2026-01-01T10:00:00Z',
	},
	createDomain: {
		domain: 'example.com',
	},
	addWebPushDomain: {
		domain: 'example.com',
		serviceWorkerName: 'sw.js',
		serviceWorkerPath: '/',
		serviceWorkerScope: '/',
	},
	deleteWebPushDomain: {
		domain: 'example.com',
	},
	getWebPushScript: {
		domain: 'example.com',
	},
	configureProductFeeds: {
		feeds: [
			{
				url: 'https://example.com/feed.xml',
				language: 'en',
				default: true,
			},
		],
	},
	addAppTokens: {
		app_uuid: 'app-1',
		tokens: [
			{
				token: 't1',
				contactId: 1,
			},
		],
	},
	muteAppToken: {
		app_uuid: 'app-1',
		token: 't1',
		duration: 60,
	},
	unmuteAppToken: {
		app_uuid: 'app-1',
		token: 't1',
	},
	getPromocodes: {
		type: 'SUMMER',
		inUse: false,
	},
	getPromocodesCount: {
		type: 'SUMMER',
	},
	insertPromocodes: {
		promocodes: ['A1'],
		expirationDate: '2026-12-31',
		discount: 10,
	},
	getPreprocessorFileStatus: {
		sessionId: 's-1',
	},
	updatePreprocessorFile: {
		fileId: 'f-1',
		link: 'https://example.com/data.csv',
	},
	uploadPreprocessorFile: {
		link: 'https://example.com/data.csv',
		preprocessorType: 'Key',
	},
};
