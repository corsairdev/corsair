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
import { AuthMissingError } from 'corsair/core';
import { Cdr, Certificate, Health } from './endpoints';
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
	certificateGet: CdrPlatformEndpoint<'certificateGet'>;
	healthCheck: CdrPlatformEndpoint<'healthCheck'>;
};

export type CdrPlatformWebhooks = {};

export type CdrPlatformBoundWebhooks = BindWebhooks<CdrPlatformWebhooks>;

const cdrPlatformEndpointsNested = {
	cdr: {
		price: Cdr.price,
		purchase: Cdr.purchase,
	},
	certificate: {
		get: Certificate.get,
	},
	health: {
		check: Health.check,
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
	'certificate.get': {
		input: CdrPlatformEndpointInputSchemas.certificateGet,
		output: CdrPlatformEndpointOutputSchemas.certificateGet,
	},
	'health.check': {
		input: CdrPlatformEndpointInputSchemas.healthCheck,
		output: CdrPlatformEndpointOutputSchemas.healthCheck,
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
		description: 'Calculate CO2 removal pricing for a method portfolio.',
	},
	'cdr.purchase': {
		riskLevel: 'write',
		description:
			'Create a CO2 removal purchase request and return its transaction UUID.',
	},
	'certificate.get': {
		riskLevel: 'read',
		description: 'Retrieve a removal certificate by certificate ID.',
	},
	'health.check': {
		riskLevel: 'read',
		description: 'Check CDR Platform API health status.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof cdrPlatformEndpointsNested
>;

export const cdrPlatformAuthConfig = {
	api_key: {},
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
		webhookSchemas: cdrPlatformWebhookSchemas,
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
				if (!res) {
					throw new AuthMissingError('cdrplatform', 'api_key');
				}

				return res;
			}

			throw new AuthMissingError('cdrplatform', 'api_key');
		},
	} satisfies InternalCdrPlatformPlugin;
}
