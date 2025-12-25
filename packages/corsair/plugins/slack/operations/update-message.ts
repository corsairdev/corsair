import type { SlackClient, SlackPlugin, SlackPluginContext } from '../types';
import type { MessageResponse } from '../types';

export const updateMessage = async ({
	config,
	client,
	channelId,
	messageTs,
	content,
	ctx,
}: {
	config: SlackPlugin;
	client: SlackClient;
	channelId: string;
	messageTs: string;
	content: string;
	ctx: SlackPluginContext;
}): Promise<MessageResponse> => {
	// Validate that Slack token is configured
	if (!config.token) {
		return {
			success: false,
			error:
				'Slack token not configured. Please add token to corsair.config.ts plugins.slack.token',
		};
	}

	// Look up actual channel ID from config using the friendly name
	const actualChannelId = config.channels?.[channelId];
	if (!actualChannelId) {
		const availableChannels = Object.keys(config.channels || {}).join(', ');
		return {
			success: false,
			error: `Channel '${channelId}' not found in config. Available channels: ${availableChannels}`,
		};
	}

	try {
		// Call Slack API to update message
		const result = await client.updateMessage({
			channel: actualChannelId,
			ts: messageTs,
			text: content,
		});

		// Database hook: Update message in database if messages table exists
		if (ctx.db.messages && typeof ctx.db.messages.update === 'function') {
			try {
				await ctx.db.messages.update({
					id: messageTs,
					content,
				});
			} catch (dbError) {
				// Log but don't fail the operation if DB update fails
				console.warn('Failed to update message in database:', dbError);
			}
		}

		// Return success response with updated message details
		return {
			success: true,
			data: {
				messageId: result.ts,
				channel: result.channel,
				timestamp: result.ts,
			},
		};
	} catch (error) {
		// Handle any Slack API errors
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred',
		};
	}
};
