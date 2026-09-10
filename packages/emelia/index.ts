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
import {
	Account,
	Blacklist,
	Campaigns,
	Contacts,
	EmailCampaigns,
	Linkedin,
	Providers,
	RestCampaigns,
	Tools,
	Webhooks,
} from './endpoints';
import type {
	EmeliaEndpointInputs,
	EmeliaEndpointOutputs,
} from './endpoints/types';
import {
	EmeliaEndpointInputSchemas,
	EmeliaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { EmeliaSchema } from './schema';

export type EmeliaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalEmeliaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof emeliaEndpointsNested>;
};

export type EmeliaContext = CorsairPluginContext<
	typeof EmeliaSchema,
	EmeliaPluginOptions
>;

export type EmeliaKeyBuilderContext = KeyBuilderContext<EmeliaPluginOptions>;

export type EmeliaBoundEndpoints = BindEndpoints<typeof emeliaEndpointsNested>;

type EmeliaEndpoint<K extends keyof EmeliaEndpointOutputs> = CorsairEndpoint<
	EmeliaContext,
	EmeliaEndpointInputs[K],
	EmeliaEndpointOutputs[K]
>;

export type EmeliaEndpoints = {
	accountMe: EmeliaEndpoint<'accountMe'>;
	campaignsList: EmeliaEndpoint<'campaignsList'>;
	campaignsAddContact: EmeliaEndpoint<'campaignsAddContact'>;
	campaignsRemoveContact: EmeliaEndpoint<'campaignsRemoveContact'>;
	contactsListLists: EmeliaEndpoint<'contactsListLists'>;
	contactsAddToList: EmeliaEndpoint<'contactsAddToList'>;
	restCreateCampaign: EmeliaEndpoint<'restCreateCampaign'>;
	restListCampaigns: EmeliaEndpoint<'restListCampaigns'>;
	restGetCampaignActivities: EmeliaEndpoint<'restGetCampaignActivities'>;
	emailAddContact: EmeliaEndpoint<'emailAddContact'>;
	emailListContacts: EmeliaEndpoint<'emailListContacts'>;
	emailDeleteContact: EmeliaEndpoint<'emailDeleteContact'>;
	blacklistAdd: EmeliaEndpoint<'blacklistAdd'>;
	blacklistRemove: EmeliaEndpoint<'blacklistRemove'>;
	linkedinCreateCampaign: EmeliaEndpoint<'linkedinCreateCampaign'>;
	linkedinListCampaigns: EmeliaEndpoint<'linkedinListCampaigns'>;
	linkedinDeleteContact: EmeliaEndpoint<'linkedinDeleteContact'>;
	linkedinGetActivities: EmeliaEndpoint<'linkedinGetActivities'>;
	findEmailSingle: EmeliaEndpoint<'findEmailSingle'>;
	getFindEmailResult: EmeliaEndpoint<'getFindEmailResult'>;
	findPhoneSingle: EmeliaEndpoint<'findPhoneSingle'>;
	getFindPhoneResult: EmeliaEndpoint<'getFindPhoneResult'>;
	verifyEmailSingle: EmeliaEndpoint<'verifyEmailSingle'>;
	getVerifyEmailResult: EmeliaEndpoint<'getVerifyEmailResult'>;
	listProviders: EmeliaEndpoint<'listProviders'>;
	listWebhooks: EmeliaEndpoint<'listWebhooks'>;
	createWebhook: EmeliaEndpoint<'createWebhook'>;
	deleteWebhook: EmeliaEndpoint<'deleteWebhook'>;
};

const emeliaEndpointsNested = {
	account: {
		me: Account.me,
	},
	campaigns: {
		list: Campaigns.list,
		addContact: Campaigns.addContact,
		removeContact: Campaigns.removeContact,
	},
	contacts: {
		listLists: Contacts.listLists,
		addToList: Contacts.addToList,
	},
	restCampaigns: {
		create: RestCampaigns.create,
		list: RestCampaigns.list,
		getActivities: RestCampaigns.getActivities,
	},
	emailCampaigns: {
		addContact: EmailCampaigns.addContact,
		listContacts: EmailCampaigns.listContacts,
		deleteContact: EmailCampaigns.deleteContact,
	},
	blacklist: {
		add: Blacklist.add,
		remove: Blacklist.remove,
	},
	linkedin: {
		createCampaign: Linkedin.createCampaign,
		listCampaigns: Linkedin.listCampaigns,
		deleteContact: Linkedin.deleteContact,
		getActivities: Linkedin.getActivities,
	},
	tools: {
		findEmailSingle: Tools.findEmailSingle,
		getFindEmailResult: Tools.getFindEmailResult,
		findPhoneSingle: Tools.findPhoneSingle,
		getFindPhoneResult: Tools.getFindPhoneResult,
		verifyEmailSingle: Tools.verifyEmailSingle,
		getVerifyEmailResult: Tools.getVerifyEmailResult,
	},
	providers: {
		list: Providers.list,
	},
	webhooks: {
		list: Webhooks.list,
		create: Webhooks.create,
		remove: Webhooks.remove,
	},
} as const;

