import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Account,
	Agents,
	AudioIsolation,
	Dubbing,
	ForcedAlignment,
	History,
	Models,
	Music,
	SingleUseTokens,
	SoundEffects,
	SpeechToText,
	TextToDialogue,
	TextToSpeech,
	VoiceChanger,
	VoiceDesign,
	Voices,
} from './endpoints';
import type {
	ElevenLabsEndpointInputs,
	ElevenLabsEndpointOutputs,
} from './endpoints/types';
import {
	ElevenLabsEndpointInputSchemas,
	ElevenLabsEndpointOutputSchemas,
} from './endpoints/types';
import { withCustomHandlers } from './error-handlers';
import { ElevenLabsSchema } from './schema';
import {
	ConversationWebhooks,
	SpeechToTextWebhooks,
	VoiceWebhooks,
} from './webhooks';
import type {
	CallInitiationFailureEvent,
	ElevenLabsWebhookOutputs,
	PostCallAudioEvent,
	PostCallTranscriptionEvent,
	SpeechToTextFailedEvent,
	SpeechToTextTranscriptionEvent,
	VoiceRemovalNoticeEvent,
	VoiceRemovalNoticeWithdrawnEvent,
	VoiceRemovedEvent,
} from './webhooks/types';
import {
	CallInitiationFailureEventSchema,
	isElevenLabsWebhook,
	PostCallAudioEventSchema,
	PostCallTranscriptionEventSchema,
	SpeechToTextFailedEventSchema,
	SpeechToTextTranscriptionEventSchema,
	VoiceRemovalNoticeEventSchema,
	VoiceRemovalNoticeWithdrawnEventSchema,
	VoiceRemovedEventSchema,
} from './webhooks/types';

export type ElevenLabsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** An ElevenLabs API key. Overrides the stored key. */
	key?: string;
	/** The webhook's HMAC secret. Overrides the stored webhook_signature. */
	webhookSecret?: string;
	hooks?: InternalElevenLabsPlugin['hooks'];
	webhookHooks?: InternalElevenLabsPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof elevenLabsEndpointsNested>;
};

export type ElevenLabsContext = CorsairPluginContext<
	typeof ElevenLabsSchema,
	ElevenLabsPluginOptions
>;

export type ElevenLabsKeyBuilderContext =
	KeyBuilderContext<ElevenLabsPluginOptions>;

export type ElevenLabsBoundEndpoints = BindEndpoints<
	typeof elevenLabsEndpointsNested
>;

type ElevenLabsEndpoint<K extends keyof ElevenLabsEndpointOutputs> =
	CorsairEndpoint<
		ElevenLabsContext,
		ElevenLabsEndpointInputs[K],
		ElevenLabsEndpointOutputs[K]
	>;

