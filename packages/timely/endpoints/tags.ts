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

export const list: TimelyEndpoints['tagsList'] = async (ctx, input) => {
	const parsedInput = TimelyEndpointInputSchemas.tagsList.parse(input ?? {});
	const accountId = accountIdOf(parsedInput);
	const query: Record<string, unknown> = {
		page: parsedInput.page,
		per_page: parsedInput.perPage ?? parsedInput.per_page,
	};
	const response = await makeTimelyRequest<TimelyEndpointOutputs['tagsList']>(
		`/${accountId}/labels`,
		ctx.key,
		{ method: 'GET', query },
	);
	const parsedResponse = TimelyEndpointOutputSchemas.tagsList.parse(response);
	await logEventFromContext(
		ctx,
		'timely.tags.list',
		{ ...parsedInput },
		'completed',
	);
	return parsedResponse;
};

export const get: TimelyEndpoints['tagsGet'] = async (ctx, input) => {
	const parsedInput = TimelyEndpointInputSchemas.tagsGet.parse(input);
	const accountId = accountIdOf(parsedInput);
	const response = await makeTimelyRequest<TimelyEndpointOutputs['tagsGet']>(
		`/${accountId}/labels/${idOf(parsedInput.id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsedResponse = TimelyEndpointOutputSchemas.tagsGet.parse(response);
	await logEventFromContext(
		ctx,
		'timely.tags.get',
		{ ...parsedInput },
		'completed',
	);
	return parsedResponse;
};
