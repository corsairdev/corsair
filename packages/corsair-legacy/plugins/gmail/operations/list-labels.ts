import type {
	GmailClient,
	GmailPlugin,
	GmailPluginContext,
	ListLabelsResponse,
} from '../types';

export const listLabels = async ({
	config,
	client,
	ctx,
}: {
	config: GmailPlugin;
	client: GmailClient;
	ctx: GmailPluginContext;
}): Promise<ListLabelsResponse> => {
	if (!config.accessToken) {
		return {
			success: false,
			error:
				'Gmail access token not configured. Please add accessToken to corsair.config.ts plugins.gmail.accessToken',
		};
	}

	try {
		const result = await client.listLabels();

		// Database hook: Save labels to database if labels table exists
		if (ctx.db.labels && typeof ctx.db.labels.insert === 'function') {
			try {
				for (const label of result.labels) {
					await ctx.db.labels.insert({
						id: label.id,
						name: label.name,
						type: label.type,
						color: label.color?.backgroundColor || '',
					});
				}
			} catch (dbError: unknown) {
				console.warn('Failed to save labels to database:', dbError);
			}
		}

		return {
			success: true,
			data: {
				labels: result.labels.map((label) => ({
					id: label.id,
					name: label.name,
					type: label.type,
					color: label.color?.backgroundColor,
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
