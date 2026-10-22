import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { persistUsers } from '../persistence';
import { redactSensitive } from '../redact';
import type { DnsfilterEndpointOutputs } from './types';
import {
	DnsfilterEndpointInputSchemas,
	DnsfilterEndpointOutputSchemas,
} from './types';

// Get a current user - GET /v1/current_user
export const currentUsersGet: DnsfilterEndpoints['currentUsersGet'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.currentUsersGet.parse(
		input ?? {},
	);
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['currentUsersGet']
	>('/v1/current_user', ctx.key, {
		method: 'GET',
	});
	const result = DnsfilterEndpointOutputSchemas.currentUsersGet.parse(response);
	await persistUsers(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.currentUsers.get',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Update a current user - PATCH /v1/current_user
export const currentUsersUpdate: DnsfilterEndpoints['currentUsersUpdate'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.currentUsersUpdate.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['currentUsersUpdate']
		>('/v1/current_user', ctx.key, {
			method: 'PATCH',
			body: {
				user: values.user,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.currentUsersUpdate.parse(response);
		await persistUsers(ctx, result);
		await logEventFromContext(
			ctx,
			'dnsfilter.currentUsers.update',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
