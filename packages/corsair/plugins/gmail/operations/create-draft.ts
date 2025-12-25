import type { GmailClient, GmailPlugin, GmailPluginContext } from '../types';
import type { CreateDraftResponse } from '../types';

export const createDraft = async ({
	config,
	client,
	to,
	subject,
	body,
	ctx,
}: {
	config: GmailPlugin;
	client: GmailClient;
	to: string;
	subject: string;
	body: string;
	ctx: GmailPluginContext;
}): Promise<CreateDraftResponse> => {
	if (!config.accessToken) {
		return {
			success: false,
			error:
				'Gmail access token not configured. Please add accessToken to corsair.config.ts plugins.gmail.accessToken',
		};
	}

	try {
		const result = await client.createDraft({
			to,
			subject,
			body,
		});

		// Database hook: Save draft to database if drafts table exists
		if (ctx.db.drafts && typeof ctx.db.drafts.insert === 'function') {
			try {
				await ctx.db.drafts.insert({
					id: result.id,
					message_id: result.message.id,
					subject,
					to,
					body,
				});
			} catch (dbError: unknown) {
				console.warn('Failed to save draft to database:', dbError);
			}
		}

		return {
			success: true,
			data: {
				id: result.id,
				messageId: result.message.id,
			},
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred',
		};
	}
};

