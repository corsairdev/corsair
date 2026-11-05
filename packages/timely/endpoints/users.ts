import { logEventFromContext } from 'corsair/core';
import type { TimelyEndpoints } from '..';
import { makeTimelyRequest } from '../client';
import type { TimelyEndpointOutputs } from './types';
import {
	TimelyEndpointInputSchemas,
	TimelyEndpointOutputSchemas,
} from './types';

function idOf(v: unknown): string {
	return String(v);
}
function accountIdOf(input: {
	accountId?: unknown;
	account_id?: unknown;
}): string {
	return idOf(input.accountId ?? input.account_id);
}

export const list: TimelyEndpoints['usersList'] = async (ctx, input) => {
	const parsedInput = TimelyEndpointInputSchemas.usersList.parse(input ?? {});
	const accountId = accountIdOf(parsedInput);
	const query: Record<string, unknown> = {
		page: parsedInput.page,
		per_page: parsedInput.perPage ?? parsedInput.per_page,
	};
	const response = await makeTimelyRequest<TimelyEndpointOutputs['usersList']>(
		`/${accountId}/users`,
		ctx.key,
		{ method: 'GET', query },
	);
	const parsedResponse = TimelyEndpointOutputSchemas.usersList.parse(response);
	await logEventFromContext(
		ctx,
		'timely.users.list',
		{ ...parsedInput },
		'completed',
	);
	return parsedResponse;
};

export const get: TimelyEndpoints['usersGet'] = async (ctx, input) => {
	const parsedInput = TimelyEndpointInputSchemas.usersGet.parse(input);
	const accountId = accountIdOf(parsedInput);
	const response = await makeTimelyRequest<TimelyEndpointOutputs['usersGet']>(
		`/${accountId}/users/${idOf(parsedInput.id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsedResponse = TimelyEndpointOutputSchemas.usersGet.parse(response);
	await logEventFromContext(
		ctx,
		'timely.users.get',
		{ ...parsedInput },
		'completed',
	);
	return parsedResponse;
};
