import type {
	MessagesResponse,
	SlackClient,
	SlackPlugin,
	SlackPluginContext,
} from '../types';

export const getMessages = async ({
	config,
	client,
	channelId,
	options = {},
	ctx,
}: {
	config: SlackPlugin;
	client: SlackClient;
	channelId: string;
	options?: {
		limit?: number; // default 100, max 1000
		oldest?: string; // only messages after this timestamp
		latest?: string; // only messages before this timestamp
		cursor?: string; // for pagination
	};
	ctx: SlackPluginContext;
}): Promise<MessagesResponse> => {
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
		// Default limit to 100, max 1000
		const limit = Math.min(options.limit || 100, 1000);

		// Call Slack API to get messages
		const result = await client.getMessages({
			channel: actualChannelId,
			limit,
			oldest: options.oldest,
			latest: options.latest,
			cursor: options.cursor,
		});

		// Return success response with messages
		return {
			success: true,
			data: {
				messages: result.messages.map((msg) => ({
					type: msg.type,
					user: msg.user,
					text: msg.text,
					ts: msg.ts,
					thread_ts: msg.thread_ts,
				})),
				hasMore: result.has_more || false,
				nextCursor: result.response_metadata?.next_cursor,
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
