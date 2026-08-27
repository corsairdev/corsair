import { logEventFromContext } from 'corsair/core';
import type { FaradayEndpoints } from '..';
import type { FaradayEndpointOutputs } from './types';
import { makeFaradayRequest } from '../client';

export const getAccounts: FaradayEndpoints['getAccounts'] = async (ctx, input) => {
	const response = await makeFaradayRequest<FaradayEndpointOutputs['getAccounts']>(
		'accounts',
		ctx.key,
		{ method: 'GET', query: { ids: input.ids?.join(',') } },
	);

	await logEventFromContext(ctx, 'faraday.accounts.getAccounts', { ...input }, 'completed');
	return response;
};
