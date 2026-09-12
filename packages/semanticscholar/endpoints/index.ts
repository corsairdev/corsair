import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import { makeSemanticScholarRequest } from '../client';
import type { SemanticScholarEndpoints } from '../index';
import {
	SemanticScholarEndpointInputSchemas,
	SemanticScholarEndpointOutputSchemas,
} from './types';

type QueryValue = string | number | boolean | undefined;
type Query = Record<string, QueryValue>;

function encodePathPart(value: string): string {
	return encodeURIComponent(value);
}

function withFlaglessOpenAccess<T extends { openAccessPdf?: boolean }>(
	input: T,
): Omit<T, 'openAccessPdf'> & { openAccessPdf?: string } {
	const { openAccessPdf, ...rest } = input;
	return {
		...rest,
		openAccessPdf: openAccessPdf ? '' : undefined,
	};
}

function queryFrom(
	input: Record<string, unknown>,
	omit: readonly string[] = [],
) {
	const omitted = new Set(omit);
	const query: Query = {};
	for (const [key, value] of Object.entries(input)) {
		if (omitted.has(key) || value === undefined) continue;
		if (
			typeof value === 'string' ||
			typeof value === 'number' ||
			typeof value === 'boolean'
		) {
			query[key] = value;
		}
	}
	return query;
}

async function semanticScholarCall<T>(
	ctx: { key: string },
	path: string,
	outputSchema: z.ZodType<T>,
	options: {
		method?: 'GET' | 'POST';
		query?: Query;
		body?: Record<string, unknown>;
	} = {},
): Promise<T> {
	const raw = await makeSemanticScholarRequest(path, ctx.key, options);
	return outputSchema.parse(raw);
}

async function logOperation(
	ctx: Parameters<SemanticScholarEndpoints['getPaper']>[0],
	operation: string,
	input: Record<string, unknown>,
) {
	await logEventFromContext(
		ctx,
		`semanticscholar.${operation}`,
		input,
		'completed',
	);
}

export const getPaper: SemanticScholarEndpoints['getPaper'] = async (
	ctx,
	input,
) => {
	const parsed = SemanticScholarEndpointInputSchemas.getPaper.parse(input);
	const result = await semanticScholarCall(
		ctx,
		`/graph/v1/paper/${encodePathPart(parsed.paperId)}`,
		SemanticScholarEndpointOutputSchemas.getPaper,
		{ query: { fields: parsed.fields } },
	);
	await logOperation(ctx, 'papers.get', { paperId: parsed.paperId });
	return result;
};

export const getPapersBatch: SemanticScholarEndpoints['getPapersBatch'] =
	async (ctx, input) => {
		const parsed =
			SemanticScholarEndpointInputSchemas.getPapersBatch.parse(input);
		const result = await semanticScholarCall(
			ctx,
			'/graph/v1/paper/batch',
			SemanticScholarEndpointOutputSchemas.getPapersBatch,
			{
				method: 'POST',
				query: { fields: parsed.fields },
				body: { ids: parsed.ids },
			},
		);
		await logOperation(ctx, 'papers.batchGet', { count: parsed.ids.length });
		return result;
	};

async function runPaperSearch(
	ctx: Parameters<SemanticScholarEndpoints['searchPapers']>[0],
	input: Parameters<SemanticScholarEndpoints['searchPapers']>[1],
	operation: 'papers.search' | 'papers.relevanceSearch',
) {
	const parsed = SemanticScholarEndpointInputSchemas.searchPapers.parse(input);
	const result = await semanticScholarCall(
		ctx,
		'/graph/v1/paper/search',
		SemanticScholarEndpointOutputSchemas.searchPapers,
		{ query: queryFrom(withFlaglessOpenAccess(parsed)) },
	);
	await logOperation(ctx, operation, {
		query: parsed.query,
		offset: parsed.offset,
		limit: parsed.limit,
	});
	return result;
}

export const searchPapers: SemanticScholarEndpoints['searchPapers'] = async (
	ctx,
	input,
) => runPaperSearch(ctx, input, 'papers.search');

export const paperRelevanceSearch: SemanticScholarEndpoints['paperRelevanceSearch'] =
	async (ctx, input) => runPaperSearch(ctx, input, 'papers.relevanceSearch');

export const searchBulkPapers: SemanticScholarEndpoints['searchBulkPapers'] =
	async (ctx, input) => {
		const parsed =
			SemanticScholarEndpointInputSchemas.searchBulkPapers.parse(input);
		const result = await semanticScholarCall(
			ctx,
			'/graph/v1/paper/search/bulk',
			SemanticScholarEndpointOutputSchemas.searchBulkPapers,
			{ query: queryFrom(withFlaglessOpenAccess(parsed)) },
		);
		await logOperation(ctx, 'papers.searchBulk', {
			query: parsed.query,
			token: parsed.token,
			sort: parsed.sort,
		});
		return result;
	};

