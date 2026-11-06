import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	accountEndpoints,
	appEndpoints,
	appInboxEndpoints,
	broadcastEndpoints,
	contactEndpoints,
	emailEndpoints,
	eventEndpoints,
	interfaceEndpoints,
	messageEndpoints,
	mobilePushEndpoints,
	orderEndpoints,
	preprocessorEndpoints,
	productFeedEndpoints,
	promocodeEndpoints,
	siteEndpoints,
	smsEndpoints,
	telegramBotEndpoints,
	viberEndpoints,
} from './endpoints';
import type {
	EsputnikEndpointInputs,
	EsputnikEndpointOutputs,
	EsputnikOperation,
} from './endpoints/types';
import {
	EsputnikEndpointInputSchemas,
	EsputnikEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { EsputnikSchema } from './schema';

export type EsputnikPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalEsputnikPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof esputnikEndpointsNested>;
};

export type EsputnikContext = CorsairPluginContext<
	typeof EsputnikSchema,
	EsputnikPluginOptions
>;
export type EsputnikKeyBuilderContext =
	KeyBuilderContext<EsputnikPluginOptions>;
export type EsputnikBoundEndpoints = BindEndpoints<
	typeof esputnikEndpointsNested
>;

export type EsputnikEndpoints = {
	[K in EsputnikOperation]: CorsairEndpoint<
		EsputnikContext,
		EsputnikEndpointInputs[K],
		EsputnikEndpointOutputs[K]
	>;
};

export const esputnikEndpointsNested = {
	account: accountEndpoints,
	contacts: contactEndpoints,
	orders: orderEndpoints,
	events: eventEndpoints,
	emails: emailEndpoints,
	mobilePush: mobilePushEndpoints,
	viber: viberEndpoints,
	appInbox: appInboxEndpoints,
	telegramBot: telegramBotEndpoints,
	sms: smsEndpoints,
	broadcasts: broadcastEndpoints,
	interfaces: interfaceEndpoints,
	messages: messageEndpoints,
	site: siteEndpoints,
	productFeeds: productFeedEndpoints,
	apps: appEndpoints,
	promocodes: promocodeEndpoints,
	preprocessor: preprocessorEndpoints,
} as const;

const schemasFor = <K extends EsputnikOperation>(operation: K) => ({
	input: EsputnikEndpointInputSchemas[operation],
	output: EsputnikEndpointOutputSchemas[operation],
});

