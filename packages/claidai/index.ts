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
import {
	backgroundGenerate,
	backgroundRemove,
	createStorage,
	generativeResize,
	imageAiEdit,
	imageEditBatch,
	imageGenerate,
	licensePlateBlur,
	patchStorage,
	polishImage,
	smartFrame,
	storageDetails,
	storageList,
	storageTypes,
} from './endpoints';
import type {
	ClaidAiEndpointInputs,
	ClaidAiEndpointOutputs,
} from './endpoints/types';
import {
	ClaidAiEndpointInputSchemas,
	ClaidAiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ClaidAiSchema } from './schema';

export type ClaidAiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalClaidAiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof claidAiEndpointsNested>;
};

export type ClaidAiContext = CorsairPluginContext<
	typeof ClaidAiSchema,
	ClaidAiPluginOptions
>;

export type ClaidAiKeyBuilderContext = KeyBuilderContext<ClaidAiPluginOptions>;

export type ClaidAiBoundEndpoints = BindEndpoints<
	typeof claidAiEndpointsNested
>;

type ClaidAiEndpoint<K extends keyof ClaidAiEndpointOutputs> = CorsairEndpoint<
	ClaidAiContext,
	ClaidAiEndpointInputs[K],
	ClaidAiEndpointOutputs[K]
>;

export type ClaidAiEndpoints = {
	backgroundRemove: ClaidAiEndpoint<'backgroundRemove'>;
	imageEditBatch: ClaidAiEndpoint<'imageEditBatch'>;
	licensePlateBlur: ClaidAiEndpoint<'licensePlateBlur'>;
	smartFrame: ClaidAiEndpoint<'smartFrame'>;
	createStorage: ClaidAiEndpoint<'createStorage'>;
	backgroundGenerate: ClaidAiEndpoint<'backgroundGenerate'>;
	imageGenerate: ClaidAiEndpoint<'imageGenerate'>;
	generativeResize: ClaidAiEndpoint<'generativeResize'>;
	storageDetails: ClaidAiEndpoint<'storageDetails'>;
	imageAiEdit: ClaidAiEndpoint<'imageAiEdit'>;
	storageList: ClaidAiEndpoint<'storageList'>;
	polishImage: ClaidAiEndpoint<'polishImage'>;
	patchStorage: ClaidAiEndpoint<'patchStorage'>;
	storageTypes: ClaidAiEndpoint<'storageTypes'>;
};

const claidAiEndpointsNested = {
	backgroundRemove,
	imageEditBatch,
	licensePlateBlur,
	smartFrame,
	createStorage,
	backgroundGenerate,
	imageGenerate,
	generativeResize,
	storageDetails,
	imageAiEdit,
	storageList,
	polishImage,
	patchStorage,
	storageTypes,
} as const;

