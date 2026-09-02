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
	AccountEndpoints,
	AnalysisEndpoints,
	ClassifierEndpoints,
	DictionaryEndpoints,
} from './endpoints';
import type {
	TextrazorEndpointInputs,
	TextrazorEndpointOutputs,
} from './endpoints/types';
import {
	TextrazorEndpointInputSchemas,
	TextrazorEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TextrazorSchema } from './schema';

export type TextrazorPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTextrazorPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof textrazorEndpointsNested>;
};

export type TextrazorContext = CorsairPluginContext<
	typeof TextrazorSchema,
	TextrazorPluginOptions
>;

export type TextrazorKeyBuilderContext =
	KeyBuilderContext<TextrazorPluginOptions>;

export type TextrazorBoundEndpoints = BindEndpoints<
	typeof textrazorEndpointsNested
>;

type TextrazorEndpoint<K extends keyof TextrazorEndpointOutputs> =
	CorsairEndpoint<
		TextrazorContext,
		TextrazorEndpointInputs[K],
		TextrazorEndpointOutputs[K]
	>;

export type TextrazorEndpoints = {
	analyzeContent: TextrazorEndpoint<'analyzeContent'>;
	classifyText: TextrazorEndpoint<'classifyText'>;
	extractEntities: TextrazorEndpoint<'extractEntities'>;
	getAccount: TextrazorEndpoint<'getAccount'>;
	createDictionary: TextrazorEndpoint<'createDictionary'>;
	listDictionaries: TextrazorEndpoint<'listDictionaries'>;
	getDictionary: TextrazorEndpoint<'getDictionary'>;
	deleteDictionary: TextrazorEndpoint<'deleteDictionary'>;
	listDictionaryEntries: TextrazorEndpoint<'listDictionaryEntries'>;
	addDictionaryEntries: TextrazorEndpoint<'addDictionaryEntries'>;
	getDictionaryEntry: TextrazorEndpoint<'getDictionaryEntry'>;
	deleteDictionaryEntry: TextrazorEndpoint<'deleteDictionaryEntry'>;
	putClassifier: TextrazorEndpoint<'putClassifier'>;
	deleteClassifier: TextrazorEndpoint<'deleteClassifier'>;
	listClassifierCategories: TextrazorEndpoint<'listClassifierCategories'>;
	getClassifierCategory: TextrazorEndpoint<'getClassifierCategory'>;
	deleteClassifierCategory: TextrazorEndpoint<'deleteClassifierCategory'>;
};

const textrazorEndpointsNested = {
	analysis: {
		analyzeContent: AnalysisEndpoints.analyzeContent,
		classifyText: AnalysisEndpoints.classifyText,
		extractEntities: AnalysisEndpoints.extractEntities,
	},
	account: {
		get: AccountEndpoints.get,
	},
	dictionaries: {
		create: DictionaryEndpoints.create,
		list: DictionaryEndpoints.list,
		get: DictionaryEndpoints.get,
		delete: DictionaryEndpoints.delete,
		listEntries: DictionaryEndpoints.listEntries,
		addEntries: DictionaryEndpoints.addEntries,
		getEntry: DictionaryEndpoints.getEntry,
		deleteEntry: DictionaryEndpoints.deleteEntry,
	},
	classifiers: {
		put: ClassifierEndpoints.put,
		delete: ClassifierEndpoints.delete,
		listCategories: ClassifierEndpoints.listCategories,
		getCategory: ClassifierEndpoints.getCategory,
		deleteCategory: ClassifierEndpoints.deleteCategory,
	},
} as const;

export const textrazorEndpointSchemas = {
	'analysis.analyzeContent': {
		input: TextrazorEndpointInputSchemas.analyzeContent,
		output: TextrazorEndpointOutputSchemas.analyzeContent,
	},
	'analysis.classifyText': {
		input: TextrazorEndpointInputSchemas.classifyText,
		output: TextrazorEndpointOutputSchemas.classifyText,
	},
	'analysis.extractEntities': {
		input: TextrazorEndpointInputSchemas.extractEntities,
		output: TextrazorEndpointOutputSchemas.extractEntities,
	},
	'account.get': {
		input: TextrazorEndpointInputSchemas.getAccount,
		output: TextrazorEndpointOutputSchemas.getAccount,
	},
	'dictionaries.create': {
		input: TextrazorEndpointInputSchemas.createDictionary,
		output: TextrazorEndpointOutputSchemas.createDictionary,
	},
	'dictionaries.list': {
		input: TextrazorEndpointInputSchemas.listDictionaries,
		output: TextrazorEndpointOutputSchemas.listDictionaries,
	},
	'dictionaries.get': {
		input: TextrazorEndpointInputSchemas.getDictionary,
		output: TextrazorEndpointOutputSchemas.getDictionary,
	},
	'dictionaries.delete': {
		input: TextrazorEndpointInputSchemas.deleteDictionary,
		output: TextrazorEndpointOutputSchemas.deleteDictionary,
	},
	'dictionaries.listEntries': {
		input: TextrazorEndpointInputSchemas.listDictionaryEntries,
		output: TextrazorEndpointOutputSchemas.listDictionaryEntries,
	},
	'dictionaries.addEntries': {
		input: TextrazorEndpointInputSchemas.addDictionaryEntries,
		output: TextrazorEndpointOutputSchemas.addDictionaryEntries,
	},
	'dictionaries.getEntry': {
		input: TextrazorEndpointInputSchemas.getDictionaryEntry,
		output: TextrazorEndpointOutputSchemas.getDictionaryEntry,
	},
	'dictionaries.deleteEntry': {
		input: TextrazorEndpointInputSchemas.deleteDictionaryEntry,
		output: TextrazorEndpointOutputSchemas.deleteDictionaryEntry,
	},
	'classifiers.put': {
		input: TextrazorEndpointInputSchemas.putClassifier,
		output: TextrazorEndpointOutputSchemas.putClassifier,
	},
	'classifiers.delete': {
		input: TextrazorEndpointInputSchemas.deleteClassifier,
		output: TextrazorEndpointOutputSchemas.deleteClassifier,
	},
	'classifiers.listCategories': {
		input: TextrazorEndpointInputSchemas.listClassifierCategories,
		output: TextrazorEndpointOutputSchemas.listClassifierCategories,
	},
	'classifiers.getCategory': {
		input: TextrazorEndpointInputSchemas.getClassifierCategory,
		output: TextrazorEndpointOutputSchemas.getClassifierCategory,
	},
	'classifiers.deleteCategory': {
		input: TextrazorEndpointInputSchemas.deleteClassifierCategory,
		output: TextrazorEndpointOutputSchemas.deleteClassifierCategory,
	},
} satisfies RequiredPluginEndpointSchemas<typeof textrazorEndpointsNested>;

