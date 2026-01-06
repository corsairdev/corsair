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
	TrackScreenResponse,
} from '../types';

export const trackScreen = async ({
	config,
	client,
	distinct_id,
	screen_name,
	properties,
	timestamp,
	uuid,
	ctx,
}: {
	config: PostHogPlugin;
	client: PostHogClient;
	distinct_id: string;
	screen_name: string;
	properties?: Record<string, unknown>;
	timestamp?: string;
	uuid?: string;
	ctx: PostHogPluginContext;
}): Promise<TrackScreenResponse> => {
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
			const result = await params.client.trackScreen({
				distinct_id,
				screen_name,
				properties,
				timestamp,
				uuid,
			});

			return {
				success: typeof result === 'number' ? result === 1 : true,
				distinct_id,
				screen_name,
				properties,
				timestamp: timestamp || new Date().toISOString(),
				uuid: uuid || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			};
		},
		{
			tableName: 'screens',
			transform: (data) => {
				const screenData = data as {
					distinct_id: string;
					screen_name: string;
					properties?: Record<string, unknown>;
					timestamp: string;
					uuid: string;
				};
				return {
					id: screenData.uuid,
					distinct_id: screenData.distinct_id,
					screen_name: screenData.screen_name,
					properties: JSON.stringify(screenData.properties || {}),
					timestamp: screenData.timestamp,
					created_at: new Date().toISOString(),
				};
			},
		},
	) as Promise<TrackScreenResponse>;
};

