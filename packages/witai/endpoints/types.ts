import { z } from 'zod';

// ─── Shared sub-schemas ───────────────────────────────────────────────────────

export const WitAiRoleSchema = z
	.object({
		id: z.string().optional(),
		name: z.string(),
	})
	.catchall(z.unknown());

export const WitAiKeywordSchema = z
	.object({
		keyword: z.string(),
		synonyms: z.array(z.string()).optional(),
	})
	.catchall(z.unknown());

export const WitAiEntityRefSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		role: z.string().optional(),
		start: z.number().optional(),
		end: z.number().optional(),
		body: z.string().optional(),
		confidence: z.number().optional(),
		entities: z.array(z.unknown()).optional(),
		value: z.unknown().optional(),
		type: z.string().optional(),
	})
	.catchall(z.unknown());

export const WitAiTraitValueSchema = z
	.object({
		id: z.string().optional(),
		value: z.string(),
	})
	.catchall(z.unknown());

export const WitAiTraitRefSchema = z
	.object({
		id: z.string().optional(),
		value: z.string(),
		confidence: z.number().optional(),
	})
	.catchall(z.unknown());

export const WitAiIntentRefSchema = z
	.object({
		id: z.string().optional(),
		name: z.string(),
		confidence: z.number().optional(),
	})
	.catchall(z.unknown());

export const WitAiAppSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		lang: z.string().optional(),
		private: z.union([z.boolean(), z.string()]).optional(),
		timezone: z.string().optional(),
		desc: z.string().optional(),
		will_train_at: z.string().nullable().optional(),
		last_trained_at: z.string().nullable().optional(),
		last_training_duration_secs: z.number().optional(),
		training_status: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.catchall(z.unknown());

export const WitAiEntitySchema = z
	.object({
		id: z.string(),
		name: z.string(),
		roles: z.array(WitAiRoleSchema).optional(),
		lookups: z.array(z.string()).optional(),
		keywords: z.array(WitAiKeywordSchema).optional(),
	})
	.catchall(z.unknown());

export const WitAiIntentSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		entities: z.array(WitAiEntityRefSchema).optional(),
	})
	.catchall(z.unknown());

export const WitAiTraitSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		values: z.array(WitAiTraitValueSchema).optional(),
	})
	.catchall(z.unknown());

export const WitAiUtteranceSchema = z
	.object({
		id: z.string().optional(),
		text: z.string(),
		intent: z
			.object({ id: z.string().optional(), name: z.string() })
			.nullable()
			.optional(),
		entities: z.array(WitAiEntityRefSchema).optional(),
		traits: z.array(WitAiTraitRefSchema).optional(),
	})
	.catchall(z.unknown());

export const WitAiVoiceStyleSchema = z
	.object({
		name: z.string(),
		speed: z.array(z.string()).optional(),
		pitch: z.array(z.string()).optional(),
	})
	.catchall(z.unknown());

export const WitAiVoiceSchema = z
	.object({
		name: z.string(),
		locale: z.string().optional(),
		gender: z.string().optional(),
		styles: z.array(WitAiVoiceStyleSchema).optional(),
		supported_features: z.array(z.string()).optional(),
	})
	.catchall(z.unknown());

export const WitAiMessageResponseSchema = z
	.object({
		text: z.string(),
		intents: z.array(WitAiIntentRefSchema).optional(),
		entities: z.record(z.string(), z.array(WitAiEntityRefSchema)).optional(),
		traits: z.record(z.string(), z.array(WitAiTraitRefSchema)).optional(),
	})
	.catchall(z.unknown());

export const WitAiTagSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		desc: z.string().nullable().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.catchall(z.unknown());

export const WitAiSuccessSchema = z
	.object({
		sent: z.boolean().optional(),
		n: z.number().optional(),
		deleted: z.union([z.string(), z.number()]).optional(),
		success: z.boolean().optional(),
	})
	.catchall(z.unknown());

export const WitAiDetectedLocaleSchema = z
	.object({
		locale: z.string(),
		confidence: z.number().optional(),
	})
	.catchall(z.unknown());

// ─── Input schemas ────────────────────────────────────────────────────────────

// Apps
const ListAppsInputSchema = z.object({
	limit: z
		.number()
		.int()
		.min(1)
		.max(10000)
		.optional()
		.describe('Max apps to return (default 100)'),
	offset: z.number().int().optional().describe('Pagination offset'),
});

const GetAppInputSchema = z.object({
	app_id: z.string().describe('The Wit.ai app ID'),
});

