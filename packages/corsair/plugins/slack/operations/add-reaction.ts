import type { SlackClient, SlackPlugin, SlackPluginContext } from '../types';
import type { ReactionResponse } from '../types';

export const addReaction = async ({
	config,
	client,
	channelId,
	messageTs,
	emoji,
	ctx,
}: {
	config: SlackPlugin;
	client: SlackClient;
	channelId: string;
	messageTs: string;
	emoji: string;
	ctx: SlackPluginContext;
}): Promise<ReactionResponse> => {
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
		// Call Slack API to add reaction
		const result = await client.addReaction({
			channel: actualChannelId,
			timestamp: messageTs,
			name: emoji,
		});

		// Return success response
		return {
			success: true,
			data: {
				ok: result.ok || false,
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
