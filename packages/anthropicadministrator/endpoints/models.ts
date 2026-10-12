import type { AnthropicAdministratorEndpoints } from '../index';
import { callStandardApi } from './shared';
import { AnthropicAdministratorEndpointOutputSchemas as OutputSchemas } from './types/index';

const BASE = '/v1/models';

/** GET /v1/models/{model_id} */
export const getModel: AnthropicAdministratorEndpoints['getModel'] = async (
	ctx,
	input,
) => {
	return callStandardApi(
		ctx,
		'models.getModel',
		OutputSchemas.getModel,
		`${BASE}/${encodeURIComponent(input.model_id)}`,
		{ method: 'GET' },
		{ model_id: input.model_id },
	);
};

/** GET /v1/models */
export const listModels: AnthropicAdministratorEndpoints['listModels'] = async (
	ctx,
	input,
) => {
	return callStandardApi(
		ctx,
		'models.listModels',
		OutputSchemas.listModels,
		BASE,
		{
			method: 'GET',
			query: {
				after_id: input.after_id,
				before_id: input.before_id,
				limit: input.limit,
				// Arrays use bracket keys, matching the official SDK's encoding.
				'lifecycle[]': input.lifecycle,
			},
		},
		{ limit: input.limit },
	);
};
