import { logEventFromContext } from 'corsair/core';
import type { ConvoloAiEndpoints } from '..';
import type { ConvoloAiEndpointOutputs } from './types';
import { makeConvoloAiRequest } from '../client';

export const get: ConvoloAiEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeConvoloAiRequest<ConvoloAiEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'convoloai.example.get', { ...input }, 'completed');
	return response;
};
