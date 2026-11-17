import type {
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
import { Account, Ai } from './endpoints';
import type {
	TextCortexEndpointInputs,
	TextCortexEndpointOutputs,
} from './endpoints/types';
import {
	TextCortexEndpointInputSchemas,
	TextCortexEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { TextCortexSchema } from './schema';

export type TextCortexPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTextCortexPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof textcortexEndpointsNested>;
};

export type TextCortexContext = CorsairPluginContext<
	typeof TextCortexSchema,
	TextCortexPluginOptions
>;

export type TextCortexKeyBuilderContext =
	KeyBuilderContext<TextCortexPluginOptions>;

export type TextCortexBoundEndpoints = BindEndpoints<
	typeof textcortexEndpointsNested
>;

type TextCortexEndpoint<K extends keyof TextCortexEndpointOutputs> =
	CorsairEndpoint<
		TextCortexContext,
		TextCortexEndpointInputs[K],
		TextCortexEndpointOutputs[K]
	>;

export type TextCortexEndpoints = {
	modelsList: TextCortexEndpoint<'modelsList'>;
	balanceGet: TextCortexEndpoint<'balanceGet'>;
	capabilitiesGet: TextCortexEndpoint<'capabilitiesGet'>;
	chatCompletions: TextCortexEndpoint<'chatCompletions'>;
	responsesCreate: TextCortexEndpoint<'responsesCreate'>;
	imagesCreate: TextCortexEndpoint<'imagesCreate'>;
	webSearch: TextCortexEndpoint<'webSearch'>;
};

const textcortexEndpointsNested = {
	models: {
		list: Account.modelsList,
	},
	balance: {
		get: Account.balanceGet,
	},
	capabilities: {
		get: Account.capabilitiesGet,
	},
	chat: {
		completions: Ai.chatCompletions,
	},
	responses: {
		create: Ai.responsesCreate,
	},
	images: {
		create: Ai.imagesCreate,
	},
	web: {
		search: Ai.webSearch,
	},
} as const;

export const textcortexEndpointSchemas = {
	'models.list': {
		input: TextCortexEndpointInputSchemas.modelsList,
		output: TextCortexEndpointOutputSchemas.modelsList,
	},
	'balance.get': {
		input: TextCortexEndpointInputSchemas.balanceGet,
		output: TextCortexEndpointOutputSchemas.balanceGet,
	},
	'capabilities.get': {
		input: TextCortexEndpointInputSchemas.capabilitiesGet,
		output: TextCortexEndpointOutputSchemas.capabilitiesGet,
	},
	'chat.completions': {
		input: TextCortexEndpointInputSchemas.chatCompletions,
		output: TextCortexEndpointOutputSchemas.chatCompletions,
	},
	'responses.create': {
		input: TextCortexEndpointInputSchemas.responsesCreate,
		output: TextCortexEndpointOutputSchemas.responsesCreate,
	},
	'images.create': {
		input: TextCortexEndpointInputSchemas.imagesCreate,
		output: TextCortexEndpointOutputSchemas.imagesCreate,
	},
	'web.search': {
		input: TextCortexEndpointInputSchemas.webSearch,
		output: TextCortexEndpointOutputSchemas.webSearch,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof textcortexEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const textcortexEndpointMeta = {
	'models.list': {
		riskLevel: 'read',
		description:
			'List the chat models available to the key, with their IDs and owners',
	},
	'balance.get': {
		riskLevel: 'read',
		description:
			'Read the remaining API credits, the funding source and the wallet amount',
	},
	'capabilities.get': {
		riskLevel: 'read',
		description:
			'Read the features enabled for the key, such as image generation',
	},
	// A paid generation job: each call spends credits (plugin rules R8).
	'chat.completions': {
		riskLevel: 'destructive',
		description:
			'Generate a chat completion from a conversation, which spends credits on every call',
	},
	// A paid generation job: each call spends credits (plugin rules R8).
	'responses.create': {
		riskLevel: 'destructive',
		description:
			'Generate one response from a prompt and optional instructions, which spends credits',
	},
	// A paid generation job: each call spends credits (plugin rules R8).
	'images.create': {
		riskLevel: 'destructive',
		description:
			'Generate an image from a prompt, returning its URL, and spend credits per image',
	},
	// A metered lookup: it spends credits but only returns data, so it stays a
	// read like the Ahrefs plugin's queries (plugin rules R8).
	'web.search': {
		riskLevel: 'read',
		description:
			'Search the web and return matching sources with snippets; each search spends credits',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof textcortexEndpointsNested
>;

export type BaseTextCortexPlugin<T extends TextCortexPluginOptions> =
	CorsairPlugin<
		'textcortex',
		typeof TextCortexSchema,
		typeof textcortexEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalTextCortexPlugin =
	BaseTextCortexPlugin<TextCortexPluginOptions>;

export type ExternalTextCortexPlugin<T extends TextCortexPluginOptions> =
	BaseTextCortexPlugin<T>;

export function textcortex<const T extends TextCortexPluginOptions>(
	incomingOptions: TextCortexPluginOptions & T = {} as TextCortexPluginOptions &
		T,
): ExternalTextCortexPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'textcortex',
		schema: TextCortexSchema,
		options: options,
		hooks: options.hooks,
		endpoints: textcortexEndpointsNested,
		webhooks: {},
		endpointMeta: textcortexEndpointMeta,
		endpointSchemas: textcortexEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: TextCortexKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('textcortex', ctx.authType ?? 'api_key');
		},
	} satisfies InternalTextCortexPlugin;
}

export { textCortexErrorDetails } from './client';

export type {
	BalanceResponse,
	CapabilitiesResponse,
	ChatCompletionsInput,
	ChatCompletionsResponse,
	ImagesCreateInput,
	ImagesCreateResponse,
	ModelsListResponse,
	ResponsesInput,
	ResponsesResponse,
	TextCortexEndpointInputs,
	TextCortexEndpointOutputs,
	TextCortexModel,
	WebSearchInput,
	WebSearchResponse,
} from './endpoints/types';
