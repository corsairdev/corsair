import { z } from 'zod';

// Inputs use Rosette's own parameter names. Outputs are `.loose()` and the
// documented optionals nullish, so a field Rosette adds or omits cannot fail a
// call that has already happened. Requests follow the official Python binding at
// https://github.com/rosette-api/python (whose `DocumentParameters` defines the
// request); responses follow the Java binding's model classes
// (https://github.com/rosette-api/java) and were checked against live responses
// from `analytics.babelstreet.com` on 11-12.
//
// Almost every analysis shares one request shape: a `content` string (or a
// `contentUri` for the server to fetch), an optional `language`, and an optional
// `profileId`. The two endpoints that differ are `nameSimilarity` (`name1` and
// `name2`) and `nameTranslation` (`name` and `targetLanguage`), and they are
// modelled separately rather than forced into the shared shape.

/**
 * A JSON value. Used where a field's shape is open-ended server detail, such as a
 * name translation's `extendedInformation`, so it is described as JSON rather than
 * `unknown`, which would reach the docs as `any`.
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

function requireOneSource(
	value: { content?: string; contentUri?: string },
	ctx: z.RefinementCtx,
): void {
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
}

const documentSchema = z.object(DocumentShape).superRefine(requireOneSource);

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
			.describe(
				'A greeting such as "Babel Street Analytics Server at your service".',
			),
		time: z.number().nullish().describe('Server time in epoch milliseconds.'),
	})
	.loose();

export type PingResponse = z.infer<typeof PingResponseSchema>;

const InfoResponseSchema = z
	.object({
		name: z.string().nullish(),
		version: z.string().nullish(),
		buildNumber: z.string().nullish(),
		buildTime: z.string().nullish().describe('Such as 20260922013523.'),
		licenseExpiration: z
			.string()
			.nullish()
			.describe("When the key's license ends, where the server reports it."),
	})
	.loose();

export type InfoResponse = z.infer<typeof InfoResponseSchema>;

// ── language ──────────────────────────────────────────────────────────────

/**
 * The candidate languages, most likely first, each with a `confidence` fraction.
 * There is no separate top-level answer: the first detection is the result.
 */
const LanguageDetectionSchema = z
	.object({
		language: z.string().nullish(),
		confidence: z.number().nullish(),
	})
	.loose();

const LanguageResponseSchema = z
	.object({
		languageDetections: z
			.array(LanguageDetectionSchema)
			.nullish()
			.describe('Every candidate, most likely first.'),
		regionalDetections: z
			.array(LanguageDetectionSchema)
			.nullish()
			.describe('Regional variants, when the server returns them.'),
	})
	.loose();

export type LanguageResponse = z.infer<typeof LanguageResponseSchema>;

// ── entities ──────────────────────────────────────────────────────────────

/** The start and end of one mention, as character offsets into the text. */
const MentionOffsetsSchema = z
	.object({
		startOffset: z.number().nullish(),
		endOffset: z.number().nullish(),
	})
	.loose();

/** A label with its confidence, for the document or for one entity. */
const SentimentLabelSchema = z
	.object({
		label: z.string().nullish().describe('pos, neg or neu.'),
		confidence: z.number().nullish(),
	})
	.loose();

/**
 * One extracted entity.
 *
 * `type` is the entity type (PERSON, LOCATION, ORGANIZATION, …), `mention` the
 * surface form and `count` how many times it appears. `entityId` groups mentions
 * of the same thing: a `Q…` ID is a Wikidata link, a `T…` ID is local to the text.
 */
