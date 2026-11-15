import { logEventFromContext } from 'corsair/core';
import { makeHiggsfieldRequest } from '../client';
import type { HiggsfieldEndpoints } from '../index';
import {
	HiggsfieldEndpointInputSchemas,
	HiggsfieldEndpointOutputSchemas,
} from './types';

export const get: HiggsfieldEndpoints['usageGet'] = async (ctx, rawInput) => {
	const input = HiggsfieldEndpointInputSchemas.usageGet.parse(rawInput);
	const response = HiggsfieldEndpointOutputSchemas.usageGet.parse(
		await makeHiggsfieldRequest(ctx.key, '/models/usage', {
			query: {
				start: input.start,
				end: input.end,
				timeframe: input.timeframe,
				bound_to_timeframe: input.boundToTimeframe,
				model: input.models,
				expand: input.byApiKey ? ['time_series', 'auth_method'] : undefined,
				page: input.page,
				limit: input.limit,
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'higgsfield.usage.get',
		{ start: input.start, end: input.end },
		'completed',
	);
	return response;
};
