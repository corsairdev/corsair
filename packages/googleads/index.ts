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
import { CampaignsEndpoints, CustomerListsEndpoints } from './endpoints';
import type {
	GoogleAdsEndpointInputs,
	GoogleAdsEndpointOutputs,
} from './endpoints/types';
import {
	GoogleAdsEndpointInputSchemas,
	GoogleAdsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GoogleAdsSchema } from './schema';

export type GoogleAdsPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	/** Google Ads API developer token. Required for all API requests. */
	developerToken?: string;
	/** Login customer ID for manager account access (digits only, no dashes). Optional. */
	loginCustomerId?: string;
	hooks?: InternalGoogleAdsPlugin['hooks'];
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
		never,
		T,
		typeof defaultAuthType
	>;

export type InternalGoogleAdsPlugin =
	BaseGoogleAdsPlugin<GoogleAdsPluginOptions>;

export type ExternalGoogleAdsPlugin<T extends GoogleAdsPluginOptions> =
	BaseGoogleAdsPlugin<T>;

export function googleads<const T extends GoogleAdsPluginOptions>(
	// `{} as GoogleAdsPluginOptions & T` is needed here because TypeScript cannot infer
	// that an empty object satisfies the generic `T extends GoogleAdsPluginOptions` constraint
	// when no argument is provided. All required fields have defaults, so this is safe.
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
		endpoints: googleAdsEndpointsNested,
		endpointMeta: googleAdsEndpointMeta,
		endpointSchemas: googleAdsEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: GoogleAdsKeyBuilderContext, source) => {
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
	CampaignsGetByIdInput,
	CampaignsGetByIdResponse,
	CampaignsGetByNameInput,
	CampaignsGetByNameResponse,
	CustomerListsAddOrRemoveInput,
	CustomerListsAddOrRemoveResponse,
	CustomerListsCreateInput,
	CustomerListsCreateResponse,
	CustomerListsGetManyInput,
	CustomerListsGetManyResponse,
	GoogleAdsEndpointInputs,
	GoogleAdsEndpointOutputs,
} from './endpoints/types';
