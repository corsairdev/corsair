import { logEventFromContext } from 'corsair/core';
import type { BitwardenEndpoints } from '..';
import { makeBitwardenRequest } from '../client';
import type { BitwardenEndpointOutputs } from './types';

export const list: BitwardenEndpoints['membersList'] = async (ctx, input) => {
	const response = await makeBitwardenRequest<
		BitwardenEndpointOutputs['membersList']
	>(`/organizations/${input.organizationId}/members`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(ctx, 'bitwarden.members.list', input, 'completed');
	return response;
};

export const get: BitwardenEndpoints['membersGet'] = async (ctx, input) => {
	const response = await makeBitwardenRequest<
		BitwardenEndpointOutputs['membersGet']
	>(`/organizations/${input.organizationId}/members/${input.id}`, ctx.key, {
		method: 'GET',
	});
	await logEventFromContext(ctx, 'bitwarden.members.get', input, 'completed');
	return response;
};
