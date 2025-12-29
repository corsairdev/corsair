import type { BaseConfig } from '../../../config';
import type { ChannelsResponse } from '../types';

export const getChannels = async <T extends BaseConfig = any>({
	config,
	options = {},
}: {
	config?: T;
	options?: {
		types?: string; // e.g., 'public_channel,private_channel'
		exclude_archived?: boolean;
		limit?: number;
		cursor?: string; // for pagination
	};
}): Promise<ChannelsResponse> => {
	// Validate that Slack token is configured
	if (!config?.plugins?.slack?.token) {
		return {
			success: false,
			error:
				'Slack token not configured. Please add token to corsair.config.ts plugins.slack.token',
		};
	}

	// Dynamically import Slack WebClient
	const slackModule = '@slack/web-api';
	const { WebClient } = await import(
		/* @vite-ignore */
		/* webpackIgnore: true */
		slackModule
	);
	const client = new WebClient(config.plugins.slack.token);

	try {
		// Call Slack API to list channels
		const result = await client.conversations.list({
			types: options.types,
			exclude_archived: options.exclude_archived,
			limit: options.limit,
			cursor: options.cursor,
		});

		// Return success response with channels
		return {
			success: true,
			data: {
				channels: (result.channels || []).map((channel: any) => ({
					id: channel.id,
					name: channel.name,
					is_private: channel.is_private || false,
					is_archived: channel.is_archived || false,
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