const CreateAppInputSchema = z.object({
	name: z.string().describe('Name of the app'),
	lang: z.string().describe('Language code, e.g. "en"'),
	private: z
		.union([z.boolean(), z.string()])
		.optional()
		.describe('Whether the app is private'),
	timezone: z
		.string()
		.optional()
		.describe('Timezone, e.g. "America/Los_Angeles"'),
	desc: z.string().optional().describe('Description of the app'),
});

const UpdateAppInputSchema = z.object({
	app_id: z.string().describe('The Wit.ai app ID to update'),
	name: z.string().optional().describe('New name'),
	lang: z.string().optional().describe('Language code'),
	private: z
		.union([z.boolean(), z.string()])
		.optional()
		.describe('Whether the app is private'),
	timezone: z.string().optional().describe('Timezone'),
	desc: z.string().optional().describe('Description'),
});

const DeleteAppInputSchema = z.object({
	app_id: z.string().describe('The Wit.ai app ID to delete'),
});

const ExportAppInputSchema = z.object({
	app_id: z.string().describe('The Wit.ai app ID to export'),
});

const ListAppTagsInputSchema = z.object({
	app_id: z.string().describe('The Wit.ai app ID'),
});

// Message / Language
const GetMessageInputSchema = z.object({
	q: z.string().describe('Text to analyze for intents, entities, and traits'),
	n: z
		.number()
		.int()
		.optional()
		.describe('Max number of n-best intents/traits to return'),
	tag: z.string().optional().describe('App version tag to use'),
	context: z
		.string()
		.optional()
		.describe('JSON context object (location, reference_time, etc.)'),
});

const DetectLanguageInputSchema = z.object({
	q: z.string().describe('Text whose language should be detected'),
	n: z.number().int().optional().describe('Number of locales to return'),
});

// Intents
const ListIntentsInputSchema = z.object({});

const GetIntentInputSchema = z.object({
	intent: z.string().describe('Intent name or ID'),
});

const CreateIntentInputSchema = z.object({
	name: z.string().describe('Name of the new intent'),
});

const DeleteIntentInputSchema = z.object({
	intent: z.string().describe('Intent name to delete'),
});

// Entities
const ListEntitiesInputSchema = z.object({});

const GetEntityInputSchema = z.object({
	entity: z.string().describe('Entity name or ID'),
});

const CreateEntityInputSchema = z.object({
	name: z.string().describe('Name of the new entity'),
	roles: z
		.array(z.string())
		.optional()
		.describe('Optional role names for the entity'),
	lookups: z
		.array(z.string())
		.optional()
		.describe('Optional lookup strategies (e.g. keywords, free-text)'),
});

const DeleteEntityInputSchema = z.object({
	entity: z.string().describe('Entity name to delete'),
});

const AddEntityKeywordInputSchema = z.object({
	entity: z.string().describe('Entity name'),
	keyword: z.string().describe('Keyword to add'),
	synonyms: z
		.array(z.string())
		.optional()
		.describe('Optional synonyms for the keyword'),
});

const DeleteEntityKeywordInputSchema = z.object({
	entity: z.string().describe('Entity name'),
	keyword: z.string().describe('Keyword to delete'),
});

const AddKeywordSynonymInputSchema = z.object({
	entity: z.string().describe('Entity name'),
	keyword: z.string().describe('Keyword to add synonym to'),
	synonym: z.string().describe('Synonym to add'),
});

const DeleteKeywordSynonymInputSchema = z.object({
	entity: z.string().describe('Entity name'),
	keyword: z.string().describe('Keyword name'),
	synonym: z.string().describe('Synonym to delete'),
});

const DeleteEntityRoleInputSchema = z.object({
	entity: z.string().describe('Entity name'),
	role: z.string().describe('Role name to delete'),
});

// Traits
const ListTraitsInputSchema = z.object({});

const GetTraitInputSchema = z.object({
	trait: z.string().describe('Trait name or ID'),
});

const CreateTraitInputSchema = z.object({
	name: z.string().describe('Name of the new trait'),
	values: z
		.array(z.string())
		.optional()
		.describe('Initial values for the trait'),
});

const DeleteTraitInputSchema = z.object({
	trait: z.string().describe('Trait name to delete'),
});

const AddTraitValueInputSchema = z.object({
	trait: z.string().describe('Trait name'),
	value: z.string().describe('Value to add'),
});

// Utterances
const ListUtterancesInputSchema = z.object({
	limit: z.number().int().optional().describe('Max utterances to return'),
	offset: z.number().int().optional().describe('Pagination offset'),
	intent_id: z.string().optional().describe('Filter by intent ID'),
});

