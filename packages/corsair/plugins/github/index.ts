import { createGitHubClient } from './client';
import type {
	GitHubDatabaseContext,
	GitHubPlugin,
	GitHubPluginContext,
	GitHubSchemaOverride,
} from './types';
import { createIssue } from './operations/create-issue';
import { getIssue } from './operations/get-issue';
import { listIssues } from './operations/list-issues';
import { listPullRequests } from './operations/list-pull-requests';
import { listRepositories } from './operations/list-repositories';

/**
 * Creates a GitHub plugin instance with database access
 */
export function createGitHubPlugin<
	TSchemaOverride extends GitHubSchemaOverride = GitHubSchemaOverride,
	TDatabase extends GitHubDatabaseContext<TSchemaOverride> = GitHubDatabaseContext<TSchemaOverride>,
>(config: GitHubPlugin, db: TDatabase) {
	const client = createGitHubClient(config.token);

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
				config,
				client,
				owner: params.owner,
				repo: params.repo,
				title: params.title,
				body: params.body,
				labels: params.labels,
				assignees: params.assignees,
				ctx: { db, userId: undefined },
			});
		},

		getIssue: async (params: {
			owner: string;
			repo: string;
			issueNumber: number;
		}): Promise<ReturnType<typeof getIssue>> => {
			return getIssue({
				config,
				client,
				owner: params.owner,
				repo: params.repo,
				issueNumber: params.issueNumber,
				ctx: { db, userId: undefined },
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
				config,
				client,
				owner: params.owner,
				repo: params.repo,
				state: params.state,
				page: params.page,
				perPage: params.perPage,
				ctx: { db, userId: undefined },
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
				config,
				client,
				owner: params.owner,
				repo: params.repo,
				state: params.state,
				page: params.page,
				perPage: params.perPage,
				ctx: { db, userId: undefined },
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
				config,
				client,
				options: params,
				ctx: { db, userId: undefined },
			});
		},
	};
}

export type { GitHubPlugin, GitHubSchemaOverride, GitHubPluginContext };

