import { logEventFromContext } from 'corsair/core';
import type { SalesflareEndpoints } from '..';
import { makeSalesflareRequest } from '../client';
import type { SalesflareEndpointOutputs } from './types';

export const listPersons: SalesflareEndpoints['listPersons'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['listPersons']
	>(ctx, '/persons', { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'salesflare.persons.listPersons',
		input,
		'completed',
	);
	return response;
};
