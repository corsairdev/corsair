import * as Ai from './ai';
import * as Audio from './audio';
import * as Classification from './classification';
import * as Embedding from './embedding';
import * as PromptEngine from './prompt-engine';
import * as Validate from './validate';
import * as Vision from './vision';
import * as Web from './web';

export const ValidateEndpoints = {
	nsfw: Validate.nsfw,
	profanity: Validate.profanity,
	spamCheck: Validate.spamCheck,
	spellCheck: Validate.spellCheck,
};

export const AiEndpoints = {
	sentiment: Ai.sentiment,
	summary: Ai.summary,
	translate: Ai.translate,
	prediction: Ai.prediction,
	imageGeneration: Ai.imageGeneration,
};

export const WebEndpoints = {
	scrape: Web.scrape,
	htmlToAny: Web.htmlToAny,
	search: Web.search,
	searchSuggestions: Web.searchSuggestions,
};

export const VisionEndpoints = {
	vocr: Vision.vocr,
	detectObjects: Vision.detectObjects,
};

export const AudioEndpoints = {
	speechToText: Audio.speechToText,
	textToSpeech: Audio.textToSpeech,
	createVoiceClone: Audio.createVoiceClone,
};

export const EmbeddingEndpoints = {
	createV2: Embedding.createEmbeddingV2,
};

export const ClassificationEndpoints = {
	classify: Classification.classify,
};

export const PromptEngineEndpoints = {
	create: PromptEngine.create,
	list: PromptEngine.list,
	run: PromptEngine.run,
};

export * from './types';
