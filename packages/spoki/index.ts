import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';

import { AuthMissingError } from 'corsair/core';

import {
	addContactOperator,
	addServiceUser,
	checkRolePrivateKey,
	cloneTemplate,
	createAccountOnboardingLink,
	createCustomField,
	createList,
	createMedia,
	createOrUpdateContact,
	createTemplate,
	createTicket,
	deleteContact,
	deleteCustomField,
	deleteList,
	deleteMedia,
	deleteRole,
	deleteTemplate,
	deleteTicket,
	generateRolePrivateKey,
	getAccount,
	getAccountByPhone,
	getAccountCurrentReport,
	listAccounts,
	listAgencies,
	listAutomations,
	listCampaigns,
	listContacts,
	listCustomFields,
	listLists,
	listMedia,
	listPartners,
	listReports,
	listRoles,
	listTags,
	listTemplates,
	listTickets,
	removeAllListContacts,
	removeContactOperator,
	removeListContacts,
	resendInvitation,
	retrieveAutomation,
	retrieveContact,
	retrieveCustomField,
	retrieveList,
	retrieveMedia,
	retrieveRole,
	retrieveTag,
	retrieveTemplate,
	revertTemplateToDraft,
	sendMessage,
	syncContactsBulk,
	syncListContacts,
	triggerAutomation,
	updateCampaign,
	updateContact,
	updateCustomField,
	updateInvitationRole,
	updateMedia,
	updateRole,
	updateTemplate,
} from './endpoints';

import type {
	GetAccountByPhoneResponse,
	GetAccountResponse,
	ListAccountsResponse,
	SendMessageInput,
	SendMessageResponse,
	TriggerAutomationInput,
	TriggerAutomationResponse,
} from './endpoints/types';

import { EndpointInputSchemas, EndpointOutputSchemas } from './endpoints/types';

import { errorHandlers } from './error-handlers';
import { SpokiSchema } from './schema';
import { matchSpokiPluginWebhook, matchSpokiTenantWebhook } from './webhooks';
import { spokiEvent } from './webhooks/event';

export type SpokiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalSpokiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof spokiEndpointsNested>;
};

export type SpokiContext = CorsairPluginContext<
	typeof SpokiSchema,
	SpokiPluginOptions
>;

export type SpokiKeyBuilderContext = KeyBuilderContext<SpokiPluginOptions>;

export type SpokiBoundEndpoints = BindEndpoints<typeof spokiEndpointsNested>;

type SpokiEndpoint<K extends keyof SpokiEndpointInputs> = CorsairEndpoint<
	SpokiContext,
	SpokiEndpointInputs[K],
	SpokiEndpointOutputs[K]
>;

export type SpokiEndpointInputs = {
	listAccounts: Record<string, never>;
	getAccount: { accountId: number };
	getAccountByPhone: { phone: string };
	sendMessage: SendMessageInput;
	triggerAutomation: TriggerAutomationInput;
};

export type SpokiEndpointOutputs = {
	listAccounts: ListAccountsResponse;
	getAccount: GetAccountResponse;
	getAccountByPhone: GetAccountByPhoneResponse;
	sendMessage: SendMessageResponse;
	triggerAutomation: TriggerAutomationResponse;
};

export type SpokiEndpoints = {
	listAccounts: SpokiEndpoint<'listAccounts'>;
	getAccount: SpokiEndpoint<'getAccount'>;
	getAccountByPhone: SpokiEndpoint<'getAccountByPhone'>;
	sendMessage: SpokiEndpoint<'sendMessage'>;
	triggerAutomation: SpokiEndpoint<'triggerAutomation'>;
};

