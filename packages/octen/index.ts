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
import {
	Answer,
	BroadSearch,
	BusinessSearch,
	Embedding,
	Extract,
	GroundedGeneration,
	ImageSearch,
	NewsSearch,
	Search,
	VideoGeneration,
	VideoSearch,
	VlEmbedding,
} from './endpoints';
import type {
	OctenEndpointInputs,
	OctenEndpointOutputs,
} from './endpoints/types';
import {
	OctenEndpointInputSchemas,
	OctenEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { OctenSchema } from './schema';

export type OctenPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalOctenPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof octenEndpointsNested>;
};

export type OctenContext = CorsairPluginContext<
	typeof OctenSchema,
	OctenPluginOptions
>;

export type OctenKeyBuilderContext = KeyBuilderContext<OctenPluginOptions>;

export type OctenBoundEndpoints = BindEndpoints<typeof octenEndpointsNested>;

type OctenEndpoint<K extends keyof OctenEndpointOutputs> = CorsairEndpoint<
	OctenContext,
	OctenEndpointInputs[K],
	OctenEndpointOutputs[K]
>;

export type OctenEndpoints = {
	searchPost: OctenEndpoint<'searchPost'>;
	broadSearchPost: OctenEndpoint<'broadSearchPost'>;
	newsSearchPost: OctenEndpoint<'newsSearchPost'>;
	businessSearchPost: OctenEndpoint<'businessSearchPost'>;
	imageSearchPost: OctenEndpoint<'imageSearchPost'>;
	videoSearchPost: OctenEndpoint<'videoSearchPost'>;
	extractPost: OctenEndpoint<'extractPost'>;
	embeddingCreate: OctenEndpoint<'embeddingCreate'>;
	vlEmbeddingCreate: OctenEndpoint<'vlEmbeddingCreate'>;
	answerCreate: OctenEndpoint<'answerCreate'>;
	videoGenerationCreate: OctenEndpoint<'videoGenerationCreate'>;
	videoGenerationGet: OctenEndpoint<'videoGenerationGet'>;
	groundedGenerationCreate: OctenEndpoint<'groundedGenerationCreate'>;
	groundedGenerationGet: OctenEndpoint<'groundedGenerationGet'>;
};

// Octen's JSON APIs are RPC-style actions, so search/extract/embedding
// operations are named after their HTTP verb (`.post`, `.create`); the two
// generation APIs are resources with a create/get pair.
const octenEndpointsNested = {
	search: {
		post: Search.post,
	},
	broadSearch: {
		post: BroadSearch.post,
	},
	newsSearch: {
		post: NewsSearch.post,
	},
	businessSearch: {
		post: BusinessSearch.post,
	},
	imageSearch: {
		post: ImageSearch.post,
	},
	videoSearch: {
		post: VideoSearch.post,
	},
	extract: {
		post: Extract.post,
	},
	embedding: {
		create: Embedding.create,
	},
	vlEmbedding: {
		create: VlEmbedding.create,
	},
	answer: {
		create: Answer.create,
	},
	videoGeneration: {
		create: VideoGeneration.create,
		get: VideoGeneration.get,
	},
	groundedGeneration: {
		create: GroundedGeneration.create,
		get: GroundedGeneration.get,
	},
} as const;

