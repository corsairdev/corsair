/**
 * Default database schema for PostHog plugin
 * This defines the structure of tables that can be created for PostHog data
 */

export const posthogDefaultSchema = {
	events: {
		id: 'string',
		distinct_id: 'string',
		event: 'string',
		properties: 'string', // JSON string
		timestamp: 'string',
		created_at: 'string',
	} as const,
	identities: {
		id: 'string',
		distinct_id: 'string',
		properties: 'string', // JSON string
		created_at: 'string',
	} as const,
	aliases: {
		id: 'string',
		distinct_id: 'string',
		alias: 'string',
		created_at: 'string',
	} as const,
	pageviews: {
		id: 'string',
		distinct_id: 'string',
		url: 'string',
		properties: 'string', // JSON string
		timestamp: 'string',
		created_at: 'string',
	} as const,
	screens: {
		id: 'string',
		distinct_id: 'string',
		screen_name: 'string',
		properties: 'string', // JSON string
		timestamp: 'string',
		created_at: 'string',
	} as const,
} as const;

export type PostHogDefaultSchema = typeof posthogDefaultSchema;

/**
 * Schema override options for each table
 */
export type PostHogSchemaOverrideValue<
	TTableName extends keyof PostHogDefaultSchema,
> =
	| boolean
	| ((
			dbSchema: PostHogDefaultSchema,
	  ) => Record<string, string | boolean | number>);

/**
 * Schema override configuration
 */
export type PostHogSchemaOverride = {
	[K in keyof PostHogDefaultSchema]?: PostHogSchemaOverrideValue<K>;
};

/**
 * Resolved schema after applying overrides
 */
export type ResolvedPostHogSchema<TOverride extends PostHogSchemaOverride> = {
	[K in keyof PostHogDefaultSchema]: TOverride[K] extends false
		? never
		: TOverride[K] extends true
			? PostHogDefaultSchema[K]
			: TOverride[K] extends (schema: PostHogDefaultSchema) => infer R
				? R extends Record<string, string | boolean | number>
					? R
					: PostHogDefaultSchema[K]
				: PostHogDefaultSchema[K];
};

