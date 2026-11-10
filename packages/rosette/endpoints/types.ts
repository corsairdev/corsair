import { z } from 'zod';

// Inputs use Rosette's own parameter names. Outputs are `.loose()` and the
// documented optionals nullish, so a field Rosette adds or omits cannot fail a
// call that has already happened. Shapes come from the official Python binding at
// https://github.com/rosette-api/python (whose `DocumentParameters` defines the
// request) and the live `analytics.babelstreet.com` host.
//
// Almost every analysis shares one request shape: a `content` string (or a
// `contentUri` for the server to fetch), an optional `language`, and an optional
// `profileId`. The two endpoints that differ are `nameSimilarity` (`name1` and
// `name2`) and `nameTranslation` (`name` and `targetLanguage`), and they are
// modelled separately rather than forced into the shared shape.

/**
 * A JSON value. Used where a field's shape belongs to the analysis rather than the
 * transport - semantic vectors, entity mentions, topic scores - so it is described
 * as JSON rather than `unknown`, which would reach the docs as `any`.
 */
export type RosetteJsonValue =
	| string
	| number
	| boolean
	| null
	| RosetteJsonValue[]
	| { [key: string]: RosetteJsonValue };

const JsonValueSchema: z.ZodType<RosetteJsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(JsonValueSchema),
		z.record(z.string(), JsonValueSchema),
	]),
);

const JsonObjectSchema = z.record(z.string(), JsonValueSchema);

/** ISO 639 language code, two- or three-letter. */
const LanguageSchema = z
	.string()
	.describe(
		'An ISO 639 language code, two or three letters, such as eng or spa.',
	);

/**
 * The shared request: exactly one of `content` or `contentUri`, plus optional
 * language and profile.
 *
 * Sending both is rejected before the request, because Rosette documents them as
 * alternatives and its own error for the pair is less specific than this one.
 */
const DocumentShape = {
	content: z
		.string()
		.min(1)
		.optional()
		.describe('The text to analyse. Mutually exclusive with contentUri.'),
	contentUri: z
		.string()
		.min(1)
		.optional()
		.describe(
			'A URL for Rosette to fetch, over http, https, ftp or ftps. Mutually exclusive with content.',
		),
	language: LanguageSchema.optional(),
	profileId: z
		.string()
		.optional()
		.describe('A saved language profile to apply.'),
} as const;

const documentSchema = z.object(DocumentShape).superRefine((value, ctx) => {
	if (value.content === undefined && value.contentUri === undefined) {
		ctx.addIssue({
			code: 'custom',
			path: ['content'],
			message:
				'Give content or contentUri; Rosette has nothing to analyse otherwise.',
		});
	}
	if (value.content !== undefined && value.contentUri !== undefined) {
		ctx.addIssue({
			code: 'custom',
			path: ['contentUri'],
			message:
				'Give either content or contentUri, not both; Rosette treats them as alternatives.',
		});
	}
});

const DocumentInputSchema = documentSchema;

export type RosetteDocumentInput = z.infer<typeof DocumentInputSchema>;

/** The empty input a ping or info call takes. */
const EmptyInputSchema = z.object({});

// ── ping and info ─────────────────────────────────────────────────────────

const PingResponseSchema = z
	.object({
		message: z
			.string()
			.nullish()
			.describe('"ping" when the host is reachable.'),
	})
	.loose();

export type PingResponse = z.infer<typeof PingResponseSchema>;

const InfoResponseSchema = z
	.object({
		name: z.string().nullish(),
		version: z.string().nullish(),
		buildNumber: z.string().nullish(),
		buildDate: z.string().nullish(),
	})
	.loose();

export type InfoResponse = z.infer<typeof InfoResponseSchema>;

// ── language ──────────────────────────────────────────────────────────────

/**
 * The detected language. `confidence` is a fraction, and the `languageDetections`
 * list ranks the alternatives.
 */