export const claidAiEndpointSchemas = {
	backgroundRemove: {
		input: ClaidAiEndpointInputSchemas.backgroundRemove,
		output: ClaidAiEndpointOutputSchemas.backgroundRemove,
	},
	imageEditBatch: {
		input: ClaidAiEndpointInputSchemas.imageEditBatch,
		output: ClaidAiEndpointOutputSchemas.imageEditBatch,
	},
	licensePlateBlur: {
		input: ClaidAiEndpointInputSchemas.licensePlateBlur,
		output: ClaidAiEndpointOutputSchemas.licensePlateBlur,
	},
	smartFrame: {
		input: ClaidAiEndpointInputSchemas.smartFrame,
		output: ClaidAiEndpointOutputSchemas.smartFrame,
	},
	createStorage: {
		input: ClaidAiEndpointInputSchemas.createStorage,
		output: ClaidAiEndpointOutputSchemas.createStorage,
	},
	backgroundGenerate: {
		input: ClaidAiEndpointInputSchemas.backgroundGenerate,
		output: ClaidAiEndpointOutputSchemas.backgroundGenerate,
	},
	imageGenerate: {
		input: ClaidAiEndpointInputSchemas.imageGenerate,
		output: ClaidAiEndpointOutputSchemas.imageGenerate,
	},
	generativeResize: {
		input: ClaidAiEndpointInputSchemas.generativeResize,
		output: ClaidAiEndpointOutputSchemas.generativeResize,
	},
	storageDetails: {
		input: ClaidAiEndpointInputSchemas.storageDetails,
		output: ClaidAiEndpointOutputSchemas.storageDetails,
	},
	imageAiEdit: {
		input: ClaidAiEndpointInputSchemas.imageAiEdit,
		output: ClaidAiEndpointOutputSchemas.imageAiEdit,
	},
	storageList: {
		input: ClaidAiEndpointInputSchemas.storageList,
		output: ClaidAiEndpointOutputSchemas.storageList,
	},
	polishImage: {
		input: ClaidAiEndpointInputSchemas.polishImage,
		output: ClaidAiEndpointOutputSchemas.polishImage,
	},
	patchStorage: {
		input: ClaidAiEndpointInputSchemas.patchStorage,
		output: ClaidAiEndpointOutputSchemas.patchStorage,
	},
	storageTypes: {
		input: ClaidAiEndpointInputSchemas.storageTypes,
		output: ClaidAiEndpointOutputSchemas.storageTypes,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof claidAiEndpointsNested
>;

const claidAiEndpointMeta = {
	backgroundRemove: {
		riskLevel: 'write',
		description: 'Remove the background from an image using Claid.ai.',
	},
	imageEditBatch: {
		riskLevel: 'write',
		description: 'Process multiple images using Claid.ai.',
	},
	licensePlateBlur: {
		riskLevel: 'write',
		description: 'Detect and blur license plates in an image.',
	},
	smartFrame: {
		riskLevel: 'write',
		description: 'Place an image inside a smart frame.',
	},
	createStorage: {
		riskLevel: 'write',
		description: 'Create a Claid.ai storage connection.',
	},
	backgroundGenerate: {
		riskLevel: 'write',
		description: 'Generate an AI background for an image.',
	},
	imageGenerate: {
		riskLevel: 'write',
		description: 'Generate an image using Claid.ai.',
	},
	generativeResize: {
		riskLevel: 'write',
		description: 'Resize an image using generative expansion.',
	},
	storageDetails: {
		riskLevel: 'read',
		description: 'Get details of a Claid.ai storage connection.',
	},
	imageAiEdit: {
		riskLevel: 'write',
		description: 'Submit an AI image editing task.',
	},
	storageList: {
		riskLevel: 'read',
		description: 'List Claid.ai storage connections.',
	},
	polishImage: {
		riskLevel: 'write',
		description: 'Polish and restore an image.',
	},
	patchStorage: {
		riskLevel: 'write',
		description: 'Update a Claid.ai storage connection.',
	},
	storageTypes: {
		riskLevel: 'read',
		description: 'List supported Claid.ai storage types.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof claidAiEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key';

export const claidAiAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseClaidAiPlugin<T extends ClaidAiPluginOptions> = CorsairPlugin<
	'claidai',
	typeof ClaidAiSchema,
	typeof claidAiEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalClaidAiPlugin = BaseClaidAiPlugin<ClaidAiPluginOptions>;

export type ExternalClaidAiPlugin<T extends ClaidAiPluginOptions> =
	BaseClaidAiPlugin<T>;

export function claidai<const T extends ClaidAiPluginOptions>(
	incomingOptions: ClaidAiPluginOptions & T = {} as ClaidAiPluginOptions & T,
): ExternalClaidAiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'claidai',
		authConfig: claidAiAuthConfig,
		schema: ClaidAiSchema,
		options,
		hooks: options.hooks,
		endpoints: claidAiEndpointsNested,
		webhooks: {},
		endpointMeta: claidAiEndpointMeta,
		endpointSchemas: claidAiEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ClaidAiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalClaidAiPlugin;
}

export type {
	ClaidAiEndpointInputs,
	ClaidAiEndpointOutputs,
} from './endpoints/types';
