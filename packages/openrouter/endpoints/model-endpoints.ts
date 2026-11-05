import type { OpenRouterEndpoints } from './..';
import { makeOpenRouterRequest } from '../client';
import type { ListModelEndpointsResponse } from './types';

export const listModelEndpoints: OpenRouterEndpoints['modelsEndpointsList'] =
	async (ctx, input) => {
		const result = await makeOpenRouterRequest<ListModelEndpointsResponse>(
			`models/${encodeURIComponent(input.author)}/${encodeURIComponent(input.slug)}/endpoints`,
			ctx.key,
		);

		return result;
	};
