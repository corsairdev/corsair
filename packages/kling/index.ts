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
import { tryGetStoredKey } from './client';
import {
	ImageGeneration,
	ImageToVideo,
	LipSync,
	MotionControl,
	MultiImageToImage,
	OmniImage,
	OmniVideo,
	Outpainting,
	TextToVideo,
	VideoEffects,
	VirtualTryOn,
} from './endpoints';
import type {
	KlingEndpointInputs,
	KlingEndpointOutputs,
} from './endpoints/types';
import {
	KlingEndpointInputSchemas,
	KlingEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { KlingSchema } from './schema';

export type KlingPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalKlingPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof klingEndpointsNested>;
};

export type KlingContext = CorsairPluginContext<
	typeof KlingSchema,
	KlingPluginOptions
>;

export type KlingKeyBuilderContext = KeyBuilderContext<KlingPluginOptions>;

export type KlingBoundEndpoints = BindEndpoints<typeof klingEndpointsNested>;

type KlingEndpoint<K extends keyof KlingEndpointOutputs> = CorsairEndpoint<
	KlingContext,
	KlingEndpointInputs[K],
	KlingEndpointOutputs[K]
>;

export type KlingEndpoints = {
	textToVideo: {
		create: KlingEndpoint<'textToVideoCreate'>;
		get: KlingEndpoint<'textToVideoGet'>;
		list: KlingEndpoint<'textToVideoList'>;
	};
	imageToVideo: {
		create: KlingEndpoint<'imageToVideoCreate'>;
		get: KlingEndpoint<'imageToVideoGet'>;
		list: KlingEndpoint<'imageToVideoList'>;
	};
	omniVideo: {
		create: KlingEndpoint<'omniVideoCreate'>;
		get: KlingEndpoint<'omniVideoGet'>;
		list: KlingEndpoint<'omniVideoList'>;
	};
	motionControl: {
		create: KlingEndpoint<'motionControlCreate'>;
		get: KlingEndpoint<'motionControlGet'>;
		list: KlingEndpoint<'motionControlList'>;
	};
	imageGeneration: {
		create: KlingEndpoint<'imageGenerationCreate'>;
		get: KlingEndpoint<'imageGenerationGet'>;
		list: KlingEndpoint<'imageGenerationList'>;
	};
	multiImageToImage: {
		create: KlingEndpoint<'multiImageToImageCreate'>;
		get: KlingEndpoint<'multiImageToImageGet'>;
		list: KlingEndpoint<'multiImageToImageList'>;
	};
	omniImage: {
		create: KlingEndpoint<'omniImageCreate'>;
		get: KlingEndpoint<'omniImageGet'>;
		list: KlingEndpoint<'omniImageList'>;
	};
	outpainting: {
		create: KlingEndpoint<'outpaintingCreate'>;
		get: KlingEndpoint<'outpaintingGet'>;
		list: KlingEndpoint<'outpaintingList'>;
	};
	lipSync: {
		detectFace: KlingEndpoint<'lipSyncDetectFace'>;
		create: KlingEndpoint<'lipSyncCreate'>;
		get: KlingEndpoint<'lipSyncGet'>;
		list: KlingEndpoint<'lipSyncList'>;
	};
	videoEffects: {
		create: KlingEndpoint<'videoEffectsCreate'>;
		get: KlingEndpoint<'videoEffectsGet'>;
		list: KlingEndpoint<'videoEffectsList'>;
	};
	virtualTryOn: {
		create: KlingEndpoint<'virtualTryOnCreate'>;
		get: KlingEndpoint<'virtualTryOnGet'>;
		list: KlingEndpoint<'virtualTryOnList'>;
	};
};

const klingEndpointsNested = {
	textToVideo: TextToVideo,
	imageToVideo: ImageToVideo,
	omniVideo: OmniVideo,
	motionControl: MotionControl,
	imageGeneration: ImageGeneration,
	multiImageToImage: MultiImageToImage,
	omniImage: OmniImage,
	outpainting: Outpainting,
	lipSync: LipSync,
	videoEffects: VideoEffects,
	virtualTryOn: VirtualTryOn,
} as const;

