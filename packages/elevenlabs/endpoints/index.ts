import {
	subscription as accountSubscription,
	usageStats as accountUsageStats,
	user as accountUser,
	listModels as modelsList,
	createToken as singleUseTokensCreate,
} from './account';
import {
	conversationDelete as agentsConversationDelete,
	conversationGet as agentsConversationGet,
	conversationsList as agentsConversationsList,
	create as agentsCreate,
	remove as agentsDelete,
	get as agentsGet,
	list as agentsList,
	signedUrl as agentsSignedUrl,
	update as agentsUpdate,
} from './agents';
import {
	isolate as audioIsolationIsolate,
	composeMusic as musicCompose,
	planMusic as musicPlan,
	separateStems as musicSeparateStems,
	generateSound as soundEffectsGenerate,
	changeVoice as voiceChangerConvert,
} from './audio';
import {
	create as dubbingCreate,
	remove as dubbingDelete,
	get as dubbingGet,
	getAudio as dubbingGetAudio,
	getTranscript as dubbingGetTranscript,
	list as dubbingList,
} from './dubbing';
import {
	remove as historyDelete,
	get as historyGet,
	getAudio as historyGetAudio,
	list as historyList,
} from './history';
import {
	convertDialogue as textToDialogueConvert,
	convert as textToSpeechConvert,
	convertWithTimestamps as textToSpeechConvertWithTimestamps,
} from './speech';
import {
	align as forcedAlignmentCreate,
	convert as speechToTextConvert,
	deleteTranscript as speechToTextDeleteTranscript,
	getTranscript as speechToTextGetTranscript,
} from './transcription';
import {
	createDesigned as voiceDesignCreate,
	design as voiceDesignDesign,
	getPreview as voiceDesignGetPreview,
	remix as voiceDesignRemix,
	addFromLibrary as voicesAddFromLibrary,
	defaultSettings as voicesDefaultSettings,
	remove as voicesDelete,
	edit as voicesEdit,
	editSettings as voicesEditSettings,
	get as voicesGet,
	getSettings as voicesGetSettings,
	list as voicesList,
	searchLibrary as voicesSearchLibrary,
} from './voices';

export const TextToSpeech = {
	convert: textToSpeechConvert,
	convertWithTimestamps: textToSpeechConvertWithTimestamps,
};

export const TextToDialogue = { convert: textToDialogueConvert };

export const SpeechToText = {
	convert: speechToTextConvert,
	getTranscript: speechToTextGetTranscript,
	deleteTranscript: speechToTextDeleteTranscript,
};

export const ForcedAlignment = { create: forcedAlignmentCreate };

export const SoundEffects = { generate: soundEffectsGenerate };

export const Music = {
	compose: musicCompose,
	plan: musicPlan,
	separateStems: musicSeparateStems,
};

export const AudioIsolation = { isolate: audioIsolationIsolate };

export const VoiceChanger = { convert: voiceChangerConvert };

export const Voices = {
	list: voicesList,
	get: voicesGet,
	searchLibrary: voicesSearchLibrary,
	addFromLibrary: voicesAddFromLibrary,
	edit: voicesEdit,
	delete: voicesDelete,
	getSettings: voicesGetSettings,
	editSettings: voicesEditSettings,
	defaultSettings: voicesDefaultSettings,
};

export const VoiceDesign = {
	design: voiceDesignDesign,
	getPreview: voiceDesignGetPreview,
	create: voiceDesignCreate,
	remix: voiceDesignRemix,
};

export const Dubbing = {
	create: dubbingCreate,
	get: dubbingGet,
	list: dubbingList,
	delete: dubbingDelete,
	getAudio: dubbingGetAudio,
	getTranscript: dubbingGetTranscript,
};

export const History = {
	list: historyList,
	get: historyGet,
	getAudio: historyGetAudio,
	delete: historyDelete,
};

export const Models = { list: modelsList };

export const Account = {
	user: accountUser,
	subscription: accountSubscription,
	usageStats: accountUsageStats,
};

export const Agents = {
	list: agentsList,
	get: agentsGet,
	create: agentsCreate,
	update: agentsUpdate,
	delete: agentsDelete,
	conversationsList: agentsConversationsList,
	conversationGet: agentsConversationGet,
	conversationDelete: agentsConversationDelete,
	signedUrl: agentsSignedUrl,
};

export const SingleUseTokens = { create: singleUseTokensCreate };

export * from './types';
