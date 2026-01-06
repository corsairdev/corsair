import {
	executeDatabaseHook,
	validateCredentials,
	wrapOperation,
	type BaseOperationParams,
} from '../../base';
import type {
	CreateEventResponse,
	PostHogClient,
	PostHogPlugin,
	PostHogPluginContext,
} from '../types';

export const createEvent = async ({
	config,
	client,
	distinct_id,
	event,
	properties,
	timestamp,
	uuid,
	ctx,
}: {
	config: PostHogPlugin;
	client: PostHogClient;
	distinct_id: string;
	event: string;
	properties?: Record<string, unknown>;
	timestamp?: string;
	uuid?: string;
	ctx: PostHogPluginContext;
}): Promise<CreateEventResponse> => {
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
			const result = await params.client.createEvent({
				distinct_id,
				event,
				properties,
				timestamp,
				uuid,
			});

			return {
				success: typeof result === 'number' ? result === 1 : true,
				distinct_id,
				event,
				properties,
				timestamp: timestamp || new Date().toISOString(),
				uuid: uuid || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
			};
		},
		{
			tableName: 'events',
			transform: (data) => {
				const eventData = data as {
					distinct_id: string;
					event: string;
					properties?: Record<string, unknown>;
					timestamp: string;
					uuid: string;
				};
				return {
					id: eventData.uuid,
					distinct_id: eventData.distinct_id,
					event: eventData.event,
					properties: JSON.stringify(eventData.properties || {}),
					timestamp: eventData.timestamp,
					created_at: new Date().toISOString(),
				};
			},
		},
	) as Promise<CreateEventResponse>;
	) as Promise<CreateEventResponse>;
};