export const octenEndpointSchemas = {
	'search.post': {
		input: OctenEndpointInputSchemas.searchPost,
		output: OctenEndpointOutputSchemas.searchPost,
	},
	'broadSearch.post': {
		input: OctenEndpointInputSchemas.broadSearchPost,
		output: OctenEndpointOutputSchemas.broadSearchPost,
	},
	'newsSearch.post': {
		input: OctenEndpointInputSchemas.newsSearchPost,
		output: OctenEndpointOutputSchemas.newsSearchPost,
	},
	'businessSearch.post': {
		input: OctenEndpointInputSchemas.businessSearchPost,
		output: OctenEndpointOutputSchemas.businessSearchPost,
	},
	'imageSearch.post': {
		input: OctenEndpointInputSchemas.imageSearchPost,
		output: OctenEndpointOutputSchemas.imageSearchPost,
	},
	'videoSearch.post': {
		input: OctenEndpointInputSchemas.videoSearchPost,
		output: OctenEndpointOutputSchemas.videoSearchPost,
	},
	'extract.post': {
		input: OctenEndpointInputSchemas.extractPost,
		output: OctenEndpointOutputSchemas.extractPost,
	},
	'embedding.create': {
		input: OctenEndpointInputSchemas.embeddingCreate,
		output: OctenEndpointOutputSchemas.embeddingCreate,
	},
	'vlEmbedding.create': {
		input: OctenEndpointInputSchemas.vlEmbeddingCreate,
		output: OctenEndpointOutputSchemas.vlEmbeddingCreate,
	},
	'answer.create': {
		input: OctenEndpointInputSchemas.answerCreate,
		output: OctenEndpointOutputSchemas.answerCreate,
	},
	'videoGeneration.create': {
		input: OctenEndpointInputSchemas.videoGenerationCreate,
		output: OctenEndpointOutputSchemas.videoGenerationCreate,
	},
	'videoGeneration.get': {
		input: OctenEndpointInputSchemas.videoGenerationGet,
		output: OctenEndpointOutputSchemas.videoGenerationGet,
	},
	'groundedGeneration.create': {
		input: OctenEndpointInputSchemas.groundedGenerationCreate,
		output: OctenEndpointOutputSchemas.groundedGenerationCreate,
	},
	'groundedGeneration.get': {
		input: OctenEndpointInputSchemas.groundedGenerationGet,
		output: OctenEndpointOutputSchemas.groundedGenerationGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof octenEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const octenEndpointMeta = {
	'search.post': {
		riskLevel: 'read',
		description: 'Search the web with ranked, highlightable results',
	},
	'broadSearch.post': {
		riskLevel: 'read',
		description: 'Expand one query into sub-queries and search each of them',
	},
	'newsSearch.post': {
		riskLevel: 'read',
		description: 'Search news articles, optionally grouped into events',
	},
	'businessSearch.post': {
		riskLevel: 'read',
		description: 'Search business pages and return company and people cards',
	},
	'imageSearch.post': {
		riskLevel: 'read',
		description: 'Search images by text query or by a reference image',
	},
	'videoSearch.post': {
		riskLevel: 'read',
		description: 'Search videos by a text query',
	},
	'extract.post': {
		riskLevel: 'read',
		description: 'Extract page content from up to 20 URLs',
	},
	'embedding.create': {
		riskLevel: 'read',
		description: 'Create text embeddings with an Octen embedding model',
	},
	'vlEmbedding.create': {
		riskLevel: 'read',
		description: 'Create multimodal embeddings from text, images and video',
	},
	'answer.create': {
		riskLevel: 'read',
		description:
			'Decompose messages into sub-queries, search, and synthesize an answer',
	},
	'videoGeneration.create': {
		riskLevel: 'write',
		description: 'Queue a text-to-video generation task',
	},
	'videoGeneration.get': {
		riskLevel: 'read',
		description: 'Get a video generation task and its download URL',
	},
	'groundedGeneration.create': {
		riskLevel: 'write',
		description: 'Queue a search-grounded image or video generation task',
	},
	'groundedGeneration.get': {
		riskLevel: 'read',
		description: 'Get a grounded generation task and its output URL',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof octenEndpointsNested>;

export const octenAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseOctenPlugin<T extends OctenPluginOptions> = CorsairPlugin<
	'octen',
	typeof OctenSchema,
	typeof octenEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalOctenPlugin = BaseOctenPlugin<OctenPluginOptions>;

export type ExternalOctenPlugin<T extends OctenPluginOptions> =
	BaseOctenPlugin<T>;

export function octen<const T extends OctenPluginOptions>(
	incomingOptions: OctenPluginOptions & T = {} as OctenPluginOptions & T,
): ExternalOctenPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'octen',
		authConfig: octenAuthConfig,
		schema: OctenSchema,
		options,
		hooks: options.hooks,
		endpoints: octenEndpointsNested,
		// Octen publishes no verifiable inbound webhook spec, so the plugin
		// declares none (matching the tpscheck plugin).
		webhooks: {},
		endpointMeta: octenEndpointMeta,
		endpointSchemas: octenEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: OctenKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				return (await ctx.keys.get_api_key()) ?? '';
			}

			return '';
		},
	} satisfies InternalOctenPlugin;
}

export type {
	AnswerInput,
	AnswerResponse,
	BroadSearchInput,
	BroadSearchResponse,
	BusinessSearchInput,
	BusinessSearchResponse,
	EmbeddingInput,
	EmbeddingResponse,
	ExtractInput,
	ExtractResponse,
	GroundedGenerationCreateInput,
	GroundedGenerationCreateResponse,
	GroundedGenerationGetInput,
	GroundedGenerationGetResponse,
	ImageSearchInput,
	ImageSearchResponse,
	NewsSearchInput,
	NewsSearchResponse,
	OctenEndpointInputs,
	OctenEndpointOutputs,
	SearchInput,
	SearchResponse,
	VideoGenerationCreateInput,
	VideoGenerationCreateResponse,
	VideoGenerationGetInput,
	VideoGenerationGetResponse,
	VideoSearchInput,
	VideoSearchResponse,
	VLEmbeddingInput,
	VLEmbeddingResponse,
} from './endpoints/types';
