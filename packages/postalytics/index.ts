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
import { Operations } from './endpoints';
import type {
	PostalyticsEndpointInputs,
	PostalyticsEndpointOutputs,
} from './endpoints/types';
import {
	PostalyticsEndpointInputSchemas,
	PostalyticsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PostalyticsSchema } from './schema';

export type PostalyticsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	sandbox?: boolean;
	hooks?: InternalPostalyticsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof postalyticsEndpointsNested>;
};
export type PostalyticsContext = CorsairPluginContext<
	typeof PostalyticsSchema,
	PostalyticsPluginOptions,
	undefined,
	typeof postalyticsAuthConfig
>;
export type PostalyticsKeyBuilderContext = KeyBuilderContext<
	PostalyticsPluginOptions,
	typeof postalyticsAuthConfig
>;
export type PostalyticsBoundEndpoints = BindEndpoints<
	typeof postalyticsEndpointsNested
>;
type PostalyticsEndpoint<K extends keyof PostalyticsEndpointOutputs> =
	CorsairEndpoint<
		PostalyticsContext,
		PostalyticsEndpointInputs[K],
		PostalyticsEndpointOutputs[K]
	>;
export type PostalyticsEndpoints = {
	getIntegrations: PostalyticsEndpoint<'getIntegrations'>;
	getMyAccount: PostalyticsEndpoint<'getMyAccount'>;
	getAccount: PostalyticsEndpoint<'getAccount'>;
	createNewAccount: PostalyticsEndpoint<'createNewAccount'>;
	updateAccount: PostalyticsEndpoint<'updateAccount'>;
	deleteAccount: PostalyticsEndpoint<'deleteAccount'>;
	getAllCampaigns: PostalyticsEndpoint<'getAllCampaigns'>;
	getAllDripCampaigns: PostalyticsEndpoint<'getAllDripCampaigns'>;
	getCampaignStats: PostalyticsEndpoint<'getCampaignStats'>;
	getCampaign: PostalyticsEndpoint<'getCampaign'>;
	getCampaignEvents: PostalyticsEndpoint<'getCampaignEvents'>;
	getContactEvent: PostalyticsEndpoint<'getContactEvent'>;
	createNewCampaign: PostalyticsEndpoint<'createNewCampaign'>;
	updateCampaignStatus: PostalyticsEndpoint<'updateCampaignStatus'>;
	deleteCampaign: PostalyticsEndpoint<'deleteCampaign'>;
	getAllContactLists: PostalyticsEndpoint<'getAllContactLists'>;
	getContact: PostalyticsEndpoint<'getContact'>;
	getContactsOnList: PostalyticsEndpoint<'getContactsOnList'>;
	createContactOnList: PostalyticsEndpoint<'createContactOnList'>;
	updateContactOnList: PostalyticsEndpoint<'updateContactOnList'>;
	deleteContact: PostalyticsEndpoint<'deleteContact'>;
	getAllFlows: PostalyticsEndpoint<'getAllFlows'>;
	getFlow: PostalyticsEndpoint<'getFlow'>;
	enrollContactToFlow: PostalyticsEndpoint<'enrollContactToFlow'>;
	unenrollContactFromFlow: PostalyticsEndpoint<'unenrollContactFromFlow'>;
	createLoginLink: PostalyticsEndpoint<'createLoginLink'>;
	sendMail: PostalyticsEndpoint<'sendMail'>;
	getSuppressionLists: PostalyticsEndpoint<'getSuppressionLists'>;
	getSuppressionList: PostalyticsEndpoint<'getSuppressionList'>;
	createSuppressionList: PostalyticsEndpoint<'createSuppressionList'>;
	deleteSuppressionList: PostalyticsEndpoint<'deleteSuppressionList'>;
	getSuppressionListContacts: PostalyticsEndpoint<'getSuppressionListContacts'>;
	getSuppressionListContact: PostalyticsEndpoint<'getSuppressionListContact'>;
	createSuppressionListContact: PostalyticsEndpoint<'createSuppressionListContact'>;
	updateSuppressionListContact: PostalyticsEndpoint<'updateSuppressionListContact'>;
	deleteSuppressionListContact: PostalyticsEndpoint<'deleteSuppressionListContact'>;
	getAllTemplates: PostalyticsEndpoint<'getAllTemplates'>;
	getTemplate: PostalyticsEndpoint<'getTemplate'>;
	createTemplate: PostalyticsEndpoint<'createTemplate'>;
	deleteTemplate: PostalyticsEndpoint<'deleteTemplate'>;
	getAllWebhooks: PostalyticsEndpoint<'getAllWebhooks'>;
	getWebhook: PostalyticsEndpoint<'getWebhook'>;
	createWebhook: PostalyticsEndpoint<'createWebhook'>;
	updateWebhook: PostalyticsEndpoint<'updateWebhook'>;
	deleteWebhook: PostalyticsEndpoint<'deleteWebhook'>;
};
const postalyticsEndpointsNested = {
	account: {
		getIntegrations: Operations.getIntegrations,
		getMyAccount: Operations.getMyAccount,
		getAccount: Operations.getAccount,
		createNewAccount: Operations.createNewAccount,
		updateAccount: Operations.updateAccount,
		deleteAccount: Operations.deleteAccount,
	},
	campaigns: {
		getAllCampaigns: Operations.getAllCampaigns,
		getAllDripCampaigns: Operations.getAllDripCampaigns,
		getCampaignStats: Operations.getCampaignStats,
		getCampaign: Operations.getCampaign,
		getCampaignEvents: Operations.getCampaignEvents,
		getContactEvent: Operations.getContactEvent,
		createNewCampaign: Operations.createNewCampaign,
		updateCampaignStatus: Operations.updateCampaignStatus,
		deleteCampaign: Operations.deleteCampaign,
	},
	contacts: {
		getAllContactLists: Operations.getAllContactLists,
		getContact: Operations.getContact,
		getContactsOnList: Operations.getContactsOnList,
		createContactOnList: Operations.createContactOnList,
		updateContactOnList: Operations.updateContactOnList,
		deleteContact: Operations.deleteContact,
	},
	flows: {
		getAllFlows: Operations.getAllFlows,
		getFlow: Operations.getFlow,
		enrollContactToFlow: Operations.enrollContactToFlow,
		unenrollContactFromFlow: Operations.unenrollContactFromFlow,
	},
	login: { createLoginLink: Operations.createLoginLink },
	mail: { sendMail: Operations.sendMail },
	suppressionLists: {
		getSuppressionLists: Operations.getSuppressionLists,
		getSuppressionList: Operations.getSuppressionList,
		createSuppressionList: Operations.createSuppressionList,
		deleteSuppressionList: Operations.deleteSuppressionList,
	},
	suppressionContacts: {
		getSuppressionListContacts: Operations.getSuppressionListContacts,
		getSuppressionListContact: Operations.getSuppressionListContact,
		createSuppressionListContact: Operations.createSuppressionListContact,
		updateSuppressionListContact: Operations.updateSuppressionListContact,
		deleteSuppressionListContact: Operations.deleteSuppressionListContact,
	},
	templates: {
		getAllTemplates: Operations.getAllTemplates,
		getTemplate: Operations.getTemplate,
		createTemplate: Operations.createTemplate,
		deleteTemplate: Operations.deleteTemplate,
	},
	webhooks: {
		getAllWebhooks: Operations.getAllWebhooks,
		getWebhook: Operations.getWebhook,
		createWebhook: Operations.createWebhook,
		updateWebhook: Operations.updateWebhook,
		deleteWebhook: Operations.deleteWebhook,
	},
} as const;
export const postalyticsEndpointSchemas = {
	'account.getIntegrations': {
		input: PostalyticsEndpointInputSchemas.getIntegrations,
		output: PostalyticsEndpointOutputSchemas.getIntegrations,
	},
	'account.getMyAccount': {
		input: PostalyticsEndpointInputSchemas.getMyAccount,
		output: PostalyticsEndpointOutputSchemas.getMyAccount,
	},
	'account.getAccount': {
		input: PostalyticsEndpointInputSchemas.getAccount,
		output: PostalyticsEndpointOutputSchemas.getAccount,
	},
	'account.createNewAccount': {
		input: PostalyticsEndpointInputSchemas.createNewAccount,
		output: PostalyticsEndpointOutputSchemas.createNewAccount,
	},
	'account.updateAccount': {
		input: PostalyticsEndpointInputSchemas.updateAccount,
		output: PostalyticsEndpointOutputSchemas.updateAccount,
	},
	'account.deleteAccount': {
		input: PostalyticsEndpointInputSchemas.deleteAccount,
		output: PostalyticsEndpointOutputSchemas.deleteAccount,
	},
	'campaigns.getAllCampaigns': {
		input: PostalyticsEndpointInputSchemas.getAllCampaigns,
		output: PostalyticsEndpointOutputSchemas.getAllCampaigns,
	},
	'campaigns.getAllDripCampaigns': {
		input: PostalyticsEndpointInputSchemas.getAllDripCampaigns,
		output: PostalyticsEndpointOutputSchemas.getAllDripCampaigns,
	},
	'campaigns.getCampaignStats': {
		input: PostalyticsEndpointInputSchemas.getCampaignStats,
		output: PostalyticsEndpointOutputSchemas.getCampaignStats,
	},
	'campaigns.getCampaign': {
		input: PostalyticsEndpointInputSchemas.getCampaign,
		output: PostalyticsEndpointOutputSchemas.getCampaign,
	},
	'campaigns.getCampaignEvents': {
		input: PostalyticsEndpointInputSchemas.getCampaignEvents,
		output: PostalyticsEndpointOutputSchemas.getCampaignEvents,
	},
	'campaigns.getContactEvent': {
		input: PostalyticsEndpointInputSchemas.getContactEvent,
		output: PostalyticsEndpointOutputSchemas.getContactEvent,
	},
	'campaigns.createNewCampaign': {
		input: PostalyticsEndpointInputSchemas.createNewCampaign,
		output: PostalyticsEndpointOutputSchemas.createNewCampaign,
	},
	'campaigns.updateCampaignStatus': {
		input: PostalyticsEndpointInputSchemas.updateCampaignStatus,
		output: PostalyticsEndpointOutputSchemas.updateCampaignStatus,
	},
	'campaigns.deleteCampaign': {
		input: PostalyticsEndpointInputSchemas.deleteCampaign,
		output: PostalyticsEndpointOutputSchemas.deleteCampaign,
	},
	'contacts.getAllContactLists': {
		input: PostalyticsEndpointInputSchemas.getAllContactLists,
		output: PostalyticsEndpointOutputSchemas.getAllContactLists,
	},
	'contacts.getContact': {
		input: PostalyticsEndpointInputSchemas.getContact,
		output: PostalyticsEndpointOutputSchemas.getContact,
	},
	'contacts.getContactsOnList': {
		input: PostalyticsEndpointInputSchemas.getContactsOnList,
		output: PostalyticsEndpointOutputSchemas.getContactsOnList,
	},
	'contacts.createContactOnList': {
		input: PostalyticsEndpointInputSchemas.createContactOnList,
		output: PostalyticsEndpointOutputSchemas.createContactOnList,
	},
	'contacts.updateContactOnList': {
		input: PostalyticsEndpointInputSchemas.updateContactOnList,
		output: PostalyticsEndpointOutputSchemas.updateContactOnList,
	},
	'contacts.deleteContact': {
		input: PostalyticsEndpointInputSchemas.deleteContact,
		output: PostalyticsEndpointOutputSchemas.deleteContact,
	},
	'flows.getAllFlows': {
		input: PostalyticsEndpointInputSchemas.getAllFlows,
		output: PostalyticsEndpointOutputSchemas.getAllFlows,
	},
	'flows.getFlow': {
		input: PostalyticsEndpointInputSchemas.getFlow,
		output: PostalyticsEndpointOutputSchemas.getFlow,
	},
	'flows.enrollContactToFlow': {
		input: PostalyticsEndpointInputSchemas.enrollContactToFlow,
		output: PostalyticsEndpointOutputSchemas.enrollContactToFlow,
	},
	'flows.unenrollContactFromFlow': {
		input: PostalyticsEndpointInputSchemas.unenrollContactFromFlow,
		output: PostalyticsEndpointOutputSchemas.unenrollContactFromFlow,
	},
	'login.createLoginLink': {
		input: PostalyticsEndpointInputSchemas.createLoginLink,
		output: PostalyticsEndpointOutputSchemas.createLoginLink,
	},
	'mail.sendMail': {
		input: PostalyticsEndpointInputSchemas.sendMail,
		output: PostalyticsEndpointOutputSchemas.sendMail,
	},
	'suppressionLists.getSuppressionLists': {
		input: PostalyticsEndpointInputSchemas.getSuppressionLists,
		output: PostalyticsEndpointOutputSchemas.getSuppressionLists,
	},
	'suppressionLists.getSuppressionList': {
		input: PostalyticsEndpointInputSchemas.getSuppressionList,
		output: PostalyticsEndpointOutputSchemas.getSuppressionList,
	},
	'suppressionLists.createSuppressionList': {
		input: PostalyticsEndpointInputSchemas.createSuppressionList,
		output: PostalyticsEndpointOutputSchemas.createSuppressionList,
	},
	'suppressionLists.deleteSuppressionList': {
		input: PostalyticsEndpointInputSchemas.deleteSuppressionList,
		output: PostalyticsEndpointOutputSchemas.deleteSuppressionList,
	},
	'suppressionContacts.getSuppressionListContacts': {
		input: PostalyticsEndpointInputSchemas.getSuppressionListContacts,
		output: PostalyticsEndpointOutputSchemas.getSuppressionListContacts,
	},
	'suppressionContacts.getSuppressionListContact': {
		input: PostalyticsEndpointInputSchemas.getSuppressionListContact,
		output: PostalyticsEndpointOutputSchemas.getSuppressionListContact,
	},
	'suppressionContacts.createSuppressionListContact': {
		input: PostalyticsEndpointInputSchemas.createSuppressionListContact,
		output: PostalyticsEndpointOutputSchemas.createSuppressionListContact,
	},
	'suppressionContacts.updateSuppressionListContact': {
		input: PostalyticsEndpointInputSchemas.updateSuppressionListContact,
		output: PostalyticsEndpointOutputSchemas.updateSuppressionListContact,
	},
	'suppressionContacts.deleteSuppressionListContact': {
		input: PostalyticsEndpointInputSchemas.deleteSuppressionListContact,
		output: PostalyticsEndpointOutputSchemas.deleteSuppressionListContact,
	},
	'templates.getAllTemplates': {
		input: PostalyticsEndpointInputSchemas.getAllTemplates,
		output: PostalyticsEndpointOutputSchemas.getAllTemplates,
	},
	'templates.getTemplate': {
		input: PostalyticsEndpointInputSchemas.getTemplate,
		output: PostalyticsEndpointOutputSchemas.getTemplate,
	},
	'templates.createTemplate': {
		input: PostalyticsEndpointInputSchemas.createTemplate,
		output: PostalyticsEndpointOutputSchemas.createTemplate,
	},
	'templates.deleteTemplate': {
		input: PostalyticsEndpointInputSchemas.deleteTemplate,
		output: PostalyticsEndpointOutputSchemas.deleteTemplate,
	},
	'webhooks.getAllWebhooks': {
		input: PostalyticsEndpointInputSchemas.getAllWebhooks,
		output: PostalyticsEndpointOutputSchemas.getAllWebhooks,
	},
	'webhooks.getWebhook': {
		input: PostalyticsEndpointInputSchemas.getWebhook,
		output: PostalyticsEndpointOutputSchemas.getWebhook,
	},
	'webhooks.createWebhook': {
		input: PostalyticsEndpointInputSchemas.createWebhook,
		output: PostalyticsEndpointOutputSchemas.createWebhook,
	},
	'webhooks.updateWebhook': {
		input: PostalyticsEndpointInputSchemas.updateWebhook,
		output: PostalyticsEndpointOutputSchemas.updateWebhook,
	},
	'webhooks.deleteWebhook': {
		input: PostalyticsEndpointInputSchemas.deleteWebhook,
		output: PostalyticsEndpointOutputSchemas.deleteWebhook,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof postalyticsEndpointsNested
>;
const postalyticsEndpointMeta = {
	'account.getIntegrations': {
		riskLevel: 'read',
		description: 'get integrations',
	},
	'account.getMyAccount': { riskLevel: 'read', description: 'get my account' },
	'account.getAccount': { riskLevel: 'read', description: 'get account' },
	'account.createNewAccount': {
		riskLevel: 'write',
		description: 'create new account',
	},
	'account.updateAccount': {
		riskLevel: 'write',
		description: 'update account',
	},
	'account.deleteAccount': {
		riskLevel: 'destructive',
		description: 'delete account',
	},
	'campaigns.getAllCampaigns': {
		riskLevel: 'read',
		description: 'get all campaigns',
	},
	'campaigns.getAllDripCampaigns': {
		riskLevel: 'read',
		description: 'get all drip campaigns',
	},
	'campaigns.getCampaignStats': {
		riskLevel: 'read',
		description: 'get campaign stats',
	},
	'campaigns.getCampaign': { riskLevel: 'read', description: 'get campaign' },
	'campaigns.getCampaignEvents': {
		riskLevel: 'read',
		description: 'get campaign events',
	},
	'campaigns.getContactEvent': {
		riskLevel: 'read',
		description: 'get contact event',
	},
	'campaigns.createNewCampaign': {
		riskLevel: 'write',
		description: 'create new campaign',
	},
	'campaigns.updateCampaignStatus': {
		riskLevel: 'write',
		description: 'update campaign status',
	},
	'campaigns.deleteCampaign': {
		riskLevel: 'destructive',
		description: 'delete campaign',
	},
	'contacts.getAllContactLists': {
		riskLevel: 'read',
		description: 'get all contact lists',
	},
	'contacts.getContact': { riskLevel: 'read', description: 'get contact' },
	'contacts.getContactsOnList': {
		riskLevel: 'read',
		description: 'get contacts on list',
	},
	'contacts.createContactOnList': {
		riskLevel: 'write',
		description: 'create contact on list',
	},
	'contacts.updateContactOnList': {
		riskLevel: 'write',
		description: 'update contact on list',
	},
	'contacts.deleteContact': {
		riskLevel: 'destructive',
		description: 'delete contact',
	},
	'flows.getAllFlows': { riskLevel: 'read', description: 'get all flows' },
	'flows.getFlow': { riskLevel: 'read', description: 'get flow' },
	'flows.enrollContactToFlow': {
		riskLevel: 'write',
		description: 'enroll contact to flow',
	},
	'flows.unenrollContactFromFlow': {
		riskLevel: 'write',
		description: 'unenroll contact from flow',
	},
	'login.createLoginLink': {
		riskLevel: 'write',
		description: 'create login link',
	},
	'mail.sendMail': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Send direct mail, which may incur charges and cannot be recalled',
	},
	'suppressionLists.getSuppressionLists': {
		riskLevel: 'read',
		description: 'get suppression lists',
	},
	'suppressionLists.getSuppressionList': {
		riskLevel: 'read',
		description: 'get suppression list',
	},
	'suppressionLists.createSuppressionList': {
		riskLevel: 'write',
		description: 'create suppression list',
	},
	'suppressionLists.deleteSuppressionList': {
		riskLevel: 'destructive',
		description: 'delete suppression list',
	},
	'suppressionContacts.getSuppressionListContacts': {
		riskLevel: 'read',
		description: 'get suppression list contacts',
	},
	'suppressionContacts.getSuppressionListContact': {
		riskLevel: 'read',
		description: 'get suppression list contact',
	},
	'suppressionContacts.createSuppressionListContact': {
		riskLevel: 'write',
		description: 'create suppression list contact',
	},
	'suppressionContacts.updateSuppressionListContact': {
		riskLevel: 'write',
		description: 'update suppression list contact',
	},
	'suppressionContacts.deleteSuppressionListContact': {
		riskLevel: 'destructive',
		description: 'delete suppression list contact',
	},
	'templates.getAllTemplates': {
		riskLevel: 'read',
		description: 'get all templates',
	},
	'templates.getTemplate': { riskLevel: 'read', description: 'get template' },
	'templates.createTemplate': {
		riskLevel: 'write',
		description: 'create template',
	},
	'templates.deleteTemplate': {
		riskLevel: 'destructive',
		description: 'delete template',
	},
	'webhooks.getAllWebhooks': {
		riskLevel: 'read',
		description: 'get all webhooks',
	},
	'webhooks.getWebhook': { riskLevel: 'read', description: 'get webhook' },
	'webhooks.createWebhook': {
		riskLevel: 'write',
		description: 'create webhook',
	},
	'webhooks.updateWebhook': {
		riskLevel: 'write',
		description: 'update webhook',
	},
	'webhooks.deleteWebhook': {
		riskLevel: 'destructive',
		description: 'delete webhook',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof postalyticsEndpointsNested
>;
const defaultAuthType: AuthTypes = 'api_key';
export const postalyticsAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;
export type BasePostalyticsPlugin<T extends PostalyticsPluginOptions> =
	CorsairPlugin<
		'postalytics',
		typeof PostalyticsSchema,
		typeof postalyticsEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof postalyticsAuthConfig
	>;
export type InternalPostalyticsPlugin =
	BasePostalyticsPlugin<PostalyticsPluginOptions>;
export type ExternalPostalyticsPlugin<T extends PostalyticsPluginOptions> =
	BasePostalyticsPlugin<T>;

export function postalytics<const T extends PostalyticsPluginOptions>(
	incomingOptions: PostalyticsPluginOptions &
		T = {} as PostalyticsPluginOptions & T,
): ExternalPostalyticsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'postalytics',
		authConfig: postalyticsAuthConfig,
		schema: PostalyticsSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: postalyticsEndpointsNested,
		webhooks: {},
		endpointMeta: postalyticsEndpointMeta,
		endpointSchemas: postalyticsEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: PostalyticsKeyBuilderContext, source) => {
			if (source !== 'endpoint')
				throw new AuthMissingError('postalytics', 'api_key');
			const key = options.key ?? (await ctx.keys.get_api_key());
			if (!key) throw new AuthMissingError('postalytics', 'api_key');
			return key;
		},
	} satisfies InternalPostalyticsPlugin;
}

export {
	makePostalyticsRequest,
	PostalyticsAPIError,
	PostalyticsRateLimitError,
} from './client';
export type {
	PostalyticsEndpointInputs,
	PostalyticsEndpointOutputs,
} from './endpoints/types';
