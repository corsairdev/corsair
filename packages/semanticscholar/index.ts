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
import * as Endpoints from './endpoints';
import type {
	SemanticScholarEndpointInputs,
	SemanticScholarEndpointOutputs,
} from './endpoints/types';
import {
	SemanticScholarEndpointInputSchemas,
	SemanticScholarEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SemanticScholarSchema } from './schema';

const semanticScholarEndpointsNested = {
	papers: {
		get: Endpoints.getPaper,
		batchGet: Endpoints.getPapersBatch,
		search: Endpoints.searchPapers,
		relevanceSearch: Endpoints.paperRelevanceSearch,
		searchBulk: Endpoints.searchBulkPapers,
		matchTitle: Endpoints.paperTitleSearch,
		autocomplete: Endpoints.autocompletePapers,
		listAuthors: Endpoints.getPaperAuthors,
		listCitations: Endpoints.getPaperCitations,
		listReferences: Endpoints.getPaperReferences,
	},
	authors: {
		search: Endpoints.searchAuthors,
		get: Endpoints.getAuthor,
		listPapers: Endpoints.getAuthorPapers,
		batchGet: Endpoints.getAuthorsBatch,
	},
	recommendations: {
		fromPaperLists: Endpoints.getPaperRecommendations,
		forPaper: Endpoints.getRecommendationsForPaper,
	},
	datasets: {
		listReleases: Endpoints.listDatasetReleases,
		getRelease: Endpoints.getDatasetRelease,
		get: Endpoints.getDataset,
		getDiffs: Endpoints.getDatasetDiffs,
	},
	snippets: {
		searchText: Endpoints.searchTextSnippets,
	},
} as const;

export type SemanticScholarPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSemanticScholarPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof semanticScholarEndpointsNested>;
};

export type SemanticScholarContext = CorsairPluginContext<
	typeof SemanticScholarSchema,
	SemanticScholarPluginOptions
>;

export type SemanticScholarKeyBuilderContext =
	KeyBuilderContext<SemanticScholarPluginOptions>;

export type SemanticScholarBoundEndpoints = BindEndpoints<
	typeof semanticScholarEndpointsNested
>;

type SemanticScholarEndpoint<K extends keyof SemanticScholarEndpointOutputs> =
	CorsairEndpoint<
		SemanticScholarContext,
		SemanticScholarEndpointInputs[K],
		SemanticScholarEndpointOutputs[K]
	>;

export type SemanticScholarEndpoints = {
	getPaper: SemanticScholarEndpoint<'getPaper'>;
	getPapersBatch: SemanticScholarEndpoint<'getPapersBatch'>;
	searchPapers: SemanticScholarEndpoint<'searchPapers'>;
	paperRelevanceSearch: SemanticScholarEndpoint<'paperRelevanceSearch'>;
	searchBulkPapers: SemanticScholarEndpoint<'searchBulkPapers'>;
	paperTitleSearch: SemanticScholarEndpoint<'paperTitleSearch'>;
	autocompletePapers: SemanticScholarEndpoint<'autocompletePapers'>;
	getPaperAuthors: SemanticScholarEndpoint<'getPaperAuthors'>;
	getPaperCitations: SemanticScholarEndpoint<'getPaperCitations'>;
	getPaperReferences: SemanticScholarEndpoint<'getPaperReferences'>;
	searchAuthors: SemanticScholarEndpoint<'searchAuthors'>;
	getAuthor: SemanticScholarEndpoint<'getAuthor'>;
	getAuthorPapers: SemanticScholarEndpoint<'getAuthorPapers'>;
	getAuthorsBatch: SemanticScholarEndpoint<'getAuthorsBatch'>;
	getPaperRecommendations: SemanticScholarEndpoint<'getPaperRecommendations'>;
	getRecommendationsForPaper: SemanticScholarEndpoint<'getRecommendationsForPaper'>;
	listDatasetReleases: SemanticScholarEndpoint<'listDatasetReleases'>;
	getDatasetRelease: SemanticScholarEndpoint<'getDatasetRelease'>;
	getDataset: SemanticScholarEndpoint<'getDataset'>;
	getDatasetDiffs: SemanticScholarEndpoint<'getDatasetDiffs'>;
	searchTextSnippets: SemanticScholarEndpoint<'searchTextSnippets'>;
};

