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
import { Account, Contacts, EmailCampaigns } from './endpoints';
import type {
	BrevoEndpointInputs,
	BrevoEndpointOutputs,
} from './endpoints/types';
import {
	BrevoEndpointInputSchemas,
	BrevoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BrevoSchema } from './schema';

export type BrevoPluginOptions = {
	/** Authentication method. Only api_key is supported. */
	authType?: PickAuth<'api_key'>;
	/** Optional: pass the API key directly (bypasses key manager) */
	key?: string;
	/** Optional: lifecycle hooks for endpoints */
	hooks?: InternalBrevoPlugin['hooks'];
	/** Optional: custom error handlers (merged with defaults) */
	errorHandlers?: CorsairErrorHandler;
	/** Permission configuration for the Brevo plugin. */
	permissions?: PluginPermissionsConfig<typeof brevoEndpointsNested>;
};

export type BrevoContext = CorsairPluginContext<
	typeof BrevoSchema,
	BrevoPluginOptions
>;

export type BrevoKeyBuilderContext = KeyBuilderContext<BrevoPluginOptions>;

export type BrevoBoundEndpoints = BindEndpoints<typeof brevoEndpointsNested>;

type BrevoEndpoint<K extends keyof BrevoEndpointOutputs> = CorsairEndpoint<
	BrevoContext,
	BrevoEndpointInputs[K],
	BrevoEndpointOutputs[K]
>;

export type BrevoEndpoints = {
	accountGet: BrevoEndpoint<'accountGet'>;
	contactsList: BrevoEndpoint<'contactsList'>;
	contactsGet: BrevoEndpoint<'contactsGet'>;
	contactsCreate: BrevoEndpoint<'contactsCreate'>;
	contactsUpdate: BrevoEndpoint<'contactsUpdate'>;
	contactsDelete: BrevoEndpoint<'contactsDelete'>;
	emailCampaignsList: BrevoEndpoint<'emailCampaignsList'>;
	emailCampaignsGet: BrevoEndpoint<'emailCampaignsGet'>;
	emailCampaignsCreate: BrevoEndpoint<'emailCampaignsCreate'>;
	emailCampaignsUpdate: BrevoEndpoint<'emailCampaignsUpdate'>;
	emailCampaignsDelete: BrevoEndpoint<'emailCampaignsDelete'>;
	emailCampaignsSendNow: BrevoEndpoint<'emailCampaignsSendNow'>;
	emailCampaignsSendTest: BrevoEndpoint<'emailCampaignsSendTest'>;
};

const brevoEndpointsNested = {
	account: {
		get: Account.get,
	},
	contacts: {
		list: Contacts.list,
		get: Contacts.get,
		create: Contacts.create,
		update: Contacts.update,
		delete: Contacts.deleteContact,
	},
	emailCampaigns: {
		list: EmailCampaigns.list,
		get: EmailCampaigns.get,
		create: EmailCampaigns.create,
		update: EmailCampaigns.update,
		delete: EmailCampaigns.deleteCampaign,
		sendNow: EmailCampaigns.sendNow,
		sendTest: EmailCampaigns.sendTest,
	},
} as const;

const brevoWebhooksNested = {} as const;

