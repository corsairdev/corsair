import { z } from 'zod';
import {
	SemanticScholarAuthor,
	SemanticScholarAutocompleteMatch,
	SemanticScholarCitation,
	SemanticScholarDataset,
	SemanticScholarDatasetDiff,
	SemanticScholarDatasetRelease,
	SemanticScholarPaper,
	SemanticScholarRecommendationResponse,
	SemanticScholarReference,
	SemanticScholarSnippet,
} from '../schema/database';

const Fields = z
	.string()
	.trim()
	.min(1)
	.optional()
	.describe('Comma-separated Semantic Scholar fields parameter');

const PaperId = z
	.string()
	.trim()
	.min(1)
	.describe(
		'Semantic Scholar paper ID, CorpusId:<id>, DOI:<doi>, ARXIV:<id>, PMID:<id>, PMCID:<id>, ACL:<id>, MAG:<id>, or URL:<url>',
	);

const AuthorId = z
	.string()
	.trim()
	.min(1)
	.describe('Semantic Scholar author ID');

const Offset = z.number().int().min(0).optional();
const Limit100 = z.number().int().min(1).max(100).optional();
const Limit500 = z.number().int().min(1).max(500).optional();
const Limit1000 = z.number().int().min(1).max(1000).optional();

const SearchFilters = {
	fields: Fields,
	publicationTypes: z.string().trim().min(1).optional(),
	openAccessPdf: z.boolean().optional(),
	minCitationCount: z.number().int().min(0).optional(),
	publicationDateOrYear: z.string().trim().min(1).optional(),
	year: z.string().trim().min(1).optional(),
	venue: z.string().trim().min(1).optional(),
	fieldsOfStudy: z.string().trim().min(1).optional(),
};

const PaginatedPapersOutputSchema = z
	.object({
		total: z.number().optional(),
		offset: z.number().optional(),
		next: z.union([z.number(), z.string()]).nullable().optional(),
		token: z.string().nullable().optional(),
		data: z.array(SemanticScholarPaper),
	})
	.loose();

const PaginatedAuthorsOutputSchema = z
	.object({
		total: z.number().optional(),
		offset: z.number().optional(),
		next: z.union([z.number(), z.string()]).nullable().optional(),
		data: z.array(SemanticScholarAuthor),
	})
	.loose();

const PaginatedCitationsOutputSchema = z
	.object({
		offset: z.number().optional(),
		next: z.union([z.number(), z.string()]).nullable().optional(),
		data: z.array(SemanticScholarCitation),
	})
	.loose();

const PaginatedReferencesOutputSchema = z
	.object({
		offset: z.number().optional(),
		next: z.union([z.number(), z.string()]).nullable().optional(),
		data: z.array(SemanticScholarReference),
	})
	.loose();

export const GetPaperInputSchema = z.object({
	paperId: PaperId,
	fields: Fields,
});

export const GetPapersBatchInputSchema = z.object({
	ids: z.array(PaperId).min(1).max(500),
	fields: Fields,
});

export const SearchPapersInputSchema = z.object({
	query: z.string().trim().min(1),
	...SearchFilters,
	offset: Offset,
	limit: Limit100,
});

export const SearchBulkPapersInputSchema = z.object({
	query: z.string().trim().min(1),
	...SearchFilters,
	token: z.string().trim().min(1).optional(),
	sort: z
		.enum([
			'paperId',
			'paperId:asc',
			'paperId:desc',
			'publicationDate',
			'publicationDate:asc',
			'publicationDate:desc',
			'citationCount',
			'citationCount:asc',
			'citationCount:desc',
		])
		.optional(),
});

export const PaperTitleSearchInputSchema = z.object({
	query: z.string().trim().min(1),
	fields: Fields,
});

export const AutocompleteInputSchema = z.object({
	query: z.string().trim().min(1).max(100),
});

export const PaperChildInputSchema = z.object({
	paperId: PaperId,
	offset: Offset,
	limit: Limit1000,
	fields: Fields,
});

export const SearchAuthorsInputSchema = z.object({
	query: z.string().trim().min(1),
	offset: Offset,
	limit: Limit1000,
	fields: Fields,
});

export const GetAuthorInputSchema = z.object({
	authorId: AuthorId,
	fields: Fields,
});

export const GetAuthorPapersInputSchema = z.object({
	authorId: AuthorId,
	offset: Offset,
	limit: Limit1000,
	fields: Fields,
	publicationDateOrYear: z.string().trim().min(1).optional(),
});

