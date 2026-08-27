import { z } from 'zod';

const EXTRACTORS = [
	'entities',
	'topics',
	'words',
	'phrases',
	'dependency-trees',
	'relations',
	'entailments',
	'senses',
	'spelling',
] as const;

export const ExtractorSchema = z.enum(EXTRACTORS);

const CleanupModeSchema = z.enum(['raw', 'stripTags', 'cleanHTML']);
const MatchTypeSchema = z.enum(['token', 'stem']);

export const EntitySchema = z
	.object({
		id: z.number().optional(),
		entityId: z.string().nullable().optional(),
		entityEnglishId: z.string().nullable().optional(),
		matchedText: z.string().optional(),
		matchingTokens: z.array(z.number()).optional(),
		startingPos: z.number().optional(),
		endingPos: z.number().optional(),
		confidenceScore: z.number().optional(),
		relevanceScore: z.number().optional(),
		type: z.array(z.string()).optional(),
		freebaseTypes: z.array(z.string()).optional(),
		freebaseId: z.string().nullable().optional(),
		wikiLink: z.string().nullable().optional(),
		wikidataId: z.string().nullable().optional(),
		wikidataTypes: z.array(z.string()).optional(),
		customEntityId: z.string().optional(),
		sourceId: z.string().optional(),
		data: z.unknown().optional(),
		crunchbaseId: z.string().optional(),
		lei: z.string().optional(),
		figi: z.string().optional(),
		permid: z.string().optional(),
		unit: z.string().optional(),
	})
	.loose();

export const TopicSchema = z
	.object({
		id: z.number().optional(),
		label: z.string().optional(),
		score: z.number().optional(),
		wikiLink: z.string().nullable().optional(),
		wikidataId: z.string().nullable().optional(),
	})
	.loose();

export const ScoredCategorySchema = z
	.object({
		id: z.number().optional(),
		categoryId: z.string().optional(),
		label: z.string().optional(),
		score: z.number().optional(),
		classifierId: z.string().optional(),
	})
	.loose();

export const WordSchema = z
	.object({
		position: z.number().optional(),
		startingPos: z.number().optional(),
		endingPos: z.number().optional(),
		token: z.string().optional(),
		stem: z.string().optional(),
		lemma: z.string().optional(),
		partOfSpeech: z.string().optional(),
		parentPosition: z.number().nullable().optional(),
		relationToParent: z.string().nullable().optional(),
		senses: z.array(z.unknown()).optional(),
		spellingSuggestions: z.array(z.unknown()).optional(),
	})
	.loose();

export const SentenceSchema = z
	.object({
		position: z.number().optional(),
		words: z.array(WordSchema).optional(),
	})
	.loose();

export const NounPhraseSchema = z
	.object({
		wordPositions: z.array(z.number()).optional(),
	})
	.loose();

export const RelationParamSchema = z
	.object({
		wordPositions: z.array(z.number()).optional(),
		relation: z.string().optional(),
	})
	.loose();

export const RelationSchema = z
	.object({
		wordPositions: z.array(z.number()).optional(),
		params: z.array(RelationParamSchema).optional(),
	})
	.loose();

export const PropertySchema = z
	.object({
		wordPositions: z.array(z.number()).optional(),
		propertyPositions: z.array(z.number()).optional(),
	})
	.loose();

export const EntailmentSchema = z
	.object({
		wordPositions: z.array(z.number()).optional(),
		score: z.number().optional(),
		priorScore: z.number().optional(),
		contextScore: z.number().optional(),
		entailedTree: z.unknown().optional(),
	})
	.loose();

export const AnalysisPayloadSchema = z
	.object({
		language: z.string().optional(),
		languageIsReliable: z.boolean().optional(),
		cleanedText: z.string().optional(),
		rawText: z.string().optional(),
		customAnnotationOutput: z.unknown().optional(),
		matchingRules: z.array(z.string()).optional(),
		entities: z.array(EntitySchema).optional(),
		topics: z.array(TopicSchema).optional(),
		coarseTopics: z.array(TopicSchema).optional(),
		categories: z.array(ScoredCategorySchema).optional(),
		sentences: z.array(SentenceSchema).optional(),
		nounPhrases: z.array(NounPhraseSchema).optional(),
		relations: z.array(RelationSchema).optional(),
		properties: z.array(PropertySchema).optional(),
		entailments: z.array(EntailmentSchema).optional(),
	})
	.loose();

