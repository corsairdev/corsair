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

/**
 * Options for configuring the Anonyflow plugin.
 */
export type AnonyflowPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAnonyflowPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof anonyflowEndpointsNested>;
};

/**
 * Corsair plugin context specialized for the Anonyflow plugin.
 */
export type AnonyflowContext = CorsairPluginContext<
	typeof AnonyflowSchema,
	AnonyflowPluginOptions
>;

/**
 * Key builder context for the Anonyflow plugin.
 */
export type AnonyflowKeyBuilderContext =
	KeyBuilderContext<AnonyflowPluginOptions>;

/**
 * Bound endpoints type representing all core operations.
 */
export type AnonyflowBoundEndpoints = BindEndpoints<
	typeof anonyflowEndpointsNested
>;

type AnonyflowEndpoint<K extends keyof AnonyflowEndpointOutputs> =
	CorsairEndpoint<
		AnonyflowContext,
		AnonyflowEndpointInputs[K],
		AnonyflowEndpointOutputs[K]
	>;

/**
 * Exposed API endpoints for the Anonyflow plugin.
 */
export type AnonyflowEndpoints = {
	anonymize: AnonyflowEndpoint<'anonymize'>;
	deanonymize: AnonyflowEndpoint<'deanonymize'>;
	anonymizePacket: AnonyflowEndpoint<'anonymizePacket'>;
	deanonymizePacket: AnonyflowEndpoint<'deanonymizePacket'>;
	getStatus: AnonyflowEndpoint<'getStatus'>;
};

const anonyflowEndpointsNested = {
	core: {
		anonymize: AnonyflowOperations.anonymize,
		deanonymize: AnonyflowOperations.deanonymize,
		anonymizePacket: AnonyflowOperations.anonymizePacket,
		deanonymizePacket: AnonyflowOperations.deanonymizePacket,
		getStatus: AnonyflowOperations.getStatus,
	},
} as const;

// Webhooks removed: Anonyflow does not use webhooks
const anonyflowWebhooksNested = {} as const;

/**
 * Endpoint schemas for each core Anonyflow operation.
 */
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
	'core.getStatus': {
		input: AnonyflowEndpointInputSchemas.getStatus,
		output: AnonyflowEndpointOutputSchemas.getStatus,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof anonyflowEndpointsNested
>;

const anonyflowWebhookSchemas = {} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const anonyflowEndpointMeta = {
	'core.anonymize': {
		riskLevel: 'write',
		description: 'Anonymize sensitive data in text',
	},
	'core.deanonymize': {
		riskLevel: 'read',
		description: 'Restore original text from anonymized mapping',
	},
	'core.anonymizePacket': {
		riskLevel: 'write',
		description: 'Encrypt field values within a data packet based on keys',
	},
	'core.deanonymizePacket': {
		riskLevel: 'read',
		description: 'Decrypt field values within a data packet based on keys',
	},
	'core.getStatus': {
		riskLevel: 'read',
		description: 'Get API key connectivity status',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof anonyflowEndpointsNested
>;

// OAuth removed: Only API Key is supported
export const anonyflowAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

/**
 * Base plugin type helper for Anonyflow.
 */
export type BaseAnonyflowPlugin<T extends AnonyflowPluginOptions> =
	CorsairPlugin<
		'anonyflow',
		typeof AnonyflowSchema,
		typeof anonyflowEndpointsNested,
		typeof anonyflowWebhooksNested,
		T,
		typeof defaultAuthType
	>;

/**
 * Internal plugin type for Anonyflow.
 */
export type InternalAnonyflowPlugin =
	BaseAnonyflowPlugin<AnonyflowPluginOptions>;

/**
 * External plugin type for Anonyflow.
 */
export type ExternalAnonyflowPlugin<T extends AnonyflowPluginOptions> =
	BaseAnonyflowPlugin<T>;

/**
 * Instantiates the Anonyflow plugin with configuration options.
 *
 * @template T Type of options extending AnonyflowPluginOptions.
 * @param incomingOptions Configuration options including API key and authType.
 * @returns The constructed Anonyflow plugin instance.
 */
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
		webhookSchemas: anonyflowWebhookSchemas as any,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		/**
		 * Resolves the API key for endpoints or webhooks based on integration options and context.
		 *
		 * @param ctx The builder context containing connection keys.
		 * @param source The calling source ('endpoint' or 'webhook').
		 * @returns A promise resolving to the API key string.
		 */
		keyBuilder: async (
			ctx: AnonyflowKeyBuilderContext,
			source: 'endpoint' | 'webhook',
		) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalAnonyflowPlugin;
}

export type {
	AnonyflowEndpointInputs,
	AnonyflowEndpointOutputs,
} from './endpoints/types';
