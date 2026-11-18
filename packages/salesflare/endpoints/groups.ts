import { logEventFromContext } from 'corsair/core';
import type { SalesflareEndpoints } from '..';
import { makeSalesflareRequest } from '../client';
import { salesflarePathParameter } from './path';
import type { SalesflareEndpointOutputs } from './types';

export const listGroups: SalesflareEndpoints['listGroups'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['listGroups']
	>(ctx, '/groups', { method: 'GET' });
	await logEventFromContext(
		ctx,
		'salesflare.groups.listGroups',
		input,
		'completed',
	);
	return response;
};

export const retrieveGroup: SalesflareEndpoints['retrieveGroup'] = async (
	ctx,
	input,
) => {
	const response = await makeSalesflareRequest<
		SalesflareEndpointOutputs['retrieveGroup']
	>(ctx, salesflarePathParameter('/groups/{id}', 'id', input.id), {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'salesflare.groups.retrieveGroup',
		input,
		'completed',
	);
	return response;
};
