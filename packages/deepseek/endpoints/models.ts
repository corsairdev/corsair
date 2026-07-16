import { logEventFromContext } from 'corsair/core';
import { makeDeepseekRequest } from '../client';
import type { DeepseekEndpoints } from '../index';
import type { ListModelsResponse } from '../schema/models';

export const list: DeepseekEndpoints['modelsList'] = async (ctx) => {
	const result = await makeDeepseekRequest<ListModelsResponse>(
		'models',
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'deepseek.models.list', {}, 'completed');
	return result;
};
