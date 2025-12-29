import type {
	LinearClient,
	LinearPlugin,
	LinearPluginContext,
	ListIssuesResponse,
} from '../types';

export const listIssues = async ({
	config,
	client,
	options,
	ctx,
}: {
	config: LinearPlugin;
	client: LinearClient;
	options?: {
		teamId?: string;
		first?: number;
		after?: string;
	};
	ctx: LinearPluginContext;
}): Promise<ListIssuesResponse> => {
	if (!config.apiKey) {
		return {
			success: false,
			error:
				'Linear API key not configured. Please add apiKey to corsair.config.ts plugins.linear.apiKey',
		};
	}

	try {
		const result = await client.listIssues({
			teamId: options?.teamId || config.teamId,
			first: options?.first,
			after: options?.after,
		});

		// Database hook: Save issues to database if issues table exists
		if (ctx.db.issues && typeof ctx.db.issues.insert === 'function') {
			try {
				for (const issue of result.issues.nodes) {
					await ctx.db.issues.insert({
						id: issue.id,
						title: issue.title,
						description: issue.description || '',
						priority: issue.priority,
						state_id: issue.state.id,
						team_id: issue.team.id,
						assignee_id: issue.assignee?.id || '',
						creator_id: issue.creator.id,
						number: issue.number,
						url: issue.url,
						created_at: issue.createdAt,
						updated_at: issue.updatedAt,
					});
				}
			} catch (dbError: unknown) {
				console.warn('Failed to save issues to database:', dbError);
			}
		}

		return {
			success: true,
			data: {
				issues: result.issues.nodes,
				hasNextPage: result.issues.pageInfo.hasNextPage,
				nextCursor: result.issues.pageInfo.endCursor,
			},
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred',
		};
	}
};