const CreateUtterancesInputSchema = z.object({
	utterances: z
		.array(
			z.object({
				text: z.string().describe('The utterance text'),
				intent: z
					.string()
					.optional()
					.describe('Intent name for this utterance'),
				entities: z
					.array(
						z.object({
							entity: z.string(),
							start: z.number().int(),
							end: z.number().int(),
							body: z.string(),
							entities: z.array(z.unknown()).optional(),
						}),
					)
					.optional(),
				traits: z
					.array(
						z.object({
							trait: z.string(),
							value: z.string(),
						}),
					)
					.optional(),
			}),
		)
		.describe('Utterances to add (rate limit: 200 samples/min)'),
});

const DeleteUtterancesInputSchema = z.object({
	texts: z.array(z.string()).describe('Utterance texts to delete'),
});

// Voices
const ListVoicesInputSchema = z.object({});

const GetVoiceInputSchema = z.object({
	voice: z.string().describe('Voice name to retrieve details for'),
});

// ─── Output schemas ───────────────────────────────────────────────────────────

const ListAppsOutputSchema = z.array(WitAiAppSchema);
const GetAppOutputSchema = WitAiAppSchema;
const CreateAppOutputSchema = z
	.object({
		app_id: z.string(),
		access_token: z.string().optional(),
	})
	.catchall(z.unknown());
const UpdateAppOutputSchema = WitAiSuccessSchema;
const DeleteAppOutputSchema = z
	.object({
		app_id: z.string().optional(),
		success: z.boolean().optional(),
	})
	.catchall(z.unknown());
const ExportAppOutputSchema = z
	.object({ uri: z.string().optional() })
	.catchall(z.unknown());
const ListAppTagsOutputSchema = z.array(WitAiTagSchema);

const GetMessageOutputSchema = WitAiMessageResponseSchema;
const DetectLanguageOutputSchema = z
	.object({
		detected_locales: z.array(WitAiDetectedLocaleSchema),
	})
	.catchall(z.unknown());

const ListIntentsOutputSchema = z.array(WitAiIntentSchema);
const GetIntentOutputSchema = WitAiIntentSchema;
const CreateIntentOutputSchema = WitAiIntentSchema;
const DeleteIntentOutputSchema = WitAiSuccessSchema;

const ListEntitiesOutputSchema = z.array(WitAiEntitySchema);
const GetEntityOutputSchema = WitAiEntitySchema;
const CreateEntityOutputSchema = WitAiEntitySchema;
const DeleteEntityOutputSchema = WitAiSuccessSchema;
const AddEntityKeywordOutputSchema = WitAiEntitySchema;
const DeleteEntityKeywordOutputSchema =
	WitAiSuccessSchema.or(WitAiEntitySchema);
const AddKeywordSynonymOutputSchema = WitAiEntitySchema;
const DeleteKeywordSynonymOutputSchema =
	WitAiSuccessSchema.or(WitAiEntitySchema);
const DeleteEntityRoleOutputSchema = WitAiSuccessSchema.or(WitAiEntitySchema);

const ListTraitsOutputSchema = z.array(WitAiTraitSchema);
const GetTraitOutputSchema = WitAiTraitSchema;
const CreateTraitOutputSchema = WitAiTraitSchema;
const DeleteTraitOutputSchema = WitAiSuccessSchema;
const AddTraitValueOutputSchema = WitAiTraitSchema;

const ListUtterancesOutputSchema = z.array(WitAiUtteranceSchema);
const CreateUtterancesOutputSchema = WitAiSuccessSchema;
const DeleteUtterancesOutputSchema = WitAiSuccessSchema;

const ListVoicesOutputSchema = z.record(z.string(), z.array(WitAiVoiceSchema));
const GetVoiceOutputSchema = WitAiVoiceSchema;

// ─── Collected input/output types ────────────────────────────────────────────

