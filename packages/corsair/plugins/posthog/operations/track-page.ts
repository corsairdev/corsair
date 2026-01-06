import {
	executeDatabaseHook,
	validateCredentials,
	wrapOperation,
	type BaseOperationParams,
} from '../../base';
import type {
	PostHogClient,
	PostHogPlugin,
	PostHogPluginContext,
	TrackPageResponse,
} from '../types';

export const trackPage = async ({
	config,
	client,
	distinct_id,
	url,
	properties,
	timestamp,
	uuid,
	ctx,
}: {
	config: PostHogPlugin;
	client: PostHogClient;
	distinct_id: string;
	url: string;
	properties?: Record<string, unknown>;
	timestamp?: string;
	uuid?: string;
	ctx: PostHogPluginContext;
}): Promise<TrackPageResponse> => {
	// Validate credentials
	const credentialCheck = validateCredentials(config, ['apiKey'], 'posthog');
	if (!credentialCheck.valid) {
		return {
			success: false,
			error: credentialCheck.error,
		};
	}

	return wrapOperation(
		{ config, client, ctx },
		async (
			params: BaseOperationParams<PostHogPlugin, PostHogClient, PostHogPluginContext>,
		) => {
			const result = await params.client.trackPage({
				distinct_id,
				url,
				properties,
				timestamp,
				uuid,
			});

			return {
				success: typeof result === 'number' ? result === 1 : true,
				distinct_id,
				url,
				properties,
				timestamp: timestamp || new Date().toISOString(),
				uuid: uuid || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			};
		},
		{
			tableName: 'pageviews',
			transform: (data) => {
				const pageData = data as {
					distinct_id: string;
					url: string;
					properties?: Record<string, unknown>;
					timestamp: string;
					uuid: string;
				};
				return {
					id: pageData.uuid,
					distinct_id: pageData.distinct_id,
					url: pageData.url,
					properties: JSON.stringify(pageData.properties || {}),
					timestamp: pageData.timestamp,
					created_at: new Date().toISOString(),
				};
			},
		},
	) as Promise<TrackPageResponse>;
};

