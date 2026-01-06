import { initializePlugin } from '../base';
import { createGitHubClient } from './client';
import { createIssue } from './operations/create-issue';
import { getIssue } from './operations/get-issue';
import { handleGitHubWebhook } from './operations/handle-webhook';
import { listIssues } from './operations/list-issues';
import { listPullRequests } from './operations/list-pull-requests';
import { listRepositories } from './operations/list-repositories';
import { githubDefaultSchema } from './schema';
import type {
	GitHubDatabaseContext,
	GitHubPlugin,
	GitHubPluginContext,
	GitHubSchemaOverride,
} from './types';

/**
 * Creates a GitHub plugin instance with database access
 * Uses the unified initialization flow from base plugin system
 */
export function createGitHubPlugin<
	TSchemaOverride extends GitHubSchemaOverride = GitHubSchemaOverride,
	TDatabase extends
		GitHubDatabaseContext<TSchemaOverride> = GitHubDatabaseContext<TSchemaOverride>,
>(config: GitHubPlugin, db: unknown) {
	// Initialize plugin using unified flow
	const initResult = initializePlugin(
		config,
		githubDefaultSchema,
		db,
		(config) => createGitHubClient(config.token),
	);
	const { config: pluginConfig, client, ctx } = {
		...initResult,
		ctx: {
			...initResult.ctx,
			db: initResult.db as GitHubDatabaseContext<TSchemaOverride>,
		},
	} as {
		config: GitHubPlugin;
		client: ReturnType<typeof createGitHubClient>;
		ctx: GitHubPluginContext<TSchemaOverride>;
	};

	return {
		createIssue: async (params: {
			owner: string;
			repo: string;
			title: string;
			body?: string;
			labels?: string[];
			assignees?: string[];
		}): Promise<ReturnType<typeof createIssue>> => {
			return createIssue({
				config: pluginConfig,
				client,
				owner: params.owner,
				repo: params.repo,
				title: params.title,
				body: params.body,
				labels: params.labels,
				assignees: params.assignees,
				ctx,
			});
		},

		getIssue: async (params: {
			owner: string;
			repo: string;
			issueNumber: number;
		}): Promise<ReturnType<typeof getIssue>> => {
			return getIssue({
				config: pluginConfig,
				client,
				owner: params.owner,
				repo: params.repo,
				issueNumber: params.issueNumber,
				ctx,
			});
		},

		listIssues: async (params: {
			owner: string;
			repo: string;
			state?: 'open' | 'closed' | 'all';
			page?: number;
			perPage?: number;
		}): Promise<ReturnType<typeof listIssues>> => {
			return listIssues({
				config: pluginConfig,
				client,
				owner: params.owner,
				repo: params.repo,
				state: params.state,
				page: params.page,
				perPage: params.perPage,
				ctx,
			});
		},

		listPullRequests: async (params: {
			owner: string;
			repo: string;
			state?: 'open' | 'closed' | 'all';
			page?: number;
			perPage?: number;
		}): Promise<ReturnType<typeof listPullRequests>> => {
			return listPullRequests({
				config: pluginConfig,
				client,
				owner: params.owner,
				repo: params.repo,
				state: params.state,
				page: params.page,
				perPage: params.perPage,
				ctx,
			});
		},

		listRepositories: async (params?: {
			type?: 'all' | 'owner' | 'member';
			sort?: 'created' | 'updated' | 'pushed' | 'full_name';
			direction?: 'asc' | 'desc';
			page?: number;
			perPage?: number;
		}): Promise<ReturnType<typeof listRepositories>> => {
			return listRepositories({
				config: pluginConfig,
				client,
				options: params,
				ctx,
			});
		},

		handleWebhook: async (params: {
			headers: Record<string, string | undefined>;
			payload: string | object;
			secret?: string;
		}): Promise<ReturnType<typeof handleGitHubWebhook>> => {
			return handleGitHubWebhook({
				config: pluginConfig,
				client,
				ctx,
				headers: params.headers,
				payload: params.payload,
				secret: params.secret,
			});
		},
	};
}

export type { GitHubPlugin, GitHubSchemaOverride, GitHubPluginContext };
