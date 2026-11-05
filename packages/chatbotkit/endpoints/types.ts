import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Common Types & Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const IdResponseSchema = z.object({
	id: z.string().describe('Unique identifier of the resource'),
});
export type IdResponse = z.infer<typeof IdResponseSchema>;

export const ListQueryInputSchema = z.object({
	cursor: z.string().optional().describe('Cursor for pagination'),
	limit: z
		.number()
		.int()
		.positive()
		.max(100)
		.optional()
		.describe('Maximum number of items to return'),
	order: z
		.enum(['asc', 'desc'])
		.optional()
		.describe('Sort order by creation time'),
});
export type ListQueryInput = z.infer<typeof ListQueryInputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// 1. Bots
// ─────────────────────────────────────────────────────────────────────────────

export const BotSchema = z.object({
	id: z.string().describe('Unique identifier of the bot'),
	alias: z.string().nullable().optional().describe('Custom alias for the bot'),
	name: z.string().describe('Descriptive name of the bot'),
	description: z
		.string()
		.nullable()
		.optional()
		.describe('Brief description of the bot purpose'),
	blueprintId: z
		.string()
		.nullable()
		.optional()
		.describe('Associated blueprint ID'),
	datasetId: z
		.string()
		.nullable()
		.optional()
		.describe('Associated dataset ID for knowledge retrieval'),
	skillsetId: z
		.string()
		.nullable()
		.optional()
		.describe('Associated skillset ID for tools and capabilities'),
	backstory: z
		.string()
		.nullable()
		.optional()
		.describe(
			'Natural language instructions defining bot personality and behavior',
		),
	model: z
		.string()
		.nullable()
		.optional()
		.describe('AI model configured for the bot'),
	privacy: z
		.boolean()
		.nullable()
		.optional()
		.describe('Whether PII protection and anonymization is enabled'),
	moderation: z
		.boolean()
		.nullable()
		.optional()
		.describe('Whether content safety and filtering is active'),
	visibility: z
		.string()
		.nullable()
		.optional()
		.describe('Visibility access setting (e.g. private, protected, public)'),
	meta: z
		.record(z.string(), z.unknown())
		.nullable()
		.optional()
		.describe('Custom metadata attached to the bot'),
	createdAt: z
		.number()
		.nullable()
		.optional()
		.describe('Creation timestamp in milliseconds'),
	updatedAt: z
		.number()
		.nullable()
		.optional()
		.describe('Last updated timestamp in milliseconds'),
});
export type Bot = z.infer<typeof BotSchema>;

export const BotsListInputSchema = ListQueryInputSchema;
export type BotsListInput = z.infer<typeof BotsListInputSchema>;

export const BotsListResponseSchema = z.object({
	items: z.array(BotSchema).describe('List of bots matching the query'),
	cursor: z
		.string()
		.nullable()
		.optional()
		.describe('Pagination cursor for the next page of results'),
});
export type BotsListResponse = z.infer<typeof BotsListResponseSchema>;

export const BotsGetInputSchema = z.object({
	id: z.string().describe('Unique identifier or alias of the bot to fetch'),
});
export type BotsGetInput = z.infer<typeof BotsGetInputSchema>;

export const BotsGetResponseSchema = BotSchema;
export type BotsGetResponse = z.infer<typeof BotsGetResponseSchema>;

export const BotsCreateInputSchema = z.object({
	name: z.string().describe('Name of the bot'),
	description: z.string().optional().describe('Description of the bot'),
	backstory: z
		.string()
		.optional()
		.describe('Instructions and persona for the bot'),
	model: z.string().optional().describe('AI model to use for the bot'),
	datasetId: z
		.string()
		.optional()
		.describe('ID of the dataset to connect to the bot'),
	skillsetId: z
		.string()
		.optional()
		.describe('ID of the skillset to connect to the bot'),
	blueprintId: z
		.string()
		.optional()
		.describe('ID of the blueprint template to connect'),
	privacy: z
		.boolean()
		.optional()
		.describe('Enable PII protection and anonymization'),
	moderation: z
		.boolean()
		.optional()
		.describe('Enable content safety and filtering'),
	visibility: z
		.enum(['private', 'protected', 'public'])
		.optional()
		.describe('Visibility level of the bot'),
	meta: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Custom metadata'),
});
export type BotsCreateInput = z.infer<typeof BotsCreateInputSchema>;

export const BotsCreateResponseSchema = IdResponseSchema;
export type BotsCreateResponse = z.infer<typeof BotsCreateResponseSchema>;

export const BotsUpdateInputSchema = z.object({
	id: z.string().describe('ID of the bot to update'),
	name: z.string().optional().describe('Updated name of the bot'),
	description: z.string().optional().describe('Updated description of the bot'),
	backstory: z.string().optional().describe('Updated persona instructions'),
	model: z.string().optional().describe('Updated model'),
	datasetId: z.string().nullable().optional().describe('Updated dataset ID'),
	skillsetId: z.string().nullable().optional().describe('Updated skillset ID'),
	blueprintId: z
		.string()
		.nullable()
		.optional()
		.describe('Updated blueprint ID'),
	visibility: z
		.enum(['private', 'protected', 'public'])
		.optional()
		.describe('Updated visibility'),
	meta: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Updated metadata'),
});
export type BotsUpdateInput = z.infer<typeof BotsUpdateInputSchema>;

export const BotsUpdateResponseSchema = IdResponseSchema;
export type BotsUpdateResponse = z.infer<typeof BotsUpdateResponseSchema>;

export const BotsDeleteInputSchema = z.object({
	id: z.string().describe('ID of the bot to delete'),
});
export type BotsDeleteInput = z.infer<typeof BotsDeleteInputSchema>;

