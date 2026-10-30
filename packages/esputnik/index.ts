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
	contactEndpoints,
	emailEndpoints,
	eventEndpoints,
	orderEndpoints,
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
};

const esputnikEndpointsNested = {
	account: accountEndpoints,
	contacts: contactEndpoints,
	accountExtended: accountExtendedEndpoints,
	orders: orderEndpoints,
	events: eventEndpoints,
	emails: emailEndpoints,
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
