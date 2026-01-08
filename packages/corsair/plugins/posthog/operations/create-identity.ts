import {
	executeDatabaseHook,
	validateCredentials,
	wrapOperation,
	type BaseOperationParams,
} from '../../base';
import type {
	CreateIdentityResponse,
	PostHogClient,
	PostHogPlugin,
	PostHogPluginContext,
} from '../types';

export const createIdentity = async ({
	config,
	client,
	distinct_id,
	properties,
	ctx,
}: {
	config: PostHogPlugin;
	client: PostHogClient;
	distinct_id: string;
	properties?: Record<string, unknown>;
	ctx: PostHogPluginContext;
}): Promise<CreateIdentityResponse> => {
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
			const result = await params.client.createIdentity({
				distinct_id,
				properties,
			});

			return {
				success: typeof result === 'number' ? result === 1 : true,
				distinct_id,
			};
		},
		{
			tableName: 'identities',
			transform: (data) => {
				const identityData = data as {
					distinct_id: string;
					properties?: Record<string, unknown>;
				};
				return {
					id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
					distinct_id: identityData.distinct_id,
					properties: JSON.stringify(identityData.properties || {}),
					created_at: new Date().toISOString(),
				};
			},
		},
	) as Promise<CreateIdentityResponse>;
};