export const BotsDeleteResponseSchema = IdResponseSchema;
export type BotsDeleteResponse = z.infer<typeof BotsDeleteResponseSchema>;

export const BotsUpvoteInputSchema = z.object({
	id: z.string().describe('ID of the bot to upvote'),
});
export type BotsUpvoteInput = z.infer<typeof BotsUpvoteInputSchema>;

export const BotsUpvoteResponseSchema = IdResponseSchema;
export type BotsUpvoteResponse = z.infer<typeof BotsUpvoteResponseSchema>;

export const BotsDownvoteInputSchema = z.object({
	id: z.string().describe('ID of the bot to downvote'),
});
export type BotsDownvoteInput = z.infer<typeof BotsDownvoteInputSchema>;

export const BotsDownvoteResponseSchema = IdResponseSchema;
export type BotsDownvoteResponse = z.infer<typeof BotsDownvoteResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// 2. Datasets
// ─────────────────────────────────────────────────────────────────────────────

export const DatasetSchema = z.object({
	id: z.string().describe('Unique identifier of the dataset'),
	alias: z
		.string()
		.nullable()
		.optional()
		.describe('Custom alias for the dataset'),
	name: z.string().describe('Descriptive name of the dataset'),
	description: z
		.string()
		.nullable()
		.optional()
		.describe('Brief description of dataset contents'),
	blueprintId: z
		.string()
		.nullable()
		.optional()
		.describe('Associated blueprint ID'),
	reranker: z
		.string()
		.nullable()
		.optional()
		.describe('Configured reranker model'),
	recordMaxTokens: z
		.number()
		.nullable()
		.optional()
		.describe('Maximum tokens per record'),
	searchMinScore: z
		.number()
		.nullable()
		.optional()
		.describe('Minimum score for search retrieval'),
	searchMaxRecords: z
		.number()
		.nullable()
		.optional()
		.describe('Maximum search records returned'),
	searchMaxTokens: z
		.number()
		.nullable()
		.optional()
		.describe('Maximum search tokens returned'),
	matchInstruction: z
		.string()
		.nullable()
		.optional()
		.describe('Prompt instruction on search match'),
	mismatchInstruction: z
		.string()
		.nullable()
		.optional()
		.describe('Prompt instruction on search mismatch'),
	separators: z
		.array(z.string())
		.nullable()
		.optional()
		.describe('Text chunk separators'),
	visibility: z.string().nullable().optional().describe('Visibility setting'),
	meta: z
		.record(z.string(), z.unknown())
		.nullable()
		.optional()
		.describe('Custom metadata'),
	createdAt: z
		.number()
		.nullable()
		.optional()
		.describe('Creation timestamp in milliseconds'),
	updatedAt: z
		.number()
		.nullable()
		.optional()
		.describe('Last updated timestamp in milliseconds'),
});
export type Dataset = z.infer<typeof DatasetSchema>;

export const DatasetsListInputSchema = ListQueryInputSchema;
export type DatasetsListInput = z.infer<typeof DatasetsListInputSchema>;

export const DatasetsListResponseSchema = z.object({
	items: z.array(DatasetSchema).describe('List of datasets matching the query'),
	cursor: z
		.string()
		.nullable()
		.optional()
		.describe('Pagination cursor for the next page of results'),
});
export type DatasetsListResponse = z.infer<typeof DatasetsListResponseSchema>;

export const DatasetsGetInputSchema = z.object({
	id: z.string().describe('ID of the dataset to fetch'),
});
export type DatasetsGetInput = z.infer<typeof DatasetsGetInputSchema>;

export const DatasetsGetResponseSchema = DatasetSchema;
export type DatasetsGetResponse = z.infer<typeof DatasetsGetResponseSchema>;

export const DatasetsCreateInputSchema = z.object({
	name: z.string().describe('Name of the dataset'),
	description: z.string().optional().describe('Description of the dataset'),
	blueprintId: z
		.string()
		.optional()
		.describe('ID of blueprint template to connect'),
	visibility: z
		.enum(['private', 'protected', 'public'])
		.optional()
		.describe('Visibility level'),
	meta: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Custom metadata'),
});
export type DatasetsCreateInput = z.infer<typeof DatasetsCreateInputSchema>;

export const DatasetsCreateResponseSchema = IdResponseSchema;
export type DatasetsCreateResponse = z.infer<
	typeof DatasetsCreateResponseSchema
>;

export const DatasetsUpdateInputSchema = z.object({
	id: z.string().describe('ID of the dataset to update'),
	name: z.string().optional().describe('Updated name of the dataset'),
	description: z
		.string()
		.optional()
		.describe('Updated description of the dataset'),
	blueprintId: z
		.string()
		.nullable()
		.optional()
		.describe('Updated blueprint ID'),
	visibility: z
		.enum(['private', 'protected', 'public'])
		.optional()
		.describe('Updated visibility'),
	meta: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Updated metadata'),
});
export type DatasetsUpdateInput = z.infer<typeof DatasetsUpdateInputSchema>;

export const DatasetsUpdateResponseSchema = IdResponseSchema;
export type DatasetsUpdateResponse = z.infer<
	typeof DatasetsUpdateResponseSchema
>;

export const DatasetsDeleteInputSchema = z.object({
	id: z.string().describe('ID of the dataset to delete'),
});
export type DatasetsDeleteInput = z.infer<typeof DatasetsDeleteInputSchema>;

export const DatasetsDeleteResponseSchema = IdResponseSchema;
export type DatasetsDeleteResponse = z.infer<
	typeof DatasetsDeleteResponseSchema
>;

