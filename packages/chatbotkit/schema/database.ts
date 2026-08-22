import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// ChatbotkitBot
// Verified against official ChatBotKit API: GET /v1/bot/{botId}/fetch
// ─────────────────────────────────────────────────────────────────────────────

export const ChatbotkitBot = z.object({
	/** Unique identifier of the bot. */
	id: z.string(),
	/** Custom alias assigned to the bot. */
	alias: z.string().nullable().optional(),
	/** Display name of the bot. */
	name: z.string(),
	/** Brief summary describing the bot's purpose. */
	description: z.string().nullable().optional(),
	/** Identifier of the blueprint template associated with the bot. */
	blueprintId: z.string().nullable().optional(),
	/** Identifier of the connected knowledge dataset. */
	datasetId: z.string().nullable().optional(),
	/** Identifier of the connected skillset containing bot tools. */
	skillsetId: z.string().nullable().optional(),
	/** System instructions defining bot personality and behavioral rules. */
	backstory: z.string().nullable().optional(),
	/** AI model configured for the bot (e.g. gpt-4o, claude-3-5-sonnet). */
	model: z.string().nullable().optional(),
	/** Access visibility level: private, protected, or public. */
	visibility: z.string().nullable().optional(),
	/** Custom key-value metadata attached to the bot. */
	meta: z.record(z.string(), z.unknown()).nullable().optional(),
	/** Resource creation timestamp. */
	createdAt: z.coerce.date().nullable().optional(),
	/** Resource last updated timestamp. */
	updatedAt: z.coerce.date().nullable().optional(),
});
export type ChatbotkitBot = z.infer<typeof ChatbotkitBot>;

// ─────────────────────────────────────────────────────────────────────────────
// ChatbotkitDataset
// Verified against official ChatBotKit API: GET /v1/dataset/{datasetId}/fetch
// ─────────────────────────────────────────────────────────────────────────────

export const ChatbotkitDataset = z.object({
	/** Unique identifier of the dataset. */
	id: z.string(),
	/** Custom alias assigned to the dataset. */
	alias: z.string().nullable().optional(),
	/** Display name of the dataset. */
	name: z.string(),
	/** Brief summary of the dataset contents. */
	description: z.string().nullable().optional(),
	/** Identifier of the blueprint associated with the dataset. */
	blueprintId: z.string().nullable().optional(),
	/** Reranker model configured for search relevance. */
	reranker: z.string().nullable().optional(),
	/** Maximum token limit per dataset record. */
	recordMaxTokens: z.number().nullable().optional(),
	/** Minimum similarity score threshold for search results. */
	searchMinScore: z.number().nullable().optional(),
	/** Maximum number of records returned per search query. */
	searchMaxRecords: z.number().nullable().optional(),
	/** Maximum tokens allocated for search context. */
	searchMaxTokens: z.number().nullable().optional(),
	/** Prompt instructions used when matching content is found. */
	matchInstruction: z.string().nullable().optional(),
	/** Prompt instructions used when no matching content is found. */
	mismatchInstruction: z.string().nullable().optional(),
	/** Separator characters used for chunking text records. */
	separators: z.array(z.string()).nullable().optional(),
	/** Access visibility level: private, protected, or public. */
	visibility: z.string().nullable().optional(),
	/** Custom key-value metadata attached to the dataset. */
	meta: z.record(z.string(), z.unknown()).nullable().optional(),
	/** Resource creation timestamp. */
	createdAt: z.coerce.date().nullable().optional(),
	/** Resource last updated timestamp. */
	updatedAt: z.coerce.date().nullable().optional(),
});
export type ChatbotkitDataset = z.infer<typeof ChatbotkitDataset>;

// ─────────────────────────────────────────────────────────────────────────────
// ChatbotkitSkillset
// Verified against official ChatBotKit API: GET /v1/skillset/{skillsetId}/fetch
// ─────────────────────────────────────────────────────────────────────────────