const spokiEndpointsNested = {
	accounts: {
		listAccounts,
		getAccount,
		getAccountByPhone,
		getCurrentReport: getAccountCurrentReport,
		createOnboardingLink: createAccountOnboardingLink,
	},
	agencies: { list: listAgencies },
	automations: { list: listAutomations, retrieve: retrieveAutomation },
	campaigns: { list: listCampaigns, update: updateCampaign },
	contacts: {
		list: listContacts,
		retrieve: retrieveContact,
		createOrUpdate: createOrUpdateContact,
		update: updateContact,
		delete: deleteContact,
		syncBulk: syncContactsBulk,
		addOperator: addContactOperator,
		removeOperator: removeContactOperator,
	},
	customFields: {
		list: listCustomFields,
		retrieve: retrieveCustomField,
		create: createCustomField,
		update: updateCustomField,
		delete: deleteCustomField,
	},
	lists: {
		list: listLists,
		retrieve: retrieveList,
		create: createList,
		delete: deleteList,
		removeAllContacts: removeAllListContacts,
		removeContacts: removeListContacts,
		syncContacts: syncListContacts,
	},
	media: {
		list: listMedia,
		retrieve: retrieveMedia,
		create: createMedia,
		update: updateMedia,
		delete: deleteMedia,
	},
	partners: { list: listPartners },
	reports: { list: listReports },
	roles: {
		list: listRoles,
		retrieve: retrieveRole,
		update: updateRole,
		delete: deleteRole,
		addServiceUser,
		checkPrivateKey: checkRolePrivateKey,
		generatePrivateKey: generateRolePrivateKey,
	},
	tags: { list: listTags, retrieve: retrieveTag },
	templates: {
		list: listTemplates,
		retrieve: retrieveTemplate,
		create: createTemplate,
		update: updateTemplate,
		delete: deleteTemplate,
		clone: cloneTemplate,
		revertToDraft: revertTemplateToDraft,
	},
	tickets: { list: listTickets, create: createTicket, delete: deleteTicket },
	invitations: { resend: resendInvitation, updateRole: updateInvitationRole },
	messaging: {
		sendMessage,
	},
	automation: {
		triggerAutomation,
	},
};

export type SpokiWebhooks = {
	event: CorsairWebhook<SpokiContext, unknown, unknown>;
};

const spokiWebhooksNested = {
	event: spokiEvent,
} as const;

function io<K extends keyof typeof EndpointInputSchemas>(key: K) {
	return {
		input: EndpointInputSchemas[key],
		output: EndpointOutputSchemas[key],
	};
}

export const spokiEndpointSchemas = {
	'accounts.listAccounts': io('listAccounts'),
	'accounts.getAccount': io('getAccount'),
	'accounts.getAccountByPhone': io('getAccountByPhone'),
	'accounts.getCurrentReport': io('getAccountCurrentReport'),
	'accounts.createOnboardingLink': io('createAccountOnboardingLink'),
	'agencies.list': io('listAgencies'),
	'automations.list': io('listAutomations'),
	'automations.retrieve': io('retrieveAutomation'),
	'campaigns.list': io('listCampaigns'),
	'campaigns.update': io('updateCampaign'),
	'contacts.list': io('listContacts'),
	'contacts.retrieve': io('retrieveContact'),
	'contacts.createOrUpdate': io('createOrUpdateContact'),
	'contacts.update': io('updateContact'),
	'contacts.delete': io('deleteContact'),
	'contacts.syncBulk': io('syncContactsBulk'),
	'contacts.addOperator': io('addContactOperator'),
	'contacts.removeOperator': io('removeContactOperator'),
	'customFields.list': io('listCustomFields'),
	'customFields.retrieve': io('retrieveCustomField'),
	'customFields.create': io('createCustomField'),
	'customFields.update': io('updateCustomField'),
	'customFields.delete': io('deleteCustomField'),
	'lists.list': io('listLists'),
	'lists.retrieve': io('retrieveList'),
	'lists.create': io('createList'),
	'lists.delete': io('deleteList'),
	'lists.removeAllContacts': io('removeAllListContacts'),
	'lists.removeContacts': io('removeListContacts'),
	'lists.syncContacts': io('syncListContacts'),
	'media.list': io('listMedia'),
	'media.retrieve': io('retrieveMedia'),
	'media.create': io('createMedia'),
	'media.update': io('updateMedia'),
	'media.delete': io('deleteMedia'),
	'partners.list': io('listPartners'),
	'reports.list': io('listReports'),
	'roles.list': io('listRoles'),
	'roles.retrieve': io('retrieveRole'),
	'roles.update': io('updateRole'),
	'roles.delete': io('deleteRole'),
	'roles.addServiceUser': io('addServiceUser'),
	'roles.checkPrivateKey': io('checkRolePrivateKey'),
	'roles.generatePrivateKey': io('generateRolePrivateKey'),
	'tags.list': io('listTags'),
	'tags.retrieve': io('retrieveTag'),
	'templates.list': io('listTemplates'),
	'templates.retrieve': io('retrieveTemplate'),
	'templates.create': io('createTemplate'),
	'templates.update': io('updateTemplate'),
	'templates.delete': io('deleteTemplate'),
	'templates.clone': io('cloneTemplate'),
	'templates.revertToDraft': io('revertTemplateToDraft'),
	'tickets.list': io('listTickets'),
	'tickets.create': io('createTicket'),
	'tickets.delete': io('deleteTicket'),
	'invitations.resend': io('resendInvitation'),
	'invitations.updateRole': io('updateInvitationRole'),
	'messaging.sendMessage': io('sendMessage'),
	'automation.triggerAutomation': io('triggerAutomation'),
} as const satisfies RequiredPluginEndpointSchemas<typeof spokiEndpointsNested>;