export const paperTitleSearch: SemanticScholarEndpoints['paperTitleSearch'] =
	async (ctx, input) => {
		const parsed =
			SemanticScholarEndpointInputSchemas.paperTitleSearch.parse(input);
		const result = await semanticScholarCall(
			ctx,
			'/graph/v1/paper/search/match',
			SemanticScholarEndpointOutputSchemas.paperTitleSearch,
			{ query: queryFrom(parsed) },
		);
		await logOperation(ctx, 'papers.matchTitle', { query: parsed.query });
		return result;
	};

export const autocompletePapers: SemanticScholarEndpoints['autocompletePapers'] =
	async (ctx, input) => {
		const parsed =
			SemanticScholarEndpointInputSchemas.autocompletePapers.parse(input);
		const result = await semanticScholarCall(
			ctx,
			'/graph/v1/paper/autocomplete',
			SemanticScholarEndpointOutputSchemas.autocompletePapers,
			{ query: queryFrom(parsed) },
		);
		await logOperation(ctx, 'papers.autocomplete', { query: parsed.query });
		return result;
	};

export const getPaperAuthors: SemanticScholarEndpoints['getPaperAuthors'] =
	async (ctx, input) => {
		const parsed =
			SemanticScholarEndpointInputSchemas.getPaperAuthors.parse(input);
		const result = await semanticScholarCall(
			ctx,
			`/graph/v1/paper/${encodePathPart(parsed.paperId)}/authors`,
			SemanticScholarEndpointOutputSchemas.getPaperAuthors,
			{ query: queryFrom(parsed, ['paperId']) },
		);
		await logOperation(ctx, 'papers.listAuthors', { paperId: parsed.paperId });
		return result;
	};

export const getPaperCitations: SemanticScholarEndpoints['getPaperCitations'] =
	async (ctx, input) => {
		const parsed =
			SemanticScholarEndpointInputSchemas.getPaperCitations.parse(input);
		const result = await semanticScholarCall(
			ctx,
			`/graph/v1/paper/${encodePathPart(parsed.paperId)}/citations`,
			SemanticScholarEndpointOutputSchemas.getPaperCitations,
			{ query: queryFrom(parsed, ['paperId']) },
		);
		await logOperation(ctx, 'papers.listCitations', {
			paperId: parsed.paperId,
		});
		return result;
	};

export const getPaperReferences: SemanticScholarEndpoints['getPaperReferences'] =
	async (ctx, input) => {
		const parsed =
			SemanticScholarEndpointInputSchemas.getPaperReferences.parse(input);
		const result = await semanticScholarCall(
			ctx,
			`/graph/v1/paper/${encodePathPart(parsed.paperId)}/references`,
			SemanticScholarEndpointOutputSchemas.getPaperReferences,
			{ query: queryFrom(parsed, ['paperId']) },
		);
		await logOperation(ctx, 'papers.listReferences', {
			paperId: parsed.paperId,
		});
		return result;
	};

export const searchAuthors: SemanticScholarEndpoints['searchAuthors'] = async (
	ctx,
	input,
) => {
	const parsed = SemanticScholarEndpointInputSchemas.searchAuthors.parse(input);
	const result = await semanticScholarCall(
		ctx,
		'/graph/v1/author/search',
		SemanticScholarEndpointOutputSchemas.searchAuthors,
		{ query: queryFrom(parsed) },
	);
	await logOperation(ctx, 'authors.search', { query: parsed.query });
	return result;
};

export const getAuthor: SemanticScholarEndpoints['getAuthor'] = async (
	ctx,
	input,
) => {
	const parsed = SemanticScholarEndpointInputSchemas.getAuthor.parse(input);
	const result = await semanticScholarCall(
		ctx,
		`/graph/v1/author/${encodePathPart(parsed.authorId)}`,
		SemanticScholarEndpointOutputSchemas.getAuthor,
		{ query: { fields: parsed.fields } },
	);
	await logOperation(ctx, 'authors.get', { authorId: parsed.authorId });
	return result;
};

export const getAuthorPapers: SemanticScholarEndpoints['getAuthorPapers'] =
	async (ctx, input) => {
		const parsed =
			SemanticScholarEndpointInputSchemas.getAuthorPapers.parse(input);
		const result = await semanticScholarCall(
			ctx,
			`/graph/v1/author/${encodePathPart(parsed.authorId)}/papers`,
			SemanticScholarEndpointOutputSchemas.getAuthorPapers,
			{ query: queryFrom(parsed, ['authorId']) },
		);
		await logOperation(ctx, 'authors.listPapers', {
			authorId: parsed.authorId,
		});
		return result;
	};

export const getAuthorsBatch: SemanticScholarEndpoints['getAuthorsBatch'] =
	async (ctx, input) => {
		const parsed =
			SemanticScholarEndpointInputSchemas.getAuthorsBatch.parse(input);
		const result = await semanticScholarCall(
			ctx,
			'/graph/v1/author/batch',
			SemanticScholarEndpointOutputSchemas.getAuthorsBatch,
			{
				method: 'POST',
				query: { fields: parsed.fields },
				body: { ids: parsed.ids },
			},
		);
		await logOperation(ctx, 'authors.batchGet', { count: parsed.ids.length });
		return result;
	};

