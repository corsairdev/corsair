import type { AnthropicAdministratorEndpoints } from '../index';
import { callAdminApi, compact } from './shared';
import type { AnthropicAdministratorEndpointOutputs as Outputs } from './types/index';

export const ModelsEndpoints: Pick<
	AnthropicAdministratorEndpoints,
	'getModel' | 'listModels'
> = {
	getModel: async (ctx, input) => {
		return callAdminApi<Outputs['getModel']>(
			ctx,
			'models.getModel',
			`/v1/models/${encodeURIComponent(input.model_id)}`,
			{ method: 'GET' },
			{ model_id: input.model_id },
		);
	},
	listModels: async (ctx, input) => {
		const query = compact({
			limit: input.limit,
			before_id: input.before_id,
			after_id: input.after_id,
		}) as Record<string, string | number | boolean | string[] | undefined>;

		return callAdminApi<Outputs['listModels']>(
			ctx,
			'models.listModels',
			'/v1/models',
			{ method: 'GET', query },
			{ limit: input.limit },
		);
	},
};
