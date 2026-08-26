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
	AiEndpoints,
	AudioEndpoints,
	ClassificationEndpoints,
	EmbeddingEndpoints,
	PromptEngineEndpoints,
	ValidateEndpoints,
	VisionEndpoints,
	WebEndpoints,
} from './endpoints';
import type {
	JigsawstackEndpointInputs,
	JigsawstackEndpointOutputs,
} from './endpoints/types';
import {
	JigsawstackEndpointInputSchemas,
	JigsawstackEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { JigsawstackSchema } from './schema';

export type JigsawstackPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalJigsawstackPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof jigsawstackEndpointsNested>;
};

export type JigsawstackContext = CorsairPluginContext<
	typeof JigsawstackSchema,
	JigsawstackPluginOptions
>;

export type JigsawstackKeyBuilderContext =
	KeyBuilderContext<JigsawstackPluginOptions>;

export type JigsawstackBoundEndpoints = BindEndpoints<
	typeof jigsawstackEndpointsNested
>;

type JigsawstackEndpoint<K extends keyof JigsawstackEndpointOutputs> =
	CorsairEndpoint<
		JigsawstackContext,
		JigsawstackEndpointInputs[K],
		JigsawstackEndpointOutputs[K]
	>;

export type JigsawstackEndpoints = {
	nsfw: JigsawstackEndpoint<'nsfw'>;
	profanity: JigsawstackEndpoint<'profanity'>;
	spamCheck: JigsawstackEndpoint<'spamCheck'>;
	spellCheck: JigsawstackEndpoint<'spellCheck'>;
	sentiment: JigsawstackEndpoint<'sentiment'>;
	summary: JigsawstackEndpoint<'summary'>;
	translate: JigsawstackEndpoint<'translate'>;
	prediction: JigsawstackEndpoint<'prediction'>;
	imageGeneration: JigsawstackEndpoint<'imageGeneration'>;
	scrape: JigsawstackEndpoint<'scrape'>;
	htmlToAny: JigsawstackEndpoint<'htmlToAny'>;
	search: JigsawstackEndpoint<'search'>;
	searchSuggestions: JigsawstackEndpoint<'searchSuggestions'>;
	vocr: JigsawstackEndpoint<'vocr'>;
	detectObjects: JigsawstackEndpoint<'detectObjects'>;
	speechToText: JigsawstackEndpoint<'speechToText'>;
	textToSpeech: JigsawstackEndpoint<'textToSpeech'>;
	createVoiceClone: JigsawstackEndpoint<'createVoiceClone'>;
	createEmbeddingV2: JigsawstackEndpoint<'createEmbeddingV2'>;
	classify: JigsawstackEndpoint<'classify'>;
	createPrompt: JigsawstackEndpoint<'createPrompt'>;
	listPrompts: JigsawstackEndpoint<'listPrompts'>;
	runPrompt: JigsawstackEndpoint<'runPrompt'>;
};

const jigsawstackEndpointsNested = {
	validate: {
		nsfw: ValidateEndpoints.nsfw,
		profanity: ValidateEndpoints.profanity,
		spamCheck: ValidateEndpoints.spamCheck,
		spellCheck: ValidateEndpoints.spellCheck,
	},
	ai: {
		sentiment: AiEndpoints.sentiment,
		summary: AiEndpoints.summary,
		translate: AiEndpoints.translate,
		prediction: AiEndpoints.prediction,
		imageGeneration: AiEndpoints.imageGeneration,
	},
	web: {
		scrape: WebEndpoints.scrape,
		htmlToAny: WebEndpoints.htmlToAny,
		search: WebEndpoints.search,
		searchSuggestions: WebEndpoints.searchSuggestions,
	},
	vision: {
		vocr: VisionEndpoints.vocr,
		detectObjects: VisionEndpoints.detectObjects,
	},
	audio: {
		speechToText: AudioEndpoints.speechToText,
		textToSpeech: AudioEndpoints.textToSpeech,
		createVoiceClone: AudioEndpoints.createVoiceClone,
	},
	embedding: {
		createV2: EmbeddingEndpoints.createV2,
	},
	classification: {
		classify: ClassificationEndpoints.classify,
	},
	promptEngine: {
		create: PromptEngineEndpoints.create,
		list: PromptEngineEndpoints.list,
		run: PromptEngineEndpoints.run,
	},
} as const;

