import { logEventFromContext } from 'corsair/core';
import type { FaradayEndpoints } from '..';
import type { FaradayEndpointOutputs } from './types';
import { makeFaradayRequest } from '../client';

export const getAccounts: FaradayEndpoints['getAccounts'] = async (ctx, input) => {
	if (input.ids && input.ids.length > 100) {
		throw new Error('Maximum of 100 IDs allowed');
	}

	const response = await makeFaradayRequest<FaradayEndpointOutputs['getAccounts']>(
		'accounts',
		ctx.key,
		{ method: 'GET', query: { ids: input.ids } },
	);

	await logEventFromContext(ctx, 'faraday.accounts.getAccounts', { ...input }, 'completed');
	return response;
};
