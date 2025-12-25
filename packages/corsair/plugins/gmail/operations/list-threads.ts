import type { GmailClient, GmailPlugin, GmailPluginContext } from '../types';
import type { ListThreadsResponse } from '../types';

export const listThreads = async ({
	config,
	client,
	options,
	ctx,
}: {
	config: GmailPlugin;
	client: GmailClient;
	options?: {
		maxResults?: number;
		pageToken?: string;
		q?: string;
		labelIds?: string[];
	};
	ctx: GmailPluginContext;
}): Promise<ListThreadsResponse> => {
	if (!config.accessToken) {
		return {
			success: false,
			error:
				'Gmail access token not configured. Please add accessToken to corsair.config.ts plugins.gmail.accessToken',
		};
	}

	try {
		const result = await client.listThreads(options);

		// Database hook: Save threads to database if threads table exists
		if (ctx.db.threads && typeof ctx.db.threads.insert === 'function') {
			try {
				for (const thread of result.threads) {
					await ctx.db.threads.insert({
						id: thread.id,
						history_id: thread.historyId,
						snippet: thread.snippet,
					});
				}
			} catch (dbError: unknown) {
				console.warn('Failed to save threads to database:', dbError);
			}
		}

		return {
			success: true,
			data: {
				threads: result.threads,
				nextPageToken: result.nextPageToken,
				resultSizeEstimate: result.resultSizeEstimate,
			},
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred',
		};
	}
};