function meta(
	riskLevel: 'read' | 'write' | 'destructive',
	description: string,
	irreversible?: true,
) {
	return irreversible
		? { riskLevel, description, irreversible }
		: { riskLevel, description };
}

export const spokiEndpointMeta = {
	'accounts.listAccounts': meta('read', 'List Spoki WhatsApp accounts'),
	'accounts.getAccount': meta('read', 'Retrieve a Spoki account'),
	'accounts.getAccountByPhone': meta(
		'read',
		'Retrieve a Spoki account by phone',
	),
	'accounts.getCurrentReport': meta('read', 'Get the current account report'),
	'accounts.createOnboardingLink': meta(
		'write',
		'Create an account onboarding link',
	),
	'agencies.list': meta('read', 'List agencies'),
	'automations.list': meta('read', 'List automations'),
	'automations.retrieve': meta('read', 'Retrieve an automation'),
	'campaigns.list': meta('read', 'List campaigns'),
	'campaigns.update': meta('write', 'Update a campaign'),
	'contacts.list': meta('read', 'List contacts'),
	'contacts.retrieve': meta('read', 'Retrieve a contact'),
	'contacts.createOrUpdate': meta(
		'write',
		'Create or update a contact by phone',
	),
	'contacts.update': meta('write', 'Update a contact'),
	'contacts.delete': meta('destructive', 'Delete a contact', true),
	'contacts.syncBulk': meta('write', 'Bulk sync contacts'),
	'contacts.addOperator': meta('write', 'Assign an operator to a contact'),
	'contacts.removeOperator': meta('write', 'Remove an operator from a contact'),
	'customFields.list': meta('read', 'List custom fields'),
	'customFields.retrieve': meta('read', 'Retrieve a custom field'),
	'customFields.create': meta('write', 'Create a custom field'),
	'customFields.update': meta('write', 'Update a custom field'),
	'customFields.delete': meta('destructive', 'Delete a custom field', true),
	'lists.list': meta('read', 'List contact lists'),
	'lists.retrieve': meta('read', 'Retrieve a contact list'),
	'lists.create': meta('write', 'Create a contact list'),
	'lists.delete': meta('destructive', 'Delete a contact list', true),
	'lists.removeAllContacts': meta('write', 'Remove all contacts from a list'),
	'lists.removeContacts': meta('write', 'Remove contacts from a list'),
	'lists.syncContacts': meta('write', 'Sync contacts into a list'),
	'media.list': meta('read', 'List media files'),
	'media.retrieve': meta('read', 'Retrieve a media file'),
	'media.create': meta('write', 'Create a media file'),
	'media.update': meta('write', 'Update a media file'),
	'media.delete': meta('destructive', 'Delete a media file', true),
	'partners.list': meta('read', 'List partners'),
	'reports.list': meta('read', 'List usage reports'),
	'roles.list': meta('read', 'List roles'),
	'roles.retrieve': meta('read', 'Retrieve a role'),
	'roles.update': meta('write', 'Update a role'),
	'roles.delete': meta('destructive', 'Delete a role', true),
	'roles.addServiceUser': meta('write', 'Add a service user'),
	'roles.checkPrivateKey': meta(
		'read',
		'Check whether a role has a private key',
	),
	'roles.generatePrivateKey': meta('write', 'Generate a role private key'),
	'tags.list': meta('read', 'List tags'),
	'tags.retrieve': meta('read', 'Retrieve a tag'),
	'templates.list': meta('read', 'List templates'),
	'templates.retrieve': meta('read', 'Retrieve a template'),
	'templates.create': meta('write', 'Create a WhatsApp template'),
	'templates.update': meta('write', 'Update a WhatsApp template'),
	'templates.delete': meta('destructive', 'Delete a WhatsApp template', true),
	'templates.clone': meta('write', 'Clone a template'),
	'templates.revertToDraft': meta('write', 'Revert a template to draft'),
	'tickets.list': meta('read', 'List tickets'),
	'tickets.create': meta('write', 'Create a ticket'),
	'tickets.delete': meta('destructive', 'Delete a ticket', true),
	'invitations.resend': meta('write', 'Resend an invitation'),
	'invitations.updateRole': meta('write', 'Update an invitation role'),
	'messaging.sendMessage': meta('write', 'Send a WhatsApp message'),
	'automation.triggerAutomation': meta('write', 'Trigger a Spoki automation'),
} as const satisfies RequiredPluginEndpointMeta<typeof spokiEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key';

