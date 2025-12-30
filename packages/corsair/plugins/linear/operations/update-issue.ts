import type {
	LinearClient,
	LinearPlugin,
	LinearPluginContext,
	UpdateIssueResponse,
} from '../types';

export const updateIssue = async ({
	config,
	client,
	issueId,
	title,
	description,
	priority,
	stateId,
	assigneeId,
	ctx,
}: {
	config: LinearPlugin;
	client: LinearClient;
	issueId: string;
	title?: string;
	description?: string;
	priority?: number;
	stateId?: string;
	assigneeId?: string;
	ctx: LinearPluginContext;
}): Promise<UpdateIssueResponse> => {
	if (!config.apiKey) {
		return {
			success: false,
			error:
				'Linear API key not configured. Please add apiKey to corsair.config.ts plugins.linear.apiKey',
		};
	}

	try {
		const result = await client.updateIssue({
			id: issueId,
			title,
			description,
			priority,
			stateId,
			assigneeId,
		});

		const issue = result.issueUpdate.issue;

		// Database hook: Update issue in database if issues table exists
		if (ctx.db.issues && typeof ctx.db.issues.update === 'function') {
			try {
				await ctx.db.issues.update({
					id: issueId,
					title: issue.title,
					description: issue.description || '',
					priority: issue.priority,
					updated_at: issue.updatedAt,
				});
			} catch (dbError: unknown) {
				console.warn('Failed to update issue in database:', dbError);
			}
		}

		return {
			success: true,
			data: {
				id: issueId,
				title: issue.title,
				description: issue.description,
				priority: issue.priority,
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
