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
import {
	AiClipping,
	Assets,
	Audio,
	AvatarRealtime,
	Avatars,
	Brand,
	Hyperframes,
	KnowledgeBases,
	Lipsync,
	Proofread,
	Streaming,
	VideoAgents,
	Videos,
	VideoTranslations,
	Voices,
	WebhooksQuota,
} from './endpoints';
import type {
	HeygenEndpointInputs,
	HeygenEndpointOutputs,
} from './endpoints/types';
import {
	HeygenEndpointInputSchemas,
	HeygenEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { HeygenSchema } from './schema';

export type HeygenPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalHeygenPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof heygenEndpointsNested>;
};

export type HeygenContext = CorsairPluginContext<
	typeof HeygenSchema,
	HeygenPluginOptions
>;

export type HeygenKeyBuilderContext = KeyBuilderContext<HeygenPluginOptions>;

export type HeygenBoundEndpoints = BindEndpoints<typeof heygenEndpointsNested>;

type HeygenEndpoint<K extends keyof HeygenEndpointOutputs> = CorsairEndpoint<
	HeygenContext,
	HeygenEndpointInputs[K],
	HeygenEndpointOutputs[K]
>;

export type HeygenEndpoints = {
	videosGenerate: HeygenEndpoint<'videosGenerate'>;
	videosTemplateGenerate: HeygenEndpoint<'videosTemplateGenerate'>;
	videosCreateWebm: HeygenEndpoint<'videosCreateWebm'>;
	videosPersonalizedAddContact: HeygenEndpoint<'videosPersonalizedAddContact'>;
	videosPersonalizedProjectDetail: HeygenEndpoint<'videosPersonalizedProjectDetail'>;
	videosGetStatus: HeygenEndpoint<'videosGetStatus'>;
	videosTranslate: HeygenEndpoint<'videosTranslate'>;
	videosTranslateStatus: HeygenEndpoint<'videosTranslateStatus'>;
	videosTranslateTargetLanguages: HeygenEndpoint<'videosTranslateTargetLanguages'>;
	videosGetSharableUrl: HeygenEndpoint<'videosGetSharableUrl'>;
	videosDelete: HeygenEndpoint<'videosDelete'>;
	videosList: HeygenEndpoint<'videosList'>;

	avatarsList: HeygenEndpoint<'avatarsList'>;
	avatarsGetDetails: HeygenEndpoint<'avatarsGetDetails'>;
	avatarsListGroups: HeygenEndpoint<'avatarsListGroups'>;
	avatarsListGroupAvatars: HeygenEndpoint<'avatarsListGroupAvatars'>;
	avatarsSearchPublicGroups: HeygenEndpoint<'avatarsSearchPublicGroups'>;
	avatarsCreatePhotoGroup: HeygenEndpoint<'avatarsCreatePhotoGroup'>;
	avatarsGeneratePhotos: HeygenEndpoint<'avatarsGeneratePhotos'>;
	avatarsAddLooks: HeygenEndpoint<'avatarsAddLooks'>;
	avatarsCheckLookStatus: HeygenEndpoint<'avatarsCheckLookStatus'>;
	avatarsGetTrainingStatus: HeygenEndpoint<'avatarsGetTrainingStatus'>;
	avatarsGetPhotoDetails: HeygenEndpoint<'avatarsGetPhotoDetails'>;
	avatarsDeletePhotoGroup: HeygenEndpoint<'avatarsDeletePhotoGroup'>;
	avatarsDeletePhoto: HeygenEndpoint<'avatarsDeletePhoto'>;
	avatarsAddMotion: HeygenEndpoint<'avatarsAddMotion'>;
	avatarsUpscale: HeygenEndpoint<'avatarsUpscale'>;
	avatarsListTalkingPhotos: HeygenEndpoint<'avatarsListTalkingPhotos'>;
	avatarsUploadTalkingPhoto: HeygenEndpoint<'avatarsUploadTalkingPhoto'>;
	avatarsDeleteTalkingPhoto: HeygenEndpoint<'avatarsDeleteTalkingPhoto'>;

	voicesGenerateSpeech: HeygenEndpoint<'voicesGenerateSpeech'>;
	voicesGeneratePreview: HeygenEndpoint<'voicesGeneratePreview'>;
	voicesListTts: HeygenEndpoint<'voicesListTts'>;
	voicesListLocales: HeygenEndpoint<'voicesListLocales'>;
	voicesListV2: HeygenEndpoint<'voicesListV2'>;
	voicesListV1: HeygenEndpoint<'voicesListV1'>;
	voicesListBrandVoices: HeygenEndpoint<'voicesListBrandVoices'>;

	streamingNewSession: HeygenEndpoint<'streamingNewSession'>;
	streamingCreateToken: HeygenEndpoint<'streamingCreateToken'>;
	streamingStart: HeygenEndpoint<'streamingStart'>;
	streamingStop: HeygenEndpoint<'streamingStop'>;
	streamingInterrupt: HeygenEndpoint<'streamingInterrupt'>;
	streamingKeepAlive: HeygenEndpoint<'streamingKeepAlive'>;
	streamingTask: HeygenEndpoint<'streamingTask'>;
	streamingIce: HeygenEndpoint<'streamingIce'>;
	streamingNew: HeygenEndpoint<'streamingNew'>;
	streamingList: HeygenEndpoint<'streamingList'>;
	streamingListAvatars: HeygenEndpoint<'streamingListAvatars'>;
	streamingListSessionHistory: HeygenEndpoint<'streamingListSessionHistory'>;

	knowledgeBasesCreate: HeygenEndpoint<'knowledgeBasesCreate'>;
	knowledgeBasesList: HeygenEndpoint<'knowledgeBasesList'>;
	knowledgeBasesUpdate: HeygenEndpoint<'knowledgeBasesUpdate'>;
	knowledgeBasesDelete: HeygenEndpoint<'knowledgeBasesDelete'>;

	assetsListTemplates: HeygenEndpoint<'assetsListTemplates'>;
	assetsGetTemplate: HeygenEndpoint<'assetsGetTemplate'>;
	assetsUploadAsset: HeygenEndpoint<'assetsUploadAsset'>;
	assetsListAssets: HeygenEndpoint<'assetsListAssets'>;
	assetsListAssets2: HeygenEndpoint<'assetsListAssets2'>;
	assetsDeleteAsset: HeygenEndpoint<'assetsDeleteAsset'>;
	assetsCreateFolder: HeygenEndpoint<'assetsCreateFolder'>;
	assetsListFolders: HeygenEndpoint<'assetsListFolders'>;
	assetsUpdateFolder: HeygenEndpoint<'assetsUpdateFolder'>;
	assetsTrashFolder: HeygenEndpoint<'assetsTrashFolder'>;
	assetsRestoreFolder: HeygenEndpoint<'assetsRestoreFolder'>;

	webhooksQuotaAddEndpoint: HeygenEndpoint<'webhooksQuotaAddEndpoint'>;
	webhooksQuotaListEndpoints: HeygenEndpoint<'webhooksQuotaListEndpoints'>;
	webhooksQuotaListEventTypes: HeygenEndpoint<'webhooksQuotaListEventTypes'>;
	webhooksQuotaUpdateEndpoint: HeygenEndpoint<'webhooksQuotaUpdateEndpoint'>;
	webhooksQuotaDeleteEndpoint: HeygenEndpoint<'webhooksQuotaDeleteEndpoint'>;
	webhooksQuotaGetCurrentUser: HeygenEndpoint<'webhooksQuotaGetCurrentUser'>;
	webhooksQuotaRemainingQuota: HeygenEndpoint<'webhooksQuotaRemainingQuota'>;

	videoAgentsListSessions: HeygenEndpoint<'videoAgentsListSessions'>;
	videoAgentsCreateSession: HeygenEndpoint<'videoAgentsCreateSession'>;
	videoAgentsListStyles: HeygenEndpoint<'videoAgentsListStyles'>;
	videoAgentsGetSession: HeygenEndpoint<'videoAgentsGetSession'>;
	videoAgentsSendMessage: HeygenEndpoint<'videoAgentsSendMessage'>;
	videoAgentsGetResource: HeygenEndpoint<'videoAgentsGetResource'>;
	videoAgentsListVideos: HeygenEndpoint<'videoAgentsListVideos'>;
	videoAgentsStopSession: HeygenEndpoint<'videoAgentsStopSession'>;

	brandListGlossaries: HeygenEndpoint<'brandListGlossaries'>;
	brandListKits: HeygenEndpoint<'brandListKits'>;

	avatarsCreate: HeygenEndpoint<'avatarsCreate'>;
	avatarsGetGroup: HeygenEndpoint<'avatarsGetGroup'>;
	avatarsDeleteGroup: HeygenEndpoint<'avatarsDeleteGroup'>;
	avatarsCreateConsent: HeygenEndpoint<'avatarsCreateConsent'>;
	avatarsListLooks: HeygenEndpoint<'avatarsListLooks'>;
	avatarsGetLook: HeygenEndpoint<'avatarsGetLook'>;
	avatarsDeleteLook: HeygenEndpoint<'avatarsDeleteLook'>;
	avatarsUpdateLook: HeygenEndpoint<'avatarsUpdateLook'>;

	avatarRealtimeCreateSession: HeygenEndpoint<'avatarRealtimeCreateSession'>;
	avatarRealtimeGetSession: HeygenEndpoint<'avatarRealtimeGetSession'>;
	avatarRealtimeAppendText: HeygenEndpoint<'avatarRealtimeAppendText'>;
	avatarRealtimeCancelSession: HeygenEndpoint<'avatarRealtimeCancelSession'>;

	audioSearch: HeygenEndpoint<'audioSearch'>;

	voicesGenerateSpeechV3: HeygenEndpoint<'voicesGenerateSpeechV3'>;
	voicesListV3: HeygenEndpoint<'voicesListV3'>;
	voicesDesign: HeygenEndpoint<'voicesDesign'>;
	voicesClone: HeygenEndpoint<'voicesClone'>;
	voicesGetV3: HeygenEndpoint<'voicesGetV3'>;
	voicesDeleteV3: HeygenEndpoint<'voicesDeleteV3'>;

	videosListV3: HeygenEndpoint<'videosListV3'>;
	videosDeleteV3: HeygenEndpoint<'videosDeleteV3'>;

	videoTranslationsList: HeygenEndpoint<'videoTranslationsList'>;
	videoTranslationsDelete: HeygenEndpoint<'videoTranslationsDelete'>;
	videoTranslationsUpdate: HeygenEndpoint<'videoTranslationsUpdate'>;

	proofreadCreate: HeygenEndpoint<'proofreadCreate'>;
	proofreadGet: HeygenEndpoint<'proofreadGet'>;
	proofreadDownloadSrt: HeygenEndpoint<'proofreadDownloadSrt'>;
	proofreadUploadSrt: HeygenEndpoint<'proofreadUploadSrt'>;
	proofreadGenerateVideo: HeygenEndpoint<'proofreadGenerateVideo'>;

	lipsyncList: HeygenEndpoint<'lipsyncList'>;
	lipsyncCreate: HeygenEndpoint<'lipsyncCreate'>;
	lipsyncGet: HeygenEndpoint<'lipsyncGet'>;
	lipsyncDelete: HeygenEndpoint<'lipsyncDelete'>;
	lipsyncUpdate: HeygenEndpoint<'lipsyncUpdate'>;

	hyperframesList: HeygenEndpoint<'hyperframesList'>;
	hyperframesCreate: HeygenEndpoint<'hyperframesCreate'>;
	hyperframesGet: HeygenEndpoint<'hyperframesGet'>;
	hyperframesDelete: HeygenEndpoint<'hyperframesDelete'>;

	webhooksListEventTypesV3: HeygenEndpoint<'webhooksListEventTypesV3'>;
	webhooksListEndpointsV3: HeygenEndpoint<'webhooksListEndpointsV3'>;
	webhooksAddEndpointV3: HeygenEndpoint<'webhooksAddEndpointV3'>;
	webhooksDeleteEndpointV3: HeygenEndpoint<'webhooksDeleteEndpointV3'>;
	webhooksUpdateEndpointV3: HeygenEndpoint<'webhooksUpdateEndpointV3'>;
	webhooksRotateSecret: HeygenEndpoint<'webhooksRotateSecret'>;
	webhooksListEvents: HeygenEndpoint<'webhooksListEvents'>;

	assetsUploadAssetV3: HeygenEndpoint<'assetsUploadAssetV3'>;
	assetsGetAsset: HeygenEndpoint<'assetsGetAsset'>;
	assetsDeleteAssetV3: HeygenEndpoint<'assetsDeleteAssetV3'>;
	assetsCreateUploadSession: HeygenEndpoint<'assetsCreateUploadSession'>;
	assetsCompleteUpload: HeygenEndpoint<'assetsCompleteUpload'>;

	aiClippingGet: HeygenEndpoint<'aiClippingGet'>;
	aiClippingDelete: HeygenEndpoint<'aiClippingDelete'>;
	aiClippingList: HeygenEndpoint<'aiClippingList'>;
	aiClippingCreate: HeygenEndpoint<'aiClippingCreate'>;
};