export type ElevenLabsEndpoints = {
	textToSpeechConvert: ElevenLabsEndpoint<'textToSpeechConvert'>;
	textToSpeechConvertWithTimestamps: ElevenLabsEndpoint<'textToSpeechConvertWithTimestamps'>;
	textToDialogueConvert: ElevenLabsEndpoint<'textToDialogueConvert'>;
	speechToTextConvert: ElevenLabsEndpoint<'speechToTextConvert'>;
	speechToTextGetTranscript: ElevenLabsEndpoint<'speechToTextGetTranscript'>;
	speechToTextDeleteTranscript: ElevenLabsEndpoint<'speechToTextDeleteTranscript'>;
	forcedAlignmentCreate: ElevenLabsEndpoint<'forcedAlignmentCreate'>;
	soundEffectsGenerate: ElevenLabsEndpoint<'soundEffectsGenerate'>;
	musicCompose: ElevenLabsEndpoint<'musicCompose'>;
	musicPlan: ElevenLabsEndpoint<'musicPlan'>;
	musicSeparateStems: ElevenLabsEndpoint<'musicSeparateStems'>;
	audioIsolationIsolate: ElevenLabsEndpoint<'audioIsolationIsolate'>;
	voiceChangerConvert: ElevenLabsEndpoint<'voiceChangerConvert'>;
	voicesList: ElevenLabsEndpoint<'voicesList'>;
	voicesGet: ElevenLabsEndpoint<'voicesGet'>;
	voicesSearchLibrary: ElevenLabsEndpoint<'voicesSearchLibrary'>;
	voicesAddFromLibrary: ElevenLabsEndpoint<'voicesAddFromLibrary'>;
	voicesEdit: ElevenLabsEndpoint<'voicesEdit'>;
	voicesDelete: ElevenLabsEndpoint<'voicesDelete'>;
	voicesGetSettings: ElevenLabsEndpoint<'voicesGetSettings'>;
	voicesEditSettings: ElevenLabsEndpoint<'voicesEditSettings'>;
	voicesDefaultSettings: ElevenLabsEndpoint<'voicesDefaultSettings'>;
	voiceDesignDesign: ElevenLabsEndpoint<'voiceDesignDesign'>;
	voiceDesignGetPreview: ElevenLabsEndpoint<'voiceDesignGetPreview'>;
	voiceDesignCreate: ElevenLabsEndpoint<'voiceDesignCreate'>;
	voiceDesignRemix: ElevenLabsEndpoint<'voiceDesignRemix'>;
	dubbingCreate: ElevenLabsEndpoint<'dubbingCreate'>;
	dubbingGet: ElevenLabsEndpoint<'dubbingGet'>;
	dubbingList: ElevenLabsEndpoint<'dubbingList'>;
	dubbingDelete: ElevenLabsEndpoint<'dubbingDelete'>;
	dubbingGetAudio: ElevenLabsEndpoint<'dubbingGetAudio'>;
	dubbingGetTranscript: ElevenLabsEndpoint<'dubbingGetTranscript'>;
	historyList: ElevenLabsEndpoint<'historyList'>;
	historyGet: ElevenLabsEndpoint<'historyGet'>;
	historyGetAudio: ElevenLabsEndpoint<'historyGetAudio'>;
	historyDelete: ElevenLabsEndpoint<'historyDelete'>;
	modelsList: ElevenLabsEndpoint<'modelsList'>;
	accountUser: ElevenLabsEndpoint<'accountUser'>;
	accountSubscription: ElevenLabsEndpoint<'accountSubscription'>;
	accountUsageStats: ElevenLabsEndpoint<'accountUsageStats'>;
	agentsList: ElevenLabsEndpoint<'agentsList'>;
	agentsGet: ElevenLabsEndpoint<'agentsGet'>;
	agentsCreate: ElevenLabsEndpoint<'agentsCreate'>;
	agentsUpdate: ElevenLabsEndpoint<'agentsUpdate'>;
	agentsDelete: ElevenLabsEndpoint<'agentsDelete'>;
	agentsConversationsList: ElevenLabsEndpoint<'agentsConversationsList'>;
	agentsConversationGet: ElevenLabsEndpoint<'agentsConversationGet'>;
	agentsConversationDelete: ElevenLabsEndpoint<'agentsConversationDelete'>;
	agentsSignedUrl: ElevenLabsEndpoint<'agentsSignedUrl'>;
	singleUseTokensCreate: ElevenLabsEndpoint<'singleUseTokensCreate'>;
};

type ElevenLabsWebhook<
	K extends keyof ElevenLabsWebhookOutputs,
	TEvent,
> = CorsairWebhook<ElevenLabsContext, TEvent, ElevenLabsWebhookOutputs[K]>;

export type ElevenLabsWebhooks = {
	conversationsPostCallTranscription: ElevenLabsWebhook<
		'postCallTranscription',
		PostCallTranscriptionEvent
	>;
	conversationsPostCallAudio: ElevenLabsWebhook<
		'postCallAudio',
		PostCallAudioEvent
	>;
	conversationsCallInitiationFailure: ElevenLabsWebhook<
		'callInitiationFailure',
		CallInitiationFailureEvent
	>;
	speechToTextTranscriptionCompleted: ElevenLabsWebhook<
		'transcriptionCompleted',
		SpeechToTextTranscriptionEvent
	>;
	speechToTextTranscriptionFailed: ElevenLabsWebhook<
		'transcriptionFailed',
		SpeechToTextFailedEvent
	>;
	voicesRemovalNotice: ElevenLabsWebhook<
		'voiceRemovalNotice',
		VoiceRemovalNoticeEvent
	>;
	voicesRemovalNoticeWithdrawn: ElevenLabsWebhook<
		'voiceRemovalNoticeWithdrawn',
		VoiceRemovalNoticeWithdrawnEvent
	>;
	voicesRemoved: ElevenLabsWebhook<'voiceRemoved', VoiceRemovedEvent>;
};

