import { logEventFromContext } from 'corsair/core';
import type { LapostaEndpoints } from '..';
import type { LapostaEndpointOutputs } from './types';
import { makeLapostaRequest } from '../client';

export const get: LapostaEndpoints['exampleGet'] = async (ctx, input) => {
	const response = await makeLapostaRequest<LapostaEndpointOutputs['exampleGet']>(
		`example/${input.id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(ctx, 'laposta.example.get', { ...input }, 'completed');
	return response;
};
