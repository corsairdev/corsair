import { logEventFromContext } from 'corsair/core';
import type { HunterioEndpoints } from '..';
import { makeHunterioRequest } from '../client';
import type { HunterioEndpointOutputs } from './types';
import {
	HunterioEndpointInputSchemas,
	HunterioEndpointOutputSchemas,
} from './types';

export const get: HunterioEndpoints['usageGet'] = async (ctx, input) => {
	const parsed = HunterioEndpointInputSchemas.usageGet.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['usageGet']
	>('/usage', ctx.key, {
		method: 'GET',
		query: {
			show_overage_requests: parsed.show_overage_requests,
		},
	});

	const parsedResponse = HunterioEndpointOutputSchemas.usageGet.parse(response);

	await logEventFromContext(ctx, 'hunterio.usage.get', {}, 'completed');

	return parsedResponse;
};

export const history: HunterioEndpoints['usageHistory'] = async (
	ctx,
	input,
) => {
	const parsed = HunterioEndpointInputSchemas.usageHistory.parse(input);

	const response = await makeHunterioRequest<
		HunterioEndpointOutputs['usageHistory']
	>('/usage/history', ctx.key, {
		method: 'GET',
		query: {
			offset: parsed.offset,
			limit: parsed.limit,
			start_date: parsed.start_date,
			end_date: parsed.end_date,
			user_id: parsed.user_id,
		},
	});

	const parsedResponse =
		HunterioEndpointOutputSchemas.usageHistory.parse(response);

	await logEventFromContext(ctx, 'hunterio.usage.history', {}, 'completed');

	return parsedResponse;
};
