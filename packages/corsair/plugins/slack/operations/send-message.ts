import {
	createErrorResponse,
	createSuccessResponse,
	executeDatabaseHook,
	validateCredentials,
} from '../../base';
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
	// Validate credentials
	const credentialCheck = validateCredentials(config, ['token'], 'slack');
	if (!credentialCheck.valid) {
		return createErrorResponse(
			new Error(credentialCheck.error),
			credentialCheck.error,
		) as MessageResponse;
	}

	// Look up actual channel ID from config using the friendly name
	const actualChannelId = config.channels?.[channelId];
	if (!actualChannelId) {
		const availableChannels = Object.keys(config.channels || {}).join(', ');
		return createErrorResponse(
			new Error(
				`Channel '${channelId}' not found in config. Available channels: ${availableChannels}`,
			),
		) as MessageResponse;
	}

	try {
		// Call Slack API to send message
		const result = await client.postMessage({
			channel: actualChannelId,
			text: content,
		});

		const responseData = {
			messageId: result.ts,
			channel: result.channel,
			timestamp: result.ts,
		};

		// Database hook: Save message to database if messages table exists
		await executeDatabaseHook(
			ctx,
			{
				tableName: 'messages',
				transform: () => ({
					id: result.ts,
					content,
					channel_id: actualChannelId,
					user_id: ctx.userId || '',
					timestamp: result.ts,
					thread_ts: '',
				}),
			},
			responseData,
		);

		return createSuccessResponse(responseData) as MessageResponse;
	} catch (error) {
		return createErrorResponse(error) as MessageResponse;
	}
};
