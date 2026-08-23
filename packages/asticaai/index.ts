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
import { AnalyzeAudio, ReadText } from './endpoints';
import type {
	AsticaAiEndpointInputs,
	AsticaAiEndpointOutputs,
} from './endpoints/types';
import {
	AsticaAiEndpointInputSchemas,
	AsticaAiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AsticaAiSchema } from './schema';

export type AsticaAiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAsticaAiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof asticaAiEndpointsNested>;
};

export type AsticaAiContext = CorsairPluginContext<
	typeof AsticaAiSchema,
	AsticaAiPluginOptions
>;

export type AsticaAiKeyBuilderContext =
	KeyBuilderContext<AsticaAiPluginOptions>;

export type AsticaAiBoundEndpoints = BindEndpoints<
	typeof asticaAiEndpointsNested
>;

type AsticaAiEndpoint<K extends keyof AsticaAiEndpointOutputs> =
	CorsairEndpoint<
		AsticaAiContext,
		AsticaAiEndpointInputs[K],
		AsticaAiEndpointOutputs[K]
	>;

export type AsticaAiEndpoints = {
	readText: AsticaAiEndpoint<'readText'>;
	analyzeAudio: AsticaAiEndpoint<'analyzeAudio'>;
};

const asticaAiEndpointsNested = {
	readText: {
		read: ReadText.read,
	},
	analyzeAudio: {
		analyze: AnalyzeAudio.analyze,
	},
} as const;

const asticaAiWebhooksNested = {} as const;

export const asticaAiEndpointSchemas = {
	'readText.read': {
		input: AsticaAiEndpointInputSchemas.readText,
		output: AsticaAiEndpointOutputSchemas.readText,
	},
	'analyzeAudio.analyze': {
		input: AsticaAiEndpointInputSchemas.analyzeAudio,
		output: AsticaAiEndpointOutputSchemas.analyzeAudio,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof asticaAiEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const asticaAiEndpointMeta = {
	'readText.read': {
		riskLevel: 'read',
		description: 'Extract text from an image using Astica OCR.',
	},
	'analyzeAudio.analyze': {
		riskLevel: 'read',
		description: 'Transcribe audio using Astica speech-to-text.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof asticaAiEndpointsNested>;

export const asticaAiAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAsticaAiPlugin<T extends AsticaAiPluginOptions> = CorsairPlugin<
	'asticaai',
	typeof AsticaAiSchema,
	typeof asticaAiEndpointsNested,
	typeof asticaAiWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAsticaAiPlugin = BaseAsticaAiPlugin<AsticaAiPluginOptions>;

export type ExternalAsticaAiPlugin<T extends AsticaAiPluginOptions> =
	BaseAsticaAiPlugin<T>;

export function asticaai<const T extends AsticaAiPluginOptions>(
	incomingOptions: AsticaAiPluginOptions & T = {} as AsticaAiPluginOptions & T,
): ExternalAsticaAiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'asticaai',
		authConfig: asticaAiAuthConfig,
		schema: AsticaAiSchema,
		options: options,
		hooks: options.hooks,
		endpoints: asticaAiEndpointsNested,
		webhooks: asticaAiWebhooksNested,
		endpointMeta: asticaAiEndpointMeta,
		endpointSchemas: asticaAiEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AsticaAiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();

				if (!key) {
					throw new AuthMissingError('asticaai', 'api_key');
				}

				return key;
			}

			throw new AuthMissingError('asticaai', 'api_key');
		},
	} satisfies InternalAsticaAiPlugin;
}

export type {
	AsticaAiEndpointInputs,
	AsticaAiEndpointOutputs,
} from './endpoints/types';
