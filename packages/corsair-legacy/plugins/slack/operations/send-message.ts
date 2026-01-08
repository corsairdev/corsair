import type {
	MessageResponse,
	SlackClient,
	SlackPlugin,
	SlackPluginContext,
} from '../types';

export const sendMessage = async ({
	config,
	client,
	channelId,
	content,
	ctx,
}: {
	config: SlackPlugin;
	client: SlackClient;
	channelId: string;
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
		// Call Slack API to send message
		const result = await client.postMessage({
			channel: actualChannelId,
			text: content,
		});

		// Database hook: Save message to database if messages table exists
		if (ctx.db.messages && typeof ctx.db.messages.insert === 'function') {
			try {
				await ctx.db.messages.insert({
					id: result.ts,
					content,
					channel_id: actualChannelId,
					user_id: ctx.userId || '',
					timestamp: result.ts,
					thread_ts: '',
				});
			} catch (dbError) {
				// Log but don't fail the operation if DB insert fails
				console.warn('Failed to save message to database:', dbError);
			}
		}

		// Return success response with message details
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