export const semanticScholarEndpointSchemas = {
	'papers.get': {
		input: SemanticScholarEndpointInputSchemas.getPaper,
		output: SemanticScholarEndpointOutputSchemas.getPaper,
	},
	'papers.batchGet': {
		input: SemanticScholarEndpointInputSchemas.getPapersBatch,
		output: SemanticScholarEndpointOutputSchemas.getPapersBatch,
	},
	'papers.search': {
		input: SemanticScholarEndpointInputSchemas.searchPapers,
		output: SemanticScholarEndpointOutputSchemas.searchPapers,
	},
	'papers.relevanceSearch': {
		input: SemanticScholarEndpointInputSchemas.paperRelevanceSearch,
		output: SemanticScholarEndpointOutputSchemas.paperRelevanceSearch,
	},
	'papers.searchBulk': {
		input: SemanticScholarEndpointInputSchemas.searchBulkPapers,
		output: SemanticScholarEndpointOutputSchemas.searchBulkPapers,
	},
	'papers.matchTitle': {
		input: SemanticScholarEndpointInputSchemas.paperTitleSearch,
		output: SemanticScholarEndpointOutputSchemas.paperTitleSearch,
	},
	'papers.autocomplete': {
		input: SemanticScholarEndpointInputSchemas.autocompletePapers,
		output: SemanticScholarEndpointOutputSchemas.autocompletePapers,
	},
	'papers.listAuthors': {
		input: SemanticScholarEndpointInputSchemas.getPaperAuthors,
		output: SemanticScholarEndpointOutputSchemas.getPaperAuthors,
	},
	'papers.listCitations': {
		input: SemanticScholarEndpointInputSchemas.getPaperCitations,
		output: SemanticScholarEndpointOutputSchemas.getPaperCitations,
	},
	'papers.listReferences': {
		input: SemanticScholarEndpointInputSchemas.getPaperReferences,
		output: SemanticScholarEndpointOutputSchemas.getPaperReferences,
	},
	'authors.search': {
		input: SemanticScholarEndpointInputSchemas.searchAuthors,
		output: SemanticScholarEndpointOutputSchemas.searchAuthors,
	},
	'authors.get': {
		input: SemanticScholarEndpointInputSchemas.getAuthor,
		output: SemanticScholarEndpointOutputSchemas.getAuthor,
	},
	'authors.listPapers': {
		input: SemanticScholarEndpointInputSchemas.getAuthorPapers,
		output: SemanticScholarEndpointOutputSchemas.getAuthorPapers,
	},
	'authors.batchGet': {
		input: SemanticScholarEndpointInputSchemas.getAuthorsBatch,
		output: SemanticScholarEndpointOutputSchemas.getAuthorsBatch,
	},
	'recommendations.fromPaperLists': {
		input: SemanticScholarEndpointInputSchemas.getPaperRecommendations,
		output: SemanticScholarEndpointOutputSchemas.getPaperRecommendations,
	},
	'recommendations.forPaper': {
		input: SemanticScholarEndpointInputSchemas.getRecommendationsForPaper,
		output: SemanticScholarEndpointOutputSchemas.getRecommendationsForPaper,
	},
	'datasets.listReleases': {
		input: SemanticScholarEndpointInputSchemas.listDatasetReleases,
		output: SemanticScholarEndpointOutputSchemas.listDatasetReleases,
	},
	'datasets.getRelease': {
		input: SemanticScholarEndpointInputSchemas.getDatasetRelease,
		output: SemanticScholarEndpointOutputSchemas.getDatasetRelease,
	},
	'datasets.get': {
		input: SemanticScholarEndpointInputSchemas.getDataset,
		output: SemanticScholarEndpointOutputSchemas.getDataset,
	},
	'datasets.getDiffs': {
		input: SemanticScholarEndpointInputSchemas.getDatasetDiffs,
		output: SemanticScholarEndpointOutputSchemas.getDatasetDiffs,
	},
	'snippets.searchText': {
		input: SemanticScholarEndpointInputSchemas.searchTextSnippets,
		output: SemanticScholarEndpointOutputSchemas.searchTextSnippets,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof semanticScholarEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const semanticScholarEndpointMeta = {
	'papers.get': {
		riskLevel: 'read',
		description:
			'Retrieve details about a paper by Semantic Scholar-supported ID',
	},
	'papers.batchGet': {
		riskLevel: 'read',
		description: 'Retrieve details for up to 500 papers in one request',
	},
	'papers.search': {
		riskLevel: 'read',
		description: 'Search papers by relevance with optional publication filters',
	},
	'papers.relevanceSearch': {
		riskLevel: 'read',
		description:
			'Deprecated alias for paper relevance search; use papers.search for new code',
	},
	'papers.searchBulk': {
		riskLevel: 'read',
		description:
			'Bulk search papers with token pagination and optional sorting',
	},
	'papers.matchTitle': {
		riskLevel: 'read',
		description: 'Find the closest paper title match for a query',
	},
	'papers.autocomplete': {
		riskLevel: 'read',
		description: 'Suggest paper query completions for a partial query',
	},
	'papers.listAuthors': {
		riskLevel: 'read',
		description: 'List authors for a paper with offset pagination',
	},
	'papers.listCitations': {
		riskLevel: 'read',
		description: 'List papers that cite a paper with offset pagination',
	},
	'papers.listReferences': {
		riskLevel: 'read',
		description: 'List references cited by a paper with offset pagination',
	},
	'authors.search': {
		riskLevel: 'read',
		description: 'Search authors by name',
	},
	'authors.get': {
		riskLevel: 'read',
		description:
			'Retrieve details about an author by Semantic Scholar author ID',
	},
	'authors.listPapers': {
		riskLevel: 'read',
		description: 'List papers written by an author with offset pagination',
	},
	'authors.batchGet': {
		riskLevel: 'read',
		description: 'Retrieve details for up to 1000 authors in one request',
	},
	'recommendations.fromPaperLists': {
		riskLevel: 'read',
		description:
			'Get paper recommendations from positive and optional negative paper examples',
	},
	'recommendations.forPaper': {
		riskLevel: 'read',
		description: 'Get recommended papers for one source paper',
	},
	'datasets.listReleases': {
		riskLevel: 'read',
		description: 'List available Semantic Scholar dataset releases',
	},
	'datasets.getRelease': {
		riskLevel: 'read',
		description: 'Retrieve dataset release metadata',
	},
	'datasets.get': {
		riskLevel: 'read',
		description: 'Get download links for a dataset in a release',
	},
	'datasets.getDiffs': {
		riskLevel: 'read',
		description: 'Get incremental dataset diffs between two releases',
	},
	'snippets.searchText': {
		riskLevel: 'read',
		description: 'Search text snippets within Semantic Scholar papers',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof semanticScholarEndpointsNested
>;

export const semanticScholarAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseSemanticScholarPlugin<T extends SemanticScholarPluginOptions> =
	CorsairPlugin<
		'semanticscholar',
		typeof SemanticScholarSchema,
		typeof semanticScholarEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalSemanticScholarPlugin =
	BaseSemanticScholarPlugin<SemanticScholarPluginOptions>;

export type ExternalSemanticScholarPlugin<
	T extends SemanticScholarPluginOptions,
> = BaseSemanticScholarPlugin<T>;

/**
 * Semantic Scholar plugin.
 *
 * Pull-only integration for Academic Graph, Recommendations, Datasets, and
 * Snippets APIs. Semantic Scholar does not provide webhooks for this surface.
 */
export function semanticscholar<const T extends SemanticScholarPluginOptions>(
	incomingOptions: SemanticScholarPluginOptions &
		T = {} as SemanticScholarPluginOptions & T,
): ExternalSemanticScholarPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'semanticscholar',
		authConfig: semanticScholarAuthConfig,
		schema: SemanticScholarSchema,
		options,
		hooks: options.hooks,
		endpoints: semanticScholarEndpointsNested,
		webhooks: {},
		endpointMeta: semanticScholarEndpointMeta,
		endpointSchemas: semanticScholarEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SemanticScholarKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('semanticscholar', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('semanticscholar', 'api_key');
		},
	} satisfies InternalSemanticScholarPlugin;
}

export type {
	SemanticScholarEndpointInputs,
	SemanticScholarEndpointOutputs,
} from './endpoints/types';
