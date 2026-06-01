import { logEventFromContext } from 'corsair/core';
import type { BitwardenEndpoints } from '..';
import { makeBitwardenRequest } from '../client';
import type { BitwardenEndpointOutputs } from './types';

export const list: BitwardenEndpoints['collectionsList'] = async (
	ctx,
	input,
) => {
	const response = await makeBitwardenRequest<
		BitwardenEndpointOutputs['collectionsList']
	>(`/organizations/${input.organizationId}/collections`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'bitwarden.collections.list',
		input,
		'completed',
	);
	return response;
};

export const get: BitwardenEndpoints['collectionsGet'] = async (ctx, input) => {
	const response = await makeBitwardenRequest<
		BitwardenEndpointOutputs['collectionsGet']
	>(`/organizations/${input.organizationId}/collections/${input.id}`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(
		ctx,
		'bitwarden.collections.get',
		input,
		'completed',
	);
	return response;
};