const heygenEndpointsNested = {
	videos: {
		generate: Videos.generate,
		templateGenerate: Videos.templateGenerate,
		createWebm: Videos.createWebm,
		personalizedAddContact: Videos.personalizedAddContact,
		personalizedProjectDetail: Videos.personalizedProjectDetail,
		getStatus: Videos.getStatus,
		translate: Videos.translate,
		translateStatus: Videos.translateStatus,
		translateTargetLanguages: Videos.translateTargetLanguages,
		getSharableUrl: Videos.getSharableUrl,
		delete: Videos.deleteVideo,
		list: Videos.list,
		listV3: Videos.listV3,
		deleteV3: Videos.deleteV3,
	},
	avatars: {
		list: Avatars.list,
		getDetails: Avatars.getDetails,
		listGroups: Avatars.listGroups,
		listGroupAvatars: Avatars.listGroupAvatars,
		searchPublicGroups: Avatars.searchPublicGroups,
		createPhotoGroup: Avatars.createPhotoGroup,
		generatePhotos: Avatars.generatePhotos,
		addLooks: Avatars.addLooks,
		checkLookStatus: Avatars.checkLookStatus,
		getTrainingStatus: Avatars.getTrainingStatus,
		getPhotoDetails: Avatars.getPhotoDetails,
		deletePhotoGroup: Avatars.deletePhotoGroup,
		deletePhoto: Avatars.deletePhoto,
		addMotion: Avatars.addMotion,
		upscale: Avatars.upscale,
		listTalkingPhotos: Avatars.listTalkingPhotos,
		uploadTalkingPhoto: Avatars.uploadTalkingPhoto,
		deleteTalkingPhoto: Avatars.deleteTalkingPhoto,
		create: Avatars.create,
		getGroup: Avatars.getGroup,
		deleteGroup: Avatars.deleteGroup,
		createConsent: Avatars.createConsent,
		listLooks: Avatars.listLooks,
		getLook: Avatars.getLook,
		deleteLook: Avatars.deleteLook,
		updateLook: Avatars.updateLook,
	},
	voices: {
		generateSpeech: Voices.generateSpeech,
		generatePreview: Voices.generatePreview,
		listTts: Voices.listTts,
		listLocales: Voices.listLocales,
		listV2: Voices.listV2,
		listV1: Voices.listV1,
		listBrandVoices: Voices.listBrandVoices,
		generateSpeechV3: Voices.generateSpeechV3,
		listV3: Voices.listV3,
		design: Voices.design,
		clone: Voices.clone,
		getV3: Voices.getV3,
		deleteV3: Voices.deleteV3,
	},
	streaming: {
		newSession: Streaming.newSession,
		createToken: Streaming.createToken,
		start: Streaming.start,
		stop: Streaming.stop,
		interrupt: Streaming.interrupt,
		keepAlive: Streaming.keepAlive,
		task: Streaming.task,
		ice: Streaming.ice,
		new: Streaming.streamingNew,
		list: Streaming.list,
		listAvatars: Streaming.listAvatars,
		listSessionHistory: Streaming.listSessionHistory,
	},
	knowledgeBases: {
		create: KnowledgeBases.create,
		list: KnowledgeBases.list,
		update: KnowledgeBases.update,
		delete: KnowledgeBases.deleteKnowledgeBase,
	},
	assets: {
		listTemplates: Assets.listTemplates,
		getTemplate: Assets.getTemplate,
		uploadAsset: Assets.uploadAsset,
		listAssets: Assets.listAssets,
		listAssets2: Assets.listAssets2,
		deleteAsset: Assets.deleteAsset,
		createFolder: Assets.createFolder,
		listFolders: Assets.listFolders,
		updateFolder: Assets.updateFolder,
		trashFolder: Assets.trashFolder,
		restoreFolder: Assets.restoreFolder,
		uploadAssetV3: Assets.uploadAssetV3,
		getAsset: Assets.getAsset,
		deleteAssetV3: Assets.deleteAssetV3,
		createUploadSession: Assets.createUploadSession,
		completeUpload: Assets.completeUpload,
	},
	webhooksQuota: {
		addEndpoint: WebhooksQuota.addEndpoint,
		listEndpoints: WebhooksQuota.listEndpoints,
		listEventTypes: WebhooksQuota.listEventTypes,
		updateEndpoint: WebhooksQuota.updateEndpoint,
		deleteEndpoint: WebhooksQuota.deleteEndpoint,
		getCurrentUser: WebhooksQuota.getCurrentUser,
		remainingQuota: WebhooksQuota.remainingQuota,
		listEventTypesV3: WebhooksQuota.listEventTypesV3,
		listEndpointsV3: WebhooksQuota.listEndpointsV3,
		addEndpointV3: WebhooksQuota.addEndpointV3,
		deleteEndpointV3: WebhooksQuota.deleteEndpointV3,
		updateEndpointV3: WebhooksQuota.updateEndpointV3,
		rotateSecret: WebhooksQuota.rotateSecret,
		listEvents: WebhooksQuota.listEvents,
	},
	videoAgents: {
		listSessions: VideoAgents.listSessions,
		createSession: VideoAgents.createSession,
		listStyles: VideoAgents.listStyles,
		getSession: VideoAgents.getSession,
		sendMessage: VideoAgents.sendMessage,
		getResource: VideoAgents.getResource,
		listVideos: VideoAgents.listVideos,
		stopSession: VideoAgents.stopSession,
	},
	brand: {
		listGlossaries: Brand.listGlossaries,
		listKits: Brand.listKits,
	},
	avatarRealtime: {
		createSession: AvatarRealtime.createSession,
		getSession: AvatarRealtime.getSession,
		appendText: AvatarRealtime.appendText,
		cancelSession: AvatarRealtime.cancelSession,
	},
	audio: {
		search: Audio.search,
	},
	videoTranslations: {
		list: VideoTranslations.list,
		delete: VideoTranslations.deleteTranslation,
		update: VideoTranslations.update,
	},
	proofread: {
		create: Proofread.create,
		get: Proofread.get,
		downloadSrt: Proofread.downloadSrt,
		uploadSrt: Proofread.uploadSrt,
		generateVideo: Proofread.generateVideo,
	},
	lipsync: {
		list: Lipsync.list,
		create: Lipsync.create,
		get: Lipsync.get,
		delete: Lipsync.deleteLipsync,
		update: Lipsync.update,
	},
	hyperframes: {
		list: Hyperframes.list,
		create: Hyperframes.create,
		get: Hyperframes.get,
		delete: Hyperframes.deleteHyperframe,
	},
	aiClipping: {
		get: AiClipping.get,
		delete: AiClipping.deleteAiClipping,
		list: AiClipping.list,
		create: AiClipping.create,
	},
} as const;