const LanguageResponseSchema = z
	.object({
		language: z.string().nullish().describe('The most likely language.'),
		languageDetections: z
			.array(
				z
					.object({
						language: z.string().nullish(),
						confidence: z.number().nullish(),
					})
					.loose(),
			)
			.nullish()
			.describe('Every candidate, most likely first.'),
	})
	.loose();

export type LanguageResponse = z.infer<typeof LanguageResponseSchema>;

// ── entities ──────────────────────────────────────────────────────────────

/**
 * One extracted entity.
 *
 * `type` is the entity type (PERSON, LOCATION, ORGANIZATION, …), `mention` the
 * surface form, and `count`/`confidence` the aggregate over the text. The
 * `entityId` groups mentions of the same thing.
 */
const EntitySchema = z
	.object({
		type: z
			.string()
			.nullish()
			.describe('Such as PERSON, LOCATION or ORGANIZATION.'),
		mention: z.string().nullish(),
		normalized: z.string().nullish(),
		count: z.number().nullish(),
		confidence: z.number().nullish(),
		entityId: z
			.string()
			.nullish()
			.describe('Groups mentions that refer to the same entity.'),
		mentions: z
			.array(z.record(z.string(), JsonValueSchema))
			.nullish()
			.describe('Each occurrence, with its offset and length.'),
	})
	.loose();

export type RosetteEntity = z.infer<typeof EntitySchema>;

const EntitiesResponseSchema = z
	.object({
		entities: z
			.array(EntitySchema)
			.nullish()
			.describe('Entities, most confident first.'),
	})
	.loose();

export type EntitiesResponse = z.infer<typeof EntitiesResponseSchema>;

// ── sentiment ─────────────────────────────────────────────────────────────

/**
 * Document- and entity-level sentiment.
 *
 * The document label is `pos`/`neg`/`neu` and its score runs from -1 to 1, so a
 * neutral label can still carry a non-zero score.
 */
const SentimentLabelSchema = z.string().nullish().describe('pos, neg or neu.');

const SentimentResponseSchema = z
	.object({
		document: z
			.object({
				label: SentimentLabelSchema,
				score: z.number().nullish().describe('From -1 to 1.'),
				confidence: z.number().nullish(),
			})
			.loose()
			.nullish(),
		entities: z
			.array(
				z
					.object({
						type: z.string().nullish(),
						mention: z.string().nullish(),
						normalized: z.string().nullish(),
						count: z.number().nullish(),
						label: SentimentLabelSchema,
						score: z.number().nullish(),
						confidence: z.number().nullish(),
						entityId: z.string().nullish(),
					})
					.loose(),
			)
			.nullish()
			.describe('Sentiment per entity, when the analysis returned any.'),
	})
	.loose();

export type SentimentResponse = z.infer<typeof SentimentResponseSchema>;

// ── tokens, sentences and morphology ──────────────────────────────────────

const TokensResponseSchema = z
	.object({
		tokens: z
			.array(z.string())
			.nullish()
			.describe('The text split into tokens.'),
		posTags: z
			.array(z.string())
			.nullish()
			.describe('A part-of-speech tag per token, in the same order.'),
		lemmas: z
			.array(z.string())
			.nullish()
			.describe('A lemma per token, in the same order.'),
	})
	.loose();

export type TokensResponse = z.infer<typeof TokensResponseSchema>;