export type WitAiEndpointInputs = {
	appsListApps: z.infer<typeof ListAppsInputSchema>;
	appsGetApp: z.infer<typeof GetAppInputSchema>;
	appsCreateApp: z.infer<typeof CreateAppInputSchema>;
	appsUpdateApp: z.infer<typeof UpdateAppInputSchema>;
	appsDeleteApp: z.infer<typeof DeleteAppInputSchema>;
	appsExportApp: z.infer<typeof ExportAppInputSchema>;
	appsListTags: z.infer<typeof ListAppTagsInputSchema>;
	messageGetMessage: z.infer<typeof GetMessageInputSchema>;
	messageDetectLanguage: z.infer<typeof DetectLanguageInputSchema>;
	intentsListIntents: z.infer<typeof ListIntentsInputSchema>;
	intentsGetIntent: z.infer<typeof GetIntentInputSchema>;
	intentsCreateIntent: z.infer<typeof CreateIntentInputSchema>;
	intentsDeleteIntent: z.infer<typeof DeleteIntentInputSchema>;
	entitiesListEntities: z.infer<typeof ListEntitiesInputSchema>;
	entitiesGetEntity: z.infer<typeof GetEntityInputSchema>;
	entitiesCreateEntity: z.infer<typeof CreateEntityInputSchema>;
	entitiesDeleteEntity: z.infer<typeof DeleteEntityInputSchema>;
	entitiesAddKeyword: z.infer<typeof AddEntityKeywordInputSchema>;
	entitiesDeleteKeyword: z.infer<typeof DeleteEntityKeywordInputSchema>;
	entitiesAddSynonym: z.infer<typeof AddKeywordSynonymInputSchema>;
	entitiesDeleteSynonym: z.infer<typeof DeleteKeywordSynonymInputSchema>;
	entitiesDeleteRole: z.infer<typeof DeleteEntityRoleInputSchema>;
	traitsListTraits: z.infer<typeof ListTraitsInputSchema>;
	traitsGetTrait: z.infer<typeof GetTraitInputSchema>;
	traitsCreateTrait: z.infer<typeof CreateTraitInputSchema>;
	traitsDeleteTrait: z.infer<typeof DeleteTraitInputSchema>;
	traitsAddValue: z.infer<typeof AddTraitValueInputSchema>;
	utterancesListUtterances: z.infer<typeof ListUtterancesInputSchema>;
	utterancesCreateUtterances: z.infer<typeof CreateUtterancesInputSchema>;
	utterancesDeleteUtterances: z.infer<typeof DeleteUtterancesInputSchema>;
	voicesListVoices: z.infer<typeof ListVoicesInputSchema>;
	voicesGetVoice: z.infer<typeof GetVoiceInputSchema>;
};

export type WitAiEndpointOutputs = {
	appsListApps: z.infer<typeof ListAppsOutputSchema>;
	appsGetApp: z.infer<typeof GetAppOutputSchema>;
	appsCreateApp: z.infer<typeof CreateAppOutputSchema>;
	appsUpdateApp: z.infer<typeof UpdateAppOutputSchema>;
	appsDeleteApp: z.infer<typeof DeleteAppOutputSchema>;
	appsExportApp: z.infer<typeof ExportAppOutputSchema>;
	appsListTags: z.infer<typeof ListAppTagsOutputSchema>;
	messageGetMessage: z.infer<typeof GetMessageOutputSchema>;
	messageDetectLanguage: z.infer<typeof DetectLanguageOutputSchema>;
	intentsListIntents: z.infer<typeof ListIntentsOutputSchema>;
	intentsGetIntent: z.infer<typeof GetIntentOutputSchema>;
	intentsCreateIntent: z.infer<typeof CreateIntentOutputSchema>;
	intentsDeleteIntent: z.infer<typeof DeleteIntentOutputSchema>;
	entitiesListEntities: z.infer<typeof ListEntitiesOutputSchema>;
	entitiesGetEntity: z.infer<typeof GetEntityOutputSchema>;
	entitiesCreateEntity: z.infer<typeof CreateEntityOutputSchema>;
	entitiesDeleteEntity: z.infer<typeof DeleteEntityOutputSchema>;
	entitiesAddKeyword: z.infer<typeof AddEntityKeywordOutputSchema>;
	entitiesDeleteKeyword: z.infer<typeof DeleteEntityKeywordOutputSchema>;
	entitiesAddSynonym: z.infer<typeof AddKeywordSynonymOutputSchema>;
	entitiesDeleteSynonym: z.infer<typeof DeleteKeywordSynonymOutputSchema>;
	entitiesDeleteRole: z.infer<typeof DeleteEntityRoleOutputSchema>;
	traitsListTraits: z.infer<typeof ListTraitsOutputSchema>;
	traitsGetTrait: z.infer<typeof GetTraitOutputSchema>;
	traitsCreateTrait: z.infer<typeof CreateTraitOutputSchema>;
	traitsDeleteTrait: z.infer<typeof DeleteTraitOutputSchema>;
	traitsAddValue: z.infer<typeof AddTraitValueOutputSchema>;
	utterancesListUtterances: z.infer<typeof ListUtterancesOutputSchema>;
	utterancesCreateUtterances: z.infer<typeof CreateUtterancesOutputSchema>;
	utterancesDeleteUtterances: z.infer<typeof DeleteUtterancesOutputSchema>;
	voicesListVoices: z.infer<typeof ListVoicesOutputSchema>;
	voicesGetVoice: z.infer<typeof GetVoiceOutputSchema>;
};