export const getPaperRecommendations: SemanticScholarEndpoints['getPaperRecommendations'] =
	async (ctx, input) => {
		const parsed =
			SemanticScholarEndpointInputSchemas.getPaperRecommendations.parse(input);
		const result = await semanticScholarCall(
			ctx,
			'/recommendations/v1/papers',
			SemanticScholarEndpointOutputSchemas.getPaperRecommendations,
			{
				method: 'POST',
				query: { limit: parsed.limit, fields: parsed.fields },
				body: {
					positivePaperIds: parsed.positivePaperIds,
					negativePaperIds: parsed.negativePaperIds ?? [],
				},
			},
		);
		await logOperation(ctx, 'recommendations.fromPaperLists', {
			positiveCount: parsed.positivePaperIds.length,
			negativeCount: parsed.negativePaperIds?.length ?? 0,
		});
		return result;
	};

export const getRecommendationsForPaper: SemanticScholarEndpoints['getRecommendationsForPaper'] =
	async (ctx, input) => {
		const parsed =
			SemanticScholarEndpointInputSchemas.getRecommendationsForPaper.parse(
				input,
			);
		const result = await semanticScholarCall(
			ctx,
			`/recommendations/v1/papers/forpaper/${encodePathPart(parsed.paperId)}`,
			SemanticScholarEndpointOutputSchemas.getRecommendationsForPaper,
			{ query: queryFrom(parsed, ['paperId']) },
		);
		await logOperation(ctx, 'recommendations.forPaper', {
			paperId: parsed.paperId,
		});
		return result;
	};

export const listDatasetReleases: SemanticScholarEndpoints['listDatasetReleases'] =
	async (ctx, input) => {
		const parsed =
			SemanticScholarEndpointInputSchemas.listDatasetReleases.parse(input);
		const result = await semanticScholarCall(
			ctx,
			'/datasets/v1/release',
			SemanticScholarEndpointOutputSchemas.listDatasetReleases,
		);
		await logOperation(ctx, 'datasets.listReleases', parsed);
		return result;
	};

export const getDatasetRelease: SemanticScholarEndpoints['getDatasetRelease'] =
	async (ctx, input) => {
		const parsed =
			SemanticScholarEndpointInputSchemas.getDatasetRelease.parse(input);
		const result = await semanticScholarCall(
			ctx,
			`/datasets/v1/release/${encodePathPart(parsed.releaseId)}`,
			SemanticScholarEndpointOutputSchemas.getDatasetRelease,
		);
		await logOperation(ctx, 'datasets.getRelease', {
			releaseId: parsed.releaseId,
		});
		return result;
	};

export const getDataset: SemanticScholarEndpoints['getDataset'] = async (
	ctx,
	input,
) => {
	const parsed = SemanticScholarEndpointInputSchemas.getDataset.parse(input);
	const result = await semanticScholarCall(
		ctx,
		`/datasets/v1/release/${encodePathPart(parsed.releaseId)}/dataset/${encodePathPart(parsed.datasetName)}`,
		SemanticScholarEndpointOutputSchemas.getDataset,
	);
	await logOperation(ctx, 'datasets.get', {
		releaseId: parsed.releaseId,
		datasetName: parsed.datasetName,
	});
	return result;
};

export const getDatasetDiffs: SemanticScholarEndpoints['getDatasetDiffs'] =
	async (ctx, input) => {
		const parsed =
			SemanticScholarEndpointInputSchemas.getDatasetDiffs.parse(input);
		const result = await semanticScholarCall(
			ctx,
			`/datasets/v1/diffs/${encodePathPart(parsed.startReleaseId)}/to/${encodePathPart(parsed.endReleaseId)}/${encodePathPart(parsed.datasetName)}`,
			SemanticScholarEndpointOutputSchemas.getDatasetDiffs,
		);
		await logOperation(ctx, 'datasets.getDiffs', {
			startReleaseId: parsed.startReleaseId,
			endReleaseId: parsed.endReleaseId,
			datasetName: parsed.datasetName,
		});
		return result;
	};

export const searchTextSnippets: SemanticScholarEndpoints['searchTextSnippets'] =
	async (ctx, input) => {
		const parsed =
			SemanticScholarEndpointInputSchemas.searchTextSnippets.parse(input);
		const result = await semanticScholarCall(
			ctx,
			'/graph/v1/snippet/search',
			SemanticScholarEndpointOutputSchemas.searchTextSnippets,
			{ query: queryFrom(withFlaglessOpenAccess(parsed)) },
		);
		await logOperation(ctx, 'snippets.searchText', {
			query: parsed.query,
			limit: parsed.limit,
		});
		return result;
	};

export * from './types';
