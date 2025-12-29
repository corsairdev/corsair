/**
 * Default database schema for Linear plugin
 * This defines the structure of tables that can be created for Linear data
 */

export const linearDefaultSchema = {
	issues: {
		id: 'string',
		title: 'string',
		description: 'string',
		priority: 'number',
		state_id: 'string',
		team_id: 'string',
		assignee_id: 'string',
		creator_id: 'string',
		number: 'number',
		url: 'string',
		created_at: 'string',
		updated_at: 'string',
	} as const,
	teams: {
		id: 'string',
		name: 'string',
		key: 'string',
	} as const,
	projects: {
		id: 'string',
		name: 'string',
		description: 'string',
		state: 'string',
		progress: 'number',
	} as const,
	comments: {
		id: 'string',
		issue_id: 'string',
		body: 'string',
		user_id: 'string',
		created_at: 'string',
		updated_at: 'string',
	} as const,
} as const;

export type LinearDefaultSchema = typeof linearDefaultSchema;

/**
 * Schema override options for each table
 */
export type LinearSchemaOverrideValue<
	TTableName extends keyof LinearDefaultSchema,
> =
	| boolean
	| ((
			dbSchema: LinearDefaultSchema,
	  ) => Record<string, string | boolean | number>);

/**
 * Schema override configuration
 */
export type LinearSchemaOverride = {
	[K in keyof LinearDefaultSchema]?: LinearSchemaOverrideValue<K>;
};

/**
 * Resolved schema after applying overrides
 */
export type ResolvedLinearSchema<TOverride extends LinearSchemaOverride> = {
	[K in keyof LinearDefaultSchema]: TOverride[K] extends false
		? never
		: TOverride[K] extends true
			? LinearDefaultSchema[K]
			: TOverride[K] extends (schema: LinearDefaultSchema) => infer R
				? R extends Record<string, string | boolean | number>
					? R
					: LinearDefaultSchema[K]
				: LinearDefaultSchema[K];
};