const jigsawstackWebhooksNested = {} as const;

export const jigsawstackEndpointSchemas = {
	'validate.nsfw': {
		input: JigsawstackEndpointInputSchemas.nsfw,
		output: JigsawstackEndpointOutputSchemas.nsfw,
	},
	'validate.profanity': {
		input: JigsawstackEndpointInputSchemas.profanity,
		output: JigsawstackEndpointOutputSchemas.profanity,
	},
	'validate.spamCheck': {
		input: JigsawstackEndpointInputSchemas.spamCheck,
		output: JigsawstackEndpointOutputSchemas.spamCheck,
	},
	'validate.spellCheck': {
		input: JigsawstackEndpointInputSchemas.spellCheck,
		output: JigsawstackEndpointOutputSchemas.spellCheck,
	},
	'ai.sentiment': {
		input: JigsawstackEndpointInputSchemas.sentiment,
		output: JigsawstackEndpointOutputSchemas.sentiment,
	},
	'ai.summary': {
		input: JigsawstackEndpointInputSchemas.summary,
		output: JigsawstackEndpointOutputSchemas.summary,
	},
	'ai.translate': {
		input: JigsawstackEndpointInputSchemas.translate,
		output: JigsawstackEndpointOutputSchemas.translate,
	},
	'ai.prediction': {
		input: JigsawstackEndpointInputSchemas.prediction,
		output: JigsawstackEndpointOutputSchemas.prediction,
	},
	'ai.imageGeneration': {
		input: JigsawstackEndpointInputSchemas.imageGeneration,
		output: JigsawstackEndpointOutputSchemas.imageGeneration,
	},
	'web.scrape': {
		input: JigsawstackEndpointInputSchemas.scrape,
		output: JigsawstackEndpointOutputSchemas.scrape,
	},
	'web.htmlToAny': {
		input: JigsawstackEndpointInputSchemas.htmlToAny,
		output: JigsawstackEndpointOutputSchemas.htmlToAny,
	},
	'web.search': {
		input: JigsawstackEndpointInputSchemas.search,
		output: JigsawstackEndpointOutputSchemas.search,
	},
	'web.searchSuggestions': {
		input: JigsawstackEndpointInputSchemas.searchSuggestions,
		output: JigsawstackEndpointOutputSchemas.searchSuggestions,
	},
	'vision.vocr': {
		input: JigsawstackEndpointInputSchemas.vocr,
		output: JigsawstackEndpointOutputSchemas.vocr,
	},
	'vision.detectObjects': {
		input: JigsawstackEndpointInputSchemas.detectObjects,
		output: JigsawstackEndpointOutputSchemas.detectObjects,
	},
	'audio.speechToText': {
		input: JigsawstackEndpointInputSchemas.speechToText,
		output: JigsawstackEndpointOutputSchemas.speechToText,
	},
	'audio.textToSpeech': {
		input: JigsawstackEndpointInputSchemas.textToSpeech,
		output: JigsawstackEndpointOutputSchemas.textToSpeech,
	},
	'audio.createVoiceClone': {
		input: JigsawstackEndpointInputSchemas.createVoiceClone,
		output: JigsawstackEndpointOutputSchemas.createVoiceClone,
	},
	'embedding.createV2': {
		input: JigsawstackEndpointInputSchemas.createEmbeddingV2,
		output: JigsawstackEndpointOutputSchemas.createEmbeddingV2,
	},
	'classification.classify': {
		input: JigsawstackEndpointInputSchemas.classify,
		output: JigsawstackEndpointOutputSchemas.classify,
	},
	'promptEngine.create': {
		input: JigsawstackEndpointInputSchemas.createPrompt,
		output: JigsawstackEndpointOutputSchemas.createPrompt,
	},
	'promptEngine.list': {
		input: JigsawstackEndpointInputSchemas.listPrompts,
		output: JigsawstackEndpointOutputSchemas.listPrompts,
	},
	'promptEngine.run': {
		input: JigsawstackEndpointInputSchemas.runPrompt,
		output: JigsawstackEndpointOutputSchemas.runPrompt,
	},
} satisfies RequiredPluginEndpointSchemas<typeof jigsawstackEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const jigsawstackEndpointMeta = {
	'validate.nsfw': {
		riskLevel: 'read',
		description: 'Detect NSFW content in an image',
	},
	'validate.profanity': {
		riskLevel: 'read',
		description: 'Check text for profanity and return a cleaned copy',
	},
	'validate.spamCheck': {
		riskLevel: 'read',
		description: 'Score text for spam likelihood',
	},
	'validate.spellCheck': {
		riskLevel: 'read',
		description: 'Detect and auto-correct spelling mistakes',
	},
	'ai.sentiment': {
		riskLevel: 'read',
		description: 'Analyze sentiment and emotion in text',
	},
	'ai.summary': {
		riskLevel: 'read',
		description: 'Summarize text or a PDF as a paragraph or bullet points',
	},
	'ai.translate': {
		riskLevel: 'read',
		description: 'Translate text into a target language',
	},
	'ai.prediction': {
		riskLevel: 'read',
		description: 'Forecast a time series from dated values',
	},
	'ai.imageGeneration': {
		riskLevel: 'write',
		description: 'Generate an image from a text prompt',
	},
	'web.scrape': {
		riskLevel: 'read',
		description: 'Scrape a page into structured data with AI prompts',
	},
	'web.htmlToAny': {
		riskLevel: 'write',
		description: 'Convert HTML or a URL to PNG, JPEG, WEBP, or PDF',
	},
	'web.search': {
		riskLevel: 'read',
		description: 'Search the web with optional AI overview',
	},
	'web.searchSuggestions': {
		riskLevel: 'read',
		description: 'Get search autocomplete suggestions for a query',
	},
	'vision.vocr': {
		riskLevel: 'read',
		description: 'Extract text and fields from an image or PDF',
	},
	'vision.detectObjects': {
		riskLevel: 'read',
		description: 'Detect objects and GUI elements in an image',
	},
	'audio.speechToText': {
		riskLevel: 'read',
		description: 'Transcribe audio or video to text',
	},
	'audio.textToSpeech': {
		riskLevel: 'write',
		description: 'Convert text to speech audio',
	},
	'audio.createVoiceClone': {
		riskLevel: 'write',
		description: 'Clone a voice from an audio sample for later TTS',
	},
	'embedding.createV2': {
		riskLevel: 'read',
		description: 'Create v2 embeddings from text, image, audio, or PDF',
	},
	'classification.classify': {
		riskLevel: 'read',
		description: 'Classify text or images with custom labels',
	},
	'promptEngine.create': {
		riskLevel: 'write',
		description: 'Create a reusable Prompt Engine template',
	},
	'promptEngine.list': {
		riskLevel: 'read',
		description: 'List Prompt Engine templates',
	},
	'promptEngine.run': {
		riskLevel: 'write',
		description: 'Run a stored Prompt Engine by id',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof jigsawstackEndpointsNested
>;

export const jigsawstackAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseJigsawstackPlugin<T extends JigsawstackPluginOptions> =
	CorsairPlugin<
		'jigsawstack',
		typeof JigsawstackSchema,
		typeof jigsawstackEndpointsNested,
		typeof jigsawstackWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalJigsawstackPlugin =
	BaseJigsawstackPlugin<JigsawstackPluginOptions>;

export type ExternalJigsawstackPlugin<T extends JigsawstackPluginOptions> =
	BaseJigsawstackPlugin<T>;

export function jigsawstack<const T extends JigsawstackPluginOptions>(
	incomingOptions: JigsawstackPluginOptions &
		T = {} as JigsawstackPluginOptions & T,
): ExternalJigsawstackPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'jigsawstack',
		authConfig: jigsawstackAuthConfig,
		schema: JigsawstackSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: jigsawstackEndpointsNested,
		webhooks: jigsawstackWebhooksNested,
		endpointMeta: jigsawstackEndpointMeta,
		endpointSchemas: jigsawstackEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: JigsawstackKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('jigsawstack', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('jigsawstack', 'api_key');
		},
	} satisfies InternalJigsawstackPlugin;
}

export type {
	JigsawstackEndpointInputs,
	JigsawstackEndpointOutputs,
} from './endpoints/types';

export {
	JigsawstackEndpointInputSchemas,
	JigsawstackEndpointOutputSchemas,
} from './endpoints/types';
