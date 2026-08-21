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
import { AuthMissingError } from 'corsair/core';
import { LinkedinDetails } from './endpoints';
import type {
	AeroleadsEndpointInputs,
	AeroleadsEndpointOutputs,
} from './endpoints/types';
import {
	AeroleadsEndpointInputSchemas,
	AeroleadsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AeroleadsSchema } from './schema';

export type AeroleadsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAeroleadsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof aeroleadsEndpointsNested>;
};

export type AeroleadsContext = CorsairPluginContext<
	typeof AeroleadsSchema,
	AeroleadsPluginOptions
>;

export type AeroleadsKeyBuilderContext =
	KeyBuilderContext<AeroleadsPluginOptions>;

export type AeroleadsBoundEndpoints = BindEndpoints<
	typeof aeroleadsEndpointsNested
>;

type AeroleadsEndpoint<K extends keyof AeroleadsEndpointOutputs> =
	CorsairEndpoint<
		AeroleadsContext,
		AeroleadsEndpointInputs[K],
		AeroleadsEndpointOutputs[K]
	>;

export type AeroleadsEndpoints = {
	linkedinDetailsGet: AeroleadsEndpoint<'linkedinDetailsGet'>;
};

const aeroleadsEndpointsNested = {
	linkedinDetails: {
		get: LinkedinDetails.get,
	},
} as const;

export const aeroleadsEndpointSchemas = {
	'linkedinDetails.get': {
		input: AeroleadsEndpointInputSchemas.linkedinDetailsGet,
		output: AeroleadsEndpointOutputSchemas.linkedinDetailsGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof aeroleadsEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const aeroleadsEndpointMeta = {
	'linkedinDetails.get': {
		riskLevel: 'read',
		description:
			'Retrieve detailed information about a prospect using their LinkedIn profile URL, including emails, phone numbers, job details, and company data',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof aeroleadsEndpointsNested
>;

export const aeroleadsAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAeroleadsPlugin<T extends AeroleadsPluginOptions> =
	CorsairPlugin<
		'aeroleads',
		typeof AeroleadsSchema,
		typeof aeroleadsEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalAeroleadsPlugin =
	BaseAeroleadsPlugin<AeroleadsPluginOptions>;

export type ExternalAeroleadsPlugin<T extends AeroleadsPluginOptions> =
	BaseAeroleadsPlugin<T>;

export function aeroleads<const T extends AeroleadsPluginOptions>(
	incomingOptions: AeroleadsPluginOptions & T = {} as AeroleadsPluginOptions &
		T,
): ExternalAeroleadsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'aeroleads',
		authConfig: aeroleadsAuthConfig,
		schema: AeroleadsSchema,
		options: options,
		hooks: options.hooks,
		endpoints: aeroleadsEndpointsNested,
		webhooks: {},
		endpointMeta: aeroleadsEndpointMeta,
		endpointSchemas: aeroleadsEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AeroleadsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys?.get_api_key();
				if (!res) {
					throw new AuthMissingError('aeroleads', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('aeroleads', 'api_key');
		},
	} satisfies InternalAeroleadsPlugin;
}

export type {
	AeroleadsEndpointInputs,
	AeroleadsEndpointOutputs,
	GetLinkedinDetailsInput,
	GetLinkedinDetailsResponse,
} from './endpoints/types';