const SentencesResponseSchema = z
	.object({
		sentenceDetections: z
			.array(
				z
					.object({
						start: z.number().nullish(),
						end: z.number().nullish(),
						text: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export type SentencesResponse = z.infer<typeof SentencesResponseSchema>;

const MorphologyResponseSchema = z
	.object({
		tokens: z.array(z.string()).nullish(),
		lemmas: z.array(z.string()).nullish(),
		posTags: z.array(z.string()).nullish(),
		compoundComponents: z
			.array(z.record(z.string(), JsonValueSchema))
			.nullish(),
	})
	.loose();

export type MorphologyResponse = z.infer<typeof MorphologyResponseSchema>;

// ── categories, topics and relationships ──────────────────────────────────

/** One category from a topic taxonomy, with its confidence. */
const CategorySchema = z
	.object({
		label: z.string().nullish(),
		score: z.number().nullish(),
		confidence: z.number().nullish(),
	})
	.loose();

const CategoriesResponseSchema = z
	.object({
		categories: z.array(CategorySchema).nullish(),
	})
	.loose();

export type CategoriesResponse = z.infer<typeof CategoriesResponseSchema>;

const TopicsInputSchema = documentSchema;

export type TopicsInput = z.infer<typeof TopicsInputSchema>;

/**
 * Topic extraction. `concepts` are the wider themes and `topics` the specific
 * labels, and both carry a salience rather than a probability.
 */
const TopicsResponseSchema = z
	.object({
		concepts: z.array(CategorySchema).nullish(),
		topics: z.array(CategorySchema).nullish(),
	})
	.loose();

export type TopicsResponse = z.infer<typeof TopicsResponseSchema>;

const RelationshipsInputSchema = documentSchema;

export type RelationshipsInput = z.infer<typeof RelationshipsInputSchema>;

/** A subject-verb-object triple, with the confidence of the predicate. */
const RelationshipsResponseSchema = z
	.object({
		relationships: z
			.array(
				z
					.object({
						predicate: z.string().nullish(),
						predicateId: z.string().nullish(),
						confidence: z.number().nullish(),
						subject: z.record(z.string(), JsonValueSchema).nullish(),
						object: z.record(z.string(), JsonValueSchema).nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export type RelationshipsResponse = z.infer<typeof RelationshipsResponseSchema>;

// ── semantics ─────────────────────────────────────────────────────────────

const VectorInputSchema = documentSchema;

export type VectorInput = z.infer<typeof VectorInputSchema>;

/** A text embedding: a fixed-length vector plus its dimensions. */
const VectorResponseSchema = z
	.object({
		embedding: z.array(z.number()).nullish().describe('The embedding vector.'),
		dimensions: z.number().nullish(),
	})
	.loose();

export type VectorResponse = z.infer<typeof VectorResponseSchema>;

/** A neighbouring term and how close it sits. */
const SimilarTermSchema = z
	.object({
		term: z.string().nullish(),
		similarity: z.number().nullish(),
		embedding: z.array(z.number()).nullish(),
	})
	.loose();

const SimilarTermsResponseSchema = z
	.object({
		terms: z.array(SimilarTermSchema).nullish(),
	})
	.loose();

export type SimilarTermsResponse = z.infer<typeof SimilarTermsResponseSchema>;

// ── name similarity and translation ───────────────────────────────────────

/** One name to compare: its text plus optional language, script and entity type. */
const NameSchema = z.object({
	text: z.string().min(1),
	language: z.string().optional().describe('ISO 639 three-letter code.'),
	script: z.string().optional().describe('ISO 15924 code.'),
	entityType: z.enum(['PERSON', 'LOCATION', 'ORGANIZATION']).optional(),
});

const NameSimilarityInputSchema = z
	.object({
		name1: NameSchema,
		name2: NameSchema,
	})
	.describe(
		'Compares two names and returns a similarity score; the order of the two matters to the score.',
	);

export type NameSimilarityInput = z.infer<typeof NameSimilarityInputSchema>;

/** The similarity score, from 0 (unrelated) to 1 (the same name). */
const NameSimilarityResponseSchema = z
	.object({
		score: z.number().nullish(),
	})
	.loose();

export type NameSimilarityResponse = z.infer<
	typeof NameSimilarityResponseSchema
>;

const NameTranslationInputSchema = z.object({
	name: z.string().min(1).describe('The name to translate.'),
	targetLanguage: z
		.string()
		.min(1)
		.describe('The ISO 639 language to translate into.'),
	entityType: z
		.enum(['PERSON', 'LOCATION', 'ORGANIZATION'])
		.optional()
		.describe('Defaults to PERSON.'),
	sourceLanguageOfOrigin: z.string().optional(),
	sourceLanguageOfUse: z.string().optional(),
	sourceScript: z.string().optional().describe('ISO 15924 code.'),
	targetScript: z.string().optional().describe('ISO 15924 code.'),
});

export type NameTranslationInput = z.infer<typeof NameTranslationInputSchema>;

const NameTranslationResponseSchema = z
	.object({
		translation: z.string().nullish(),
	})
	.loose();

export type NameTranslationResponse = z.infer<
	typeof NameTranslationResponseSchema
>;

// ── transliteration ───────────────────────────────────────────────────────

const TransliterationInputSchema = z
	.object({
		content: z.string().min(1).describe('The text to transliterate.'),
		language: LanguageSchema.optional(),
		targetScript: z
			.string()
			.optional()
			.describe('The ISO 15924 script to transliterate into.'),
	})
	.describe(
		'Transcribes text between scripts, so the result reads as the same words in another script rather than a translation.',
	);

export type TransliterationInput = z.infer<typeof TransliterationInputSchema>;

const TransliterationResponseSchema = z
	.object({
		transliteration: z.string().nullish(),
	})
	.loose();

export type TransliterationResponse = z.infer<
	typeof TransliterationResponseSchema
>;

// ── the maps ──────────────────────────────────────────────────────────────

export type RosetteEndpointInputs = {
	ping: z.infer<typeof EmptyInputSchema>;
	info: z.infer<typeof EmptyInputSchema>;
	language: RosetteDocumentInput;
	entities: RosetteDocumentInput;
	sentiment: RosetteDocumentInput;
	tokens: RosetteDocumentInput;
	sentences: RosetteDocumentInput;
	morphology: RosetteDocumentInput;
	categories: RosetteDocumentInput;
	topics: TopicsInput;
	relationships: RelationshipsInput;
	similarTerms: RosetteDocumentInput;
	textEmbedding: VectorInput;
	nameSimilarity: NameSimilarityInput;
	nameTranslation: NameTranslationInput;
	transliteration: TransliterationInput;
};

export type RosetteEndpointOutputs = {
	ping: PingResponse;
	info: InfoResponse;
	language: LanguageResponse;
	entities: EntitiesResponse;
	sentiment: SentimentResponse;
	tokens: TokensResponse;
	sentences: SentencesResponse;
	morphology: MorphologyResponse;
	categories: CategoriesResponse;
	topics: TopicsResponse;
	relationships: RelationshipsResponse;
	similarTerms: SimilarTermsResponse;
	textEmbedding: VectorResponse;
	nameSimilarity: NameSimilarityResponse;
	nameTranslation: NameTranslationResponse;
	transliteration: TransliterationResponse;
};

export const RosetteEndpointInputSchemas = {
	ping: EmptyInputSchema,
	info: EmptyInputSchema,
	language: DocumentInputSchema,
	entities: DocumentInputSchema,
	sentiment: DocumentInputSchema,
	tokens: DocumentInputSchema,
	sentences: DocumentInputSchema,
	morphology: DocumentInputSchema,
	categories: DocumentInputSchema,
	topics: TopicsInputSchema,
	relationships: RelationshipsInputSchema,
	similarTerms: DocumentInputSchema,
	textEmbedding: VectorInputSchema,
	nameSimilarity: NameSimilarityInputSchema,
	nameTranslation: NameTranslationInputSchema,
	transliteration: TransliterationInputSchema,
} as const;

export const RosetteEndpointOutputSchemas = {
	ping: PingResponseSchema,
	info: InfoResponseSchema,
	language: LanguageResponseSchema,
	entities: EntitiesResponseSchema,
	sentiment: SentimentResponseSchema,
	tokens: TokensResponseSchema,
	sentences: SentencesResponseSchema,
	morphology: MorphologyResponseSchema,
	categories: CategoriesResponseSchema,
	topics: TopicsResponseSchema,
	relationships: RelationshipsResponseSchema,
	similarTerms: SimilarTermsResponseSchema,
	textEmbedding: VectorResponseSchema,
	nameSimilarity: NameSimilarityResponseSchema,
	nameTranslation: NameTranslationResponseSchema,
	transliteration: TransliterationResponseSchema,
} as const;