export const spokiAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseSpokiPlugin<T extends SpokiPluginOptions> = CorsairPlugin<
	'spoki',
	typeof SpokiSchema,
	typeof spokiEndpointsNested,
	typeof spokiWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalSpokiPlugin = BaseSpokiPlugin<SpokiPluginOptions>;

export type ExternalSpokiPlugin<T extends SpokiPluginOptions> =
	BaseSpokiPlugin<T>;

export function spoki<const T extends SpokiPluginOptions>(
	incomingOptions: SpokiPluginOptions & T = {} as SpokiPluginOptions & T,
): ExternalSpokiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'spoki',

		authConfig: spokiAuthConfig,

		schema: SpokiSchema,

		options,

		hooks: options.hooks,

		endpoints: spokiEndpointsNested,

		webhooks: spokiWebhooksNested,

		endpointMeta: spokiEndpointMeta,

		endpointSchemas: spokiEndpointSchemas,

		pluginWebhookMatcher: (request) =>
			matchSpokiPluginWebhook(request, options.webhookSecret),

		pluginTenantWebhookMatcher: (request) =>
			matchSpokiTenantWebhook(request, options.webhookSecret),

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (
			ctx: SpokiKeyBuilderContext,
			source: 'endpoint' | 'webhook',
		) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (ctx.authType === 'api_key') {
				const result = await ctx.keys.get_api_key();

				if (!result) {
					throw new AuthMissingError('spoki', 'api_key');
				}

				return result;
			}

			throw new AuthMissingError('spoki', 'api_key');
		},
	} satisfies InternalSpokiPlugin as ExternalSpokiPlugin<T>;
}

export {
	getAccount,
	getAccountByPhone,
	listAccounts,
	sendMessage,
	triggerAutomation,
};

export {
	SPOKI_BASE_URL,
	SpokiApiError,
	SpokiClient,
} from './client';

export type {
	GetAccountByPhoneResponse,
	GetAccountResponse,
	ListAccountsResponse,
	SendMessageInput,
	SendMessageResponse,
	SpokiAccount,
	SpokiChannel,
	StartAutomationInput,
	TriggerAutomationInput,
	TriggerAutomationResponse,
} from './endpoints/types';
