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

export const list: TimelyEndpoints['reportsList'] = async (ctx, input) => {
	const parsedInput = TimelyEndpointInputSchemas.reportsList.parse(input ?? {});
	const accountId = accountIdOf(parsedInput);
	const query: Record<string, unknown> = {
		page: parsedInput.page,
		per_page: parsedInput.perPage ?? parsedInput.per_page,
	};
	const response = await makeTimelyRequest<
		TimelyEndpointOutputs['reportsList']
	>(`/${accountId}/reports`, ctx.key, { method: 'GET', query });
	const parsedResponse =
		TimelyEndpointOutputSchemas.reportsList.parse(response);
	await logEventFromContext(
		ctx,
		'timely.reports.list',
		{ ...parsedInput },
		'completed',
	);
	return parsedResponse;
};

export const get: TimelyEndpoints['reportsGet'] = async (ctx, input) => {
	const parsedInput = TimelyEndpointInputSchemas.reportsGet.parse(input);
	const accountId = accountIdOf(parsedInput);
	const response = await makeTimelyRequest<TimelyEndpointOutputs['reportsGet']>(
		`/${accountId}/reports/${idOf(parsedInput.id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsedResponse = TimelyEndpointOutputSchemas.reportsGet.parse(response);
	await logEventFromContext(
		ctx,
		'timely.reports.get',
		{ ...parsedInput },
		'completed',
	);
	return parsedResponse;
};
