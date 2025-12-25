/**
 * Default database schema for Gmail plugin
 * This defines the structure of tables that can be created for Gmail data
 */

export const gmailDefaultSchema = {
	messages: {
		id: 'string',
		thread_id: 'string',
		subject: 'string',
		from: 'string',
		to: 'string',
		body: 'string',
		date: 'string',
		label_ids: 'string',
	} as const,
	threads: {
		id: 'string',
		history_id: 'string',
		snippet: 'string',
	} as const,
	labels: {
		id: 'string',
		name: 'string',
		type: 'string',
		color: 'string',
	} as const,
	drafts: {
		id: 'string',
		message_id: 'string',
		subject: 'string',
		to: 'string',
		body: 'string',
	} as const,
} as const;

export type GmailDefaultSchema = typeof gmailDefaultSchema;

/**
 * Schema override options for each table
 * - `true`: Use the default schema for this table
 * - `false`: Skip creating this table
 * - Function: Customize the schema based on the default schema
 */
export type GmailSchemaOverrideValue<
	TTableName extends keyof GmailDefaultSchema,
> =
	| boolean
	| ((
			dbSchema: GmailDefaultSchema,
	  ) => Record<string, string | boolean>);

/**
 * Schema override configuration
 * Allows users to override the default schema per table
 */
export type GmailSchemaOverride = {
	[K in keyof GmailDefaultSchema]?: GmailSchemaOverrideValue<K>;
};

/**
 * Resolved schema after applying overrides
 */
export type ResolvedGmailSchema<
	TOverride extends GmailSchemaOverride,
> = {
	[K in keyof GmailDefaultSchema]: TOverride[K] extends false
		? never
		: TOverride[K] extends true
			? GmailDefaultSchema[K]
			: TOverride[K] extends (schema: GmailDefaultSchema) => infer R
				? R extends Record<string, string | boolean>
					? R
					: GmailDefaultSchema[K]
				: GmailDefaultSchema[K];
};

