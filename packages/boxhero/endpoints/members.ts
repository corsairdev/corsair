import { logEventFromContext } from 'corsair/core';
import { makeBoxheroRequest } from '../client';
import type { BoxheroEndpoints } from '../index.ts';
import type { BoxheroEndpointOutputs } from './types';

export const listMembers: BoxheroEndpoints['membersList'] = async (
	ctx,
	input,
) => {
	const response = await makeBoxheroRequest<
		BoxheroEndpointOutputs['membersList']
	>('/v1/members', ctx.key, { method: 'GET' });

	await logEventFromContext(ctx, 'boxhero.members.list', input, 'completed');
	return response;
};

export const getMember: BoxheroEndpoints['membersGet'] = async (ctx, input) => {
	const response = await makeBoxheroRequest<
		BoxheroEndpointOutputs['membersGet']
	>(`/v1/members/${input.member_id}`, ctx.key, { method: 'GET' });

	await logEventFromContext(ctx, 'boxhero.members.get', input, 'completed');
	return response;
};