export const brevoEndpointSchemas = {
	'account.get': {
		input: BrevoEndpointInputSchemas.accountGet,
		output: BrevoEndpointOutputSchemas.accountGet,
	},
	'contacts.list': {
		input: BrevoEndpointInputSchemas.contactsList,
		output: BrevoEndpointOutputSchemas.contactsList,
	},
	'contacts.get': {
		input: BrevoEndpointInputSchemas.contactsGet,
		output: BrevoEndpointOutputSchemas.contactsGet,
	},
	'contacts.create': {
		input: BrevoEndpointInputSchemas.contactsCreate,
		output: BrevoEndpointOutputSchemas.contactsCreate,
	},
	'contacts.update': {
		input: BrevoEndpointInputSchemas.contactsUpdate,
		output: BrevoEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: BrevoEndpointInputSchemas.contactsDelete,
		output: BrevoEndpointOutputSchemas.contactsDelete,
	},
	'emailCampaigns.list': {
		input: BrevoEndpointInputSchemas.emailCampaignsList,
		output: BrevoEndpointOutputSchemas.emailCampaignsList,
	},
	'emailCampaigns.get': {
		input: BrevoEndpointInputSchemas.emailCampaignsGet,
		output: BrevoEndpointOutputSchemas.emailCampaignsGet,
	},
	'emailCampaigns.create': {
		input: BrevoEndpointInputSchemas.emailCampaignsCreate,
		output: BrevoEndpointOutputSchemas.emailCampaignsCreate,
	},
	'emailCampaigns.update': {
		input: BrevoEndpointInputSchemas.emailCampaignsUpdate,
		output: BrevoEndpointOutputSchemas.emailCampaignsUpdate,
	},
	'emailCampaigns.delete': {
		input: BrevoEndpointInputSchemas.emailCampaignsDelete,
		output: BrevoEndpointOutputSchemas.emailCampaignsDelete,
	},
	'emailCampaigns.sendNow': {
		input: BrevoEndpointInputSchemas.emailCampaignsSendNow,
		output: BrevoEndpointOutputSchemas.emailCampaignsSendNow,
	},
	'emailCampaigns.sendTest': {
		input: BrevoEndpointInputSchemas.emailCampaignsSendTest,
		output: BrevoEndpointOutputSchemas.emailCampaignsSendTest,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof brevoEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const brevoEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description: 'Get Brevo account details, plans, and relay settings',
	},
	'contacts.list': {
		riskLevel: 'read',
		description: 'List Brevo contacts with filtering and pagination',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Get a Brevo contact by ID or email identifier',
	},
	'contacts.create': {
		riskLevel: 'write',
		description: 'Create a new Brevo contact',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update an existing Brevo contact by ID or email identifier',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a Brevo contact [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'emailCampaigns.list': {
		riskLevel: 'read',
		description: 'List Brevo email campaigns with filtering and pagination',
	},
	'emailCampaigns.get': {
		riskLevel: 'read',
		description: 'Get a Brevo email campaign by campaign ID',
	},
	'emailCampaigns.create': {
		riskLevel: 'write',
		description: 'Create a new Brevo email campaign',
	},
	'emailCampaigns.update': {
		riskLevel: 'write',
		description: 'Update an existing Brevo email campaign',
	},
	'emailCampaigns.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a Brevo email campaign [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'emailCampaigns.sendNow': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Send a Brevo email campaign immediately',
	},
	'emailCampaigns.sendTest': {
		riskLevel: 'write',
		description: 'Send a test email for a Brevo email campaign',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof brevoEndpointsNested>;

export const brevoAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BaseBrevoPlugin<T extends BrevoPluginOptions> = CorsairPlugin<
	'brevo',
	typeof BrevoSchema,
	typeof brevoEndpointsNested,
	typeof brevoWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalBrevoPlugin = BaseBrevoPlugin<BrevoPluginOptions>;

export type ExternalBrevoPlugin<T extends BrevoPluginOptions> =
	BaseBrevoPlugin<T>;

export function brevo<const T extends BrevoPluginOptions>(
	incomingOptions: BrevoPluginOptions & T = {} as BrevoPluginOptions & T,
): ExternalBrevoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'brevo',
		authConfig: brevoAuthConfig,
		schema: BrevoSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: brevoEndpointsNested,
		webhooks: brevoWebhooksNested,
		endpointMeta: brevoEndpointMeta,
		endpointSchemas: brevoEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: BrevoKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('brevo', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('brevo', 'api_key');
		},
	} satisfies InternalBrevoPlugin;
}

export type {
	AccountGetInput,
	AccountGetResponse,
	BrevoEndpointInputs,
	BrevoEndpointOutputs,
	CampaignItem,
	Contact,
	ContactsCreateInput,
	ContactsCreateResponse,
	ContactsDeleteInput,
	ContactsDeleteResponse,
	ContactsGetInput,
	ContactsGetResponse,
	ContactsListInput,
	ContactsListResponse,
	ContactsUpdateInput,
	ContactsUpdateResponse,
	EmailCampaignsCreateInput,
	EmailCampaignsCreateResponse,
	EmailCampaignsDeleteInput,
	EmailCampaignsDeleteResponse,
	EmailCampaignsGetInput,
	EmailCampaignsGetResponse,
	EmailCampaignsListInput,
	EmailCampaignsListResponse,
	EmailCampaignsSendNowInput,
	EmailCampaignsSendNowResponse,
	EmailCampaignsSendTestInput,
	EmailCampaignsSendTestResponse,
	EmailCampaignsUpdateInput,
	EmailCampaignsUpdateResponse,
} from './endpoints/types';
