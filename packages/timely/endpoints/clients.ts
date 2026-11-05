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

export const list: TimelyEndpoints['clientsList'] = async (ctx, input) => {
	const parsedInput = TimelyEndpointInputSchemas.clientsList.parse(input ?? {});
	const accountId = accountIdOf(parsedInput);
	const query: Record<string, unknown> = {
		page: parsedInput.page,
		per_page: parsedInput.perPage ?? parsedInput.per_page,
	};
	const response = await makeTimelyRequest<
		TimelyEndpointOutputs['clientsList']
	>(`/${accountId}/clients`, ctx.key, { method: 'GET', query });
	const parsedResponse =
		TimelyEndpointOutputSchemas.clientsList.parse(response);
	await logEventFromContext(
		ctx,
		'timely.clients.list',
		{ ...parsedInput },
		'completed',
	);
	return parsedResponse;
};

export const get: TimelyEndpoints['clientsGet'] = async (ctx, input) => {
	const parsedInput = TimelyEndpointInputSchemas.clientsGet.parse(input);
	const accountId = accountIdOf(parsedInput);
	const response = await makeTimelyRequest<TimelyEndpointOutputs['clientsGet']>(
		`/${accountId}/clients/${idOf(parsedInput.id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsedResponse = TimelyEndpointOutputSchemas.clientsGet.parse(response);
	await logEventFromContext(
		ctx,
		'timely.clients.get',
		{ ...parsedInput },
		'completed',
	);
	return parsedResponse;
};
