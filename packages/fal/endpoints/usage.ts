import { logEventFromContext } from 'corsair/core';
import { makeFalRequest } from '../client';
import type { FalEndpoints } from '../index';
import { FalEndpointInputSchemas, FalEndpointOutputSchemas } from './types';

export const get: FalEndpoints['usageGet'] = async (ctx, rawInput) => {
	const input = FalEndpointInputSchemas.usageGet.parse(rawInput);
	const response = FalEndpointOutputSchemas.usageGet.parse(
		await makeFalRequest('api', '/models/usage', ctx.key, {
			method: 'GET',
			query: {
				start: input.start,
				end: input.end,
				endpoint_id: input.endpointIds,
				timeframe: input.timeframe,
				timezone: input.timezone,
				expand: input.expand,
				limit: input.limit,
				cursor: input.cursor,
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'fal.usage.get',
		{ start: input.start, end: input.end },
		'completed',
	);
	return response;
};

export const billingEvents: FalEndpoints['usageBillingEvents'] = async (
	ctx,
	rawInput,
) => {
	const input = FalEndpointInputSchemas.usageBillingEvents.parse(rawInput);
	const response = FalEndpointOutputSchemas.usageBillingEvents.parse(
		await makeFalRequest('api', '/models/billing-events', ctx.key, {
			method: 'GET',
			query: {
				start: input.start,
				end: input.end,
				endpoint_id: input.endpointIds,
				request_id: input.requestIds,
				limit: input.limit,
				cursor: input.cursor,
			},
		}),
	);
	await logEventFromContext(
		ctx,
		'fal.usage.billingEvents',
		{ start: input.start, end: input.end },
		'completed',
	);
	return response;
};