const EntityFields = {
	type: z
		.string()
		.nullish()
		.describe('Such as PERSON, LOCATION or ORGANIZATION.'),
	mention: z.string().nullish(),
	normalized: z.string().nullish(),
	count: z.number().nullish(),
	mentionOffsets: z
		.array(MentionOffsetsSchema)
		.nullish()
		.describe('Each occurrence, as start and end offsets.'),
	entityId: z
		.string()
		.nullish()
		.describe(
			'Groups mentions of the same entity; Q-prefixed IDs are Wikidata items.',
		),
	confidence: z.number().nullish(),
	linkingConfidence: z
		.number()
		.nullish()
		.describe('Confidence in the Wikidata link, when there is one.'),
	salience: z.number().nullish(),
	dbpediaTypes: z.array(z.string()).nullish(),
	permId: z.string().nullish(),
} as const;

const EntitySchema = z.object(EntityFields).loose();

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
 * Document- and entity-level sentiment: each is a `pos`/`neg`/`neu` label with a
 * confidence. An entity's sentiment is nested under `sentiment`.
 */
const SentimentResponseSchema = z
	.object({
		document: SentimentLabelSchema.nullish(),
		entities: z
			.array(
				z
					.object({
						...EntityFields,
						sentiment: SentimentLabelSchema.nullish(),
					})
					.loose(),
			)
			.nullish()
			.describe('Sentiment per entity, when the analysis returned any.'),
	})
	.loose();

export type SentimentResponse = z.infer<typeof SentimentResponseSchema>;

// ── tokens, sentences and morphology ──────────────────────────────────────

/** Tokens only; part-of-speech tags and lemmas come from `morphology`. */
const TokensResponseSchema = z
	.object({
		tokens: z
			.array(z.string())
			.nullish()
			.describe('The text split into tokens.'),
	})
	.loose();

export type TokensResponse = z.infer<typeof TokensResponseSchema>;

const SentencesResponseSchema = z
	.object({
		sentences: z
			.array(z.string())
			.nullish()
			.describe('Each sentence as text, with its trailing whitespace.'),
	})
	.loose();

export type SentencesResponse = z.infer<typeof SentencesResponseSchema>;

/**
 * Per-token arrays in the same order as `tokens`. `compoundComponents` and
 * `hanReadings` hold one entry per token, null where the token has no parts or no
 * reading.
 */
