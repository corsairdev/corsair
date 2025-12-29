import type {
	GmailClient,
	GmailPlugin,
	GmailPluginContext,
	ListMessagesResponse,
} from '../types';

export const listMessages = async ({
	config,
	client,
	options,
	ctx,
}: {
	config: GmailPlugin;
	client: GmailClient;
	options?: {
		maxResults?: number;
		pageToken?: string;
		q?: string;
		labelIds?: string[];
	};
	ctx: GmailPluginContext;
}): Promise<ListMessagesResponse> => {
	if (!config.accessToken) {
		return {
			success: false,
			error:
				'Gmail access token not configured. Please add accessToken to corsair.config.ts plugins.gmail.accessToken',
		};
	}

	try {
		const result = await client.listMessages(options);

		return {
			success: true,
			data: {
				messages: result.messages,
				nextPageToken: result.nextPageToken,
				resultSizeEstimate: result.resultSizeEstimate,
			},
		};
	} catch (error) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error occurred',
		};
	}
};
