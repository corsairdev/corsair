import type {
	ResolvedGitHubSchema,
	GitHubDefaultSchema,
	GitHubSchemaOverride,
} from './schema';

export type GitHubPlugin = {
	/**
	 * GitHub personal access token
	 */
	token: string;
	/**
	 * Schema override configuration
	 */
	schema?: GitHubSchemaOverride;
};

export type BaseGitHubPluginResponse<T extends Record<string, unknown>> = {
	success: boolean;
	data?: T;
	error?: string;
};

// Response type for listIssues operation
export type ListIssuesResponse = BaseGitHubPluginResponse<{
	issues: Array<{
		id: number;
		number: number;
		title: string;
		body: string;
		state: string;
		author: string;
		createdAt: string;
		updatedAt: string;
		closedAt: string | null;
	}>;
}>;

// Response type for getIssue operation
export type GetIssueResponse = BaseGitHubPluginResponse<{
	id: number;
	number: number;
	title: string;
	body: string;
	state: string;
	author: string;
	createdAt: string;
	updatedAt: string;
	closedAt: string | null;
}>;

// Response type for createIssue operation
export type CreateIssueResponse = BaseGitHubPluginResponse<{
	id: number;
	number: number;
	title: string;
	body: string;
	state: string;
	author: string;
	createdAt: string;
	updatedAt: string;
	closedAt: string | null;
}>;

// Response type for listPullRequests operation
export type ListPullRequestsResponse = BaseGitHubPluginResponse<{
	pullRequests: Array<{
		id: number;
		number: number;
		title: string;
		body: string;
		state: string;
		author: string;
		head: string;
		base: string;
		createdAt: string;
		updatedAt: string;
		mergedAt: string | null;
	}>;
}>;

// Response type for listRepositories operation
export type ListRepositoriesResponse = BaseGitHubPluginResponse<{
	repositories: Array<{
		id: number;
		name: string;
		fullName: string;
		description: string;
		private: boolean;
		owner: string;
		url: string;
		createdAt: string;
		updatedAt: string;
	}>;
}>;

/**
 * Database context type for plugin operations
 */
export type GitHubDatabaseContext<
	TSchemaOverride extends GitHubSchemaOverride = GitHubSchemaOverride,
> = {
	[K in keyof ResolvedGitHubSchema<TSchemaOverride>]: ResolvedGitHubSchema<TSchemaOverride>[K] extends never
		? never
		: {
				insert: (data: Record<string, unknown>) => Promise<unknown>;
				select: () => Promise<Array<Record<string, unknown>>>;
				update: (
					data: Record<string, unknown>,
				) => Promise<unknown>;
				delete: () => Promise<unknown>;
			};
};

/**
 * Plugin operation context
 */
export type GitHubPluginContext<
	TSchemaOverride extends GitHubSchemaOverride = GitHubSchemaOverride,
> = {
	db: GitHubDatabaseContext<TSchemaOverride>;
	userId?: string;
};

/**
 * GitHubClient type for operations
 */
export type { GitHubClient } from './client';

export type { GitHubSchemaOverride } from './schema';