export const DatasetSearchResultItemSchema = z.object({
	id: z.string().describe('Record identifier'),
	score: z.number().optional().describe('Relevance score'),
	text: z.string().describe('Matched text content'),
	meta: z
		.record(z.string(), z.unknown())
		.nullable()
		.optional()
		.describe('Record metadata'),
});

export const DatasetsSearchInputSchema = z.object({
	id: z.string().describe('ID of the dataset to search'),
	query: z.string().describe('Search query string'),
	limit: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Max records to return'),
});
export type DatasetsSearchInput = z.infer<typeof DatasetsSearchInputSchema>;

export const DatasetsSearchResponseSchema = z.object({
	items: z
		.array(DatasetSearchResultItemSchema)
		.describe('Array of search matches from the dataset'),
});
export type DatasetsSearchResponse = z.infer<
	typeof DatasetsSearchResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// 3. Skillsets
// ─────────────────────────────────────────────────────────────────────────────

export const SkillsetSchema = z.object({
	id: z.string().describe('Unique identifier of the skillset'),
	alias: z
		.string()
		.nullable()
		.optional()
		.describe('Custom alias for the skillset'),
	name: z.string().describe('Descriptive name of the skillset'),
	description: z
		.string()
		.nullable()
		.optional()
		.describe('Brief description of skillset capabilities'),
	blueprintId: z
		.string()
		.nullable()
		.optional()
		.describe('Associated blueprint ID'),
	visibility: z.string().nullable().optional().describe('Visibility setting'),
	state: z
		.string()
		.nullable()
		.optional()
		.describe('Operational state (e.g. enabled, disabled)'),
	meta: z
		.record(z.string(), z.unknown())
		.nullable()
		.optional()
		.describe('Custom metadata'),
	createdAt: z
		.number()
		.nullable()
		.optional()
		.describe('Creation timestamp in milliseconds'),
	updatedAt: z
		.number()
		.nullable()
		.optional()
		.describe('Last updated timestamp in milliseconds'),
});
export type Skillset = z.infer<typeof SkillsetSchema>;

export const SkillsetsListInputSchema = ListQueryInputSchema;
export type SkillsetsListInput = z.infer<typeof SkillsetsListInputSchema>;

export const SkillsetsListResponseSchema = z.object({
	items: z
		.array(SkillsetSchema)
		.describe('List of skillsets matching the query'),
	cursor: z
		.string()
		.nullable()
		.optional()
		.describe('Pagination cursor for the next page of results'),
});
export type SkillsetsListResponse = z.infer<typeof SkillsetsListResponseSchema>;

export const SkillsetsGetInputSchema = z.object({
	id: z.string().describe('ID of the skillset to fetch'),
});
export type SkillsetsGetInput = z.infer<typeof SkillsetsGetInputSchema>;

export const SkillsetsGetResponseSchema = SkillsetSchema;
export type SkillsetsGetResponse = z.infer<typeof SkillsetsGetResponseSchema>;

export const SkillsetsCreateInputSchema = z.object({
	name: z.string().describe('Name of the skillset'),
	description: z.string().optional().describe('Description of the skillset'),
	blueprintId: z.string().optional().describe('Blueprint template ID'),
	visibility: z
		.enum(['private', 'protected', 'public'])
		.optional()
		.describe('Visibility level'),
	meta: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Custom metadata'),
});
export type SkillsetsCreateInput = z.infer<typeof SkillsetsCreateInputSchema>;

export const SkillsetsCreateResponseSchema = IdResponseSchema;
export type SkillsetsCreateResponse = z.infer<
	typeof SkillsetsCreateResponseSchema
>;

export const SkillsetsUpdateInputSchema = z.object({
	id: z.string().describe('ID of the skillset to update'),
	name: z.string().optional().describe('Updated name of the skillset'),
	description: z
		.string()
		.optional()
		.describe('Updated description of the skillset'),
	visibility: z
		.enum(['private', 'protected', 'public'])
		.optional()
		.describe('Updated visibility'),
	state: z.enum(['enabled', 'disabled']).optional().describe('Updated state'),
	meta: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Updated metadata'),
});
export type SkillsetsUpdateInput = z.infer<typeof SkillsetsUpdateInputSchema>;

export const SkillsetsUpdateResponseSchema = IdResponseSchema;
export type SkillsetsUpdateResponse = z.infer<
	typeof SkillsetsUpdateResponseSchema
>;

export const SkillsetsDeleteInputSchema = z.object({
	id: z.string().describe('ID of the skillset to delete'),
});
export type SkillsetsDeleteInput = z.infer<typeof SkillsetsDeleteInputSchema>;

export const SkillsetsDeleteResponseSchema = IdResponseSchema;
export type SkillsetsDeleteResponse = z.infer<
	typeof SkillsetsDeleteResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// 4. Blueprints
// ─────────────────────────────────────────────────────────────────────────────

export const BlueprintSchema = z.object({
	id: z.string().describe('Unique identifier of the blueprint'),
	alias: z
		.string()
		.nullable()
		.optional()
		.describe('Custom alias for the blueprint'),
	name: z.string().describe('Descriptive name of the blueprint'),
	description: z
		.string()
		.nullable()
		.optional()
		.describe('Brief description of blueprint configuration'),
	config: z
		.record(z.string(), z.unknown())
		.nullable()
		.optional()
		.describe('Template configuration settings'),
	visibility: z.string().nullable().optional().describe('Visibility setting'),
	meta: z
		.record(z.string(), z.unknown())
		.nullable()
		.optional()
		.describe('Custom metadata'),
	createdAt: z
		.number()
		.nullable()
		.optional()
		.describe('Creation timestamp in milliseconds'),
	updatedAt: z
		.number()
		.nullable()
		.optional()
		.describe('Last updated timestamp in milliseconds'),
});
export type Blueprint = z.infer<typeof BlueprintSchema>;