export const ChatbotkitSkillset = z.object({
	/** Unique identifier of the skillset. */
	id: z.string(),
	/** Custom alias assigned to the skillset. */
	alias: z.string().nullable().optional(),
	/** Display name of the skillset. */
	name: z.string(),
	/** Brief summary of the skillset tools and capabilities. */
	description: z.string().nullable().optional(),
	/** Identifier of the blueprint associated with the skillset. */
	blueprintId: z.string().nullable().optional(),
	/** Access visibility level: private, protected, or public. */
	visibility: z.string().nullable().optional(),
	/** Current operational state: enabled or disabled. */
	state: z.string().nullable().optional(),
	/** Custom key-value metadata attached to the skillset. */
	meta: z.record(z.string(), z.unknown()).nullable().optional(),
	/** Resource creation timestamp. */
	createdAt: z.coerce.date().nullable().optional(),
	/** Resource last updated timestamp. */
	updatedAt: z.coerce.date().nullable().optional(),
});
export type ChatbotkitSkillset = z.infer<typeof ChatbotkitSkillset>;

// ─────────────────────────────────────────────────────────────────────────────
// ChatbotkitBlueprint
// Verified against official ChatBotKit API: GET /v1/blueprint/{blueprintId}/fetch
// ─────────────────────────────────────────────────────────────────────────────

export const ChatbotkitBlueprint = z.object({
	/** Unique identifier of the blueprint. */
	id: z.string(),
	/** Custom alias assigned to the blueprint. */
	alias: z.string().nullable().optional(),
	/** Display name of the blueprint template. */
	name: z.string(),
	/** Brief summary of the blueprint template configuration. */
	description: z.string().nullable().optional(),
	/** Blueprint configuration parameters and initial resource setup. */
	config: z.record(z.string(), z.unknown()).nullable().optional(),
	/** Access visibility level: private, protected, or public. */
	visibility: z.string().nullable().optional(),
	/** Custom key-value metadata attached to the blueprint. */
	meta: z.record(z.string(), z.unknown()).nullable().optional(),
	/** Resource creation timestamp. */
	createdAt: z.coerce.date().nullable().optional(),
	/** Resource last updated timestamp. */
	updatedAt: z.coerce.date().nullable().optional(),
});
export type ChatbotkitBlueprint = z.infer<typeof ChatbotkitBlueprint>;

// ─────────────────────────────────────────────────────────────────────────────
// ChatbotkitSecret
// Verified against official ChatBotKit API: GET /v1/secret/{secretId}/fetch
// ─────────────────────────────────────────────────────────────────────────────

export const ChatbotkitSecret = z.object({
	/** Unique identifier of the secret credential. */
	id: z.string(),
	/** Custom alias assigned to the secret. */
	alias: z.string().nullable().optional(),
	/** Display name of the secret credential. */
	name: z.string(),
	/** Description of the service or integration using this secret. */
	description: z.string().nullable().optional(),
	/** Identifier of the blueprint associated with the secret. */
	blueprintId: z.string().nullable().optional(),
	/** Kind of secret (e.g. personal, shared). */
	kind: z.string().nullable().optional(),
	/** Type of credential template (e.g. template, custom). */
	type: z.string().nullable().optional(),
	/** Configuration details for the authenticated integration. */
	config: z.record(z.string(), z.unknown()).nullable().optional(),
	/** Access visibility level: private, protected, or public. */
	visibility: z.string().nullable().optional(),
	/** Custom key-value metadata attached to the secret. */
	meta: z.record(z.string(), z.unknown()).nullable().optional(),
	/** Resource creation timestamp. */
	createdAt: z.coerce.date().nullable().optional(),
	/** Resource last updated timestamp. */
	updatedAt: z.coerce.date().nullable().optional(),
});
export type ChatbotkitSecret = z.infer<typeof ChatbotkitSecret>;
