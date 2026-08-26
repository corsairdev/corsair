import { logEventFromContext } from 'corsair/core';
import type { VoEndpoints } from '..';
import { makeVoRequest } from '../client';
import type { VoEndpointOutputs } from './types';

export const get: VoEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeVoRequest<VoEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'vo.example.get', { ...input }, 'completed');
	return response;
};
