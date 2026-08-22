import { logEventFromContext } from 'corsair/core';
import { makeCrowterminalRequest } from '../client';
import type { CrowterminalEndpoints } from '../index';
import type { CrowterminalEndpointOutputs } from './types';

export const get: CrowterminalEndpoints['statusGet'] = async (ctx, input) => {
	const response = await makeCrowterminalRequest<
		CrowterminalEndpointOutputs['statusGet']
	>('/api/agent/status', ctx.key);

	await logEventFromContext(
		ctx,
		'crowterminal.status.get',
		{ ...input },
		'completed',
	);
	return response;
};