export type ElevenLabsBoundWebhooks = BindWebhooks<
	typeof elevenLabsWebhooksNested
>;

const elevenLabsEndpointsNested = {
	textToSpeech: {
		convert: TextToSpeech.convert,
		convertWithTimestamps: TextToSpeech.convertWithTimestamps,
	},
	textToDialogue: {
		convert: TextToDialogue.convert,
	},
	speechToText: {
		convert: SpeechToText.convert,
		getTranscript: SpeechToText.getTranscript,
		deleteTranscript: SpeechToText.deleteTranscript,
	},
	forcedAlignment: {
		create: ForcedAlignment.create,
	},
	soundEffects: {
		generate: SoundEffects.generate,
	},
	music: {
		compose: Music.compose,
		plan: Music.plan,
		separateStems: Music.separateStems,
	},
	audioIsolation: {
		isolate: AudioIsolation.isolate,
	},
	voiceChanger: {
		convert: VoiceChanger.convert,
	},
	voices: {
		list: Voices.list,
		get: Voices.get,
		searchLibrary: Voices.searchLibrary,
		addFromLibrary: Voices.addFromLibrary,
		edit: Voices.edit,
		delete: Voices.delete,
		getSettings: Voices.getSettings,
		editSettings: Voices.editSettings,
		defaultSettings: Voices.defaultSettings,
	},
	voiceDesign: {
		design: VoiceDesign.design,
		getPreview: VoiceDesign.getPreview,
		create: VoiceDesign.create,
		remix: VoiceDesign.remix,
	},
	dubbing: {
		create: Dubbing.create,
		get: Dubbing.get,
		list: Dubbing.list,
		delete: Dubbing.delete,
		getAudio: Dubbing.getAudio,
		getTranscript: Dubbing.getTranscript,
	},
	history: {
		list: History.list,
		get: History.get,
		getAudio: History.getAudio,
		delete: History.delete,
	},
	models: {
		list: Models.list,
	},
	account: {
		user: Account.user,
		subscription: Account.subscription,
		usageStats: Account.usageStats,
	},
	agents: {
		list: Agents.list,
		get: Agents.get,
		create: Agents.create,
		update: Agents.update,
		delete: Agents.delete,
		conversationsList: Agents.conversationsList,
		conversationGet: Agents.conversationGet,
		conversationDelete: Agents.conversationDelete,
		signedUrl: Agents.signedUrl,
	},
	singleUseTokens: {
		create: SingleUseTokens.create,
	},
} as const;

const elevenLabsWebhooksNested = {
	conversations: {
		postCallTranscription: ConversationWebhooks.postCallTranscription,
		postCallAudio: ConversationWebhooks.postCallAudio,
		callInitiationFailure: ConversationWebhooks.callInitiationFailure,
	},
	speechToText: {
		transcriptionCompleted: SpeechToTextWebhooks.transcriptionCompleted,
		transcriptionFailed: SpeechToTextWebhooks.transcriptionFailed,
	},
	voices: {
		removalNotice: VoiceWebhooks.removalNotice,
		removalNoticeWithdrawn: VoiceWebhooks.removalNoticeWithdrawn,
		removed: VoiceWebhooks.removed,
	},
} as const;

