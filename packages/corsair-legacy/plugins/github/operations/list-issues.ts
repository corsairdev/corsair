import {
	createErrorResponse,
	createSuccessResponse,
	validateCredentials,
} from '../../base';
import type {
	GitHubClient,
	GitHubPlugin,
	GitHubPluginContext,
	ListIssuesResponse,
} from '../types';

export const listIssues = async ({
	config,
	client,
	owner,
	repo,
	state,
	page,
	perPage,
	ctx,
}: {
	config: GitHubPlugin;
	client: GitHubClient;
	owner: string;
	repo: string;
	state?: 'open' | 'closed' | 'all';
	page?: number;
	perPage?: number;
	ctx: GitHubPluginContext;
}): Promise<ListIssuesResponse> => {
	// Validate credentials
	const credentialCheck = validateCredentials(config, ['token'], 'github');
	if (!credentialCheck.valid) {
		return createErrorResponse(
			new Error(credentialCheck.error),
			credentialCheck.error,
		) as ListIssuesResponse;
	}

	try {
		const result = await client.listIssues({
			owner,
			repo,
			state: state || 'open',
			page,
			perPage,
		});

		const responseData = {
			issues: result.map((issue) => ({
				id: issue.id,
				number: issue.number,
				title: issue.title,
				body: issue.body,
				state: issue.state,
				author: issue.user.login,
				createdAt: issue.created_at,
				updatedAt: issue.updated_at,
				closedAt: issue.closed_at,
			})),
		};

		// Database hook: Save issues to database if issues table exists
		if (ctx.db.issues && typeof ctx.db.issues.insert === 'function') {
			try {
				for (const issue of result) {
					await ctx.db.issues.insert({
						id: issue.id.toString(),
						number: issue.number,
						title: issue.title,
						body: issue.body,
						state: issue.state,
						repo: `${owner}/${repo}`,
						author: issue.user.login,
						created_at: issue.created_at,
						updated_at: issue.updated_at,
						closed_at: issue.closed_at || '',
					});
				}
			} catch (dbError: unknown) {
				console.warn('Failed to save issues to database:', dbError);
			}
		}

		return createSuccessResponse(responseData) as ListIssuesResponse;
	} catch (error) {
		return createErrorResponse(error) as ListIssuesResponse;
	}
};
