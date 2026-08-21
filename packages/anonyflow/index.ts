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
	analyze: AnonyflowEndpoint<'analyze'>;
	listEntities: AnonyflowEndpoint<'listEntities'>;
	getStatus: AnonyflowEndpoint<'getStatus'>;
};

const anonyflowEndpointsNested = {
	core: {
		anonymize: AnonyflowOperations.anonymize,
		deanonymize: AnonyflowOperations.deanonymize,
		analyze: AnonyflowOperations.analyze,
		listEntities: AnonyflowOperations.listEntities,
		getStatus: AnonyflowOperations.getStatus,
	},
} as const;

// Webhooks removed: Anonyflow does not use webhooks
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
	'core.analyze': {
		input: AnonyflowEndpointInputSchemas.analyze,
		output: AnonyflowEndpointOutputSchemas.analyze,
	},
	'core.listEntities': {
		input: AnonyflowEndpointInputSchemas.listEntities,
		output: AnonyflowEndpointOutputSchemas.listEntities,
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
	'core.analyze': {
		riskLevel: 'read',
		description: 'Analyze text for PII entities',
	},
	'core.listEntities': {
		riskLevel: 'read',
		description: 'List supported PII entities',
	},
	'core.getStatus': {
		riskLevel: 'read',
		description: 'Get API status and remaining credits',
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
		webhookSchemas: anonyflowWebhookSchemas as any,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (
			ctx: AnonyflowKeyBuilderContext,
			source: 'endpoint' | 'webhook',
		) => {
			// Simplified strictly for API Key resolution
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