export const BlueprintsListInputSchema = ListQueryInputSchema;
export type BlueprintsListInput = z.infer<typeof BlueprintsListInputSchema>;

export const BlueprintsListResponseSchema = z.object({
	items: z
		.array(BlueprintSchema)
		.describe('List of blueprints matching the query'),
	cursor: z
		.string()
		.nullable()
		.optional()
		.describe('Pagination cursor for the next page of results'),
});
export type BlueprintsListResponse = z.infer<
	typeof BlueprintsListResponseSchema
>;

export const BlueprintsGetInputSchema = z.object({
	id: z.string().describe('ID of the blueprint to fetch'),
});
export type BlueprintsGetInput = z.infer<typeof BlueprintsGetInputSchema>;

export const BlueprintsGetResponseSchema = BlueprintSchema;
export type BlueprintsGetResponse = z.infer<typeof BlueprintsGetResponseSchema>;

export const BlueprintsCreateInputSchema = z.object({
	name: z.string().describe('Name of the blueprint template'),
	description: z
		.string()
		.optional()
		.describe('Description of the blueprint template'),
	config: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Configuration dictionary'),
	visibility: z
		.enum(['private', 'protected', 'public'])
		.optional()
		.describe('Visibility level'),
	meta: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Custom metadata'),
});
export type BlueprintsCreateInput = z.infer<typeof BlueprintsCreateInputSchema>;

export const BlueprintsCreateResponseSchema = IdResponseSchema;
export type BlueprintsCreateResponse = z.infer<
	typeof BlueprintsCreateResponseSchema
>;

export const BlueprintsUpdateInputSchema = z.object({
	id: z.string().describe('ID of the blueprint to update'),
	name: z.string().optional().describe('Updated name'),
	description: z.string().optional().describe('Updated description'),
	config: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Updated configuration'),
	visibility: z
		.enum(['private', 'protected', 'public'])
		.optional()
		.describe('Updated visibility'),
	meta: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Updated metadata'),
});
export type BlueprintsUpdateInput = z.infer<typeof BlueprintsUpdateInputSchema>;

export const BlueprintsUpdateResponseSchema = IdResponseSchema;
export type BlueprintsUpdateResponse = z.infer<
	typeof BlueprintsUpdateResponseSchema
>;

export const BlueprintsDeleteInputSchema = z.object({
	id: z.string().describe('ID of the blueprint to delete'),
});
export type BlueprintsDeleteInput = z.infer<typeof BlueprintsDeleteInputSchema>;

export const BlueprintsDeleteResponseSchema = IdResponseSchema;
export type BlueprintsDeleteResponse = z.infer<
	typeof BlueprintsDeleteResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// 5. Secrets
// ─────────────────────────────────────────────────────────────────────────────

export const SecretSchema = z.object({
	id: z.string().describe('Unique identifier of the secret credential'),
	alias: z
		.string()
		.nullable()
		.optional()
		.describe('Custom alias for the secret'),
	name: z.string().describe('Descriptive name of the secret'),
	description: z
		.string()
		.nullable()
		.optional()
		.describe('Description of the secret or connected service'),
	blueprintId: z
		.string()
		.nullable()
		.optional()
		.describe('Associated blueprint ID'),
	kind: z
		.string()
		.nullable()
		.optional()
		.describe('Kind of secret (e.g. personal, shared)'),
	type: z
		.string()
		.nullable()
		.optional()
		.describe('Type of credential template'),
	config: z
		.record(z.string(), z.unknown())
		.nullable()
		.optional()
		.describe('Credential configuration'),
	visibility: z.string().nullable().optional().describe('Visibility setting'),
	meta: z
		.record(z.string(), z.unknown())
		.nullable()
		.optional()
		.describe('Custom metadata'),
	createdAt: z
		.number()
		.nullable()
		.optional()
		.describe('Creation timestamp in milliseconds'),
	updatedAt: z
		.number()
		.nullable()
		.optional()
		.describe('Last updated timestamp in milliseconds'),
});
export type Secret = z.infer<typeof SecretSchema>;

export const SecretsListInputSchema = ListQueryInputSchema;
export type SecretsListInput = z.infer<typeof SecretsListInputSchema>;

export const SecretsListResponseSchema = z.object({
	items: z.array(SecretSchema).describe('List of secrets matching the query'),
	cursor: z
		.string()
		.nullable()
		.optional()
		.describe('Pagination cursor for the next page of results'),
});
export type SecretsListResponse = z.infer<typeof SecretsListResponseSchema>;

export const SecretsGetInputSchema = z.object({
	id: z.string().describe('ID of the secret to fetch'),
});
export type SecretsGetInput = z.infer<typeof SecretsGetInputSchema>;

export const SecretsGetResponseSchema = SecretSchema;
export type SecretsGetResponse = z.infer<typeof SecretsGetResponseSchema>;

export const SecretsCreateInputSchema = z.object({
	name: z.string().describe('Name of the secret'),
	description: z.string().optional().describe('Description of the secret'),
	blueprintId: z.string().optional().describe('Blueprint template ID'),
	type: z.string().optional().describe('Secret type or provider template'),
	config: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Secret configuration credentials'),
	visibility: z
		.enum(['private', 'protected', 'public'])
		.optional()
		.describe('Visibility level'),
	meta: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Custom metadata'),
});
export type SecretsCreateInput = z.infer<typeof SecretsCreateInputSchema>;

export const SecretsCreateResponseSchema = IdResponseSchema;
export type SecretsCreateResponse = z.infer<typeof SecretsCreateResponseSchema>;