const MorphologyResponseSchema = z
	.object({
		tokens: z.array(z.string()).nullish(),
		lemmas: z.array(z.string()).nullish(),
		posTags: z.array(z.string()).nullish(),
		compoundComponents: z
			.array(z.array(z.string()).nullable())
			.nullish()
			.describe('The parts of each compound token, null for a non-compound.'),
		hanReadings: z
			.array(z.array(z.string()).nullable())
			.nullish()
			.describe('Readings of each Han token, null for other tokens.'),
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
 * Topic extraction. `keyphrases` are phrases taken from the text and `concepts`
 * the broader themes (with a Wikidata `conceptId`); both carry a salience rather
 * than a probability.
 */
const KeyphraseSchema = z
	.object({
		phrase: z.string().nullish(),
		salience: z.number().nullish(),
	})
	.loose();

const TopicsResponseSchema = z
	.object({
		keyphrases: z.array(KeyphraseSchema).nullish(),
		concepts: z
			.array(
				z
					.object({
						phrase: z.string().nullish(),
						salience: z.number().nullish(),
						conceptId: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export type TopicsResponse = z.infer<typeof TopicsResponseSchema>;

const RelationshipsInputSchema = documentSchema;

export type RelationshipsInput = z.infer<typeof RelationshipsInputSchema>;

/**
 * A relationship: a predicate between `arg1` and `arg2` (and sometimes `arg3`),
 * each a string with an optional entity ID, plus any adjuncts.
 */
const RelationshipsResponseSchema = z
	.object({
		relationships: z
			.array(
				z
					.object({
						predicate: z.string().nullish(),
						predicateId: z.string().nullish(),
						arg1: z.string().nullish(),
						arg1Id: z.string().nullish(),
						arg2: z.string().nullish(),
						arg2Id: z.string().nullish(),
						arg3: z.string().nullish(),
						arg3Id: z.string().nullish(),
						adjuncts: z.array(z.string()).nullish(),
						locatives: z.array(z.string()).nullish(),
						temporals: z.array(z.string()).nullish(),
						modalities: z.array(z.string()).nullish(),
						confidence: z.number().nullish(),
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

/** A text embedding: one vector for the whole document (300 numbers live). */
const VectorResponseSchema = z
	.object({
		documentEmbedding: z
			.array(z.number())
			.nullish()
			.describe('The embedding vector for the whole text.'),
		tokens: z.array(z.string()).nullish(),
		tokenEmbeddings: z
			.array(z.array(z.number()))
			.nullish()
			.describe('A vector per token, when per-token output was requested.'),
	})
	.loose();

export type VectorResponse = z.infer<typeof VectorResponseSchema>;

/**
 * Similar terms need the languages to answer in: the API reads them from
 * `options.resultLanguages` and refuses the call without at least one.
 */
const SimilarTermsInputSchema = z
	.object({
		...DocumentShape,
		content: DocumentShape.content.describe(
			'The term to find neighbours for. Mutually exclusive with contentUri.',
		),
		resultLanguages: z
			.array(LanguageSchema)
			.min(1)
			.describe(
				'The languages to return similar terms in, such as ["eng", "spa"]. Required by the API.',
			),
	})
	.superRefine(requireOneSource);

export type SimilarTermsInput = z.infer<typeof SimilarTermsInputSchema>;

/** A neighbouring term and how close it sits. */
const SimilarTermSchema = z
	.object({
		term: z.string().nullish(),
		similarity: z.number().nullish(),
	})
	.loose();

const SimilarTermsResponseSchema = z
	.object({
		similarTerms: z
			.record(z.string(), z.array(SimilarTermSchema))
			.nullish()
			.describe('Similar terms keyed by result language, closest first.'),
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
		parameters: z
			.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
			.optional()
			.describe(
				'Scoring overrides by name, such as { deletionScore: "0.0" }. An unknown parameter name gets a 500 from the API.',
			),
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
	targetScheme: z
		.string()
		.optional()
		.describe(
			'The transliteration scheme for the result, such as IC or BGN; an unknown scheme gets a 400.',
		),
});

export type NameTranslationInput = z.infer<typeof NameTranslationInputSchema>;

const NameTranslationResponseSchema = z
	.object({
		translation: z.string().nullish(),
		confidence: z.number().nullish(),
		targetLanguage: z.string().nullish(),
		targetScript: z.string().nullish(),
		targetScheme: z.string().nullish(),
		sourceScript: z.string().nullish(),
		sourceLanguageOfOrigin: z.string().nullish(),
		sourceLanguageOfUse: z.string().nullish(),
		extendedInformation: z
			.record(z.string(), JsonValueSchema)
			.nullish()
			.describe('Extra server details, such as processedByBabel.'),
	})
	.loose();

export type NameTranslationResponse = z.infer<
	typeof NameTranslationResponseSchema
>;

// ── transliteration ───────────────────────────────────────────────────────

/**
 * The API takes only the document fields here: a `targetScript` is refused with a
 * 400 (live, 11-12), and the direction follows from `language` and the input's
 * script. `contentUri` works in place of `content` (live, 11-12).
 */
const TransliterationInputSchema = z
	.object({
		content: DocumentShape.content.describe(
			'The text to transliterate. Mutually exclusive with contentUri.',
		),
		contentUri: DocumentShape.contentUri,
		language: LanguageSchema.optional().describe(
			'The language of the text, such as ara; it sets which native script Latin text is moved into, or out of.',
		),
	})
	.superRefine(requireOneSource)
	.describe(
		'Transcribes text between Latin and the native script of its language, so the result reads as the same words in the other script rather than a translation.',
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
	similarTerms: SimilarTermsInput;
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
	similarTerms: SimilarTermsInputSchema,
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
