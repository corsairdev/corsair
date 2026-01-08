import {
	executeDatabaseHook,
	validateCredentials,
	wrapOperation,
	type BaseOperationParams,
} from '../../base';
import type {
	CreateIssueResponse,
	GitHubClient,
	GitHubPlugin,
	GitHubPluginContext,
} from '../types';

export const createIssue = async ({
	config,
	client,
	owner,
	repo,
	title,
	body,
	labels,
	assignees,
	ctx,
}: {
	config: GitHubPlugin;
	client: GitHubClient;
	owner: string;
	repo: string;
	title: string;
	body?: string;
	labels?: string[];
	assignees?: string[];
	ctx: GitHubPluginContext;
}): Promise<CreateIssueResponse> => {
	// Validate credentials
	const credentialCheck = validateCredentials(config, ['token'], 'github');
	if (!credentialCheck.valid) {
		return {
			success: false,
			error: credentialCheck.error,
		};
	}

	return wrapOperation(
		{ config, client, ctx },
		async (params: BaseOperationParams<GitHubPlugin, GitHubClient, GitHubPluginContext>) => {
			const result = await params.client.createIssue({
				owner,
				repo,
				title,
				body,
				labels,
				assignees,
			});

			return {
				id: result.id,
				number: result.number,
				title: result.title,
				body: result.body,
				state: result.state,
				author: result.user.login,
				createdAt: result.created_at,
				updatedAt: result.updated_at,
				closedAt: result.closed_at,
			};
		},
		{
			tableName: 'issues',
			transform: (data) => {
				const issue = data as {
					id: number;
					number: number;
					title: string;
					body: string;
					state: string;
					author: string;
					createdAt: string;
					updatedAt: string;
					closedAt: string | null;
				};
				return {
					id: issue.id.toString(),
					number: issue.number,
					title: issue.title,
					body: issue.body,
					state: issue.state,
					repo: `${owner}/${repo}`,
					author: issue.author,
					created_at: issue.createdAt,
					updated_at: issue.updatedAt,
					closed_at: issue.closedAt || '',
				};
			},
		},
	) as Promise<CreateIssueResponse>;
};
