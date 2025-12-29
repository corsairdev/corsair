import type { GmailClient, GmailPlugin, GmailPluginContext } from '../types';
import type { SendMessageResponse } from '../types';

export const sendMessage = async ({
	config,
	client,
	to,
	subject,
	body,
	threadId,
	ctx,
}: {
	config: GmailPlugin;
	client: GmailClient;
	to: string;
	subject: string;
	body: string;
	threadId?: string;
	ctx: GmailPluginContext;
}): Promise<SendMessageResponse> => {
	if (!config.accessToken) {
		return {
			success: false,
			error:
				'Gmail access token not configured. Please add accessToken to corsair.config.ts plugins.gmail.accessToken',
		};
	}

	try {
		const result = await client.sendMessage({
			to,
			subject,
			body,
			threadId,
		});

		// Database hook: Save message to database if messages table exists
		if (ctx.db.messages && typeof ctx.db.messages.insert === 'function') {
			try {
				await ctx.db.messages.insert({
					id: result.id,
					thread_id: result.threadId,
					subject,
					from: config.userId || 'me',
					to,
					body,
					date: new Date().toISOString(),
					label_ids: result.labelIds.join(','),
				});
			} catch (dbError: unknown) {
				console.warn('Failed to save message to database:', dbError);
			}
		}

		return {
			success: true,
			data: {
				messageId: result.id,
				threadId: result.threadId,
				labelIds: result.labelIds,
			},
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred',
		};
	}
};