export const SecretsUpdateInputSchema = z.object({
	id: z.string().describe('ID of the secret to update'),
	name: z.string().optional().describe('Updated name'),
	description: z.string().optional().describe('Updated description'),
	config: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Updated configuration credentials'),
	visibility: z
		.enum(['private', 'protected', 'public'])
		.optional()
		.describe('Updated visibility'),
	meta: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Updated metadata'),
});
export type SecretsUpdateInput = z.infer<typeof SecretsUpdateInputSchema>;

export const SecretsUpdateResponseSchema = IdResponseSchema;
export type SecretsUpdateResponse = z.infer<typeof SecretsUpdateResponseSchema>;

export const SecretsDeleteInputSchema = z.object({
	id: z.string().describe('ID of the secret to delete'),
});
export type SecretsDeleteInput = z.infer<typeof SecretsDeleteInputSchema>;

export const SecretsDeleteResponseSchema = IdResponseSchema;
export type SecretsDeleteResponse = z.infer<typeof SecretsDeleteResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// 6. Conversations & Messages
// ─────────────────────────────────────────────────────────────────────────────

export const ConversationSchema = z.object({
	id: z.string().describe('Unique identifier of the conversation'),
	alias: z
		.string()
		.nullable()
		.optional()
		.describe('Custom alias for the conversation'),
	name: z.string().nullable().optional().describe('Name of the conversation'),
	description: z
		.string()
		.nullable()
		.optional()
		.describe('Description of the conversation'),
	botId: z.string().nullable().optional().describe('Associated bot ID'),
	backstory: z
		.string()
		.nullable()
		.optional()
		.describe('Instructions override for the conversation'),
	model: z.string().nullable().optional().describe('Model override'),
	datasetId: z.string().nullable().optional().describe('Dataset ID override'),
	skillsetId: z.string().nullable().optional().describe('Skillset ID override'),
	blueprintId: z
		.string()
		.nullable()
		.optional()
		.describe('Associated blueprint ID'),
	visibility: z.string().nullable().optional().describe('Visibility setting'),
	meta: z
		.record(z.string(), z.unknown())
		.nullable()
		.optional()
		.describe('Custom metadata'),
	createdAt: z
		.number()
		.nullable()
		.optional()
		.describe('Creation timestamp in milliseconds'),
	updatedAt: z
		.number()
		.nullable()
		.optional()
		.describe('Last updated timestamp in milliseconds'),
});
export type Conversation = z.infer<typeof ConversationSchema>;

export const ConversationsListInputSchema = ListQueryInputSchema;
export type ConversationsListInput = z.infer<
	typeof ConversationsListInputSchema
>;

export const ConversationsListResponseSchema = z.object({
	items: z
		.array(ConversationSchema)
		.describe('List of conversations matching the query'),
	cursor: z
		.string()
		.nullable()
		.optional()
		.describe('Pagination cursor for the next page of results'),
});
export type ConversationsListResponse = z.infer<
	typeof ConversationsListResponseSchema
>;

export const ConversationsGetInputSchema = z.object({
	id: z.string().describe('ID of the conversation to fetch'),
});
export type ConversationsGetInput = z.infer<typeof ConversationsGetInputSchema>;

export const ConversationsGetResponseSchema = ConversationSchema;
export type ConversationsGetResponse = z.infer<
	typeof ConversationsGetResponseSchema
>;

export const ConversationsCreateInputSchema = z.object({
	name: z.string().optional().describe('Name of the conversation'),
	description: z
		.string()
		.optional()
		.describe('Description of the conversation'),
	botId: z.string().optional().describe('ID of bot to associate'),
	datasetId: z.string().optional().describe('Dataset ID override'),
	skillsetId: z.string().optional().describe('Skillset ID override'),
	blueprintId: z.string().optional().describe('Blueprint template ID'),
	visibility: z
		.enum(['private', 'protected', 'public'])
		.optional()
		.describe('Visibility level'),
	meta: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Custom metadata'),
});
export type ConversationsCreateInput = z.infer<
	typeof ConversationsCreateInputSchema
>;

export const ConversationsCreateResponseSchema = IdResponseSchema;
export type ConversationsCreateResponse = z.infer<
	typeof ConversationsCreateResponseSchema
>;

export const ConversationsUpdateInputSchema = z.object({
	id: z.string().describe('ID of the conversation to update'),
	name: z.string().optional().describe('Updated name'),
	description: z.string().optional().describe('Updated description'),
	botId: z.string().nullable().optional().describe('Updated bot ID'),
	visibility: z
		.enum(['private', 'protected', 'public'])
		.optional()
		.describe('Updated visibility'),
	meta: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Updated metadata'),
});
export type ConversationsUpdateInput = z.infer<
	typeof ConversationsUpdateInputSchema
>;

export const ConversationsUpdateResponseSchema = IdResponseSchema;
export type ConversationsUpdateResponse = z.infer<
	typeof ConversationsUpdateResponseSchema
>;

export const ConversationsDeleteInputSchema = z.object({
	id: z.string().describe('ID of the conversation to delete'),
});
export type ConversationsDeleteInput = z.infer<
	typeof ConversationsDeleteInputSchema
>;

export const ConversationsDeleteResponseSchema = IdResponseSchema;
export type ConversationsDeleteResponse = z.infer<
	typeof ConversationsDeleteResponseSchema
>;

export const ConversationCompletionResponseSchema = z.object({
	text: z.string().optional().describe('AI response message text'),
	message: z
		.string()
		.optional()
		.describe('Completion status or error message if limits reached'),
	code: z.string().optional().describe('Error code if completion failed'),
	usage: z
		.object({
			tokens: z.number().optional().describe('Total tokens used'),
		})
		.optional()
		.describe('Token usage breakdown'),
});
export type ConversationCompletionResponse = z.infer<
	typeof ConversationCompletionResponseSchema
