import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Image, Tasks, Video } from './endpoints';
import type {
	AlibabaEndpointInputs,
	AlibabaEndpointOutputs,
} from './endpoints/types';
import {
	AlibabaEndpointInputSchemas,
	AlibabaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AlibabaSchema } from './schema';

export type AlibabaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * API origin. Defaults to https://dashscope-intl.aliyuncs.com. Model Studio
	 * recommends the workspace domain, https://{WorkspaceId}.{region}.maas.aliyuncs.com
	 * (a trailing /api/v1 is accepted).
	 */
	baseUrl?: string;
	hooks?: InternalAlibabaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof alibabaEndpointsNested>;
};

export type AlibabaContext = CorsairPluginContext<
	typeof AlibabaSchema,
	AlibabaPluginOptions
>;

export type AlibabaKeyBuilderContext = KeyBuilderContext<AlibabaPluginOptions>;

export type AlibabaBoundEndpoints = BindEndpoints<
	typeof alibabaEndpointsNested
>;

type AlibabaEndpoint<K extends keyof AlibabaEndpointOutputs> = CorsairEndpoint<
	AlibabaContext,
	AlibabaEndpointInputs[K],
	AlibabaEndpointOutputs[K]
>;

export type AlibabaEndpoints = {
	imageGenerate: AlibabaEndpoint<'imageGenerate'>;
	videoTextToVideo: AlibabaEndpoint<'videoTextToVideo'>;
	videoImageToVideo: AlibabaEndpoint<'videoImageToVideo'>;
	videoReferenceToVideo: AlibabaEndpoint<'videoReferenceToVideo'>;
	videoEdit: AlibabaEndpoint<'videoEdit'>;
	tasksGet: AlibabaEndpoint<'tasksGet'>;
};

const alibabaEndpointsNested = {
	image: {
		generate: Image.generate,
	},
	video: {
		textToVideo: Video.textToVideo,
		imageToVideo: Video.imageToVideo,
		referenceToVideo: Video.referenceToVideo,
		edit: Video.edit,
	},
	tasks: {
		get: Tasks.get,
	},
} as const;

export const alibabaEndpointSchemas = {
	'image.generate': {
		input: AlibabaEndpointInputSchemas.imageGenerate,
		output: AlibabaEndpointOutputSchemas.imageGenerate,
	},
	'video.textToVideo': {
		input: AlibabaEndpointInputSchemas.videoTextToVideo,
		output: AlibabaEndpointOutputSchemas.videoTextToVideo,
	},
	'video.imageToVideo': {
		input: AlibabaEndpointInputSchemas.videoImageToVideo,
		output: AlibabaEndpointOutputSchemas.videoImageToVideo,
	},
	'video.referenceToVideo': {
		input: AlibabaEndpointInputSchemas.videoReferenceToVideo,
		output: AlibabaEndpointOutputSchemas.videoReferenceToVideo,
	},
	'video.edit': {
		input: AlibabaEndpointInputSchemas.videoEdit,
		output: AlibabaEndpointOutputSchemas.videoEdit,
	},
	'tasks.get': {
		input: AlibabaEndpointInputSchemas.tasksGet,
		output: AlibabaEndpointOutputSchemas.tasksGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof alibabaEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const alibabaEndpointMeta = {
	'image.generate': {
		riskLevel: 'write',
		description:
			'Generate or edit images with Qwen-Image 3.0 or Wan 2.7 Image; returns image URLs valid for 24 hours',
	},
	'video.textToVideo': {
		riskLevel: 'write',
		description:
			'Start a Wan text-to-video task (Wan 3.0 also takes reference media, files, and links); returns a task id',
	},
	'video.imageToVideo': {
		riskLevel: 'write',
		description:
			'Start a Wan 2.7 image-to-video task from a first frame, first and last frames, or a clip to continue',
	},
	'video.referenceToVideo': {
		riskLevel: 'write',
		description:
			'Start a Wan 2.7 reference-to-video task from reference images, videos, and voices',
	},
	'video.edit': {
		riskLevel: 'write',
		description: 'Start a Wan 2.7 video editing task on an input video',
	},
	'tasks.get': {
		riskLevel: 'read',
		description:
			'Get a generation task status and, once it succeeds, the video URL (valid 24 hours)',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof alibabaEndpointsNested>;

export type BaseAlibabaPlugin<T extends AlibabaPluginOptions> = CorsairPlugin<
	'alibaba',
	typeof AlibabaSchema,
	typeof alibabaEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalAlibabaPlugin = BaseAlibabaPlugin<AlibabaPluginOptions>;

export type ExternalAlibabaPlugin<T extends AlibabaPluginOptions> =
	BaseAlibabaPlugin<T>;

export function alibaba<const T extends AlibabaPluginOptions>(
	// Every option is optional, so an empty object is a valid default for T.
	incomingOptions: AlibabaPluginOptions & T = {} as AlibabaPluginOptions & T,
): ExternalAlibabaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'alibaba',
		schema: AlibabaSchema,
		options: options,
		hooks: options.hooks,
		endpoints: alibabaEndpointsNested,
		webhooks: {},
		endpointMeta: alibabaEndpointMeta,
		endpointSchemas: alibabaEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AlibabaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('alibaba', 'api_key');
		},
	} satisfies InternalAlibabaPlugin;
}

export type {
	AlibabaEndpointInputs,
	AlibabaEndpointOutputs,
	ImageGenerateInput,
	ImageGenerateResponse,
	ImageToVideoInput,
	ReferenceToVideoInput,
	Task,
	TaskGetInput,
	TextToVideoInput,
	VideoEditInput,
	VideoTaskCreated,
} from './endpoints/types';
export { IMAGE_MODELS } from './endpoints/types';