export const esputnikEndpointSchemas = {
	'account.getAccountInfo': schemasFor('getAccountInfo'),
	'account.getBalance': schemasFor('getBalance'),
	'account.getOrganisationBalanceHistory': schemasFor(
		'getOrganisationBalanceHistory',
	),
	'account.generateApiToken': schemasFor('generateApiToken'),
	'contacts.addContact': schemasFor('addContact'),
	'contacts.getContact': schemasFor('getContact'),
	'contacts.updateContact': schemasFor('updateContact'),
	'contacts.deleteContactById': schemasFor('deleteContactById'),
	'contacts.deleteContactByExternalCustomerId': schemasFor(
		'deleteContactByExternalCustomerId',
	),
	'contacts.searchContacts': schemasFor('searchContacts'),
	'contacts.subscribeContact': schemasFor('subscribeContact'),
	'contacts.contactsBulkUpdate': schemasFor('contactsBulkUpdate'),
	'contacts.fileContactsBulkUpdate': schemasFor('fileContactsBulkUpdate'),
	'contacts.getImportSessionStatus': schemasFor('getImportSessionStatus'),
	'contacts.getContactEmails': schemasFor('getContactEmails'),
	'contacts.addToUnsubscribed': schemasFor('addToUnsubscribed'),
	'contacts.deleteFromUnsubscribed': schemasFor('deleteFromUnsubscribed'),
	'contacts.getGroupContacts': schemasFor('getGroupContacts'),
	'contacts.detachContactsFromGroup': schemasFor('detachContactsFromGroup'),
	'contacts.attachContactsToGroup': schemasFor('attachContactsToGroup'),
	'contacts.searchGroups': schemasFor('searchGroups'),
	'contacts.searchWorkflows': schemasFor('searchWorkflows'),
	'contacts.getContactIdByToken': schemasFor('getContactIdByToken'),
	'contacts.getContactSubscriptionCategories': schemasFor(
		'getContactSubscriptionCategories',
	),
	'contacts.changeContactSubscriptionCategories': schemasFor(
		'changeContactSubscriptionCategories',
	),
	'contacts.contactRecoms': schemasFor('contactRecoms'),
	'contacts.getAdditionalFields': schemasFor('getAdditionalFields'),
	'contacts.getSubscriptionCategories': schemasFor('getSubscriptionCategories'),
	'contacts.contactActivity': schemasFor('contactActivity'),
	'contacts.contactMessages': schemasFor('contactMessages'),
	'contacts.getTokenActivated': schemasFor('getTokenActivated'),
	'contacts.changeTokenActivated': schemasFor('changeTokenActivated'),
	'orders.ordersBulkInsert': schemasFor('ordersBulkInsert'),
	'events.registerEvent': schemasFor('registerEvent'),
	'events.sendHistoryEvents': schemasFor('sendHistoryEvents'),
	'events.removeHistoryEvents': schemasFor('removeHistoryEvents'),
	'emails.searchEmails': schemasFor('searchEmails'),
	'emails.getEmailMessageViewLink': schemasFor('getEmailMessageViewLink'),
	'emails.addEmail': schemasFor('addEmail'),
	'emails.getEmail': schemasFor('getEmail'),
	'emails.updateMessage': schemasFor('updateMessage'),
	'emails.deleteEmail': schemasFor('deleteEmail'),
	'emails.updateTranslatedMessage': schemasFor('updateTranslatedMessage'),
	'emails.deleteTranslatedEmail': schemasFor('deleteTranslatedEmail'),
	'emails.sendEmail': schemasFor('sendEmail'),
	'mobilePush.searchMobilePushMessages': schemasFor('searchMobilePushMessages'),
	'mobilePush.addMobilePushMessage': schemasFor('addMobilePushMessage'),
	'mobilePush.getMobilePushMessage': schemasFor('getMobilePushMessage'),
	'mobilePush.updateBaseMobilePushMessage': schemasFor(
		'updateBaseMobilePushMessage',
	),
	'mobilePush.deleteMobilePushMessage': schemasFor('deleteMobilePushMessage'),
	'mobilePush.updateTranslatedMobilePushMessage': schemasFor(
		'updateTranslatedMobilePushMessage',
	),
	'mobilePush.deleteTranslatedMobilePushMessage': schemasFor(
		'deleteTranslatedMobilePushMessage',
	),
	'viber.searchViberMessages': schemasFor('searchViberMessages'),
	'viber.addViberMessage': schemasFor('addViberMessage'),
	'viber.getViberMessage': schemasFor('getViberMessage'),
	'viber.updateBaseViberMessage': schemasFor('updateBaseViberMessage'),
	'viber.deleteViberMessage': schemasFor('deleteViberMessage'),
	'viber.updateTranslatedViberMessage': schemasFor(
		'updateTranslatedViberMessage',
	),
	'viber.deleteTranslatedViberMessage': schemasFor(
		'deleteTranslatedViberMessage',
	),
	'viber.sendViber': schemasFor('sendViber'),
	'appInbox.searchAppInboxMessages': schemasFor('searchAppInboxMessages'),
	'appInbox.addAppInboxMessage': schemasFor('addAppInboxMessage'),
	'appInbox.getAppInboxMessage': schemasFor('getAppInboxMessage'),
	'appInbox.updateBaseAppInboxMessage': schemasFor('updateBaseAppInboxMessage'),
	'appInbox.deleteAppInboxMessage': schemasFor('deleteAppInboxMessage'),
	'appInbox.updateTranslatedAppInboxMessage': schemasFor(
		'updateTranslatedAppInboxMessage',
	),
	'appInbox.deleteTranslatedAppInboxMessage': schemasFor(
		'deleteTranslatedAppInboxMessage',
	),
	'telegramBot.searchTelegramBotMessages': schemasFor(
		'searchTelegramBotMessages',
	),
	'telegramBot.addTelegramBotMessage': schemasFor('addTelegramBotMessage'),
	'telegramBot.getTelegramBotMessage': schemasFor('getTelegramBotMessage'),
	'telegramBot.updateBaseTelegramBotMessage': schemasFor(
		'updateBaseTelegramBotMessage',
	),
	'telegramBot.deleteTelegramBotMessage': schemasFor(
		'deleteTelegramBotMessage',
	),
	'telegramBot.updateTranslatedTelegramMessage': schemasFor(
		'updateTranslatedTelegramMessage',
	),
	'telegramBot.deleteTranslatedTelegramMessage': schemasFor(
		'deleteTranslatedTelegramMessage',
	),
	'sms.searchSmsMessages': schemasFor('searchSmsMessages'),
	'sms.addSmsMessage': schemasFor('addSmsMessage'),
	'sms.getSms': schemasFor('getSms'),
	'sms.updateBaseSmsMessage': schemasFor('updateBaseSmsMessage'),
	'sms.deleteSmsMessage': schemasFor('deleteSmsMessage'),
	'sms.updateTranslatedSmsMessage': schemasFor('updateTranslatedSmsMessage'),
	'sms.deleteTranslatedSmsMessage': schemasFor('deleteTranslatedSmsMessage'),
	'sms.sendSms': schemasFor('sendSms'),
	'broadcasts.getBroadcasts': schemasFor('getBroadcasts'),
	'broadcasts.createBroadcast': schemasFor('createBroadcast'),
	'broadcasts.getBroadcast': schemasFor('getBroadcast'),
	'broadcasts.cancelBroadcast': schemasFor('cancelBroadcast'),
	'interfaces.getSmsInterfaces': schemasFor('getSmsInterfaces'),
	'interfaces.getEmailInterfaces': schemasFor('getEmailInterfaces'),
	'messages.sendPreparedMessage': schemasFor('sendPreparedMessage'),
	'messages.updateInteractionStatus': schemasFor('updateInteractionStatus'),
	'site.getDomains': schemasFor('getDomains'),
	'site.createDomain': schemasFor('createDomain'),
	'site.getScript': schemasFor('getScript'),
	'site.getWebPushDomains': schemasFor('getWebPushDomains'),
	'site.addWebPushDomain': schemasFor('addWebPushDomain'),
	'site.deleteWebPushDomain': schemasFor('deleteWebPushDomain'),
	'site.getWebPushScript': schemasFor('getWebPushScript'),
	'productFeeds.getProductFeedsConfiguration': schemasFor(
		'getProductFeedsConfiguration',
	),
	'productFeeds.configureProductFeeds': schemasFor('configureProductFeeds'),
	'apps.addAppTokens': schemasFor('addAppTokens'),
	'apps.muteAppToken': schemasFor('muteAppToken'),
	'apps.unmuteAppToken': schemasFor('unmuteAppToken'),
	'promocodes.getPromocodes': schemasFor('getPromocodes'),
	'promocodes.getPromocodesCount': schemasFor('getPromocodesCount'),
	'promocodes.insertPromocodes': schemasFor('insertPromocodes'),
	'preprocessor.getPreprocessorFileStatus': schemasFor(
		'getPreprocessorFileStatus',
	),
	'preprocessor.updatePreprocessorFile': schemasFor('updatePreprocessorFile'),
	'preprocessor.uploadPreprocessorFile': schemasFor('uploadPreprocessorFile'),
} as const satisfies RequiredPluginEndpointSchemas<
	typeof esputnikEndpointsNested
