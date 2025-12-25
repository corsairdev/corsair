import type { GmailClient, GmailPlugin, GmailPluginContext } from '../types';
import type { GetMessageResponse } from '../types';

export const getMessage = async ({
	config,
	client,
	messageId,
	ctx,
}: {
	config: GmailPlugin;
	client: GmailClient;
	messageId: string;
	ctx: GmailPluginContext;
}): Promise<GetMessageResponse> => {
	if (!config.accessToken) {
		return {
			success: false,
			error:
				'Gmail access token not configured. Please add accessToken to corsair.config.ts plugins.gmail.accessToken',
		};
	}

	try {
		const result = await client.getMessage(messageId);

		// Extract headers
		const headers = result.payload.headers || [];
		const getHeader = (name: string) =>
			headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ||
			'';

		// Extract body
		let body = '';
		if (result.payload.body?.data) {
			body = Buffer.from(result.payload.body.data, 'base64').toString('utf-8');
		} else if (result.payload.parts) {
			for (const part of result.payload.parts) {
				if (part.body?.data) {
					body += Buffer.from(part.body.data, 'base64').toString('utf-8');
				}
			}
		}

		const messageData = {
			id: result.id,
			threadId: result.threadId,
			subject: getHeader('Subject'),
			from: getHeader('From'),
			to: getHeader('To'),
			body,
			date: new Date(parseInt(result.internalDate, 10)).toISOString(),
			labelIds: result.labelIds,
			snippet: result.snippet,
		};

		// Database hook: Save message to database if messages table exists
		if (ctx.db.messages && typeof ctx.db.messages.insert === 'function') {
			try {
				await ctx.db.messages.insert({
					...messageData,
					label_ids: messageData.labelIds.join(','),
				});
			} catch (dbError: unknown) {
				console.warn('Failed to save message to database:', dbError);
			}
		}

		return {
			success: true,
			data: messageData,
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred',
		};
	}
};

