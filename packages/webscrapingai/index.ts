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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Account, AI, Scraping } from './endpoints';
import type {
	WebScrapingAIEndpointInputs,
	WebScrapingAIEndpointOutputs,
} from './endpoints/types';
import {
	WebScrapingAIEndpointInputSchemas,
	WebScrapingAIEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WebScrapingAISchema } from './schema';

export type WebScrapingAIPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalWebScrapingAIPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof webScrapingAIEndpointsNested>;
};

export type WebScrapingAIContext = CorsairPluginContext<
	typeof WebScrapingAISchema,
	WebScrapingAIPluginOptions
>;
export type WebScrapingAIKeyBuilderContext =
	KeyBuilderContext<WebScrapingAIPluginOptions>;
export type WebScrapingAIBoundEndpoints = BindEndpoints<
	typeof webScrapingAIEndpointsNested
>;

type WebScrapingAIEndpoint<K extends keyof WebScrapingAIEndpointOutputs> =
	CorsairEndpoint<
		WebScrapingAIContext,
		WebScrapingAIEndpointInputs[K],
		WebScrapingAIEndpointOutputs[K]
	>;

export type WebScrapingAIEndpoints = {
	aiAskQuestion: WebScrapingAIEndpoint<'aiAskQuestion'>;
	aiExtractFields: WebScrapingAIEndpoint<'aiExtractFields'>;
	scrapingGetHtml: WebScrapingAIEndpoint<'scrapingGetHtml'>;
	scrapingGetSelectedHtml: WebScrapingAIEndpoint<'scrapingGetSelectedHtml'>;
	scrapingGetSelectedMultiple: WebScrapingAIEndpoint<'scrapingGetSelectedMultiple'>;
	scrapingGetText: WebScrapingAIEndpoint<'scrapingGetText'>;
	accountGetInfo: WebScrapingAIEndpoint<'accountGetInfo'>;
};

const webScrapingAIEndpointsNested = {
	ai: { askQuestion: AI.askQuestion, extractFields: AI.extractFields },
	scraping: {
		getHtml: Scraping.getHtml,
		getSelectedHtml: Scraping.getSelectedHtml,
		getSelectedMultiple: Scraping.getSelectedMultiple,
		getText: Scraping.getText,
	},
	account: { getInfo: Account.getInfo },
} as const;

const webScrapingAIWebhooksNested = {} as const;

export const webScrapingAIEndpointSchemas = {
	'ai.askQuestion': {
		input: WebScrapingAIEndpointInputSchemas.aiAskQuestion,
		output: WebScrapingAIEndpointOutputSchemas.aiAskQuestion,
	},
	'ai.extractFields': {
		input: WebScrapingAIEndpointInputSchemas.aiExtractFields,
		output: WebScrapingAIEndpointOutputSchemas.aiExtractFields,
	},
	'scraping.getHtml': {
		input: WebScrapingAIEndpointInputSchemas.scrapingGetHtml,
		output: WebScrapingAIEndpointOutputSchemas.scrapingGetHtml,
	},
	'scraping.getSelectedHtml': {
		input: WebScrapingAIEndpointInputSchemas.scrapingGetSelectedHtml,
		output: WebScrapingAIEndpointOutputSchemas.scrapingGetSelectedHtml,
	},
	'scraping.getSelectedMultiple': {
		input: WebScrapingAIEndpointInputSchemas.scrapingGetSelectedMultiple,
		output: WebScrapingAIEndpointOutputSchemas.scrapingGetSelectedMultiple,
	},
	'scraping.getText': {
		input: WebScrapingAIEndpointInputSchemas.scrapingGetText,
		output: WebScrapingAIEndpointOutputSchemas.scrapingGetText,
	},
	'account.getInfo': {
		input: WebScrapingAIEndpointInputSchemas.accountGetInfo,
		output: WebScrapingAIEndpointOutputSchemas.accountGetInfo,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof webScrapingAIEndpointsNested
>;

const webScrapingAIWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof webScrapingAIWebhooksNested
	>;

const webScrapingAIEndpointMeta = {
	'ai.askQuestion': {
		riskLevel: 'read',
		description: 'Answer a question using the content of a web page',
	},
	'ai.extractFields': {
		riskLevel: 'read',
		description: 'Extract requested fields from a web page as structured JSON',
	},
	'scraping.getHtml': {
		riskLevel: 'read',
		description: 'Return the rendered HTML of a web page',
	},
	'scraping.getSelectedHtml': {
		riskLevel: 'read',
		description: 'Return HTML matching one CSS selector',
	},
	'scraping.getSelectedMultiple': {
		riskLevel: 'read',
		description: 'Return HTML matching multiple CSS selectors',
	},
	'scraping.getText': {
		riskLevel: 'read',
		description: 'Return clean text or Markdown extracted from a web page',
	},
	'account.getInfo': {
		riskLevel: 'read',
		description: 'Return account quota and credit information',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof webScrapingAIEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';
export const webScrapingAIAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseWebScrapingAIPlugin<T extends WebScrapingAIPluginOptions> =
	CorsairPlugin<
		'webscrapingai',
		typeof WebScrapingAISchema,
		typeof webScrapingAIEndpointsNested,
		typeof webScrapingAIWebhooksNested,
		T,
		typeof defaultAuthType
	>;
export type InternalWebScrapingAIPlugin =
	BaseWebScrapingAIPlugin<WebScrapingAIPluginOptions>;
export type ExternalWebScrapingAIPlugin<T extends WebScrapingAIPluginOptions> =
	BaseWebScrapingAIPlugin<T>;

export function webScrapingAI<const T extends WebScrapingAIPluginOptions>(
	incomingOptions: WebScrapingAIPluginOptions &
		T = {} as WebScrapingAIPluginOptions & T,
): ExternalWebScrapingAIPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'webscrapingai',
		authConfig: webScrapingAIAuthConfig,
		schema: WebScrapingAISchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: webScrapingAIEndpointsNested,
		webhooks: webScrapingAIWebhooksNested,
		endpointMeta: webScrapingAIEndpointMeta,
		endpointSchemas: webScrapingAIEndpointSchemas,
		webhookSchemas: webScrapingAIWebhookSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: WebScrapingAIKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}
			throw new AuthMissingError('webscrapingai', 'api_key');
		},
	} satisfies InternalWebScrapingAIPlugin;
}

export * from './endpoints/types';
export { WebScrapingAISchema } from './schema';
