import type {
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
import type { AuthTypes } from 'corsair/core';
import type {
	GoogleAdsEndpointInputs,
	GoogleAdsEndpointOutputs,
} from './endpoints/types';
import {
	GoogleAdsEndpointInputSchemas,
	GoogleAdsEndpointOutputSchemas,
} from './endpoints/types';
import type {
	GoogleAdsWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';
import { CampaignsEndpoints, CustomerListsEndpoints } from './endpoints';
import { GoogleAdsSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';
import { matchGoogleAdsTenantWebhook } from './webhooks/tenant-matcher';
import { resolveGoogleAdsOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';

export type GoogleAdsPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	/** Google Ads API developer token. Required for all API requests. */
	developerToken?: string;
	/** Login customer ID for manager account access (digits only, no dashes). Optional. */
	loginCustomerId?: string;
	webhookSecret?: string;
	hooks?: InternalGoogleAdsPlugin['hooks'];
	webhookHooks?: InternalGoogleAdsPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof googleAdsEndpointsNested>;
};

export type GoogleAdsContext = CorsairPluginContext<
	typeof GoogleAdsSchema,
	GoogleAdsPluginOptions
>;

export type GoogleAdsKeyBuilderContext =
	KeyBuilderContext<GoogleAdsPluginOptions>;

export type GoogleAdsBoundEndpoints = BindEndpoints<
	typeof googleAdsEndpointsNested
>;

type GoogleAdsEndpoint<K extends keyof GoogleAdsEndpointOutputs> =
	CorsairEndpoint<
		GoogleAdsContext,
		GoogleAdsEndpointInputs[K],
		GoogleAdsEndpointOutputs[K]
	>;

export type GoogleAdsEndpoints = {
	campaignsGetById: GoogleAdsEndpoint<'campaignsGetById'>;
	campaignsGetByName: GoogleAdsEndpoint<'campaignsGetByName'>;
	customerListsGetMany: GoogleAdsEndpoint<'customerListsGetMany'>;
	customerListsCreate: GoogleAdsEndpoint<'customerListsCreate'>;
	customerListsAddOrRemove: GoogleAdsEndpoint<'customerListsAddOrRemove'>;
};

type GoogleAdsWebhook<
	K extends keyof GoogleAdsWebhookOutputs,
	TEvent,
> = CorsairWebhook<GoogleAdsContext, TEvent, GoogleAdsWebhookOutputs[K]>;

export type GoogleAdsWebhooks = {
	example: GoogleAdsWebhook<'example', ExampleEvent>;
};

export type GoogleAdsBoundWebhooks = BindWebhooks<GoogleAdsWebhooks>;

const googleAdsEndpointsNested = {
	campaigns: {
		getById: CampaignsEndpoints.getById,
		getByName: CampaignsEndpoints.getByName,
	},
	customerLists: {
		getMany: CustomerListsEndpoints.getMany,
		create: CustomerListsEndpoints.create,
		addOrRemove: CustomerListsEndpoints.addOrRemove,
	},
} as const;

const googleAdsWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const googleAdsEndpointSchemas = {
	'campaigns.getById': {
		input: GoogleAdsEndpointInputSchemas.campaignsGetById,
		output: GoogleAdsEndpointOutputSchemas.campaignsGetById,
	},
	'campaigns.getByName': {
		input: GoogleAdsEndpointInputSchemas.campaignsGetByName,
		output: GoogleAdsEndpointOutputSchemas.campaignsGetByName,
	},
	'customerLists.getMany': {
		input: GoogleAdsEndpointInputSchemas.customerListsGetMany,
		output: GoogleAdsEndpointOutputSchemas.customerListsGetMany,
	},
	'customerLists.create': {
		input: GoogleAdsEndpointInputSchemas.customerListsCreate,
		output: GoogleAdsEndpointOutputSchemas.customerListsCreate,
	},
	'customerLists.addOrRemove': {
		input: GoogleAdsEndpointInputSchemas.customerListsAddOrRemove,
		output: GoogleAdsEndpointOutputSchemas.customerListsAddOrRemove,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof googleAdsEndpointsNested
>;

const googleAdsWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof googleAdsWebhooksNested
>;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

const googleAdsEndpointMeta = {
	'campaigns.getById': {
		riskLevel: 'read',
		description: 'Get a specific campaign by its ID',
	},
	'campaigns.getByName': {
		riskLevel: 'read',
		description: 'Get a campaign by its exact name',
	},
	'customerLists.getMany': {
		riskLevel: 'read',
		description: 'List all customer lists (audience segments)',
	},
	'customerLists.create': {
		riskLevel: 'write',
		description: 'Create a new customer list for audience targeting',
	},
	'customerLists.addOrRemove': {
		riskLevel: 'write',
		description:
			'Add or remove users from a customer list. Changes take 6-12 hours to reflect.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof googleAdsEndpointsNested
>;

export const googleAdsAuthConfig = {
	oauth_2: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGoogleAdsPlugin<T extends GoogleAdsPluginOptions> =
	CorsairPlugin<
		'googleads',
		typeof GoogleAdsSchema,
		typeof googleAdsEndpointsNested,
		typeof googleAdsWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalGoogleAdsPlugin =
	BaseGoogleAdsPlugin<GoogleAdsPluginOptions>;

export type ExternalGoogleAdsPlugin<T extends GoogleAdsPluginOptions> =
	BaseGoogleAdsPlugin<T>;

export function googleads<const T extends GoogleAdsPluginOptions>(
	incomingOptions: GoogleAdsPluginOptions & T = {} as GoogleAdsPluginOptions &
		T,
): ExternalGoogleAdsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'googleads',
		authConfig: googleAdsAuthConfig,
		schema: GoogleAdsSchema,
		options: options,
		oauthConfig: {
			providerName: 'Google',
			authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
			tokenUrl: 'https://oauth2.googleapis.com/token',
			scopes: ['https://www.googleapis.com/auth/adwords'],
			authParams: { access_type: 'offline', prompt: 'consent' },
		},
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: googleAdsEndpointsNested,
		webhooks: googleAdsWebhooksNested,
		endpointMeta: googleAdsEndpointMeta,
		endpointSchemas: googleAdsEndpointSchemas,
		webhookSchemas: googleAdsWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-googleads-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchGoogleAdsTenantWebhook,
		oauthWebhookTenantLinkResolver:
			resolveGoogleAdsOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GoogleAdsKeyBuilderContext, source) => {
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

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalGoogleAdsPlugin;
}

export type {
	ExampleEvent,
	GoogleAdsWebhookOutputs,
} from './webhooks/types';

export type {
	GoogleAdsEndpointInputs,
	GoogleAdsEndpointOutputs,
	CampaignsGetByIdInput,
	CampaignsGetByIdResponse,
	CampaignsGetByNameInput,
	CampaignsGetByNameResponse,
	CustomerListsGetManyInput,
	CustomerListsGetManyResponse,
	CustomerListsCreateInput,
	CustomerListsCreateResponse,
	CustomerListsAddOrRemoveInput,
	CustomerListsAddOrRemoveResponse,
} from './endpoints/types';
