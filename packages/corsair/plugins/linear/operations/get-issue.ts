import type { LinearClient, LinearPlugin, LinearPluginContext } from '../types';
import type { GetIssueResponse } from '../types';

export const getIssue = async ({
	config,
	client,
	issueId,
	ctx,
}: {
	config: LinearPlugin;
	client: LinearClient;
	issueId: string;
	ctx: LinearPluginContext;
}): Promise<GetIssueResponse> => {
	if (!config.apiKey) {
		return {
			success: false,
			error:
				'Linear API key not configured. Please add apiKey to corsair.config.ts plugins.linear.apiKey',
		};
	}

	try {
		const result = await client.getIssue(issueId);
		const issue = result.issue;

		// Database hook: Save issue to database if issues table exists
		if (ctx.db.issues && typeof ctx.db.issues.insert === 'function') {
			try {
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
			} catch (dbError: unknown) {
				console.warn('Failed to save issue to database:', dbError);
			}
		}

		return {
			success: true,
			data: {
				id: issue.id,
				title: issue.title,
				description: issue.description,
				priority: issue.priority,
				number: issue.number,
				url: issue.url,
				state: issue.state,
				team: issue.team,
				assignee: issue.assignee,
				creator: issue.creator,
				createdAt: issue.createdAt,
				updatedAt: issue.updatedAt,
			},
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred',
		};
	}
};