export const AnalysisResponseSchema = z
	.object({
		ok: z.boolean().optional(),
		time: z.union([z.number(), z.string()]).optional(),
		error: z.string().optional(),
		message: z.string().optional(),
		response: AnalysisPayloadSchema.optional(),
	})
	.loose();

const documentSource = {
	text: z.string().min(1).optional(),
	url: z.string().url().optional(),
};

function requireTextOrUrl<T extends z.ZodType<{ text?: string; url?: string }>>(
	schema: T,
) {
	return schema.refine((v) => Boolean(v.text) !== Boolean(v.url), {
		message: 'Provide exactly one of text or url',
	});
}

const analysisOptions = {
	...documentSource,
	cleanupMode: CleanupModeSchema.optional(),
	cleanupReturnCleaned: z.boolean().optional(),
	cleanupReturnRaw: z.boolean().optional(),
	cleanupUseMetadata: z.boolean().optional(),
	cleanupCleanHtmlPrecision: z
		.union([z.literal(1), z.literal(2), z.literal(3)])
		.optional(),
	cleanupCleanHtmlUseTitle: z.boolean().optional(),
	downloadRunJavascript: z.boolean().optional(),
	downloadUserAgent: z.string().optional(),
	entitiesAllowOverlap: z.boolean().optional(),
	entitiesDictionaries: z.array(z.string().min(1)).optional(),
	entitiesFilterDbpediaTypes: z.array(z.string().min(1)).optional(),
	entitiesFilterFreebaseTypes: z.array(z.string().min(1)).optional(),
	entitiesIncludeAddressPlaces: z.boolean().optional(),
	languageOverride: z.string().min(2).optional(),
	rules: z.string().optional(),
	classifiers: z.array(z.string().min(1)).optional(),
	classifierMaxCategories: z.number().int().positive().optional(),
};

export const AnalyzeContentInputSchema = requireTextOrUrl(
	z.object({
		...analysisOptions,
		extractors: z.array(ExtractorSchema).min(1),
	}),
);

export const ClassifyTextInputSchema = requireTextOrUrl(
	z.object({
		...analysisOptions,
		extractors: z.array(ExtractorSchema).optional(),
		classifiers: z.array(z.string().min(1)).min(1),
	}),
);

export const ExtractEntitiesInputSchema = requireTextOrUrl(
	z.object({
		...analysisOptions,
		extractors: z.array(ExtractorSchema).optional(),
		minRelevanceScore: z.number().min(0).max(1).optional(),
		minConfidenceScore: z.number().min(0).optional(),
	}),
);

export type AnalysisResponse = z.output<typeof AnalysisResponseSchema>;

export const AnalyzeContentOutputSchema = AnalysisResponseSchema;
export const ClassifyTextOutputSchema = AnalysisResponseSchema;
export const ExtractEntitiesOutputSchema = AnalysisResponseSchema;

export const AccountSchema = z
	.object({
		plan: z.string().optional(),
		concurrentRequestLimit: z.number().optional(),
		concurrentRequestsUsed: z.number().optional(),
		planDailyRequestsIncluded: z.number().optional(),
		requestsUsedToday: z.number().optional(),
	})
	.loose();

export const GetAccountInputSchema = z.object({});
export const GetAccountOutputSchema = z
	.object({
		ok: z.boolean().optional(),
		time: z.union([z.number(), z.string()]).optional(),
		error: z.string().optional(),
		message: z.string().optional(),
		response: AccountSchema.optional(),
	})
	.loose();

export const DictionarySchema = z
	.object({
		id: z.string().optional(),
		matchType: MatchTypeSchema.optional(),
		caseInsensitive: z.boolean().optional(),
		language: z.string().optional(),
	})
	.loose();

