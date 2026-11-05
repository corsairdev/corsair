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

export const list: TimelyEndpoints['timeEntriesList'] = async (ctx, input) => {
	const parsedInput = TimelyEndpointInputSchemas.timeEntriesList.parse(
		input ?? {},
	);
	const accountId = accountIdOf(parsedInput);
	const query: Record<string, unknown> = {
		page: parsedInput.page,
		per_page: parsedInput.perPage ?? parsedInput.per_page,
	};
	const response = await makeTimelyRequest<
		TimelyEndpointOutputs['timeEntriesList']
	>(`/${accountId}/events`, ctx.key, { method: 'GET', query });
	const parsedResponse =
		TimelyEndpointOutputSchemas.timeEntriesList.parse(response);
	await logEventFromContext(
		ctx,
		'timely.timeEntries.list',
		{ ...parsedInput },
		'completed',
	);
	return parsedResponse;
};

export const get: TimelyEndpoints['timeEntriesGet'] = async (ctx, input) => {
	const parsedInput = TimelyEndpointInputSchemas.timeEntriesGet.parse(input);
	const accountId = accountIdOf(parsedInput);
	const response = await makeTimelyRequest<
		TimelyEndpointOutputs['timeEntriesGet']
	>(`/${accountId}/events/${idOf(parsedInput.id)}`, ctx.key, { method: 'GET' });
	const parsedResponse =
		TimelyEndpointOutputSchemas.timeEntriesGet.parse(response);
	await logEventFromContext(
		ctx,
		'timely.timeEntries.get',
		{ ...parsedInput },
		'completed',
	);
	return parsedResponse;
};
