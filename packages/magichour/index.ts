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
	Account,
	Audio,
	AudioProjects,
	FaceDetection,
	Files,
	ImageProjects,
	Images,
	VideoProjects,
	Videos,
} from './endpoints';
import type {
	MagicHourEndpointInputs,
	MagicHourEndpointOutputs,
} from './endpoints/types';
import {
	MagicHourEndpointInputSchemas,
	MagicHourEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { MagicHourSchema } from './schema';

export type MagicHourPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalMagicHourPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof magicHourEndpointsNested>;
};

export type MagicHourContext = CorsairPluginContext<
	typeof MagicHourSchema,
	MagicHourPluginOptions
>;

export type MagicHourKeyBuilderContext =
	KeyBuilderContext<MagicHourPluginOptions>;

export type MagicHourBoundEndpoints = BindEndpoints<
	typeof magicHourEndpointsNested
>;

type MagicHourEndpoint<K extends keyof MagicHourEndpointOutputs> =
	CorsairEndpoint<
		MagicHourContext,
		MagicHourEndpointInputs[K],
		MagicHourEndpointOutputs[K]
	>;

export type MagicHourEndpoints = {
	accountGet: MagicHourEndpoint<'accountGet'>;
	filesGenerateUploadUrls: MagicHourEndpoint<'filesGenerateUploadUrls'>;
	filesSavedItemsList: MagicHourEndpoint<'filesSavedItemsList'>;
	faceDetectionDetect: MagicHourEndpoint<'faceDetectionDetect'>;
	faceDetectionGetDetails: MagicHourEndpoint<'faceDetectionGetDetails'>;
	videoProjectsGetDetails: MagicHourEndpoint<'videoProjectsGetDetails'>;
	videoProjectsDelete: MagicHourEndpoint<'videoProjectsDelete'>;
	videosTalkingPhoto: MagicHourEndpoint<'videosTalkingPhoto'>;
	videosUgcAd: MagicHourEndpoint<'videosUgcAd'>;
	videosVideoEditor: MagicHourEndpoint<'videosVideoEditor'>;
	videosVideoTranslator: MagicHourEndpoint<'videosVideoTranslator'>;
	videosAnimation: MagicHourEndpoint<'videosAnimation'>;
	videosAudioToVideo: MagicHourEndpoint<'videosAudioToVideo'>;
	videosAutoSubtitleGenerator: MagicHourEndpoint<'videosAutoSubtitleGenerator'>;
	videosCharacterReplace: MagicHourEndpoint<'videosCharacterReplace'>;
	videosFaceSwap: MagicHourEndpoint<'videosFaceSwap'>;
	videosImageToVideo: MagicHourEndpoint<'videosImageToVideo'>;
	videosLipSync: MagicHourEndpoint<'videosLipSync'>;
	videosTextToVideo: MagicHourEndpoint<'videosTextToVideo'>;
	videosVideoToVideo: MagicHourEndpoint<'videosVideoToVideo'>;
	imageProjectsGetDetails: MagicHourEndpoint<'imageProjectsGetDetails'>;
	imageProjectsDelete: MagicHourEndpoint<'imageProjectsDelete'>;
	imagesClothesChanger: MagicHourEndpoint<'imagesClothesChanger'>;
	imagesFaceEditor: MagicHourEndpoint<'imagesFaceEditor'>;
	imagesGifGenerator: MagicHourEndpoint<'imagesGifGenerator'>;
	imagesHeadshotGenerator: MagicHourEndpoint<'imagesHeadshotGenerator'>;
	imagesImageEditor: MagicHourEndpoint<'imagesImageEditor'>;
	imagesImageGenerator: MagicHourEndpoint<'imagesImageGenerator'>;
	imagesImageUpscaler: MagicHourEndpoint<'imagesImageUpscaler'>;
	imagesMemeGenerator: MagicHourEndpoint<'imagesMemeGenerator'>;
	imagesQrCodeGenerator: MagicHourEndpoint<'imagesQrCodeGenerator'>;
	imagesBodySwap: MagicHourEndpoint<'imagesBodySwap'>;
	imagesFaceSwapPhoto: MagicHourEndpoint<'imagesFaceSwapPhoto'>;
	imagesHeadSwap: MagicHourEndpoint<'imagesHeadSwap'>;
	imagesBackgroundRemover: MagicHourEndpoint<'imagesBackgroundRemover'>;
	imagesPhotoColorizer: MagicHourEndpoint<'imagesPhotoColorizer'>;
	audioProjectsGetDetails: MagicHourEndpoint<'audioProjectsGetDetails'>;
	audioProjectsDelete: MagicHourEndpoint<'audioProjectsDelete'>;
	audioVoiceGenerator: MagicHourEndpoint<'audioVoiceGenerator'>;
	audioVoiceCloner: MagicHourEndpoint<'audioVoiceCloner'>;
};

