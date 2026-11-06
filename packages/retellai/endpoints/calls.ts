import { logEventFromContext } from 'corsair/core';
import { makeRetellRequest } from '../client';
import type { RetellEndpoints } from '../index';
import { cacheCall } from './persist';
import { parseEndpointInput } from './shared';
import type { RetellEndpointOutputs } from './types';
import {
	RetellEndpointInputSchemas,
	RetellEndpointOutputSchemas,
} from './types';

export const list: RetellEndpoints['callsList'] = async (ctx, rawInput) => {
	const input = parseEndpointInput(
		RetellEndpointInputSchemas.callsList,
		rawInput,
	);
	const response = await makeRetellRequest<RetellEndpointOutputs['callsList']>(
		'/v3/list-calls',
		ctx.key,
		{
			method: 'POST',
			body: {
				filter_criteria: input.filterCriteria,
				limit: input.limit,
				pagination_key: input.paginationKey,
				sort_order: input.sortOrder,
				include_total: input.includeTotal,
			},
		},
	);
	const parsed = RetellEndpointOutputSchemas.callsList.parse(response);
	await logEventFromContext(
		ctx,
		'retellai.api.calls.list',
		{ count: parsed.items.length },
		'completed',
	);
	return parsed;
};

export const get: RetellEndpoints['callsGet'] = async (ctx, rawInput) => {
	const input = parseEndpointInput(
		RetellEndpointInputSchemas.callsGet,
		rawInput,
	);
	const response = await makeRetellRequest<RetellEndpointOutputs['callsGet']>(
		`/v2/get-call/${encodeURIComponent(input.id)}`,
		ctx.key,
		{ method: 'GET' },
	);
	const parsed = RetellEndpointOutputSchemas.callsGet.parse(response);
	await cacheCall(ctx.db?.calls, parsed);
	await logEventFromContext(
		ctx,
		'retellai.api.calls.get',
		{ callId: input.id },
		'completed',
	);
	return parsed;
};