>;

// The endpoint tree mixes nested groups with callable leaves whose input and
// output types differ per operation. Traversal therefore sees `unknown` and
// every leaf is schema-validated before and after invocation.
type EndpointTree = Record<string, unknown>;
type EndpointHandler = (
	context: EsputnikContext,
	input: unknown,
) => Promise<unknown>;

function withEsputnikSchemas<T extends EndpointTree>(tree: T, prefix = ''): T {
	const entries = Object.entries(tree).map(([name, value]) => {
		const operation = prefix ? `${prefix}.${name}` : name;
		if (typeof value === 'function') {
			const schemas =
				esputnikEndpointSchemas[
					operation as keyof typeof esputnikEndpointSchemas
				];
			if (!schemas)
				throw new Error(`Missing eSputnik schemas for ${operation}`);
			return [
				name,
				async (context: EsputnikContext, input: unknown) => {
					const parsedInput = schemas.input.parse(input ?? {});
					const result = await (value as EndpointHandler)(context, parsedInput);
					return schemas.output.parse(result);
				},
			];
		}
		return [name, withEsputnikSchemas(value as EndpointTree, operation)];
	});
	return Object.fromEntries(entries) as T;
}

const esputnikEndpointMeta = {
	'account.getAccountInfo': {
		riskLevel: 'read',
		description: 'Get the eSputnik account name and organisation ID',
	},
	'account.getBalance': {
		riskLevel: 'read',
		description: 'Get the eSputnik organisation balance',
	},
	'account.getOrganisationBalanceHistory': {
		riskLevel: 'read',
		description:
			'Get daily eSputnik billing costs for a period of up to 90 days',
	},
	'account.generateApiToken': {
		riskLevel: 'write',
		description:
			'Generate a bearer token for the eSputnik event endpoints (returns a secret)',
	},
	'contacts.addContact': {
		riskLevel: 'write',
		description: 'Create or update an eSputnik contact',
	},
	'contacts.getContact': {
		riskLevel: 'read',
		description: 'Get an eSputnik contact by ID',
	},
	'contacts.updateContact': {
		riskLevel: 'write',
		description: 'Update an eSputnik contact by ID',
	},
	'contacts.deleteContactById': {
		riskLevel: 'destructive',
		description: 'Delete an eSputnik contact by ID',
	},
	'contacts.deleteContactByExternalCustomerId': {
		riskLevel: 'destructive',
		description: 'Delete an eSputnik contact by external customer ID',
	},
	'contacts.searchContacts': {
		riskLevel: 'read',
		description: 'Search eSputnik contacts (up to 500 per page)',
	},
	'contacts.subscribeContact': {
		riskLevel: 'write',
		description: 'Subscribe an eSputnik contact',
	},
	'contacts.contactsBulkUpdate': {
		riskLevel: 'write',
		description: 'Bulk create or update eSputnik contacts',
	},
	'contacts.fileContactsBulkUpdate': {
		riskLevel: 'write',
		description: 'Import eSputnik contacts from a file link',
	},
	'contacts.getImportSessionStatus': {
		riskLevel: 'read',
		description: 'Get eSputnik contact import status',
	},
	'contacts.getContactEmails': {
		riskLevel: 'read',
		description: 'Get email addresses for eSputnik contact IDs',
	},
	'contacts.addToUnsubscribed': {
		riskLevel: 'write',
		description: 'Add emails to the eSputnik unsubscribe list',
	},
	'contacts.deleteFromUnsubscribed': {
		riskLevel: 'destructive',
		description: 'Remove emails from the eSputnik unsubscribe list',
	},
	'contacts.getGroupContacts': {
		riskLevel: 'read',
		description: 'Get contacts in an eSputnik segment',
	},
	'contacts.detachContactsFromGroup': {
		riskLevel: 'destructive',
		description: 'Remove contacts from an eSputnik static segment',
	},
	'contacts.attachContactsToGroup': {
		riskLevel: 'write',
		description: 'Add contacts to an eSputnik static segment',
	},
	'contacts.searchGroups': {
		riskLevel: 'read',
		description: 'Search eSputnik segments',
	},
	'contacts.searchWorkflows': {
		riskLevel: 'read',
		description: 'Search eSputnik workflows',
	},
	'contacts.getContactIdByToken': {
		riskLevel: 'read',
		description: 'Get an eSputnik contact ID by mobile push token',
	},
	'contacts.getContactSubscriptionCategories': {
		riskLevel: 'read',
		description: "Get an eSputnik contact's subscription categories",
	},
	'contacts.changeContactSubscriptionCategories': {
		riskLevel: 'write',
		description: "Replace an eSputnik contact's subscription categories",
	},
	'contacts.contactRecoms': {
		riskLevel: 'read',
		description: 'Get product recommendations for an eSputnik contact',
	},
	'contacts.getAdditionalFields': {
		riskLevel: 'read',
		description: 'List eSputnik contact additional fields',
	},
	'contacts.getSubscriptionCategories': {
		riskLevel: 'read',
		description: "List the organisation's eSputnik subscription categories",
	},
	'contacts.contactActivity': {
		riskLevel: 'read',
		description:
			'Get delivery, read and click activity for messages sent to eSputnik contacts',
	},
	'contacts.contactMessages': {
		riskLevel: 'read',
		description: "Get an eSputnik contact's message history",
	},
	'contacts.getTokenActivated': {
		riskLevel: 'read',
		description: 'Get whether an eSputnik mobile push token is active',
	},
	'contacts.changeTokenActivated': {
		riskLevel: 'write',
		description: 'Activate or deactivate an eSputnik mobile push token',
	},
	'orders.ordersBulkInsert': {
		riskLevel: 'write',
		description: 'Add or update eSputnik orders',
	},
	'events.registerEvent': {
		riskLevel: 'write',
		description: 'Send an eSputnik event',
	},
	'events.sendHistoryEvents': {
		riskLevel: 'write',
		description: 'Send past eSputnik events',
	},
	'events.removeHistoryEvents': {
		riskLevel: 'destructive',
		description: 'Delete eSputnik events in a period',
	},
	'emails.searchEmails': {
		riskLevel: 'read',
		description: 'Search eSputnik email messages by name or tag',
	},
	'emails.getEmailMessageViewLink': {
		riskLevel: 'read',
		description: 'Get a link to view an eSputnik email message',
	},
	'emails.addEmail': {
		riskLevel: 'write',
		description: 'Create an eSputnik email message',
	},
	'emails.getEmail': {
		riskLevel: 'read',
		description: 'Get an eSputnik email message',
	},
	'emails.updateMessage': {
		riskLevel: 'write',
		description: 'Update an eSputnik email message',
	},
	'emails.deleteEmail': {
		riskLevel: 'destructive',
		description: 'Delete an eSputnik email message',
	},
	'emails.updateTranslatedMessage': {
		riskLevel: 'write',
		description:
			'Add or update a language version of an eSputnik email message',
	},
	'emails.deleteTranslatedEmail': {
		riskLevel: 'destructive',
		description: 'Delete a language version of an eSputnik email message',
	},
	'emails.sendEmail': {
		riskLevel: 'write',
		description: 'Send an email to eSputnik recipients',
	},
	'mobilePush.searchMobilePushMessages': {
		riskLevel: 'read',
		description: 'Search eSputnik mobile push messages by name',
	},
	'mobilePush.addMobilePushMessage': {
		riskLevel: 'write',
		description: 'Create a eSputnik mobile push message',
	},
	'mobilePush.getMobilePushMessage': {
		riskLevel: 'read',
		description:
			'Get a eSputnik mobile push message with its language versions',
	},
	'mobilePush.updateBaseMobilePushMessage': {
		riskLevel: 'write',
		description: 'Update a eSputnik mobile push message',
	},
	'mobilePush.deleteMobilePushMessage': {
		riskLevel: 'destructive',
		description: 'Delete a eSputnik mobile push message',
	},
	'mobilePush.updateTranslatedMobilePushMessage': {
		riskLevel: 'write',
		description:
			'Add or update a language version of a eSputnik mobile push message',
	},
	'mobilePush.deleteTranslatedMobilePushMessage': {
		riskLevel: 'destructive',
		description: 'Delete a language version of a eSputnik mobile push message',
	},
	'viber.searchViberMessages': {
		riskLevel: 'read',
		description: 'Search eSputnik Viber messages by name',
	},
	'viber.addViberMessage': {
		riskLevel: 'write',
		description: 'Create a eSputnik Viber message',
	},
	'viber.getViberMessage': {
		riskLevel: 'read',
		description: 'Get a eSputnik Viber message with its language versions',
	},
	'viber.updateBaseViberMessage': {
		riskLevel: 'write',
		description: 'Update a eSputnik Viber message',
	},
	'viber.deleteViberMessage': {
		riskLevel: 'destructive',
		description: 'Delete a eSputnik Viber message',
	},
	'viber.updateTranslatedViberMessage': {
		riskLevel: 'write',
		description: 'Add or update a language version of a eSputnik Viber message',
	},
	'viber.deleteTranslatedViberMessage': {
		riskLevel: 'destructive',
		description: 'Delete a language version of a eSputnik Viber message',
	},
	'viber.sendViber': {
		riskLevel: 'write',
		description: 'Send a Viber message to eSputnik recipients',
	},
	'appInbox.searchAppInboxMessages': {
		riskLevel: 'read',
		description: 'Search eSputnik App Inbox messages by name',
	},
	'appInbox.addAppInboxMessage': {
		riskLevel: 'write',
		description: 'Create a eSputnik App Inbox message',
	},
	'appInbox.getAppInboxMessage': {
		riskLevel: 'read',
		description: 'Get a eSputnik App Inbox message with its language versions',
	},
	'appInbox.updateBaseAppInboxMessage': {
		riskLevel: 'write',
		description: 'Update a eSputnik App Inbox message',
	},
	'appInbox.deleteAppInboxMessage': {
		riskLevel: 'destructive',
		description: 'Delete a eSputnik App Inbox message',
	},
	'appInbox.updateTranslatedAppInboxMessage': {
		riskLevel: 'write',
		description:
			'Add or update a language version of a eSputnik App Inbox message',
	},
	'appInbox.deleteTranslatedAppInboxMessage': {
		riskLevel: 'destructive',
		description: 'Delete a language version of a eSputnik App Inbox message',
	},
	'telegramBot.searchTelegramBotMessages': {
		riskLevel: 'read',
		description: 'Search eSputnik Telegram bot messages by name',
	},
	'telegramBot.addTelegramBotMessage': {
		riskLevel: 'write',
		description: 'Create a eSputnik Telegram bot message',
	},
	'telegramBot.getTelegramBotMessage': {
		riskLevel: 'read',
		description:
			'Get a eSputnik Telegram bot message with its language versions',
	},
	'telegramBot.updateBaseTelegramBotMessage': {
		riskLevel: 'write',
		description: 'Update a eSputnik Telegram bot message',
	},
	'telegramBot.deleteTelegramBotMessage': {
		riskLevel: 'destructive',
		description: 'Delete a eSputnik Telegram bot message',
	},
	'telegramBot.updateTranslatedTelegramMessage': {
		riskLevel: 'write',
		description:
			'Add or update a language version of a eSputnik Telegram bot message',
	},
	'telegramBot.deleteTranslatedTelegramMessage': {
		riskLevel: 'destructive',
		description: 'Delete a language version of a eSputnik Telegram bot message',
	},
	'sms.searchSmsMessages': {
		riskLevel: 'read',
		description: 'Search eSputnik SMS messages by name',
	},
	'sms.addSmsMessage': {
		riskLevel: 'write',
		description: 'Create a eSputnik SMS message',
	},
	'sms.getSms': {
		riskLevel: 'read',
		description: 'Get a eSputnik SMS message with its language versions',
	},
	'sms.updateBaseSmsMessage': {
		riskLevel: 'write',
		description: 'Update a eSputnik SMS message',
	},
	'sms.deleteSmsMessage': {
		riskLevel: 'destructive',
		description: 'Delete a eSputnik SMS message',
	},
	'sms.updateTranslatedSmsMessage': {
		riskLevel: 'write',
		description: 'Add or update a language version of a eSputnik SMS message',
	},
	'sms.deleteTranslatedSmsMessage': {
		riskLevel: 'destructive',
		description: 'Delete a language version of a eSputnik SMS message',
	},
	'sms.sendSms': {
		riskLevel: 'write',
		description: 'Send an SMS to eSputnik recipients',
	},
	'broadcasts.getBroadcasts': {
		riskLevel: 'read',
		description: 'List eSputnik broadcasts',
	},
	'broadcasts.createBroadcast': {
		riskLevel: 'write',
		description:
			'Create an eSputnik broadcast for a prepared message and segments',
	},
	'broadcasts.getBroadcast': {
		riskLevel: 'read',
		description: 'Get an eSputnik broadcast',
	},
	'broadcasts.cancelBroadcast': {
		riskLevel: 'destructive',
		description: 'Cancel a scheduled eSputnik broadcast',
	},
	'interfaces.getSmsInterfaces': {
		riskLevel: 'read',
		description: 'List eSputnik SMS sender names',
	},
	'interfaces.getEmailInterfaces': {
		riskLevel: 'read',
		description: 'List eSputnik email sender addresses',
	},
	'messages.sendPreparedMessage': {
		riskLevel: 'write',
		description: 'Send a prepared eSputnik message to one or more contacts',
	},
	'messages.updateInteractionStatus': {
		riskLevel: 'write',
		description:
			'Report a delivery, open or click status for an eSputnik message interaction',
	},
	'site.getDomains': {
		riskLevel: 'read',
		description: "Get the organisation's eSputnik web tracking domain",
	},
	'site.createDomain': {
		riskLevel: 'write',
		description: 'Register a domain for eSputnik web tracking',
	},
	'site.getScript': {
		riskLevel: 'read',
		description: 'Get the eSputnik web tracking script',
	},
	'site.getWebPushDomains': {
		riskLevel: 'read',
		description: 'List eSputnik web push domains',
	},
	'site.addWebPushDomain': {
		riskLevel: 'write',
		description: 'Register an eSputnik web push domain',
	},
	'site.deleteWebPushDomain': {
		riskLevel: 'destructive',
		description: 'Delete an eSputnik web push domain',
	},
	'site.getWebPushScript': {
		riskLevel: 'read',
		description: 'Get the eSputnik web push script for a domain',
	},
	'productFeeds.getProductFeedsConfiguration': {
		riskLevel: 'read',
		description: 'Get eSputnik product feed configuration',
	},
	'productFeeds.configureProductFeeds': {
		riskLevel: 'write',
		description: 'Configure eSputnik product feeds',
	},
	'apps.addAppTokens': {
		riskLevel: 'write',
		description: 'Add Telegram application tokens to eSputnik',
	},
	'apps.muteAppToken': {
		riskLevel: 'write',
		description: 'Mute eSputnik notifications for an application token',
	},
	'apps.unmuteAppToken': {
		riskLevel: 'write',
		description: 'Unmute eSputnik notifications for an application token',
	},
	'promocodes.getPromocodes': {
		riskLevel: 'read',
		description: 'Get available eSputnik promotional codes',
	},
	'promocodes.getPromocodesCount': {
		riskLevel: 'read',
		description: 'Count available eSputnik promotional codes',
	},
	'promocodes.insertPromocodes': {
		riskLevel: 'write',
		description: 'Upload eSputnik promotional codes',
	},
	'preprocessor.getPreprocessorFileStatus': {
		riskLevel: 'read',
		description: 'Get the status of an eSputnik preprocessor file upload',
	},
	'preprocessor.updatePreprocessorFile': {
		riskLevel: 'destructive',
		description: 'Replace the data of an eSputnik preprocessor file',
	},
	'preprocessor.uploadPreprocessorFile': {
		riskLevel: 'write',
		description: 'Upload an eSputnik preprocessor file from a link',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof esputnikEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key';

export const esputnikAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BaseEsputnikPlugin<T extends EsputnikPluginOptions> = CorsairPlugin<
	'esputnik',
	typeof EsputnikSchema,
	typeof esputnikEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof esputnikAuthConfig
>;
export type InternalEsputnikPlugin = BaseEsputnikPlugin<EsputnikPluginOptions>;
export type ExternalEsputnikPlugin<T extends EsputnikPluginOptions> =
	BaseEsputnikPlugin<T>;

export function esputnik<const T extends EsputnikPluginOptions>(
	incomingOptions: EsputnikPluginOptions & T = {} as EsputnikPluginOptions & T,
): ExternalEsputnikPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'esputnik',
		authConfig: esputnikAuthConfig,
		schema: EsputnikSchema,
		options,
		hooks: options.hooks,
		endpoints: withEsputnikSchemas(esputnikEndpointsNested),
		webhooks: {},
		endpointMeta: esputnikEndpointMeta,
		endpointSchemas: esputnikEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: EsputnikKeyBuilderContext) => {
			if (options.key) return options.key;
			const key = await ctx.keys.get_api_key();
			if (!key) throw new AuthMissingError('esputnik', 'api_key');
			return key;
		},
	} satisfies InternalEsputnikPlugin;
}

export type {
	EsputnikEndpointInputs,
	EsputnikEndpointOutputs,
} from './endpoints/types';