export const heygenEndpointSchemas = {
	'videos.generate': {
		input: HeygenEndpointInputSchemas.videosGenerate,
		output: HeygenEndpointOutputSchemas.videosGenerate,
	},
	'videos.templateGenerate': {
		input: HeygenEndpointInputSchemas.videosTemplateGenerate,
		output: HeygenEndpointOutputSchemas.videosTemplateGenerate,
	},
	'videos.createWebm': {
		input: HeygenEndpointInputSchemas.videosCreateWebm,
		output: HeygenEndpointOutputSchemas.videosCreateWebm,
	},
	'videos.personalizedAddContact': {
		input: HeygenEndpointInputSchemas.videosPersonalizedAddContact,
		output: HeygenEndpointOutputSchemas.videosPersonalizedAddContact,
	},
	'videos.personalizedProjectDetail': {
		input: HeygenEndpointInputSchemas.videosPersonalizedProjectDetail,
		output: HeygenEndpointOutputSchemas.videosPersonalizedProjectDetail,
	},
	'videos.getStatus': {
		input: HeygenEndpointInputSchemas.videosGetStatus,
		output: HeygenEndpointOutputSchemas.videosGetStatus,
	},
	'videos.translate': {
		input: HeygenEndpointInputSchemas.videosTranslate,
		output: HeygenEndpointOutputSchemas.videosTranslate,
	},
	'videos.translateStatus': {
		input: HeygenEndpointInputSchemas.videosTranslateStatus,
		output: HeygenEndpointOutputSchemas.videosTranslateStatus,
	},
	'videos.translateTargetLanguages': {
		input: HeygenEndpointInputSchemas.videosTranslateTargetLanguages,
		output: HeygenEndpointOutputSchemas.videosTranslateTargetLanguages,
	},
	'videos.getSharableUrl': {
		input: HeygenEndpointInputSchemas.videosGetSharableUrl,
		output: HeygenEndpointOutputSchemas.videosGetSharableUrl,
	},
	'videos.delete': {
		input: HeygenEndpointInputSchemas.videosDelete,
		output: HeygenEndpointOutputSchemas.videosDelete,
	},
	'videos.list': {
		input: HeygenEndpointInputSchemas.videosList,
		output: HeygenEndpointOutputSchemas.videosList,
	},

	'avatars.list': {
		input: HeygenEndpointInputSchemas.avatarsList,
		output: HeygenEndpointOutputSchemas.avatarsList,
	},
	'avatars.getDetails': {
		input: HeygenEndpointInputSchemas.avatarsGetDetails,
		output: HeygenEndpointOutputSchemas.avatarsGetDetails,
	},
	'avatars.listGroups': {
		input: HeygenEndpointInputSchemas.avatarsListGroups,
		output: HeygenEndpointOutputSchemas.avatarsListGroups,
	},
	'avatars.listGroupAvatars': {
		input: HeygenEndpointInputSchemas.avatarsListGroupAvatars,
		output: HeygenEndpointOutputSchemas.avatarsListGroupAvatars,
	},
	'avatars.searchPublicGroups': {
		input: HeygenEndpointInputSchemas.avatarsSearchPublicGroups,
		output: HeygenEndpointOutputSchemas.avatarsSearchPublicGroups,
	},
	'avatars.createPhotoGroup': {
		input: HeygenEndpointInputSchemas.avatarsCreatePhotoGroup,
		output: HeygenEndpointOutputSchemas.avatarsCreatePhotoGroup,
	},
	'avatars.generatePhotos': {
		input: HeygenEndpointInputSchemas.avatarsGeneratePhotos,
		output: HeygenEndpointOutputSchemas.avatarsGeneratePhotos,
	},
	'avatars.addLooks': {
		input: HeygenEndpointInputSchemas.avatarsAddLooks,
		output: HeygenEndpointOutputSchemas.avatarsAddLooks,
	},
	'avatars.checkLookStatus': {
		input: HeygenEndpointInputSchemas.avatarsCheckLookStatus,
		output: HeygenEndpointOutputSchemas.avatarsCheckLookStatus,
	},
	'avatars.getTrainingStatus': {
		input: HeygenEndpointInputSchemas.avatarsGetTrainingStatus,
		output: HeygenEndpointOutputSchemas.avatarsGetTrainingStatus,
	},
	'avatars.getPhotoDetails': {
		input: HeygenEndpointInputSchemas.avatarsGetPhotoDetails,
		output: HeygenEndpointOutputSchemas.avatarsGetPhotoDetails,
	},
	'avatars.deletePhotoGroup': {
		input: HeygenEndpointInputSchemas.avatarsDeletePhotoGroup,
		output: HeygenEndpointOutputSchemas.avatarsDeletePhotoGroup,
	},
	'avatars.deletePhoto': {
		input: HeygenEndpointInputSchemas.avatarsDeletePhoto,
		output: HeygenEndpointOutputSchemas.avatarsDeletePhoto,
	},
	'avatars.addMotion': {
		input: HeygenEndpointInputSchemas.avatarsAddMotion,
		output: HeygenEndpointOutputSchemas.avatarsAddMotion,
	},
	'avatars.upscale': {
		input: HeygenEndpointInputSchemas.avatarsUpscale,
		output: HeygenEndpointOutputSchemas.avatarsUpscale,
	},
	'avatars.listTalkingPhotos': {
		input: HeygenEndpointInputSchemas.avatarsListTalkingPhotos,
		output: HeygenEndpointOutputSchemas.avatarsListTalkingPhotos,
	},
	'avatars.uploadTalkingPhoto': {
		input: HeygenEndpointInputSchemas.avatarsUploadTalkingPhoto,
		output: HeygenEndpointOutputSchemas.avatarsUploadTalkingPhoto,
	},
	'avatars.deleteTalkingPhoto': {
		input: HeygenEndpointInputSchemas.avatarsDeleteTalkingPhoto,
		output: HeygenEndpointOutputSchemas.avatarsDeleteTalkingPhoto,
	},

	'voices.generateSpeech': {
		input: HeygenEndpointInputSchemas.voicesGenerateSpeech,
		output: HeygenEndpointOutputSchemas.voicesGenerateSpeech,
	},
	'voices.generatePreview': {
		input: HeygenEndpointInputSchemas.voicesGeneratePreview,
		output: HeygenEndpointOutputSchemas.voicesGeneratePreview,
	},
	'voices.listTts': {
		input: HeygenEndpointInputSchemas.voicesListTts,
		output: HeygenEndpointOutputSchemas.voicesListTts,
	},
	'voices.listLocales': {
		input: HeygenEndpointInputSchemas.voicesListLocales,
		output: HeygenEndpointOutputSchemas.voicesListLocales,
	},
	'voices.listV2': {
		input: HeygenEndpointInputSchemas.voicesListV2,
		output: HeygenEndpointOutputSchemas.voicesListV2,
	},
	'voices.listV1': {
		input: HeygenEndpointInputSchemas.voicesListV1,
		output: HeygenEndpointOutputSchemas.voicesListV1,
	},
	'voices.listBrandVoices': {
		input: HeygenEndpointInputSchemas.voicesListBrandVoices,
		output: HeygenEndpointOutputSchemas.voicesListBrandVoices,
	},

	'streaming.newSession': {
		input: HeygenEndpointInputSchemas.streamingNewSession,
		output: HeygenEndpointOutputSchemas.streamingNewSession,
	},
	'streaming.createToken': {
		input: HeygenEndpointInputSchemas.streamingCreateToken,
		output: HeygenEndpointOutputSchemas.streamingCreateToken,
	},
	'streaming.start': {
		input: HeygenEndpointInputSchemas.streamingStart,
		output: HeygenEndpointOutputSchemas.streamingStart,
	},
	'streaming.stop': {
		input: HeygenEndpointInputSchemas.streamingStop,
		output: HeygenEndpointOutputSchemas.streamingStop,
	},
	'streaming.interrupt': {
		input: HeygenEndpointInputSchemas.streamingInterrupt,
		output: HeygenEndpointOutputSchemas.streamingInterrupt,
	},
	'streaming.keepAlive': {
		input: HeygenEndpointInputSchemas.streamingKeepAlive,
		output: HeygenEndpointOutputSchemas.streamingKeepAlive,
	},
	'streaming.task': {
		input: HeygenEndpointInputSchemas.streamingTask,
		output: HeygenEndpointOutputSchemas.streamingTask,
	},
	'streaming.ice': {
		input: HeygenEndpointInputSchemas.streamingIce,
		output: HeygenEndpointOutputSchemas.streamingIce,
	},
	'streaming.new': {
		input: HeygenEndpointInputSchemas.streamingNew,
		output: HeygenEndpointOutputSchemas.streamingNew,
	},
	'streaming.list': {
		input: HeygenEndpointInputSchemas.streamingList,
		output: HeygenEndpointOutputSchemas.streamingList,
	},
	'streaming.listAvatars': {
		input: HeygenEndpointInputSchemas.streamingListAvatars,
		output: HeygenEndpointOutputSchemas.streamingListAvatars,
	},
	'streaming.listSessionHistory': {
		input: HeygenEndpointInputSchemas.streamingListSessionHistory,
		output: HeygenEndpointOutputSchemas.streamingListSessionHistory,
	},

	'knowledgeBases.create': {
		input: HeygenEndpointInputSchemas.knowledgeBasesCreate,
		output: HeygenEndpointOutputSchemas.knowledgeBasesCreate,
	},
	'knowledgeBases.list': {
		input: HeygenEndpointInputSchemas.knowledgeBasesList,
		output: HeygenEndpointOutputSchemas.knowledgeBasesList,
	},
	'knowledgeBases.update': {
		input: HeygenEndpointInputSchemas.knowledgeBasesUpdate,
		output: HeygenEndpointOutputSchemas.knowledgeBasesUpdate,
	},
	'knowledgeBases.delete': {
		input: HeygenEndpointInputSchemas.knowledgeBasesDelete,
		output: HeygenEndpointOutputSchemas.knowledgeBasesDelete,
	},

	'assets.listTemplates': {
		input: HeygenEndpointInputSchemas.assetsListTemplates,
		output: HeygenEndpointOutputSchemas.assetsListTemplates,
	},
	'assets.getTemplate': {
		input: HeygenEndpointInputSchemas.assetsGetTemplate,
		output: HeygenEndpointOutputSchemas.assetsGetTemplate,
	},
	'assets.uploadAsset': {
		input: HeygenEndpointInputSchemas.assetsUploadAsset,
		output: HeygenEndpointOutputSchemas.assetsUploadAsset,
	},
	'assets.listAssets': {
		input: HeygenEndpointInputSchemas.assetsListAssets,
		output: HeygenEndpointOutputSchemas.assetsListAssets,
	},
	'assets.listAssets2': {
		input: HeygenEndpointInputSchemas.assetsListAssets2,
		output: HeygenEndpointOutputSchemas.assetsListAssets2,
	},
	'assets.deleteAsset': {
		input: HeygenEndpointInputSchemas.assetsDeleteAsset,
		output: HeygenEndpointOutputSchemas.assetsDeleteAsset,
	},
	'assets.createFolder': {
		input: HeygenEndpointInputSchemas.assetsCreateFolder,
		output: HeygenEndpointOutputSchemas.assetsCreateFolder,
	},
	'assets.listFolders': {
		input: HeygenEndpointInputSchemas.assetsListFolders,
		output: HeygenEndpointOutputSchemas.assetsListFolders,
	},
	'assets.updateFolder': {
		input: HeygenEndpointInputSchemas.assetsUpdateFolder,
		output: HeygenEndpointOutputSchemas.assetsUpdateFolder,
	},
	'assets.trashFolder': {
		input: HeygenEndpointInputSchemas.assetsTrashFolder,
		output: HeygenEndpointOutputSchemas.assetsTrashFolder,
	},
	'assets.restoreFolder': {
		input: HeygenEndpointInputSchemas.assetsRestoreFolder,
		output: HeygenEndpointOutputSchemas.assetsRestoreFolder,
	},

	'webhooksQuota.addEndpoint': {
		input: HeygenEndpointInputSchemas.webhooksQuotaAddEndpoint,
		output: HeygenEndpointOutputSchemas.webhooksQuotaAddEndpoint,
	},
	'webhooksQuota.listEndpoints': {
		input: HeygenEndpointInputSchemas.webhooksQuotaListEndpoints,
		output: HeygenEndpointOutputSchemas.webhooksQuotaListEndpoints,
	},
	'webhooksQuota.listEventTypes': {
		input: HeygenEndpointInputSchemas.webhooksQuotaListEventTypes,
		output: HeygenEndpointOutputSchemas.webhooksQuotaListEventTypes,
	},
	'webhooksQuota.updateEndpoint': {
		input: HeygenEndpointInputSchemas.webhooksQuotaUpdateEndpoint,
		output: HeygenEndpointOutputSchemas.webhooksQuotaUpdateEndpoint,
	},
	'webhooksQuota.deleteEndpoint': {
		input: HeygenEndpointInputSchemas.webhooksQuotaDeleteEndpoint,
		output: HeygenEndpointOutputSchemas.webhooksQuotaDeleteEndpoint,
	},
	'webhooksQuota.getCurrentUser': {
		input: HeygenEndpointInputSchemas.webhooksQuotaGetCurrentUser,
		output: HeygenEndpointOutputSchemas.webhooksQuotaGetCurrentUser,
	},
	'webhooksQuota.remainingQuota': {
		input: HeygenEndpointInputSchemas.webhooksQuotaRemainingQuota,
		output: HeygenEndpointOutputSchemas.webhooksQuotaRemainingQuota,
	},
	'webhooksQuota.listEventTypesV3': {
		input: HeygenEndpointInputSchemas.webhooksListEventTypesV3,
		output: HeygenEndpointOutputSchemas.webhooksListEventTypesV3,
	},
	'webhooksQuota.listEndpointsV3': {
		input: HeygenEndpointInputSchemas.webhooksListEndpointsV3,
		output: HeygenEndpointOutputSchemas.webhooksListEndpointsV3,
	},
	'webhooksQuota.addEndpointV3': {
		input: HeygenEndpointInputSchemas.webhooksAddEndpointV3,
		output: HeygenEndpointOutputSchemas.webhooksAddEndpointV3,
	},
	'webhooksQuota.deleteEndpointV3': {
		input: HeygenEndpointInputSchemas.webhooksDeleteEndpointV3,
		output: HeygenEndpointOutputSchemas.webhooksDeleteEndpointV3,
	},
	'webhooksQuota.updateEndpointV3': {
		input: HeygenEndpointInputSchemas.webhooksUpdateEndpointV3,
		output: HeygenEndpointOutputSchemas.webhooksUpdateEndpointV3,
	},
	'webhooksQuota.rotateSecret': {
		input: HeygenEndpointInputSchemas.webhooksRotateSecret,
		output: HeygenEndpointOutputSchemas.webhooksRotateSecret,
	},
	'webhooksQuota.listEvents': {
		input: HeygenEndpointInputSchemas.webhooksListEvents,
		output: HeygenEndpointOutputSchemas.webhooksListEvents,
	},

	'videos.listV3': {
		input: HeygenEndpointInputSchemas.videosListV3,
		output: HeygenEndpointOutputSchemas.videosListV3,
	},
	'videos.deleteV3': {
		input: HeygenEndpointInputSchemas.videosDeleteV3,
		output: HeygenEndpointOutputSchemas.videosDeleteV3,
	},

	'avatars.create': {
		input: HeygenEndpointInputSchemas.avatarsCreate,
		output: HeygenEndpointOutputSchemas.avatarsCreate,
	},
	'avatars.getGroup': {
		input: HeygenEndpointInputSchemas.avatarsGetGroup,
		output: HeygenEndpointOutputSchemas.avatarsGetGroup,
	},
	'avatars.deleteGroup': {
		input: HeygenEndpointInputSchemas.avatarsDeleteGroup,
		output: HeygenEndpointOutputSchemas.avatarsDeleteGroup,
	},
	'avatars.createConsent': {
		input: HeygenEndpointInputSchemas.avatarsCreateConsent,
		output: HeygenEndpointOutputSchemas.avatarsCreateConsent,
	},
	'avatars.listLooks': {
		input: HeygenEndpointInputSchemas.avatarsListLooks,
		output: HeygenEndpointOutputSchemas.avatarsListLooks,
	},
	'avatars.getLook': {
		input: HeygenEndpointInputSchemas.avatarsGetLook,
		output: HeygenEndpointOutputSchemas.avatarsGetLook,
	},
	'avatars.deleteLook': {
		input: HeygenEndpointInputSchemas.avatarsDeleteLook,
		output: HeygenEndpointOutputSchemas.avatarsDeleteLook,
	},
	'avatars.updateLook': {
		input: HeygenEndpointInputSchemas.avatarsUpdateLook,
		output: HeygenEndpointOutputSchemas.avatarsUpdateLook,
	},

	'voices.generateSpeechV3': {
		input: HeygenEndpointInputSchemas.voicesGenerateSpeechV3,
		output: HeygenEndpointOutputSchemas.voicesGenerateSpeechV3,
	},
	'voices.listV3': {
		input: HeygenEndpointInputSchemas.voicesListV3,
		output: HeygenEndpointOutputSchemas.voicesListV3,
	},
	'voices.design': {
		input: HeygenEndpointInputSchemas.voicesDesign,
		output: HeygenEndpointOutputSchemas.voicesDesign,
	},
	'voices.clone': {
		input: HeygenEndpointInputSchemas.voicesClone,
		output: HeygenEndpointOutputSchemas.voicesClone,
	},
	'voices.getV3': {
		input: HeygenEndpointInputSchemas.voicesGetV3,
		output: HeygenEndpointOutputSchemas.voicesGetV3,
	},
	'voices.deleteV3': {
		input: HeygenEndpointInputSchemas.voicesDeleteV3,
		output: HeygenEndpointOutputSchemas.voicesDeleteV3,
	},

	'assets.uploadAssetV3': {
		input: HeygenEndpointInputSchemas.assetsUploadAssetV3,
		output: HeygenEndpointOutputSchemas.assetsUploadAssetV3,
	},
	'assets.getAsset': {
		input: HeygenEndpointInputSchemas.assetsGetAsset,
		output: HeygenEndpointOutputSchemas.assetsGetAsset,
	},
	'assets.deleteAssetV3': {
		input: HeygenEndpointInputSchemas.assetsDeleteAssetV3,
		output: HeygenEndpointOutputSchemas.assetsDeleteAssetV3,
	},
	'assets.createUploadSession': {
		input: HeygenEndpointInputSchemas.assetsCreateUploadSession,
		output: HeygenEndpointOutputSchemas.assetsCreateUploadSession,
	},
	'assets.completeUpload': {
		input: HeygenEndpointInputSchemas.assetsCompleteUpload,
		output: HeygenEndpointOutputSchemas.assetsCompleteUpload,
	},

	'videoAgents.listSessions': {
		input: HeygenEndpointInputSchemas.videoAgentsListSessions,
		output: HeygenEndpointOutputSchemas.videoAgentsListSessions,
	},
	'videoAgents.createSession': {
		input: HeygenEndpointInputSchemas.videoAgentsCreateSession,
		output: HeygenEndpointOutputSchemas.videoAgentsCreateSession,
	},
	'videoAgents.listStyles': {
		input: HeygenEndpointInputSchemas.videoAgentsListStyles,
		output: HeygenEndpointOutputSchemas.videoAgentsListStyles,
	},
	'videoAgents.getSession': {
		input: HeygenEndpointInputSchemas.videoAgentsGetSession,
		output: HeygenEndpointOutputSchemas.videoAgentsGetSession,
	},
	'videoAgents.sendMessage': {
		input: HeygenEndpointInputSchemas.videoAgentsSendMessage,
		output: HeygenEndpointOutputSchemas.videoAgentsSendMessage,
	},
	'videoAgents.getResource': {
		input: HeygenEndpointInputSchemas.videoAgentsGetResource,
		output: HeygenEndpointOutputSchemas.videoAgentsGetResource,
	},
	'videoAgents.listVideos': {
		input: HeygenEndpointInputSchemas.videoAgentsListVideos,
		output: HeygenEndpointOutputSchemas.videoAgentsListVideos,
	},
	'videoAgents.stopSession': {
		input: HeygenEndpointInputSchemas.videoAgentsStopSession,
		output: HeygenEndpointOutputSchemas.videoAgentsStopSession,
	},

	'brand.listGlossaries': {
		input: HeygenEndpointInputSchemas.brandListGlossaries,
		output: HeygenEndpointOutputSchemas.brandListGlossaries,
	},
	'brand.listKits': {
		input: HeygenEndpointInputSchemas.brandListKits,
		output: HeygenEndpointOutputSchemas.brandListKits,
	},

	'avatarRealtime.createSession': {
		input: HeygenEndpointInputSchemas.avatarRealtimeCreateSession,
		output: HeygenEndpointOutputSchemas.avatarRealtimeCreateSession,
	},
	'avatarRealtime.getSession': {
		input: HeygenEndpointInputSchemas.avatarRealtimeGetSession,
		output: HeygenEndpointOutputSchemas.avatarRealtimeGetSession,
	},
	'avatarRealtime.appendText': {
		input: HeygenEndpointInputSchemas.avatarRealtimeAppendText,
		output: HeygenEndpointOutputSchemas.avatarRealtimeAppendText,
	},
	'avatarRealtime.cancelSession': {
		input: HeygenEndpointInputSchemas.avatarRealtimeCancelSession,
		output: HeygenEndpointOutputSchemas.avatarRealtimeCancelSession,
	},

	'audio.search': {
		input: HeygenEndpointInputSchemas.audioSearch,
		output: HeygenEndpointOutputSchemas.audioSearch,
	},

	'videoTranslations.list': {
		input: HeygenEndpointInputSchemas.videoTranslationsList,
		output: HeygenEndpointOutputSchemas.videoTranslationsList,
	},
	'videoTranslations.delete': {
		input: HeygenEndpointInputSchemas.videoTranslationsDelete,
		output: HeygenEndpointOutputSchemas.videoTranslationsDelete,
	},
	'videoTranslations.update': {
		input: HeygenEndpointInputSchemas.videoTranslationsUpdate,
		output: HeygenEndpointOutputSchemas.videoTranslationsUpdate,
	},

	'proofread.create': {
		input: HeygenEndpointInputSchemas.proofreadCreate,
		output: HeygenEndpointOutputSchemas.proofreadCreate,
	},
	'proofread.get': {
		input: HeygenEndpointInputSchemas.proofreadGet,
		output: HeygenEndpointOutputSchemas.proofreadGet,
	},
	'proofread.downloadSrt': {
		input: HeygenEndpointInputSchemas.proofreadDownloadSrt,
		output: HeygenEndpointOutputSchemas.proofreadDownloadSrt,
	},
	'proofread.uploadSrt': {
		input: HeygenEndpointInputSchemas.proofreadUploadSrt,
		output: HeygenEndpointOutputSchemas.proofreadUploadSrt,
	},
	'proofread.generateVideo': {
		input: HeygenEndpointInputSchemas.proofreadGenerateVideo,
		output: HeygenEndpointOutputSchemas.proofreadGenerateVideo,
	},

	'lipsync.list': {
		input: HeygenEndpointInputSchemas.lipsyncList,
		output: HeygenEndpointOutputSchemas.lipsyncList,
	},
	'lipsync.create': {
		input: HeygenEndpointInputSchemas.lipsyncCreate,
		output: HeygenEndpointOutputSchemas.lipsyncCreate,
	},
	'lipsync.get': {
		input: HeygenEndpointInputSchemas.lipsyncGet,
		output: HeygenEndpointOutputSchemas.lipsyncGet,
	},
	'lipsync.delete': {
		input: HeygenEndpointInputSchemas.lipsyncDelete,
		output: HeygenEndpointOutputSchemas.lipsyncDelete,
	},
	'lipsync.update': {
		input: HeygenEndpointInputSchemas.lipsyncUpdate,
		output: HeygenEndpointOutputSchemas.lipsyncUpdate,
	},

	'hyperframes.list': {
		input: HeygenEndpointInputSchemas.hyperframesList,
		output: HeygenEndpointOutputSchemas.hyperframesList,
	},
	'hyperframes.create': {
		input: HeygenEndpointInputSchemas.hyperframesCreate,
		output: HeygenEndpointOutputSchemas.hyperframesCreate,
	},
	'hyperframes.get': {
		input: HeygenEndpointInputSchemas.hyperframesGet,
		output: HeygenEndpointOutputSchemas.hyperframesGet,
	},
	'hyperframes.delete': {
		input: HeygenEndpointInputSchemas.hyperframesDelete,
		output: HeygenEndpointOutputSchemas.hyperframesDelete,
	},

	'aiClipping.get': {
		input: HeygenEndpointInputSchemas.aiClippingGet,
		output: HeygenEndpointOutputSchemas.aiClippingGet,
	},
	'aiClipping.delete': {
		input: HeygenEndpointInputSchemas.aiClippingDelete,
		output: HeygenEndpointOutputSchemas.aiClippingDelete,
	},
	'aiClipping.list': {
		input: HeygenEndpointInputSchemas.aiClippingList,
		output: HeygenEndpointOutputSchemas.aiClippingList,
	},
	'aiClipping.create': {
		input: HeygenEndpointInputSchemas.aiClippingCreate,
		output: HeygenEndpointOutputSchemas.aiClippingCreate,
	},
} satisfies RequiredPluginEndpointSchemas<typeof heygenEndpointsNested>;

