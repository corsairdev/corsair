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
import { AnonyflowOperations } from './endpoints';
import type {
	AnonyflowEndpointInputs,
	AnonyflowEndpointOutputs,
} from './endpoints/types';
import {
	AnonyflowEndpointInputSchemas,
	AnonyflowEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AnonyflowSchema } from './schema';

export type AnonyflowPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAnonyflowPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof anonyflowEndpointsNested>;
};

export type AnonyflowContext = CorsairPluginContext<
	typeof AnonyflowSchema,
	AnonyflowPluginOptions
>;

export type AnonyflowKeyBuilderContext =
	KeyBuilderContext<AnonyflowPluginOptions>;

export type AnonyflowBoundEndpoints = BindEndpoints<
	typeof anonyflowEndpointsNested
>;

type AnonyflowEndpoint<K extends keyof AnonyflowEndpointOutputs> =
	CorsairEndpoint<
		AnonyflowContext,
		AnonyflowEndpointInputs[K],
		AnonyflowEndpointOutputs[K]
	>;

export type AnonyflowEndpoints = {
	anonymize: AnonyflowEndpoint<'anonymize'>;
	deanonymize: AnonyflowEndpoint<'deanonymize'>;
	anonymizePacket: AnonyflowEndpoint<'anonymizePacket'>;
	deanonymizePacket: AnonyflowEndpoint<'deanonymizePacket'>;
	testConnection: AnonyflowEndpoint<'testConnection'>;
};

const anonyflowEndpointsNested = {
	core: {
		anonymize: AnonyflowOperations.anonymize,
		deanonymize: AnonyflowOperations.deanonymize,
		anonymizePacket: AnonyflowOperations.anonymizePacket,
		deanonymizePacket: AnonyflowOperations.deanonymizePacket,
		testConnection: AnonyflowOperations.testConnection,
	},
} as const;

const anonyflowWebhooksNested = {} as const;

export const anonyflowEndpointSchemas = {
	'core.anonymize': {
		input: AnonyflowEndpointInputSchemas.anonymize,
		output: AnonyflowEndpointOutputSchemas.anonymize,
	},
	'core.deanonymize': {
		input: AnonyflowEndpointInputSchemas.deanonymize,
		output: AnonyflowEndpointOutputSchemas.deanonymize,
	},
	'core.anonymizePacket': {
		input: AnonyflowEndpointInputSchemas.anonymizePacket,
		output: AnonyflowEndpointOutputSchemas.anonymizePacket,
	},
	'core.deanonymizePacket': {
		input: AnonyflowEndpointInputSchemas.deanonymizePacket,
		output: AnonyflowEndpointOutputSchemas.deanonymizePacket,
	},
	'core.testConnection': {
		input: AnonyflowEndpointInputSchemas.testConnection,
		output: AnonyflowEndpointOutputSchemas.testConnection,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof anonyflowEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const anonyflowEndpointMeta = {
	'core.anonymize': {
		riskLevel: 'write',
		description: 'Anonymize sensitive data in text',
	},
	'core.deanonymize': {
		riskLevel: 'write',
		description: 'Restore original text from anonymized mapping',
	},
	'core.anonymizePacket': {
		riskLevel: 'write',
		description: 'Encrypt field values within a data packet based on keys',
	},
	'core.deanonymizePacket': {
		riskLevel: 'write',
		description: 'Decrypt field values within a data packet based on keys',
	},
	'core.testConnection': {
		riskLevel: 'read',
		description: 'Verify API key and connectivity',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof anonyflowEndpointsNested
>;

export const anonyflowAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAnonyflowPlugin<T extends AnonyflowPluginOptions> =
	CorsairPlugin<
		'anonyflow',
		typeof AnonyflowSchema,
		typeof anonyflowEndpointsNested,
		typeof anonyflowWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalAnonyflowPlugin =
	BaseAnonyflowPlugin<AnonyflowPluginOptions>;

export type ExternalAnonyflowPlugin<T extends AnonyflowPluginOptions> =
	BaseAnonyflowPlugin<T>;

export function anonyflow<const T extends AnonyflowPluginOptions>(
	incomingOptions: AnonyflowPluginOptions & T = {} as AnonyflowPluginOptions &
		T,
): ExternalAnonyflowPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'anonyflow',
		authConfig: anonyflowAuthConfig,
		schema: AnonyflowSchema,
		options: options,
		hooks: options.hooks,
		endpoints: anonyflowEndpointsNested,
		webhooks: anonyflowWebhooksNested,
		endpointMeta: anonyflowEndpointMeta,
		endpointSchemas: anonyflowEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (
			ctx: AnonyflowKeyBuilderContext,
			source: 'endpoint' | 'webhook',
		) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) {
					return res;
				}
			}

			throw new AuthMissingError('anonyflow', 'api_key');
		},
	} satisfies InternalAnonyflowPlugin;
}

export type {
	AnonyflowEndpointInputs,
	AnonyflowEndpointOutputs,
} from './endpoints/types';