const textrazorEndpointMeta = {
	'analysis.analyzeContent': {
		riskLevel: 'read',
		description:
			'Analyze text or a URL with one or more TextRazor extractors in a single call',
	},
	'analysis.classifyText': {
		riskLevel: 'read',
		description:
			'Classify text or a URL against built-in or custom TextRazor classifiers',
	},
	'analysis.extractEntities': {
		riskLevel: 'read',
		description:
			'Extract named entities from text or a URL, optionally filtering by relevance and confidence',
	},
	'account.get': {
		riskLevel: 'read',
		description:
			'Get the current TextRazor plan, concurrency limits, and daily usage',
	},
	'dictionaries.create': {
		riskLevel: 'write',
		description: 'Create a custom entity dictionary',
	},
	'dictionaries.list': {
		riskLevel: 'read',
		description: 'List custom entity dictionaries on the account',
	},
	'dictionaries.get': {
		riskLevel: 'read',
		description: 'Get a custom entity dictionary by id',
	},
	'dictionaries.delete': {
		riskLevel: 'destructive',
		description: 'Delete a custom entity dictionary and all of its entries',
	},
	'dictionaries.listEntries': {
		riskLevel: 'read',
		description: 'List dictionary entries with limit and offset pagination',
	},
	'dictionaries.addEntries': {
		riskLevel: 'write',
		description: 'Add or overwrite entries in a custom entity dictionary',
	},
	'dictionaries.getEntry': {
		riskLevel: 'read',
		description: 'Get a dictionary entry by id',
	},
	'dictionaries.deleteEntry': {
		riskLevel: 'destructive',
		description: 'Delete a dictionary entry by id',
	},
	'classifiers.put': {
		riskLevel: 'write',
		description: 'Create or update a custom classifier from JSON categories',
	},
	'classifiers.delete': {
		riskLevel: 'destructive',
		description: 'Delete a custom classifier and all of its categories',
	},
	'classifiers.listCategories': {
		riskLevel: 'read',
		description:
			'List categories for a custom classifier with limit and offset pagination',
	},
	'classifiers.getCategory': {
		riskLevel: 'read',
		description: 'Get a category from a custom classifier by id',
	},
	'classifiers.deleteCategory': {
		riskLevel: 'destructive',
		description: 'Delete a category from a custom classifier',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof textrazorEndpointsNested
>;

function mergeErrorHandlers(
	builtIn: CorsairErrorHandler,
	overrides?: CorsairErrorHandler,
): CorsairErrorHandler {
	const { DEFAULT: builtInDefault, ...builtInRest } = builtIn;
	const { DEFAULT: overrideDefault, ...overrideRest } = overrides ?? {};
	return {
		...builtInRest,
		...overrideRest,
		DEFAULT: overrideDefault ?? builtInDefault,
	};
}

const defaultAuthType: AuthTypes = 'api_key' as const;

export const textrazorAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseTextrazorPlugin<T extends TextrazorPluginOptions> =
	CorsairPlugin<
		'textrazor',
		typeof TextrazorSchema,
		typeof textrazorEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof textrazorAuthConfig
	>;

export type InternalTextrazorPlugin =
	BaseTextrazorPlugin<TextrazorPluginOptions>;

export type ExternalTextrazorPlugin<T extends TextrazorPluginOptions> =
	BaseTextrazorPlugin<T>;

export function textrazor<const T extends TextrazorPluginOptions>(
	incomingOptions: TextrazorPluginOptions & T = {} as TextrazorPluginOptions &
		T,
): ExternalTextrazorPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'textrazor',
		authConfig: textrazorAuthConfig,
		schema: TextrazorSchema,
		options,
		hooks: options.hooks,
		endpoints: textrazorEndpointsNested,
		webhooks: {},
		endpointMeta: textrazorEndpointMeta,
		endpointSchemas: textrazorEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: TextrazorKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('textrazor', 'api_key');
				}
				return key;
			}

			throw new AuthMissingError('textrazor', 'api_key');
		},
	} satisfies InternalTextrazorPlugin;
}

export {
	assertTextrazorOk,
	TEXTRAZOR_API_BASE,
	TextrazorAPIError,
	toFormBody,
} from './client';
export type {
	TextrazorEndpointInputs,
	TextrazorEndpointOutputs,
} from './endpoints/types';
export {
	TextrazorEndpointInputSchemas,
	TextrazorEndpointOutputSchemas,
} from './endpoints/types';
