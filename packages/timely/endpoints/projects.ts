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

export const list: TimelyEndpoints['projectsList'] = async (ctx, input) => {
	const parsedInput = TimelyEndpointInputSchemas.projectsList.parse(
		input ?? {},
	);
	const accountId = accountIdOf(parsedInput);
	const query: Record<string, unknown> = {
		page: parsedInput.page,
		per_page: parsedInput.perPage ?? parsedInput.per_page,
	};
	const response = await makeTimelyRequest<
		TimelyEndpointOutputs['projectsList']
	>(`/${accountId}/projects`, ctx.key, { method: 'GET', query });
	const parsedResponse =
		TimelyEndpointOutputSchemas.projectsList.parse(response);
	await logEventFromContext(
		ctx,
		'timely.projects.list',
		{ ...parsedInput },
		'completed',
	);
	return parsedResponse;
};

export const get: TimelyEndpoints['projectsGet'] = async (ctx, input) => {
	const parsedInput = TimelyEndpointInputSchemas.projectsGet.parse(input);
	const accountId = accountIdOf(parsedInput);
	const response = await makeTimelyRequest<
		TimelyEndpointOutputs['projectsGet']
	>(`/${accountId}/projects/${idOf(parsedInput.id)}`, ctx.key, {
		method: 'GET',
	});
	const parsedResponse =
		TimelyEndpointOutputSchemas.projectsGet.parse(response);
	await logEventFromContext(
		ctx,
		'timely.projects.get',
		{ ...parsedInput },
		'completed',
	);
	return parsedResponse;
};
