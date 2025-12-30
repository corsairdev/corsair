import type {
	GitHubClient,
	GitHubPlugin,
	GitHubPluginContext,
	ListPullRequestsResponse,
} from '../types';

export const listPullRequests = async ({
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
}): Promise<ListPullRequestsResponse> => {
	if (!config.token) {
		return {
			success: false,
			error:
				'GitHub token not configured. Please add token to corsair.config.ts plugins.github.token',
		};
	}

	try {
		const result = await client.listPullRequests({
			owner,
			repo,
			state: state || 'open',
			page,
			perPage,
		});

		// Database hook: Save pull requests to database if pull_requests table exists
		if (
			ctx.db.pull_requests &&
			typeof ctx.db.pull_requests.insert === 'function'
		) {
			try {
				for (const pr of result) {
					await ctx.db.pull_requests.insert({
						id: pr.id.toString(),
						number: pr.number,
						title: pr.title,
						body: pr.body,
						state: pr.state,
						repo: `${owner}/${repo}`,
						author: pr.user.login,
						head: pr.head.ref,
						base: pr.base.ref,
						created_at: pr.created_at,
						updated_at: pr.updated_at,
						merged_at: pr.merged_at || '',
					});
				}
			} catch (dbError: unknown) {
				console.warn('Failed to save pull requests to database:', dbError);
			}
		}

		return {
			success: true,
			data: {
				pullRequests: result.map((pr) => ({
					id: pr.id,
					number: pr.number,
					title: pr.title,
					body: pr.body,
					state: pr.state,
					author: pr.user.login,
					head: pr.head.ref,
					base: pr.base.ref,
					createdAt: pr.created_at,
					updatedAt: pr.updated_at,
					mergedAt: pr.merged_at,
				})),
			},
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred',
		};
	}
};