>;

export const ConversationsCompleteInputSchema = z.object({
	id: z.string().describe('ID of the conversation'),
	text: z.string().describe('User message text sent to the chatbot'),
});
export type ConversationsCompleteInput = z.infer<
	typeof ConversationsCompleteInputSchema
>;

export const ConversationsCompleteResponseSchema =
	ConversationCompletionResponseSchema;
export type ConversationsCompleteResponse = z.infer<
	typeof ConversationsCompleteResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// 7. Files
// ─────────────────────────────────────────────────────────────────────────────

export const FileSchema = z.object({
	id: z.string().describe('Unique identifier of the file resource'),
	name: z.string().describe('File name'),
	description: z.string().nullable().optional().describe('File description'),
	mimeType: z.string().nullable().optional().describe('MIME type of the file'),
	size: z.number().nullable().optional().describe('File size in bytes'),
	visibility: z.string().nullable().optional().describe('Visibility setting'),
	meta: z
		.record(z.string(), z.unknown())
		.nullable()
		.optional()
		.describe('Custom metadata'),
	createdAt: z
		.number()
		.nullable()
		.optional()
		.describe('Creation timestamp in milliseconds'),
	updatedAt: z
		.number()
		.nullable()
		.optional()
		.describe('Last updated timestamp in milliseconds'),
});
export type ChatbotkitFile = z.infer<typeof FileSchema>;

export const FilesListInputSchema = ListQueryInputSchema;
export type FilesListInput = z.infer<typeof FilesListInputSchema>;

export const FilesListResponseSchema = z.object({
	items: z.array(FileSchema).describe('List of files matching query'),
	cursor: z
		.string()
		.nullable()
		.optional()
		.describe('Pagination cursor for the next page of results'),
});
export type FilesListResponse = z.infer<typeof FilesListResponseSchema>;

export const FilesGetInputSchema = z.object({
	id: z.string().describe('ID of the file to fetch'),
});
export type FilesGetInput = z.infer<typeof FilesGetInputSchema>;

export const FilesGetResponseSchema = FileSchema;
export type FilesGetResponse = z.infer<typeof FilesGetResponseSchema>;

export const FilesCreateInputSchema = z.object({
	name: z.string().describe('Name of the file'),
	description: z.string().optional().describe('Description of the file'),
	mimeType: z.string().optional().describe('MIME type of the file'),
	visibility: z
		.enum(['private', 'protected', 'public'])
		.optional()
		.describe('Visibility level'),
	meta: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Custom metadata'),
});
export type FilesCreateInput = z.infer<typeof FilesCreateInputSchema>;

export const FilesCreateResponseSchema = IdResponseSchema;
export type FilesCreateResponse = z.infer<typeof FilesCreateResponseSchema>;

export const FilesDeleteInputSchema = z.object({
	id: z.string().describe('ID of the file to delete'),
});
export type FilesDeleteInput = z.infer<typeof FilesDeleteInputSchema>;

export const FilesDeleteResponseSchema = IdResponseSchema;
export type FilesDeleteResponse = z.infer<typeof FilesDeleteResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// 8. Tasks
// ─────────────────────────────────────────────────────────────────────────────

export const TaskSchema = z.object({
	id: z.string().describe('Unique identifier of the task'),
	name: z.string().describe('Descriptive name of the task'),
	description: z
		.string()
		.nullable()
		.optional()
		.describe('Brief description of the task'),
	botId: z.string().nullable().optional().describe('Associated bot ID'),
	schedule: z.string().nullable().optional().describe('Cron schedule string'),
	status: z.string().nullable().optional().describe('Task execution status'),
	visibility: z.string().nullable().optional().describe('Visibility setting'),
	meta: z
		.record(z.string(), z.unknown())
		.nullable()
		.optional()
		.describe('Custom metadata'),
	createdAt: z
		.number()
		.nullable()
		.optional()
		.describe('Creation timestamp in milliseconds'),
	updatedAt: z
		.number()
		.nullable()
		.optional()
		.describe('Last updated timestamp in milliseconds'),
});
export type Task = z.infer<typeof TaskSchema>;

export const TasksListInputSchema = ListQueryInputSchema;
export type TasksListInput = z.infer<typeof TasksListInputSchema>;

export const TasksListResponseSchema = z.object({
	items: z.array(TaskSchema).describe('List of tasks matching query'),
	cursor: z
		.string()
		.nullable()
		.optional()
		.describe('Pagination cursor for next page of results'),
});
export type TasksListResponse = z.infer<typeof TasksListResponseSchema>;

export const TasksGetInputSchema = z.object({
	id: z.string().describe('ID of the task to fetch'),
});
export type TasksGetInput = z.infer<typeof TasksGetInputSchema>;

export const TasksGetResponseSchema = TaskSchema;
export type TasksGetResponse = z.infer<typeof TasksGetResponseSchema>;

export const TasksCreateInputSchema = z.object({
	name: z.string().describe('Name of the background task'),
	description: z.string().optional().describe('Description of the task'),
	botId: z.string().optional().describe('ID of bot executing the task'),
	schedule: z
		.string()
		.optional()
		.describe('Cron schedule expression for recurring runs'),
	visibility: z
		.enum(['private', 'protected', 'public'])
		.optional()
		.describe('Visibility level'),
	meta: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Custom metadata'),
});
export type TasksCreateInput = z.infer<typeof TasksCreateInputSchema>;