export const DictionaryEntrySchema = z
	.object({
		id: z.string().optional(),
		text: z.string().optional(),
		data: z.record(z.string(), z.array(z.string())).optional(),
	})
	.loose();

export const CreateDictionaryInputSchema = z.object({
	id: z.string().min(1),
	matchType: MatchTypeSchema.optional(),
	caseInsensitive: z.boolean().optional(),
	language: z.string().optional(),
});
export const CreateDictionaryOutputSchema = z
	.object({
		ok: z.boolean().optional(),
		time: z.union([z.number(), z.string()]).optional(),
		error: z.string().optional(),
		message: z.string().optional(),
		response: DictionarySchema.optional(),
	})
	.loose();

export const ListDictionariesInputSchema = z.object({});
export const ListDictionariesOutputSchema = z
	.object({
		ok: z.boolean().optional(),
		time: z.union([z.number(), z.string()]).optional(),
		error: z.string().optional(),
		message: z.string().optional(),
		response: z
			.union([
				z.array(DictionarySchema),
				z
					.object({
						dictionaries: z.array(DictionarySchema),
					})
					.loose(),
			])
			.optional(),
		dictionaries: z.array(DictionarySchema).optional(),
	})
	.loose();

export const GetDictionaryInputSchema = z.object({
	id: z.string().min(1),
});
export const GetDictionaryOutputSchema = CreateDictionaryOutputSchema;

export const DeleteDictionaryInputSchema = z.object({
	id: z.string().min(1),
});
export const DeleteDictionaryOutputSchema = z
	.object({
		ok: z.boolean().optional(),
		time: z.union([z.number(), z.string()]).optional(),
		error: z.string().optional(),
		message: z.string().optional(),
	})
	.loose();

export const ListDictionaryEntriesInputSchema = z.object({
	id: z.string().min(1),
	limit: z.number().int().positive().optional(),
	offset: z.number().int().min(0).optional(),
});
export const ListDictionaryEntriesOutputSchema = z
	.object({
		ok: z.boolean().optional(),
		time: z.union([z.number(), z.string()]).optional(),
		error: z.string().optional(),
		message: z.string().optional(),
		response: z
			.union([
				z.array(DictionaryEntrySchema),
				z
					.object({
						entries: z.array(DictionaryEntrySchema),
					})
					.loose(),
			])
			.optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
		total: z.number().optional(),
	})
	.loose();

export const AddDictionaryEntriesInputSchema = z.object({
	id: z.string().min(1),
	entries: z
		.array(
			z.object({
				id: z.string().optional(),
				text: z.string().min(1),
				data: z.record(z.string(), z.array(z.string())).optional(),
			}),
		)
		.min(1),
});
export const AddDictionaryEntriesOutputSchema = DeleteDictionaryOutputSchema;

export const GetDictionaryEntryInputSchema = z.object({
	id: z.string().min(1),
	entryId: z.string().min(1),
});
export const GetDictionaryEntryOutputSchema = z
	.object({
		ok: z.boolean().optional(),
		time: z.union([z.number(), z.string()]).optional(),
		error: z.string().optional(),
		message: z.string().optional(),
		response: DictionaryEntrySchema.optional(),
	})
	.loose();

export const DeleteDictionaryEntryInputSchema = GetDictionaryEntryInputSchema;
export const DeleteDictionaryEntryOutputSchema = DeleteDictionaryOutputSchema;

export const ClassifierCategoryInputSchema = z.object({
	categoryId: z.string().min(1),
	label: z.string().optional(),
	query: z.string().min(1),
});

export const PutClassifierInputSchema = z.object({
	id: z.string().min(1),
	categories: z.array(ClassifierCategoryInputSchema).min(1),
});
export const PutClassifierOutputSchema = DeleteDictionaryOutputSchema;

export const DeleteClassifierInputSchema = z.object({
	id: z.string().min(1),
});
export const DeleteClassifierOutputSchema = DeleteDictionaryOutputSchema;

