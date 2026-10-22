import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { persistUsers } from '../persistence';
import type { DnsfilterEndpointOutputs } from './types';

// Get a current user - GET /v1/current_user
export const currentUsersGet: DnsfilterEndpoints['currentUsersGet'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['currentUsersGet']
	>('/v1/current_user', ctx.key, {
		method: 'GET',
	});
	await persistUsers(ctx, response);
	await logEventFromContext(
		ctx,
		'dnsfilter.currentUsers.get',
		input ?? {},
		'completed',
	);
	return response;
};

// Update a current user - PATCH /v1/current_user
export const currentUsersUpdate: DnsfilterEndpoints['currentUsersUpdate'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['currentUsersUpdate']
		>('/v1/current_user', ctx.key, {
			method: 'PATCH',
			body: {
				user: input.user,
			},
		});
		await persistUsers(ctx, response);
		await logEventFromContext(
			ctx,
			'dnsfilter.currentUsers.update',
			input ?? {},
			'completed',
		);
		return response;
	};
