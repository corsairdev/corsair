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

export const list: TimelyEndpoints['accountsList'] = async (ctx, input) => {
	const parsedInput = TimelyEndpointInputSchemas.accountsList.parse(
		input ?? {},
	);
	const query: Record<string, unknown> = {
		page: parsedInput.page,
		per_page: parsedInput.perPage ?? parsedInput.per_page,
	};
	const response = await makeTimelyRequest<
		TimelyEndpointOutputs['accountsList']
	>('/accounts', ctx.key, { method: 'GET', query });
	const parsedResponse =
		TimelyEndpointOutputSchemas.accountsList.parse(response);
	await logEventFromContext(
		ctx,
		'timely.accounts.list',
		{ ...parsedInput },
		'completed',
	);
	return parsedResponse;
};

export const get: TimelyEndpoints['accountsGet'] = async (ctx, input) => {
	const parsedInput = TimelyEndpointInputSchemas.accountsGet.parse(input);
	const response = await makeTimelyRequest<
		TimelyEndpointOutputs['accountsGet']
	>(`/accounts/${idOf(parsedInput.id)}`, ctx.key, { method: 'GET' });
	const parsedResponse =
		TimelyEndpointOutputSchemas.accountsGet.parse(response);
	await logEventFromContext(
		ctx,
		'timely.accounts.get',
		{ ...parsedInput },
		'completed',
	);
	return parsedResponse;
};
