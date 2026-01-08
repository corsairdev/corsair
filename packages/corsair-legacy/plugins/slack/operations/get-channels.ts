import type {
	ChannelsResponse,
	SlackClient,
	SlackPlugin,
	SlackPluginContext,
} from '../types';

export const getChannels = async ({
	config,
	client,
	options = {},
	ctx,
}: {
	config: SlackPlugin;
	client: SlackClient;
	options?: {
		types?: string; // e.g., 'public_channel,private_channel'
		exclude_archived?: boolean;
		limit?: number;
		cursor?: string; // for pagination
	};
	ctx: SlackPluginContext;
}): Promise<ChannelsResponse> => {
	// Validate that Slack token is configured
	if (!config.token) {
		return {
			success: false,
			error:
				'Slack token not configured. Please add token to corsair.config.ts plugins.slack.token',
		};
	}

	try {
		// Call Slack API to list channels
		const result = await client.getChannels({
			types: options.types,
			exclude_archived: options.exclude_archived,
			limit: options.limit,
			cursor: options.cursor,
		});

		// Database hook: Save channels to database if channels table exists
		if (ctx.db.channels && typeof ctx.db.channels.insert === 'function') {
			try {
				// Insert or update channels
				for (const channel of result.channels) {
					await ctx.db.channels.insert({
						id: channel.id,
						name: channel.name,
						is_private: channel.is_private,
						is_archived: channel.is_archived,
					});
				}
			} catch (dbError: unknown) {
				// Log but don't fail the operation if DB insert fails
				console.warn('Failed to save channels to database:', dbError);
			}
		}

		// Return success response with channels
		return {
			success: true,
			data: {
				channels: result.channels.map((channel) => ({
					id: channel.id,
					name: channel.name,
					is_private: channel.is_private,
					is_archived: channel.is_archived,
				})),
				hasMore: result.response_metadata?.next_cursor ? true : false,
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
