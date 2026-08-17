import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
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
import { Example } from './endpoints';
import type {
	CollegeFootballDataEndpointInputs,
	CollegeFootballDataEndpointOutputs,
} from './endpoints/types';
import {
	CollegeFootballDataEndpointInputSchemas,
	CollegeFootballDataEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CollegeFootballDataSchema } from './schema';
import { resolveCollegeFootballDataOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchCollegeFootballDataTenantWebhook } from './webhooks/tenant-matcher';

/**
 * `TODO(scaffold)`: `example.get` is generator residue standing in for the
 * real 56-operation surface, kept only so this file typechecks while the
 * branch is a claim-securing scaffold - see `CFBD-PLAN.md`. Every real
 * operation, once built, is a GET with no request body (this API has no
 * writes at all).
 */
export type CollegeFootballDataPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCollegeFootballDataPlugin['hooks'];
	webhookHooks?: InternalCollegeFootballDataPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<
		typeof collegeFootballDataEndpointsNested
	>;
};

/**
 * No second credential: confirmed from the provider's OpenAPI document,
 * this API has no account/organization id concept at all, unlike this
 * repo's Harvest/Botpress/Mailtrap integrations.
 */
export const collegeFootballDataAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type CollegeFootballDataContext = CorsairPluginContext<
	typeof CollegeFootballDataSchema,
	CollegeFootballDataPluginOptions,
	undefined,
	typeof collegeFootballDataAuthConfig
>;

export type CollegeFootballDataKeyBuilderContext =
	KeyBuilderContext<CollegeFootballDataPluginOptions>;

export type CollegeFootballDataBoundEndpoints = BindEndpoints<
	typeof collegeFootballDataEndpointsNested
>;

type CollegeFootballDataEndpoint<
	K extends keyof CollegeFootballDataEndpointOutputs,
> = CorsairEndpoint<
	CollegeFootballDataContext,
	CollegeFootballDataEndpointInputs[K],
	CollegeFootballDataEndpointOutputs[K]
>;

export type CollegeFootballDataEndpoints = {
	exampleGet: CollegeFootballDataEndpoint<'exampleGet'>;
};

export type CollegeFootballDataWebhooks = Record<string, never>;

export type CollegeFootballDataBoundWebhooks =
	BindWebhooks<CollegeFootballDataWebhooks>;

const collegeFootballDataEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

/**
 * The OSS catalog for this integration lists zero triggers, and the
 * provider's API has no webhook capability at all - see
 * `webhooks/tenant-matcher.ts`.
 */
const collegeFootballDataWebhooksNested = {} as const;

export const collegeFootballDataEndpointSchemas = {
	'example.get': {
		input: CollegeFootballDataEndpointInputSchemas.exampleGet,
		output: CollegeFootballDataEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof collegeFootballDataEndpointsNested
>;

const collegeFootballDataWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof collegeFootballDataWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const collegeFootballDataEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof collegeFootballDataEndpointsNested
>;

export type BaseCollegeFootballDataPlugin<
	T extends CollegeFootballDataPluginOptions,
> = CorsairPlugin<
	'collegefootballdata',
	typeof CollegeFootballDataSchema,
	typeof collegeFootballDataEndpointsNested,
	typeof collegeFootballDataWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCollegeFootballDataPlugin =
	BaseCollegeFootballDataPlugin<CollegeFootballDataPluginOptions>;

export type ExternalCollegeFootballDataPlugin<
	T extends CollegeFootballDataPluginOptions,
> = BaseCollegeFootballDataPlugin<T>;

/**
 * Builds the College Football Data plugin.
 *
 * The provider authenticates with a single API key and has no OAuth flow -
 * confirmed from the OpenAPI document's `securitySchemes`, which declares
 * only `{ type: "http", scheme: "bearer" }` - so only `api_key` auth is
 * offered.
 */
export function collegefootballdata<
	const T extends CollegeFootballDataPluginOptions,
>(
	incomingOptions: CollegeFootballDataPluginOptions &
		T = {} as CollegeFootballDataPluginOptions & T,
): ExternalCollegeFootballDataPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'collegefootballdata',
		authConfig: collegeFootballDataAuthConfig,
		schema: CollegeFootballDataSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: collegeFootballDataEndpointsNested,
		webhooks: collegeFootballDataWebhooksNested,
		endpointMeta: collegeFootballDataEndpointMeta,
		endpointSchemas: collegeFootballDataEndpointSchemas,
		webhookSchemas: collegeFootballDataWebhookSchemas,
		pluginWebhookMatcher: () => false,
		pluginTenantWebhookMatcher: matchCollegeFootballDataTenantWebhook,
		oauthWebhookTenantLinkResolver:
			resolveCollegeFootballDataOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CollegeFootballDataKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalCollegeFootballDataPlugin;
}

export type {
	CollegeFootballDataEndpointInputs,
	CollegeFootballDataEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
export type { CollegeFootballDataWebhookOutputs } from './webhooks/types';
