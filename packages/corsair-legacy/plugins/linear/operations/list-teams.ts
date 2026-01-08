import type {
	LinearClient,
	LinearPlugin,
	LinearPluginContext,
	ListTeamsResponse,
} from '../types';

export const listTeams = async ({
	config,
	client,
	ctx,
}: {
	config: LinearPlugin;
	client: LinearClient;
	ctx: LinearPluginContext;
}): Promise<ListTeamsResponse> => {
	if (!config.apiKey) {
		return {
			success: false,
			error:
				'Linear API key not configured. Please add apiKey to corsair.config.ts plugins.linear.apiKey',
		};
	}

	try {
		const result = await client.listTeams();

		// Database hook: Save teams to database if teams table exists
		if (ctx.db.teams && typeof ctx.db.teams.insert === 'function') {
			try {
				for (const team of result.teams.nodes) {
					await ctx.db.teams.insert({
						id: team.id,
						name: team.name,
						key: team.key,
					});
				}
			} catch (dbError: unknown) {
				console.warn('Failed to save teams to database:', dbError);
			}
		}

		return {
			success: true,
			data: {
				teams: result.teams.nodes,
			},
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred',
		};
	}
};
