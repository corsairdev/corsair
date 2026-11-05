import type { AnthropicAdministratorEndpoints } from '../index';
import { cacheEntity, cacheList, callAdminApi } from './shared';
import type { ApiKey } from './types/index';
import { AnthropicAdministratorEndpointOutputSchemas as OutputSchemas } from './types/index';

const BASE = '/v1/organizations/api_keys';

/** GET /v1/organizations/api_keys */
export const listApiKeys: AnthropicAdministratorEndpoints['listApiKeys'] =
	async (ctx, input) => {
		const response = await callAdminApi(
			ctx,
			'apiKeys.listApiKeys',
			OutputSchemas.listApiKeys,
			BASE,
			{
				method: 'GET',
				query: {
					after_id: input.after_id,
					before_id: input.before_id,
					created_by_user_id: input.created_by_user_id,
					limit: input.limit,
					status: input.status,
					workspace_id: input.workspace_id,
				},
			},
		);

		await cacheList(ctx, 'apiKeys', response.data, (k: ApiKey) => k.id);
		return response;
	};

/** GET /v1/organizations/api_keys/{api_key_id} */
export const getApiKey: AnthropicAdministratorEndpoints['getApiKey'] = async (
	ctx,
	input,
) => {
	const response = await callAdminApi(
		ctx,
		'apiKeys.getApiKey',
		OutputSchemas.getApiKey,
		`${BASE}/${encodeURIComponent(input.api_key_id)}`,
		{ method: 'GET' },
		{ api_key_id: input.api_key_id },
	);

	await cacheEntity(ctx, 'apiKeys', response.id, response);
	return response;
};

/** POST /v1/organizations/api_keys/{api_key_id} */
export const updateApiKey: AnthropicAdministratorEndpoints['updateApiKey'] =
	async (ctx, input) => {
		const response = await callAdminApi(
			ctx,
			'apiKeys.updateApiKey',
			OutputSchemas.updateApiKey,
			`${BASE}/${encodeURIComponent(input.api_key_id)}`,
			{
				method: 'POST',
				body: { name: input.name, status: input.status },
			},
			{ api_key_id: input.api_key_id },
		);

		await cacheEntity(ctx, 'apiKeys', response.id, response);
		return response;
	};
