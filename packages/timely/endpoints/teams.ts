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

export const list: TimelyEndpoints['teamsList'] = async (ctx, input) => {
	const parsedInput = TimelyEndpointInputSchemas.teamsList.parse(input ?? {});
	const accountId = accountIdOf(parsedInput);
	const query: Record<string, unknown> = {
		page: parsedInput.page,
		per_page: parsedInput.perPage ?? parsedInput.per_page,
	};
	const response = await makeTimelyRequest<TimelyEndpointOutputs['teamsList']>(
		`/${accountId}/teams`,
		ctx.key,
		{ method: 'GET', query },
	);
	const parsedResponse = TimelyEndpointOutputSchemas.teamsList.parse(response);
	await logEventFromContext(
		ctx,
		'timely.teams.list',
		{ ...parsedInput },
		'completed',
	);
	return parsedResponse;
};

export const get: TimelyEndpoints['teamsGet'] = async (ctx, input) => {
	const parsedInput = TimelyEndpointInputSchemas.teamsGet.parse(input);
	const accountId = accountIdOf(parsedInput);
	const response = await makeTimelyRequest<TimelyEndpointOutputs['teamsGet']>(
		`/${accountId}/teams/${idOf(parsedInput.id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsedResponse = TimelyEndpointOutputSchemas.teamsGet.parse(response);
	await logEventFromContext(
		ctx,
		'timely.teams.get',
		{ ...parsedInput },
		'completed',
	);
	return parsedResponse;
};