export const ListClassifierCategoriesInputSchema = z.object({
	id: z.string().min(1),
	limit: z.number().int().positive().optional(),
	offset: z.number().int().min(0).optional(),
});
export const ClassifierCategorySchema = z
	.object({
		categoryId: z.string().optional(),
		label: z.string().optional(),
		query: z.string().optional(),
	})
	.loose();

export const ListClassifierCategoriesOutputSchema = z
	.object({
		ok: z.boolean().optional(),
		time: z.union([z.number(), z.string()]).optional(),
		error: z.string().optional(),
		message: z.string().optional(),
		response: z
			.union([
				z.array(ClassifierCategorySchema),
				z
					.object({
						categories: z.array(ClassifierCategorySchema),
					})
					.loose(),
			])
			.optional(),
		limit: z.number().optional(),
		offset: z.number().optional(),
		total: z.number().optional(),
	})
	.loose();

export const GetClassifierCategoryInputSchema = z.object({
	id: z.string().min(1),
	categoryId: z.string().min(1),
});
export const GetClassifierCategoryOutputSchema = z
	.object({
		ok: z.boolean().optional(),
		time: z.union([z.number(), z.string()]).optional(),
		error: z.string().optional(),
		message: z.string().optional(),
		response: ClassifierCategorySchema.optional(),
	})
	.loose();

export const DeleteClassifierCategoryInputSchema =
	GetClassifierCategoryInputSchema;
export const DeleteClassifierCategoryOutputSchema =
	DeleteDictionaryOutputSchema;

export const TextrazorEndpointInputSchemas = {
	analyzeContent: AnalyzeContentInputSchema,
	classifyText: ClassifyTextInputSchema,
	extractEntities: ExtractEntitiesInputSchema,
	getAccount: GetAccountInputSchema,
	createDictionary: CreateDictionaryInputSchema,
	listDictionaries: ListDictionariesInputSchema,
	getDictionary: GetDictionaryInputSchema,
	deleteDictionary: DeleteDictionaryInputSchema,
	listDictionaryEntries: ListDictionaryEntriesInputSchema,
	addDictionaryEntries: AddDictionaryEntriesInputSchema,
	getDictionaryEntry: GetDictionaryEntryInputSchema,
	deleteDictionaryEntry: DeleteDictionaryEntryInputSchema,
	putClassifier: PutClassifierInputSchema,
	deleteClassifier: DeleteClassifierInputSchema,
	listClassifierCategories: ListClassifierCategoriesInputSchema,
	getClassifierCategory: GetClassifierCategoryInputSchema,
	deleteClassifierCategory: DeleteClassifierCategoryInputSchema,
};

export const TextrazorEndpointOutputSchemas = {
	analyzeContent: AnalyzeContentOutputSchema,
	classifyText: ClassifyTextOutputSchema,
	extractEntities: ExtractEntitiesOutputSchema,
	getAccount: GetAccountOutputSchema,
	createDictionary: CreateDictionaryOutputSchema,
	listDictionaries: ListDictionariesOutputSchema,
	getDictionary: GetDictionaryOutputSchema,
	deleteDictionary: DeleteDictionaryOutputSchema,
	listDictionaryEntries: ListDictionaryEntriesOutputSchema,
	addDictionaryEntries: AddDictionaryEntriesOutputSchema,
	getDictionaryEntry: GetDictionaryEntryOutputSchema,
	deleteDictionaryEntry: DeleteDictionaryEntryOutputSchema,
	putClassifier: PutClassifierOutputSchema,
	deleteClassifier: DeleteClassifierOutputSchema,
	listClassifierCategories: ListClassifierCategoriesOutputSchema,
	getClassifierCategory: GetClassifierCategoryOutputSchema,
	deleteClassifierCategory: DeleteClassifierCategoryOutputSchema,
};

export type TextrazorEndpointInputs = {
	[K in keyof typeof TextrazorEndpointInputSchemas]: z.input<
		(typeof TextrazorEndpointInputSchemas)[K]
	>;
};
export type TextrazorEndpointOutputs = {
	[K in keyof typeof TextrazorEndpointOutputSchemas]: z.output<
		(typeof TextrazorEndpointOutputSchemas)[K]
	>;
};