export const elevenLabsEndpointSchemas = {
	'textToSpeech.convert': {
		input: ElevenLabsEndpointInputSchemas.textToSpeechConvert,
		output: ElevenLabsEndpointOutputSchemas.textToSpeechConvert,
	},
	'textToSpeech.convertWithTimestamps': {
		input: ElevenLabsEndpointInputSchemas.textToSpeechConvertWithTimestamps,
		output: ElevenLabsEndpointOutputSchemas.textToSpeechConvertWithTimestamps,
	},
	'textToDialogue.convert': {
		input: ElevenLabsEndpointInputSchemas.textToDialogueConvert,
		output: ElevenLabsEndpointOutputSchemas.textToDialogueConvert,
	},
	'speechToText.convert': {
		input: ElevenLabsEndpointInputSchemas.speechToTextConvert,
		output: ElevenLabsEndpointOutputSchemas.speechToTextConvert,
	},
	'speechToText.getTranscript': {
		input: ElevenLabsEndpointInputSchemas.speechToTextGetTranscript,
		output: ElevenLabsEndpointOutputSchemas.speechToTextGetTranscript,
	},
	'speechToText.deleteTranscript': {
		input: ElevenLabsEndpointInputSchemas.speechToTextDeleteTranscript,
		output: ElevenLabsEndpointOutputSchemas.speechToTextDeleteTranscript,
	},
	'forcedAlignment.create': {
		input: ElevenLabsEndpointInputSchemas.forcedAlignmentCreate,
		output: ElevenLabsEndpointOutputSchemas.forcedAlignmentCreate,
	},
	'soundEffects.generate': {
		input: ElevenLabsEndpointInputSchemas.soundEffectsGenerate,
		output: ElevenLabsEndpointOutputSchemas.soundEffectsGenerate,
	},
	'music.compose': {
		input: ElevenLabsEndpointInputSchemas.musicCompose,
		output: ElevenLabsEndpointOutputSchemas.musicCompose,
	},
	'music.plan': {
		input: ElevenLabsEndpointInputSchemas.musicPlan,
		output: ElevenLabsEndpointOutputSchemas.musicPlan,
	},
	'music.separateStems': {
		input: ElevenLabsEndpointInputSchemas.musicSeparateStems,
		output: ElevenLabsEndpointOutputSchemas.musicSeparateStems,
	},
	'audioIsolation.isolate': {
		input: ElevenLabsEndpointInputSchemas.audioIsolationIsolate,
		output: ElevenLabsEndpointOutputSchemas.audioIsolationIsolate,
	},
	'voiceChanger.convert': {
		input: ElevenLabsEndpointInputSchemas.voiceChangerConvert,
		output: ElevenLabsEndpointOutputSchemas.voiceChangerConvert,
	},
	'voices.list': {
		input: ElevenLabsEndpointInputSchemas.voicesList,
		output: ElevenLabsEndpointOutputSchemas.voicesList,
	},
	'voices.get': {
		input: ElevenLabsEndpointInputSchemas.voicesGet,
		output: ElevenLabsEndpointOutputSchemas.voicesGet,
	},
	'voices.searchLibrary': {
		input: ElevenLabsEndpointInputSchemas.voicesSearchLibrary,
		output: ElevenLabsEndpointOutputSchemas.voicesSearchLibrary,
	},
	'voices.addFromLibrary': {
		input: ElevenLabsEndpointInputSchemas.voicesAddFromLibrary,
		output: ElevenLabsEndpointOutputSchemas.voicesAddFromLibrary,
	},
	'voices.edit': {
		input: ElevenLabsEndpointInputSchemas.voicesEdit,
		output: ElevenLabsEndpointOutputSchemas.voicesEdit,
	},
	'voices.delete': {
		input: ElevenLabsEndpointInputSchemas.voicesDelete,
		output: ElevenLabsEndpointOutputSchemas.voicesDelete,
	},
	'voices.getSettings': {
		input: ElevenLabsEndpointInputSchemas.voicesGetSettings,
		output: ElevenLabsEndpointOutputSchemas.voicesGetSettings,
	},
	'voices.editSettings': {
		input: ElevenLabsEndpointInputSchemas.voicesEditSettings,
		output: ElevenLabsEndpointOutputSchemas.voicesEditSettings,
	},
	'voices.defaultSettings': {
		input: ElevenLabsEndpointInputSchemas.voicesDefaultSettings,
		output: ElevenLabsEndpointOutputSchemas.voicesDefaultSettings,
	},
	'voiceDesign.design': {
		input: ElevenLabsEndpointInputSchemas.voiceDesignDesign,
		output: ElevenLabsEndpointOutputSchemas.voiceDesignDesign,
	},
	'voiceDesign.getPreview': {
		input: ElevenLabsEndpointInputSchemas.voiceDesignGetPreview,
		output: ElevenLabsEndpointOutputSchemas.voiceDesignGetPreview,
	},
	'voiceDesign.create': {
		input: ElevenLabsEndpointInputSchemas.voiceDesignCreate,
		output: ElevenLabsEndpointOutputSchemas.voiceDesignCreate,
	},
	'voiceDesign.remix': {
		input: ElevenLabsEndpointInputSchemas.voiceDesignRemix,
		output: ElevenLabsEndpointOutputSchemas.voiceDesignRemix,
	},
	'dubbing.create': {
		input: ElevenLabsEndpointInputSchemas.dubbingCreate,
		output: ElevenLabsEndpointOutputSchemas.dubbingCreate,
	},
	'dubbing.get': {
		input: ElevenLabsEndpointInputSchemas.dubbingGet,
		output: ElevenLabsEndpointOutputSchemas.dubbingGet,
	},
	'dubbing.list': {
		input: ElevenLabsEndpointInputSchemas.dubbingList,
		output: ElevenLabsEndpointOutputSchemas.dubbingList,
	},
	'dubbing.delete': {
		input: ElevenLabsEndpointInputSchemas.dubbingDelete,
		output: ElevenLabsEndpointOutputSchemas.dubbingDelete,
	},
	'dubbing.getAudio': {
		input: ElevenLabsEndpointInputSchemas.dubbingGetAudio,
		output: ElevenLabsEndpointOutputSchemas.dubbingGetAudio,
	},
	'dubbing.getTranscript': {
		input: ElevenLabsEndpointInputSchemas.dubbingGetTranscript,
		output: ElevenLabsEndpointOutputSchemas.dubbingGetTranscript,
	},
	'history.list': {
		input: ElevenLabsEndpointInputSchemas.historyList,
		output: ElevenLabsEndpointOutputSchemas.historyList,
	},
	'history.get': {
		input: ElevenLabsEndpointInputSchemas.historyGet,
		output: ElevenLabsEndpointOutputSchemas.historyGet,
	},
	'history.getAudio': {
		input: ElevenLabsEndpointInputSchemas.historyGetAudio,
		output: ElevenLabsEndpointOutputSchemas.historyGetAudio,
	},
	'history.delete': {
		input: ElevenLabsEndpointInputSchemas.historyDelete,
		output: ElevenLabsEndpointOutputSchemas.historyDelete,
	},
	'models.list': {
		input: ElevenLabsEndpointInputSchemas.modelsList,
		output: ElevenLabsEndpointOutputSchemas.modelsList,
	},
	'account.user': {
		input: ElevenLabsEndpointInputSchemas.accountUser,
		output: ElevenLabsEndpointOutputSchemas.accountUser,
	},
	'account.subscription': {
		input: ElevenLabsEndpointInputSchemas.accountSubscription,
		output: ElevenLabsEndpointOutputSchemas.accountSubscription,
	},
	'account.usageStats': {
		input: ElevenLabsEndpointInputSchemas.accountUsageStats,
		output: ElevenLabsEndpointOutputSchemas.accountUsageStats,
	},
	'agents.list': {
		input: ElevenLabsEndpointInputSchemas.agentsList,
		output: ElevenLabsEndpointOutputSchemas.agentsList,
	},
	'agents.get': {
		input: ElevenLabsEndpointInputSchemas.agentsGet,
		output: ElevenLabsEndpointOutputSchemas.agentsGet,
	},
	'agents.create': {
		input: ElevenLabsEndpointInputSchemas.agentsCreate,
		output: ElevenLabsEndpointOutputSchemas.agentsCreate,
	},
	'agents.update': {
		input: ElevenLabsEndpointInputSchemas.agentsUpdate,
		output: ElevenLabsEndpointOutputSchemas.agentsUpdate,
	},
	'agents.delete': {
		input: ElevenLabsEndpointInputSchemas.agentsDelete,
		output: ElevenLabsEndpointOutputSchemas.agentsDelete,
	},
	'agents.conversationsList': {
		input: ElevenLabsEndpointInputSchemas.agentsConversationsList,
		output: ElevenLabsEndpointOutputSchemas.agentsConversationsList,
	},
	'agents.conversationGet': {
		input: ElevenLabsEndpointInputSchemas.agentsConversationGet,
		output: ElevenLabsEndpointOutputSchemas.agentsConversationGet,
	},
	'agents.conversationDelete': {
		input: ElevenLabsEndpointInputSchemas.agentsConversationDelete,
		output: ElevenLabsEndpointOutputSchemas.agentsConversationDelete,
	},
	'agents.signedUrl': {
		input: ElevenLabsEndpointInputSchemas.agentsSignedUrl,
		output: ElevenLabsEndpointOutputSchemas.agentsSignedUrl,
	},
	'singleUseTokens.create': {
		input: ElevenLabsEndpointInputSchemas.singleUseTokensCreate,
		output: ElevenLabsEndpointOutputSchemas.singleUseTokensCreate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof elevenLabsEndpointsNested
>;

const elevenLabsWebhookSchemas = {
	'conversations.postCallTranscription': {
		description:
			'A conversation ended and its analysis is ready: transcript, metadata and analysis.',
		payload: PostCallTranscriptionEventSchema,
		response: PostCallTranscriptionEventSchema,
	},
	'conversations.postCallAudio': {
		description: 'A conversation ended: the whole conversation as base64 MP3.',
		payload: PostCallAudioEventSchema,
		response: PostCallAudioEventSchema,
	},
	'conversations.callInitiationFailure': {
		description:
			'A phone call could not be started: busy, no answer or unknown.',
		payload: CallInitiationFailureEventSchema,
		response: CallInitiationFailureEventSchema,
	},
	'speechToText.transcriptionCompleted': {
		description: 'A transcription started with webhook true finished.',
		payload: SpeechToTextTranscriptionEventSchema,
		response: SpeechToTextTranscriptionEventSchema,
	},
	'speechToText.transcriptionFailed': {
		description: 'A transcription started with webhook true failed.',
		payload: SpeechToTextFailedEventSchema,
		response: SpeechToTextFailedEventSchema,
	},
	'voices.removalNotice': {
		description: 'A shared voice in use is scheduled to be removed.',
		payload: VoiceRemovalNoticeEventSchema,
		response: VoiceRemovalNoticeEventSchema,
	},
	'voices.removalNoticeWithdrawn': {
		description: 'A shared voice is no longer scheduled for removal.',
		payload: VoiceRemovalNoticeWithdrawnEventSchema,
		response: VoiceRemovalNoticeWithdrawnEventSchema,
	},
	'voices.removed': {
		description: 'A shared voice was removed and can no longer be used.',
		payload: VoiceRemovedEventSchema,
		response: VoiceRemovedEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof elevenLabsWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

// A dub runs on ElevenLabs after create returns. Status values are
// DUBBING_STATES (endpoints/types.ts); jobs.test.ts keeps them in step.
// ElevenLabs has no way to stop a running dub, so no cancel is declared.
const DUBBING_JOB = {
	idPath: 'dubbing_id',
	status: {
		op: 'dubbing.get',
		idArg: 'dubbingId',
		statusPath: 'status',
		done: ['dubbed'],
		failed: ['failed'],
	},
} as const;

const elevenLabsEndpointMeta = {
	'textToSpeech.convert': {
		riskLevel: 'write',
		description:
			'Turn text into speech; spends credits by text length. Returns the audio as base64 with its history item id; set includeContent false to keep a long clip out of the result and read it later with history.getAudio.',
	},
	'textToSpeech.convertWithTimestamps': {
		riskLevel: 'write',
		description:
			'Turn text into speech with the start and end time of each character; spends credits by text length. Same audio fields as textToSpeech.convert.',
	},
	'textToDialogue.convert': {
		riskLevel: 'write',
		description:
			'Turn lines spoken by several voices into one audio clip; spends credits by text length.',
	},
	'speechToText.convert': {
		riskLevel: 'write',
		description:
			'Transcribe audio or video from a URL or a base64 file; spends credits by audio length. With webhook true it returns at once and delivers the transcript by webhook.',
	},
	'speechToText.getTranscript': {
		riskLevel: 'read',
		description:
			'Read a transcript by the transcription_id speechToText.convert returned.',
	},
	'speechToText.deleteTranscript': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a stored transcript, for good.',
	},
	'forcedAlignment.create': {
		riskLevel: 'write',
		description:
			'Line up known text with audio to get word and character timings; spends credits by audio length.',
	},
	'soundEffects.generate': {
		riskLevel: 'write',
		description:
			'Generate a sound effect from a description; spends credits by duration. ElevenLabs keeps no copy, so the audio comes back in the result.',
	},
	'music.compose': {
		riskLevel: 'write',
		description:
			'Generate a song from a prompt or a composition plan; spends credits by length. ElevenLabs keeps no copy, so the audio comes back in the result. At the default format, about 24 KB/s, a song over about 31 s is too big to return from a script on Corsair’s cloud, whose cap is 1,000,000 bytes: pick a lower-bitrate outputFormat, or pass contentBase64 to the next operation and return only metadata.',
	},
	'music.plan': {
		riskLevel: 'write',
		description:
			'Draft a composition plan from a prompt, to edit and pass to music.compose.',
	},
	'music.separateStems': {
		riskLevel: 'write',
		description:
			'Split a song into stems, returned as a zip; spends credits by audio length.',
	},
	'audioIsolation.isolate': {
		riskLevel: 'write',
		description:
			'Remove background noise from audio and keep the voices; spends credits by audio length. The cleaned audio comes back in the result.',
	},
	'voiceChanger.convert': {
		riskLevel: 'write',
		description:
			'Say the same thing in a different voice, from a base64 audio file; spends credits by audio length.',
	},
	'voices.list': {
		riskLevel: 'read',
		description: 'List the voices this account can use.',
	},
	'voices.get': {
		riskLevel: 'read',
		description: 'Read one voice with its settings and labels.',
	},
	'voices.searchLibrary': {
		riskLevel: 'read',
		description: 'Search the shared voice library.',
	},
	'voices.addFromLibrary': {
		riskLevel: 'write',
		description:
			'Add a voice from the shared library to this account; uses a voice slot.',
	},
	'voices.edit': {
		riskLevel: 'write',
		description: 'Change a voice’s name, description or labels.',
	},
	'voices.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a voice from this account, for good.',
	},
	'voices.getSettings': {
		riskLevel: 'read',
		description: 'Read a voice’s stored settings.',
	},
	'voices.editSettings': {
		riskLevel: 'write',
		description:
			'Change a voice’s stored settings (stability, similarity and so on).',
	},
	'voices.defaultSettings': {
		riskLevel: 'read',
		description: 'The settings a voice has by default.',
	},
	'voiceDesign.design': {
		riskLevel: 'write',
		description:
			'Generate voice previews from a description; spends credits. Hear one with voiceDesign.getPreview, then pass its generated_voice_id to voiceDesign.create.',
	},
	'voiceDesign.getPreview': {
		riskLevel: 'read',
		description:
			"Read a preview's audio by its generated_voice_id, without generating again. Subject to a size limit you can raise with maxBytes.",
	},
	'voiceDesign.create': {
		riskLevel: 'write',
		description:
			'Save a designed preview as a voice in this account; uses a voice slot.',
	},
	'voiceDesign.remix': {
		riskLevel: 'write',
		description:
			'Generate previews of a changed version of an existing voice; spends credits. Hear one with voiceDesign.getPreview.',
	},
	'dubbing.create': {
		riskLevel: 'write',
		description:
			'Start dubbing a video or audio file into another language; spends credits by length. Returns at once with a dubbing_id; follow it with dubbing.get until status is dubbed or failed.',
		job: DUBBING_JOB,
	},
	'dubbing.get': {
		riskLevel: 'read',
		description: 'Where a dub stands: status dubbed or failed are final.',
	},
	'dubbing.list': {
		riskLevel: 'read',
		description: 'List dubs, newest first by default.',
	},
	'dubbing.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a dub, for good.',
	},
	'dubbing.getAudio': {
		riskLevel: 'read',
		description:
			'Download a finished dub as base64 (audio or video), subject to the same size limit as other audio.',
	},
	'dubbing.getTranscript': {
		riskLevel: 'read',
		description: 'Read a dub’s transcript as srt, webvtt or json.',
	},
	'history.list': {
		riskLevel: 'read',
		description: 'List generated speech, newest first by default.',
	},
	'history.get': {
		riskLevel: 'read',
		description: 'Read one history item: its text, voice, model and cost.',
	},
	'history.getAudio': {
		riskLevel: 'read',
		description:
			'Download a history item’s audio as base64, subject to a size limit you can raise with maxBytes.',
	},
	'history.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a history item and its audio, for good.',
	},
	'models.list': {
		riskLevel: 'read',
		description: 'List available models with their languages and rates.',
	},
	'account.user': {
		riskLevel: 'read',
		description:
			'The account’s user and workspace ids and its subscription. Key fields are removed from the result.',
	},
	'account.subscription': {
		riskLevel: 'read',
		description: 'The plan, credits used and limits.',
	},
	'account.usageStats': {
		riskLevel: 'read',
		description: 'Credits used over a time range, by product or model.',
	},
	'agents.list': {
		riskLevel: 'read',
		description: 'List conversational agents.',
	},
	'agents.get': {
		riskLevel: 'read',
		description: 'Read an agent’s full configuration.',
	},
	'agents.create': {
		riskLevel: 'write',
		description: 'Create a conversational agent.',
	},
	'agents.update': {
		riskLevel: 'write',
		description: 'Change an agent’s configuration, name or tags.',
	},
	'agents.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an agent, for good.',
	},
	'agents.conversationsList': {
		riskLevel: 'read',
		description: 'List conversations, optionally for one agent.',
	},
	'agents.conversationGet': {
		riskLevel: 'read',
		description: 'Read a conversation’s transcript, metadata and analysis.',
	},
	'agents.conversationDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a conversation, for good.',
	},
	'agents.signedUrl': {
		riskLevel: 'write',
		description:
			'Mint a short-lived WebSocket URL a client can use to talk to an agent; the conversation spends credits.',
	},
	'singleUseTokens.create': {
		riskLevel: 'write',
		description:
			'Mint a single-use token, valid 15 minutes, to give a client instead of the API key.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof elevenLabsEndpointsNested
>;

export const elevenLabsAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseElevenLabsPlugin<T extends ElevenLabsPluginOptions> =
	CorsairPlugin<
		'elevenlabs',
		typeof ElevenLabsSchema,
		typeof elevenLabsEndpointsNested,
		typeof elevenLabsWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalElevenLabsPlugin =
	BaseElevenLabsPlugin<ElevenLabsPluginOptions>;

export type ExternalElevenLabsPlugin<T extends ElevenLabsPluginOptions> =
	BaseElevenLabsPlugin<T>;

export function elevenlabs<const T extends ElevenLabsPluginOptions>(
	incomingOptions: ElevenLabsPluginOptions & T = {} as ElevenLabsPluginOptions &
		T,
): ExternalElevenLabsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'elevenlabs',
		authConfig: elevenLabsAuthConfig,
		schema: ElevenLabsSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: elevenLabsEndpointsNested,
		webhooks: elevenLabsWebhooksNested,
		endpointMeta: elevenLabsEndpointMeta,
		endpointSchemas: elevenLabsEndpointSchemas,
		webhookSchemas: elevenLabsWebhookSchemas,
		pluginWebhookMatcher: isElevenLabsWebhook,
		errorHandlers: withCustomHandlers(options.errorHandlers),
		keyBuilder: async (ctx: ElevenLabsKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				// Throwing stops a delivery before any webhook hook sees it, and
				// processWebhook reports a failure instead of acknowledging it.
				const secret = await ctx.keys.get_webhook_signature();
				if (!secret)
					throw new AuthMissingError('elevenlabs', 'webhook_signature');
				return secret;
			}

			if (options.key) return options.key;

			if (ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) throw new AuthMissingError('elevenlabs', 'api_key');
				return key;
			}

			throw new AuthMissingError('elevenlabs', 'api_key');
		},
	} satisfies InternalElevenLabsPlugin;
}

export {
	DEFAULT_MAX_CONTENT_BYTES,
	ElevenLabsAPIError,
	ElevenLabsRequestError,
	HARD_MAX_CONTENT_BYTES,
} from './client';
export type * from './endpoints/types';
export type {
	CallInitiationFailureEvent,
	ElevenLabsVerifyOptions,
	ElevenLabsWebhookOutputs,
	PostCallAudioEvent,
	PostCallTranscriptionEvent,
	SpeechToTextFailedEvent,
	SpeechToTextTranscriptionEvent,
	VoiceRemovalNoticeEvent,
	VoiceRemovalNoticeWithdrawnEvent,
	VoiceRemovedEvent,
} from './webhooks/types';
export {
	ELEVENLABS_SIGNATURE_TOLERANCE_MS,
	ElevenLabsWebhookRefusedError,
	verifyElevenLabsWebhookSignature,
} from './webhooks/types';
