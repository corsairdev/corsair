import { logEventFromContext } from 'corsair/core';
import type { DnsfilterEndpoints } from '..';
import { makeDnsfilterRequest } from '../client';
import { persistUsers } from '../persistence';
import type { DnsfilterEndpointOutputs } from './types';

// List users - GET /v1/users
export const usersList: DnsfilterEndpoints['usersList'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['usersList']
	>('/v1/users', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
		},
	});
	await persistUsers(ctx, response);
	await logEventFromContext(
		ctx,
		'dnsfilter.users.list',
		input ?? {},
		'completed',
	);
	return response;
};

// List all users - GET /v1/users/all
export const usersListAll: DnsfilterEndpoints['usersListAll'] = async (
	ctx,
	input,
) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['usersListAll']
	>('/v1/users/all', ctx.key, {
		method: 'GET',
		query: {
			page: input.page,
		},
	});
	await persistUsers(ctx, response);
	await logEventFromContext(
		ctx,
		'dnsfilter.users.listAll',
		input ?? {},
		'completed',
	);
	return response;
};

// Get an user - GET /v1/users/{id}
export const usersGet: DnsfilterEndpoints['usersGet'] = async (ctx, input) => {
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['usersGet']
	>('/v1/users/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: input.id,
		},
	});
	await persistUsers(ctx, response);
	await logEventFromContext(
		ctx,
		'dnsfilter.users.get',
		input ?? {},
		'completed',
	);
	return response;
};

// Change password for users - PATCH /v1/users/change_password
export const usersChangePassword: DnsfilterEndpoints['usersChangePassword'] =
	async (ctx, input) => {
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['usersChangePassword']
		>('/v1/users/change_password', ctx.key, {
			method: 'PATCH',
			body: {
				new_password: input.new_password,
			},
		});
		await logEventFromContext(
			ctx,
			'dnsfilter.users.changePassword',
			input ?? {},
			'completed',
		);
		return response;
	};
