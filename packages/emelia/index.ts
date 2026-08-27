import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { Account, Campaigns, Contacts } from './endpoints';
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
import { CampaignWebhooks } from './webhooks';
import { resolveEmeliaOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchEmeliaTenantWebhook } from './webhooks/tenant-matcher';
import type {
	CampaignStatusUpdatedEvent,
	EmeliaWebhookOutputs,
} from './webhooks/types';
import { CampaignStatusUpdatedEventSchema } from './webhooks/types';

export type EmeliaPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalEmeliaPlugin['hooks'];
	webhookHooks?: InternalEmeliaPlugin['webhookHooks'];
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
};

type EmeliaWebhook<
	K extends keyof EmeliaWebhookOutputs,
	TEvent,
> = CorsairWebhook<EmeliaContext, TEvent, EmeliaWebhookOutputs[K]>;

export type EmeliaWebhooks = {
	campaignStatusUpdated: EmeliaWebhook<
		'campaignStatusUpdated',
		CampaignStatusUpdatedEvent
	>;
};

export type EmeliaBoundWebhooks = BindWebhooks<EmeliaWebhooks>;

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
} as const;

const emeliaWebhooksNested = {
	campaign: {
		statusUpdated: CampaignWebhooks.statusUpdated,
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
} as const satisfies RequiredPluginEndpointSchemas<
	typeof emeliaEndpointsNested
>;

const emeliaWebhookSchemas = {
	'campaign.statusUpdated': {
		description: 'Emelia campaign status updated event',
		payload: CampaignStatusUpdatedEventSchema,
		response: CampaignStatusUpdatedEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof emeliaWebhooksNested>;

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
} as const satisfies RequiredPluginEndpointMeta<typeof emeliaEndpointsNested>;

export const emeliaAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseEmeliaPlugin<T extends EmeliaPluginOptions> = CorsairPlugin<
	'emelia',
	typeof EmeliaSchema,
	typeof emeliaEndpointsNested,
	typeof emeliaWebhooksNested,
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
		webhookHooks: options.webhookHooks,
		endpoints: emeliaEndpointsNested,
		webhooks: emeliaWebhooksNested,
		endpointMeta: emeliaEndpointMeta,
		endpointSchemas: emeliaEndpointSchemas,
		webhookSchemas: emeliaWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return (
				'x-emelia-signature' in headers || 'x-webhook-signature' in headers
			);
		},
		pluginTenantWebhookMatcher: matchEmeliaTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveEmeliaOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: EmeliaKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
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
export type {
	CampaignStatusUpdatedEvent,
	EmeliaWebhookOutputs,
} from './webhooks/types';
