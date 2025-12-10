import { WebClient } from '@slack/web-api';
import type { BaseConfig } from '../../../config';
import type { MessageResponse, MessageTs, SlackChannels } from '../types';

export const updateMessage = async <T extends BaseConfig = any>({
	config,
	channelId,
	messageTs,
	newContent,
}: {
	config?: T;
	channelId: SlackChannels<T>;
	messageTs: MessageTs;
	newContent: string;
}): Promise<MessageResponse> => {
	// Validate that Slack token is configured
	if (!config?.plugins?.slack?.token) {
		return {
			success: false,
			error:
				'Slack token not configured. Please add token to corsair.config.ts plugins.slack.token',
		};
	}

	// Look up actual channel ID from config using the friendly name
	const actualChannelId = config.plugins.slack.channels?.[channelId];
	if (!actualChannelId) {
		const availableChannels = Object.keys(
			config.plugins.slack.channels || {},
		).join(', ');
		return {
			success: false,
			error: `Channel '${channelId}' not found in config. Available channels: ${availableChannels}`,
		};
	}

	// Initialize Slack WebClient
	const client = new WebClient(config.plugins.slack.token);

	try {
		// Call Slack API to update message
		const result = await client.chat.update({
			channel: actualChannelId,
			ts: messageTs,
			text: newContent,
		});

		// Return success response with updated message details
		return {
			success: true,
			data: {
				messageId: result.ts as string,
				channel: result.channel as string,
				timestamp: result.ts as string,
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
