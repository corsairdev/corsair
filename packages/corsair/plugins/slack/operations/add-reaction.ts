import { WebClient } from "@slack/web-api";
import type { BaseConfig } from "../../../config";
import type {
	EmojiName,
	MessageTs,
	ReactionResponse,
	SlackChannels,
} from "../types";

export const addReaction = async <T extends BaseConfig = any>({
	config,
	channelId,
	messageTs,
	emoji,
}: {
	config?: T;
	channelId: SlackChannels<T>;
	messageTs: MessageTs;
	emoji: EmojiName;
}): Promise<ReactionResponse> => {
	// Validate that Slack token is configured
	if (!config?.plugins?.slack?.token) {
		return {
			success: false,
			error:
				"Slack token not configured. Please add token to corsair.config.ts plugins.slack.token",
		};
	}

	// Look up actual channel ID from config using the friendly name
	const actualChannelId = config.plugins.slack.channels?.[channelId];
	if (!actualChannelId) {
		const availableChannels = Object.keys(
			config.plugins.slack.channels || {},
		).join(", ");
		return {
			success: false,
			error: `Channel '${channelId}' not found in config. Available channels: ${availableChannels}`,
		};
	}

	// Initialize Slack WebClient
	const client = new WebClient(config.plugins.slack.token);

	try {
		// Remove colons from emoji name if present (accepts both 'thumbsup' and ':thumbsup:')
		const emojiName = emoji.replace(/:/g, "");

		// Call Slack API to add reaction
		const result = await client.reactions.add({
			channel: actualChannelId,
			timestamp: messageTs,
			name: emojiName,
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
			error: error instanceof Error ? error.message : "Unknown error occurred",
		};
	}
};
