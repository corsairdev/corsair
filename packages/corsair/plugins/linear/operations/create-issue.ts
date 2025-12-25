import type { LinearClient, LinearPlugin, LinearPluginContext } from '../types';
import type { CreateIssueResponse } from '../types';

export const createIssue = async ({
	config,
	client,
	title,
	description,
	teamId,
	priority,
	stateId,
	assigneeId,
	ctx,
}: {
	config: LinearPlugin;
	client: LinearClient;
	title: string;
	description?: string;
	teamId: string;
	priority?: number;
	stateId?: string;
	assigneeId?: string;
	ctx: LinearPluginContext;
}): Promise<CreateIssueResponse> => {
	if (!config.apiKey) {
		return {
			success: false,
			error:
				'Linear API key not configured. Please add apiKey to corsair.config.ts plugins.linear.apiKey',
		};
	}

	try {
		const result = await client.createIssue({
			title,
			description,
			teamId,
			priority,
			stateId,
			assigneeId,
		});

		const issue = result.issueCreate.issue;

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
					assignee_id: assigneeId || '',
					creator_id: ctx.userId || '',
					number: issue.number,
					url: issue.url,
					created_at: issue.createdAt,
					updated_at: issue.createdAt,
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
				createdAt: issue.createdAt,
			},
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred',
		};
	}
};