const heygenEndpointMeta = {
	'videos.generate': {
		riskLevel: 'write',
		description:
			'Generate a customized avatar video with voices and character configs',
	},
	'videos.templateGenerate': {
		riskLevel: 'write',
		description:
			'Generate a customized video from a pre-existing template using variable definitions',
	},
	'videos.createWebm': {
		riskLevel: 'write',
		description:
			'Create a WebM format video with transparent background featuring studio avatars',
	},
	'videos.personalizedAddContact': {
		riskLevel: 'write',
		description:
			'Add recipient contacts (name/email) to a personalized video project',
	},
	'videos.personalizedProjectDetail': {
		riskLevel: 'read',
		description:
			'Retrieve details, status, and metadata for a personalized video project',
	},
	'videos.getStatus': {
		riskLevel: 'read',
		description:
			'Retrieve asynchronous video processing status and time-limited download URLs',
	},
	'videos.translate': {
		riskLevel: 'write',
		description: 'Translate video content or audio tracks across 77+ languages',
	},
	'videos.translateStatus': {
		riskLevel: 'read',
		description: 'Retrieve current progress/status of a video translation job',
	},
	'videos.translateTargetLanguages': {
		riskLevel: 'read',
		description:
			'Retrieve the list of all supported target languages for video translation',
	},
	'videos.getSharableUrl': {
		riskLevel: 'write',
		description:
			'Generate a public, shareable URL for a video without authentication requirements',
	},
	'videos.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a generated or translated video by ID',
	},
	'videos.list': {
		riskLevel: 'read',
		description:
			'Retrieve a paginated list of videos associated with the account',
	},

	'avatars.list': {
		riskLevel: 'read',
		description:
			'Retrieve a list of available public and private avatars with pagination',
	},
	'avatars.getDetails': {
		riskLevel: 'read',
		description:
			'Retrieve comprehensive details, display properties, and preview media for an avatar',
	},
	'avatars.listGroups': {
		riskLevel: 'read',
		description: 'Retrieve a list of all avatar groups in the account',
	},
	'avatars.listGroupAvatars': {
		riskLevel: 'read',
		description: 'Retrieve all avatars within a specific avatar group',
	},
	'avatars.searchPublicGroups': {
		riskLevel: 'read',
		description: 'Search public avatar groups with filters and pagination',
	},
	'avatars.createPhotoGroup': {
		riskLevel: 'write',
		description:
			'Create an avatar group for AI-generated and user-uploaded photos',
	},
	'avatars.generatePhotos': {
		riskLevel: 'write',
		description:
			'Generate AI avatar photos based on text prompts and attributes',
	},
	'avatars.addLooks': {
		riskLevel: 'write',
		description:
			'Add up to 4 image look variations to an existing photo avatar group',
	},
	'avatars.checkLookStatus': {
		riskLevel: 'read',
		description: 'Monitor the generation status/progress of photo avatar looks',
	},
	'avatars.getTrainingStatus': {
		riskLevel: 'read',
		description: 'Monitor the training progress of a photo avatar training job',
	},
	'avatars.getPhotoDetails': {
		riskLevel: 'read',
		description:
			'Retrieve comprehensive metadata and configuration for a photo avatar/look',
	},
	'avatars.deletePhotoGroup': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a photo avatar group by ID',
	},
	'avatars.deletePhoto': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a photo avatar by ID',
	},
	'avatars.addMotion': {
		riskLevel: 'write',
		description:
			'Animate a still photo avatar into a moving lifelike motion avatar',
	},
	'avatars.upscale': {
		riskLevel: 'write',
		description:
			'Enhance the resolution and quality of an existing motion avatar',
	},
	'avatars.listTalkingPhotos': {
		riskLevel: 'read',
		description:
			'Retrieve a list of existing interactive talking photo projects',
	},
	'avatars.uploadTalkingPhoto': {
		riskLevel: 'write',
		description:
			'Create an interactive talking photo from an uploaded JPEG/PNG binary image',
	},
	'avatars.deleteTalkingPhoto': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a specific talking photo resource',
	},

	'voices.generateSpeech': {
		riskLevel: 'write',
		description:
			'Generate a speech audio file from text input using the Starfish TTS model',
	},
	'voices.generatePreview': {
		riskLevel: 'write',
		description: 'Generate a short audio preview clip (Enterprise Beta)',
	},
	'voices.listTts': {
		riskLevel: 'read',
		description:
			'Retrieve public and custom voices compatible with the Starfish model',
	},
	'voices.listLocales': {
		riskLevel: 'read',
		description: 'Retrieve available locales/dialects for multilingual voices',
	},
	'voices.listV2': {
		riskLevel: 'read',
		description:
			'Retrieve a comprehensive list of available voice models and characteristics',
	},
	'voices.listV1': {
		riskLevel: 'read',
		description: 'Retrieve a metadata list of all available studio voices',
	},
	'voices.listBrandVoices': {
		riskLevel: 'read',
		description:
			'Retrieve brand glossaries maintaining consistent terminology/pronunciation',
	},

	'streaming.newSession': {
		riskLevel: 'write',
		description:
			'Initiate a streaming session with an Interactive Avatar to get a WebSocket URL, session ID, and token',
	},
	'streaming.createToken': {
		riskLevel: 'write',
		description:
			'Generate a time-limited authentication token for streaming sessions',
	},
	'streaming.start': {
		riskLevel: 'write',
		description:
			'Establish a WebRTC SDP offer connection for real-time video/audio streaming',
	},
	'streaming.stop': {
		riskLevel: 'write',
		description:
			'Terminate an active WebRTC streaming session and free resources',
	},
	'streaming.interrupt': {
		riskLevel: 'write',
		description:
			"Abruptly interrupt an avatar's ongoing action/speech for instant control",
	},
	'streaming.keepAlive': {
		riskLevel: 'write',
		description:
			'Reset the idle timeout counter for an active streaming session',
	},
	'streaming.task': {
		riskLevel: 'write',
		description:
			'Send a real-time text speaking task to an active streaming avatar',
	},
	'streaming.ice': {
		riskLevel: 'write',
		description:
			'Submit ICE candidate information for WebRTC peer-to-peer negotiation',
	},
	'streaming.new': {
		riskLevel: 'write',
		description: 'Initiate a streaming session with specified quality settings',
	},
	'streaming.list': {
		riskLevel: 'read',
		description: 'Retrieve a list of active or available streaming sessions',
	},
	'streaming.listAvatars': {
		riskLevel: 'read',
		description:
			'Retrieve a list of public and custom interactive avatars available for streaming',
	},
	'streaming.listSessionHistory': {
		riskLevel: 'read',
		description:
			'Retrieve a paginated history and metadata of past streaming sessions',
	},

	'knowledgeBases.create': {
		riskLevel: 'write',
		description:
			'Create a knowledge base with a custom name, opening line, and prompt for interactive sessions',
	},
	'knowledgeBases.list': {
		riskLevel: 'read',
		description: 'Retrieve a list of all existing knowledge bases',
	},
	'knowledgeBases.update': {
		riskLevel: 'write',
		description:
			'Modify the opening line, prompt, or name of an existing knowledge base',
	},
	'knowledgeBases.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently remove a knowledge base by ID',
	},

	'assets.listTemplates': {
		riskLevel: 'read',
		description: 'Retrieve a list of pre-designed avatar templates',
	},
	'assets.getTemplate': {
		riskLevel: 'read',
		description:
			'Retrieve structure, placeholders, and avatar settings of a specific template',
	},
	'assets.uploadAsset': {
		riskLevel: 'write',
		description: 'Upload an image, video, or audio file asset to the platform',
	},
	'assets.listAssets': {
		riskLevel: 'read',
		description:
			'Retrieve a paginated list of assets with type/folder filtering',
	},
	'assets.listAssets2': {
		riskLevel: 'read',
		description:
			'Retrieve a list of uploaded assets with cursor/page pagination',
	},
	'assets.deleteAsset': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a specific media asset by ID',
	},
	'assets.createFolder': {
		riskLevel: 'write',
		description: 'Create a new folder to organize videos and assets',
	},
	'assets.listFolders': {
		riskLevel: 'read',
		description: 'Retrieve a paginated list of folders in the account',
	},
	'assets.updateFolder': {
		riskLevel: 'write',
		description: 'Rename an existing folder by ID',
	},
	'assets.trashFolder': {
		riskLevel: 'write',
		description:
			'Soft-delete a folder by moving it to trash (recoverable via restoreFolder)',
	},
	'assets.restoreFolder': {
		riskLevel: 'write',
		description: 'Recover a previously trashed folder',
	},

	'webhooksQuota.addEndpoint': {
		riskLevel: 'write',
		description:
			'Configure a new webhook URL to receive notifications for specified events',
	},
	'webhooksQuota.listEndpoints': {
		riskLevel: 'read',
		description: 'Retrieve a list of configured webhook endpoints and status',
	},
	'webhooksQuota.listEventTypes': {
		riskLevel: 'read',
		description: 'Retrieve a complete list of supported webhook event types',
	},
	'webhooksQuota.updateEndpoint': {
		riskLevel: 'write',
		description:
			'Modify the URL or subscribed events of an existing webhook endpoint',
	},
	'webhooksQuota.deleteEndpoint': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a webhook endpoint configuration',
	},
	'webhooksQuota.getCurrentUser': {
		riskLevel: 'read',
		description:
			'Retrieve the authenticated user profile, quotas, and subscription details',
	},
	'webhooksQuota.remainingQuota': {
		riskLevel: 'read',
		description:
			'Retrieve the current remaining API credit quota and available resources',
	},
	'webhooksQuota.listEventTypesV3': {
		riskLevel: 'read',
		description:
			'Retrieve all available v3 webhook event types with descriptions',
	},
	'webhooksQuota.listEndpointsV3': {
		riskLevel: 'read',
		description: 'Retrieve a paginated list of configured v3 webhook endpoints',
	},
	'webhooksQuota.addEndpointV3': {
		riskLevel: 'write',
		description:
			'Register a new v3 webhook endpoint URL to receive event notifications',
	},
	'webhooksQuota.deleteEndpointV3': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a v3 webhook endpoint configuration',
	},
	'webhooksQuota.updateEndpointV3': {
		riskLevel: 'write',
		description:
			'Modify the URL or subscribed events of an existing v3 webhook endpoint',
	},
	'webhooksQuota.rotateSecret': {
		riskLevel: 'write',
		description: 'Rotate the signing secret for a v3 webhook endpoint',
	},
	'webhooksQuota.listEvents': {
		riskLevel: 'read',
		description: 'Retrieve a paginated log of delivered v3 webhook events',
	},

	'videos.listV3': {
		riskLevel: 'read',
		description: 'Retrieve a cursor-paginated list of videos via the v3 API',
	},
	'videos.deleteV3': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a video and its associated files via the v3 API',
	},

	'avatars.create': {
		riskLevel: 'write',
		description:
			'Create a new avatar from a prompt, digital twin video, or photo',
	},
	'avatars.getGroup': {
		riskLevel: 'read',
		description: 'Retrieve details for a specific avatar group',
	},
	'avatars.deleteGroup': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete an avatar group by ID',
	},
	'avatars.createConsent': {
		riskLevel: 'write',
		description:
			'Start the consent verification flow required for a custom avatar group',
	},
	'avatars.listLooks': {
		riskLevel: 'read',
		description:
			'Retrieve a paginated list of avatar looks (outfits, poses, styles)',
	},
	'avatars.getLook': {
		riskLevel: 'read',
		description: 'Retrieve details for a specific avatar look',
	},
	'avatars.deleteLook': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a photo avatar or digital twin look',
	},
	'avatars.updateLook': {
		riskLevel: 'write',
		description: 'Rename a photo avatar or digital twin look',
	},

	'voices.generateSpeechV3': {
		riskLevel: 'write',
		description:
			'Generate a speech audio file from text via the v3 Starfish TTS engine',
	},
	'voices.listV3': {
		riskLevel: 'read',
		description: 'Retrieve a cursor-paginated list of voices via the v3 API',
	},
	'voices.design': {
		riskLevel: 'write',
		description:
			'Generate up to 3 candidate synthetic voices from a text description',
	},
	'voices.clone': {
		riskLevel: 'write',
		description: 'Clone a custom voice from a reference audio sample',
	},
	'voices.getV3': {
		riskLevel: 'read',
		description: 'Retrieve the status and details of a voice via the v3 API',
	},
	'voices.deleteV3': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a voice via the v3 API',
	},

	'assets.uploadAssetV3': {
		riskLevel: 'write',
		description: 'Upload an image, video, audio, or PDF asset via the v3 API',
	},
	'assets.getAsset': {
		riskLevel: 'read',
		description: 'Retrieve metadata for an asset via the v3 API',
	},
	'assets.deleteAssetV3': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete an asset via the v3 API',
	},
	'assets.createUploadSession': {
		riskLevel: 'write',
		description: 'Create a presigned direct-upload session for a large asset',
	},
	'assets.completeUpload': {
		riskLevel: 'write',
		description:
			'Finalize a presigned direct-upload session into a usable asset',
	},

	'videoAgents.listSessions': {
		riskLevel: 'read',
		description: 'Retrieve a paginated list of video agent sessions',
	},
	'videoAgents.createSession': {
		riskLevel: 'write',
		description:
			'Create a video agent session that generates a video from a text prompt',
	},
	'videoAgents.listStyles': {
		riskLevel: 'read',
		description: 'Retrieve a paginated list of available video agent styles',
	},
	'videoAgents.getSession': {
		riskLevel: 'read',
		description:
			'Retrieve the status, progress, and chat history of a video agent session',
	},
	'videoAgents.sendMessage': {
		riskLevel: 'write',
		description:
			'Send a chat message or revision request to an active video agent session',
	},
	'videoAgents.getResource': {
		riskLevel: 'read',
		description:
			'Retrieve a specific resource generated within a video agent session',
	},
	'videoAgents.listVideos': {
		riskLevel: 'read',
		description: 'Retrieve the videos generated within a video agent session',
	},
	'videoAgents.stopSession': {
		riskLevel: 'write',
		description: 'Stop an in-progress video agent session',
	},

	'brand.listGlossaries': {
		riskLevel: 'read',
		description:
			'Retrieve a paginated list of brand glossaries for custom term translation',
	},
	'brand.listKits': {
		riskLevel: 'read',
		description:
			'Retrieve a paginated list of brand kits (logos, colors, fonts)',
	},

	'avatarRealtime.createSession': {
		riskLevel: 'write',
		description:
			'Create a low-latency HLS streaming session with an interactive avatar',
	},
	'avatarRealtime.getSession': {
		riskLevel: 'read',
		description:
			'Retrieve the status and playback URL of an avatar realtime session',
	},
	'avatarRealtime.appendText': {
		riskLevel: 'write',
		description:
			'Append streamed text to an active text_stream avatar realtime session',
	},
	'avatarRealtime.cancelSession': {
		riskLevel: 'write',
		description: 'Cancel an active avatar realtime streaming session',
	},

	'audio.search': {
		riskLevel: 'read',
		description:
			"Search HeyGen's library of background music and sound effects",
	},

	'videoTranslations.list': {
		riskLevel: 'read',
		description: 'Retrieve a cursor-paginated list of video translation jobs',
	},
	'videoTranslations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a video translation and its associated files',
	},
	'videoTranslations.update': {
		riskLevel: 'write',
		description: 'Update the display title of a video translation job',
	},

	'proofread.create': {
		riskLevel: 'write',
		description:
			'Create a proofread session for reviewing a video translation before rendering',
	},
	'proofread.get': {
		riskLevel: 'read',
		description: 'Retrieve the status and details of a proofread session',
	},
	'proofread.downloadSrt': {
		riskLevel: 'read',
		description:
			"Retrieve presigned download URLs for a proofread session's SRT files",
	},
	'proofread.uploadSrt': {
		riskLevel: 'write',
		description:
			"Replace a proofread session's subtitles with an edited SRT file",
	},
	'proofread.generateVideo': {
		riskLevel: 'write',
		description:
			'Render the final translated video from a completed proofread session',
	},

	'lipsync.list': {
		riskLevel: 'read',
		description: 'Retrieve a cursor-paginated list of lipsync jobs',
	},
	'lipsync.create': {
		riskLevel: 'write',
		description:
			'Create a lipsync job that syncs a video to a separate audio track',
	},
	'lipsync.get': {
		riskLevel: 'read',
		description: 'Retrieve the status and details of a lipsync job',
	},
	'lipsync.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a lipsync job and its output',
	},
	'lipsync.update': {
		riskLevel: 'write',
		description: 'Update the display title of a lipsync job',
	},

	'hyperframes.list': {
		riskLevel: 'read',
		description: 'Retrieve a cursor-paginated list of HyperFrames renders',
	},
	'hyperframes.create': {
		riskLevel: 'write',
		description:
			'Create a HyperFrames cloud render from an HTML/motion-graphics project',
	},
	'hyperframes.get': {
		riskLevel: 'read',
		description: 'Retrieve the status and details of a HyperFrames render',
	},
	'hyperframes.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a HyperFrames render',
	},

	'aiClipping.get': {
		riskLevel: 'read',
		description:
			'Retrieve the status and generated clips of an AI clipping job',
	},
	'aiClipping.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Soft-delete an AI clipping job and its clips',
	},
	'aiClipping.list': {
		riskLevel: 'read',
		description: 'Retrieve a cursor-paginated list of AI clipping jobs',
	},
	'aiClipping.create': {
		riskLevel: 'write',
		description:
			'Create an AI clipping job that turns a long video into short highlight clips',
	},
} satisfies RequiredPluginEndpointMeta<typeof heygenEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const heygenAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseHeygenPlugin<T extends HeygenPluginOptions> = CorsairPlugin<
	'heygen',
	typeof HeygenSchema,
	typeof heygenEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof heygenAuthConfig
