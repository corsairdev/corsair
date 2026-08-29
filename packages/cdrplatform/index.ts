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
import { Cdr } from './endpoints';
import type {
	CdrPlatformEndpointInputs,
	CdrPlatformEndpointOutputs,
} from './endpoints/types';
import {
	CdrPlatformEndpointInputSchemas,
	CdrPlatformEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CdrPlatformSchema } from './schema';

export type CdrPlatformPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCdrPlatformPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof cdrPlatformEndpointsNested>;
};

export type CdrPlatformContext = CorsairPluginContext<
	typeof CdrPlatformSchema,
	CdrPlatformPluginOptions
>;

export type CdrPlatformKeyBuilderContext =
	KeyBuilderContext<CdrPlatformPluginOptions>;

export type CdrPlatformBoundEndpoints = BindEndpoints<
	typeof cdrPlatformEndpointsNested
>;

type CdrPlatformEndpoint<K extends keyof CdrPlatformEndpointOutputs> =
	CorsairEndpoint<
		CdrPlatformContext,
		CdrPlatformEndpointInputs[K],
		CdrPlatformEndpointOutputs[K]
	>;

export type CdrPlatformEndpoints = {
	price: CdrPlatformEndpoint<'price'>;
	purchase: CdrPlatformEndpoint<'purchase'>;
};

export type CdrPlatformWebhooks = {};

export type CdrPlatformBoundWebhooks = BindWebhooks<CdrPlatformWebhooks>;

const cdrPlatformEndpointsNested = {
	cdr: {
		price: Cdr.price,
		purchase: Cdr.purchase,
	},
} as const;

const cdrPlatformWebhooksNested = {} as const;

export const cdrPlatformEndpointSchemas = {
	'cdr.price': {
		input: CdrPlatformEndpointInputSchemas.price,
		output: CdrPlatformEndpointOutputSchemas.price,
	},

	'cdr.purchase': {
		input: CdrPlatformEndpointInputSchemas.purchase,
		output: CdrPlatformEndpointOutputSchemas.purchase,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof cdrPlatformEndpointsNested
>;

const cdrPlatformWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof cdrPlatformWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key';

const cdrPlatformEndpointMeta = {
	'cdr.price': {
		riskLevel: 'read',
		description: 'Calculate the price of carbon dioxide removal.',
	},

	'cdr.purchase': {
		riskLevel: 'write',
		description: 'Purchase carbon dioxide removal.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof cdrPlatformEndpointsNested
>;

export const cdrPlatformAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCdrPlatformPlugin<T extends CdrPlatformPluginOptions> =
	CorsairPlugin<
		'cdrplatform',
		typeof CdrPlatformSchema,
		typeof cdrPlatformEndpointsNested,
		typeof cdrPlatformWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalCdrPlatformPlugin =
	BaseCdrPlatformPlugin<CdrPlatformPluginOptions>;

export type ExternalCdrPlatformPlugin<T extends CdrPlatformPluginOptions> =
	BaseCdrPlatformPlugin<T>;

export function cdrplatform<const T extends CdrPlatformPluginOptions>(
	incomingOptions: CdrPlatformPluginOptions &
		T = {} as CdrPlatformPluginOptions & T,
): ExternalCdrPlatformPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'cdrplatform',
		authConfig: cdrPlatformAuthConfig,
		schema: CdrPlatformSchema,
		options,
		hooks: options.hooks,
		endpoints: cdrPlatformEndpointsNested,
		webhooks: cdrPlatformWebhooksNested,
		endpointMeta: cdrPlatformEndpointMeta,
		endpointSchemas: cdrPlatformEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (ctx: CdrPlatformKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				return res ?? '';
			}

			return '';
		},
	} satisfies InternalCdrPlatformPlugin;
}
