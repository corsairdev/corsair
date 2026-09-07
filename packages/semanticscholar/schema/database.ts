import { z } from 'zod';

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();
const SN = z.union([z.string(), z.number()]).nullable().optional();

const ExternalIds = z.record(z.string(), z.unknown()).nullable().optional();

const OpenAccessPdf = z
	.object({
		url: S,
		status: S,
		license: S,
		disclaimer: S,
	})
	.loose()
	.nullable()
	.optional();

const Tldr = z
	.object({
		model: S,
		text: S,
	})
	.loose()
	.nullable()
	.optional();

const Embedding = z
	.object({
		model: S,
		vector: z.array(z.number()).nullable().optional(),
	})
	.loose()
	.nullable()
	.optional();

export const SemanticScholarAuthorSummary = z
	.object({
		authorId: S,
		name: S,
	})
	.loose();
export type SemanticScholarAuthorSummary = z.infer<
	typeof SemanticScholarAuthorSummary
>;

export const SemanticScholarPaper = z
	.object({
		paperId: S,
		corpusId: SN,
		externalIds: ExternalIds,
		url: S,
		title: S,
		abstract: S,
		venue: S,
		publicationVenue: z.object({}).loose().nullable().optional(),
		year: N,
		referenceCount: N,
		citationCount: N,
		influentialCitationCount: N,
		isOpenAccess: B,
		openAccessPdf: OpenAccessPdf,
		fieldsOfStudy: z.array(z.string()).nullable().optional(),
		s2FieldsOfStudy: z.array(z.object({}).loose()).nullable().optional(),
		publicationTypes: z.array(z.string()).nullable().optional(),
		publicationDate: S,
		journal: z.object({}).loose().nullable().optional(),
		authors: z.array(SemanticScholarAuthorSummary).nullable().optional(),
		citations: z.array(z.object({}).loose()).nullable().optional(),
		references: z.array(z.object({}).loose()).nullable().optional(),
		embedding: Embedding,
		tldr: Tldr,
	})
	.loose();
export type SemanticScholarPaper = z.infer<typeof SemanticScholarPaper>;

export const SemanticScholarAuthor = z
	.object({
		authorId: S,
		externalIds: ExternalIds,
		url: S,
		name: S,
		affiliations: z.array(z.string()).nullable().optional(),
		homepage: S,
		paperCount: N,
		citationCount: N,
		hIndex: N,
		papers: z.array(SemanticScholarPaper).nullable().optional(),
	})
	.loose();
export type SemanticScholarAuthor = z.infer<typeof SemanticScholarAuthor>;

export const SemanticScholarCitation = z
	.object({
		contexts: z.array(z.string()).nullable().optional(),
		intents: z.array(z.string()).nullable().optional(),
		isInfluential: B,
		citingPaper: SemanticScholarPaper.nullable().optional(),
	})
	.loose();
export type SemanticScholarCitation = z.infer<typeof SemanticScholarCitation>;

export const SemanticScholarReference = z
	.object({
		contexts: z.array(z.string()).nullable().optional(),
		intents: z.array(z.string()).nullable().optional(),
		isInfluential: B,
		citedPaper: SemanticScholarPaper.nullable().optional(),
	})
	.loose();
export type SemanticScholarReference = z.infer<typeof SemanticScholarReference>;

export const SemanticScholarAutocompleteMatch = z
	.object({
		id: z.string(),
		title: z.string(),
		authorsYear: S,
	})
	.loose();
export type SemanticScholarAutocompleteMatch = z.infer<
	typeof SemanticScholarAutocompleteMatch
>;

export const SemanticScholarRecommendationResponse = z
	.object({
		recommendedPapers: z.array(SemanticScholarPaper),
	})
	.loose();
export type SemanticScholarRecommendationResponse = z.infer<
	typeof SemanticScholarRecommendationResponse
>;

export const SemanticScholarDatasetRelease = z
	.object({
		release_id: S,
		releaseId: S,
		datasets: z.array(z.object({}).loose()).nullable().optional(),
	})
	.loose();
export type SemanticScholarDatasetRelease = z.infer<
	typeof SemanticScholarDatasetRelease
>;

export const SemanticScholarDataset = z
	.object({
		name: S,
		description: S,
		README: S,
		files: z.array(z.string()).optional(),
	})
	.loose();
export type SemanticScholarDataset = z.infer<typeof SemanticScholarDataset>;

export const SemanticScholarDatasetDiff = z
	.object({
		fromRelease: S,
		toRelease: S,
		updateFiles: z.array(z.string()).nullable().optional(),
		deleteFiles: z.array(z.string()).nullable().optional(),
	})
	.loose();
export type SemanticScholarDatasetDiff = z.infer<
	typeof SemanticScholarDatasetDiff
>;

export const SemanticScholarSnippet = z
	.object({
		score: z.number(),
		paper: z
			.object({
				corpusId: SN,
				title: S,
				authors: z.array(SemanticScholarAuthorSummary).nullable().optional(),
				openAccessInfo: z.object({}).loose().nullable().optional(),
			})
			.loose(),
		snippet: z.object({}).loose(),
	})
	.loose();
export type SemanticScholarSnippet = z.infer<typeof SemanticScholarSnippet>;
