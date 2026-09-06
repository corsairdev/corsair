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
import type {
	WriterEndpointInputs,
	WriterEndpointOutputs,
} from './endpoints/types';
import {
	WriterEndpointInputSchemas,
	WriterEndpointOutputSchemas,
} from './endpoints/types';
import { createChat, createCompletion, listModels } from './endpoints/writer';
import { errorHandlers } from './error-handlers';
import { WriterSchema } from './schema';

export type WriterPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalWriterPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof writerEndpointsNested>;
};

export type WriterContext = CorsairPluginContext<
	typeof WriterSchema,
	WriterPluginOptions
>;

export type WriterKeyBuilderContext = KeyBuilderContext<WriterPluginOptions>;

export type WriterBoundEndpoints = BindEndpoints<typeof writerEndpointsNested>;

type WriterEndpoint<K extends keyof WriterEndpointOutputs> = CorsairEndpoint<
	WriterContext,
	WriterEndpointInputs[K],
	WriterEndpointOutputs[K]
>;

export type WriterEndpoints = {
	listModels: WriterEndpoint<'listModels'>;
	createCompletion: WriterEndpoint<'createCompletion'>;
	createChat: WriterEndpoint<'createChat'>;
};

export type BindedWriterEndpoints = BindEndpoints<typeof writerEndpointsNested>;

const writerEndpointsNested = {
	models: {
		list: listModels,
	},
	completions: {
		create: createCompletion,
	},
	chat: {
		create: createChat,
	},
} as const;

export const writerEndpointSchemas = {
	'models.list': {
		input: WriterEndpointInputSchemas.listModels,
		output: WriterEndpointOutputSchemas.listModels,
	},
	'completions.create': {
		input: WriterEndpointInputSchemas.createCompletion,
		output: WriterEndpointOutputSchemas.createCompletion,
	},
	'chat.create': {
		input: WriterEndpointInputSchemas.createChat,
		output: WriterEndpointOutputSchemas.createChat,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof writerEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';

const writerEndpointMeta = {
	'models.list': {
		riskLevel: 'read',
		description: 'List available Writer models',
	},
	'completions.create': {
		riskLevel: 'write',
		description: 'Generate text using the Writer completion API',
	},
	'chat.create': {
		riskLevel: 'write',
		description: 'Generate a conversational response using Writer',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof writerEndpointsNested>;

export const writerAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseWriterPlugin<T extends WriterPluginOptions> = CorsairPlugin<
	'writer',
	typeof WriterSchema,
	typeof writerEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalWriterPlugin = BaseWriterPlugin<WriterPluginOptions>;

export type ExternalWriterPlugin<T extends WriterPluginOptions> =
	BaseWriterPlugin<T>;

export function writer<const T extends WriterPluginOptions>(
	incomingOptions: WriterPluginOptions & T = {} as WriterPluginOptions & T,
): ExternalWriterPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'writer',
		authConfig: writerAuthConfig,
		schema: WriterSchema,
		options,
		hooks: options.hooks,
		endpoints: writerEndpointsNested,
		webhooks: {},
		endpointMeta: writerEndpointMeta,
		endpointSchemas: writerEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WriterKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}
			return '';
		},
	} satisfies InternalWriterPlugin;
}

export type {
	WriterEndpointInputs,
	WriterEndpointOutputs,
} from './endpoints/types';
