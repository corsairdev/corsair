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
		description:
			'Tool to retrieve all contact lists. Use when you need to fetch available lists before performing list-specific actions. Example prompt: "List all my contact lists".',
	},
	'lists.updateList': {
		riskLevel: 'write',
		description:
			'Tool to update a contact list. Use after confirming list ID and desired changes. Example: Update list 123 name to "Newsletter Subscribers".',
	},
	'lists.deleteList': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Tool to delete a specific contact list. Use when cleaning up unused lists after confirming they are no longer needed. Example: "Delete list 123".',
	},
	'contacts.getContacts': {
		riskLevel: 'read',
		description:
			'Retrieves all contacts from a specific contact list in Campayn. Returns contact details including email, name, address, and confirmation status. Use "Get Lists" action first to obtain the list_id. Supports optional filtering by contact name/email/company.',
	},
	'contacts.getContact': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a specific contact by ID. Use when you need to fetch full contact details after confirming the contact ID.',
	},
	'contacts.createContact': {
		riskLevel: 'write',
		description:
			'Tool to create a new contact in a specific list. Use when you need to add a contact after gathering details.',
	},
	'contacts.deleteContact': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Tool to delete a specific contact. Use when you need to remove a contact permanently after confirming it should be deleted. Example: "Delete contact 123".',
	},
	'contacts.unsubscribeContact': {
		riskLevel: 'write',
		description:
			'Tool to unsubscribe contacts from a list by contact id or email address. Use when you need to remove contacts from a mailing list. If id is provided, only that specific contact will be unsubscribed. If email is provided, all contacts on that list with that email will be unsubscribed.',
	},
	'messages.getMessages': {
		riskLevel: 'read',
		description:
			'Tool to retrieve all email messages. Use when you need to list all messages visible to the authenticated user.',
	},
	'messages.getMessageStatistics': {
		riskLevel: 'read',
		description:
			'Tool to retrieve engagement statistics for a specific email message by ID. Returns views, positive responses (clicks), and negative responses (unsubscribes/bounces). Use GET_MESSAGES first to get the list of available message IDs.',
	},
	'reports.getReports': {
		riskLevel: 'read',
		description:
			'Tool to retrieve report URLs and metadata for sent and scheduled emails. Use when you need to fetch email delivery data, optionally filtered by a date range (Unix timestamp in seconds, UTC). Note: scheduled emails will have report_url set to null.',
	},
	'webforms.getWebforms': {
		riskLevel: 'read',
		description:
			'Tool to retrieve all webforms for a specific contact list. Use when you need to list forms after confirming the list ID. Example prompt: "List all webforms in list 123".',
	},
	'webforms.getWebform': {
		riskLevel: 'read',
		description:
			'Tool to retrieve details of a specific webform by ID. Use after confirming the webform ID when you need to fetch form details like title, type, HTML, and signup count. Example: "Get webform 1550".',
	},
	'webforms.deleteWebform': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a specific webform from a contact list. Use this to permanently remove a webform that is no longer needed. Requires both the list_id and webform_id - use Get Webforms action first to find these values. Note: The API returns success even for non-existent webform IDs (idempotent delete behavior).',
	},
	'signup.signup': {
		riskLevel: 'write',
		description:
			'Create a Campayn account via POST /signup on the site root (not /api/v1).',
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
