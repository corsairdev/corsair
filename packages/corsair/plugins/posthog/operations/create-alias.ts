import {
	executeDatabaseHook,
	validateCredentials,
	wrapOperation,
	type BaseOperationParams,
} from '../../base';
import type {
	CreateAliasResponse,
	PostHogClient,
	PostHogPlugin,
	PostHogPluginContext,
} from '../types';

export const createAlias = async ({
	config,
	client,
	distinct_id,
	alias,
	ctx,
}: {
	config: PostHogPlugin;
	client: PostHogClient;
	distinct_id: string;
	alias: string;
	ctx: PostHogPluginContext;
}): Promise<CreateAliasResponse> => {
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
			const result = await params.client.createAlias({
				distinct_id,
				alias,
			});

			return {
				success: typeof result === 'number' ? result === 1 : true,
				distinct_id,
				alias,
			};
		},
		{
			tableName: 'aliases',
			transform: (data) => {
				const aliasData = data as {
					distinct_id: string;
					alias: string;
				};
				return {
					id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
					distinct_id: aliasData.distinct_id,
					alias: aliasData.alias,
					created_at: new Date().toISOString(),
				};
			},
		},
	) as Promise<CreateAliasResponse>;
};

