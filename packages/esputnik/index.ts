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
	accountExtendedEndpoints,
	appInboxEndpoints,
	batchTwoRemainderEndpoints,
	broadcastEndpoints,
	contactEndpoints,
	emailEndpoints,
	eventEndpoints,
	finalBatchEndpoints,
	interfaceEndpoints,
	mobilePushEndpoints,
	orderEndpoints,
	smsEndpoints,
	telegramBotEndpoints,
	viberEndpoints,
} from './endpoints';
import type {
	EsputnikEndpointInputs,
	EsputnikEndpointOutputs,
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

type EsputnikEndpoint<
	K extends keyof EsputnikEndpointOutputs & keyof EsputnikEndpointInputs,
> = CorsairEndpoint<
	EsputnikContext,
	EsputnikEndpointInputs[K],
	EsputnikEndpointOutputs[K]
>;

export type EsputnikEndpoints = {
	getAccountInfo: EsputnikEndpoint<'getAccountInfo'>;
	getBalance: EsputnikEndpoint<'getBalance'>;
	addContact: EsputnikEndpoint<'addContact'>;
	getContact: EsputnikEndpoint<'getContact'>;
	updateContact: EsputnikEndpoint<'updateContact'>;
	deleteContactById: EsputnikEndpoint<'deleteContactById'>;
	searchContacts: EsputnikEndpoint<'searchContacts'>;
	subscribeContact: EsputnikEndpoint<'subscribeContact'>;
	contactsBulkUpdate: EsputnikEndpoint<'contactsBulkUpdate'>;
	fileContactsBulkUpdate: EsputnikEndpoint<'fileContactsBulkUpdate'>;
	getImportSessionStatus: EsputnikEndpoint<'getImportSessionStatus'>;
	getContactEmails: EsputnikEndpoint<'getContactEmails'>;
	addToUnsubscribed: EsputnikEndpoint<'addToUnsubscribed'>;
	deleteFromUnsubscribed: EsputnikEndpoint<'deleteFromUnsubscribed'>;
	getGroupContacts: EsputnikEndpoint<'getGroupContacts'>;
	detachContactsFromGroup: EsputnikEndpoint<'detachContactsFromGroup'>;
	attachContactsToGroup: EsputnikEndpoint<'attachContactsToGroup'>;
	searchGroups: EsputnikEndpoint<'searchGroups'>;
	searchWorkflows: EsputnikEndpoint<'searchWorkflows'>;
	getContactIdByToken: EsputnikEndpoint<'getContactIdByToken'>;
	getContactSubscriptionCategories: EsputnikEndpoint<'getContactSubscriptionCategories'>;
	changeContactSubscriptionCategories: EsputnikEndpoint<'changeContactSubscriptionCategories'>;
	deleteContactByExternalCustomerId: EsputnikEndpoint<'deleteContactByExternalCustomerId'>;
	contactRecoms: EsputnikEndpoint<'contactRecoms'>;
	getAdditionalFields: EsputnikEndpoint<'getAdditionalFields'>;
	getOrganisationBalanceHistory: EsputnikEndpoint<'getOrganisationBalanceHistory'>;
	ordersBulkInsert: EsputnikEndpoint<'ordersBulkInsert'>;
	registerEvent: EsputnikEndpoint<'registerEvent'>;
	sendHistoryEvents: EsputnikEndpoint<'sendHistoryEvents'>;
	removeHistoryEvents: EsputnikEndpoint<'removeHistoryEvents'>;
	searchEmails: EsputnikEndpoint<'searchEmails'>;
	getEmailMessageViewLink: EsputnikEndpoint<'getEmailMessageViewLink'>;
	sendPreparedMessage: EsputnikEndpoint<'sendPreparedMessage'>;
	addEmail: EsputnikEndpoint<'addEmail'>;
	getEmail: EsputnikEndpoint<'getEmail'>;
	updateMessage: EsputnikEndpoint<'updateMessage'>;
	deleteEmail: EsputnikEndpoint<'deleteEmail'>;
	updateTranslatedMessage: EsputnikEndpoint<'updateTranslatedMessage'>;
	deleteTranslatedEmail: EsputnikEndpoint<'deleteTranslatedEmail'>;
	sendEmail: EsputnikEndpoint<'sendEmail'>;
	searchMobilePushMessages: EsputnikEndpoint<'searchMobilePushMessages'>;
	addMobilePushMessage: EsputnikEndpoint<'addMobilePushMessage'>;
	getMobilePushMessage: EsputnikEndpoint<'getMobilePushMessage'>;
	updateBaseMobilePushMessage: EsputnikEndpoint<'updateBaseMobilePushMessage'>;
	deleteMobilePushMessage: EsputnikEndpoint<'deleteMobilePushMessage'>;
	updateTranslatedMobilePushMessage: EsputnikEndpoint<'updateTranslatedMobilePushMessage'>;
	deleteTranslatedMobilePushMessage: EsputnikEndpoint<'deleteTranslatedMobilePushMessage'>;
	searchViberMessages: EsputnikEndpoint<'searchViberMessages'>;
	addViberMessage: EsputnikEndpoint<'addViberMessage'>;
	getViberMessage: EsputnikEndpoint<'getViberMessage'>;
	updateBaseViberMessage: EsputnikEndpoint<'updateBaseViberMessage'>;
	deleteViberMessage: EsputnikEndpoint<'deleteViberMessage'>;
	searchAppInboxMessages: EsputnikEndpoint<'searchAppInboxMessages'>;
	addAppInboxMessage: EsputnikEndpoint<'addAppInboxMessage'>;
	getAppInboxMessage: EsputnikEndpoint<'getAppInboxMessage'>;
	updateBaseAppInboxMessage: EsputnikEndpoint<'updateBaseAppInboxMessage'>;
	deleteAppInboxMessage: EsputnikEndpoint<'deleteAppInboxMessage'>;
	searchTelegramBotMessages: EsputnikEndpoint<'searchTelegramBotMessages'>;
	addTelegramBotMessage: EsputnikEndpoint<'addTelegramBotMessage'>;
	getTelegramBotMessage: EsputnikEndpoint<'getTelegramBotMessage'>;
	updateBaseTelegramBotMessage: EsputnikEndpoint<'updateBaseTelegramBotMessage'>;
	deleteTelegramBotMessage: EsputnikEndpoint<'deleteTelegramBotMessage'>;
	searchSmsMessages: EsputnikEndpoint<'searchSmsMessages'>;
	getSms: EsputnikEndpoint<'getSms'>;
	updateBaseSmsMessage: EsputnikEndpoint<'updateBaseSmsMessage'>;
	deleteSmsMessage: EsputnikEndpoint<'deleteSmsMessage'>;
	getBroadcasts: EsputnikEndpoint<'getBroadcasts'>;
	createBroadcast: EsputnikEndpoint<'createBroadcast'>;
	getBroadcast: EsputnikEndpoint<'getBroadcast'>;
	getSmsInterfaces: EsputnikEndpoint<'getSmsInterfaces'>;
	getEmailInterfaces: EsputnikEndpoint<'getEmailInterfaces'>;
	updateTranslatedViberMessage: EsputnikEndpoint<'updateTranslatedViberMessage'>;
	deleteTranslatedViberMessage: EsputnikEndpoint<'deleteTranslatedViberMessage'>;
	updateTranslatedAppInboxMessage: EsputnikEndpoint<'updateTranslatedAppInboxMessage'>;
	deleteTranslatedAppInboxMessage: EsputnikEndpoint<'deleteTranslatedAppInboxMessage'>;
	updateTranslatedTelegramMessage: EsputnikEndpoint<'updateTranslatedTelegramMessage'>;
	deleteTranslatedTelegramMessage: EsputnikEndpoint<'deleteTranslatedTelegramMessage'>;
	addSmsMessage: EsputnikEndpoint<'addSmsMessage'>;
	sendSms: EsputnikEndpoint<'sendSms'>;
	cancelBroadcast: EsputnikEndpoint<'cancelBroadcast'>;
	contactActivity: EsputnikEndpoint<'contactActivity'>;
	contactMessages: EsputnikEndpoint<'contactMessages'>;
	getTokenActivated: EsputnikEndpoint<'getTokenActivated'>;
	changeTokenActivated: EsputnikEndpoint<'changeTokenActivated'>;
	getDomains: EsputnikEndpoint<'getDomains'>;
	createDomain: EsputnikEndpoint<'createDomain'>;
	getScript: EsputnikEndpoint<'getScript'>;
	getWebPushDomains: EsputnikEndpoint<'getWebPushDomains'>;
	addWebPushDomain: EsputnikEndpoint<'addWebPushDomain'>;
	deleteWebPushDomain: EsputnikEndpoint<'deleteWebPushDomain'>;
	getWebPushScript: EsputnikEndpoint<'getWebPushScript'>;
	getProductFeedsConfiguration: EsputnikEndpoint<'getProductFeedsConfiguration'>;
	configureProductFeeds: EsputnikEndpoint<'configureProductFeeds'>;
	addAppTokens: EsputnikEndpoint<'addAppTokens'>;
	muteAppToken: EsputnikEndpoint<'muteAppToken'>;
	unmuteAppToken: EsputnikEndpoint<'unmuteAppToken'>;
	getSubscriptionCategories: EsputnikEndpoint<'getSubscriptionCategories'>;
	getPromocodes: EsputnikEndpoint<'getPromocodes'>;
	getPromocodesCount: EsputnikEndpoint<'getPromocodesCount'>;
	insertPromocodes: EsputnikEndpoint<'insertPromocodes'>;
	getPreprocessorFileStatus: EsputnikEndpoint<'getPreprocessorFileStatus'>;
	updatePreprocessorFile: EsputnikEndpoint<'updatePreprocessorFile'>;
	uploadPreprocessorFile: EsputnikEndpoint<'uploadPreprocessorFile'>;
	generateApiToken: EsputnikEndpoint<'generateApiToken'>;
	getInteractionStatus: EsputnikEndpoint<'getInteractionStatus'>;
	sendViber: EsputnikEndpoint<'sendViber'>;
	sendAppInbox: EsputnikEndpoint<'sendAppInbox'>;
	sendTelegramBot: EsputnikEndpoint<'sendTelegramBot'>;
	updateTranslatedSmsMessage: EsputnikEndpoint<'updateTranslatedSmsMessage'>;
	deleteTranslatedSmsMessage: EsputnikEndpoint<'deleteTranslatedSmsMessage'>;
};

const esputnikEndpointsNested = {
	account: accountEndpoints,
	contacts: contactEndpoints,
	accountExtended: accountExtendedEndpoints,
	orders: orderEndpoints,
	events: eventEndpoints,
	emails: emailEndpoints,
	mobilePush: mobilePushEndpoints,
	viber: {
		searchViberMessages: viberEndpoints.search,
		addViberMessage: viberEndpoints.add,
		getViberMessage: viberEndpoints.get,
		updateBaseViberMessage: viberEndpoints.update,
		deleteViberMessage: viberEndpoints.delete,
	},
	appInbox: {
		searchAppInboxMessages: appInboxEndpoints.search,
		addAppInboxMessage: appInboxEndpoints.add,
		getAppInboxMessage: appInboxEndpoints.get,
		updateBaseAppInboxMessage: appInboxEndpoints.update,
		deleteAppInboxMessage: appInboxEndpoints.delete,
	},
	telegramBot: {
		searchTelegramBotMessages: telegramBotEndpoints.search,
		addTelegramBotMessage: telegramBotEndpoints.add,
		getTelegramBotMessage: telegramBotEndpoints.get,
		updateBaseTelegramBotMessage: telegramBotEndpoints.update,
		deleteTelegramBotMessage: telegramBotEndpoints.delete,
	},
	sms: {
		searchSmsMessages: smsEndpoints.search,
		getSms: smsEndpoints.get,
		updateBaseSmsMessage: smsEndpoints.update,
		deleteSmsMessage: smsEndpoints.delete,
	},
	broadcasts: broadcastEndpoints,
	interfaces: interfaceEndpoints,
	batchTwoRemainder: batchTwoRemainderEndpoints,
	finalBatch: finalBatchEndpoints,
} as const;

export const esputnikEndpointSchemas = {
	'account.getAccountInfo': {
		input: EsputnikEndpointInputSchemas.getAccountInfo,
		output: EsputnikEndpointOutputSchemas.getAccountInfo,
	},
	'account.getBalance': {
		input: EsputnikEndpointInputSchemas.getBalance,
		output: EsputnikEndpointOutputSchemas.getBalance,
	},
	'contacts.addContact': {
		input: EsputnikEndpointInputSchemas.addContact,
		output: EsputnikEndpointOutputSchemas.addContact,
	},
	'contacts.getContact': {
		input: EsputnikEndpointInputSchemas.getContact,
		output: EsputnikEndpointOutputSchemas.getContact,
	},
	'contacts.updateContact': {
		input: EsputnikEndpointInputSchemas.updateContact,
		output: EsputnikEndpointOutputSchemas.updateContact,
	},
	'contacts.searchContacts': {
		input: EsputnikEndpointInputSchemas.searchContacts,
		output: EsputnikEndpointOutputSchemas.searchContacts,
	},
	'contacts.subscribeContact': {
		input: EsputnikEndpointInputSchemas.subscribeContact,
		output: EsputnikEndpointOutputSchemas.subscribeContact,
	},
	'contacts.contactsBulkUpdate': {
		input: EsputnikEndpointInputSchemas.contactsBulkUpdate,
		output: EsputnikEndpointOutputSchemas.contactsBulkUpdate,
	},
	'contacts.fileContactsBulkUpdate': {
		input: EsputnikEndpointInputSchemas.fileContactsBulkUpdate,
		output: EsputnikEndpointOutputSchemas.fileContactsBulkUpdate,
	},
	'contacts.getImportSessionStatus': {
		input: EsputnikEndpointInputSchemas.getImportSessionStatus,
		output: EsputnikEndpointOutputSchemas.getImportSessionStatus,
	},
	'contacts.getContactEmails': {
		input: EsputnikEndpointInputSchemas.getContactEmails,
		output: EsputnikEndpointOutputSchemas.getContactEmails,
	},
	'contacts.addToUnsubscribed': {
		input: EsputnikEndpointInputSchemas.addToUnsubscribed,
		output: EsputnikEndpointOutputSchemas.addToUnsubscribed,
	},
	'contacts.deleteFromUnsubscribed': {
		input: EsputnikEndpointInputSchemas.deleteFromUnsubscribed,
		output: EsputnikEndpointOutputSchemas.deleteFromUnsubscribed,
	},
	'contacts.getGroupContacts': {
		input: EsputnikEndpointInputSchemas.getGroupContacts,
		output: EsputnikEndpointOutputSchemas.getGroupContacts,
	},
	'contacts.detachContactsFromGroup': {
		input: EsputnikEndpointInputSchemas.detachContactsFromGroup,
		output: EsputnikEndpointOutputSchemas.detachContactsFromGroup,
	},
	'contacts.attachContactsToGroup': {
		input: EsputnikEndpointInputSchemas.attachContactsToGroup,
		output: EsputnikEndpointOutputSchemas.attachContactsToGroup,
	},
	'contacts.searchGroups': {
		input: EsputnikEndpointInputSchemas.searchGroups,
		output: EsputnikEndpointOutputSchemas.searchGroups,
	},
	'contacts.searchWorkflows': {
		input: EsputnikEndpointInputSchemas.searchWorkflows,
		output: EsputnikEndpointOutputSchemas.searchWorkflows,
	},
	'contacts.getContactIdByToken': {
		input: EsputnikEndpointInputSchemas.getContactIdByToken,
		output: EsputnikEndpointOutputSchemas.getContactIdByToken,
	},
	'contacts.getContactSubscriptionCategories': {
		input: EsputnikEndpointInputSchemas.getContactSubscriptionCategories,
		output: EsputnikEndpointOutputSchemas.getContactSubscriptionCategories,
	},
	'contacts.changeContactSubscriptionCategories': {
		input: EsputnikEndpointInputSchemas.changeContactSubscriptionCategories,
		output: EsputnikEndpointOutputSchemas.changeContactSubscriptionCategories,
	},
	'contacts.deleteContactById': {
		input: EsputnikEndpointInputSchemas.deleteContactById,
		output: EsputnikEndpointOutputSchemas.deleteContactById,
	},
	'contacts.deleteContactByExternalCustomerId': {
		input: EsputnikEndpointInputSchemas.deleteContactByExternalCustomerId,
		output: EsputnikEndpointOutputSchemas.deleteContactByExternalCustomerId,
	},
	'contacts.contactRecoms': {
		input: EsputnikEndpointInputSchemas.contactRecoms,
		output: EsputnikEndpointOutputSchemas.contactRecoms,
	},
	'contacts.getAdditionalFields': {
		input: EsputnikEndpointInputSchemas.getAdditionalFields,
		output: EsputnikEndpointOutputSchemas.getAdditionalFields,
	},
	'accountExtended.getOrganisationBalanceHistory': {
		input: EsputnikEndpointInputSchemas.getOrganisationBalanceHistory,
		output: EsputnikEndpointOutputSchemas.getOrganisationBalanceHistory,
	},
	'orders.ordersBulkInsert': {
		input: EsputnikEndpointInputSchemas.ordersBulkInsert,
		output: EsputnikEndpointOutputSchemas.ordersBulkInsert,
	},
	'events.registerEvent': {
		input: EsputnikEndpointInputSchemas.registerEvent,
		output: EsputnikEndpointOutputSchemas.registerEvent,
	},
	'events.sendHistoryEvents': {
		input: EsputnikEndpointInputSchemas.sendHistoryEvents,
		output: EsputnikEndpointOutputSchemas.sendHistoryEvents,
	},
	'events.removeHistoryEvents': {
		input: EsputnikEndpointInputSchemas.removeHistoryEvents,
		output: EsputnikEndpointOutputSchemas.removeHistoryEvents,
	},
	'emails.searchEmails': {
		input: EsputnikEndpointInputSchemas.searchEmails,
		output: EsputnikEndpointOutputSchemas.searchEmails,
	},
	'emails.getEmailMessageViewLink': {
		input: EsputnikEndpointInputSchemas.getEmailMessageViewLink,
		output: EsputnikEndpointOutputSchemas.getEmailMessageViewLink,
	},
	'emails.sendPreparedMessage': {
		input: EsputnikEndpointInputSchemas.sendPreparedMessage,
		output: EsputnikEndpointOutputSchemas.sendPreparedMessage,
	},
	'emails.addEmail': {
		input: EsputnikEndpointInputSchemas.addEmail,
		output: EsputnikEndpointOutputSchemas.addEmail,
	},
	'emails.getEmail': {
		input: EsputnikEndpointInputSchemas.getEmail,
		output: EsputnikEndpointOutputSchemas.getEmail,
	},
	'emails.updateMessage': {
		input: EsputnikEndpointInputSchemas.updateMessage,
		output: EsputnikEndpointOutputSchemas.updateMessage,
	},
	'emails.deleteEmail': {
		input: EsputnikEndpointInputSchemas.deleteEmail,
		output: EsputnikEndpointOutputSchemas.deleteEmail,
	},
	'emails.updateTranslatedMessage': {
		input: EsputnikEndpointInputSchemas.updateTranslatedMessage,
		output: EsputnikEndpointOutputSchemas.updateTranslatedMessage,
	},
	'emails.deleteTranslatedEmail': {
		input: EsputnikEndpointInputSchemas.deleteTranslatedEmail,
		output: EsputnikEndpointOutputSchemas.deleteTranslatedEmail,
	},
	'emails.sendEmail': {
		input: EsputnikEndpointInputSchemas.sendEmail,
		output: EsputnikEndpointOutputSchemas.sendEmail,
	},
	'mobilePush.searchMobilePushMessages': {
		input: EsputnikEndpointInputSchemas.searchMobilePushMessages,
		output: EsputnikEndpointOutputSchemas.searchMobilePushMessages,
	},
	'mobilePush.addMobilePushMessage': {
		input: EsputnikEndpointInputSchemas.addMobilePushMessage,
		output: EsputnikEndpointOutputSchemas.addMobilePushMessage,
	},
	'mobilePush.getMobilePushMessage': {
		input: EsputnikEndpointInputSchemas.getMobilePushMessage,
		output: EsputnikEndpointOutputSchemas.getMobilePushMessage,
	},
	'mobilePush.updateBaseMobilePushMessage': {
		input: EsputnikEndpointInputSchemas.updateBaseMobilePushMessage,
		output: EsputnikEndpointOutputSchemas.updateBaseMobilePushMessage,
	},
	'mobilePush.deleteMobilePushMessage': {
		input: EsputnikEndpointInputSchemas.deleteMobilePushMessage,
		output: EsputnikEndpointOutputSchemas.deleteMobilePushMessage,
	},
	'mobilePush.updateTranslatedMobilePushMessage': {
		input: EsputnikEndpointInputSchemas.updateTranslatedMobilePushMessage,
		output: EsputnikEndpointOutputSchemas.updateTranslatedMobilePushMessage,
	},
	'mobilePush.deleteTranslatedMobilePushMessage': {
		input: EsputnikEndpointInputSchemas.deleteTranslatedMobilePushMessage,
		output: EsputnikEndpointOutputSchemas.deleteTranslatedMobilePushMessage,
	},
	'viber.searchViberMessages': {
		input: EsputnikEndpointInputSchemas.searchViberMessages,
		output: EsputnikEndpointOutputSchemas.searchViberMessages,
	},
	'viber.addViberMessage': {
		input: EsputnikEndpointInputSchemas.addViberMessage,
		output: EsputnikEndpointOutputSchemas.addViberMessage,
	},
	'viber.getViberMessage': {
		input: EsputnikEndpointInputSchemas.getViberMessage,
		output: EsputnikEndpointOutputSchemas.getViberMessage,
	},
	'viber.updateBaseViberMessage': {
		input: EsputnikEndpointInputSchemas.updateBaseViberMessage,
		output: EsputnikEndpointOutputSchemas.updateBaseViberMessage,
	},
	'viber.deleteViberMessage': {
		input: EsputnikEndpointInputSchemas.deleteViberMessage,
		output: EsputnikEndpointOutputSchemas.deleteViberMessage,
	},
	'appInbox.searchAppInboxMessages': {
		input: EsputnikEndpointInputSchemas.searchAppInboxMessages,
		output: EsputnikEndpointOutputSchemas.searchAppInboxMessages,
	},
	'appInbox.addAppInboxMessage': {
		input: EsputnikEndpointInputSchemas.addAppInboxMessage,
		output: EsputnikEndpointOutputSchemas.addAppInboxMessage,
	},
	'appInbox.getAppInboxMessage': {
		input: EsputnikEndpointInputSchemas.getAppInboxMessage,
		output: EsputnikEndpointOutputSchemas.getAppInboxMessage,
	},
	'appInbox.updateBaseAppInboxMessage': {
		input: EsputnikEndpointInputSchemas.updateBaseAppInboxMessage,
		output: EsputnikEndpointOutputSchemas.updateBaseAppInboxMessage,
	},
	'appInbox.deleteAppInboxMessage': {
		input: EsputnikEndpointInputSchemas.deleteAppInboxMessage,
		output: EsputnikEndpointOutputSchemas.deleteAppInboxMessage,
	},
	'telegramBot.searchTelegramBotMessages': {
		input: EsputnikEndpointInputSchemas.searchTelegramBotMessages,
		output: EsputnikEndpointOutputSchemas.searchTelegramBotMessages,
	},
	'telegramBot.addTelegramBotMessage': {
		input: EsputnikEndpointInputSchemas.addTelegramBotMessage,
		output: EsputnikEndpointOutputSchemas.addTelegramBotMessage,
	},
	'telegramBot.getTelegramBotMessage': {
		input: EsputnikEndpointInputSchemas.getTelegramBotMessage,
		output: EsputnikEndpointOutputSchemas.getTelegramBotMessage,
	},
	'telegramBot.updateBaseTelegramBotMessage': {
		input: EsputnikEndpointInputSchemas.updateBaseTelegramBotMessage,
		output: EsputnikEndpointOutputSchemas.updateBaseTelegramBotMessage,
	},
	'telegramBot.deleteTelegramBotMessage': {
		input: EsputnikEndpointInputSchemas.deleteTelegramBotMessage,
		output: EsputnikEndpointOutputSchemas.deleteTelegramBotMessage,
	},
	'sms.searchSmsMessages': {
		input: EsputnikEndpointInputSchemas.searchSmsMessages,
		output: EsputnikEndpointOutputSchemas.searchSmsMessages,
	},
	'sms.getSms': {
		input: EsputnikEndpointInputSchemas.getSms,
		output: EsputnikEndpointOutputSchemas.getSms,
	},
	'sms.updateBaseSmsMessage': {
		input: EsputnikEndpointInputSchemas.updateBaseSmsMessage,
		output: EsputnikEndpointOutputSchemas.updateBaseSmsMessage,
	},
	'sms.deleteSmsMessage': {
		input: EsputnikEndpointInputSchemas.deleteSmsMessage,
		output: EsputnikEndpointOutputSchemas.deleteSmsMessage,
	},
	'broadcasts.getBroadcasts': {
		input: EsputnikEndpointInputSchemas.getBroadcasts,
		output: EsputnikEndpointOutputSchemas.getBroadcasts,
	},
	'broadcasts.createBroadcast': {
		input: EsputnikEndpointInputSchemas.createBroadcast,
		output: EsputnikEndpointOutputSchemas.createBroadcast,
	},
	'broadcasts.getBroadcast': {
		input: EsputnikEndpointInputSchemas.getBroadcast,
		output: EsputnikEndpointOutputSchemas.getBroadcast,
	},
	'interfaces.getSmsInterfaces': {
		input: EsputnikEndpointInputSchemas.getSmsInterfaces,
		output: EsputnikEndpointOutputSchemas.getSmsInterfaces,
	},
	'interfaces.getEmailInterfaces': {
		input: EsputnikEndpointInputSchemas.getEmailInterfaces,
		output: EsputnikEndpointOutputSchemas.getEmailInterfaces,
	},
	'batchTwoRemainder.updateTranslatedViberMessage': {
		input: EsputnikEndpointInputSchemas.updateTranslatedViberMessage,
		output: EsputnikEndpointOutputSchemas.updateTranslatedViberMessage,
	},
	'batchTwoRemainder.deleteTranslatedViberMessage': {
		input: EsputnikEndpointInputSchemas.deleteTranslatedViberMessage,
		output: EsputnikEndpointOutputSchemas.deleteTranslatedViberMessage,
	},
	'batchTwoRemainder.updateTranslatedAppInboxMessage': {
		input: EsputnikEndpointInputSchemas.updateTranslatedAppInboxMessage,
		output: EsputnikEndpointOutputSchemas.updateTranslatedAppInboxMessage,
	},
	'batchTwoRemainder.deleteTranslatedAppInboxMessage': {
		input: EsputnikEndpointInputSchemas.deleteTranslatedAppInboxMessage,
		output: EsputnikEndpointOutputSchemas.deleteTranslatedAppInboxMessage,
	},
	'batchTwoRemainder.updateTranslatedTelegramMessage': {
		input: EsputnikEndpointInputSchemas.updateTranslatedTelegramMessage,
		output: EsputnikEndpointOutputSchemas.updateTranslatedTelegramMessage,
	},
	'batchTwoRemainder.deleteTranslatedTelegramMessage': {
		input: EsputnikEndpointInputSchemas.deleteTranslatedTelegramMessage,
		output: EsputnikEndpointOutputSchemas.deleteTranslatedTelegramMessage,
	},
	'batchTwoRemainder.addSmsMessage': {
		input: EsputnikEndpointInputSchemas.addSmsMessage,
		output: EsputnikEndpointOutputSchemas.addSmsMessage,
	},
	'batchTwoRemainder.sendSms': {
		input: EsputnikEndpointInputSchemas.sendSms,
		output: EsputnikEndpointOutputSchemas.sendSms,
	},
	'batchTwoRemainder.cancelBroadcast': {
		input: EsputnikEndpointInputSchemas.cancelBroadcast,
		output: EsputnikEndpointOutputSchemas.cancelBroadcast,
	},
	'finalBatch.contactActivity': {
		input: EsputnikEndpointInputSchemas.contactActivity,
		output: EsputnikEndpointOutputSchemas.contactActivity,
	},
	'finalBatch.contactMessages': {
		input: EsputnikEndpointInputSchemas.contactMessages,
		output: EsputnikEndpointOutputSchemas.contactMessages,
	},
	'finalBatch.getTokenActivated': {
		input: EsputnikEndpointInputSchemas.getTokenActivated,
		output: EsputnikEndpointOutputSchemas.getTokenActivated,
	},
	'finalBatch.changeTokenActivated': {
		input: EsputnikEndpointInputSchemas.changeTokenActivated,
		output: EsputnikEndpointOutputSchemas.changeTokenActivated,
	},
	'finalBatch.getDomains': {
		input: EsputnikEndpointInputSchemas.getDomains,
		output: EsputnikEndpointOutputSchemas.getDomains,
	},
	'finalBatch.createDomain': {
		input: EsputnikEndpointInputSchemas.createDomain,
		output: EsputnikEndpointOutputSchemas.createDomain,
	},
	'finalBatch.getScript': {
		input: EsputnikEndpointInputSchemas.getScript,
		output: EsputnikEndpointOutputSchemas.getScript,
	},
	'finalBatch.getWebPushDomains': {
		input: EsputnikEndpointInputSchemas.getWebPushDomains,
		output: EsputnikEndpointOutputSchemas.getWebPushDomains,
	},
	'finalBatch.addWebPushDomain': {
		input: EsputnikEndpointInputSchemas.addWebPushDomain,
		output: EsputnikEndpointOutputSchemas.addWebPushDomain,
	},
	'finalBatch.deleteWebPushDomain': {
		input: EsputnikEndpointInputSchemas.deleteWebPushDomain,
		output: EsputnikEndpointOutputSchemas.deleteWebPushDomain,
	},
	'finalBatch.getWebPushScript': {
		input: EsputnikEndpointInputSchemas.getWebPushScript,
		output: EsputnikEndpointOutputSchemas.getWebPushScript,
	},
	'finalBatch.getProductFeedsConfiguration': {
		input: EsputnikEndpointInputSchemas.getProductFeedsConfiguration,
		output: EsputnikEndpointOutputSchemas.getProductFeedsConfiguration,
	},
	'finalBatch.configureProductFeeds': {
		input: EsputnikEndpointInputSchemas.configureProductFeeds,
		output: EsputnikEndpointOutputSchemas.configureProductFeeds,
	},
	'finalBatch.addAppTokens': {
		input: EsputnikEndpointInputSchemas.addAppTokens,
		output: EsputnikEndpointOutputSchemas.addAppTokens,
	},
	'finalBatch.muteAppToken': {
		input: EsputnikEndpointInputSchemas.muteAppToken,
		output: EsputnikEndpointOutputSchemas.muteAppToken,
	},
	'finalBatch.unmuteAppToken': {
		input: EsputnikEndpointInputSchemas.unmuteAppToken,
		output: EsputnikEndpointOutputSchemas.unmuteAppToken,
	},
	'finalBatch.getSubscriptionCategories': {
		input: EsputnikEndpointInputSchemas.getSubscriptionCategories,
		output: EsputnikEndpointOutputSchemas.getSubscriptionCategories,
	},
	'finalBatch.getPromocodes': {
		input: EsputnikEndpointInputSchemas.getPromocodes,
		output: EsputnikEndpointOutputSchemas.getPromocodes,
	},
	'finalBatch.getPromocodesCount': {
		input: EsputnikEndpointInputSchemas.getPromocodesCount,
		output: EsputnikEndpointOutputSchemas.getPromocodesCount,
	},
	'finalBatch.insertPromocodes': {
		input: EsputnikEndpointInputSchemas.insertPromocodes,
		output: EsputnikEndpointOutputSchemas.insertPromocodes,
	},
	'finalBatch.getPreprocessorFileStatus': {
		input: EsputnikEndpointInputSchemas.getPreprocessorFileStatus,
		output: EsputnikEndpointOutputSchemas.getPreprocessorFileStatus,
	},
	'finalBatch.updatePreprocessorFile': {
		input: EsputnikEndpointInputSchemas.updatePreprocessorFile,
		output: EsputnikEndpointOutputSchemas.updatePreprocessorFile,
	},
	'finalBatch.uploadPreprocessorFile': {
		input: EsputnikEndpointInputSchemas.uploadPreprocessorFile,
		output: EsputnikEndpointOutputSchemas.uploadPreprocessorFile,
	},
	'finalBatch.generateApiToken': {
		input: EsputnikEndpointInputSchemas.generateApiToken,
		output: EsputnikEndpointOutputSchemas.generateApiToken,
	},
	'finalBatch.getInteractionStatus': {
		input: EsputnikEndpointInputSchemas.getInteractionStatus,
		output: EsputnikEndpointOutputSchemas.getInteractionStatus,
	},
	'finalBatch.sendViber': {
		input: EsputnikEndpointInputSchemas.sendViber,
		output: EsputnikEndpointOutputSchemas.sendViber,
	},
	'finalBatch.sendAppInbox': {
		input: EsputnikEndpointInputSchemas.sendAppInbox,
		output: EsputnikEndpointOutputSchemas.sendAppInbox,
	},
	'finalBatch.sendTelegramBot': {
		input: EsputnikEndpointInputSchemas.sendTelegramBot,
		output: EsputnikEndpointOutputSchemas.sendTelegramBot,
	},
	'finalBatch.updateTranslatedSmsMessage': {
		input: EsputnikEndpointInputSchemas.updateTranslatedSmsMessage,
		output: EsputnikEndpointOutputSchemas.updateTranslatedSmsMessage,
	},
	'finalBatch.deleteTranslatedSmsMessage': {
		input: EsputnikEndpointInputSchemas.deleteTranslatedSmsMessage,
		output: EsputnikEndpointOutputSchemas.deleteTranslatedSmsMessage,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof esputnikEndpointsNested
>;

const esputnikEndpointMeta = {
	'account.getAccountInfo': {
		riskLevel: 'read',
		description: 'Get eSputnik account information',
	},
	'account.getBalance': {
		riskLevel: 'read',
		description: 'Get the eSputnik organization balance',
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
	'contacts.searchContacts': {
		riskLevel: 'read',
		description: 'Search eSputnik contacts',
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
		description: 'Import eSputnik contacts from an external file',
	},
	'contacts.getImportSessionStatus': {
		riskLevel: 'read',
		description: 'Get eSputnik contact import status',
	},
	'contacts.getContactEmails': {
		riskLevel: 'read',
		description: 'Get email addresses for eSputnik contacts',
	},
	'contacts.addToUnsubscribed': {
		riskLevel: 'write',
		description: 'Add emails to the eSputnik unsubscribe list',
	},
	'contacts.deleteFromUnsubscribed': {
		riskLevel: 'write',
		description: 'Remove emails from the eSputnik unsubscribe list',
	},
	'contacts.getGroupContacts': {
		riskLevel: 'read',
		description: 'Get contacts from an eSputnik segment',
	},
	'contacts.detachContactsFromGroup': {
		riskLevel: 'destructive',
		description: 'Remove contacts from an eSputnik static segment',
	},
	'contacts.attachContactsToGroup': {
		riskLevel: 'write',
		description: 'Attach contacts to an eSputnik static segment',
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
		description: 'Get an eSputnik contact subscription categories',
	},
	'contacts.changeContactSubscriptionCategories': {
		riskLevel: 'write',
		description: 'Update eSputnik contact subscription categories',
	},
	'contacts.deleteContactById': {
		riskLevel: 'destructive',
		description: 'Delete an eSputnik contact by ID',
	},
	'contacts.deleteContactByExternalCustomerId': {
		riskLevel: 'destructive',
		description: 'Delete an eSputnik contact by external ID',
	},
	'contacts.contactRecoms': {
		riskLevel: 'read',
		description: 'Get eSputnik contact product recommendations',
	},
	'contacts.getAdditionalFields': {
		riskLevel: 'read',
		description: 'Get eSputnik contact additional fields',
	},
	'accountExtended.getOrganisationBalanceHistory': {
		riskLevel: 'read',
		description: 'Get eSputnik organization billing history',
	},
	'orders.ordersBulkInsert': {
		riskLevel: 'write',
		description: 'Add or update eSputnik orders',
	},
	'events.registerEvent': {
		riskLevel: 'write',
		description: 'Generate a current eSputnik event',
	},
	'events.sendHistoryEvents': {
		riskLevel: 'write',
		description: 'Generate historical eSputnik events',
	},
	'events.removeHistoryEvents': {
		riskLevel: 'destructive',
		description: 'Delete eSputnik events in a period',
	},
	'emails.searchEmails': {
		riskLevel: 'read',
		description: 'Search eSputnik email messages',
	},
	'emails.getEmailMessageViewLink': {
		riskLevel: 'read',
		description: 'Get an eSputnik email message view link',
	},
	'emails.sendPreparedMessage': {
		riskLevel: 'write',
		description: 'Send a prepared eSputnik message',
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
		description: 'Update a translated eSputnik email message',
	},
	'emails.deleteTranslatedEmail': {
		riskLevel: 'destructive',
		description: 'Delete a translated eSputnik email message',
	},
	'emails.sendEmail': {
		riskLevel: 'write',
		description: 'Send an eSputnik email message',
	},
	'mobilePush.searchMobilePushMessages': {
		riskLevel: 'read',
		description: 'Search eSputnik mobile push messages',
	},
	'mobilePush.addMobilePushMessage': {
		riskLevel: 'write',
		description: 'Create an eSputnik mobile push message',
	},
	'mobilePush.getMobilePushMessage': {
		riskLevel: 'read',
		description: 'Get an eSputnik mobile push message',
	},
	'mobilePush.updateBaseMobilePushMessage': {
		riskLevel: 'write',
		description: 'Update an eSputnik mobile push message',
	},
	'mobilePush.deleteMobilePushMessage': {
		riskLevel: 'destructive',
		description: 'Delete an eSputnik mobile push message',
	},
	'mobilePush.updateTranslatedMobilePushMessage': {
		riskLevel: 'write',
		description: 'Update a translated eSputnik mobile push message',
	},
	'mobilePush.deleteTranslatedMobilePushMessage': {
		riskLevel: 'destructive',
		description: 'Delete a translated eSputnik mobile push message',
	},
	'viber.searchViberMessages': {
		riskLevel: 'read',
		description: 'Search eSputnik Viber messages',
	},
	'viber.addViberMessage': {
		riskLevel: 'write',
		description: 'Create an eSputnik Viber message',
	},
	'viber.getViberMessage': {
		riskLevel: 'read',
		description: 'Get an eSputnik Viber message',
	},
	'viber.updateBaseViberMessage': {
		riskLevel: 'write',
		description: 'Update an eSputnik Viber message',
	},
	'viber.deleteViberMessage': {
		riskLevel: 'destructive',
		description: 'Delete an eSputnik Viber message',
	},
	'appInbox.searchAppInboxMessages': {
		riskLevel: 'read',
		description: 'Search eSputnik App Inbox messages',
	},
	'appInbox.addAppInboxMessage': {
		riskLevel: 'write',
		description: 'Create an eSputnik App Inbox message',
	},
	'appInbox.getAppInboxMessage': {
		riskLevel: 'read',
		description: 'Get an eSputnik App Inbox message',
	},
	'appInbox.updateBaseAppInboxMessage': {
		riskLevel: 'write',
		description: 'Update an eSputnik App Inbox message',
	},
	'appInbox.deleteAppInboxMessage': {
		riskLevel: 'destructive',
		description: 'Delete an eSputnik App Inbox message',
	},
	'telegramBot.searchTelegramBotMessages': {
		riskLevel: 'read',
		description: 'Search eSputnik Telegram bot messages',
	},
	'telegramBot.addTelegramBotMessage': {
		riskLevel: 'write',
		description: 'Create an eSputnik Telegram bot message',
	},
	'telegramBot.getTelegramBotMessage': {
		riskLevel: 'read',
		description: 'Get an eSputnik Telegram bot message',
	},
	'telegramBot.updateBaseTelegramBotMessage': {
		riskLevel: 'write',
		description: 'Update an eSputnik Telegram bot message',
	},
	'telegramBot.deleteTelegramBotMessage': {
		riskLevel: 'destructive',
		description: 'Delete an eSputnik Telegram bot message',
	},
	'sms.searchSmsMessages': {
		riskLevel: 'read',
		description: 'Search eSputnik SMS messages',
	},
	'sms.getSms': {
		riskLevel: 'read',
		description: 'Get an eSputnik SMS message',
	},
	'sms.updateBaseSmsMessage': {
		riskLevel: 'write',
		description: 'Update an eSputnik SMS message',
	},
	'sms.deleteSmsMessage': {
		riskLevel: 'destructive',
		description: 'Delete an eSputnik SMS message',
	},
	'broadcasts.getBroadcasts': {
		riskLevel: 'read',
		description: 'List eSputnik broadcasts',
	},
	'broadcasts.createBroadcast': {
		riskLevel: 'write',
		description: 'Create an eSputnik broadcast',
	},
	'broadcasts.getBroadcast': {
		riskLevel: 'read',
		description: 'Get an eSputnik broadcast',
	},
	'interfaces.getSmsInterfaces': {
		riskLevel: 'read',
		description: 'List eSputnik SMS interfaces',
	},
	'interfaces.getEmailInterfaces': {
		riskLevel: 'read',
		description: 'List eSputnik email interfaces',
	},
	'batchTwoRemainder.updateTranslatedViberMessage': {
		riskLevel: 'write',
		description: 'Update a translated eSputnik Viber message',
	},
	'batchTwoRemainder.deleteTranslatedViberMessage': {
		riskLevel: 'destructive',
		description: 'Delete a translated eSputnik Viber message',
	},
	'batchTwoRemainder.updateTranslatedAppInboxMessage': {
		riskLevel: 'write',
		description: 'Update a translated eSputnik App Inbox message',
	},
	'batchTwoRemainder.deleteTranslatedAppInboxMessage': {
		riskLevel: 'destructive',
		description: 'Delete a translated eSputnik App Inbox message',
	},
	'batchTwoRemainder.updateTranslatedTelegramMessage': {
		riskLevel: 'write',
		description: 'Update a translated eSputnik Telegram bot message',
	},
	'batchTwoRemainder.deleteTranslatedTelegramMessage': {
		riskLevel: 'destructive',
		description: 'Delete a translated eSputnik Telegram bot message',
	},
	'batchTwoRemainder.addSmsMessage': {
		riskLevel: 'write',
		description: 'Create an eSputnik SMS message',
	},
	'batchTwoRemainder.sendSms': {
		riskLevel: 'write',
		description: 'Send an eSputnik SMS message',
	},
	'batchTwoRemainder.cancelBroadcast': {
		riskLevel: 'destructive',
		description: 'Cancel an eSputnik scheduled broadcast',
	},
	'finalBatch.contactActivity': {
		riskLevel: 'read',
		description: 'Get eSputnik contact activity records',
	},
	'finalBatch.contactMessages': {
		riskLevel: 'read',
		description: 'Get eSputnik contact message history',
	},
	'finalBatch.getTokenActivated': {
		riskLevel: 'read',
		description: 'Get eSputnik mobile token activity',
	},
	'finalBatch.changeTokenActivated': {
		riskLevel: 'write',
		description: 'Change eSputnik mobile token activity',
	},
	'finalBatch.getDomains': {
		riskLevel: 'read',
		description: 'List eSputnik organization domains',
	},
	'finalBatch.createDomain': {
		riskLevel: 'write',
		description: 'Register an eSputnik domain',
	},
	'finalBatch.getScript': {
		riskLevel: 'read',
		description: 'Get the eSputnik tracking script',
	},
	'finalBatch.getWebPushDomains': {
		riskLevel: 'read',
		description: 'List eSputnik web push domains',
	},
	'finalBatch.addWebPushDomain': {
		riskLevel: 'write',
		description: 'Register an eSputnik web push domain',
	},
	'finalBatch.deleteWebPushDomain': {
		riskLevel: 'destructive',
		description: 'Delete an eSputnik web push domain',
	},
	'finalBatch.getWebPushScript': {
		riskLevel: 'read',
		description: 'Get an eSputnik web push script',
	},
	'finalBatch.getProductFeedsConfiguration': {
		riskLevel: 'read',
		description: 'Get eSputnik product feed configuration',
	},
	'finalBatch.configureProductFeeds': {
		riskLevel: 'write',
		description: 'Configure eSputnik product feeds',
	},
	'finalBatch.addAppTokens': {
		riskLevel: 'write',
		description: 'Add eSputnik application tokens',
	},
	'finalBatch.muteAppToken': {
		riskLevel: 'write',
		description: 'Mute eSputnik application tokens',
	},
	'finalBatch.unmuteAppToken': {
		riskLevel: 'write',
		description: 'Unmute eSputnik application tokens',
	},
	'finalBatch.getSubscriptionCategories': {
		riskLevel: 'read',
		description: 'List eSputnik subscription categories',
	},
	'finalBatch.getPromocodes': {
		riskLevel: 'read',
		description: 'Get eSputnik promotional codes',
	},
	'finalBatch.getPromocodesCount': {
		riskLevel: 'read',
		description: 'Get the eSputnik promotional code count',
	},
	'finalBatch.insertPromocodes': {
		riskLevel: 'write',
		description: 'Upload eSputnik promotional codes',
	},
	'finalBatch.getPreprocessorFileStatus': {
		riskLevel: 'read',
		description: 'Get eSputnik preprocessor file status',
	},
	'finalBatch.updatePreprocessorFile': {
		riskLevel: 'write',
		description: 'Update an eSputnik preprocessor file',
	},
	'finalBatch.uploadPreprocessorFile': {
		riskLevel: 'write',
		description: 'Upload an eSputnik preprocessor file',
	},
	'finalBatch.generateApiToken': {
		riskLevel: 'write',
		description: 'Generate an eSputnik API token',
	},
	'finalBatch.getInteractionStatus': {
		riskLevel: 'read',
		description: 'Get an eSputnik interaction status',
	},
	'finalBatch.sendViber': {
		riskLevel: 'write',
		description: 'Send an eSputnik Viber message',
	},
	'finalBatch.sendAppInbox': {
		riskLevel: 'write',
		description: 'Send an eSputnik App Inbox message',
	},
	'finalBatch.sendTelegramBot': {
		riskLevel: 'write',
		description: 'Send an eSputnik Telegram bot message',
	},
	'finalBatch.updateTranslatedSmsMessage': {
		riskLevel: 'write',
		description: 'Update a translated eSputnik SMS message',
	},
	'finalBatch.deleteTranslatedSmsMessage': {
		riskLevel: 'destructive',
		description: 'Delete a translated eSputnik SMS message',
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
		endpoints: esputnikEndpointsNested,
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