export const GetAuthorsBatchInputSchema = z.object({
	ids: z.array(AuthorId).min(1).max(1000),
	fields: Fields,
});

export const GetPaperRecommendationsInputSchema = z.object({
	positivePaperIds: z.array(PaperId).min(1),
	negativePaperIds: z.array(PaperId).optional(),
	limit: Limit500,
	fields: Fields,
});

export const GetRecommendationsForPaperInputSchema = z.object({
	paperId: PaperId,
	from: z.enum(['recent', 'all-cs']).optional(),
	limit: Limit500,
	fields: Fields,
});

export const EmptyInputSchema = z.object({});

export const GetDatasetReleaseInputSchema = z.object({
	releaseId: z.string().trim().min(1),
});

export const GetDatasetInputSchema = z.object({
	releaseId: z.string().trim().min(1),
	datasetName: z.string().trim().min(1),
});

export const GetDatasetDiffsInputSchema = z.object({
	startReleaseId: z.string().trim().min(1),
	endReleaseId: z.string().trim().min(1),
	datasetName: z.string().trim().min(1),
});

export const SearchTextSnippetsInputSchema = z.object({
	query: z.string().trim().min(1),
	fields: Fields,
	limit: Limit1000,
	publicationTypes: z.string().trim().min(1).optional(),
	openAccessPdf: z.boolean().optional(),
	minCitationCount: z.number().int().min(0).optional(),
	insertedBefore: z.string().trim().min(1).optional(),
	publicationDateOrYear: z.string().trim().min(1).optional(),
	year: z.string().trim().min(1).optional(),
	venue: z.string().trim().min(1).optional(),
	fieldsOfStudy: z.string().trim().min(1).optional(),
	authors: z.string().trim().min(1).optional(),
	paperIds: z.string().trim().min(1).optional(),
});

const AutocompleteOutputSchema = z
	.object({
		matches: z.array(SemanticScholarAutocompleteMatch),
	})
	.loose();

const PapersBatchOutputSchema = z.array(SemanticScholarPaper.nullable());
const AuthorsBatchOutputSchema = z.array(SemanticScholarAuthor.nullable());

const DatasetReleasesOutputSchema = z.union([
	z.array(z.string()),
	z.object({ releaseIds: z.array(z.string()) }).loose(),
]);

const DatasetDiffsOutputSchema = z.union([
	z.array(SemanticScholarDatasetDiff),
	z
		.object({
			diffs: z.array(SemanticScholarDatasetDiff),
		})
		.loose(),
]);

const SnippetSearchOutputSchema = z
	.object({
		data: z.array(SemanticScholarSnippet),
	})
	.loose();

export type SemanticScholarEndpointInputs = {
	getPaper: z.input<typeof GetPaperInputSchema>;
	getPapersBatch: z.input<typeof GetPapersBatchInputSchema>;
	searchPapers: z.input<typeof SearchPapersInputSchema>;
	paperRelevanceSearch: z.input<typeof SearchPapersInputSchema>;
	searchBulkPapers: z.input<typeof SearchBulkPapersInputSchema>;
	paperTitleSearch: z.input<typeof PaperTitleSearchInputSchema>;
	autocompletePapers: z.input<typeof AutocompleteInputSchema>;
	getPaperAuthors: z.input<typeof PaperChildInputSchema>;
	getPaperCitations: z.input<typeof PaperChildInputSchema>;
	getPaperReferences: z.input<typeof PaperChildInputSchema>;
	searchAuthors: z.input<typeof SearchAuthorsInputSchema>;
	getAuthor: z.input<typeof GetAuthorInputSchema>;
	getAuthorPapers: z.input<typeof GetAuthorPapersInputSchema>;
	getAuthorsBatch: z.input<typeof GetAuthorsBatchInputSchema>;
	getPaperRecommendations: z.input<typeof GetPaperRecommendationsInputSchema>;
	getRecommendationsForPaper: z.input<
		typeof GetRecommendationsForPaperInputSchema
	>;
	listDatasetReleases: z.input<typeof EmptyInputSchema>;
	getDatasetRelease: z.input<typeof GetDatasetReleaseInputSchema>;
	getDataset: z.input<typeof GetDatasetInputSchema>;
	getDatasetDiffs: z.input<typeof GetDatasetDiffsInputSchema>;
	searchTextSnippets: z.input<typeof SearchTextSnippetsInputSchema>;
};

