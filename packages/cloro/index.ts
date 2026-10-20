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
import { Monitor, Utility } from './endpoints';
import type {
	CloroEndpointInputs,
	CloroEndpointOutputs,
} from './endpoints/types';
import {
	CloroEndpointInputSchemas,
	CloroEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CloroSchema } from './schema';

export type CloroPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCloroPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof cloroEndpointsNested>;
};

export type CloroContext = CorsairPluginContext<
	typeof CloroSchema,
	CloroPluginOptions
>;

export type CloroKeyBuilderContext = KeyBuilderContext<CloroPluginOptions>;

export type CloroBoundEndpoints = BindEndpoints<typeof cloroEndpointsNested>;

type CloroEndpoint<K extends keyof CloroEndpointOutputs> = CorsairEndpoint<
	CloroContext,
	CloroEndpointInputs[K],
	CloroEndpointOutputs[K]
>;

export type CloroEndpoints = {
	monitorChatgpt: CloroEndpoint<'monitorChatgpt'>;
	monitorPerplexity: CloroEndpoint<'monitorPerplexity'>;
	monitorGemini: CloroEndpoint<'monitorGemini'>;
	monitorCopilot: CloroEndpoint<'monitorCopilot'>;
	monitorGoogleAiMode: CloroEndpoint<'monitorGoogleAiMode'>;
	monitorGoogleSearch: CloroEndpoint<'monitorGoogleSearch'>;
	monitorGoogleNews: CloroEndpoint<'monitorGoogleNews'>;
	utilityCountries: CloroEndpoint<'utilityCountries'>;
	utilityStates: CloroEndpoint<'utilityStates'>;
	utilityCredits: CloroEndpoint<'utilityCredits'>;
};

const cloroEndpointsNested = {
	monitor: {
		chatgpt: Monitor.chatgpt,
		perplexity: Monitor.perplexity,
		gemini: Monitor.gemini,
		copilot: Monitor.copilot,
		googleAiMode: Monitor.googleAiMode,
		googleSearch: Monitor.googleSearch,
		googleNews: Monitor.googleNews,
	},
	utility: {
		countries: Utility.countries,
		states: Utility.states,
		credits: Utility.credits,
	},
} as const;

export const cloroEndpointSchemas = {
	'monitor.chatgpt': {
		input: CloroEndpointInputSchemas.monitorChatgpt,
		output: CloroEndpointOutputSchemas.monitorChatgpt,
	},
	'monitor.perplexity': {
		input: CloroEndpointInputSchemas.monitorPerplexity,
		output: CloroEndpointOutputSchemas.monitorPerplexity,
	},
	'monitor.gemini': {
		input: CloroEndpointInputSchemas.monitorGemini,
		output: CloroEndpointOutputSchemas.monitorGemini,
	},
	'monitor.copilot': {
		input: CloroEndpointInputSchemas.monitorCopilot,
		output: CloroEndpointOutputSchemas.monitorCopilot,
	},
	'monitor.googleAiMode': {
		input: CloroEndpointInputSchemas.monitorGoogleAiMode,
		output: CloroEndpointOutputSchemas.monitorGoogleAiMode,
	},
	'monitor.googleSearch': {
		input: CloroEndpointInputSchemas.monitorGoogleSearch,
		output: CloroEndpointOutputSchemas.monitorGoogleSearch,
	},
	'monitor.googleNews': {
		input: CloroEndpointInputSchemas.monitorGoogleNews,
		output: CloroEndpointOutputSchemas.monitorGoogleNews,
	},
	'utility.countries': {
		input: CloroEndpointInputSchemas.utilityCountries,
		output: CloroEndpointOutputSchemas.utilityCountries,
	},
	'utility.states': {
		input: CloroEndpointInputSchemas.utilityStates,
		output: CloroEndpointOutputSchemas.utilityStates,
	},
	'utility.credits': {
		input: CloroEndpointInputSchemas.utilityCredits,
		output: CloroEndpointOutputSchemas.utilityCredits,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof cloroEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

// Every monitor call spends credits (3-7 per call), so they are `write`.
const cloroEndpointMeta = {
	'monitor.chatgpt': {
		riskLevel: 'write',
		description:
			'Ask ChatGPT a prompt as a user in a given country and get the structured answer, sources, and shopping cards',
	},
	'monitor.perplexity': {
		riskLevel: 'write',
		description:
			'Ask Perplexity a prompt in a given country and get the structured answer and sources',
	},
	'monitor.gemini': {
		riskLevel: 'write',
		description:
			'Ask Google Gemini a prompt in a given country and get the structured answer and sources',
	},
	'monitor.copilot': {
		riskLevel: 'write',
		description:
			'Ask Microsoft Copilot a prompt in a given country and get the structured answer and sources',
	},
	'monitor.googleAiMode': {
		riskLevel: 'write',
		description:
			'Ask Google AI Mode a prompt and get the structured answer, sources, places, and products',
	},
	'monitor.googleSearch': {
		riskLevel: 'write',
		description:
			'Run a Google search (1-10 pages) and get organic results, ads, People Also Ask, and the AI Overview',
	},
	'monitor.googleNews': {
		riskLevel: 'write',
		description: 'Run a Google News search (1-10 pages) and get articles',
	},
	'utility.countries': {
		riskLevel: 'read',
		description: 'List the country codes a monitor engine supports',
	},
	'utility.states': {
		riskLevel: 'read',
		description: 'List the US states supported for state-level targeting',
	},
	'utility.credits': {
		riskLevel: 'read',
		description: 'Get the remaining cloro credit balance and billing cycle',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof cloroEndpointsNested>;

export type BaseCloroPlugin<T extends CloroPluginOptions> = CorsairPlugin<
	'cloro',
	typeof CloroSchema,
	typeof cloroEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalCloroPlugin = BaseCloroPlugin<CloroPluginOptions>;

export type ExternalCloroPlugin<T extends CloroPluginOptions> =
	BaseCloroPlugin<T>;

export function cloro<const T extends CloroPluginOptions>(
	incomingOptions: CloroPluginOptions & T = {} as CloroPluginOptions & T,
): ExternalCloroPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'cloro',
		schema: CloroSchema,
		options: options,
		hooks: options.hooks,
		endpoints: cloroEndpointsNested,
		webhooks: {},
		endpointMeta: cloroEndpointMeta,
		endpointSchemas: cloroEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CloroKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('cloro', 'api_key');
		},
	} satisfies InternalCloroPlugin;
}

export type {
	ChatgptInput,
	ChatgptResponse,
	CloroEndpointInputs,
	CloroEndpointOutputs,
	CopilotInput,
	CopilotResponse,
	CountriesInput,
	CountriesResponse,
	CreditsInput,
	CreditsResponse,
	GeminiInput,
	GeminiResponse,
	GoogleAiModeInput,
	GoogleAiModeResponse,
	GoogleNewsInput,
	GoogleNewsResponse,
	GoogleSearchInput,
	GoogleSearchResponse,
	PerplexityInput,
	PerplexityResponse,
	StatesInput,
	StatesResponse,
} from './endpoints/types';