export const TasksCreateResponseSchema = IdResponseSchema;
export type TasksCreateResponse = z.infer<typeof TasksCreateResponseSchema>;

export const TasksUpdateInputSchema = z.object({
	id: z.string().describe('ID of the task to update'),
	name: z.string().optional().describe('Updated name'),
	description: z.string().optional().describe('Updated description'),
	botId: z.string().nullable().optional().describe('Updated bot ID'),
	schedule: z.string().nullable().optional().describe('Updated cron schedule'),
	visibility: z
		.enum(['private', 'protected', 'public'])
		.optional()
		.describe('Updated visibility'),
	meta: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Updated metadata'),
});
export type TasksUpdateInput = z.infer<typeof TasksUpdateInputSchema>;

export const TasksUpdateResponseSchema = IdResponseSchema;
export type TasksUpdateResponse = z.infer<typeof TasksUpdateResponseSchema>;

export const TasksDeleteInputSchema = z.object({
	id: z.string().describe('ID of the task to delete'),
});
export type TasksDeleteInput = z.infer<typeof TasksDeleteInputSchema>;

export const TasksDeleteResponseSchema = IdResponseSchema;
export type TasksDeleteResponse = z.infer<typeof TasksDeleteResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Input/Output Maps
// ─────────────────────────────────────────────────────────────────────────────

export type ChatbotkitEndpointInputs = {
	// Bots
	botsList: BotsListInput;
	botsGet: BotsGetInput;
	botsCreate: BotsCreateInput;
	botsUpdate: BotsUpdateInput;
	botsDelete: BotsDeleteInput;
	botsUpvote: BotsUpvoteInput;
	botsDownvote: BotsDownvoteInput;

	// Datasets
	datasetsList: DatasetsListInput;
	datasetsGet: DatasetsGetInput;
	datasetsCreate: DatasetsCreateInput;
	datasetsUpdate: DatasetsUpdateInput;
	datasetsDelete: DatasetsDeleteInput;
	datasetsSearch: DatasetsSearchInput;

	// Skillsets
	skillsetsList: SkillsetsListInput;
	skillsetsGet: SkillsetsGetInput;
	skillsetsCreate: SkillsetsCreateInput;
	skillsetsUpdate: SkillsetsUpdateInput;
	skillsetsDelete: SkillsetsDeleteInput;

	// Blueprints
	blueprintsList: BlueprintsListInput;
	blueprintsGet: BlueprintsGetInput;
	blueprintsCreate: BlueprintsCreateInput;
	blueprintsUpdate: BlueprintsUpdateInput;
	blueprintsDelete: BlueprintsDeleteInput;

	// Secrets
	secretsList: SecretsListInput;
	secretsGet: SecretsGetInput;
	secretsCreate: SecretsCreateInput;
	secretsUpdate: SecretsUpdateInput;
	secretsDelete: SecretsDeleteInput;

	// Conversations
	conversationsList: ConversationsListInput;
	conversationsGet: ConversationsGetInput;
	conversationsCreate: ConversationsCreateInput;
	conversationsUpdate: ConversationsUpdateInput;
	conversationsDelete: ConversationsDeleteInput;
	conversationsComplete: ConversationsCompleteInput;

	// Files
	filesList: FilesListInput;
	filesGet: FilesGetInput;
	filesCreate: FilesCreateInput;
	filesDelete: FilesDeleteInput;

	// Tasks
	tasksList: TasksListInput;
	tasksGet: TasksGetInput;
	tasksCreate: TasksCreateInput;
	tasksUpdate: TasksUpdateInput;
	tasksDelete: TasksDeleteInput;
};

export type ChatbotkitEndpointOutputs = {
	// Bots
	botsList: BotsListResponse;
	botsGet: BotsGetResponse;
	botsCreate: BotsCreateResponse;
	botsUpdate: BotsUpdateResponse;
	botsDelete: BotsDeleteResponse;
	botsUpvote: BotsUpvoteResponse;
	botsDownvote: BotsDownvoteResponse;

	// Datasets
	datasetsList: DatasetsListResponse;
	datasetsGet: DatasetsGetResponse;
	datasetsCreate: DatasetsCreateResponse;
	datasetsUpdate: DatasetsUpdateResponse;
	datasetsDelete: DatasetsDeleteResponse;
	datasetsSearch: DatasetsSearchResponse;

	// Skillsets
	skillsetsList: SkillsetsListResponse;
	skillsetsGet: SkillsetsGetResponse;
	skillsetsCreate: SkillsetsCreateResponse;
	skillsetsUpdate: SkillsetsUpdateResponse;
	skillsetsDelete: SkillsetsDeleteResponse;

	// Blueprints
	blueprintsList: BlueprintsListResponse;
	blueprintsGet: BlueprintsGetResponse;
	blueprintsCreate: BlueprintsCreateResponse;
	blueprintsUpdate: BlueprintsUpdateResponse;
	blueprintsDelete: BlueprintsDeleteResponse;

	// Secrets
	secretsList: SecretsListResponse;
	secretsGet: SecretsGetResponse;
	secretsCreate: SecretsCreateResponse;
	secretsUpdate: SecretsUpdateResponse;
	secretsDelete: SecretsDeleteResponse;

	// Conversations
	conversationsList: ConversationsListResponse;
	conversationsGet: ConversationsGetResponse;
	conversationsCreate: ConversationsCreateResponse;
	conversationsUpdate: ConversationsUpdateResponse;
	conversationsDelete: ConversationsDeleteResponse;
	conversationsComplete: ConversationsCompleteResponse;

	// Files
	filesList: FilesListResponse;
	filesGet: FilesGetResponse;
	filesCreate: FilesCreateResponse;
	filesDelete: FilesDeleteResponse;

	// Tasks
	tasksList: TasksListResponse;
	tasksGet: TasksGetResponse;
	tasksCreate: TasksCreateResponse;
	tasksUpdate: TasksUpdateResponse;
	tasksDelete: TasksDeleteResponse;
};