export const klingEndpointSchemas = {
	'textToVideo.create': {
		input: KlingEndpointInputSchemas.textToVideoCreate,
		output: KlingEndpointOutputSchemas.textToVideoCreate,
	},
	'textToVideo.get': {
		input: KlingEndpointInputSchemas.textToVideoGet,
		output: KlingEndpointOutputSchemas.textToVideoGet,
	},
	'textToVideo.list': {
		input: KlingEndpointInputSchemas.textToVideoList,
		output: KlingEndpointOutputSchemas.textToVideoList,
	},
	'imageToVideo.create': {
		input: KlingEndpointInputSchemas.imageToVideoCreate,
		output: KlingEndpointOutputSchemas.imageToVideoCreate,
	},
	'imageToVideo.get': {
		input: KlingEndpointInputSchemas.imageToVideoGet,
		output: KlingEndpointOutputSchemas.imageToVideoGet,
	},
	'imageToVideo.list': {
		input: KlingEndpointInputSchemas.imageToVideoList,
		output: KlingEndpointOutputSchemas.imageToVideoList,
	},
	'omniVideo.create': {
		input: KlingEndpointInputSchemas.omniVideoCreate,
		output: KlingEndpointOutputSchemas.omniVideoCreate,
	},
	'omniVideo.get': {
		input: KlingEndpointInputSchemas.omniVideoGet,
		output: KlingEndpointOutputSchemas.omniVideoGet,
	},
	'omniVideo.list': {
		input: KlingEndpointInputSchemas.omniVideoList,
		output: KlingEndpointOutputSchemas.omniVideoList,
	},
	'motionControl.create': {
		input: KlingEndpointInputSchemas.motionControlCreate,
		output: KlingEndpointOutputSchemas.motionControlCreate,
	},
	'motionControl.get': {
		input: KlingEndpointInputSchemas.motionControlGet,
		output: KlingEndpointOutputSchemas.motionControlGet,
	},
	'motionControl.list': {
		input: KlingEndpointInputSchemas.motionControlList,
		output: KlingEndpointOutputSchemas.motionControlList,
	},
	'imageGeneration.create': {
		input: KlingEndpointInputSchemas.imageGenerationCreate,
		output: KlingEndpointOutputSchemas.imageGenerationCreate,
	},
	'imageGeneration.get': {
		input: KlingEndpointInputSchemas.imageGenerationGet,
		output: KlingEndpointOutputSchemas.imageGenerationGet,
	},
	'imageGeneration.list': {
		input: KlingEndpointInputSchemas.imageGenerationList,
		output: KlingEndpointOutputSchemas.imageGenerationList,
	},
	'multiImageToImage.create': {
		input: KlingEndpointInputSchemas.multiImageToImageCreate,
		output: KlingEndpointOutputSchemas.multiImageToImageCreate,
	},
	'multiImageToImage.get': {
		input: KlingEndpointInputSchemas.multiImageToImageGet,
		output: KlingEndpointOutputSchemas.multiImageToImageGet,
	},
	'multiImageToImage.list': {
		input: KlingEndpointInputSchemas.multiImageToImageList,
		output: KlingEndpointOutputSchemas.multiImageToImageList,
	},
	'omniImage.create': {
		input: KlingEndpointInputSchemas.omniImageCreate,
		output: KlingEndpointOutputSchemas.omniImageCreate,
	},
	'omniImage.get': {
		input: KlingEndpointInputSchemas.omniImageGet,
		output: KlingEndpointOutputSchemas.omniImageGet,
	},
	'omniImage.list': {
		input: KlingEndpointInputSchemas.omniImageList,
		output: KlingEndpointOutputSchemas.omniImageList,
	},
	'outpainting.create': {
		input: KlingEndpointInputSchemas.outpaintingCreate,
		output: KlingEndpointOutputSchemas.outpaintingCreate,
	},
	'outpainting.get': {
		input: KlingEndpointInputSchemas.outpaintingGet,
		output: KlingEndpointOutputSchemas.outpaintingGet,
	},
	'outpainting.list': {
		input: KlingEndpointInputSchemas.outpaintingList,
		output: KlingEndpointOutputSchemas.outpaintingList,
	},
	'lipSync.detectFace': {
		input: KlingEndpointInputSchemas.lipSyncDetectFace,
		output: KlingEndpointOutputSchemas.lipSyncDetectFace,
	},
	'lipSync.create': {
		input: KlingEndpointInputSchemas.lipSyncCreate,
		output: KlingEndpointOutputSchemas.lipSyncCreate,
	},
	'lipSync.get': {
		input: KlingEndpointInputSchemas.lipSyncGet,
		output: KlingEndpointOutputSchemas.lipSyncGet,
	},
	'lipSync.list': {
		input: KlingEndpointInputSchemas.lipSyncList,
		output: KlingEndpointOutputSchemas.lipSyncList,
	},
	'videoEffects.create': {
		input: KlingEndpointInputSchemas.videoEffectsCreate,
		output: KlingEndpointOutputSchemas.videoEffectsCreate,
	},
	'videoEffects.get': {
		input: KlingEndpointInputSchemas.videoEffectsGet,
		output: KlingEndpointOutputSchemas.videoEffectsGet,
	},
	'videoEffects.list': {
		input: KlingEndpointInputSchemas.videoEffectsList,
		output: KlingEndpointOutputSchemas.videoEffectsList,
	},
	'virtualTryOn.create': {
		input: KlingEndpointInputSchemas.virtualTryOnCreate,
		output: KlingEndpointOutputSchemas.virtualTryOnCreate,
	},
	'virtualTryOn.get': {
		input: KlingEndpointInputSchemas.virtualTryOnGet,
		output: KlingEndpointOutputSchemas.virtualTryOnGet,
	},
	'virtualTryOn.list': {
		input: KlingEndpointInputSchemas.virtualTryOnList,
		output: KlingEndpointOutputSchemas.virtualTryOnList,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof klingEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const klingEndpointMeta = {
	'textToVideo.create': {
		riskLevel: 'write',
		description: 'Create a text-to-video generation task',
	},
	'textToVideo.get': {
		riskLevel: 'read',
		description: 'Fetch a text-to-video task by id',
	},
	'textToVideo.list': {
		riskLevel: 'read',
		description: 'List text-to-video and other video tasks by cursor',
	},
	'imageToVideo.create': {
		riskLevel: 'write',
		description: 'Create an image-to-video generation task',
	},
	'imageToVideo.get': {
		riskLevel: 'read',
		description: 'Fetch an image-to-video task by id',
	},
	'imageToVideo.list': {
		riskLevel: 'read',
		description: 'List image-to-video and other video tasks by cursor',
	},
	'omniVideo.create': {
		riskLevel: 'write',
		description: 'Create an omni-video generation task',
	},
	'omniVideo.get': {
		riskLevel: 'read',
		description: 'Fetch an omni-video task by id',
	},
	'omniVideo.list': {
		riskLevel: 'read',
		description: 'List omni-video and other video tasks by cursor',
	},
	'motionControl.create': {
		riskLevel: 'write',
		description: 'Create a motion-control task from a motion reference',
	},
	'motionControl.get': {
		riskLevel: 'read',
		description: 'Fetch a motion-control task by id',
	},
	'motionControl.list': {
		riskLevel: 'read',
		description: 'List motion-control and other video tasks by cursor',
	},
	'imageGeneration.create': {
		riskLevel: 'write',
		description: 'Create a text-to-image or image-to-image task',
	},
	'imageGeneration.get': {
		riskLevel: 'read',
		description: 'Fetch an image generation task by id',
	},
	'imageGeneration.list': {
		riskLevel: 'read',
		description: 'List image generation tasks by page',
	},
	'multiImageToImage.create': {
		riskLevel: 'write',
		description: 'Create a multi-image (subject, scene, style) task',
	},
	'multiImageToImage.get': {
		riskLevel: 'read',
		description: 'Fetch a multi-image task by id',
	},
	'multiImageToImage.list': {
		riskLevel: 'read',
		description: 'List multi-image tasks by page',
	},
	'omniImage.create': {
		riskLevel: 'write',
		description: 'Create an omni-image generation task',
	},
	'omniImage.get': {
		riskLevel: 'read',
		description: 'Fetch an omni-image task by id',
	},
	'omniImage.list': {
		riskLevel: 'read',
		description: 'List omni-image tasks by page',
	},
	'outpainting.create': {
		riskLevel: 'write',
		description: 'Create an image outpainting (expand) task',
	},
	'outpainting.get': {
		riskLevel: 'read',
		description: 'Fetch an outpainting task by id',
	},
	'outpainting.list': {
		riskLevel: 'read',
		description: 'List outpainting tasks by page',
	},
	'lipSync.detectFace': {
		riskLevel: 'write',
		description: 'Identify faces in a video for lip-sync processing',
	},
	'lipSync.create': {
		riskLevel: 'write',
		description: 'Create a lip-sync task for a detected face',
	},
	'lipSync.get': {
		riskLevel: 'read',
		description: 'Fetch a lip-sync task by id',
	},
	'lipSync.list': {
		riskLevel: 'read',
		description: 'List lip-sync tasks by page',
	},
	'videoEffects.create': {
		riskLevel: 'write',
		description: 'Create a video effect task from a scene template',
	},
	'videoEffects.get': {
		riskLevel: 'read',
		description: 'Fetch a video effect task by id',
	},
	'videoEffects.list': {
		riskLevel: 'read',
		description: 'List video effect tasks by page',
	},
	'virtualTryOn.create': {
		riskLevel: 'write',
		description: 'Create a virtual try-on task for a product and person',
	},
	'virtualTryOn.get': {
		riskLevel: 'read',
		description: 'Fetch a virtual try-on task by id',
	},
	'virtualTryOn.list': {
		riskLevel: 'read',
		description: 'List virtual try-on tasks by cursor',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof klingEndpointsNested>;

export const klingAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseKlingPlugin<T extends KlingPluginOptions> = CorsairPlugin<
	'kling',
	typeof KlingSchema,
	typeof klingEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalKlingPlugin = BaseKlingPlugin<KlingPluginOptions>;

export type ExternalKlingPlugin<T extends KlingPluginOptions> =
	BaseKlingPlugin<T>;

export function kling<const T extends KlingPluginOptions>(
	incomingOptions: KlingPluginOptions & T = {} as KlingPluginOptions & T,
): ExternalKlingPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'kling',
		authConfig: klingAuthConfig,
		schema: KlingSchema,
		options,
		hooks: options.hooks,
		endpoints: klingEndpointsNested,
		// Kling exposes result delivery through caller-supplied HTTP callbacks
		// (docs: api/get-started/callbacks) rather than signed inbound
		// webhooks, so there is no verifiable webhook spec to register.
		webhooks: {},
		endpointMeta: klingEndpointMeta,
		endpointSchemas: klingEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: KlingKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
				if (!storedKey) {
					throw new AuthMissingError('kling', 'api_key');
				}
				return storedKey;
			}

			return '';
		},
	} satisfies InternalKlingPlugin;
}

export type {
	ImageGenerationCreateInput,
	ImageToVideoCreateInput,
	KlingEndpointInputs,
	KlingEndpointOutputs,
	KlingTaskGetInput,
	KlingTaskListInput,
	KlingTaskPageListInput,
	LipSyncCreateInput,
	LipSyncDetectFaceInput,
	MotionControlCreateInput,
	MultiImageToImageCreateInput,
	OmniImageCreateInput,
	OmniVideoCreateInput,
	OutpaintingCreateInput,
	TextToVideoCreateInput,
	VideoEffectsCreateInput,
	VirtualTryOnCreateInput,
} from './endpoints/types';
