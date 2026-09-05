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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Contacts,
	Lists,
	Messages,
	Reports,
	Signup,
	Webforms,
} from './endpoints';
import type {
	CampaynEndpointInputs,
	CampaynEndpointOutputs,
} from './endpoints/types';
import {
	CampaynEndpointInputSchemas,
	CampaynEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CampaynSchema } from './schema';

export type CampaynPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCampaynPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof campaynEndpointsNested>;
};

export type CampaynContext = CorsairPluginContext<
	typeof CampaynSchema,
	CampaynPluginOptions
>;

export type CampaynKeyBuilderContext = KeyBuilderContext<CampaynPluginOptions>;

export type CampaynBoundEndpoints = BindEndpoints<
	typeof campaynEndpointsNested
>;

type CampaynEndpoint<K extends keyof CampaynEndpointOutputs> = CorsairEndpoint<
	CampaynContext,
	CampaynEndpointInputs[K],
	CampaynEndpointOutputs[K]
>;

export type CampaynEndpoints = {
	getLists: CampaynEndpoint<'getLists'>;
	updateList: CampaynEndpoint<'updateList'>;
	deleteList: CampaynEndpoint<'deleteList'>;
	getContacts: CampaynEndpoint<'getContacts'>;
	getContact: CampaynEndpoint<'getContact'>;
	createContact: CampaynEndpoint<'createContact'>;
	deleteContact: CampaynEndpoint<'deleteContact'>;
	unsubscribeContact: CampaynEndpoint<'unsubscribeContact'>;
	getMessages: CampaynEndpoint<'getMessages'>;
	getMessageStatistics: CampaynEndpoint<'getMessageStatistics'>;
	getReports: CampaynEndpoint<'getReports'>;
	getWebforms: CampaynEndpoint<'getWebforms'>;
	getWebform: CampaynEndpoint<'getWebform'>;
	deleteWebform: CampaynEndpoint<'deleteWebform'>;
	signup: CampaynEndpoint<'signup'>;
};

const campaynEndpointsNested = {
	lists: {
		getLists: Lists.getLists,
		updateList: Lists.updateList,
		deleteList: Lists.deleteList,
	},
	contacts: {
		getContacts: Contacts.getContacts,
		getContact: Contacts.getContact,
		createContact: Contacts.createContact,
		deleteContact: Contacts.deleteContact,
		unsubscribeContact: Contacts.unsubscribeContact,
	},
	messages: {
		getMessages: Messages.getMessages,
		getMessageStatistics: Messages.getMessageStatistics,
	},
	reports: {
		getReports: Reports.getReports,
	},
	webforms: {
		getWebforms: Webforms.getWebforms,
		getWebform: Webforms.getWebform,
		deleteWebform: Webforms.deleteWebform,
	},
	signup: {
		signup: Signup.signup,
	},
} as const;

const campaynWebhooksNested = {} as const;

