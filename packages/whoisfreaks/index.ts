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
import { WhoisLive } from './endpoints';
import type {
	WhoisfreaksEndpointInputs,
	WhoisfreaksEndpointOutputs,
	WhoisLiveLookupV2Input,
	WhoisLiveLookupV2Response,
} from './endpoints/types';
import {
	WhoisfreaksEndpointInputSchemas,
	WhoisfreaksEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WhoisfreaksSchema } from './schema';

export type WhoisfreaksPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalWhoisfreaksPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof whoisfreaksEndpointsNested>;
};

export type WhoisfreaksContext = CorsairPluginContext<
	typeof WhoisfreaksSchema,
	WhoisfreaksPluginOptions
>;

export type WhoisfreaksKeyBuilderContext =
	KeyBuilderContext<WhoisfreaksPluginOptions>;

export type WhoisfreaksBoundEndpoints = BindEndpoints<
	typeof whoisfreaksEndpointsNested
>;

type WhoisfreaksEndpoint<K extends keyof WhoisfreaksEndpointOutputs> =
	CorsairEndpoint<
		WhoisfreaksContext,
		WhoisfreaksEndpointInputs[K],
		WhoisfreaksEndpointOutputs[K]
	>;

export type WhoisfreaksEndpoints = {
	whoisLiveLookupV2: WhoisfreaksEndpoint<'whoisLiveLookupV2'>;
};

const whoisfreaksEndpointsNested = {
	whoisLive: {
		lookupV2: WhoisLive.lookupV2,
	},
} as const;

/**
 * WhoisFreaks currently has no webhook/trigger operations.
 */
const whoisfreaksWebhooksNested = {} as const;

export const whoisfreaksEndpointSchemas = {
	'whoisLive.lookupV2': {
		input: WhoisfreaksEndpointInputSchemas.whoisLiveLookupV2,
		output: WhoisfreaksEndpointOutputSchemas.whoisLiveLookupV2,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof whoisfreaksEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';

const whoisfreaksEndpointMeta = {
	'whoisLive.lookupV2': {
		riskLevel: 'read',
		description: 'Fetch real-time WHOIS information for a domain',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof whoisfreaksEndpointsNested
>;

export const whoisfreaksAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseWhoisfreaksPlugin<T extends WhoisfreaksPluginOptions> =
	CorsairPlugin<
		'whoisfreaks',
		typeof WhoisfreaksSchema,
		typeof whoisfreaksEndpointsNested,
		typeof whoisfreaksWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalWhoisfreaksPlugin =
	BaseWhoisfreaksPlugin<WhoisfreaksPluginOptions>;

export type ExternalWhoisfreaksPlugin<T extends WhoisfreaksPluginOptions> =
	BaseWhoisfreaksPlugin<T>;

export function whoisfreaks<const T extends WhoisfreaksPluginOptions>(
	incomingOptions: WhoisfreaksPluginOptions &
		T = {} as WhoisfreaksPluginOptions & T,
): ExternalWhoisfreaksPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'whoisfreaks',
		authConfig: whoisfreaksAuthConfig,
		schema: WhoisfreaksSchema,
		options,
		hooks: options.hooks,
		endpoints: whoisfreaksEndpointsNested,
		webhooks: whoisfreaksWebhooksNested,
		endpointMeta: whoisfreaksEndpointMeta,
		endpointSchemas: whoisfreaksEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WhoisfreaksKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}

			return '';
		},
	} satisfies InternalWhoisfreaksPlugin;
}

export type {
	WhoisfreaksEndpointInputs,
	WhoisfreaksEndpointOutputs,
	WhoisLiveLookupV2Input,
	WhoisLiveLookupV2Response,
} from './endpoints/types';
