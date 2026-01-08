/**
 * Default database schema for GitHub plugin
 * This defines the structure of tables that can be created for GitHub data
 */

export const githubDefaultSchema = {
	issues: {
		id: 'string',
		number: 'number',
		title: 'string',
		body: 'string',
		state: 'string',
		repo: 'string',
		author: 'string',
		created_at: 'string',
		updated_at: 'string',
		closed_at: 'string',
	} as const,
	pull_requests: {
		id: 'string',
		number: 'number',
		title: 'string',
		body: 'string',
		state: 'string',
		repo: 'string',
		author: 'string',
		head: 'string',
		base: 'string',
		created_at: 'string',
		updated_at: 'string',
		merged_at: 'string',
	} as const,
	repositories: {
		id: 'string',
		name: 'string',
		full_name: 'string',
		description: 'string',
		private: 'boolean',
		owner: 'string',
		url: 'string',
		created_at: 'string',
		updated_at: 'string',
	} as const,
	commits: {
		id: 'string',
		sha: 'string',
		message: 'string',
		author: 'string',
		repo: 'string',
		created_at: 'string',
	} as const,
} as const;

export type GitHubDefaultSchema = typeof githubDefaultSchema;

/**
 * Schema override options for each table
 */
export type GitHubSchemaOverrideValue<
	TTableName extends keyof GitHubDefaultSchema,
> =
	| boolean
	| ((
			dbSchema: GitHubDefaultSchema,
	  ) => Record<string, string | boolean | number>);

/**
 * Schema override configuration
 */
export type GitHubSchemaOverride = {
	[K in keyof GitHubDefaultSchema]?: GitHubSchemaOverrideValue<K>;
};

/**
 * Resolved schema after applying overrides
 */
export type ResolvedGitHubSchema<TOverride extends GitHubSchemaOverride> = {
	[K in keyof GitHubDefaultSchema]: TOverride[K] extends false
		? never
		: TOverride[K] extends true
			? GitHubDefaultSchema[K]
			: TOverride[K] extends (schema: GitHubDefaultSchema) => infer R
				? R extends Record<string, string | boolean | number>
					? R
					: GitHubDefaultSchema[K]
				: GitHubDefaultSchema[K];
};