export const campaynEndpointSchemas = {
	'lists.getLists': {
		input: CampaynEndpointInputSchemas.getLists,
		output: CampaynEndpointOutputSchemas.getLists,
	},
	'lists.updateList': {
		input: CampaynEndpointInputSchemas.updateList,
		output: CampaynEndpointOutputSchemas.updateList,
	},
	'lists.deleteList': {
		input: CampaynEndpointInputSchemas.deleteList,
		output: CampaynEndpointOutputSchemas.deleteList,
	},
	'contacts.getContacts': {
		input: CampaynEndpointInputSchemas.getContacts,
		output: CampaynEndpointOutputSchemas.getContacts,
	},
	'contacts.getContact': {
		input: CampaynEndpointInputSchemas.getContact,
		output: CampaynEndpointOutputSchemas.getContact,
	},
	'contacts.createContact': {
		input: CampaynEndpointInputSchemas.createContact,
		output: CampaynEndpointOutputSchemas.createContact,
	},
	'contacts.deleteContact': {
		input: CampaynEndpointInputSchemas.deleteContact,
		output: CampaynEndpointOutputSchemas.deleteContact,
	},
	'contacts.unsubscribeContact': {
		input: CampaynEndpointInputSchemas.unsubscribeContact,
		output: CampaynEndpointOutputSchemas.unsubscribeContact,
	},
	'messages.getMessages': {
		input: CampaynEndpointInputSchemas.getMessages,
		output: CampaynEndpointOutputSchemas.getMessages,
	},
	'messages.getMessageStatistics': {
		input: CampaynEndpointInputSchemas.getMessageStatistics,
		output: CampaynEndpointOutputSchemas.getMessageStatistics,
	},
	'reports.getReports': {
		input: CampaynEndpointInputSchemas.getReports,
		output: CampaynEndpointOutputSchemas.getReports,
	},
	'webforms.getWebforms': {
		input: CampaynEndpointInputSchemas.getWebforms,
		output: CampaynEndpointOutputSchemas.getWebforms,
	},
	'webforms.getWebform': {
		input: CampaynEndpointInputSchemas.getWebform,
		output: CampaynEndpointOutputSchemas.getWebform,
	},
	'webforms.deleteWebform': {
		input: CampaynEndpointInputSchemas.deleteWebform,
		output: CampaynEndpointOutputSchemas.deleteWebform,
	},
	'signup.signup': {
		input: CampaynEndpointInputSchemas.signup,
		output: CampaynEndpointOutputSchemas.signup,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof campaynEndpointsNested
>;

const campaynWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof campaynWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const campaynEndpointMeta = {
	'lists.getLists': {
		riskLevel: 'read',
		description: 'List all contact lists visible to the authenticated user.',
	},
	'lists.updateList': {
		riskLevel: 'write',
		description: 'Update a contact list name or tags by list ID.',
	},
	'lists.deleteList': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a contact list by list ID.',
	},
	'contacts.getContacts': {
		riskLevel: 'read',
		description:
			'List contacts for a contact list, with optional contact keyword filtering.',
	},
	'contacts.getContact': {
		riskLevel: 'read',
		description: 'Get full contact details by contact ID.',
	},
	'contacts.createContact': {
		riskLevel: 'write',
		description: 'Create a new contact in a contact list.',
	},
	'contacts.deleteContact': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a contact by contact ID.',
	},
	'contacts.unsubscribeContact': {
		riskLevel: 'write',
		description:
			'Unsubscribe contacts from a list by contact ID or by email address.',
	},
	'messages.getMessages': {
		riskLevel: 'read',
		description: 'List messages visible to the authenticated user.',
	},
	'messages.getMessageStatistics': {
		riskLevel: 'read',
		description: 'Get message statistics for a specific message ID.',
	},
	'reports.getReports': {
		riskLevel: 'read',
		description:
			'Get report calendar entries for sent and scheduled emails, optionally filtered by Unix timestamp range.',
	},
	'webforms.getWebforms': {
		riskLevel: 'read',
		description:
			'List webforms for a contact list, with optional form type filter.',
	},
	'webforms.getWebform': {
		riskLevel: 'read',
		description: 'Get a webform by list ID and webform ID.',
	},
	'webforms.deleteWebform': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a webform by list ID and webform ID.',
	},
	'signup.signup': {
		riskLevel: 'write',
		description:
			'Sign up a new Campayn user account. This endpoint requires API-key authorization for signup action.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof campaynEndpointsNested>;

export const campaynAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseCampaynPlugin<T extends CampaynPluginOptions> = CorsairPlugin<
	'campayn',
	typeof CampaynSchema,
	typeof campaynEndpointsNested,
	typeof campaynWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCampaynPlugin = BaseCampaynPlugin<CampaynPluginOptions>;

export type ExternalCampaynPlugin<T extends CampaynPluginOptions> =
	BaseCampaynPlugin<T>;

export function campayn<const T extends CampaynPluginOptions>(
	incomingOptions: CampaynPluginOptions & T = {} as CampaynPluginOptions & T,
): ExternalCampaynPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'campayn',
		authConfig: campaynAuthConfig,
		schema: CampaynSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: campaynEndpointsNested,
		webhooks: campaynWebhooksNested,
		endpointMeta: campaynEndpointMeta,
		endpointSchemas: campaynEndpointSchemas,
		webhookSchemas: campaynWebhookSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CampaynKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('campayn', 'api_key');
				}

				return res;
			}

			throw new AuthMissingError('campayn', 'api_key');
		},
	} satisfies InternalCampaynPlugin;
}

export type {
	CampaynEndpointInputs,
	CampaynEndpointOutputs,
	CreateContactInput,
	CreateContactResponse,
	DeleteContactInput,
	DeleteContactResponse,
	DeleteListInput,
	DeleteListResponse,
	DeleteWebformInput,
	DeleteWebformResponse,
	GetContactInput,
	GetContactResponse,
	GetContactsInput,
	GetContactsResponse,
	GetListsInput,
	GetListsResponse,
	GetMessageStatisticsInput,
	GetMessageStatisticsResponse,
	GetMessagesInput,
	GetMessagesResponse,
	GetReportsInput,
	GetReportsResponse,
	GetWebformInput,
	GetWebformResponse,
	GetWebformsInput,
	GetWebformsResponse,
	SignupInput,
	SignupResponseOutput,
	UnsubscribeContactInput,
	UnsubscribeContactResponse,
	UpdateListInput,
	UpdateListResponse,
} from './endpoints/types';
