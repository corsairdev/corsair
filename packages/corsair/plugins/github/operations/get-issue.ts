import type { GitHubClient, GitHubPlugin, GitHubPluginContext } from '../types';
import type { GetIssueResponse } from '../types';

export const getIssue = async ({
	config,
	client,
	owner,
	repo,
	issueNumber,
	ctx,
}: {
	config: GitHubPlugin;
	client: GitHubClient;
	owner: string;
	repo: string;
	issueNumber: number;
	ctx: GitHubPluginContext;
}): Promise<GetIssueResponse> => {
	if (!config.token) {
		return {
			success: false,
			error:
				'GitHub token not configured. Please add token to corsair.config.ts plugins.github.token',
		};
	}

	try {
		const result = await client.getIssue({
			owner,
			repo,
			issueNumber,
		});

		const issueData = {
			id: result.id.toString(),
			number: result.number,
			title: result.title,
			body: result.body,
			state: result.state,
			repo: `${owner}/${repo}`,
			author: result.user.login,
			created_at: result.created_at,
			updated_at: result.updated_at,
			closed_at: result.closed_at || '',
		};

		// Database hook: Save issue to database if issues table exists
		if (ctx.db.issues && typeof ctx.db.issues.insert === 'function') {
			try {
				await ctx.db.issues.insert(issueData);
			} catch (dbError: unknown) {
				console.warn('Failed to save issue to database:', dbError);
			}
		}

		return {
			success: true,
			data: {
				id: result.id,
				number: result.number,
				title: result.title,
				body: result.body,
				state: result.state,
				author: result.user.login,
				createdAt: result.created_at,
				updatedAt: result.updated_at,
				closedAt: result.closed_at,
			},
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred',
		};
	}
};

