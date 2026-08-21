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
import { Chat, Embeddings, Images, Models } from './endpoints';
import type {
	ApipieEndpointInputs,
	ApipieEndpointOutputs,
} from './endpoints/types';
import {
	ApipieEndpointInputSchemas,
	ApipieEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ApipieSchema } from './schema';

export type ApipiePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalApipiePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof apipieEndpointsNested>;
};

export type ApipieContext = CorsairPluginContext<
	typeof ApipieSchema,
	ApipiePluginOptions
>;

export type ApipieKeyBuilderContext = KeyBuilderContext<ApipiePluginOptions>;

export type ApipieBoundEndpoints = BindEndpoints<typeof apipieEndpointsNested>;

type ApipieEndpoint<K extends keyof ApipieEndpointOutputs> = CorsairEndpoint<
	ApipieContext,
	ApipieEndpointInputs[K],
	ApipieEndpointOutputs[K]
>;

export type ApipieEndpoints = {
	modelsList: ApipieEndpoint<'modelsList'>;
	modelsListDetailed: ApipieEndpoint<'modelsListDetailed'>;
	chatCreateCompletion: ApipieEndpoint<'chatCreateCompletion'>;
	embeddingsCreate: ApipieEndpoint<'embeddingsCreate'>;
	imagesGenerate: ApipieEndpoint<'imagesGenerate'>;
};

const apipieEndpointsNested = {
	models: {
		list: Models.list,
		listDetailed: Models.listDetailed,
	},
	chat: {
		createCompletion: Chat.createCompletion,
	},
	embeddings: {
		create: Embeddings.create,
	},
	images: {
		generate: Images.generate,
	},
} as const;

export const apipieEndpointSchemas = {
	'models.list': {
		input: ApipieEndpointInputSchemas.modelsList,
		output: ApipieEndpointOutputSchemas.modelsList,
	},
	'models.listDetailed': {
		input: ApipieEndpointInputSchemas.modelsListDetailed,
		output: ApipieEndpointOutputSchemas.modelsListDetailed,
	},
	'chat.createCompletion': {
		input: ApipieEndpointInputSchemas.chatCreateCompletion,
		output: ApipieEndpointOutputSchemas.chatCreateCompletion,
	},
	'embeddings.create': {
		input: ApipieEndpointInputSchemas.embeddingsCreate,
		output: ApipieEndpointOutputSchemas.embeddingsCreate,
	},
	'images.generate': {
		input: ApipieEndpointInputSchemas.imagesGenerate,
		output: ApipieEndpointOutputSchemas.imagesGenerate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof apipieEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const apipieEndpointMeta = {
	'models.list': {
		riskLevel: 'read',
		description:
			'List APIpie models available to the account, filterable by type, subtype, provider, and model.',
	},
	'models.listDetailed': {
		riskLevel: 'read',
		description:
			'List APIpie models with detailed metadata including capabilities, limits, and pricing.',
	},
	'chat.createCompletion': {
		riskLevel: 'write',
		description:
			'Generate a chat completion using an APIpie model, with optional provider routing and memory.',
	},
	'embeddings.create': {
		riskLevel: 'write',
		description: 'Create embeddings for the given input text(s).',
	},
	'images.generate': {
		riskLevel: 'write',
		description: 'Generate image(s) from a text prompt.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof apipieEndpointsNested>;

export const apipieAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseApipiePlugin<T extends ApipiePluginOptions> = CorsairPlugin<
	'apipie',
	typeof ApipieSchema,
	typeof apipieEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof apipieAuthConfig
>;

export type InternalApipiePlugin = BaseApipiePlugin<ApipiePluginOptions>;

export type ExternalApipiePlugin<T extends ApipiePluginOptions> =
	BaseApipiePlugin<T>;

export function apipie<const T extends ApipiePluginOptions>(
	incomingOptions: ApipiePluginOptions & T = {} as ApipiePluginOptions & T,
): ExternalApipiePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'apipie',
		schema: ApipieSchema,
		options,
		hooks: options.hooks,
		endpoints: apipieEndpointsNested,
		webhooks: {},
		endpointMeta: apipieEndpointMeta,
		endpointSchemas: apipieEndpointSchemas,
		authConfig: apipieAuthConfig,
		pluginWebhookMatcher: () => false,
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: ApipieKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('apipie', 'api_key');
				}
				return key;
			}

			throw new AuthMissingError('apipie', 'api_key');
		},
	} satisfies InternalApipiePlugin;
}

export type {
	ApipieEndpointInputs,
	ApipieEndpointOutputs,
} from './endpoints/types';

export {
	ApipieEndpointInputSchemas,
	ApipieEndpointOutputSchemas,
} from './endpoints/types';
