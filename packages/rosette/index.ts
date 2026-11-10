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
import * as Analysis from './endpoints';
import type {
	RosetteEndpointInputs,
	RosetteEndpointOutputs,
} from './endpoints/types';
import {
	RosetteEndpointInputSchemas,
	RosetteEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { RosetteSchema } from './schema';

export type RosettePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRosettePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof rosetteEndpointsNested>;
};

export type RosetteContext = CorsairPluginContext<
	typeof RosetteSchema,
	RosettePluginOptions
>;

export type RosetteKeyBuilderContext = KeyBuilderContext<RosettePluginOptions>;

export type RosetteBoundEndpoints = BindEndpoints<
	typeof rosetteEndpointsNested
>;

type RosetteEndpoint<K extends keyof RosetteEndpointOutputs> = CorsairEndpoint<
	RosetteContext,
	RosetteEndpointInputs[K],
	RosetteEndpointOutputs[K]
>;

export type RosetteEndpoints = {
	ping: RosetteEndpoint<'ping'>;
	info: RosetteEndpoint<'info'>;
	language: RosetteEndpoint<'language'>;
	entities: RosetteEndpoint<'entities'>;
	sentiment: RosetteEndpoint<'sentiment'>;
	tokens: RosetteEndpoint<'tokens'>;
	sentences: RosetteEndpoint<'sentences'>;
	morphology: RosetteEndpoint<'morphology'>;
	categories: RosetteEndpoint<'categories'>;
	topics: RosetteEndpoint<'topics'>;
	relationships: RosetteEndpoint<'relationships'>;
	similarTerms: RosetteEndpoint<'similarTerms'>;
	textEmbedding: RosetteEndpoint<'textEmbedding'>;
	nameSimilarity: RosetteEndpoint<'nameSimilarity'>;
	nameTranslation: RosetteEndpoint<'nameTranslation'>;
	transliteration: RosetteEndpoint<'transliteration'>;
};

const rosetteEndpointsNested = {
	ping: Analysis.ping,
	info: Analysis.info,
	language: Analysis.language,
	entities: Analysis.entities,
	sentiment: Analysis.sentiment,
	tokens: Analysis.tokens,
	sentences: Analysis.sentences,
	morphology: Analysis.morphology,
	categories: Analysis.categories,
	topics: Analysis.topics,
	relationships: Analysis.relationships,
	semantics: {
		similarTerms: Analysis.similarTerms,
		vector: Analysis.textEmbedding,
	},
	nameSimilarity: Analysis.nameSimilarity,
	nameTranslation: Analysis.nameTranslation,
	transliteration: Analysis.transliteration,
} as const;

