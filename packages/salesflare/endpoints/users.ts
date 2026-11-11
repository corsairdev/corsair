import { logEventFromContext } from 'corsair/core';
import type { SalesflareEndpoints } from '..';
import { makeSalesflareRequest } from '../client';
import { salesflarePathParameter } from './path';
import type { SalesflareEndpointOutputs } from './types';

export const listUsers: SalesflareEndpoints['listUsers'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['listUsers']
	>(ctx, '/users', { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'salesflare.users.listUsers',
		input,
		'completed',
	);
	return response;
};

export const retrieveUser: SalesflareEndpoints['retrieveUser'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['retrieveUser']
	>(ctx, salesflarePathParameter('/users/{id}', 'id', input.id), {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'salesflare.users.retrieveUser',
		input,
		'completed',
	);
	return response;
};
