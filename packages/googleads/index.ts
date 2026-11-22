import type {
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
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import {
	AdGroupsEndpoints,
	CampaignBudgetsEndpoints,
	CampaignsEndpoints,
	CustomersEndpoints,
	GoogleAdsFieldsEndpoints,
	ReportingEndpoints,
} from './endpoints';
import type {
	GoogleAdsEndpointInputs,
	GoogleAdsEndpointOutputs,
} from './endpoints/types';
import {
	GoogleAdsEndpointInputSchemas,
	GoogleAdsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { GoogleAdsSchema } from './schema';

export type GoogleAdsPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	hooks?: InternalGoogleAdsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof googleAdsEndpointsNested>;
};

/**
 * Google Ads needs three values: the OAuth token (account), and the developer
 * token and optional manager customer ID (integration). The developer token
 * identifies the application, not the tenant, so it belongs on the integration.
 */
export const googleAdsAuthConfig = {
	oauth_2: {
		integration: ['developer_token', 'login_customer_id'] as const,
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type GoogleAdsContext = CorsairPluginContext<
	typeof GoogleAdsSchema,
	GoogleAdsPluginOptions,
	undefined,
	typeof googleAdsAuthConfig
>;

export type GoogleAdsKeyBuilderContext = KeyBuilderContext<
	GoogleAdsPluginOptions,
	typeof googleAdsAuthConfig
>;

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
	search: GoogleAdsEndpoint<'search'>;
	searchStream: GoogleAdsEndpoint<'searchStream'>;
	mutate: GoogleAdsEndpoint<'mutate'>;
	campaignsCreate: GoogleAdsEndpoint<'campaignsCreate'>;
	campaignsUpdate: GoogleAdsEndpoint<'campaignsUpdate'>;
	campaignsRemove: GoogleAdsEndpoint<'campaignsRemove'>;
	campaignBudgetsCreate: GoogleAdsEndpoint<'campaignBudgetsCreate'>;
	campaignBudgetsUpdate: GoogleAdsEndpoint<'campaignBudgetsUpdate'>;
	adGroupsCreate: GoogleAdsEndpoint<'adGroupsCreate'>;
	adGroupsUpdate: GoogleAdsEndpoint<'adGroupsUpdate'>;
	customersUpdate: GoogleAdsEndpoint<'customersUpdate'>;
	customersListAccessible: GoogleAdsEndpoint<'customersListAccessible'>;
	googleAdsFieldsSearch: GoogleAdsEndpoint<'googleAdsFieldsSearch'>;
};

const googleAdsEndpointsNested = {
	reporting: ReportingEndpoints,
	campaigns: CampaignsEndpoints,
	campaignBudgets: CampaignBudgetsEndpoints,
	adGroups: AdGroupsEndpoints,
	customers: CustomersEndpoints,
	googleAdsFields: GoogleAdsFieldsEndpoints,
} as const;

export const googleAdsEndpointSchemas = {
	'reporting.search': {
		input: GoogleAdsEndpointInputSchemas.search,
		output: GoogleAdsEndpointOutputSchemas.search,
	},
	'reporting.searchStream': {
		input: GoogleAdsEndpointInputSchemas.searchStream,
		output: GoogleAdsEndpointOutputSchemas.searchStream,
	},
	'reporting.mutate': {
		input: GoogleAdsEndpointInputSchemas.mutate,
		output: GoogleAdsEndpointOutputSchemas.mutate,
	},
	'campaigns.create': {
		input: GoogleAdsEndpointInputSchemas.campaignsCreate,
		output: GoogleAdsEndpointOutputSchemas.campaignsCreate,
	},
	'campaigns.update': {
		input: GoogleAdsEndpointInputSchemas.campaignsUpdate,
		output: GoogleAdsEndpointOutputSchemas.campaignsUpdate,
	},
	'campaigns.remove': {
		input: GoogleAdsEndpointInputSchemas.campaignsRemove,
		output: GoogleAdsEndpointOutputSchemas.campaignsRemove,
	},
	'campaignBudgets.create': {
		input: GoogleAdsEndpointInputSchemas.campaignBudgetsCreate,
		output: GoogleAdsEndpointOutputSchemas.campaignBudgetsCreate,
	},
	'campaignBudgets.update': {
		input: GoogleAdsEndpointInputSchemas.campaignBudgetsUpdate,
		output: GoogleAdsEndpointOutputSchemas.campaignBudgetsUpdate,
	},
	'adGroups.create': {
		input: GoogleAdsEndpointInputSchemas.adGroupsCreate,
		output: GoogleAdsEndpointOutputSchemas.adGroupsCreate,
	},
	'adGroups.update': {
		input: GoogleAdsEndpointInputSchemas.adGroupsUpdate,
		output: GoogleAdsEndpointOutputSchemas.adGroupsUpdate,
	},
	'customers.update': {
		input: GoogleAdsEndpointInputSchemas.customersUpdate,
		output: GoogleAdsEndpointOutputSchemas.customersUpdate,
	},
	'customers.listAccessible': {
		input: GoogleAdsEndpointInputSchemas.customersListAccessible,
		output: GoogleAdsEndpointOutputSchemas.customersListAccessible,
	},
	'googleAdsFields.search': {
		input: GoogleAdsEndpointInputSchemas.googleAdsFieldsSearch,
		output: GoogleAdsEndpointOutputSchemas.googleAdsFieldsSearch,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof googleAdsEndpointsNested
>;

const defaultAuthType = 'oauth_2' as const;

const googleAdsEndpointMeta = {
	'reporting.search': {
		riskLevel: 'read',
		description:
			'Run a Google Ads Query Language statement and read its rows, 10,000 at a time',
	},
	'reporting.searchStream': {
		riskLevel: 'read',
		description:
			'Run a query and read the whole result set in one response, without paging',
	},
	// Destructive: one call can remove any entity, enable a campaign or change a
	// budget, and core cannot read the risk from the operation list.
	'reporting.mutate': {
		riskLevel: 'destructive',
		description:
			'Mutate any entity in one call: each entry names its own operation, and removing is permanent for that entity',
	},
	// Destructive: a new campaign defaults to ENABLED and starts spending.
	'campaigns.create': {
		riskLevel: 'destructive',
		description:
			'Create a campaign that starts serving and spending unless status is PAUSED, against an existing budget',
	},
	// Destructive: setting status to ENABLED starts spending.
	'campaigns.update': {
		riskLevel: 'destructive',
		description:
			"Change a campaign's name, status or dates; enabling it starts spending. updateMask names the fields that change",
	},
	'campaigns.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Remove a campaign: its status becomes REMOVED and it cannot be restored, only recreated as a new campaign',
	},
	'campaignBudgets.create': {
		riskLevel: 'write',
		description: 'Create a campaign budget in micros of the account currency',
	},
	// Destructive: the amount is what the campaigns using the budget may spend.
	'campaignBudgets.update': {
		riskLevel: 'destructive',
		description:
			'Change a budget amount or name, which changes how much the campaigns using it can spend',
	},
	'adGroups.create': {
		riskLevel: 'write',
		description: 'Create an ad group inside an existing campaign',
	},
	// Destructive: re-enabling an ad group or raising its bid changes spend.
	'adGroups.update': {
		riskLevel: 'destructive',
		description:
			"Change an ad group's name, status or default CPC bid, which can change spend; updateMask names the fields that change",
	},
	'customers.update': {
		riskLevel: 'write',
		description:
			'Update the account record itself: auto-tagging, final URL suffix and call reporting',
	},
	'customers.listAccessible': {
		riskLevel: 'read',
		description:
			'List the accounts the credentials can call, which is how a caller finds a customer ID',
	},
	'googleAdsFields.search': {
		riskLevel: 'read',
		description:
			'Search the queryable fields, which is how a caller finds what a GAQL statement may select',
	},
} satisfies RequiredPluginEndpointMeta<typeof googleAdsEndpointsNested>;

export type BaseGoogleAdsPlugin<T extends GoogleAdsPluginOptions> =
	CorsairPlugin<
		'googleads',
		typeof GoogleAdsSchema,
		typeof googleAdsEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType,
		typeof googleAdsAuthConfig
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
		options,
		oauthConfig: {
			providerName: 'Google',
			authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
			tokenUrl: 'https://oauth2.googleapis.com/token',
			// The only scope Google Ads accepts; every method in v26 requires it.
			scopes: ['https://www.googleapis.com/auth/adwords'],
			authParams: { access_type: 'offline', prompt: 'consent' },
		},
		hooks: options.hooks,
		endpoints: googleAdsEndpointsNested,
		webhooks: {},
		endpointMeta: googleAdsEndpointMeta,
		endpointSchemas: googleAdsEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		// The token is the account's OAuth access token. The developer token is
		// read per call by the endpoints, because the binder resolves only this
		// one string into ctx.key.
		keyBuilder: async (ctx: GoogleAdsKeyBuilderContext) => {
			if (ctx.authType !== 'oauth_2') {
				throw new AuthMissingError('googleads', 'oauth_2');
			}
			return getOAuthAccessToken(ctx, {
				plugin: 'googleads',
				tokenUrl: 'https://oauth2.googleapis.com/token',
			});
		},
	} satisfies InternalGoogleAdsPlugin;
}

export type {
	GoogleAdsEndpointInputs,
	GoogleAdsEndpointOutputSchemas,
	GoogleAdsEndpointOutputs,
} from './endpoints/types';
export { GoogleAdsSchema } from './schema';
