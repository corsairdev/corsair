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
import { Jobs } from './endpoints';
import type {
	RevAIEndpointInputs,
	RevAIEndpointOutputs,
} from './endpoints/types';
import {
	RevAIEndpointInputSchemas,
	RevAIEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { RevAISchema } from './schema';

export type RevAIPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	hooks?: InternalRevAIPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof revAIEndpointsNested>;
};

export type RevAIContext = CorsairPluginContext<
	typeof RevAISchema,
	RevAIPluginOptions
>;

export type RevAIKeyBuilderContext = KeyBuilderContext<RevAIPluginOptions>;

export type RevAIBoundEndpoints = BindEndpoints<typeof revAIEndpointsNested>;

type RevAIEndpoint<K extends keyof RevAIEndpointOutputs> = CorsairEndpoint<
	RevAIContext,
	RevAIEndpointInputs[K],
	RevAIEndpointOutputs[K]
>;

export type RevAIEndpoints = {
	submitJob: RevAIEndpoint<'submitJob'>;
	getJob: RevAIEndpoint<'getJob'>;
	getTranscript: RevAIEndpoint<'getTranscript'>;
};

const revAIEndpointsNested = {
	jobs: Jobs,
} as const;

export const revAIEndpointSchemas = {
	'jobs.submitJob': {
		input: RevAIEndpointInputSchemas.submitJob,
		output: RevAIEndpointOutputSchemas.submitJob,
	},
	'jobs.getJob': {
		input: RevAIEndpointInputSchemas.getJob,
		output: RevAIEndpointOutputSchemas.getJob,
	},
	'jobs.getTranscript': {
		input: RevAIEndpointInputSchemas.getTranscript,
		output: RevAIEndpointOutputSchemas.getTranscript,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof revAIEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const revAIEndpointMeta = {
	'jobs.submitJob': {
		riskLevel: 'write',
		description: 'Submit an async job',
	},
	'jobs.getJob': {
		riskLevel: 'read',
		description: 'Get an async job',
	},
	'jobs.getTranscript': {
		riskLevel: 'read',
		description: 'Get transcript of a job',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof revAIEndpointsNested>;

export const revAIAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseRevAIPlugin<T extends RevAIPluginOptions> = CorsairPlugin<
	'revai',
	typeof RevAISchema,
	typeof revAIEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalRevAIPlugin = BaseRevAIPlugin<RevAIPluginOptions>;

export type ExternalRevAIPlugin<T extends RevAIPluginOptions> =
	BaseRevAIPlugin<T>;

export function revai<const T extends RevAIPluginOptions>(
	incomingOptions: RevAIPluginOptions & T = {} as RevAIPluginOptions & T,
): ExternalRevAIPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'revai',
		authConfig: revAIAuthConfig,
		schema: RevAISchema,
		options: options,
		hooks: options.hooks,
		endpoints: revAIEndpointsNested,
		webhooks: {},
		endpointMeta: revAIEndpointMeta,
		endpointSchemas: revAIEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: RevAIKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalRevAIPlugin;
}

export type {
	GetJobInput,
	GetTranscriptInput,
	JobResponse,
	RevAIEndpointInputs,
	RevAIEndpointOutputs,
	SubmitJobInput,
	TranscriptResponse,
} from './endpoints/types';