export const WitAiEndpointInputSchemas = {
	appsListApps: ListAppsInputSchema,
	appsGetApp: GetAppInputSchema,
	appsCreateApp: CreateAppInputSchema,
	appsUpdateApp: UpdateAppInputSchema,
	appsDeleteApp: DeleteAppInputSchema,
	appsExportApp: ExportAppInputSchema,
	appsListTags: ListAppTagsInputSchema,
	messageGetMessage: GetMessageInputSchema,
	messageDetectLanguage: DetectLanguageInputSchema,
	intentsListIntents: ListIntentsInputSchema,
	intentsGetIntent: GetIntentInputSchema,
	intentsCreateIntent: CreateIntentInputSchema,
	intentsDeleteIntent: DeleteIntentInputSchema,
	entitiesListEntities: ListEntitiesInputSchema,
	entitiesGetEntity: GetEntityInputSchema,
	entitiesCreateEntity: CreateEntityInputSchema,
	entitiesDeleteEntity: DeleteEntityInputSchema,
	entitiesAddKeyword: AddEntityKeywordInputSchema,
	entitiesDeleteKeyword: DeleteEntityKeywordInputSchema,
	entitiesAddSynonym: AddKeywordSynonymInputSchema,
	entitiesDeleteSynonym: DeleteKeywordSynonymInputSchema,
	entitiesDeleteRole: DeleteEntityRoleInputSchema,
	traitsListTraits: ListTraitsInputSchema,
	traitsGetTrait: GetTraitInputSchema,
	traitsCreateTrait: CreateTraitInputSchema,
	traitsDeleteTrait: DeleteTraitInputSchema,
	traitsAddValue: AddTraitValueInputSchema,
	utterancesListUtterances: ListUtterancesInputSchema,
	utterancesCreateUtterances: CreateUtterancesInputSchema,
	utterancesDeleteUtterances: DeleteUtterancesInputSchema,
	voicesListVoices: ListVoicesInputSchema,
	voicesGetVoice: GetVoiceInputSchema,
} as const;

export const WitAiEndpointOutputSchemas = {
	appsListApps: ListAppsOutputSchema,
	appsGetApp: GetAppOutputSchema,
	appsCreateApp: CreateAppOutputSchema,
	appsUpdateApp: UpdateAppOutputSchema,
	appsDeleteApp: DeleteAppOutputSchema,
	appsExportApp: ExportAppOutputSchema,
	appsListTags: ListAppTagsOutputSchema,
	messageGetMessage: GetMessageOutputSchema,
	messageDetectLanguage: DetectLanguageOutputSchema,
	intentsListIntents: ListIntentsOutputSchema,
	intentsGetIntent: GetIntentOutputSchema,
	intentsCreateIntent: CreateIntentOutputSchema,
	intentsDeleteIntent: DeleteIntentOutputSchema,
	entitiesListEntities: ListEntitiesOutputSchema,
	entitiesGetEntity: GetEntityOutputSchema,
	entitiesCreateEntity: CreateEntityOutputSchema,
	entitiesDeleteEntity: DeleteEntityOutputSchema,
	entitiesAddKeyword: AddEntityKeywordOutputSchema,
	entitiesDeleteKeyword: DeleteEntityKeywordOutputSchema,
	entitiesAddSynonym: AddKeywordSynonymOutputSchema,
	entitiesDeleteSynonym: DeleteKeywordSynonymOutputSchema,
	entitiesDeleteRole: DeleteEntityRoleOutputSchema,
	traitsListTraits: ListTraitsOutputSchema,
	traitsGetTrait: GetTraitOutputSchema,
	traitsCreateTrait: CreateTraitOutputSchema,
	traitsDeleteTrait: DeleteTraitOutputSchema,
	traitsAddValue: AddTraitValueOutputSchema,
	utterancesListUtterances: ListUtterancesOutputSchema,
	utterancesCreateUtterances: CreateUtterancesOutputSchema,
	utterancesDeleteUtterances: DeleteUtterancesOutputSchema,
	voicesListVoices: ListVoicesOutputSchema,
	voicesGetVoice: GetVoiceOutputSchema,
} as const;
