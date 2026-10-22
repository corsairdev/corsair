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

// List users - GET /v1/users
export const usersList: DnsfilterEndpoints['usersList'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.usersList.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['usersList']
	>('/v1/users', ctx.key, {
		method: 'GET',
		query: {
			page: values.page,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.usersList.parse(response);
	await persistUsers(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.users.list',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// List all users - GET /v1/users/all
export const usersListAll: DnsfilterEndpoints['usersListAll'] = async (
	ctx,
	input,
) => {
	const values = DnsfilterEndpointInputSchemas.usersListAll.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['usersListAll']
	>('/v1/users/all', ctx.key, {
		method: 'GET',
		query: {
			page: values.page,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.usersListAll.parse(response);
	await persistUsers(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.users.listAll',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Get a user - GET /v1/users/{id}
export const usersGet: DnsfilterEndpoints['usersGet'] = async (ctx, input) => {
	const values = DnsfilterEndpointInputSchemas.usersGet.parse(input ?? {});
	const response = await makeDnsfilterRequest<
		DnsfilterEndpointOutputs['usersGet']
	>('/v1/users/{id}', ctx.key, {
		method: 'GET',
		path: {
			id: values.id,
		},
	});
	const result = DnsfilterEndpointOutputSchemas.usersGet.parse(response);
	await persistUsers(ctx, result);
	await logEventFromContext(
		ctx,
		'dnsfilter.users.get',
		redactSensitive(values),
		'completed',
	);
	return result;
};

// Change password for users - PATCH /v1/users/change_password
export const usersChangePassword: DnsfilterEndpoints['usersChangePassword'] =
	async (ctx, input) => {
		const values = DnsfilterEndpointInputSchemas.usersChangePassword.parse(
			input ?? {},
		);
		const response = await makeDnsfilterRequest<
			DnsfilterEndpointOutputs['usersChangePassword']
		>('/v1/users/change_password', ctx.key, {
			method: 'PATCH',
			body: {
				new_password: values.new_password,
			},
		});
		const result =
			DnsfilterEndpointOutputSchemas.usersChangePassword.parse(response);
		await logEventFromContext(
			ctx,
			'dnsfilter.users.changePassword',
			redactSensitive(values),
			'completed',
		);
		return result;
	};