export const ChatbotkitEndpointInputSchemas = {
	// Bots
	botsList: BotsListInputSchema,
	botsGet: BotsGetInputSchema,
	botsCreate: BotsCreateInputSchema,
	botsUpdate: BotsUpdateInputSchema,
	botsDelete: BotsDeleteInputSchema,
	botsUpvote: BotsUpvoteInputSchema,
	botsDownvote: BotsDownvoteInputSchema,

	// Datasets
	datasetsList: DatasetsListInputSchema,
	datasetsGet: DatasetsGetInputSchema,
	datasetsCreate: DatasetsCreateInputSchema,
	datasetsUpdate: DatasetsUpdateInputSchema,
	datasetsDelete: DatasetsDeleteInputSchema,
	datasetsSearch: DatasetsSearchInputSchema,

	// Skillsets
	skillsetsList: SkillsetsListInputSchema,
	skillsetsGet: SkillsetsGetInputSchema,
	skillsetsCreate: SkillsetsCreateInputSchema,
	skillsetsUpdate: SkillsetsUpdateInputSchema,
	skillsetsDelete: SkillsetsDeleteInputSchema,

	// Blueprints
	blueprintsList: BlueprintsListInputSchema,
	blueprintsGet: BlueprintsGetInputSchema,
	blueprintsCreate: BlueprintsCreateInputSchema,
	blueprintsUpdate: BlueprintsUpdateInputSchema,
	blueprintsDelete: BlueprintsDeleteInputSchema,

	// Secrets
	secretsList: SecretsListInputSchema,
	secretsGet: SecretsGetInputSchema,
	secretsCreate: SecretsCreateInputSchema,
	secretsUpdate: SecretsUpdateInputSchema,
	secretsDelete: SecretsDeleteInputSchema,

	// Conversations
	conversationsList: ConversationsListInputSchema,
	conversationsGet: ConversationsGetInputSchema,
	conversationsCreate: ConversationsCreateInputSchema,
	conversationsUpdate: ConversationsUpdateInputSchema,
	conversationsDelete: ConversationsDeleteInputSchema,
	conversationsComplete: ConversationsCompleteInputSchema,

	// Files
	filesList: FilesListInputSchema,
	filesGet: FilesGetInputSchema,
	filesCreate: FilesCreateInputSchema,
	filesDelete: FilesDeleteInputSchema,

	// Tasks
	tasksList: TasksListInputSchema,
	tasksGet: TasksGetInputSchema,
	tasksCreate: TasksCreateInputSchema,
	tasksUpdate: TasksUpdateInputSchema,
	tasksDelete: TasksDeleteInputSchema,
} as const;

export const ChatbotkitEndpointOutputSchemas = {
	// Bots
	botsList: BotsListResponseSchema,
	botsGet: BotsGetResponseSchema,
	botsCreate: BotsCreateResponseSchema,
	botsUpdate: BotsUpdateResponseSchema,
	botsDelete: BotsDeleteResponseSchema,
	botsUpvote: BotsUpvoteResponseSchema,
	botsDownvote: BotsDownvoteResponseSchema,

	// Datasets
	datasetsList: DatasetsListResponseSchema,
	datasetsGet: DatasetsGetResponseSchema,
	datasetsCreate: DatasetsCreateResponseSchema,
	datasetsUpdate: DatasetsUpdateResponseSchema,
	datasetsDelete: DatasetsDeleteResponseSchema,
	datasetsSearch: DatasetsSearchResponseSchema,

	// Skillsets
	skillsetsList: SkillsetsListResponseSchema,
	skillsetsGet: SkillsetsGetResponseSchema,
	skillsetsCreate: SkillsetsCreateResponseSchema,
	skillsetsUpdate: SkillsetsUpdateResponseSchema,
	skillsetsDelete: SkillsetsDeleteResponseSchema,

	// Blueprints
	blueprintsList: BlueprintsListResponseSchema,
	blueprintsGet: BlueprintsGetResponseSchema,
	blueprintsCreate: BlueprintsCreateResponseSchema,
	blueprintsUpdate: BlueprintsUpdateResponseSchema,
	blueprintsDelete: BlueprintsDeleteResponseSchema,

	// Secrets
	secretsList: SecretsListResponseSchema,
	secretsGet: SecretsGetResponseSchema,
	secretsCreate: SecretsCreateResponseSchema,
	secretsUpdate: SecretsUpdateResponseSchema,
	secretsDelete: SecretsDeleteResponseSchema,

	// Conversations
	conversationsList: ConversationsListResponseSchema,
	conversationsGet: ConversationsGetResponseSchema,
	conversationsCreate: ConversationsCreateResponseSchema,
	conversationsUpdate: ConversationsUpdateResponseSchema,
	conversationsDelete: ConversationsDeleteResponseSchema,
	conversationsComplete: ConversationsCompleteResponseSchema,

	// Files
	filesList: FilesListResponseSchema,
	filesGet: FilesGetResponseSchema,
	filesCreate: FilesCreateResponseSchema,
	filesDelete: FilesDeleteResponseSchema,

	// Tasks
	tasksList: TasksListResponseSchema,
	tasksGet: TasksGetResponseSchema,
	tasksCreate: TasksCreateResponseSchema,
	tasksUpdate: TasksUpdateResponseSchema,
	tasksDelete: TasksDeleteResponseSchema,
} as const;
