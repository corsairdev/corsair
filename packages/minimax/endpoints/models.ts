import { logEventFromContext } from 'corsair/core';
import { makeMiniMaxRequest } from '../client';
import { resolveMiniMaxBaseUrls } from '../config';
import type { MiniMaxEndpoints } from '../index';
import type { ListModelsResponse } from '../schema/models';

export const list: MiniMaxEndpoints['modelsList'] = async (ctx) => {
	const { openaiBaseUrl } = resolveMiniMaxBaseUrls(ctx.options);
	const result = await makeMiniMaxRequest<ListModelsResponse>(openaiBaseUrl, 'models', ctx.key, { method: 'GET' });

	await logEventFromContext(ctx, 'minimax.models.list', {}, 'completed');
	return result;
};