export const rosetteEndpointSchemas = {
	ping: {
		input: RosetteEndpointInputSchemas.ping,
		output: RosetteEndpointOutputSchemas.ping,
	},
	info: {
		input: RosetteEndpointInputSchemas.info,
		output: RosetteEndpointOutputSchemas.info,
	},
	language: {
		input: RosetteEndpointInputSchemas.language,
		output: RosetteEndpointOutputSchemas.language,
	},
	entities: {
		input: RosetteEndpointInputSchemas.entities,
		output: RosetteEndpointOutputSchemas.entities,
	},
	sentiment: {
		input: RosetteEndpointInputSchemas.sentiment,
		output: RosetteEndpointOutputSchemas.sentiment,
	},
	tokens: {
		input: RosetteEndpointInputSchemas.tokens,
		output: RosetteEndpointOutputSchemas.tokens,
	},
	sentences: {
		input: RosetteEndpointInputSchemas.sentences,
		output: RosetteEndpointOutputSchemas.sentences,
	},
	morphology: {
		input: RosetteEndpointInputSchemas.morphology,
		output: RosetteEndpointOutputSchemas.morphology,
	},
	categories: {
		input: RosetteEndpointInputSchemas.categories,
		output: RosetteEndpointOutputSchemas.categories,
	},
	topics: {
		input: RosetteEndpointInputSchemas.topics,
		output: RosetteEndpointOutputSchemas.topics,
	},
	relationships: {
		input: RosetteEndpointInputSchemas.relationships,
		output: RosetteEndpointOutputSchemas.relationships,
	},
	'semantics.similarTerms': {
		input: RosetteEndpointInputSchemas.similarTerms,
		output: RosetteEndpointOutputSchemas.similarTerms,
	},
	'semantics.vector': {
		input: RosetteEndpointInputSchemas.textEmbedding,
		output: RosetteEndpointOutputSchemas.textEmbedding,
	},
	nameSimilarity: {
		input: RosetteEndpointInputSchemas.nameSimilarity,
		output: RosetteEndpointOutputSchemas.nameSimilarity,
	},
	nameTranslation: {
		input: RosetteEndpointInputSchemas.nameTranslation,
		output: RosetteEndpointOutputSchemas.nameTranslation,
	},
	transliteration: {
		input: RosetteEndpointInputSchemas.transliteration,
		output: RosetteEndpointOutputSchemas.transliteration,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof rosetteEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const rosetteEndpointMeta = {
	ping: {
		riskLevel: 'read',
		description: 'Check that the host is reachable',
	},
	info: {
		riskLevel: 'read',
		description:
			'Read the server name, version and build, which explains a change in analysis output',
	},
	language: {
		riskLevel: 'read',
		description:
			'Detect the language of a text, with every candidate and its confidence',
	},
	entities: {
		riskLevel: 'read',
		description:
			'Extract people, places, organisations and other entities, grouped by entity ID and ranked by confidence',
	},
	sentiment: {
		riskLevel: 'read',
		description:
			'Score document and per-entity sentiment, where the label and the score are separate signals',
	},
	tokens: {
		riskLevel: 'read',
		description: 'Split a text into tokens with part-of-speech tags and lemmas',
	},
	sentences: {
		riskLevel: 'read',
		description: 'Find sentence boundaries, as offsets into the text',
	},
	morphology: {
		riskLevel: 'read',
		description:
			'Analyse morphology: lemmas, part-of-speech tags and compound components',
	},
	categories: {
		riskLevel: 'read',
		description:
			'Classify a text into topic-taxonomy categories with confidence',
	},
	topics: {
		riskLevel: 'read',
		description:
			'Extract topics and their broader concepts, with a salience rather than a probability',
	},
	relationships: {
		riskLevel: 'read',
		description:
			'Extract subject-verb-object relationships with the confidence of each predicate',
	},
	'semantics.similarTerms': {
		riskLevel: 'read',
		description: 'Find terms near the input in embedding space',
	},
	'semantics.vector': {
		riskLevel: 'read',
		description: 'Compute a text embedding, with its dimension count',
	},
	nameSimilarity: {
		riskLevel: 'read',
		description:
			'Score how likely two names are to be the same entity; the order of the two affects the score',
	},
	nameTranslation: {
		riskLevel: 'read',
		description:
			'Translate a name into another language, optionally saying which script and entity type it is',
	},
	transliteration: {
		riskLevel: 'read',
		description:
			'Transliterate text into another script, which keeps the words rather than translating them',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof rosetteEndpointsNested>;

export type BaseRosettePlugin<T extends RosettePluginOptions> = CorsairPlugin<
	'rosette',
	typeof RosetteSchema,
	typeof rosetteEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalRosettePlugin = BaseRosettePlugin<RosettePluginOptions>;

export type ExternalRosettePlugin<T extends RosettePluginOptions> =
	BaseRosettePlugin<T>;

export function rosette<const T extends RosettePluginOptions>(
	incomingOptions: RosettePluginOptions & T = {} as RosettePluginOptions & T,
): ExternalRosettePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'rosette',
		schema: RosetteSchema,
		options: options,
		hooks: options.hooks,
		endpoints: rosetteEndpointsNested,
		webhooks: {},
		endpointMeta: rosetteEndpointMeta,
		endpointSchemas: rosetteEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: RosetteKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('rosette', ctx.authType ?? 'api_key');
		},
	} satisfies InternalRosettePlugin;
}

export { RosetteAPIError } from './client';

export type {
	CategoriesResponse,
	EntitiesResponse,
	InfoResponse,
	LanguageResponse,
	MorphologyResponse,
	NameSimilarityInput,
	NameSimilarityResponse,
	NameTranslationInput,
	NameTranslationResponse,
	PingResponse,
	RelationshipsInput,
	RelationshipsResponse,
	RosetteDocumentInput,
	RosetteEndpointInputs,
	RosetteEndpointOutputs,
	RosetteEntity,
	SentencesResponse,
	SentimentResponse,
	SimilarTermsResponse,
	TokensResponse,
	TopicsInput,
	TopicsResponse,
	TransliterationInput,
	TransliterationResponse,
	VectorInput,
	VectorResponse,
} from './endpoints/types';
