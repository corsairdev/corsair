/**
 * Default database schema for Slack plugin
 * This defines the structure of tables that can be created for Slack data
 */

export const slackDefaultSchema = {
	messages: {
		id: 'string',
		content: 'string',
		channel_id: 'string',
		user_id: 'string',
		timestamp: 'string',
		thread_ts: 'string',
	} as const,
	channels: {
		id: 'string',
		name: 'string',
		is_private: 'boolean',
		is_archived: 'boolean',
	} as const,
	members: {
		id: 'string',
		first_name: 'string',
		last_name: 'string',
		email: 'string',
	} as const,
	channel_members: {
		id: 'string',
		channel_id: 'string',
		member_id: 'string',
	} as const,
} as const;

export type SlackDefaultSchema = typeof slackDefaultSchema;

/**
 * Schema override options for each table
 * - `true`: Use the default schema for this table
 * - `false`: Skip creating this table
 * - Function: Customize the schema based on the default schema
 */
export type SchemaOverrideValue<TTableName extends keyof SlackDefaultSchema> =
	| boolean
	| ((dbSchema: SlackDefaultSchema) => Record<string, string | boolean>);

/**
 * Schema override configuration
 * Allows users to override the default schema per table
 */
export type SlackSchemaOverride = {
	[K in keyof SlackDefaultSchema]?: SchemaOverrideValue<K>;
};

/**
 * Resolved schema after applying overrides
 */
export type ResolvedSlackSchema<TOverride extends SlackSchemaOverride> = {
	[K in keyof SlackDefaultSchema]: TOverride[K] extends false
		? never
		: TOverride[K] extends true
			? SlackDefaultSchema[K]
			: TOverride[K] extends (schema: SlackDefaultSchema) => infer R
				? R extends Record<string, string | boolean>
					? R
					: SlackDefaultSchema[K]
				: SlackDefaultSchema[K];
};
