import { logEventFromContext } from 'corsair/core';
import type { SalesflareEndpoints } from '..';
import { makeSalesflareRequest } from '../client';
import type { SalesflareEndpointOutputs } from './types';

export const listCurrencies: SalesflareEndpoints['listCurrencies'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['listCurrencies']
	>(ctx, '/currencies', { method: 'GET' });
	await logEventFromContext(
		ctx,
		'salesflare.currencies.listCurrencies',
		input,
		'completed',
	);
	return response;
};