>;

export type InternalHeygenPlugin = BaseHeygenPlugin<HeygenPluginOptions>;

export type ExternalHeygenPlugin<T extends HeygenPluginOptions> =
	BaseHeygenPlugin<T>;

// The assertion is safe: HeygenPluginOptions has no required fields (all are
// optional), so an empty object satisfies the constraint at runtime even
// though TypeScript cannot verify it without the assertion.
export function heygen<const T extends HeygenPluginOptions>(
	incomingOptions: HeygenPluginOptions & T = {} as HeygenPluginOptions & T,
): ExternalHeygenPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'heygen',
		schema: HeygenSchema,
		options,
		hooks: options.hooks,
		endpoints: heygenEndpointsNested,
		webhooks: {},
		endpointMeta: heygenEndpointMeta,
		endpointSchemas: heygenEndpointSchemas,
		authConfig: heygenAuthConfig,
		pluginWebhookMatcher: () => false,
		errorHandlers: (() => {
			// DEFAULT matches everything (`() => true`), so it must always be evaluated
			// last — otherwise it shadows any custom handler contributed via options.
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: HeygenKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();

				if (!key) {
					throw new AuthMissingError('heygen', 'api_key');
				}

				return key;
			}

			throw new AuthMissingError('heygen', 'api_key');
		},
	} satisfies InternalHeygenPlugin;
}

export type {
	HeygenEndpointInputs,
	HeygenEndpointOutputs,
} from './endpoints/types';