const magicHourEndpointsNested = {
	account: {
		get: Account.get,
	},
	files: {
		generateUploadUrls: Files.generateUploadUrls,
		savedItemsList: Files.savedItemsList,
	},
	faceDetection: {
		detect: FaceDetection.detect,
		getDetails: FaceDetection.getDetails,
	},
	videoProjects: {
		getDetails: VideoProjects.getDetails,
		delete: VideoProjects.deleteVideo,
	},
	videos: {
		talkingPhoto: Videos.talkingPhoto,
		ugcAd: Videos.ugcAd,
		videoEditor: Videos.videoEditor,
		videoTranslator: Videos.videoTranslator,
		animation: Videos.animation,
		audioToVideo: Videos.audioToVideo,
		autoSubtitleGenerator: Videos.autoSubtitleGenerator,
		characterReplace: Videos.characterReplace,
		faceSwap: Videos.faceSwap,
		imageToVideo: Videos.imageToVideo,
		lipSync: Videos.lipSync,
		textToVideo: Videos.textToVideo,
		videoToVideo: Videos.videoToVideo,
	},
	imageProjects: {
		getDetails: ImageProjects.getDetails,
		delete: ImageProjects.deleteImage,
	},
	images: {
		clothesChanger: Images.clothesChanger,
		faceEditor: Images.faceEditor,
		gifGenerator: Images.gifGenerator,
		headshotGenerator: Images.headshotGenerator,
		imageEditor: Images.imageEditor,
		imageGenerator: Images.imageGenerator,
		imageUpscaler: Images.imageUpscaler,
		memeGenerator: Images.memeGenerator,
		qrCodeGenerator: Images.qrCodeGenerator,
		bodySwap: Images.bodySwap,
		faceSwapPhoto: Images.faceSwapPhoto,
		headSwap: Images.headSwap,
		backgroundRemover: Images.backgroundRemover,
		photoColorizer: Images.photoColorizer,
	},
	audioProjects: {
		getDetails: AudioProjects.getDetails,
		delete: AudioProjects.deleteAudio,
	},
	audio: {
		voiceGenerator: Audio.voiceGenerator,
		voiceCloner: Audio.voiceCloner,
	},
} as const;