export const emeliaEndpointSchemas = {
	'account.me': {
		input: EmeliaEndpointInputSchemas.accountMe,
		output: EmeliaEndpointOutputSchemas.accountMe,
	},
	'campaigns.list': {
		input: EmeliaEndpointInputSchemas.campaignsList,
		output: EmeliaEndpointOutputSchemas.campaignsList,
	},
	'campaigns.addContact': {
		input: EmeliaEndpointInputSchemas.campaignsAddContact,
		output: EmeliaEndpointOutputSchemas.campaignsAddContact,
	},
	'campaigns.removeContact': {
		input: EmeliaEndpointInputSchemas.campaignsRemoveContact,
		output: EmeliaEndpointOutputSchemas.campaignsRemoveContact,
	},
	'contacts.listLists': {
		input: EmeliaEndpointInputSchemas.contactsListLists,
		output: EmeliaEndpointOutputSchemas.contactsListLists,
	},
	'contacts.addToList': {
		input: EmeliaEndpointInputSchemas.contactsAddToList,
		output: EmeliaEndpointOutputSchemas.contactsAddToList,
	},
	'restCampaigns.create': {
		input: EmeliaEndpointInputSchemas.restCreateCampaign,
		output: EmeliaEndpointOutputSchemas.restCreateCampaign,
	},
	'restCampaigns.list': {
		input: EmeliaEndpointInputSchemas.restListCampaigns,
		output: EmeliaEndpointOutputSchemas.restListCampaigns,
	},
	'restCampaigns.getActivities': {
		input: EmeliaEndpointInputSchemas.restGetCampaignActivities,
		output: EmeliaEndpointOutputSchemas.restGetCampaignActivities,
	},
	'emailCampaigns.addContact': {
		input: EmeliaEndpointInputSchemas.emailAddContact,
		output: EmeliaEndpointOutputSchemas.emailAddContact,
	},
	'emailCampaigns.listContacts': {
		input: EmeliaEndpointInputSchemas.emailListContacts,
		output: EmeliaEndpointOutputSchemas.emailListContacts,
	},
	'emailCampaigns.deleteContact': {
		input: EmeliaEndpointInputSchemas.emailDeleteContact,
		output: EmeliaEndpointOutputSchemas.emailDeleteContact,
	},
	'blacklist.add': {
		input: EmeliaEndpointInputSchemas.blacklistAdd,
		output: EmeliaEndpointOutputSchemas.blacklistAdd,
	},
	'blacklist.remove': {
		input: EmeliaEndpointInputSchemas.blacklistRemove,
		output: EmeliaEndpointOutputSchemas.blacklistRemove,
	},
	'linkedin.createCampaign': {
		input: EmeliaEndpointInputSchemas.linkedinCreateCampaign,
		output: EmeliaEndpointOutputSchemas.linkedinCreateCampaign,
	},
	'linkedin.listCampaigns': {
		input: EmeliaEndpointInputSchemas.linkedinListCampaigns,
		output: EmeliaEndpointOutputSchemas.linkedinListCampaigns,
	},
	'linkedin.deleteContact': {
		input: EmeliaEndpointInputSchemas.linkedinDeleteContact,
		output: EmeliaEndpointOutputSchemas.linkedinDeleteContact,
	},
	'linkedin.getActivities': {
		input: EmeliaEndpointInputSchemas.linkedinGetActivities,
		output: EmeliaEndpointOutputSchemas.linkedinGetActivities,
	},
	'tools.findEmailSingle': {
		input: EmeliaEndpointInputSchemas.findEmailSingle,
		output: EmeliaEndpointOutputSchemas.findEmailSingle,
	},
	'tools.getFindEmailResult': {
		input: EmeliaEndpointInputSchemas.getFindEmailResult,
		output: EmeliaEndpointOutputSchemas.getFindEmailResult,
	},
	'tools.findPhoneSingle': {
		input: EmeliaEndpointInputSchemas.findPhoneSingle,
		output: EmeliaEndpointOutputSchemas.findPhoneSingle,
	},
	'tools.getFindPhoneResult': {
		input: EmeliaEndpointInputSchemas.getFindPhoneResult,
		output: EmeliaEndpointOutputSchemas.getFindPhoneResult,
	},
	'tools.verifyEmailSingle': {
		input: EmeliaEndpointInputSchemas.verifyEmailSingle,
		output: EmeliaEndpointOutputSchemas.verifyEmailSingle,
	},
	'tools.getVerifyEmailResult': {
		input: EmeliaEndpointInputSchemas.getVerifyEmailResult,
		output: EmeliaEndpointOutputSchemas.getVerifyEmailResult,
	},
	'providers.list': {
		input: EmeliaEndpointInputSchemas.listProviders,
		output: EmeliaEndpointOutputSchemas.listProviders,
	},
	'webhooks.list': {
		input: EmeliaEndpointInputSchemas.listWebhooks,
		output: EmeliaEndpointOutputSchemas.listWebhooks,
	},
	'webhooks.create': {
		input: EmeliaEndpointInputSchemas.createWebhook,
		output: EmeliaEndpointOutputSchemas.createWebhook,
	},
	'webhooks.remove': {
		input: EmeliaEndpointInputSchemas.deleteWebhook,
		output: EmeliaEndpointOutputSchemas.deleteWebhook,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof emeliaEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const emeliaEndpointMeta = {
	'account.me': {
		riskLevel: 'read',
		description: 'Retrieve authenticated Emelia account details',
	},
	'campaigns.list': {
		riskLevel: 'read',
		description: 'List all cold outreach campaigns',
	},
	'campaigns.addContact': {
		riskLevel: 'write',
		description: 'Add a contact to a campaign',
	},
	'campaigns.removeContact': {
		riskLevel: 'destructive',
		description: 'Remove a contact from a campaign',
	},
	'contacts.listLists': {
		riskLevel: 'read',
		description: 'List all contact lists',
	},
	'contacts.addToList': {
		riskLevel: 'write',
		description: 'Add a contact to a contact list',
	},
	'restCampaigns.create': {
		riskLevel: 'write',
		description: 'Create a new email campaign (REST)',
	},
	'restCampaigns.list': {
		riskLevel: 'read',
		description: 'List all email campaigns (REST)',
	},
	'restCampaigns.getActivities': {
		riskLevel: 'read',
		description: 'Retrieve activities for an email campaign',
	},
	'emailCampaigns.addContact': {
		riskLevel: 'write',
		description: 'Add a contact to an email campaign (legacy REST)',
	},
	'emailCampaigns.listContacts': {
		riskLevel: 'read',
		description: 'List contacts in an email campaign',
	},
	'emailCampaigns.deleteContact': {
		riskLevel: 'destructive',
		description: 'Remove a contact from an email campaign',
	},
	'blacklist.add': {
		riskLevel: 'write',
		description: 'Add a contact to the email blacklist',
	},
	'blacklist.remove': {
		riskLevel: 'write',
		description: 'Remove a contact from the email blacklist',
	},
	'linkedin.createCampaign': {
		riskLevel: 'write',
		description: 'Create a new LinkedIn campaign',
	},
	'linkedin.listCampaigns': {
		riskLevel: 'read',
		description: 'List all LinkedIn campaigns',
	},
	'linkedin.deleteContact': {
		riskLevel: 'destructive',
		description: 'Delete a contact from a LinkedIn campaign',
	},
	'linkedin.getActivities': {
		riskLevel: 'read',
		description: 'Retrieve activities for a LinkedIn campaign',
	},
	'tools.findEmailSingle': {
		riskLevel: 'write',
		description: 'Initiate a find-email job for a single contact',
	},
	'tools.getFindEmailResult': {
		riskLevel: 'read',
		description: 'Retrieve the result of a find-email job',
	},
	'tools.findPhoneSingle': {
		riskLevel: 'write',
		description: 'Initiate a phone-find job for a single contact',
	},
	'tools.getFindPhoneResult': {
		riskLevel: 'read',
		description: 'Retrieve the result of a phone-find job',
	},
	'tools.verifyEmailSingle': {
		riskLevel: 'write',
		description: 'Initiate an email verification job',
	},
	'tools.getVerifyEmailResult': {
		riskLevel: 'read',
		description: 'Retrieve the result of an email verification job',
	},
	'providers.list': {
		riskLevel: 'read',
		description: 'List all configured email providers',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List all webhooks',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Create a webhook for campaign events',
	},
	'webhooks.remove': {
		riskLevel: 'destructive',
		description: 'Delete a webhook by URL',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof emeliaEndpointsNested>;

export const emeliaAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseEmeliaPlugin<T extends EmeliaPluginOptions> = CorsairPlugin<
	'emelia',
	typeof EmeliaSchema,
	typeof emeliaEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalEmeliaPlugin = BaseEmeliaPlugin<EmeliaPluginOptions>;

export type ExternalEmeliaPlugin<T extends EmeliaPluginOptions> =
	BaseEmeliaPlugin<T>;

export function emelia<const T extends EmeliaPluginOptions>(
	incomingOptions: EmeliaPluginOptions & T = {} as EmeliaPluginOptions & T,
): ExternalEmeliaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'emelia',
		authConfig: emeliaAuthConfig,
		schema: EmeliaSchema,
		options: options,
		hooks: options.hooks,
		endpoints: emeliaEndpointsNested,
		webhooks: {},
		endpointMeta: emeliaEndpointMeta,
		endpointSchemas: emeliaEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: EmeliaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalEmeliaPlugin;
}

export type {
	EmeliaEndpointInputs,
	EmeliaEndpointOutputs,
} from './endpoints/types';
