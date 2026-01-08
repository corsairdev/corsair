import type {
	GetThreadResponse,
	GmailClient,
	GmailPlugin,
	GmailPluginContext,
} from '../types';

export const getThread = async ({
	config,
	client,
	threadId,
	ctx,
}: {
	config: GmailPlugin;
	client: GmailClient;
	threadId: string;
	ctx: GmailPluginContext;
}): Promise<GetThreadResponse> => {
	if (!config.accessToken) {
		return {
			success: false,
			error:
				'Gmail access token not configured. Please add accessToken to corsair.config.ts plugins.gmail.accessToken',
		};
	}

	try {
		const result = await client.getThread(threadId);

		// Database hook: Save thread to database if threads table exists
		if (ctx.db.threads && typeof ctx.db.threads.insert === 'function') {
			try {
				await ctx.db.threads.insert({
					id: result.id,
					history_id: result.historyId,
					snippet: result.messages[0]?.snippet || '',
				});
			} catch (dbError: unknown) {
				console.warn('Failed to save thread to database:', dbError);
			}
		}

		return {
			success: true,
			data: {
				id: result.id,
				historyId: result.historyId,
				messages: result.messages,
			},
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred',
		};
	}
};