export const magicHourEndpointSchemas = {
	'account.get': {
		input: MagicHourEndpointInputSchemas.accountGet,
		output: MagicHourEndpointOutputSchemas.accountGet,
	},
	'files.generateUploadUrls': {
		input: MagicHourEndpointInputSchemas.filesGenerateUploadUrls,
		output: MagicHourEndpointOutputSchemas.filesGenerateUploadUrls,
	},
	'files.savedItemsList': {
		input: MagicHourEndpointInputSchemas.filesSavedItemsList,
		output: MagicHourEndpointOutputSchemas.filesSavedItemsList,
	},
	'faceDetection.detect': {
		input: MagicHourEndpointInputSchemas.faceDetectionDetect,
		output: MagicHourEndpointOutputSchemas.faceDetectionDetect,
	},
	'faceDetection.getDetails': {
		input: MagicHourEndpointInputSchemas.faceDetectionGetDetails,
		output: MagicHourEndpointOutputSchemas.faceDetectionGetDetails,
	},
	'videoProjects.getDetails': {
		input: MagicHourEndpointInputSchemas.videoProjectsGetDetails,
		output: MagicHourEndpointOutputSchemas.videoProjectsGetDetails,
	},
	'videoProjects.delete': {
		input: MagicHourEndpointInputSchemas.videoProjectsDelete,
		output: MagicHourEndpointOutputSchemas.videoProjectsDelete,
	},
	'videos.talkingPhoto': {
		input: MagicHourEndpointInputSchemas.videosTalkingPhoto,
		output: MagicHourEndpointOutputSchemas.videosTalkingPhoto,
	},
	'videos.ugcAd': {
		input: MagicHourEndpointInputSchemas.videosUgcAd,
		output: MagicHourEndpointOutputSchemas.videosUgcAd,
	},
	'videos.videoEditor': {
		input: MagicHourEndpointInputSchemas.videosVideoEditor,
		output: MagicHourEndpointOutputSchemas.videosVideoEditor,
	},
	'videos.videoTranslator': {
		input: MagicHourEndpointInputSchemas.videosVideoTranslator,
		output: MagicHourEndpointOutputSchemas.videosVideoTranslator,
	},
	'videos.animation': {
		input: MagicHourEndpointInputSchemas.videosAnimation,
		output: MagicHourEndpointOutputSchemas.videosAnimation,
	},
	'videos.audioToVideo': {
		input: MagicHourEndpointInputSchemas.videosAudioToVideo,
		output: MagicHourEndpointOutputSchemas.videosAudioToVideo,
	},
	'videos.autoSubtitleGenerator': {
		input: MagicHourEndpointInputSchemas.videosAutoSubtitleGenerator,
		output: MagicHourEndpointOutputSchemas.videosAutoSubtitleGenerator,
	},
	'videos.characterReplace': {
		input: MagicHourEndpointInputSchemas.videosCharacterReplace,
		output: MagicHourEndpointOutputSchemas.videosCharacterReplace,
	},
	'videos.faceSwap': {
		input: MagicHourEndpointInputSchemas.videosFaceSwap,
		output: MagicHourEndpointOutputSchemas.videosFaceSwap,
	},
	'videos.imageToVideo': {
		input: MagicHourEndpointInputSchemas.videosImageToVideo,
		output: MagicHourEndpointOutputSchemas.videosImageToVideo,
	},
	'videos.lipSync': {
		input: MagicHourEndpointInputSchemas.videosLipSync,
		output: MagicHourEndpointOutputSchemas.videosLipSync,
	},
	'videos.textToVideo': {
		input: MagicHourEndpointInputSchemas.videosTextToVideo,
		output: MagicHourEndpointOutputSchemas.videosTextToVideo,
	},
	'videos.videoToVideo': {
		input: MagicHourEndpointInputSchemas.videosVideoToVideo,
		output: MagicHourEndpointOutputSchemas.videosVideoToVideo,
	},
	'imageProjects.getDetails': {
		input: MagicHourEndpointInputSchemas.imageProjectsGetDetails,
		output: MagicHourEndpointOutputSchemas.imageProjectsGetDetails,
	},
	'imageProjects.delete': {
		input: MagicHourEndpointInputSchemas.imageProjectsDelete,
		output: MagicHourEndpointOutputSchemas.imageProjectsDelete,
	},
	'images.clothesChanger': {
		input: MagicHourEndpointInputSchemas.imagesClothesChanger,
		output: MagicHourEndpointOutputSchemas.imagesClothesChanger,
	},
	'images.faceEditor': {
		input: MagicHourEndpointInputSchemas.imagesFaceEditor,
		output: MagicHourEndpointOutputSchemas.imagesFaceEditor,
	},
	'images.gifGenerator': {
		input: MagicHourEndpointInputSchemas.imagesGifGenerator,
		output: MagicHourEndpointOutputSchemas.imagesGifGenerator,
	},
	'images.headshotGenerator': {
		input: MagicHourEndpointInputSchemas.imagesHeadshotGenerator,
		output: MagicHourEndpointOutputSchemas.imagesHeadshotGenerator,
	},
	'images.imageEditor': {
		input: MagicHourEndpointInputSchemas.imagesImageEditor,
		output: MagicHourEndpointOutputSchemas.imagesImageEditor,
	},
	'images.imageGenerator': {
		input: MagicHourEndpointInputSchemas.imagesImageGenerator,
		output: MagicHourEndpointOutputSchemas.imagesImageGenerator,
	},
	'images.imageUpscaler': {
		input: MagicHourEndpointInputSchemas.imagesImageUpscaler,
		output: MagicHourEndpointOutputSchemas.imagesImageUpscaler,
	},
	'images.memeGenerator': {
		input: MagicHourEndpointInputSchemas.imagesMemeGenerator,
		output: MagicHourEndpointOutputSchemas.imagesMemeGenerator,
	},
	'images.qrCodeGenerator': {
		input: MagicHourEndpointInputSchemas.imagesQrCodeGenerator,
		output: MagicHourEndpointOutputSchemas.imagesQrCodeGenerator,
	},
	'images.bodySwap': {
		input: MagicHourEndpointInputSchemas.imagesBodySwap,
		output: MagicHourEndpointOutputSchemas.imagesBodySwap,
	},
	'images.faceSwapPhoto': {
		input: MagicHourEndpointInputSchemas.imagesFaceSwapPhoto,
		output: MagicHourEndpointOutputSchemas.imagesFaceSwapPhoto,
	},
	'images.headSwap': {
		input: MagicHourEndpointInputSchemas.imagesHeadSwap,
		output: MagicHourEndpointOutputSchemas.imagesHeadSwap,
	},
	'images.backgroundRemover': {
		input: MagicHourEndpointInputSchemas.imagesBackgroundRemover,
		output: MagicHourEndpointOutputSchemas.imagesBackgroundRemover,
	},
	'images.photoColorizer': {
		input: MagicHourEndpointInputSchemas.imagesPhotoColorizer,
		output: MagicHourEndpointOutputSchemas.imagesPhotoColorizer,
	},
	'audioProjects.getDetails': {
		input: MagicHourEndpointInputSchemas.audioProjectsGetDetails,
		output: MagicHourEndpointOutputSchemas.audioProjectsGetDetails,
	},
	'audioProjects.delete': {
		input: MagicHourEndpointInputSchemas.audioProjectsDelete,
		output: MagicHourEndpointOutputSchemas.audioProjectsDelete,
	},
	'audio.voiceGenerator': {
		input: MagicHourEndpointInputSchemas.audioVoiceGenerator,
		output: MagicHourEndpointOutputSchemas.audioVoiceGenerator,
	},
	'audio.voiceCloner': {
		input: MagicHourEndpointInputSchemas.audioVoiceCloner,
		output: MagicHourEndpointOutputSchemas.audioVoiceCloner,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof magicHourEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const magicHourEndpointMeta = {
	'account.get': {
		riskLevel: 'read',
		description: "Get the account's credit balance and subscription details",
	},
	'files.generateUploadUrls': {
		riskLevel: 'write',
		description:
			'Generate pre-signed URLs for uploading video, audio, or image assets',
	},
	'files.savedItemsList': {
		riskLevel: 'read',
		description:
			'List saved items (characters, references, voices, moodboards, brand kits)',
	},
	'faceDetection.detect': {
		riskLevel: 'write',
		description: 'Detect faces in an image or video',
	},
	'faceDetection.getDetails': {
		riskLevel: 'read',
		description: 'Get the details and detected faces of a face detection task',
	},
	'videoProjects.getDetails': {
		riskLevel: 'read',
		description: 'Check the progress, status, and downloads of a video project',
	},
	'videoProjects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a rendered video [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'videos.talkingPhoto': {
		riskLevel: 'write',
		description: 'Create a talking photo video from an image and an audio file',
	},
	'videos.ugcAd': {
		riskLevel: 'write',
		description: 'Create a spoken UGC ad video from an image and a script',
	},
	'videos.videoEditor': {
		riskLevel: 'write',
		description: 'Edit a video with a prompt-driven AI model',
	},
	'videos.videoTranslator': {
		riskLevel: 'write',
		description: 'Translate the speech in a video into another language',
	},
	'videos.animation': {
		riskLevel: 'write',
		description: 'Create a stylized animation video from an image and audio',
	},
	'videos.audioToVideo': {
		riskLevel: 'write',
		description: 'Create a video from an audio track',
	},
	'videos.autoSubtitleGenerator': {
		riskLevel: 'write',
		description: 'Generate styled subtitles for a video',
	},
	'videos.characterReplace': {
		riskLevel: 'write',
		description: 'Replace or animate a character in a video',
	},
	'videos.faceSwap': {
		riskLevel: 'write',
		description: 'Swap faces in a video using a reference face image',
	},
	'videos.imageToVideo': {
		riskLevel: 'write',
		description: 'Animate a still image into a video',
	},
	'videos.lipSync': {
		riskLevel: 'write',
		description: "Sync a video's lip movement to an audio track",
	},
	'videos.textToVideo': {
		riskLevel: 'write',
		description: 'Generate a video from a text prompt',
	},
	'videos.videoToVideo': {
		riskLevel: 'write',
		description: 'Restyle an existing video with a new art style',
	},
	'imageProjects.getDetails': {
		riskLevel: 'read',
		description:
			'Check the progress, status, and downloads of an image project',
	},
	'imageProjects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete rendered image(s) [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'images.clothesChanger': {
		riskLevel: 'write',
		description: 'Change outfits in a photo using a garment reference',
	},
	'images.faceEditor': {
		riskLevel: 'write',
		description: 'Edit facial features of an image',
	},
	'images.gifGenerator': {
		riskLevel: 'write',
		description: 'Generate an animated GIF from a prompt',
	},
	'images.headshotGenerator': {
		riskLevel: 'write',
		description: 'Generate a professional headshot from a photo',
	},
	'images.imageEditor': {
		riskLevel: 'write',
		description: 'Edit an image with a prompt-driven AI model',
	},
	'images.imageGenerator': {
		riskLevel: 'write',
		description: 'Generate images from a text prompt',
	},
	'images.imageUpscaler': {
		riskLevel: 'write',
		description: 'Upscale an image 2x or 4x with AI',
	},
	'images.memeGenerator': {
		riskLevel: 'write',
		description: 'Generate a meme from a topic and template',
	},
	'images.qrCodeGenerator': {
		riskLevel: 'write',
		description: 'Generate an artistic QR code',
	},
	'images.bodySwap': {
		riskLevel: 'write',
		description: 'Place a person into a scene image',
	},
	'images.faceSwapPhoto': {
		riskLevel: 'write',
		description: 'Swap faces in a photo',
	},
	'images.headSwap': {
		riskLevel: 'write',
		description: 'Swap a head onto a body image',
	},
	'images.backgroundRemover': {
		riskLevel: 'write',
		description: 'Remove or replace an image background',
	},
	'images.photoColorizer': {
		riskLevel: 'write',
		description: 'Colorize a black-and-white photo',
	},
	'audioProjects.getDetails': {
		riskLevel: 'read',
		description:
			'Check the progress, status, and downloads of an audio project',
	},
	'audioProjects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete rendered audio file(s) [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'audio.voiceGenerator': {
		riskLevel: 'write',
		description: 'Generate speech audio from text using a preset voice',
	},
	'audio.voiceCloner': {
		riskLevel: 'write',
		description: 'Clone a voice from an audio sample and generate speech',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof magicHourEndpointsNested
>;

export const magicHourAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseMagicHourPlugin<T extends MagicHourPluginOptions> =
	CorsairPlugin<
		'magichour',
		typeof MagicHourSchema,
		typeof magicHourEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalMagicHourPlugin =
	BaseMagicHourPlugin<MagicHourPluginOptions>;

export type ExternalMagicHourPlugin<T extends MagicHourPluginOptions> =
	BaseMagicHourPlugin<T>;

export function magichour<const T extends MagicHourPluginOptions>(
	incomingOptions: MagicHourPluginOptions & T = {} as MagicHourPluginOptions &
		T,
): ExternalMagicHourPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'magichour',
		authConfig: magicHourAuthConfig,
		schema: MagicHourSchema,
		options,
		hooks: options.hooks,
		endpoints: magicHourEndpointsNested,
		// Magic Hour reports job status by polling
		// `GET /v1/{video,image,audio}-projects/{id}` and exposes no inbound
		// webhook subscription API, so no webhooks are declared.
		webhooks: {},
		endpointMeta: magicHourEndpointMeta,
		endpointSchemas: magicHourEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: MagicHourKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
				if (!storedKey) {
					throw new AuthMissingError('magichour', 'api_key');
				}
				return storedKey;
			}

			return '';
		},
	} satisfies InternalMagicHourPlugin;
}

export * from './endpoints/types';