export type SemanticScholarEndpointOutputs = {
	getPaper: z.infer<typeof SemanticScholarPaper>;
	getPapersBatch: z.infer<typeof PapersBatchOutputSchema>;
	searchPapers: z.infer<typeof PaginatedPapersOutputSchema>;
	paperRelevanceSearch: z.infer<typeof PaginatedPapersOutputSchema>;
	searchBulkPapers: z.infer<typeof PaginatedPapersOutputSchema>;
	paperTitleSearch: z.infer<typeof SemanticScholarPaper>;
	autocompletePapers: z.infer<typeof AutocompleteOutputSchema>;
	getPaperAuthors: z.infer<typeof PaginatedAuthorsOutputSchema>;
	getPaperCitations: z.infer<typeof PaginatedCitationsOutputSchema>;
	getPaperReferences: z.infer<typeof PaginatedReferencesOutputSchema>;
	searchAuthors: z.infer<typeof PaginatedAuthorsOutputSchema>;
	getAuthor: z.infer<typeof SemanticScholarAuthor>;
	getAuthorPapers: z.infer<typeof PaginatedPapersOutputSchema>;
	getAuthorsBatch: z.infer<typeof AuthorsBatchOutputSchema>;
	getPaperRecommendations: z.infer<
		typeof SemanticScholarRecommendationResponse
	>;
	getRecommendationsForPaper: z.infer<
		typeof SemanticScholarRecommendationResponse
	>;
	listDatasetReleases: z.infer<typeof DatasetReleasesOutputSchema>;
	getDatasetRelease: z.infer<typeof SemanticScholarDatasetRelease>;
	getDataset: z.infer<typeof SemanticScholarDataset>;
	getDatasetDiffs: z.infer<typeof DatasetDiffsOutputSchema>;
	searchTextSnippets: z.infer<typeof SnippetSearchOutputSchema>;
};

export const SemanticScholarEndpointInputSchemas = {
	getPaper: GetPaperInputSchema,
	getPapersBatch: GetPapersBatchInputSchema,
	searchPapers: SearchPapersInputSchema,
	paperRelevanceSearch: SearchPapersInputSchema,
	searchBulkPapers: SearchBulkPapersInputSchema,
	paperTitleSearch: PaperTitleSearchInputSchema,
	autocompletePapers: AutocompleteInputSchema,
	getPaperAuthors: PaperChildInputSchema,
	getPaperCitations: PaperChildInputSchema,
	getPaperReferences: PaperChildInputSchema,
	searchAuthors: SearchAuthorsInputSchema,
	getAuthor: GetAuthorInputSchema,
	getAuthorPapers: GetAuthorPapersInputSchema,
	getAuthorsBatch: GetAuthorsBatchInputSchema,
	getPaperRecommendations: GetPaperRecommendationsInputSchema,
	getRecommendationsForPaper: GetRecommendationsForPaperInputSchema,
	listDatasetReleases: EmptyInputSchema,
	getDatasetRelease: GetDatasetReleaseInputSchema,
	getDataset: GetDatasetInputSchema,
	getDatasetDiffs: GetDatasetDiffsInputSchema,
	searchTextSnippets: SearchTextSnippetsInputSchema,
} as const;

export const SemanticScholarEndpointOutputSchemas = {
	getPaper: SemanticScholarPaper,
	getPapersBatch: PapersBatchOutputSchema,
	searchPapers: PaginatedPapersOutputSchema,
	paperRelevanceSearch: PaginatedPapersOutputSchema,
	searchBulkPapers: PaginatedPapersOutputSchema,
	paperTitleSearch: SemanticScholarPaper,
	autocompletePapers: AutocompleteOutputSchema,
	getPaperAuthors: PaginatedAuthorsOutputSchema,
	getPaperCitations: PaginatedCitationsOutputSchema,
	getPaperReferences: PaginatedReferencesOutputSchema,
	searchAuthors: PaginatedAuthorsOutputSchema,
	getAuthor: SemanticScholarAuthor,
	getAuthorPapers: PaginatedPapersOutputSchema,
	getAuthorsBatch: AuthorsBatchOutputSchema,
	getPaperRecommendations: SemanticScholarRecommendationResponse,
	getRecommendationsForPaper: SemanticScholarRecommendationResponse,
	listDatasetReleases: DatasetReleasesOutputSchema,
	getDatasetRelease: SemanticScholarDatasetRelease,
	getDataset: SemanticScholarDataset,
	getDatasetDiffs: DatasetDiffsOutputSchema,
	searchTextSnippets: SnippetSearchOutputSchema,
} as const;
